import { PopoverClose } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DayPicker, DayPickerSingleProps } from 'react-day-picker';

import { Button } from '@/components/button/button';
import { Calendar } from '@/components/calendar/calendar';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/form/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover/popover';
import { cn } from '@/libs/utils';

type DatePickerProps = Omit<DayPickerSingleProps, 'mode' | 'selected'> & {
  label?: string;
  className?: string;
  placeholder?: string;
  value: Date;
};

function DatePicker({
  className,
  label = 'Date',
  placeholder = 'Pick a date',
  value,
  ...props
}: DatePickerProps) {
  return (
    <FormItem className={cn('flex flex-col', className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              aria-label={label}
              variant="outline"
              className={cn('w-full pl-3 text-left font-normal', !value && 'text-muted-foreground')}
            >
              {value ? format(value, 'PPP') : <span>{placeholder}</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            {...props}
            className={cn('pointer-events-auto p-3')}
            mode="single"
            selected={value}
            components={{
              DayContent: ({ date }: { date: Date }) => (
                <PopoverClose>{date.getDate()}</PopoverClose>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

DatePicker.displayName = 'DatePicker';

export { DatePicker };
