#!/bin/bash

# Terminar el script si algun comando falla
set -e

# --- 1. Verificación de Dependencias del Sistema ---
echo "(1/4) Verificando dependencias mínimas (Node.js y NPM)"
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "[ERROR] Node.js y/o NPM no están instalados o no se encuentran en el PATH."
    echo "Por favor, instálalos desde https://nodejs.org/"
    exit 1
fi
echo "[OK] Node.js y NPM encontrados."
node -v
npm -v

# --- 2. Instalación de Dependencias del Proyecto ---
echo ""
echo "(2/4) Instalando dependencias del proyecto vía npm..."
npm install

# --- 3. Reconstrucción modulos nativos para Electron ---
echo ""
echo "(3/4) Reconstruyendo módulos nativos para Electron..."
npx electron-rebuild
echo "[OK] Dependencias instaladas y reconstruidas."

# --- ?. Inicialización de la Base de Datos ---
# echo ""
# echo "======================================================="
# echo "(3/4) Inicializando la base de datos de desarrollo..."
# echo "======================================================="
# npm run db:init
# echo "[OK] Base de datos lista."

# --- 4. Ejecución del Proyecto en Modo Desarrollo ---
echo ""
echo "(4/4) Ejecutando el proyecto en modo desarrollo..."
npm run electron-dev

echo "[OK] Script de configuración finalizado."