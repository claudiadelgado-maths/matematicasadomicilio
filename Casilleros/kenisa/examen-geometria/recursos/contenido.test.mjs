import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAMENES } from './examenes.mjs';

// Cálculos independientes a partir de los datos del autor. En A15, B15,
// C15 y D24 se comprueba la aplicación algebraica de A = Pa/2,
// conforme a la indicación expresa del autor, sin exigir una figura realizable.
const resultados = {
  A: {
    2: 42, 3: 180 / (2 + 1), 9: 3 * (80 / 8) ** 2,
    10: (2 * 36 / 6 - 2) / 2, 12: 720 / 180 + 2,
    13: 360 / 3, 14: 360 / (180 - 120), 15: 2 * 25 / (5 * 2)
  },
  B: {
    2: 65, 3: 180 / (3 + 1), 9: 2 * (60 / 6) ** 2,
    10: (2 * 32 / 4 - 4) / 2, 12: 900 / 180 + 2,
    13: 360 / 6, 14: 360 / (180 - 135), 15: 2 * 60 / (6 * 4)
  },
  C: {
    2: 90 - 35, 3: 180 - 125, 5: 180 - 45 - 65, 7: 4 * 7,
    8: 12 * 5 / 2, 9: (10 + 6) * 4 / 2, 10: 3.14 * 5 ** 2,
    11: 8 - 3, 12: 360 / 10, 13: 1080 / 180 + 2,
    15: 30 * 4 / 2, 16: Math.hypot(9, 12)
  },
  D: {
    2: 90 - 27, 3: 360 - 135, 4: 74, 5: 118, 6: 180 - 146,
    9: 180 - 47 - 68, 10: 180 - 55, 16: 2 * (9 + 4),
    17: 6 ** 2, 18: 14 * 9 / 2, 19: (14 + 8) * 5 / 2,
    20: 3.14 * 4 ** 2, 21: 2 * 3.14 * 7, 23: 7 * 5,
    24: 48 * 3.5 / 2, 25: 10 - 3, 26: 8 * (8 - 3) / 2,
    27: 360 / 12, 28: (9 - 2) * 180, 32: (40 - 10) / 5
  }
};
const lados = { 'Hexágono': 6, 'Pentágono': 5, 'Heptágono': 7, 'Eneágono': 9, 'Octágono': 8 };
const valor = texto => lados[texto] ?? Number.parseFloat(texto.replace(/^x=/, ''));

test('48 preguntas de cálculo en A–D: resultado obtenido por fórmula y una única opción correcta', () => {
  let revisadas = 0;
  for (const [version, preguntas] of Object.entries(resultados)) {
    for (const [numero, esperado] of Object.entries(preguntas)) {
      const q = EXAMENES[version].preguntas[Number(numero) - 1];
      const validas = q.opciones.filter(o => Math.abs(valor(o.texto) - esperado) < 1e-8);
      assert.equal(validas.length, 1, `${version}${numero}: resultado ${esperado}`);
      assert.equal(validas[0].letra, q.correcta, `${version}${numero}: clave`);
      revisadas++;
    }
  }
  assert.equal(revisadas, 48);
});
