export const nombres = ['unidades', 'decenas', 'centenas', 'millares', 'decenas de millar'];
export const singular = ['unidad', 'decena', 'centena', 'millar', 'decena de millar'];
export const letras = ['U', 'D', 'C', 'M', 'DM'];
export const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const $ = id => document.getElementById(id);

// El tablero original se comparte entre práctica y demostración.
export function tablero(board, exercise, steps, inputFactory) {
  board.replaceChildren();
  board.style.setProperty('--digits', steps.length);
  const cell = (text, cls = '', pos) => {
    const element = document.createElement('span');
    element.textContent = text;
    element.className = cls;
    if (pos !== undefined) element.dataset.position = pos;
    board.append(element);
    return element;
  };
  cell('');
  for (let p = steps.length - 1; p >= 0; p -= 1) cell(letras[p], 'place', p).setAttribute('aria-label', nombres[p]);
  cell('');
  for (let p = steps.length - 1; p >= 0; p -= 1) {
    if (p > 0 && steps[p - 1].salida) {
      const carry = inputFactory('carry', p, `Llevada a ${nombres[p]}`);
      carry.dataset.position = p;
      board.append(carry);
    } else cell('');
  }
  for (const [row, value] of [exercise.a, exercise.b].entries()) {
    cell(row === 1 ? '+' : '', 'digit');
    for (let p = steps.length - 1; p >= 0; p -= 1) {
      cell(p >= String(value).length ? '' : Math.floor(value / 10 ** p) % 10, 'digit', p);
    }
  }
  cell('', 'rule');
  cell('=');
  for (let p = steps.length - 1; p >= 0; p -= 1) {
    const answer = inputFactory('answer', p, `Resultado: ${nombres[p]}`);
    answer.dataset.position = p;
    board.append(answer);
  }
}

export function marcarColumna(board, position) {
  board.querySelectorAll('[data-position]').forEach(cell => cell.classList.toggle('active', Number(cell.dataset.position) === position));
}

export function celebrar(panel, game) {
  panel.querySelector('.confetti')?.remove();
  const burst = document.createElement('div');
  burst.className = 'confetti';
  burst.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 16; i += 1) {
    const star = document.createElement('span');
    star.textContent = i % 3 ? '✦' : '★';
    star.style.setProperty('--i', i);
    star.style.setProperty('--x', `${(i % 8 - 3.5) * 34}px`);
    star.style.setProperty('--y', `${-45 - (i % 5) * 25}px`);
    burst.append(star);
  }
  panel.append(burst);
  setTimeout(() => burst.remove(), 1100);
  if (game) document.dispatchEvent(new CustomEvent('descubrimiento', { detail: game }));
}

export function casi(element) {
  if (!reducido()) element.animate([
    { transform: 'translateX(0)' }, { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }
  ], { duration: 240 });
}
