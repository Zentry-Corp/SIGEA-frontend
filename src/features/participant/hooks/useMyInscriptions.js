import { useEffect, useState } from 'react';
import { inscriptionsApi } from '../api/inscriptionsApi';
import { eventsApi } from '../api/eventsApi';

export const useMyInscriptions = (usuarioId) => {
  const [items, setItems] = useState([]); // enriched
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = async () => {
    if (!usuarioId) return;

    setLoading(true);
    setError('');

    try {
      const inscripciones = await inscriptionsApi.obtenerPorUsuario(usuarioId);

      const actividadIds = Array.from(
        new Set((inscripciones || []).map((i) => i.actividadId).filter(Boolean))
      );

      const actividadesEntries = await Promise.all(
        actividadIds.map(async (id) => {
          try {
            // ✅ ahora sí existe (por alias) y dispara request real
            const act = await eventsApi.obtener(id);
            return [id, act];
          } catch (e) {
            console.error('❌ No se pudo obtener actividad:', id, e?.response?.status, e?.message);
            return [id, null];
          }
        })
      );

      const actividadesMap = new Map(actividadesEntries);

      const enriched = (inscripciones || []).map((insc) => ({
        ...insc,
        actividad: actividadesMap.get(insc.actividadId) || null,
      }));

      enriched.sort((a, b) =>
        String(b.fechaInscripcion || '').localeCompare(String(a.fechaInscripcion || ''))
      );

      setItems(enriched);
    } catch (e) {
      setError(e?.message || 'No se pudieron cargar tus inscripciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]);

  return { items, loading, error, reload };
};

export default useMyInscriptions;
