import { descomponer, valorBilletes, cambioBilletes } from './matematicas.mjs';
import { $, nombres, singular, letras, celebrar, casi, reducido } from './visuales.mjs';

export function iniciarBilletes(voice) {
  const games = {
    forma: { target: 347, digits: [7, 4, 3], placed: [false, false, false], solved: false },
    elige: { target: 347, selected: [null, null, null], solved: false },
    cambio: { a: 7, b: 6, order: 0, selected: {}, solved: false }
  };
  let pickerReturn = null, activeGame = null;
  const quantity = (digit, order) => `${digit === 1 ? (order === 3 ? 'Un' : 'Una') : digit} ${digit === 1 ? singular[order] : nombres[order]}`;
  function say(game, text) {
    if (game === activeGame) voice.say(text);
  }
  function readProof(game, proof) {
    return proof.replace(/\+/g, 'más').replace(/=/g, game === 'cambio' ? 'equivalen a' : 'es igual a')
      .replace(/\b1 (unidad|decena|centena)\b/g, 'una $1').replace(/\b1 millar\b/g, 'un millar');
  }
  function present(game) {
    const state = games[game];
    if (state.solved) { say(game, `¡Lo has conseguido! ${readProof(game, state.proof)}`); return; }
    const text = game === 'forma' ? '¡Vamos a construir! Guarda los tres billetes. ¿Qué número forman?'
      : game === 'elige' ? `¡Preparamos un regalo! Elige los billetes para formar ${state.target}.`
        : `Tienes ${quantity(state.a, state.order)} y ${quantity(state.b, state.order)}. Cámbialos por billetes del mismo valor.`;
    say(game, text);
  }
  function readBill(game, digit, order) {
    say(game, digit === 0 ? `Sin billete de ${nombres[order]}.`
      : `Billete de ${digit * 10 ** order}. ${quantity(digit, order)}.`);
  }
  document.querySelectorAll('[data-legend]').forEach(legend => {
    legend.setAttribute('aria-label', 'Colores del valor posicional');
    [2, 1, 0, 3].forEach(p => {
      const item = document.createElement('span');
      item.dataset.position = p;
      item.textContent = `${letras[p]} · ${singular[p]}`;
      legend.append(item);
    });
  });
  function ticket(digit, order, button = false) {
    const element = document.createElement(button ? 'button' : 'div');
    if (button) element.type = 'button';
    element.className = 'ticket';
    element.dataset.position = order;
    const small = document.createElement('small');
    small.textContent = digit === 0 ? `Sin ${nombres[order]}` : `${digit} ${digit === 1 ? singular[order] : nombres[order]}`;
    const strong = document.createElement('strong');
    strong.textContent = digit === 0 ? '—' : digit * 10 ** order;
    const star = document.createElement('span');
    star.textContent = '✦';
    star.setAttribute('aria-hidden', 'true');
    element.append(small, strong, star);
    return element;
  }
  function fly(source, destination) {
    if (reducido()) return;
    const a = source.getBoundingClientRect(), b = destination.getBoundingClientRect();
    const clone = source.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.add('flying-ticket');
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    clone.style.cssText = `position:fixed;left:${a.x}px;top:${a.y}px;width:${a.width}px;height:${a.height}px;pointer-events:none;z-index:5`;
    $('contenido').append(clone);
    clone.animate([{ transform: 'translate(0,0) rotate(-5deg)', opacity: 1 },
      { transform: `translate(${b.x - a.x}px,${b.y - a.y}px) rotate(5deg)`, opacity: .2 }], { duration: 380, easing: 'ease-out' }).finished.finally(() => clone.remove());
  }
  function pocket(order, selected, handler, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pocket';
    button.dataset.position = order;
    const title = document.createElement('span');
    title.textContent = `${letras[order]} · ${nombres[order]}`;
    button.append(title);
    if (selected === null) {
      const hint = document.createElement('strong');
      hint.textContent = '+ Elegir';
      button.append(hint);
    } else button.append(ticket(selected, order));
    button.setAttribute('aria-label', `${nombres[order]}: ${selected === null ? 'elegir billete' : selected === 0 ? 'sin billete' : selected * 10 ** order}`);
    button.disabled = disabled;
    button.addEventListener('click', () => handler(button));
    return button;
  }
  function clearResult(game, text) {
    $(game + '-status').textContent = text;
    $(game + '-proof').hidden = true;
    $(game + '-lab').classList.remove('delivered');
  }
  function success(game, proof) {
    games[game].solved = true;
    games[game].proof = proof;
    $(game + '-status').textContent = '¡Bieeen! ¡Lo has conseguido! 🌟';
    $(game + '-proof').textContent = proof;
    $(game + '-proof').hidden = false;
    $(game + '-lab').classList.add('delivered');
    celebrar($(game + '-lab'), game);
    render(game);
    $(game + '-new').focus({ preventScroll: true });
    say(game, `¡Genial! ¡Lo has conseguido! ${readProof(game, proof)}`);
  }
  function wrong(game, message = 'Vuelve a intentarlo 👀') {
    $(game + '-status').textContent = message;
    casi($(game + '-pockets'));
    say(game, message.replace('👀', '').trim());
  }
  function renderForma() {
    const state = games.forma;
    $('forma-bank').replaceChildren();
    $('forma-pockets').replaceChildren();
    [2, 1, 0].forEach(order => {
      const bill = ticket(state.digits[order], order, true);
      bill.disabled = state.placed[order] || state.solved;
      if (state.placed[order]) bill.classList.add('stored');
      const slot = pocket(order, state.placed[order] ? state.digits[order] : null, () => {
        state.placed[order] = !state.placed[order];
        renderForma();
        $('forma-pockets').querySelector(`[data-position="${order}"]`).focus();
        if (state.placed[order]) readBill('forma', state.digits[order], order);
        else say('forma', `Devolvemos el billete de ${state.digits[order] * 10 ** order}.`);
      }, state.solved);
      // En Forma no se elige un valor nuevo: tocar el bolsillo coloca o devuelve su billete.
      slot.setAttribute('aria-label', `${state.placed[order] ? 'Devolver' : 'Guardar'} billete de ${state.digits[order] * 10 ** order}`);
      if (!state.placed[order]) slot.querySelector('strong').textContent = '↓ Guardar';
      bill.addEventListener('click', () => {
        fly(bill, slot);
        state.placed[order] = true;
        renderForma();
        $('forma-status').textContent = state.placed.every(Boolean) ? '¡En su sitio! ¿Qué número forman?' : '¡Uno más en su bolsillo!';
        ($('forma-bank').querySelector('button:not(:disabled)') || $('forma-answer')).focus({ preventScroll: true });
        say('forma', `Guardamos ${state.digits[order] * 10 ** order}. ${quantity(state.digits[order], order)}.${state.placed.every(Boolean) ? ' ¿Qué número forman?' : ''}`);
      });
      $('forma-bank').append(bill);
      $('forma-pockets').append(slot);
    });
    $('forma-answer').disabled = state.solved;
    $('forma-form').querySelector('button').disabled = state.solved;
  }
  function closePicker() {
    voice.cancel();
    $('bill-picker').close();
    pickerReturn?.focus();
  }
  function chooseBill(game, order, trigger) {
    if (games[game].solved) return;
    pickerReturn = trigger;
    $('picker-title').textContent = `Elige ${nombres[order]}`;
    $('picker-options').replaceChildren();
    // Cero significa explícitamente que no se entrega un billete de ese orden.
    for (let digit = game === 'cambio' ? 0 : 1; digit <= (order === 4 ? 1 : 9); digit += 1) {
      const bill = ticket(digit, order, true);
      bill.addEventListener('click', () => {
        games[game].selected[order] = digit;
        $('bill-picker').close();
        render(game);
        $(game + '-pockets').querySelector(`[data-position="${order}"]`).focus();
        $(game + '-status').textContent = 'Billete preparado. Puedes cambiarlo si quieres.';
        readBill(game, digit, order);
      });
      $('picker-options').append(bill);
    }
    $('bill-picker').showModal();
    $('picker-options').querySelector('button').focus();
    say(game, `Elige un billete de ${nombres[order]}.`);
  }
  function renderElige() {
    const state = games.elige;
    $('elige-target').textContent = state.target;
    $('elige-pockets').replaceChildren();
    [2, 1, 0].forEach(order => $('elige-pockets').append(pocket(order, state.selected[order], b => chooseBill('elige', order, b), state.solved)));
    $('elige-deliver').disabled = state.solved;
  }
  function renderCambio() {
    const state = games.cambio;
    $('cambio-bank').replaceChildren(ticket(state.a, state.order), ticket(state.b, state.order));
    $('cambio-pockets').replaceChildren();
    const orders = [state.order + 1, state.order];
    orders.forEach(order => $('cambio-pockets').append(pocket(order, state.selected[order] ?? null, b => chooseBill('cambio', order, b), state.solved)));
    $('cambio-deliver').disabled = state.solved;
  }
  function render(game) {
    ({ forma: renderForma, elige: renderElige, cambio: renderCambio })[game]();
  }
  function nextNumber(previous) {
    const digits = Array.from({ length: 3 }, () => 1 + Math.floor(Math.random() * 9));
    if (valorBilletes(digits) === previous) digits[0] = digits[0] % 9 + 1;
    return valorBilletes(digits);
  }
  function next(game) {
    const state = games[game];
    state.solved = false;
    if (game === 'forma') {
      state.target = nextNumber(state.target);
      state.digits = descomponer(state.target);
      state.placed = [false, false, false];
      $('forma-answer').value = '';
    } else if (game === 'elige') {
      state.target = nextNumber(state.target);
      state.selected = [null, null, null];
    } else {
      const previous = `${state.a},${state.b}`;
      state.a = 1 + Math.floor(Math.random() * 9);
      state.b = 1 + Math.floor(Math.random() * 9);
      if (`${state.a},${state.b}` === previous) state.b = state.b % 9 + 1;
      state.selected = {};
    }
    clearResult(game, game === 'forma' ? 'Toca los billetes y descubre el número.' : '¡Vamos con uno nuevo!');
    render(game);
    present(game);
  }
  $('forma-answer').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3); });
  $('forma-form').addEventListener('submit', e => {
    e.preventDefault();
    const state = games.forma;
    if (state.solved) return;
    if (!state.placed.every(Boolean)) { wrong('forma', 'Guarda primero los tres billetes.'); return; }
    if (Number($('forma-answer').value) !== state.target) { wrong('forma'); $('forma-answer').select(); return; }
    success('forma', `${state.digits[2] * 100} + ${state.digits[1] * 10} + ${state.digits[0]} = ${state.target}`);
  });
  $('elige-deliver').addEventListener('click', () => {
    const state = games.elige;
    if (state.solved) return;
    if (state.selected.some(x => x === null)) { wrong('elige', 'Elige un billete para cada bolsillo.'); return; }
    if (valorBilletes(state.selected) !== state.target) { wrong('elige'); return; }
    success('elige', `${state.selected[2] * 100} + ${state.selected[1] * 10} + ${state.selected[0]} = ${state.target}`);
  });
  $('cambio-deliver').addEventListener('click', () => {
    const state = games.cambio;
    if (state.solved) return;
    const expected = cambioBilletes(state.a, state.b, state.order);
    if (state.selected[state.order] !== expected.resto || state.selected[state.order + 1] !== expected.superior) {
      wrong('cambio', 'Casi. Mira bien el valor 👀'); return;
    }
    success('cambio', `${state.a + state.b} ${nombres[state.order]} = ${expected.superior ? `1 ${singular[state.order + 1]}${expected.resto ? ' + ' : ''}` : ''}${expected.resto ? `${expected.resto} ${expected.resto === 1 ? singular[state.order] : nombres[state.order]}` : ''}. Mismo valor: ${expected.total}.`);
    if (expected.superior) {
      const grouping = document.createElement('div');
      grouping.className = 'regrouping';
      grouping.setAttribute('aria-label', `Agrupamos diez ${nombres[state.order]} en 1 ${singular[state.order + 1]}`);
      const bundle = document.createElement('span');
      bundle.className = 'bundle';
      bundle.dataset.position = state.order;
      for (let i = 0; i < 10; i += 1) {
        const dot = document.createElement('i');
        dot.setAttribute('aria-hidden', 'true');
        bundle.append(dot);
      }
      const arrow = document.createElement('span');
      arrow.textContent = '→';
      grouping.append(bundle, arrow, ticket(1, state.order + 1));
      $('cambio-proof').append(grouping);
    }
  });
  $('cambio-order').addEventListener('change', () => {
    games.cambio.order = Number($('cambio-order').value);
    games.cambio.a = games.cambio.b = 0;
    next('cambio');
  });
  Object.keys(games).forEach(game => { $(game + '-new').addEventListener('click', () => next(game)); render(game); });
  $('picker-close').addEventListener('click', closePicker);
  $('bill-picker').addEventListener('cancel', e => { e.preventDefault(); closePicker(); });
  return {
    enter: game => { activeGame = game; present(game); },
    leave: () => { activeGame = null; voice.cancel(); },
    repeat: () => { if (activeGame) present(activeGame); }
  };
}
