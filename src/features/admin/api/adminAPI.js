import { apiClient } from "../../../shared/api/apiClient";

export const adminApi = {
  // GET y POST funcionan bien, no los toques
  listarRoles: () => apiClient.get("/usuarios/administrador/listar-rol"),
  crearRol: (payload) => apiClient.post("/usuarios/administrador/crear-rol", payload),

  // 🔄 CORRECCIÓN PARA PUT:
  // Usamos 'params' porque fue lo único que te dio status:true antes.
actualizarRol: (id, payload) => {
    const mixedPayload = {
      // 1. camelCase
      nombreRol: payload.nombreRol,
      descripcion: payload.descripcion,
      // 2. snake_case
      nombre_rol: payload.nombreRol,
      // 3. Solo nombre
      nombre: payload.nombreRol,
      // 4. ID dentro del body
      id: id
    };
    return apiClient.put(`/usuarios/administrador/actualizar-rol/${id}`, mixedPayload);
  },

  eliminarRol: (id) => apiClient.delete(`/usuarios/administrador/eliminar-rol/${id}`),

  // USUARIOS
  listarUsuarios: () => apiClient.get("/usuarios/administrador/listar-usuarios"),
  crearUsuario: (payload) => apiClient.post("/usuarios/administrador/registrar", payload),

  // NUEVO PARA ROLES DE USUARIO
  // Aquí probamos envío normal JSON Body primero
  actualizarUsuario: (id, payload) => 
    apiClient.put(`/usuarios/administrador/actualizar-usuario/${id}`, payload),

  estadisticas: () => apiClient.get("/usuarios/administrador/estadisticas"),
};