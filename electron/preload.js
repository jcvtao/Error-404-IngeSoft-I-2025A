// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  registrarUsuario: (usuario) => ipcRenderer.invoke('registrar-usuario', usuario),
  obtenerUsuarios: () => ipcRenderer.invoke('obtener-usuarios')
});
