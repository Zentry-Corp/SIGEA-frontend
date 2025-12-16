// src/features/participant/api/inscriptionsApi.js
import { apiClient } from '../../../shared/api/apiClient';

export const inscriptionsApi = {
  // =========================
  // INSCRIPCIONES (participanteJWT)
  // =========================

  // Mis inscripciones por usuario
  obtenerPorUsuario: async (usuarioId) => {
    const res = await apiClient.get(`/inscripciones/obtener/usuario/${usuarioId}`);
    return res.data; // array InscripcionResponse
  },

  // Obtener inscripción por ID
  obtener: async (inscripcionId) => {
    const res = await apiClient.get(`/inscripciones/obtener/${inscripcionId}`);
    return res.data; // InscripcionResponse
  },

  // Eliminar/retirar inscripción
  eliminar: async (inscripcionId) => {
    const res = await apiClient.delete(`/inscripciones/${inscripcionId}`);
    return res.data;
  },

  // =========================
  // FLUJO NUEVO: INSCRIBIRSE A EVENTO (endpoint de usuarios)
  // POST /api/v1/usuarios/participante/inscripcion
  // =========================
  inscribirme: async ({ usuarioId, actividadId, estadoId, fechaInscripcion }) => {
    const payload = { usuarioId, actividadId, estadoId, fechaInscripcion };
    const res = await apiClient.post(`/usuarios/participante/inscripcion`, payload);
    return res.data; // GeneralResponseDTO según tu OpenAPI
  },

  // =========================
  // CERTIFICADOS
  // =========================

  // Obtener certificado por inscripción (si existe)
  obtenerCertificadoPorInscripcion: async (inscripcionId) => {
    const res = await apiClient.get(`/certificaciones/obtener/inscripcion/${inscripcionId}`);
    return res.data; // CertificadoResponse
  },

  // =========================
  // EXTRAS ÚTILES (opcionales)
  // =========================

  // Inscripciones por actividad (admin/organizador según OpenAPI)
  obtenerPorActividad: async (actividadId) => {
    const res = await apiClient.get(`/inscripciones/obtener/actividad/${actividadId}`);
    return res.data; // array InscripcionResponse
  },

  // Actualizar inscripción (si lo usarás)
  actualizar: async (inscripcionId, payload) => {
    const res = await apiClient.put(`/inscripciones/actualizar/${inscripcionId}`, payload);
    return res.data; // InscripcionResponse
  },
};

export default inscriptionsApi;
