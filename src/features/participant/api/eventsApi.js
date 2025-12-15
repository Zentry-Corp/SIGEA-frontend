import { apiClient } from '../../../shared/api/apiClient';

export const eventsApi = {
  listar: async () => {
    const res = await apiClient.get('/actividades/listar');
    return res.data;
  },

  // Nombre actual (lo mantengo)
  obtenerPorId: async (id) => {
    const res = await apiClient.get(`/actividades/obtener/${id}`);
    return res.data;
  },

  // Alias para compatibilidad con useMyInscriptions y otros archivos
  obtener: async (id) => {
    const res = await apiClient.get(`/actividades/obtener/${id}`);
    return res.data;
  },
};

export default eventsApi;
