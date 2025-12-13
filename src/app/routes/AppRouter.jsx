import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../../pages/public';
import { RegisterPage } from '../../pages/auth';
import { ParticipantDashboardPage } from '../../pages/participant';
import { AdminDashboardPage } from '../../pages/admin';
import OrganizerDashboardPage from '../../pages/organizer/OrganizerDashboardPage';
import ActividadesPage from '../../pages/organizer/ActividadesPage';
import CrearActividadPage from '../../pages/organizer/CrearActividadPage';
import ParticipantesPage from '../../pages/organizer/ParticipantesPage';
import CertificacionPage from '../../pages/organizer/CertificacionPage';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { useAuth } from '../../features/auth/hooks/useAuth';

// Componente para redirigir según rol
const RoleRedirect = () => {
  const { role } = useAuth();
  
  switch (role?.toUpperCase()) {
    case 'ADMINISTRADOR':
      return <Navigate to="/admin/dashboard" replace />;
    case 'ORGANIZADOR':
      return <Navigate to="/organizador/dashboard" replace />;
    case 'PARTICIPANTE':
      return <Navigate to="/participante/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== RUTAS PÚBLICAS ==================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ==================== REDIRECCIÓN POR ROL ==================== */}
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* ==================== RUTAS PARTICIPANTE ==================== */}
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

        {/* ==================== RUTAS ORGANIZADOR ==================== */}
        
        {/* Dashboard */}
        <Route 
          path="/organizador/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ORGANIZADOR', 'ADMINISTRADOR']}>
                <OrganizerDashboardPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Gestión de Actividades - Lista */}
        <Route 
          path="/organizador/actividades" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ORGANIZADOR', 'ADMINISTRADOR']}>
                <ActividadesPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Gestión de Actividades - Crear */}
        <Route 
          path="/organizador/actividades/crear" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ORGANIZADOR', 'ADMINISTRADOR']}>
                <CrearActividadPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Participantes y Asistencia */}
        <Route 
          path="/organizador/participantes" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ORGANIZADOR', 'ADMINISTRADOR']}>
                <ParticipantesPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Certificación */}
        <Route 
          path="/organizador/certificacion" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['ORGANIZADOR', 'ADMINISTRADOR']}>
                <CertificacionPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* ==================== RUTAS ADMIN ==================== */}
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

export default AppRouter;