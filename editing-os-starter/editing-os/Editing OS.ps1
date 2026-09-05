# Lanceur double-cliquable du hub Editing OS (Windows). Appelé par « Editing OS.bat ».
# Démarre le serveur s'il ne tourne pas déjà, puis ouvre le hub dans le navigateur.
# Laisser cette fenêtre ouverte : c'est elle qui fait tourner le hub.

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..')).Path
Set-Location $root
$port = if ($env:PORT) { [int]$env:PORT } else { 4200 }
$url = "http://localhost:$port/"

function Test-Hub {
    try {
        Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 "http://localhost:$port/api/state" | Out-Null
        return $true
    } catch {
        return $false
    }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js introuvable. Installe-le (winget install -e --id OpenJS.NodeJS.LTS), puis relance.' -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $root 'node_modules'))) {
    Write-Host 'Première installation des dépendances (npm install)...'
    & cmd.exe /c 'npm install'
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'npm install a échoué. Corrige, puis relance.' -ForegroundColor Red
        exit 1
    }
}

if (Test-Hub) {
    Write-Host "Le hub tourne déjà sur le port $port."
    Start-Process $url
    exit 0
}

Write-Host 'Démarrage du hub...'
$server = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npm run os' -NoNewWindow -PassThru
for ($i = 0; $i -lt 40; $i++) {
    if (Test-Hub) { break }
    if ($server.HasExited) {
        Write-Host "Le hub s'est arrêté avant de répondre (voir les messages ci-dessus)." -ForegroundColor Red
        exit 1
    }
    Start-Sleep -Milliseconds 500
}

Start-Process $url
Write-Host ''
Write-Host "Hub ouvert sur $url"
Write-Host 'Ferme cette fenêtre pour arrêter le hub.'
Wait-Process -Id $server.Id
