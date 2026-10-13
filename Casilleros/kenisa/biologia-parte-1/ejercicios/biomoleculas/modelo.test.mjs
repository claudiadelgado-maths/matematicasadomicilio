import test from 'node:test';
import assert from 'node:assert/strict';
import { BIOMOLECULES, FUNCTION_BANK, SORTING_BANK } from './datos.mjs';
import { createRoundGenerator, createQuizState, answerQuestion, nextQuestion, scoreQuiz } from '../../recursos/modelo-repaso.mjs';
import { createSortingState, classifyCard, advanceSorting, sortingScore } from './modelo.mjs';
const random = () => { let seed = 95112; return () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32; }; };

test('siete biomoléculas y 105 preguntas/tarjetas originales válidas, con cobertura de todos los grupos', () => {
  assert.equal(BIOMOLECULES.length, 7); assert.equal(FUNCTION_BANK.length, 49); assert.equal(SORTING_BANK.length, 56);
  const bank = [...FUNCTION_BANK, ...SORTING_BANK];
  assert.equal(new Set(bank.map(({ id }) => id)).size, 105);
  assert.equal(new Set(bank.map(({ prompt }) => prompt)).size, 105);
  for (const question of bank) {
    assert.ok(BIOMOLECULES.some(({ id }) => id === question.categoryId));
    assert.equal(question.choices.length, 7);
    assert.equal(question.choices.filter(({ id }) => id === question.correctId).length, 1);
    assert.ok(question.explanation.length > 20);
  }
  for (const item of BIOMOLECULES) {
    assert.equal(item.facts.length, 3); assert.equal(item.demo.length, 3);
    assert.equal(FUNCTION_BANK.filter(({ categoryId }) => categoryId === item.id).length, 7);
    assert.equal(SORTING_BANK.filter(({ categoryId }) => categoryId === item.id).length, 8);
  }
});

test('200 rondas de cada banco: 14 tarjetas distintas, dos por grupo, tres opciones válidas y nuevas variantes', () => {
  for (const bank of [FUNCTION_BANK, SORTING_BANK]) {
    const generate = createRoundGenerator(bank, BIOMOLECULES, { random: random() });
    const all = new Set(), positions = new Set(); let previous = null, first;
    for (let pass = 0; pass < 200; pass++) {
      const round = generate(); assert.equal(round.length, 14); assert.equal(new Set(round.map(({ id }) => id)).size, 14);
      for (const item of BIOMOLECULES) assert.equal(round.filter(({ categoryId }) => categoryId === item.id).length, 2);
      for (const question of round) {
        assert.notEqual(question.categoryId, previous); previous = question.categoryId;
        assert.equal(question.choices.length, 3);
        assert.equal(question.choices.filter(({ id }) => id === question.correctId).length, 1);
        positions.add(question.choices.findIndex(({ id }) => id === question.correctId)); all.add(question.id);
      }
      if (!pass) first = new Set(round.map(({ id }) => id));
      if (pass === 1) assert.ok(round.every(({ id }) => !first.has(id)));
    }
    assert.equal(all.size, bank.length); assert.equal(positions.size, 3);
  }
});

test('preguntas: una respuesta puntuable, bloqueo de avance vacío, 7/14 y reinicio independiente', () => {
  const generate = createRoundGenerator(FUNCTION_BANK, BIOMOLECULES, { random: random() });
  const state = createQuizState(generate(), BIOMOLECULES);
  assert.equal(nextQuestion(state), false);
  for (let index = 0; index < 14; index++) {
    const question = state.round[index]; const choice = index % 2 ? question.correctId : question.choices.find(({ id }) => id !== question.correctId).id;
    answerQuestion(state, choice); assert.equal(answerQuestion(state, question.correctId), null); nextQuestion(state);
  }
  assert.equal(state.finished, true); assert.equal(scoreQuiz(state).correct, 7); assert.equal(scoreQuiz(state).percent, 50);
  const reset = createQuizState(generate(), BIOMOLECULES); assert.equal(scoreQuiz(reset).answered, 0); assert.equal(scoreQuiz(state).correct, 7);
});

test('clasificación: errores permiten reintentar, no cuentan acierto inicial ni duplican colocaciones; final y reinicio', () => {
  const generate = createRoundGenerator(SORTING_BANK, BIOMOLECULES, { random: random() });
  const state = createSortingState(generate(), BIOMOLECULES);
  assert.equal(advanceSorting(state), false); assert.equal(classifyCard(state, 'otro'), null);
  for (let index = 0; index < 14; index++) {
    const question = state.round[index];
    if (!(index % 2)) {
      const wrong = BIOMOLECULES.find(({ id }) => id !== question.categoryId).id;
      assert.equal(classifyCard(state, wrong).correct, false); assert.equal(advanceSorting(state), false);
    }
    assert.equal(classifyCard(state, question.categoryId).correct, true);
    assert.equal(classifyCard(state, question.categoryId), null); assert.equal(advanceSorting(state), true);
  }
  assert.equal(state.finished, true); assert.equal(sortingScore(state).solved, 14); assert.equal(sortingScore(state).firstTry, 7);
  assert.equal(classifyCard(state, state.round[13].categoryId), null); assert.equal(advanceSorting(state), false);
  assert.ok(sortingScore(state).categories.every(({ total, solved }) => total === 2 && solved === 2));
  const reset = createSortingState(generate(), BIOMOLECULES); assert.equal(sortingScore(reset).solved, 0); assert.equal(sortingScore(reset).firstTry, 0);
});
