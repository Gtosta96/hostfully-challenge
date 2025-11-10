import { format } from 'date-fns';
import { Calendar, Users, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card/card';
import { Booking } from '@/stores/booking-store';

interface BookingCardProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export const BookingCard = ({ booking, onEdit, onDelete }: BookingCardProps) => {
  const formatDate = (date: Date) => format(new Date(date), 'MMM dd, yyyy');

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{booking.guestName}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              aria-label="edit booking"
              variant="outline"
              size="icon"
              onClick={() => onEdit(booking)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              aria-label="delete booking"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(booking.id)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'guest' : 'guests'}
          </span>
        </div>
        {booking.notes && (
          <p className="mt-3 border-t pt-3 text-sm text-muted-foreground">{booking.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};
