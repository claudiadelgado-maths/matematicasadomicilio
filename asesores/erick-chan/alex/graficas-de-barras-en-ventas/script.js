(() => {
  const deck = document.querySelector("[data-deck]");
  if (!deck) return;

  const slides = [...deck.querySelectorAll("[data-slide]")];
  const counter = deck.querySelector("[data-slide-counter]");
  const progress = deck.querySelector("[data-progress]");
  const progressFill = deck.querySelector("[data-progress-fill]");
  const dotsContainer = deck.querySelector("[data-deck-dots]");
  const previousButtons = [...deck.querySelectorAll('[data-action="previous"]')];
  const nextButtons = [...deck.querySelectorAll('[data-action="next"]')];
  let currentSlide = 0;

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "deck-dot";
    dot.setAttribute("aria-label", `Ir a la pantalla ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index, true));
    dotsContainer?.append(dot);
    return dot;
  });

  const showSlide = (index, moveFocus = false) => {
    currentSlide = Math.min(Math.max(index, 0), slides.length - 1);

    slides.forEach((slide, slideIndex) => {
      const isCurrent = slideIndex === currentSlide;
      slide.hidden = !isCurrent;
      slide.setAttribute("aria-hidden", String(!isCurrent));
    });

    dots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === currentSlide;
      dot.classList.toggle("is-current", isCurrent);
      if (isCurrent) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });

    previousButtons.forEach((button) => { button.disabled = currentSlide === 0; });
    nextButtons.forEach((button) => { button.disabled = currentSlide === slides.length - 1; });

    const number = currentSlide + 1;
    if (counter) counter.textContent = `Pantalla ${number} de ${slides.length}`;
    if (progress) progress.setAttribute("aria-valuenow", String(number));
    if (progressFill) progressFill.style.width = `${(number / slides.length) * 100}%`;

    if (moveFocus) {
      const heading = slides[currentSlide].querySelector("h1, h2");
      heading?.focus({ preventScroll: true });
      deck.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  previousButtons.forEach((button) => button.addEventListener("click", () => showSlide(currentSlide - 1, true)));
  nextButtons.forEach((button) => button.addEventListener("click", () => showSlide(currentSlide + 1, true)));

  const anatomyCopy = {
    title: "<strong>Título:</strong> indica qué datos se representan y durante qué periodo se reunieron.",
    scale: "<strong>Escala:</strong> muestra cuánto vale cada intervalo. Saltar de 10 en 10 no es igual que saltar de 100 en 100.",
    categories: "<strong>Categorías:</strong> nombran los grupos que se comparan, como productos, canales o periodos.",
    bars: "<strong>Barras:</strong> traducen cada cantidad en altura. Su valor se confirma comparándola con la escala.",
  };
  const anatomyButtons = [...deck.querySelectorAll("[data-anatomy]")];
  const anatomyChart = deck.querySelector("[data-anatomy-chart]");
  const anatomyOutput = deck.querySelector("[data-anatomy-output]");

  const selectAnatomy = (part) => {
    anatomyButtons.forEach((button) => {
      const isActive = button.dataset.anatomy === part;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    if (anatomyChart) anatomyChart.dataset.highlight = part;
    if (anatomyOutput) anatomyOutput.innerHTML = anatomyCopy[part];
  };
  anatomyButtons.forEach((button) => button.addEventListener("click", () => selectAnatomy(button.dataset.anatomy)));

  const salesBars = [...deck.querySelectorAll("[data-sales-bar]")];
  const salesChart = deck.querySelector(".interactive-chart");
  const salesOutput = deck.querySelector("[data-sales-output]");
  const salesDetail = deck.querySelector("[data-sales-detail]");
  const revealButton = deck.querySelector("[data-reveal-values]");

  salesBars.forEach((bar) => {
    bar.addEventListener("click", () => {
      salesBars.forEach((candidate) => candidate.classList.toggle("is-selected", candidate === bar));
      if (salesOutput) salesOutput.textContent = `${bar.dataset.label}: ${bar.dataset.value}`;
      if (salesDetail) salesDetail.textContent = `${bar.dataset.label} registró ${bar.dataset.value} pedidos. La altura coincide con la escala vertical.`;
    });
  });

  revealButton?.addEventListener("click", () => {
    const willShow = revealButton.getAttribute("aria-pressed") !== "true";
    revealButton.setAttribute("aria-pressed", String(willShow));
    revealButton.textContent = willShow ? "Ocultar valores" : "Mostrar todos los valores";
    salesChart?.classList.toggle("show-values", willShow);
  });

  const challengeOptions = [...deck.querySelectorAll("[data-challenge-option]")];
  const challengeFeedback = deck.querySelector("[data-challenge-feedback]");
  challengeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const isCorrect = option.dataset.challengeOption === "true";
      challengeOptions.forEach((candidate) => candidate.classList.remove("is-correct", "is-wrong"));
      option.classList.add(isCorrect ? "is-correct" : "is-wrong");
      if (challengeFeedback) {
        challengeFeedback.innerHTML = isCorrect
          ? "<strong>Correcto.</strong> 46 − 32 = 14 pedidos. La afirmación nombra la medida y cuantifica la diferencia."
          : "<strong>Revisa la unidad.</strong> La mejor conclusión debe decir qué se compara y cuánto cambia.";
      }
    });
  });

  const builderDefaults = { keyboards: 28, mice: 42, speakers: 19 };
  const builderInputs = [...deck.querySelectorAll("[data-builder-input]")];
  const builderConclusion = deck.querySelector("[data-builder-conclusion]");

  const updateBuilder = () => {
    const records = builderInputs.map((input) => {
      const key = input.dataset.builderInput;
      const value = Number(input.value);
      const label = input.dataset.label;
      const output = deck.querySelector(`[data-range-output="${key}"]`);
      const bar = deck.querySelector(`[data-builder-bar="${key}"]`);
      if (output) output.textContent = String(value);
      if (bar) {
        bar.style.setProperty("--bar", `${Math.max((value / 50) * 100, 1)}%`);
        const valueLabel = bar.querySelector("strong");
        if (valueLabel) valueLabel.textContent = String(value);
      }
      return { key, label, value, bar };
    });

    const highest = Math.max(...records.map((record) => record.value));
    const leaders = records.filter((record) => record.value === highest);
    records.forEach((record) => record.bar?.classList.toggle("is-accent", record.value === highest));

    if (!builderConclusion) return;
    if (leaders.length > 1) {
      builderConclusion.innerHTML = `<strong>Empate:</strong> ${leaders.map((record) => record.label).join(" y ")} comparten el primer lugar con ${highest} ventas.`;
      return;
    }
    const ordered = [...records].sort((a, b) => b.value - a.value);
    const difference = ordered[0].value - ordered[1].value;
    builderConclusion.innerHTML = `<strong>${ordered[0].label}</strong> ocupa el primer lugar con ${ordered[0].value} ventas, ${difference} más que ${ordered[1].label}.`;
  };

  builderInputs.forEach((input) => input.addEventListener("input", updateBuilder));
  deck.querySelector("[data-builder-random]")?.addEventListener("click", () => {
    builderInputs.forEach((input) => { input.value = String(Math.floor(Math.random() * 43) + 8); });
    updateBuilder();
  });
  const resetBuilder = () => {
    builderInputs.forEach((input) => { input.value = String(builderDefaults[input.dataset.builderInput]); });
    updateBuilder();
  };
  deck.querySelector("[data-builder-reset]")?.addEventListener("click", resetBuilder);

  const metricButtons = [...deck.querySelectorAll("[data-metric]")];
  const metricBars = [...deck.querySelectorAll(".metric-bar")];
  const metricLabel = deck.querySelector("[data-metric-label]");
  const metricOutput = deck.querySelector("[data-metric-output]");
  const formatCurrency = (value) => `$${new Intl.NumberFormat("es-MX").format(value)}`;

  const setMetric = (metric) => {
    metricButtons.forEach((button) => {
      const isActive = button.dataset.metric === metric;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    const values = metricBars.map((bar) => Number(bar.dataset[metric]));
    const maximum = Math.max(...values);
    metricBars.forEach((bar, index) => {
      const value = values[index];
      bar.style.setProperty("--bar", `${Math.max((value / maximum) * 100, 1)}%`);
      const valueLabel = bar.querySelector("strong");
      if (valueLabel) valueLabel.textContent = metric === "revenue" ? formatCurrency(value) : String(value);
      bar.classList.toggle("is-accent", value === maximum);
    });
    if (metric === "revenue") {
      if (metricLabel) metricLabel.textContent = "La gráfica mide ingresos";
      if (metricOutput) metricOutput.innerHTML = "<strong>Audífonos</strong> ahora tiene la barra más alta: generó $8,000.";
    } else {
      if (metricLabel) metricLabel.textContent = "La gráfica mide unidades";
      if (metricOutput) metricOutput.innerHTML = "<strong>Cargadores</strong> tiene la barra más alta: se vendieron 25 piezas.";
    }
  };
  metricButtons.forEach((button) => button.addEventListener("click", () => setMetric(button.dataset.metric)));

  const scaleButtons = [...deck.querySelectorAll("[data-scale-mode]")];
  const scaleChart = deck.querySelector("[data-scale-chart]");
  const scaleOrigin = deck.querySelector("[data-scale-origin]");
  const scaleOutput = deck.querySelector("[data-scale-output]");
  const setScale = (mode) => {
    scaleButtons.forEach((button) => {
      const isActive = button.dataset.scaleMode === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    if (scaleChart) scaleChart.dataset.mode = mode;
    if (scaleOrigin) scaleOrigin.textContent = mode === "truncated" ? "80" : "0";
    if (scaleOutput) {
      scaleOutput.innerHTML = mode === "truncated"
        ? "<strong>Impresión exagerada:</strong> al comenzar en 80, la diferencia de cuatro ventas parece enorme. Hay que leer la escala antes de concluir."
        : "<strong>Lectura proporcional:</strong> cuatro ventas de diferencia se ven como una variación pequeña.";
    }
  };
  scaleButtons.forEach((button) => button.addEventListener("click", () => setScale(button.dataset.scaleMode)));

  const quizQuestions = [...deck.querySelectorAll("[data-quiz-question]")];
  const quizScore = deck.querySelector("[data-quiz-score]");
  const finalScore = deck.querySelector("[data-final-score]");
  let score = 0;

  const updateScore = () => {
    const answered = quizQuestions.filter((question) => question.dataset.answered === "true").length;
    if (quizScore) quizScore.textContent = `${score} de ${quizQuestions.length}`;
    if (finalScore) {
      finalScore.textContent = answered === quizQuestions.length
        ? `Tu reto final: ${score} de ${quizQuestions.length} respuestas correctas.`
        : `Tu reto final: ${score} aciertos; respondiste ${answered} de ${quizQuestions.length} preguntas.`;
    }
  };

  quizQuestions.forEach((question) => {
    const answers = [...question.querySelectorAll("[data-quiz-answer]")];
    const feedback = question.querySelector("output");
    answers.forEach((answer) => {
      answer.addEventListener("click", () => {
        if (question.dataset.answered === "true") return;
        question.dataset.answered = "true";
        const isCorrect = answer.dataset.quizAnswer === "true";
        if (isCorrect) score += 1;
        answer.classList.add(isCorrect ? "is-correct" : "is-wrong");
        const correctAnswer = answers.find((candidate) => candidate.dataset.quizAnswer === "true");
        correctAnswer?.classList.add("is-correct");
        answers.forEach((candidate) => { candidate.disabled = true; });
        if (feedback) feedback.textContent = isCorrect ? "¡Correcto!" : "Observa la respuesta marcada en verde.";
        updateScore();
      });
    });
  });

  const resetQuiz = () => {
    score = 0;
    quizQuestions.forEach((question) => {
      delete question.dataset.answered;
      question.querySelectorAll("[data-quiz-answer]").forEach((answer) => {
        answer.disabled = false;
        answer.classList.remove("is-correct", "is-wrong");
      });
      const feedback = question.querySelector("output");
      if (feedback) feedback.textContent = "";
    });
    updateScore();
  };
  deck.querySelector("[data-quiz-reset]")?.addEventListener("click", resetQuiz);

  const resetExperience = () => {
    selectAnatomy("title");
    salesBars.forEach((bar) => bar.classList.remove("is-selected"));
    if (salesOutput) salesOutput.textContent = "Selecciona una barra";
    if (salesDetail) salesDetail.textContent = "Busca primero la altura y relaciónala con la escala.";
    if (revealButton) {
      revealButton.setAttribute("aria-pressed", "false");
      revealButton.textContent = "Mostrar todos los valores";
    }
    salesChart?.classList.remove("show-values");
    challengeOptions.forEach((option) => option.classList.remove("is-correct", "is-wrong"));
    if (challengeFeedback) challengeFeedback.textContent = "Elige una respuesta y revisa la explicación.";
    resetBuilder();
    setMetric("units");
    setScale("honest");
    resetQuiz();
    showSlide(0, true);
  };
  deck.querySelector("[data-restart]")?.addEventListener("click", resetExperience);

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      showSlide(currentSlide + 1, true);
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      showSlide(currentSlide - 1, true);
    }
  });

  deck.classList.add("is-enhanced");
  showSlide(0);
  updateBuilder();
  updateScore();
})();
