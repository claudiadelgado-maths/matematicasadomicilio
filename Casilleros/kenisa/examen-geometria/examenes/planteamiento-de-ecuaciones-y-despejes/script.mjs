import { TEMAS, CATALOGO } from './banco.mjs?v=20261010-1';
import { crearPractica, siguiente, cambiarTema, responder, progreso, nuevaRonda } from './modelo.mjs?v=20261010-1';

const $ = id => document.getElementById(id);
const estado = crearPractica();
let temporizador;
function actualizarProgreso() {
  const p = progreso(estado);
  $('progreso-texto').textContent = `${p.completadas} de ${p.total} preguntas practicadas · Ronda ${estado.ronda}`;
  $('barra').value = p.completadas;
  $('barra').max = p.total;
  $('progreso-tema').textContent = estado.tema === 'todos' ? 'Todos los temas combinados' : `${p.temaCompletadas} de ${p.temaTotal} practicadas en este tema`;
}
function pintar(enfocar = false) {
  clearTimeout(temporizador);
  actualizarProgreso();
  const q = estado.actual;
  $('reto').hidden = !q;
  $('fin').hidden = !!q;
  if (!q) {
    const terminado = progreso(estado).terminado;
    $('fin-titulo').textContent = terminado ? '¡Terminaste esta ronda de práctica!' : 'Ya recorriste todas las preguntas de este tema';
    $('fin-texto').textContent = terminado ? 'Puedes empezar otra ronda con las preguntas en un orden diferente.' : 'Continúa con los demás temas. Tus preguntas respondidas se mantienen registradas durante esta visita.';
    $('otra-ronda').hidden = !terminado;
    $('todos-temas').hidden = terminado;
    if (enfocar) $('fin-titulo').focus();
    return;
  }
  $('tema-pregunta').textContent = TEMAS[q.tema];
  $('enunciado').textContent = q.enunciado;
  $('opciones').replaceChildren(...q.opciones.map(opcion => {
    const boton = document.createElement('button');
    boton.type = 'button'; boton.className = 'practice-option'; boton.dataset.opcion = opcion.id;
    const letra = document.createElement('span'); letra.className = 'letter'; letra.textContent = opcion.id.toUpperCase();
    const texto = document.createElement('span'); texto.textContent = opcion.texto;
    const marca = document.createElement('span'); marca.className = 'mark'; marca.setAttribute('aria-hidden','true');
    boton.append(letra,texto,marca);
    if (estado.respuesta) {
      boton.disabled = true;
      if (opcion.id === q.correcta) { boton.classList.add('correct'); marca.textContent = '✓'; }
      else if (opcion.id === estado.respuesta.id) { boton.classList.add('incorrect'); marca.textContent = '×'; }
    }
    boton.addEventListener('click', () => {
      if (responder(estado,opcion.id) === null) return;
      pintar();
      $('siguiente').focus({preventScroll:true});
      if (!estado.respuesta.correcta) temporizador = setTimeout(() => $('feedback-marca').textContent = '', 1500);
    });
    return boton;
  }));
  $('feedback').hidden = !estado.respuesta;
  $('procedimiento').hidden = !estado.respuesta;
  $('siguiente').disabled = !estado.respuesta;
  $('siguiente').textContent = progreso(estado).terminado ? 'Terminar esta ronda →' : 'Siguiente pregunta →';
  $('instruccion').hidden = !!estado.respuesta;
  if (estado.respuesta) {
    const acierto = estado.respuesta.correcta;
    $('feedback').className = `practice-feedback ${acierto ? 'correct' : 'incorrect'}`;
    $('feedback-marca').textContent = acierto ? '✓' : '×';
    $('feedback-texto').textContent = acierto ? '¡Correcto! Comprueba cómo se plantea.' : 'Esta opción no es correcta. Revisa el procedimiento y continúa cuando quieras.';
    $('pasos').replaceChildren(...q.pasos.map(texto => { const li = document.createElement('li'); li.textContent = texto; return li; }));
    $('respuesta-correcta').textContent = `Respuesta: ${q.opciones.find(opcion => opcion.id === q.correcta).texto}`;
  } else {
    $('pasos').replaceChildren(); $('respuesta-correcta').textContent = ''; $('feedback-texto').textContent = '';
  }
  if (enfocar) $('enunciado').focus();
}
$('tema').replaceChildren(...[['todos','Todos los temas'],...Object.entries(TEMAS)].map(([valor,nombre]) => {
  const opcion = document.createElement('option'); opcion.value = valor; opcion.textContent = nombre; return opcion;
}));
$('tema').addEventListener('change',evento => { cambiarTema(estado,evento.target.value); pintar(); });
$('siguiente').addEventListener('click',() => { if (!estado.respuesta) return; siguiente(estado); pintar(true); });
$('todos-temas').addEventListener('click',() => { cambiarTema(estado,'todos'); $('tema').value='todos'; pintar(true); });
$('otra-ronda').addEventListener('click',() => { if (nuevaRonda(estado)) { $('tema').value='todos'; pintar(true); } });
$('tamano-banco').textContent = `${estado.banco.length} preguntas · ${CATALOGO.length} planteamientos distintos`;
siguiente(estado); pintar();
