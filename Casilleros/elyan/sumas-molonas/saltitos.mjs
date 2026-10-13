import { $, reducido, celebrar } from './visuales.mjs';

export function iniciarSaltitos(voice) {
  const root = $('number-lab');
  const words = ['', 'Un salto.', 'Dos saltos.', 'Tres saltos.', 'Cuatro saltos.', 'Cinco saltos.', 'Seis saltos.', 'Siete saltos.', 'Ocho saltos.', 'Nueve saltos.'];
  let start = 3, jumps = 4, position = 3, run = 0, busy = false, animation;
  let challenge = false, solved = false, destination = null, animal = '🐰';
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function place(scroll = false) {
    const width = $('track').clientWidth / 19;
    $('animal').style.left = `${(position + .5) * width}px`;
    $('animal').textContent = animal;
    $('destination').textContent = animal;
    $('destination').hidden = destination === null;
    if (destination !== null) $('destination').style.left = `${(destination + .5) * width}px`;
    if (scroll) $('line-window').scrollTo({ left: (position + .5) * width - $('line-window').clientWidth / 2,
      behavior: reducido() || !busy ? 'auto' : 'smooth' });
  }
  function lockLine() {
    root.querySelectorAll('[data-animal], #line-mode, #new-challenge, #go').forEach(c => { c.disabled = busy; });
    $('voice-choice').disabled = busy || !voice.available;
    $('start').disabled = busy || challenge;
    $('jumps').disabled = busy || challenge;
    $('go').hidden = challenge;
    $('new-challenge').hidden = !challenge;
    $('ticks').querySelectorAll('button').forEach(b => {
      const n = Number(b.dataset.number);
      b.disabled = busy || (challenge ? solved : n > 9);
      b.setAttribute('aria-label', challenge ? `Elegir llegada en ${n}` : n <= 9 ? `Empezar en ${n}` : String(n));
      b.setAttribute('aria-pressed', String(challenge ? n === destination : n === start));
    });
  }
  function cancel() {
    run += 1;
    busy = false;
    animation?.cancel();
    animation = null;
    voice.cancel();
    lockLine();
  }
  function prompt() {
    $('line-equation').textContent = `${start} + ${jumps} = ${solved ? `${start + jumps} 🎉` : '?'}`;
    $('line-prompt').textContent = challenge ? '🔒 Salimos de aquí. Toca dónde crees que llegará.' : 'Elige tu animal y toca un número del 0 al 9.';
  }
  function reset() {
    cancel();
    solved = false;
    destination = null;
    position = start;
    $('ticks').querySelectorAll('.landed').forEach(t => t.classList.remove('landed'));
    $('line-status').textContent = challenge ? `Necesitamos ${jumps} ${jumps === 1 ? 'salto' : 'saltos'} hacia delante.` : 'Prepara tus saltitos.';
    $('start').value = start;
    $('jumps').value = jumps;
    prompt();
    lockLine();
    place(true);
  }
  function newChallenge() {
    const previous = `${start},${jumps}`;
    start = Math.floor(Math.random() * 10);
    jumps = 1 + Math.floor(Math.random() * 9);
    if (`${start},${jumps}` === previous) start = (start + 1) % 10;
    reset();
  }
  async function animateRun() {
    if (busy || !Number.isInteger(start) || !Number.isInteger(jumps) || start < 0 || start > 9 || jumps < 1 || jumps > 9 || start + jumps > 18) return;
    cancel();
    const token = run;
    busy = true;
    solved = false;
    position = start;
    $('ticks').querySelectorAll('.landed').forEach(t => t.classList.remove('landed'));
    lockLine();
    place(true);
    prompt();
    if (!challenge) $('line-status').textContent = `Empezamos en ${start}.`;
    await voice.say(`Empezamos en ${start}.`);
    if (token !== run) return;
    for (let n = 1; n <= jumps; n += 1) {
      const width = $('track').clientWidth / 19;
      const x = (position + .5) * width;
      const motion = $('animal').animate(reducido() ? [
        { left: `${x}px` }, { left: `${x + width}px` }
      ] : [
        { left: `${x}px`, transform: 'translateY(0) scale(1.2,.8)' },
        { left: `${x + width * .48}px`, transform: 'translateY(-48px) rotate(-9deg) scale(.88,1.14)', offset: .48 },
        { left: `${x + width}px`, transform: 'translateY(0) scale(1.18,.82)', offset: .88 },
        { left: `${x + width}px`, transform: 'translateY(0) scale(1)' }
      ], { duration: reducido() ? 100 : 390, easing: 'ease-in-out', fill: 'forwards' });
      animation = motion;
      try { await motion.finished; } catch { return; }
      if (token !== run) return;
      position = start + n;
      place(true);
      motion.cancel();
      animation = null;
      $('ticks').children[position].classList.add('landed');
      const spark = $('hop-spark');
      spark.style.left = `${(position + .5) * width}px`;
      if (!reducido()) spark.animate([{ opacity: 1, transform: 'translateY(0) scale(.5)' }, { opacity: 0, transform: 'translateY(-35px) scale(1.4)' }], { duration: 450 });
      $('line-status').textContent = `${words[n]} Estamos en ${position}.`;
      await Promise.all([voice.say(words[n]), wait(reducido() ? 150 : 100)]);
      if (token !== run) return;
    }
    solved = true;
    prompt();
    $('line-status').textContent = `${start} + ${jumps} = ${position} 🎉`;
    celebrar(root, 'saltitos');
    await voice.say(`Llegamos a ${position}.`);
    if (token !== run) return;
    await voice.say(`Por lo tanto, ${start} más ${jumps} es igual a ${position}.`);
    if (token !== run) return;
    busy = false;
    lockLine();
  }
  function choose(n) {
    if (busy) return;
    if (!challenge) { if (n <= 9) { start = n; reset(); } return; }
    if (solved) return;
    destination = n;
    place();
    lockLine();
    const distance = Math.abs(n - start);
    $('line-status').textContent = n < start
      ? `${distance} ${distance === 1 ? 'salto' : 'saltos'} hacia atrás. Aquí avanzamos →`
      : `${distance} ${distance === 1 ? 'salto' : 'saltos'}${distance === jumps ? '. ¡Correcto! ✨' : '. ¡Puedes probar otra posición!'}`;
    if (n - start === jumps) animateRun();
  }
  for (let n = 0; n <= 18; n += 1) {
    const tick = document.createElement('button');
    tick.type = 'button';
    tick.textContent = n;
    tick.dataset.number = n;
    tick.addEventListener('click', () => choose(n));
    $('ticks').append(tick);
    if (n <= 9) $('start').add(new Option(n, n));
    if (n >= 1 && n <= 9) $('jumps').add(new Option(n, n));
  }
  root.querySelectorAll('[data-animal]').forEach(button => button.addEventListener('click', () => {
    animal = button.dataset.animal;
    root.querySelectorAll('[data-animal]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    place();
  }));
  $('start').addEventListener('change', () => { start = Number($('start').value); reset(); });
  $('jumps').addEventListener('change', () => { jumps = Number($('jumps').value); reset(); });
  $('line-reset').addEventListener('click', reset);
  $('line-mode').addEventListener('change', () => { challenge = $('line-mode').value === 'challenge'; if (challenge) newChallenge(); else reset(); });
  $('new-challenge').addEventListener('click', newChallenge);
  $('go').addEventListener('click', animateRun);
  window.addEventListener('resize', () => { if (!busy) place(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && busy) reset(); });
  window.addEventListener('pagehide', cancel);
  reset();
  return { enter: () => place(true), leave: () => { if (busy) reset(); else cancel(); } };
}
