// src/features/sessions/hooks/useDeleteSession.js
import { useState } from 'react';
import { sessionsApi } from '../api/sessionsApi';

export const useDeleteSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteSession = async (sessionId) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🗑️ Eliminando sesión ${sessionId}`);
      await sessionsApi.eliminar(sessionId);
      console.log('✅ Sesión eliminada exitosamente');
      return true;
    } catch (err) {
      console.error('❌ Error en deleteSession:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteSession,
    loading,
    error
  };
};