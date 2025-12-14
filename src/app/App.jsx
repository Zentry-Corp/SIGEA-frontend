import React from 'react';
import AppRouter from './routes/AppRouter';
import '../shared/ui/styles/global.css';
import { AuthProvider } from './providers/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;