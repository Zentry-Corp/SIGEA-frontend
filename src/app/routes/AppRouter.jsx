import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- PAGINAS PUBLICAS ---
import { LandingPage } from '../../pages/public';
import { RegisterPage } from '../../pages/auth';

// --- PAGINAS PARTICIPANTE ---
import { ParticipantDashboardPage } from '../../pages/participant';

// --- PAGINAS ADMIN (AQUÍ FALTABAN TUS IMPORTACIONES) ---
import { AdminDashboardPage } from '../../pages/admin';
import AdminUsersPage from '../../pages/admin/AdminUsersPage'; // ✅ Agregado
import AdminRolesPage from '../../pages/admin/AdminRolesPage'; // ✅ Agregado

// --- PAGINAS ORGANIZADOR ---
import OrganizerDashboardPage from '../../pages/organizer/OrganizerDashboardPage';
import ActividadesPage from '../../pages/organizer/ActividadesPage';
import CrearActividadPage from '../../pages/organizer/CrearActividadPage';
import ParticipantesPage from '../../pages/organizer/ParticipantesPage';
import CertificacionPage from '../../pages/organizer/CertificacionPage';
// 👇 ESTAS ERAN LAS QUE DABAN ERROR (Faltaban importar)
import GestionarSesionesPage from '../../pages/organizer/GestionarSesionesPage'; // ✅ Agregado
import EditarActividadPage from '../../pages/organizer/EditarActividadPage';   // ✅ Agregado
import PagosPage from '../../pages/organizer/PagosPage';                         // ✅ Agregado

// --- UTILS ---
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { useAuth } from '../../features/auth/hooks/useAuth';

// Componente para redirigir según rol
const RoleRedirect = () => {
  const { role } = useAuth();

  switch (role?.toUpperCase()) {
    case "ADMINISTRADOR":
      return <Navigate to="/admin/dashboard" replace />;
    case "ORGANIZADOR":
      return <Navigate to="/organizador/dashboard" replace />;
    case "PARTICIPANTE":
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
              <RoleRoute allowedRoles={["PARTICIPANTE"]}>
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
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
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
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
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
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
                <CrearActividadPage />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* 📋 LISTAR / GESTIONAR SESIONES (Aquí te daba el error) */}
        <Route
          path="/organizador/actividades/:actividadId/sesiones"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
                <GestionarSesionesPage /> 
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Participantes y Asistencia */}
        <Route
          path="/organizador/participantes"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
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
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
                <CertificacionPage />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Gestión de Actividades - Editar */}
        <Route
          path="/organizador/actividades/editar/:id"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
                <EditarActividadPage />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Pagos */}
        <Route
          path="/organizador/pagos"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
                <PagosPage />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* ==================== RUTAS ADMIN (YA REFACTORIZADAS) ==================== */}
        
        {/* Dashboard Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMINISTRADOR"]}>
                <AdminDashboardPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* ✅ AGREGADO: Gestión de Usuarios */}
        <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMINISTRADOR"]}>
                <AdminUsersPage />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* ✅ AGREGADO: Gestión de Roles */}
        <Route
          path="/admin/roles"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMINISTRADOR"]}>
                <AdminRolesPage />
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