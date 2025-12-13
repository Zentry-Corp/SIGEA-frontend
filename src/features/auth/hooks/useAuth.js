import { useState, useEffect } from 'react';
import {authApi} from "../api/authApi"; // si no lo tienes, ajusta ruta


export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

// login REAL usando authApi
const login = async ({ email, password, rememberMe }) => {
  try {
    const response = await authApi.login({
      email,
      password,
      rememberMe
    });

    // ❌ Backend indica error
    if (!response.status) {
      throw new Error(response.message || "Credenciales incorrectas");
    }

    const { accessToken } = response.extraData;

    if (!accessToken) {
      throw new Error("No se recibió el token de autenticación.");
    }

    const payload = parseJwt(accessToken);

    if (!payload) {
      throw new Error("No se pudo decodificar el token.");
    }

    const usuario = {
      correo: payload.sub,
      usuarioId: payload.usuarioId,
      rol: { nombre_rol: payload.roles?.[0] }
    };

    // 🟦 Guardar en sessionStorage como ya lo tenías
    sessionStorage.setItem("sigea_token", accessToken);
    sessionStorage.setItem("sigea_user", JSON.stringify(usuario));

    setToken(accessToken);
    setUser(usuario);

    return {
      success: true,
      usuario
    };

  } catch (error) {
    console.error("❌ Error LOGIN:", error);

    // ⛔ DEVOLVER ERROR PARA ALERTERROR
    return {
      success: false,
      error: error.message || "Error inesperado al iniciar sesión"
    };
  }
};




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

  // --- FIX CRÍTICO AQUÍ ---
  // Evitar errores cuando storedUser es null, vacío o "undefined"
  if (!storedUser || storedUser === "undefined" || storedUser === "\"undefined\"") {
    console.error("⚠️ [useAuth] Usuario inválido en sessionStorage. Limpiando...");
    sessionStorage.removeItem("sigea_user");
    setUser(null);
    return;
  }

  let parsedUser = null;
  try {
    parsedUser = JSON.parse(storedUser);
  } catch (e) {
    console.error("⚠️ [useAuth] JSON corrupto. Limpiando...", e);
    sessionStorage.removeItem("sigea_user");
    setUser(null);
    return;
  }

  console.log("👤 [useAuth] Usuario parseado:", parsedUser);
  setUser(parsedUser);
}
 else {
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
    login,
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