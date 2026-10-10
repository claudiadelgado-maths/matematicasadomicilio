import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXAMENES } from './examenes.mjs';
import { crearIntento, elegirRespuesta, contarRespondidas, entregar, calificacion, alternarRespuestas } from './modelo.mjs';

const CLAVES = {
  A: 'abbdcbacdaaacacd',
  B: 'bcacdbcdcbbcbccd',
  C: 'cadbcbdacbdacdba',
  D: 'badcadcbacbdacbdacbdacbdacbdabcd'
};
const escapar = texto => texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

test('Banco del autor: 80 reactivos, cuatro opciones y claves fijas; HTML y metadatos sincronizados', () => {
  let total = 0;
  for (const [version, examen] of Object.entries(EXAMENES)) {
    const cantidad = version === 'D' ? 32 : 16;
    assert.equal(examen.preguntas.length, cantidad);
    assert.equal(examen.preguntas.map(p => p.correcta).join(''), CLAVES[version]);
    const url = new URL(`../examenes/examen-${version.toLowerCase()}/index.html`, import.meta.url);
    const html = readFileSync(url, 'utf8');
    const metadata = JSON.parse(readFileSync(new URL('examen.json', url), 'utf8'));
    assert.equal(metadata.preguntas, cantidad);
    assert.equal((html.match(/type="radio"/g) || []).length, cantidad * 4);
    assert.equal((html.match(/<fieldset /g) || []).length, cantidad);
    for (const [indice, pregunta] of examen.preguntas.entries()) {
      assert.equal(pregunta.numero, indice + 1);
      assert.deepEqual(pregunta.opciones.map(o => o.letra), ['a', 'b', 'c', 'd']);
      assert.equal(new Set(pregunta.opciones.map(o => o.texto)).size, 4);
      assert.ok(html.includes(escapar(pregunta.enunciado)));
      assert.ok(pregunta.opciones.every(o => html.includes(escapar(o.texto))));
      assert.ok(!/[\\$]/.test(pregunta.enunciado + pregunta.opciones.map(o => o.texto).join('')));
      total++;
    }
  }
  assert.equal(total, 80);
  assert.throws(() => crearIntento('E'), RangeError);
});

test('Las respuestas cambian antes de entregar; no hay calificación o soluciones anticipadas', () => {
  for (const version of Object.keys(EXAMENES)) {
    const intento = crearIntento(version);
    assert.equal(contarRespondidas(intento), 0);
    assert.equal(calificacion(intento), null);
    assert.equal(alternarRespuestas(intento), false);
    assert.equal(elegirRespuesta(intento, 0, 'a'), false);
    assert.equal(elegirRespuesta(intento, 1, 'z'), false);
    assert.equal(elegirRespuesta(intento, 1, 'a'), true);
    assert.equal(elegirRespuesta(intento, 1, 'd'), true);
    assert.equal(intento.respuestas[0], 'd');
    assert.equal(contarRespondidas(intento), 1);
    assert.equal(elegirRespuesta(intento, 1, 'd'), true);
    assert.equal(contarRespondidas(intento), 1);
    assert.equal(calificacion(intento), null);
  }
});

test('Todas las puntuaciones posibles, omisiones y bloqueo tras entregar en A–D', () => {
  for (const [version, examen] of Object.entries(EXAMENES)) {
    const total = examen.preguntas.length;
    for (let aciertos = 0; aciertos <= total; aciertos++) {
      const intento = crearIntento(version);
      let incorrectas = 0;
      for (const [indice, pregunta] of examen.preguntas.entries()) {
        if (indice < aciertos) elegirRespuesta(intento, pregunta.numero, pregunta.correcta);
        else if (indice % 2) {
          elegirRespuesta(intento, pregunta.numero, pregunta.opciones.find(o => o.letra !== pregunta.correcta).letra);
          incorrectas++;
        }
      }
      assert.ok(entregar(intento));
      assert.equal(elegirRespuesta(intento, 1, 'a'), false);
      assert.equal(entregar(intento), false);
      const nota = calificacion(intento);
      assert.equal(nota.total, total);
      assert.equal(nota.aciertos, aciertos);
      assert.equal(nota.incorrectas, incorrectas);
      assert.equal(nota.sinResponder, total - aciertos - incorrectas);
      assert.equal(nota.nota, Math.round(100 * aciertos / total));
      assert.equal(nota.detalle.length, total);
      assert.equal(alternarRespuestas(intento), true);
      assert.equal(alternarRespuestas(intento), false);
      assert.deepEqual(calificacion(intento), nota);
    }
  }
});

test('Intentos nuevos no conservan respuestas, nota ni soluciones; entregar en blanco da cero', () => {
  for (const version of Object.keys(EXAMENES)) {
    const primero = crearIntento(version);
    elegirRespuesta(primero, 1, 'a');
    entregar(primero);
    alternarRespuestas(primero);
    const nuevo = crearIntento(version);
    assert.ok(nuevo.respuestas.every(valor => valor === null));
    assert.equal(nuevo.entregado, false);
    assert.equal(nuevo.mostrarRespuestas, false);
    assert.equal(calificacion(nuevo), null);
    entregar(nuevo);
    assert.equal(calificacion(nuevo).nota, 0);
    assert.equal(calificacion(nuevo).sinResponder, EXAMENES[version].preguntas.length);
  }
});
