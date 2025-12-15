import { useCallback, useEffect, useMemo, useState } from 'react';
import { attendancesApi } from '../api/attendancesApi';

export const useInscriptionAttendance = (inscripcionId, enabled = false) => {
  const [items, setItems] = useState([]); // AsistenciaResponse[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!inscripcionId) return;
    setLoading(true);
    setError('');

    try {
      const data = await attendancesApi.listarPorInscripcion(inscripcionId);
      const arr = Array.isArray(data) ? data : [];

      // orden: más reciente primero si viene registradoEn
      arr.sort((a, b) => String(b.registradoEn || '').localeCompare(String(a.registradoEn || '')));

      setItems(arr);
    } catch (e) {
      setError(e?.message || 'No se pudieron cargar tus asistencias.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [inscripcionId]);

  useEffect(() => {
    if (enabled) reload();
  }, [enabled, reload]);

  const stats = useMemo(() => {
    const total = items.length;
    const presentes = items.filter(x => x?.presente === true).length;
    const ausentes = items.filter(x => x?.presente === false).length;
    const pct = total > 0 ? Math.round((presentes / total) * 100) : 0;

    return { total, presentes, ausentes, pct };
  }, [items]);

  return { items, loading, error, reload, stats };
};

export default useInscriptionAttendance;
