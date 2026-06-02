import { rest, RestContext, RestRequest, ResponseComposition } from 'msw';
import type { UserRole, TipoVeiculo, StatusVeiculo } from '@/types';

const BASE = 'http://localhost:8080/api/v1';

export const MOCK_USER = {
  nome: 'Italo Antonio',
  email: 'italo@zerith.dev',
  role: 'ADMIN' as UserRole,
};

export const MOCK_VEHICLE = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  placa: 'ABC1D23',
  apelido: 'Frota 01',
  marca: 'BYD',
  modelo: 'Dolphin',
  ano: 2023,
  tipo: 'CARRO' as TipoVeiculo,
  status: 'ATIVO' as StatusVeiculo,
  odometroKm: 12345,
  criadoEm: '2024-01-01T00:00:00',
  atualizadoEm: '2024-01-15T00:00:00',
};

type Handler = (
  _req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext,
) => ReturnType<ResponseComposition>;

function apiOk<T>(data: T): Handler {
  return (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ success: true, message: 'OK', data, timestamp: '' }));
}

function apiErr(message: string, status: number): Handler {
  return (_req, res, ctx) =>
    res(ctx.status(status), ctx.json({ success: false, message, data: null, timestamp: '' }));
}

export const handlers = [
  rest.post(`${BASE}/auth/login`, async (req, res, ctx) => {
    const body = await req.json() as { email: string; senha: string };
    if (body.email === MOCK_USER.email && body.senha === 'senha123') {
      return res(ctx.status(200), ctx.json({ success: true, message: 'OK', data: MOCK_USER, timestamp: '' }));
    }
    return res(ctx.status(401), ctx.json({ success: false, message: 'Credenciais inválidas', data: null, timestamp: '' }));
  }),

  rest.post(`${BASE}/auth/logout`, apiOk(null)),

  rest.get(`${BASE}/auth/me`, apiOk(MOCK_USER)),

  rest.get(`${BASE}/veiculos`, apiOk([MOCK_VEHICLE])),

  rest.get(`${BASE}/veiculos/:id`, (req, res, ctx) => {
    const { id } = req.params;
    if (id === MOCK_VEHICLE.id) {
      return res(ctx.status(200), ctx.json({ success: true, message: 'OK', data: MOCK_VEHICLE, timestamp: '' }));
    }
    return res(ctx.status(404), ctx.json({ success: false, message: 'Não encontrado', data: null, timestamp: '' }));
  }),
];
