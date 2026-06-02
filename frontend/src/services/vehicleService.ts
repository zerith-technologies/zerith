// Serviço de veículos — endpoints /veiculos do ZerithCore

import apiClient from './api';
import type {
  ApiResponse,
  Vehicle,
  VehicleCreateRequest,
  VehicleUpdateRequest,
  StatusVeiculo,
} from '@/types';

export async function getAll(status?: StatusVeiculo): Promise<Vehicle[]> {
  const { data } = await apiClient.get<ApiResponse<Vehicle[]>>('/veiculos', {
    params: status ? { status } : undefined,
  });
  return data.data;
}

export async function getById(id: string): Promise<Vehicle> {
  const { data } = await apiClient.get<ApiResponse<Vehicle>>(`/veiculos/${id}`);
  return data.data;
}

export async function create(req: VehicleCreateRequest): Promise<Vehicle> {
  const { data } = await apiClient.post<ApiResponse<Vehicle>>('/veiculos', req);
  return data.data;
}

export async function update(id: string, req: VehicleUpdateRequest): Promise<Vehicle> {
  const { data } = await apiClient.patch<ApiResponse<Vehicle>>(`/veiculos/${id}`, req);
  return data.data;
}

export async function remove(id: string): Promise<void> {
  await apiClient.delete(`/veiculos/${id}`);
}
