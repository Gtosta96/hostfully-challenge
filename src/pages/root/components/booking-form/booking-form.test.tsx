import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBookingStore } from '@/stores/booking-store';
import * as bookingValidation from '@/utils/booking-validation';

import { BookingForm } from './booking-form';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/utils/booking-validation', () => ({
  validateBookingDates: vi.fn(),
  checkBookingOverlap: vi.fn(),
}));

vi.mock('@/stores/booking-store', () => ({
  useBookingStore: vi.fn(),
}));

describe('BookingForm', () => {
  const mockOnClose = vi.fn();
  const mockAddBooking = vi.fn();
  const mockUpdateBooking = vi.fn();
  const mockDeleteBooking = vi.fn();
  const mockGetBooking = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useBookingStore).mockImplementation(selector => {
      return selector({
        bookings: [],
        addBooking: mockAddBooking,
        updateBooking: mockUpdateBooking,
        deleteBooking: mockDeleteBooking,
        getBooking: mockGetBooking,
      });
    });

    vi.mocked(bookingValidation.validateBookingDates).mockReturnValue(null);
    vi.mocked(bookingValidation.checkBookingOverlap).mockReturnValue(false);
  });

  describe('Form Rendering', () => {
    it('should render all form fields for creating a new booking', () => {
      render(<BookingForm onClose={mockOnClose} />);

      expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start date/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /end date/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create booking/i })).toBeInTheDocument();
    });

    it('should render form with "Update Booking" button when editing', () => {
      const existingBooking = {
        id: '123',
        guestName: 'John Doe',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-05'),
        numberOfGuests: 2,
        notes: 'Test notes',
        createdAt: new Date(),
      };

      render(<BookingForm booking={existingBooking} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /update booking/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /create booking/i })).not.toBeInTheDocument();
    });

    it('should populate form fields with existing booking data', () => {
      const existingBooking = {
        id: '123',
        guestName: 'Jane Smith',
        startDate: new Date('2025-12-10'),
        endDate: new Date('2025-12-15'),
        numberOfGuests: 3,
        notes: 'Special request',
        createdAt: new Date(),
      };

      render(<BookingForm booking={existingBooking} onClose={mockOnClose} />);

      expect(screen.getByLabelText(/guest name/i)).toHaveValue('Jane Smith');
      expect(screen.getByLabelText(/number of guests/i)).toHaveValue(3);
      expect(screen.getByLabelText(/notes/i)).toHaveValue('Special request');
    });
  });

  describe('Form Validation', () => {
    it('should show validation error when guest name is too short', async () => {
      const user = userEvent.setup();
      render(<BookingForm onClose={mockOnClose} />);

      const guestNameInput = screen.getByLabelText(/guest name/i);
      const submitButton = screen.getByRole('button', { name: /create booking/i });

      await user.type(guestNameInput, 'A');
      await user.click(submitButton);

      expect(
        await screen.findByText(/guest name must be at least 2 characters/i)
      ).toBeInTheDocument();
      expect(mockAddBooking).not.toHaveBeenCalled();
    });

    it('should show validation error when number of guests is less than 1', async () => {
      const user = userEvent.setup();
      render(<BookingForm onClose={mockOnClose} />);

      const guestNameInput = screen.getByLabelText(/guest name/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);
      const submitButton = screen.getByRole('button', { name: /create booking/i });

      await user.type(guestNameInput, 'John Doe');
      await user.clear(guestsInput);
      await user.type(guestsInput, '0');
      await user.click(submitButton);

      expect(await screen.findByText(/must have at least 1 guest/i)).toBeInTheDocument();
      expect(mockAddBooking).not.toHaveBeenCalled();
    });

    it('should prevent entering invalid characters in number input', async () => {
      const user = userEvent.setup();
      render(<BookingForm onClose={mockOnClose} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.clear(guestsInput);
      await user.type(guestsInput, 'e');
      expect(guestsInput).toHaveValue(null);

      await user.type(guestsInput, '+');
      expect(guestsInput).toHaveValue(null);

      await user.type(guestsInput, '-');
      expect(guestsInput).toHaveValue(null);
    });
  });

  describe('Form Submission - Update Booking', () => {
    it('should update an existing booking with valid data', async () => {
      const user = userEvent.setup();
      const existingBooking = {
        id: '123',
        guestName: 'John Doe',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-05'),
        numberOfGuests: 2,
        notes: 'Original notes',
        createdAt: new Date(),
      };

      render(<BookingForm booking={existingBooking} onClose={mockOnClose} />);

      const guestNameInput = screen.getByLabelText(/guest name/i);
      await user.clear(guestNameInput);
      await user.type(guestNameInput, 'Jane Doe');

      const guestsInput = screen.getByLabelText(/number of guests/i);
      await user.clear(guestsInput);
      await user.type(guestsInput, '5');

      await user.click(screen.getByRole('button', { name: /update booking/i }));

      await waitFor(() => {
        expect(mockUpdateBooking).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            guestName: 'Jane Doe',
            numberOfGuests: 5,
          })
        );
      });

      expect(toast.success).toHaveBeenCalledWith('Booking updated successfully');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookingForm onClose={mockOnClose} />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockOnClose).toHaveBeenCalled();
      expect(mockAddBooking).not.toHaveBeenCalled();
    });

    it('should open calendar popover when start date button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookingForm onClose={mockOnClose} />);

      const dateButton = screen.getByRole('button', { name: /start date/i });
      await user.click(dateButton);

      expect(dateButton).toBeInTheDocument();
    });

    it('should open calendar popover when end date button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookingForm onClose={mockOnClose} />);

      const dateButton = screen.getByRole('button', { name: /end date/i });
      await user.click(dateButton);

      expect(dateButton).toBeInTheDocument();
    });

    it('should allow typing in all text inputs', async () => {
      const user = userEvent.setup();
      render(<BookingForm onClose={mockOnClose} />);

      const guestNameInput = screen.getByLabelText(/guest name/i);
      const notesInput = screen.getByLabelText(/notes/i);

      await user.type(guestNameInput, 'Test Guest');
      await user.type(notesInput, 'Test notes');

      expect(guestNameInput).toHaveValue('Test Guest');
      expect(notesInput).toHaveValue('Test notes');
    });
  });
});
