// Tipos canônicos do ZerithDash
// Baseados no contrato da API REST (ZerithCore) e no cloud.md

// -------------------------------------------------------
// Autenticação e Usuário
// -------------------------------------------------------

export type UserRole = 'ADMIN' | 'MANAGER' | 'TECHNICIAN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// -------------------------------------------------------
// Veículo
// -------------------------------------------------------

export type VehicleStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: VehicleStatus;
  lastAnalysis: string;    // ISO 8601
  type: string;
  year: number;
  mileage: number;         // km
  driver: string;
  lastMaintenance: string; // ISO 8601
}

// -------------------------------------------------------
// Alertas
// -------------------------------------------------------

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus   = 'PENDING' | 'SCHEDULED' | 'RESOLVED';

export interface Alert {
  id: string;
  vehicleId: string;
  component: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;       // ISO 8601
  description: string;
  recommendation: string;
}

// -------------------------------------------------------
// Dados de Sensores
// -------------------------------------------------------

export interface SensorReading {
  vehicleId: string;
  timestamp: string;       // ISO 8601
  temperature: number;     // °C
  vibration: number;       // m/s²
  voltage: number;         // V
  rpm?: number;
  fuelPressure?: number;   // kPa
}

// -------------------------------------------------------
// Manutenção
// -------------------------------------------------------

export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;            // ISO 8601
  technician: string;
  type: MaintenanceType;
  components: string[];
  description: string;
  cost: number;            // BRL
  observations?: string;
}

// -------------------------------------------------------
// Predição de ML (ZerithBrain)
// -------------------------------------------------------

export interface ComponentPrediction {
  component: string;
  rul: number;             // Remaining Useful Life em dias
  confidence: number;      // 0.0 a 1.0
  severity: AlertSeverity;
  recommendation: string;
}

export interface VehiclePrediction {
  vehicleId: string;
  predictions: ComponentPrediction[];
  modelVersion: string;
  generatedAt: string;     // ISO 8601
}

// -------------------------------------------------------
// Resposta padrão da API REST
// -------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  timestamp: string;       // ISO 8601
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// -------------------------------------------------------
// Parâmetros de query comuns
// -------------------------------------------------------

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface VehicleQueryParams extends PaginationParams {
  status?: VehicleStatus;
}

export interface AlertQueryParams extends PaginationParams {
  vehicleId?: string;
  status?: AlertStatus;
  severity?: AlertSeverity;
}

export interface SensorQueryParams {
  from?: string;           // ISO 8601
  to?: string;             // ISO 8601
  limit?: number;
}
