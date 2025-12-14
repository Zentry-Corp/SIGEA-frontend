import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('sigea_token');

    // 🔍 DEBUG: Verificar si el token se está adjuntando
    console.log('🔐 [API Request]', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('🔐 Sesión expirada');

      sessionStorage.removeItem('sigea_token');
      sessionStorage.removeItem('sigea_user');

      // 🔥 NO redirigir aquí
      // React Router se encarga
    }

    return Promise.reject(error);
  }
);
