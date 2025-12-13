// src/features/activities/hooks/useActivities.js

import { useState, useEffect, useCallback } from 'react';
import { activitiesApi } from '../api/activitiesApi';

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    tipo: 'todos',
    estado: 'todos',
    busqueda: '',
  });

  // Cargar datos iniciales
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [activitiesRes, tiposRes, estadosRes] = await Promise.all([
        activitiesApi.listar(),      // ← Cambio aquí
        activitiesApi.listarTipos(), // ← Cambio aquí
        activitiesApi.listarEstados(), // ← Cambio aquí
      ]);

      console.log('✅ Actividades recibidas:', activitiesRes);
      console.log('✅ Tipos recibidos:', tiposRes);
      console.log('✅ Estados recibidos:', estadosRes);

      // Las respuestas vienen directamente como arrays
      const activitiesData = Array.isArray(activitiesRes) ? activitiesRes : [];
      const tiposData = Array.isArray(tiposRes) ? tiposRes : [];
      const estadosData = Array.isArray(estadosRes) ? estadosRes : [];

      setActivities(activitiesData);
      setFilteredActivities(activitiesData);
      setTipos(tiposData);
      setEstados(estadosData);
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = [...activities];

    // Filtrar por tipo (usando tipoActividad.id)
    if (filters.tipo !== 'todos') {
      filtered = filtered.filter(
        (act) => act.tipoActividad?.id?.toString() === filters.tipo.toString()
      );
    }

    // Filtrar por estado (usando estado.codigo)
    if (filters.estado !== 'todos') {
      filtered = filtered.filter(
        (act) => act.estado?.codigo === filters.estado
      );
    }

    // Filtrar por búsqueda (titulo, descripcion)
    if (filters.busqueda.trim()) {
      const searchTerm = filters.busqueda.toLowerCase();
      filtered = filtered.filter(
        (act) =>
          act.titulo?.toLowerCase().includes(searchTerm) ||
          act.descripcion?.toLowerCase().includes(searchTerm) ||
          act.tipoActividad?.nombreActividad?.toLowerCase().includes(searchTerm)
      );
    }

    console.log('🔍 Actividades filtradas:', filtered);
    setFilteredActivities(filtered);
  }, [activities, filters]);

  // Actualizar filtro
  const updateFilter = useCallback((filterName, value) => {
    console.log(`🔧 Actualizando filtro: ${filterName} = ${value}`);
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    console.log('🧹 Limpiando filtros');
    setFilters({
      tipo: 'todos',
      estado: 'todos',
      busqueda: '',
    });
    setFilteredActivities(activities);
  }, [activities]);

  // Cargar datos al montar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    activities: filteredActivities,
    allActivities: activities,
    tipos,
    estados,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    refetch: fetchData,
  };
};

export default useActivities;