// src/features/attendance/api/attendanceApi.js
import { apiClient } from '../../../shared/api/apiClient';

export const attendanceApi = {
    // ✅ Registrar asistencia individual
    registrar: async (data) => {
        try {
            const response = await apiClient.post('/asistencias/registrar', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al registrar asistencia:', error);
            throw error;
        }
    },

    // ✅ Registrar asistencia masiva (múltiples participantes a la vez)
    registrarMasivo: async (data) => {
        try {
            // Endpoint: POST /api/v1/usuarios/organizador/registrar-asistencia
            // Body: { sesionId, registrarAsistenciaItemRequestDTOs: [{ inscripcionId, presente, registradoEn }] }
            const response = await apiClient.post('/usuarios/organizador/registrar-asistencia', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al registrar asistencia masiva:', error);
            throw error;
        }
    },

    // 📋 Listar asistencias por sesión
    listarPorSesion: async (sesionId) => {
        try {
            const response = await apiClient.get(`/asistencias/listar/sesion/${sesionId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error al listar asistencias por sesión:', error);
            throw error;
        }
    },

    // 📋 Listar presentes por sesión
    listarPresentesPorSesion: async (sesionId) => {
        try {
            const response = await apiClient.get(`/asistencias/listar/sesion/${sesionId}/presentes`);
            return response.data;
        } catch (error) {
            console.error('❌ Error al listar presentes por sesión:', error);
            throw error;
        }
    },

    // 📋 Listar asistencias por inscripción
    listarPorInscripcion: async (inscripcionId) => {
        try {
            const response = await apiClient.get(`/asistencias/listar/inscripcion/${inscripcionId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error al listar asistencias por inscripción:', error);
            throw error;
        }
    },

    // 🔍 Obtener asistencia por ID
    obtener: async (id) => {
        try {
            const response = await apiClient.get(`/asistencias/obtener/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener asistencia:', error);
            throw error;
        }
    },

    // ✏️ Actualizar asistencia
    actualizar: async (id, data) => {
        try {
            const response = await apiClient.put(`/asistencias/actualizar/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar asistencia:', error);
            throw error;
        }
    },
};
