import { useEffect, useState } from 'react';
import { sessionsApi } from '../api/sessionsApi';

export const useSessionsByActivity = (actividadId) => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!actividadId) return;

    const fetch = async () => {
      try {
        const data = await sessionsApi.listarPorActividad(actividadId);
        setSesiones(data);
      } catch (err) {
        console.error('❌ Error al cargar sesiones:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [actividadId]);

  return { sesiones, loading, error };
};
