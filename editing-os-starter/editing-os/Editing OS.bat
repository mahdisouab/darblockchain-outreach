@echo off
REM Lanceur double-cliquable du hub Editing OS (Windows).
REM Demarre le serveur s'il ne tourne pas deja, puis ouvre le hub dans le navigateur.
REM Laisser cette fenetre ouverte : c'est elle qui fait tourner le hub.
REM (Pendant du "Editing OS.command" macOS ; la logique est dans "Editing OS.ps1".)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Editing OS.ps1"
if errorlevel 1 (
  echo.
  echo Appuie sur une touche pour fermer cette fenetre...
  pause >nul
)
