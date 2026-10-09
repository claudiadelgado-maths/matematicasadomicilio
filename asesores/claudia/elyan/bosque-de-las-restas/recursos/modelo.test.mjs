import test from 'node:test';
import assert from 'node:assert/strict';
import { pasosResta, intercambiar, valor, mision, tipoResta, generarResta, rango, comprobar, TOTAL, RANGOS } from './modelo.mjs';

test('todas las restas válidas del 0 al 999 y cada intercambio conservan las invariantes', () => {
  for (let a = 0; a <= 999; a++) for (let b = 0; b <= a; b++) {
    const respuesta = [0, 0, 0];
    for (const paso of pasosResta(a, b)) {
      if (paso.tipo === 'cambio') {
        assert.equal(valor(paso.antes), a);
        assert.equal(valor(paso.despues), a);
        assert.ok(paso.despues.every(n => n >= 0));
      } else {
        assert.ok(paso.resultado >= 0 && paso.resultado <= 9);
        respuesta[paso.columna] = paso.resultado;
      }
    }
    assert.equal(valor(respuesta), a - b);
  }
});
test('55 misiones respetan límites y progresión para distintas semillas y variantes', () => {
  for (let semilla = 0; semilla < 60; semilla++) for (let nivel = 0; nivel < TOTAL; nivel++) for (let variante = 0; variante < 3; variante++) {
    const reto = mision(nivel, semilla, variante);
    if (nivel < 10) {
      assert.ok(reto.inicial.every((n, p) => n <= (nivel < 5 ? 9 : 20) && n >= reto.pedido[p]));
    } else {
      assert.ok(reto.a >= 100 && reto.a <= 999 && reto.b >= 100 && reto.b <= reto.a);
      const tipo = tipoResta(reto.a, reto.b);
      if (reto.tipo === 'mixto') assert.notEqual(tipo, 'sin');
      else if (reto.tipo === 'doble') assert.ok(['doble', 'ceros'].includes(tipo));
      else assert.equal(tipo, reto.tipo);
    }
  }
});
test('ceros encadenados, entradas inválidas y comprobación de respuestas', () => {
  const cambios = pasosResta(305, 178).filter(p => p.tipo === 'cambio');
  assert.deepEqual(cambios.map(p => p.despues), [[5, 10, 2], [15, 9, 2]]);
  assert.equal(intercambiar([3, 0, 1], 1), null);
  assert.equal(intercambiar([0, 0, 0], 2), null);
  for (const [a, b] of [[0, 1], [-1, 0], [1000, 0], [12.5, 1], [100, -1]]) assert.throws(() => pasosResta(a, b), RangeError);
  assert.equal(comprobar([0, 0, 0], [0, 0, 0], [null, null, null]).correcto, false);
  assert.equal(comprobar([0, 0, 0], [0, 0, 0], [0, 0, 0]).correcto, true);
  assert.equal(comprobar([15, 9, 2], [8, 7, 1], [7, 2, 1], true).correcto, true);
  assert.equal(comprobar([15, 9, 2], [0, 7, 1], [15, 2, 1], true).correcto, false);
});
test('banco alternativo evita repetición y el rango final requiere 55 misiones', () => {
  for (const tipo of ['sin', 'unidades', 'decenas', 'doble', 'ceros', 'mixto']) {
    const primera = generarResta(tipo, () => 0);
    const segunda = generarResta(tipo, () => 0, `${primera.a}-${primera.b}`);
    assert.notDeepEqual(primera, segunda);
  }
  assert.equal(rango(0).nombre, 'Pollito aprendiz');
  assert.notEqual(rango(45).nombre, 'Super Dinosaurio Rex Mega pro');
  assert.notEqual(rango(54).nombre, 'Super Dinosaurio Rex Mega pro');
  assert.equal(rango(55).nombre, 'Super Dinosaurio Rex Mega pro');
});
test('once rangos con diez ascensos que requieren 1, 2, 3… 10 misiones adicionales', () => {
  assert.equal(TOTAL, 55);
  assert.equal(RANGOS.length, 11);
  assert.deepEqual(RANGOS.map(r => r.desde), [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55]);
  for (let i = 1; i < RANGOS.length; i++) {
    assert.equal(RANGOS[i].desde - RANGOS[i - 1].desde, i);
    assert.equal(rango(RANGOS[i].desde - 1), RANGOS[i - 1]);
    assert.equal(rango(RANGOS[i].desde), RANGOS[i]);
  }
  assert.deepEqual([1, 2, 3].map(mundo => Array.from({length: TOTAL}, (_, n) => mision(n, 0)).filter(m => m.mundo === mundo).length), [10, 20, 25]);
});
