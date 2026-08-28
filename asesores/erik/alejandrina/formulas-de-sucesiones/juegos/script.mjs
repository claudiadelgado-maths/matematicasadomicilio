import {
  directionFromDifference,
  randomInteger,
  randomNonZero,
  renderMath,
  shuffle,
  termAt,
  uniqueOptions,
} from "../formulas.mjs";

const totalQuestions = 12;
const questionPanel = document.querySelector("[data-question-panel]");
const summary = document.querySelector("[data-summary]");
const progressLabel = document.querySelector("[data-progress-label]");
const categoryElement = document.querySelector("[data-category]");
const scoreElement = document.querySelector("[data-score]");
const correctElement = document.querySelector("[data-correct]");
const progressBar = document.querySelector("[data-progress-bar]");
const baseFormula = document.querySelector("[data-base-formula]");
const questionNumber = document.querySelector("[data-question-number]");
const promptElement = document.querySelector("[data-prompt]");
const contextElement = document.querySelector("[data-context]");
const optionsElement = document.querySelector("[data-options]");
const feedback = document.querySelector("[data-feedback]");
const nextButton = document.querySelector("[data-next]");

let questionIndex = 0;
let score = 0;
let correctAnswers = 0;
let questions = [];
let locked = false;

const formulaQuestion = (category, prompt, answer, distractors, explanation) => ({
  category,
  prompt,
  context: "¿Qué fórmula rescata la incógnita?",
  contextMath: false,
  options: shuffle([answer, ...distractors]),
  answer,
  optionsMath: true,
  explanation,
});

const termFormulaQuestion = () => formulaQuestion(
  "Elige la fórmula · aₙ",
  "🎯 Conoces a₁, d y n. ¿Qué fórmula encuentra aₙ?",
  "a_n=a_1+(n-1)d",
  ["a_n=a_1+nd", "a_n=a_1+(n+1)d", "a_n=\\frac{a_1}{(n-1)d}"],
  "aₙ se obtiene sumando al primer término los n − 1 saltos de tamaño d.",
);

const firstFormulaQuestion = () => formulaQuestion(
  "Elige la fórmula · a₁",
  "🌱 ¿Qué despeje permite encontrar el primer término?",
  "a_1=a_n-(n-1)d",
  ["a_1=a_n+(n-1)d", "a_1=\\frac{a_n}{n-1}", "a_1=a_n-nd"],
  "Para regresar al inicio se resta a aₙ el avance total: (n − 1)d.",
);

const differenceFormulaQuestion = () => formulaQuestion(
  "Elige la fórmula · d",
  "🪜 Conoces aᵢ, aⱼ y sus posiciones. ¿Cómo calculas d?",
  "d=\\frac{a_i-a_j}{i-j}",
  ["d=\\frac{a_i+a_j}{i+j}", "d=\\frac{i-j}{a_i-a_j}", "d=a_i-a_j"],
  "El cambio de valores se divide entre el cambio de posiciones, conservando el mismo orden.",
);

const positionFormulaQuestion = () => formulaQuestion(
  "Elige la fórmula · n",
  "📍 ¿Qué despeje encuentra la posición de un término?",
  "n=\\frac{a_n-a_1}{d}+1",
  ["n=\\frac{a_n+a_1}{d}-1", "n=\\frac{d}{a_n-a_1}+1", "n=\\frac{a_n-a_1}{d}-1"],
  "Primero cuentas los saltos con (aₙ − a₁) ÷ d y luego sumas la posición inicial 1.",
);

const directionQuestion = () => {
  const difference = randomNonZero(-9, 9);
  const answer = directionFromDifference(difference);
  return {
    category: "Lee el signo de d",
    prompt: `📈📉 Si d = ${difference}, ¿cómo es la sucesión?`,
    context: `d=${difference}`,
    contextMath: true,
    options: shuffle(["creciente", "decreciente", "constante", "no aritmética"]),
    answer,
    optionsMath: false,
    explanation: `El signo de d es ${difference > 0 ? "positivo" : "negativo"}; por eso la sucesión es ${answer}.`,
  };
};

const numericTermQuestion = () => {
  const first = randomInteger(-15, 45);
  const difference = randomNonZero(-8, 9);
  const position = randomInteger(4, 10);
  const answer = termAt(first, difference, position);
  return {
    category: "Calcula aₙ",
    prompt: `🎯 ¿Cuánto vale a${position}?`,
    context: `a_1=${first},\\quad d=${difference},\\quad n=${position}`,
    contextMath: true,
    options: uniqueOptions(answer, [answer + difference, answer - difference, first + position * difference, position]),
    answer,
    optionsMath: true,
    explanation: `Hay ${position - 1} saltos: a${position} = ${first} + (${position} − 1)(${difference}) = ${answer}.`,
  };
};

const numericFirstQuestion = () => {
  const first = randomInteger(-20, 45);
  const difference = randomNonZero(-9, 9);
  const position = randomInteger(4, 10);
  const term = termAt(first, difference, position);
  return {
    category: "Calcula a₁",
    prompt: "🌱 ¿Cuál es el primer término?",
    context: `a_{${position}}=${term},\\quad d=${difference}`,
    contextMath: true,
    options: uniqueOptions(first, [term - position * difference, term + (position - 1) * difference, term, difference]),
    answer: first,
    optionsMath: true,
    explanation: `a₁ = ${term} − (${position} − 1)(${difference}) = ${first}.`,
  };
};

const numericDifferenceQuestion = () => {
  const first = randomInteger(-10, 40);
  const difference = randomNonZero(-9, 9);
  const positionI = randomInteger(2, 5);
  const positionJ = randomInteger(positionI + 2, 10);
  const termI = termAt(first, difference, positionI);
  const termJ = termAt(first, difference, positionJ);
  return {
    category: "Calcula d",
    prompt: "🪜 ¿Cuál es la diferencia común?",
    context: `a_{${positionI}}=${termI},\\quad a_{${positionJ}}=${termJ}`,
    contextMath: true,
    options: uniqueOptions(difference, [termJ - termI, positionJ - positionI, -difference, Math.abs(difference)]),
    answer: difference,
    optionsMath: true,
    explanation: `d = (${termJ} − ${termI}) ÷ (${positionJ} − ${positionI}) = ${difference}.`,
  };
};

const numericPositionQuestion = () => {
  const first = randomInteger(-15, 40);
  const difference = randomNonZero(-8, 8);
  const position = randomInteger(4, 12);
  const term = termAt(first, difference, position);
  return {
    category: "Calcula n",
    prompt: `📍 ¿Qué posición ocupa el término ${term}?`,
    context: `a_1=${first},\\quad d=${difference},\\quad a_n=${term}`,
    contextMath: true,
    options: uniqueOptions(position, [position - 1, position + 1, term, Math.abs(difference)]),
    answer: position,
    optionsMath: true,
    explanation: `n = (${term} − ${first}) ÷ ${difference} + 1 = ${position}.`,
  };
};

const orderQuestion = () => ({
  category: "Cuida el orden",
  prompt: "🔁 Si el numerador es aⱼ − aᵢ, ¿qué debe aparecer en el denominador?",
  context: "El orden de los términos y las posiciones debe coincidir.",
  contextMath: false,
  options: shuffle(["j − i", "i − j", "j + i", "i × j"]),
  answer: "j − i",
  optionsMath: false,
  explanation: "El mismo orden evita cambiar por accidente el signo de d: (aⱼ − aᵢ) ÷ (j − i).",
});

const zeroDifferenceQuestion = () => ({
  category: "Condiciones de uso",
  prompt: "🚫 Si d = 0, ¿qué ocurre al intentar encontrar una posición única con la fórmula de n?",
  context: "n=\\frac{a_n-a_1}{d}+1",
  contextMath: true,
  options: shuffle(["Se dividiría entre cero", "n siempre vale 1", "La sucesión deja de ser aritmética", "d cambia a 1"]),
  answer: "Se dividiría entre cero",
  optionsMath: false,
  explanation: "Con d = 0 todos los términos son iguales y no existe una posición única para ese mismo valor.",
});

const availableDataQuestion = () => ({
  category: "Detecta la incógnita",
  prompt: "🕵️‍♀️ Conoces a₄, a₉ y sus posiciones. ¿Qué elemento puedes encontrar directamente?",
  context: "a_4,\\quad a_9,\\quad 4,\\quad 9",
  contextMath: true,
  options: shuffle(["La diferencia d", "La suma de todos los términos", "Una razón geométrica", "El número de términos de una serie"]),
  answer: "La diferencia d",
  optionsMath: false,
  explanation: "Dos términos y sus posiciones permiten calcular directamente d con el cociente de cambios.",
});

const buildQuestions = () => {
  const coreQuestions = [
    termFormulaQuestion(),
    firstFormulaQuestion(),
    differenceFormulaQuestion(),
    positionFormulaQuestion(),
  ];
  const practicePool = [
    directionQuestion(),
    directionQuestion(),
    numericTermQuestion(),
    numericTermQuestion(),
    numericFirstQuestion(),
    numericFirstQuestion(),
    numericDifferenceQuestion(),
    numericDifferenceQuestion(),
    numericPositionQuestion(),
    numericPositionQuestion(),
    orderQuestion(),
    zeroDifferenceQuestion(),
    availableDataQuestion(),
  ];

  return shuffle([
    ...coreQuestions,
    ...shuffle(practicePool).slice(0, totalQuestions - coreQuestions.length),
  ]);
};

const renderContext = (question) => {
  if (question.contextMath) renderMath(contextElement, question.context);
  else contextElement.textContent = question.context;
};

const selectOption = (button, question) => {
  if (locked) return;
  locked = true;
  const selectedValue = button.dataset.value;
  const correct = selectedValue === String(question.answer);
  optionsElement.querySelectorAll("button").forEach((option) => {
    option.disabled = true;
    if (option.dataset.value === String(question.answer)) option.classList.add("is-correct");
  });
  button.classList.add(correct ? "is-correct" : "is-wrong");
  if (correct) {
    score += 10;
    correctAnswers += 1;
    feedback.dataset.kind = "success";
    feedback.textContent = `🎉 ¡Correcto! ${question.explanation} ⭐`;
  } else {
    feedback.dataset.kind = "error";
    feedback.textContent = `💡 Casi. ${question.explanation} ¡A por el siguiente reto!`;
  }
  feedback.hidden = false;
  scoreElement.textContent = String(score);
  correctElement.textContent = String(correctAnswers);
  nextButton.hidden = false;
  nextButton.textContent = questionIndex === totalQuestions - 1 ? "🏁 Ver resultado" : "➡️ Siguiente reto";
  nextButton.focus();
};

const renderOptions = (question) => {
  optionsElement.replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.dataset.value = String(option);
    const letter = document.createElement("span");
    letter.className = "choice-letter";
    letter.textContent = String.fromCharCode(65 + index);
    const content = document.createElement("span");
    content.className = "option-math";
    if (question.optionsMath) renderMath(content, String(option));
    else content.textContent = String(option);
    button.append(letter, content);
    button.addEventListener("click", () => selectOption(button, question));
    optionsElement.append(button);
  });
};

const showQuestion = (focusTitle = false) => {
  locked = false;
  const question = questions[questionIndex];
  progressLabel.textContent = `Reto ${questionIndex + 1} de ${totalQuestions}`;
  categoryElement.textContent = question.category;
  questionNumber.textContent = String(questionIndex + 1);
  promptElement.textContent = question.prompt;
  progressBar.style.width = `${((questionIndex + 1) / totalQuestions) * 100}%`;
  feedback.hidden = true;
  feedback.removeAttribute("data-kind");
  nextButton.hidden = true;
  renderContext(question);
  renderOptions(question);
  if (focusTitle) promptElement.focus();
};

const finishGame = () => {
  questionPanel.hidden = true;
  summary.hidden = false;
  document.querySelector("[data-final-score]").textContent = String(score);
  const message = document.querySelector("[data-final-message]");
  if (correctAnswers === totalQuestions) message.textContent = "🌟 ¡Perfecto! Encontraste todas las incógnitas sin perder ninguna fórmula.";
  else if (correctAnswers >= 9) message.textContent = `🚀 Lograste ${correctAnswers} de ${totalQuestions}. Ya eliges los despejes con mucha seguridad.`;
  else if (correctAnswers >= 6) message.textContent = `💪 Lograste ${correctAnswers} de ${totalQuestions}. Repasa las condiciones y vuelve a intentarlo.`;
  else message.textContent = `🧩 Lograste ${correctAnswers} de ${totalQuestions}. Vuelve a la explicación, sigue el mapa y prueba otra partida.`;
  document.querySelector("[data-summary-title]").focus();
};

nextButton.addEventListener("click", () => {
  questionIndex += 1;
  if (questionIndex >= totalQuestions) finishGame();
  else showQuestion(true);
});

const startGame = () => {
  questionIndex = 0;
  score = 0;
  correctAnswers = 0;
  questions = buildQuestions();
  questionPanel.hidden = false;
  summary.hidden = true;
  scoreElement.textContent = "0";
  correctElement.textContent = "0";
  renderMath(baseFormula, "a_n=a_1+(n-1)d");
  showQuestion(false);
};

document.querySelector("[data-restart]").addEventListener("click", startGame);
window.addEventListener("load", startGame, { once: true });
