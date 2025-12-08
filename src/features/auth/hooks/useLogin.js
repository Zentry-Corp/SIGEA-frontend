import { useState } from 'react';
import { authApi } from '../api/authApi';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await authApi.login(credentials);
      
      if (data.status) {
        authApi.saveSession(data);
        return { success: true, data };
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Error al conectar con el servidor';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};