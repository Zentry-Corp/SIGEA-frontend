// src/features/activities/hooks/usePublicActivities.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { activitiesApi } from "../api/activitiesApi";

export const usePublicActivities = (options = {}) => {
  const {
    allowedStates = ["PUBLICADO", "EN_CURSO", "PENDIENTE"], // ajusta si quieres
    onlyAllowedStates = true,
  } = options;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await activitiesApi.listar();

      // backend a veces devuelve array directo o envuelto
      const list = Array.isArray(res) ? res : res?.extraData ?? res?.data ?? [];
      setActivities(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("❌ Error al listar actividades (public):", e);
      setError(e?.message || "Error cargando actividades");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filtered = useMemo(() => {
    if (!onlyAllowedStates) return activities;

    const allowed = new Set(allowedStates);
    return (activities || []).filter((a) => allowed.has(a?.estado?.codigo));
  }, [activities, allowedStates, onlyAllowedStates]);

  return {
    activities: filtered,
    allActivities: activities,
    loading,
    error,
    refetch: fetchActivities,
  };
};

export default usePublicActivities;
