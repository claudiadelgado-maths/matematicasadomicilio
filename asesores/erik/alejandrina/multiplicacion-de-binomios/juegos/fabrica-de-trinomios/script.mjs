import { add, binomialLatex, fractionLatex, isZero, negate, polynomialLatex, product, rational, renderLatex, shuffle } from "../../binomios.mjs";

const easyProblems = [
  [2, 1, 1, 3],
  [1, 2, 2, 1],
  [2, -1, 1, 2],
  [3, 1, 1, -1],
  [1, -2, 2, 3],
  [3, -2, 1, 2],
  [1, 1, 1, 4],
  [2, 3, 1, -2]
].map((values) => values.map((value) => rational(value)));

const game = document.querySelector("[data-game]");
const orderElement = document.querySelector("[data-order]");
const completedElement = document.querySelector("[data-completed]");
const workerMessage = document.querySelector("[data-worker-message]");
const stageEmoji = document.querySelector("[data-stage-emoji]");
const stageName = document.querySelector("[data-stage-name]");
const stagePrompt = document.querySelector("[data-stage-prompt]");
const question = document.querySelector("[data-question]");
const optionsElement = document.querySelector("[data-options]");
const feedback = document.querySelector("[data-game-feedback]");
const nextButton = document.querySelector("[data-next]");
const stageContent = document.querySelector("[data-stage-content]");
const finishPanel = document.querySelector("[data-finish]");
const finishTitle = document.querySelector("[data-finish-title]");
const finishResult = document.querySelector("[data-finish-result]");
const processOriginal = document.querySelector("[data-process-original]");
const processSteps = [...document.querySelectorAll("[data-process-step]")];
const stageChips = [...document.querySelectorAll("[data-stage-chip]")];

let stage = 0;
let orderNumber = 0;
let problemIndex = -1;
let values;
let answer;
let currentStage;

const absolute = (value) => rational(Math.abs(value.n), value.d);

const magnitudeLatex = (value, variable = "") => {
  const magnitude = absolute(value);
  const coefficient = variable && magnitude.n === magnitude.d ? "" : fractionLatex(magnitude);
  return coefficient + variable;
};

const signedTerm = (value, variable = "", first = false) => {
  if (isZero(value)) return "";
  return (value.n < 0 ? "-" : (first ? "" : "+")) + magnitudeLatex(value, variable);
};

const factorLatex = (value, variable = "") => "\\left(" + fractionLatex(value) + variable + "\\right)";

const distributedLatex = ([a, b, c, d]) => {
  const second = binomialLatex(c, d);
  return signedTerm(a, "x", true) + second + (isZero(b) ? "" : signedTerm(b) + second);
};

const expandedLatex = (result, ad = result.ad, bc = result.bc) => signedTerm(result.ac, "x^2", true)
  + signedTerm(ad, "x") + signedTerm(bc, "x") + signedTerm(result.bd);

const groupedLatex = (result, operator = "+", right = result.bc) => {
  let inside;
  if (operator === "+") inside = fractionLatex(result.ad) + signedTerm(right);
  else if (operator === "-") inside = fractionLatex(result.ad) + (right.n < 0 ? "+" : "-") + fractionLatex(absolute(right));
  else inside = fractionLatex(result.ad) + "\\cdot\\left(" + fractionLatex(right) + "\\right)";
  return signedTerm(result.ac, "x^2", true) + "+\\left(" + inside + "\\right)x" + signedTerm(result.bd);
};

const asPolynomial = (quadratic, linear, constant) => ({ quadratic, linear, constant });

const uniqueOptions = (correct, distractors) => {
  const uniqueDistractors = [...new Set(distractors.filter((latex) => latex !== correct))];
  return shuffle([
    { latex: correct, correct: true },
    ...shuffle(uniqueDistractors).slice(0, 2).map((latex) => ({ latex, correct: false }))
  ]);
};

const stageDefinition = (stageIndex) => {
  const [a, b, c, d] = values;
  const original = binomialLatex(a, b) + binomialLatex(c, d);

  if (stageIndex === 0) {
    const correct = distributedLatex(values);
    return {
      id: "distribute", emoji: "🧩", name: "Etapa 1 · Distribuir",
      prompt: "¿Cómo distribuimos el primer binomio?",
      request: "Esta orden se atascó. ¿Me ayudas a repartir cada término?",
      thanks: "¡Gracias! Cada término ya multiplica al segundo binomio. 🧩",
      correct,
      options: uniqueOptions(correct, [
        signedTerm(a, "x", true) + binomialLatex(c, d) + signedTerm(b),
        factorLatex(a, "x") + factorLatex(c, "x") + "+" + factorLatex(b) + factorLatex(d),
        original + "+" + binomialLatex(c, d)
      ])
    };
  }

  if (stageIndex === 1) {
    const correct = expandedLatex(answer);
    return {
      id: "multiply", emoji: "✖️", name: "Etapa 2 · Multiplicar",
      prompt: "¿Cuáles son los cuatro productos?",
      request: "¡Okey! Ahora necesito calcular las cuatro multiplicaciones.",
      thanks: "¡Eso es! Las cuatro piezas ya tienen su valor. ⚙️",
      correct,
      options: uniqueOptions(correct, [
        expandedLatex(answer, negate(answer.ad), answer.bc),
        expandedLatex(answer, answer.ad, negate(answer.bc)),
        signedTerm(answer.ac, "x^2", true) + signedTerm(answer.ad, "x") + signedTerm(answer.bd)
      ])
    };
  }

  if (stageIndex === 2) {
    const correct = groupedLatex(answer);
    return {
      id: "gather", emoji: "🧲", name: "Etapa 3 · Reunir",
      prompt: "¿Cómo reunimos los dos términos con x?",
      request: "Los dos productos del centro tienen x. ¿Me ayudas a reunirlos?",
      thanks: "¡Perfecto! Los términos con x ya trabajan juntos. 🧲",
      correct,
      options: uniqueOptions(correct, [
        groupedLatex(answer, "-"),
        groupedLatex(answer, "\\cdot"),
        groupedLatex(answer, "+", answer.bd)
      ])
    };
  }

  const correct = polynomialLatex(answer);
  return {
    id: "finish", emoji: "✨", name: "Etapa 4 · Terminar",
    prompt: "¿Cuál es el trinomio terminado?",
    request: "¡Última ayuda! Simplifica el número que acompaña a x.",
    thanks: "¡Gracias, colega! La orden quedó lista para salir. 🎉",
    correct,
    options: uniqueOptions(correct, [
      polynomialLatex(asPolynomial(answer.quadratic, add(answer.linear, rational(1)), answer.constant)),
      polynomialLatex(asPolynomial(answer.quadratic, negate(answer.linear), answer.constant)),
      polynomialLatex(asPolynomial(answer.quadratic, answer.linear, negate(answer.constant)))
    ])
  };
};

const updateProgress = (completed = stage) => {
  completedElement.textContent = completed + " de 4 ayudas listas";
  stageChips.forEach((chip, index) => {
    chip.classList.toggle("is-complete", index < completed);
    chip.classList.toggle("is-current", index === stage && completed === stage);
    if (index === stage && completed === stage) chip.setAttribute("aria-current", "step");
    else chip.removeAttribute("aria-current");
  });
};

const renderOptions = () => {
  optionsElement.replaceChildren(...currentStage.options.map((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "factory-answer";
    button.dataset.correct = String(option.correct);
    button.setAttribute("aria-label", "Opción " + (index + 1));
    const decoration = document.createElement("span");
    decoration.className = "answer-decoration";
    decoration.setAttribute("aria-hidden", "true");
    decoration.textContent = ["🔩", "⚙️", "📦"][index];
    const math = document.createElement("span");
    math.className = "option-math";
    renderLatex(math, option.latex);
    button.append(decoration, math);
    button.addEventListener("click", () => choose(button));
    return button;
  }));
  optionsElement.querySelector("button").focus();
};

const showStage = () => {
  currentStage = stageDefinition(stage);
  game.dataset.stage = currentStage.id;
  stageEmoji.textContent = currentStage.emoji;
  stageName.textContent = currentStage.name;
  stagePrompt.textContent = currentStage.prompt;
  workerMessage.textContent = currentStage.request;
  feedback.hidden = true;
  nextButton.hidden = true;
  renderOptions();
  updateProgress();
};

const choose = (selected) => {
  const correct = selected.dataset.correct === "true";
  if (!correct) {
    selected.disabled = true;
    selected.classList.add("is-wrong");
    feedback.hidden = false;
    feedback.dataset.kind = "error";
    feedback.textContent = stage === 0
      ? "Casi, colega. Recuerda repartir a los dos términos. Prueba otra pieza. 💛"
      : stage === 1
        ? "Casi. Deben aparecer los cuatro productos. Intenta otra vez. 💛"
        : stage === 2
          ? "Casi. Solo reunimos los dos términos que tienen x. 💛"
          : "Ya casi. Revisa la suma de los números que acompañan a x. 💛";
    return;
  }

  optionsElement.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    if (button.dataset.correct === "true") button.classList.add("is-correct");
  });

  const processItem = processSteps[stage];
  processItem.classList.add("is-complete");
  processItem.querySelector("[data-process-placeholder]").hidden = true;
  renderLatex(processItem.querySelector("[data-process-math]"), currentStage.correct);
  feedback.hidden = false;
  feedback.dataset.kind = "success";
  feedback.textContent = currentStage.thanks;
  workerMessage.textContent = currentStage.thanks;
  updateProgress(stage + 1);
  nextButton.hidden = false;
  nextButton.textContent = stage === 3 ? "Ver la orden terminada" : "Seguir ayudando";
  nextButton.focus();
};

const finish = () => {
  game.dataset.stage = "complete";
  stageContent.hidden = true;
  finishPanel.hidden = false;
  workerMessage.textContent = "¡Gracias, colega! Juntos construimos todo el procedimiento.";
  renderLatex(finishResult, binomialLatex(values[0], values[1]) + binomialLatex(values[2], values[3]) + "=" + polynomialLatex(answer));
  finishTitle.focus();
};

const chooseProblem = () => {
  const candidates = easyProblems.map((_, index) => index).filter((index) => index !== problemIndex);
  problemIndex = shuffle(candidates)[0];
  values = easyProblems[problemIndex];
  answer = product(...values);
};

const startOrder = () => {
  orderNumber += 1;
  stage = 0;
  chooseProblem();
  orderElement.textContent = "Orden fácil " + orderNumber;
  stageContent.hidden = false;
  finishPanel.hidden = true;
  processSteps.forEach((item, index) => {
    item.classList.remove("is-complete");
    item.querySelector("[data-process-placeholder]").hidden = false;
    item.querySelector("[data-process-placeholder]").textContent = index === 0 ? "Esperando tu ayuda…" : "Todavía no llegamos aquí.";
    item.querySelector("[data-process-math]").replaceChildren();
  });
  renderLatex(processOriginal, binomialLatex(values[0], values[1]) + binomialLatex(values[2], values[3]));
  renderLatex(question, binomialLatex(values[0], values[1]) + binomialLatex(values[2], values[3]));
  showStage();
};

nextButton.addEventListener("click", () => {
  if (stage === 3) finish();
  else {
    stage += 1;
    showStage();
  }
});

document.querySelector("[data-new-order]").addEventListener("click", startOrder);
window.addEventListener("load", startOrder, { once: true });
