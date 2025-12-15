import { useState, useEffect, useCallback } from 'react';
import { publicActivitiesApi } from '../api/publicActivitiesApi';

export const usePublicActivities = (limit = 6) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await publicActivitiesApi.listarPublicas();

      console.log('✅ Actividades públicas cargadas:', data);

      const actividades = data
        .slice(0, limit)
        .map(activity => ({
          id: activity.id,
          titulo: activity.titulo,
          descripcion: activity.descripcion,
          imagen: activity.bannerUrl ?? null,
          fechaInicio: activity.fechaInicio,
          fechaFin: activity.fechaFin,
          horaInicio: activity.horaInicio,
          horaFin: activity.horaFin,
          modalidad: activity.modalidad ?? 'PRESENCIAL',
          lugar: activity.ubicacion ?? '',
          vacantes: activity.vacantes ?? null,
          precio: activity.precio ?? 0,
          estado: activity.estado, // objeto { codigo, etiqueta }
          organizador: activity.coOrganizador ?? '',
          sesiones: activity.sesiones ?? [],
        }));

      setActivities(actividades);
    } catch (err) {
      console.error('❌ Error cargando actividades públicas:', err);
      setError('Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
};
