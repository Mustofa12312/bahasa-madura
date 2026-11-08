import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { QueryProvider } from './app/providers/QueryProvider';
import { AuthProvider } from './app/providers/AuthProvider';
import { ToastProvider } from './components/ui/Toast';

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

export default App;
