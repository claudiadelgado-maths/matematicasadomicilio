import { phases, mitosisOrder, orderClues, recognition, questions } from './datos.mjs';
import { createCellScene, sceneMarkup } from './escena.mjs';
import { createOrder, shuffled } from './modelo.mjs';
import { initQuiz } from '../../recursos/repaso.mjs';

const root = document.querySelector('.mitosis');
if (root) {
  const el = id => document.getElementById(id);
  const text = (id, value) => { el(id).textContent = value; };
  const feedback = (id, value, ok = true) => { text(id, value); el(id).dataset.state = ok ? 'success' : 'retry'; };
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  el('reduce-motion').checked = preference.matches;
  const cell = createCellScene(el('main-cell'));
  let phaseIndex = 0, timer = null;

  function stopSequence(message) {
    clearInterval(timer); timer = null;
    el('play-sequence').setAttribute('aria-pressed', 'false');
    text('play-sequence', phaseIndex === 5 ? '↻ Volver a ver' : '▶ Ver secuencia');
    if (message) text('player-status', message);
  }
  function showPhase(index, automatic = false) {
    if (!Number.isInteger(index) || index < 0 || index >= phases.length) return;
    if (!automatic) stopSequence();
    phaseIndex = index;
    const phase = phases[index];
    cell.setPhase(index, !el('reduce-motion').checked);
    root.querySelectorAll('[data-phase]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.phase) === index)));
    text('scene-number', `VISTA ${index + 1} / ${phases.length}`);
    for (const key of ['category', 'name', 'title', 'description', 'reminder']) text(`phase-${key}`, phase[key]);
    el('phase-points').replaceChildren(...phase.points.map(point => { const li = document.createElement('li'); li.textContent = point; return li; }));
    text('scene-count', phase.count); text('scene-count-label', phase.countLabel); text('scene-cells', phase.cells);
    el('previous-phase').disabled = index === 0; el('next-phase').disabled = index === phases.length - 1;
    if (index === 5) stopSequence('Recorrido completo: cada hija conserva los cuatro cromosomas del modelo. Puedes volver a cualquier etapa.');
    else text('player-status', automatic ? 'Reproduciendo: cada etapa permanece seis segundos. Puedes pausar cuando quieras.' : `${phase.name}: ${phase.verb.toLowerCase()}. Explora otra etapa o reproduce el recorrido.`);
    if (timer === null) text('play-sequence', index === 5 ? '↻ Volver a ver' : '▶ Ver secuencia');
  }
  root.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => showPhase(Number(button.dataset.phase))));
  el('previous-phase').addEventListener('click', () => showPhase(phaseIndex - 1));
  el('next-phase').addEventListener('click', () => showPhase(phaseIndex + 1));
  el('play-sequence').addEventListener('click', () => {
    if (timer !== null) { stopSequence('Recorrido en pausa. Continúa cuando quieras o elige una etapa.'); return; }
    if (phaseIndex === phases.length - 1) showPhase(0);
    timer = setInterval(() => showPhase(phaseIndex + 1, true), 6000);
    text('play-sequence', 'Ⅱ Pausar recorrido');
    el('play-sequence').setAttribute('aria-pressed', 'true');
    text('player-status', 'Reproduciendo: cada etapa permanece seis segundos. Puedes pausar cuando quieras.');
  });
  function applyMotionPreference() { stopSequence('Recorrido en pausa. El ajuste de movimiento se aplicó a la célula.'); cell.setPhase(phaseIndex, false); }
  el('reduce-motion').addEventListener('change', applyMotionPreference);
  preference.addEventListener('change', event => { el('reduce-motion').checked = event.matches; applyMotionPreference(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSequence('Recorrido en pausa. Continúa cuando quieras.'); });
  window.addEventListener('pagehide', () => stopSequence());
  root.querySelectorAll('a').forEach(link => link.addEventListener('click', () => stopSequence()));

  let order;
  function resetOrder() {
    order = createOrder();
    el('order-track').replaceChildren(...mitosisOrder.map((_, i) => { const li = document.createElement('li'); li.innerHTML = `<span class="slot-label">Paso ${i + 1}</span><span class="caption">Por descubrir</span>`; return li; }));
    text('order-prompt', '¿Con qué fase comienza la mitosis?'); text('order-feedback', '');
    el('order-options').replaceChildren(...shuffled(mitosisOrder).map(id => {
      const phase = phases.find(p => p.id === id);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'btn'; button.textContent = phase.name;
      button.addEventListener('click', () => {
        if (order.complete) return;
        const previousCount = order.count;
        if (!order.choose(id)) { feedback('order-feedback', `Todavía no. ${orderClues[previousCount]} Prueba otra fase.`, false); return; }
        const slot = el('order-track').children[previousCount]; slot.classList.add('filled');
        slot.innerHTML = sceneMarkup(previousCount + 1) + `<span class="slot-label">${previousCount + 1}. ${phase.name}</span>`;
        button.disabled = true; button.textContent = `✓ ${phase.name}`;
        feedback('order-feedback', order.complete ? '¡Secuencia completa! Condensar → alinear → separar → reconstruir. La interfase va antes y la citocinesis completa la separación del citoplasma.' : `¡Bien! ${orderClues[previousCount]}`);
        text('order-prompt', order.complete ? 'Profase → Metafase → Anafase → Telofase' : `Paso ${order.count + 1} de 4: ¿qué fase sigue?`);
        el('order-prompt').focus({ preventScroll: true });
      });
      return button;
    }));
  }
  el('order-reset').addEventListener('click', () => { resetOrder(); el('order-prompt').focus({ preventScroll: true }); });
  resetOrder();

  let round = shuffled(recognition), picture = 0, solved = false;
  function showRecognition(focus = false) {
    solved = false;
    const item = round[picture];
    el('recognition-cell').innerHTML = sceneMarkup(item.phase);
    text('recognition-progress', `Imagen ${picture + 1} de ${round.length}`);
    text('recognition-prompt', item.prompt); text('recognition-feedback', '');
    el('recognition-next').hidden = true; el('recognition-reset').hidden = true;
    el('recognition-options').replaceChildren(...shuffled(mitosisOrder).map(id => {
      const phase = phases.find(p => p.id === id);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'option'; button.textContent = phase.name;
      button.addEventListener('click', () => {
        if (solved) return;
        el('recognition-options').querySelectorAll('button').forEach(b => b.classList.remove('retry'));
        if (id !== phases[item.phase].id) { button.classList.add('retry'); feedback('recognition-feedback', `Mira otra vez. ${item.explanation} Vuelve a elegir.`, false); return; }
        solved = true; button.classList.add('correct');
        el('recognition-options').querySelectorAll('button').forEach(b => { b.disabled = true; });
        const last = picture === round.length - 1;
        feedback('recognition-feedback', `¡Bien observado! ${item.explanation}${last ? ' Reconociste las cuatro fases.' : ''}`);
        el('recognition-next').hidden = last; el('recognition-reset').hidden = !last;
        el(last ? 'recognition-reset' : 'recognition-next').focus({ preventScroll: true });
      });
      return button;
    }));
    if (focus) el('recognition-prompt').focus({ preventScroll: true });
  }
  el('recognition-next').addEventListener('click', () => { if (solved && picture < round.length - 1) { picture++; showRecognition(true); } });
  el('recognition-reset').addEventListener('click', () => { round = shuffled(recognition); picture = 0; showRecognition(true); });
  showRecognition();

  initQuiz(questions, item => {
    const visual = el('quiz-image'); visual.hidden = item.phase === undefined;
    visual.innerHTML = item.phase === undefined ? '' : sceneMarkup(item.phase);
  });
  el('start-quiz').addEventListener('click', () => stopSequence());
  root.querySelectorAll('[data-interactive]').forEach(element => { element.hidden = false; });
}
