const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  registrarUsuario: (datosUsuario) =>
    ipcRenderer.invoke('registrar-usuario', datosUsuario),

  loginUsuario: (username, password) =>
    ipcRenderer.invoke('login-usuario', username, password),

  guardarAlimentosFavoritos: (usuarioId, alimentosIds) =>
    ipcRenderer.invoke('guardar-alimentos-favoritos-masivo', usuarioId, alimentosIds),

  tienePreferencias: (userId) =>
    ipcRenderer.invoke('tiene-preferencias', userId),

  registrarComidaDiaria: (usuarioId, nombreAlimento, gramos, calorias, seccion) =>
    ipcRenderer.invoke('registrar-comida-diaria', usuarioId, nombreAlimento, gramos, calorias, seccion),

  obtenerAlimentosFavoritos: (usuarioId) =>
    ipcRenderer.invoke('obtener-alimentos-favoritos', usuarioId),

  registrarPeso: (usuarioId, peso, imc) =>
    ipcRenderer.invoke('registrar-peso', usuarioId, peso, imc),

  obtenerHistorialPeso: (usuarioId) =>
    ipcRenderer.invoke('obtener-historial-peso', usuarioId),

  obtenerAlimentosPorSeccion: (usuarioId, seccion) =>
    ipcRenderer.invoke('obtener-alimentos-por-seccion', usuarioId, seccion),

  editarRegistroDieta: (registroId, gramos, seccion) =>
    ipcRenderer.invoke('editarRegistroDieta', registroId, gramos, seccion),

  eliminarRegistroDieta: (registroId) =>
    ipcRenderer.invoke('eliminarRegistroDieta', registroId)
});

console.log('[preload.js] `electronAPI` expuesto al entorno de renderizado.');
