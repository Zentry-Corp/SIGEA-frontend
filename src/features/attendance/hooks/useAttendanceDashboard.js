// src/features/attendance/hooks/useAttendanceDashboard.js
import { useEffect, useState, useCallback } from 'react';
import { attendanceApi } from '../api/attendanceApi';

/**
 * Hook para gestionar el dashboard de participantes y asistencias
 * Consume: GET /api/v1/usuarios/organizador/dashboard/participantes-asistencias
 */
export const useAttendanceDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await attendanceApi.dashboardParticipantesAsistencias();
      
      console.log('✅ Dashboard asistencias cargado:', response);
      
      // Transformar datos para UI
      const actividades = (response.extraData || []).map(actividad => ({
        id: actividad.actividadId,
        titulo: actividad.tituloActividad,
        fechaInicio: actividad.fechaInicioActividad,
        fechaFin: actividad.fechaFinActividad,
        modalidad: actividad.modalidadActividad,
        ultimaActualizacion: actividad.updateAtActividad,
        totalInscritos: actividad.totalInscritosActividad || 0,
        asistentes: actividad.asistentesUltimaSesion || 0,
        tasaAsistencia: actividad.tasaAsistenciasUltimaSesion || 0,
        sesionId: actividad.sesionId,
        participantes: (actividad.listParticipantesInfo || []).map(p => ({
          inscripcionId: p.inscripcionId,
          fechaInscripcion: p.fechaInscripcion,
          nombre: p.nombresParticipante,
          email: p.correoParticipante,
          presente: p.presente || false,
        })),
      }));

      setData(actividades);
    } catch (err) {
      console.error('❌ Error cargando dashboard asistencia:', err);
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Guardar asistencia de una actividad
   * @param {string} actividadId 
   * @param {Array} participantes - Array con { inscripcionId, presente }
   */
  const guardarAsistencia = useCallback(async (actividadId, participantes) => {
    try {
      setSaving(true);
      
      const asistencias = participantes.map(p => ({
        inscripcionId: p.inscripcionId,
        presente: p.presente,
      }));
      
      await attendanceApi.registrarAsistenciaMasiva(asistencias);
      
      console.log('✅ Asistencia guardada para actividad:', actividadId);
      
      // Refrescar datos
      await fetchDashboard();
      
      return { success: true };
    } catch (err) {
      console.error('❌ Error guardando asistencia:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al guardar asistencia' 
      };
    } finally {
      setSaving(false);
    }
  }, [fetchDashboard]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    actividades: data,
    loading,
    error,
    saving,
    refetch: fetchDashboard,
    guardarAsistencia,
  };
};