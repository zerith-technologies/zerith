// Serviço de autenticação
// Comunicação com ZerithCore: POST /auth/login, POST /auth/logout, GET /auth/me

import apiClient from './api';
import type { LoginCredentials, AuthResponse, User, ApiResponse } from '@/types';

// Chaves usadas no localStorage
const TOKEN_KEY = 'zerith_token';
const USER_KEY  = 'zerith_user';

// -------------------------------------------------------
// Login — retorna usuário autenticado e persiste o token
// -------------------------------------------------------

export async function login(credentials: LoginCredentials): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);

  const { token, user } = data.data;

  // Persiste sessão localmente
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
}

// -------------------------------------------------------
// Logout — invalida sessão no backend e limpa localStorage
// -------------------------------------------------------

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    // Mesmo se o backend falhar, limpa a sessão local
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

// -------------------------------------------------------
// Recuperar usuário autenticado atual
// -------------------------------------------------------

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
  return data.data;
}

// -------------------------------------------------------
// Utilitários de sessão (sem chamada HTTP)
// -------------------------------------------------------

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
