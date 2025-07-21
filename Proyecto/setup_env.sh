#!/bin/bash

# Terminar el script si algun comando falla
set -e

# --- 1. Verificación de Dependencias del Sistema ---
echo "(1/5) Verificando dependencias mínimas (Node.js y NPM)"
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
echo "(2/5) Instalando dependencias del proyecto vía npm..."
npm install

# --- 3. Reconstrucción modulos nativos para Electron ---
echo ""
echo "(3/5) Reconstruyendo módulos nativos para Electron..."
npx electron-rebuild
echo "[OK] Dependencias instaladas y reconstruidas."

# --- 4. Instalación de Bootstrap Icons ---
echo ""
echo "(4/5) Instalando Bootstrap Icons..."
npm install bootstrap-icons
echo "[OK] Bootstrap Icons instalado."

# --- 5. Ejecución del Proyecto en Modo Desarrollo ---
# --- Incluye inicialización de la base de datos ---
echo ""
echo "(5/5) Ejecutando el proyecto en modo desarrollo..."
npm run electron-dev

echo "[OK] Script de configuración finalizado."