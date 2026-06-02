#!/bin/bash
# ================================================================
# ZERITH — Script de deploy na Oracle Cloud
# Ubuntu 24.04 — executa como ubuntu@147.15.106.154
# ================================================================

set -e

REPO_URL="https://github.com/zerith-technologies/zerith.git"
REPO_DIR="$HOME/zerith"

echo "==> [1/5] Atualizando repositórios..."
sudo apt-get update -q

echo "==> [2/5] Clonando/atualizando repositório..."
if [ -d "$REPO_DIR" ]; then
  git -C "$REPO_DIR" pull origin main
else
  git clone "$REPO_URL" "$REPO_DIR"
fi

echo "==> [3/5] Configurando variáveis de ambiente..."
cd "$REPO_DIR/backend"
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ""
  echo "ATENÇÃO: edite o arquivo .env antes de continuar!"
  echo "  nano .env"
  echo ""
  echo "  Preencha: DB_PASSWORD, JWT_SECRET e ZERITH_CORS_ALLOWED_ORIGINS"
  exit 1
fi

echo "==> [4/5] Build e subindo container..."
docker compose down --remove-orphans 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

echo "==> [5/5] Verificando saúde do serviço..."
sleep 15
docker compose ps
docker compose logs --tail=30

echo ""
echo "Deploy concluído!"
echo "  Backend rodando em: http://127.0.0.1:8080"
echo "  Health check: curl http://localhost:8080/actuator/health"
