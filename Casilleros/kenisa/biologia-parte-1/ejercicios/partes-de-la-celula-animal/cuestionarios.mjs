import { DESCRIPTION_BANK, REASONING_BANK, STRUCTURES } from './banco-preguntas.mjs?v=20260929-3';
import { mountQuiz } from '../../recursos/cuestionarios.mjs?v=20260929-3';

const guide = document.querySelector('[data-organelle-guide]');
if (guide) {
  const buttons = [];
  let selectedIndex = 0;
  const select = (item, index) => {
    selectedIndex = index;
    guide.querySelector('[data-study-name]').textContent = `${index + 1}. ${item.name}`;
    guide.querySelector('[data-study-function]').textContent = item.summary;
    guide.querySelector('[data-study-memory]').textContent = item.memory;
    guide.querySelector('[data-study-distinction]').textContent = item.distinction;
    buttons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === index)));
    guide.querySelector('[data-study-previous]').disabled = index === 0;
    guide.querySelector('[data-study-next]').disabled = index === STRUCTURES.length - 1;
  };
  STRUCTURES.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'study-selector';
    button.innerHTML = '<span aria-hidden="true"></span><strong></strong>';
    button.querySelector('span').textContent = index + 1;
    button.querySelector('strong').textContent = item.name;
    button.addEventListener('click', () => {
      select(item, index);
      if (window.innerWidth <= 760) guide.querySelector('.study-detail').scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });
    buttons.push(button);
    guide.querySelector('[data-study-selectors]').append(button);
  });
  guide.querySelector('[data-study-previous]').addEventListener('click', () => select(STRUCTURES[selectedIndex - 1], selectedIndex - 1));
  guide.querySelector('[data-study-next]').addEventListener('click', () => select(STRUCTURES[selectedIndex + 1], selectedIndex + 1));
  select(STRUCTURES[0], 0);
}

document.querySelectorAll('[data-quiz]').forEach((quiz) => {
  const bank = quiz.dataset.quiz === 'descripciones' ? DESCRIPTION_BANK : REASONING_BANK;
  mountQuiz(quiz, { bank, categories: STRUCTURES });
});
