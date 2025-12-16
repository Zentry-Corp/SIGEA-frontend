import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../features/admin/ui/AdminLayout";
import { 
  PageHeader, WelcomeCard, WelcomeText, PrimaryButton, Grid, Alert 
} from "../../features/admin/ui/adminLayout.styles.js";

// 1. Hook Nuevo
import { useAdminStats } from "../../features/admin/hooks/useAdminStats";

// 2. Componentes Nuevos
import { DashboardStats } from "../../features/admin/ui/components/DashboardStats";
import { DashboardQuickActions } from "../../features/admin/ui/components/DashboardQuickActions";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  
  // Usamos el hook para obtener datos (ya procesados por el servicio)
  const { stats, loading, error } = useAdminStats();

  return (
    <AdminLayout>
      <PageHeader>
        <h1>Panel de Control Admin</h1>
        <p>Gestiona usuarios, roles y supervisa la actividad del sistema</p>
      </PageHeader>

      {error && <Alert $variant="error" style={{ marginBottom: 16 }}>{error}</Alert>}

      <Grid>
        {/* Tarjeta de Bienvenida (La dejamos aquí porque es simple) */}
        <WelcomeCard>
          <WelcomeText>
            <small>Bienvenido de nuevo</small>
            <h2>Panel de Control Admin</h2>
            <p>Gestiona usuarios, roles y permisos desde un único lugar</p>
          </WelcomeText>
          <PrimaryButton onClick={() => navigate("/admin/usuarios")}>
            Ir a Usuarios
          </PrimaryButton>
        </WelcomeCard>

        {/* Componente de Estadísticas Aislado */}
        <DashboardStats stats={stats} loading={loading} />

        {/* Componente de Acciones Aislado */}
        <DashboardQuickActions />
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboardPage;