export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

// Dos preguntas distintas por estructura. Los bancos se agotan antes de reciclarse.
export function createRoundGenerator(bank, categories, { random = Math.random, optionCount = 3 } = {}) {
  const groups = new Map(categories.map(({ id }) => [id, bank.filter((question) => (question.categoryId || question.structureId) === id)]));
  for (const [id, entries] of groups) {
    if (entries.length < 2) throw new Error(`Faltan variantes de ${id}.`);
  }
  const decks = new Map();
  let lastStructure = null;
  return (perCategory = 2) => {
    if (![1, 2].includes(perCategory)) throw new Error('Elige una o dos preguntas por tema.');
    const selected = new Map();
    for (const [id, entries] of groups) {
      const pair = [];
      let deck = decks.get(id) || [];
      while (pair.length < perCategory) {
        if (!deck.length) deck = shuffle(entries, random);
        // Al cruzar un ciclo no repetir la misma pregunta dentro de la ronda.
        const index = deck.findIndex((question) => !pair.some((item) => item.id === question.id));
        if (index < 0) throw new Error(`No hay dos preguntas distintas de ${id}.`);
        pair.push(deck.splice(index, 1)[0]);
      }
      decks.set(id, deck);
      selected.set(id, pair);
    }
    const round = [];
    for (let pass = 0; pass < perCategory; pass++) {
      const order = shuffle(categories.map(({ id }) => id), random);
      if (order[0] === lastStructure) order.push(order.shift());
      for (const id of order) {
        const question = selected.get(id)[pass];
        const correct = question.choices.find(({ id: choiceId }) => choiceId === question.correctId);
        const distractors = shuffle(question.choices.filter(({ id: choiceId }) => choiceId !== question.correctId), random).slice(0, optionCount - 1);
        if (!correct || distractors.length !== optionCount - 1) throw new Error(`Opciones inválidas: ${question.id}.`);
        round.push({ ...question, choices: shuffle([correct, ...distractors], random) });
      }
      lastStructure = order.at(-1);
    }
    return round;
  };
}

// Un repaso separado conserva la primera calificación y mezcla de nuevo las opciones.
export function createErrorRound(state, random = Math.random) {
  const missed = new Set(state.answers.filter(({ correct }) => !correct).map(({ questionId }) => questionId));
  return shuffle(state.round.filter(({ id }) => missed.has(id)), random)
    .map((question) => ({ ...question, choices: shuffle(question.choices, random) }));
}

export function createQuizState(round, categories) {
  return { round, categories, index: 0, answers: [], finished: false };
}

export function answerQuestion(state, choiceId) {
  const question = state.round[state.index];
  if (state.finished || state.answers.length > state.index || !question.choices.some(({ id }) => id === choiceId)) return null;
  const answer = { questionId: question.id, categoryId: question.categoryId || question.structureId, choiceId, correct: choiceId === question.correctId };
  state.answers.push(answer);
  return answer;
}

export function nextQuestion(state) {
  if (state.finished || state.answers.length <= state.index) return false;
  if (state.index + 1 === state.round.length) state.finished = true;
  else state.index++;
  return true;
}

export function scoreQuiz(state) {
  const correct = state.answers.filter((answer) => answer.correct).length;
  return {
    correct, total: state.round.length, answered: state.answers.length,
    percent: Math.round(correct / state.round.length * 100),
    categories: state.categories.map((structure) => ({
      ...structure,
      correct: state.answers.filter((answer) => answer.categoryId === structure.id && answer.correct).length,
      total: state.round.filter((question) => (question.categoryId || question.structureId) === structure.id).length
    }))
  };
}
