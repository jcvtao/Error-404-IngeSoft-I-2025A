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
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Activamos el preload script de nuevo
            contextIsolation: true,
            nodeIntegration: false
        },
    });

    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
    console.log('[main.js] Ventana principal creada y cargando URL de desarrollo.');
}

app.whenReady().then(() => {
    console.log('[main.js] App está lista. Creando ventana y configurando IPC...');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // --- Definición de Handlers IPC ---
    ipcMain.handle('registrar-usuario', async (event, datosUsuario) => {
        console.log('[main.js] Recibida solicitud IPC: registrar-usuario para', datosUsuario.username);
        try {
            const result = await registrarUsuario(datosUsuario);
            return result;
        } catch (error) {
            console.error('[main.js] Error en handler IPC "registrar-usuario":', error.message);
            return { success: false, message: "Nombre de usuario ya está en uso" };
        }
    });

    ipcMain.handle('login-usuario', async (event, username, password) => {
        console.log('[main.js] Recibida solicitud IPC: login-usuario para', username);
        try {
            const result = await loginUsuario(username, password);
            return result; 
        } catch (error) {
            console.error('[main.js] Error en handler IPC "login-usuario":', error.message);
            return { success: false, mensaje: error.message };
        }
    });
});

app.on('window-all-closed', () => {
    console.log('[main.js] Todas las ventanas cerradas. Cerrando base de datos y aplicación...');
    closeDb(); // Llama a la función para cerrar la conexión de la DB
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

process.on('uncaughtException', (error) => {
    console.error('[main.js] Excepción no capturada en el proceso principal:', error);
    app.quit();
});