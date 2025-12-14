import { useEffect, useState } from "react";
import { sessionsApi } from "../api/sessionsApi";

export const useSessionsByActivity = (activityId) => {
  const [sesiones, setSesiones] = useState([]); // 👈 SIEMPRE []
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activityId) return;

    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await sessionsApi.listarPorActividad(activityId);
        setSesiones(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error al cargar sesiones:", err);
        setError(err);
        setSesiones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [activityId]);

  return {
    sesiones,
    loading,
    error,
  };
};
