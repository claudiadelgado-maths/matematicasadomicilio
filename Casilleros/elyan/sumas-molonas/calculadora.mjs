import { columnas } from './matematicas.mjs';
import { $, nombres, tablero, marcarColumna, celebrar } from './visuales.mjs';

export function iniciarCalculadora() {
  let exercise, steps, current = 0;
  const output = (className, position, label) => {
    const cell = document.createElement('span');
    cell.className = className;
    cell.id = `calc-${className}-${position}`;
    cell.setAttribute('aria-label', label);
    return cell;
  };
  function clear() {
    exercise = null;
    current = 0;
    $('calc-board').replaceChildren();
    $('calc-steps').replaceChildren();
    $('calc-expression').textContent = 'Prepara tu nueva suma';
    $('calc-column').textContent = 'ELIGE TUS NÚMEROS';
    $('calc-next').disabled = $('calc-all').disabled = true;
  }
  function prepare() {
    const a = $('calc-a').value, b = $('calc-b').value;
    if (!/^[1-9][0-9]{1,2}$/.test(a) || !/^[1-9][0-9]{1,2}$/.test(b)) {
      clear();
      $('calc-error').textContent = 'Escribe dos números enteros del 10 al 999.';
      return false;
    }
    exercise = { a: Number(a), b: Number(b) };
    steps = columnas(exercise.a, exercise.b, Math.max(a.length, b.length));
    current = 0;
    tablero($('calc-board'), exercise, steps, output);
    $('calc-steps').replaceChildren();
    $('calc-expression').textContent = `${a} + ${b} = ?`;
    $('calc-column').textContent = 'EMPEZAMOS POR LAS UNIDADES';
    $('calc-error').textContent = 'Tú eliges: un paso o la suma completa.';
    $('calc-next').disabled = $('calc-all').disabled = false;
    return true;
  }
  function step() {
    if (!exercise || current >= steps.length) return;
    const p = steps[current];
    marcarColumna($('calc-board'), current);
    $('calc-answer-' + current).textContent = p.resultado;
    $('calc-answer-' + current).classList.add('done');
    if (p.salida) $('calc-carry-' + (current + 1)).textContent = p.salida;
    const item = document.createElement('li');
    item.textContent = `${p.izquierda} + ${p.derecha}${p.entrada ? ' + 1' : ''} = ${p.total} → escribimos ${p.resultado}${p.salida ? ' y llevamos 1' : ''}.`;
    $('calc-steps').append(item);
    $('calc-column').textContent = `Resolvemos ${nombres[current]}`;
    current += 1;
    if (current === steps.length) {
      $('calc-expression').textContent = `${exercise.a} + ${exercise.b} = ${exercise.a + exercise.b}`;
      $('calc-next').disabled = $('calc-all').disabled = true;
      celebrar($('calculator-lab'), 'calculadora');
    }
  }
  $('calculator-form').addEventListener('submit', event => { event.preventDefault(); prepare(); });
  [$('calc-a'), $('calc-b')].forEach(input => input.addEventListener('input', () => {
    clear();
    $('calc-error').textContent = 'Pulsa «Preparar suma» cuando tengas los dos números.';
  }));
  $('calc-next').addEventListener('click', step);
  $('calc-all').addEventListener('click', () => { while (exercise && current < steps.length) step(); });
  prepare();
}
