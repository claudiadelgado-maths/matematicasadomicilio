import { pantallaCompleta, salirDePantalla } from './pantalla.mjs';
import { leerProgreso, guardarProgreso, puedeGuardar } from './progreso.mjs';
import { TOTAL } from './modelo.mjs';

export function prepararReproductor(alCerrar) {
  const ventana = document.createElement('div');
  ventana.id = 'reproductor-bosque';
  ventana.className = 'reproductor-bosque';
  ventana.hidden = true;
  ventana.setAttribute('role', 'dialog');
  ventana.setAttribute('aria-modal', 'true');
  ventana.setAttribute('aria-label', 'El bosque de las restas, ventana de juego');
  const carga = document.createElement('div'); carga.className = 'reproductor-carga';
  carga.innerHTML = '<p role="status">🌳 Abriendo el bosque…</p><button type="button">✕ Cerrar</button>';
  ventana.append(carga); document.body.append(ventana);
  let marco, origenFoco, cerrando = false;
  const previos = new Map();
  async function cerrar() {
    if (ventana.hidden || cerrando) return;
    cerrando = true;
    await salirDePantalla(document);
    ventana.hidden = true;
    // Se conserva el iframe: cerrar y abrir no borra la misión en curso.
    marco?.contentWindow?.postMessage({ tipo: 'bosque-pausa' }, location.origin);
    document.body.classList.remove('reproductor-abierto');
    previos.forEach((inert, nodo) => { nodo.inert = inert; }); previos.clear();
    alCerrar(); origenFoco?.focus({ preventScroll: true }); cerrando = false;
  }
  carga.querySelector('button').addEventListener('click', cerrar);
  function reanudar() {
    marco.contentWindow?.postMessage({ tipo: 'bosque-reanudar', progreso: leerProgreso() }, location.origin);
  }
  window.addEventListener('message', evento => {
    if (evento.origin !== location.origin || evento.source !== marco?.contentWindow) return;
    if (evento.data?.tipo === 'bosque-cerrar') cerrar();
    if (evento.data?.tipo === 'bosque-listo') {
      carga.hidden = true;
      if (!ventana.hidden) { reanudar(); marco.focus(); }
    }
    if (evento.data?.tipo === 'bosque-progreso' && !puedeGuardar()) {
      const nuevo = evento.data.progreso, actual = leerProgreso();
      if (nuevo?.semilla === actual.semilla && Number.isInteger(nuevo.completadas) && nuevo.completadas >= actual.completadas && nuevo.completadas <= TOTAL) guardarProgreso(nuevo);
    }
  });
  return function abrir(evento) {
    // Mantiene los gestos nativos de abrir un enlace en otra pestaña.
    if (evento && (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey)) return;
    evento?.preventDefault();
    guardarProgreso(leerProgreso());
    origenFoco = document.activeElement;
    ventana.hidden = false;
    document.body.classList.add('reproductor-abierto');
    for (const nodo of document.body.children) {
      if (nodo === ventana || nodo.tagName === 'SCRIPT') continue;
      previos.set(nodo, nodo.inert); nodo.inert = true;
    }
    pantallaCompleta(ventana);
    if (!marco) {
      marco = document.createElement('iframe');
      marco.title = 'El bosque de las restas';
      marco.allow = 'fullscreen'; marco.allowFullscreen = true;
      marco.src = new URL('../juegos/aventura/index.html?ventana=1', import.meta.url).href;
      ventana.prepend(marco);
    } else reanudar();
    marco.focus();
  };
}
