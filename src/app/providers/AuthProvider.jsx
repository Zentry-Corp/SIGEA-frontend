import { createContext, useContext, useEffect, useState } from 'react';

// Utils
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error al decodificar JWT:', err);
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const storedToken = sessionStorage.getItem('sigea_token');
    const storedUser = sessionStorage.getItem('sigea_user');

    if (storedToken) {
      setToken(storedToken);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const payload = parseJwt(storedToken);
        if (payload) {
          const tempUser = {
            correo: payload?.sub,
            rol: { nombre_rol: payload?.roles?.[0] },
            usuarioId: payload?.usuarioId,
          };
          setUser(tempUser);
          sessionStorage.setItem('sigea_user', JSON.stringify(tempUser));
        }
      }
    }

    setLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem('sigea_token');
    sessionStorage.removeItem('sigea_user');
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        role: user?.rol?.nombre_rol || null,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
