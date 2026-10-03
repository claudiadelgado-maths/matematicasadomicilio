import { ANGLE_TYPES, createQuestionGenerator } from '../../recursos/modelo.mjs';
import { createAngleDiagram } from '../../recursos/angulos.mjs';

const practice = document.querySelector('[data-angle-practice]');
if (practice) {
  const diagram = createAngleDiagram(practice.querySelector('[data-question-drawing]'), { axes: true, fixedColor: '#6860ac', exposeType: false });
  const options = practice.querySelector('[data-options]');
  const feedback = practice.querySelector('[data-feedback]');
  const feedbackTitle = practice.querySelector('[data-feedback-title]');
  const feedbackCopy = practice.querySelector('[data-feedback-copy]');
  let nextQuestion = createQuestionGenerator();
  let question;
  let questionNumber = 0;
  let solved = 0;
  let firstTry = 0;
  let mistakes = false;
  let resolved = false;

  ANGLE_TYPES.forEach((type) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.dataset.answer = type.key;
    const label = document.createElement('span');
    label.textContent = type.name;
    const icon = document.createElement('span');
    icon.className = 'answer-icon';
    icon.setAttribute('aria-hidden', 'true');
    button.append(label, icon);
    options.append(button);
  });

  function updateStats() {
    practice.querySelector('[data-solved]').textContent = solved;
    practice.querySelector('[data-first-try]').textContent = firstTry;
  }

  function showQuestion({ focus = false } = {}) {
    question = nextQuestion();
    questionNumber++;
    resolved = false;
    mistakes = false;
    diagram.setAngle(question.angle);
    practice.querySelector('[data-question-index]').textContent = `Ejercicio ${questionNumber}`;
    practice.querySelector('[data-question-angle]').textContent = `${question.angle}°`;
    practice.querySelector('[data-question-turn]').textContent = question.angle === 0
      ? 'Los lados coinciden sin haber girado.'
      : question.angle === 360 ? 'Se recorrió una vuelta entera antes de coincidir.' : 'Giro en sentido antihorario desde el lado fijo.';
    options.querySelectorAll('button').forEach((button) => {
      button.className = 'answer-option';
      button.disabled = false;
      button.removeAttribute('aria-label');
      button.querySelector('.answer-icon').textContent = '';
    });
    feedback.dataset.state = 'idle';
    feedbackTitle.textContent = 'Elige una respuesta';
    feedbackCopy.textContent = 'Observa cuánto ha girado el lado móvil.';
    practice.querySelector('[data-question-announcement]').textContent = `Ejercicio ${questionNumber}. Ángulo de ${question.angle} grados. Identifica su tipo.`;
    if (focus) practice.querySelector('#pregunta-titulo').focus({ preventScroll: true });
  }

  options.addEventListener('click', (event) => {
    const button = event.target.closest('[data-answer]');
    if (!button || resolved) return;
    const correct = button.dataset.answer === question.type.key;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      button.classList.remove('is-pulsing');
      void button.offsetWidth;
      button.classList.add('is-pulsing');
      button.onanimationend = () => button.classList.remove('is-pulsing');
    }
    if (correct) {
      resolved = true;
      solved++;
      if (!mistakes) firstTry++;
      button.classList.add('is-correct');
      button.classList.remove('is-wrong');
      button.querySelector('.answer-icon').textContent = '✅';
      button.setAttribute('aria-label', `${question.type.name}. Respuesta correcta.`);
      options.querySelectorAll('button').forEach((choice) => { choice.disabled = true; });
      feedback.dataset.state = 'correct';
      feedbackTitle.textContent = `¡Correcto! ${question.type.name}.`;
      feedbackCopy.textContent = `${question.angle}°: ${question.type.rule} Pulsa «Nuevo ejercicio» para seguir.`;
      updateStats();
    } else {
      mistakes = true;
      button.classList.add('is-wrong');
      button.querySelector('.answer-icon').textContent = '❌';
      button.setAttribute('aria-label', `${button.querySelector('span').textContent}. Respuesta incorrecta; puedes volver a intentarlo.`);
      feedback.dataset.state = 'wrong';
      feedbackTitle.textContent = 'Todavía no. Puedes reintentar.';
      feedbackCopy.textContent = `${question.angle}°: ${question.type.rule} Elige otro nombre.`;
    }
  });

  practice.querySelector('[data-new]').addEventListener('click', () => showQuestion({ focus: true }));
  practice.querySelector('[data-restart]').addEventListener('click', () => {
    nextQuestion = createQuestionGenerator();
    questionNumber = 0;
    solved = 0;
    firstTry = 0;
    updateStats();
    showQuestion({ focus: true });
  });
  showQuestion();
}
