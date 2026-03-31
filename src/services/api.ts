import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// CU-02: Interceptador para injetar o Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// CU-02: Se o Java der 401 (crachá vencido), limpa tudo e volta pro login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
