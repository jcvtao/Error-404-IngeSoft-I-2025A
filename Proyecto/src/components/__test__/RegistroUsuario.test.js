// src/components/__tests__/RegistroUsuario.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import RegistroUsuario from '../../views/Registro.svelte'

// Mock del componente CaloriasSugeridas
vi.mock('../../views/CaloriasSugeridas.svelte', () => {
  return {
    default: class MockCaloriasSugeridas {
      constructor(options) {
        this.$$prop_def = options.props || {}
        this.$set = vi.fn()
        this.$on = vi.fn()
        this.$destroy = vi.fn()
      }
    }
  }
})

describe('RegistroUsuario', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
    
    // Setup mocks
    global.window = global.window || {}
    global.window.electronAPI = {
      registrarUsuario: vi.fn().mockResolvedValue({
        success: true,
        userId: 1
      }),
      registrarPeso: vi.fn().mockResolvedValue({ success: true })
    }
    
    global.window.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn()
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Paso 1 - Selección de objetivo', () => {
    test('renderiza el paso inicial correctamente', () => {
      render(RegistroUsuario)
      
      expect(screen.getByText('Registro de usuario')).toBeInTheDocument()
      expect(screen.getByText('Selecciona tu objetivo 🎯')).toBeInTheDocument()
      expect(screen.getByText('Perder peso')).toBeInTheDocument()
      expect(screen.getByText('Mantener peso')).toBeInTheDocument()
      expect(screen.getByText('Ganar peso')).toBeInTheDocument()
    })

    test('permite seleccionar objetivo de perder peso', async () => {
      render(RegistroUsuario)
      
      const objetivoPerder = screen.getByText('Perder peso')
      await user.click(objetivoPerder)
      
      expect(objetivoPerder.closest('button')).toHaveClass('selected')
      
      const siguienteBtn = screen.getByText('Siguiente')
      expect(siguienteBtn).not.toBeDisabled()
    })

    test('permite seleccionar objetivo de mantener peso', async () => {
      render(RegistroUsuario)
      
      const objetivoMantener = screen.getByText('Mantener peso')
      await user.click(objetivoMantener)
      
      expect(objetivoMantener.closest('button')).toHaveClass('selected')
    })

    test('permite seleccionar objetivo de ganar peso', async () => {
      render(RegistroUsuario)
      
      const objetivoGanar = screen.getByText('Ganar peso')
      await user.click(objetivoGanar)
      
      expect(objetivoGanar.closest('button')).toHaveClass('selected')
    })

    test('botón siguiente está deshabilitado sin selección', () => {
      render(RegistroUsuario)
      
      const siguienteBtn = screen.getByText('Siguiente')
      expect(siguienteBtn).toBeDisabled()
    })

    test('avanza al paso 2 correctamente', async () => {
      render(RegistroUsuario)
      
      await user.click(screen.getByText('Perder peso'))
      await user.click(screen.getByText('Siguiente'))
      
      expect(screen.getByText('Sobre ti 🪪')).toBeInTheDocument()
    })
  })

  describe('Paso 2 - Datos personales', () => {
    beforeEach(async () => {
      render(RegistroUsuario)
      await user.click(screen.getByText('Perder peso'))
      await user.click(screen.getByText('Siguiente'))
    })

    test('renderiza campos de datos personales', () => {
      expect(screen.getByText('Sobre ti 🪪')).toBeInTheDocument()
      expect(screen.getByText('Hombre')).toBeInTheDocument()
      expect(screen.getByText('Mujer')).toBeInTheDocument()
      expect(screen.getByLabelText('Edad')).toBeInTheDocument()
      expect(screen.getByLabelText('Peso')).toBeInTheDocument()
      expect(screen.getByLabelText('Altura')).toBeInTheDocument()
    })

    test('permite seleccionar sexo hombre', async () => {
      const hombreBtn = screen.getByText('Hombre')
      await user.click(hombreBtn)
      
      expect(hombreBtn.closest('button')).toHaveClass('selected')
    })

    test('permite seleccionar sexo mujer', async () => {
      const mujerBtn = screen.getByText('Mujer')
      await user.click(mujerBtn)
      
      expect(mujerBtn.closest('button')).toHaveClass('selected')
    })

    test('permite ingresar edad válida', async () => {
      const edadInput = screen.getByLabelText('Edad')
      await user.type(edadInput, '25')
      
      expect(edadInput).toHaveValue(25)
      expect(screen.queryByText('La edad debe estar entre 18 y 100 años.')).not.toBeInTheDocument()
    })

    test('muestra error para edad inválida menor a 18', async () => {
      const edadInput = screen.getByLabelText('Edad')
      await user.type(edadInput, '17')
      
      expect(screen.getByText('La edad debe estar entre 18 y 100 años.')).toBeInTheDocument()
    })

    test('permite ingresar altura válida', async () => {
      const alturaInput = screen.getByLabelText('Altura')
      await user.type(alturaInput, '175')
      
      expect(alturaInput).toHaveValue(175)
      expect(screen.queryByText('La altura debe estar entre 140 y 250 cm.')).not.toBeInTheDocument()
    })

    test('muestra error para altura inválida', async () => {
      const alturaInput = screen.getByLabelText('Altura')
      await user.type(alturaInput, '130')
      
      expect(screen.getByText('La altura debe estar entre 140 y 250 cm.')).toBeInTheDocument()
    })

    test('botón siguiente se habilita al completar todos los campos válidos', async () => {
      await user.click(screen.getByText('Hombre'))
      await user.type(screen.getByLabelText('Edad'), '25')
      await user.type(screen.getByLabelText('Peso'), '70')
      await user.type(screen.getByLabelText('Altura'), '175')
      
      const siguienteBtn = screen.getByText('Siguiente')
      expect(siguienteBtn).not.toBeDisabled()
    })

    test('permite regresar al paso 1', async () => {
      const atrasBtn = screen.getByText('Atrás')
      await user.click(atrasBtn)
      
      expect(screen.getByText('Selecciona tu objetivo 🎯')).toBeInTheDocument()
    })

    test('avanza al paso 3 con datos válidos', async () => {
      await user.click(screen.getByText('Hombre'))
      await user.type(screen.getByLabelText('Edad'), '25')
      await user.type(screen.getByLabelText('Peso'), '70')
      await user.type(screen.getByLabelText('Altura'), '175')
      
      const siguienteBtn = screen.getByText('Siguiente')
      await user.click(siguienteBtn)
      
      expect(screen.getByText('Nivel de actividad física🏃‍♂️')).toBeInTheDocument()
    })
  })
})