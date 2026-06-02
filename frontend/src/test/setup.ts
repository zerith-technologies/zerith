import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { server } from '../mocks/server';

// Impede que o interceptor de 401 do axios tente navegar no jsdom
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: 'http://localhost/', assign: vi.fn(), replace: vi.fn() },
});

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
