import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import './db.js'; // Ejecuta el módulo
import { closeDb } from './db.js'; // Solo closeDb es necesario aquí

// Importa lógica de usuario y funcionalidades
import {
  registrarUsuario,
  loginUsuario,
  guardarAlimentosFavoritos,
  tienePreferenciasRegistradas,
  registrarComidaDiaria,
  obtenerAlimentosFavoritos,
  registrarPeso,
  obtenerHistorialPeso
} from './usuarios.js';

// Para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
    console.log('[main.js] Cargando vista de desarrollo.');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
    console.log('[main.js] Cargando aplicación empaquetada.');
  }
}

app.whenReady().then(() => {
  console.log('[main.js] App lista. Configurando ventana e IPC...');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // IPC: Registro de usuario
  ipcMain.handle('registrar-usuario', async (event, datosUsuario) => {
    try {
      return await registrarUsuario(datosUsuario);
    } catch (error) {
      console.error('[main.js] Error al registrar usuario:', error);
      return { success: false, message: error.message };
    }
  });

  // IPC: Login de usuario
  ipcMain.handle('login-usuario', async (event, username, password) => {
    try {
      return await loginUsuario(username, password);
    } catch (error) {
      console.error('[main.js] Error al hacer login:', error);
      return { success: false, message: error.message };
    }
  });

  // IPC: Guardar alimentos favoritos (masivo)
  ipcMain.handle('guardar-alimentos-favoritos-masivo', async (event, usuarioId, alimentosIds) => {
    return guardarAlimentosFavoritos(usuarioId, alimentosIds);
  });

  // IPC: Verificar si el usuario ya tiene preferencias
  ipcMain.handle('tiene-preferencias', async (event, userId) => {
    try {
      return tienePreferenciasRegistradas(userId);
    } catch (error) {
      console.error('[main.js] Error al verificar preferencias:', error);
      return false;
    }
  });

  // IPC: Registrar comida diaria
  ipcMain.handle('registrar-comida-diaria', async (event, usuarioId, nombreAlimento, calorias) => {
    return registrarComidaDiaria(usuarioId, nombreAlimento, calorias);
  });

  // IPC: Obtener alimentos favoritos
  ipcMain.handle('obtener-alimentos-favoritos', async (event, userId) => {
    return obtenerAlimentosFavoritos(userId);
  });

  // IPC: Registrar peso
  ipcMain.handle('registrar-peso', async (event, usuarioId, peso, imc) => {
    return registrarPeso(usuarioId, peso, imc);
  });

  // IPC: Obtener historial de peso
  ipcMain.handle('obtener-historial-peso', async (event, usuarioId) => {
    return obtenerHistorialPeso(usuarioId);
  });
});

// Cierre correcto de la aplicación
app.on('window-all-closed', () => {
  console.log('[main.js] Cerrando app y base de datos...');
  closeDb();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('[main.js] Excepción no capturada:', error);
  app.quit();
});
