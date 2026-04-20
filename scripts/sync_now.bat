@echo off
REM sync_now.bat — double-click this file anytime you want to pull
REM the latest reports and CSVs from GitHub. That's all it does.

cd /d "%~dp0.."
echo Syncing darblockchain-outreach from GitHub...
echo.
git pull
echo.
echo Done. Press any key to close.
pause >nul
