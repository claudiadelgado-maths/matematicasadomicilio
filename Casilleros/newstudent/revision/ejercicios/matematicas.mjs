// Aritmética racional exacta y polinomios: no eval ni muestreo de expresiones.
const abs = n => n < 0n ? -n : n;
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };
function q(n, d = 1n) {
  if (!d) throw new Error('División entre cero.');
  if (abs(n).toString(2).length > 2048 || abs(d).toString(2).length > 2048) throw new Error('Expresión demasiado grande.');
  const g = gcd(n, d); const sign = d < 0n ? -1n : 1n;
  return [sign * n / g, sign * d / g];
}
const add = (a, b) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const neg = a => [-a[0], a[1]];
const mul = (a, b) => q(a[0] * b[0], a[1] * b[1]);
const div = (a, b) => q(a[0] * b[1], a[1] * b[0]);
const ZERO = [0n, 1n]; const ONE = [1n, 1n];
const constant = a => new Map(a[0] ? [['0,0', a]] : []);
const unit = () => constant(ONE);
const variable = name => new Map([[name === 'x' ? '1,0' : '0,1', ONE]]);
function pAdd(a, b, sign = 1) {
  const out = new Map(a);
  for (const [key, value] of b) {
    const next = add(out.get(key) || ZERO, sign === 1 ? value : neg(value));
    if (next[0]) out.set(key, next); else out.delete(key);
  }
  return out;
}
function pMul(a, b) {
  const out = new Map();
  for (const [ka, va] of a) for (const [kb, vb] of b) {
    const [ax, ay] = ka.split(',').map(Number), [bx, by] = kb.split(',').map(Number);
    if (ax + ay + bx + by > 24) throw new Error('Grado demasiado alto.');
    const key = `${ax + bx},${ay + by}`;
    const value = add(out.get(key) || ZERO, mul(va, vb));
    if (value[0]) out.set(key, value); else out.delete(key);
  }
  return out;
}
const rational = (n, d = unit()) => ({ n, d });
const rAdd = (a, b, sign = 1) => rational(pAdd(pMul(a.n, b.d), pMul(b.n, a.d), sign), pMul(a.d, b.d));
const rMul = (a, b) => rational(pMul(a.n, b.n), pMul(a.d, b.d));
const isConstant = p => [...p.keys()].every(key => key === '0,0');
const equal = (a, b) => pAdd(pMul(a.n, b.d), pMul(b.n, a.d), -1).size === 0;

function normalize(text) {
  const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  return String(text).trim().toLowerCase()
    .replace(/[−–]/g, '-').replace(/[×·⋅]/g, '*').replace(/÷/g, '/')
    .replace(/π/g, 'pi').replace(/,/g, '.')
    .replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, s => `^(${[...s].map(c => c === '⁻' ? '-' : superscripts.indexOf(c)).join('')})`)
    .replace(/[\[{]/g, '(').replace(/[\]}]/g, ')');
}

function parse(text, variables = []) {
  const source = normalize(text);
  if (!source || source.length > 180) throw new Error('Expresión no válida.');
  const tokens = source.match(/(?:\d+(?:\.\d*)?|\.\d+)|pi|[xy()+*/^\-]/g) || [];
  if (tokens.join('') !== source.replace(/\s/g, '')) throw new Error('Símbolos no admitidos.');
  let pos = 0;
  const restrictions = [];
  let unexpanded = false;
  const hasVariable = value => !isConstant(value.n) || !isConstant(value.d);
  const multiply = (a, b) => {
    if (hasVariable(a) && hasVariable(b)) unexpanded = true;
    return rMul(a, b);
  };
  const take = token => tokens[pos] === token && (++pos, true);
  const divide = (a, b) => {
    if (!b.n.size) throw new Error('División entre cero.');
    restrictions.push(b.n);
    return rational(pMul(a.n, b.d), pMul(a.d, b.n));
  };
  function atom() {
    if (take('(')) { const result = sum(); if (!take(')')) throw new Error('Paréntesis incompletos.'); return result; }
    const token = tokens[pos++];
    if (variables.includes(token)) return rational(variable(token));
    if (token === 'pi' && variables.length === 0) return rational(constant(q(3141592653589793n, 1000000000000000n)));
    if (!token || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token)) throw new Error('Expresión no válida.');
    const [whole, decimals = ''] = token.split('.');
    return rational(constant(q(BigInt((whole || '0') + decimals), 10n ** BigInt(decimals.length))));
  }
  function power() {
    let value = atom();
    if (take('^')) {
      const exponent = unary();
      if (!isConstant(exponent.n) || !isConstant(exponent.d)) throw new Error('Exponente no válido.');
      const e = div(exponent.n.get('0,0') || ZERO, exponent.d.get('0,0') || ZERO);
      if (e[1] !== 1n || abs(e[0]) > 8n) throw new Error('Exponente fuera de rango.');
      if (e[0] !== 1n && (value.n.size > 1 || value.d.size > 1)) unexpanded = true;
      const base = e[0] < 0n ? divide(rational(unit()), value) : value;
      value = rational(unit());
      for (let i = 0n; i < abs(e[0]); i++) value = rMul(value, base);
    }
    return value;
  }
  function unary() {
    if (take('+')) return unary();
    if (take('-')) { const value = unary(); return rational(pMul(constant([-1n, 1n]), value.n), value.d); }
    return power();
  }
  function product() {
    let value = unary();
    while (pos < tokens.length) {
      if (take('*')) value = multiply(value, unary());
      else if (take('/')) value = divide(value, unary());
      else if (/^(?:\d|\.|x|y|pi|\()/.test(tokens[pos])) value = multiply(value, unary());
      else break;
    }
    return value;
  }
  function sum() {
    let value = product();
    while (pos < tokens.length) {
      if (take('+')) value = rAdd(value, product());
      else if (take('-')) value = rAdd(value, product(), -1);
      else break;
    }
    return value;
  }
  const value = sum();
  if (pos !== tokens.length) throw new Error('Expresión no válida.');
  return { ...value, restrictions, unexpanded };
}

// Sturm cuenta raíces reales de denominadores con coeficientes racionales exactos.
// Se conservan incluso los factores cancelados, para no perder agujeros del dominio.
const trim = a => { while (a.length && !a.at(-1)[0]) a.pop(); return a; };
function univariate(p) {
  const out = [];
  for (const [key, value] of p) {
    const [x, y] = key.split(',').map(Number);
    if (y) throw new Error('Denominador no admitido.');
    while (out.length <= x) out.push(ZERO);
    out[x] = value;
  }
  return trim(out);
}
function remainder(a, b) {
  const out = [...a];
  while (out.length >= b.length && out.length) {
    const offset = out.length - b.length, factor = div(out.at(-1), b.at(-1));
    for (let i = 0; i < b.length; i++) out[i + offset] = add(out[i + offset], neg(mul(factor, b[i])));
    trim(out);
  }
  return out;
}
function removeRoot(a, root) {
  if (a.length < 2) return null;
  const out = Array(a.length - 1).fill(ZERO);
  out[out.length - 1] = a.at(-1);
  for (let i = out.length - 2; i >= 0; i--) out[i] = add(a[i + 1], mul(root, out[i + 1]));
  return add(a[0], mul(root, out[0]))[0] === 0n ? trim(out) : null;
}
function hasRealRoot(a) {
  if (!a.length) return true;
  if (a.length === 1) return false;
  const sequence = [a, trim(a.slice(1).map((v, i) => mul(v, [BigInt(i + 1), 1n])))];
  while (sequence.at(-1).length) {
    const next = remainder(sequence.at(-2), sequence.at(-1)).map(neg);
    if (!next.length) break;
    sequence.push(next);
  }
  const variations = negative => {
    const signs = sequence.map(p => (p.at(-1)[0] < 0n ? -1 : 1) * (negative && (p.length - 1) % 2 ? -1 : 1));
    return signs.slice(1).filter((sign, i) => sign !== signs[i]).length;
  };
  return variations(true) !== variations(false);
}
function domainAllowed(value, excluded = []) {
  return value.restrictions.every(p => {
    let a = univariate(p);
    for (const root of excluded) {
      let reduced;
      while ((reduced = removeRoot(a, [BigInt(root), 1n])) !== null) a = reduced;
    }
    return !hasRealRoot(a);
  });
}

export function equivalent(answer, expected, excluded = []) {
  const actual = parse(answer, ['x']);
  return equal(actual, parse(expected, ['x'])) && domainAllowed(actual, excluded);
}
export function numeric(answer, expected, tolerance = 0) {
  const actual = parse(answer);
  if (!tolerance) return equal(actual, parse(String(expected)));
  const value = div(actual.n.get('0,0') || ZERO, actual.d.get('0,0') || ZERO);
  return Math.abs(Number(value[0]) / Number(value[1]) - Number(expected)) <= tolerance + 1e-10;
}
export function reducedFraction(answer) {
  const match = normalize(answer).match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if (!match) return false;
  const n = BigInt(match[1]), d = BigInt(match[2]);
  return d !== 0n && gcd(n, d) === 1n && numeric(answer, '3/4');
}
function finalNumber(answer, expected, tolerance = 0) {
  // Se pide un resultado, no volver a introducir la operación del enunciado.
  const correct = numeric(answer, expected, tolerance);
  const s = normalize(answer).replace(/\s/g, '');
  const number = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
  const atom = `(?:${number}|\\(${number}\\))`;
  const fraction = `${atom}(?:/${atom})?`;
  const piResult = `(?:${fraction}\\*?pi|pi(?:\\*${atom}|/${atom})?)`;
  if (!new RegExp(`^(?:${fraction}|${piResult})$`).test(s)) return false;
  return correct;
}
function expanded(answer, expected) {
  const actual = parse(answer, ['x']);
  return !actual.unexpanded && isConstant(actual.d) && equal(actual, parse(expected, ['x'])) && domainAllowed(actual);
}
export function lineEquation(answer) {
  const sides = String(answer).split('=');
  if (sides.length !== 2) throw new Error('Escribe una ecuación.');
  const left = parse(sides[0], ['x', 'y']), right = parse(sides[1], ['x', 'y']);
  // Se admiten todas las formas lineales y cocientes por constantes no nulas.
  if ([...left.restrictions, ...right.restrictions].some(p => !isConstant(p))) return false;
  const difference = rAdd(left, right, -1).n;
  if ([...difference.keys()].some(key => !['0,0', '1,0', '0,1'].includes(key))) return false;
  const a = difference.get('1,0') || ZERO, b = difference.get('0,1') || ZERO, c = difference.get('0,0') || ZERO;
  return b[0] !== 0n && add(a, mul([2n, 1n], b))[0] === 0n && add(c, b)[0] === 0n;
}

export function grade(id, answers) {
  if (answers.some(answer => !String(answer).trim())) return { status: 'blank', correct: false };
  try {
    let checks;
    const numberAnswers = { suma: '19/12', resta: '7/12', producto: '-3/5', cociente: '9/8', jerarquia: '276', lineal: '5' };
    if (Object.hasOwn(numberAnswers, id)) checks = [finalNumber(answers[0], numberAnswers[id])];
    else if (id === 'simplificacion') checks = [reducedFraction(answers[0])];
    else if (id === 'cuadratica') {
      const ok = (finalNumber(answers[0], 2) && finalNumber(answers[1], 5)) || (finalNumber(answers[0], 5) && finalNumber(answers[1], 2));
      checks = [ok, ok];
    } else if (id === 'binomios') checks = [expanded(answers[0], '2x^2+5x-3')];
    else if (id === 'monomio') checks = [expanded(answers[0], '6x^3-8x^2+10x')];
    else if (id === 'fracciones-algebraicas') checks = [equivalent(answers[0], '(10x+4)/(3x(x+1))', [0, -1]) && singleFraction(answers[0])];
    else if (id === 'recta') checks = [lineEquation(answers[0])];
    else {
      const geometry = { trapecio: [32, 26], triangulo: [24, 24], pentagono: [45 / Math.tan(Math.PI / 5), 30], cuadrado: [49, 28], rectangulo: [45, 28], circulo: [25 * Math.PI, 10 * Math.PI] };
      if (!Object.hasOwn(geometry, id)) throw new Error('Ejercicio desconocido.');
      checks = geometry[id].map((expected, i) => finalNumber(answers[i], expected, 0.05));
    }
    return { status: 'graded', correct: checks.every(Boolean), checks };
  } catch {
    return { status: 'invalid', correct: false };
  }
}

function singleFraction(text) {
  // La equivalencia se comprueba aparte. Aquí solo se exige la forma solicitada.
  let s = normalize(text).replace(/\s/g, '');
  const wraps = str => {
    if (str[0] !== '(' || str.at(-1) !== ')') return false;
    let depth = 0;
    for (let i = 0; i < str.length - 1; i++) { if (str[i] === '(') depth++; if (str[i] === ')') depth--; if (!depth) return false; }
    return true;
  };
  while (wraps(s)) s = s.slice(1, -1);
  let depth = 0, divisions = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (!depth && c === '/') divisions++;
    else if (!depth && (c === '+' || c === '-') && i > 0 && !'*/^'.includes(s[i - 1])) return false;
  }
  return divisions === 1;
}
