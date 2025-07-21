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
  obtenerHistorialPeso,
  obtenerAlimentosPorSeccion,
  eliminarRegistroDieta,
  editarRegistroDieta
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
  // En tu archivo main.js, busca este bloque:
// IPC: Guardar alimentos favoritos
  ipcMain.handle('guardar-alimentos-favoritos', async (event, usuarioId, alimentosIds) => {
    return guardarAlimentosFavoritos(usuarioId, alimentosIds);
  });

  // Y reemplázalo por este código, que corrige ambos problemas:
  // IPC: Guardar alimentos favoritos (versión masiva)
  ipcMain.handle('guardar-alimentos-favoritos-masivo', async (event, usuarioId, alimentosIds) => {
    try {
      const res = await guardarAlimentosFavoritos(usuarioId, alimentosIds);
      return res;
    } catch (error) {
      console.error("Error en guardar-alimentos-favoritos-masivo:", error);
      return { success: false, mensaje: error.message };
    }
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
  ipcMain.handle('registrar-comida-diaria', async (event, usuarioId, nombreAlimento, gramos, calorias, seccion) => {
    return registrarComidaDiaria(usuarioId, nombreAlimento, gramos, calorias, seccion);
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

  // IPC: Obtener alimentos por sección
  ipcMain.handle('obtener-alimentos-por-seccion', async (event, usuarioId, seccion) => {
    return obtenerAlimentosPorSeccion(usuarioId, seccion);
  });

  // IPC: Editar registro de dieta
  ipcMain.handle('editarRegistroDieta', async (event, registroId, gramos, seccion) => {
    return editarRegistroDieta(registroId, gramos, seccion);
  });

  // IPC: Eliminar registro de dieta
  ipcMain.handle('eliminarRegistroDieta', async (event, registroId) => {
  return eliminarRegistroDieta(registroId);
  });
  // En tu archivo main.js, añade esto junto a los demás ipcMain.handle
    ipcMain.handle('obtener-todos-los-alimentos', async (event) => {
      return obtenerTodosLosAlimentos();
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
