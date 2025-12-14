import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0a1628',
        color: 'white',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('⛔ Redirect por isAuthenticated = false');
    // Redirigir a landing si no está autenticado
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;