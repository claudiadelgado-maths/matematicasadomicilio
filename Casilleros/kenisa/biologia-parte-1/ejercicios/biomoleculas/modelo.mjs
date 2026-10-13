export function createSortingState(round, categories) {
  return { round, categories, index: 0, attempts: 0, solved: false, finished: false, records: [] };
}

export function classifyCard(state, categoryId) {
  if (state.finished || state.solved || !state.categories.some(({ id }) => id === categoryId)) return null;
  state.attempts++;
  const question = state.round[state.index];
  const correct = categoryId === question.categoryId;
  if (correct) {
    state.solved = true;
    state.records.push({ id: question.id, categoryId, firstTry: state.attempts === 1, attempts: state.attempts });
  }
  return { correct, attempts: state.attempts };
}

export function advanceSorting(state) {
  if (state.finished || !state.solved) return false;
  if (state.index + 1 === state.round.length) state.finished = true;
  else { state.index++; state.attempts = 0; state.solved = false; }
  return true;
}

export function sortingScore(state) {
  return {
    total: state.round.length, solved: state.records.length,
    firstTry: state.records.filter(({ firstTry }) => firstTry).length,
    categories: state.categories.map((category) => ({
      ...category,
      solved: state.records.filter(({ categoryId }) => categoryId === category.id).length,
      firstTry: state.records.filter((record) => record.categoryId === category.id && record.firstTry).length,
      total: state.round.filter(({ categoryId }) => categoryId === category.id).length
    }))
  };
}
