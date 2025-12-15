import { apiClient } from '../../../shared/api/apiClient';

export const attendancesApi = {
  // Historial de asistencias por inscripción (participanteJWT)
  listarPorInscripcion: async (inscripcionId) => {
    const res = await apiClient.get(`/asistencias/listar/inscripcion/${inscripcionId}`);
    return res.data; // array AsistenciaResponse
  },
};

export default attendancesApi;
