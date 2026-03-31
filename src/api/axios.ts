import axios from 'axios';

// Cria a instância base apontando para o seu Java (Porta 8080)
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR DE REQUISIÇÃO: Antes de sair do Front-end
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Se tem token e a rota não é de login, injeta o crachá!
    if (token && config.url && !config.url.includes('/auth/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR DE RESPOSTA: Quando volta do Java
api.interceptors.response.use(
  (response) => response, // Se deu 200 OK, passa direto
  (error) => {
    // Se o Java gritar 401 (Não Autorizado) ou 403 (Proibido)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('🚨 Erro na rota: ' + error.config.url + ' Status: ' + error.response.status);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // Força o recarregamento da página para voltar ao Login
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default api;
