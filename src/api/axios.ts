import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: injeta header x-demo-user em todas as requisições
api.interceptors.request.use((config) => {
  const demoUser = localStorage.getItem('demoUser');
  if (demoUser) {
    config.headers['x-demo-user'] = demoUser;
  }
  return config;
});

// Interceptor: trata 401 redirecionando para tela de perfil
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('demoUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default api;
