@echo off
setlocal
cd /d C:\Users\User\Desktop\AVOS

if not exist "AVOS-Factory-Capability-Production-Layer-Mega-Pack-2-Parts-31-45-V2.ps1" (
  echo.
  echo ERROR: Mega Pack 2 V2 file was not found in:
  echo C:\Users\User\Desktop\AVOS
  echo.
  pause
  exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File ".\AVOS-Factory-Capability-Production-Layer-Mega-Pack-2-Parts-31-45-V2.ps1"

set "EXITCODE=%ERRORLEVEL%"
echo.
if not "%EXITCODE%"=="0" (
  echo Mega Pack 2 V2 failed with exit code %EXITCODE%.
) else (
  echo Mega Pack 2 V2 completed successfully.
)
echo.
pause
exit /b %EXITCODE%
