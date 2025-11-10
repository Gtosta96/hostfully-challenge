import { describe, it, expect, beforeEach } from 'vitest';

import { useBookingStore } from './booking-store';

describe('useBookingStore', () => {
  beforeEach(() => {
    useBookingStore.setState({ bookings: [] });
  });

  it('should add a booking', () => {
    const bookingData = {
      guestName: 'John Doe',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-05'),
      numberOfGuests: 2,
      notes: 'Test note',
    };
    useBookingStore.getState().addBooking(bookingData);
    const bookings = useBookingStore.getState().bookings;
    expect(bookings.length).toBe(1);
    expect(bookings[0].guestName).toBe('John Doe');
    expect(bookings[0].notes).toBe('Test note');
    expect(bookings[0].id).toBeDefined();
    expect(bookings[0].createdAt).toBeInstanceOf(Date);
  });

  it('should update a booking', () => {
    const bookingData = {
      guestName: 'Jane Doe',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-05'),
      numberOfGuests: 3,
    };
    useBookingStore.getState().addBooking(bookingData);
    const booking = useBookingStore.getState().bookings[0];
    useBookingStore.getState().updateBooking(booking.id, {
      ...bookingData,
      guestName: 'Jane Smith',
      notes: 'Updated note',
    });
    const updated = useBookingStore.getState().bookings[0];
    expect(updated.guestName).toBe('Jane Smith');
    expect(updated.notes).toBe('Updated note');
    expect(updated.id).toBe(booking.id);
  });

  it('should delete a booking', () => {
    const bookingData = {
      guestName: 'Alice',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-05'),
      numberOfGuests: 1,
    };
    useBookingStore.getState().addBooking(bookingData);
    const booking = useBookingStore.getState().bookings[0];
    useBookingStore.getState().deleteBooking(booking.id);
    expect(useBookingStore.getState().bookings.length).toBe(0);
  });

  it('should get a booking by id', () => {
    const bookingData = {
      guestName: 'Bob',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-05'),
      numberOfGuests: 4,
    };
    useBookingStore.getState().addBooking(bookingData);
    const booking = useBookingStore.getState().bookings[0];
    const found = useBookingStore.getState().getBooking(booking.id);
    expect(found).toBeDefined();
    expect(found?.guestName).toBe('Bob');
  });

  it('should return undefined for non-existent booking', () => {
    const found = useBookingStore.getState().getBooking('non-existent-id');
    expect(found).toBeUndefined();
  });

  it('should not update a non-existent booking', () => {
    useBookingStore.getState().updateBooking('fake-id', {
      guestName: 'Nobody',
      startDate: new Date(),
      endDate: new Date(),
      numberOfGuests: 1,
    });
    expect(useBookingStore.getState().bookings.length).toBe(0);
  });

  it('should not delete a non-existent booking', () => {
    useBookingStore.getState().deleteBooking('fake-id');
    expect(useBookingStore.getState().bookings.length).toBe(0);
  });
});
