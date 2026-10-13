(() => {
  const STORAGE_KEY = "repaso-fisica-actividad-3-operaciones-v1";
  const m = (tex) => `\\(${tex}\\)`;
  const md = (tex) => `\\[${tex}\\]`;
  const exercises = [
    { type: "Multiplicación", tex: String.raw`(2 \times 10^{2})(5 \times 10^{-6})`, coefficient: 1, exponent: -3 },
    { type: "Multiplicación", tex: String.raw`(19 \times 10^{6})(0.5 \times 10^{-4})`, coefficient: 9.5, exponent: 2 },
    { type: "División", tex: String.raw`\frac{16 \times 10^{8}}{4 \times 10^{9}}`, coefficient: 4, exponent: -1 },
    { type: "División", tex: String.raw`\frac{2 \times 10^{-6}}{0.5 \times 10^{-16}}`, coefficient: 4, exponent: 10 },
    { type: "Expresión combinada", tex: String.raw`\frac{(5 \times 10^{2})(12 \times 10^{3})}{20 \times 10^{9}}`, coefficient: 3, exponent: -4 },
    { type: "Expresión combinada", tex: String.raw`\frac{16 \times 10^{-7}}{(32 \times 10^{-7})(0.5 \times 10^{-3})}`, coefficient: 1, exponent: 3 },
    { type: "Expresión combinada", tex: String.raw`\frac{(18 \times 10^{8})(2 \times 10^{-4})}{12}`, coefficient: 3, exponent: 4 },
    { type: "Expresión combinada", tex: String.raw`\frac{12(6 \times 10^{6})}{24 \times 10^{6}}`, coefficient: 3, exponent: 0 },
    { type: "Expresión combinada", tex: String.raw`\frac{(55 \times 10^{9})(16 \times 10^{9})}{4 \times 10^{6}}`, coefficient: 2.2, exponent: 14 }
  ];

  const expression = document.querySelector("[data-expression]");
  const exerciseType = document.querySelector("[data-exercise-type]");
  const coefficientInput = document.querySelector("[data-coefficient]");
  const exponentInput = document.querySelector("[data-exponent]");
  const answerForm = document.querySelector("[data-answer-form]");
  const feedback = document.querySelector("[data-feedback]");
  const manualNext = document.querySelector("[data-manual-next]");
  const nextButton = document.querySelector("[data-next-question]");
  const progressLabel = document.querySelector("[data-progress-label]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const exerciseCard = document.querySelector("[data-exercise-card]");
  const historyList = document.querySelector("[data-history-list]");
  const historyEmpty = document.querySelector("[data-history-empty]");
  const resetButton = document.querySelector("[data-reset-progress]");
  const resultCard = document.querySelector("[data-result]");
  const resultScore = document.querySelector("[data-result-score]");
  const restartButton = document.querySelector("[data-restart]");
  const guideDialog = document.querySelector("[data-guide-dialog]");
  const openGuide = document.querySelector("[data-open-guide]");
  const closeGuide = document.querySelector("[data-close-guide]");

  let state = loadState();
  state.history.filter(e=>e.firstTry===false).forEach(e=>{const x=exercises[e.exercise];if(x)window.repasoFisica?.registrar({type:"scientific",prompt:"Simplifica "+m(x.tex),coefficient:x.coefficient,exponent:x.exponent},false,true);});
  let locked = false;
  let autoTimer = null;

  function defaultState() {
    return { current: 0, history: [], draftCoefficient: "", draftExponent: "" };
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

  function parseDecimal(value) {
    const normalized = String(value).trim().replace(/\s+/g, "").replace(",", ".");
    if (!normalized) return NaN;
    return Number(normalized);
  }

  function closeEnough(a, b) {
    return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= Math.max(1e-10, Math.abs(b) * 1e-9);
  }

  function formatAnswer(item) {
    return m(String.raw`${item.coefficient} \times 10^{${item.exponent}}`);
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
      title.textContent = item.type;
      const answer = document.createElement("span");
      answer.textContent = item.answer;
      copy.append(title, answer);
      const status = document.createElement("span");
      status.className = "history-status";
      status.textContent = item.firstTry ? "Correcta" : "Corregida";
      li.append(number, copy, status);
      historyList.appendChild(li);
    });
    window.typesetMath?.(historyList);
  }

  function updateProgress() {
    const current = Math.min(state.current, exercises.length - 1);
    progressLabel.textContent = state.current >= exercises.length ? "Completada" : `${current + 1} / ${exercises.length}`;
    progressBar.style.width = `${(Math.min(state.current + 1, exercises.length) / exercises.length) * 100}%`;
  }

  function renderExercise() {
    clearTimeout(autoTimer);
    locked = false;
    feedback.hidden = true;
    feedback.className = "feedback";
    manualNext.hidden = true;

    if (state.current >= exercises.length) {
      finishActivity();
      return;
    }

    exerciseCard.hidden = false;
    resultCard.hidden = true;
    const item = exercises[state.current];
    exerciseType.textContent = item.type;
    expression.textContent = md(item.tex);
    coefficientInput.value = state.draftCoefficient || "";
    exponentInput.value = state.draftExponent || "";
    updateProgress();
    window.typesetMath?.(expression);
    coefficientInput.focus();
  }

  function saveDraft() {
    state.draftCoefficient = coefficientInput.value;
    state.draftExponent = exponentInput.value;
    saveState();
  }

  function checkAnswer(event) {
    event.preventDefault();
    if (locked) return;
    saveDraft();

    const item = exercises[state.current];
    const coefficient = parseDecimal(state.draftCoefficient);
    const exponent = parseDecimal(state.draftExponent);

    if (!Number.isFinite(coefficient) || !Number.isInteger(exponent)) {
      feedback.hidden = false;
      feedback.className = "feedback error";
      feedback.textContent = "Escribe un coeficiente numérico y un exponente entero.";
      return;
    }

    const exact = closeEnough(coefficient, item.coefficient) && exponent === item.exponent;
    const enteredValue = coefficient * (10 ** exponent);
    const expectedValue = item.coefficient * (10 ** item.exponent);
    const equivalent = closeEnough(enteredValue, expectedValue);
    const normalized = Math.abs(coefficient) >= 1 && Math.abs(coefficient) < 10;
    window.repasoFisica?.registrar({type:"scientific",prompt:"Simplifica "+m(item.tex),coefficient:item.coefficient,exponent:item.exponent},exact);

    if (exact) {
      locked = true;
      const firstTry = !state.history.some((entry) => entry.exercise === state.current);
      state.history.push({ exercise: state.current, type: item.type, answer: formatAnswer(item), firstTry });
      state.current += 1;
      state.draftCoefficient = "";
      state.draftExponent = "";
      saveState();
      renderHistory();
      feedback.hidden = false;
      feedback.className = "feedback success";
      feedback.textContent = "¡Bien!";
      autoTimer = window.setTimeout(renderExercise, 1000);
      return;
    }

    feedback.hidden = false;
    if (equivalent && !normalized) {
      feedback.className = "feedback nearly";
      feedback.innerHTML = `El valor es equivalente, pero todavía falta <strong>normalizar</strong> la notación científica. Debe cumplirse ${m(String.raw`1 \le |a| < 10`)}.`;
      window.typesetMath?.(feedback);
      return;
    }

    locked = true;
    feedback.className = "feedback error";
    feedback.innerHTML = `Revisa la operación. La respuesta correcta es <strong>${formatAnswer(item)}</strong>.`;
    window.typesetMath?.(feedback);
    manualNext.hidden = false;
    nextButton.focus();
  }

  function moveAfterError() {
    const item = exercises[state.current];
    state.history.push({ exercise: state.current, type: item.type, answer: formatAnswer(item), firstTry: false });
    state.current += 1;
    state.draftCoefficient = "";
    state.draftExponent = "";
    saveState();
    renderHistory();
    renderExercise();
  }

  function finishActivity() {
    clearTimeout(autoTimer);
    exerciseCard.hidden = true;
    resultCard.hidden = false;
    progressLabel.textContent = "Completada";
    progressBar.style.width = "100%";
    const firstTryCount = state.history.filter((item) => item.firstTry).length;
    resultScore.textContent = `Terminaste los ${exercises.length} ejercicios. ${firstTryCount} quedaron correctos al primer intento.`;
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function resetProgress() {
    clearTimeout(autoTimer);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Reinicio en memoria. */ }
    state = defaultState();
    renderHistory();
    renderExercise();
  }

  coefficientInput.addEventListener("input", saveDraft);
  exponentInput.addEventListener("input", saveDraft);
  answerForm.addEventListener("submit", checkAnswer);
  nextButton.addEventListener("click", moveAfterError);
  resetButton.addEventListener("click", resetProgress);
  restartButton.addEventListener("click", resetProgress);
  openGuide.addEventListener("click", () => guideDialog.showModal());
  closeGuide.addEventListener("click", () => guideDialog.close());
  guideDialog.addEventListener("click", (event) => { if (event.target === guideDialog) guideDialog.close(); });
  guideDialog.addEventListener("cancel", () => guideDialog.close());

  renderHistory();
  renderExercise();
})();
