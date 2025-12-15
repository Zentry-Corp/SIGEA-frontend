import { SORT_OPTIONS, USER_VALIDATION } from '../constants/users.constants';

/**
 * Valida datos de usuario
 */
export const validateUserData = (formData) => {
  const errors = [];

  if (!formData.nombres?.trim()) {
    errors.push('El nombre es obligatorio');
  }

  if (!formData.apellidos?.trim()) {
    errors.push('Los apellidos son obligatorios');
  }

  if (!formData.correo?.trim()) {
    errors.push('El correo es obligatorio');
  }

  if (!formData.password || formData.password.length < USER_VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`La contraseña debe tener al menos ${USER_VALIDATION.PASSWORD_MIN_LENGTH} caracteres`);
  }

  if (formData.dni?.length !== USER_VALIDATION.DNI_LENGTH) {
    errors.push(`El DNI debe tener ${USER_VALIDATION.DNI_LENGTH} dígitos`);
  }

  if (!formData.rolIds || formData.rolIds.length === 0) {
    errors.push('Debes seleccionar al menos un rol');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Prepara payload para crear usuario
 */
export const prepareUserPayload = (formData) => {
  return {
    nombres: formData.nombres.trim(),
    apellidos: formData.apellidos.trim(),
    correo: formData.correo.trim(),
    password: formData.password,
    dni: formData.dni.trim(),
    telefono: formData.telefono.trim(),
    extensionTelefonica: formData.extensionTelefonica.trim(),
    rolId: formData.rolIds // Backend espera array
  };
};

/**
 * Filtra usuarios por query
 */
export const filterUsersByQuery = (users, query) => {
  if (!query) return users;

  const q = query.trim().toLowerCase();
  
  return users.filter(u => {
    const name = (u.fullName || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const dni = (u.dni || '').toLowerCase();
    
    return name.includes(q) || email.includes(q) || dni.includes(q);
  });
};

/**
 * Filtra usuarios por rol
 */
export const filterUsersByRole = (users, roleName) => {
  if (roleName === 'ALL') return users;
  return users.filter(u => (u.nombresRoles || []).includes(roleName));
};

/**
 * Ordena usuarios
 */
export const sortUsers = (users, sortBy) => {
  const list = [...users];
  
  const nameKey = (u) => (u.fullName || '').toLowerCase();
  const dateKey = (u) => {
    const d = u.createdAt ? new Date(u.createdAt) : null;
    return d && !Number.isNaN(d.getTime()) ? d.getTime() : 0;
  };

  switch (sortBy) {
    case SORT_OPTIONS.ANTIGUOS:
      return list.sort((a, b) => dateKey(a) - dateKey(b));
    
    case SORT_OPTIONS.A_Z:
      return list.sort((a, b) => nameKey(a).localeCompare(nameKey(b)));
    
    case SORT_OPTIONS.Z_A:
      return list.sort((a, b) => nameKey(b).localeCompare(nameKey(a)));
    
    case SORT_OPTIONS.RECENTES:
    default:
      return list.sort((a, b) => dateKey(b) - dateKey(a));
  }
};

/**
 * Procesa filtros y ordenamiento
 */
export const processUserFilters = (users, filters) => {
  let result = [...users];
  
  // Filtrar por búsqueda
  if (filters.query) {
    result = filterUsersByQuery(result, filters.query);
  }
  
  // Filtrar por rol
  if (filters.roleFilter) {
    result = filterUsersByRole(result, filters.roleFilter);
  }
  
  // Ordenar
  if (filters.sortBy) {
    result = sortUsers(result, filters.sortBy);
  }
  
  return result;
};