export const storageKey = version => `kenisa-biologia-practica-20-v1:${version.id}`;
export const newAttempt = (version, attempt = 1) => ({ schema: 1, version: version.id, attempt, status: 'draft', answers: {} });
export const missingQuestions = (state, version) => version.questions.filter(q => !q.options.some(o => o.id === state.answers[q.id]));

export function chooseAnswer(state, version, id, value) {
  if (state.version !== version.id || state.status !== 'draft') return state;
  const q = version.questions.find(q => q.id === id);
  if (!q?.options.some(o => o.id === value)) return state;
  return { ...state, answers: { ...state.answers, [id]: value } };
}

export function submitAttempt(state, version) {
  if (state.version !== version.id || state.status !== 'draft' || missingQuestions(state, version).length) return state;
  return { ...state, status: 'submitted' };
}

export function getResult(state, version) {
  if (state.version !== version.id || state.status !== 'submitted' || missingQuestions(state, version).length) return null;
  const items = version.questions.map(q => ({ ...q, answer: state.answers[q.id], correct: state.answers[q.id] === q.expected }));
  const correct = items.filter(q => q.correct).length;
  return { items, correct, total: items.length, score: Math.round(correct / items.length * 100),
    mc: items.filter(q => q.kind === 'mc' && q.correct).length,
    tf: items.filter(q => q.kind === 'tf' && q.correct).length };
}

export function restoreAttempt(raw, version) {
  try {
    const saved = JSON.parse(raw);
    if (saved?.schema !== 1 || saved.version !== version.id || !['draft', 'submitted'].includes(saved.status)) return newAttempt(version);
    const attempt = Number.isSafeInteger(saved.attempt) && saved.attempt > 0 ? saved.attempt : 1;
    let state = newAttempt(version, attempt);
    for (const q of version.questions) state = chooseAnswer(state, version, q.id, saved.answers?.[q.id]);
    if (saved.status === 'submitted') state = submitAttempt(state, version);
    return state;
  } catch { return newAttempt(version); }
}
