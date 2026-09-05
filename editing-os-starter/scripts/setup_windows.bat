@echo off
REM setup_windows.bat - installation d'Editing OS sous Windows, en un double-clic.
REM Verifie et installe ce qui manque (Node, FFmpeg, Chrome, Python, Git, whisper.cpp),
REM puis npm install et le controle d'environnement HyperFrames. Relancable sans risque.
REM Pas de droits admin, sauf si Windows le demande pour un installeur (clique Oui).
REM Si le telechargement de whisper echoue : pose whisper-bin-x64.zip dans Telechargements
REM (ou a cote de ce fichier) et relance.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup_windows.ps1"

echo.
echo Appuie sur une touche pour fermer cette fenetre...
pause >nul
