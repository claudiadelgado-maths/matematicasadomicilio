// Coeficientes de menor a mayor grado: [constante, x, x², x³].
export const EPS = 1e-8;
export const trim = p => { const a = [...p]; while (a.length > 1 && Math.abs(a.at(-1)) < EPS) a.pop(); return a; };
export const degree = p => trim(p).length - 1;
export const evaluate = (p, x) => [...p].reverse().reduce((v, c) => v * x + c, 0);
export function multiply(a, b) {
  const p = Array(a.length + b.length - 1).fill(0);
  a.forEach((c, i) => b.forEach((d, j) => p[i + j] += c * d)); return trim(p);
}
export const scale = (p, n) => p.map(c => c * n);
export const fromRoots = (r, s, a = 1) => scale(multiply([-r, 1], [-s, 1]), a);
export function divideLinear(p, root) {
  const a = trim(p); const q = Array(a.length - 1).fill(0);
  for (let i = a.length - 1; i > 0; i--) { q[i - 1] = a[i]; a[i - 1] += root * a[i]; }
  return { quotient: trim(q), remainder: a[0] };
}
export function quadraticRoots(p) {
  if (degree(p) !== 2) throw new Error('El denominador debe ser cuadrático.');
  const [c, b, a] = p, discriminant = b * b - 4 * a * c;
  if (discriminant < -EPS) return [];
  if (Math.abs(discriminant) < EPS) return [{ x: -b / (2 * a), multiplicity: 2 }];
  const d = Math.sqrt(discriminant);
  return [(-b - d) / (2 * a), (-b + d) / (2 * a)].sort((x, y) => x - y).map(x => ({ x, multiplicity: 1 }));
}
export function analyze(numerator, denominator) {
  if (degree(denominator) !== 2) throw new Error('El denominador debe ser cuadrático.');
  const roots = quadraticRoots(denominator), verticals = [], holes = [];
  for (const root of roots) {
    let n = trim(numerator), d = trim(denominator), cancelled = 0;
    for (let i = 0; i < root.multiplicity; i++) {
      if (degree(n) < 1 || Math.abs(evaluate(n, root.x)) > EPS) break;
      n = divideLinear(n, root.x).quotient; d = divideLinear(d, root.x).quotient; cancelled++;
    }
    if (cancelled < root.multiplicity) verticals.push(root.x);
    else holes.push({ x: root.x, y: evaluate(n, root.x) / evaluate(d, root.x) });
  }
  const nDegree = degree(numerator), dDegree = degree(denominator);
  const horizontal = nDegree < dDegree ? 0 : nDegree === dDegree ? trim(numerator).at(-1) / trim(denominator).at(-1) : null;
  return { roots, verticals, holes, horizontal, nDegree, dDegree,
    discriminant: denominator[1] ** 2 - 4 * denominator[2] * denominator[0] };
}
export function rationalValue(q, x) {
  const d = evaluate(q.denominator, x); return Math.abs(d) < 1e-12 ? NaN : evaluate(q.numerator, x) / d;
}
export function parseNumber(text) {
  const s = String(text).trim().replaceAll('−', '-').replaceAll(',', '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s)) return null;
  const parts = s.split('/').map(Number);
  const result = parts.length === 2 ? (parts[1] === 0 ? NaN : parts[0] / parts[1]) : parts[0];
  return Number.isFinite(result) ? result : null;
}
export function fraction(value) {
  if (Math.abs(value) < EPS) return '0';
  if (Math.abs(value - Math.round(value)) < EPS) return String(Math.round(value));
  for (let d = 2; d <= 100; d++) if (Math.abs(value * d - Math.round(value * d)) < EPS) return `${Math.round(value * d)}/${d}`;
  return Number(value.toFixed(3)).toLocaleString('es-MX');
}
export function polynomialText(p) {
  return trim(p).map((c, i) => ({ c, i })).reverse().filter(t => Math.abs(t.c) > EPS).map(({ c, i }, j) =>
    `${c < 0 ? (j ? ' − ' : '−') : (j ? ' + ' : '')}${i && Math.abs(c) === 1 ? '' : fraction(Math.abs(c))}${i ? `x${i === 1 ? '' : i === 2 ? '²' : '³'}` : ''}`).join('') || '0';
}
export const factorText = r => r === 0 ? 'x' : `(x ${r > 0 ? '−' : '+'} ${fraction(Math.abs(r))})`;
export function factoredText(p) {
  const roots = quadraticRoots(p);
  if (!roots.length) return 'No tiene factores lineales reales.';
  const leading = p[2] === 1 ? '' : p[2] === -1 ? '−' : fraction(p[2]);
  return `${leading}${roots.map(r => `${factorText(r.x)}${r.multiplicity === 2 ? '²' : ''}`).join('')}`;
}

export const FAMILIES = {
  exp: { name: 'Exponencial · 2ˣ', kind: 'exp', base: 2, f: x => 2 ** x },
  decreasing: { name: 'Exponencial · (1/2)ˣ', kind: 'exp', base: .5, f: x => .5 ** x },
  log: { name: 'Logaritmo · log₂(x)', kind: 'log', base: 2, f: x => x > 0 ? Math.log2(x) : NaN },
  decimal: { name: 'Logaritmo · log₁₀(x)', kind: 'log', base: 10, f: x => x > 0 ? Math.log10(x) : NaN },
  natural: { name: 'Logaritmo natural · ln(x)', kind: 'log', base: Math.E, f: x => x > 0 ? Math.log(x) : NaN },
  square: { name: 'Para empezar · x²', kind: 'square', f: x => x * x },
};
export function translation(family, h, k) {
  const f = FAMILIES[family];
  const argument = h === 0 ? 'x' : `x ${h > 0 ? '−' : '+'} ${Math.abs(h)}`;
  const suffix = k === 0 ? '' : ` ${k > 0 ? '+' : '−'} ${Math.abs(k)}`;
  const body = f.kind === 'exp' ? `${f.base === .5 ? '(1/2)' : f.base}^(${argument})` : f.kind === 'log' ? `${family === 'natural' ? 'ln' : f.base === 2 ? 'log₂' : 'log₁₀'}(${argument})` : `(${argument})²`;
  return { family, h, k, text: `g(x) = ${body}${suffix}`,
    f: x => f.f(x - h) + k,
    domain: f.kind === 'log' ? `x > ${h}` : 'Todos los números reales',
    range: f.kind === 'square' ? `y ≥ ${k}` : f.kind === 'exp' ? `y > ${k}` : 'Todos los números reales',
    horizontal: f.kind === 'exp' ? k : null, vertical: f.kind === 'log' ? h : null,
    point: f.kind === 'log' ? [h + 1, k] : f.kind === 'exp' ? [h, k + 1] : [h, k],
  };
}
export const directionText = (h, k) => `${h ? `${Math.abs(h)} ${Math.abs(h) === 1 ? 'unidad' : 'unidades'} a la ${h > 0 ? 'derecha' : 'izquierda'}` : 'Sin traslado horizontal'}; ${k ? `${Math.abs(k)} ${Math.abs(k) === 1 ? 'unidad' : 'unidades'} hacia ${k > 0 ? 'arriba' : 'abajo'}` : 'sin traslado vertical'}.`;

const rational = (id, label, numerator, denominator) => ({ id, label, numerator, denominator, ...analyze(numerator, denominator) });
export const HORIZONTAL_EXAMPLES = [
  rational('menor', 'Grado menor: 1 < 2', [1, 2], [1, 0, 1]),
  rational('igual', 'Mismo grado: 2 = 2', [-2, 0, 3], [1, 0, 2]),
  rational('mayor', 'Grado mayor: 3 > 2', [1, 0, 0, 1], [1, 0, 1]),
];
export const VERTICAL_EXAMPLES = [
  rational('dos', 'Dos raíces → dos asíntotas', [1], [-4, 0, 1]),
  rational('doble', 'Una raíz doble', [1, 1], [4, -4, 1]),
  rational('sin-raices', 'Sin raíces reales', [1, 1], [1, 0, 1]),
  rational('hueco', 'Se cancela un factor', [-2, 1], [-4, 0, 1]),
  rational('parcial', 'Cancelación parcial de una raíz doble', [-2, 1], [4, -4, 1]),
  rational('dos-huecos', 'Se cancelan los dos factores', [-4, 0, 1], [-4, 0, 1]),
];
export const MIXED_EXAMPLES = [
  rational('lineal', 'Numerador lineal', [1, 1], [-4, 0, 1]),
  rational('cuadratico', 'Numerador cuadrático', [3, 0, 2], [-4, 0, 1]),
  rational('cubico', 'Numerador cúbico', [1, 0, 0, 1], [-4, 0, 1]),
  rational('cancelacion', 'Extra: cúbico con cancelación', [-2, 1, -2, 1], [-4, 0, 1]),
];

export function rationalSteps(q) {
  const a = analyze(q.numerator, q.denominator);
  const h = a.horizontal === null ? 'El numerador tiene mayor grado: no hay asíntota horizontal.' : a.nDegree < a.dDegree ? 'El numerador tiene menor grado: la asíntota horizontal es y = 0.' : `Los grados son iguales. Divide los coeficientes principales: ${q.numerator.at(-1)} ÷ ${q.denominator.at(-1)} = ${fraction(a.horizontal)}. La horizontal es y = ${fraction(a.horizontal)}.`;
  const roots = a.roots.length ? `Resuelve ${polynomialText(q.denominator)} = 0: ${a.roots.map(r => `x = ${fraction(r.x)}${r.multiplicity === 2 ? ' (raíz doble)' : ''}`).join('; ')}. Factorización: ${factoredText(q.denominator)}.` : `El discriminante es ${fraction(a.discriminant)} < 0: el denominador no tiene raíces reales. No hay asíntotas verticales.`;
  let n = trim(q.numerator), d = trim(q.denominator), cancelled = false;
  for (const root of a.roots) for (let i = 0; i < root.multiplicity; i++) {
    if (degree(n) < 1 || Math.abs(evaluate(n, root.x)) > EPS) break;
    n = divideLinear(n, root.x).quotient; d = divideLinear(d, root.x).quotient; cancelled = true;
  }
  const reduced = cancelled ? `Al cancelar factores comunes queda (${polynomialText(n)}) / (${polynomialText(d)}), conservando las exclusiones originales. ` : '';
  const v = reduced + (a.verticals.length ? `Quedan factores del denominador que se anulan en ${a.verticals.map(x => `x = ${fraction(x)}`).join(' y ')}. Esas son las asíntotas verticales.` : 'No queda ninguna raíz real en el denominador simplificado: no hay asíntotas verticales.');
  const holes = a.holes.length ? `Los factores que desaparecen por completo dejan ${a.holes.map(p => `un hueco en (${fraction(p.x)}, ${fraction(p.y)})`).join(' y ')}. Esos valores de x siguen excluidos del dominio original.` : (a.roots.length ? (cancelled ? 'La cancelación es parcial: todavía queda un factor de la raíz doble en el denominador, así que conserva su asíntota vertical. No hay huecos.' : 'No hay huecos: ningún factor del denominador se cancela. Sus raíces siguen excluidas del dominio.') : 'El dominio es todo ℝ.');
  return [h, roots, v, holes];
}

export function buildBank(type) {
  if (type === 'traslados') {
    return ['exp','decreasing','log','decimal','natural','square'].flatMap((family, f) => [-4,-2,0,1,3].flatMap(h => [-3,0,2,4].map(k => ({
      id: `${family}/${h}/${k}`, family, h, k, mode: (h + k + f + 20) % 2 ? 'formula' : 'direction', ...translation(family, h, k),
    }))));
  }
  const bank = [];
  for (let i = 0; i < 48; i++) {
    const r = [-4,-3,-2,-1,1,2,3,4][i % 8], s = r + 1 + (Math.floor(i / 8) % 3), a = 1 + (Math.floor(i / 24) % 2);
    const d = fromRoots(r, s, a), nDegree = i % 3 + 1, c = i % 2 ? -2 : 3;
    let numerator = nDegree === 1 ? [i + 1, c] : nDegree === 2 ? [i + 1, 1, c] : [i + 1, 0, -1, c];
    let denominator = d;
    if (type === 'verticales') {
      switch (i % 6) {
        case 0: numerator = [i + 1]; break;
        case 1: denominator = fromRoots(r,r,a); numerator = [i + 1]; break;
        case 2: denominator = [i + 1,0,a]; numerator = [1,1]; break;
        case 3: numerator = [-r,1]; break;
        case 4: denominator = fromRoots(r,r,a); numerator = [-r,1]; break;
        case 5: numerator = scale(d, 2); break;
      }
    }
    bank.push(rational(`${type}/${i}`, '', numerator, denominator));
  }
  // Examples guarantee each important edge case, including half-integer roots.
  const extras = type === 'horizontales' ? HORIZONTAL_EXAMPLES : type === 'verticales' ? VERTICAL_EXAMPLES : [...MIXED_EXAMPLES,...VERTICAL_EXAMPLES.filter(q => degree(q.numerator) >= 1)];
  bank.push(...extras.map(q => ({...q,id:`${type}/example-${q.id}`})));
  bank.push(rational(`${type}/fracciones`, '', [2, 1], [-1,-1,2]));
  const seen = new Set();
  return bank.filter(q => { const key = JSON.stringify([q.numerator,q.denominator]); if (seen.has(key)) return false; seen.add(key); return true; });
}
export function shuffled(array, random = Math.random) {
  const a = [...array]; for(let i = a.length - 1; i > 0; i--) { const j = Math.floor(random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a;
}
export function checkAnswer(type, q, answer) {
  if (type === 'traslados') return Number.isFinite(answer.h) && Number.isFinite(answer.k) && Math.abs(answer.h-q.h)<EPS && Math.abs(answer.k-q.k)<EPS;
  const h = type === 'verticales' || (q.horizontal === null ? answer.noHorizontal : !answer.noHorizontal && Number.isFinite(answer.horizontal) && Math.abs(answer.horizontal-q.horizontal)<EPS);
  const v = type === 'horizontales' || (Array.isArray(answer.verticals) && answer.verticals.length === q.verticals.length && [...answer.verticals].sort((a,b)=>a-b).every((x,i)=>Number.isFinite(x) && Math.abs(x-q.verticals[i])<EPS));
  return Boolean(h && v);
}
