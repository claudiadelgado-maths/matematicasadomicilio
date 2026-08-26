import { fraction, subtract, divide, equal, formatFraction } from "../../racionales.mjs";

const makeProblem = ([an, ad, bn, bd, cn, cd, xn, xd]) => ({
  A: fraction(an, ad),
  B: fraction(bn, bd),
  C: fraction(cn, cd),
  x: fraction(xn, xd)
});

const groups = [
  {
    key: "basic",
    title: "Despeje básico",
    level: "Enteros positivos",
    prompt: "Deshaz primero el término independiente y después el coeficiente.",
    answerType: "integer",
    problems: [
      [2,1,3,1,9,1,3,1], [4,1,-5,1,11,1,4,1],
      [3,1,7,1,25,1,6,1], [5,1,2,1,17,1,3,1]
    ].map(makeProblem)
  },
  {
    key: "signs",
    title: "Cuida los signos",
    level: "Positivos y negativos",
    prompt: "El signo forma parte del coeficiente y debe conservarse al dividir.",
    answerType: "integer",
    problems: [
      [-3,1,7,1,-5,1,4,1], [-2,1,5,1,1,1,2,1],
      [-4,1,-3,1,9,1,-3,1], [3,1,-8,1,-14,1,-2,1]
    ].map(makeProblem)
  },
  {
    key: "fraction-answer",
    title: "Respuesta fraccionaria",
    level: "Numerador y denominador",
    prompt: "Escribe la solución como fracción exacta en las dos casillas.",
    answerType: "fraction",
    problems: [
      [3,1,1,2,5,1,3,2], [2,1,1,1,5,2,3,4],
      [4,1,-1,3,7,3,2,3], [-2,1,1,2,2,1,-3,4]
    ].map(makeProblem)
  },
  {
    key: "mixed",
    title: "Fracciones combinadas",
    level: "Reto completo",
    prompt: "Trabaja de manera exacta: no conviertas las fracciones en decimales.",
    answerType: "fraction",
    problems: [
      [5,6,1,3,2,3,2,5], [2,3,1,2,1,1,3,4],
      [3,4,-1,2,0,1,2,3], [-2,5,3,4,-1,4,5,2]
    ].map(makeProblem)
  }
];

const cards = [...document.querySelectorAll("[data-exercise-card]")];
const progress = document.querySelector("[data-progress]");
const seriesLabel = document.querySelector("[data-series-label]");
const newSeriesButton = document.querySelector("[data-new-series]");
let seriesIndex = 0;
let solved = new Set();

const absoluteFraction = (value) => fraction(Math.abs(value.n), value.d);

const toLatex = (value) => {
  if (value.d === 1) return String(value.n);
  const sign = value.n < 0 ? "-" : "";
  return `${sign}\\frac{${Math.abs(value.n)}}{${value.d}}`;
};

const coefficientLatex = (value) => {
  if (value.n === value.d) return "x";
  if (value.n === -value.d) return "-x";
  return `${toLatex(value)}x`;
};

const equationLatex = ({ A, B, C }) => {
  const bTerm = B.n === 0 ? "" : ` ${B.n < 0 ? "-" : "+"} ${toLatex(absoluteFraction(B))}`;
  return `${coefficientLatex(A)}${bTerm} = ${toLatex(C)}`;
};

const equationText = ({ A, B, C }) => {
  const coefficient = A.n === A.d ? "x" : A.n === -A.d ? "−x" : `${formatFraction(A).replace("-", "−")}x`;
  const bTerm = B.n === 0 ? "" : ` ${B.n < 0 ? "−" : "+"} ${formatFraction(absoluteFraction(B))}`;
  return `${coefficient}${bTerm} = ${formatFraction(C).replace("-", "−")}`;
};

const renderLatex = (target, latex, displayMode = true) => {
  target.setAttribute("aria-label", target.dataset.mathLabel || latex.replaceAll("\\", ""));
  if (globalThis.katex) {
    globalThis.katex.render(latex, target, { displayMode, throwOnError: false, strict: "ignore" });
  } else {
    target.textContent = latex;
  }
};

const currentProblem = (groupIndex) => groups[groupIndex].problems[seriesIndex % groups[groupIndex].problems.length];

const clearCard = (card) => {
  card.classList.remove("is-correct");
  card.querySelectorAll("input").forEach((input) => { input.value = ""; });
  const feedback = card.querySelector("[data-feedback]");
  feedback.textContent = "";
  feedback.className = "exercise-feedback";
  const details = card.querySelector("[data-solution]");
  details.hidden = true;
  details.open = false;
};

const renderCard = (card, groupIndex) => {
  const group = groups[groupIndex];
  const problem = currentProblem(groupIndex);
  card.querySelector("[data-level]").textContent = group.level;
  card.querySelector("[data-title]").textContent = group.title;
  card.querySelector("[data-prompt]").textContent = group.prompt;
  const equation = card.querySelector("[data-equation]");
  equation.dataset.mathLabel = equationText(problem);
  renderLatex(equation, equationLatex(problem));
  clearCard(card);
};

const updateProgress = () => {
  progress.textContent = `${solved.size} de ${groups.length} resueltos`;
  seriesLabel.textContent = `Serie ${seriesIndex + 1} de ${groups[0].problems.length}`;
};

const readAnswer = (card, answerType) => {
  if (answerType === "integer") {
    const value = card.querySelector("[data-integer]").value.trim();
    if (!value) throw new Error("Escribe el valor de x antes de comprobar.");
    if (!/^[+-]?\d+$/.test(value)) throw new Error("En este reto la respuesta es un número entero.");
    return fraction(Number(value), 1);
  }

  const numerator = card.querySelector("[data-numerator]").value.trim();
  const denominator = card.querySelector("[data-denominator]").value.trim();
  if (!numerator || !denominator) throw new Error("Completa el numerador y el denominador.");
  if (!/^[+-]?\d+$/.test(numerator) || !/^[+-]?\d+$/.test(denominator)) throw new Error("Usa números enteros en las dos casillas.");
  return fraction(Number(numerator), Number(denominator));
};

const renderSolution = (card, problem) => {
  const difference = subtract(problem.C, problem.B);
  const solution = divide(difference, problem.A);
  const expressions = [
    equationLatex(problem),
    `${coefficientLatex(problem.A)} = ${toLatex(problem.C)} - \\left(${toLatex(problem.B)}\\right) = ${toLatex(difference)}`,
    `x = ${toLatex(difference)} \\div ${toLatex(problem.A)}`,
    `x = ${toLatex(solution)}`
  ];
  const steps = card.querySelector("[data-steps]");
  steps.replaceChildren();
  expressions.forEach((expression, index) => {
    const step = document.createElement("div");
    step.className = "exercise-step";
    step.dataset.mathLabel = index === expressions.length - 1 ? `x = ${formatFraction(solution)}` : expression;
    renderLatex(step, expression);
    steps.append(step);
  });
  const details = card.querySelector("[data-solution]");
  details.hidden = false;
};

cards.forEach((card, groupIndex) => {
  card.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const group = groups[groupIndex];
    const problem = currentProblem(groupIndex);
    const feedback = card.querySelector("[data-feedback]");
    try {
      const answer = readAnswer(card, group.answerType);
      const isCorrect = equal(answer, problem.x);
      feedback.textContent = isCorrect
        ? "¡Correcto! Aplicaste las operaciones sin perder el equilibrio."
        : "Aún no coincide. Revisa primero C − B y después divide entre A.";
      feedback.className = `exercise-feedback ${isCorrect ? "success" : "error"}`;
      card.classList.toggle("is-correct", isCorrect);
      if (isCorrect) solved.add(group.key); else solved.delete(group.key);
      renderSolution(card, problem);
      updateProgress();
    } catch (error) {
      feedback.textContent = error.message;
      feedback.className = "exercise-feedback error";
      card.querySelector("[data-solution]").hidden = true;
    }
  });
});

const renderSeries = () => {
  solved = new Set();
  cards.forEach(renderCard);
  updateProgress();
};

newSeriesButton.addEventListener("click", () => {
  seriesIndex = (seriesIndex + 1) % groups[0].problems.length;
  renderSeries();
  cards[0].querySelector("input").focus();
});

const start = () => renderSeries();
if (document.readyState === "complete") start();
else window.addEventListener("load", start, { once: true });
