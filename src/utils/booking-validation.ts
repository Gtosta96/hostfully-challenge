import { startOfDay } from 'date-fns';

import { Booking } from '@/stores/booking-store';

export const validateBookingDates = (startDate: Date, endDate: Date): string | null => {
  const today = startOfDay(new Date());

  if (startDate < today) {
    return 'Start date cannot be in the past';
  }

  if (endDate <= startDate) {
    return 'End date must be after start date';
  }

  return null;
};

export const checkBookingOverlap = (
  bookings: Pick<Booking, 'id' | 'startDate' | 'endDate'>[],
  startDate: Date,
  endDate: Date,
  excludeId?: string
): boolean => {
  return bookings.some(booking => {
    if (excludeId && booking.id === excludeId) {
      return false;
    }

    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);

    return (
      (startDate >= bookingStart && startDate < bookingEnd) ||
      (endDate > bookingStart && endDate <= bookingEnd) ||
      (startDate <= bookingStart && endDate >= bookingEnd)
    );
  });
};
