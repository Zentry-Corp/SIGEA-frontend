import React, { useState, useMemo } from "react";
import AdminLayout from "../../features/admin/ui/AdminLayout";
import { Breadcrumb, PageHeader, PrimaryButton, Alert } from "../../features/admin/ui/AdminLayout.styles";
import { TablePanel } from "../../features/admin/ui/styles/AdminUsersStyles";

// Componentes
import { UserFiltersBar } from "../../features/admin/ui/components/UserFiltersBar";
import { UsersTable } from "../../features/admin/ui/components/UsersTable";
import { CreateUserModal } from "../../features/admin/ui/components/CreateUserModal"; // Solo para CREAR
import { ManageRolesModal } from "../../features/admin/ui/components/ManageRolesModal"; // ✅ NUEVO para ROLES

// Hooks y Servicios
import { useAdminUsers } from "../../features/admin/hooks/useAdminUsers";
import { useAdminRoles } from "../../features/admin/hooks/useAdminRoles";
import { adminApi } from "../../features/admin/api/adminAPI"; 
import { processUserFilters } from "../../features/admin/services/userService";
import { SORT_OPTIONS } from "../../features/admin/constants/users.constants";

const AdminUsersPage = () => {
  const { users, loading: loadingUsers, crearUsuario, refresh } = useAdminUsers();
  const { roles } = useAdminRoles(); 

  // Estados UI
  const [isCreateOpen, setCreateOpen] = useState(false); // Modal Crear
  const [roleUser, setRoleUser] = useState(null);        // Usuario seleccionado para roles (null = cerrado)
  const [feedback, setFeedback] = useState(null);

  // Filtros
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENTES);

  const filteredUsers = useMemo(() => 
    processUserFilters(users, { query, roleFilter, sortBy }), 
  [users, query, roleFilter, sortBy]);

  // 1. Manejador: Crear Usuario Nuevo
  const handleCreate = async (payload) => {
    try {
      await crearUsuario(payload);
      setFeedback({ type: "success", msg: "Usuario creado exitosamente." });
      setCreateOpen(false);
      refresh();
    } catch (err) {
      throw err;
    }
  };

  // 2. Manejador: Guardar Cambios de Roles
  const handleSaveRoles = async (userId, newRoleIds) => {
    try {
        console.log("🛡️ Actualizando roles para:", userId, newRoleIds);
        
        // Preparamos el payload mínimo que tu backend necesite. 
        // IMPORTANTE: Como usas 'actualizarUsuario', probablemente necesites enviar el resto de datos del usuario
        // O si tu backend es inteligente, solo con enviar 'rolId' basta.
        // Probamos enviando solo rolId:
        const payload = { rolId: newRoleIds }; 

        await adminApi.actualizarUsuario(userId, payload);
        
        setFeedback({ type: "success", msg: "Roles actualizados correctamente." });
        refresh(); // Recargar tabla
    } catch (err) {
        console.error(err);
        // Si falla porque faltan campos requeridos (nombre, dni, etc), el backend te avisará.
        throw new Error("Error al actualizar roles. Verifica la consola.");
    }
  };

  return (
    <AdminLayout>
      <Breadcrumb>Admin &gt; Usuarios</Breadcrumb>
      <PageHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administra cuentas y permisos</p>
        </div>
        <PrimaryButton onClick={() => setCreateOpen(true)}>+ Crear usuario</PrimaryButton>
      </PageHeader>

      {feedback && <Alert $variant={feedback.type}>{feedback.msg}</Alert>}

      <UserFiltersBar 
        query={query} onQueryChange={setQuery}
        roleFilter={roleFilter} onRoleFilterChange={setRoleFilter}
        sortBy={sortBy} onSortChange={setSortBy}
        rolesList={roles} resultsCount={filteredUsers.length} loading={loadingUsers}
      />

      <TablePanel>
        <UsersTable 
          users={filteredUsers} 
          loading={loadingUsers} 
          onManageRoles={(user) => setRoleUser(user)} // Abrir modal roles
        />
      </TablePanel>

      {/* MODAL 1: SOLO CREAR (Complejo) */}
      {isCreateOpen && (
        <CreateUserModal
          isOpen={isCreateOpen}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreate}
          availableRoles={roles}
          // No pasamos userToEdit, así que siempre es modo crear
        />
      )}

      {/* MODAL 2: SOLO ROLES (Simple) */}
      {roleUser && (
        <ManageRolesModal
          isOpen={!!roleUser}
          user={roleUser}
          allRoles={roles}
          onClose={() => setRoleUser(null)}
          onSave={handleSaveRoles}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUsersPage;