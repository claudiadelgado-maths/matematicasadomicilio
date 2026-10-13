(() => {
  const STORAGE_KEY = "repaso-fisica-actividad-6-ohm-potencia-joule-v1";
  const m = (tex) => `\\(${tex}\\)`;

  const levels = [
    {
      id: "ohm",
      kicker: "Bloque 1",
      title: "Ley de Ohm",
      shortTitle: "Ley de Ohm",
      description: "La Ley de Ohm relaciona voltaje, intensidad de corriente y resistencia en un circuito.",
      formulas: [m(String.raw`V=IR`), m(String.raw`I=\frac{V}{R}`), m(String.raw`R=\frac{V}{I}`)],
      note: `${m("V")} se mide en volts ${m(String.raw`\mathrm{V}`)}, ${m("I")} en amperes ${m(String.raw`\mathrm{A}`)} y ${m("R")} en ohms ${m(String.raw`\Omega`)}. Elige el despeje que corresponda a la incógnita.`,
      items: [
        {
          type: "choice",
          tag: "Significado",
          title: "Relación fundamental",
          prompt: "¿Qué magnitudes relaciona la Ley de Ohm?",
          options: ["Voltaje, corriente y resistencia", "Carga, tiempo y energía"],
          correct: "Voltaje, corriente y resistencia"
        },
        {
          type: "numeric",
          tag: m(String.raw`V=IR`),
          title: "Ejercicio numérico 1",
          prompt: `Por una resistencia de ${m(String.raw`6\,\Omega`)} circulan ${m(String.raw`2\,\mathrm{A}`)}. ¿Cuál es el voltaje?`,
          data: [m(String.raw`I=2\,\mathrm{A}`), m(String.raw`R=6\,\Omega`), m(String.raw`V=IR`)],
          answer: 12,
          tolerance: 0.01,
          unit: m(String.raw`\mathrm{V}`),
          explanation: m(String.raw`V=IR=(2\,\mathrm{A})(6\,\Omega)=12\,\mathrm{V}`)
        },
        {
          type: "numeric",
          tag: m(String.raw`I=\frac{V}{R}`),
          title: "Ejercicio numérico 2",
          prompt: `Un circuito tiene ${m(String.raw`24\,\mathrm{V}`)} y una resistencia de ${m(String.raw`8\,\Omega`)}. ¿Qué corriente circula?`,
          data: [m(String.raw`V=24\,\mathrm{V}`), m(String.raw`R=8\,\Omega`), m(String.raw`I=\frac{V}{R}`)],
          answer: 3,
          tolerance: 0.01,
          unit: m(String.raw`\mathrm{A}`),
          explanation: m(String.raw`I=\frac{V}{R}=\frac{24}{8}=3\,\mathrm{A}`)
        },
        {
          type: "numeric",
          tag: m(String.raw`R=\frac{V}{I}`),
          title: "Ejercicio numérico 3",
          prompt: `Hay ${m(String.raw`18\,\mathrm{V}`)} y circulan ${m(String.raw`3\,\mathrm{A}`)}. ¿Cuál es la resistencia?`,
          data: [m(String.raw`V=18\,\mathrm{V}`), m(String.raw`I=3\,\mathrm{A}`), m(String.raw`R=\frac{V}{I}`)],
          answer: 6,
          tolerance: 0.01,
          unit: m(String.raw`\Omega`),
          explanation: m(String.raw`R=\frac{V}{I}=\frac{18}{3}=6\,\Omega`)
        }
      ]
    },
    {
      id: "potencia",
      kicker: "Bloque 2",
      title: "Potencia eléctrica",
      shortTitle: "Potencia",
      description: "La potencia eléctrica indica qué tan rápido se transforma o utiliza energía eléctrica.",
      formulas: [m(String.raw`P=IV`), m(String.raw`P=\frac{V^2}{R}`), m(String.raw`P=I^2R`)],
      note: `La potencia se mide en watts ${m(String.raw`\mathrm{W}`)}. Cada fórmula permite calcular ${m("P")} usando los datos disponibles.`,
      items: [
        {
          type: "choice",
          tag: "Unidad",
          title: "Antes de calcular",
          prompt: "¿En qué unidad se mide la potencia eléctrica?",
          options: [`watts ${m(String.raw`\mathrm{W}`)}`, `ohms ${m(String.raw`\Omega`)}`],
          correct: `watts ${m(String.raw`\mathrm{W}`)}`
        },
        {
          type: "numeric",
          tag: m(String.raw`P=IV`),
          title: "Ejercicio numérico 1",
          prompt: `Un dispositivo trabaja con ${m(String.raw`12\,\mathrm{V}`)} y circulan ${m(String.raw`2\,\mathrm{A}`)}. ¿Cuál es su potencia?`,
          data: [m(String.raw`V=12\,\mathrm{V}`), m(String.raw`I=2\,\mathrm{A}`), m(String.raw`P=IV`)],
          answer: 24,
          tolerance: 0.01,
          unit: m(String.raw`\mathrm{W}`),
          explanation: m(String.raw`P=IV=(2)(12)=24\,\mathrm{W}`)
        },
        {
          type: "numeric",
          tag: m(String.raw`P=\frac{V^2}{R}`),
          title: "Ejercicio numérico 2",
          prompt: `Una resistencia de ${m(String.raw`5\,\Omega`)} está conectada a ${m(String.raw`10\,\mathrm{V}`)}. ¿Cuál es la potencia?`,
          data: [m(String.raw`V=10\,\mathrm{V}`), m(String.raw`R=5\,\Omega`), m(String.raw`P=\frac{V^2}{R}`)],
          answer: 20,
          tolerance: 0.01,
          unit: m(String.raw`\mathrm{W}`),
          explanation: m(String.raw`P=\frac{V^2}{R}=\frac{10^2}{5}=\frac{100}{5}=20\,\mathrm{W}`)
        },
        {
          type: "numeric",
          tag: m(String.raw`P=I^2R`),
          title: "Ejercicio numérico 3",
          prompt: `Por una resistencia de ${m(String.raw`4\,\Omega`)} circulan ${m(String.raw`3\,\mathrm{A}`)}. ¿Cuál es la potencia?`,
          data: [m(String.raw`I=3\,\mathrm{A}`), m(String.raw`R=4\,\Omega`), m(String.raw`P=I^2R`)],
          answer: 36,
          tolerance: 0.01,
          unit: m(String.raw`\mathrm{W}`),
          explanation: m(String.raw`P=I^2R=3^2(4)=9(4)=36\,\mathrm{W}`)
        }
      ]
    },
    {
      id: "joule",
      kicker: "Bloque 3",
      title: "Efecto Joule",
      shortTitle: "Efecto Joule",
      description: "El efecto Joule es la transformación de energía eléctrica en calor cuando la corriente atraviesa un material con resistencia.",
      formulas: [],
      note: "Aquí no hay cálculo: identifica cuál situación describe calentamiento producido por el paso de corriente a través de una resistencia.",
      items: [
        {
          type: "choice",
          tag: "Situaciones",
          title: "Ejercicio 1",
          prompt: "¿Cuál situación representa el efecto Joule?",
          options: [
            "La resistencia de un tostador se calienta cuando circula corriente.",
            "Un globo cargado atrae pequeños trozos de papel."
          ],
          correct: "La resistencia de un tostador se calienta cuando circula corriente."
        },
        {
          type: "choice",
          tag: "Situaciones",
          title: "Ejercicio 2",
          prompt: "¿Cuál situación representa el efecto Joule?",
          options: [
            "Una plancha eléctrica calienta su placa al pasar corriente por una resistencia.",
            "Un motor eléctrico hace girar las aspas de un ventilador."
          ],
          correct: "Una plancha eléctrica calienta su placa al pasar corriente por una resistencia."
        }
      ]
    }
  ];

  const levelNav = document.querySelector("[data-level-nav]");
  const levelKicker = document.querySelector("[data-level-kicker]");
  const levelTitle = document.querySelector("[data-level-title]");
  const levelDescription = document.querySelector("[data-level-description]");
  const formulaStrip = document.querySelector("[data-formula-strip]");
  const conceptNote = document.querySelector("[data-concept-note]");
  const overallCount = document.querySelector("[data-overall-count]");
  const progressLabel = document.querySelector("[data-progress-label]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const exerciseCard = document.querySelector("[data-exercise-card]");
  const exerciseTitle = document.querySelector("[data-exercise-title]");
  const exerciseTag = document.querySelector("[data-exercise-tag]");
  const exercisePrompt = document.querySelector("[data-exercise-prompt]");
  const givenData = document.querySelector("[data-given-data]");
  const exerciseContent = document.querySelector("[data-exercise-content]");
  const feedback = document.querySelector("[data-feedback]");
  const manualNext = document.querySelector("[data-manual-next]");
  const nextButton = document.querySelector("[data-next]");
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

  let state = loadState();
  levels.forEach(l=>state.levels[l.id].history.forEach((e,i)=>{if(e.correct===false&&l.items[i])window.repasoFisica?.registrar(l.items[i],false,true);}));
  let locked = false;
  let autoTimer = null;

  function blankLevelState() {
    return { index: 0, history: [], drafts: {}, complete: false };
  }

  function defaultState() {
    return {
      activeLevel: "ohm",
      levels: Object.fromEntries(levels.map((level) => [level.id, blankLevelState()]))
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !saved.levels) return base;
      levels.forEach((level) => {
        const old = saved.levels[level.id] || {};
        base.levels[level.id] = { ...blankLevelState(), ...old };
        if (!Array.isArray(base.levels[level.id].history)) base.levels[level.id].history = [];
        if (!base.levels[level.id].drafts || typeof base.levels[level.id].drafts !== "object") base.levels[level.id].drafts = {};
        base.levels[level.id].index = Math.min(Math.max(Number(base.levels[level.id].index) || 0, 0), level.items.length);
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

  function currentItem() {
    const level = currentLevel();
    return level.items[currentLevelState().index] || null;
  }

  function completedCount() {
    return levels.filter((level) => state.levels[level.id].complete).length;
  }

  function parseNumber(value) {
    const normalized = String(value ?? "").trim().replace(/\s+/g, "").replace(",", ".");
    return normalized ? Number(normalized) : NaN;
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function renderLevelNav() {
    levelNav.innerHTML = "";
    levels.forEach((level, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-button";
      if (level.id === state.activeLevel) button.classList.add("active");
      if (state.levels[level.id].complete) button.classList.add("complete");
      button.innerHTML = `<small>Bloque ${index + 1}</small><strong>${level.shortTitle}</strong>`;
      button.addEventListener("click", () => switchLevel(level.id));
      levelNav.appendChild(button);
    });
    overallCount.textContent = `${completedCount()} / ${levels.length}`;
  }

  function renderConcept() {
    const level = currentLevel();
    levelKicker.textContent = level.kicker;
    levelTitle.textContent = level.title;
    levelDescription.textContent = level.description;
    conceptNote.textContent = level.note;
    formulaStrip.innerHTML = "";
    level.formulas.forEach((formula) => {
      const span = document.createElement("span");
      span.className = "formula-pill";
      span.textContent = formula;
      formulaStrip.appendChild(span);
    });
    formulaStrip.hidden = level.formulas.length === 0;
    window.typesetMath?.(formulaStrip, conceptNote);
  }

  function updateProgress() {
    const level = currentLevel();
    const ls = currentLevelState();
    const completed = ls.complete ? level.items.length : Math.min(ls.index, level.items.length);
    if (ls.complete) {
      progressLabel.textContent = `Completado · ${level.items.length} de ${level.items.length}`;
      progressBar.style.width = "100%";
    } else {
      progressLabel.textContent = `Ejercicio ${Math.min(ls.index + 1, level.items.length)} de ${level.items.length}`;
      progressBar.style.width = `${(completed / level.items.length) * 100}%`;
    }
  }

  function renderHistory() {
    const history = currentLevelState().history;
    historyList.innerHTML = "";
    if (!history.length) {
      historyList.appendChild(historyEmpty);
      historyEmpty.hidden = false;
      return;
    }
    history.forEach((entry, index) => {
      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `
        <span class="history-index">${index + 1}</span>
        <div class="history-copy"><strong>${entry.title}</strong><span>${entry.answer}</span></div>
        <span class="history-status ${entry.correct ? "ok" : "no"}">${entry.correct ? "Correcto" : "Revisado"}</span>`;
      historyList.appendChild(li);
    });
    window.typesetMath?.(historyList);
  }

  function clearFeedback() {
    locked = false;
    feedback.hidden = true;
    feedback.className = "feedback";
    feedback.textContent = "";
    manualNext.hidden = true;
  }

  function renderExercise() {
    window.clearTimeout(autoTimer);
    const level = currentLevel();
    const ls = currentLevelState();
    if (ls.complete || ls.index >= level.items.length) {
      finishLevel();
      return;
    }

    activityResult.hidden = true;
    levelResult.hidden = true;
    exerciseCard.hidden = false;
    clearFeedback();
    const item = currentItem();
    exerciseTitle.textContent = item.title;
    exerciseTag.textContent = item.tag;
    exercisePrompt.textContent = item.prompt;
    givenData.innerHTML = "";
    (item.data || []).forEach((datum) => {
      const chip = document.createElement("span");
      chip.className = "data-chip";
      chip.textContent = datum;
      givenData.appendChild(chip);
    });
    givenData.hidden = !(item.data && item.data.length);
    exerciseContent.innerHTML = "";

    if (item.type === "choice") renderChoice(item);
    else renderNumeric(item);

    renderHistory();
    updateProgress();
    window.typesetMath?.(exerciseTag, exercisePrompt, givenData, exerciseContent, historyList);
  }

  function renderChoice(item) {
    const grid = document.createElement("div");
    grid.className = "answer-grid";
    shuffle(item.options).forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.value = option;
      button.textContent = option;
      button.addEventListener("click", () => checkChoice(button, item, grid));
      grid.appendChild(button);
    });
    exerciseContent.appendChild(grid);
  }

  function renderNumeric(item) {
    const form = document.createElement("form");
    form.className = "numeric-form";
    form.noValidate = true;
    form.innerHTML = `
      <label for="numeric-answer">Resultado</label>
      <div class="input-with-unit">
        <input id="numeric-answer" name="answer" type="text" inputmode="decimal" autocomplete="off">
        <span>${item.unit}</span>
      </div>
      
      <button class="primary-button" type="submit">Comprobar</button>`;
    const input = form.querySelector("input");
    const key = String(currentLevelState().index);
    input.value = currentLevelState().drafts[key] || "";
    input.addEventListener("input", () => {
      currentLevelState().drafts[key] = input.value;
      saveState();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      checkNumeric(item, input, form);
    });
    exerciseContent.appendChild(form);
  }

  function addHistory(item, answer, correct) {
    currentLevelState().history.push({ title: item.title, answer, correct });
    saveState();
    renderHistory();
  }

  function checkChoice(selected, item, grid) {
    if (locked) return;
    locked = true;
    const buttons = [...grid.querySelectorAll("button")];
    buttons.forEach((button) => { button.disabled = true; });
    const correct = selected.dataset.value === item.correct;
    window.repasoFisica?.registrar(item,correct);
    addHistory(item, `Elegiste: ${selected.dataset.value}`, correct);

    if (correct) {
      selected.classList.add("correct");
      feedback.textContent = "¡Bien!";
      feedback.classList.add("success");
      feedback.hidden = false;
      advanceAfterSuccess();
    } else {
      selected.classList.add("wrong");
      const correctButton = buttons.find((button) => button.dataset.value === item.correct);
      if (correctButton) correctButton.classList.add("correct");
      feedback.innerHTML = `La respuesta correcta es <strong>${item.correct}</strong>.`;
      window.typesetMath?.(feedback);
      feedback.classList.add("error");
      feedback.hidden = false;
      manualNext.hidden = false;
      nextButton.focus();
    }
  }

  function checkNumeric(item, input, form) {
    if (locked) return;
    const value = parseNumber(input.value);
    if (!Number.isFinite(value)) {
      feedback.textContent = "Escribe primero un número.";
      feedback.classList.add("error");
      feedback.hidden = false;
      input.focus();
      return;
    }

    locked = true;
    form.querySelectorAll("input, button").forEach((control) => { control.disabled = true; });
    const correct = Math.abs(value - item.answer) <= item.tolerance;
    window.repasoFisica?.registrar(item,correct);
    addHistory(item, `Tu respuesta: ${input.value} ${item.unit}`, correct);

    if (correct) {
      feedback.innerHTML = `<strong>¡Bien!</strong> ${item.explanation}`;
      window.typesetMath?.(feedback);
      feedback.classList.add("success");
      feedback.hidden = false;
      advanceAfterSuccess();
    } else {
      feedback.innerHTML = `<strong>Revisa:</strong> ${item.explanation}`;
      window.typesetMath?.(feedback);
      feedback.classList.add("error");
      feedback.hidden = false;
      manualNext.hidden = false;
      nextButton.focus();
    }
  }

  function advanceAfterSuccess() {
    autoTimer = window.setTimeout(() => {
      advanceItem();
    }, 1000);
  }

  function advanceItem() {
    const level = currentLevel();
    const ls = currentLevelState();
    ls.index += 1;
    if (ls.index >= level.items.length) ls.complete = true;
    saveState();
    renderLevelNav();
    if (ls.complete) finishLevel();
    else renderExercise();
  }

  function finishLevel() {
    window.clearTimeout(autoTimer);
    const level = currentLevel();
    const ls = currentLevelState();
    ls.complete = true;
    ls.index = level.items.length;
    saveState();
    exerciseCard.hidden = true;
    renderLevelNav();
    renderHistory();
    updateProgress();

    const levelIndex = levels.findIndex((entry) => entry.id === level.id);
    if (completedCount() === levels.length && levelIndex === levels.length - 1) {
      levelResult.hidden = true;
      activityResult.hidden = false;
      const total = levels.reduce((sum, entry) => sum + entry.items.length, 0);
      const correct = levels.reduce((sum, entry) => sum + state.levels[entry.id].history.filter((answer) => answer.correct).length, 0);
      activityResultCopy.textContent = `Terminaste Ley de Ohm, potencia eléctrica y efecto Joule. Registraste ${correct} respuestas correctas de ${total} ejercicios en el primer intento.`;
      return;
    }

    activityResult.hidden = true;
    levelResult.hidden = false;
    const correct = ls.history.filter((answer) => answer.correct).length;
    levelResultTitle.textContent = `${level.title} completado.`;
    levelResultCopy.textContent = `Terminaste ${level.items.length} ejercicios de este bloque y acertaste ${correct} en el primer intento.`;
    nextLevelButton.hidden = levelIndex >= levels.length - 1;
    if (!nextLevelButton.hidden) nextLevelButton.textContent = `Siguiente bloque · ${levels[levelIndex + 1].shortTitle}`;
  }

  function switchLevel(id) {
    window.clearTimeout(autoTimer);
    state.activeLevel = id;
    saveState();
    renderAll();
    document.querySelector(".concept-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextLevel() {
    const index = levels.findIndex((level) => level.id === state.activeLevel);
    if (index < levels.length - 1) switchLevel(levels[index + 1].id);
  }

  function resetLevel() {
    window.clearTimeout(autoTimer);
    state.levels[state.activeLevel] = blankLevelState();
    saveState();
    renderAll();
  }

  function resetActivity() {
    window.clearTimeout(autoTimer);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Reinicio en memoria. */ }
    state = defaultState();
    renderAll();
  }

  function renderAll() {
    renderLevelNav();
    renderConcept();
    renderHistory();
    if (currentLevelState().complete) finishLevel();
    else renderExercise();
  }

  nextButton.addEventListener("click", advanceItem);
  nextLevelButton.addEventListener("click", nextLevel);
  repeatLevelButton.addEventListener("click", resetLevel);
  resetActivityButton.addEventListener("click", resetActivity);
  restartActivityButton.addEventListener("click", resetActivity);
  document.querySelector("[data-open-guide]").addEventListener("click", () => guideDialog.showModal());
  document.querySelector("[data-close-guide]").addEventListener("click", () => guideDialog.close());
  guideDialog.addEventListener("click", (event) => { if (event.target === guideDialog) guideDialog.close(); });
  guideDialog.addEventListener("cancel", () => guideDialog.close());

  renderAll();
})();
