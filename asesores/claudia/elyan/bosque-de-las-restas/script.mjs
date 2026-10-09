import { $, pintarPoder } from './recursos/interfaz.mjs';
import { leerProgreso, guardarProgreso, puedeGuardar } from './recursos/progreso.mjs';
import { TOTAL } from './recursos/modelo.mjs';
import { prepararReproductor } from './recursos/reproductor.mjs';

function actualizar() {
  const progreso = leerProgreso();
  pintarPoder(progreso.completadas);
  $('continuar').textContent = progreso.completadas === TOTAL ? '▶ Jugar como leyenda' : progreso.completadas ? `▶ Jugar · Misión ${progreso.completadas + 1}` : '▶ ¡Jugar!';
  if (!puedeGuardar()) $('guardado').textContent = 'El navegador no permite guardar. Puedes jugar, pero el progreso durará solo mientras esta página esté abierta.';
}
$('borrar').addEventListener('click', () => $('confirmar').showModal());
$('cancelar').addEventListener('click', () => $('confirmar').close());
$('confirmar-borrar').addEventListener('click', () => {
  guardarProgreso({ completadas: 0, semilla: Math.floor(Math.random() * 4294967296) });
  $('confirmar').close(); actualizar(); $('continuar').focus();
});
window.addEventListener('pageshow', actualizar);
window.addEventListener('storage', actualizar);
const abrirJuego = prepararReproductor(actualizar);
document.querySelectorAll('a[href="juegos/aventura/index.html"]').forEach(enlace => enlace.addEventListener('click', abrirJuego));
actualizar();
