import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Booking } from '@/stores/booking-store';

import { UpdateBookingDialog } from './update-booking-dialog';

vi.mock('../booking-form/booking-form', () => ({
  BookingForm: ({ booking }: { booking?: unknown }) => (
    <div data-testid="booking-form">{booking ? 'Editing' : 'Creating'}</div>
  ),
}));

vi.mock('@/components/dialog/dialog', () => ({
  Dialog: ({ open, children }: React.PropsWithChildren<{ open: boolean }>) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-title">{children}</div>
  ),
  DialogDescription: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-description">{children}</div>
  ),
}));

const mockBooking = {
  id: '1',
  guestName: 'John Doe',
} as Booking;

describe('UpdateBookingDialog', () => {
  it('renders create dialog when editingBooking is undefined', () => {
    render(<UpdateBookingDialog isOpen={true} onClose={() => {}} />);
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('dialog-title').textContent).toBe('Create New Booking');
    expect(screen.getByTestId('dialog-description').textContent).toContain('Fill in the details');
    expect(screen.getByTestId('booking-form').textContent).toBe('Creating');
  });

  it('renders edit dialog when editingBooking is provided', () => {
    render(<UpdateBookingDialog isOpen={true} onClose={() => {}} editingBooking={mockBooking} />);
    expect(screen.getByTestId('dialog-title').textContent).toBe('Edit Booking');
    expect(screen.getByTestId('dialog-description').textContent).toContain('Update the booking');
    expect(screen.getByTestId('booking-form').textContent).toBe('Editing');
  });

  it('does not render dialog when isOpen is false', () => {
    render(<UpdateBookingDialog isOpen={false} onClose={() => {}} />);
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false');
  });

  it('calls onClose when dialog open state changes', () => {
    const onClose = vi.fn();
    render(<UpdateBookingDialog isOpen={true} onClose={onClose} />);
    onClose();
    expect(onClose).toHaveBeenCalled();
  });
});
