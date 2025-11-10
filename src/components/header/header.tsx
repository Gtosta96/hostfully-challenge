import { Plus } from 'lucide-react';

import HostfullyLogo from './hostfully-logo.tsx';
import { Button } from '../button/button';

type HeaderProps = {
  onNewBooking: () => void;
};
export function Header({ onNewBooking }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="mr-4 flex w-32 items-center justify-center border-r border-solid border-input pr-4">
              <HostfullyLogo />
            </div>
            <div>
              <h1 className="text-xl font-bold text-accent sm:text-2xl">Booking Manager</h1>
            </div>
          </div>
          <Button onClick={onNewBooking} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Booking
          </Button>
        </div>
      </div>
    </header>
  );
}
