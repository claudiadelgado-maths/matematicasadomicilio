import { renderLatex } from "../../matematicas.mjs";

const MAX_VALUE = 1e12;
const MAX_RATE = 1e6;
const EPSILON = 1e-9;

const NUMBER_FORMATTER = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 4,
  useGrouping: true,
});

const CALCULATOR_CONFIG = {
  basic: {
    defaultAnchor: "total",
    defaultState: { total: 100, rate: 100, part: 100 },
    labels: { total: "Cantidad total", rate: "Porcentaje", part: "Parte correspondiente" },
    solver: solveBasic,
    initialFormula: "P=T\\cdot\\frac{p}{100}",
    relationshipFormula: "P=T\\cdot\\frac{p}{100}",
    summary: (state) => ({ latex: `${latexValue(state.rate)}\\%\\text{ de }${latexValue(state.total)}=${latexValue(state.part)}`, label: `${formatValue(state.rate)}% de ${formatValue(state.total)} es ${formatValue(state.part)}.` }),
  },
  discount: {
    defaultAnchor: "original",
    defaultState: { original: 100, rate: 100, amount: 100, result: 0 },
    labels: { original: "Cantidad original", rate: "Porcentaje de descuento", amount: "Cantidad descontada", result: "Cantidad resultante" },
    solver: solveDiscount,
    initialFormula: "R=O-D",
    relationshipFormula: "R=O\\left(1-\\frac{p}{100}\\right)",
    summary: (state) => ({ latex: `${latexValue(state.original)}-${latexValue(state.amount)}=${latexValue(state.result)}\\qquad\\left(${latexValue(state.rate)}\\%\\text{ de descuento}\\right)`, label: `De ${formatValue(state.original)} se descuentan ${formatValue(state.amount)} (${formatValue(state.rate)}%) y quedan ${formatValue(state.result)}.` }),
  },
  increase: {
    defaultAnchor: "original",
    defaultState: { original: 100, rate: 100, amount: 100, result: 200 },
    labels: { original: "Cantidad original", rate: "Porcentaje de aumento", amount: "Cantidad aumentada", result: "Cantidad resultante" },
    solver: solveIncrease,
    initialFormula: "R=O+A",
    relationshipFormula: "R=O\\left(1+\\frac{p}{100}\\right)",
    summary: (state) => ({ latex: `${latexValue(state.original)}+${latexValue(state.amount)}=${latexValue(state.result)}\\qquad\\left(${latexValue(state.rate)}\\%\\text{ de aumento}\\right)`, label: `A ${formatValue(state.original)} se agregan ${formatValue(state.amount)} (${formatValue(state.rate)}%) y se obtienen ${formatValue(state.result)}.` }),
  },
};

function success(state, formula) {
  return { ok: true, state: roundState(state), formula };
}

function failure(message) {
  return { ok: false, message };
}

function nearlyZero(value) {
  return Math.abs(value) <= EPSILON;
}

function roundValue(value) {
  const rounded = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  return nearlyZero(rounded) ? 0 : rounded;
}

function roundState(state) {
  return Object.fromEntries(Object.entries(state).map(([key, value]) => [key, roundValue(value)]));
}

function pairIncludes(anchor, changed, first, second) {
  return (anchor === first && changed === second) || (anchor === second && changed === first);
}

function knownValue(state, anchor, changed, changedValue, key) {
  if (key === anchor) return state[key];
  if (key === changed) return changedValue;
  return undefined;
}

function validateFiniteValues(state, { discount = false } = {}) {
  for (const value of Object.values(state)) {
    if (!Number.isFinite(value) || Math.abs(value) > MAX_VALUE) return failure("El resultado es demasiado grande. Utiliza cantidades menores.");
    if (value < -EPSILON) return failure(discount ? "Un descuento no puede producir cantidades negativas." : "Utiliza cantidades y porcentajes mayores o iguales que cero.");
  }
  if (state.rate > MAX_RATE) return failure("El porcentaje es demasiado grande para esta herramienta.");
  if (discount && (state.rate < -EPSILON || state.rate > 100 + EPSILON)) return failure("El porcentaje de descuento debe estar entre 0% y 100%.");
  return null;
}

export function solveBasic(state, anchor, changed, changedValue) {
  if (anchor === changed) return failure("El valor fijo no se puede editar.");
  if (!Number.isFinite(changedValue) || changedValue < 0) return failure("Escribe una cantidad mayor o igual que cero.");
  let next;
  let formula;

  if (pairIncludes(anchor, changed, "total", "rate")) {
    const total = knownValue(state, anchor, changed, changedValue, "total");
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    next = { total, rate, part: total * rate / 100 };
    formula = "P=T\\cdot\\frac{p}{100}";
  } else if (pairIncludes(anchor, changed, "total", "part")) {
    const total = knownValue(state, anchor, changed, changedValue, "total");
    const part = knownValue(state, anchor, changed, changedValue, "part");
    if (nearlyZero(total)) return failure("Con un total de 0 no se puede deducir un porcentaje único. Mantén fijo otro valor.");
    next = { total, part, rate: part / total * 100 };
    formula = "p=\\frac{P}{T}\\cdot100";
  } else if (pairIncludes(anchor, changed, "rate", "part")) {
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    const part = knownValue(state, anchor, changed, changedValue, "part");
    if (nearlyZero(rate)) return failure("Con 0% no se puede recuperar un total único desde la parte. Mantén fijo otro valor.");
    next = { rate, part, total: part / (rate / 100) };
    formula = "T=\\frac{P}{\\frac{p}{100}}";
  } else {
    return failure("Esa combinación de valores no es válida.");
  }

  const invalid = validateFiniteValues(next);
  return invalid ?? success(next, formula);
}

export function solveDiscount(state, anchor, changed, changedValue) {
  if (anchor === changed) return failure("El valor fijo no se puede editar.");
  if (!Number.isFinite(changedValue) || changedValue < 0) return failure("Escribe una cantidad mayor o igual que cero.");
  let next;
  let formula;

  if (pairIncludes(anchor, changed, "original", "rate")) {
    const original = knownValue(state, anchor, changed, changedValue, "original");
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    if (rate > 100) return failure("El porcentaje de descuento debe estar entre 0% y 100%.");
    const amount = original * rate / 100;
    next = { original, rate, amount, result: original - amount };
    formula = "D=O\\cdot\\frac{p}{100}";
  } else if (pairIncludes(anchor, changed, "original", "amount")) {
    const original = knownValue(state, anchor, changed, changedValue, "original");
    const amount = knownValue(state, anchor, changed, changedValue, "amount");
    if (nearlyZero(original)) return failure("Con una cantidad original de 0 no se puede deducir un porcentaje único.");
    if (amount > original) return failure("La cantidad descontada no puede superar la cantidad original.");
    next = { original, amount, rate: amount / original * 100, result: original - amount };
    formula = "p=\\frac{D}{O}\\cdot100";
  } else if (pairIncludes(anchor, changed, "original", "result")) {
    const original = knownValue(state, anchor, changed, changedValue, "original");
    const result = knownValue(state, anchor, changed, changedValue, "result");
    if (nearlyZero(original)) return failure("Con una cantidad original de 0 no se puede deducir un porcentaje único.");
    if (result > original) return failure("Después de un descuento, el resultado no puede superar la cantidad original.");
    const amount = original - result;
    next = { original, result, amount, rate: amount / original * 100 };
    formula = "D=O-R";
  } else if (pairIncludes(anchor, changed, "rate", "amount")) {
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    const amount = knownValue(state, anchor, changed, changedValue, "amount");
    if (rate > 100) return failure("El porcentaje de descuento debe estar entre 0% y 100%.");
    if (nearlyZero(rate)) return failure("Con 0% y una cantidad descontada no se puede recuperar un original único.");
    const original = amount / (rate / 100);
    next = { rate, amount, original, result: original - amount };
    formula = "O=\\frac{D}{\\frac{p}{100}}";
  } else if (pairIncludes(anchor, changed, "rate", "result")) {
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    const result = knownValue(state, anchor, changed, changedValue, "result");
    if (rate > 100) return failure("El porcentaje de descuento debe estar entre 0% y 100%.");
    const remaining = 1 - rate / 100;
    if (nearlyZero(remaining)) return failure("Con un descuento de 100%, el resultado siempre es 0 y no permite recuperar un original único. Mantén fijo otro valor.");
    const original = result / remaining;
    next = { rate, result, original, amount: original - result };
    formula = "O=\\frac{R}{1-\\frac{p}{100}}";
  } else if (pairIncludes(anchor, changed, "amount", "result")) {
    const amount = knownValue(state, anchor, changed, changedValue, "amount");
    const result = knownValue(state, anchor, changed, changedValue, "result");
    const original = amount + result;
    if (nearlyZero(original)) return failure("Si descuento y resultado son 0, no existe un porcentaje único. Mantén fijo otro valor.");
    next = { amount, result, original, rate: amount / original * 100 };
    formula = "O=D+R";
  } else {
    return failure("Esa combinación de valores no es válida.");
  }

  const invalid = validateFiniteValues(next, { discount: true });
  return invalid ?? success(next, formula);
}

export function solveIncrease(state, anchor, changed, changedValue) {
  if (anchor === changed) return failure("El valor fijo no se puede editar.");
  if (!Number.isFinite(changedValue) || changedValue < 0) return failure("Escribe una cantidad mayor o igual que cero.");
  let next;
  let formula;

  if (pairIncludes(anchor, changed, "original", "rate")) {
    const original = knownValue(state, anchor, changed, changedValue, "original");
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    const amount = original * rate / 100;
    next = { original, rate, amount, result: original + amount };
    formula = "A=O\\cdot\\frac{p}{100}";
  } else if (pairIncludes(anchor, changed, "original", "amount")) {
    const original = knownValue(state, anchor, changed, changedValue, "original");
    const amount = knownValue(state, anchor, changed, changedValue, "amount");
    if (nearlyZero(original)) return failure("Con una cantidad original de 0 no se puede deducir un porcentaje finito.");
    next = { original, amount, rate: amount / original * 100, result: original + amount };
    formula = "p=\\frac{A}{O}\\cdot100";
  } else if (pairIncludes(anchor, changed, "original", "result")) {
    const original = knownValue(state, anchor, changed, changedValue, "original");
    const result = knownValue(state, anchor, changed, changedValue, "result");
    if (nearlyZero(original)) return failure("Con una cantidad original de 0 no se puede deducir un porcentaje finito.");
    if (result < original) return failure("Después de un aumento, el resultado no puede ser menor que la cantidad original.");
    const amount = result - original;
    next = { original, result, amount, rate: amount / original * 100 };
    formula = "A=R-O";
  } else if (pairIncludes(anchor, changed, "rate", "amount")) {
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    const amount = knownValue(state, anchor, changed, changedValue, "amount");
    if (nearlyZero(rate)) return failure("Con un aumento de 0% no se puede recuperar un original único desde la cantidad aumentada.");
    const original = amount / (rate / 100);
    next = { rate, amount, original, result: original + amount };
    formula = "O=\\frac{A}{\\frac{p}{100}}";
  } else if (pairIncludes(anchor, changed, "rate", "result")) {
    const rate = knownValue(state, anchor, changed, changedValue, "rate");
    const result = knownValue(state, anchor, changed, changedValue, "result");
    const original = result / (1 + rate / 100);
    next = { rate, result, original, amount: result - original };
    formula = "O=\\frac{R}{1+\\frac{p}{100}}";
  } else if (pairIncludes(anchor, changed, "amount", "result")) {
    const amount = knownValue(state, anchor, changed, changedValue, "amount");
    const result = knownValue(state, anchor, changed, changedValue, "result");
    if (result < amount) return failure("El resultado no puede ser menor que la cantidad aumentada.");
    const original = result - amount;
    if (nearlyZero(original)) return failure("Con una cantidad original de 0 no se puede deducir un porcentaje finito.");
    next = { amount, result, original, rate: amount / original * 100 };
    formula = "O=R-A";
  } else {
    return failure("Esa combinación de valores no es válida.");
  }

  const invalid = validateFiniteValues(next);
  return invalid ?? success(next, formula);
}

export function parseNumericInput(rawValue) {
  const original = String(rawValue ?? "").trim();
  if (!original) return Number.NaN;
  let clean = original
    .replace(/\s+/g, "")
    .replace(/[$%]/g, "")
    .replace(/[^0-9,\.\-+]/g, "");
  if (!clean || !/[0-9]/.test(clean)) return Number.NaN;

  if (clean.includes(",") && clean.includes(".")) {
    clean = clean.lastIndexOf(",") > clean.lastIndexOf(".")
      ? clean.replace(/\./g, "").replace(",", ".")
      : clean.replace(/,/g, "");
  } else if (clean.includes(",")) {
    const parts = clean.split(",");
    const looksLikeThousands = parts.length === 2 && parts[0] !== "0" && /^\d{3}$/.test(parts[1]);
    clean = looksLikeThousands ? parts.join("") : clean.replace(",", ".");
  }

  const value = Number(clean);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function formatValue(value) {
  return NUMBER_FORMATTER.format(roundValue(value));
}

function latexValue(value) {
  return formatValue(value).replace(/,/g, "{,}");
}

function initialiseCalculator(card) {
  const type = card.dataset.calculator;
  const config = CALCULATOR_CONFIG[type];
  if (!config) return;

  const anchorSelect = card.querySelector("[data-anchor]");
  const resetButton = card.querySelector("[data-reset]");
  const formulaElement = card.querySelector("[data-formula]");
  const summaryElement = card.querySelector("[data-summary]");
  const statusElement = card.querySelector("[data-status]");
  const inputs = Object.fromEntries([...card.querySelectorAll("[data-value]")].map((input) => [input.dataset.value, input]));
  let state = { ...config.defaultState };
  let anchor = config.defaultAnchor;
  let invalidKey = null;

  const clearError = () => {
    card.classList.remove("has-error");
    Object.values(inputs).forEach((input) => {
      input.removeAttribute("aria-invalid");
      input.closest("[data-row]").classList.remove("has-error");
    });
    invalidKey = null;
  };

  const markError = (key, message) => {
    clearError();
    invalidKey = key;
    card.classList.add("has-error");
    inputs[key].setAttribute("aria-invalid", "true");
    inputs[key].closest("[data-row]").classList.add("has-error");
    statusElement.textContent = message;
  };

  const renderValues = (preserveKey = null) => {
    Object.entries(inputs).forEach(([key, input]) => {
      if (key !== preserveKey) input.value = formatValue(state[key]);
    });
    const summary = config.summary(state);
    renderLatex(summaryElement, summary.latex, { display: true, label: summary.label });
  };

  const renderAnchor = () => {
    Object.entries(inputs).forEach(([key, input]) => {
      const fixed = key === anchor;
      input.readOnly = fixed;
      input.setAttribute("aria-readonly", String(fixed));
      input.closest("[data-row]").classList.toggle("is-fixed", fixed);
    });
  };

  const renderInitial = () => {
    state = { ...config.defaultState };
    anchor = config.defaultAnchor;
    anchorSelect.value = anchor;
    clearError();
    renderAnchor();
    renderValues();
    renderLatex(formulaElement, config.initialFormula, { display: true, label: "Relación matemática inicial" });
    statusElement.textContent = `${config.labels[anchor]} está fija. Modifica cualquier otra casilla.`;
  };

  Object.entries(inputs).forEach(([key, input]) => {
    input.addEventListener("input", () => {
      const value = parseNumericInput(input.value);
      if (!Number.isFinite(value)) {
        markError(key, "Escribe un número válido para continuar la sincronización.");
        return;
      }

      const result = config.solver(state, anchor, key, value);
      if (!result.ok) {
        markError(key, result.message);
        return;
      }

      clearError();
      state = result.state;
      renderValues(key);
      renderLatex(formulaElement, result.formula, { display: true, label: "Relación matemática utilizada" });
      statusElement.textContent = `${config.labels[key]} cambió. Los demás valores se actualizaron automáticamente.`;
    });

    input.addEventListener("blur", () => {
      if (invalidKey !== key) input.value = formatValue(state[key]);
    });
  });

  anchorSelect.addEventListener("change", () => {
    anchor = anchorSelect.value;
    clearError();
    renderAnchor();
    renderValues();
    renderLatex(formulaElement, config.relationshipFormula, { display: true, label: "Relación matemática de la calculadora" });
    statusElement.textContent = `${config.labels[anchor]} está fija. Modifica cualquier otra casilla.`;
  });

  resetButton.addEventListener("click", () => {
    renderInitial();
    anchorSelect.focus();
    statusElement.textContent = "Ejemplo inicial restablecido.";
  });

  renderInitial();
}

if (typeof document !== "undefined") {
  document.querySelectorAll("[data-calculator]").forEach(initialiseCalculator);
}
