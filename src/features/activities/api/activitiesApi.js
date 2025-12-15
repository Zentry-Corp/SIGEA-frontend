// src/features/events/api/actividadesApi.js
import { apiClient } from '../../../shared/api/apiClient';

export const activitiesApi = {

  listar: async () => {
  try {
    const response = await apiClient.get('/actividades/listar');
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener actividades:", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      url: error?.config?.url,
    });
    throw error; // deja pasar el error real
  }
},



  obtener: async (id) => {
    try {
      const response = await apiClient.get(`/actividades/obtener/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener actividad:", error);
      throw error;
    }
  },

  crear: async (data) => {
    try {
      const response = await apiClient.post('/actividades/create', data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear actividad:", error);
      throw error;
    }
  },

  actualizar: async (id, data) => {
    try {
      const response = await apiClient.put(`/actividades/actualizar/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar actividad:", error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/actividades/eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar actividad:", error);
      throw error;
    }
  },

  listarTipos: async () => {
    try {
      const response = await apiClient.get('/tipos-actividad/listar');
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar tipos de actividad:", error);
      throw error;
    }
  },

  listarEstados: async () => {
    try {
      const response = await apiClient.get('/estados-actividad/listar');
      return response.data;
    } catch (error) {
      console.error("❌ Error al listar estados de actividad:", error);
      throw error;
    }
  },
};