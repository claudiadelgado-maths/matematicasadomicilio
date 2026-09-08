import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, generateExercise, toLatex, checkAnswer } from './monomios.mjs';

test('10 000 ejercicios: rangos, variedad, distribución y respuestas coherentes', () => {
  let seed = 72;
  const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  const signs = new Set(), letters = new Set(), fieldSets = new Set(), bounds = new Set();
  let fractions = 0;
  let previous;
  for (let index = 0; index < 10000; index++) {
    const ex = generateExercise(random, previous);
    if (previous) assert.notEqual(toLatex(ex), toLatex(previous));
    assert(ex.numerator >= 1 && ex.numerator <= 100);
    assert(ex.denominator >= 1 && ex.denominator <= 100);
    assert(ex.exponent >= 1 && ex.exponent <= 9);
    assert(ex.fields.length >= 1 && ex.fields.length <= 4);
    assert.equal(new Set(ex.fields).size, ex.fields.length);
    assert(ex.fields.every((field) => categories.includes(field)));
    const answers = { signo: ex.sign, coeficiente: `${ex.numerator}/${ex.denominator}`, literal: ex.literal, exponente: String(ex.exponent) };
    for (const field of ex.fields) assert(checkAnswer(ex, field, answers[field]).correct);
    fractions += Number(ex.fractional);
    signs.add(ex.sign); letters.add(ex.literal); fieldSets.add(ex.fields.join(','));
    bounds.add(ex.numerator); previous = ex;
  }
  assert(fractions > 2200 && fractions < 2800);
  assert.equal(signs.size, 2); assert.equal(letters.size, 9); assert.equal(fieldSets.size, 15);
  assert(bounds.has(1) && bounds.has(100));
});
const fraction = { sign: '-', numerator: 6, denominator: 4, literal: 'y', exponent: 5, fractional: true };
test('acepta equivalencia exacta; rechaza cero, negativos, expresiones y decimales aproximados', () => {
  for (const answer of ['6/4', '3/2', ' 9 / 6 ', '1.5', '1,5']) assert(checkAnswer(fraction, 'coeficiente', answer).correct, answer);
  for (const answer of ['', '-3/2', '3/0', '0', '1.499999', '2+1', 'NaN', '3/2/1', '<script>']) assert(!checkAnswer(fraction, 'coeficiente', answer).correct, answer);
  assert(!checkAnswer(fraction, 'literal', 'Y').correct);
  assert(checkAnswer(fraction, 'signo', '−').correct);
  assert(!checkAnswer(fraction, 'exponente', '5x').correct);
});
test('signo, coeficiente y exponente implícitos; no repite ni con azar constante', () => {
  const simple = { ...fraction, sign: '+', numerator: 1, denominator: 1, fractional: false, literal: 'x', exponent: 1 };
  assert.equal(toLatex(simple), 'x');
  assert(checkAnswer(simple, 'coeficiente', '1').correct);
  assert(checkAnswer(simple, 'exponente', '1').correct);
  const first = generateExercise(() => 0);
  assert.notEqual(toLatex(generateExercise(() => 0, first)), toLatex(first));
  assert.equal(toLatex(fraction), '-\\frac{6}{4}y^{5}');
});
