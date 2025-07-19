import { describe, test, expect } from 'vitest'
import { calculoIMC, calcularCalorias, validarCampos, validarPassword } from '../utils.js'

describe('calculoIMC', () => {
  test('calcula IMC correctamente para valores normales', () => {
    // Prueba que calcula el IMC correctamente para valores normales de peso y altura.
    const imc = calculoIMC(70, 175)
    expect(imc).toBe(22.9)
  })

  test('maneja strings como entrada', () => {
    // Prueba que la función puede manejar entradas como strings y aún así calcular el IMC correctamente.
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
    // Prueba que calcula correctamente las calorías para un hombre cuyo objetivo es mantener su peso.
    const calorias = calcularCalorias({
      ...datosBase,
      sexo: 'hombre',
      objetivo: 'mantener'
    })
    expect(calorias).toBe(2301)
  })

  test('calcula calorías correctamente para mujer que mantiene peso', () => {
    // Prueba que calcula correctamente las calorías para una mujer cuyo objetivo es mantener su peso.
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
    // Prueba que la función valida correctamente cuando todos los campos son válidos.
    const resultado = validarCampos(camposValidos)
    expect(resultado.valido).toBe(true)
    expect(resultado.mensaje).toBe('')
  })
  test('rechaza edad menor a 18', () => {
    // Prueba que la función rechaza cuando la edad es menor a 18 años.
    const resultado = validarCampos({ ...camposValidos, edad: 17 })
    expect(resultado.valido).toBe(false)
    expect(resultado.mensaje).toBe('La edad debe estar entre 18 y 100 años')
  })

  test('rechaza edad mayor a 100', () => {
    // Prueba que la función rechaza cuando la edad es mayor a 100 años.
    const resultado = validarCampos({ ...camposValidos, edad: 101 })
    expect(resultado.valido).toBe(false)
    expect(resultado.mensaje).toBe('La edad debe estar entre 18 y 100 años')
  })
})

describe('validarPassword', () => {
  test('devuelve el primer error encontrado', () => {
    // Prueba que la función devuelve el primer error encontrado, en este caso la edad fuera de rango.
    const resultado = validarCampos({
      edad: 17,
      peso: 30,
      altura: 130,
      sexo: ''
    })
    expect(resultado.valido).toBe(false)
    expect(resultado.mensaje).toBe('La edad debe estar entre 18 y 100 años')
  })

  test('acepta contraseñas válidas', () => {
    // Prueba que la función acepta contraseñas que cumplen con los requisitos de seguridad.
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
    // Prueba que la función rechaza contraseñas que son demasiado cortas.
    const passwords = ['Pass1', 'Ab1', 'Test1', 'Short1A']
    passwords.forEach(password => {
      expect(validarPassword(password)).toBe(false)
    })
  })

  test('rechaza contraseñas sin mayúsculas', () => {
    // Prueba que la función rechaza contraseñas que no tienen ninguna letra mayúscula.
    const passwords = ['password123', 'testpass1', 'securepassword']
    passwords.forEach(password => {
      expect(validarPassword(password)).toBe(false)
    })
  })

  test('rechaza contraseña vacía o nula', () => {
    // Prueba que la función rechaza contraseñas vacías, nulas o indefinidas.
    expect(validarPassword('')).toBe(false)
    expect(validarPassword(null)).toBe(false)
    expect(validarPassword(undefined)).toBe(false)
  })
})