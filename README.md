# ZERITH — Telemática Preditiva para Frotas

> Monorepo do projeto ZERITH. Antecipa falhas mecânicas via IA, reduz custos operacionais e centraliza o monitoramento em um único painel.

[![Frontend CI](https://github.com/zerith-technologies/zerith/actions/workflows/frontend.yml/badge.svg)](https://github.com/zerith-technologies/zerith/actions)
[![Backend CI](https://github.com/zerith-technologies/zerith/actions/workflows/backend.yml/badge.svg)](https://github.com/zerith-technologies/zerith/actions)

---

## 📁 Estrutura do Repositório

```
zerith/
├── frontend/          → ZerithDash — React 18 + Vite + Tailwind + shadcn/ui
├── backend/           → ZerithCore — Spring Boot 3.4 + PostgreSQL (Neon) + Flyway
├── .github/
│   └── workflows/     → CI/CD separado por pasta (em breve)
├── cloud.md           → Memória do projeto para IA (metodologia Akita)
└── README.md
```

---

## 🚀 Como rodar localmente

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # ajuste VITE_API_BASE_URL
npm run dev            # http://localhost:5173
```

### Backend

```bash
cd backend
cp .env.example .env   # preencha DATABASE_URL com sua connection string do Neon
./mvnw spring-boot:run # http://localhost:8080
```

---

## 🏗️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Spring Boot 3.4 (Java 21) + JPA + Flyway |
| Banco de dados | PostgreSQL via Neon (serverless) |
| Deploy frontend | GitHub Pages |
| Deploy backend | Render (Docker) |
| Broker MQTT | Mosquitto (em breve) |
| ML Service | Python FastAPI (em breve) |

---

## 👥 Time

| Pessoa | Papel |
|---|---|
| Italo Antonio | CEO — fullstack, documentação |
| Otávio Faleiros | CPO — produto e UX |
| Thales Felix | CTO Hardware — ESP32, OBD-II, firmware |

---

## 📋 Roadmap

- [x] ZerithDash — dashboard base com autenticação e gráficos
- [x] ZerithCore — CRUD de veículos (fundação)
- [ ] ZerithCore — autenticação JWT
- [ ] Integração frontend ↔ backend
- [ ] ZerithBrain — pipeline ML (FastAPI)
- [ ] ZerithEdge — firmware ESP32 + OBD-II
- [ ] ZerithAlert — app mobile React Native
- [ ] Deploy produção (Oracle Cloud + Cloudflare)
