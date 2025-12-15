import { apiClient } from '../../../shared/api/apiClient';

export const notificationsApi = {
  // GET /api/v1/notificaciones/obtener/usuario/{usuarioId}
  obtenerPorUsuario: async (usuarioId) => {
    const res = await apiClient.get(`/notificaciones/obtener/usuario/${usuarioId}`);
    return res.data; // array NotificacionResponse
  },

  // PUT /api/v1/notificaciones/{id}/marcar-leida
  marcarLeida: async (id) => {
    const res = await apiClient.put(`/notificaciones/${id}/marcar-leida`);
    return res.data; // NotificacionResponse
  },

  // PUT /api/v1/notificaciones/usuario/{usuarioId}/marcar-todas-leidas
  marcarTodasLeidas: async (usuarioId) => {
    const res = await apiClient.put(`/notificaciones/usuario/${usuarioId}/marcar-todas-leidas`);
    return res.data; // puede ser string o response
  },
};

export default notificationsApi;
