(() => {
  const STORAGE_KEY = "repaso-fisica-actividad-5-electricidad-basica-v1";
  const m = (tex) => `\\(${tex}\\)`;

  const levels = [
    {
      id: "corriente",
      kicker: "Nivel 1",
      title: "Intensidad de corriente",
      shortTitle: "Corriente",
      description: "Recuerda qué relaciona la corriente, su unidad y cómo pasar de corriente a cantidad de carga.",
      questions: [
        { tag: "Fórmula", prompt: "¿Cuál es la fórmula de la intensidad de corriente?", correct: m(String.raw`I=\frac{Q}{t}`), wrong: m(String.raw`I=Q\,t`) },
        { tag: "Unidad", prompt: "¿En qué unidad del SI se mide la intensidad de corriente?", correct: `amperes ${m(String.raw`\mathrm{A}`)}`, wrong: `coulombs ${m(String.raw`\mathrm{C}`)}` },
        { tag: "Interpretación", prompt: `Una corriente de ${m(String.raw`1\,\mathrm{A}`)} equivale a…`, correct: `${m(String.raw`1\,\mathrm{C/s}`)} de carga`, wrong: `${m(String.raw`1\,\mathrm{J/C}`)} de energía` },
        { tag: "Despeje", prompt: `Si conoces ${m("I")} y ${m("t")}, ¿cómo calculas la carga ${m("Q")}?`, correct: m(String.raw`Q=It`), wrong: m(String.raw`Q=\frac{I}{t}`) }
      ],
      problem: {
        type: "electrons",
        title: "¿Cuántos electrones fluyen?",
        prompt: `¿Cuántos electrones fluyen en ${m(String.raw`30\,\mathrm{min}`)} por un circuito donde circula una corriente de ${m(String.raw`150\,\mathrm{mA}`)}?`,
        data: [m(String.raw`I=150\,\mathrm{mA}`), m(String.raw`t=30\,\mathrm{min}`), m(String.raw`e=1.602\times10^{-19}\,\mathrm{C}`)],
        answerText: `${m(String.raw`\approx 1.69\times10^{21}`)} electrones`
      }
    },
    {
      id: "voltaje",
      kicker: "Nivel 2",
      title: "Voltaje",
      shortTitle: "Voltaje",
      description: "Relaciona diferencia de potencial, energía, carga y la unidad volt.",
      questions: [
        { tag: "Concepto", prompt: "El voltaje representa…", correct: "la diferencia de potencial", wrong: "la cantidad de electrones por segundo" },
        { tag: "Fórmula", prompt: "¿Cuál es la relación entre voltaje, energía y carga?", correct: m(String.raw`V=\frac{E}{q}`), wrong: m(String.raw`V=Eq`) },
        { tag: "Unidad", prompt: "¿En qué unidad se mide el voltaje?", correct: `volts ${m(String.raw`\mathrm{V}`)}`, wrong: `amperes ${m(String.raw`\mathrm{A}`)}` }
      ],
      problem: {
        type: "number",
        title: "Calcula la diferencia de potencial",
        prompt: `Se utilizan ${m(String.raw`24\,\mathrm{J}`)} de energía para mover una carga de ${m(String.raw`3\,\mathrm{C}`)}. ¿Cuál es el voltaje?`,
        data: [m(String.raw`E=24\,\mathrm{J}`), m(String.raw`q=3\,\mathrm{C}`), m(String.raw`V=\frac{E}{q}`)],
        target: 8,
        tolerance: 0.01,
        unit: m(String.raw`\mathrm{V}`),
        answerText: m(String.raw`8\,\mathrm{V}`)
      }
    },
    {
      id: "resistencia",
      kicker: "Nivel 3",
      title: "Resistencia y resistividad",
      shortTitle: "Resistencia",
      description: "Distingue resistencia de resistividad y recuerda cómo influyen material, longitud y área.",
      questions: [
        { tag: "Fórmula", prompt: "¿Cuál es la fórmula de la resistencia de un conductor uniforme?", correct: m(String.raw`R=\frac{\rho L}{A}`), wrong: m(String.raw`R=\frac{\rho A}{L}`) },
        { tag: "Concepto", prompt: "La resistencia R indica…", correct: "la oposición de un conductor al paso de corriente", wrong: "la energía entregada por cada coulomb" },
        { tag: "Unidad", prompt: `¿En qué unidad se mide la resistencia ${m("R")}?`, correct: `ohms ${m(String.raw`\Omega`)}`, wrong: m(String.raw`\Omega\cdot\mathrm{m}`) },
        { tag: "Resistividad", prompt: `¿En qué unidad se expresa la resistividad ${m(String.raw`\rho`)}?`, correct: m(String.raw`\Omega\cdot\mathrm{m}`), wrong: m(String.raw`\Omega/\mathrm{m}`) },
        { tag: "Concepto", prompt: `La resistividad ${m(String.raw`\rho`)} describe principalmente…`, correct: "qué tanto se opone un material al paso de corriente", wrong: "cuánta carga atraviesa el conductor cada segundo" },
        { tag: "Longitud", prompt: "Si aumenta la longitud del conductor y lo demás no cambia, la resistencia…", correct: "aumenta", wrong: "disminuye" },
        { tag: "Área", prompt: "Si aumenta el área transversal del conductor y lo demás no cambia, la resistencia…", correct: "disminuye", wrong: "aumenta" }
      ],
      problem: {
        type: "number",
        title: "Calcula la resistencia",
        prompt: `Un conductor de cobre tiene longitud de ${m(String.raw`10\,\mathrm{m}`)}, área transversal de ${m(String.raw`1\times10^{-6}\,\mathrm{m^2}`)} y resistividad ${m(String.raw`1.72\times10^{-8}\,\Omega\cdot\mathrm{m}`)}. Calcula ${m("R")}.`,
        data: [m(String.raw`\rho=1.72\times10^{-8}\,\Omega\cdot\mathrm{m}`), m(String.raw`L=10\,\mathrm{m}`), m(String.raw`A=1\times10^{-6}\,\mathrm{m^2}`)],
        target: 0.172,
        tolerance: 0.002,
        unit: m(String.raw`\Omega`),
        answerText: m(String.raw`0.172\,\Omega`)
      }
    },
    {
      id: "tabla",
      kicker: "Nivel 4",
      title: "Tabla de resistividades",
      shortTitle: "Tabla de resistividades",
      description: `Reconoce algunos valores de resistividad a ${m(String.raw`20\,^\circ\mathrm{C}`)}. Puedes consultar la tabla cuando lo necesites.`,
      questions: [
        { tag: "Cobre", prompt: `¿Cuál es la resistividad del cobre a ${m(String.raw`20\,^\circ\mathrm{C}`)}?`, correct: m(String.raw`1.72\times10^{-8}\,\Omega\cdot\mathrm{m}`), wrong: m(String.raw`2.8\times10^{-8}\,\Omega\cdot\mathrm{m}`) },
        { tag: "Plata", prompt: `¿Cuál es la resistividad de la plata a ${m(String.raw`20\,^\circ\mathrm{C}`)}?`, correct: m(String.raw`1.6\times10^{-8}\,\Omega\cdot\mathrm{m}`), wrong: m(String.raw`2.4\times10^{-8}\,\Omega\cdot\mathrm{m}`) },
        { tag: "Aluminio", prompt: `¿Cuál es la resistividad del aluminio a ${m(String.raw`20\,^\circ\mathrm{C}`)}?`, correct: m(String.raw`2.8\times10^{-8}\,\Omega\cdot\mathrm{m}`), wrong: m(String.raw`5.5\times10^{-8}\,\Omega\cdot\mathrm{m}`) },
        { tag: "Tungsteno", prompt: `¿Cuál es la resistividad del tungsteno a ${m(String.raw`20\,^\circ\mathrm{C}`)}?`, correct: m(String.raw`5.5\times10^{-8}\,\Omega\cdot\mathrm{m}`), wrong: m(String.raw`9.5\times10^{-8}\,\Omega\cdot\mathrm{m}`) },
        { tag: "Oro", prompt: `¿Cuál es la resistividad del oro a ${m(String.raw`20\,^\circ\mathrm{C}`)}?`, correct: m(String.raw`2.4\times10^{-8}\,\Omega\cdot\mathrm{m}`), wrong: m(String.raw`10\times10^{-8}\,\Omega\cdot\mathrm{m}`) },
        { tag: "Nicromo", prompt: `¿Cuál es la resistividad del nicromo a ${m(String.raw`20\,^\circ\mathrm{C}`)}?`, correct: m(String.raw`100\times10^{-8}\,\Omega\cdot\mathrm{m}`), wrong: m(String.raw`9.5\times10^{-8}\,\Omega\cdot\mathrm{m}`) }
      ]
    },
    {
      id: "mixto",
      kicker: "Nivel 5",
      title: "Reto mixto",
      shortTitle: "Reto mixto",
      description: "Cierra el repaso mezclando corriente, voltaje, resistencia, conversiones y resistividad.",
      questions: [
        { tag: "Conversión", prompt: `Para trabajar en SI, ${m(String.raw`150\,\mathrm{mA}`)} equivalen a…`, correct: m(String.raw`0.150\,\mathrm{A}`), wrong: m(String.raw`1.50\,\mathrm{A}`) },
        { tag: "Tiempo", prompt: `${m(String.raw`30\,\mathrm{min}`)} equivalen a…`, correct: m(String.raw`1800\,\mathrm{s}`), wrong: m(String.raw`300\,\mathrm{s}`) },
        { tag: "Voltaje", prompt: `Si ${m(String.raw`E=18\,\mathrm{J}`)} y ${m(String.raw`q=3\,\mathrm{C}`)}, entonces ${m("V")} es…`, correct: m(String.raw`6\,\mathrm{V}`), wrong: m(String.raw`54\,\mathrm{V}`) },
        { tag: "Geometría", prompt: `Según ${m(String.raw`R=\frac{\rho L}{A}`)}, duplicar el área transversal hace que ${m("R")}…`, correct: "se reduzca a la mitad", wrong: "se duplique" },
        { tag: "Materiales", prompt: `Entre plata ${m(String.raw`(1.6\times10^{-8})`)} y nicromo ${m(String.raw`(100\times10^{-8})`)}, ¿cuál tiene menor resistividad?`, correct: "Plata", wrong: "Nicromo" }
      ]
    }
  ];

  const levelNav = document.querySelector("[data-level-nav]");
  const levelKicker = document.querySelector("[data-level-kicker]");
  const levelTitle = document.querySelector("[data-level-title]");
  const levelDescription = document.querySelector("[data-level-description]");
  const overallCount = document.querySelector("[data-overall-count]");
  const progressLabel = document.querySelector("[data-progress-label]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const quizCard = document.querySelector("[data-quiz-card]");
  const questionTag = document.querySelector("[data-question-tag]");
  const questionPrompt = document.querySelector("[data-question-prompt]");
  const answers = document.querySelector("[data-answers]");
  const feedback = document.querySelector("[data-feedback]");
  const manualNext = document.querySelector("[data-manual-next]");
  const nextQuestionButton = document.querySelector("[data-next-question]");
  const problemCard = document.querySelector("[data-problem-card]");
  const problemTitle = document.querySelector("[data-problem-title]");
  const problemPrompt = document.querySelector("[data-problem-prompt]");
  const problemData = document.querySelector("[data-problem-data]");
  const problemForm = document.querySelector("[data-problem-form]");
  const problemFeedback = document.querySelector("[data-problem-feedback]");
  const levelResult = document.querySelector("[data-level-result]");
  const levelResultTitle = document.querySelector("[data-level-result-title]");
  const levelResultCopy = document.querySelector("[data-level-result-copy]");
  const nextLevelButton = document.querySelector("[data-next-level]");
  const repeatLevelButton = document.querySelector("[data-repeat-level]");
  const historyList = document.querySelector("[data-history-list]");
  const historyEmpty = document.querySelector("[data-history-empty]");
  const resetActivityButton = document.querySelector("[data-reset-activity]");
  const activityResult = document.querySelector("[data-activity-result]");
  const activityResultCopy = document.querySelector("[data-activity-result-copy]");
  const restartActivityButton = document.querySelector("[data-restart-activity]");
  const guideDialog = document.querySelector("[data-guide-dialog]");
  const tableDialog = document.querySelector("[data-table-dialog]");

  let state = loadState();
  levels.forEach(l=>state.levels[l.id].history.filter(e=>e.correct===false).forEach(e=>{const x=l.questions.find(q=>q.prompt===e.prompt);if(x)window.repasoFisica?.registrar({type:"choice",prompt:x.prompt,options:[x.correct,x.wrong],correct:x.correct},false,true);}));
  let locked = false;
  let autoTimer = null;

  function blankLevelState() {
    return { history: [], problemDraft: {}, problemSolved: false, complete: false };
  }

  function defaultState() {
    return {
      activeLevel: "corriente",
      levels: Object.fromEntries(levels.map((level) => [level.id, blankLevelState()]))
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !saved.levels) return base;
      levels.forEach((level) => {
        base.levels[level.id] = { ...blankLevelState(), ...(saved.levels[level.id] || {}) };
        if (!Array.isArray(base.levels[level.id].history)) base.levels[level.id].history = [];
      });
      if (levels.some((level) => level.id === saved.activeLevel)) base.activeLevel = saved.activeLevel;
      return base;
    } catch (error) {
      return base;
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* La actividad continúa sin persistencia. */ }
  }

  function currentLevel() {
    return levels.find((level) => level.id === state.activeLevel) || levels[0];
  }

  function currentLevelState() {
    return state.levels[currentLevel().id];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function parseNumber(value) {
    const normalized = String(value ?? "").trim().replace(/\s+/g, "").replace(",", ".");
    if (!normalized) return NaN;
    return Number(normalized);
  }

  function completedCount() {
    return levels.filter((level) => state.levels[level.id].complete).length;
  }

  function renderLevelNav() {
    levelNav.innerHTML = "";
    levels.forEach((level, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-button";
      if (level.id === state.activeLevel) button.classList.add("active");
      if (state.levels[level.id].complete) button.classList.add("complete");
      button.innerHTML = `<small>Nivel ${index + 1}</small><strong>${level.shortTitle}</strong>`;
      button.addEventListener("click", () => switchLevel(level.id));
      levelNav.appendChild(button);
    });
    overallCount.textContent = `${completedCount()} / ${levels.length}`;
  }

  function renderHeader() {
    const level = currentLevel();
    levelKicker.textContent = level.kicker;
    levelTitle.textContent = level.title;
    levelDescription.textContent = level.description;
    window.typesetMath?.(levelTitle, levelDescription);
  }

  function totalSteps(level) {
    return level.questions.length + (level.problem ? 1 : 0);
  }

  function updateProgress() {
    const level = currentLevel();
    const ls = currentLevelState();
    const steps = totalSteps(level);
    let completedSteps = Math.min(ls.history.length, level.questions.length);
    if (level.problem && ls.problemSolved) completedSteps += 1;
    if (!level.problem && ls.complete) completedSteps = steps;

    if (ls.complete) {
      progressLabel.textContent = "Completado";
      progressBar.style.width = "100%";
    } else if (ls.history.length < level.questions.length) {
      progressLabel.textContent = `${ls.history.length + 1} / ${steps}`;
      progressBar.style.width = `${((ls.history.length + 1) / steps) * 100}%`;
    } else if (level.problem && !ls.problemSolved) {
      progressLabel.textContent = `Problema ${steps} / ${steps}`;
      progressBar.style.width = `${((steps - 0.35) / steps) * 100}%`;
    } else {
      progressLabel.textContent = `${completedSteps} / ${steps}`;
      progressBar.style.width = `${(completedSteps / steps) * 100}%`;
    }
  }

  function renderHistory() {
    const level = currentLevel();
    const ls = currentLevelState();
    historyList.querySelectorAll(".history-item").forEach((item) => item.remove());
    historyEmpty.hidden = ls.history.length > 0 || ls.problemSolved;

    ls.history.forEach((item, index) => {
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

    if (ls.problemSolved && level.problem) {
      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `<span class="history-index">★</span><div class="history-copy"><strong>${level.problem.title}</strong><span>Respuesta: ${level.problem.answerText}</span></div><span class="history-status ok">Correcta</span>`;
      historyList.appendChild(li);
    }
    window.typesetMath?.(historyList);
  }

  function hideStageCards() {
    quizCard.hidden = true;
    problemCard.hidden = true;
    levelResult.hidden = true;
    activityResult.hidden = true;
  }

  function renderQuestion() {
    clearTimeout(autoTimer);
    locked = false;
    feedback.hidden = true;
    feedback.className = "feedback";
    manualNext.hidden = true;

    const level = currentLevel();
    const ls = currentLevelState();
    const index = ls.history.length;

    if (index >= level.questions.length) {
      if (level.problem && !ls.problemSolved) renderProblem();
      else finishLevel();
      return;
    }

    hideStageCards();
    quizCard.hidden = false;
    const q = level.questions[index];
    questionTag.textContent = q.tag;
    questionPrompt.textContent = q.prompt;
    answers.innerHTML = "";
    shuffle([q.correct, q.wrong]).forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = option;
      button.dataset.value = option;
      button.addEventListener("click", () => checkAnswer(button, q));
      answers.appendChild(button);
    });
    updateProgress();
    renderHistory();
    window.typesetMath?.(questionPrompt, answers, historyList);
  }

  function checkAnswer(selectedButton, question) {
    if (locked) return;
    locked = true;
    const buttons = [...answers.querySelectorAll(".answer-button")];
    buttons.forEach((button) => { button.disabled = true; });
    const isCorrect = selectedButton.dataset.value === question.correct;
    window.repasoFisica?.registrar({type:"choice",prompt:question.prompt,options:[question.correct,question.wrong],correct:question.correct},isCorrect);
    currentLevelState().history.push({
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
    } else {
      selectedButton.classList.add("wrong");
      const correctButton = buttons.find((button) => button.dataset.value === question.correct);
      if (correctButton) correctButton.classList.add("correct");
      feedback.innerHTML = `No era esa. La respuesta correcta es <strong>${question.correct}</strong>.`;
      window.typesetMath?.(feedback);
      feedback.classList.add("error");
      feedback.hidden = false;
      manualNext.hidden = false;
      nextQuestionButton.focus();
    }
    updateProgress();
  }

  function renderProblem() {
    const level = currentLevel();
    const ls = currentLevelState();
    if (!level.problem) { finishLevel(); return; }
    hideStageCards();
    problemCard.hidden = false;
    problemFeedback.hidden = true;
    problemFeedback.className = "problem-feedback";
    problemTitle.textContent = level.problem.title;
    problemPrompt.textContent = level.problem.prompt;
    problemData.innerHTML = "";
    level.problem.data.forEach((item) => {
      const span = document.createElement("span");
      span.className = "data-chip";
      span.textContent = item;
      problemData.appendChild(span);
    });
    problemForm.innerHTML = "";

    if (level.problem.type === "electrons") {
      const wrapper = document.createElement("div");
      wrapper.className = "field-group";
      wrapper.innerHTML = `
        <label for="electron-coef">Número de electrones en notación científica</label>
        <div class="scientific-input">
          <input id="electron-coef" name="coefficient" type="text" inputmode="decimal" autocomplete="off" aria-label="Coeficiente">
          <span>${m(String.raw`\times 10`)}</span>
          <input id="electron-exp" name="exponent" type="number" inputmode="numeric" autocomplete="off" aria-label="Exponente">
          <span class="electron-unit">electrones</span>
        </div>
        `;
      problemForm.appendChild(wrapper);
      const coef = wrapper.querySelector("[name=coefficient]");
      const exp = wrapper.querySelector("[name=exponent]");
      coef.value = ls.problemDraft.coefficient || "";
      exp.value = ls.problemDraft.exponent || "";
      [coef, exp].forEach((input) => input.addEventListener("input", saveProblemDraft));
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "field-group";
      wrapper.innerHTML = `<label for="number-answer">Resultado</label><div class="input-with-unit"><input id="number-answer" name="value" type="text" inputmode="decimal" autocomplete="off"><span>${level.problem.unit}</span></div>`;
      problemForm.appendChild(wrapper);
      const input = wrapper.querySelector("[name=value]");
      input.value = ls.problemDraft.value || "";
      input.addEventListener("input", saveProblemDraft);
    }

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "primary-button";
    submit.textContent = "Comprobar ejercicio";
    problemForm.appendChild(submit);
    updateProgress();
    renderHistory();
    window.typesetMath?.(problemPrompt, problemData, problemForm, historyList);
  }

  function saveProblemDraft() {
    const ls = currentLevelState();
    const data = new FormData(problemForm);
    ls.problemDraft = Object.fromEntries(data.entries());
    saveState();
  }

  function checkProblem(event) {
    event.preventDefault();
    const level = currentLevel();
    const ls = currentLevelState();
    if (!level.problem) return;
    saveProblemDraft();

    const validInput = level.problem.type === "electrons"
      ? Number.isFinite(parseNumber(ls.problemDraft.coefficient)) && Number.isInteger(parseNumber(ls.problemDraft.exponent))
      : Number.isFinite(parseNumber(ls.problemDraft.value));
    if (!validInput) {
      problemFeedback.hidden = false;
      problemFeedback.className = "problem-feedback error";
      problemFeedback.textContent = "Completa la respuesta con números válidos.";
      return;
    }

    let correct = false;
    let explanation = "";
    if (level.problem.type === "electrons") {
      const coefficient = parseNumber(ls.problemDraft.coefficient);
      const exponent = Number(ls.problemDraft.exponent);
      correct = Number.isFinite(coefficient) && Math.abs(coefficient - 1.685) <= 0.03 && exponent === 21;
      explanation = `${m(String.raw`I=0.150\,\mathrm{A}`)}, ${m(String.raw`t=1800\,\mathrm{s}`)}, ${m(String.raw`Q=It=270\,\mathrm{C}`)} y ${m(String.raw`N=\frac{Q}{e}\approx1.69\times10^{21}`)} electrones.`;
    } else {
      const value = parseNumber(ls.problemDraft.value);
      correct = Number.isFinite(value) && Math.abs(value - level.problem.target) <= level.problem.tolerance;
      if (level.id === "voltaje") explanation = m(String.raw`V=\frac{E}{q}=\frac{24}{3}=8\,\mathrm{V}`);
      if (level.id === "resistencia") explanation = m(String.raw`R=\frac{\rho L}{A}=\frac{(1.72\times10^{-8})(10)}{1\times10^{-6}}=0.172\,\Omega`);
    }

    window.repasoFisica?.registrar(level.problem.type === "electrons"
      ? {type:"scientific",prompt:level.problem.prompt+" "+level.problem.data.join("; "),coefficient:1.685,exponent:21,tolerance:.03}
      : {type:"numeric",prompt:level.problem.prompt,answer:level.problem.target,tolerance:level.problem.tolerance,unit:level.problem.unit},correct);
    problemFeedback.hidden = false;
    if (correct) {
      ls.problemSolved = true;
      ls.complete = true;
      saveState();
      problemFeedback.className = "problem-feedback success";
      problemFeedback.innerHTML = `<strong>Correcto.</strong> ${explanation}`;
      window.typesetMath?.(problemFeedback);
      renderHistory();
      renderLevelNav();
      updateProgress();
      window.setTimeout(finishLevel, 900);
    } else {
      problemFeedback.className = "problem-feedback error";
      problemFeedback.innerHTML = `<strong>Revisa el cálculo.</strong> <span class="solution-line">${explanation}</span>`;
      window.typesetMath?.(problemFeedback);
    }
  }

  function finishLevel() {
    const level = currentLevel();
    const ls = currentLevelState();
    if (!level.problem) {
      ls.complete = true;
      saveState();
    }
    hideStageCards();

    const currentIndex = levels.findIndex((item) => item.id === level.id);
    if (completedCount() === levels.length && currentIndex === levels.length - 1) {
      activityResult.hidden = false;
      const totalQuestions = levels.reduce((sum, item) => sum + item.questions.length, 0);
      const correct = levels.reduce((sum, item) => sum + state.levels[item.id].history.filter((answer) => answer.correct).length, 0);
      activityResultCopy.textContent = `Completaste los cinco niveles. En las preguntas rápidas acertaste ${correct} de ${totalQuestions}; además resolviste los problemas numéricos de corriente, voltaje y resistencia.`;
      renderLevelNav();
      updateProgress();
      return;
    }

    levelResult.hidden = false;
    const correct = ls.history.filter((answer) => answer.correct).length;
    levelResultTitle.textContent = `${level.title} completado.`;
    levelResultCopy.textContent = `Acertaste ${correct} de ${level.questions.length} preguntas rápidas${level.problem ? " y completaste el problema del nivel" : ""}. Puedes repetirlo o continuar.`;
    nextLevelButton.hidden = currentIndex >= levels.length - 1;
    if (!nextLevelButton.hidden) nextLevelButton.textContent = `Siguiente nivel · ${levels[currentIndex + 1].shortTitle}`;
    renderLevelNav();
    updateProgress();
  }

  function switchLevel(id) {
    clearTimeout(autoTimer);
    state.activeLevel = id;
    saveState();
    renderAll();
    document.querySelector(".level-heading").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goNextLevel() {
    const index = levels.findIndex((level) => level.id === state.activeLevel);
    if (index < levels.length - 1) switchLevel(levels[index + 1].id);
  }

  function resetLevel() {
    clearTimeout(autoTimer);
    state.levels[state.activeLevel] = blankLevelState();
    saveState();
    renderAll();
  }

  function resetWholeActivity() {
    clearTimeout(autoTimer);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Reinicio en memoria. */ }
    state = defaultState();
    renderAll();
  }

  function renderAll() {
    renderHeader();
    renderLevelNav();
    renderHistory();
    const ls = currentLevelState();
    if (ls.complete) finishLevel();
    else renderQuestion();
  }

  nextQuestionButton.addEventListener("click", renderQuestion);
  problemForm.addEventListener("submit", checkProblem);
  nextLevelButton.addEventListener("click", goNextLevel);
  repeatLevelButton.addEventListener("click", resetLevel);
  resetActivityButton.addEventListener("click", resetWholeActivity);
  restartActivityButton.addEventListener("click", resetWholeActivity);

  document.querySelector("[data-open-guide]").addEventListener("click", () => guideDialog.showModal());
  document.querySelector("[data-close-guide]").addEventListener("click", () => guideDialog.close());
  document.querySelector("[data-open-table]").addEventListener("click", () => tableDialog.showModal());
  document.querySelector("[data-close-table]").addEventListener("click", () => tableDialog.close());
  [guideDialog, tableDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("cancel", () => dialog.close());
  });

  renderAll();
})();
