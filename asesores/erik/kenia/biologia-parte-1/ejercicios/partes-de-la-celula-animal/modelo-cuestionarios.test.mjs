import test from 'node:test';
import assert from 'node:assert/strict';
import { STRUCTURES, DESCRIPTION_BANK, REASONING_BANK } from './banco-preguntas.mjs';
import { createRoundGenerator, createQuizState, answerQuestion, nextQuestion, scoreQuiz } from './modelo-cuestionarios.mjs';

const seededRandom = () => {
  let seed = 934187;
  return () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32; };
};

test('99 preguntas únicas y bancos de distractores válidos; todas las estructuras tienen variantes', () => {
  assert.equal(DESCRIPTION_BANK.length, 55);
  assert.equal(REASONING_BANK.length, 44);
  const bank = [...DESCRIPTION_BANK, ...REASONING_BANK];
  assert.equal(new Set(bank.map(({ id }) => id)).size, 99);
  assert.equal(new Set(bank.map(({ prompt }) => prompt)).size, 99);
  for (const question of bank) {
    assert.ok(STRUCTURES.some(({ id }) => id === question.structureId));
    assert.equal(question.choices.length, 4, question.id);
    assert.equal(new Set(question.choices.map(({ id }) => id)).size, 4, question.id);
    assert.equal(new Set(question.choices.map(({ text }) => text)).size, 4, question.id);
    assert.equal(question.choices.filter(({ id }) => id === question.correctId).length, 1, question.id);
    assert.ok(question.prompt.length > 30 && question.explanation.length > 40, question.id);
  }
  for (const structure of STRUCTURES) {
    assert.equal(DESCRIPTION_BANK.filter(({ structureId }) => structureId === structure.id).length, 5);
    assert.equal(REASONING_BANK.filter(({ structureId }) => structureId === structure.id).length, 4);
  }
  assert.ok(new Set(REASONING_BANK.map(({ kind }) => kind)).size >= 8);
});

test('200 rondas cubren once estructuras dos veces, sin duplicados; tres opciones y posición correcta variable', () => {
  for (const bank of [DESCRIPTION_BANK, REASONING_BANK]) {
    const snapshot = JSON.stringify(bank);
    const generate = createRoundGenerator(bank, seededRandom());
    const seen = new Set();
    const positions = new Set();
    let previous = null;
    let firstRound;
    for (let roundIndex = 0; roundIndex < 200; roundIndex++) {
      const round = generate();
      assert.equal(round.length, 22);
      assert.equal(new Set(round.map(({ id }) => id)).size, 22);
      for (const offset of [0, 11]) assert.equal(new Set(round.slice(offset, offset + 11).map(({ structureId }) => structureId)).size, 11);
      for (const question of round) {
        assert.equal(question.choices.length, 3);
        assert.equal(question.choices.filter(({ id }) => id === question.correctId).length, 1);
        assert.notEqual(question.structureId, previous);
        previous = question.structureId;
        positions.add(question.choices.findIndex(({ id }) => id === question.correctId));
        seen.add(question.id);
      }
      for (const structure of STRUCTURES) assert.equal(round.filter(({ structureId }) => structureId === structure.id).length, 2);
      if (!roundIndex) firstRound = new Set(round.map(({ id }) => id));
      if (roundIndex === 1) assert.ok(round.every(({ id }) => !firstRound.has(id)), 'La segunda ronda usa variantes nuevas.');
    }
    assert.equal(seen.size, bank.length);
    assert.equal(positions.size, 3);
    assert.equal(JSON.stringify(bank), snapshot, 'Generar no modifica el banco original.');
  }
});

test('el puntaje cuenta una sola respuesta; no se avanza sin contestar ni se altera al terminar', () => {
  const generate = createRoundGenerator(REASONING_BANK, seededRandom());
  const state = createQuizState(generate());
  assert.equal(nextQuestion(state), false);
  assert.equal(answerQuestion(state, 'inexistente'), null);
  for (let index = 0; index < 22; index++) {
    const question = state.round[index];
    const choice = index % 2 ? question.correctId : question.choices.find(({ id }) => id !== question.correctId).id;
    assert.equal(answerQuestion(state, choice).correct, Boolean(index % 2));
    assert.equal(answerQuestion(state, question.correctId), null, 'No se puede cambiar ni duplicar un acierto.');
    assert.equal(nextQuestion(state), true);
  }
  assert.equal(state.finished, true);
  const score = scoreQuiz(state);
  assert.equal(score.correct, 11);
  assert.equal(score.percent, 50);
  assert.equal(score.answered, 22);
  assert.equal(score.structures.reduce((sum, { correct }) => sum + correct, 0), 11);
  assert.ok(score.structures.every(({ total }) => total === 2));
  assert.equal(nextQuestion(state), false);
  assert.equal(answerQuestion(state, state.round[21].correctId), null);
});

test('actividades independientes; reiniciar crea un estado vacío y permite llegar a 22/22', () => {
  const generate = createRoundGenerator(DESCRIPTION_BANK, seededRandom());
  const oldState = createQuizState(generate());
  answerQuestion(oldState, oldState.round[0].correctId);
  const otherState = createQuizState(createRoundGenerator(REASONING_BANK, seededRandom())());
  assert.equal(scoreQuiz(otherState).correct, 0);
  const state = createQuizState(generate());
  assert.equal(state.index, 0);
  assert.equal(scoreQuiz(state).answered, 0);
  assert.equal(state.finished, false);
  for (const question of state.round) { answerQuestion(state, question.correctId); nextQuestion(state); }
  assert.equal(scoreQuiz(state).correct, 22);
  assert.equal(scoreQuiz(state).percent, 100);
  assert.equal(scoreQuiz(oldState).correct, 1);
});
