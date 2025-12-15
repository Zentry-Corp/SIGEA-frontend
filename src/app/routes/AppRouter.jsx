import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "../../pages/public";
import { RegisterPage } from "../../pages/auth";
import { ParticipantDashboardPage } from "../../pages/participant";
import { AdminDashboardPage } from "../../pages/admin";
import OrganizerDashboardPage from "../../pages/organizer/OrganizerDashboardPage";
import ActividadesPage from "../../pages/organizer/ActividadesPage";
import CrearActividadPage from "../../pages/organizer/CrearActividadPage";
import ParticipantesPage from "../../pages/organizer/ParticipantesPage";
import GestionarSesionesPage from "../../pages/organizer/GestionarSesionesPage";
import CertificacionPage from "../../pages/organizer/CertificacionPage";
import CrearSesionPage from "../../pages/organizer/CrearSesionPage";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import { useAuth } from "../../features/auth/hooks/useAuth";
import EditarActividadPage from "../../pages/organizer/EditarActividadPage";
import PagosPage from '../../pages/organizer/PagosPage';

// ✅ Redirección por rol + loading (tu mejora)
const RoleRedirect = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#0a1628",
          color: "white",
        }}
      >
        Cargando...
      </div>
    );
  }

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
        {/* ✅ Protegida como tu versión anterior */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RoleRedirect />
            </PrivateRoute>
          }
        />

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

        {/* ✅ Tus rutas nuevas */}
        <Route
          path="/participante/eventos"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["PARTICIPANTE"]}>
                <ParticipantEventsPage />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/participante/inscripciones"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["PARTICIPANTE"]}>
                <ParticipantInscriptionsPage />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/participante/certificados"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["PARTICIPANTE"]}>
                <ParticipantCertificatesPage />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/participante/notificaciones"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["PARTICIPANTE"]}>
                <ParticipantNotificationsPage />
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