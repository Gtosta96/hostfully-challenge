import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { toast } from 'sonner';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Booking, useBookingStore } from '@/stores/booking-store';

import Root from './root';

vi.mock('sonner');
vi.mock('@/components/header/header', () => ({
  Header: ({ onNewBooking }: { onNewBooking: () => void }) => (
    <header>
      <button onClick={onNewBooking}>New Booking</button>
    </header>
  ),
}));

vi.mock('./components/empty-state/empty-state', () => ({
  EmptyBookings: ({ onCreate }: { onCreate: () => void }) => (
    <div>
      <p>No bookings yet</p>
      <button onClick={onCreate}>Create Your First Booking</button>
    </div>
  ),
}));

vi.mock('./components/booking-card/booking-card', () => ({
  BookingCard: ({
    booking,
    onEdit,
    onDelete,
  }: {
    booking: Booking;
    onEdit: (booking: Booking) => void;
    onDelete: (id: string) => void;
  }) => (
    <div data-testid={`booking-${booking.id}`}>
      <h3>{booking.guestName}</h3>
      <p>{booking.startDate.toISOString()}</p>
      <button onClick={() => onEdit(booking)}>Edit</button>
      <button onClick={() => onDelete(booking.id)}>Delete</button>
    </div>
  ),
}));

vi.mock('./components/update-booking-dialog/update-booking-dialog', () => ({
  UpdateBookingDialog: ({
    isOpen,
    onClose,
    editingBooking,
  }: {
    isOpen: boolean;
    onClose: () => void;
    editingBooking?: Booking;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label={editingBooking ? 'Edit Booking' : 'New Booking'}>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('./components/delete-booking-dialog/delete-booking-dialog', () => ({
  DeleteBookingDialog: ({
    isOpen,
    onOpenChange,
    onConfirmDelete,
  }: {
    isOpen: boolean;
    onOpenChange: () => void;
    onConfirmDelete: () => void;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label="Delete Booking">
        <button onClick={onOpenChange}>Cancel</button>
        <button onClick={onConfirmDelete}>Confirm Delete</button>
      </div>
    ) : null,
}));

describe('Root Component', () => {
  const mockBookings = [
    {
      id: '1',
      guestName: 'John Doe',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-20'),
      numberOfGuests: 2,
      notes: 'Test booking 1',
      createdAt: new Date('2024-12-01'),
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      startDate: new Date('2024-12-10'),
      endDate: new Date('2024-12-12'),
      numberOfGuests: 1,
      notes: 'Test booking 2',
      createdAt: new Date('2024-12-02'),
    },
    {
      id: '3',
      guestName: 'Bob Johnson',
      startDate: new Date('2024-12-25'),
      endDate: new Date('2024-12-30'),
      numberOfGuests: 4,
      notes: 'Test booking 3',
      createdAt: new Date('2024-12-03'),
    },
  ];

  beforeEach(() => {
    // Reset store state before each test
    useBookingStore.setState({ bookings: [] });
    vi.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should display empty state when there are no bookings', () => {
      render(<Root />);

      expect(screen.getByText('No bookings yet')).toBeInTheDocument();
    });

    it('should open new booking dialog when clicking "Create Your First Booking"', async () => {
      const user = userEvent.setup();
      render(<Root />);

      const createButton = screen.getByRole('button', {
        name: /create your first booking/i,
      });
      await user.click(createButton);

      expect(screen.getByRole('dialog', { name: /new booking/i })).toBeInTheDocument();
    });
  });

  describe('Booking List Display', () => {
    it('should display all bookings when they exist', () => {
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should sort bookings by start date in ascending order', () => {
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      const bookingCards = screen.getAllByRole('heading', { level: 3 });

      // Expected order: Jane Smith (Dec 10), John Doe (Dec 15), Bob Johnson (Dec 25)
      expect(bookingCards[0]).toHaveTextContent('Jane Smith');
      expect(bookingCards[1]).toHaveTextContent('John Doe');
      expect(bookingCards[2]).toHaveTextContent('Bob Johnson');
    });

    it('should not display empty state when bookings exist', () => {
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      expect(screen.queryByText('No bookings yet')).not.toBeInTheDocument();
    });
  });

  describe('Create Booking Flow', () => {
    it('should open new booking dialog when clicking header "New Booking" button', async () => {
      const user = userEvent.setup();
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      const newBookingButton = screen.getByRole('button', { name: /new booking/i });
      await user.click(newBookingButton);

      expect(screen.getByRole('dialog', { name: /new booking/i })).toBeInTheDocument();
    });

    it('should close new booking dialog when close is triggered', async () => {
      const user = userEvent.setup();
      render(<Root />);

      // Open dialog
      const newBookingButton = screen.getByRole('button', { name: /new booking/i });
      await user.click(newBookingButton);

      // Close dialog
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(screen.queryByRole('dialog', { name: /new booking/i })).not.toBeInTheDocument();
    });
  });

  describe('Edit Booking Flow', () => {
    it('should open edit dialog with booking data when clicking edit button', async () => {
      const user = userEvent.setup();
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      const bookingCard = screen.getByTestId('booking-1');
      const editButton = within(bookingCard).getByRole('button', { name: /edit/i });

      await user.click(editButton);

      expect(screen.getByRole('dialog', { name: /edit booking/i })).toBeInTheDocument();
    });

    it('should close edit dialog and clear editing state when close is triggered', async () => {
      const user = userEvent.setup();
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      // Open edit dialog
      const bookingCard = screen.getByTestId('booking-1');
      const editButton = within(bookingCard).getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Close dialog
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(screen.queryByRole('dialog', { name: /edit booking/i })).not.toBeInTheDocument();
    });
  });

  describe('Delete Booking Flow', () => {
    it('should open delete confirmation dialog when clicking delete button', async () => {
      const user = userEvent.setup();
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      const bookingCard = screen.getByTestId('booking-1');
      const deleteButton = within(bookingCard).getByRole('button', { name: /delete/i });

      await user.click(deleteButton);

      expect(screen.getByRole('dialog', { name: /delete booking/i })).toBeInTheDocument();
    });

    it('should close delete dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      // Open delete dialog
      const bookingCard = screen.getByTestId('booking-1');
      const deleteButton = within(bookingCard).getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      // Cancel deletion
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByRole('dialog', { name: /delete booking/i })).not.toBeInTheDocument();
    });

    it('should delete booking and show success toast when confirmed', async () => {
      const user = userEvent.setup();
      const deleteBookingSpy = vi.fn();

      useBookingStore.setState({
        bookings: mockBookings,
        deleteBooking: deleteBookingSpy,
      });

      render(<Root />);

      // Open delete dialog
      const bookingCard = screen.getByTestId('booking-1');
      const deleteButton = within(bookingCard).getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /confirm delete/i });
      await user.click(confirmButton);

      expect(deleteBookingSpy).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Booking deleted successfully');
      expect(screen.queryByRole('dialog', { name: /delete booking/i })).not.toBeInTheDocument();
    });
  });

  describe('Dialog State Management', () => {
    it('should not show any dialogs by default', () => {
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should only show one dialog at a time', async () => {
      const user = userEvent.setup();
      useBookingStore.setState({ bookings: mockBookings });
      render(<Root />);

      // Open new booking dialog
      const newBookingButton = screen.getByRole('button', { name: /new booking/i });
      await user.click(newBookingButton);

      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs).toHaveLength(1);
    });
  });
});
