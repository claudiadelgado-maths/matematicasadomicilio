import test from 'node:test';
import assert from 'node:assert/strict';
import { anatomy, detective, questions } from './datos.mjs';
import { createAttempt, shuffleOptions } from './modelo.mjs';

test('Los bancos tienen opciones únicas, claves válidas y explicaciones', () => {
  assert.equal(anatomy.length, 3);
  assert.equal(detective.length, 6);
  assert.equal(questions.length, 14);
  assert.equal(new Set(questions.map(q => q.id)).size, 14);
  for (const item of [...anatomy, ...detective, ...questions]) {
    assert.equal(item.options.length, 3);
    assert.equal(new Set(item.options).size, 3);
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 3);
    assert.ok(item.prompt && item.explanation);
    if (item.section) assert.ok(['explora', 'copias', 'juegos'].includes(item.section));
  }
});
test('La primera respuesta confirmada es la única puntuable', () => {
  const attempt = createAttempt(questions);
  assert.equal(attempt.submit(0, (questions[0].answer + 1) % 3), true);
  assert.equal(attempt.submit(0, questions[0].answer), false);
  assert.equal(attempt.score, 0);
  assert.equal(attempt.count, 1);
  assert.equal(attempt.mistakes.length, 1);
  assert.equal(attempt.complete, false);
});
test('Entradas inválidas no consumen preguntas', () => {
  const attempt = createAttempt(questions);
  for (const [index, choice] of [[0, -1], [0, 3], [0, NaN], [0, 1.5], [-1, 0], [14, 0], [0.5, 0]]) assert.equal(attempt.submit(index, choice), false);
  assert.equal(attempt.count, 0);
});
test('Resultados completos 0/14 y 14/14; reinicios independientes', () => {
  const perfect = createAttempt(questions), wrong = createAttempt(questions), fresh = createAttempt(questions);
  questions.forEach((item, index) => { perfect.submit(index, item.answer); wrong.submit(index, (item.answer + 1) % 3); });
  assert.equal(perfect.score, 14); assert.equal(perfect.complete, true); assert.equal(perfect.mistakes.length, 0);
  assert.equal(wrong.score, 0); assert.equal(wrong.complete, true); assert.equal(wrong.mistakes.length, 14);
  assert.equal(fresh.count, 0); assert.equal(fresh.complete, false);
  assert.equal(perfect.submit(0, 2), false); assert.equal(perfect.score, 14);
});
test('Mezclar opciones preserva texto, claves y respuesta correcta', () => {
  for (const item of questions) {
    const mixed = shuffleOptions(item, () => 0);
    assert.deepEqual(mixed.map(option => option.index).sort(), [0, 1, 2]);
    assert.equal(mixed.find(option => option.index === item.answer).text, item.options[item.answer]);
    assert.deepEqual(mixed.map(option => option.text).sort(), [...item.options].sort());
  }
});
