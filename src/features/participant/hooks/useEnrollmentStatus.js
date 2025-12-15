// src/features/participant/hooks/useEnrollmentStatus.js
import { useEffect, useMemo, useState } from 'react';
import { inscriptionsApi } from '../api/inscriptionsApi';

export const useEnrollmentStatus = ({ usuarioId, actividadId }) => {
  const [loading, setLoading] = useState(true);
  const [inscripcion, setInscripcion] = useState(null);
  const [error, setError] = useState('');

  const reload = async () => {
    if (!usuarioId || !actividadId) {
      setLoading(false);
      setInscripcion(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const list = await inscriptionsApi.obtenerPorUsuario(String(usuarioId));
      const found = (list || []).find((i) => String(i.actividadId) === String(actividadId)) || null;
      setInscripcion(found);
    } catch (e) {
      setError(e?.message || 'No se pudo verificar tu inscripción.');
      setInscripcion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId, actividadId]);

  const status = useMemo(() => {
    if (!inscripcion) return { key: 'NONE', label: 'No inscrito' };
    if (inscripcion.cancelada) return { key: 'CANCELADA', label: 'Cancelada' };
    if (inscripcion.confirmada) return { key: 'CONFIRMADA', label: 'Confirmada' };
    if (inscripcion.pendiente) return { key: 'PENDIENTE', label: 'Pendiente' };
    const code = inscripcion?.estado?.codigo || '';
    return { key: code || 'INSCRITO', label: inscripcion?.estado?.etiqueta || 'Inscrito' };
  }, [inscripcion]);

  return { loading, inscripcion, status, error, reload };
};
