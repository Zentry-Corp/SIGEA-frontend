import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/public';
import { RegisterPage } from '../pages/auth';
import { PrivateRoute } from './PrivateRoute';
import { RoleRoute } from './RoleRoute';
import { ParticipantDashboardPage } from '../pages/participant';
import { OrganizerDashboardPage } from '../pages/organizer';
import { AdminDashboardPage } from '../pages/admin';
import { useAuth } from '../features/auth/hooks/useAuth';
import '../shared/ui/styles/global.css';

// Componente para redirigir automáticamente según el rol
const RoleRedirect = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0a1628',
      color: 'white'
    }}>Cargando...</div>;
  }

  // Redirigir según el rol
  const dashboards = {
    'ADMINISTRADOR': '/admin/dashboard',
    'ORGANIZADOR': '/organizador/dashboard',
    'PARTICIPANTE': '/participante/dashboard',
  };

  const redirectTo = dashboards[role] || '/';
  
  return <Navigate to={redirectTo} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== RUTAS PÚBLICAS ==================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ==================== REDIRECCIÓN POR ROL ==================== */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <RoleRedirect />
            </PrivateRoute>
          } 
        />

        {/* ==================== RUTAS DE PARTICIPANTE ==================== */}
        <Route 
          path="/participante/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['PARTICIPANTE']}>
                <ParticipantDashboardPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* ==================== RUTAS DE ORGANIZADOR ==================== */}
        <Route 
          path="/organizador/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ORGANIZADOR']}>
                <OrganizerDashboardPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* ==================== RUTAS DE ADMIN ==================== */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ADMINISTRADOR']}>
                <AdminDashboardPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* ==================== RUTA 404 ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;