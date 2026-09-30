import { BIOMOLECULES, FUNCTION_BANK, SORTING_BANK } from './datos.mjs?v=20260929-3';
import { icon } from './iconos.mjs';
import { mountQuiz } from '../../recursos/cuestionarios.mjs?v=20260929-3';
import { createRoundGenerator, shuffle } from '../../recursos/modelo-repaso.mjs?v=20260929-3';
import { createSortingState, classifyCard, advanceSorting, sortingScore } from './modelo.mjs';

const page = document.querySelector('.biomolecule-lab');
if (page) {
  const byId = new Map(BIOMOLECULES.map((item) => [item.id, item]));
  const visited = new Set();
  const positions = [[45, 15, 48, 13], [17, 40, 16, 35], [15, 78, 17, 74], [53, 59, 50, 50], [76, 30, 80, 32], [80, 76, 81, 75], [43, 84, 48, 86]];
  const buttons = new Map();
  let selected = null;
  let demoPhase = 0;
  const find = (selector) => page.querySelector(selector);
  const details = find('[data-details]');
  find('[data-selected-title]').id = 'biomolecula-detalle';
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function demoDrawing(id, phase) {
    const active = phase > 0;
    const arrows = `<path d="M92 48h32m-8-6 8 6-8 6M191 48h32m-8-6 8 6-8 6" opacity="${active ? 1 : .2}"/>`;
    const useIcon = (type, x) => `<g transform="translate(${x} 20) scale(.85)">${icon(type).replace(/^.*?<svg[^>]*>/, '').replace('</svg>', '')}</g>`;
    let drawing;
    if (id === 'agua') drawing = `<ellipse cx="160" cy="48" rx="136" ry="37" fill="currentColor" opacity=".12"/>${[70, 110, 160, 210, 252].map((x, i) => `<circle class="${active ? 'demo-particle' : ''}" cx="${x}" cy="${35 + (i % 2) * 25}" r="8" fill="currentColor" opacity=".65"/>`).join('')}`;
    else if (id === 'lipidos') drawing = [60, 100, 140, 180, 220, 260].map((x, i) => { const y = active ? 20 : 20 + (i % 2) * 25; return `<circle cx="${x}" cy="${y}" r="9" fill="currentColor" opacity=".25"/><path d="M${x - 4} ${y + 10}v21m8-21v21"/>${phase === 2 ? `<circle cx="${x}" cy="77" r="9" fill="currentColor" opacity=".25"/><path d="M${x - 4} 67V46m8 21V46"/>` : ''}`; }).join('');
    else if (id === 'proteinas') drawing = `<path d="M55 48h210" opacity="${phase === 1 ? .8 : 0}"/>${[55, 107, 160, 212, 265].map((x, i) => `<circle cx="${x}" cy="${phase === 2 ? 48 + (i % 2 ? -20 : 20) : 48}" r="14" fill="currentColor" opacity=".25"/>`).join('')}${phase === 2 ? '<path d="m55 68 52-40 53 40 52-40 53 40"/>' : ''}`;
    else if (id === 'acidos') drawing = `${useIcon('acidos', 20)}${arrows}<path d="M140 30c16 10 16 26 0 36m12-36c16 10 16 26 0 36" opacity="${active ? 1 : .2}"/>${useIcon('proteinas', 235)}`;
    else if (id === 'carbohidratos') drawing = `${useIcon('carbohidratos', 22)}${arrows}<g opacity="${active ? 1 : .2}"><circle cx="160" cy="48" r="24" fill="currentColor" fill-opacity=".1"/><text x="160" y="54" text-anchor="middle" fill="currentColor" stroke="none" font-size="17" font-weight="700">ATP</text></g><g opacity="${phase === 2 ? 1 : .2}">${useIcon('proteinas', 236)}</g>`;
    else if (id === 'vitaminas') drawing = `${useIcon('vitaminas', active ? 95 : 25)}<path d="m170 25 10 9 15-2 5 15-9 10 2 14-15 5-10-9-14 2-5-15 9-10-2-14Z" fill="currentColor" opacity=".15"/>${phase === 2 ? '<path d="m233 47 12 12 25-30" stroke-width="5"/>' : ''}`;
    else drawing = `<path d="M145 8v79m12-79v79" opacity=".4"/>${[55, 105, 215, 267].map((x, i) => `<g class="${active ? 'demo-particle' : ''}"><circle cx="${x}" cy="${i % 2 ? 66 : 30}" r="14" fill="currentColor" opacity=".18"/><path d="M${x - 5} ${i % 2 ? 66 : 30}h10m-5-5v10"/></g>`).join('')}${active ? '<path d="M110 45h90m-8-6 8 6-8 6"/>' : ''}`;
    return `<svg viewBox="0 0 320 96" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
  }

  function showDemo() {
    const item = byId.get(selected);
    const visual = find('[data-demo-visual]');
    visual.innerHTML = demoDrawing(item.id, demoPhase);
    visual.classList.remove('is-animated');
    if (!reducedMotion()) { void visual.offsetWidth; visual.classList.add('is-animated'); }
    find('[data-demo-message]').textContent = item.demo[demoPhase];
    find('[data-demo-step]').textContent = `Paso ${demoPhase + 1} de 3`;
    find('[data-demo-labels]').textContent = item.demoLabels;
    page.querySelectorAll('[data-demo-phase]').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.demoPhase) === demoPhase)));
    find('[data-demo-action]').firstChild.textContent = `${demoPhase === 2 ? 'Repetir demostración' : 'Siguiente paso'} `;
  }

  function discover(id, moveFocus = false) {
    if (!byId.has(id)) return;
    selected = id;
    demoPhase = 0;
    visited.add(id);
    const item = byId.get(id);
    details.style.setProperty('--molecule-color', item.color);
    details.style.setProperty('--molecule-tint', item.tint);
    find('[data-welcome]').hidden = true;
    find('[data-discovery]').hidden = false;
    details.setAttribute('aria-labelledby', 'biomolecula-detalle');
    find('[data-selected-title]').textContent = item.name;
    find('[data-selected-lead]').textContent = item.lead;
    find('[data-detail-memory]').textContent = item.memory;
    find('[data-detail-note]').textContent = item.note;
    find('[data-detail-facts]').replaceChildren(...item.facts.map((text) => { const li = document.createElement('li'); li.textContent = text; return li; }));
    buttons.forEach((button, key) => {
      button.classList.toggle('is-selected', key === id);
      button.classList.toggle('is-visited', visited.has(key));
      button.setAttribute('aria-pressed', String(key === id));
      button.setAttribute('aria-label', `${byId.get(key).name}${visited.has(key) ? '. Explorada.' : ''}`);
    });
    find('[data-discovery-count]').textContent = visited.size === 7 ? '¡Las 7 exploradas!' : `${visited.size} de 7 exploradas`;
    showDemo();
    if (moveFocus) {
      find('[data-selected-title]').focus({ preventScroll: true });
      details.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  }

  BIOMOLECULES.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'molecule-hotspot';
    button.dataset.molecule = item.id;
    const [x, y, mobileX, mobileY] = positions[index];
    for (const [key, value] of Object.entries({ '--x': `${x}%`, '--y': `${y}%`, '--mobile-x': `${mobileX}%`, '--mobile-y': `${mobileY}%`, '--molecule-color': item.color })) button.style.setProperty(key, value);
    button.innerHTML = `${icon(item.id, 'molecule-icon')}<span class="hotspot-label">${item.short}</span><span class="hotspot-visited" aria-hidden="true">✓</span>`;
    button.setAttribute('aria-label', item.name);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', (event) => discover(item.id, event.detail === 0 || window.innerWidth <= 950));
    find('[data-hotspots]').append(button);
    buttons.set(item.id, button);
  });
  find('[data-demo-action]').addEventListener('click', () => { demoPhase = (demoPhase + 1) % 3; showDemo(); });
  page.querySelectorAll('[data-demo-phase]').forEach((button) => button.addEventListener('click', () => { demoPhase = Number(button.dataset.demoPhase); showDemo(); }));
  find('[data-explore-next]').addEventListener('click', () => {
    const next = BIOMOLECULES.find(({ id }) => !visited.has(id)) || BIOMOLECULES[(BIOMOLECULES.findIndex(({ id }) => id === selected) + 1) % 7];
    discover(next.id);
  });

  mountQuiz(find('[data-quiz="biomoleculas"]'), { bank: FUNCTION_BANK, categories: BIOMOLECULES, categoryLabel: 'biomoléculas', studyLink: '#resumen-biomoleculas' });

  const game = find('[data-sorting]');
  const get = (selector) => game.querySelector(selector);
  const generate = createRoundGenerator(SORTING_BANK, BIOMOLECULES);
  let state = createSortingState(generate(), BIOMOLECULES);
  let reviewMode = false;
  let initialFirstTry = null;
  let touchDrag = null;
  let nativeDragging = false;
  const bins = new Map();
  const card = get('[data-sort-card]');
  const feedback = get('[data-sort-feedback]');
  const nextButton = get('[data-sort-next]');
  // Responder al toque corto también en pointerup: algunos navegadores omiten
  // el click de compatibilidad del primer toque después de arrastrar.
  function bindActivation(button, action) {
    let start = null;
    let lastTouch = -Infinity;
    button.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') start = { id: event.pointerId, x: event.clientX, y: event.clientY };
    });
    button.addEventListener('pointermove', (event) => {
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) start = null;
    });
    button.addEventListener('pointercancel', () => { start = null; });
    button.addEventListener('pointerup', (event) => {
      if (!start || start.id !== event.pointerId || button.disabled) return;
      start = null;
      lastTouch = performance.now();
      action({ detail: 1 });
    });
    button.addEventListener('click', (event) => {
      const touchClick = event.pointerType === 'touch' || event.sourceCapabilities?.firesTouchEvents || (!event.pointerType && event.detail > 0);
      if (touchClick && performance.now() - lastTouch < 700) return;
      action(event);
    });
  }
  const clearTargets = () => bins.forEach((button) => button.classList.remove('is-drop-target'));
  function endDrag() {
    nativeDragging = false;
    card.classList.remove('is-dragging');
    clearTargets();
    if (touchDrag) {
      if (touchDrag.frame) cancelAnimationFrame(touchDrag.frame);
      touchDrag.ghost?.remove();
      if (card.hasPointerCapture(touchDrag.pointerId)) card.releasePointerCapture(touchDrag.pointerId);
      touchDrag = null;
    }
  }
  function updateGame() {
    const score = sortingScore(state);
    get('[data-sort-count]').textContent = `${reviewMode ? 'Repaso · ' : ''}Tarjeta ${state.index + 1} de ${score.total}`;
    get('[data-sort-first]').textContent = `${score.firstTry} al primer intento`;
    const meter = get('[data-sort-meter]');
    meter.max = score.total;
    meter.value = score.solved;
    meter.textContent = `${score.solved} de ${score.total}`;
    meter.setAttribute('aria-valuetext', `${score.solved} de ${score.total} tarjetas clasificadas`);
    score.categories.forEach((item) => bins.get(item.id).querySelector('.bin-count').textContent = item.total ? `${item.solved} de ${item.total} clasificadas` : '');
  }
  function showCard(moveFocus = false) {
    endDrag();
    get('[data-sorting-playing]').hidden = false;
    get('[data-sorting-summary]').hidden = true;
    const item = state.round[state.index];
    get('[data-sort-prompt]').textContent = item.prompt;
    card.draggable = true;
    card.classList.remove('is-solved');
    card.querySelector('.card-hint').textContent = 'Arrastra o elige un grupo ↓';
    bins.forEach((button) => { button.disabled = false; button.classList.remove('is-correct', 'is-incorrect'); button.querySelector('.bin-result').textContent = ''; });
    feedback.className = 'sorting-feedback';
    feedback.textContent = 'Cada ejemplo tiene un grupo. Puedes volver a intentar sin prisa.';
    nextButton.disabled = true;
    nextButton.firstChild.textContent = 'Siguiente tarjeta ';
    updateGame();
    if (moveFocus) { get('[data-sort-prompt]').focus({ preventScroll: true }); card.scrollIntoView({ block: 'nearest', behavior: 'instant' }); }
  }
  function resolve(id, keyboard = false) {
    const answer = classifyCard(state, id);
    if (!answer) return;
    const question = state.round[state.index];
    bins.forEach((button) => { button.classList.remove('is-correct', 'is-incorrect'); button.querySelector('.bin-result').textContent = ''; });
    const button = bins.get(id);
    button.classList.add(answer.correct ? 'is-correct' : 'is-incorrect');
    button.querySelector('.bin-result').textContent = answer.correct ? '✅ Correcto' : '❌ Prueba otra';
    feedback.className = `sorting-feedback ${answer.correct ? 'is-correct' : 'is-incorrect'}`;
    feedback.textContent = answer.correct ? `✅ ${byId.get(id).short}. ${question.explanation}` : `❌ Ese ejemplo no corresponde a ${byId.get(id).short.toLowerCase()}. Pista: ${question.hint}`;
    if (answer.correct) {
      card.draggable = false;
      card.classList.add('is-solved');
      card.querySelector('.card-hint').textContent = `✅ Clasificada en ${byId.get(id).short}`;
      bins.forEach((option) => { option.disabled = true; });
      nextButton.disabled = false;
      if (state.index === state.round.length - 1) nextButton.firstChild.textContent = 'Ver resultado ';
      if (keyboard) nextButton.focus({ preventScroll: true });
    }
    updateGame();
  }
  BIOMOLECULES.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'sort-bin'; button.dataset.category = item.id;
    button.style.setProperty('--molecule-color', item.color); button.style.setProperty('--molecule-tint', item.tint);
    button.innerHTML = `${icon(item.id, 'molecule-icon')}<strong>${item.short}</strong><span class="bin-count">0 de 2 clasificadas</span><span class="bin-result"></span>`;
    bindActivation(button, (event) => resolve(item.id, event.detail === 0));
    button.addEventListener('dragover', (event) => { if (!nativeDragging || state.solved) return; event.preventDefault(); event.dataTransfer.dropEffect = 'move'; clearTargets(); button.classList.add('is-drop-target'); });
    button.addEventListener('dragleave', (event) => { if (!button.contains(event.relatedTarget)) button.classList.remove('is-drop-target'); });
    button.addEventListener('drop', (event) => { if (!nativeDragging || event.dataTransfer.getData('text/plain') !== `biomolecula:${state.round[state.index].id}`) return; event.preventDefault(); resolve(item.id); endDrag(); });
    bins.set(item.id, button); get('[data-sort-bins]').append(button);
  });
  card.addEventListener('dragstart', (event) => { if (state.solved) { event.preventDefault(); return; } nativeDragging = true; event.dataTransfer.setData('text/plain', `biomolecula:${state.round[state.index].id}`); event.dataTransfer.effectAllowed = 'move'; card.classList.add('is-dragging'); });
  card.addEventListener('dragend', endDrag);
  card.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' || !event.isPrimary || state.solved) return;
    touchDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: false };
    card.setPointerCapture(event.pointerId);
  });
  function paintTouchDrag() {
    if (!touchDrag?.active) return;
    touchDrag.ghost.style.left = `${touchDrag.clientX}px`;
    touchDrag.ghost.style.top = `${touchDrag.clientY}px`;
    clearTargets();
    const target = document.elementFromPoint(touchDrag.clientX, touchDrag.clientY)?.closest('[data-category]');
    if (target && game.contains(target)) target.classList.add('is-drop-target');
  }
  function scrollWhileDragging() {
    if (!touchDrag?.active) return;
    touchDrag.frame = null;
    const edge = 70;
    const delta = touchDrag.clientY > innerHeight - edge ? 10 : touchDrag.clientY < edge ? -10 : 0;
    if (!delta) return;
    const before = scrollY;
    window.scrollTo({ top: scrollY + delta, behavior: 'instant' });
    paintTouchDrag();
    if (scrollY !== before) touchDrag.frame = requestAnimationFrame(scrollWhileDragging);
  }
  card.addEventListener('pointermove', (event) => {
    if (!touchDrag || touchDrag.pointerId !== event.pointerId) return;
    if (!touchDrag.active && Math.hypot(event.clientX - touchDrag.x, event.clientY - touchDrag.y) < 9) return;
    if (!touchDrag.active) {
      touchDrag.active = true; card.classList.add('is-dragging');
      const ghost = document.createElement('div'); ghost.className = 'biomolecule-drag-ghost'; ghost.setAttribute('aria-hidden', 'true'); ghost.textContent = state.round[state.index].prompt; document.body.append(ghost); touchDrag.ghost = ghost;
    }
    touchDrag.clientX = event.clientX; touchDrag.clientY = event.clientY;
    paintTouchDrag();
    if (!touchDrag.frame) touchDrag.frame = requestAnimationFrame(scrollWhileDragging);
  });
  card.addEventListener('pointerup', (event) => {
    if (!touchDrag || touchDrag.pointerId !== event.pointerId) return;
    if (touchDrag.active) { const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-category]'); if (target && game.contains(target)) resolve(target.dataset.category); }
    endDrag();
  });
  // El arrastre HTML nativo cancela el puntero del ratón; conserva su estado hasta drop/dragend.
  card.addEventListener('pointercancel', () => { if (touchDrag) endDrag(); });
  window.addEventListener('blur', endDrag);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') endDrag(); });
  function showGameSummary() {
    endDrag(); get('[data-sorting-playing]').hidden = true; get('[data-sorting-summary]').hidden = false;
    const score = sortingScore(state);
    const detail = document.createElement('span'); detail.textContent = `${score.firstTry} de ${score.total} al primer intento${score.firstTry < score.total ? ' · las demás se corrigieron con pistas' : ' · sin necesitar pistas'}`;
    get('[data-sort-final]').replaceChildren(document.createTextNode(`${score.solved} / ${score.total}`), detail);
    get('[data-sort-summary-message]').textContent = score.firstTry === score.total ? '¡Todas las conexiones al primer intento! Prueba ejemplos diferentes en otra ronda.' : '¡Organizaste todas las tarjetas! Las pistas te ayudaron a construir conexiones. Prueba otra ronda para reforzarlas.';
    get('[data-sort-summary-title]').textContent = reviewMode ? 'Repaso completado' : '¡Todo en su lugar!';
    get('[data-sort-initial]').hidden = !reviewMode;
    get('[data-sort-initial]').textContent = reviewMode ? `Ronda inicial: ${initialFirstTry.firstTry} de ${initialFirstTry.total} al primer intento. Este repaso no cambia ese resultado.` : '';
    const difficult = state.records.filter(({ firstTry }) => !firstTry);
    get('[data-sort-errors]').hidden = !difficult.length;
    get('[data-sort-errors]').textContent = `Repasar tarjetas difíciles (${difficult.length})`;
    const review = score.categories.filter((item) => item.firstTry < item.total);
    get('[data-sort-review]').hidden = !review.length;
    get('[data-sort-review-list]').replaceChildren(...review.map((item) => { const li = document.createElement('li'); const name = document.createElement('strong'); name.textContent = item.short; const count = document.createElement('span'); count.textContent = `${item.firstTry} de ${item.total} al primer intento`; li.append(name, count); return li; }));
    get('[data-sort-summary-title]').focus({ preventScroll: true }); get('[data-sort-summary-title]').scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
  bindActivation(nextButton, () => { if (!advanceSorting(state)) return; if (state.finished) showGameSummary(); else showCard(true); });
  bindActivation(get('[data-sort-errors]'), () => {
    if (!state.finished) return;
    const missed = new Set(state.records.filter(({ firstTry }) => !firstTry).map(({ id }) => id));
    if (!missed.size) return;
    const round = shuffle(state.round.filter(({ id }) => missed.has(id)));
    if (!reviewMode) initialFirstTry = sortingScore(state);
    reviewMode = true;
    endDrag(); state = createSortingState(round, BIOMOLECULES); showCard(true);
  });
  const resetGame = () => { endDrag(); reviewMode = false; initialFirstTry = null; state = createSortingState(generate(), BIOMOLECULES); showCard(true); };
  bindActivation(get('[data-sort-reset]'), resetGame);
  bindActivation(get('[data-sort-retry]'), resetGame);
  showCard();
}
