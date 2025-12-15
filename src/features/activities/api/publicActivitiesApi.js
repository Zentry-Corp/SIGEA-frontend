import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:16001/api/v1';

// Cliente sin autenticación para endpoints públicos
const publicClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicActivitiesApi = {
  /**
   * Listar actividades públicas (landing page)
   * GET /api/v1/actividades/listar
   */
  listarPublicas: async () => {
    const { data } = await publicClient.get('/actividades/listar');
    return data;
  },

  /**
   * Obtener detalle de una actividad
   * GET /api/v1/actividades/obtener/{id}
   */
  obtenerDetalle: async (id) => {
    const { data } = await publicClient.get(`/actividades/obtener/${id}`);
    return data;
  },
};
