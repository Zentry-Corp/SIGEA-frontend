// src/features/sessions/hooks/useUpdateSession.js
import { useState } from 'react';
import { sessionsApi } from '../api/sessionsApi';

// Función para convertir "HH:MM" a objeto { hour, minute, second, nano }
const timeStringToObject = (timeString) => {
  if (!timeString) return null;
  const [hour, minute] = timeString.split(':').map(Number);
  return {
    hour: hour || 0,
    minute: minute || 0,
    second: 0,
    nano: 0
  };
};

// Función para convertir "YYYY-MM-DD" a formato ISO completo
const dateToISO = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString + 'T00:00:00.000Z');
  return date.toISOString();
};

export const useUpdateSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSession = async (sessionId, sessionData) => {
    setLoading(true);
    setError(null);

    try {
      // Transformar datos al formato esperado por el backend
      const transformedData = {
        ...sessionData,
        horaInicio: timeStringToObject(sessionData.horaInicio),
        horaFin: timeStringToObject(sessionData.horaFin),
        fecha_sesion: dateToISO(sessionData.fecha_sesion)
      };

      console.log(`📝 Actualizando sesión ${sessionId}:`, transformedData);
      const result = await sessionsApi.actualizar(sessionId, transformedData);
      console.log('📥 Respuesta actualizar sesión:', result);
      return result;
    } catch (err) {
      console.error('❌ Error en updateSession:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateSession,
    loading,
    error
  };
};