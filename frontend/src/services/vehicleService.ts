// Serviço de veículos
// Comunicação com ZerithCore: /vehicles e /vehicles/:id/sensors

import apiClient from './api';
import type {
  Vehicle,
  SensorReading,
  ApiResponse,
  PaginatedResponse,
  VehicleQueryParams,
  SensorQueryParams,
} from '@/types';

// -------------------------------------------------------
// Listar veículos (paginado, com filtros opcionais)
// -------------------------------------------------------

export async function getVehicles(
  params?: VehicleQueryParams,
): Promise<PaginatedResponse<Vehicle>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Vehicle>>>('/vehicles', {
    params,
  });
  return data.data;
}

// -------------------------------------------------------
// Buscar veículo por ID
// -------------------------------------------------------

export async function getVehicleById(id: string): Promise<Vehicle> {
  const { data } = await apiClient.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
  return data.data;
}

// -------------------------------------------------------
// Criar novo veículo
// -------------------------------------------------------

export async function createVehicle(
  vehicle: Omit<Vehicle, 'id'>,
): Promise<Vehicle> {
  const { data } = await apiClient.post<ApiResponse<Vehicle>>('/vehicles', vehicle);
  return data.data;
}

// -------------------------------------------------------
// Atualizar veículo
// -------------------------------------------------------

export async function updateVehicle(
  id: string,
  vehicle: Partial<Vehicle>,
): Promise<Vehicle> {
  const { data } = await apiClient.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, vehicle);
  return data.data;
}

// -------------------------------------------------------
// Remover veículo
// -------------------------------------------------------

export async function deleteVehicle(id: string): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`);
}

// -------------------------------------------------------
// Leituras de sensores de um veículo
// -------------------------------------------------------

export async function getSensorReadings(
  vehicleId: string,
  params?: SensorQueryParams,
): Promise<SensorReading[]> {
  const { data } = await apiClient.get<ApiResponse<SensorReading[]>>(
    `/vehicles/${vehicleId}/sensors`,
    { params },
  );
  return data.data;
}
