// Serviço de alertas (frontend-only por enquanto — sem endpoint no backend)

import type { Alert, AlertStatus } from '@/types';

// Tipagem para quando o endpoint existir
export type { Alert, AlertStatus };

// Placeholder — substituir por chamadas reais quando o backend tiver /alertas
export function resolveAlert(_id: string): Promise<void> {
  return Promise.resolve();
}

export function scheduleAlert(_id: string): Promise<void> {
  return Promise.resolve();
}
