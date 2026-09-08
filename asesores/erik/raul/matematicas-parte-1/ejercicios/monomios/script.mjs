import { showFeedback } from '../../recursos/feedback.mjs';
import { generateExercise, toLatex, verbalize, checkAnswer } from './monomios.mjs';

// Si el CDN no responde, el HTML inicial y MathML conservan la notación legible.
function renderLatex(element, latex) {
  if (window.katex) window.katex.render(latex, element, { throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });
}
document.querySelectorAll('[data-tex]').forEach((element) => renderLatex(element, element.dataset.tex));

const expression = document.querySelector('#exercise-expression');
const fields = document.querySelector('#answer-fields');
const feedback = document.querySelector('#exercise-feedback');
const labels = { signo: 'Signo', coeficiente: 'Coeficiente', literal: 'Literal', exponente: 'Exponente' };
let current;

function mathElement(tag, text) {
  const element = document.createElementNS('http://www.w3.org/1998/Math/MathML', tag);
  if (text !== undefined) element.textContent = text;
  return element;
}
function renderExpression() {
  expression.setAttribute('aria-label', verbalize(current));
  const math = mathElement('math');
  math.setAttribute('aria-hidden', 'true');
  const row = mathElement('mrow');
  if (current.sign === '-') row.append(mathElement('mo', '−'));
  if (current.fractional) {
    const fraction = mathElement('mfrac');
    fraction.append(mathElement('mn', String(current.numerator)), mathElement('mn', String(current.denominator)));
    row.append(fraction);
  } else if (current.numerator !== 1) row.append(mathElement('mn', String(current.numerator)));
  if (current.exponent !== 1) {
    const power = mathElement('msup');
    power.append(mathElement('mi', current.literal), mathElement('mn', String(current.exponent)));
    row.append(power);
  } else row.append(mathElement('mi', current.literal));
  math.append(row);
  expression.replaceChildren(math);
  renderLatex(expression, toLatex(current));
}

function newExercise(focus = false) {
  current = generateExercise(Math.random, current);
  renderExpression();
  fields.replaceChildren();
  for (const category of current.fields) {
    const label = document.createElement('label');
    label.textContent = labels[category];
    label.htmlFor = `answer-${category}`;
    const input = document.createElement(category === 'signo' ? 'select' : 'input');
    input.id = `answer-${category}`;
    input.name = category;
    input.setAttribute('aria-label', labels[category]);
    input.required = true;
    input.setAttribute('aria-describedby', `feedback-${category}`);
    if (category === 'signo') {
      for (const [value, text] of [['', 'Selecciona el signo'], ['+', '+ Positivo'], ['-', '− Negativo']]) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        input.append(option);
      }
    } else {
      input.type = 'text';
      input.maxLength = 30;
      input.autocomplete = 'off';
      input.autocapitalize = 'off';
      input.spellcheck = false;
      if (category === 'exponente') input.inputMode = 'numeric';
    }
    const fieldFeedback = document.createElement('span');
    fieldFeedback.id = `feedback-${category}`;
    fieldFeedback.className = 'field-feedback';
    fieldFeedback.hidden = true;
    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      delete input.dataset.result;
      fieldFeedback.hidden = true;
      showFeedback(feedback);
    });
    label.append(input, fieldFeedback);
    fields.append(label);
  }
  showFeedback(feedback);
  feedback.textContent = focus ? `Nuevo ejercicio. Identifica: ${current.fields.map((item) => labels[item].toLowerCase()).join(', ')}.` : '';
  if (focus) fields.querySelector('input, select').focus({ preventScroll: true });
}
document.querySelector('#answer-form').addEventListener('submit', (event) => {
  event.preventDefault();
  let firstError;
  let correctCount = 0;
  for (const category of current.fields) {
    const input = document.getElementById(`answer-${category}`);
    const result = checkAnswer(current, category, input.value);
    input.setAttribute('aria-invalid', String(!result.correct));
    input.dataset.result = result.correct ? 'correct' : 'incorrect';
    const message = document.getElementById(`feedback-${category}`);
    message.hidden = false;
    message.textContent = result.message;
    message.classList.toggle('is-correct', result.correct);
    if (result.correct) correctCount++;
    else firstError ||= input;
  }
  const correct = correctCount === current.fields.length;
  showFeedback(feedback, correct
    ? '✓ ¡Correcto! Identificaste las partes solicitadas.'
    : '× Revisa tu respuesta. Corrige los campos señalados y vuelve a comprobar.', correct ? 'correct' : 'incorrect');
  firstError?.focus({ preventScroll: true });
});
document.querySelector('#new-exercise').addEventListener('click', () => newExercise(true));
document.querySelector('#practice').hidden = false;
newExercise();
