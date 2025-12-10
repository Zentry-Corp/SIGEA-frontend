import axios from 'axios';

// Crear instancia de Axios
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request
apiClient.interceptors.request.use(
  (config) => {
    
    const token = sessionStorage.getItem('sigea_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const url = error.config?.url;

    console.error('❌ Response error:', status || 'sin status', url || 'URL desconocida');
    console.error('❌ Error data:', data || error.message);

    if (status === 401) {
      sessionStorage.removeItem('sigea_token');
      sessionStorage.removeItem('sigea_user');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);
