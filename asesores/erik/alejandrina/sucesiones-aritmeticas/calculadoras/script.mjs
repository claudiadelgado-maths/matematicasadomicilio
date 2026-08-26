import {
  analyzeSequence,
  formulaLatex,
  parseSequenceInput,
  renderLatex,
  signedNumber,
  simplifiedFormulaLatex,
} from "../sucesiones.mjs";

const form = document.querySelector("[data-analyzer]");
const input = document.querySelector("[data-input]");
const message = document.querySelector("[data-message]");
const results = document.querySelector("[data-results]");
const resultTitle = document.querySelector("[data-result-title]");
const status = document.querySelector("[data-status]");
const entered = document.querySelector("[data-entered]");
const differenceContainer = document.querySelector("[data-differences]");
const explanation = document.querySelector("[data-explanation]");
const arithmeticDetails = document.querySelector("[data-arithmetic-details]");

const numberText = (value) => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(10)));

const renderDifferences = (differences) => {
  differenceContainer.replaceChildren(...differences.map((difference, index) => {
    const item = document.createElement("span");
    item.textContent = "d" + (index + 1) + " = " + signedNumber(Number(numberText(difference)), { explicitPositive: true });
    return item;
  }));
};

const analyze = (focusResult = false) => {
  try {
    const values = parseSequenceInput(input.value);
    const analysis = analyzeSequence(values);
    results.hidden = false;
    message.hidden = true;
    results.dataset.kind = analysis.arithmetic ? "success" : "error";
    status.textContent = analysis.arithmetic ? "Sí es aritmética" : "No es aritmética";
    renderLatex(entered, values.join(",\\; "));
    renderDifferences(analysis.differences);

    if (analysis.arithmetic) {
      const sequence = analysis.sequence;
      resultTitle.textContent = "La diferencia es constante";
      explanation.textContent = "Todas las restas consecutivas producen " + numberText(sequence.difference) + ". Por eso la lista sí es una sucesión aritmética.";
      arithmeticDetails.hidden = false;
      document.querySelector("[data-first]").textContent = "a₁ = " + numberText(sequence.first);
      document.querySelector("[data-difference]").textContent = "d = " + numberText(sequence.difference);
      document.querySelector("[data-count]").textContent = String(values.length);
      renderLatex(document.querySelector("[data-formula]"), formulaLatex(sequence));
      renderLatex(document.querySelector("[data-simplified]"), simplifiedFormulaLatex(sequence));
    } else {
      resultTitle.textContent = "La diferencia cambia";
      explanation.textContent = "No es una sucesión aritmética porque las diferencias entre términos consecutivos no son todas iguales.";
      arithmeticDetails.hidden = true;
    }

    if (focusResult) resultTitle.focus();
  } catch (error) {
    results.hidden = true;
    message.hidden = false;
    message.dataset.kind = "error";
    message.textContent = error.message;
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  analyze(true);
});

form.addEventListener("reset", () => {
  setTimeout(() => analyze(false), 0);
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.example;
    analyze(true);
  });
});

window.addEventListener("load", () => analyze(false), { once: true });
