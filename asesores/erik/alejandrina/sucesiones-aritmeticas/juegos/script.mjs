import {
  arithmeticTerm,
  arithmeticTerms,
  formulaLatex,
  generateArithmeticSequence,
  renderLatex,
  sequenceKey,
  sequenceLatex,
  uniqueOptions,
} from "../sucesiones.mjs";

const totalQuestions = 15;
const questionsPerLevel = 5;
const challenge = document.querySelector("[data-challenge]");
const summary = document.querySelector("[data-summary]");
const levelLabel = document.querySelector("[data-level-label]");
const questionLabel = document.querySelector("[data-question-label]");
const scoreElement = document.querySelector("[data-score]");
const correctElement = document.querySelector("[data-correct]");
const levelNumber = document.querySelector("[data-challenge-level]");
const questionType = document.querySelector("[data-question-type]");
const prompt = document.querySelector("[data-prompt]");
const sequenceElement = document.querySelector("[data-sequence]");
const answerForm = document.querySelector("[data-answer-form]");
const answerArea = document.querySelector("[data-answer-area]");
const feedback = document.querySelector("[data-feedback]");
const nextButton = document.querySelector("[data-next]");
const levelChips = [...document.querySelectorAll("[data-level-chip]")];

let questionIndex = 0;
let points = 0;
let correctAnswers = 0;
let errors = 0;
let previousSequenceKey = "";
let currentQuestion;
let locked = false;
let errorsByConcept = {};

const randomIndex = (length) => Math.floor(Math.random() * length);

const formulaWith = (first, difference, jumpExpression = "n-1") => {
  const operator = difference < 0 ? "-" : "+";
  return "a_n=" + first + operator + "(" + jumpExpression + ")" + Math.abs(difference);
};

const plainFormula = (sequence) => {
  const operator = sequence.difference < 0 ? "−" : "+";
  return "aₙ = " + sequence.first + " " + operator + " (n − 1)" + Math.abs(sequence.difference);
};

const newSequence = (level) => {
  const sequence = generateArithmeticSequence({
    allowNegative: level > 0,
    negativeChance: level === 1 ? .3 : .4,
    firstMax: level > 0 ? 100 : 55,
    differenceMin: 2,
    differenceMax: level === 2 ? 16 : 12,
    previousKey: previousSequenceKey,
  });
  previousSequenceKey = sequenceKey(sequence);
  return sequence;
};

const levelOneQuestion = (sequence) => {
  const values = arithmeticTerms(sequence, 5);
  const missingIndex = 1 + randomIndex(3);
  const display = values.map((value, index) => index === missingIndex ? "\\boxed{?}" : String(value)).join(",\\; ");
  return {
    type: "number",
    label: "Nivel 1 · Completa el patrón",
    prompt: "¿Qué término falta en la sucesión?",
    display,
    answer: values[missingIndex],
    answerText: String(values[missingIndex]),
    concept: "patrón",
    hint: "Compara los dos primeros términos para encontrar el tamaño de cada salto.",
  };
};

const levelTwoQuestion = (sequence, indexInLevel) => {
  const definitions = [
    { prompt: "¿Cuál es el primer término a₁?", answer: sequence.first, concept: "primer término", hint: "a₁ es el valor que ocupa la posición 1." },
    { prompt: "¿Cuál es la diferencia común d?", answer: sequence.difference, concept: "diferencia", hint: "Resta término siguiente menos término anterior y conserva el signo." },
    { prompt: "¿Cuánto vale a₄?", answer: arithmeticTerm(sequence, 4), concept: "posición y valor", hint: "La posición es 4; responde con el valor que aparece en ese lugar." },
    { prompt: "¿Cuánto vale a₅?", answer: arithmeticTerm(sequence, 5), concept: "posición y valor", hint: "No escribas 5 por ser la posición: busca el valor del quinto término." },
    { prompt: "¿Qué término corresponde a n = 3?", answer: arithmeticTerm(sequence, 3), concept: "posición y valor", hint: "n = 3 señala el tercer lugar de la lista." },
  ];
  const definition = definitions[indexInLevel];
  return {
    type: "number",
    label: "Nivel 2 · Identifica los elementos",
    prompt: definition.prompt,
    display: sequenceLatex(sequence),
    answer: definition.answer,
    answerText: String(definition.answer),
    concept: definition.concept,
    hint: definition.hint,
  };
};

const formulaChoiceQuestion = (sequence) => {
  const correct = formulaLatex(sequence);
  const distractors = [
    formulaWith(sequence.first, sequence.difference, "n"),
    formulaWith(sequence.first, -sequence.difference),
    formulaWith(Math.abs(sequence.difference), sequence.first),
    formulaWith(arithmeticTerm(sequence, 2), sequence.difference),
  ];
  return {
    type: "choice",
    label: "Nivel 3 · Trabaja con la fórmula",
    prompt: "¿Cuál fórmula representa esta sucesión?",
    display: sequenceLatex(sequence),
    answer: correct,
    answerText: plainFormula(sequence),
    options: uniqueOptions(correct, distractors),
    concept: "fórmula",
    hint: "Conserva a₁, usa n − 1 saltos y revisa el signo de d.",
  };
};

const formulaFillQuestion = (sequence) => ({
  type: "formula",
  label: "Nivel 3 · Trabaja con la fórmula",
  prompt: "Completa la fórmula general de la sucesión.",
  display: sequenceLatex(sequence),
  answer: sequence,
  answerText: plainFormula(sequence),
  concept: "fórmula",
  hint: "La primera casilla es a₁. Después elige el signo de d y escribe su magnitud.",
});

const targetQuestion = (sequence, position) => ({
  type: "number",
  label: "Nivel 3 · Trabaja con la fórmula",
  prompt: "Usa la fórmula para encontrar a" + position + ".",
  display: formulaLatex(sequence),
  answer: arithmeticTerm(sequence, position),
  answerText: String(arithmeticTerm(sequence, position)),
  concept: "saltos",
  hint: "Desde a₁ hasta a" + position + " hay " + (position - 1) + " saltos de tamaño d.",
});

const levelThreeQuestion = (sequence, indexInLevel) => {
  if (indexInLevel === 0 || indexInLevel === 4) return formulaChoiceQuestion(sequence);
  if (indexInLevel === 1) return formulaFillQuestion(sequence);
  if (indexInLevel === 2) return targetQuestion(sequence, 10);
  return targetQuestion(sequence, 15);
};

const createQuestion = () => {
  const level = Math.floor(questionIndex / questionsPerLevel);
  const indexInLevel = questionIndex % questionsPerLevel;
  const sequence = newSequence(level);
  if (level === 0) return levelOneQuestion(sequence);
  if (level === 1) return levelTwoQuestion(sequence, indexInLevel);
  return levelThreeQuestion(sequence, indexInLevel);
};

const createNumberAnswer = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "number-answer";
  const label = document.createElement("label");
  label.textContent = "Tu respuesta";
  label.htmlFor = "game-number-answer";
  const input = document.createElement("input");
  input.className = "sequence-field";
  input.id = "game-number-answer";
  input.type = "number";
  input.step = "1";
  input.inputMode = "numeric";
  input.dataset.numberAnswer = "";
  wrapper.append(label, input);
  return wrapper;
};

const createFormulaAnswer = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "formula-answer";
  const prefix = document.createElement("span");
  prefix.textContent = "aₙ =";
  const first = document.createElement("input");
  first.className = "sequence-field";
  first.type = "number";
  first.step = "1";
  first.inputMode = "numeric";
  first.dataset.formulaFirst = "";
  first.setAttribute("aria-label", "Primer término");
  const operator = document.createElement("select");
  operator.className = "sequence-select";
  operator.dataset.formulaOperator = "";
  operator.setAttribute("aria-label", "Operador de la diferencia");
  operator.innerHTML = '<option value="1">+</option><option value="-1">−</option>';
  const jumps = document.createElement("span");
  jumps.textContent = "(n − 1)";
  const magnitude = document.createElement("input");
  magnitude.className = "sequence-field";
  magnitude.type = "number";
  magnitude.min = "1";
  magnitude.step = "1";
  magnitude.inputMode = "numeric";
  magnitude.dataset.formulaMagnitude = "";
  magnitude.setAttribute("aria-label", "Magnitud de la diferencia");
  wrapper.append(prefix, first, operator, jumps, magnitude);
  return wrapper;
};

const createChoiceAnswer = (options) => {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-grid";
  options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "choice-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "formula-option";
    input.value = option.value;
    input.dataset.correct = String(option.correct);
    const math = document.createElement("span");
    math.className = "sequence-option-math";
    renderLatex(math, option.value);
    label.append(input, math);
    wrapper.append(label);
    if (index === 0) input.dataset.firstOption = "";
  });
  return wrapper;
};

const renderAnswerArea = () => {
  answerArea.replaceChildren();
  if (currentQuestion.type === "number") answerArea.append(createNumberAnswer());
  else if (currentQuestion.type === "formula") answerArea.append(createFormulaAnswer());
  else answerArea.append(createChoiceAnswer(currentQuestion.options));
};

const updateLevelTrack = (level) => {
  levelChips.forEach((chip, index) => {
    chip.classList.toggle("is-complete", index < level);
    chip.classList.toggle("is-current", index === level);
    if (index === level) chip.setAttribute("aria-current", "step");
    else chip.removeAttribute("aria-current");
  });
};

const updateHud = () => {
  const level = Math.floor(questionIndex / questionsPerLevel);
  levelLabel.textContent = "Nivel " + (level + 1) + " de 3";
  questionLabel.textContent = "Pregunta " + (questionIndex + 1) + " de " + totalQuestions;
  scoreElement.textContent = String(points);
  correctElement.textContent = String(correctAnswers);
  levelNumber.textContent = String(level + 1);
  updateLevelTrack(level);
};

const showQuestion = (focusTitle = false) => {
  currentQuestion = createQuestion();
  locked = false;
  answerForm.reset();
  answerForm.querySelector('button[type="submit"]').disabled = false;
  feedback.hidden = true;
  feedback.removeAttribute("data-kind");
  nextButton.hidden = true;
  questionType.textContent = currentQuestion.label;
  prompt.textContent = currentQuestion.prompt;
  renderLatex(sequenceElement, currentQuestion.display);
  renderAnswerArea();
  updateHud();
  if (focusTitle) prompt.focus();
};

const readIntegerInput = (input) => {
  const raw = input.value.trim();
  const value = Number(raw);
  if (raw === "" || !Number.isInteger(value)) {
    input.focus();
    throw new Error("Escribe un número entero antes de comprobar.");
  }
  return value;
};

const checkAnswer = () => {
  if (currentQuestion.type === "number") {
    return readIntegerInput(answerArea.querySelector("[data-number-answer]")) === currentQuestion.answer;
  }
  if (currentQuestion.type === "choice") {
    const selected = answerArea.querySelector('input[name="formula-option"]:checked');
    if (!selected) throw new Error("Selecciona una fórmula antes de comprobar.");
    return selected.value === currentQuestion.answer;
  }
  const first = readIntegerInput(answerArea.querySelector("[data-formula-first]"));
  const operator = Number(answerArea.querySelector("[data-formula-operator]").value);
  const magnitude = readIntegerInput(answerArea.querySelector("[data-formula-magnitude]"));
  if (magnitude < 1) throw new Error("La magnitud de d debe ser positiva; el signo se elige aparte.");
  return first === currentQuestion.answer.first
    && operator * magnitude === currentQuestion.answer.difference;
};

const lockControls = () => {
  answerArea.querySelectorAll("input, select").forEach((control) => { control.disabled = true; });
  answerForm.querySelector('button[type="submit"]').disabled = true;
};

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (locked) return;
  try {
    const correct = checkAnswer();
    locked = true;
    lockControls();
    feedback.hidden = false;
    feedback.dataset.kind = correct ? "success" : "error";
    if (correct) {
      points += 10;
      correctAnswers += 1;
      feedback.textContent = "Correcto. " + currentQuestion.answerText;
    } else {
      errors += 1;
      errorsByConcept[currentQuestion.concept] = (errorsByConcept[currentQuestion.concept] || 0) + 1;
      feedback.textContent = currentQuestion.hint + " La respuesta correcta era: " + currentQuestion.answerText + ".";
    }
    scoreElement.textContent = String(points);
    correctElement.textContent = String(correctAnswers);
    nextButton.hidden = false;
    nextButton.textContent = questionIndex === totalQuestions - 1
      ? "Ver resumen"
      : (questionIndex + 1) % questionsPerLevel === 0
        ? "Pasar al siguiente nivel"
        : "Siguiente pregunta";
    nextButton.focus();
  } catch (error) {
    feedback.hidden = false;
    feedback.dataset.kind = "error";
    feedback.textContent = error.message;
  }
});

const finishGame = () => {
  challenge.hidden = true;
  summary.hidden = false;
  document.querySelector("[data-summary-score]").textContent = String(points);
  document.querySelector("[data-summary-correct]").textContent = correctAnswers + " de " + totalQuestions;
  document.querySelector("[data-summary-errors]").textContent = String(errors);
  document.querySelector("[data-summary-percentage]").textContent = Math.round((correctAnswers / totalQuestions) * 100) + "%";
  const advice = document.querySelector("[data-review-advice]");
  const concepts = Object.entries(errorsByConcept).sort((left, right) => right[1] - left[1]);
  advice.textContent = concepts.length
    ? "Conviene repasar especialmente: " + concepts[0][0] + ". Vuelve a la explicación y pregunta qué representa cada parte antes de calcular."
    : "Dominaste los tres niveles sin errores. Puedes repetir la partida para comprobarlo con sucesiones diferentes.";
  document.querySelector("[data-summary-title]").focus();
};

nextButton.addEventListener("click", () => {
  questionIndex += 1;
  if (questionIndex >= totalQuestions) finishGame();
  else showQuestion(true);
});

const startGame = () => {
  questionIndex = 0;
  points = 0;
  correctAnswers = 0;
  errors = 0;
  errorsByConcept = {};
  challenge.hidden = false;
  summary.hidden = true;
  answerForm.querySelector('button[type="submit"]').disabled = false;
  showQuestion(false);
};

document.querySelector("[data-restart]").addEventListener("click", startGame);
window.addEventListener("load", startGame, { once: true });
