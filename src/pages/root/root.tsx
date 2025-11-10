import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Header } from '@/components/header/header';
import { BookingCard } from '@/pages/root/components/booking-card/booking-card';
import { Booking, useBookingStore } from '@/stores/booking-store';

import { DeleteBookingDialog } from './components/delete-booking-dialog/delete-booking-dialog';
import { EmptyBookings } from './components/empty-state/empty-state';
import { UpdateBookingDialog } from './components/update-booking-dialog/update-booking-dialog';

export default function Root() {
  const bookings = useBookingStore(state => state.bookings);
  const deleteBooking = useBookingStore(state => state.deleteBooking);

  const [isNewBookingDialogOpen, setIsNewBookingDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>();
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsNewBookingDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingBookingId(id);
  };

  const confirmDelete = () => {
    if (deletingBookingId) {
      deleteBooking(deletingBookingId);
      setDeletingBookingId(null);

      toast.success('Booking deleted successfully');
    }
  };

  const handleDialogClose = () => {
    setIsNewBookingDialogOpen(false);
    setEditingBooking(undefined);
  };

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    [bookings]
  );

  return (
    <div className="min-h-screen bg-background">
      <UpdateBookingDialog
        isOpen={isNewBookingDialogOpen}
        onClose={handleDialogClose}
        editingBooking={editingBooking}
      />

      <DeleteBookingDialog
        isOpen={!!deletingBookingId}
        onOpenChange={() => setDeletingBookingId(null)}
        onConfirmDelete={confirmDelete}
      />

      <Header onNewBooking={() => setIsNewBookingDialogOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        {sortedBookings.length === 0 ? (
          <EmptyBookings onCreate={() => setIsNewBookingDialogOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
