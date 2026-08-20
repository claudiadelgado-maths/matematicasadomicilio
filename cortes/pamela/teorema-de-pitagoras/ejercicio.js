(() => {
  const problems = [
    { values: { a: 3, b: 4, c: null }, missing: "c", answer: 5, kind: "integer" },
    { values: { a: 5, b: 12, c: null }, missing: "c", answer: 13, kind: "integer" },
    { values: { a: 8, b: 15, c: null }, missing: "c", answer: 17, kind: "integer" },
    { values: { a: 7, b: 24, c: null }, missing: "c", answer: 25, kind: "integer" },
    { values: { a: null, b: 12, c: 13 }, missing: "a", answer: 5, kind: "integer" },
    { values: { a: 8, b: null, c: 17 }, missing: "b", answer: 15, kind: "integer" },
    { values: { a: 5, b: 6, c: null }, missing: "c", radicand: 61, kind: "root" },
    { values: { a: 7, b: 8, c: null }, missing: "c", radicand: 113, kind: "root" },
    { values: { a: 4, b: 7, c: null }, missing: "c", radicand: 65, kind: "root" },
    { values: { a: 8, b: 9, c: null }, missing: "c", radicand: 145, kind: "root" },
    { values: { a: null, b: 4, c: 9 }, missing: "a", radicand: 65, kind: "root" },
    { values: { a: 3, b: null, c: 10 }, missing: "b", radicand: 91, kind: "root" },
    { values: { a: null, b: 7, c: 12 }, missing: "a", radicand: 95, kind: "root" },
    { values: { a: 5, b: null, c: 8 }, missing: "b", radicand: 39, kind: "root" }
  ];

  const root = document.querySelector("[data-pitagoras-game]");
  if (!root) return;

  const problemText = root.querySelector("[data-problem-text]");
  const labels = {
    a: root.querySelector("[data-side-a]"),
    b: root.querySelector("[data-side-b]"),
    c: root.querySelector("[data-side-c]")
  };
  const modeButtons = [...root.querySelectorAll("[data-answer-mode]")];
  const integerWrap = root.querySelector("[data-integer-entry]");
  const rootWrap = root.querySelector("[data-root-entry]");
  const integerInput = root.querySelector("[data-integer-input]");
  const rootInput = root.querySelector("[data-root-input]");
  const feedback = root.querySelector("[data-answer-feedback]");
  const newButton = root.querySelector("[data-new-values]");
  const checkButton = root.querySelector("[data-check-answer]");
  let currentIndex = -1;
  let answerMode = "integer";

  const sideName = (side) => side === "c" ? "la hipotenusa c" : `el cateto ${side}`;
  const formatValue = (value) => value === null ? "?" : String(value);

  function setMode(mode, focusInput = false) {
    answerMode = mode;
    modeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.answerMode === mode)));
    integerWrap.hidden = mode !== "integer";
    rootWrap.hidden = mode !== "root";
    feedback.textContent = "Escribe tu resultado y presiona Comprobar.";
    feedback.dataset.state = "idle";
    if (focusInput) (mode === "integer" ? integerInput : rootInput).focus();
  }

  function renderProblem() {
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) nextIndex = Math.floor(Math.random() * problems.length);
    currentIndex = nextIndex;
    const problem = problems[currentIndex];
    Object.entries(labels).forEach(([side, label]) => { label.textContent = formatValue(problem.values[side]); });
    problemText.textContent = `Encuentra ${sideName(problem.missing)}. La hipotenusa siempre es el lado c.`;
    integerInput.value = "";
    rootInput.value = "";
    setMode("integer");
  }

  function expectedText(problem) {
    return problem.kind === "root" ? `√${problem.radicand}` : String(problem.answer);
  }

  function solutionText(problem) {
    if (problem.missing === "c") {
      const sum = problem.values.a ** 2 + problem.values.b ** 2;
      return `c² = ${problem.values.a}² + ${problem.values.b}² = ${sum}; por tanto c = ${expectedText(problem)}.`;
    }
    const knownLeg = problem.missing === "a" ? problem.values.b : problem.values.a;
    const difference = problem.values.c ** 2 - knownLeg ** 2;
    return `${problem.missing}² = ${problem.values.c}² − ${knownLeg}² = ${difference}; por tanto ${problem.missing} = ${expectedText(problem)}.`;
  }

  function checkAnswer() {
    const problem = problems[currentIndex];
    const rawValue = answerMode === "integer" ? integerInput.value : rootInput.value;
    const value = Number(rawValue);
    if (!rawValue.trim() || !Number.isInteger(value) || value <= 0) {
      feedback.textContent = answerMode === "integer" ? "Escribe un número entero positivo." : "Escribe un radicando entero positivo dentro de la raíz.";
      feedback.dataset.state = "incorrect";
      return;
    }

    const correct = answerMode === "integer"
      ? problem.kind === "integer" && value === problem.answer
      : value === (problem.kind === "root" ? problem.radicand : problem.answer ** 2);

    if (correct) {
      feedback.textContent = `¡Correcto! ${solutionText(problem)}`;
      feedback.dataset.state = "correct";
    } else {
      feedback.textContent = "Todavía no. Recuerda: para hallar la hipotenusa se suman cuadrados; para hallar un cateto se restan al cuadrado.";
      feedback.dataset.state = "incorrect";
    }
  }

  modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.answerMode, true)));
  newButton.addEventListener("click", renderProblem);
  checkButton.addEventListener("click", checkAnswer);
  [integerInput, rootInput].forEach((input) => input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkAnswer();
  }));

  renderProblem();
})();
