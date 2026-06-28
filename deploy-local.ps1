# Script de Deploy Local (PowerShell)
# Este script prepara e envia os arquivos para a VPS

param(
    [string]$ProjetoNome = "oncoassist",
    [string]$VPSHost = "root@5.189.178.64",
    [string]$VPSPath = "/opt"
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Script de Deploy - VPS Traefik" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se esta no diretorio correto
if (-not (Test-Path "package.json")) {
    Write-Host "[ERRO] package.json nao encontrado!" -ForegroundColor Red
    Write-Host "   Execute este script no diretorio raiz do projeto." -ForegroundColor Yellow
    exit 1
}

Write-Host "[INFO] Configuracao do Deploy:" -ForegroundColor Green
Write-Host "   Nome do Projeto: $ProjetoNome" -ForegroundColor White
Write-Host "   VPS: $VPSHost" -ForegroundColor White
Write-Host "   Caminho na VPS: $VPSPath/$ProjetoNome" -ForegroundColor White
Write-Host ""

# Perguntar confirmacao
$confirma = Read-Host "Deseja continuar? (S/N)"
if ($confirma -ne "S" -and $confirma -ne "s") {
    Write-Host "Deploy cancelado." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "[PASSO 1] Verificando arquivos necessarios..." -ForegroundColor Green

# Verificar Dockerfile
if (-not (Test-Path "Dockerfile")) {
    Write-Host "[ERRO] Dockerfile nao encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar docker-compose.yml
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "[ERRO] docker-compose.yml nao encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar nginx.conf
if (-not (Test-Path "nginx.conf")) {
    Write-Host "[ERRO] nginx.conf nao encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Arquivos verificados!" -ForegroundColor Green
Write-Host ""

Write-Host "[PASSO 2] Fazendo build local da aplicacao..." -ForegroundColor Green
Write-Host "   Executando: npm run build" -ForegroundColor Gray
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Build local falhou!" -ForegroundColor Red
    Write-Host "   Verifique os erros acima e tente novamente." -ForegroundColor Yellow
    exit 1
}

# Verificar se a pasta dist foi criada
if (-not (Test-Path "dist")) {
    Write-Host "[ERRO] Pasta dist nao foi criada apos o build!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Build local concluido!" -ForegroundColor Green
Write-Host ""

Write-Host "[PASSO 3] Criando diretorio na VPS..." -ForegroundColor Green
$sshCmd = "ssh $VPSHost `"mkdir -p $VPSPath/$ProjetoNome`""
Invoke-Expression $sshCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro ao criar diretorio na VPS!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Diretorio criado!" -ForegroundColor Green
Write-Host ""

Write-Host "[PASSO 4] Transferindo arquivos para a VPS..." -ForegroundColor Green
Write-Host "   (Enviando: dist/, Dockerfile, docker-compose.yml, nginx.conf)" -ForegroundColor Gray

# Tentar encontrar rsync em locais comuns (incluindo Git)
$rsyncPath = $null
$rsyncLocations = @(
    "rsync",
    "C:\Program Files\Git\usr\bin\rsync.exe",
    "C:\Program Files (x86)\Git\usr\bin\rsync.exe"
)

foreach ($location in $rsyncLocations) {
    if (Get-Command $location -ErrorAction SilentlyContinue) {
        $rsyncPath = $location
        break
    }
}

if ($rsyncPath) {
    # Enviar apenas os arquivos necessários: dist/, Dockerfile, docker-compose.yml, nginx.conf
    Write-Host "   Usando rsync (com compressao e progresso)..." -ForegroundColor Gray
    
    # Criar diretório temporário para organizar arquivos
    $tempDir = "$env:TEMP\$ProjetoNome-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    
    # Copiar arquivos necessários
    Copy-Item -Path "dist" -Destination $tempDir -Recurse -Force
    Copy-Item -Path "Dockerfile" -Destination $tempDir -Force
    Copy-Item -Path "docker-compose.yml" -Destination $tempDir -Force
    Copy-Item -Path "nginx.conf" -Destination $tempDir -Force
    
    # Enviar com rsync
    $rsyncCmd = "$rsyncPath -avz --progress $tempDir/ $VPSHost`:$VPSPath/$ProjetoNome/"
    Invoke-Expression $rsyncCmd
    
    # Limpar diretório temporário
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro ao transferir arquivos com rsync!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   rsync nao encontrado, usando arquivo compactado..." -ForegroundColor Yellow
    
    # Criar arquivo temporario
    $timestamp = Get-Date -Format 'yyyyMMddHHmmss'
    $tempArchive = "$env:TEMP\$ProjetoNome-deploy-$timestamp.tar.gz"
    $tempDir = "$env:TEMP\$ProjetoNome-deploy-$timestamp"
    
    # Criar diretório temporário e copiar apenas arquivos necessários
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Copy-Item -Path "dist" -Destination $tempDir -Recurse -Force
    Copy-Item -Path "Dockerfile" -Destination $tempDir -Force
    Copy-Item -Path "docker-compose.yml" -Destination $tempDir -Force
    Copy-Item -Path "nginx.conf" -Destination $tempDir -Force
    
    Write-Host "   Criando arquivo compactado..." -ForegroundColor Gray
    
    # Verificar se tar esta disponivel (Windows 10+ ou Git)
    $tarPath = $null
    $tarLocations = @(
        "tar",
        "C:\Program Files\Git\usr\bin\tar.exe"
    )
    
    foreach ($location in $tarLocations) {
        if (Get-Command $location -ErrorAction SilentlyContinue) {
            $tarPath = $location
            break
        }
    }
    
    if ($tarPath) {
        # Criar arquivo tar.gz com os arquivos necessários
        Push-Location $tempDir
        $tarCmd = "$tarPath -czf `"$tempArchive`" ."
        Invoke-Expression $tarCmd
        Pop-Location
        
        # Limpar diretório temporário
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path $tempArchive)) {
            $archiveSize = [math]::Round((Get-Item $tempArchive).Length / 1MB, 2)
            Write-Host "   Arquivo criado: $archiveSize MB" -ForegroundColor Gray
            
            # Transferir arquivo
            Write-Host "   Transferindo arquivo compactado..." -ForegroundColor Gray
            $archiveName = Split-Path $tempArchive -Leaf
            $scpCmd = "scp `"$tempArchive`" $VPSHost`:$VPSPath/$ProjetoNome/"
            Invoke-Expression $scpCmd
            
            if ($LASTEXITCODE -eq 0) {
                # Extrair arquivo na VPS
                Write-Host "   Extraindo arquivos na VPS..." -ForegroundColor Gray
                $extractCmd = "ssh $VPSHost `"cd $VPSPath/$ProjetoNome && tar -xzf $archiveName && rm $archiveName`""
                Invoke-Expression $extractCmd
                
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "[ERRO] Erro ao extrair arquivos na VPS!" -ForegroundColor Red
                    exit 1
                }
            } else {
                Write-Host "[ERRO] Erro ao transferir arquivo!" -ForegroundColor Red
                exit 1
            }
            
            # Limpar arquivo temporario local
            Remove-Item $tempArchive -Force -ErrorAction SilentlyContinue
        } else {
            Write-Host "[ERRO] Erro ao criar arquivo compactado!" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[ERRO] tar nao encontrado. Por favor instale Git (inclui tar) ou use WSL." -ForegroundColor Red
        exit 1
    }
}

Write-Host "[OK] Arquivos transferidos!" -ForegroundColor Green
Write-Host ""

Write-Host "[PASSO 5] Configurando permissoes e executando build do Docker na VPS..." -ForegroundColor Green
$buildCmd = "ssh $VPSHost `"cd $VPSPath/$ProjetoNome && chmod -R 755 dist/ && docker compose build --no-cache`""
Invoke-Expression $buildCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro ao fazer build do Docker!" -ForegroundColor Red
    Write-Host "   Verifique os logs acima para mais detalhes." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Build concluido!" -ForegroundColor Green
Write-Host ""

Write-Host "[PASSO 6] Iniciando container na VPS..." -ForegroundColor Green
$upCmd = "ssh $VPSHost `"cd $VPSPath/$ProjetoNome && docker compose up -d`""
Invoke-Expression $upCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro ao iniciar container!" -ForegroundColor Red
    Write-Host "   Verifique os logs acima para mais detalhes." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Container iniciado!" -ForegroundColor Green
Write-Host ""

Write-Host "[PASSO 7] Verificando status do container..." -ForegroundColor Green
$statusCmd = "ssh $VPSHost `"docker ps --filter name=$ProjetoNome --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'`""
Invoke-Expression $statusCmd
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Deploy concluido com sucesso!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Acesse o site em:" -ForegroundColor Yellow
Write-Host "   https://oncoassist.lzmweb.site" -ForegroundColor White
Write-Host ""
Write-Host "   Para ver os logs em tempo real:" -ForegroundColor Cyan
Write-Host "   ssh $VPSHost `"docker logs -f $ProjetoNome`"" -ForegroundColor Gray
Write-Host ""
