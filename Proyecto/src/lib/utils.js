// src/lib/utils.js
export function calculoIMC(peso, altura) {
  const alturaM = parseFloat(altura) / 100;
  return parseFloat((parseFloat(peso) / (alturaM * alturaM)).toFixed(1));
}

export function calcularCalorias({ edad, peso, altura, sexo, objetivo, intensidad }) {
  edad = parseInt(edad);
  peso = parseFloat(peso);
  altura = parseFloat(altura);

  let tmb = (10 * peso) + (6.25 * altura) - (5 * edad);
  tmb = sexo === 'mujer' ? tmb - 161 : tmb + 5;

  const factores = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725 };
  tmb *= factores[intensidad];
  

  if (objetivo === 'perder') tmb -= 500;
  else if (objetivo === 'ganar') tmb += 300;

  return Math.round(tmb);
}

export function validarCampos({ edad, peso, altura, sexo }) {
  if (!edad || edad < 18 || edad > 100) {
    return { valido: false, mensaje: 'La edad debe estar entre 18 y 100 años' };
  }
  
  if (!peso || peso < 40 || peso > 120) {
    return { valido: false, mensaje: 'El peso debe estar entre 40 y 120 kg' };
  }
  
  if (!altura || altura < 140 || altura > 250) {
    return { valido: false, mensaje: 'La altura debe estar entre 140 y 250 cm' };
  }
  
  if (!sexo) {
    return { valido: false, mensaje: 'Por favor selecciona tu sexo' };
  }
  
  return { valido: true, mensaje: '' };
}

export function validarPassword(password) {
  if (!password) return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/;
  return regex.test(password);
}