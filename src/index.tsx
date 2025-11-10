import './global.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppRouter } from './app-router';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
