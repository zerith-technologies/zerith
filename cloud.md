# ZERITH — cloud.md
> Memória persistente do projeto para uso pela IA como pair programmer.
> Metodologia: Akita Anti-Vibe Coding Challenge.
> Atualizado em: Junho/2026

---

## 🎯 Objetivo do Projeto

Startup de **telemática preditiva para frotas leves**.
Antecipa falhas mecânicas via IA, reduz custos operacionais e centraliza monitoramento.

- **Modelo**: SaaS — R$ 69/placa/mês
- **Seed target**: R$ 350k por 15% equity
- **Programa**: Brasil Inovador — Assistec Inova (Etapa 6 aprovada, 2026)

---

## 🏗️ Arquitetura

```
[Veículo]
  ESP32 + OBD-II → MQTT/TLS
    ↓
[Cloud — Oracle Cloud + Cloudflare Tunnel]
  Spring Boot API (ZerithCore) → Oracle Database
    ↓
  Python FastAPI ML (ZerithBrain)
    ↓
  React Dashboard (ZerithDash) ← este repositório
    ↓
[Mobile]
  React Native + Expo (ZerithAlert)
```

---

## 💻 Stack do Frontend (este repo)

| Item | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS + shadcn/ui |
| Gráficos | Recharts |
| Formulários | React Hook Form + Zod |
| Roteamento | React Router DOM v6 |
| HTTP | Axios |
| Estado de servidor | TanStack Query v5 |
| Estado global | Context API (sem Redux) |
| Testes | Vitest + Testing Library + MSW |
| Deploy | GitHub Pages → `/docs` |

---

## 🔑 Tipos Canônicos (TypeScript)

### User
```typescript
type UserRole = 'ADMIN' | 'MANAGER' | 'TECHNICIAN';

interface User {
  id: string;          // UUID
  name: string;
  email: string;
  role: UserRole;
  company: string;
}
```

### Vehicle
```typescript
type VehicleStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

interface Vehicle {
  id: string;              // UUID
  plate: string;           // ex: "ABC-1234"
  model: string;
  status: VehicleStatus;
  lastAnalysis: string;    // ISO 8601
  type: string;
  year: number;
  mileage: number;         // km
  driver: string;
  lastMaintenance: string; // ISO 8601
}
```

### Alert
```typescript
type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
type AlertStatus   = 'PENDING' | 'SCHEDULED' | 'RESOLVED';

interface Alert {
  id: string;          // UUID
  vehicleId: string;   // UUID
  component: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;   // ISO 8601
  description: string;
  recommendation: string;
}
```

### SensorReading
```typescript
interface SensorReading {
  vehicleId: string;   // UUID
  timestamp: string;   // ISO 8601
  temperature: number; // °C
  vibration: number;   // m/s²
  voltage: number;     // V
  rpm?: number;
  fuelPressure?: number; // kPa
}
```

### MaintenanceRecord
```typescript
type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE';

interface MaintenanceRecord {
  id: string;          // UUID
  vehicleId: string;   // UUID
  date: string;        // ISO 8601
  technician: string;
  type: MaintenanceType;
  components: string[];
  description: string;
  cost: number;        // BRL
  observations?: string;
}
```

### Paginação
```typescript
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

### Resposta padrão da API
```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  timestamp: string; // ISO 8601
}
```

---

## 🔗 Contrato da API REST — ZerithCore (Spring Boot)

**Base URL**: `VITE_API_BASE_URL` (ex: `http://localhost:8080/api/v1`)
**Autenticação**: Bearer JWT em todos os endpoints protegidos.

### Auth
| Método | Endpoint | Body | Retorno |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/auth/logout` | — | `204 No Content` |
| GET | `/auth/me` | — | `User` |

### Vehicles
| Método | Endpoint | Params | Retorno |
|---|---|---|---|
| GET | `/vehicles` | `?page&pageSize&status` | `PaginatedResponse<Vehicle>` |
| GET | `/vehicles/:id` | — | `Vehicle` |
| POST | `/vehicles` | `Vehicle` sem id | `Vehicle` |
| PUT | `/vehicles/:id` | `Partial<Vehicle>` | `Vehicle` |
| DELETE | `/vehicles/:id` | — | `204` |

### Alerts
| Método | Endpoint | Params | Retorno |
|---|---|---|---|
| GET | `/alerts` | `?vehicleId&status&severity&page` | `PaginatedResponse<Alert>` |
| GET | `/alerts/:id` | — | `Alert` |
| PATCH | `/alerts/:id/status` | `{ status: AlertStatus }` | `Alert` |

### Sensor Data
| Método | Endpoint | Params | Retorno |
|---|---|---|---|
| GET | `/vehicles/:id/sensors` | `?from&to&limit` | `SensorReading[]` |

### Maintenance
| Método | Endpoint | Params | Retorno |
|---|---|---|---|
| GET | `/vehicles/:id/maintenance` | `?page&pageSize` | `PaginatedResponse<MaintenanceRecord>` |
| POST | `/vehicles/:id/maintenance` | `MaintenanceRecord` sem id | `MaintenanceRecord` |

---

## 🤖 Contrato da API ML — ZerithBrain (FastAPI)

**Base URL**: `VITE_ML_API_URL` (ex: `http://localhost:8000`)

### Predição
```
POST /predict/{vehicleId}
Response: {
  vehicleId: string,
  predictions: [{
    component: string,
    rul: number,          // Remaining Useful Life em dias
    confidence: number,   // 0.0 a 1.0
    severity: AlertSeverity,
    recommendation: string
  }],
  modelVersion: string,
  generatedAt: string     // ISO 8601
}
```

---

## 🚦 Regras de Negócio

### Severidade de Alertas
| Valor canônico | Significado |
|---|---|
| `CRITICAL` | Requer atenção imediata — risco de falha |
| `WARNING` | Atenção nos próximos dias |
| `INFO` | Monitoramento normal |

### Roles e Permissões
| Role | Pode fazer |
|---|---|
| `ADMIN` | Tudo — incluindo cadastro de usuários e configurações |
| `MANAGER` | Ver todos os veículos, alertas, relatórios, aprovar OS |
| `TECHNICIAN` | Ver veículos atribuídos, atualizar status de alertas e OS |

### Status de Veículo
- `NORMAL` — sem alertas pendentes relevantes
- `WARNING` — tem alertas `WARNING` pendentes
- `CRITICAL` — tem pelo menos um alerta `CRITICAL` pendente

---

## 📋 Variáveis de Ambiente

```env
# API do backend (ZerithCore — Spring Boot)
VITE_API_BASE_URL=http://localhost:8080/api/v1

# API de ML (ZerithBrain — FastAPI)
VITE_ML_API_URL=http://localhost:8000

# Ambiente (development | production)
VITE_ENV=development
```

---

## 📐 Convenções de Código

### Geral
- Commits em **inglês**, padrão Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Nomes de variáveis e funções em **inglês**
- Comentários de código em **português** (time BR)
- Testes obrigatórios antes de qualquer merge

### Frontend
- Componentes no padrão shadcn/ui — não criar do zero se existir equivalente
- Estado global via **Context API** (não adicionar Redux sem discussão)
- Rotas protegidas por papel (`ADMIN`, `MANAGER`, `TECHNICIAN`)
- Tema **dark** como padrão
- Severidade de alertas: `CRITICAL` / `WARNING` / `INFO` (sempre em inglês)

### Serviços
- Toda chamada HTTP passa pelo `src/services/api.ts` (cliente Axios centralizado)
- Interceptors no cliente base para injetar Bearer token e tratar 401
- `useQuery` do TanStack Query para leitura de dados
- `useMutation` do TanStack Query para escrita/atualização

### Testes
- Usar **Vitest** + **Testing Library** + **MSW** (Mock Service Worker)
- Escrever testes **antes** do código (TDD — metodologia Akita)
- Se a IA sugerir o código da funcionalidade antes do teste: **recusar**
- Atualizar este `cloud.md` sempre que a IA "alucinar" — documentar o erro

---

## 🐛 Erros e Alucinações Conhecidas da IA

> Documentar aqui sempre que o agente cometer erros recorrentes.

*(Nenhum registrado ainda)*

---

## 🔗 Links

- GitHub: https://github.com/italoantonio-dev/zerith
- Deploy frontend: https://italoantonio-dev.github.io/zerith
- CEO: Italo Antonio — linkedin.com/in/italo-ti
