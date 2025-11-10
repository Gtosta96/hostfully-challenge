import { describe, it, expect } from 'vitest';

import { Booking } from '@/stores/booking-store';

import { validateBookingDates, checkBookingOverlap } from './booking-validation';

describe('validateBookingDates', () => {
  it('returns error if startDate is in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(validateBookingDates(yesterday, tomorrow)).toBe('Start date cannot be in the past');
  });

  it('returns error if endDate is before startDate', () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    expect(validateBookingDates(today, yesterday)).toBe('End date must be after start date');
  });

  it('returns error if endDate is equal to startDate', () => {
    const today = new Date();

    expect(validateBookingDates(today, today)).toBe('End date must be after start date');
  });

  it('returns null for valid dates', () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    expect(validateBookingDates(today, tomorrow)).toBeNull();
  });
});

describe('checkBookingOverlap', () => {
  const bookings: Pick<Booking, 'id' | 'startDate' | 'endDate'>[] = [
    {
      id: '1',
      startDate: new Date('2024-06-10'),
      endDate: new Date('2024-06-15'),
    },
    {
      id: '2',
      startDate: new Date('2024-06-20'),
      endDate: new Date('2024-06-25'),
    },
  ];

  it('returns true if new booking overlaps with existing booking (start inside)', () => {
    const startDate = new Date('2024-06-12');
    const endDate = new Date('2024-06-18');
    expect(checkBookingOverlap(bookings, startDate, endDate)).toBe(true);
  });

  it('returns true if new booking overlaps with existing booking (end inside)', () => {
    const startDate = new Date('2024-06-08');
    const endDate = new Date('2024-06-12');
    expect(checkBookingOverlap(bookings, startDate, endDate)).toBe(true);
  });

  it('returns true if new booking fully covers an existing booking', () => {
    const startDate = new Date('2024-06-09');
    const endDate = new Date('2024-06-16');
    expect(checkBookingOverlap(bookings, startDate, endDate)).toBe(true);
  });

  it('returns false if new booking is before all existing bookings', () => {
    const startDate = new Date('2024-06-01');
    const endDate = new Date('2024-06-09');
    expect(checkBookingOverlap(bookings, startDate, endDate)).toBe(false);
  });

  it('returns false if new booking is after all existing bookings', () => {
    const startDate = new Date('2024-06-26');
    const endDate = new Date('2024-06-28');
    expect(checkBookingOverlap(bookings, startDate, endDate)).toBe(false);
  });

  it('returns false if overlapping booking is excluded by id', () => {
    const startDate = new Date('2024-06-12');
    const endDate = new Date('2024-06-18');
    expect(checkBookingOverlap(bookings, startDate, endDate, '1')).toBe(false);
  });

  it('returns true if overlapping booking is not excluded by id', () => {
    const startDate = new Date('2024-06-12');
    const endDate = new Date('2024-06-18');
    expect(checkBookingOverlap(bookings, startDate, endDate, '2')).toBe(true);
  });

  it('returns false if bookings array is empty', () => {
    const startDate = new Date('2024-06-12');
    const endDate = new Date('2024-06-18');
    expect(checkBookingOverlap([], startDate, endDate)).toBe(false);
  });
});
