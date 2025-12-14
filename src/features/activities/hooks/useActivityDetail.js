// src/features/activities/hooks/useActivityDetail.js

import { useState, useEffect } from 'react';
import { activitiesApi } from '../api/activitiesApi';

export const useActivityDetail = (activityId) => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!activityId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await activitiesApi.getById(activityId);
        console.log('✅ Detalle de actividad:', response);
        setActivity(response.data || response);
      } catch (err) {
        console.error('❌ Error al obtener detalle:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  return { activity, loading, error };
};

export default useActivityDetail;