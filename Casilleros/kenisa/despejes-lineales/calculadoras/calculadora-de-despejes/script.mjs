import { fraction, add, subtract, multiply, divide, equal, formatFraction } from "../../racionales.mjs";

const tabs = [...document.querySelectorAll("[data-mode-tab]")];
const panels = [...document.querySelectorAll("[data-calculator-panel]")];

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

const leftSideLatex = ({ A, B }) => {
  const bTerm = B.n === 0 ? "" : ` ${B.n < 0 ? "-" : "+"} ${toLatex(absoluteFraction(B))}`;
  return `${coefficientLatex(A)}${bTerm}`;
};

const equationLatex = (values) => `${leftSideLatex(values)} = ${toLatex(values.C)}`;

const equationText = ({ A, B, C }) => {
  const coefficient = A.n === A.d ? "x" : A.n === -A.d ? "−x" : `${formatFraction(A).replace("-", "−")}x`;
  const bTerm = B.n === 0 ? "" : ` ${B.n < 0 ? "−" : "+"} ${formatFraction(absoluteFraction(B))}`;
  return `${coefficient}${bTerm} = ${formatFraction(C).replace("-", "−")}`;
};

const renderLatex = (target, latex, displayMode = true) => {
  target.setAttribute("aria-label", target.dataset.mathLabel || latex.replaceAll("\\", ""));
  if (globalThis.katex) globalThis.katex.render(latex, target, { displayMode, throwOnError: false, strict: "ignore" });
  else target.textContent = latex;
};

const parseInteger = (raw, label) => {
  const value = raw.trim();
  if (!value) throw new Error(`Escribe un valor para ${label}.`);
  if (!/^[+-]?\d+$/.test(value)) throw new Error(`${label} debe ser un número entero, sin decimales.`);
  return fraction(Number(value), 1);
};

const parseStackedFraction = (container, label) => {
  const numerator = container.querySelector("[data-numerator]").value.trim();
  const denominator = container.querySelector("[data-denominator]").value.trim();
  if (!numerator || !denominator) throw new Error(`Completa el numerador y el denominador de ${label}.`);
  if (!/^[+-]?\d+$/.test(numerator) || !/^[+-]?\d+$/.test(denominator)) throw new Error(`Usa números enteros en la fracción de ${label}.`);
  if (Number(denominator) === 0) throw new Error(`El denominador de ${label} no puede ser 0.`);
  return fraction(Number(numerator), Number(denominator));
};

const readValues = (panel) => {
  if (panel.dataset.mode === "integers") {
    return Object.fromEntries(["a", "b", "c"].map((key) => [key.toUpperCase(), parseInteger(panel.querySelector(`[data-value="${key}"]`).value, key.toUpperCase())]));
  }
  return Object.fromEntries(["a", "b", "c"].map((key) => [key.toUpperCase(), parseStackedFraction(panel.querySelector(`[data-coefficient="${key}"]`), key.toUpperCase())]));
};

const clearOutput = (panel) => {
  panel.querySelector("[data-feedback]").textContent = "";
  panel.querySelector("[data-output]").hidden = true;
};

const updatePreview = (panel) => {
  const preview = panel.querySelector("[data-preview]");
  try {
    const values = readValues(panel);
    preview.dataset.mathLabel = equationText(values);
    renderLatex(preview, equationLatex(values));
  } catch {
    preview.dataset.mathLabel = "A por x más B igual a C";
    renderLatex(preview, "Ax+B=C");
  }
};

const appendProcedureStep = (container, number, title, latex, note = "") => {
  const step = document.createElement("article");
  step.className = "procedure-step";
  const badge = document.createElement("span");
  badge.className = "procedure-number";
  badge.textContent = String(number);
  const content = document.createElement("div");
  content.className = "procedure-content";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const math = document.createElement("div");
  math.className = "procedure-math";
  renderLatex(math, latex);
  content.append(heading, math);
  if (note) {
    const paragraph = document.createElement("p");
    paragraph.className = "procedure-note";
    paragraph.textContent = note;
    content.append(paragraph);
  }
  step.append(badge, content);
  container.append(step);
};

const showRegularSolution = (panel, values) => {
  const difference = subtract(values.C, values.B);
  const solution = divide(difference, values.A);
  const verification = add(multiply(values.A, solution), values.B);
  const output = panel.querySelector("[data-output]");
  output.classList.remove("is-special");
  panel.querySelector("[data-output-title]").textContent = "Solución exacta y simplificada";
  const resultMath = panel.querySelector("[data-result-math]");
  resultMath.hidden = false;
  resultMath.dataset.mathLabel = `x = ${formatFraction(solution)}`;
  renderLatex(resultMath, `x=${toLatex(solution)}`);
  panel.querySelector("[data-special-message]").hidden = true;

  const procedure = panel.querySelector("[data-procedure]");
  procedure.replaceChildren();
  appendProcedureStep(procedure, 1, "Escribimos la ecuación original", equationLatex(values), "Identificamos el coeficiente A, el término B y el valor C.");
  appendProcedureStep(
    procedure,
    2,
    "Restamos B en ambos lados",
    `\\begin{aligned}${leftSideLatex(values)}-\\left(${toLatex(values.B)}\\right)&=${toLatex(values.C)}-\\left(${toLatex(values.B)}\\right)\\\\${coefficientLatex(values.A)}&=${toLatex(difference)}\\end{aligned}`,
    "El término independiente se elimina sin alterar la igualdad."
  );
  appendProcedureStep(
    procedure,
    3,
    "Dividimos ambos lados entre A",
    `\\begin{aligned}\\frac{${coefficientLatex(values.A)}}{${toLatex(values.A)}}&=\\frac{${toLatex(difference)}}{${toLatex(values.A)}}\\\\x&=${toLatex(solution)}\\end{aligned}`,
    "La fracción final se simplifica automáticamente."
  );
  appendProcedureStep(
    procedure,
    4,
    "Comprobamos la solución",
    `\\begin{aligned}${toLatex(values.A)}\\left(${toLatex(solution)}\\right)+\\left(${toLatex(values.B)}\\right)&=${toLatex(values.C)}\\\\${toLatex(verification)}&=${toLatex(values.C)}\\end{aligned}`,
    "Los dos lados producen el mismo valor, así que la solución es correcta."
  );
  output.hidden = false;
};

const showSpecialSolution = (panel, values) => {
  const identity = equal(values.B, values.C);
  const output = panel.querySelector("[data-output]");
  output.classList.add("is-special");
  panel.querySelector("[data-output-title]").textContent = identity ? "La igualdad siempre se cumple" : "La igualdad no puede cumplirse";
  panel.querySelector("[data-result-math]").hidden = true;
  const special = panel.querySelector("[data-special-message]");
  special.hidden = false;
  special.textContent = identity ? "Infinitas soluciones" : "Sin solución";

  const procedure = panel.querySelector("[data-procedure]");
  procedure.replaceChildren();
  appendProcedureStep(procedure, 1, "Observamos la ecuación original", equationLatex(values));
  appendProcedureStep(procedure, 2, "El término con x desaparece", `${leftSideLatex(values)}=${toLatex(values.C)}\\quad\\Longrightarrow\\quad${toLatex(values.B)}=${toLatex(values.C)}`, "No podemos dividir entre A porque A es 0.");
  appendProcedureStep(
    procedure,
    3,
    identity ? "Comparamos y obtenemos una identidad" : "Comparamos y obtenemos una contradicción",
    `${toLatex(values.B)}${identity ? "=" : "\\neq"}${toLatex(values.C)}`,
    identity ? "Cualquier valor de x conserva la igualdad." : "Ningún valor de x puede convertirla en una igualdad verdadera."
  );
  output.hidden = false;
};

const solvePanel = (panel) => {
  const feedback = panel.querySelector("[data-feedback]");
  feedback.textContent = "";
  try {
    const values = readValues(panel);
    if (values.A.n === 0) showSpecialSolution(panel, values);
    else showRegularSolution(panel, values);
  } catch (error) {
    panel.querySelector("[data-output]").hidden = true;
    feedback.textContent = error.message;
  }
};

const fillExample = (panel, values) => {
  const parts = values.split("|");
  if (panel.dataset.mode === "integers") {
    ["a", "b", "c"].forEach((key, index) => { panel.querySelector(`[data-value="${key}"]`).value = parts[index]; });
  } else {
    ["a", "b", "c"].forEach((key, index) => {
      const container = panel.querySelector(`[data-coefficient="${key}"]`);
      container.querySelector("[data-numerator]").value = parts[index * 2];
      container.querySelector("[data-denominator]").value = parts[index * 2 + 1];
    });
  }
  updatePreview(panel);
  solvePanel(panel);
};

const selectMode = (mode) => {
  tabs.forEach((tab) => {
    const selected = tab.dataset.modeTab === mode;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => { panel.hidden = panel.dataset.mode !== mode; });
};

tabs.forEach((tab) => tab.addEventListener("click", () => selectMode(tab.dataset.modeTab)));
tabs.forEach((tab, index) => tab.addEventListener("keydown", (event) => {
  const keyTargets = {
    ArrowRight: (index + 1) % tabs.length,
    ArrowLeft: (index - 1 + tabs.length) % tabs.length,
    Home: 0,
    End: tabs.length - 1
  };
  if (!(event.key in keyTargets)) return;
  event.preventDefault();
  const nextTab = tabs[keyTargets[event.key]];
  selectMode(nextTab.dataset.modeTab);
  nextTab.focus();
}));

panels.forEach((panel) => {
  panel.querySelector("form").addEventListener("submit", (event) => { event.preventDefault(); solvePanel(panel); });
  panel.querySelectorAll("input").forEach((input) => input.addEventListener("input", () => { clearOutput(panel); updatePreview(panel); }));
  panel.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => fillExample(panel, button.dataset.example)));
});

const start = () => {
  panels.forEach(updatePreview);
  selectMode("integers");
};

if (document.readyState === "complete") start();
else window.addEventListener("load", start, { once: true });
