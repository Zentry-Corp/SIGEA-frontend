// src/features/attendance/hooks/useAttendance.js
import { useState, useCallback } from 'react';
import { attendanceApi } from '../api/attendanceApi';

/**
 * Hook para gestionar asistencias de una sesión
 * @param {string} sesionId - ID de la sesión
 */
export const useAttendance = (sesionId) => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 📋 Obtener lista de asistencias por sesión
    const fetchAsistencias = useCallback(async () => {
        if (!sesionId) {
            console.warn('⚠️ No sesionId provided');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`📤 Obteniendo asistencias de sesión ${sesionId}`);
            const data = await attendanceApi.listarPorSesion(sesionId);
            console.log('📥 Asistencias obtenidas:', data);
            setAsistencias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Error en fetchAsistencias:', err);
            setError(err.message);
            setAsistencias([]);
        } finally {
            setLoading(false);
        }
    }, [sesionId]);

    // 📋 Obtener solo los presentes
    const fetchPresentes = useCallback(async () => {
        if (!sesionId) return;

        setLoading(true);
        setError(null);

        try {
            console.log(`📤 Obteniendo presentes de sesión ${sesionId}`);
            const data = await attendanceApi.listarPresentesPorSesion(sesionId);
            console.log('📥 Presentes obtenidos:', data);
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('❌ Error en fetchPresentes:', err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [sesionId]);

    // ✅ Registrar asistencia individual
    const registrarAsistencia = useCallback(async (inscripcionId, presente = true) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                sesionId,
                inscripcionId,
                presente
            };
            console.log('📤 Registrando asistencia:', payload);
            const result = await attendanceApi.registrar(payload);
            console.log('✅ Asistencia registrada:', result);
            return result;
        } catch (err) {
            console.error('❌ Error al registrar asistencia:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [sesionId]);

    // ✅ Registrar asistencia masiva
    const registrarAsistenciaMasiva = useCallback(async (asistenciasData) => {
        if (!sesionId) {
            throw new Error('No se ha especificado la sesión');
        }

        setLoading(true);
        setError(null);

        try {
            // Formato esperado por el backend:
            // { sesionId, registrarAsistenciaItemRequestDTOs: [{ inscripcionId, presente, registradoEn? }] }
            const payload = {
                sesionId,
                registrarAsistenciaItemRequestDTOs: asistenciasData.map(item => ({
                    inscripcionId: item.inscripcionId,
                    presente: item.presente ?? true,
                    registradoEn: item.registradoEn || new Date().toISOString()
                }))
            };

            console.log('📤 Registrando asistencia masiva:', payload);
            const result = await attendanceApi.registrarMasivo(payload);
            console.log('✅ Asistencia masiva registrada:', result);
            return result;
        } catch (err) {
            console.error('❌ Error al registrar asistencia masiva:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [sesionId]);

    // ✏️ Actualizar asistencia
    const actualizarAsistencia = useCallback(async (asistenciaId, presente) => {
        setLoading(true);
        setError(null);

        try {
            console.log(`📤 Actualizando asistencia ${asistenciaId}:`, { presente });
            const result = await attendanceApi.actualizar(asistenciaId, { presente });
            console.log('✅ Asistencia actualizada:', result);
            return result;
        } catch (err) {
            console.error('❌ Error al actualizar asistencia:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔄 Toggle asistencia (marcar/desmarcar presente)
    const toggleAsistencia = useCallback(async (asistenciaId, currentPresente) => {
        return actualizarAsistencia(asistenciaId, !currentPresente);
    }, [actualizarAsistencia]);

    return {
        asistencias,
        loading,
        error,
        fetchAsistencias,
        fetchPresentes,
        registrarAsistencia,
        registrarAsistenciaMasiva,
        actualizarAsistencia,
        toggleAsistencia
    };
};
