import test from 'node:test';
import assert from 'node:assert/strict';
import { createRoundGenerator, createQuizState, answerQuestion, nextQuestion, scoreQuiz, createErrorRound } from './modelo-repaso.mjs';
import { DESCRIPTION_BANK, REASONING_BANK, STRUCTURES } from '../ejercicios/partes-de-la-celula-animal/banco-preguntas.mjs';
import { FUNCTION_BANK, BIOMOLECULES } from '../ejercicios/biomoleculas/datos.mjs';

function seededRandom() {
  let seed = 92763;
  return () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32; };
}

test('alternar rondas breves y completas mantiene cobertura, variedad y opciones válidas', () => {
  for (const [bank, categories] of [[DESCRIPTION_BANK, STRUCTURES], [REASONING_BANK, STRUCTURES], [FUNCTION_BANK, BIOMOLECULES]]) {
    const snapshot = JSON.stringify(bank);
    const generate = createRoundGenerator(bank, categories, { random: seededRandom() });
    const seen = new Set();
    for (let index = 0; index < 80; index++) {
      const count = index % 2 + 1;
      const round = generate(count);
      assert.equal(round.length, categories.length * count);
      assert.equal(new Set(round.map(({ id }) => id)).size, round.length);
      for (const category of categories) assert.equal(round.filter((question) => (question.categoryId || question.structureId) === category.id).length, count);
      for (const question of round) {
        assert.equal(question.choices.length, 3);
        assert.equal(question.choices.filter(({ id }) => id === question.correctId).length, 1);
        seen.add(question.id);
      }
    }
    assert.equal(seen.size, bank.length);
    assert.equal(JSON.stringify(bank), snapshot);
    assert.throws(() => generate(0));
    assert.throws(() => generate(3));
  }
});

test('repasar solo los errores conserva la calificación inicial y permite corregir un subconjunto', () => {
  const generate = createRoundGenerator(DESCRIPTION_BANK, STRUCTURES, { random: seededRandom() });
  const initial = createQuizState(generate(1), STRUCTURES);
  const missed = [];
  for (let index = 0; index < initial.round.length; index++) {
    const question = initial.round[index];
    const incorrect = index < 3;
    if (incorrect) missed.push(question.id);
    answerQuestion(initial, incorrect ? question.choices.find(({ id }) => id !== question.correctId).id : question.correctId);
    nextQuestion(initial);
  }
  const snapshot = JSON.stringify(initial);
  const retry = createQuizState(createErrorRound(initial, seededRandom()), STRUCTURES);
  assert.deepEqual(retry.round.map(({ id }) => id).sort(), missed.sort());
  assert.equal(scoreQuiz(initial).correct, 8);
  for (const question of retry.round) { answerQuestion(retry, question.correctId); nextQuestion(retry); }
  assert.equal(scoreQuiz(retry).total, 3);
  assert.equal(scoreQuiz(retry).percent, 100);
  assert.equal(scoreQuiz(retry).categories.filter(({ total }) => total > 0).length, 3);
  assert.deepEqual(createErrorRound(retry), []);
  assert.equal(JSON.stringify(initial), snapshot);
});

test('un repaso sucesivo contiene únicamente los errores que quedan pendientes', () => {
  const initial = createQuizState(createRoundGenerator(FUNCTION_BANK, BIOMOLECULES, { random: seededRandom() })(1), BIOMOLECULES);
  for (const question of initial.round) { answerQuestion(initial, question.choices.find(({ id }) => id !== question.correctId).id); nextQuestion(initial); }
  assert.equal(scoreQuiz(initial).percent, 0);
  const retry = createQuizState(createErrorRound(initial, seededRandom()), BIOMOLECULES);
  const stillMissed = retry.round[0];
  for (const question of retry.round) {
    answerQuestion(retry, question.id === stillMissed.id ? question.choices.find(({ id }) => id !== question.correctId).id : question.correctId);
    nextQuestion(retry);
  }
  assert.deepEqual(createErrorRound(retry).map(({ id }) => id), [stillMissed.id]);
  assert.equal(scoreQuiz(initial).correct, 0);
});
