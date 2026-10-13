export const randomInteger = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export const randomNonZero = (minimum = -12, maximum = 12) => {
  let value = 0;
  while (value === 0) value = randomInteger(minimum, maximum);
  return value;
};

export const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const selected = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[selected]] = [copy[selected], copy[index]];
  }
  return copy;
};

export const termAt = (first, difference, position) =>
  first + (position - 1) * difference;

export const differenceFromTerms = (termI, positionI, termJ, positionJ) => {
  if (positionI === positionJ) throw new Error("Las posiciones deben ser diferentes.");
  return (termI - termJ) / (positionI - positionJ);
};

export const firstFromTerm = (term, position, difference) =>
  term - (position - 1) * difference;

export const positionFromTerm = (term, first, difference) => {
  if (difference === 0) throw new Error("La diferencia no puede ser cero para despejar una posición única.");
  return (term - first) / difference + 1;
};

export const directionFromDifference = (difference) => {
  if (difference > 0) return "creciente";
  if (difference < 0) return "decreciente";
  return "constante";
};

const greatestCommonDivisor = (left, right) => {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export const fractionParts = (numerator, denominator) => {
  if (denominator === 0) throw new Error("No se puede dividir entre cero.");
  const sign = denominator < 0 ? -1 : 1;
  const adjustedNumerator = numerator * sign;
  const adjustedDenominator = Math.abs(denominator);
  const divisor = greatestCommonDivisor(adjustedNumerator, adjustedDenominator);
  return {
    numerator: adjustedNumerator / divisor,
    denominator: adjustedDenominator / divisor,
  };
};

export const fractionLatex = (numerator, denominator) => {
  const fraction = fractionParts(numerator, denominator);
  return fraction.denominator === 1
    ? String(fraction.numerator)
    : `\\frac{${fraction.numerator}}{${fraction.denominator}}`;
};

export const signedLatex = (value) => value < 0
  ? `- ${Math.abs(value)}`
  : `+ ${value}`;

export const substitutedTermLatex = (first, difference, position, result = null) => {
  const outcome = result ?? termAt(first, difference, position);
  const operation = difference < 0
    ? `${first}-(${position}-1)${Math.abs(difference)}`
    : `${first}+(${position}-1)${difference}`;
  return `a_{${position}}=${operation}=${outcome}`;
};

export const uniqueOptions = (answer, candidates, amount = 4) => {
  const distractors = [...new Set(candidates.filter((candidate) => String(candidate) !== String(answer)))];
  let distance = 1;
  while (distractors.length < amount - 1) {
    for (const value of [Number(answer) + distance, Number(answer) - distance]) {
      if (Number.isFinite(value) && String(value) !== String(answer) && !distractors.includes(value)) distractors.push(value);
    }
    distance += 1;
  }
  return shuffle([answer, ...shuffle(distractors).slice(0, amount - 1)]);
};

export const renderMath = (element, latex, displayMode = true) => {
  if (!element) return;
  if (globalThis.katex) {
    globalThis.katex.render(latex, element, { displayMode, throwOnError: false, strict: "ignore" });
  } else {
    element.textContent = latex;
  }
};

export const renderAllMath = (root = document) => {
  root.querySelectorAll("[data-math]").forEach((element) => {
    renderMath(element, element.dataset.math || element.textContent.trim(), element.dataset.inline !== "true");
  });
};
