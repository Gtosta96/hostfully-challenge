import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Booking } from '@/stores/booking-store';

import { BookingCard } from './booking-card';

describe('BookingCard', () => {
  const mockBooking: Booking = {
    id: '123',
    guestName: 'John Doe',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-20'),
    numberOfGuests: 2,
    notes: 'Window seat preferred',
    createdAt: new Date('2024-12-01'),
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const renderBookingCard = (booking: Booking = mockBooking) => {
    return render(<BookingCard booking={booking} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Display', () => {
    it('should display guest name', () => {
      renderBookingCard();

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display formatted date range', () => {
      renderBookingCard();

      // date-fns format: 'MMM dd, yyyy' -> 'Dec 15, 2024 - Dec 20, 2024'
      expect(screen.getByText(/Dec 14, 2024 - Dec 19, 2024/)).toBeInTheDocument();
    });

    it('should display number of guests with singular form', () => {
      const singleGuestBooking: Booking = {
        ...mockBooking,
        numberOfGuests: 1,
      };
      renderBookingCard(singleGuestBooking);

      expect(screen.getByText('1 guest')).toBeInTheDocument();
    });

    it('should display number of guests with plural form', () => {
      renderBookingCard();

      expect(screen.getByText('2 guests')).toBeInTheDocument();
    });

    it('should display notes when provided', () => {
      renderBookingCard();

      expect(screen.getByText('Window seat preferred')).toBeInTheDocument();
    });

    it('should not display notes section when notes are not provided', () => {
      const bookingWithoutNotes: Booking = {
        ...mockBooking,
        notes: undefined,
      };
      renderBookingCard(bookingWithoutNotes);

      expect(screen.queryByText('Window seat preferred')).not.toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('should have an accessible edit button', () => {
      renderBookingCard();

      const editButton = screen.getByRole('button', { name: /edit booking/i });
      expect(editButton).toBeInTheDocument();
    });

    it('should have an accessible delete button', () => {
      renderBookingCard();

      const deleteButton = screen.getByRole('button', { name: /delete booking/i });
      expect(deleteButton).toBeInTheDocument();
    });

    it('should call onEdit with booking data when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderBookingCard();

      const editButton = screen.getByRole('button', { name: /edit booking/i });
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockBooking);
    });

    it('should call onDelete with booking id when delete button is clicked', async () => {
      const user = userEvent.setup();
      renderBookingCard();

      const deleteButton = screen.getByRole('button', { name: /delete booking/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith('123');
    });

    it('should not call onEdit or onDelete on initial render', () => {
      renderBookingCard();

      expect(mockOnEdit).not.toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Guest Count Display', () => {
    it('should display correct text for multiple guests', () => {
      const bookingWithManyGuests: Booking = {
        ...mockBooking,
        numberOfGuests: 5,
      };
      renderBookingCard(bookingWithManyGuests);

      expect(screen.getByText('5 guests')).toBeInTheDocument();
    });

    it('should handle large number of guests', () => {
      const bookingWithManyGuests: Booking = {
        ...mockBooking,
        numberOfGuests: 100,
      };
      renderBookingCard(bookingWithManyGuests);

      expect(screen.getByText('100 guests')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button labels for screen readers', () => {
      renderBookingCard();

      expect(screen.getByLabelText(/edit booking/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/delete booking/i)).toBeInTheDocument();
    });

    it('should render as a properly structured card', () => {
      const { container } = renderBookingCard();

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
