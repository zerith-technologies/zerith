# ZERITH MVP — Claude Code Memory

## Projeto
Sistema de telemetria preditiva para frotas. O MVP monitora sinais OBD-II
em tempo real e exibe em dashboard web.

## Regras do método Akita (OBRIGATÓRIAS)
- NUNCA modifique código manualmente fora do fluxo de tarefas
- SEMPRE crie testes antes de implementar funcionalidades (TDD)
- Se errar, explique o erro e corrija via instrução — não edite direto
- Novas funcionalidades: pause, crie o teste, depois implemente
- Não otimize prematuramente — clareza antes de performance
- Atualize este arquivo sempre que a arquitetura mudar

## Stack
| Camada       | Tecnologia                        |
|--------------|-----------------------------------|
| Simulador    | VirtualECU (Scala) + vcan0        |
| OBD Reader   | Python 3 + python-can             |
| Backend      | Spring Boot 3 (Java 21)           |
| Banco        | PostgreSQL 16                     |
| Mensageria   | WebSocket STOMP (embutido Spring) |
| Frontend     | React 18 + recharts               |
| Container    | Docker + Docker Compose           |

## Arquitetura
```
VirtualECU → vcan0 → obd_reader.py → HTTP POST → Spring Boot → PostgreSQL
                                                       ↓
                                                  WebSocket STOMP
                                                       ↓
                                                 Dashboard React
```

## PIDs monitorados
| PID  | Nome            | Fórmula decode              | Unidade |
|------|-----------------|-----------------------------|---------|
| 0x05 | Temperatura     | A - 40                      | °C      |
| 0x0B | MAP (pressão)   | A                           | kPa     |
| 0x0C | RPM             | (A*256 + B) / 4             | rpm     |
| 0x0D | Velocidade      | A                           | km/h    |
| 0x24 | Lambda (sonda)  | (A*256+B)*2/65536 * 14.7    | A/F     |

## Estrutura de pastas
```
zerith-mvp/
├── obd-reader/          # Python — leitura OBD e envio HTTP
│   ├── obd_reader.py
│   ├── requirements.txt
│   └── Dockerfile
├── backend/             # Spring Boot — API REST + WebSocket
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/            # React — dashboard tempo real
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── virtual-ecu/         # VirtualECU config
│   └── config.yaml
├── docker-compose.yml   # Orquestração completa
└── CLAUDE.md            # Este arquivo
```

## Contrato da API REST
```
POST /api/telemetry
Content-Type: application/json

{
  "timestamp": "2026-05-09T02:14:00Z",
  "pid": "0x0B",
  "name": "map_kpa",
  "value": 127.0,
  "unit": "kPa",
  "raw_bytes": "03410b7f00000000"
}

Resposta: 201 Created
```

## WebSocket
- Endpoint: ws://localhost:8080/ws
- Topic de subscrição: /topic/telemetry
- Formato: mesmo JSON do POST acima

## Banco de dados
```sql
CREATE TABLE telemetria (
  id          BIGSERIAL PRIMARY KEY,
  timestamp   TIMESTAMPTZ NOT NULL,
  pid         VARCHAR(6)  NOT NULL,
  name        VARCHAR(50) NOT NULL,
  value       NUMERIC     NOT NULL,
  unit        VARCHAR(10) NOT NULL,
  raw_bytes   VARCHAR(20)
);

CREATE INDEX idx_telemetria_pid_ts ON telemetria (pid, timestamp DESC);
```

## Comandos
```bash
# Sobe todo o ambiente
docker compose up -d

# Sobe só o banco
docker compose up -d postgres

# Roda o backend em dev
cd backend && ./mvnw spring-boot:run

# Roda o obd reader
cd obd-reader && python obd_reader.py

# Roda o frontend em dev
cd frontend && npm run dev

# Testes backend
cd backend && ./mvnw test

# Testes frontend
cd frontend && npm test

# Cria interface vcan0
sudo modprobe vcan && sudo ip link add dev vcan0 type vcan && sudo ip link set up vcan0

# Sobe VirtualECU
./virtual-ecu/virtualECU vcan0 virtual-ecu/config.yaml
```

## Ambiente Docker (AI Jail)
Todo desenvolvimento acontece dentro de containers Docker.
O Claude Code opera apenas dentro da pasta ~/projects/zerith-mvp.
Nunca executar comandos fora desta pasta.

## Estado atual
- [x] Dia 1: AI Jail configurado
- [x] Dia 2: Planejamento e CLAUDE.md
- [ ] Dia 3: Testes
- [ ] Dia 4: Implementação
- [ ] Dia 5: Otimização
- [ ] Dia 6: Interface
- [ ] Dia 7: Deploy e CI/CD
