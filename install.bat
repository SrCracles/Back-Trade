@echo off
echo ========================================
echo  BackTrade - Instalacion Automatica
echo ========================================
echo.

echo [1/2] Instalando dependencias del Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar backend
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/2] Instalando dependencias del Frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar frontend
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ========================================
echo  Instalacion Completada!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Ejecuta start-backend.bat en una terminal
echo 2. Ejecuta start-frontend.bat en otra terminal
echo 3. Abre http://localhost:3000 en tu navegador
echo.
echo La aplicacion usa datos simulados (no requiere API keys)
echo.
pause

