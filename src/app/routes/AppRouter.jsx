import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ==================== IMPORTS: AUTH & PUBLIC ====================
import { LandingPage } from "../../pages/public";
import { RegisterPage } from "../../pages/auth";
import { useAuth } from "../../features/auth/hooks/useAuth";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

// ==================== IMPORTS: PARTICIPANT ====================
import { ParticipantDashboardPage } from "../../pages/participant";
// ⚠️ Asegúrate de que estas rutas sean correctas, faltaban importar:
import ParticipantEventsPage from "../../pages/participant/ParticipantEventsPage"; 
import ParticipantInscriptionsPage from "../../pages/participant/ParticipantInscriptionsPage";
import ParticipantCertificatesPage from "../../pages/participant/ParticipantCertificatesPage";
import ParticipantNotificationsPage from "../../pages/participant/ParticipantNotificationsPage";

// ==================== IMPORTS: ORGANIZER ====================
import OrganizerDashboardPage from "../../pages/organizer/OrganizerDashboardPage";
import ActividadesPage from "../../pages/organizer/ActividadesPage";
import CrearActividadPage from "../../pages/organizer/CrearActividadPage";
import EditarActividadPage from "../../pages/organizer/EditarActividadPage";
import GestionarSesionesPage from "../../pages/organizer/GestionarSesionesPage";
import CrearSesionPage from "../../pages/organizer/CrearSesionPage"; // Estaba importado pero no usado
import ParticipantesPage from "../../pages/organizer/ParticipantesPage";
import CertificacionPage from "../../pages/organizer/CertificacionPage";
import PagosPage from '../../pages/organizer/PagosPage';

// ==================== IMPORTS: ADMIN ====================
import { AdminDashboardPage } from "../../pages/admin";
// ⚠️ Faltaban importar estos dos:
import AdminUsersPage from "../../pages/admin/AdminUsersPage";
import AdminRolesPage from "../../pages/admin/AdminRolesPage";


// ✅ COMPONENTE: Redirección inteligente por rol
const RoleRedirect = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a1628", color: "white" }}>
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

        {/* ==================== REDIRECCIÓN AUTOMÁTICA ==================== */}
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

        {/* Actividades: Listar, Crear, Editar */}
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

        {/* Sesiones: Listar y Crear (Agregué la ruta de CrearSesionPage aquí) */}
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
        {/* 🔥 Agregué esta ruta porque tenías el import 'CrearSesionPage' sin usar */}
        <Route
          path="/organizador/actividades/:actividadId/sesiones/crear"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ORGANIZADOR", "ADMINISTRADOR"]}>
                <CrearSesionPage /> 
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Gestión Varia */}
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

        {/* ==================== RUTAS ADMIN ==================== */}
        
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