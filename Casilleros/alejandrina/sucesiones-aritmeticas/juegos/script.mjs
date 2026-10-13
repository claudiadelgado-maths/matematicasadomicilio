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
const answerArea = document.querySelector("[data-answer-area]");
const checkButton = document.querySelector("[data-check-answer]");
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

const numberOptions = (answer, candidates = []) => {
  const distractors = [...candidates];
  let distance = 1;
  while (new Set([answer, ...distractors]).size < 4) {
    distractors.push(answer + distance, answer - distance);
    distance += 1;
  }
  return uniqueOptions(answer, distractors);
};

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
    type: "choice",
    label: "🧩 Nivel 1 · Completa el patrón",
    prompt: "🤔 ¿Qué término falta en la sucesión?",
    display,
    answer: values[missingIndex],
    answerText: String(values[missingIndex]),
    options: numberOptions(values[missingIndex], [
      values[missingIndex - 1],
      values[missingIndex + 1],
      values[missingIndex] + sequence.difference,
      values[missingIndex] - sequence.difference,
      missingIndex + 1,
    ]),
    concept: "patrón",
    hint: "Compara los dos primeros términos para encontrar el tamaño de cada salto.",
  };
};

const levelTwoQuestion = (sequence, indexInLevel) => {
  const definitions = [
    { prompt: "🌱 ¿Cuál es el primer término a₁?", answer: sequence.first, concept: "primer término", hint: "a₁ es el valor que ocupa la posición 1." },
    { prompt: "🪜 ¿Cuál es la diferencia común d?", answer: sequence.difference, concept: "diferencia", hint: "Resta término siguiente menos término anterior y conserva el signo." },
    { prompt: "🔎 ¿Cuánto vale a₄?", answer: arithmeticTerm(sequence, 4), concept: "posición y valor", hint: "La posición es 4; busca el valor que aparece en ese lugar." },
    { prompt: "🎯 ¿Cuánto vale a₅?", answer: arithmeticTerm(sequence, 5), concept: "posición y valor", hint: "El 5 indica la posición: busca el valor del quinto término." },
    { prompt: "🧠 ¿Qué término corresponde a n = 3?", answer: arithmeticTerm(sequence, 3), concept: "posición y valor", hint: "n = 3 señala el tercer lugar de la lista." },
  ];
  const definition = definitions[indexInLevel];
  return {
    type: "choice",
    label: "🔎 Nivel 2 · Identifica los elementos",
    prompt: definition.prompt,
    display: sequenceLatex(sequence),
    answer: definition.answer,
    answerText: String(definition.answer),
    options: numberOptions(definition.answer, [
      sequence.first,
      sequence.difference,
      arithmeticTerm(sequence, 2),
      arithmeticTerm(sequence, 3),
      arithmeticTerm(sequence, 4),
      arithmeticTerm(sequence, 5),
      indexInLevel + 1,
    ]),
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
    label: "🚀 Nivel 3 · Trabaja con la fórmula",
    prompt: "🧠 ¿Cuál fórmula representa esta sucesión?",
    display: sequenceLatex(sequence),
    answer: correct,
    answerText: plainFormula(sequence),
    options: uniqueOptions(correct, distractors),
    concept: "fórmula",
    hint: "Conserva a₁, usa n − 1 saltos y revisa el signo de d.",
  };
};

const targetQuestion = (sequence, position) => ({
  type: "choice",
  label: "🚀 Nivel 3 · Trabaja con la fórmula",
  prompt: "🎯 Usa la fórmula y elige el valor de a" + position + ".",
  display: formulaLatex(sequence),
  answer: arithmeticTerm(sequence, position),
  answerText: String(arithmeticTerm(sequence, position)),
  options: numberOptions(arithmeticTerm(sequence, position), [
    arithmeticTerm(sequence, position - 1),
    arithmeticTerm(sequence, position + 1),
    arithmeticTerm(sequence, position) + sequence.first,
    arithmeticTerm(sequence, position) - sequence.difference,
    position,
  ]),
  concept: "saltos",
  hint: "Desde a₁ hasta a" + position + " hay " + (position - 1) + " saltos de tamaño d.",
});

const levelThreeQuestion = (sequence, indexInLevel) => {
  if (indexInLevel === 0 || indexInLevel === 1 || indexInLevel === 4) return formulaChoiceQuestion(sequence);
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

const createChoiceAnswer = (options) => {
  const wrapper = document.createElement("div");
  wrapper.className = "choice-grid";
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "choice-option";
    button.type = "button";
    button.dataset.optionValue = String(option.value);
    button.dataset.correct = String(option.correct);
    button.setAttribute("aria-pressed", "false");
    const badge = document.createElement("span");
    badge.className = "choice-badge";
    badge.textContent = String.fromCharCode(65 + index);
    const math = document.createElement("span");
    math.className = "sequence-option-math";
    renderLatex(math, String(option.value));
    button.append(badge, math);
    button.addEventListener("click", () => {
      if (locked) return;
      wrapper.querySelectorAll(".choice-option").forEach((item) => {
        item.classList.remove("is-selected");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");
    });
    wrapper.append(button);
  });
  return wrapper;
};

const renderAnswerArea = () => {
  answerArea.replaceChildren();
  answerArea.append(createChoiceAnswer(currentQuestion.options));
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
  levelLabel.textContent = "🧭 Nivel " + (level + 1) + " de 3";
  questionLabel.textContent = "Reto " + (questionIndex + 1) + " de " + totalQuestions;
  scoreElement.textContent = String(points);
  correctElement.textContent = String(correctAnswers);
  levelNumber.textContent = String(level + 1);
  updateLevelTrack(level);
};

const showQuestion = (focusTitle = false) => {
  currentQuestion = createQuestion();
  locked = false;
  checkButton.disabled = false;
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

const checkAnswer = () => {
  const selected = answerArea.querySelector('.choice-option[aria-pressed="true"]');
  if (!selected) throw new Error("👇 Elige uno de los botones antes de comprobar.");
  const correct = selected.dataset.optionValue === String(currentQuestion.answer);
  selected.classList.add(correct ? "is-correct" : "is-wrong");
  if (!correct) answerArea.querySelector('.choice-option[data-correct="true"]')?.classList.add("is-correct");
  return correct;
};

const lockControls = () => {
  answerArea.querySelectorAll("button").forEach((control) => { control.disabled = true; });
  checkButton.disabled = true;
};

checkButton.addEventListener("click", () => {
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
      feedback.textContent = "🎉 ¡Correcto! La respuesta es " + currentQuestion.answerText + ". ¡Sigue así! 🚀";
    } else {
      errors += 1;
      errorsByConcept[currentQuestion.concept] = (errorsByConcept[currentQuestion.concept] || 0) + 1;
      feedback.textContent = "💡 Casi. " + currentQuestion.hint + " La respuesta correcta es " + currentQuestion.answerText + ". ¡A por la siguiente! 💪";
    }
    scoreElement.textContent = String(points);
    correctElement.textContent = String(correctAnswers);
    nextButton.hidden = false;
    nextButton.textContent = questionIndex === totalQuestions - 1
      ? "🏁 Ver resumen"
      : (questionIndex + 1) % questionsPerLevel === 0
        ? "🚀 Pasar al siguiente nivel"
        : "➡️ Siguiente reto";
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
    ? "💡 Te vendrá bien repasar especialmente: " + concepts[0][0] + ". Mira qué representa cada parte y vuelve a intentarlo. ¡Puedes con ello! 💪"
    : "🌟 ¡Has dominado los tres niveles sin errores! Repite la partida para descubrir nuevos retos. 🚀";
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
  checkButton.disabled = false;
  showQuestion(false);
};

document.querySelector("[data-restart]").addEventListener("click", startGame);
window.addEventListener("load", startGame, { once: true });
