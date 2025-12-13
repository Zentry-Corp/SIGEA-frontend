// src/features/sessions/hooks/useCreateSession.js
import { useState } from 'react';
import { sessionsApi } from '../api/sessionsApi';

// Función para convertir "HH:MM" a "HH:MM:SS" (formato esperado por el backend)
const formatTimeForBackend = (timeString) => {
  if (!timeString) return null;
  // Si ya tiene segundos, devolverlo tal cual
  if (timeString.split(':').length === 3) return timeString;
  // Si solo tiene hora:minuto, agregar :00
  return `${timeString}:00`;
};

// Función para convertir "YYYY-MM-DD" a formato ISO con hora local
const dateToISO = (dateString) => {
  if (!dateString) return null;
  // Usar hora local (12:00:00) para evitar problemas de zona horaria
  // Esto asegura que la fecha no cambie al día anterior
  return `${dateString}T12:00:00`;
};

export const useCreateSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createSession = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      // Transformar datos al formato esperado por el backend
      const transformedPayload = {
        ...payload,
        horaInicio: formatTimeForBackend(payload.horaInicio),
        horaFin: formatTimeForBackend(payload.horaFin),
        fecha_sesion: dateToISO(payload.fecha_sesion)
      };

      console.log('📤 Payload original:', payload);
      console.log('📤 Payload transformado:', transformedPayload);

      const result = await sessionsApi.crear(transformedPayload);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSession,
  };
};