import React, { useState } from "react";
import AdminLayout from "../../features/admin/ui/AdminLayout";
import { Breadcrumb, PageHeader, Panel, PrimaryButton, Alert } from "../../features/admin/ui/AdminLayout.styles";

// Hooks
import { useAdminRoles } from "../../features/admin/hooks/useAdminRoles";

// Componentes Nuevos
import { RolesTable } from "../../features/admin/ui/components/RolesTable";
import { RoleModal } from "../../features/admin/ui/components/RoleModal";

const AdminRolesPage = () => {
  // --- Data Layer ---
  const { roles, loading, error, crearRol, actualizarRol, eliminarRol } = useAdminRoles();
  
  // --- UI State ---
  const [modalState, setModalState] = useState({ open: false, mode: "create", role: null });
  const [feedback, setFeedback] = useState(null);

  // --- Handlers ---
  const handleOpenCreate = () => {
    setFeedback(null);
    setModalState({ open: true, mode: "create", role: null });
  };

  const handleOpenEdit = (role) => {
    setFeedback(null);
    setModalState({ open: true, mode: "edit", role });
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`¿Eliminar rol "${role.nombreRol}"?`)) return;
    try {
      await eliminarRol(role.id);
      setFeedback({ type: "success", msg: "Rol eliminado correctamente." });
    } catch (e) {
      setFeedback({ type: "error", msg: e.message || "Error al eliminar rol." });
    }
  };

  const handleSave = async (payload) => {
    // El modal ya nos da el payload limpio
    if (modalState.mode === "create") {
       await crearRol(payload);
       setFeedback({ type: "success", msg: "Rol creado exitosamente." });
    } else {
       await actualizarRol(modalState.role.id, payload);
       setFeedback({ type: "success", msg: "Rol actualizado exitosamente." });
    }
    // No cerramos el modal aquí, se cierra solo si el await no falla (manejado en RoleModal)
  };

  return (
    <AdminLayout>
      <Breadcrumb>Admin &gt; Roles</Breadcrumb>
      <PageHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
            <h1>Roles y Permisos</h1>
            <p>Define la seguridad y acceso del sistema</p>
        </div>
        <PrimaryButton onClick={handleOpenCreate}>+ Crear Rol</PrimaryButton>
      </PageHeader>

      {/* Feedback Global */}
      {error && <Alert $variant="error">{error}</Alert>}
      {feedback && <Alert $variant={feedback.type}>{feedback.msg}</Alert>}

      <Panel>
        <RolesTable 
            roles={roles} 
            loading={loading} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete} 
        />
      </Panel>

      {/* Modal */}
      {modalState.open && (
        <RoleModal
          isOpen={modalState.open}
          mode={modalState.mode}
          initialData={modalState.role}
          onClose={() => setModalState({ ...modalState, open: false })}
          onSubmit={handleSave}
        />
      )}
    </AdminLayout>
  );
};

export default AdminRolesPage;