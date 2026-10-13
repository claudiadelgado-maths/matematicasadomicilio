import { binomialLatex, fractionLatex, isZero, polynomialLatex, product, rational, readRational, renderLatex } from "../../binomios.mjs";

const form = document.querySelector("[data-calculator]");
const message = document.querySelector("[data-message]");
const resultTitle = document.querySelector("[data-results] h2");
const modeButton = document.querySelector("[data-mode-toggle]");
const modeLabel = document.querySelector("[data-mode-label]");
const modeNote = document.querySelector("[data-mode-note]");
const liveExpression = document.querySelector("[data-live-expression]");
const keys = ["a", "b", "c", "d"];
const outputs = Object.fromEntries([
  "final-result", "original", "distribution", "product-ac", "product-ad",
  "product-bc", "product-bd", "expanded", "combine", "conclusion"
].map((name) => [name, document.querySelector("[data-" + name + "]")]));

const absolute = (value) => rational(Math.abs(value.n), value.d);

const magnitudeLatex = (value, variable = "") => {
  const magnitude = absolute(value);
  const coefficient = variable && magnitude.n === magnitude.d ? "" : fractionLatex(magnitude);
  return coefficient + variable;
};

const signedTerm = (value, variable = "", first = false) => {
  if (isZero(value)) return "";
  const sign = value.n < 0 ? "-" : (first ? "" : "+");
  return sign + magnitudeLatex(value, variable);
};

const distributedLatex = (a, b, c, d) => {
  const secondBinomial = binomialLatex(c, d);
  const firstPart = signedTerm(a, "x", true) + secondBinomial;
  const secondPart = isZero(b) ? "" : signedTerm(b) + secondBinomial;
  return firstPart + secondPart;
};

const factorLatex = (value, variable = "") => "\\left(" + fractionLatex(value) + variable + "\\right)";

const readValues = () => Object.fromEntries(keys.map((key) => [key, readRational(form.querySelector('[data-coefficient="' + key + '"]'))]));

const renderPreview = () => {
  try {
    const { a, b, c, d } = readValues();
    liveExpression.dataset.state = "ready";
    renderLatex(liveExpression, binomialLatex(a, b) + binomialLatex(c, d));
  } catch {
    liveExpression.dataset.state = "incomplete";
    liveExpression.textContent = "Completa los valores para formar la expresión.";
  }
};

const setMode = (mode) => {
  const fractions = mode === "fraction";
  form.dataset.mode = mode;
  modeButton.textContent = fractions ? "Usar enteros" : "Usar fracciones";
  modeButton.setAttribute("aria-pressed", String(fractions));
  modeLabel.textContent = fractions ? "Modo: fracciones" : "Modo: enteros";
  modeNote.textContent = fractions
    ? "Escribe el numerador arriba y el denominador abajo. El resultado se conserva como fracción exacta."
    : "Escribe un número entero en cada casilla.";

  keys.forEach((key) => {
    const field = form.querySelector('[data-coefficient="' + key + '"]');
    const numerator = field.querySelector("[data-num]");
    const denominator = field.querySelector("[data-den]");
    denominator.disabled = !fractions;
    if (!fractions) denominator.value = "1";
    numerator.setAttribute("aria-label", fractions ? "Numerador de " + key.toUpperCase() : "Valor entero de " + key.toUpperCase());
  });
};

const renderCalculation = (focusResult = false) => {
  try {
    const { a, b, c, d } = readValues();
    if (isZero(a) || isZero(c)) throw new Error("A y C deben ser distintos de cero para que ambos factores tengan x.");

    const answer = product(a, b, c, d);
    const original = binomialLatex(a, b) + binomialLatex(c, d);
    const expanded = factorLatex(a, "x") + factorLatex(c, "x")
      + "+" + factorLatex(a, "x") + factorLatex(d)
      + "+" + factorLatex(b) + factorLatex(c, "x")
      + "+" + factorLatex(b) + factorLatex(d);
    const separated = fractionLatex(answer.ac) + "x^2+\\left(" + fractionLatex(answer.ad) + "\\right)x"
      + "+\\left(" + fractionLatex(answer.bc) + "\\right)x+\\left(" + fractionLatex(answer.bd) + "\\right)";
    const combined = fractionLatex(answer.ac) + "x^2+\\left(" + fractionLatex(answer.ad)
      + "+\\left(" + fractionLatex(answer.bc) + "\\right)\\right)x+\\left(" + fractionLatex(answer.bd) + "\\right)";

    renderLatex(outputs["final-result"], original + "=" + polynomialLatex(answer));
    renderLatex(outputs.original, original);
    renderLatex(outputs.distribution, original + "=" + distributedLatex(a, b, c, d));
    renderLatex(outputs["product-ac"], factorLatex(a, "x") + factorLatex(c, "x") + "=" + fractionLatex(answer.ac) + "x^2");
    renderLatex(outputs["product-ad"], factorLatex(a, "x") + factorLatex(d) + "=" + fractionLatex(answer.ad) + "x");
    renderLatex(outputs["product-bc"], factorLatex(b) + factorLatex(c, "x") + "=" + fractionLatex(answer.bc) + "x");
    renderLatex(outputs["product-bd"], factorLatex(b) + factorLatex(d) + "=" + fractionLatex(answer.bd));
    renderLatex(outputs.expanded, expanded + "=" + separated);
    renderLatex(outputs.combine, separated + "=" + combined + "=" + polynomialLatex(answer));
    renderLatex(outputs.conclusion, "\\boxed{" + polynomialLatex(answer) + "}");

    message.hidden = true;
    if (focusResult) resultTitle.focus();
  } catch (error) {
    message.hidden = false;
    message.dataset.kind = "error";
    message.textContent = error.message;
  }
};

modeButton.addEventListener("click", () => {
  setMode(form.dataset.mode === "integer" ? "fraction" : "integer");
  renderPreview();
  renderCalculation();
});

form.addEventListener("input", (event) => {
  if (event.target.matches("[data-num], [data-den]")) renderPreview();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderCalculation(true);
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    setMode("integer");
    renderPreview();
    renderCalculation();
  }, 0);
});

setMode("integer");
window.addEventListener("load", () => {
  renderPreview();
  renderCalculation();
}, { once: true });
