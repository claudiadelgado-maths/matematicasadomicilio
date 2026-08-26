import { binomialLatex, polynomialLatex, product, rational, renderLatex } from "../../binomios.mjs";

const phaseOneBank = [
  { m: 3, n: 2, p: 1 },
  { m: 2, n: 4, p: -3 },
  { m: 5, n: 1, p: 2 },
  { m: 4, n: 3, p: -2 },
  { m: 6, n: 2, p: 3 },
  { m: 3, n: 5, p: -4 },
  { m: 7, n: 1, p: -2 },
  { m: 2, n: 6, p: 5 }
];

const binomialBank = [
  { a: 3, b: 2, c: 5, d: 7 },
  { a: 2, b: -3, c: 4, d: 1 },
  { a: 4, b: 1, c: 2, d: -5 },
  { a: 5, b: -2, c: 3, d: 4 },
  { a: 2, b: 3, c: 5, d: -2 },
  { a: 3, b: -4, c: 2, d: -1 },
  { a: 6, b: 1, c: 2, d: 3 },
  { a: 4, b: -3, c: 3, d: 2 },
  { a: 2, b: 5, c: 3, d: -4 },
  { a: 5, b: -1, c: 2, d: -3 }
];

const absolute = (value) => Math.abs(value);

const monomialLatex = (coefficient, variable = "") => {
  const magnitude = absolute(coefficient);
  const number = magnitude === 1 && variable ? "" : String(magnitude);
  return (coefficient < 0 ? "-" : "") + number + variable;
};

const integerBinomialLatex = (a, b) => binomialLatex(rational(a), rational(b));

const phaseOneProblemLatex = (problem) => monomialLatex(problem.m, "x") + integerBinomialLatex(problem.n, problem.p);
const binomialProblemLatex = (problem) => integerBinomialLatex(problem.a, problem.b) + integerBinomialLatex(problem.c, problem.d);

const signedJoin = (value) => value < 0 ? "-" : "+";
const displayInteger = (value) => String(value).replace("-", "−");

const distributionLatex = (problem) => {
  const second = integerBinomialLatex(problem.c, problem.d);
  return monomialLatex(problem.a, "x") + second + signedJoin(problem.b) + monomialLatex(absolute(problem.b)) + second;
};

const field = (form, name) => form.querySelector('[data-field="' + name + '"]');

const readMagnitude = (form, name) => {
  const input = field(form, name);
  const raw = input.value.trim();
  const value = Number(raw);
  if (raw === "" || !Number.isInteger(value) || value < 1) {
    input.focus();
    throw new Error("Completa todas las casillas con números enteros positivos.");
  }
  return value;
};

const readSign = (form, name) => Number(field(form, name).value);

const polynomialFrom = (quadratic, linear, constant) => ({
  quadratic: rational(quadratic),
  linear: rational(linear),
  constant: rational(constant)
});

const phaseDefinitions = {
  one: {
    bank: phaseOneBank,
    problemLatex: phaseOneProblemLatex,
    validate(problem, form) {
      const quadratic = readMagnitude(form, "quadratic");
      const linear = readSign(form, "linearSign") * readMagnitude(form, "linear");
      return quadratic === problem.m * problem.n && linear === problem.m * problem.p;
    },
    hint: "Revisa los dos productos: el término exterior multiplica al término con x y también a la constante.",
    solution(problem, math, note) {
      const quadratic = problem.m * problem.n;
      const linear = problem.m * problem.p;
      const firstProduct = "\\left(" + monomialLatex(problem.m, "x") + "\\right)\\left(" + monomialLatex(problem.n, "x") + "\\right)";
      const secondProduct = "\\left(" + monomialLatex(problem.m, "x") + "\\right)\\left(" + monomialLatex(problem.p) + "\\right)";
      renderLatex(math, phaseOneProblemLatex(problem) + "=" + firstProduct + "+" + secondProduct + "=" + polynomialLatex(polynomialFrom(quadratic, linear, 0)));
      note.textContent = String(problem.m) + " multiplica a " + String(problem.n) + " y también a " + String(problem.p) + ". El signo del segundo resultado depende de la constante.";
    }
  },
  two: {
    bank: binomialBank,
    problemLatex: binomialProblemLatex,
    validate(problem, form) {
      return readMagnitude(form, "outerA") === problem.a
        && readMagnitude(form, "innerC1") === problem.c
        && readSign(form, "innerDSign1") * readMagnitude(form, "innerD1") === problem.d
        && readSign(form, "outerBSign") * readMagnitude(form, "outerB") === problem.b
        && readMagnitude(form, "innerC2") === problem.c
        && readSign(form, "innerDSign2") * readMagnitude(form, "innerD2") === problem.d;
    },
    hint: "El segundo binomio debe aparecer completo dos veces: una después del término con x y otra después de la constante.",
    solution(problem, math, note) {
      renderLatex(math, binomialProblemLatex(problem) + "=" + distributionLatex(problem));
      note.textContent = "Todavía no resolvemos los productos. Solo dejamos visible que cada término del primer binomio multiplica al segundo binomio completo.";
    }
  },
  three: {
    bank: binomialBank,
    problemLatex: binomialProblemLatex,
    validate(problem, form) {
      const answer = product(rational(problem.a), rational(problem.b), rational(problem.c), rational(problem.d));
      const quadratic = readMagnitude(form, "quadratic");
      const linear = readSign(form, "linearSign") * readMagnitude(form, "linear");
      const constant = readSign(form, "constantSign") * readMagnitude(form, "constant");
      return quadratic === answer.quadratic.n && linear === answer.linear.n && constant === answer.constant.n;
    },
    hint: "Comprueba primero los dos productos cruzados. Sus resultados se suman para formar el coeficiente de x.",
    solution(problem, math, note) {
      const answer = product(rational(problem.a), rational(problem.b), rational(problem.c), rational(problem.d));
      renderLatex(math, binomialProblemLatex(problem) + "=" + polynomialLatex(answer));
      note.textContent = "Coeficiente de x: (" + displayInteger(problem.a) + " × " + displayInteger(problem.d) + ") + (" + displayInteger(problem.b) + " × " + displayInteger(problem.c) + ") = " + displayInteger(answer.linear.n) + ".";
    }
  }
};

const setupPhase = (name, definition) => {
  const root = document.querySelector('[data-phase="' + name + '"]');
  const form = root.querySelector("[data-phase-form]");
  const problemElement = root.querySelector("[data-problem]");
  const countElement = root.querySelector("[data-phase-count]");
  const scoreElement = root.querySelector("[data-score]");
  const feedback = root.querySelector("[data-feedback]");
  const solution = root.querySelector("[data-solution]");
  const solutionMath = root.querySelector("[data-solution-math]");
  const solutionNote = root.querySelector("[data-solution-note]");
  let currentIndex = -1;
  let challenge = 0;
  let score = 0;
  let solved = false;

  const newProblem = (focusInput = true) => {
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) nextIndex = Math.floor(Math.random() * definition.bank.length);
    currentIndex = nextIndex;
    challenge += 1;
    solved = false;
    form.reset();
    feedback.hidden = true;
    solution.hidden = true;
    renderLatex(problemElement, definition.problemLatex(definition.bank[currentIndex]));
    countElement.textContent = "Reto " + String(challenge);
    if (focusInput) form.querySelector('input[type="number"]').focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const problem = definition.bank[currentIndex];
      const correct = definition.validate(problem, form);
      feedback.hidden = false;
      feedback.dataset.kind = correct ? "success" : "error";
      if (!correct) {
        feedback.textContent = definition.hint;
        solution.hidden = true;
        return;
      }
      if (!solved) score += 1;
      solved = true;
      scoreElement.textContent = String(score) + (score === 1 ? " resuelto" : " resueltos");
      feedback.textContent = "¡Correcto! Esta fase está bien construida.";
      definition.solution(problem, solutionMath, solutionNote);
      solution.hidden = false;
    } catch (error) {
      feedback.hidden = false;
      feedback.dataset.kind = "error";
      feedback.textContent = error.message;
      solution.hidden = true;
    }
  });

  root.querySelector("[data-new-problem]").addEventListener("click", () => newProblem(true));
  newProblem(false);
};

window.addEventListener("load", () => {
  setupPhase("one", phaseDefinitions.one);
  setupPhase("two", phaseDefinitions.two);
  setupPhase("three", phaseDefinitions.three);
}, { once: true });
