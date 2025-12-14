import { useState } from 'react';
import { activitiesApi } from '../api/activitiesApi';

export const useUpdateActivity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateActivity = async (activityId, activityData) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        titulo: activityData.titulo,
        descripcion: activityData.descripcion,
        fechaInicio: activityData.fechaInicio,
        fechaFin: activityData.fechaFin,
        horaInicio: activityData.horaInicio,
        horaFin: activityData.horaFin,
        estadoId: activityData.estadoId || null,
        organizadorId: activityData.organizadorId,
        tipoActividadId: activityData.tipoActividadId,
        ubicacion: activityData.ubicacion,
        coOrganizador: activityData.coOrganizador || "",
        sponsor: activityData.sponsor || "",
        bannerUrl: activityData.bannerUrl || "",
        numeroYape: activityData.numeroYape || ""
      };

      console.log('📝 Actualizando actividad:', { id: activityId, payload });

      const result = await activitiesApi.actualizar(activityId, payload);

      console.log('✅ Actividad actualizada:', result);
      return result;

    } catch (err) {
      console.error('❌ Error al actualizar actividad:', err);
      setError(err.message || 'Error al actualizar la actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateActivity, loading, error };
};