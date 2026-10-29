@echo off
setlocal
if not exist "%~dp0dist\index.html" (
  echo COLDSTART PRO konnte dist\index.html nicht finden.
  echo Bitte das vollstaendige ZIP zuerst entpacken und diese Datei im Projektordner lassen.
  pause
  exit /b 1
)
start "" "%~dp0dist\index.html"
exit /b 0
