import test from 'node:test';
import assert from 'node:assert/strict';
import { phases, mitosisOrder, recognition, questions } from './datos.mjs';
import { createOrder, shuffled } from './modelo.mjs';
import { frameFor, sceneMarkup } from './escena.mjs';
import { createAttempt, shuffleOptions } from '../../recursos/modelo-repaso.mjs';

test('Seis etapas, cuatro fases de mitosis y 16 preguntas con claves válidas', () => {
  assert.deepEqual(phases.map(p => p.id), ['interfase', ...mitosisOrder, 'citocinesis']);
  assert.equal(questions.length, 16);
  assert.equal(new Set(questions.map(q => q.id)).size, 16);
  assert.equal(questions.filter(q => q.phase !== undefined).length, 2);
  for (const q of questions) {
    assert.equal(q.options.length, 3);
    assert.equal(new Set(q.options).size, 3);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 3);
    assert.ok(q.explanation.length > 30);
    if (q.phase !== undefined) assert.ok(phases[q.phase]);
  }
  assert.deepEqual(recognition.map(r => r.phase).sort(), [1, 2, 3, 4]);
});
test('Ordenar exige la secuencia: ni errores ni dobles clics avanzan', () => {
  const order = createOrder();
  assert.equal(order.choose('anafase'), false); assert.equal(order.count, 0);
  assert.equal(order.choose('interfase'), false);
  for (const id of mitosisOrder) { assert.equal(order.choose(id), true); assert.equal(order.choose(id), false); }
  assert.equal(order.count, 4); assert.equal(order.complete, true);
  assert.equal(createOrder().count, 0);
});
test('Las opciones y las imágenes se mezclan sin perder elementos', () => {
  assert.deepEqual(shuffled(mitosisOrder, () => 0).sort(), [...mitosisOrder].sort());
  for (const q of questions) {
    const mixed = shuffleOptions(q, () => .4);
    assert.equal(mixed.find(o => o.index === q.answer).text, q.options[q.answer]);
  }
});
test('Conservación visual: ocho copias de ADN, cuatro colores, una de cada color por polo', () => {
  for (let i = 0; i < 6; i++) {
    const frame = frameFor(i);
    assert.equal(frame.chromosomes.length, 8);
    for (const c of frame.chromosomes) {
      assert.ok(Object.values(c).every(Number.isFinite));
      assert.ok(c.x > 70 && c.x < 690 && c.y > 50 && c.y < 370);
    }
  }
  const aligned = frameFor(2), separate = frameFor(3);
  for (let i = 0; i < 4; i++) {
    assert.equal(aligned.chromosomes[2 * i].y, aligned.chromosomes[2 * i + 1].y);
    assert.ok(aligned.chromosomes[2 * i + 1].x - aligned.chromosomes[2 * i].x < 15);
    assert.ok(separate.chromosomes[2 * i].x < 380);
    assert.ok(separate.chromosomes[2 * i + 1].x > 380);
    assert.equal(separate.chromosomes[2 * i].direction, 1);
    assert.equal(separate.chromosomes[2 * i + 1].direction, -1);
  }
  assert.equal(frameFor(4).newNuclei, 1); assert.equal(frameFor(4).cell, 1);
  assert.equal(frameFor(5).cell, 0); assert.equal(frameFor(5).daughters, 1);
});
test('Ilustraciones accesibles, sin IDs duplicados ni geometría no numérica', () => {
  for (let i = 0; i < 6; i++) {
    const svg = sceneMarkup(i);
    assert.match(svg, /role="img"/); assert.match(svg, /aria-label="/);
    assert.equal((svg.match(/data-chromosome=/g) || []).length, 8);
    assert.doesNotMatch(svg, /NaN|undefined|Infinity|\bid="/);
    assert.doesNotMatch(svg, /\sdata-[\w-]+(?=\s|>)/, 'Los SVG exportados necesitan atributos XML con valor explícito');
  }
  for (const i of [-1, 6, .5, NaN]) assert.throws(() => frameFor(i), RangeError);
});
test('Resultados 0/16 y 16/16; una respuesta por pregunta y reinicio limpio', () => {
  const correct = createAttempt(questions), wrong = createAttempt(questions);
  questions.forEach((q, i) => {
    correct.submit(i, q.answer); wrong.submit(i, (q.answer + 1) % 3);
    assert.equal(wrong.submit(i, q.answer), false);
  });
  assert.equal(correct.score, 16); assert.equal(correct.complete, true); assert.equal(correct.mistakes.length, 0);
  assert.equal(wrong.score, 0); assert.equal(wrong.mistakes.length, 16);
  assert.equal(createAttempt(questions).count, 0);
});
