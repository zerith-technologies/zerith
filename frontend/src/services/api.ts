// Cliente HTTP base do ZerithDash
// Todas as chamadas à API passam por aqui — nunca use fetch/axios diretamente nas páginas

import axios from 'axios';

// -------------------------------------------------------
// Configuração base
// -------------------------------------------------------

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// -------------------------------------------------------
// Interceptor de requisição — injeta o token JWT
// -------------------------------------------------------

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zerith_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// -------------------------------------------------------
// Interceptor de resposta — trata erros globais
// -------------------------------------------------------

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado ou inválido — limpa sessão e redireciona
    if (error.response?.status === 401) {
      localStorage.removeItem('zerith_token');
      localStorage.removeItem('zerith_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
