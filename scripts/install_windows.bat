@echo off
REM ============================================================
REM install_windows.bat — one-click installer for laptop sync
REM
REM Double-click this file. It will:
REM   1. auto-detect your repo path
REM   2. auto-detect where Git Bash is installed
REM   3. register a Windows scheduled task that runs every 10 min
REM   4. run the sync once immediately to verify
REM
REM No admin required. If you see "Access denied", right-click
REM this file and choose "Run as administrator".
REM ============================================================

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install_windows.ps1"

echo.
echo Press any key to close this window...
pause >nul
