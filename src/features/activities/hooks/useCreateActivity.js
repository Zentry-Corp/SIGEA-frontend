import { useState, useEffect } from 'react';
import { activitiesApi } from '../api/activitiesApi';

export const useCreateActivity = () => {
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMetadata = async () => {
    try {
      const [tiposRes, estadosRes] = await Promise.all([
        activitiesApi.listarTipos(),
        activitiesApi.listarEstados(),
      ]);

      setTipos(tiposRes);
      setEstados(estadosRes);
    } catch (err) {
      setError(err.message);
    }
  };

  const createActivity = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await activitiesApi.crear(payload);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  return {
    tipos,
    estados,
    loading,
    error,
    createActivity,
  };
};
