import { apiClient } from '../../../shared/api';

export const activitiesApi = {
  list: async () => {
    const res = await apiClient.get('/actividades/listar');
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/actividades/obtener/${id}`);
    return res.data;
  },
};
