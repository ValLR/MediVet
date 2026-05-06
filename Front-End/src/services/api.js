import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const { access } = JSON.parse(userData);
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
