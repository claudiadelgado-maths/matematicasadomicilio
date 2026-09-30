import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAngle, anglePaths, polarPoint, AngleTurn, createQuestionGenerator } from './modelo.mjs';

test('clasificación exacta de todos los grados enteros, incluidos los siete límites y categorías', () => {
  const intervals = [[0, 0, 'nulo'], [1, 89, 'agudo'], [90, 90, 'recto'], [91, 179, 'obtuso'], [180, 180, 'llano'], [181, 359, 'concavo'], [360, 360, 'completo']];
  for (const [start, end, key] of intervals) for (let angle = start; angle <= end; angle++) assert.equal(classifyAngle(angle).key, key, `${angle}°`);
  assert.equal(classifyAngle(89.999).key, 'agudo');
  assert.equal(classifyAngle(90.001).key, 'obtuso');
  assert.equal(classifyAngle(179.999).key, 'obtuso');
  assert.equal(classifyAngle(180.001).key, 'concavo');
  assert.equal(classifyAngle(359.999).key, 'concavo');
});

test('el dibujo diferencia un giro nulo de una vuelta completa con idéntica dirección final', () => {
  const first = polarPoint(0, 156), last = polarPoint(360, 156);
  assert.ok(Math.hypot(first.x - last.x, first.y - last.y) < 1e-9);
  assert.equal(anglePaths(0).sector, '');
  assert.equal(anglePaths(0).arc, '');
  assert.equal((anglePaths(360).arc.match(/A/g) || []).length, 2);
  assert.equal((anglePaths(360).sector.match(/A/g) || []).length, 2);
  assert.match(anglePaths(300).arc, /0 1 0/);
  assert.match(anglePaths(45).arc, /0 0 0/);
  assert.ok(polarPoint(90, 156).y < 240, '90° debe quedar sobre el vértice');
  assert.ok(polarPoint(270, 156).y > 240, '270° debe quedar debajo del vértice');
});

test('arrastrar una vuelta conserva 360° y regresar en sentido inverso conserva 0°', () => {
  const forward = new AngleTurn(0, 0);
  for (let raw = 15; raw <= 360; raw += 15) assert.equal(forward.move(raw % 360), raw);
  assert.equal(forward.move(15), 360, 'no saltar a 15° al superar el límite');
  assert.equal(forward.move(0), 360);
  assert.equal(forward.move(345), 345);
  const backward = new AngleTurn(360, 0);
  for (let angle = 345; angle >= 0; angle -= 15) assert.equal(backward.move(angle), angle);
  assert.equal(backward.move(345), 0, 'no saltar a 345° al superar el límite inferior');
});

test('práctica ilimitada equilibrada: cada siete ejercicios incluye todos los tipos y los cuatro casos especiales', () => {
  const generate = createQuestionGenerator();
  let previous = null;
  const varied = new Set();
  for (let round = 0; round < 200; round++) {
    const types = new Set(), angles = new Set();
    for (let index = 0; index < 7; index++) {
      const question = generate();
      assert.equal(classifyAngle(question.angle).key, question.type.key);
      assert.ok(Number.isInteger(question.angle) && question.angle >= 0 && question.angle <= 360);
      assert.notEqual(question.type.key, previous, 'evitar repetir el tipo entre rondas');
      previous = question.type.key;
      types.add(question.type.key); angles.add(question.angle); varied.add(question.angle);
    }
    assert.equal(types.size, 7);
    for (const special of [0, 90, 180, 360]) assert.ok(angles.has(special));
  }
  assert.ok(varied.size > 150, 'diversidad de valores agudos, obtusos y cóncavos');
});
