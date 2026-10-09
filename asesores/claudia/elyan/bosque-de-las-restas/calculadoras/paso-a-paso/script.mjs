import { digitos, pasosResta, ORDENES } from '../../recursos/modelo.mjs';
import { $, mensaje, dibujarTablero, destellos } from '../../recursos/interfaz.mjs';
let a = 305, b = 178, estado, pasos, cursor;
function dibujar() {
  dibujarTablero($('tablero'), estado, { objetos: false, lectura: true });
  $('paso').disabled = $('todo').disabled = cursor === pasos.length;
  $('operacion').textContent = `${a} − ${b} = ${cursor === pasos.length ? a - b : '?'}`;
}
function iniciar() {
  estado = { inicial: digitos(a), actual: digitos(a), pedido: digitos(b), respuesta: [null, null, null], historial: [] };
  pasos = pasosResta(a, b); cursor = 0;
  $('pasos').replaceChildren(); $('paso-titulo').textContent = 'Empezamos por las unidades';
  dibujar(); mensaje('Pulsa Siguiente paso para descubrir la resta. Cada cambio conserva el valor.');
}
function avanzar(animar = true) {
  if (cursor >= pasos.length) return;
  const paso = pasos[cursor++];
  estado.actual = [...paso.despues];
  let texto;
  if (paso.tipo === 'cambio') {
    estado.historial.push([...paso.despues]);
    const f = paso.fuente;
    texto = `Cambiamos 1 ${f === 2 ? 'centena por 10 decenas' : 'decena por 10 unidades'}. ${ORDENES[f]}: ${paso.antes[f]} → ${paso.despues[f]}; ${ORDENES[f - 1]}: ${paso.antes[f - 1]} → ${paso.despues[f - 1]}.`;
  } else {
    estado.respuesta[paso.columna] = paso.resultado;
    texto = `${ORDENES[paso.columna]}: ${paso.arriba} − ${paso.abajo} = ${paso.resultado}.`;
  }
  const li = document.createElement('li'); li.textContent = texto; $('pasos').append(li);
  dibujar();
  if (animar && paso.tipo === 'cambio') destellos($('tablero'), paso.fuente);
  $('paso-titulo').textContent = cursor === pasos.length ? '¡Ya está la resta!' : `Paso ${cursor} de ${pasos.length}`;
  mensaje(cursor === pasos.length ? `¡Descubierto! ${a} − ${b} = ${a - b}. Puedes volver al principio para explorarlo otra vez.` : texto, cursor === pasos.length ? 'bien' : '');
}
$('preparar').addEventListener('submit', event => {
  event.preventDefault();
  const primero = $('numero-a').value, segundo = $('numero-b').value;
  ['numero-a', 'numero-b'].forEach(id => $(id).removeAttribute('aria-invalid'));
  if (!/^\d{1,3}$/.test(primero) || !/^\d{1,3}$/.test(segundo)) {
    const id = !/^\d{1,3}$/.test(primero) ? 'numero-a' : 'numero-b';
    $(id).setAttribute('aria-invalid', 'true'); $(id).focus();
    mensaje('Escribe números enteros del 0 al 999, sin signos ni decimales. Completa las dos casillas.', 'revisa'); return;
  }
  if (Number(primero) < Number(segundo)) {
    $('numero-a').setAttribute('aria-invalid', 'true'); $('numero-a').focus();
    mensaje('El primer número debe ser mayor o igual que el segundo. En este bosque restamos sin números negativos.', 'revisa'); return;
  }
  a = Number(primero); b = Number(segundo); iniciar();
});
$('paso').addEventListener('click', () => avanzar());
$('todo').addEventListener('click', () => { while (cursor < pasos.length) avanzar(false); });
$('reiniciar').addEventListener('click', iniciar);
iniciar();
