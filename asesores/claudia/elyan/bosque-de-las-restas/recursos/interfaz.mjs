import { ICONOS, NOMBRES, ORDENES, valor, rango, RANGOS, TOTAL } from './modelo.mjs';
export const $ = id => document.getElementById(id);
export function pintarIconoRango(contenedor, rangoActual) {
  const imagen = document.createElement('img');
  imagen.src = new URL(`./rangos/${rangoActual.icono}.svg`, import.meta.url).href;
  imagen.alt = ''; // El nombre del rango se muestra junto al retrato.
  imagen.width = imagen.height = 128;
  imagen.className = 'icono-rango';
  imagen.draggable = false;
  contenedor.replaceChildren(imagen);
}
export function mensaje(texto, tipo = '') {
  $('estado').textContent = texto;
  $('estado').className = `feedback ${tipo}`;
}
export function pintarPoder(completadas) {
  const actual = rango(completadas);
  $('rango').textContent = actual.nombre;
  pintarIconoRango($('avatar'), actual);
  $('poder').value = completadas;
  $('poder').max = TOTAL;
  $('poder-texto').textContent = `${completadas} de ${TOTAL} misiones · ${Math.round(completadas / TOTAL * 100)} % de poder`;
  const siguiente = RANGOS.find(r => r.desde > completadas);
  const restantes = siguiente ? siguiente.desde - completadas : 0;
  $('siguiente-rango').textContent = siguiente ? `${restantes === 1 ? '¡Falta 1 misión' : `¡Faltan ${restantes} misiones`} para ${siguiente.nombre}!` : '¡Todos los rangos conquistados!';
}
function frutas(p, cantidad) {
  return Array.from({ length: cantidad }, () => `<span class="fruta">${ICONOS[p]}</span>`).join('') || '<span class="vacio">Vacío</span>';
}
export function dibujarTablero(contenedor, estado, { objetos = true, teclado = false, lectura = false, maxRespuesta = objetos ? 20 : 9, alCambiar = () => {} } = {}) {
  const { inicial, actual, pedido, respuesta, resuelto = false, marcas = [], historial = [] } = estado;
  contenedor.className = `tablero ${objetos ? 'con-objetos' : 'vertical'}`;
  const tachadosDe = p => {
    const cambios = [inicial[p], ...historial.map(h => h[p])].filter((n, i, lista) => i === 0 || n !== lista[i - 1]);
    return cambios.length > 1 ? `<span class="tachados" aria-label="Antes">${cambios.slice(0, -1).map(n => `<del>${n}</del>`).join(' ')}</span>` : '<span class="tachados" aria-hidden="true"></span>';
  };
  const marca = p => `<span class="marca">${marcas[p] === false ? 'Revisa aquí' : marcas[p] === true ? '¡Bien! ✓' : ''}</span>`;
  const claseMarca = p => marcas[p] === false ? 'revisar' : marcas[p] === true ? 'acierto' : '';
  const control = p => {
    if (lectura) return `<output class="respuesta-lectura">${respuesta[p] ?? '·'}</output>`;
    if (teclado) return `<label class="sr-only" for="respuesta-${p}">Resultado de ${ORDENES[p]}</label><input id="respuesta-${p}" data-respuesta="${p}" inputmode="numeric" pattern="[0-9]" maxlength="1" autocomplete="off" value="${respuesta[p] ?? ''}" ${resuelto ? 'disabled' : ''}>`;
    return `<div class="contador"><button type="button" data-menos="${p}" aria-label="Quitar uno en ${NOMBRES[p]}" ${resuelto || respuesta[p] === 0 ? 'disabled' : ''}>−</button><output id="respuesta-${p}" aria-label="Quedan ${NOMBRES[p]}">${respuesta[p]}</output><button type="button" data-mas="${p}" aria-label="Añadir uno en ${NOMBRES[p]}" ${resuelto || respuesta[p] >= maxRespuesta ? 'disabled' : ''}>+</button></div>`;
  };
  if (objetos) {
    const columnas = [2, 1, 0];
    // Las filas completas mantienen alineadas las tres cantidades, también en móvil.
    contenedor.innerHTML = `<table class="tabla-franjas"><caption class="sr-only">Tu puesto: tienes, entregas y te quedan.</caption><thead><tr>${columnas.map(p => `<th scope="col" id="recurso-${p}" class="titulo-recurso recurso-${p}"><span aria-hidden="true">${ICONOS[p]}</span><strong>${NOMBRES[p]}</strong><small>${ORDENES[p]}</small></th>`).join('')}</tr></thead>
      <tbody class="franja franja-tienes"><tr><th colspan="3" id="fila-tienes" class="titulo-franja">TIENES</th></tr><tr>${columnas.map(p => `<td class="inventario inventario-${p}" headers="recurso-${p} fila-tienes">${tachadosDe(p)}<strong class="cantidad" data-cantidad="${p}">${actual[p]}</strong><div class="objetos" aria-hidden="true">${frutas(p, actual[p])}</div></td>`).join('')}</tr></tbody>
      <tbody class="franja franja-entregas"><tr><th colspan="3" id="fila-entregas" class="titulo-franja">ENTREGAS</th></tr><tr>${columnas.map(p => `<td class="pedido" data-pedido="${p}" headers="recurso-${p} fila-entregas"><strong class="cantidad">${pedido[p]}</strong><div class="objetos" aria-hidden="true">${frutas(p, pedido[p])}</div></td>`).join('')}</tr></tbody>
      <tbody class="franja franja-quedan"><tr><th colspan="3" id="fila-quedan" class="titulo-franja">TE QUEDAN</th></tr><tr>${columnas.map(p => `<td class="columna columna-${p} respuesta ${claseMarca(p)}" headers="recurso-${p} fila-quedan">${control(p)}<div class="objetos" aria-hidden="true">${frutas(p, respuesta[p])}</div>${marca(p)}</td>`).join('')}</tr></tbody></table>`;
  } else {
    contenedor.innerHTML = [2, 1, 0].map(p => `<section class="columna columna-${p} ${claseMarca(p)}" aria-label="${ORDENES[p]}"><h3><span class="recurso-icono" aria-hidden="true">${ICONOS[p]}</span>${['U', 'D', 'C'][p]}<small>${ORDENES[p]}</small></h3><div class="inventario"><span class="mini">Arriba</span>${tachadosDe(p)}<strong class="cantidad" data-cantidad="${p}">${actual[p]}</strong></div><div class="pedido"><span class="mini">Restamos</span><strong>− ${pedido[p]}</strong></div><div class="respuesta"><span class="mini">Resultado</span>${control(p)}${marca(p)}</div></section>`).join('');
  }
  contenedor.querySelectorAll('[data-respuesta]').forEach(input => input.addEventListener('input', () => {
    const p = Number(input.dataset.respuesta);
    respuesta[p] = /^\d$/.test(input.value) ? Number(input.value) : null;
    input.closest('.columna').classList.remove('revisar', 'acierto');
    input.closest('.columna').querySelector('.marca').textContent = '';
    alCambiar();
  }));
  contenedor.querySelectorAll('[data-mas], [data-menos]').forEach(boton => boton.addEventListener('click', () => {
    const p = Number(boton.dataset.mas ?? boton.dataset.menos), limite = maxRespuesta;
    respuesta[p] = Math.max(0, Math.min(limite, respuesta[p] + (boton.hasAttribute('data-mas') ? 1 : -1)));
    const columna = boton.closest('.columna');
    columna.querySelector('output').textContent = respuesta[p];
    columna.querySelector('[data-menos]').disabled = respuesta[p] === 0;
    columna.querySelector('[data-mas]').disabled = respuesta[p] === limite;
    columna.classList.remove('revisar', 'acierto');
    columna.querySelector('.marca').textContent = '';
    if (objetos) columna.querySelector('.objetos').innerHTML = frutas(p, respuesta[p]);
    alCambiar();
  }));
}
export function actualizarCambios(estado) {
  [1, 2].forEach(fuente => {
    const boton = $(`cambio-${fuente}`);
    boton.disabled = estado.resuelto || estado.actual[fuente] === 0 || estado.actual[fuente - 1] > 9;
    boton.title = estado.actual[fuente] === 0 ? `No tienes ${NOMBRES[fuente]} para cambiar.` : estado.actual[fuente - 1] > 9 ? 'Ya hay diez o más en la columna que recibe.' : '';
  });
  $('deshacer').disabled = estado.resuelto || !estado.historial.length;
}
export function textoCambio(fuente, actual) {
  return `¡Cambio mágico! 1 ${fuente === 2 ? 'hoja' : 'plátano'} se convierte en 10 ${NOMBRES[fuente - 1]}. Ahora tienes ${actual[fuente]} ${NOMBRES[fuente]} y ${actual[fuente - 1]} ${NOMBRES[fuente - 1]}. El valor sigue siendo ${valor(actual)}.`;
}
export function pista(estado, numero) {
  const { actual, pedido } = estado;
  const p = actual.findIndex((n, i) => n < pedido[i]);
  if (p >= 0) {
    if (numero === 1) return `Mira las ${NOMBRES[p]}: tienes ${actual[p]} y necesitas ${pedido[p]}. ¿De dónde puedes conseguir más?`;
    const fuente = actual[p + 1] > 0 ? p + 1 : p + 2;
    if (fuente > 2) return 'Ese cambio dejó un montón sin lo necesario. Pulsa Deshacer y prueba con otro.';
    return `${actual[p + 1] === 0 ? 'La columna de al lado está en cero. ' : ''}Pulsa «${fuente === 2 ? '1 hoja → 10 plátanos' : '1 plátano → 10 manzanas'}». Después mira de nuevo el pedido.`;
  }
  const i = actual.findIndex((n, p) => estado.respuesta[p] !== n - pedido[p]);
  if (i < 0) return '¡Todo está preparado! Pulsa Comprobar.';
  return numero < 3 ? `Mira las ${NOMBRES[i]}. Tienes ${actual[i]} y entregas ${pedido[i]}. Cuenta lo que queda.` : `Empieza en ${actual[i]} y cuenta ${pedido[i]} hacia atrás. Puedes usar los dibujos o tus dedos. ¡Sin prisa!`;
}
export function destellos(contenedor, fuente) {
  const celda = contenedor.querySelector(`.inventario-${fuente - 1}`) ?? contenedor.querySelector(`.columna-${fuente - 1}`);
  celda.classList.remove('magia');
  void celda.offsetWidth;
  celda.classList.add('magia');
  const lluvia = document.createElement('div');
  lluvia.className = 'cambio-particulas';
  lluvia.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 10; i++) {
    const pieza = document.createElement('span');
    pieza.textContent = ICONOS[fuente - 1];
    pieza.style.setProperty('--i', i);
    lluvia.append(pieza);
  }
  celda.append(lluvia);
  setTimeout(() => lluvia.remove(), 1100);
}
let audio, sonido = false;
export function activarSonido() {
  const boton = $('sonido');
  boton.addEventListener('click', () => {
    sonido = !sonido;
    boton.textContent = sonido ? '♪ Sonido activado' : '♪ Activar sonido';
    boton.setAttribute('aria-pressed', String(sonido));
    if (sonido) tintin();
  });
}
export function tintin(final = false) {
  if (!sonido) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume().catch(() => {});
    (final ? [523, 659, 784, 1047] : [659, 880]).forEach((hz, i) => {
      const os = audio.createOscillator(), gain = audio.createGain(), t = audio.currentTime + i * .13;
      os.type = 'sine'; os.frequency.value = hz;
      gain.gain.setValueAtTime(.06, t); gain.gain.exponentialRampToValueAtTime(.001, t + .28);
      os.connect(gain); gain.connect(audio.destination); os.start(t); os.stop(t + .3);
    });
  } catch { sonido = false; $('sonido').textContent = 'Sonido no disponible'; $('sonido').setAttribute('aria-pressed', 'false'); }
}
export function celebrar(contenedor = document.body) {
  tintin(true);
  const capa = document.createElement('div');
  capa.className = 'confeti'; capa.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 28; i++) {
    const estrella = document.createElement('span');
    estrella.textContent = ['✦', '●', '🍃', '★'][i % 4];
    estrella.style.cssText = `--x:${(i * 37) % 100}%;--d:${i % 7 * .06}s;--r:${i * 53}deg;--c:${['#c38209', '#126645', '#bd4360', '#277ea0'][i % 4]}`;
    capa.append(estrella);
  }
  contenedor.append(capa);
  setTimeout(() => capa.remove(), 2100);
}
