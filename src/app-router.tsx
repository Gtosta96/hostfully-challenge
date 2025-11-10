import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Layout } from './layout/layout';
import NotFound from './pages/not-found/not-found';
import Root from './pages/root/root';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Root />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};
