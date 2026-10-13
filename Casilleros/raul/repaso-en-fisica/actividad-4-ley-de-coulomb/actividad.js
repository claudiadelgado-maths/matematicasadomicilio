(() => {
  const STORAGE_KEY = "repaso-fisica-actividad-4-coulomb-v1";
  const m = (tex) => `\\(${tex}\\)`;

  const questions = [
    {
      tag: "Fórmula",
      prompt: "¿Cuál es la expresión para la magnitud de la fuerza eléctrica entre dos cargas puntuales?",
      correct: m(String.raw`F = k \frac{|q_1q_2|}{r^2}`),
      wrong: m(String.raw`F = k \frac{|q_1q_2|}{r}`)
    },
    {
      tag: "Signos",
      prompt: "Si las dos cargas tienen signos opuestos, ¿qué ocurre entre ellas?",
      correct: "Se atraen",
      wrong: "Se repelen"
    },
    {
      tag: "Signos",
      prompt: "Si las dos cargas tienen el mismo signo, ¿qué ocurre entre ellas?",
      correct: "Se repelen",
      wrong: "Se atraen"
    },
    {
      tag: "Distancia",
      prompt: "Si la distancia entre las cargas se duplica y las cargas no cambian, ¿qué pasa con la fuerza?",
      correct: "Se divide entre 4",
      wrong: "Se divide entre 2"
    },
    {
      tag: "Carga",
      prompt: "Si una de las cargas se duplica y todo lo demás permanece igual, ¿qué pasa con la fuerza?",
      correct: "También se duplica",
      wrong: "Se cuadruplica"
    },
    {
      tag: "Constante k",
      prompt: "¿Qué valor aproximado usamos para la constante de Coulomb en el aire o vacío?",
      correct: m(String.raw`9 \times 10^9\,\mathrm{N\,m^2/C^2}`),
      wrong: m(String.raw`9 \times 10^{-9}\,\mathrm{N\,m^2/C^2}`)
    },
    {
      tag: "Unidad",
      prompt: "¿En qué unidad del SI se expresa la fuerza eléctrica?",
      correct: m(String.raw`\mathrm{N}`),
      wrong: m(String.raw`\mathrm{C}`)
    },
    {
      tag: "Preparación del problema",
      prompt: `Antes de sustituir en la fórmula, ¿a cuánto equivale una distancia de ${m(String.raw`60\,\mathrm{mm}`)} en metros?`,
      correct: m(String.raw`0.060\,\mathrm{m}`),
      wrong: m(String.raw`0.006\,\mathrm{m}`)
    }
  ];

  const quizCard = document.querySelector("[data-quiz-card]");
  const questionType = document.querySelector("[data-question-type]");
  const questionTag = document.querySelector("[data-question-tag]");
  const questionPrompt = document.querySelector("[data-question-prompt]");
  const answers = document.querySelector("[data-answers]");
  const feedback = document.querySelector("[data-feedback]");
  const manualNext = document.querySelector("[data-manual-next]");
  const nextButton = document.querySelector("[data-next-question]");
  const progressLabel = document.querySelector("[data-progress-label]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const finalProblem = document.querySelector("[data-final-problem]");
  const problemForm = document.querySelector("[data-problem-form]");
  const forceInput = document.querySelector("[data-force-answer]");
  const interactionInputs = [...document.querySelectorAll("[data-interaction]")];
  const problemFeedback = document.querySelector("[data-problem-feedback]");
  const historyList = document.querySelector("[data-history-list]");
  const historyEmpty = document.querySelector("[data-history-empty]");
  const resetProgressButton = document.querySelector("[data-reset-progress]");
  const resultCard = document.querySelector("[data-result]");
  const resultScore = document.querySelector("[data-result-score]");
  const restartButton = document.querySelector("[data-restart]");
  const guideDialog = document.querySelector("[data-guide-dialog]");
  const openGuide = document.querySelector("[data-open-guide]");
  const closeGuide = document.querySelector("[data-close-guide]");

  let state = loadState();
  state.history.filter(e=>e.correct===false).forEach(e=>{const x=questions[e.questionIndex];if(x)window.repasoFisica?.registrar({type:"choice",prompt:x.prompt,options:[x.correct,x.wrong],correct:x.correct},false,true);});
  let locked = false;
  let autoTimer = null;

  function defaultState() {
    return {
      history: [],
      forceAnswer: "",
      interactionAnswer: "",
      finalSolved: false
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!parsed || !Array.isArray(parsed.history)) return defaultState();
      return { ...defaultState(), ...parsed };
    } catch (error) {
      return defaultState();
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* La actividad continúa sin persistencia. */ }
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function currentQuestionIndex() {
    return Math.min(state.history.length, questions.length);
  }

  function correctConceptCount() {
    return state.history.filter((item) => item.correct).length;
  }

  function updateProgress() {
    const answered = Math.min(state.history.length, questions.length);
    if (answered < questions.length) {
      progressLabel.textContent = `${answered + 1} / ${questions.length}`;
      progressBar.style.width = `${((answered + 1) / (questions.length + 1)) * 100}%`;
    } else if (!state.finalSolved) {
      progressLabel.textContent = "Reto final";
      progressBar.style.width = `${(questions.length / (questions.length + 1)) * 100}%`;
    } else {
      progressLabel.textContent = "Completada";
      progressBar.style.width = "100%";
    }
  }

  function renderHistory() {
    historyList.querySelectorAll(".history-item").forEach((item) => item.remove());
    historyEmpty.hidden = state.history.length > 0;

    state.history.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "history-item";

      const number = document.createElement("span");
      number.className = "history-index";
      number.textContent = String(index + 1);

      const copy = document.createElement("div");
      copy.className = "history-copy";
      const title = document.createElement("strong");
      title.textContent = item.prompt;
      const answer = document.createElement("span");
      answer.textContent = `Tu respuesta: ${item.selected}`;
      copy.append(title, answer);

      const status = document.createElement("span");
      status.className = `history-status ${item.correct ? "ok" : "no"}`;
      status.textContent = item.correct ? "Correcta" : `Correcta: ${item.correctAnswer}`;

      li.append(number, copy, status);
      historyList.appendChild(li);
    });
    window.typesetMath?.(historyList);
  }

  function renderQuestion() {
    clearTimeout(autoTimer);
    locked = false;
    feedback.hidden = true;
    feedback.className = "feedback";
    manualNext.hidden = true;

    const index = currentQuestionIndex();
    if (index >= questions.length) {
      showFinalProblem();
      return;
    }

    quizCard.hidden = false;
    finalProblem.hidden = true;
    resultCard.hidden = true;

    const question = questions[index];
    questionType.textContent = "Idea clave";
    questionTag.textContent = question.tag;
    questionPrompt.textContent = question.prompt;
    answers.innerHTML = "";

    shuffle([question.correct, question.wrong]).forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = option;
      button.dataset.value = option;
      button.addEventListener("click", () => checkAnswer(button, question, index));
      answers.appendChild(button);
    });

    updateProgress();
    window.typesetMath?.(questionPrompt, answers);
  }

  function checkAnswer(selectedButton, question, index) {
    if (locked) return;
    locked = true;

    const buttons = [...answers.querySelectorAll(".answer-button")];
    buttons.forEach((button) => { button.disabled = true; });

    const isCorrect = selectedButton.dataset.value === question.correct;
    window.repasoFisica?.registrar({type:"choice",prompt:question.prompt,options:[question.correct,question.wrong],correct:question.correct},isCorrect);
    state.history.push({
      questionIndex: index,
      prompt: question.prompt,
      selected: selectedButton.dataset.value,
      correctAnswer: question.correct,
      correct: isCorrect
    });
    saveState();
    renderHistory();

    if (isCorrect) {
      selectedButton.classList.add("correct");
      feedback.textContent = "¡Bien!";
      feedback.classList.add("success");
      feedback.hidden = false;
      autoTimer = window.setTimeout(renderQuestion, 1000);
      return;
    }

    selectedButton.classList.add("wrong");
    const correctButton = buttons.find((button) => button.dataset.value === question.correct);
    if (correctButton) correctButton.classList.add("correct");
    feedback.innerHTML = `No era esa. La respuesta correcta es <strong>${question.correct}</strong>.`;
    window.typesetMath?.(feedback);
    feedback.classList.add("error");
    feedback.hidden = false;
    manualNext.hidden = false;
    nextButton.focus();
  }

  function showFinalProblem() {
    clearTimeout(autoTimer);
    quizCard.hidden = true;
    finalProblem.hidden = false;
    resultCard.hidden = true;
    forceInput.value = state.forceAnswer || "";
    interactionInputs.forEach((input) => {
      input.checked = input.value === state.interactionAnswer;
    });
    problemFeedback.hidden = true;
    problemFeedback.className = "problem-feedback";
    updateProgress();

    if (state.finalSolved) {
      showResult();
    }
  }

  function parseNumber(value) {
    const normalized = String(value).trim().replace(/\s+/g, "").replace(",", ".");
    if (!normalized) return NaN;
    return Number(normalized);
  }

  function saveProblemDraft() {
    state.forceAnswer = forceInput.value;
    state.interactionAnswer = interactionInputs.find((input) => input.checked)?.value || "";
    saveState();
  }

  function checkProblem(event) {
    event.preventDefault();
    saveProblemDraft();

    const force = parseNumber(state.forceAnswer);
    if (!Number.isFinite(force) || !state.interactionAnswer) {
      problemFeedback.hidden = false;
      problemFeedback.className = "problem-feedback error";
      problemFeedback.textContent = "Completa la magnitud y selecciona la interacción.";
      return;
    }
    const forceCorrect = Number.isFinite(force) && Math.abs(force - 720) <= 1;
    const interactionCorrect = state.interactionAnswer === "atraccion";
    window.repasoFisica?.registrar({type:"coulomb",prompt:"Calcula la fuerza entre \\(q_1=-16\\,\\mu C\\), \\(q_2=18\\,\\mu C\\), separadas \\(60\\,\\mathrm{mm}\\), con \\(k=9\\times10^9\\,\\mathrm{N\\,m^2/C^2}\\).",answer:720,tolerance:1,unit:"N",interaction:"atraccion"},forceCorrect&&interactionCorrect);

    problemFeedback.hidden = false;
    if (forceCorrect && interactionCorrect) {
      state.finalSolved = true;
      saveState();
      problemFeedback.className = "problem-feedback success";
      problemFeedback.innerHTML = `<strong>Correcto.</strong> La magnitud es ${m(String.raw`720\,\mathrm{N}`)} y, como las cargas tienen signos opuestos, la interacción es de atracción.`;
      window.typesetMath?.(problemFeedback);
      updateProgress();
      window.setTimeout(showResult, 900);
      return;
    }

    const parts = [];
    if (!forceCorrect) parts.push(`la magnitud correcta es ${m(String.raw`720\,\mathrm{N}`)}`);
    if (!interactionCorrect) parts.push("la interacción correcta es atracción");
    problemFeedback.className = "problem-feedback error";
    problemFeedback.innerHTML = `<strong>Revisa:</strong> ${parts.join(" y ")}. <span class="solution-line">${m(String.raw`F=(9\times10^9)\frac{|(-16\times10^{-6})(18\times10^{-6})|}{(0.060)^2}=720\,\mathrm{N}`)}</span>`;
    window.typesetMath?.(problemFeedback);
  }

  function showResult() {
    quizCard.hidden = true;
    finalProblem.hidden = true;
    resultCard.hidden = false;
    updateProgress();
    const correct = correctConceptCount();
    resultScore.textContent = `En las preguntas de repaso acertaste ${correct} de ${questions.length}. Además resolviste el problema final: ${m(String.raw`720\,\mathrm{N}`)}, atracción.`;
    window.typesetMath?.(resultScore);
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function resetProgress() {
    clearTimeout(autoTimer);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Reinicio en memoria. */ }
    state = defaultState();
    renderHistory();
    forceInput.value = "";
    interactionInputs.forEach((input) => { input.checked = false; });
    renderQuestion();
    quizCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  forceInput.addEventListener("input", saveProblemDraft);
  interactionInputs.forEach((input) => input.addEventListener("change", saveProblemDraft));
  problemForm.addEventListener("submit", checkProblem);
  nextButton.addEventListener("click", renderQuestion);
  resetProgressButton.addEventListener("click", resetProgress);
  restartButton.addEventListener("click", resetProgress);

  openGuide.addEventListener("click", () => guideDialog.showModal());
  closeGuide.addEventListener("click", () => guideDialog.close());
  guideDialog.addEventListener("click", (event) => {
    if (event.target === guideDialog) guideDialog.close();
  });
  guideDialog.addEventListener("cancel", () => guideDialog.close());

  renderHistory();
  if (state.finalSolved) showResult();
  else renderQuestion();
})();
