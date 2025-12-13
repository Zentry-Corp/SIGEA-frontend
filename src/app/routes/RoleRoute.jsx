import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

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

  if (!allowedRoles.includes(role?.toUpperCase())) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el rol del usuario está permitido
  if (!allowedRoles.includes(role)) {
    console.log('❌ Acceso denegado. Rol actual:', role, 'Roles permitidos:', allowedRoles);
    // Redirigir al dashboard correcto según su rol
    return <Navigate to={getRoleDashboard(role?.toUpperCase())} replace />;
  }

  return children;
};

// Helper para obtener el dashboard según el rol
const getRoleDashboard = (role) => {
  const roleDashboards = {
    'ADMINISTRADOR': '/admin/dashboard',
    'ORGANIZADOR': '/organizador/dashboard',
    'PARTICIPANTE': '/participante/dashboard',
  };

  return roleDashboards[role] || '/';
};

export default RoleRoute;