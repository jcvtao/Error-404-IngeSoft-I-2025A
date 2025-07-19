// src/lib/__tests__/utils.test.js
import { describe, test, expect } from 'vitest'
import { calculoIMC, calcularCalorias, validarCampos, validarPassword } from '../utils.js'

describe('calculoIMC', () => {
  test('calcula IMC correctamente para valores normales', () => {
    const imc = calculoIMC(70, 175)
    expect(imc).toBe(22.9)
  })

  test('maneja strings como entrada', () => {
    const imc = calculoIMC('75', '170')
    expect(imc).toBe(26.0)
  })
})

describe('calcularCalorias', () => {
  const datosBase = {
    edad: 25,
    peso: 70,
    altura: 175,
    intensidad: 2
  }

  test('calcula calorías correctamente para hombre que mantiene peso', () => {
    const calorias = calcularCalorias({
      ...datosBase,
      sexo: 'hombre',
      objetivo: 'mantener'
    })
    expect(calorias).toBe(2301)
  })

  test('calcula calorías correctamente para mujer que mantiene peso', () => {
    const calorias = calcularCalorias({
      ...datosBase,
      sexo: 'mujer',
      objetivo: 'mantener'
    })
    expect(calorias).toBe(2073)
  })
})

describe('validarCampos', () => {
  const camposValidos = {
    edad: 25,
    peso: 70,
    altura: 175,
    sexo: 'hombre'
  }

  test('valida correctamente campos válidos', () => {
    const resultado = validarCampos(camposValidos)
    expect(resultado.valido).toBe(true)
    expect(resultado.mensaje).toBe('')
  })
  test('rechaza edad menor a 18', () => {
      const resultado = validarCampos({ ...camposValidos, edad: 17 })
      expect(resultado.valido).toBe(false)
      expect(resultado.mensaje).toBe('La edad debe estar entre 18 y 100 años')
    })

    test('rechaza edad mayor a 100', () => {
      const resultado = validarCampos({ ...camposValidos, edad: 101 })
      expect(resultado.valido).toBe(false)
      expect(resultado.mensaje).toBe('La edad debe estar entre 18 y 100 años')
    })
})

  test('devuelve el primer error encontrado', () => {
    const resultado = validarCampos({
      edad: 17,
      peso: 30,
      altura: 130,
      sexo: ''
    })
    expect(resultado.valido).toBe(false)
    expect(resultado.mensaje).toBe('La edad debe estar entre 18 y 100 años')
  })

describe('validarPassword', () => {
  test('acepta contraseñas válidas', () => {
    const passwordsValidas = [
      'Password123',
      'MiClaveSegura1',
      'TestPass2024',
      'Secure123Pass',
      'AbCdEf123456',
      'MyPassword1'
    ]

    passwordsValidas.forEach(password => {
      expect(validarPassword(password)).toBe(true)
    })
  })

  test('rechaza contraseñas muy cortas', () => {
    const passwords = ['Pass1', 'Ab1', 'Test1', 'Short1A']
    passwords.forEach(password => {
      expect(validarPassword(password)).toBe(false)
    })
  })

  test('rechaza contraseñas sin mayúsculas', () => {
    const passwords = ['password123', 'testpass1', 'securepassword']
    passwords.forEach(password => {
      expect(validarPassword(password)).toBe(false)
    })
  })

  test('rechaza contraseña vacía o nula', () => {
    expect(validarPassword('')).toBe(false)
    expect(validarPassword(null)).toBe(false)
    expect(validarPassword(undefined)).toBe(false)
  })
})