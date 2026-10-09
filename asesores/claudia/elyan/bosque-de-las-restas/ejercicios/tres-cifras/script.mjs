import { generarResta, digitos } from '../../recursos/modelo.mjs';
import { $, mensaje, celebrar, activarSonido } from '../../recursos/interfaz.mjs';
import { Mesa } from '../../recursos/mesa.mjs';
let anterior = '', estrellas = 0, contado = false;
const mesa = new Mesa({ teclado: true, alAcertar: () => {
  if (!contado) { estrellas += 1; contado = true; }
  mensaje(`¡Resta descubierta! ${mesa.reto.a} − ${mesa.reto.b} = ${mesa.reto.a - mesa.reto.b}. ¡Cada intercambio conserva el valor!`, 'bien');
  $('estrellas').textContent = `⭐ ${estrellas} ${estrellas === 1 ? 'resta descubierta' : 'restas descubiertas'}`;
  celebrar(); $('nueva').focus({ preventScroll: true });
} });
function nueva() {
  const { a, b } = generarResta($('dificultad').value, Math.random, anterior);
  anterior = `${a}-${b}`; contado = false;
  mesa.preparar({ a, b, inicial: digitos(a), pedido: digitos(b) }, false);
  $('operacion').textContent = `${a} − ${b} = ?`;
  mensaje('Empieza por las unidades. Haz los intercambios que necesites y escribe una cifra en cada casilla.');
}
$('responder').addEventListener('submit', event => { event.preventDefault(); mesa.comprobar(); });
$('nueva').addEventListener('click', nueva);
$('dificultad').addEventListener('change', nueva);
activarSonido(); nueva();
