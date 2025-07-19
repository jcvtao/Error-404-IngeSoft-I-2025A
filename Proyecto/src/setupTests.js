// src/setupTests.js
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de electronAPI para todos los tests
global.window = global.window || {}
global.window.electronAPI = {
  registrarUsuario: vi.fn(),
  registrarPeso: vi.fn(),
}

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})