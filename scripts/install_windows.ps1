# install_windows.ps1 — Register the Dar Blockchain sync scheduled task.
# Called by install_windows.bat. Do not run this directly unless you know
# how to bypass the PowerShell execution policy.

$ErrorActionPreference = "Stop"
$TaskName = "DarBlockchainSync"

Write-Host ""
Write-Host "=== Dar Blockchain laptop sync — Windows installer ===" -ForegroundColor Cyan
Write-Host ""

# --- 1. Locate the repo (this script lives in <repo>/scripts/) ---------------
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir   = (Resolve-Path (Join-Path $scriptDir "..")).Path
Write-Host "Repo path       : $repoDir"

$syncScript = Join-Path $scriptDir "sync_local.sh"
if (-not (Test-Path $syncScript)) {
    Write-Host "ERROR: sync_local.sh not found at $syncScript" -ForegroundColor Red
    Write-Host "Make sure you ran 'git pull' first." -ForegroundColor Red
    exit 1
}

# --- 2. Find Git Bash -------------------------------------------------------
$bashCandidates = @(
    "C:\Program Files\Git\bin\bash.exe",
    "C:\Program Files (x86)\Git\bin\bash.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\bash.exe",
    "$env:ProgramFiles\Git\bin\bash.exe"
)
$bashExe = $null
foreach ($candidate in $bashCandidates) {
    if (Test-Path $candidate) { $bashExe = $candidate; break }
}
if (-not $bashExe) {
    Write-Host "ERROR: Git Bash not found in the usual locations." -ForegroundColor Red
    Write-Host "Install Git for Windows from https://git-scm.com/download/win and re-run." -ForegroundColor Red
    exit 1
}
Write-Host "Git Bash        : $bashExe"

# --- 3. Convert Windows repo path to a Git Bash path (C:\Foo -> /c/Foo) -----
$driveLetter = $repoDir.Substring(0, 1).ToLower()
$rest        = $repoDir.Substring(2).Replace('\', '/')
$bashRepo    = "/$driveLetter$rest"
Write-Host "Bash path       : $bashRepo"
Write-Host ""

# --- 4. Remove any existing task of the same name ---------------------------
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Removing existing '$TaskName' task..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# --- 5. Register the new task (every 10 minutes, indefinitely) --------------
# The log goes to your home folder so you can find it easily:
#   C:\Users\<you>\darblockchain-sync.log
$bashArg = "-c `"$bashRepo/scripts/sync_local.sh >> `$HOME/darblockchain-sync.log 2>&1`""

$action    = New-ScheduledTaskAction -Execute $bashExe -Argument $bashArg -WorkingDirectory $repoDir
$trigger   = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) `
                -RepetitionInterval (New-TimeSpan -Minutes 10) `
                -RepetitionDuration ([TimeSpan]::MaxValue)
$settings  = New-ScheduledTaskSettingsSet `
                -AllowStartIfOnBatteries `
                -DontStopIfGoingOnBatteries `
                -StartWhenAvailable `
                -MultipleInstances IgnoreNew `
                -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Pulls darblockchain-outreach from GitHub every 10 minutes." `
    -Force | Out-Null

Write-Host "Task registered : $TaskName (every 10 minutes)" -ForegroundColor Green

# --- 6. Run it once right now to verify -------------------------------------
Write-Host ""
Write-Host "Running the task once to verify..."
Start-ScheduledTask -TaskName $TaskName
Start-Sleep -Seconds 6

$logPath = Join-Path $env:USERPROFILE "darblockchain-sync.log"
Write-Host ""
if (Test-Path $logPath) {
    Write-Host "Log file        : $logPath" -ForegroundColor Green
    Write-Host "Last lines:" -ForegroundColor Gray
    Get-Content $logPath -Tail 8 | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "Log not yet created at $logPath — check again in a minute with:" -ForegroundColor Yellow
    Write-Host "  type `"$logPath`"" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host "The sync will now run every 10 minutes automatically."
Write-Host "To uninstall later: double-click scripts\uninstall_windows.bat"
Write-Host ""
