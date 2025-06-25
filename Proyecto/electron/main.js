const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL(
    app.isPackaged
      ? `file://${path.join(__dirname, '../dist/index.html')}`
      : 'http://localhost:5173'
  );
}

app.whenReady().then(createWindow);

ipcMain.handle('registrar-usuario', async (event, usuario) => {
  return await db.registrarUsuario(usuario);
});

ipcMain.handle('obtener-usuarios', async () => {
  return await db.obtenerUsuarios();
});
