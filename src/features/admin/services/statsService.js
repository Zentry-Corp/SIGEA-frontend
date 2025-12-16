import { DEFAULT_STATS } from '../constants/dashboard.constants';

import { normalizeStats } from '../utils/adminMappers'; 

/**
 * Procesa estadísticas del dashboard
 */
export const processStats = (apiResponse) => {

  const normalizedData = normalizeStats(apiResponse);

  if (!normalizedData) return DEFAULT_STATS;

  return {
    // Usamos normalizedData en lugar de rawStats/apiResponse directo
    total: normalizedData.total ?? DEFAULT_STATS.total,
    activos: normalizedData.activos ?? DEFAULT_STATS.activos,
    pendientes: normalizedData.pendientes ?? DEFAULT_STATS.pendientes,
    organizadores: normalizedData.organizadores ?? DEFAULT_STATS.organizadores
  };
};

export const generateQuickActions = (navigate) => [
  {
    id: 'users',
    tone: 'blue',
    icon: 'FiUsers',
    title: 'Ir a Gestión de Usuarios',
    description: 'Ver, editar y gestionar todas las cuentas del sistema',
    onClick: () => navigate('/admin/usuarios')
  },
  {
    id: 'create-user',
    tone: 'green',
    icon: 'FiCheckCircle',
    title: 'Crear Usuario',
    description: 'Añade un nuevo usuario al sistema',
    onClick: () => navigate('/admin/usuarios') 
  }
];