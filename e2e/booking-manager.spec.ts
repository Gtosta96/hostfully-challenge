import { test, expect, Page } from '@playwright/test';
import { success } from 'zod';

const selectors = {
  heading: (page: Page) => page.getByRole('heading', { name: 'Booking Manager', level: 1 }),
  createBookingButton: (page: Page) =>
    page
      .getByRole('button')
      .filter({ hasText: /New Booking|Create Your First Booking/ })
      .first(),
  newBookingButton: (page: Page) => page.getByRole('button', { name: /New Booking/i }),
  editButton: (page: Page) => page.getByRole('button', { name: /Edit Booking/i }),
  deleteButton: (page: Page) => page.getByRole('button', { name: /Delete Booking/i }),
  submitButton: (page: Page) => page.getByRole('button', { name: /Create|Update/i }),
  confirmButton: (page: Page) => page.getByRole('button', { name: /Confirm|Delete|Yes/i }),
  guestNameInput: (page: Page) => page.getByLabel(/Guest Name/i),
  startDateInput: (page: Page) => page.getByLabel(/Start Date/i),
  endDateInput: (page: Page) => page.getByLabel(/End Date/i),
  numberOfGuestsInput: (page: Page) => page.getByLabel(/Number of Guests/i),
  notesInput: (page: Page) => page.getByLabel(/Notes|Additional Notes/i),
  dayButton: (page: Page, day: number) =>
    page.locator(`button[name="day"]:has-text("${day}")`).first(),
  noBookingsHeading: (page: Page) =>
    page.getByRole('heading', { name: 'No bookings yet', level: 2 }),
  errorMessage: (page: Page) => page.getByText(/error|required|invalid|must/i),
  overlapErrorMessage: (page: Page) => page.getByText(/overlap|conflict|already booked/i),
  successMessage: (page: Page) => page.getByText(/success|created|updated|deleted/i),
};

const actions = {
  async selectDate(
    page: Page,
    input: ReturnType<typeof selectors.startDateInput> | ReturnType<typeof selectors.endDateInput>,
    daysFromNow: number
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + daysFromNow);
    await input.click();
    await selectors.dayButton(page, startDate.getDate()).click();
  },
  async fillBookingForm(
    page: Page,
    data: {
      guestName: string;
      daysFromNowStart: number;
      daysFromNowEnd: number;
      numberOfGuests: string;
      notes?: string;
    }
  ) {
    await selectors.guestNameInput(page).fill(data.guestName);
    await this.selectDate(page, selectors.startDateInput(page), data.daysFromNowStart);
    await this.selectDate(page, selectors.endDateInput(page), data.daysFromNowEnd);

    await selectors.numberOfGuestsInput(page).fill(data.numberOfGuests);
    if (data.notes) {
      await selectors.notesInput(page).fill(data.notes);
    }
  },

  async createBooking(
    page: Page,
    data: {
      guestName: string;
      daysFromNowStart: number;
      daysFromNowEnd: number;
      numberOfGuests: string;
      notes?: string;
    }
  ) {
    await selectors.createBookingButton(page).click();
    await this.fillBookingForm(page, data);
    await selectors.submitButton(page).click();
    await expect(selectors.successMessage(page)).toBeVisible({ timeout: 5000 });
  },

  async waitForSuccess(page: Page, message?: string) {
    if (message) {
      await expect(page.getByText(message)).toBeVisible({ timeout: 5000 });
    } else {
      await expect(selectors.successMessage(page)).toBeVisible({
        timeout: 5000,
      });
    }
  },
};

test.describe('Booking Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test.describe('1. Main Booking Flow', () => {
    test('1.1. View bookings list', async ({ page }) => {
      await expect(page).toHaveTitle('Hostfully Challenge');
      await expect(selectors.heading(page)).toBeVisible();

      const noBookingsHeading = selectors.noBookingsHeading(page);
      const hasNoBookings = await noBookingsHeading.isVisible().catch(() => false);

      if (hasNoBookings) {
        await expect(noBookingsHeading).toBeVisible();
        await expect(page.getByText('Get started by creating your first booking')).toBeVisible();
      }
    });

    for (const viewport of [
      { name: 'Mobile', size: { width: 375, height: 667 } },
      { name: 'Tablet', size: { width: 768, height: 1024 } },
      { name: 'Desktop', size: { width: 1280, height: 800 } },
    ]) {
      test(`1.2. Create new booking (${viewport.name})`, async ({ page }) => {
        await page.setViewportSize(viewport.size);
        await actions.createBooking(page, {
          guestName: 'John Doe',
          daysFromNowStart: 1,
          daysFromNowEnd: 3,
          numberOfGuests: '2',
          notes: 'Test booking notes',
        });

        await expect(page.getByText('John Doe')).toBeVisible();
      });
    }

    test('1.3. Edit existing booking', async ({ page }) => {
      await actions.createBooking(page, {
        guestName: 'Jane Smith',
        daysFromNowStart: 5,
        daysFromNowEnd: 7,
        numberOfGuests: '3',
      });

      await page.waitForTimeout(1000);
      await selectors.editButton(page).click();

      const nameInput = selectors.guestNameInput(page);
      await nameInput.clear();
      await nameInput.fill('Jane Smith Updated');

      const guestsInput = selectors.numberOfGuestsInput(page);
      await guestsInput.clear();
      await guestsInput.fill('5');
      await selectors.submitButton(page).click();
      await expect(page.getByText('Booking updated successfully')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Jane Smith Updated')).toBeVisible();
    });

    test('1.4. Delete booking', async ({ page }) => {
      await actions.createBooking(page, {
        guestName: 'Bob Wilson',
        daysFromNowStart: 10,
        daysFromNowEnd: 12,
        numberOfGuests: '1',
      });

      await page.waitForTimeout(1000);
      await selectors.deleteButton(page).click();
      await selectors.confirmButton(page).click();
      await expect(page.getByText('Booking deleted successfully')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Bob Wilson')).not.toBeVisible();
    });
  });

  test.describe('2. Form Validations', () => {
    test('2.1. Required fields', async ({ page }) => {
      await selectors.createBookingButton(page).click();
      await selectors.submitButton(page).click();

      const errorMessages = await selectors.errorMessage(page).all();
      expect(errorMessages).toHaveLength(3);
      for (const error of errorMessages) {
        await expect(error).toBeVisible();
      }
    });

    test('2.2. Invalid dates - past date', async ({ page }) => {
      await selectors.createBookingButton(page).click();
      await selectors.guestNameInput(page).fill('Test User');
      await selectors.startDateInput(page).click();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const pastDateButton = selectors.dayButton(page, yesterday.getDate());
      const isDisabled = await pastDateButton.getAttribute('disabled');
      expect(isDisabled).not.toBeNull();
    });

    test('2.3. Overlapping bookings', async ({ page }) => {
      await actions.createBooking(page, {
        guestName: 'First Guest',
        daysFromNowStart: 3,
        daysFromNowEnd: 5,
        numberOfGuests: '2',
      });

      await page.waitForTimeout(1000);
      await actions.createBooking(page, {
        guestName: 'Second Guest',
        daysFromNowStart: 2,
        daysFromNowEnd: 6,
        numberOfGuests: '1',
      });
      await expect(selectors.overlapErrorMessage(page)).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe('3. UI and Navigation', () => {
    test('3.1. Responsiveness - Mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(selectors.heading(page)).toBeVisible();
      await expect(selectors.createBookingButton(page)).toBeVisible();
    });

    test('3.1. Responsiveness - Tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(selectors.heading(page)).toBeVisible();
      await expect(selectors.createBookingButton(page)).toBeVisible();
    });

    test('3.2. Navigate to 404 page', async ({ page }) => {
      await page.goto('http://localhost:3000/non-existent-route');

      await expect(page.getByText(/404/i)).toBeVisible();
      await expect(page.getByText(/page not found/i)).toBeVisible();
    });
  });
});
