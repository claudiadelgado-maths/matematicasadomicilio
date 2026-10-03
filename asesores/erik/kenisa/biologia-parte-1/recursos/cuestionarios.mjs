import { createRoundGenerator, createQuizState, answerQuestion, nextQuestion, scoreQuiz, createErrorRound } from './modelo-repaso.mjs?v=20260929-3';

export function mountQuiz(quiz, { bank, categories, optionCount = 3, categoryLabel = 'estructuras', studyLink = '#guia-celula' }) {
  const generateRound = createRoundGenerator(bank, categories, { optionCount });
  let state = null;
  let perCategory = 1;
  let reviewing = false;
  let initialScore = null;
  const find = (selector) => quiz.querySelector(selector);
  const playing = find('[data-quiz-playing]');
  const summary = find('[data-quiz-summary]');
  const prompt = find('[data-quiz-prompt]');
  const choices = find('[data-quiz-choices]');
  const feedback = find('[data-quiz-feedback]');
  const next = find('[data-quiz-next]');
  const meter = find('[data-quiz-meter]');
  const focusIntoView = (element) => {
    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  };

  const setup = document.createElement('div');
  setup.className = 'quiz-setup';
  setup.innerHTML = '<p class="eyebrow">Practica a tu ritmo</p><h3 tabindex="-1">Elige tu ronda</h3><p>Lee, responde y entiende el porqué. No hay límite de tiempo.</p><div class="quiz-lengths"></div><a class="quiz-study-link">Consultar la guía antes de empezar ↑</a>';
  setup.querySelector('a').href = studyLink;
  [1, 2].forEach((count) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-length';
    button.dataset.quizStart = count;
    button.innerHTML = '<strong></strong><span></span><small></small>';
    button.querySelector('strong').textContent = count === 1 ? 'Repaso breve' : 'Repaso completo';
    button.querySelector('span').textContent = `${count * categories.length} preguntas`;
    button.querySelector('small').textContent = count === 1 ? 'Una por tema · Para empezar' : 'Dos por tema · Para profundizar';
    button.addEventListener('click', () => { perCategory = count; startFresh(); });
    setup.querySelector('.quiz-lengths').append(button);
  });
  playing.before(setup);
  playing.hidden = true;

  const context = document.createElement('p');
  context.className = 'quiz-context';
  context.hidden = true;
  playing.prepend(context);
  const mistakes = document.createElement('details');
  mistakes.className = 'quiz-mistakes';
  mistakes.innerHTML = '<summary>Entiende tus errores</summary><ol></ol>';
  const retryErrors = document.createElement('button');
  retryErrors.type = 'button';
  retryErrors.className = 'bio-button primary';
  retryErrors.dataset.quizErrors = '';
  const changeLength = document.createElement('button');
  changeLength.type = 'button';
  changeLength.className = 'bio-button';
  changeLength.textContent = 'Cambiar de ronda';
  const actions = document.createElement('div');
  actions.className = 'quiz-summary-actions';
  const retry = find('[data-quiz-retry]');
  retry.classList.remove('primary');
  actions.append(retryErrors, retry, changeLength);
  summary.append(mistakes, actions);
  const summaryEyebrow = summary.querySelector('.eyebrow');

  const updateProgress = () => {
    const score = scoreQuiz(state);
    find('[data-quiz-count]').textContent = `Pregunta ${state.index + 1} de ${score.total}`;
    find('[data-quiz-score]').textContent = `${score.correct} ${score.correct === 1 ? 'acierto' : 'aciertos'}`;
    meter.max = score.total;
    meter.value = score.answered;
    meter.textContent = `${score.answered} de ${score.total}`;
    meter.setAttribute('aria-valuetext', `${score.answered} de ${score.total} preguntas respondidas`);
  };

  const showQuestion = (moveFocus = false) => {
    setup.hidden = true;
    playing.hidden = false;
    summary.hidden = true;
    context.hidden = !reviewing;
    context.textContent = reviewing ? `Repaso de errores · Resultado inicial: ${initialScore.correct}/${initialScore.total}. Esta práctica tiene su propio puntaje.` : '';
    const question = state.round[state.index];
    find('[data-quiz-kind]').textContent = question.kind;
    prompt.replaceChildren();
    question.prompt.split(/\b(NO|INCORRECTA)\b/g).forEach((part) => {
      if (part === 'NO' || part === 'INCORRECTA') {
        const emphasis = document.createElement('strong');
        emphasis.textContent = part;
        prompt.append(emphasis);
      } else prompt.append(document.createTextNode(part));
    });
    choices.replaceChildren(...question.choices.map((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-choice';
      button.dataset.choice = choice.id;
      const letter = document.createElement('span');
      letter.className = 'choice-letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.textContent = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index];
      const text = document.createElement('span');
      text.className = 'choice-text';
      text.textContent = choice.text;
      const mark = document.createElement('span');
      mark.className = 'choice-mark';
      mark.setAttribute('aria-hidden', 'true');
      button.append(letter, text, mark);
      return button;
    }));
    feedback.replaceChildren();
    feedback.className = 'quiz-feedback';
    next.disabled = true;
    next.firstChild.textContent = 'Siguiente ';
    updateProgress();
    if (moveFocus) focusIntoView(prompt);
  };

  function startFresh() {
    reviewing = false;
    initialScore = null;
    state = createQuizState(generateRound(perCategory), categories);
    showQuestion(true);
  }

  choices.addEventListener('click', (event) => {
    const button = event.target.closest('[data-choice]');
    if (!state || !button || !choices.contains(button)) return;
    const answer = answerQuestion(state, button.dataset.choice);
    if (!answer) return;
    const question = state.round[state.index];
    const correctChoice = question.choices.find(({ id }) => id === question.correctId);
    choices.querySelectorAll('button').forEach((option) => {
      const correct = option.dataset.choice === question.correctId;
      const incorrect = !answer.correct && option === button;
      option.disabled = true;
      option.classList.toggle('is-correct', correct);
      option.classList.toggle('is-incorrect', incorrect);
      option.classList.toggle('is-muted', !correct && !incorrect);
      option.querySelector('.choice-mark').textContent = correct ? '✓' : incorrect ? '×' : '';
      const label = option.querySelector('.choice-text').textContent;
      option.setAttribute('aria-label', `${label}${correct ? '. Respuesta correcta.' : incorrect ? '. Tu respuesta: incorrecta.' : ''}`);
    });
    const heading = document.createElement('h4');
    heading.textContent = answer.correct ? '✓ ¡Correcto! Esta es la clave:' : 'Vamos a aclararlo';
    const correctText = document.createElement('p');
    correctText.className = 'quiz-correction';
    correctText.textContent = `Respuesta correcta: ${correctChoice.text}`;
    const explanation = document.createElement('p');
    explanation.textContent = question.explanation;
    feedback.replaceChildren(...(answer.correct ? [heading, explanation] : [heading, correctText, explanation]));
    feedback.classList.add('has-feedback');
    feedback.classList.toggle('is-incorrect', !answer.correct);
    updateProgress();
    next.disabled = false;
    if (state.index === state.round.length - 1) next.firstChild.textContent = 'Ver mi resultado ';
    if (event.detail === 0) next.focus({ preventScroll: true });
    else feedback.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  });

  const showSummary = () => {
    playing.hidden = true;
    summary.hidden = false;
    const score = scoreQuiz(state);
    const perfect = score.correct === score.total;
    summaryEyebrow.textContent = reviewing ? 'Repaso de errores completado' : 'Ronda completada';
    find('[data-quiz-summary-title]').textContent = perfect ? (reviewing ? '¡Aclaraste estas dudas!' : '¡Todo conectado!') : 'Ya sabes qué repasar';
    const detail = document.createElement('span');
    detail.textContent = `${score.percent}% de aciertos · ${score.total} preguntas respondidas${reviewing ? ` · Ronda inicial: ${initialScore.correct}/${initialScore.total}` : ''}`;
    find('[data-quiz-final-score]').replaceChildren(document.createTextNode(`${score.correct} / ${score.total}`), detail);
    find('[data-quiz-summary-message]').textContent = perfect
      ? 'Ahora intenta explicar una respuesta con tus propias palabras. Otra ronda te permitirá practicar variantes.'
      : 'Revisa por qué fallaste y vuelve a responder solo esas preguntas. Los errores de hoy te indican qué estudiar.';
    const review = score.categories.filter((item) => item.correct < item.total);
    find('[data-quiz-review]').hidden = !review.length;
    find('[data-quiz-perfect]').hidden = !perfect;
    find('[data-quiz-perfect]').textContent = reviewing ? 'Completaste este repaso. Prueba una ronda nueva para comprobarlo con otras preguntas.' : 'Respondiste correctamente todos los temas de esta ronda.';
    find('[data-quiz-review-list]').replaceChildren(...review.map((item) => {
      const li = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = item.name;
      const result = document.createElement('span');
      result.textContent = `${item.correct} de ${item.total} aciertos`;
      const reminder = document.createElement('p');
      reminder.textContent = item.summary || item.lead || '';
      li.append(name, result);
      if (reminder.textContent) li.append(reminder);
      return li;
    }));
    const missed = state.answers.filter(({ correct }) => !correct);
    mistakes.hidden = !missed.length;
    mistakes.open = false;
    mistakes.querySelector('summary').textContent = `Entiende tus errores (${missed.length})`;
    mistakes.querySelector('ol').replaceChildren(...missed.map((answer) => {
      const question = state.round.find(({ id }) => id === answer.questionId);
      const li = document.createElement('li');
      const title = document.createElement('h4');
      title.textContent = question.prompt;
      const chosen = document.createElement('p');
      chosen.className = 'mistake-chosen';
      chosen.textContent = `Tu respuesta: ${question.choices.find(({ id }) => id === answer.choiceId).text}`;
      const correct = document.createElement('p');
      correct.className = 'mistake-correct';
      correct.textContent = `Correcta: ${question.choices.find(({ id }) => id === question.correctId).text}`;
      const why = document.createElement('p');
      why.textContent = question.explanation;
      li.append(title, chosen, correct, why);
      return li;
    }));
    retryErrors.hidden = !missed.length;
    retryErrors.textContent = `Practicar mis errores (${missed.length})`;
    retry.textContent = `Otra ronda de ${perCategory * categories.length}`;
    find('.quiz-retry-note').textContent = `Puedes repasar tus errores o probar nuevas variantes de las ${categoryLabel}. No se guarda tu progreso al cerrar o recargar.`;
    focusIntoView(find('[data-quiz-summary-title]'));
  };

  next.addEventListener('click', () => {
    if (!state || !nextQuestion(state)) return;
    if (state.finished) showSummary();
    else showQuestion(true);
  });
  retry.addEventListener('click', startFresh);
  retryErrors.addEventListener('click', () => {
    if (!state?.finished) return;
    const round = createErrorRound(state);
    if (!round.length) return;
    if (!reviewing) initialScore = scoreQuiz(state);
    reviewing = true;
    state = createQuizState(round, categories);
    showQuestion(true);
  });
  changeLength.addEventListener('click', () => {
    summary.hidden = true;
    playing.hidden = true;
    setup.hidden = false;
    focusIntoView(setup.querySelector('h3'));
  });
}
