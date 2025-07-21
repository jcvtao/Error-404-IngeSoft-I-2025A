@echo off
setlocal

REM --- 1. Verificación de Dependencias del Sistema ---
echo.
echo (1/5) Verificando dependencias minimas (Node.js y NPM)
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
    echo Por favor, instalalo desde https://nodejs.org/
    exit /b 1
)
CALL npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] NPM no pudo ser ejecutado correctamente. Podria haber un problema con la instalacion.
    echo Por favor, reinstala Node.js.
    exit /b 1
)
echo [OK] Node.js y NPM encontrados.

REM --- 2. Instalacion de Dependencias del Proyecto ---
echo.
echo (2/5) Instalando dependencias del proyecto via npm...
CALL npm install
if %errorlevel% neq 0 (
    echo [ERROR] La instalacion de dependencias fallo.
    exit /b 1
)

REM --- 3. Reconstrucción modulos nativos para Electron ---
echo.
echo (3/5) Reconstruyendo modulos nativos para Electron...
REM Se utiliza la carpeta local sobre npx electron-rebuild para evitar problemas con el script
CALL .\\node_modules\\.bin\\electron-rebuild.cmd
if %errorlevel% neq 0 (
    echo [ERROR] La reconstruccion de modulos nativos fallo.
    echo Asegurate de tener las herramientas de compilacion de Windows instaladas.
    echo Puedes intentar instalarlas con: npm install --global windows-build-tools
    exit /b 1
)
echo [OK] Reconstruccion de modulos nativos para Electron completada sin problemas.

REM --- 4. Instalación de Bootstrap Icons ---
echo.
echo (4/5) Instalando Bootstrap Icons...
CALL npm install bootstrap-icons
if %errorlevel% neq 0 (
    echo [ERROR] La instalacion de Bootstrap Icons fallo.
    exit /b 1
)
echo [OK] Bootstrap Icons instalados correctamente.

REM --- 5. Ejecucion del Proyecto en Modo Desarrollo ---
REM --- Incluye inicialización de la base de datos ---
echo.
echo (5/5) Generando instalador de la aplicación...
CALL npm run package
if %errorlevel% neq 0 (
    echo [ERROR] La generacion del instalador fallo.
    exit /b 1
)

endlocal