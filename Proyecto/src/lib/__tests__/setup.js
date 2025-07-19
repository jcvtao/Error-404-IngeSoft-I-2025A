// src/lib/__tests__/setup.js
import { vi, beforeEach, afterEach } from 'vitest'

// Configuración global para todos los tests
beforeEach(() => {
  // Mock de electronAPI
  global.window = global.window || {}
  global.window.electronAPI = {
    registrarUsuario: vi.fn(),
    registrarPeso: vi.fn(),
    obtenerUsuarios: vi.fn(),
    iniciarSesion: vi.fn()
  }

  // Mock de localStorage
  global.window.localStorage = {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }

  // Mock de console para tests limpios
  global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
})

afterEach(() => {
  vi.clearAllMocks()
})
