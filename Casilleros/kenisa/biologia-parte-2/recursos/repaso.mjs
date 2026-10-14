import { createAttempt, shuffleOptions } from './modelo-repaso.mjs';

export function initQuiz(questions, onQuestion = () => {}) {
  const root = document.getElementById('quiz');
  if (!root) return;
  const el = id => document.getElementById(id);
  const setText = (id, text) => { el(id).textContent = text; };
  const feedback = (id, text, success = true) => { setText(id, text); el(id).dataset.state = success ? 'success' : 'retry'; };
  el('quiz-meter').max = questions.length;
  let attempt;
  let current = 0;
  let confirmed = false;
  function renderQuestion() {
    const item = questions[current];
    confirmed = false;
    setText('quiz-progress', `Pregunta ${current + 1} de ${questions.length}`);
    el('quiz-meter').value = attempt.count;
    setText('quiz-question', item.prompt);
    setText('quiz-feedback', '');
    el('quiz-confirm').hidden = false;
    el('quiz-next').hidden = true;
    const options = el('quiz-options'); options.replaceChildren();
    shuffleOptions(item).forEach(({ text, index }) => {
      const label = document.createElement('label'); label.className = 'option';
      const input = document.createElement('input'); input.type = 'radio'; input.name = 'quiz-answer'; input.value = String(index);
      const copy = document.createElement('span'); copy.textContent = text;
      label.append(input, copy); options.append(label);
    });
    onQuestion(item);
    el('quiz-question').focus({ preventScroll: true });
  }
  function startQuiz() {
    current = 0; attempt = createAttempt(questions);
    el('quiz-start').hidden = true; el('quiz-result').hidden = true; el('quiz-round').hidden = false;
    renderQuestion();
    el('quiz').scrollIntoView({ block: 'start' });
  }
  function finishQuiz() {
    if (!attempt.complete) return;
    el('quiz-round').hidden = true; el('quiz-result').hidden = false;
    setText('result-title', `${attempt.score} de ${questions.length} conexiones correctas`);
    setText('result-message', attempt.score === questions.length ? '¡Todas las ideas conectadas! Prueba explicarlas sin mirar los dibujos. Puedes repetir el recorrido cuando quieras.' : 'Cada error señala una idea para volver a mirar. Aquí tienes las respuestas y una explicación para reforzarlas.');
    const review = el('quiz-review'); review.replaceChildren();
    review.hidden = attempt.mistakes.length === 0;
    attempt.mistakes.forEach(({ item, choice }) => {
      const article = document.createElement('article'); article.className = 'review-item';
      const title = document.createElement('h4'); title.textContent = item.prompt;
      const chosen = document.createElement('p'); chosen.textContent = `Elegiste: ${item.options[choice]}`;
      const answer = document.createElement('p'); answer.textContent = `Respuesta: ${item.options[item.answer]}`;
      const why = document.createElement('p'); why.textContent = item.explanation;
      const link = document.createElement('a'); link.href = `#${item.section}`; link.textContent = 'Revisar esta idea ↑';
      article.append(title, chosen, answer, why, link); review.append(article);
    });
    el('result-title').focus();
  }
  el('start-quiz').addEventListener('click', startQuiz);
  el('quiz-restart').addEventListener('click', startQuiz);
  el('quiz-confirm').addEventListener('click', () => {
    if (confirmed) return;
    const selected = root.querySelector('input[name="quiz-answer"]:checked');
    if (!selected) { feedback('quiz-feedback', 'Elige una opción antes de confirmar. Puedes cambiarla mientras no la hayas confirmado.', false); return; }
    const choice = Number(selected.value);
    if (!attempt.submit(current, choice)) return;
    confirmed = true;
    const item = questions[current]; const correct = choice === item.answer;
    root.querySelectorAll('input[name="quiz-answer"]').forEach(input => {
      input.disabled = true;
      if (Number(input.value) === item.answer) input.parentElement.classList.add('correct');
      else if (input.checked) input.parentElement.classList.add('retry');
    });
    feedback('quiz-feedback', `${correct ? '¡Correcto!' : `Para recordar: ${item.options[item.answer]}`} ${item.explanation}`, correct);
    el('quiz-meter').value = attempt.count;
    el('quiz-confirm').hidden = true; el('quiz-next').hidden = false;
    setText('quiz-next', current === questions.length - 1 ? 'Ver mi resultado →' : 'Siguiente pregunta →');
    el('quiz-next').focus({ preventScroll: true });
  });
  el('quiz-next').addEventListener('click', () => {
    if (!confirmed) return;
    if (current < questions.length - 1) { current++; renderQuestion(); }
    else finishQuiz();
  });
}
