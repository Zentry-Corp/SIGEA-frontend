// src/features/sessions/hooks/useUpdateSession.js
import { useState } from 'react';
import { sessionsApi } from '../api/sessionsApi';

// Función para convertir "HH:MM" a "HH:MM:SS" (formato string esperado por el backend)
const timeStringToHHMMSS = (timeString) => {
  if (!timeString) return null;
  if (timeString.split(':').length === 3) return timeString;
  return `${timeString}:00`;
};

// Función para convertir "YYYY-MM-DD" a formato ISO con hora local
const dateToISO = (dateString) => {
  if (!dateString) return null;
  return `${dateString}T12:00:00`;
};

export const useUpdateSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSession = async (sessionId, sessionData) => {
    setLoading(true);
    setError(null);

    try {
      // Transformar datos al formato esperado por el backend PUT /sesiones/actualizar/{id}
      // Campos: actividadId, titulo, descripcion, ponente, modalidad, linkVirtual, orden, 
      //         fechaSesion, lugarSesion, horaInicio, horaFin
      const transformedData = {
        actividadId: sessionData.actividadId,
        titulo: sessionData.titulo,
        descripcion: sessionData.descripcion,
        ponente: sessionData.ponente,
        modalidad: sessionData.modalidad,
        orden: sessionData.orden,
        lugarSesion: sessionData.lugarSesion || '',
        // Campos que requieren transformación
        horaInicio: timeStringToHHMMSS(sessionData.horaInicio),
        horaFin: timeStringToHHMMSS(sessionData.horaFin),
        fechaSesion: dateToISO(sessionData.fechaSesion || sessionData.fecha_sesion),
        linkVirtual: sessionData.linkVirtual || sessionData.link_virtual || ''
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