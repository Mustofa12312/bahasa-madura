import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { QueryProvider } from './app/providers/QueryProvider';
import { ToastProvider } from './components/ui/Toast';

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>
  );
};

export default App;

