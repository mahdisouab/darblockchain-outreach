@echo off
REM Remove the Dar Blockchain sync scheduled task from this laptop.

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$t = Get-ScheduledTask -TaskName 'DarBlockchainSync' -ErrorAction SilentlyContinue;" ^
  "if ($t) { Unregister-ScheduledTask -TaskName 'DarBlockchainSync' -Confirm:$false; Write-Host 'DarBlockchainSync task removed.' -ForegroundColor Green }" ^
  "else { Write-Host 'DarBlockchainSync task was not installed.' -ForegroundColor Yellow }"

echo.
pause
