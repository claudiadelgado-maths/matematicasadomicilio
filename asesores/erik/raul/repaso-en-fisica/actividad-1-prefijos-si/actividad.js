(() => {
  const prefijos = [
    { nombre: "yotta", simbolo: "Y", exponente: 24 },
    { nombre: "zetta", simbolo: "Z", exponente: 21 },
    { nombre: "exa", simbolo: "E", exponente: 18 },
    { nombre: "peta", simbolo: "P", exponente: 15 },
    { nombre: "tera", simbolo: "T", exponente: 12 },
    { nombre: "giga", simbolo: "G", exponente: 9 },
    { nombre: "mega", simbolo: "M", exponente: 6 },
    { nombre: "kilo", simbolo: "k", exponente: 3 },
    { nombre: "hecto", simbolo: "h", exponente: 2 },
    { nombre: "deca", simbolo: "da", exponente: 1 },
    { nombre: "sin prefijo", simbolo: "—", exponente: 0 },
    { nombre: "deci", simbolo: "d", exponente: -1 },
    { nombre: "centi", simbolo: "c", exponente: -2 },
    { nombre: "mili", simbolo: "m", exponente: -3 },
    { nombre: "micro", simbolo: "µ", exponente: -6 },
    { nombre: "nano", simbolo: "n", exponente: -9 },
    { nombre: "pico", simbolo: "p", exponente: -12 },
    { nombre: "femto", simbolo: "f", exponente: -15 },
    { nombre: "atto", simbolo: "a", exponente: -18 },
    { nombre: "zepto", simbolo: "z", exponente: -21 },
    { nombre: "yocto", simbolo: "y", exponente: -24 }
  ];

  const questionType = document.querySelector("[data-question-type]");
  const clues = document.querySelector("[data-clues]");
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
  const tableDialog = document.querySelector("[data-table-dialog]");
  const tableBody = document.querySelector("[data-prefix-table]");
  const openTable = document.querySelector("[data-open-table]");
  const closeTable = document.querySelector("[data-close-table]");

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

  const factorText = (exponente) => exponente === 0 ? "\\(1\\)" : `\\(10^{${exponente}}\\)`;

  function buildQuestions() {
    const shuffled = shuffle(prefijos);
    const types = ["simbolo", "factor", "nombre"];
    return shuffled.map((item, index) => ({ item, type: types[index % types.length] }));
  }

  function getValue(item, type) {
    if (type === "simbolo") return item.simbolo;
    if (type === "factor") return factorText(item.exponente);
    return item.nombre;
  }

  function makeDistractor(item, type) {
    const candidates = prefijos.filter((candidate) => getValue(candidate, type) !== getValue(item, type));

    if (type === "factor") {
      const nearby = candidates
        .map((candidate) => ({ candidate, distance: Math.abs(candidate.exponente - item.exponente) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4)
        .map((entry) => entry.candidate);
      return getValue(nearby[Math.floor(Math.random() * nearby.length)], type);
    }

    const lookalikePairs = {
      Y: "y", y: "Y", Z: "z", z: "Z", P: "p", p: "P", M: "m", m: "M"
    };
    if (type === "simbolo" && lookalikePairs[item.simbolo]) return lookalikePairs[item.simbolo];

    return getValue(candidates[Math.floor(Math.random() * candidates.length)], type);
  }

  function clueMarkup(label, value, isFactor = false) {
    return `<div class="clue"><span class="clue-label">${label}</span><strong class="clue-value${isFactor ? " factor" : ""}">${value}</strong></div>`;
  }

  function renderQuestion() {
    clearTimeout(autoTimer);
    locked = false;
    feedback.hidden = true;
    feedback.className = "feedback";
    manualNext.hidden = true;

    const { item, type } = questions[currentIndex];
    const correct = getValue(item, type);
    const distractor = makeDistractor(item, type);
    const options = shuffle([correct, distractor]);

    progressLabel.textContent = `${currentIndex + 1} / ${questions.length}`;
    progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

    if (type === "simbolo") {
      questionType.textContent = "¿Cuál es el símbolo?";
      clues.innerHTML = clueMarkup("Prefijo", item.nombre) + clueMarkup("Factor", factorText(item.exponente), true);
    } else if (type === "factor") {
      questionType.textContent = "¿Cuál es la potencia de diez?";
      clues.innerHTML = clueMarkup("Prefijo", item.nombre) + clueMarkup("Símbolo", item.simbolo);
    } else {
      questionType.textContent = "¿Qué prefijo es?";
      clues.innerHTML = clueMarkup("Símbolo", item.simbolo) + clueMarkup("Factor", factorText(item.exponente), true);
    }

    answers.innerHTML = "";
    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = option;
      button.dataset.value = option;
      button.addEventListener("click", () => checkAnswer(button, correct));
      answers.appendChild(button);
    });
    window.typesetMath?.(clues, answers);
  }

  function checkAnswer(selectedButton, correct) {
    if (locked) return;
    locked = true;

    const buttons = [...answers.querySelectorAll(".answer-button")];
    buttons.forEach((button) => { button.disabled = true; });

    const q = questions[currentIndex];
    const clue = q.type === "simbolo" ? q.item.nombre+" · "+factorText(q.item.exponente) : q.type === "factor" ? q.item.nombre+" · "+q.item.simbolo : q.item.simbolo+" · "+factorText(q.item.exponente);
    window.repasoFisica?.registrar({type:"choice",prompt:questionType.textContent+" "+clue,options:buttons.map(b=>b.dataset.value),correct},selectedButton.dataset.value===correct);
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

  function renderTable() {
    tableBody.innerHTML = prefijos.map((item) => `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.simbolo}</td>
        <td class="factor-cell">${factorText(item.exponente)}</td>
      </tr>
    `).join("");
    window.typesetMath?.(tableBody);
  }

  openTable.addEventListener("click", () => tableDialog.showModal());
  closeTable.addEventListener("click", () => tableDialog.close());
  tableDialog.addEventListener("click", (event) => {
    if (event.target === tableDialog) tableDialog.close();
  });
  tableDialog.addEventListener("cancel", () => tableDialog.close());
  nextButton.addEventListener("click", goNext);
  restartButton.addEventListener("click", restart);

  renderTable();
  restart();
})();
