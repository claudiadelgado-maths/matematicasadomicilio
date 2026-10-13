import { EXAMENES } from './examenes.mjs?v=20261010-1';
import { crearIntento, elegirRespuesta, contarRespondidas, calificacion, entregar, alternarRespuestas } from './modelo.mjs?v=20261010-1';

const $ = id => document.getElementById(id);
const version = document.querySelector('[data-examen]').dataset.examen;
const examen = EXAMENES[version];
let intento = crearIntento(version);

function progreso() {
  const respondidas = contarRespondidas(intento);
  const pendientes = examen.preguntas.length - respondidas;
  $('contador').textContent = `${respondidas} de ${examen.preguntas.length} respondidas`;
  $('barra-progreso').value = respondidas;
  $('pendientes').textContent = respondidas === examen.preguntas.length
    ? 'Ya respondiste todas. Puedes revisarlas antes de entregar.'
    : pendientes === 1 ? 'Falta 1 por responder.' : `Faltan ${pendientes} por responder.`;
  examen.preguntas.forEach(pregunta => {
    const numero = pregunta.numero;
    const respondida = intento.respuestas[numero - 1] !== null;
    $(`salto-${numero}`).classList.toggle('respondida', respondida);
    $(`salto-${numero}`).setAttribute('aria-label', `Pregunta ${numero}: ${respondida ? 'respondida' : 'sin responder'}`);
  });
}

function corregir() {
  const resultado = calificacion(intento);
  resultado.detalle.forEach(item => {
    const tarjeta = $(`pregunta-${item.numero}`);
    tarjeta.disabled = true;
    tarjeta.dataset.estado = item.estado;
    const estado = $(`estado-${item.numero}`);
    estado.hidden = false;
    estado.textContent = item.estado === 'correcta' ? '✓ Correcta' : item.estado === 'incorrecta' ? '× Respuesta incorrecta' : '— Sin responder';
    tarjeta.querySelectorAll('label').forEach(opcion => {
      opcion.classList.toggle('opcion-correcta', opcion.dataset.letra === item.correcta && (intento.mostrarRespuestas || item.estado === 'correcta'));
      opcion.classList.toggle('opcion-incorrecta', opcion.dataset.letra === item.elegida && item.estado === 'incorrecta');
    });
    const pregunta = examen.preguntas[item.numero - 1];
    const respuesta = pregunta.opciones.find(opcion => opcion.letra === item.correcta);
    const solucion = $(`solucion-${item.numero}`);
    solucion.hidden = !intento.mostrarRespuestas;
    // La clave no se inserta en la página hasta solicitar Ver respuestas.
    solucion.textContent = intento.mostrarRespuestas ? `Respuesta correcta: ${item.correcta.toUpperCase()}) ${respuesta.texto}` : '';
    const salto = $(`salto-${item.numero}`);
    salto.dataset.estado = item.estado;
    salto.setAttribute('aria-label', `Pregunta ${item.numero}: ${estado.textContent}`);
  });
}

function mostrarResultado() {
  const resultado = calificacion(intento);
  corregir();
  $('entrega').hidden = true;
  $('resultado').hidden = false;
  $('nota').textContent = resultado.nota;
  $('aciertos').textContent = resultado.aciertos;
  $('incorrectas').textContent = resultado.incorrectas;
  $('sin-responder').textContent = resultado.sinResponder;
  $('resumen-nota').textContent = `${resultado.aciertos} ${resultado.aciertos === 1 ? 'acierto' : 'aciertos'} de ${resultado.total} preguntas.`;
  const pendientes = resultado.detalle.filter(item => item.estado !== 'correcta');
  $('revision-titulo').textContent = pendientes.length ? 'Preguntas para revisar' : '¡Todas correctas!';
  $('revision-texto').textContent = pendientes.length ? 'Toca un número para volver a esa pregunta.' : 'Puedes ver las respuestas o intentarlo de nuevo.';
  $('errores').replaceChildren(...pendientes.map(item => {
    const enlace = document.createElement('a');
    enlace.href = `#pregunta-${item.numero}`;
    enlace.className = 'error-link';
    enlace.textContent = String(item.numero);
    enlace.setAttribute('aria-label', `Pregunta ${item.numero}: ${item.estado === 'sin-responder' ? 'sin responder' : 'incorrecta'}`);
    return enlace;
  }));
  $('errores').hidden = !pendientes.length;
  $('ir-entrega').href = '#resultado';
  $('ir-entrega').textContent = 'Ver calificación ↓';
  $('resultado-titulo').focus();
}

$('formulario').addEventListener('change', evento => {
  const campo = evento.target;
  if (!campo.matches('input[type="radio"]')) return;
  if (elegirRespuesta(intento, Number(campo.dataset.numero), campo.value)) progreso();
});
$('formulario').addEventListener('submit', evento => {
  evento.preventDefault();
  if (entregar(intento)) mostrarResultado();
});
$('ver-respuestas').addEventListener('click', () => {
  alternarRespuestas(intento);
  corregir();
  $('ver-respuestas').textContent = intento.mostrarRespuestas ? 'Ocultar respuestas' : 'Ver respuestas';
  $('ver-respuestas').setAttribute('aria-expanded', String(intento.mostrarRespuestas));
  $('aviso-respuestas').textContent = intento.mostrarRespuestas ? 'Las respuestas correctas aparecen ahora debajo de cada pregunta.' : 'Las respuestas correctas se han ocultado.';
  if (intento.mostrarRespuestas) {
    const numero = calificacion(intento).detalle.find(item => item.estado !== 'correcta')?.numero || 1;
    $(`pregunta-${numero}`).focus();
  }
});
$('reintentar').addEventListener('click', () => {
  intento = crearIntento(version);
  $('formulario').reset();
  examen.preguntas.forEach(({ numero }) => {
    const tarjeta = $(`pregunta-${numero}`);
    tarjeta.disabled = false;
    delete tarjeta.dataset.estado;
    tarjeta.querySelectorAll('label').forEach(opcion => opcion.classList.remove('opcion-correcta', 'opcion-incorrecta'));
    $(`estado-${numero}`).hidden = true;
    $(`estado-${numero}`).textContent = '';
    $(`solucion-${numero}`).hidden = true;
    $(`solucion-${numero}`).textContent = '';
    delete $(`salto-${numero}`).dataset.estado;
  });
  $('resultado').hidden = true;
  $('entrega').hidden = false;
  $('ver-respuestas').textContent = 'Ver respuestas';
  $('ver-respuestas').setAttribute('aria-expanded', 'false');
  $('aviso-respuestas').textContent = '';
  $('ir-entrega').href = '#entrega';
  $('ir-entrega').textContent = 'Ir a entregar ↓';
  progreso();
  $('pregunta-1').focus();
});
document.querySelector('main').addEventListener('click', evento => {
  const enlace = evento.target.closest('a[href^="#pregunta-"]');
  if (!enlace) return;
  evento.preventDefault();
  $(enlace.getAttribute('href').slice(1)).focus();
});
// Los controles permanecen desactivados si no carga el módulo.
document.querySelectorAll('.pregunta').forEach(tarjeta => { tarjeta.disabled = false; });
$('entregar').disabled = false;
progreso();
