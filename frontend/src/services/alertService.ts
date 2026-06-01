// Serviço de alertas
// Comunicação com ZerithCore: /alerts e /alerts/:id/status

import apiClient from './api';
import type {
  Alert,
  AlertStatus,
  ApiResponse,
  PaginatedResponse,
  AlertQueryParams,
} from '@/types';

// -------------------------------------------------------
// Listar alertas (paginado, com filtros opcionais)
// -------------------------------------------------------

export async function getAlerts(
  params?: AlertQueryParams,
): Promise<PaginatedResponse<Alert>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Alert>>>('/alerts', {
    params,
  });
  return data.data;
}

// -------------------------------------------------------
// Buscar alerta por ID
// -------------------------------------------------------

export async function getAlertById(id: string): Promise<Alert> {
  const { data } = await apiClient.get<ApiResponse<Alert>>(`/alerts/${id}`);
  return data.data;
}

// -------------------------------------------------------
// Atualizar status de um alerta
// -------------------------------------------------------

export async function updateAlertStatus(
  id: string,
  status: AlertStatus,
): Promise<Alert> {
  const { data } = await apiClient.patch<ApiResponse<Alert>>(
    `/alerts/${id}/status`,
    { status },
  );
  return data.data;
}

// -------------------------------------------------------
// Atalho: resolver alerta
// -------------------------------------------------------

export async function resolveAlert(id: string): Promise<Alert> {
  return updateAlertStatus(id, 'RESOLVED');
}

// -------------------------------------------------------
// Atalho: agendar alerta
// -------------------------------------------------------

export async function scheduleAlert(id: string): Promise<Alert> {
  return updateAlertStatus(id, 'SCHEDULED');
}
