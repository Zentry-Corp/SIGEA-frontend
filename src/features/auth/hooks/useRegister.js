import { useState } from 'react';
import { authApi } from '../api/authApi';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.register(userData);

      console.log('📥 Respuesta del registro:', response);

      // Verificar si el registro fue exitoso
      if (response.status === true || response.status === 'true') {
        return { 
          success: true, 
          data: response,
          message: response.message || 'Registro exitoso'
        };
      } else {
        const errorMsg = response.message || 'Error al registrar usuario';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('❌ Error capturado en useRegister:', err);
      
      // Manejo detallado de errores
      let errorMessage = 'Error al conectar con el servidor';

      if (err.response) {
        // El servidor respondió con un error
        console.error('📛 Error del servidor:', err.response.data);
        
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};