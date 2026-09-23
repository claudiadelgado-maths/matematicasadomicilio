(() => {
  const exponentes = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
  const prefijos = [
    { nombre: "mega", exponente: 6 },
    { nombre: "kilo", exponente: 3 },
    { nombre: "hecto", exponente: 2 },
    { nombre: "deca", exponente: 1 },
    { nombre: "deci", exponente: -1 },
    { nombre: "centi", exponente: -2 },
    { nombre: "mili", exponente: -3 },
    { nombre: "micro", exponente: -6 },
    { nombre: "nano", exponente: -9 }
  ];

  const questionType = document.querySelector("[data-question-type]");
  const questionTag = document.querySelector("[data-question-tag]");
  const sourceLabel = document.querySelector("[data-source-label]");
  const sourceValue = document.querySelector("[data-source-value]");
  const questionPrompt = document.querySelector("[data-question-prompt]");
  const answers = document.querySelector("[data-answers]");
  const feedback = document.querySelector("[data-feedback]");
  const manualNext = document.querySelector("[data-manual-next]");
  const nextButton = document.querySelector("[data-next-question]");
  const progressLabel = document.querySelector("[data-progress-label]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const quizCard = document.querySelector("[data-quiz-card]");
  const resultCard = document.querySelector("[data-result]");
  const resultScore = document.querySelector("[data-result-score]");
  const restartButton = document.querySelector("[data-restart]");
  const guideDialog = document.querySelector("[data-guide-dialog]");
  const openGuide = document.querySelector("[data-open-guide]");
  const closeGuide = document.querySelector("[data-close-guide]");

  let questions = [];
  let currentIndex = 0;
  let correctCount = 0;
  let locked = false;
  let autoTimer = null;

  const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const randomCoefficient = () => Math.floor(Math.random() * 9) + 1;

  const m = (tex) => `\\(${tex}\\)`;
  const scientificText = (coefficient, exponent) => m(String.raw`${coefficient} \times 10^{${exponent}}`);

  function decimalText(coefficient, exponent) {
    let value;
    if (exponent >= 0) {
      const integer = `${coefficient}${"0".repeat(exponent)}`;
      value = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      value = `0.${"0".repeat(Math.max(0, -exponent - 1))}${coefficient}`;
    }
    return m(value.replace(/,/g, "{,}"));
  }

  function neighboringExponent(exponent) {
    const candidates = [exponent - 1, exponent + 1, -exponent]
      .filter((value) => value !== exponent && value >= -9 && value <= 9);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function sciToDecimalQuestion(exponent) {
    const coefficient = randomCoefficient();
    const wrongExponent = neighboringExponent(exponent);
    return {
      type: "scientific-to-decimal",
      title: "Convierte a decimal",
      tag: "Notación científica → decimal",
      sourceLabel: "Notación científica",
      source: scientificText(coefficient, exponent),
      prompt: "¿Cuál es el valor equivalente?",
      correct: decimalText(coefficient, exponent),
      wrong: decimalText(coefficient, wrongExponent)
    };
  }

  function decimalToSciQuestion(exponent) {
    const coefficient = randomCoefficient();
    const wrongExponent = neighboringExponent(exponent);
    return {
      type: "decimal-to-scientific",
      title: "Convierte a notación científica",
      tag: "Decimal → notación científica",
      sourceLabel: "Forma decimal",
      source: decimalText(coefficient, exponent),
      prompt: "¿Cuál notación científica representa la misma cantidad?",
      correct: scientificText(coefficient, exponent),
      wrong: scientificText(coefficient, wrongExponent)
    };
  }

  function prefixQuestion(prefix, target) {
    const coefficient = randomCoefficient();
    const wrongExponent = prefix.exponente === 0 ? 1 : -prefix.exponente;
    const wantsDecimal = target === "decimal";
    return {
      type: wantsDecimal ? "prefix-to-decimal" : "prefix-to-scientific",
      title: wantsDecimal ? "Convierte el prefijo a decimal" : "Convierte el prefijo a notación científica",
      tag: `Prefijo ${prefix.nombre}`,
      sourceLabel: "Cantidad con prefijo",
      source: m(String.raw`${coefficient}\,\text{${prefix.nombre}}`),
      prompt: wantsDecimal ? "¿Qué cantidad representa?" : "¿Cuál es su factor equivalente?",
      correct: wantsDecimal ? decimalText(coefficient, prefix.exponente) : scientificText(coefficient, prefix.exponente),
      wrong: wantsDecimal ? decimalText(coefficient, wrongExponent) : scientificText(coefficient, wrongExponent)
    };
  }

  function buildQuestions() {
    const directExponentsA = shuffle(exponentes).slice(0, 9);
    const directExponentsB = shuffle(exponentes).slice(0, 9);
    const prefixSelection = shuffle(prefijos).slice(0, 6);

    const bank = [
      ...directExponentsA.map(sciToDecimalQuestion),
      ...directExponentsB.map(decimalToSciQuestion),
      ...prefixSelection.map((prefix, index) => prefixQuestion(prefix, index % 2 === 0 ? "decimal" : "scientific"))
    ];

    return shuffle(bank);
  }

  function renderQuestion() {
    clearTimeout(autoTimer);
    locked = false;
    feedback.hidden = true;
    feedback.className = "feedback";
    manualNext.hidden = true;

    const question = questions[currentIndex];
    const options = shuffle([question.correct, question.wrong]);

    questionType.textContent = question.title;
    questionTag.textContent = question.tag;
    sourceLabel.textContent = question.sourceLabel;
    sourceValue.textContent = question.source;
    questionPrompt.textContent = question.prompt;
    progressLabel.textContent = `${currentIndex + 1} / ${questions.length}`;
    progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

    answers.innerHTML = "";
    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = option;
      button.dataset.value = option;
      button.addEventListener("click", () => checkAnswer(button, question.correct));
      answers.appendChild(button);
    });
    window.typesetMath?.(sourceValue, answers);
  }

  function checkAnswer(selectedButton, correct) {
    if (locked) return;
    locked = true;

    const buttons = [...answers.querySelectorAll(".answer-button")];
    buttons.forEach((button) => { button.disabled = true; });

    window.repasoFisica?.registrar({type:"choice",prompt:questions[currentIndex].prompt + " " + questions[currentIndex].source,options:buttons.map(b=>b.dataset.value),correct}, selectedButton.dataset.value === correct);
    if (selectedButton.dataset.value === correct) {
      correctCount += 1;
      selectedButton.classList.add("correct");
      feedback.textContent = "¡Bien!";
      feedback.classList.add("success");
      feedback.hidden = false;
      autoTimer = window.setTimeout(goNext, 1000);
      return;
    }

    selectedButton.classList.add("wrong");
    const correctButton = buttons.find((button) => button.dataset.value === correct);
    if (correctButton) correctButton.classList.add("correct");
    feedback.innerHTML = `No era esa. La respuesta correcta es <strong>${correct}</strong>.`;
    window.typesetMath?.(feedback);
    feedback.classList.add("error");
    feedback.hidden = false;
    manualNext.hidden = false;
    nextButton.focus();
  }

  function goNext() {
    clearTimeout(autoTimer);
    if (currentIndex + 1 >= questions.length) {
      finishActivity();
      return;
    }
    currentIndex += 1;
    renderQuestion();
  }

  function finishActivity() {
    quizCard.hidden = true;
    resultCard.hidden = false;
    progressLabel.textContent = `${questions.length} / ${questions.length}`;
    progressBar.style.width = "100%";
    resultScore.textContent = `Obtuviste ${correctCount} de ${questions.length} respuestas correctas.`;
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function restart() {
    clearTimeout(autoTimer);
    questions = buildQuestions();
    currentIndex = 0;
    correctCount = 0;
    resultCard.hidden = true;
    quizCard.hidden = false;
    renderQuestion();
    quizCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  openGuide.addEventListener("click", () => guideDialog.showModal());
  closeGuide.addEventListener("click", () => guideDialog.close());
  guideDialog.addEventListener("click", (event) => {
    if (event.target === guideDialog) guideDialog.close();
  });
  guideDialog.addEventListener("cancel", () => guideDialog.close());
  nextButton.addEventListener("click", goNext);
  restartButton.addEventListener("click", restart);

  restart();
})();
