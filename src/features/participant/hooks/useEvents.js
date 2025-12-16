/* src/features/participant/hooks/useEvents.js  */
import { useEffect, useState } from 'react';
import { eventsApi } from '../api';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await eventsApi.listar();

        // Tu backend a veces responde array directo o envuelto.
        const list = Array.isArray(data) ? data : (data?.extraData ?? []);
        setEvents(list);
      } catch (e) {
        setError(e?.message || 'Error cargando eventos');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return { events, loading, error };
};

export default useEvents;
