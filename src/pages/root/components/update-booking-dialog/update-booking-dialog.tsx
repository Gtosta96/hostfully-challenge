import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog/dialog';
import { Booking } from '@/stores/booking-store';

import { BookingForm } from '../booking-form/booking-form';

type UpdateBookingDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  editingBooking?: Booking;
};

export function UpdateBookingDialog({ isOpen, onClose, editingBooking }: UpdateBookingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editingBooking ? 'Edit Booking' : 'Create New Booking'}</DialogTitle>
          <DialogDescription>
            {editingBooking
              ? 'Update the booking details below.'
              : 'Fill in the details to create a new booking.'}
          </DialogDescription>
        </DialogHeader>
        <BookingForm booking={editingBooking} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
