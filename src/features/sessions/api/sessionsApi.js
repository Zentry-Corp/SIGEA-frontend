// src/features/sessions/api/sessionsApi.js
import { apiClient } from "../../../shared/api/apiClient";

export const sessionsApi = {
  // ➕ Crear sesión
  crear: async (data) => {
    try {
      const response = await apiClient.post("/sesiones/crear", data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear sesión:", error);
      throw error;
    }
  },

  // 📋 Listar sesiones
  listar: async () => {
    try {
      const response = await apiClient.get("/sesiones/listar");
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar sesiones:", error);
      throw error;
    }
  },

  // 🔍 Obtener sesión por ID
  obtener: async (id) => {
    try {
      const response = await apiClient.get(`/sesiones/obtener/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener sesión:", error);
      throw error;
    }
  },

  // ✏️ Actualizar sesión
  actualizar: async (id, data) => {
    try {
      const response = await apiClient.put(`/sesiones/actualizar/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar sesión:", error);
      console.error("❌ Response status:", error.response?.status);
      console.error(
        "❌ Response data (JSON):",
        JSON.stringify(error.response?.data, null, 2)
      );
      throw error;
    }
  },

  // 🗑️ Eliminar sesión
  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/sesiones/eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar sesión:", error);
      throw error;
    }
  },

  // 📋 Listar sesiones por actividad
  listarPorActividad: async (actividadId) => {
    try {
      // Usa el endpoint correcto con query param según Swagger
      const response = await apiClient.get("/sesiones/listar", {
        params: { actividadId },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar sesiones por actividad:", error);
      throw error;
    }
  },
};
