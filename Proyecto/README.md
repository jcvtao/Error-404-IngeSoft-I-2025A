FitApp - Guía de Desarrollo
Esta guía te ayudará a configurar y ejecutar FitApp en tu entorno de desarrollo.

📋 Requisitos Previos
Asegúrate de tener instalado lo siguiente:

Node.js: Se recomienda la versión v20.19.3 (o cualquier v20.x.x). Puedes usar NVM para gestionarlo.

npm: Versión v10.x.x (se instala con Node.js).

Herramientas de compilación C++: Necesarias para módulos nativos como better-sqlite3 y bcrypt.

Windows: Instala Visual Studio Build Tools con la carga de trabajo "Desarrollo de escritorio con C++". Descárgalas desde visualstudio.microsoft.com.

macOS/Linux: Asegúrate de tener las herramientas de línea de comandos de desarrollo instaladas.

🚀 Configuración Rápida
Sigue estos pasos para preparar tu entorno:

Clona el repositorio:

Bash

git clone https://github.com/jcvtao/Error-404-IngeSoft-I-2025A
cd Error-404-IngeSoft-I-2025A/Proyecto
Instala dependencias:

Bash

npm install
Reconstruye módulos nativos para Electron:
Este paso es CRÍTICO para evitar errores.

Bash

npx electron-rebuild
Si en Windows npx falla, prueba: .\node_modules\.bin\electron-rebuild.cmd

Asegúrate de que este comando se complete sin errores. Si persisten, revisa la instalación de las herramientas de compilación.

▶️ Ejecutar en Desarrollo
Para iniciar la aplicación en modo desarrollo (frontend con Vite, backend con Electron):

Bash

npm run electron-dev