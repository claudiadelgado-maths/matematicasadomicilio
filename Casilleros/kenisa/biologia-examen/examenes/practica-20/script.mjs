import { VERSIONS, SOURCES } from './versiones.mjs';
import { storageKey, newAttempt, chooseAnswer, missingQuestions, submitAttempt, getResult, restoreAttempt } from './modelo.mjs';

const $ = id => document.getElementById(id);
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
let version = VERSIONS[0];
let state;
let storageAvailable = true;
const memory = new Map();
const SELECTION_KEY = 'kenisa-biologia-practica-20-selection-v1';
try { version = VERSIONS.find(v => v.id === localStorage.getItem(SELECTION_KEY)) || version; }
catch { storageAvailable = false; }

function load() {
  if (memory.has(version.id)) { state = memory.get(version.id); return; }
  try { state = restoreAttempt(localStorage.getItem(storageKey(version)), version); }
  catch { storageAvailable = false; state = memory.get(version.id) || newAttempt(version); }
}
function save() {
  memory.set(version.id, state);
  try {
    localStorage.setItem(storageKey(version), JSON.stringify(state));
    localStorage.setItem(SELECTION_KEY, version.id);
    storageAvailable = true;
  }
  catch { storageAvailable = false; }
  storageNotice();
}
function storageNotice() {
  $('storage-status').textContent = storageAvailable
    ? 'Avance guardado en este navegador. No se envían tus respuestas.'
    : 'El navegador no permite guardar el avance. Puedes terminar el examen, pero mantenlo abierto para no perderlo.';
}

for (const v of VERSIONS) {
  const option = element('option', v.label); option.value = v.id; $('version-select').append(option);
}
$('version-select').value = version.id;

function renderQuestions() {
  $('mc-questions').replaceChildren(); $('tf-questions').replaceChildren(); $('question-map').replaceChildren();
  version.questions.forEach((q, i) => {
    const card = element('div', undefined, 'question-card'); card.id = `question-${q.id}`;
    const fieldset = element('fieldset');
    const legend = element('legend');
    legend.append(element('span', `${String(i + 1).padStart(2, '0')} / 20 · ${q.kind === 'mc' ? 'Opción múltiple' : `Verdadero / falso ${q.number}`}`, 'eyebrow'), element('span', q.prompt));
    fieldset.append(legend);
    const choices = element('div', undefined, q.kind === 'tf' ? 'choices tf-choices' : 'choices');
    for (const o of q.options) {
      const label = element('label', undefined, 'answer-choice');
      const radio = element('input'); radio.type = 'radio'; radio.name = q.id; radio.value = o.id; radio.required = true;
      radio.checked = state.answers[q.id] === o.id;
      label.append(radio);
      if (q.kind === 'mc') label.append(element('span', `${o.id})`, 'choice-letter'));
      label.append(element('span', o.label, 'choice-text')); choices.append(label);
    }
    fieldset.append(choices); card.append(fieldset); $(q.kind === 'mc' ? 'mc-questions' : 'tf-questions').append(card);
    const link = element('a', String(i + 1)); link.href = `#question-${q.id}`; link.dataset.question = q.id;
    link.addEventListener('click', event => { event.preventDefault(); focusQuestion(q.id); });
    $('question-map').append(link);
  });
}
function focusQuestion(id) {
  const card = $(`question-${id}`);
  (card.querySelector('input:checked') || card.querySelector('input')).focus({ preventScroll: true });
  card.scrollIntoView({ block: 'start', behavior: 'instant' });
}
function updateProgress() {
  const missing = missingQuestions(state, version);
  const count = version.questions.length - missing.length;
  $('answered-count').textContent = `${count} de 20 respondidas`;
  $('answered-meter').value = count;
  $('delivery-count').textContent = missing.length ? `Llevas ${count} de 20. Te ${missing.length === 1 ? 'falta 1 pregunta' : `faltan ${missing.length} preguntas`}.` : '¡Las 20 están respondidas! Puedes revisar tus elecciones o entregar.';
  $('attempt-label').textContent = `${version.label} · Intento ${state.attempt}`;
  for (const [i, link] of [...$('question-map').children].entries()) {
    const answered = Boolean(state.answers[link.dataset.question]);
    link.dataset.answered = String(answered);
    link.setAttribute('aria-label', `Pregunta ${i + 1}, ${answered ? 'contestada' : 'pendiente'}`);
  }
  $('first-missing').disabled = !missing.length;
}

function renderReview(result) {
  const onlyErrors = document.querySelector('input[name="review-filter"]:checked').value === 'errors';
  const questions = onlyErrors ? result.items.filter(q => !q.correct) : result.items;
  $('review-list').replaceChildren(); $('review-empty').hidden = questions.length > 0;
  for (const q of questions) {
    const index = version.questions.findIndex(item => item.id === q.id) + 1;
    const card = element('details', undefined, 'practice-review'); card.dataset.correct = String(q.correct); card.open = onlyErrors;
    const summary = element('summary');
    const status = q.correct ? (version.originalKey ? 'Coincide con la clave' : 'Respuesta correcta') : q.clarification ? 'Difiere de la clave · Lee el matiz' : 'Para repasar';
    summary.append(element('span', `${String(index).padStart(2, '0')} / 20 · ${status}`, 'review-state'), element('span', q.prompt));
    card.append(summary);
    const answers = element('ul', undefined, 'review-answers');
    for (const [title, id] of [['Tu respuesta', q.answer], [version.originalKey ? 'Respuesta esperada' : 'Respuesta correcta', q.expected]]) {
      const option = q.options.find(o => o.id === id);
      const li = element('li'); li.append(element('strong', title), element('span', `${q.kind === 'mc' ? `${id}) ` : ''}${option.label}`)); answers.append(li);
    }
    card.append(answers, element('p', q.explanation));
    if (q.clarification) {
      const note = element('aside', undefined, 'clarification');
      note.append(element('strong', 'Matiz para aprender bien'), element('p', q.clarification)); card.append(note);
    }
    if (version.originalKey && q.id === 'vf-6') {
      const example = element('p', 'Así se escribe: '); example.append(element('i', 'Equus caballus')); card.append(example);
    }
    const sources = element('ul', undefined, 'source-links');
    for (const id of q.sources) {
      const [label, url] = SOURCES[id];
      const item = element('li'); const link = element('a', label); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; item.append(link); sources.append(item);
    }
    card.append(sources); $('review-list').append(card);
  }
}
function renderResult(result) {
  $('score').textContent = String(result.score);
  $('result-version').textContent = `${version.label} · Intento ${state.attempt} · Entregado`;
  $('result-summary').textContent = `${result.correct} de 20 ${version.originalKey ? 'respuestas coinciden con la clave' : 'respuestas correctas'}. ${result.correct === 20 ? 'Ahora puedes explorar las explicaciones.' : 'Cada explicación es una oportunidad para aprender algo nuevo.'}`;
  $('result-policy').textContent = version.originalKey
    ? 'Calificación según la clave original: cada coincidencia suma 5 puntos. En los reactivos ambiguos, una diferencia con la clave no demuestra necesariamente un error conceptual. Lee sus aclaraciones aunque hayas acertado.'
    : 'Cada respuesta correcta suma 5 puntos. Revisa el porqué de tus errores o explora las veinte explicaciones para reforzar lo que aprendiste.';
  $('review-empty').textContent = version.originalKey
    ? 'No tienes errores según la clave. Selecciona «Las 20 preguntas» para leer las explicaciones y las aclaraciones del examen.'
    : '¡Acertaste las veinte! Selecciona «Las 20 preguntas» para repasar sus explicaciones.';
  $('mc-score').textContent = `${result.mc} / 10`;
  $('tf-score').textContent = `${result.tf} / 10`;
  $('error-count').textContent = `(${20 - result.correct})`;
  renderReview(result);
}
function render() {
  $('version-description').textContent = version.description;
  $('key-policy').textContent = version.originalKey
    ? 'Este simulacro conserva las preguntas y la clave del material compartido. La nota indica coincidencias con esa clave. Algunas redacciones admiten matices o más de una interpretación: los explicamos en la revisión, sin cambiar el examen original. Se añadió la pregunta 10 de verdadero/falso.'
    : 'Esta serie recorre los once temas de la actividad 2: seres vivos, crecimiento y desarrollo, adaptaciones, reproducción, irritabilidad, células, organelos, biomoléculas, metabolismo, división celular y hongos. No necesitas interpretar ningún dibujo para responder.';
  const result = getResult(state, version);
  $('draft-panel').hidden = Boolean(result); $('result-panel').hidden = !result;
  $('submit-error').hidden = true;
  if (result) {
    // No editable exam remains behind the result. Review never changes the attempt.
    $('mc-questions').replaceChildren(); $('tf-questions').replaceChildren(); $('question-map').replaceChildren();
    renderResult(result);
  } else {
    // Remove the previous key and grade from the DOM when starting another attempt.
    $('review-list').replaceChildren(); $('score').textContent = ''; $('result-summary').textContent = '';
    renderQuestions(); updateProgress();
  }
  storageNotice();
}

$('practice-form').addEventListener('change', event => {
  if (!event.target.matches('input[type="radio"]')) return;
  state = chooseAnswer(state, version, event.target.name, event.target.value);
  save(); updateProgress(); $('submit-error').hidden = true;
});
$('practice-form').addEventListener('submit', event => {
  event.preventDefault();
  const missing = missingQuestions(state, version);
  if (missing.length) {
    $('submit-error').hidden = false;
    $('submit-error').textContent = `Antes de entregar, responde ${missing.length === 1 ? 'la pregunta pendiente' : `las ${missing.length} preguntas pendientes`}. Te llevamos a la primera.`;
    focusQuestion(missing[0].id); return;
  }
  state = submitAttempt(state, version); save();
  document.querySelector('input[name="review-filter"][value="errors"]').checked = true;
  render(); $('result-title').focus({ preventScroll: true });
  $('result-panel').scrollIntoView({ block: 'start', behavior: 'instant' });
});
$('first-missing').addEventListener('click', () => {
  const first = missingQuestions(state, version)[0]; if (first) focusQuestion(first.id);
});
document.querySelector('.review-filter').addEventListener('change', () => {
  const result = getResult(state, version); if (result) renderReview(result);
});
$('retry').addEventListener('click', () => {
  state = newAttempt(version, state.attempt + 1); save(); render(); focusQuestion(version.questions[0].id);
});
$('version-select').addEventListener('change', event => {
  version = VERSIONS.find(v => v.id === event.target.value); load(); save(); render();
});
window.addEventListener('storage', event => {
  const changedVersion = VERSIONS.find(v => event.key === storageKey(v));
  if (!changedVersion) return;
  const updated = restoreAttempt(event.newValue, changedVersion);
  memory.set(changedVersion.id, updated);
  if (changedVersion.id !== version.id) return;
  state = updated; render();
  $('storage-status').textContent = 'Este intento se actualizó desde otra pestaña.';
});

load(); render(); $('loading-note').hidden = true; $('practice-app').hidden = false;
