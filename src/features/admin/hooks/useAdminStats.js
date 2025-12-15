import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../api/adminAPI"; // [cite: 212]
import { processStats } from "../services/statsService"; // [cite: 448]
import { DEFAULT_STATS } from "../constants/dashboard.constants"; // [cite: 427]

export const useAdminStats = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.estadisticas();
      // AQUÍ USAMOS TU SERVICIO NUEVO para limpiar los datos
      const processed = processStats(res?.data); 
      setStats(processed);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
      setError("No se pudieron cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
};