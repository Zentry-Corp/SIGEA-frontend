// src/features/participant/hooks/useMyCertificates.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { useMyInscriptions } from "./useMyInscriptions";
import { certificatesApi } from "../api/certificatesApi";

export const useMyCertificates = (usuarioId) => {
  const { items: inscriptions, loading: loadingInsc, error: errorInsc, reload: reloadInsc } =
    useMyInscriptions(String(usuarioId || ""));

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmedInscriptions = useMemo(() => {
    return (inscriptions || []).filter((i) => !!i?.confirmada && !!i?.id);
  }, [inscriptions]);

  const load = useCallback(async () => {
    if (!usuarioId) {
      setCertificates([]);
      return;
    }

    try {
      setError("");
      setLoading(true);

      // traemos certificados en paralelo; si uno falla no tumba todo
      const results = await Promise.allSettled(
        confirmedInscriptions.map((insc) => certificatesApi.obtenerPorInscripcion(insc.id))
      );

      const ok = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);

      setCertificates(ok);
    } catch (e) {
      setError(e?.message || "No se pudieron cargar tus certificados.");
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId, confirmedInscriptions]);

  useEffect(() => {
    // cuando terminen de cargar inscripciones, recién cargamos certificados
    if (!loadingInsc && !errorInsc) load();
  }, [loadingInsc, errorInsc, load]);

  const reload = useCallback(async () => {
    await reloadInsc();
    // el effect disparará load() luego
  }, [reloadInsc]);

  return {
    certificates,
    loading: loadingInsc || loading,
    error: errorInsc || error,
    reload,
    confirmedCount: confirmedInscriptions.length,
  };
};
