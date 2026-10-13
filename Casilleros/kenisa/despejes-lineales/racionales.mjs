const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
};

export const fraction = (numerator, denominator = 1) => {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) throw new Error("Usa números enteros de tamaño razonable.");
  if (denominator === 0) throw new Error("El denominador no puede ser 0.");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { n: (numerator / divisor) * sign, d: Math.abs(denominator / divisor) };
};

export const parseFraction = (value) => {
  const match = String(value).trim().match(/^([+-]?\d+)(?:\s*\/\s*([+-]?\d+))?$/);
  if (!match) throw new Error("Escribe un entero o una fracción como 3/4.");
  return fraction(Number(match[1]), match[2] === undefined ? 1 : Number(match[2]));
};

export const add = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
export const subtract = (a, b) => fraction(a.n * b.d - b.n * a.d, a.d * b.d);
export const multiply = (a, b) => fraction(a.n * b.n, a.d * b.d);
export const divide = (a, b) => {
  if (b.n === 0) throw new Error("No es posible dividir entre 0.");
  return fraction(a.n * b.d, a.d * b.n);
};
export const equal = (a, b) => a.n === b.n && a.d === b.d;
export const formatFraction = (value) => value.d === 1 ? String(value.n) : `${value.n}/${value.d}`;
