// Serviço de manutenção
// Comunicação com ZerithCore: /vehicles/:id/maintenance

import apiClient from './api';
import type {
  MaintenanceRecord,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

// -------------------------------------------------------
// Listar registros de manutenção de um veículo
// -------------------------------------------------------

export async function getMaintenanceRecords(
  vehicleId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<MaintenanceRecord>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<MaintenanceRecord>>>(
    `/vehicles/${vehicleId}/maintenance`,
    { params },
  );
  return data.data;
}

// -------------------------------------------------------
// Criar novo registro de manutenção
// -------------------------------------------------------

export async function createMaintenanceRecord(
  vehicleId: string,
  record: Omit<MaintenanceRecord, 'id' | 'vehicleId'>,
): Promise<MaintenanceRecord> {
  const { data } = await apiClient.post<ApiResponse<MaintenanceRecord>>(
    `/vehicles/${vehicleId}/maintenance`,
    record,
  );
  return data.data;
}
