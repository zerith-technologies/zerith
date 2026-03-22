# zerith

# ZERITH — Plataforma de Telemática Preditiva para Gestão de Frotas

# ZERITH — Plataforma de Telemática Preditiva para Gestão de Frotas

## Visão Geral
## Visão Geral
Este repositório é o monorepo do projeto ZERITH, contendo todos os serviços, aplicações e infraestrutura necessários para o desenvolvimento e operação da plataforma.

## Estrutura de Pastas
```
zerith/
├── backend/         # Backend Spring Boot
├── frontend/        # Frontend React
├── hardware/        # Firmware embarcado
├── ml-service/      # Serviços de Machine Learning
├── infra/           # Infraestrutura (Docker, banco, etc)
└── docs/            # Documentação
```

## Pré-requisitos
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (para frontend)
- [Java 17+](https://adoptium.net/) (para backend)
- [GitHub CLI](https://cli.github.com/) (opcional, para automações)

## Setup Local Rápido
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/zerith-technologies/zerith.git
   cd zerith
   ```

2. **Suba toda a stack local:**
   ```bash
   docker compose up
   ```
   Isso irá iniciar:
   - Backend (Spring Boot)
   - PostgreSQL + TimescaleDB
   - Mosquitto MQTT Broker
   - Redis

3. **Acesse os serviços:**
   - Backend: http://localhost:8080
   - Frontend: http://localhost:3000 (se rodar `npm start` em frontend/)
   - Banco de dados: localhost:5432
   - MQTT: localhost:1883
   - Redis: localhost:6379

4. **Configuração de variáveis de ambiente:**
   - Copie `.env.example` para `.env` em cada serviço e ajuste conforme necessário.

## Convenções de Commit
- Use o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)
- Exemplo: `feat(auth): implementa login com JWT`

## Proteção de Branch
- Commits diretos na `main` são bloqueados.
Todo código deve passar por Pull Request e revisão.

## Documentação
- Veja a pasta `docs/` para ADRs, diagramas e especificações.

## Dúvidas?
Abra uma issue ou entre em contato com a equipe!
- Todo código deve passar por Pull Request e revisão.

## Documentação
- Veja a pasta `docs/` para ADRs, diagramas e especificações.

## Dúvidas?
Abra uma issue ou entre em contato com a equipe!

## Modelos de Issues e Pull Requests

- **Tarefa de Sprint:**
  - Use o template "Tarefa de Sprint" para atividades planejadas de sprint.
  - Checklist padrão: Código, Testes, Revisão, Documentação.
- **Bug:**
  - Use o template "Bug" para relatar problemas encontrados.
  - Inclua passos para reproduzir, ambiente e comportamento esperado.
- **Sugestão/Melhoria:**
  - Use o template "Sugestão/Melhoria" para propor novas funcionalidades ou melhorias.
  - Explique o contexto, a proposta e o benefício esperado.
- **Pull Request:**
  - Sempre use o template de PR.
  - Descreva contexto, mudanças, checklist e observações.

Todos os templates estão disponíveis ao criar uma nova issue ou PR pelo GitHub.

ba64d78 (chore: estrutura inicial e README do monorepo)
