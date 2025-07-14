const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  registrarUsuario: (datosUsuario) => ipcRenderer.invoke('registrar-usuario', datosUsuario),
  loginUsuario: (username, password) => ipcRenderer.invoke('login-usuario', username, password),
  guardarAlimentosFavoritos: (usuarioId, alimentosIds) =>
    ipcRenderer.invoke('guardar-alimentos-favoritos-masivo', usuarioId, alimentosIds),
  tienePreferencias: (userId) => ipcRenderer.invoke('tiene-preferencias', userId),
  registrarComidaDiaria: (usuarioId, nombreAlimento, calorias) =>
    ipcRenderer.invoke('registrar-comida-diaria', usuarioId, nombreAlimento, calorias),
    obtenerAlimentosFavoritos: (usuarioId) => ipcRenderer.invoke('obtener-alimentos-favoritos', usuarioId)
});

console.log('[preload.js] `electronAPI` expuesto al entorno de renderizado.');

