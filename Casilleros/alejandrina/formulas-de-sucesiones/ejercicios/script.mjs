import {
  randomInteger,
  randomNonZero,
  renderMath,
  termAt,
} from "../formulas.mjs";

const grid = document.querySelector("[data-exercise-grid]");
const scoreElement = document.querySelector("[data-score]");
const roundElement = document.querySelector("[data-round]");
const newRoundButton = document.querySelector("[data-new-round]");

let round = 0;
let solved = new Set();

const newSequence = () => ({
  first: randomInteger(-24, 70),
  difference: randomNonZero(-12, 12),
});

const termQuestion = () => {
  const sequence = newSequence();
  const position = randomInteger(4, 12);
  const answer = termAt(sequence.first, sequence.difference, position);
  return {
    title: "Encuentra aₙ",
    prompt: `Con a₁ = ${sequence.first}, d = ${sequence.difference} y n = ${position}, ¿cuánto vale a${position}?`,
    latex: `a_1=${sequence.first},\\quad d=${sequence.difference},\\quad n=${position}`,
    answer,
    hint: "Sustituye en aₙ = a₁ + (n − 1)d y recuerda calcular n − 1 antes de multiplicar.",
    solution: `a_{${position}}=${sequence.first}+(${position}-1)(${sequence.difference})=${answer}`,
  };
};

const firstQuestion = () => {
  const sequence = newSequence();
  const position = randomInteger(3, 11);
  const term = termAt(sequence.first, sequence.difference, position);
  return {
    title: "Encuentra a₁",
    prompt: `Sabes que a${position} = ${term} y d = ${sequence.difference}. ¿Cuál es el primer término?`,
    latex: `a_{${position}}=${term},\\quad d=${sequence.difference}`,
    answer: sequence.first,
    hint: "Regresa desde aₙ hasta a₁: resta (n − 1)d al término conocido.",
    solution: `a_1=${term}-(${position}-1)(${sequence.difference})=${sequence.first}`,
  };
};

const differenceFromFirstQuestion = () => {
  const sequence = newSequence();
  const position = randomInteger(4, 12);
  const term = termAt(sequence.first, sequence.difference, position);
  return {
    title: "Encuentra d desde a₁",
    prompt: `Si a₁ = ${sequence.first} y a${position} = ${term}, ¿cuál es la diferencia común?`,
    latex: `a_1=${sequence.first},\\quad a_{${position}}=${term}`,
    answer: sequence.difference,
    hint: "Divide el cambio de valores, aₙ − a₁, entre los n − 1 saltos.",
    solution: `d=\\frac{${term}-${sequence.first}}{${position}-1}=${sequence.difference}`,
  };
};

const differenceBetweenTermsQuestion = () => {
  const sequence = newSequence();
  const positionI = randomInteger(2, 6);
  const positionJ = randomInteger(positionI + 2, 12);
  const termI = termAt(sequence.first, sequence.difference, positionI);
  const termJ = termAt(sequence.first, sequence.difference, positionJ);
  return {
    title: "Encuentra d entre dos posiciones",
    prompt: `Con a${positionI} = ${termI} y a${positionJ} = ${termJ}, calcula d.`,
    latex: `a_{${positionI}}=${termI},\\quad a_{${positionJ}}=${termJ}`,
    answer: sequence.difference,
    hint: "Haz término final menos término inicial y divide entre posición final menos posición inicial.",
    solution: `d=\\frac{${termJ}-${termI}}{${positionJ}-${positionI}}=${sequence.difference}`,
  };
};

const positionQuestion = () => {
  const sequence = newSequence();
  const position = randomInteger(4, 14);
  const term = termAt(sequence.first, sequence.difference, position);
  return {
    title: "Encuentra n",
    prompt: `En una sucesión con a₁ = ${sequence.first} y d = ${sequence.difference}, ¿qué posición ocupa el término ${term}?`,
    latex: `a_n=${term},\\quad a_1=${sequence.first},\\quad d=${sequence.difference}`,
    answer: position,
    hint: "Calcula (aₙ − a₁) ÷ d y al final suma 1.",
    solution: `n=\\frac{${term}-${sequence.first}}{${sequence.difference}}+1=${position}`,
  };
};

const termFromKnownTermQuestion = () => {
  const sequence = newSequence();
  const knownPosition = randomInteger(2, 6);
  const targetPosition = randomInteger(knownPosition + 2, 13);
  const knownTerm = termAt(sequence.first, sequence.difference, knownPosition);
  const answer = termAt(sequence.first, sequence.difference, targetPosition);
  return {
    title: "Avanza desde un término conocido",
    prompt: `Si a${knownPosition} = ${knownTerm} y d = ${sequence.difference}, ¿cuánto vale a${targetPosition}?`,
    latex: `a_{${knownPosition}}=${knownTerm},\\quad d=${sequence.difference},\\quad ?=a_{${targetPosition}}`,
    answer,
    hint: `Desde la posición ${knownPosition} hasta la ${targetPosition} hay ${targetPosition - knownPosition} saltos.`,
    solution: `a_{${targetPosition}}=${knownTerm}+(${targetPosition}-${knownPosition})(${sequence.difference})=${answer}`,
  };
};

const buildQuestions = () => [
  termQuestion(),
  firstQuestion(),
  differenceFromFirstQuestion(),
  differenceBetweenTermsQuestion(),
  positionQuestion(),
  termFromKnownTermQuestion(),
];

const updateScore = () => {
  scoreElement.textContent = `${solved.size} de 6 correctos`;
};

const showFeedback = (element, question, correct) => {
  element.hidden = false;
  element.dataset.kind = correct ? "success" : "error";
  element.replaceChildren(document.createTextNode(correct
    ? "✅ ¡Correcto! Mira cómo queda la sustitución:"
    : `💡 Aún no. ${question.hint}`));
  if (correct) {
    const solution = document.createElement("div");
    solution.className = "math-output";
    renderMath(solution, question.solution);
    element.append(solution);
  }
};

const renderRound = () => {
  round += 1;
  solved = new Set();
  updateScore();
  roundElement.textContent = `Tanda ${round}`;
  grid.replaceChildren();

  buildQuestions().forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "exercise-card";
    const heading = document.createElement("div");
    heading.className = "exercise-heading";
    heading.innerHTML = `<span class="number-badge">${index + 1}</span><div><h3>${question.title}</h3><p>${question.prompt}</p></div>`;
    const problem = document.createElement("div");
    problem.className = "exercise-problem math-output";
    renderMath(problem, question.latex);
    const form = document.createElement("form");
    form.className = "exercise-form";
    form.noValidate = true;
    const inputId = `exercise-answer-${index}`;
    form.innerHTML = `<label class="field-label" for="${inputId}"><span>Tu respuesta</span><input class="formula-field" id="${inputId}" type="number" step="1" inputmode="numeric" autocomplete="off"></label><button class="formula-button" type="submit">Comprobar</button>`;
    const feedback = document.createElement("div");
    feedback.className = "feedback exercise-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.hidden = true;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const rawValue = input.value.trim();
      const value = Number(rawValue);
      if (rawValue === "" || !Number.isInteger(value)) {
        feedback.hidden = false;
        feedback.dataset.kind = "error";
        feedback.textContent = "Escribe un número entero antes de comprobar.";
        input.focus();
        return;
      }
      const correct = value === question.answer;
      showFeedback(feedback, question, correct);
      if (correct && !solved.has(index)) {
        solved.add(index);
        card.classList.add("is-complete");
        updateScore();
      }
    });

    card.append(heading, problem, form, feedback);
    grid.append(card);
  });
};

newRoundButton.addEventListener("click", renderRound);
window.addEventListener("load", renderRound, { once: true });
