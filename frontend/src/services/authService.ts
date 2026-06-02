// Serviço de autenticação
// O JWT trafega como httpOnly cookie (zerith_token) — nunca exposto ao JS

import apiClient from './api';
import type { ApiResponse, User, LoginRequest, RegisterRequest } from '@/types';

interface AuthResponse {
  nome: string;
  email: string;
  role: User['role'];
}

function toUser(r: AuthResponse): User {
  return { nome: r.nome, email: r.email, role: r.role };
}

export async function login(req: LoginRequest): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', req);
  return toUser(data.data);
}

export async function register(req: RegisterRequest): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', req);
  return toUser(data.data);
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

// Verifica sessão ativa — lança erro se não autenticado
export async function me(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<AuthResponse>>('/auth/me');
  return toUser(data.data);
}
