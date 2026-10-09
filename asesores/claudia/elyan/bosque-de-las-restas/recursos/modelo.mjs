export const ICONOS = ['🍎', '🍌', '🍃'];
export const NOMBRES = ['manzanas', 'plátanos', 'hojas'];
export const ORDENES = ['unidades', 'decenas', 'centenas'];
export const RANGOS = [
  { desde: 0, nombre: 'Pollito aprendiz', icono: 'pollito-aprendiz' },
  { desde: 1, nombre: 'Pollito valiente', icono: 'pollito-valiente' },
  { desde: 3, nombre: 'Pollito explorador', icono: 'pollito-explorador' },
  { desde: 6, nombre: 'Pollito maestro', icono: 'pollito-maestro' },
  { desde: 10, nombre: 'Gallo guerrero', icono: 'gallo-guerrero' },
  { desde: 15, nombre: 'Raptor chispeante', icono: 'raptor-chispeante' },
  { desde: 21, nombre: 'Raptor del trueno', icono: 'raptor-del-trueno' },
  { desde: 28, nombre: 'Dino guardián del bosque', icono: 'dino-guardian' },
  { desde: 36, nombre: 'T-Rex legendario', icono: 'trex-legendario' },
  { desde: 45, nombre: 'Super Dinosaurio Rex', icono: 'super-dinosaurio-rex' },
  { desde: 55, nombre: 'Super Dinosaurio Rex Mega pro', icono: 'rex-mega-pro' }
];
export const TOTAL = RANGOS.at(-1).desde;
export const digitos = n => [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100)];
export const valor = v => v[0] + v[1] * 10 + v[2] * 100;
export const rango = n => RANGOS.filter(r => r.desde <= n).at(-1);

export function intercambiar(actual, fuente) {
  if (![1, 2].includes(fuente) || !Array.isArray(actual) || actual.length !== 3
    || actual.some(n => !Number.isInteger(n) || n < 0) || actual[fuente] < 1) return null;
  const nuevo = [...actual];
  nuevo[fuente] -= 1;
  nuevo[fuente - 1] += 10;
  return nuevo;
}

export function pasosResta(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || a > 999 || b < 0 || b > a) throw new RangeError('La resta debe estar entre 0 y 999 y no dar negativos.');
  let actual = digitos(a);
  const pedido = digitos(b), pasos = [];
  for (let columna = 0; columna < 3; columna += 1) {
    if (actual[columna] < pedido[columna]) {
      let fuente = columna + 1;
      while (fuente < 3 && actual[fuente] === 0) fuente += 1;
      for (; fuente > columna; fuente -= 1) {
        const antes = [...actual];
        actual = intercambiar(actual, fuente);
        pasos.push({ tipo: 'cambio', fuente, antes, despues: [...actual] });
      }
    }
    pasos.push({ tipo: 'resta', columna, arriba: actual[columna], abajo: pedido[columna], resultado: actual[columna] - pedido[columna], despues: [...actual] });
  }
  return pasos;
}

export function tipoResta(a, b) {
  const cambios = pasosResta(a, b).filter(p => p.tipo === 'cambio');
  if (!cambios.length) return 'sin';
  if (cambios.length === 1) return cambios[0].fuente === 1 ? 'unidades' : 'decenas';
  return Math.floor(a / 10) % 10 === 0 ? 'ceros' : 'doble';
}

export function azarSemilla(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

export function generarResta(tipo = 'mixto', azar = Math.random, anterior = '') {
  const coincide = (a, b) => tipo === 'mixto' || tipo === tipoResta(a, b) || (tipo === 'doble' && tipoResta(a, b) === 'ceros');
  for (let i = 0; i < 4000; i += 1) {
    const a = 100 + Math.floor(azar() * 900), b = 100 + Math.floor(azar() * (a - 99));
    if (`${a}-${b}` !== anterior && coincide(a, b)) return { a, b };
  }
  const banco = { sin: [[875, 342], [642, 211]], unidades: [[352, 127], [564, 238]], decenas: [[420, 180], [731, 251]], doble: [[714, 386], [653, 278]], ceros: [[305, 178], [600, 249]], mixto: [[403, 186], [503, 268]] };
  const [a, b] = banco[tipo].find(([a, b]) => `${a}-${b}` !== anterior);
  return { a, b };
}

export function descriptor(nivel) {
  if (!Number.isInteger(nivel) || nivel < 0 || nivel >= TOTAL) throw new RangeError('Misión fuera del mapa.');
  if (nivel < 10) return { mundo: 1, nombre: 'El mercado del bosque', tipo: 'montones', limite: nivel < 5 ? 9 : 20 };
  if (nivel < 30) return { mundo: 2, nombre: 'El intercambio mágico', tipo: nivel < 15 ? 'unidades' : nivel < 20 ? 'decenas' : nivel < 25 ? 'ceros' : 'mixto' };
  return { mundo: 3, nombre: 'La cima del T-Rex', tipo: nivel < 33 ? 'sin' : nivel < 37 ? 'unidades' : nivel < 41 ? 'decenas' : nivel % 2 ? 'doble' : 'ceros' };
}

export function mision(nivel, semilla, variante = 0) {
  const info = descriptor(nivel);
  const azar = azarSemilla((semilla + Math.imul(nivel + 1, 7919) + Math.imul(variante, 104729)) >>> 0);
  if (info.tipo === 'montones') {
    const inicial = Array.from({ length: 3 }, () => Math.floor(azar() * (info.limite + 1)));
    if (!inicial.some(Boolean)) inicial[0] = 3;
    const pedido = inicial.map(n => Math.floor(azar() * (n + 1)));
    if (!pedido.some(Boolean)) pedido[inicial.findIndex(n => n > 0)] = 1;
    return { ...info, inicial, pedido };
  }
  // Los últimos cinco intercambios siempre requieren algún préstamo.
  const tipo = info.tipo === 'mixto' ? ['unidades', 'decenas', 'doble', 'ceros', 'ceros'][nivel % 5] : info.tipo;
  const { a, b } = generarResta(tipo, azar);
  return { ...info, a, b, inicial: digitos(a), pedido: digitos(b) };
}

export function comprobar(actual, pedido, respuesta, canonico = false) {
  const faltan = actual.findIndex((n, p) => n < pedido[p]);
  if (faltan !== -1) return { correcto: false, faltan, columnas: [false, false, false] };
  const columnas = actual.map((n, p) => Number.isInteger(respuesta[p]) && respuesta[p] === n - pedido[p] && (!canonico || respuesta[p] <= 9));
  return { correcto: columnas.every(Boolean), faltan: -1, columnas };
}
