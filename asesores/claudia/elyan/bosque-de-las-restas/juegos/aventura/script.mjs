import { TOTAL, RANGOS, mision, rango, valor } from '../../recursos/modelo.mjs';
import { $, mensaje, pintarPoder, pintarIconoRango, activarSonido, celebrar } from '../../recursos/interfaz.mjs';
import { leerProgreso, guardarProgreso, puedeGuardar } from '../../recursos/progreso.mjs';
import { Mesa } from '../../recursos/mesa.mjs';
import { pantallaCompleta, salirDePantalla, elementoCompleto } from '../../recursos/pantalla.mjs';

const app = $('juego-app');
let contenedorPadre;
try { contenedorPadre = window.frameElement?.closest('.reproductor-bosque'); } catch { /* Entrada independiente. */ }
const embebido = Boolean(contenedorPadre && new URLSearchParams(location.search).get('ventana') === '1');
const objetivoPantalla = embebido ? contenedorPadre : app;
const documentoPantalla = objetivoPantalla.ownerDocument;
let progreso = guardarProgreso(leerProgreso());
let nivel = Math.min(progreso.completadas, TOTAL - 1), variante = 0, avisoTimer;
const inertPrevio = new Map();
const clientes = [
  ['🐰', 'Lola, la conejita', '¡Preparo un picnic para mis amigos!'],
  ['🦊', 'Fito, el zorro', '¡Hoy hay fiesta en mi madriguera!'],
  ['🐼', 'Pipo, el panda', 'Necesito provisiones para explorar.'],
  ['🐸', 'Rita, la rana', '¡Tengo invitados junto al estanque!'],
  ['🐨', 'Kiko, el koala', '¡Mi merienda va a estar deliciosa!'],
  ['🦉', 'Olivia, la búha', 'Llevaré este pedido a la cima.'],
  ['🦖', 'Rex, el guardián', '¡Una misión digna de un dinosaurio!']
];
const mesa = new Mesa({ teclado: false, alAcertar: ganar, alReiniciar: () => {
  $('victoria').close(); $('ver-premio').hidden = true; $('comprobar').hidden = false;
  pintarCliente();
} });
function pintarCliente() {
  const [icono, nombre, frase] = clientes[nivel % clientes.length];
  $('cliente-avatar').textContent = icono;
  $('mision-titulo').textContent = nombre;
  $('consigna').textContent = frase;
}
function poder() {
  pintarPoder(progreso.completadas);
  $('total-estrellas').textContent = `⭐ ${progreso.completadas * 3}`;
  $('total-estrellas').setAttribute('aria-label', `${progreso.completadas * 3} estrellas conseguidas`);
}
function cargar() {
  const reto = { ...mision(nivel, progreso.semilla, variante), nivel };
  mesa.preparar(reto, true);
  $('nivel').textContent = `NIVEL ${nivel + 1} / ${TOTAL}`;
  $('mundo-nombre').textContent = reto.nombre;
  $('abrir-magia').hidden = reto.mundo === 1;
  $('operacion').hidden = reto.mundo === 1;
  $('operacion').textContent = reto.a === undefined ? '' : `Puesto: ${reto.a} · Pedido: ${reto.b}`;
  app.dataset.mundo = reto.mundo;
  poder();
  mensaje('¡Tu cliente está listo!');
  $('guardado').textContent = puedeGuardar() ? 'Tu avance se guarda al superar cada nivel. Siempre ganas tres estrellas. ¡Sin perder vidas!' : 'Este navegador no permite guardar. Puedes seguir jugando, pero perderás el progreso al cerrar la página.';
  document.querySelector('.arena-play').scrollTop = 0;
}
function cerrarPopups() { app.querySelectorAll('dialog[open]').forEach(d => d.close()); }
function abrirPopup(id) { cerrarPopups(); $(id).showModal(); }
function ganar(estado) {
  const antes = progreso.completadas, anterior = rango(antes);
  const reciente = leerProgreso();
  if (reciente.semilla === progreso.semilla) progreso.completadas = Math.max(progreso.completadas, reciente.completadas);
  const nuevo = nivel === progreso.completadas;
  if (nuevo) progreso.completadas += 1;
  guardarProgreso(progreso); poder();
  if (embebido && !puedeGuardar()) parent.postMessage({ tipo: 'bosque-progreso', progreso }, location.origin);
  const actual = rango(progreso.completadas);
  $('comprobar').hidden = true; $('ver-premio').hidden = false;
  $('premio-nivel').textContent = `¡NIVEL ${nivel + 1} SUPERADO!`;
  $('victoria-titulo').textContent = nivel === TOTAL - 1 ? '¡Eres una leyenda!' : ['¡Pedido perfecto!', '¡Magia de diez!', '¡Resta legendaria!'][mesa.reto.mundo - 1];
  $('victoria-texto').textContent = nuevo ? '¡Tres estrellas para ti! El bosque celebra tu victoria.' : '¡Tres estrellas otra vez! Este nivel ya forma parte de tu aventura.';
  $('premio-avance').textContent = `${progreso.completadas} de ${TOTAL} niveles conquistados`;
  $('premio-poder').max = TOTAL; $('premio-poder').value = antes;
  $('premio-rango').hidden = actual.nombre === anterior.nombre;
  pintarIconoRango($('nuevo-avatar'), actual);
  $('nuevo-rango').textContent = actual.nombre;
  $('siguiente').textContent = nivel === TOTAL - 1 ? '¡VER MI AVENTURA! →' : 'CONTINUAR →';
  const resultado = mesa.reto.mundo === 1 ? `Quedan ${estado.respuesta[2]} hojas, ${estado.respuesta[1]} plátanos y ${estado.respuesta[0]} manzanas.` : `${mesa.reto.a} − ${mesa.reto.b} = ${valor(estado.respuesta)}.`;
  mensaje(`¡Lo conseguiste! ${resultado}`, 'bien');
  abrirPopup('victoria');
  requestAnimationFrame(() => { $('premio-poder').value = progreso.completadas; });
  celebrar($('victoria'));
}
function mapa() {
  $('niveles').replaceChildren();
  [[0, 10, '🏕️ El mercado del bosque'], [10, 30, '✨ El intercambio mágico'], [30, TOTAL, '🦖 La cima del T-Rex']].forEach(([inicio, fin, titulo]) => {
    const grupo = document.createElement('section'); grupo.className = 'mapa-grupo';
    const h = document.createElement('h3'); h.textContent = titulo; grupo.append(h);
    const botones = document.createElement('div'); botones.className = 'niveles';
    for (let n = inicio; n < fin; n++) {
      const b = document.createElement('button'); b.type = 'button';
      const hecho = n < progreso.completadas, bloqueado = n > progreso.completadas;
      b.innerHTML = `<strong>${bloqueado ? '🔒' : n + 1}</strong><small>${hecho ? '★★★' : bloqueado ? `Nivel ${n + 1}` : 'JUGAR'}</small>`;
      b.setAttribute('aria-label', `Nivel ${n + 1}${hecho ? ', completado, 3 estrellas' : bloqueado ? ', bloqueado' : ', disponible'}`);
      b.className = `${hecho ? 'hecho' : ''} ${n === nivel ? 'elegido' : ''}`;
      b.disabled = bloqueado;
      b.addEventListener('click', () => { nivel = n; variante = 0; $('mapa').close(); cargar(); $('comprobar').focus({ preventScroll: true }); });
      botones.append(b);
    }
    grupo.append(botones); $('niveles').append(grupo);
  });
  abrirPopup('mapa');
}
function rangos() {
  $('lista-rangos').replaceChildren();
  RANGOS.forEach((r, i) => {
    const desbloqueado = progreso.completadas >= r.desde, actual = r === rango(progreso.completadas);
    const item = document.createElement('li');
    item.className = desbloqueado ? 'rango-ganado' : 'rango-bloqueado';
    const faltan = r.desde - progreso.completadas;
    const estado = actual ? 'TU RANGO ACTUAL' : desbloqueado ? 'CONSEGUIDO ✓' : `🔒 BLOQUEADO · ${faltan === 1 ? 'Falta 1 nivel' : `Faltan ${faltan} niveles`}`;
    item.innerHTML = `<span class="rango-retrato" aria-hidden="true"></span><div><small>RANGO ${i + 1}</small><strong>${r.nombre}</strong><span>${estado}</span></div>`;
    pintarIconoRango(item.querySelector('.rango-retrato'), r);
    if (actual) item.setAttribute('aria-current', 'step');
    $('lista-rangos').append(item);
  });
  abrirPopup('rangos');
}
function inventarioMagico() {
  $('magia-inventario').innerHTML = [2, 1, 0].map(p => `<div><span aria-hidden="true">${['🍎', '🍌', '🍃'][p]}</span><strong>${mesa.estado.actual[p]}</strong><small>${['manzanas', 'plátanos', 'hojas'][p]}</small></div>`).join('');
}
function ayuda(titulo) {
  $('ayuda-titulo').textContent = titulo;
  $('ayuda-texto').textContent = $('estado').textContent;
  abrirPopup('ayuda');
}
function estadoPantalla() {
  const activa = Boolean(elementoCompleto(documentoPantalla));
  $('pantalla').setAttribute('aria-label', activa ? 'Salir de pantalla completa' : 'Activar pantalla completa');
  $('pantalla').setAttribute('aria-pressed', String(activa));
  $('pantalla').title = activa ? 'Salir de pantalla completa' : 'Pantalla completa';
}
function avisoPantalla() {
  clearTimeout(avisoTimer);
  $('pantalla-aviso').textContent = 'Tu navegador mantiene sus barras. ¡Puedes seguir jugando aquí!';
  $('pantalla-aviso').hidden = false;
  avisoTimer = setTimeout(() => { $('pantalla-aviso').hidden = true; }, 5000);
}
async function pedirPantalla() {
  if (!await pantallaCompleta(objetivoPantalla)) avisoPantalla();
  estadoPantalla();
}
function activar(solicitar = true) {
  app.hidden = false; document.body.classList.add('juego-abierto');
  for (const nodo of document.body.children) {
    if (nodo === app || nodo.tagName === 'SCRIPT') continue;
    if (!inertPrevio.has(nodo)) inertPrevio.set(nodo, nodo.inert);
    nodo.inert = true;
  }
  if (solicitar) pedirPantalla();
  estadoPantalla();
  $('comprobar').focus({ preventScroll: true });
  if (mesa.estado.resuelto) abrirPopup('victoria');
}
async function cerrarJuego() {
  cerrarPopups();
  if (embebido) { parent.postMessage({ tipo: 'bosque-cerrar' }, location.origin); return; }
  await salirDePantalla(documentoPantalla);
  app.hidden = true; document.body.classList.remove('juego-abierto');
  inertPrevio.forEach((inert, nodo) => { nodo.inert = inert; }); inertPrevio.clear();
  $('jugar').textContent = '▶ CONTINUAR JUGANDO'; $('jugar').focus({ preventScroll: true });
}
$('jugar').addEventListener('click', () => activar());
$('cerrar-juego').addEventListener('click', cerrarJuego);
$('pantalla').addEventListener('click', async () => {
  if (elementoCompleto(documentoPantalla)) await salirDePantalla(documentoPantalla);
  else await pedirPantalla();
  estadoPantalla();
});
['fullscreenchange', 'webkitfullscreenchange'].forEach(evento => documentoPantalla.addEventListener(evento, estadoPantalla));
$('comprobar').addEventListener('click', () => { mesa.comprobar(); if (!mesa.estado.resuelto) ayuda('¡Una pista para seguir!'); });
$('pista').addEventListener('click', () => ayuda('💡 Una pista'));
$('ver-premio').addEventListener('click', () => abrirPopup('victoria'));
$('siguiente').addEventListener('click', () => {
  $('victoria').close();
  if (nivel === TOTAL - 1) { mapa(); return; }
  nivel += 1; variante = 0; cargar(); $('comprobar').focus({ preventScroll: true });
});
$('abrir-mapa').addEventListener('click', mapa);
$('abrir-rangos').addEventListener('click', rangos);
$('abrir-magia').addEventListener('click', () => { inventarioMagico(); $('magia-estado').textContent = 'Transforma lo que tienes. ¡El valor se queda!'; abrirPopup('magia'); });
['cambio-1', 'cambio-2', 'deshacer'].forEach(id => $(id).addEventListener('click', () => { inventarioMagico(); $('magia-estado').textContent = $('estado').textContent; }));
$('abrir-ajustes').addEventListener('click', () => abrirPopup('ajustes'));
$('reiniciar').addEventListener('click', () => { $('ajustes').close(); $('comprobar').focus({ preventScroll: true }); });
$('otros-numeros').addEventListener('click', () => {
  const anterior = JSON.stringify([mesa.reto.inicial, mesa.reto.pedido]);
  let siguiente;
  do { siguiente = mision(nivel, progreso.semilla, ++variante); } while (JSON.stringify([siguiente.inicial, siguiente.pedido]) === anterior);
  $('ajustes').close(); cargar(); $('comprobar').focus({ preventScroll: true });
});
app.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', () => $(b.dataset.cerrar).close()));
app.addEventListener('keydown', evento => {
  if (app.querySelector('dialog[open]')) return;
  if (evento.key === 'Escape' && !elementoCompleto(documentoPantalla)) { evento.preventDefault(); cerrarJuego(); }
  if (evento.key !== 'Tab') return;
  const botones = [...app.querySelectorAll('button:not(:disabled)')].filter(b => b.getClientRects().length);
  const primero = botones[0], ultimo = botones.at(-1);
  if (evento.shiftKey && document.activeElement === primero) { evento.preventDefault(); ultimo.focus(); }
  else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primero.focus(); }
});
window.addEventListener('message', evento => {
  if (!embebido || evento.origin !== location.origin || evento.source !== parent) return;
  if (evento.data?.tipo === 'bosque-pausa') cerrarPopups();
  if (evento.data?.tipo === 'bosque-reanudar') {
    // Sin almacenamiento, el menú conserva la partida en memoria durante esta visita.
    if (!puedeGuardar()) {
      const dato = evento.data.progreso;
      if (Number.isInteger(dato?.completadas) && dato.completadas >= 0 && dato.completadas <= TOTAL && Number.isInteger(dato.semilla) && dato.semilla >= 0 && dato.semilla <= 4294967295) guardarProgreso(dato);
    }
    const nuevo = leerProgreso();
    if (nuevo.semilla !== progreso.semilla || nuevo.completadas !== progreso.completadas) {
      progreso = nuevo; nivel = Math.min(progreso.completadas, TOTAL - 1); variante = 0; cargar();
    }
    activar(false);
  }
});
activarSonido(); cargar();
if (embebido) { activar(false); parent.postMessage({ tipo: 'bosque-listo' }, location.origin); }
