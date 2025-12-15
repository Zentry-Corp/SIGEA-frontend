import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationsApi } from '../api/notificationsApi';

const isUnread = (n) => {
  const codigo = n?.estadoNotificacion?.codigo || '';
  // Ajusta aquí si tu backend usa otro código
  return !String(codigo).toUpperCase().includes('LEID');
};

export const useMyNotifications = (usuarioId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!usuarioId) return;
    setLoading(true);
    setError('');

    try {
      const data = await notificationsApi.obtenerPorUsuario(usuarioId);
      const arr = Array.isArray(data) ? data : [];

      // orden: más reciente primero
      arr.sort((a, b) => String(b.fechaEnvio || '').localeCompare(String(a.fechaEnvio || '')));
      setItems(arr);
    } catch (e) {
      setError(e?.message || 'No se pudieron cargar tus notificaciones.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const unreadCount = useMemo(() => items.filter(isUnread).length, [items]);

  const marcarLeida = useCallback(async (id) => {
    if (!id) return;
    await notificationsApi.marcarLeida(id);
    await reload();
  }, [reload]);

  const marcarTodasLeidas = useCallback(async () => {
    if (!usuarioId) return;
    await notificationsApi.marcarTodasLeidas(usuarioId);
    await reload();
  }, [usuarioId, reload]);

  return { items, loading, error, reload, unreadCount, marcarLeida, marcarTodasLeidas };
};

export default useMyNotifications;
