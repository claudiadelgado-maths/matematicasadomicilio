import { $ } from './visuales.mjs';
import { iniciarSaltitos } from './saltitos.mjs';
import { iniciarSumas } from './sumas.mjs';
import { iniciarBilletes } from './billetes.mjs';
import { iniciarCalculadora } from './calculadora.mjs';
import { crearVoz } from './voz.mjs';

// Una sola sesión, con estado en memoria y los mismos recursos de navegación.
const root = document.querySelector('.sumas');
if (root) {
  const voice = crearVoz($('sound'), $('voice-choice'), $('voice-info'));
  $('repeat-prompt').disabled = !voice.available;
  const saltitos = iniciarSaltitos(voice);
  iniciarSumas();
  const billetes = iniciarBilletes(voice);
  iniciarCalculadora();
  let current = null, stars = 0;
  const titles = { saltitos: '🐰 Saltitos', forma: '💸 Forma el número', elige: '🎁 Elige los billetes',
    cambio: '🔄 Cambio de billetes', sumas: '➕ Sumas verticales', calculadora: '🧮 Paso a paso' };
  const cards = root.querySelectorAll('[data-open]');
  const panels = root.querySelectorAll('[data-game]');
  function open(game) {
    if (current === 'saltitos') saltitos.leave();
    billetes.leave();
    voice.cancel();
    current = game;
    panels.forEach(panel => { panel.hidden = panel.dataset.game !== game; });
    $('game-menu').hidden = true;
    $('game-navigation').hidden = false;
    const isBillGame = ['forma', 'elige', 'cambio'].includes(game);
    $('voice-controls').hidden = game !== 'saltitos' && !isBillGame;
    $('repeat-prompt').hidden = !isBillGame;
    $('current-game').textContent = titles[game];
    root.classList.add('playing');
    const title = root.querySelector(`[data-game="${game}"] h2`);
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    $('game-navigation').scrollIntoView({ block: 'start' });
    if (game === 'saltitos') saltitos.enter();
    if (isBillGame) billetes.enter(game);
  }
  cards.forEach(card => card.addEventListener('click', () => open(card.dataset.open)));
  $('back-menu').addEventListener('click', () => {
    if (current === 'saltitos') saltitos.leave();
    billetes.leave();
    voice.cancel();
    panels.forEach(panel => { panel.hidden = true; });
    $('game-menu').hidden = false;
    $('game-navigation').hidden = true;
    $('voice-controls').hidden = true;
    root.classList.remove('playing');
    root.querySelector(`[data-open="${current}"]`)?.focus();
    current = null;
  });
  $('repeat-prompt').addEventListener('click', () => billetes.repeat());
  document.addEventListener('descubrimiento', e => {
    stars += 1;
    $('session-stars').textContent = `⭐ ${stars}`;
    $('session-stars').setAttribute('aria-label', `${stars} descubrimientos completados`);
    const card = root.querySelector(`[data-open="${e.detail}"]`);
    card.classList.add('discovered');
    card.querySelector('small').textContent = '⭐ ¡Descubierto! Volver a jugar →';
  });
}
