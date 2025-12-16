import { apiClient } from "../../../shared/api/apiClient";

export const adminApi = {
  // GET y POST se quedan igual (ya tienen la URL correcta gracias a tu baseURL)
  listarRoles: () => apiClient.get("/usuarios/administrador/listar-rol"),
  crearRol: (payload) => apiClient.post("/usuarios/administrador/crear-rol", payload),

  // 🔄 CORRECCIÓN: Limpiamos el payload.
actualizarRol: (id, payload) => {
    // Intentamos enviar el ID explícitamente dentro del body
    // Algunos frameworks de seguridad fallan si no detectan el ID en el payload
    const cleanPayload = {
      id: id, 
      nombreRol: payload.nombreRol,
      descripcion: payload.descripcion
    };
    return apiClient.post(`/usuarios/administrador/actualizar-rol/${id}`, cleanPayload);
  },

  eliminarRol: (id) => apiClient.delete(`/usuarios/administrador/eliminar-rol/${id}`),

  // USUARIOS
  listarUsuarios: () => apiClient.get("/usuarios/administrador/listar-usuarios"),
  // ... resto del archivo igual
  crearUsuario: (payload) => apiClient.post("/usuarios/administrador/registrar", payload),
  actualizarUsuario: (id, payload) => apiClient.put(`/usuarios/administrador/actualizar-usuario/${id}`, payload),
  estadisticas: () => apiClient.get("/usuarios/administrador/estadisticas"),
};