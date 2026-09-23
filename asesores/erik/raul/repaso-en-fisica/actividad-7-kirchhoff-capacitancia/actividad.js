(() => {
  const STORAGE_KEY = "repaso-fisica-actividad-7-kirchhoff-capacitancia-v1";
  const m = (tex) => `\\(${tex}\\)`;

  const levels = [
    {
      id: "kirchhoff",
      kicker: "Bloque 1",
      title: "Leyes de Kirchhoff y resistencias equivalentes",
      shortTitle: "Kirchhoff",
      description: "Repasa las dos leyes de Kirchhoff y las reglas para resistencias conectadas en serie y en paralelo.",
      formulas: [
        `1.ª ley: ${m(String.raw`\sum I_{\mathrm{entra}}=\sum I_{\mathrm{sale}}`)}`,
        `2.ª ley: ${m(String.raw`\sum V=0`)}`,
        `Serie: ${m(String.raw`R_T=R_1+R_2+\cdots`)}`,
        `Paralelo: ${m(String.raw`\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\cdots`)}`
      ],
      note: "La primera ley expresa conservación de carga en un nodo; la segunda expresa conservación de energía alrededor de una trayectoria cerrada.",
      items: [
        {
          type: "choice",
          tag: "Primera ley",
          title: "Ley de nodos",
          prompt: "¿Cuál enunciado corresponde a la primera ley de Kirchhoff?",
          options: [
            "La suma de las corrientes que entran a un nodo es igual a la suma de las que salen.",
            "La suma algebraica de los voltajes en una trayectoria cerrada es cero."
          ],
          correct: "La suma de las corrientes que entran a un nodo es igual a la suma de las que salen."
        },
        {
          type: "choice",
          tag: "Segunda ley",
          title: "Ley de mallas",
          prompt: "¿Cuál enunciado corresponde a la segunda ley de Kirchhoff?",
          options: [
            "La suma algebraica de los voltajes en una trayectoria cerrada es cero.",
            "La corriente total de un nodo siempre es mayor que la corriente que sale."
          ],
          correct: "La suma algebraica de los voltajes en una trayectoria cerrada es cero."
        },
        {
          type: "choice",
          tag: "Serie",
          title: "Resistencia equivalente en serie",
          prompt: "¿Cuál es la fórmula correcta para resistencias conectadas en serie?",
          options: [
            m(String.raw`R_T=R_1+R_2+R_3+\cdots`),
            m(String.raw`\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\frac{1}{R_3}+\cdots`)
          ],
          correct: m(String.raw`R_T=R_1+R_2+R_3+\cdots`)
        },
        {
          type: "choice",
          tag: "Paralelo",
          title: "Resistencia equivalente en paralelo",
          prompt: "¿Cuál es la fórmula correcta para resistencias conectadas en paralelo?",
          options: [
            m(String.raw`\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\frac{1}{R_3}+\cdots`),
            m(String.raw`R_T=R_1+R_2+R_3+\cdots`)
          ],
          correct: m(String.raw`\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\frac{1}{R_3}+\cdots`)
        },
        {
          type: "numeric",
          tag: "Serie",
          title: "Ejercicio numérico 1",
          prompt: `Calcula la resistencia total si ${m(String.raw`R_1=10\,\Omega`)} y ${m(String.raw`R_2=12\,\Omega`)} están en serie.`,
          data: [m(String.raw`R_1=10\,\Omega`), m(String.raw`R_2=12\,\Omega`), m(String.raw`R_T=R_1+R_2`)],
          answer: 22,
          tolerance: 0.01,
          unit: m(String.raw`\Omega`),
          explanation: m(String.raw`R_T=10+12=22\,\Omega`)
        },
        {
          type: "numeric",
          tag: "Paralelo",
          title: "Ejercicio numérico 2",
          prompt: `Calcula la resistencia total si ${m(String.raw`R_1=2\,\Omega`)} y ${m(String.raw`R_2=5\,\Omega`)} están en paralelo.`,
          data: [m(String.raw`R_1=2\,\Omega`), m(String.raw`R_2=5\,\Omega`), m(String.raw`\frac{1}{R_T}=\frac{1}{2}+\frac{1}{5}`)],
          answer: 1.4285714286,
          tolerance: 0.02,
          unit: m(String.raw`\Omega`),
          explanation: m(String.raw`\frac{1}{R_T}=\frac{1}{2}+\frac{1}{5}=0.7\;\Rightarrow\;R_T=\frac{1}{0.7}\approx1.43\,\Omega`)
        }
      ]
    },
    {
      id: "fem",
      kicker: "Bloque 2",
      title: "Fuerza electromotriz",
      shortTitle: "FEM",
      description: "La fuerza electromotriz describe la energía que una fuente entrega por cada unidad de carga.",
      formulas: [`${m(String.raw`\mathcal{E}=\frac{E}{q}`)}`, `Unidad: volt ${m(String.raw`\mathrm{V}`)}`],
      note: "Aunque se llama fuerza electromotriz, no es una fuerza mecánica. Es energía por unidad de carga y se expresa en volts.",
      items: [
        {
          type: "choice",
          tag: "Significado",
          title: "¿Qué es la FEM?",
          prompt: "¿Cuál opción describe mejor la fuerza electromotriz de una fuente?",
          options: [
            "La energía que la fuente suministra por unidad de carga.",
            "La fuerza mecánica que empuja físicamente a los electrones."
          ],
          correct: "La energía que la fuente suministra por unidad de carga."
        }
      ]
    },
    {
      id: "resistencia-interna",
      kicker: "Bloque 3",
      title: "Resistencia interna",
      shortTitle: "Res. interna",
      description: "Una batería real puede presentar una resistencia interna que forma parte del circuito.",
      formulas: [m(String.raw`R_T=R_{\mathrm{ext}}+r_{\mathrm{int}}`)],
      note: `En el modelo sencillo de estos ejercicios, la resistencia interna ${m("r")} se suma a las resistencias externas en serie. Para una misma FEM, una resistencia total mayor produce una corriente menor.`,
      items: [
        {
          type: "choice",
          tag: "Concepto",
          title: "Baterías reales",
          prompt: "¿Qué representa la resistencia interna de una batería?",
          options: [
            "Una resistencia propia de la fuente que puede oponerse al paso de corriente.",
            "Una carga eléctrica adicional almacenada fuera de la batería."
          ],
          correct: "Una resistencia propia de la fuente que puede oponerse al paso de corriente."
        },
        {
          type: "choice",
          tag: "En un problema",
          title: "¿Cómo se toma en cuenta?",
          prompt: "En un circuito simple, ¿cómo afecta la resistencia interna al cálculo de la resistencia total?",
          options: [
            "Se suma a la resistencia externa.",
            "Se resta siempre de la resistencia externa."
          ],
          correct: "Se suma a la resistencia externa."
        }
      ]
    },
    {
      id: "capacitancia",
      kicker: "Bloque 4",
      title: "Capacitancia",
      shortTitle: "Capacitancia",
      description: "La capacitancia mide cuánta carga puede almacenar un capacitor por cada volt de diferencia de potencial.",
      formulas: [
        m(String.raw`C=\frac{Q}{V}`),
        `Unidad: farad ${m(String.raw`\mathrm{F}`)}`,
        `Placas: ${m(String.raw`C=\frac{\varepsilon A}{d}`)}`,
        `Paralelo: ${m(String.raw`C_T=C_1+C_2+\cdots`)}`,
        `Serie: ${m(String.raw`\frac{1}{C_T}=\frac{1}{C_1}+\frac{1}{C_2}+\cdots`)}`
      ],
      note: `En ${m(String.raw`C=\frac{\varepsilon A}{d}`)}, ${m(String.raw`\varepsilon`)} es la permitividad eléctrica del medio, ${m("A")} es el área de las placas y ${m("d")} es la separación. Usa la guía para consultar las tablas de ${m("K")} y ${m(String.raw`\varepsilon_r`)}.`,
      items: [
        {
          type: "choice",
          tag: "Concepto",
          title: "¿Qué es capacitancia?",
          prompt: "¿Qué describe la capacitancia de un capacitor?",
          options: [
            "La capacidad de almacenar carga eléctrica por cada volt aplicado.",
            "La rapidez con la que una resistencia transforma energía en calor."
          ],
          correct: "La capacidad de almacenar carga eléctrica por cada volt aplicado."
        },
        {
          type: "choice",
          tag: "Fórmula",
          title: "Carga y voltaje",
          prompt: "¿Cuál es la fórmula básica de la capacitancia?",
          options: [m(String.raw`C=\frac{Q}{V}`), m(String.raw`C=\frac{V}{Q}`)],
          correct: m(String.raw`C=\frac{Q}{V}`)
        },
        {
          type: "choice",
          tag: "Unidad",
          title: "Unidad de capacitancia",
          prompt: "¿En qué unidad del SI se mide la capacitancia?",
          options: [`farad ${m(String.raw`\mathrm{F}`)}`, `ohm ${m(String.raw`\Omega`)}`],
          correct: `farad ${m(String.raw`\mathrm{F}`)}`
        },
        {
          type: "choice",
          tag: "Placas paralelas",
          title: "Capacitancia geométrica",
          prompt: "¿Cuál es la fórmula para un capacitor ideal de placas paralelas?",
          options: [m(String.raw`C=\frac{\varepsilon A}{d}`), m(String.raw`C=\frac{\varepsilon d}{A}`)],
          correct: m(String.raw`C=\frac{\varepsilon A}{d}`)
        },
        {
          type: "choice",
          tag: "Permitividad",
          title: "Símbolo de permitividad",
          prompt: `En ${m(String.raw`C=\frac{\varepsilon A}{d}`)}, ¿qué representa ${m(String.raw`\varepsilon`)}?`,
          options: ["La permitividad eléctrica del medio.", "La resistencia interna del capacitor."],
          correct: "La permitividad eléctrica del medio."
        },
        {
          type: "choice",
          tag: "Paralelo",
          title: "Capacitores en paralelo",
          prompt: "¿Cuál es la relación correcta para capacitores en paralelo?",
          options: [m(String.raw`C_T=C_1+C_2+C_3+\cdots`), m(String.raw`\frac{1}{C_T}=\frac{1}{C_1}+\frac{1}{C_2}+\frac{1}{C_3}+\cdots`)],
          correct: m(String.raw`C_T=C_1+C_2+C_3+\cdots`)
        },
        {
          type: "choice",
          tag: "Serie",
          title: "Capacitores en serie",
          prompt: "¿Cuál es la relación correcta para capacitores en serie?",
          options: [m(String.raw`\frac{1}{C_T}=\frac{1}{C_1}+\frac{1}{C_2}+\frac{1}{C_3}+\cdots`), m(String.raw`C_T=C_1+C_2+C_3+\cdots`)],
          correct: m(String.raw`\frac{1}{C_T}=\frac{1}{C_1}+\frac{1}{C_2}+\frac{1}{C_3}+\cdots`)
        },
        {
          type: "numeric",
          tag: "Paralelo",
          title: "Ejercicio numérico 1",
          prompt: `Dos capacitores de ${m(String.raw`2\,\mu\mathrm{F}`)} y ${m(String.raw`5\,\mu\mathrm{F}`)} están en paralelo. ¿Cuál es la capacitancia total?`,
          data: [m(String.raw`C_1=2\,\mu\mathrm{F}`), m(String.raw`C_2=5\,\mu\mathrm{F}`), m(String.raw`C_T=C_1+C_2`)],
          answer: 7,
          tolerance: 0.01,
          unit: m(String.raw`\mu\mathrm{F}`),
          explanation: `En paralelo se suman directamente: ${m(String.raw`C_T=2+5=7\,\mu\mathrm{F}`)}.`
        },
        {
          type: "numeric",
          tag: "Serie",
          title: "Ejercicio numérico 2",
          prompt: `Dos capacitores de ${m(String.raw`6\,\mu\mathrm{F}`)} y ${m(String.raw`3\,\mu\mathrm{F}`)} están en serie. ¿Cuál es la capacitancia total?`,
          data: [m(String.raw`C_1=6\,\mu\mathrm{F}`), m(String.raw`C_2=3\,\mu\mathrm{F}`), m(String.raw`\frac{1}{C_T}=\frac{1}{6}+\frac{1}{3}`)],
          answer: 2,
          tolerance: 0.01,
          unit: m(String.raw`\mu\mathrm{F}`),
          explanation: `${m(String.raw`\frac{1}{C_T}=\frac{1}{6}+\frac{1}{3}=\frac{1}{2}`)}, así que ${m(String.raw`C_T=2\,\mu\mathrm{F}`)}.`
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
      activeLevel: "kirchhoff",
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
      activityResultCopy.textContent = `Terminaste leyes de Kirchhoff, fuerza electromotriz, resistencia interna y capacitancia. Registraste ${correct} respuestas correctas de ${total} ejercicios en el primer intento.`;
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
