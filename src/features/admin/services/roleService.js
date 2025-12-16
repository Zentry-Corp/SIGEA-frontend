export const validateRoleData = (formData) => {
  const errors = [];

  const nombreRol = (formData.nombreRol || '').trim();
  
  if (!nombreRol) {
    errors.push('El nombre del rol es obligatorio');
  }

  if (nombreRol.length < 3) {
    errors.push('El nombre del rol debe tener al menos 3 caracteres');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Prepara payload para crear/actualizar rol
 */
export const prepareRolePayload = (formData) => {
  return {
    nombreRol: formData.nombreRol.trim(),
    descripcion: formData.descripcion.trim()
  };
};

/**
 * Verifica si un rol puede ser eliminado
 */
export const canDeleteRole = (role, users = []) => {
  // Verificar si hay usuarios asignados a este rol
  const usersWithRole = users.filter(u => 
    (u.roleIds || []).includes(role.id)
  );

  return {
    canDelete: usersWithRole.length === 0,
    reason: usersWithRole.length > 0 
      ? `Este rol está asignado a ${usersWithRole.length} usuario(s)` 
      : null
  };
};