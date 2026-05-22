import axios from 'axios';

// Utiliser l'URL de l'API passée via les variables d'environnement Vite ou fallback sur localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le token JWT dans toutes les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services pour l'authentification
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Services pour la gestion des tâches (CRUD Todos)
export const todoService = {
  getAll: async () => {
    const response = await api.get('/todos');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },
  create: async (title) => {
    const response = await api.post('/todos', { title });
    return response.data;
  },
  update: async (id, title, completed) => {
    const response = await api.put(`/todos/${id}`, { title, completed });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  }
};

export default api;
