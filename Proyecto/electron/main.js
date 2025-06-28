import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Importa el módulo db.js (esto lo ejecutará e inicializará la DB)
import './db.js';
import { closeDb } from './db.js'; // Importa closeDb para cerrar la conexión al salir

// Importa tus servicios de usuarios
import { registrarUsuario, loginUsuario } from './usuarios.js';

// SOLUCIÓN para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800, // Opcional: Define un ancho mínimo
        minHeight: 600, // Opcional: Define una altura mínima
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Ruta al script preload
            contextIsolation: true, // Mantener en true para seguridad
            nodeIntegration: false // Mantener en false para seguridad
        },
    });

    // Condición para cargar la URL de desarrollo o el archivo empaquetado
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173'); // URL de tu servidor Vite en desarrollo
        win.webContents.openDevTools(); // Abrir DevTools solo en desarrollo
        console.log('[main.js] Ventana principal creada y cargando URL de desarrollo.');
    } else {
        // Carga el archivo HTML compilado de Svelte desde la carpeta 'dist'
        // '..' sube un nivel para ir de 'electron/' a la raíz del proyecto, y luego entra en 'dist/'
        win.loadFile(path.join(__dirname, '../dist/index.html'));
        console.log('[main.js] Ventana principal creada y cargando archivo empaquetado.');
    }
}

app.whenReady().then(() => {
    console.log('[main.js] App está lista. Creando ventana y configurando IPC...');
    createWindow();

    app.on('activate', () => {
        // En macOS, es común recrear una ventana cuando el icono del dock es clicado
        // y no hay otras ventanas abiertas.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // --- Definición de Handlers IPC ---
    // Handler para registrar un nuevo usuario
    ipcMain.handle('registrar-usuario', async (event, datosUsuario) => {
        console.log('[main.js] Recibida solicitud IPC: registrar-usuario para', datosUsuario.username);
        try {
            const result = await registrarUsuario(datosUsuario);
            return result;
        } catch (error) {
            console.error('[main.js] Error en handler IPC "registrar-usuario":', error.message);
            // Asegúrate de devolver un objeto con 'success: false' y un mensaje descriptivo
            return { success: false, message: error.message || "Error al registrar usuario" };
        }
    });

    // Handler para el inicio de sesión de un usuario
    ipcMain.handle('login-usuario', async (event, username, password) => {
        console.log('[main.js] Recibida solicitud IPC: login-usuario para', username);
        try {
            const result = await loginUsuario(username, password);
            return result; 
        } catch (error) {
            console.error('[main.js] Error en handler IPC "login-usuario":', error.message);
            // Asegúrate de devolver un objeto con 'success: false' y un mensaje descriptivo
            return { success: false, mensaje: error.message || "Error al iniciar sesión" };
        }
    });
});

// Cierra la aplicación cuando todas las ventanas están cerradas, excepto en macOS
app.on('window-all-closed', () => {
    console.log('[main.js] Todas las ventanas cerradas. Cerrando base de datos y aplicación...');
    closeDb(); // Llama a la función para cerrar la conexión de la DB
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Manejo de excepciones no capturadas en el proceso principal
process.on('uncaughtException', (error) => {
    console.error('[main.js] Excepción no capturada en el proceso principal:', error);
    // Es buena práctica intentar cerrar la aplicación de forma controlada
    app.quit();
});