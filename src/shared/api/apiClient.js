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
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    console.log('📤 Data:', config.data);
    console.log('📤 Params:', config.params);
    
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
    console.log('📥 Response:', response.status, response.config.url);
    console.log('📥 Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.config?.url);
    console.error('❌ Error data:', error.response?.data);
    
    if (error.response?.status === 401) {
      sessionStorage.removeItem('sigea_token');
      sessionStorage.removeItem('sigea_user');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);