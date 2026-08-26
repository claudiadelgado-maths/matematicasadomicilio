const abs = (value) => Math.abs(value);

const gcd = (left, right) => {
  let a = abs(left);
  let b = abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
};

export const rational = (numerator, denominator = 1) => {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) throw new Error("Usa números enteros dentro de cada casilla.");
  if (denominator === 0) throw new Error("El denominador no puede ser cero.");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { n: sign * numerator / divisor, d: abs(denominator) / divisor };
};

export const add = (left, right) => rational(left.n * right.d + right.n * left.d, left.d * right.d);
export const multiply = (left, right) => rational(left.n * right.n, left.d * right.d);
export const negate = (value) => rational(-value.n, value.d);
export const equal = (left, right) => left.n === right.n && left.d === right.d;
export const isZero = (value) => value.n === 0;

export const readRational = (field) => {
  const numeratorInput = field.querySelector("[data-num]");
  const denominatorInput = field.querySelector("[data-den]");
  const numerator = Number(numeratorInput.value);
  const denominator = Number(denominatorInput.value);
  if (numeratorInput.value.trim() === "" || denominatorInput.value.trim() === "") throw new Error("Completa numerador y denominador en todas las fracciones.");
  return rational(numerator, denominator);
};

export const writeRational = (field, value) => {
  field.querySelector("[data-num]").value = value.n;
  field.querySelector("[data-den]").value = value.d;
};

export const fractionLatex = (value, absolute = false) => {
  const numerator = absolute ? abs(value.n) : value.n;
  return value.d === 1 ? `${numerator}` : `\\frac{${numerator}}{${value.d}}`;
};

const variableTerm = (coefficient, variable) => {
  const magnitude = rational(abs(coefficient.n), coefficient.d);
  const coefficientLatex = magnitude.n === magnitude.d ? "" : fractionLatex(magnitude);
  return `${coefficientLatex}${variable}`;
};

const appendTerm = (parts, coefficient, variable = "") => {
  if (isZero(coefficient)) return;
  const term = variable ? variableTerm(coefficient, variable) : fractionLatex(coefficient, true);
  if (!parts.length) parts.push(`${coefficient.n < 0 ? "-" : ""}${term}`);
  else parts.push(`${coefficient.n < 0 ? "-" : "+"}${term}`);
};

export const binomialLatex = (a, b) => {
  const parts = [];
  appendTerm(parts, a, "x");
  appendTerm(parts, b);
  return `\\left(${parts.join("") || "0"}\\right)`;
};

export const polynomialLatex = ({ quadratic, linear, constant }) => {
  const parts = [];
  appendTerm(parts, quadratic, "x^2");
  appendTerm(parts, linear, "x");
  appendTerm(parts, constant);
  return parts.join("") || "0";
};

export const product = (a, b, c, d) => {
  const ac = multiply(a, c);
  const ad = multiply(a, d);
  const bc = multiply(b, c);
  const bd = multiply(b, d);
  return { ac, ad, bc, bd, quadratic: ac, linear: add(ad, bc), constant: bd };
};

export const equationLatex = (a, b, c, d) => `${binomialLatex(a, b)}${binomialLatex(c, d)}=${polynomialLatex(product(a, b, c, d))}`;

export const renderLatex = (element, latex, displayMode = true) => {
  if (globalThis.katex) {
    globalThis.katex.render(latex, element, { displayMode, throwOnError: false, strict: "ignore" });
  } else {
    element.textContent = latex;
  }
};

export const polynomialKey = (value) => [value.quadratic, value.linear, value.constant].map((item) => `${item.n}/${item.d}`).join("|");

export const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const selected = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[selected]] = [copy[selected], copy[index]];
  }
  return copy;
};

export const problemBank = [
  [rational(2), rational(3), rational(1), rational(4)],
  [rational(3), rational(-2), rational(2), rational(5)],
  [rational(1), rational(-4), rational(1), rational(-3)],
  [rational(4), rational(1), rational(2), rational(-3)],
  [rational(-2), rational(3), rational(3), rational(1)],
  [rational(1, 2), rational(3), rational(2), rational(-1)],
  [rational(3, 2), rational(1), rational(2, 3), rational(2)],
  [rational(2), rational(-1, 2), rational(1, 2), rational(3)],
  [rational(-1, 3), rational(2), rational(3), rational(-1)],
  [rational(5, 2), rational(-2), rational(2), rational(1, 2)],
  [rational(3), rational(1, 4), rational(2, 3), rational(-2)],
  [rational(-2, 3), rational(-1), rational(3, 2), rational(4)]
];
