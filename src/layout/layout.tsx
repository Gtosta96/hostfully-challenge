import { Outlet } from 'react-router-dom';

import { Toaster as Sonner } from '@/components/sonner/sonner';

export const Layout = () => {
  return (
    <>
      <Outlet />
      <Sonner />
    </>
  );
};
