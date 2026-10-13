import {
  arithmeticTerm,
  generateArithmeticSequence,
  renderLatex,
  sequenceKey,
  sequenceLatex,
} from "../sucesiones.mjs";

const sequenceOutput = document.querySelector("[data-sequence]");
const negativeToggle = document.querySelector("[data-negative-toggle]");
const direction = document.querySelector("[data-direction]");
const score = document.querySelector("[data-score]");
const round = document.querySelector("[data-round]");
const targetLabel = document.querySelector("[data-target-label]");
const questionCards = [...document.querySelectorAll("[data-question]")];

let currentSequence;
let currentKey = "";
let currentRound = 0;
let targetPosition = 10;
let solved = new Set();

const readInteger = (input, message = "Escribe un número entero en la casilla.") => {
  const raw = input.value.trim();
  const value = Number(raw);
  if (raw === "" || !Number.isInteger(value)) {
    input.focus();
    throw new Error(message);
  }
  return value;
};

const expectedValue = (kind) => {
  if (kind === "first") return currentSequence.first;
  if (kind === "difference") return currentSequence.difference;
  if (kind === "term3") return arithmeticTerm(currentSequence, 3);
  if (kind === "term5") return arithmeticTerm(currentSequence, 5);
  if (kind === "target") return arithmeticTerm(currentSequence, targetPosition);
  return null;
};

const hintFor = (kind) => {
  if (kind === "first") return "Busca el número que ocupa la posición 1; es el punto donde comienza la lista.";
  if (kind === "difference") return "Compara dos términos consecutivos: resta término siguiente menos término anterior.";
  if (kind === "term3") return "n = 3 es la posición. Busca el valor que aparece en el tercer lugar.";
  if (kind === "term5") return "No escribas la posición 5: escribe el valor que ocupa esa posición.";
  if (kind === "formula") return "La fórmula conserva a₁ y d. Si la sucesión disminuye, el operador debe ser una resta.";
  return "Para llegar a la posición " + targetPosition + " desde a₁ hay " + (targetPosition - 1) + " saltos.";
};

const successFor = (kind) => {
  if (kind === "formula") return "Correcto. Construiste la fórmula con el primer término y la diferencia adecuados.";
  const value = expectedValue(kind);
  if (kind === "target") return "Correcto. Después de " + (targetPosition - 1) + " saltos, a" + targetPosition + " = " + value + ".";
  return "Correcto: " + value + ".";
};

const updateScore = () => {
  score.textContent = solved.size + " de " + questionCards.length + " respuestas correctas";
};

const validateFormula = (form) => {
  const first = readInteger(form.querySelector("[data-first]"));
  const operator = Number(form.querySelector("[data-operator]").value);
  const magnitude = readInteger(form.querySelector("[data-magnitude]"), "Escribe una magnitud entera positiva para la diferencia.");
  if (magnitude < 1) throw new Error("La magnitud de la diferencia debe ser positiva; el signo se elige aparte.");
  return first === currentSequence.first && operator * magnitude === currentSequence.difference;
};

const resetCard = (card) => {
  card.querySelector("form").reset();
  const feedback = card.querySelector("[data-feedback]");
  feedback.hidden = true;
  feedback.removeAttribute("data-kind");
  card.classList.remove("is-solved");
};

const subscriptNumber = (value) => String(value)
  .split("")
  .map((digit) => "₀₁₂₃₄₅₆₇₈₉"[Number(digit)])
  .join("");

const startRound = (focusFirst = false) => {
  currentSequence = generateArithmeticSequence({
    allowNegative: negativeToggle.checked,
    negativeChance: .4,
    firstMax: negativeToggle.checked ? 100 : 60,
    previousKey: currentKey,
  });
  currentKey = sequenceKey(currentSequence);
  currentRound += 1;
  targetPosition = 8 + Math.floor(Math.random() * 5);
  solved = new Set();
  questionCards.forEach(resetCard);
  renderLatex(sequenceOutput, sequenceLatex(currentSequence));
  direction.textContent = currentSequence.difference < 0
    ? "La sucesión disminuye: la diferencia será negativa."
    : "La sucesión aumenta: la diferencia será positiva.";
  targetLabel.textContent = "a" + subscriptNumber(targetPosition);
  round.textContent = "Ronda " + currentRound;
  updateScore();
  if (focusFirst) questionCards[0].querySelector("input").focus();
};

questionCards.forEach((card) => {
  const form = card.querySelector("form");
  const feedback = card.querySelector("[data-feedback]");
  const kind = card.dataset.question;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const correct = kind === "formula"
        ? validateFormula(form)
        : readInteger(form.querySelector("[data-answer]")) === expectedValue(kind);
      feedback.hidden = false;
      feedback.dataset.kind = correct ? "success" : "error";
      if (!correct) {
        feedback.textContent = hintFor(kind);
        return;
      }
      solved.add(kind);
      card.classList.add("is-solved");
      feedback.textContent = successFor(kind);
      updateScore();
    } catch (error) {
      feedback.hidden = false;
      feedback.dataset.kind = "error";
      feedback.textContent = error.message;
    }
  });
});

document.querySelector("[data-new-sequence]").addEventListener("click", () => startRound(true));
negativeToggle.addEventListener("change", () => startRound(false));
window.addEventListener("load", () => startRound(false), { once: true });
