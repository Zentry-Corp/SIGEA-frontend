// src/features/attendance/api/attendanceApi.js
import { apiClient } from '@/shared/api';

export const attendanceApi = {
  /**
   * GET /api/v1/usuarios/organizador/dashboard/participantes-asistencias
   * Dashboard de organizador para mostrar Participantes y Asistencias
   */
  dashboardParticipantesAsistencias: async () => {
    const response = await apiClient.get(
      '/usuarios/organizador/dashboard/participantes-asistencias'
    );
    return response.data;
  },

  /**
   * Registrar asistencia de un participante
   * @param {string} inscripcionId - ID de la inscripción
   * @param {boolean} presente - Estado de asistencia
   */
  registrarAsistencia: async (inscripcionId, presente) => {
    const response = await apiClient.patch(
      `/inscripciones/${inscripcionId}/asistencia`,
      { presente }
    );
    return response.data;
  },

  /**
   * Registrar asistencia masiva
   * @param {Array} asistencias - Array de { inscripcionId, presente }
   */
  registrarAsistenciaMasiva: async (asistencias) => {
    const response = await apiClient.post(
      '/inscripciones/asistencia/masiva',
      { asistencias }
    );
    return response.data;
  },
};