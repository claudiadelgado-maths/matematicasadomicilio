const randomInteger = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const selected = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[selected]] = [copy[selected], copy[index]];
  }
  return copy;
};

export const arithmeticTerm = (sequence, position) => {
  if (!Number.isInteger(position) || position < 1) throw new Error("La posición debe ser un número entero mayor o igual que 1.");
  return sequence.first + (position - 1) * sequence.difference;
};

export const arithmeticTerms = (sequence, amount = 5) =>
  Array.from({ length: amount }, (_, index) => arithmeticTerm(sequence, index + 1));

export const sequenceKey = (sequence) => `${sequence.first}|${sequence.difference}`;

export const generateArithmeticSequence = ({
  allowNegative = false,
  negativeChance = 0.3,
  firstMin = 2,
  firstMax = 60,
  differenceMin = 2,
  differenceMax = 14,
  previousKey = "",
} = {}) => {
  let sequence;
  let attempts = 0;

  do {
    const magnitude = randomInteger(differenceMin, differenceMax);
    const difference = allowNegative && Math.random() < negativeChance ? -magnitude : magnitude;
    const safeMinimum = difference < 0 ? Math.max(firstMin, magnitude * 5 + 4) : firstMin;
    const safeMaximum = Math.max(safeMinimum, firstMax);
    sequence = { first: randomInteger(safeMinimum, safeMaximum), difference };
    attempts += 1;
  } while (sequenceKey(sequence) === previousKey && attempts < 40);

  return sequence;
};

export const signedNumber = (value, { explicitPositive = false } = {}) => {
  if (value < 0) return `−${Math.abs(value)}`;
  return explicitPositive ? `+${value}` : String(value);
};

export const sequenceText = (sequence, amount = 5) =>
  arithmeticTerms(sequence, amount).map((value) => signedNumber(value)).join(", ");

export const sequenceLatex = (sequence, amount = 5) =>
  arithmeticTerms(sequence, amount).join(",\\; ") + ",\\ldots";

export const formulaLatex = (sequence, left = "a_n") => {
  const operator = sequence.difference < 0 ? "-" : "+";
  return `${left}=${sequence.first}${operator}(n-1)${Math.abs(sequence.difference)}`;
};

export const substitutedFormulaLatex = (sequence, position) => {
  const operator = sequence.difference < 0 ? "-" : "+";
  return `a_{${position}}=${sequence.first}${operator}(${position}-1)${Math.abs(sequence.difference)}=${arithmeticTerm(sequence, position)}`;
};

export const simplifiedFormulaLatex = (sequence) => {
  if (sequence.difference === 0) return "a_n=" + sequence.first;
  const coefficient = sequence.difference === 1 ? "" : sequence.difference === -1 ? "-" : String(sequence.difference);
  const constant = sequence.first - sequence.difference;
  const constantPart = constant === 0 ? "" : constant < 0 ? String(constant) : `+${constant}`;
  return `a_n=${coefficient}n${constantPart}`;
};

export const parseSequenceInput = (rawValue) => {
  const normalized = rawValue.trim();
  if (!normalized) throw new Error("Escribe al menos tres términos separados por comas.");
  const tokens = normalized.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length < 3) throw new Error("Se necesitan al menos tres términos para comparar varias diferencias.");
  const values = tokens.map((token) => Number(token));
  if (values.some((value) => !Number.isFinite(value))) throw new Error("Usa únicamente números separados por comas, espacios o punto y coma.");
  return values;
};

export const analyzeSequence = (values) => {
  const differences = values.slice(1).map((value, index) => value - values[index]);
  const reference = differences[0];
  const arithmetic = differences.every((difference) => Math.abs(difference - reference) < 1e-9);
  return {
    arithmetic,
    differences,
    sequence: arithmetic ? { first: values[0], difference: reference } : null,
  };
};

export const uniqueOptions = (correct, distractors, amount = 4) => {
  const uniqueDistractors = [...new Set(distractors.filter((value) => value !== correct))];
  return shuffle([
    { value: correct, correct: true },
    ...shuffle(uniqueDistractors).slice(0, amount - 1).map((value) => ({ value, correct: false })),
  ]);
};

export const renderLatex = (element, latex, displayMode = true) => {
  if (!element) return;
  if (globalThis.katex) {
    globalThis.katex.render(latex, element, { displayMode, throwOnError: false, strict: "ignore" });
  } else {
    element.textContent = latex;
  }
};
