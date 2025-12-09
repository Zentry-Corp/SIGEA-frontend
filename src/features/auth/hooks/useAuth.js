import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedToken = sessionStorage.getItem('sigea_token');
      const storedUser = sessionStorage.getItem('sigea_user');

      console.log('🔍 [useAuth] Verificando autenticación...');
      console.log('🎫 [useAuth] Token en sessionStorage:', storedToken ? 'SÍ' : 'NO');
      console.log('👤 [useAuth] Usuario en sessionStorage:', storedUser ? 'SÍ' : 'NO');

      if (storedToken) {
        setToken(storedToken);
        
        // Si hay usuario guardado, usarlo
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('👤 [useAuth] Usuario parseado:', parsedUser);
          setUser(parsedUser);
        } else {
          // Si no hay usuario pero hay token, decodificar JWT
          console.log('⚠️ [useAuth] No hay usuario guardado, decodificando token...');
          const payload = parseJwt(storedToken);
          console.log('📦 [useAuth] Payload del token:', payload);
          
          // Crear objeto usuario desde el token
          const userFromToken = {
            correo: payload?.sub || '',
            rol: { nombre_rol: payload?.roles?.[0] || '' },
            usuarioId: payload?.usuarioId || '',
          };
          console.log('👤 [useAuth] Usuario creado desde token:', userFromToken);
          setUser(userFromToken);
        }
      } else {
        console.log('❌ [useAuth] No hay token, usuario NO autenticado');
      }
    } catch (error) {
      console.error('❌ [useAuth] Error al verificar autenticación:', error);
    } finally {
      setLoading(false);
      console.log('✅ [useAuth] Verificación completada');
    }
  };

  const logout = () => {
    console.log('🚪 [useAuth] Cerrando sesión...');
    sessionStorage.removeItem('sigea_token');
    sessionStorage.removeItem('sigea_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const role = user?.rol?.nombre_rol || null;

  console.log('📊 [useAuth] Estado actual:', {
    isAuthenticated,
    role,
    loading,
    hasUser: !!user,
    hasToken: !!token
  });

  return {
    user,
    token,
    loading,
    isAuthenticated,
    role,
    logout,
    checkAuth,
  };
};

// Helper para decodificar JWT
const parseJwt = (token) => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};

export default useAuth;