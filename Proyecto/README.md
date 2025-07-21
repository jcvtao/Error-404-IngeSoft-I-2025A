# FitApp 🥬🌽 - Guía de Desarrollo

¡Esta guía te ayudará a configurar y ejecutar *FitApp 🥬🌽* en tu entorno de desarrollo!


## Requisitos 📋

Asegúrate de tener instalado lo siguiente:

- **Node.js v20.x.x:** Se recomienda la versión v20.19.3, Puedes usar NVM para gestionarlo. [¡Descarga aquí!](https://nodejs.org/en/download/current)

- **npm v10.x.x:** Se instala con Node.js.

- **Herramientas de compilación C++:** Necesarias para módulos nativos como better-sqlite3 y bcrypt.

    - **Windows:** Instala Visual Studio Build Tools con la carga de trabajo "Desarrollo de escritorio con C++". [¡Descarga aquí!](https://visualstudio.microsoft.com/es/visual-cpp-build-tools/)

    - **macOS/Linux:** Asegúrate de tener las herramientas de línea de comandos de desarrollo instaladas.

- Acceso a terminal o consola (cmd / PowerShell / bash).


## Configuración Automática 🚀

### Windows

```bash
setup_env.bat
```

### macOS/Linux

```bash
bash setup_env.sh
```

## Configuración Manual 🛠️

Sigue estos pasos para preparar tu entorno:

### 1. Clona el repositorio:

```bash
git clone https://github.com/jcvtao/Error-404-IngeSoft-I-2025A
cd Error-404-IngeSoft-I-2025A/Proyecto
```

### 2. Instala dependencias:

```bash
npm install
```

### 3. Reconstruye módulos nativos para Electron
Este paso es CRÍTICO para evitar errores.

```bash
npx electron-rebuild
```

Si en Windows `npx` falla, intenta haciendo:
```bash
.\node_modules\.bin\electron-rebuild.cmd
```

Asegúrate de que este comando se complete sin errores. Si persisten, revisa la instalación de las herramientas de compilación.

### 4. Ejecución en Desarrollo

Para iniciar la aplicación en modo desarrollo (frontend con Vite, backend con Electron):

```bash
npm run electron-dev
```

Para iniciar la aplicación:
```bash
npm run package
```

## Instrucciones Adicionales

### ESLinter

El proyecto cuenta con el linter ESLinter con el plugin para Svelte. Para instalarlo se debe ejecutar el siguiente comando:

```bash
npm install --save-dev eslint eslint-plugin-svelte3
```

Para ejecutar el lint se debe utilizar el siguiente comando:
```bash
npm run lint
```

### Vitest

El proyecto cuenta con unas pruebas utilizando Vitest. Para instalarlo se debe ejecutar el siguiente comando:

```bash
npm install -D vitest @testing-library/svelte @testing-library/jest-dom jsdom
```

Para ejecutar las pruebas se debe utilizar el siguiente comando:
```bash
npm run test -- --reporter verbose
```

La opción `--reporter verbose` permite ver a detalle los resultados de las pruebas unitarias.