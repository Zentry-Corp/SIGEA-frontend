// src/features/participant/api/certificatesApi.js
import { apiClient } from "../../../shared/api/apiClient";

export const certificatesApi = {
  // GET /api/v1/certificaciones/obtener/inscripcion/{inscripcionId}
  async obtenerPorInscripcion(inscripcionId) {
    const { data } = await apiClient.get(`/certificaciones/obtener/inscripcion/${inscripcionId}`);
    return data;
  },

  // GET /api/v1/certificaciones/obtener/validaciones/{codigoValidacion}
  async obtenerValidaciones(codigoValidacion) {
    const { data } = await apiClient.get(`/certificaciones/obtener/validaciones/${codigoValidacion}`);
    return data;
  },

  // GET /api/v1/certificaciones/obtener/cod-validacion/{codigoValidacion}
  async obtenerPorCodigo(codigoValidacion) {
    const { data } = await apiClient.get(`/certificaciones/obtener/cod-validacion/${codigoValidacion}`);
    return data;
  },
};
