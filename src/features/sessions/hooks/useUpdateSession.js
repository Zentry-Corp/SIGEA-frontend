// src/features/sessions/hooks/useUpdateSession.js
import { useState } from 'react';
import { sessionsApi } from '../api/sessionsApi';

// Función para convertir "HH:MM" a "HH:MM:SS" (formato string esperado por el backend)
const timeStringToHHMMSS = (timeString) => {
  if (!timeString) return null;
  if (timeString.split(':').length === 3) return timeString;
  return `${timeString}:00`;
};

// Función para convertir fecha a formato ISO esperado por el backend
// Soporta: "YYYY-MM-DD", "YYYY-MM-DDTHH:MM:SS", ISO completo, etc.
const dateToISO = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
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
        titulo: sessionData.titulo,
        descripcion: sessionData.descripcion,
        ponente: sessionData.ponente,
        modalidad: sessionData.modalidad,
        orden: String(sessionData.orden),
        horaInicio: timeStringToHHMMSS(sessionData.horaInicio),
        horaFin: timeStringToHHMMSS(sessionData.horaFin),
        fechaSesion: dateToISO(sessionData.fechaSesion),
      };

      if (sessionData.modalidad === 'PRESENCIAL') {
        transformedData.lugarSesion = sessionData.lugarSesion;
      }

      if (sessionData.modalidad === 'VIRTUAL') {
        transformedData.linkVirtual = sessionData.linkVirtual;
      }

      if (sessionData.modalidad === 'HIBRIDA') {
        transformedData.lugarSesion = sessionData.lugarSesion;
        transformedData.linkVirtual = sessionData.linkVirtual;
      }

      Object.keys(transformedData).forEach(
        key => transformedData[key] == null && delete transformedData[key]
      );

      console.log('🧪 PAYLOAD FINAL UPDATE:', JSON.stringify(transformedData, null, 2));


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