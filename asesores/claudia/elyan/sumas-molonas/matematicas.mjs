// Modelo puro: la misma descomposición gobierna generación, ayudas y validación.
export function columnas(a, b, cifras) {
  const pasos = [];
  let llevada = 0;
  for (let posicion = 0; posicion < cifras || llevada; posicion += 1) {
    const izquierda = Math.floor(a / 10 ** posicion) % 10;
    const derecha = Math.floor(b / 10 ** posicion) % 10;
    const total = izquierda + derecha + llevada;
    pasos.push({ posicion, izquierda, derecha, entrada: llevada, total,
      resultado: total % 10, salida: Math.floor(total / 10) });
    llevada = Math.floor(total / 10);
  }
  return pasos;
}

export function cumple(a, b, cifras, nivel) {
  const numero = columnas(a, b, cifras).filter(paso => paso.salida).length;
  return nivel === 'none' ? numero === 0 : nivel === 'one' ? numero === 1
    : nivel === 'many' ? numero >= 2 : cifras === 3 && a + b >= 1000;
}

export function generar(cifras, nivel, anterior = '', azar = Math.random) {
  const minimo = 10 ** (cifras - 1);
  const amplitud = 9 * minimo;
  for (let intento = 0; intento < 5000; intento += 1) {
    const a = minimo + Math.floor(azar() * amplitud);
    const b = minimo + Math.floor(azar() * amplitud);
    if (`${a}+${b}` !== anterior && cumple(a, b, cifras, nivel)) return { a, b };
  }
  // Garantiza respuesta incluso si el generador aleatorio no varía.
  const reservas = cifras === 2
    ? { none: [[23, 14], [41, 26]], one: [[28, 17], [34, 28]], many: [[68, 57], [76, 65]] }
    : { none: [[123, 254], [432, 156]], one: [[128, 217], [234, 328]], many: [[487, 356], [568, 274]], thousand: [[768, 594], [876, 457]] };
  const [a, b] = reservas[nivel].find(([a, b]) => `${a}+${b}` !== anterior);
  return { a, b };
}

export function validarPaso(paso, resultado, llevada) {
  return /^[0-9]$/.test(resultado) && Number(resultado) === paso.resultado
    && (!paso.salida || llevada === String(paso.salida));
}

export function descomponer(numero, cifras = 3) {
  return Array.from({ length: cifras }, (_, orden) => Math.floor(numero / 10 ** orden) % 10);
}

export function valorBilletes(digitos) {
  return digitos.reduce((valor, digito, orden) => valor + digito * 10 ** orden, 0);
}

export function cambioBilletes(a, b, orden) {
  const total = a + b;
  return { total: total * 10 ** orden, resto: total % 10, superior: Math.floor(total / 10), orden };
}
