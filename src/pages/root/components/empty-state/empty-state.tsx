import { Calendar, Plus } from 'lucide-react';

import { Button } from '@/components/button/button';

type EmptyBookingsProps = {
  onCreate?: () => void;
};

export function EmptyBookings({ onCreate }: EmptyBookingsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <Calendar className="h-12 w-12 text-muted-foreground" />
      </div>

      <h2 className="mb-2 text-2xl font-semibold">No bookings yet</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        Get started by creating your first booking. You can add guest details, dates, and manage
        everything in one place.
      </p>
      <Button onClick={onCreate} size="lg">
        <Plus className="mr-2 h-5 w-5" />
        Create Your First Booking
      </Button>
    </div>
  );
}
