/* src/features/participant/hooks/eventdetail.js */
import { useEffect, useState } from 'react';
import { eventsApi } from '../api';

export const useEventDetail = (id) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        const data = await eventsApi.obtenerPorId(id);
        setEvent(data?.extraData ?? data);
      } catch (e) {
        setError(e?.message || 'Error cargando detalle');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  return { event, loading, error };
};

export default useEventDetail;
