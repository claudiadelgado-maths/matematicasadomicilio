import { preguntas } from './banco-preguntas.mjs';
import { preguntasCA } from './banco-corriente-alterna.mjs';
function iniciarExamen(preguntas, prefix) {
const container = document.querySelector(`#${prefix}-preguntas`);
const progress = document.querySelector(`#${prefix}-progreso`);
const result = document.querySelector(`#${prefix}-resultado`);
let answered = 0, correct = 0;
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function render() {
  answered = 0; correct = 0;
  container.replaceChildren(); result.hidden = true; result.textContent = '';
  progress.textContent = `Respondidas: 0 de ${preguntas.length} · Aciertos: 0`;
  preguntas.forEach((question, index) => {
    const form = element('form', '', 'lesson quiz-question');
    const fieldset = element('fieldset');
    fieldset.append(element('legend', `Pregunta ${index + 1}. ${question.pregunta}`));
    const labels = [];
    question.opciones.forEach((option, optionIndex) => {
      const label = element('label', '', 'quiz-option');
      const input = element('input');
      input.type = 'radio'; input.name = `${prefix}-pregunta-${index}`; input.value = optionIndex; input.required = true;
      label.append(input, element('span', `${'ABCD'[optionIndex]}) ${option}`));
      fieldset.append(label); labels.push(label);
    });
    const button = element('button', 'Comprobar', 'return-link'); button.type = 'submit';
    const feedback = element('p', '', 'quiz-feedback'); feedback.hidden = true; feedback.setAttribute('role', 'status');
    let checked = false;
    form.addEventListener('submit', event => {
      event.preventDefault(); if (checked) return;
      const selected = fieldset.querySelector('input:checked'); if (!selected) return;
      checked = true; answered++;
      const isCorrect = Number(selected.value) === question.correcta;
      if (isCorrect) correct++;
      labels[question.correcta].classList.add('quiz-correct');
      if (!isCorrect) labels[Number(selected.value)].classList.add('quiz-incorrect');
      fieldset.disabled = true; button.disabled = true; button.textContent = 'Respondida';
      feedback.textContent = `${isCorrect ? 'Correcto.' : 'Respuesta incorrecta.'} Respuesta correcta: ${'ABCD'[question.correcta]}) ${question.opciones[question.correcta]} ${question.explicacion}`;
      feedback.hidden = false;
      progress.textContent = `Respondidas: ${answered} de ${preguntas.length} · Aciertos: ${correct}`;
      if (answered === preguntas.length) {
        result.textContent = `Examen terminado: ${correct} de ${preguntas.length} respuestas correctas. Revisa las explicaciones para reforzar los conceptos.`;
        result.hidden = false;
      }
    });
    form.append(fieldset, button, feedback); container.append(form);
  });
}
document.querySelector(`#${prefix}-reiniciar`).addEventListener('click', () => {
  render(); container.querySelector('input').focus();
});
render();

}
iniciarExamen(preguntas, "examen");
iniciarExamen(preguntasCA, "examen-ca");
