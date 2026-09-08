export const categories = ['signo', 'coeficiente', 'literal', 'exponente'];
export const literals = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 't', 'z'];
const integer = (min, max, random) => min + Math.floor(random() * (max - min + 1));
export function generateExercise(random = Math.random, previous) {
  const fractional = random() < 0.25;
  const exercise = {
    sign: random() < 0.5 ? '-' : '+',
    numerator: integer(1, 100, random),
    denominator: fractional ? integer(1, 100, random) : 1,
    literal: literals[integer(0, literals.length - 1, random)],
    exponent: integer(1, 9, random),
    fractional,
  };
  const fields = [...categories];
  for (let i = fields.length - 1; i > 0; i--) {
    const j = integer(0, i, random);
    [fields[i], fields[j]] = [fields[j], fields[i]];
  }
  const chosen = fields.slice(0, integer(1, 4, random));
  exercise.fields = categories.filter((category) => chosen.includes(category));
  if (previous && toLatex(previous) === toLatex(exercise)) exercise.literal = literals[(literals.indexOf(exercise.literal) + 1) % literals.length];
  return exercise;
}
export function toLatex(exercise) {
  const coefficient = exercise.fractional
    ? `\\frac{${exercise.numerator}}{${exercise.denominator}}`
    : exercise.numerator === 1 ? '' : String(exercise.numerator);
  return `${exercise.sign === '-' ? '-' : ''}${coefficient}${exercise.literal}${exercise.exponent === 1 ? '' : `^{${exercise.exponent}}`}`;
}
export function verbalize(exercise) {
  const number = exercise.fractional ? `${exercise.numerator} sobre ${exercise.denominator}` : String(exercise.numerator);
  return `${exercise.sign === '-' ? 'Menos' : 'Más'} ${number}, ${exercise.literal} elevado a ${exercise.exponent}.`;
}
function rational(value) {
  // No eval: solo enteros positivos, decimales finitos o una fracción positiva.
  const normalized = String(value).trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d{1,9}(?:\/\d{1,9}|\.\d{1,6})?$/.test(normalized)) return null;
  if (normalized.includes('/')) {
    const [n, d] = normalized.split('/').map(BigInt);
    return n > 0n && d > 0n ? [n, d] : null;
  }
  const [whole, decimal = ''] = normalized.split('.');
  const numerator = BigInt(whole + decimal);
  return numerator > 0n ? [numerator, 10n ** BigInt(decimal.length)] : null;
}
export function checkAnswer(exercise, category, answer) {
  const text = String(answer).trim();
  if (!text) return { correct: false, message: 'Escribe o selecciona una respuesta.' };
  let correct = false;
  const hints = {
    signo: 'Mira el inicio: si no hay un signo escrito, es positivo (+).',
    coeficiente: 'Busca el número que multiplica a la letra y sepáralo del signo. Puedes escribir una fracción como 3/2.',
    literal: 'Identifica la letra de la expresión; conserva mayúsculas o minúsculas.',
    exponente: 'Busca el número pequeño sobre la letra. Si no está escrito, vale 1.',
  };
  if (category === 'signo') correct = text.replace('−', '-') === exercise.sign;
  else if (category === 'coeficiente') {
    const value = rational(text);
    correct = !!value && value[0] * BigInt(exercise.denominator) === BigInt(exercise.numerator) * value[1];
  } else if (category === 'literal') correct = text === exercise.literal;
  else if (category === 'exponente') correct = /^\d+$/.test(text) && Number(text) === exercise.exponent;
  return { correct, message: correct ? '✓ Correcto.' : hints[category] || 'Revisa tu respuesta.' };
}
