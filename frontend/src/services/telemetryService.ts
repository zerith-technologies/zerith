// Serviço de telemetria — endpoints /veiculos/{id}/telemetria do ZerithCore

import apiClient from './api';
import type { ApiResponse, TelemetryReading } from '@/types';

export async function getHistory(
  veiculoId: string,
  page = 0,
  size = 20,
): Promise<TelemetryReading[]> {
  const { data } = await apiClient.get<ApiResponse<TelemetryReading[]>>(
    `/veiculos/${veiculoId}/telemetria`,
    { params: { page, size } },
  );
  return data.data;
}

export async function getLatest(veiculoId: string): Promise<TelemetryReading | null> {
  try {
    const { data } = await apiClient.get<ApiResponse<TelemetryReading>>(
      `/veiculos/${veiculoId}/telemetria/ultima`,
    );
    return data.data;
  } catch {
    // 404 quando não há leituras cadastradas ainda
    return null;
  }
}

export async function getRecent(
  veiculoId: string,
  minutos = 30,
): Promise<TelemetryReading[]> {
  const { data } = await apiClient.get<ApiResponse<TelemetryReading[]>>(
    `/veiculos/${veiculoId}/telemetria/recentes`,
    { params: { minutos } },
  );
  return data.data;
}
