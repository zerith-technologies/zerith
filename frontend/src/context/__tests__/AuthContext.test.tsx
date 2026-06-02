import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { AuthProvider, useAuth } from '../AuthContext';
import { server } from '../../mocks/server';
import { MOCK_USER } from '../../mocks/handlers';

const BASE = 'http://localhost:8080/api/v1';

const AuthConsumer = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user-nome">{user?.nome ?? ''}</span>
      <button onClick={() => login(MOCK_USER.email, 'senha123')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

function renderAuth() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function noSession() {
  server.use(
    rest.get(`${BASE}/auth/me`, (_req, res, ctx) =>
      res(ctx.status(401), ctx.json({
        success: false, message: 'Não autenticado', data: null, timestamp: '',
      })),
    ),
  );
}

describe('AuthContext', () => {
  it('inicializa com usuário quando me() retorna sessão ativa', async () => {
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('user-nome').textContent).toBe(MOCK_USER.nome);
  });

  it('inicializa sem usuário quando me() retorna 401', async () => {
    noSession();
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-nome').textContent).toBe('');
  });

  it('login fluxo completo → user preenchido no contexto', async () => {
    noSession();
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authenticated').textContent).toBe('false');

    await userEvent.click(screen.getByText('login'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
      expect(screen.getByTestId('user-nome').textContent).toBe(MOCK_USER.nome);
    });
  });

  it('logout → limpa usuário do contexto', async () => {
    renderAuth();
    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'));

    await userEvent.click(screen.getByText('logout'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
      expect(screen.getByTestId('user-nome').textContent).toBe('');
    });
  });
});
