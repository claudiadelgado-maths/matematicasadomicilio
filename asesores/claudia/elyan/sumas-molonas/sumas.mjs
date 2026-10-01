import { columnas, generar, validarPaso } from './matematicas.mjs';
import { $, nombres, singular, tablero, marcarColumna, celebrar } from './visuales.mjs';

export function iniciarSumas() {
  let exercise, steps, current = 0, completed = 0, station = 2;
  const exercises = new Map();
  function decomposition(p) {
    return p.salida ? `${p.total} ${nombres[p.posicion]} = 1 ${singular[p.posicion + 1]} + ${p.resultado} ${nombres[p.posicion]}.`
      : `${p.total} ${nombres[p.posicion]}. No hay llevada.`;
  }
  function createInput(className, position, label) {
    const input = document.createElement('input');
    input.className = className;
    input.id = `${className}-${position}`;
    input.type = 'text';
    input.inputMode = 'numeric';
    input.pattern = '[0-9]';
    input.maxLength = 1;
    input.autocomplete = 'off';
    input.setAttribute('aria-label', label);
    input.setAttribute('aria-describedby', 'column-status');
    input.disabled = true;
    if (className === 'carry') input.tabIndex = -1;
    input.addEventListener('focus', () => input.select());
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '').slice(-1);
      if (current >= steps.length) return;
      const expected = className === 'answer' ? steps[current].resultado : steps[current].salida;
      const correct = input.value !== '' && Number(input.value) === expected;
      input.classList.toggle('done', correct);
      input.classList.toggle('try-again', Boolean(input.value) && !correct);
      input.setAttribute('aria-invalid', String(Boolean(input.value) && !correct));
      if (!correct) {
        $('column-status').textContent = input.value ? 'Casi. Fíjate otra vez 👀' : 'Escribe una cifra.';
        input.select();
        return;
      }
      const p = steps[current];
      const answer = $('answer-' + current);
      const carry = p.salida ? $('carry-' + (current + 1)) : null;
      if (validarPaso(p, answer.value, carry?.value)) advance();
      else {
        $('column-status').textContent = className === 'answer' ? '¡Muy bien! Ahora, la llevada de arriba.' : '¡Eso es! Falta la cifra de abajo.';
        (className === 'answer' ? carry : answer)?.focus();
      }
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Tab' && current < steps.length && steps[current].salida) {
        const next = className === 'answer' && !event.shiftKey ? $('carry-' + (current + 1))
          : className === 'carry' && event.shiftKey ? $('answer-' + current) : null;
        if (next) { event.preventDefault(); next.focus(); }
      }
    });
    return input;
  }
  function showColumn(focus = false) {
    const p = steps[current];
    marcarColumna($('board'), current);
    $('column-label').textContent = `${current + 1} / ${steps.length} · ${nombres[current]}`;
    $('column-prompt').textContent = current >= station ? 'Queda la llevada: 1' : `${p.izquierda} + ${p.derecha}${p.entrada ? ' + 1' : ''} = ?`;
    $('column-instruction').textContent = p.salida ? `Escribe abajo y pon la llevada en ${nombres[current + 1]}.`
      : `Escribe en ${nombres[current]}.${p.entrada ? ' Cuenta también la llevada.' : ''}`;
    $('answer-' + current).disabled = false;
    if (p.salida) $('carry-' + (current + 1)).disabled = false;
    if (focus) $('answer-' + current).focus();
  }
  function newSum(reuse = false) {
    const key = `${station}-${$('difficulty').value}`;
    const previous = exercises.get(key);
    exercise = reuse && previous ? previous : generar(station, $('difficulty').value, previous ? `${previous.a}+${previous.b}` : '');
    exercises.set(key, exercise);
    steps = columnas(exercise.a, exercise.b, station);
    current = 0;
    tablero($('board'), exercise, steps, createInput);
    $('column-status').textContent = 'Empieza por la derecha. Se comprueba al escribir.';
    $('exchange').hidden = true;
    showColumn();
  }
  function advance() {
    const p = steps[current];
    $('answer-' + current).disabled = true;
    if (p.salida) $('carry-' + (current + 1)).disabled = true;
    $('exchange').textContent = decomposition(p);
    $('exchange').hidden = false;
    current += 1;
    if (current < steps.length) {
      $('column-status').textContent = `¡Eso es! Seguimos con las ${nombres[current]}.`;
      showColumn(true);
    } else {
      completed += 1;
      $('reward').textContent = `⭐ ${completed}`;
      $('reward').setAttribute('aria-label', `${completed} sumas completadas`);
      $('column-label').textContent = '¡LO HAS CONSEGUIDO!';
      $('column-prompt').textContent = `${exercise.a} + ${exercise.b} = ${exercise.a + exercise.b}`;
      $('column-instruction').textContent = 'Cada cifra en su sitio. ¡Muy bien!';
      $('column-status').textContent = '¡Genial! Prueba otra suma. 🎉';
      celebrar($('vertical-lab'), 'sumas');
      $('new-sum').focus({ preventScroll: true });
    }
  }
  $('new-sum').addEventListener('click', () => { newSum(); $('answer-0').focus(); });
  $('reset-sum').addEventListener('click', () => { newSum(true); $('answer-0').focus(); });
  $('difficulty').addEventListener('change', () => newSum());
  $('sum-size').addEventListener('change', () => {
    station = Number($('sum-size').value);
    $('vertical-title').textContent = `Sumas de ${station === 2 ? 'dos' : 'tres'} cifras`;
    const thousand = $('difficulty').querySelector('[value="thousand"]');
    thousand.disabled = thousand.hidden = station !== 3;
    if (station === 2 && $('difficulty').value === 'thousand') $('difficulty').value = 'many';
    newSum(true);
  });
  $('difficulty').querySelector('[value="thousand"]').disabled = true;
  $('difficulty').querySelector('[value="thousand"]').hidden = true;
  newSum();
}
