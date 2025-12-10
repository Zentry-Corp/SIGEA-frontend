// src/features/events/api/actividadesApi.js
import { apiClient } from '../../../shared/api/apiClient';

export const actividadesApi = {
  // Listar actividades
  listar: () => apiClient.get('/actividades/listar'),
  
  // Obtener actividad por ID
  obtener: (id) => apiClient.get(`/actividades/obtener/${id}`),
  
  // Crear actividad
  crear: (data) => apiClient.post('/actividades/create', data),
  
  // Actualizar actividad
  actualizar: (id, data) => apiClient.put(`/actividades/actualizar/${id}`, data),
  
  // Eliminar actividad
  eliminar: (id) => apiClient.delete(`/actividades/eliminar/${id}`),
  
  // Listar tipos de actividad
  listarTipos: () => apiClient.get('/tipos-actividad/listar'),
  
  // Listar estados de actividad
  listarEstados: () => apiClient.get('/estados-actividad/listar'),
};