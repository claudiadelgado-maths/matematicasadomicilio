import {
  differenceFromTerms,
  directionFromDifference,
  fractionLatex,
  positionFromTerm,
  renderMath,
  termAt,
} from "../formulas.mjs";

const readInteger = (form, name, label) => {
  const input = form.elements.namedItem(name);
  const raw = input.value.trim();
  const value = Number(raw);
  if (raw === "" || !Number.isInteger(value)) {
    input.focus();
    throw new Error(`${label} debe ser un número entero.`);
  }
  return value;
};

const showError = (feedback, result, message) => {
  feedback.hidden = false;
  feedback.dataset.kind = "error";
  feedback.textContent = message;
  result.hidden = true;
};

const showSuccess = (feedback, message) => {
  feedback.hidden = false;
  feedback.dataset.kind = "success";
  feedback.textContent = message;
};

const differenceForm = document.querySelector("[data-difference-form]");
const differenceFeedback = document.querySelector("[data-difference-feedback]");
const differenceResult = document.querySelector("[data-difference-result]");

differenceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const termI = readInteger(differenceForm, "termI", "aᵢ");
    const positionI = readInteger(differenceForm, "positionI", "i");
    const termJ = readInteger(differenceForm, "termJ", "aⱼ");
    const positionJ = readInteger(differenceForm, "positionJ", "j");
    if (positionI < 1 || positionJ < 1) throw new Error("Las posiciones deben ser enteros mayores o iguales que 1.");
    if (positionI === positionJ) throw new Error("i y j deben ser diferentes para evitar una división entre cero.");
    const numerator = termI - termJ;
    const denominator = positionI - positionJ;
    const difference = differenceFromTerms(termI, positionI, termJ, positionJ);
    renderMath(document.querySelector("[data-difference-math]"), `d=\\frac{${termI}-${termJ}}{${positionI}-${positionJ}}=${fractionLatex(numerator, denominator)}`);
    document.querySelector("[data-difference-direction]").textContent = `d = ${difference}. La sucesión es ${directionFromDifference(difference)}.`;
    differenceResult.hidden = false;
    showSuccess(differenceFeedback, "✅ Diferencia calculada. Revisa que el orden de los términos coincida con el orden de sus posiciones.");
  } catch (error) {
    showError(differenceFeedback, differenceResult, error.message);
  }
});

differenceForm.addEventListener("reset", () => {
  differenceFeedback.hidden = true;
  differenceResult.hidden = true;
});

const positionForm = document.querySelector("[data-position-form]");
const positionFeedback = document.querySelector("[data-position-feedback]");
const positionResult = document.querySelector("[data-position-result]");

positionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const term = readInteger(positionForm, "term", "aₙ");
    const first = readInteger(positionForm, "first", "a₁");
    const difference = readInteger(positionForm, "difference", "d");
    if (difference === 0) throw new Error("Con d = 0 todos los términos son iguales y no existe una posición única para ese valor.");
    const position = positionFromTerm(term, first, difference);
    renderMath(document.querySelector("[data-position-math]"), `n=\\frac{${term}-${first}}{${difference}}+1=${position}`);
    positionResult.hidden = false;
    const validPosition = Number.isInteger(position) && position >= 1;
    document.querySelector("[data-position-note]").textContent = validPosition
      ? `El término ${term} ocupa la posición ${position}.`
      : "El resultado no es un entero positivo, así que ese valor no ocupa una posición válida de la sucesión.";
    if (validPosition) showSuccess(positionFeedback, "✅ Posición encontrada.");
    else {
      positionFeedback.hidden = false;
      positionFeedback.dataset.kind = "error";
      positionFeedback.textContent = "💡 La operación es válida, pero el resultado no representa una posición de la sucesión.";
    }
  } catch (error) {
    showError(positionFeedback, positionResult, error.message);
  }
});

positionForm.addEventListener("reset", () => {
  positionFeedback.hidden = true;
  positionResult.hidden = true;
});

const termForm = document.querySelector("[data-term-form]");
const termFeedback = document.querySelector("[data-term-feedback]");
const termResult = document.querySelector("[data-term-result]");
const termPreview = document.querySelector("[data-term-preview]");

const previewValue = (name, fallback) => {
  const raw = termForm.elements.namedItem(name).value.trim();
  return raw === "" ? fallback : raw;
};

const updateTermPreview = () => {
  const first = previewValue("first", "a_1");
  const difference = previewValue("difference", "d");
  const position = previewValue("position", "n");
  const differencePart = String(difference).startsWith("-")
    ? `-(${position}-1)${String(difference).slice(1)}`
    : `+(${position}-1)${difference}`;
  renderMath(termPreview, `a_{${position}}=${first}${differencePart}`);
};

termForm.addEventListener("input", updateTermPreview);

termForm.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const first = readInteger(termForm, "first", "a₁");
    const difference = readInteger(termForm, "difference", "d");
    const position = readInteger(termForm, "position", "n");
    if (position < 1) throw new Error("n debe ser un entero mayor o igual que 1.");
    const term = termAt(first, difference, position);
    const operation = difference < 0
      ? `${first}-(${position}-1)${Math.abs(difference)}`
      : `${first}+(${position}-1)${difference}`;
    renderMath(document.querySelector("[data-term-math]"), `a_{${position}}=${operation}=${term}`);
    document.querySelector("[data-term-direction]").textContent = `a${position} = ${term}. Con d = ${difference}, la sucesión es ${directionFromDifference(difference)}.`;
    termResult.hidden = false;
    showSuccess(termFeedback, "✅ Término calculado. La sustitución muestra cuántos saltos se realizaron.");
  } catch (error) {
    showError(termFeedback, termResult, error.message);
  }
});

termForm.addEventListener("reset", () => {
  termFeedback.hidden = true;
  termResult.hidden = true;
  window.setTimeout(updateTermPreview, 0);
});

window.addEventListener("load", updateTermPreview, { once: true });
