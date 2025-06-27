const { contextBridge, ipcRenderer } = require('electron'); // Usar require

contextBridge.exposeInMainWorld('electronAPI', {
    registrarUsuario: (datosUsuario) => ipcRenderer.invoke('registrar-usuario', datosUsuario),
    loginUsuario: (username, password) => ipcRenderer.invoke('login-usuario', username, password)
});

console.log('[preload.js] `electronAPI` expuesto al entorno de renderizado (CommonJS).');

