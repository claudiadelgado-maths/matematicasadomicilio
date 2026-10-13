const form = document.querySelector('#presentation-form');
const output = document.querySelector('#presentation-output');
const voiceStatus = document.querySelector('#voice-status');
const stopButton = document.querySelector('#stop-reading');
const synth = window.speechSynthesis;
let currentSpeech;
let voiceTimer;

function stopReading() {
  currentSpeech = null;
  clearTimeout(voiceTimer);
  synth?.cancel();
  stopButton.hidden = true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = ['nombre', 'edad', 'ocupacion', 'gusto'].map((id) => document.getElementById(id));
  for (const field of fields) {
    field.setCustomValidity(field.value.trim() ? '' : 'Completa este campo para leer la presentación.');
  }
  if (!form.reportValidity()) return;
  stopReading();
  const [name, age, occupation, hobby] = fields.map((field) => field.value.trim());
  const phrase = `Hola, soy ${name}, tengo ${age} años, soy ${occupation} y me gusta ${hobby}.`;
  output.textContent = phrase;
  output.hidden = false;
  if (!synth || !window.SpeechSynthesisUtterance) {
    voiceStatus.textContent = 'Este navegador no dispone de lectura en voz alta. Podemos leer la presentación que aparece arriba.';
    return;
  }
  const speech = new SpeechSynthesisUtterance(phrase);
  currentSpeech = speech;
  speech.lang = 'es-MX';
  const voices = synth.getVoices();
  const voice = voices.find((item) => /^es[-_]MX$/i.test(item.lang)) || voices.find((item) => /^es\b/i.test(item.lang));
  if (voice) speech.voice = voice;
  speech.rate = 0.95;
  stopButton.hidden = false;
  voiceStatus.textContent = 'Preparando la lectura…';
  speech.onstart = () => {
    if (currentSpeech !== speech) return;
    clearTimeout(voiceTimer);
    voiceStatus.textContent = 'Leyendo la presentación…';
  };
  speech.onend = () => {
    if (currentSpeech !== speech) return;
    currentSpeech = null;
    clearTimeout(voiceTimer);
    stopButton.hidden = true;
    voiceStatus.textContent = 'Lectura terminada. Pueden cambiar los datos y leer de nuevo.';
  };
  speech.onerror = () => {
    if (currentSpeech !== speech) return;
    stopReading();
    voiceStatus.textContent = 'No se pudo reproducir la voz. Puedes volver a pulsar Leer o leer la frase en pantalla.';
  };
  voiceTimer = setTimeout(() => {
    if (currentSpeech !== speech) return;
    stopReading();
    voiceStatus.textContent = 'La voz no respondió. Puedes volver a intentarlo o leer la frase en pantalla.';
  }, 8000);
  try { synth.speak(speech); } catch { speech.onerror(); }
});
form.addEventListener('input', (event) => {
  event.target.setCustomValidity?.('');
  stopReading();
  output.hidden = true;
  output.textContent = '';
  voiceStatus.textContent = '';
});
form.addEventListener('reset', () => {
  stopReading();
  form.querySelectorAll('input').forEach((input) => input.setCustomValidity(''));
  output.hidden = true;
  output.textContent = '';
  voiceStatus.textContent = 'Campos listos para otra presentación.';
});
stopButton.addEventListener('click', () => {
  stopReading();
  voiceStatus.textContent = 'Lectura detenida.';
});
window.addEventListener('pagehide', stopReading);

const reviewed = [...document.querySelectorAll('[data-reviewed]')];
reviewed.forEach((checkbox) => checkbox.addEventListener('change', () => {
  checkbox.closest('details').classList.toggle('is-reviewed', checkbox.checked);
  document.querySelector('#history-progress').textContent = `${reviewed.filter((item) => item.checked).length} de 4 conversaciones revisadas.`;
}));

const target = document.querySelector('#mi-plan');
const chips = [...document.querySelectorAll('[data-plan]')];
const planStatus = document.querySelector('#plan-status');
const selected = new Set();
function updatePlan(id, include) {
  if (include && selected.has(id)) {
    planStatus.textContent = 'Este elemento ya está en tu plan.';
    return;
  }
  const chip = chips.find((item) => item.dataset.plan === id);
  const entry = document.getElementById(`plan-${id}`);
  if (include) { selected.add(id); entry.parentElement.append(entry); } else selected.delete(id);
  entry.hidden = !include;
  chip.setAttribute('aria-pressed', String(include));
  chip.querySelector('.chip-action').textContent = include ? '✓' : '＋';
  document.querySelector('#plan-count').textContent = `${selected.size} / 5`;
  document.querySelector('#plan-empty').hidden = selected.size > 0;
  const label = chip.children[1].textContent;
  planStatus.textContent = include
    ? `${label} añadido. ${entry.querySelector('p').textContent}${selected.size === 5 ? ' Ya tenemos los cinco elementos del plan.' : ''}`
    : `${label} retirado del plan.`;
}
document.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
  const id = button.dataset.remove;
  updatePlan(id, false);
  chips.find((chip) => chip.dataset.plan === id).focus();
}));

// Pointer Events permite el mismo arrastre con ratón, lápiz y dedo.
// Cada ficha también es un botón nativo operable con Enter o Espacio.
let drag;
let frame;
let suppressClickUntil = 0;
let suppressedChip;
function overTarget(x, y) {
  const rect = target.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
function drawDrag() {
  if (!drag?.ghost) return;
  const { x, y, ghost } = drag;
  ghost.style.left = `${Math.max(5, Math.min(x + 12, innerWidth - ghost.offsetWidth - 5))}px`;
  ghost.style.top = `${Math.max(5, Math.min(y + 12, innerHeight - ghost.offsetHeight - 5))}px`;
  target.classList.toggle('is-over', overTarget(x, y));
  if (y < 75) window.scrollBy({ top: -12, behavior: 'instant' });
  else if (y > innerHeight - 75) window.scrollBy({ top: 12, behavior: 'instant' });
  frame = requestAnimationFrame(drawDrag);
}
function endDrag(commit = false) {
  if (!drag) return;
  const { chip, ghost, x, y, pointerId } = drag;
  drag = null;
  cancelAnimationFrame(frame);
  chip.classList.remove('is-dragging');
  target.classList.remove('is-over');
  if (chip.hasPointerCapture(pointerId)) chip.releasePointerCapture(pointerId);
  if (ghost) {
    ghost.remove();
    suppressClickUntil = performance.now() + 400;
    suppressedChip = chip;
    if (commit && overTarget(x, y)) updatePlan(chip.dataset.plan, true);
    else planStatus.textContent = 'Arrastre cancelado. Suelta dentro de Mi plan o pulsa el elemento para añadirlo.';
  }
}
chips.forEach((chip) => {
  chip.addEventListener('click', (event) => {
    if (event.detail > 0 && chip === suppressedChip && performance.now() < suppressClickUntil) return;
    updatePlan(chip.dataset.plan, true);
  });
  chip.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || selected.has(chip.dataset.plan)) return;
    endDrag();
    drag = { chip, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY };
    chip.setPointerCapture(event.pointerId);
  });
  chip.addEventListener('pointermove', (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag.x = event.clientX;
    drag.y = event.clientY;
    if (!drag.ghost && Math.hypot(drag.x - drag.startX, drag.y - drag.startY) > 8) {
      const ghost = document.createElement('div');
      ghost.className = 'plan-drag-ghost';
      ghost.textContent = chip.children[1].textContent;
      ghost.setAttribute('aria-hidden', 'true');
      document.body.append(ghost);
      drag.ghost = ghost;
      chip.classList.add('is-dragging');
      drawDrag();
    }
  });
  chip.addEventListener('pointerup', (event) => { if (drag?.pointerId === event.pointerId) endDrag(true); });
  chip.addEventListener('pointercancel', () => endDrag());
  chip.addEventListener('lostpointercapture', () => endDrag());
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') endDrag(); });
window.addEventListener('pagehide', () => endDrag());
