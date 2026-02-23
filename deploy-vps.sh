#!/bin/bash

# Script de Deploy na VPS
# Execute este script na VPS após transferir os arquivos

set -e

# Nome do projeto (pode ser passado como parâmetro)
PROJETO_NOME="${1:-oncoassist}"
PROJETO_DIR="/opt/$PROJETO_NOME"

echo "======================================"
echo "  Script de Deploy - VPS Traefik"
echo "======================================"
echo ""
echo "Nome do Projeto: $PROJETO_NOME"
echo "Diretório: $PROJETO_DIR"
echo ""

# Verificar se está no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "[ERRO] docker-compose.yml não encontrado!"
    echo "   Execute este script no diretório do projeto."
    exit 1
fi

# Verificar se dist existe
if [ ! -d "dist" ]; then
    echo "[ERRO] Pasta dist não encontrada!"
    echo "   Certifique-se de que os arquivos foram transferidos corretamente."
    exit 1
fi

echo "[PASSO 1] Configurando permissões..."
chmod -R 755 dist/

echo "[OK] Permissões configuradas!"
echo ""

echo "[PASSO 2] Fazendo build da imagem Docker..."
docker compose build --no-cache

if [ $? -ne 0 ]; then
    echo "[ERRO] Build do Docker falhou!"
    exit 1
fi

echo "[OK] Build concluído!"
echo ""

echo "[PASSO 3] Parando container existente (se houver)..."
docker compose down 2>/dev/null || true

echo "[PASSO 4] Iniciando container..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo "[ERRO] Erro ao iniciar container!"
    exit 1
fi

echo "[OK] Container iniciado!"
echo ""

echo "[PASSO 5] Verificando status do container..."
docker ps --filter name=$PROJETO_NOME --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo ""

echo "======================================"
echo "  Deploy concluído com sucesso!"
echo "======================================"
echo ""
echo "   Acesse o site em:"
echo "   https://oncoassist.lzmweb.site"
echo ""
echo "   Para ver os logs em tempo real:"
echo "   docker logs -f $PROJETO_NOME"
echo ""
