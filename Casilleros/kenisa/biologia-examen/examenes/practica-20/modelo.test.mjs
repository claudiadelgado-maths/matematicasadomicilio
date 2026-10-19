import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { VERSIONS, SOURCES } from './versiones.mjs';
import { bank as syllabusBank } from '../temario-maestra/banco.mjs';
import { storageKey, newAttempt, chooseAnswer, missingQuestions, submitAttempt, getResult, restoreAttempt } from './modelo.mjs';

const version = VERSIONS[0];
const completed = (wrong = []) => version.questions.reduce((state, q) => chooseAnswer(state, version, q.id,
  wrong.includes(q.id) ? q.options.find(o => o.id !== q.expected).id : q.expected), newAttempt(version));

test('Versión 1: 20 reactivos únicos, 10 de opciones y 10 V/F, con clave y explicaciones', () => {
  assert.equal(VERSIONS.length, 2);
  assert.equal(version.questions.length, 20);
  assert.equal(new Set(version.questions.map(q => q.id)).size, 20);
  for (const kind of ['mc', 'tf']) assert.equal(version.questions.filter(q => q.kind === kind).length, 10);
  for (const q of version.questions) {
    assert.equal(q.options.length, q.kind === 'mc' ? 4 : 2);
    assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length);
    assert.ok(q.options.some(o => o.id === q.expected));
    assert.ok(q.explanation.length > 60);
    assert.ok(q.sources.length && q.sources.every(id => SOURCES[id]?.[1].startsWith('https://')));
  }
});

test('Los 19 enunciados y las 40 opciones coinciden literalmente con el documento recibido', () => {
  const original = readFileSync(new URL('./ORIGINAL.md', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
  const [mc, tf] = original.split('SECCIÓN II. VERDADERO O FALSO');
  const extract = text => [...text.matchAll(/Pregunta \d+[^\n]*\n\n([^\n]+)/g)].map(match => match[1]);
  assert.deepEqual(version.questions.filter(q => q.kind === 'mc').map(q => q.prompt), extract(mc));
  assert.deepEqual(version.questions.filter(q => q.kind === 'tf').slice(0, 9).map(q => q.prompt), extract(tf));
  assert.deepEqual(version.questions.filter(q => q.kind === 'mc').flatMap(q => q.options.map(o => o.label)), [...mc.matchAll(/^[abcd]\) (.+)$/gm)].map(match => match[1]));
  assert.deepEqual(version.questions.map(q => q.expected), ['d','b','b','d','d','b','a','b','d','a','v','f','f','f','f','f','f','v','f','v']);
  assert.ok(version.questions.filter(q => ['op-1','op-2','op-4','op-6','op-8','vf-1','vf-2'].includes(q.id)).every(q => q.clarification));
});

test('Ni 0 ni 19 respuestas permiten entregar o conocer la calificación', () => {
  let state = newAttempt(version);
  assert.equal(getResult(state, version), null);
  assert.equal(submitAttempt(state, version).status, 'draft');
  for (const q of version.questions.slice(0, 19)) state = chooseAnswer(state, version, q.id, q.expected);
  assert.equal(missingQuestions(state, version).length, 1);
  assert.equal(submitAttempt(state, version).status, 'draft');
  assert.equal(getResult(state, version), null);
  assert.equal(getResult(completed(), version), null);
});

test('Califica 0, 85 y 100 correctamente, desglosa secciones y conserva errores', () => {
  assert.equal(getResult(submitAttempt(completed(), version), version).score, 100);
  const result = getResult(submitAttempt(completed(['op-1', 'op-5', 'vf-9']), version), version);
  assert.equal(result.score, 85); assert.equal(result.correct, 17);
  assert.equal(result.mc, 8); assert.equal(result.tf, 9);
  assert.deepEqual(result.items.filter(q => !q.correct).map(q => q.id), ['op-1','op-5','vf-9']);
  const allWrong = completed(version.questions.map(q => q.id));
  assert.equal(getResult(submitAttempt(allWrong, version), version).score, 0);
});

test('Permite cambiar elecciones antes de entregar y bloquea cambios posteriores', () => {
  let draft = completed(); draft = chooseAnswer(draft, version, 'op-1', 'a');
  assert.equal(draft.answers['op-1'], 'a');
  const submitted = submitAttempt(draft, version);
  assert.equal(chooseAnswer(submitted, version, 'op-1', 'd'), submitted);
  assert.equal(submitAttempt(submitted, version), submitted);
  assert.equal(chooseAnswer(draft, version, 'op-1', 'invalida'), draft);
  assert.equal(chooseAnswer(draft, version, 'desconocida', 'a'), draft);
});

test('Recupera borradores y entregas, descarta datos corruptos y recalcula la nota', () => {
  const draft = chooseAnswer(newAttempt(version), version, 'vf-1', 'v');
  assert.deepEqual(restoreAttempt(JSON.stringify(draft), version), draft);
  const submitted = submitAttempt(completed(['vf-1']), version);
  assert.deepEqual(restoreAttempt(JSON.stringify(submitted), version), submitted);
  assert.equal(getResult(restoreAttempt(JSON.stringify({ ...submitted, score: 1000 }), version), version).score, 95);
  for (const raw of [null, 'bad json', '{}', '[]', '{"schema":9}', JSON.stringify({ ...submitted, version: 'otra' })]) {
    assert.deepEqual(restoreAttempt(raw, version), newAttempt(version));
  }
  const partial = restoreAttempt(JSON.stringify({ ...submitted, answers: { 'op-1': 'd', 'vf-1': 'incorrecta' } }), version);
  assert.equal(partial.status, 'draft'); assert.equal(missingQuestions(partial, version).length, 19);
});

test('Versiones e intentos independientes; reintentar no arrastra respuestas ni calificación', () => {
  const future = VERSIONS[1];
  assert.notEqual(storageKey(version), storageKey(future));
  assert.notEqual(storageKey(version), 'kenisa-biologia-examen-v1');
  assert.notEqual(storageKey(version), 'kenisa-biologia-examen-temario-v1');
  const old = submitAttempt(completed(), version);
  assert.equal(getResult(old, future), null);
  assert.deepEqual(restoreAttempt(JSON.stringify(old), future), newAttempt(future));
  const next = newAttempt(version, old.attempt + 1);
  assert.equal(next.attempt, 2); assert.equal(missingQuestions(next, version).length, 20);
  assert.equal(getResult(next, version), null);
  assert.equal(getResult(old, version).score, 100);
});

test('Versión 2: veinte preguntas nuevas, diez MC y diez V/F, sin dibujos necesarios', () => {
  const second = VERSIONS[1];
  const prior = new Set([...version.questions, ...syllabusBank].map(q => q.prompt.trim().toLowerCase()));
  assert.equal(second.questions.length, 20);
  assert.equal(second.questions.filter(q => q.kind === 'mc').length, 10);
  assert.equal(second.questions.filter(q => q.kind === 'tf').length, 10);
  assert.equal(second.questions.filter(q => q.kind === 'tf' && q.expected === 'v').length, 5);
  assert.equal(new Set(second.questions.map(q => q.prompt)).size, 20);
  assert.equal(new Set(second.questions.map(q => q.id)).size, 20);
  for (const q of second.questions) {
    assert.ok(!prior.has(q.prompt.trim().toLowerCase()), q.prompt);
    assert.equal(q.options.length, q.kind === 'mc' ? 4 : 2);
    assert.equal(new Set(q.options.map(o => o.label)).size, q.options.length);
    assert.ok(q.options.some(o => o.id === q.expected));
    assert.ok(q.explanation.length > 60);
    assert.ok(q.sources.every(id => SOURCES[id]?.[1].startsWith('https://')));
    assert.ok(!q.figure && !/dibujo|imagen|señalad|etiqueta|esquema/i.test(q.prompt));
  }
  assert.deepEqual(second.questions.map(q => q.expected), ['b','a','d','c','b','d','c','a','d','b','v','f','v','f','v','v','f','f','f','v']);
});

test('Versión 2: calificación independiente, guardado, bloqueo y nuevo intento', () => {
  const second = VERSIONS[1];
  let state = newAttempt(second);
  for (const q of second.questions) state = chooseAnswer(state, second, q.id, q.expected);
  assert.equal(getResult(state, second), null);
  state = submitAttempt(state, second);
  assert.equal(getResult(state, second).score, 100);
  assert.equal(getResult(state, version), null);
  assert.equal(chooseAnswer(state, second, 'op-1', 'a'), state);
  assert.deepEqual(restoreAttempt(JSON.stringify(state), second), state);
  assert.equal(missingQuestions(newAttempt(second, 2), second).length, 20);
  assert.equal(getResult(submitAttempt(completed(['op-1']), version), version).score, 95);
});
