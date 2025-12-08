import { apiClient } from '../../../shared/api/apiClient';

export const authApi = {
  // Login
  login: async ({ email, password, rememberMe }) => {
    const response = await apiClient.post('/usuarios/auth/login', {
      correo: email,
      password: password,
      rememberMe: rememberMe,
    });

    if (response.data.status) {
      const { token, user } = response.data.extradata;
      sessionStorage.setItem('sigea_token', token);
      sessionStorage.setItem('sigea_user', JSON.stringify(user));
    }

    return response.data;
  },

  // Registro de participante
  register: async (userData) => {
    try {
      const response = await apiClient.post('/usuarios/participante/registrar', {
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        correo: userData.correo,
        password: userData.password,
        dni: userData.dni,
        telefono: userData.telefono,
        extentionTelefonica: userData.extentionTelefonica || '',
      });

      console.log('📥 Respuesta completa del backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en authApi.register:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  },

  // Enviar código de verificación
  sendVerificationCode: async (correo, nombres) => {
    try {
      // Según tu Swagger, los parámetros van en query string
      const response = await apiClient.post(
        `/usuarios/validar-correo/enviar-codigo-verificacion`,
        null, // No body
        {
          params: { correo, nombres } // Query params
        }
      );

      console.log('📧 Código enviado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al enviar código:', error);
      throw error;
    }
  },

  // Validar código de verificación
  validateVerificationCode: async (correo, codigo) => {
    try {
      const response = await apiClient.post(
        `/usuarios/validar-correo/validar-codigo-verificacion`,
        null, // No body
        {
          params: { correo, codigo } // Query params
        }
      );

      console.log('✅ Validación de código:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al validar código:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    sessionStorage.removeItem('sigea_token');
    sessionStorage.removeItem('sigea_user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = sessionStorage.getItem('sigea_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};