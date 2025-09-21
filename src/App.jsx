import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider } from './contexts/RouterContext';
import AppRouter from './AppRouter';

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider>
          <AppRouter />
        </RouterProvider>
      </AuthProvider>
    </div>
  );
};

export default App;