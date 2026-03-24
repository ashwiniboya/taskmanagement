import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default client;

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    client.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    client.post('/auth/login', data),
  me: () => client.get('/auth/me'),
};

// Tasks API
export const tasksApi = {
  list: () => client.get('/tasks'),
  get: (id: string) => client.get(`/tasks/${id}`),
  create: (data: { title: string; description?: string; status?: string; dueDate?: string }) =>
    client.post('/tasks', data),
  update: (id: string, data: Partial<{ title: string; description: string; status: string; dueDate: string }>) =>
    client.put(`/tasks/${id}`, data),
  delete: (id: string) => client.delete(`/tasks/${id}`),
};
