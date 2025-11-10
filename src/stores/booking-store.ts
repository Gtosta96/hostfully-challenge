import { create } from 'zustand';

export interface Booking {
  id: string;
  guestName: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  notes?: string;
  createdAt: Date;
}

interface BookingFormData {
  guestName: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  notes?: string;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: BookingFormData) => void;
  updateBooking: (id: string, booking: BookingFormData) => void;
  deleteBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],

  addBooking: (bookingData: BookingFormData) => {
    const newBooking: Booking = {
      ...bookingData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    set(state => ({ bookings: [...state.bookings, newBooking] }));
  },

  updateBooking: (id: string, bookingData: BookingFormData) => {
    set(state => ({
      bookings: state.bookings.map(booking =>
        booking.id === id ? { ...booking, ...bookingData } : booking
      ),
    }));
  },

  deleteBooking: (id: string) => {
    set(state => ({
      bookings: state.bookings.filter(booking => booking.id !== id),
    }));
  },

  getBooking: (id: string) => {
    return get().bookings.find(booking => booking.id === id);
  },
}));
