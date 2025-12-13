import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const RoleRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth();

  // ⏳ Esperar a que termine auth
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
        Cargando permisos...
      </div>
    );
  }

  // ⏳ Rol aún no disponible
  if (!role) {
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
        Cargando rol...
      </div>
    );
  }
  console.log('[RoleRoute]', {
  loading,
  role,
  allowedRoles,
});

  // ❌ Rol no permitido
  if (!allowedRoles.includes(role.toUpperCase())) {
    return <Navigate to={getRoleDashboard(role)} replace />;
  }

  return children;
};

const getRoleDashboard = (role) => {
  switch (role?.toUpperCase()) {
    case 'ADMINISTRADOR':
      return '/admin/dashboard';
    case 'ORGANIZADOR':
      return '/organizador/dashboard';
    case 'PARTICIPANTE':
      return '/participante/dashboard';
    default:
      return '/';
  }
};

export default RoleRoute;


