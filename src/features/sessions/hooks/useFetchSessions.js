// src/features/sessions/hooks/useFetchSessions.js
import { useState, useCallback } from 'react';
import { sessionsApi } from '../api/sessionsApi';

// Función para convertir hora a formato "HH:MM"
// Soporta: objeto {hour, minute}, string "HH:MM:SS" o "HH:MM", array [HH, MM, SS]
const timeToString = (timeValue) => {
  if (!timeValue) return '';

  // Si ya es string en formato correcto, devolverlo (tomando solo HH:MM)
  if (typeof timeValue === 'string') {
    // Formato "HH:MM" o "HH:MM:SS"
    const parts = timeValue.split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return timeValue;
  }

  // Si es array [hour, minute, second, nano] (formato Java LocalTime serializado)
  if (Array.isArray(timeValue)) {
    const hour = String(timeValue[0] || 0).padStart(2, '0');
    const minute = String(timeValue[1] || 0).padStart(2, '0');
    return `${hour}:${minute}`;
  }

  // Si es objeto { hour, minute, second, nano }
  if (typeof timeValue === 'object') {
    const hour = String(timeValue.hour || 0).padStart(2, '0');
    const minute = String(timeValue.minute || 0).padStart(2, '0');
    return `${hour}:${minute}`;
  }

  return '';
};

// Función para convertir fecha a formato "YYYY-MM-DD"
// Soporta: string ISO, string "YYYY-MM-DD", array [year, month, day], objeto {year, month, day}
const dateToString = (dateValue) => {
  if (!dateValue) return '';

  console.log('🗓️ Procesando fecha:', dateValue, typeof dateValue);

  // Si ya es string en formato correcto YYYY-MM-DD
  if (typeof dateValue === 'string') {
    // Si ya tiene formato YYYY-MM-DD, devolverlo
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // Intentar parsear como ISO
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch {
      return dateValue;
    }
  }

  // Si es array [year, month, day] (formato Java LocalDate serializado)
  if (Array.isArray(dateValue)) {
    const year = dateValue[0];
    const month = String(dateValue[1] || 1).padStart(2, '0');
    const day = String(dateValue[2] || 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Si es objeto { year, month, day } o { year, monthValue, dayOfMonth } (Java LocalDate)
  if (typeof dateValue === 'object' && dateValue !== null) {
    const year = dateValue.year;
    const month = dateValue.month || dateValue.monthValue;
    const day = dateValue.day || dateValue.dayOfMonth;
    if (year && month && day) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  return '';
};

export const useFetchSessions = (actividadId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    if (!actividadId) {
      console.warn('⚠️ No actividadId provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`📤 Obteniendo sesiones de actividad ${actividadId}`);

      const data = await sessionsApi.listarPorActividad(actividadId);
      console.log('📥 Sesiones obtenidas:', data);

      // Transformar datos del backend al formato del formulario (camelCase)
      const transformedSessions = Array.isArray(data)
        ? data.map(session => {
          // El backend ahora usa camelCase: fechaSesion, linkVirtual
          const rawFecha = session.fechaSesion || session.fecha_sesion || session.fecha;

          return {
            ...session,
            horaInicio: timeToString(session.horaInicio),
            horaFin: timeToString(session.horaFin),
            fechaSesion: dateToString(rawFecha),
            linkVirtual: session.linkVirtual || session.link_virtual || ''
          };
        })
        : [];

      setSessions(transformedSessions);

    } catch (err) {
      console.error('❌ Error en fetchSessions:', err);
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [actividadId]);

  return {
    sessions,
    loading,
    error,
    fetchSessions
  };
};