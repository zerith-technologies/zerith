// Tipos canônicos do ZerithDash — alinhados com o contrato real do ZerithCore

// -------------------------------------------------------
// Enums — espelham exatamente as entidades do backend
// -------------------------------------------------------

export type TipoVeiculo   = 'CARRO' | 'MOTO' | 'VAN' | 'CAMINHAO';
export type StatusVeiculo = 'ATIVO' | 'INATIVO' | 'MANUTENCAO';
export type StatusMotor   = 'LIGADO' | 'DESLIGADO' | 'FALHA';
export type UserRole      = 'ADMIN' | 'MANAGER' | 'TECHNICIAN';
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus   = 'PENDING' | 'SCHEDULED' | 'RESOLVED';
export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE';

// -------------------------------------------------------
// Resposta padrão da API (ApiResponse<T> do Spring)
// -------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// -------------------------------------------------------
// Autenticação — campos em português igual ao backend
// -------------------------------------------------------

export interface User {
  nome: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

// -------------------------------------------------------
// Veículo — espelha VeiculoDTO.Response
// -------------------------------------------------------

export interface Vehicle {
  id: string;
  placa: string;
  apelido: string | null;
  marca: string;
  modelo: string;
  ano: number;
  tipo: TipoVeiculo;
  status: StatusVeiculo;
  odometroKm: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface VehicleCreateRequest {
  placa: string;
  apelido?: string;
  marca: string;
  modelo: string;
  ano: number;
  tipo: TipoVeiculo;
}

export interface VehicleUpdateRequest {
  apelido?: string;
  marca?: string;
  modelo?: string;
  ano?: number;
  tipo?: TipoVeiculo;
  status?: StatusVeiculo;
  odometroKm?: number;
}

// -------------------------------------------------------
// Telemetria — espelha LeituraTelemetriaDTO.Response
// -------------------------------------------------------

export interface VeiculoResumo {
  id: string;
  placa: string;
  modelo: string;
}

export interface TelemetryReading {
  id: string;
  veiculoId: string;
  timestampLeitura: string;
  velocidadeKmh: number;
  rpm: number;
  temperaturaMotorC: number;
  nivelCombustivelPct: number;
  tensaoBateriaV: number;
  statusMotor: StatusMotor;
  codigoDtc: string | null;
  latitude: number;
  longitude: number;
  criadoEm: string;
  veiculo: VeiculoResumo;
}

// -------------------------------------------------------
// Alertas (frontend-only por enquanto)
// -------------------------------------------------------

export interface Alert {
  id: string;
  vehicleId: string;
  component: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  description: string;
  recommendation: string;
}

// -------------------------------------------------------
// Manutenção (frontend-only por enquanto)
// -------------------------------------------------------

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  technician: string;
  type: MaintenanceType;
  components: string[];
  description: string;
  cost: number;
  observations?: string;
}

// -------------------------------------------------------
// Parâmetros de query
// -------------------------------------------------------

export interface PaginationParams {
  page?: number;
  size?: number;
}
