# Guia de Referência - Deploy na VPS com Traefik

## 📋 Informações da VPS

- **IP da VPS**: `5.189.178.64`
- **Domínio Base**: `lzmweb.site`
- **Reverse Proxy**: Traefik v3.4.0 (já instalado e rodando)
- **Container ID do Traefik**: `26d66768f3a5`
- **Rede Traefik**: `traefik` (NÃO `traefik-network`)
- **Cert Resolver**: `letsencryptresolver` (NÃO `letsencrypt`)
- **Entrypoints Traefik**: `web` (HTTP) e `websecure` (HTTPS)
- **Docker Compose**: v2.39.4 (comando: `docker compose` com espaço)

---

## 🚀 Scripts de Deploy Automático (RECOMENDADO)

Para facilitar o deploy, use os scripts automáticos que já estão configurados no projeto:

### Arquivos Necessários

1. **`deploy-local.ps1`** - Script PowerShell para Windows (prepara e envia arquivos)
2. **`deploy-vps.sh`** - Script Bash para VPS (executa deploy completo)
3. **`docker-compose.yml`** - Configuração do Traefik (já configurado)
4. **`Dockerfile`** - Configuração do container (usa `npm install`)

### Como Usar em um Novo Projeto

1. **Copiar os arquivos** para o novo projeto:
   - `VPS-REFERENCE-GUIDE.md`
   - `deploy-local.ps1`
   - `deploy-vps.sh`
   - `docker-compose.yml`

2. **Adaptar os arquivos** para o novo projeto:

   #### A) `docker-compose.yml`
   
   Substitua **TODAS** as ocorrências de `vitra-legal-design` pelo nome do seu projeto:
   
   - Linha 2: `services:` → `[seu-projeto]:`
   - Linha 6: `container_name: vitra-legal-design` → `container_name: [seu-projeto]`
   - Linha 12: `traefik.http.routers.vitra-legal-design` → `traefik.http.routers.[seu-projeto]`
   - Linha 12: `Host(\`vitra-legal-design.lzmweb.site\`)` → `Host(\`[seu-projeto].lzmweb.site\`)`
   - Linha 16: `traefik.http.routers.vitra-legal-design-secure` → `traefik.http.routers.[seu-projeto]-secure`
   - Linha 22: `traefik.http.services.vitra-legal-design` → `traefik.http.services.[seu-projeto]`
   
   **Exemplo rápido** (use Find & Replace):
   - Buscar: `vitra-legal-design`
   - Substituir: `[seu-projeto]`
   
   ⚠️ **IMPORTANTE**: Mantenha todos os outros valores (`traefik`, `letsencryptresolver`, `web`, `websecure`, etc.)

   #### B) `deploy-local.ps1`
   
   Opção 1: Passar nome do projeto como parâmetro (recomendado):
   ```powershell
   .\deploy-local.ps1 -ProjetoNome "meu-novo-projeto"
   ```
   
   Opção 2: Alterar valor padrão na linha 5:
   ```powershell
   [string]$ProjetoNome = "meu-novo-projeto",
   ```

   #### C) `deploy-vps.sh`
   
   Opção 1: Passar nome do projeto como parâmetro:
   ```bash
   ./deploy-vps.sh "meu-novo-projeto"
   ```
   
   Opção 2: Alterar valor padrão na linha 15:
   ```bash
   PROJETO_NOME="${1:-meu-novo-projeto}"
   ```

3. **Executar deploy:**
   
   **Windows (máquina local):**
   ```powershell
   .\deploy-local.ps1 -ProjetoNome "meu-projeto"
   ```
   
   **VPS (via SSH):**
   ```bash
   ssh root@5.189.178.64
   cd /opt/meu-projeto
   chmod +x deploy-vps.sh
   ./deploy-vps.sh "meu-projeto"
   ```

### Observações Importantes

- **Dockerfile**: Se copiar de outro projeto, verifique se usa `npm install` (não `npm ci`)
- **DNS**: Se tiver wildcard DNS (`*.lzmweb.site`), não precisa configurar manualmente
- **Nome do projeto**: Use apenas letras minúsculas, números e hífens (ex: `meu-projeto`, `app-2024`)

---

## 🚀 Template de Deploy Rápido (Manual)

### 1. Configurar DNS (OPCIONAL - apenas se não tiver wildcard)

**⚠️ NOTA**: Se você tem DNS wildcard configurado (`*.lzmweb.site` → `5.189.178.64`), **PULE ESTE PASSO**.

**No seu provedor de DNS**, criar registro:
```
Tipo: A
Nome: [nome-do-projeto]
Valor: 5.189.178.64
TTL: 3600
```

**Exemplo**: Se o projeto for `meu-app`, criar `meu-app.lzmweb.site`

**Como verificar se tem wildcard:**
```bash
nslookup qualquer-subdominio-teste.lzmweb.site
# Se retornar 5.189.178.64, você tem wildcard DNS configurado
```

---

### 2. Criar Diretório na VPS

```bash
# Conectar na VPS
ssh root@5.189.178.64

# Criar diretório (ajustar [nome-projeto] para o nome do seu projeto)
mkdir -p /opt/[nome-projeto]
cd /opt/[nome-projeto]
```

---

### 3. Transferir Arquivos

**Na sua máquina local:**
```bash
# Usando rsync (ajustar caminhos)
rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
  ./[pasta-projeto]/ root@5.189.178.64:/opt/[nome-projeto]/

# OU usando scp
scp -r * root@5.189.178.64:/opt/[nome-projeto]/
```

---

### 4. Criar docker-compose.yml

**Template mínimo:**

```yaml
services:
  [nome-projeto]:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: [nome-projeto]
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      
      # Router HTTP
      - "traefik.http.routers.[nome-projeto].rule=Host(`[nome-projeto].lzmweb.site`)"
      - "traefik.http.routers.[nome-projeto].entrypoints=web"
      
      # Router HTTPS (SSL automático)
      - "traefik.http.routers.[nome-projeto]-secure.rule=Host(`[nome-projeto].lzmweb.site`)"
      - "traefik.http.routers.[nome-projeto]-secure.entrypoints=websecure"
      - "traefik.http.routers.[nome-projeto]-secure.tls=true"
      - "traefik.http.routers.[nome-projeto]-secure.tls.certresolver=letsencryptresolver"
      
      # Service
      - "traefik.http.services.[nome-projeto].loadbalancer.server.port=80"
      
    networks:
      - traefik

networks:
  traefik:
    external: true
```

**⚠️ IMPORTANTE:**
- Rede: `traefik` (não `traefik-network`)
- Cert resolver: `letsencryptresolver` (não `letsencrypt`)
- Entrypoints: `web` e `websecure`
- **CUIDADO**: Não duplicar hífens (`- -`), usar apenas um (`-`)

---

### 5. Deploy

```bash
# Na VPS, no diretório do projeto
cd /opt/[nome-projeto]

# Verificar se rede Traefik existe (geralmente já existe)
docker network ls | grep traefik

# Build da imagem
docker compose build

# Iniciar container
docker compose up -d

# Verificar logs
docker logs -f [nome-projeto]
```

---

## 🔧 Comandos Úteis

### Gerenciar Container

```bash
# Ver logs
docker logs -f [nome-projeto]

# Parar
docker compose down

# Iniciar
docker compose up -d

# Reiniciar
docker compose restart

# Rebuild completo
docker compose build --no-cache
docker compose up -d

# Ver status
docker compose ps
```

### Verificar Configuração Traefik

```bash
# Ver cert resolver do Traefik
docker inspect 26d66768f3a5 | grep -i "certresolver\|acme" -A 5

# Ver logs do Traefik
docker logs 26d66768f3a5 --tail 100

# Verificar se serviço foi detectado
docker logs 26d66768f3a5 | grep -i "[nome-projeto]"
```

---

## ⚠️ Problemas Comuns e Soluções

### 1. SSL não funciona

**Verificar:**
- Cert resolver correto: `letsencryptresolver` (não `letsencrypt`)
- Labels SSL estão corretas no `docker-compose.yml`
- Aguardar 2-3 minutos para Let's Encrypt gerar certificado

**Solução:**
```bash
# Verificar cert resolver no docker-compose.yml
cat docker-compose.yml | grep certresolver

# Deve mostrar: letsencryptresolver
# Se mostrar letsencrypt, corrigir e reiniciar:
nano docker-compose.yml  # Corrigir
docker compose down
docker compose up -d
```

### 2. Container não é detectado pelo Traefik

**Verificar:**
- Container está na rede `traefik`
- Labels estão corretas
- Traefik está rodando

**Solução:**
```bash
# Verificar rede
docker inspect [nome-projeto] | grep -A 10 Networks

# Deve mostrar "traefik" na lista
# Se não estiver, verificar docker-compose.yml

# Reiniciar container
docker compose restart
```

### 3. Erro de sintaxe YAML

**Problema:** `unexpected type []interface {}`

**Causa:** Duplicação de hífen (`- -` ao invés de `-`)

**Solução:**
```bash
# Verificar arquivo
cat docker-compose.yml | grep "^      - -"

# Se encontrar linhas com dois hífens, corrigir:
nano docker-compose.yml
# Remover hífen duplicado
```

### 4. DNS não propagado

**Verificar:**
```bash
# Na sua máquina local ou VPS
nslookup [nome-projeto].lzmweb.site
# Deve retornar 5.189.178.64
```

**Solução:** Aguardar propagação DNS (pode levar até 24h, geralmente alguns minutos)

---

## 📝 Checklist de Deploy

### Usando Scripts Automáticos:
- [ ] Arquivos copiados para o novo projeto (`deploy-local.ps1`, `deploy-vps.sh`, `docker-compose.yml`)
- [ ] `docker-compose.yml` adaptado (nome do projeto substituído)
- [ ] Scripts executados com sucesso
- [ ] Container buildado e rodando
- [ ] Logs verificados (sem erros)
- [ ] Site acessível via HTTP/HTTPS

### Deploy Manual:
- [ ] DNS configurado (`[nome-projeto].lzmweb.site` → `5.189.178.64`) - ou wildcard configurado
- [ ] Diretório criado na VPS (`/opt/[nome-projeto]`)
- [ ] Arquivos transferidos
- [ ] `docker-compose.yml` criado/ajustado (nome do projeto configurado)
- [ ] `Dockerfile` verificado (usa `npm install` ao invés de `npm ci`)
- [ ] Cert resolver: `letsencryptresolver` (verificado)
- [ ] Rede: `traefik` (verificado)
- [ ] Entrypoints: `web` e `websecure` (verificado)
- [ ] Container buildado (`docker compose build`)
- [ ] Container rodando (`docker compose up -d`)
- [ ] Logs verificados (sem erros)
- [ ] Traefik detectou o serviço
- [ ] Site acessível via HTTP
- [ ] SSL funcionando via HTTPS (aguardar 2-3 min)

---

## 🎯 Exemplo Completo

**Projeto**: `meu-app`  
**Subdomínio**: `meu-app.lzmweb.site`

### docker-compose.yml

```yaml
services:
  meu-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: meu-app
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.meu-app.rule=Host(`meu-app.lzmweb.site`)"
      - "traefik.http.routers.meu-app.entrypoints=web"
      - "traefik.http.routers.meu-app-secure.rule=Host(`meu-app.lzmweb.site`)"
      - "traefik.http.routers.meu-app-secure.entrypoints=websecure"
      - "traefik.http.routers.meu-app-secure.tls=true"
      - "traefik.http.routers.meu-app-secure.tls.certresolver=letsencryptresolver"
      - "traefik.http.services.meu-app.loadbalancer.server.port=80"
    networks:
      - traefik

networks:
  traefik:
    external: true
```

### Comandos

```bash
# 1. Conectar
ssh root@5.189.178.64

# 2. Criar diretório
mkdir -p /opt/meu-app
cd /opt/meu-app

# 3. Transferir arquivos (na máquina local)
scp -r * root@5.189.178.64:/opt/meu-app/

# 4. Na VPS - Build e Deploy
docker compose build
docker compose up -d

# 5. Verificar
docker logs -f meu-app
```

---

## 📚 Informações Técnicas da VPS

### Traefik

- **Versão**: v3.4.0
- **Container ID**: `26d66768f3a5`
- **Cert Resolver**: `letsencryptresolver`
- **Email Let's Encrypt**: `luizhenriquemt14@gmail.com`
- **Entrypoints**: 
  - `web` → Porta 80 (HTTP)
  - `websecure` → Porta 443 (HTTPS)

### Docker

- **Compose Version**: v2.39.4
- **Comando**: `docker compose` (com espaço)
- **Rede Padrão Traefik**: `traefik`

### Estrutura de Diretórios

- **Localização Projetos**: `/opt/[nome-projeto]`
- **Exemplo**: `/opt/meridian-aesthetic`, `/opt/meu-app`

---

## 🔒 Segurança

- **Acesso SSH**: `root@5.189.178.64`
- **Portas Abertas**: 80 (HTTP), 443 (HTTPS), 22 (SSH)
- **Firewall**: Configurado (não documentado aqui)

---

## 💡 Dicas Importantes

1. **Sempre verificar** o cert resolver: `letsencryptresolver` (não `letsencrypt`)
2. **Sempre verificar** o nome da rede: `traefik` (não `traefik-network`)
3. **Aguardar 2-3 minutos** para SSL funcionar após deploy
4. **Usar `docker compose`** (com espaço), não `docker-compose`
5. **Verificar logs do Traefik** se o serviço não for detectado
6. **DNS precisa estar propagado** antes de testar HTTPS (ou ter wildcard configurado)
7. **Cuidado com duplicação de hífens** no YAML (`- -` deve ser `-`)
8. **Dockerfile deve usar `npm install`** (não `npm ci`) para maior compatibilidade
9. **Usar scripts de deploy automático** sempre que possível para evitar erros manuais
10. **Adaptar `docker-compose.yml`** usando Find & Replace para substituir nome do projeto

---

## 🚨 Lembretes Críticos

### Antes de cada deploy, confirmar:

1. ✅ Cert resolver: `letsencryptresolver` 
2. ✅ Rede: `traefik`
3. ✅ Entrypoints: `web` e `websecure`
4. ✅ Sem hífens duplicados no YAML
5. ✅ DNS configurado e propagado

---

## 📋 Resumo Rápido - Adaptar para Novo Projeto

1. **Copiar arquivos:**
   - `VPS-REFERENCE-GUIDE.md`
   - `deploy-local.ps1`
   - `deploy-vps.sh`
   - `docker-compose.yml`

2. **Adaptar `docker-compose.yml`:** 
   - Buscar e substituir: `vitra-legal-design` → `[seu-projeto]`
   - Manter: `traefik`, `letsencryptresolver`, `web`, `websecure`

3. **Executar:**
   ```powershell
   # Local
   .\deploy-local.ps1 -ProjetoNome "seu-projeto"
   
   # VPS
   ./deploy-vps.sh "seu-projeto"
   ```

4. **Acessar:** `https://seu-projeto.lzmweb.site`

---

**Última Atualização**: Janeiro 2026  
**VPS**: Contabo - saborpaulista  
**Domínio Base**: lzmweb.site  
**Dockerfile**: Usa `npm install` (não `npm ci`)
