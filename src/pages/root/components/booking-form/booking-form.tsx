import { zodResolver } from '@hookform/resolvers/zod';
import { startOfDay } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/button/button';
import { DatePicker } from '@/components/date-picker/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form/form';
import { Input } from '@/components/input/input';
import { Textarea } from '@/components/textarea/textarea';
import { Booking, useBookingStore } from '@/stores/booking-store';
import { validateBookingDates, checkBookingOverlap } from '@/utils/booking-validation';

const bookingSchema = z.object({
  guestName: z.string().min(2, 'Guest name must be at least 2 characters'),
  startDate: z.date({ error: 'Start date is required' }),
  endDate: z.date({ error: 'End date is required' }),
  numberOfGuests: z.transform(Number).pipe(z.number().min(1, 'Must have at least 1 guest')),
  notes: z.string().optional(),
});

type BookingFormType = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  booking?: Booking;
  onClose: () => void;
}

export const BookingForm = ({ booking, onClose }: BookingFormProps) => {
  const addBooking = useBookingStore(state => state.addBooking);
  const updateBooking = useBookingStore(state => state.updateBooking);
  const bookings = useBookingStore(state => state.bookings);

  const bookedDates = bookings
    .filter(item => booking?.id !== item.id)
    .flatMap(item => {
      const dates: Date[] = [];
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);

      for (
        let date = new Date(start);
        date <= end;
        date = new Date(date.setDate(date.getDate() + 1))
      ) {
        dates.push(new Date(date));
      }

      return dates;
    });

  const form = useForm<BookingFormType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: booking?.guestName || '',
      startDate: booking?.startDate ? new Date(booking.startDate) : undefined,
      endDate: booking?.endDate ? new Date(booking.endDate) : undefined,
      numberOfGuests: booking?.numberOfGuests || 1,
      notes: booking?.notes || '',
    },
  });

  const onSubmit = (data: BookingFormType) => {
    const dateError = validateBookingDates(data.startDate, data.endDate);
    if (dateError) {
      return form.setError('root', {
        type: 'manual',
        message: dateError,
      });
    }

    const hasOverlap = checkBookingOverlap(bookings, data.startDate, data.endDate, booking?.id);

    if (hasOverlap) {
      return form.setError('root', {
        type: 'manual',
        message: 'This booking overlaps with an existing booking',
      });
    }

    if (booking) {
      updateBooking(booking.id, data);
      toast.success('Booking updated successfully');
    } else {
      addBooking(data);
      toast.success('Booking created successfully');
    }

    onClose();
  };

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {form.formState.errors.root && (
          <div className="w-auto rounded-md border border-solid border-destructive bg-destructive/5 p-2 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                label="Start Date"
                value={field.value}
                onSelect={field.onChange}
                disabled={date => {
                  const today = startOfDay(new Date());
                  if (date < today) {
                    return true;
                  }

                  return bookedDates.some(
                    bookedDate => bookedDate.toDateString() === date.toDateString()
                  );
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                label="End Date"
                value={field.value}
                onSelect={field.onChange}
                disabled={date => {
                  const startDate = form.getValues('startDate') || startOfDay(new Date());
                  if (date <= startDate) {
                    return true;
                  }

                  return bookedDates.some(
                    bookedDate => bookedDate.toDateString() === date.toDateString()
                  );
                }}
              />
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="numberOfGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the number of Guests"
                  type="number"
                  min="1"
                  onKeyDown={e => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requests or notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{booking ? 'Update Booking' : 'Create Booking'}</Button>
        </div>
      </form>
    </Form>
  );
};
