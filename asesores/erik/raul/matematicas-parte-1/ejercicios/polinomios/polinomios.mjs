export const kinds = ['grado', 'terminos', 'independiente', 'mayor', 'menor'];
const randint = (a, b, random) => a + Math.floor(random() * (b - a + 1));
function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randint(0, i, random);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function answerFor(terms, kind) {
  if (kind === 'grado') return Math.max(...terms.map(t => t.exponent));
  if (kind === 'terminos') return terms.length;
  if (kind === 'independiente') return terms.find(t => t.exponent === 0)?.coefficient || 0;
  return Math[kind === 'mayor' ? 'max' : 'min'](...terms.map(t => t.coefficient));
}
export function toLatex({ terms, variable }) {
  return terms.map(({ coefficient, exponent }, index) => {
    const sign = coefficient < 0 ? '-' : index ? '+' : '';
    const magnitude = Math.abs(coefficient);
    const number = magnitude === 1 && exponent > 0 ? '' : magnitude;
    return `${sign}${number}${exponent ? variable : ''}${exponent > 1 ? `^{${exponent}}` : ''}`;
  }).join(' ');
}
export function generateExercise(random = Math.random, previous) {
  const kind = shuffle(kinds.filter(k => k !== previous?.kind), random)[0];
  let exercise;
  for (let attempt = 0; attempt < 60; attempt++) {
    const count = randint(3, 5, random);
    const exponents = [...shuffle([1,2,3,4,5,6,7,8], random).slice(0, count - 1), 0].sort((a,b) => b-a);
    const coefficients = shuffle(Array.from({length:40}, (_,i) => i < 20 ? i-20 : i-19), random).slice(0,count);
    const terms = exponents.map((exponent,i) => ({exponent, coefficient:coefficients[i]}));
    exercise = {kind, terms, variable: shuffle(['x','y','a','b','m','n','t'],random)[0]};
    exercise.answer = answerFor(terms,kind);
    if (!previous || (exercise.answer !== previous.answer && toLatex(exercise) !== toLatex(previous))) break;
  }
  const candidates = kind === 'mayor' || kind === 'menor' || kind === 'independiente'
    ? exercise.terms.map(t=>t.coefficient) : [exercise.answer-1,exercise.answer+1,exercise.answer+2];
  const distractors = [...new Set(candidates)].filter(n=>n!==exercise.answer && (kind !== 'grado' && kind !== 'terminos' || n>0));
  exercise.options = shuffle([exercise.answer,...shuffle(distractors,random).slice(0,2)],random);
  return exercise;
}
export const questions = {
  grado: '¿Cuál es el grado del polinomio?',
  terminos: '¿Cuántos términos tiene el polinomio?',
  independiente: '¿Cuál es el término independiente?',
  mayor: '¿Cuál es el coeficiente más grande?',
  menor: '¿Cuál es el coeficiente más pequeño?',
};
export const hints = {
  grado: 'Busca el mayor exponente de la variable.',
  terminos: 'Cuenta cada término, incluido el que no lleva variable.',
  independiente: 'Busca el término que no tiene variable y conserva su signo.',
  mayor: 'Compara los coeficientes con su signo, incluido el término independiente. Un positivo es mayor que un negativo.',
  menor: 'Compara los coeficientes con su signo, incluido el término independiente. Entre negativos, el más alejado de cero es menor.',
};
