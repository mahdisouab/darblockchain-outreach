# setup_windows.ps1 — installation d'Editing OS sous Windows, en un double-clic.
# Appelé par setup_windows.bat. Vérifie et installe ce qui manque : Node, FFmpeg,
# Chrome, Python, Git (via winget), whisper.cpp (zip précompilé), puis npm install
# et le contrôle d'environnement HyperFrames. Relançable sans risque : chaque
# étape ne fait que ce qui manque, et dit ce qu'elle a trouvé.

$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = (Resolve-Path (Join-Path $scriptDir '..')).Path
Set-Location $root

# whisper.cpp : version vérifiée le 05/09/2026 (v1.9.3). Le zip contient Release\whisper-cli.exe.
$WhisperTag = 'b4938'
$WhisperZipName = 'whisper-bin-x64.zip'
$WhisperUrl = "https://github.com/ggml-org/whisper.cpp/releases/download/$WhisperTag/$WhisperZipName"
$WhisperDir = Join-Path $env:LOCALAPPDATA 'Programs\whisper-cpp'
$WhisperBin = Join-Path $WhisperDir 'Release'

$report = @()

function Step($title) { Write-Host ''; Write-Host "=== $title ===" -ForegroundColor Cyan }
function Ok($msg)     { Write-Host "  OK  $msg" -ForegroundColor Green }
function Warn($msg)   { Write-Host "  !!  $msg" -ForegroundColor Yellow }
function Fail($msg)   { Write-Host "  XX  $msg" -ForegroundColor Red }

# Le PATH d'une fenêtre ouverte avant une installation ne voit pas les nouveaux
# programmes : on le relit depuis le registre à chaque étape.
function Refresh-Path {
    $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $user = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$machine;$user"
}

function Has($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Add-UserPath($dir) {
    $user = [Environment]::GetEnvironmentVariable('Path', 'User')
    if ($user -and (($user -split ';') -contains $dir)) { Refresh-Path; return }
    $new = $dir
    if ($user) { $new = "$user;$dir" }
    [Environment]::SetEnvironmentVariable('Path', $new, 'User')
    Refresh-Path
}

function Winget-Install($id, $label) {
    if (-not (Has 'winget')) {
        Fail "winget introuvable : installe $label à la main, puis relance ce script."
        return
    }
    Write-Host "  installation de $label (winget $id)..."
    & winget install -e --id $id --accept-source-agreements --accept-package-agreements | Out-Host
    Refresh-Path
}

Write-Host ''
Write-Host '=== Editing OS — installation Windows ===' -ForegroundColor Cyan
Write-Host "Dossier : $root"
Refresh-Path

# --- 1. Node.js ---------------------------------------------------------------
Step 'Node.js'
if (-not (Has 'node')) { Winget-Install 'OpenJS.NodeJS.LTS' 'Node.js LTS' }
if (-not (Has 'node')) {
    $nodeDir = Join-Path $env:ProgramFiles 'nodejs'
    if (Test-Path (Join-Path $nodeDir 'node.exe')) { $env:Path = "$env:Path;$nodeDir" }
}
if (Has 'node') {
    $v = & node -v
    Ok "Node $v"
    $report += "Node.js      : OK ($v)"
} else {
    Fail 'Node introuvable. Installe-le depuis https://nodejs.org puis relance ce script.'
    $report += 'Node.js      : MANQUANT'
}

# --- 2. FFmpeg ----------------------------------------------------------------
Step 'FFmpeg'
if (-not (Has 'ffmpeg')) { Winget-Install 'Gyan.FFmpeg' 'FFmpeg' }
if (-not (Has 'ffmpeg')) {
    # winget pose FFmpeg en « portable » et ne montre le lien qu'aux nouveaux terminaux
    $links = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links'
    if (Test-Path (Join-Path $links 'ffmpeg.exe')) {
        Add-UserPath $links
    } else {
        $pkgs = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
        $found = $null
        if (Test-Path $pkgs) {
            $found = Get-ChildItem -Path $pkgs -Filter 'ffmpeg.exe' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        }
        if ($found) { Add-UserPath $found.DirectoryName }
    }
}
if ((Has 'ffmpeg') -and (Has 'ffprobe')) {
    $v = (& ffmpeg -version | Select-Object -First 1)
    Ok "$v"
    $report += 'FFmpeg       : OK'
} else {
    Fail 'FFmpeg ou ffprobe introuvable. Sinon : https://www.gyan.dev/ffmpeg/builds/ (release full), dossier bin\ dans le PATH.'
    $report += 'FFmpeg       : MANQUANT'
}

# --- 3. Google Chrome ----------------------------------------------------------
Step 'Google Chrome'
$chromePaths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) {
    Winget-Install 'Google.Chrome' 'Google Chrome'
    $chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
}
if ($chrome) {
    Ok "Chrome : $chrome"
    $report += 'Chrome       : OK'
} else {
    Warn 'Chrome introuvable. HyperFrames peut télécharger son propre Chrome de rendu : npx hyperframes browser ensure'
    $report += 'Chrome       : à vérifier (npx hyperframes browser ensure)'
}

# --- 4. Python 3 ---------------------------------------------------------------
Step 'Python 3'
function Python-Ok($cmd) {
    if (-not (Has $cmd)) { return $false }
    $out = & $cmd --version 2>&1
    # l'alias du Microsoft Store répond « Python was not found » avec un code non nul
    return (($LASTEXITCODE -eq 0) -and ("$out" -match '^Python 3\.'))
}
$pyCandidates = @('python3', 'python', 'py')
$py = $pyCandidates | Where-Object { Python-Ok $_ } | Select-Object -First 1
if (-not $py) {
    Winget-Install 'Python.Python.3.12' 'Python 3.12'
    $py = $pyCandidates | Where-Object { Python-Ok $_ } | Select-Object -First 1
}
if ($py) {
    $v = & $py --version 2>&1
    Ok "$v (commande : $py)"
    $report += "Python       : OK ($v)"
} else {
    Fail 'Python 3 introuvable. https://www.python.org/downloads/ en cochant « Add python.exe to PATH ».'
    $report += 'Python       : MANQUANT'
}

# --- 5. Git ---------------------------------------------------------------------
Step 'Git'
if (-not (Has 'git')) { Winget-Install 'Git.Git' 'Git for Windows' }
if (Has 'git') {
    Ok (& git --version)
    $report += 'Git          : OK'
} else {
    Warn 'Git introuvable (nécessaire à Claude Code et à la sync) : https://git-scm.com/download/win'
    $report += 'Git          : MANQUANT'
}

# --- 6. whisper.cpp -------------------------------------------------------------
Step 'whisper.cpp (transcription locale)'
function Whisper-Ok {
    if (-not (Has 'whisper-cli')) { return $false }
    & whisper-cli --help *> $null
    return ($LASTEXITCODE -eq 0)
}
function Test-Zip($path) {
    # Une archive zip commence par « PK » et pèse plusieurs Mo. Une page HTML
    # servie à la place (antivirus, proxy, portail) ne passe pas ce test.
    if (-not $path -or -not (Test-Path $path)) { return $false }
    if ((Get-Item $path).Length -lt 1MB) { return $false }
    try { $fs = [IO.File]::OpenRead($path) } catch { return $false }
    try {
        $b = New-Object byte[] 2
        $n = $fs.Read($b, 0, 2)
        return (($n -eq 2) -and ($b[0] -eq 0x50) -and ($b[1] -eq 0x4B))
    } finally { $fs.Close() }
}
function Find-LocalZip {
    # Un zip déjà récupéré : à côté de ce script, ou dans Téléchargements, même
    # renommé « whisper-bin-x64 (1).zip » par le navigateur.
    $dirs = @($scriptDir, (Join-Path $env:USERPROFILE 'Downloads'))
    try { $dirs += (New-Object -ComObject Shell.Application).NameSpace('shell:Downloads').Self.Path } catch { }
    $hit = $dirs | Where-Object { $_ -and (Test-Path $_) } |
        ForEach-Object { Get-ChildItem -Path $_ -Filter 'whisper-bin-x64*.zip' -File -ErrorAction SilentlyContinue } |
        Where-Object { Test-Zip $_.FullName } |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($hit) { return $hit.FullName }
    return $null
}
if (Test-Path (Join-Path $WhisperBin 'whisper-cli.exe')) { Add-UserPath $WhisperBin }
if (-not (Has 'whisper-cli')) {
    $zip = Find-LocalZip
    if ($zip) {
        Ok "zip trouvé : $zip"
    } else {
        $zip = Join-Path $env:TEMP $WhisperZipName
        Write-Host "  téléchargement de $WhisperUrl ..."
        try {
            Invoke-WebRequest -UseBasicParsing -Uri $WhisperUrl -OutFile $zip
        } catch {
            Fail "téléchargement impossible : $($_.Exception.Message)"
            $zip = $null
        }
        if ($zip -and -not (Test-Zip $zip)) {
            $head = ''
            try { $head = ((Get-Content -Path $zip -TotalCount 3 -ErrorAction SilentlyContinue) -join ' ') } catch { }
            if ($head.Length -gt 120) { $head = $head.Substring(0, 120) }
            Fail "le fichier reçu n'est pas une archive zip. Il commence par : $head"
            Fail 'Un antivirus (Web Shield) ou un proxy a remplacé le téléchargement en route.'
            Remove-Item -Path $zip -Force -ErrorAction SilentlyContinue
            $zip = $null
        }
        if (-not $zip) {
            Fail "Récupère $WhisperZipName autrement (lien direct : $WhisperUrl), pose-le dans Téléchargements, puis relance ce script."
        }
    }
    if ($zip) {
        New-Item -ItemType Directory -Force -Path $WhisperDir | Out-Null
        $extracted = $false
        try {
            Expand-Archive -Force -Path $zip -DestinationPath $WhisperDir -ErrorAction Stop
            $extracted = $true
        } catch {
            Fail "archive illisible : $($_.Exception.Message)"
        }
        if ($extracted -and (Test-Path (Join-Path $WhisperBin 'whisper-cli.exe'))) {
            Add-UserPath $WhisperBin
            Ok "installé dans $WhisperBin (ajouté au PATH utilisateur)"
        } elseif ($extracted) {
            Fail "l'archive ne contient pas Release\whisper-cli.exe : ce n'est pas whisper-bin-x64.zip ?"
        }
    }
}
# Les binaires sont compilés avec Visual C++ : sans son runtime, l'exe ne démarre pas.
$vcMissing = @('vcruntime140.dll', 'vcruntime140_1.dll', 'msvcp140.dll') |
    Where-Object { -not (Test-Path (Join-Path $env:SystemRoot "System32\$_")) }
if ((Has 'whisper-cli') -and $vcMissing) {
    Warn 'runtime Visual C++ absent : installation (winget)...'
    Winget-Install 'Microsoft.VCRedist.2015+.x64' 'Visual C++ Redistributable'
}
if (Whisper-Ok) {
    Ok 'whisper-cli répond'
    $report += 'whisper.cpp  : OK'
} else {
    Fail 'whisper-cli ne répond pas. Voir LISEZMOI.md § 2 bis (le modèle se télécharge plus tard, tout seul).'
    $report += 'whisper.cpp  : MANQUANT'
}

# --- 7. npm install --------------------------------------------------------------
Step 'Dépendances npm (HyperFrames, Playwright)'
if (Has 'node') {
    if (Test-Path (Join-Path $root 'node_modules\hyperframes')) {
        Ok 'déjà installées (node_modules présent)'
    } else {
        & cmd.exe /c 'npm install'
        if ($LASTEXITCODE -eq 0) { Ok 'npm install terminé' } else { Fail "npm install a échoué (code $LASTEXITCODE)" }
    }
    if (Test-Path (Join-Path $root 'node_modules\hyperframes')) { $report += 'npm install  : OK' } else { $report += 'npm install  : à refaire' }
} else {
    Warn 'sans Node, pas de npm install'
    $report += 'npm install  : en attente de Node'
}

# --- 8. Contrôle HyperFrames ----------------------------------------------------
Step 'Contrôle HyperFrames (npx hyperframes doctor)'
if ((Has 'node') -and (Test-Path (Join-Path $root 'node_modules\hyperframes'))) {
    & cmd.exe /c 'npx hyperframes doctor'
} else {
    Warn 'HyperFrames non installé : étape sautée'
}

# --- Bilan ----------------------------------------------------------------------
Step 'Bilan'
foreach ($line in $report) { Write-Host "  $line" }
Write-Host ''
Write-Host 'Le PATH a pu changer : ferme et rouvre tes terminaux (et Claude Code) avant de continuer.' -ForegroundColor Yellow
Write-Host 'Ensuite : double-clique editing-os\Editing OS.bat pour ouvrir le hub (ou lance npm run os).'
Write-Host 'Ce script se relance sans risque : il ne refait que ce qui manque.'
