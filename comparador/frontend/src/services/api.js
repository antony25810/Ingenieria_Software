import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    // Log detallado para depuración
    console.error('API Error:', error.response || error);
    
    // Personalizar mensaje de error
    const customError = {
      message: error.response?.data?.detail || 'Error en la comunicación con el servidor',
      status: error.response?.status || 500,
      data: error.response?.data || {}
    };
    
    return Promise.reject(customError);
  }
);

export default api;