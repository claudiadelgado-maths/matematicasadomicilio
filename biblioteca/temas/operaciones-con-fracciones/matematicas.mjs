const assertSafeInteger = (value, label) => {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`${label} debe ser un número entero seguro.`);
  }
};

export const enteroAleatorio = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export const maximoComunDivisor = (first, second) => {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

export const minimoComunMultiplo = (first, second) => {
  if (first === 0 || second === 0) return 0;
  return Math.abs((first / maximoComunDivisor(first, second)) * second);
};

export const normalizarFraccion = (numerator, denominator) => {
  assertSafeInteger(numerator, "El numerador");
  assertSafeInteger(denominator, "El denominador");
  if (denominator === 0) throw new RangeError("El denominador no puede ser cero.");
  if (numerator === 0) return { numerator: 0, denominator: 1 };
  return denominator < 0
    ? { numerator: -numerator, denominator: -denominator }
    : { numerator, denominator };
};

export const simplificarFraccion = (fraction) => {
  const normalized = normalizarFraccion(fraction.numerator, fraction.denominator);
  if (normalized.numerator === 0) {
    return { ...normalized, divisor: Math.abs(fraction.denominator) || 1 };
  }
  const divisor = maximoComunDivisor(normalized.numerator, normalized.denominator);
  return {
    numerator: normalized.numerator / divisor,
    denominator: normalized.denominator / divisor,
    divisor,
  };
};

export const operarFracciones = (first, second, operation) => {
  const a = normalizarFraccion(first.numerator, first.denominator);
  const b = normalizarFraccion(second.numerator, second.denominator);

  if (operation === "add") {
    return normalizarFraccion(
      a.numerator * b.denominator + b.numerator * a.denominator,
      a.denominator * b.denominator,
    );
  }
  if (operation === "subtract") {
    return normalizarFraccion(
      a.numerator * b.denominator - b.numerator * a.denominator,
      a.denominator * b.denominator,
    );
  }
  if (operation === "multiply") {
    return normalizarFraccion(
      a.numerator * b.numerator,
      a.denominator * b.denominator,
    );
  }
  if (operation === "divide") {
    if (b.numerator === 0) throw new RangeError("No se puede dividir entre una fracción igual a cero.");
    return normalizarFraccion(
      a.numerator * b.denominator,
      a.denominator * b.numerator,
    );
  }
  throw new RangeError(`Operación desconocida: ${operation}`);
};

export const operarFraccionesSinSimplificar = (first, second, operation) => {
  const a = normalizarFraccion(first.numerator, first.denominator);
  const b = normalizarFraccion(second.numerator, second.denominator);
  let numerator;
  let denominator;

  if (operation === "add" || operation === "subtract") {
    numerator =
      a.numerator * b.denominator +
      (operation === "add" ? 1 : -1) * b.numerator * a.denominator;
    denominator = a.denominator * b.denominator;
  } else if (operation === "multiply") {
    numerator = a.numerator * b.numerator;
    denominator = a.denominator * b.denominator;
  } else if (operation === "divide") {
    if (b.numerator === 0) throw new RangeError("No se puede dividir entre una fracción igual a cero.");
    numerator = a.numerator * b.denominator;
    denominator = a.denominator * b.numerator;
  } else {
    throw new RangeError(`Operación desconocida: ${operation}`);
  }

  if (denominator < 0) {
    numerator *= -1;
    denominator *= -1;
  }
  return { numerator, denominator };
};

export const sonEquivalentes = (first, second) => {
  if (first.denominator === 0 || second.denominator === 0) return false;
  return (
    first.numerator * second.denominator ===
    second.numerator * first.denominator
  );
};

export const estaSimplificada = (fraction) => {
  if (fraction.denominator <= 0) return false;
  if (fraction.numerator === 0) return fraction.denominator === 1;
  return maximoComunDivisor(fraction.numerator, fraction.denominator) === 1;
};

export const leerEntero = (input, { nonNegative = false, positive = false } = {}) => {
  const value = input.value.trim();
  if (!/^-?\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) return null;
  if (positive && parsed <= 0) return null;
  if (nonNegative && parsed < 0) return null;
  return parsed;
};

export const fraccionDesdeCampos = ({ sign = "positive", numerator, denominator }) => {
  const absoluteNumerator = Math.abs(numerator);
  const signedNumerator =
    absoluteNumerator === 0 || sign === "zero"
      ? 0
      : sign === "negative"
        ? -absoluteNumerator
        : absoluteNumerator;
  return normalizarFraccion(signedNumerator, denominator);
};

export const signoDeFraccion = (fraction) => {
  const normalized = normalizarFraccion(fraction.numerator, fraction.denominator);
  if (normalized.numerator === 0) return "zero";
  return normalized.numerator < 0 ? "negative" : "positive";
};

export const simboloOperacion = (operation) =>
  ({
    add: "+",
    subtract: "-",
    multiply: "\\cdot",
    divide: "\\div",
  })[operation];

export const fraccionLatex = (
  fraction,
  { forceFraction = false, absolute = false } = {},
) => {
  const normalized = normalizarFraccion(fraction.numerator, fraction.denominator);
  const numerator = absolute ? Math.abs(normalized.numerator) : normalized.numerator;
  if (!forceFraction && normalized.denominator === 1) return String(numerator);
  if (numerator < 0) {
    return `-\\frac{${Math.abs(numerator)}}{${normalized.denominator}}`;
  }
  return `\\frac{${numerator}}{${normalized.denominator}}`;
};

export const fraccionPresentadaLatex = ({ numerator, denominator, placement = "positive" }) => {
  if (placement === "external-negative") return `-\\frac{${numerator}}{${denominator}}`;
  if (placement === "negative-numerator") return `\\frac{-${numerator}}{${denominator}}`;
  if (placement === "negative-denominator") return `\\frac{${numerator}}{-${denominator}}`;
  if (placement === "double-negative") return `\\frac{-${numerator}}{-${denominator}}`;
  return `\\frac{${numerator}}{${denominator}}`;
};

export const factoresPrimos = (value) => {
  let remainder = Math.abs(value);
  if (remainder < 2) return [remainder];
  const factors = [];
  let divisor = 2;
  while (remainder > 1) {
    while (remainder % divisor === 0) {
      factors.push(divisor);
      remainder /= divisor;
    }
    divisor += 1;
  }
  return factors;
};

export const factoresLatex = (value) => {
  const sign = value < 0 ? "-" : "";
  const factors = factoresPrimos(value);
  return `${sign}${factors.join("\\cdot")}`;
};

export const descripcionDecimal = (fraction) => {
  const simplified = simplificarFraccion(fraction);
  let denominator = simplified.denominator;
  while (denominator % 2 === 0) denominator /= 2;
  while (denominator % 5 === 0) denominator /= 5;
  const exact = denominator === 1;
  const value = simplified.numerator / simplified.denominator;
  return {
    exact,
    value,
    text: exact
      ? String(Number(value.toFixed(10)))
      : `${Number(value.toFixed(6))}\\ldots`,
  };
};

export const renderizarMatematica = (element, latex, { display = false } = {}) => {
  if (!element) return;
  element.dataset.latex = latex;
  element.setAttribute("aria-label", latex);
  if (window.katex?.render) {
    window.katex.render(latex, element, {
      displayMode: display,
      throwOnError: false,
      strict: "ignore",
    });
  } else {
    element.textContent = latex;
  }
};

export const crearProcedimientoBasico = (first, second, operation) => {
  const symbol = simboloOperacion(operation);
  const raw = operarFracciones(first, second, operation);
  const simplified = simplificarFraccion(raw);
  return {
    raw,
    simplified,
    original: `${fraccionLatex(first, { forceFraction: true })}${symbol}${fraccionLatex(second, { forceFraction: true })}`,
    rawLatex: fraccionLatex(raw, { forceFraction: true }),
    finalLatex: fraccionLatex(simplified),
  };
};
