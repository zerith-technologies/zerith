import { describe, it, expect } from 'vitest';
import { rest } from 'msw';
import * as authService from '../authService';
import { server } from '../../mocks/server';
import { MOCK_USER } from '../../mocks/handlers';

const BASE = 'http://localhost:8080/api/v1';

describe('authService', () => {
  describe('login', () => {
    it('retorna usuário com credenciais corretas', async () => {
      const user = await authService.login({ email: MOCK_USER.email, senha: 'senha123' });
      expect(user.nome).toBe(MOCK_USER.nome);
      expect(user.email).toBe(MOCK_USER.email);
      expect(user.role).toBe(MOCK_USER.role);
    });

    it('lança erro com credenciais erradas', async () => {
      await expect(
        authService.login({ email: 'errado@test.com', senha: 'errada' }),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('chama o endpoint de logout sem lançar erro', async () => {
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });

  describe('me', () => {
    it('retorna usuário da sessão ativa', async () => {
      const user = await authService.me();
      expect(user.email).toBe(MOCK_USER.email);
      expect(user.nome).toBe(MOCK_USER.nome);
    });

    it('lança erro quando não há sessão ativa (401)', async () => {
      server.use(
        rest.get(`${BASE}/auth/me`, (_req, res, ctx) =>
          res(ctx.status(401), ctx.json({
            success: false, message: 'Não autenticado', data: null, timestamp: '',
          })),
        ),
      );
      await expect(authService.me()).rejects.toThrow();
    });
  });
});
