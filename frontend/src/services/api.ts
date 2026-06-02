// Cliente HTTP base do ZerithDash
// withCredentials: true é obrigatório — sem isso o cookie zerith_token não é enviado

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  timeout: 15_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Rejeita erros normalmente — o ProtectedRoute e o AuthContext tratam 401.
// Não redirecionar aqui: causaria loop infinito durante a inicialização do AuthContext
// (me() → 401 → redirect → recarga → me() → 401 → …).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;
