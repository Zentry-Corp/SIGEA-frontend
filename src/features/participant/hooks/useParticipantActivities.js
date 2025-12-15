import { useEffect, useState } from 'react';
import { activitiesApi } from '../../activities/api/activitiesApi';

export const useParticipantActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await activitiesApi.listar();
        setActivities(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('❌ Error al listar actividades (participante):', e);
        setError('No se pudieron cargar los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};
