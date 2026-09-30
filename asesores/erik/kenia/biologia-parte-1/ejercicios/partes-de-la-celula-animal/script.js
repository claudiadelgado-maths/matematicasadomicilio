(() => {
  const activity = document.querySelector('[data-cell-activity]');
  if (!activity) return;

  // Puntos sobre el tablero 960 × 850. El SVG 680 × 820 se sitúa en (270, 15).
  const structures = [
    { id: 1, name: 'Membrana plasmática', clue: 'Borde turquesa que rodea toda la célula.', point: [560, 50] },
    { id: 2, name: 'Citoplasma', clue: 'Zona azul clara del interior, entre las estructuras.', point: [415, 165] },
    { id: 3, name: 'Núcleo', clue: 'Gran cuerpo rosado con doble contorno, en la mitad superior.', point: [590, 248] },
    { id: 4, name: 'Nucléolo', clue: 'Círculo amarillo dentro del gran cuerpo rosado.', point: [690, 303] },
    { id: 5, name: 'Retículo endoplasmático', clue: 'Red de membranas verdes plegadas junto al cuerpo rosado.', point: [469, 365] },
    { id: 6, name: 'Ribosomas', clue: 'Grupo de pequeños puntos violetas libres, a la izquierda.', point: [412, 438] },
    { id: 7, name: 'Aparato de Golgi', clue: 'Pila de sacos curvos anaranjados, en la mitad derecha.', point: [700, 488] },
    { id: 8, name: 'Mitocondria', clue: 'Cuerpo ovalado coral con pliegues amarillos, abajo a la izquierda.', point: [508, 563] },
    { id: 9, name: 'Citoesqueleto', clue: 'Filamentos dorados alargados, en la zona inferior izquierda.', point: [401, 636] },
    { id: 10, name: 'Centriolo', clue: 'Uno de los dos cilindros azules estriados, abajo a la derecha.', point: [720, 697] },
    { id: 11, name: 'Peroxisoma', clue: 'Esfera verde clara con puntos en su interior, cerca del borde inferior.', point: [538, 751] }
  ];
  const byId = new Map(structures.map((structure) => [structure.id, structure]));
  const spaces = activity.querySelector('[data-spaces]');
  const cards = activity.querySelector('[data-cards]');
  const callouts = activity.querySelector('[data-callouts]');
  const selectionMessage = activity.querySelector('[data-selection]');
  const scoreMessage = activity.querySelector('[data-score]');
  const feedbackMessage = activity.querySelector('[data-feedback]');
  const spaceButtons = new Map();
  const cardButtons = new Map();
  const answers = new Map();
  let selected = null;
  const errorTimers = new Map();
  let highlighted = null;
  let cardOrder = [];
  let dragged = null;
  let touchDrag = null;
  let suppressClick = false;

  const svgElement = (tag, attributes) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  };

  structures.forEach((structure) => {
    const { id, point: [x, y] } = structure;
    const mx = x - 43;
    const my = y - 9;
    const top = 65 + (id - 1) * 72;
    const guide = svgElement('g', { 'data-marker': id, 'aria-hidden': 'true' });
    const line = `M220 ${top}H248L${mx} ${my}`;
    guide.append(svgElement('path', { d: line, class: 'leader-halo desktop-leader' }));
    guide.append(svgElement('path', { d: line, class: 'leader-line desktop-leader' }));
    guide.append(svgElement('path', { d: `M${mx} ${my}L${x} ${y}`, class: 'leader-halo' }));
    guide.append(svgElement('path', { d: `M${mx} ${my}L${x} ${y}`, class: 'leader-line' }));
    guide.append(svgElement('circle', { cx: x, cy: y, r: 7, class: 'target-dot' }));
    guide.append(svgElement('circle', { cx: mx, cy: my, r: 17, class: 'marker-circle' }));
    const number = svgElement('text', { x: mx, y: my, class: 'marker-number' });
    number.textContent = id;
    guide.append(number);
    callouts.append(guide);

    const item = document.createElement('li');
    item.style.setProperty('--slot-top', `${top / 850 * 100}%`);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-space';
    button.dataset.space = id;
    button.innerHTML = `<span class="space-number" aria-hidden="true">${id}</span><span class="space-name">Coloca aquí</span><span class="space-status" aria-hidden="true"></span>`;
    const clue = document.createElement('span');
    clue.id = `forma-${id}`;
    clue.className = 'visually-hidden';
    clue.textContent = structure.clue;
    button.setAttribute('aria-describedby', clue.id);
    item.append(button, clue);
    spaces.append(item);
    spaceButtons.set(id, button);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'organelle-card';
    card.dataset.card = id;
    card.draggable = true;
    card.innerHTML = '<span class="card-grip" aria-hidden="true">⠿</span><span class="card-name"></span><span class="card-place" aria-hidden="true"></span>';
    card.querySelector('.card-name').textContent = structure.name;
    cardButtons.set(id, card);
  });

  const mixCards = () => {
    const previous = cardOrder.join(',');
    cardOrder = structures.map(({ id }) => id);
    for (let index = cardOrder.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [cardOrder[index], cardOrder[other]] = [cardOrder[other], cardOrder[index]];
    }
    while (cardOrder.join(',') === previous || cardOrder.every((id, index) => id === index + 1)) {
      cardOrder.push(cardOrder.shift());
    }
    cards.append(...cardOrder.map((id) => cardButtons.get(id)));
  };

  const render = () => {
    activity.classList.toggle('has-selection', selected !== null || dragged !== null || Boolean(touchDrag?.active));
    const correctCount = structures.filter(({ id }) => answers.get(id) === id).length;
    activity.querySelector('[data-progress]').textContent = `${correctCount} de 11 correctas`;
    activity.querySelector('[data-meter]').value = correctCount;
    scoreMessage.textContent = `${correctCount} / 11 correctas`;
    spaceButtons.forEach((button, id) => {
      const answer = answers.get(id);
      const name = byId.get(answer)?.name;
      const correct = answer === id;
      const incorrect = Boolean(answer) && !correct;
      button.querySelector('.space-name').textContent = name || 'Coloca aquí';
      button.querySelector('.space-status').textContent = correct ? '✓' : errorTimers.has(id) ? '×' : '';
      button.classList.toggle('has-answer', Boolean(answer));
      button.classList.toggle('is-correct', correct);
      button.classList.toggle('is-incorrect', incorrect);
      button.classList.toggle('is-error-flash', errorTimers.has(id));
      button.setAttribute('aria-invalid', String(incorrect));
      button.draggable = Boolean(answer);
      const result = answer ? (correct ? ' Correcta.' : ' Incorrecta. Inténtalo de nuevo.') : '';
      button.setAttribute('aria-label', `Espacio ${id}: ${name || 'vacío'}.${result} ${name ? 'Pulsa para retirar o coloca otra tarjeta.' : 'Pulsa para colocar la tarjeta seleccionada.'}`);
    });
    cardButtons.forEach((button, id) => {
      const placed = [...answers].find(([, answer]) => answer === id)?.[0];
      button.classList.toggle('is-selected', selected === id);
      button.classList.toggle('is-placed', Boolean(placed));
      button.setAttribute('aria-pressed', String(selected === id));
      button.querySelector('.card-place').textContent = placed || '';
      button.setAttribute('aria-label', `${byId.get(id).name}${placed ? `. En el espacio ${placed}` : ''}. ${selected === id ? 'Seleccionada; pulsa para cancelar.' : 'Pulsa para seleccionar.'}`);
    });
  };

  const clearError = (id) => {
    window.clearTimeout(errorTimers.get(id));
    errorTimers.delete(id);
  };

  const flashError = (id) => {
    clearError(id);
    errorTimers.set(id, window.setTimeout(() => {
      errorTimers.delete(id);
      render();
    }, 1200));
  };

  const highlight = (id) => {
    highlighted = byId.has(id) ? id : null;
    callouts.classList.toggle('is-tracing', highlighted !== null);
    callouts.querySelectorAll('[data-marker]').forEach((guide) => guide.classList.toggle('is-highlighted', Number(guide.dataset.marker) === highlighted));
    spaceButtons.forEach((button, number) => button.classList.toggle('is-highlighted', number === highlighted));
    activity.querySelector('.diagram-hint').textContent = highlighted
      ? `Espacio ${highlighted}: ${byId.get(highlighted).clue}`
      : 'Señala una casilla para resaltar su recorrido.';
  };

  const place = (cardId, spaceId) => {
    if (!byId.has(cardId) || !byId.has(spaceId)) return;
    // Cada tarjeta ocupa un solo espacio. Una tarjeta reemplazada vuelve a estar disponible.
    for (const [id, answer] of answers) {
      if (answer === cardId) { answers.delete(id); clearError(id); }
    }
    clearError(spaceId);
    answers.set(spaceId, cardId);
    selected = null;
    const correct = cardId === spaceId;
    if (!correct) flashError(spaceId);
    selectionMessage.textContent = `${correct ? '¡Correcto!' : 'Aún no.'} ${byId.get(cardId).name} en el espacio ${spaceId}. ${correct ? 'Continúa con otra estructura.' : 'Sigue la línea y prueba con otra tarjeta.'}`;
    feedbackMessage.textContent = structures.every(({ id }) => answers.get(id) === id)
      ? '¡Muy bien! Identificaste las once estructuras de la célula animal.'
      : correct ? '¡Vas bien! Las respuestas correctas se quedan en verde.' : `Revisa el espacio ${spaceId}. ${byId.get(spaceId).clue}`;
    highlight(spaceId);
    render();
  };

  const clearDropTargets = () => spaceButtons.forEach((button) => button.classList.remove('is-drop-target'));
  const endNativeDrag = () => {
    dragged = null;
    activity.querySelectorAll('.is-dragging').forEach((button) => button.classList.remove('is-dragging'));
    clearDropTargets();
    render();
  };

  cards.addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; return; }
    const button = event.target.closest('[data-card]');
    if (!button) return;
    const id = Number(button.dataset.card);
    selected = selected === id ? null : id;
    selectionMessage.textContent = selected ? `${byId.get(id).name} seleccionada. Elige un espacio numerado.` : 'Selección cancelada. Elige otra tarjeta.';
    render();
    if (selected && event.detail === 0) {
      const next = structures.find(({ id: number }) => !answers.has(number)) || structures[0];
      spaceButtons.get(next.id).focus();
    }
  });

  spaces.addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; return; }
    const button = event.target.closest('[data-space]');
    if (!button) return;
    const id = Number(button.dataset.space);
    if (selected !== null) {
      place(selected, id);
    } else if (answers.has(id)) {
      const cardId = answers.get(id);
      clearError(id);
      answers.delete(id);
      selected = cardId;
      selectionMessage.textContent = `${byId.get(cardId).name} retirada y seleccionada. Elige otro espacio.`;
      feedbackMessage.textContent = 'Coloca la tarjeta seleccionada en otro espacio o elige un nombre diferente.';
      render();
    } else {
      selectionMessage.textContent = 'Primero selecciona una tarjeta y después elige un espacio.';
    }
  });

  activity.addEventListener('dragstart', (event) => {
    const button = event.target.closest('[data-card], [data-space]');
    const cardId = button?.dataset.card ? Number(button.dataset.card) : answers.get(Number(button?.dataset.space));
    if (!byId.has(cardId)) { event.preventDefault(); return; }
    dragged = cardId;
    event.dataTransfer.setData('text/plain', `celula-animal:${cardId}`);
    event.dataTransfer.effectAllowed = 'move';
    button.classList.add('is-dragging');
    render();
  });
  activity.addEventListener('dragend', endNativeDrag);
  spaceButtons.forEach((button, id) => {
    button.addEventListener('pointerenter', () => highlight(id));
    button.addEventListener('pointerleave', () => highlight(Number(document.activeElement?.dataset.space)));
    button.addEventListener('focus', () => highlight(id));
    button.addEventListener('blur', () => highlight(null));
    button.addEventListener('dragover', (event) => {
      if (dragged === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      clearDropTargets();
      button.classList.add('is-drop-target');
      highlight(id);
    });
    button.addEventListener('dragleave', (event) => {
      if (!button.contains(event.relatedTarget)) button.classList.remove('is-drop-target');
    });
    button.addEventListener('drop', (event) => {
      event.preventDefault();
      const match = /^celula-animal:(\d+)$/.exec(event.dataTransfer.getData('text/plain'));
      if (dragged !== null && match && Number(match[1]) === dragged) place(dragged, id);
      endNativeDrag();
    });
  });

  // Arrastre táctil/pen complementario al gesto de seleccionar y tocar; el ratón usa HTML DnD.
  const stopTouchDrag = () => {
    if (!touchDrag) return;
    touchDrag.ghost?.remove();
    touchDrag.button.classList.remove('is-dragging');
    if (touchDrag.button.hasPointerCapture(touchDrag.pointerId)) touchDrag.button.releasePointerCapture(touchDrag.pointerId);
    touchDrag = null;
    clearDropTargets();
    render();
  };
  activity.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' || !event.isPrimary) return;
    const button = event.target.closest('[data-card], [data-space]');
    const id = button?.dataset.card ? Number(button.dataset.card) : answers.get(Number(button?.dataset.space));
    if (!byId.has(id)) return;
    suppressClick = false;
    touchDrag = { button, id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: false };
    button.setPointerCapture(event.pointerId);
  });
  activity.addEventListener('pointermove', (event) => {
    if (!touchDrag || touchDrag.pointerId !== event.pointerId) return;
    if (!touchDrag.active && Math.hypot(event.clientX - touchDrag.x, event.clientY - touchDrag.y) < 9) return;
    if (!touchDrag.active) {
      touchDrag.active = true;
      const ghost = document.createElement('div');
      ghost.className = 'cell-drag-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      ghost.textContent = byId.get(touchDrag.id).name;
      document.body.append(ghost);
      touchDrag.ghost = ghost;
      touchDrag.button.classList.add('is-dragging');
      render();
    }
    touchDrag.ghost.style.left = `${event.clientX}px`;
    touchDrag.ghost.style.top = `${event.clientY}px`;
    clearDropTargets();
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-space]');
    target?.classList.add('is-drop-target');
    if (target) highlight(Number(target.dataset.space));
  });
  activity.addEventListener('pointerup', (event) => {
    if (!touchDrag || touchDrag.pointerId !== event.pointerId) return;
    if (touchDrag.active) {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-space]');
      if (target && spaces.contains(target)) place(touchDrag.id, Number(target.dataset.space));
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 0);
    }
    stopTouchDrag();
  });
  activity.addEventListener('pointercancel', stopTouchDrag);
  window.addEventListener('blur', () => { stopTouchDrag(); endNativeDrag(); });

  activity.querySelector('[data-check]').addEventListener('click', () => {
    const correct = structures.filter(({ id }) => answers.get(id) === id).length;
    structures.forEach(({ id }) => { if (answers.has(id) && answers.get(id) !== id) flashError(id); });
    feedbackMessage.textContent = correct === 11
      ? '¡Muy bien! Identificaste todas las estructuras de la célula animal.'
      : answers.size < 11
        ? `Quedan ${11 - answers.size} espacios vacíos. Completa las casillas y corrige las respuestas en rojo.`
        : 'Corrige las respuestas en rojo. Cada cambio se revisa al instante.';
    render();
  });
  activity.querySelector('[data-reset]').addEventListener('click', () => {
    stopTouchDrag();
    endNativeDrag();
    answers.clear();
    selected = null;
    for (const id of errorTimers.keys()) clearError(id);
    highlight(null);
    suppressClick = false;
    mixCards();
    selectionMessage.textContent = 'Actividad reiniciada. Las tarjetas se han mezclado de nuevo.';
    feedbackMessage.textContent = 'Cada respuesta se revisa al colocarla. Puedes intentarlo de nuevo.';
    render();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    selected = null;
    stopTouchDrag();
    endNativeDrag();
    highlight(null);
    selectionMessage.textContent = 'Selección cancelada. Elige otra tarjeta.';
    render();
  });

  mixCards();
  render();
})();
