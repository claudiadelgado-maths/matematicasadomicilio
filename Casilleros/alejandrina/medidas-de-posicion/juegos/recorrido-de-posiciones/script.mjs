import {
  createMeasure,
  equivalenceText
} from "../../posiciones.mjs";

export const GAME_LENGTH = 8;

const FOUNDATION_MEASURES = Object.freeze([
  createMeasure("quartile", 1),
  createMeasure("quartile", 2),
  createMeasure("quartile", 3),
  createMeasure("median"),
  createMeasure("decile", 5),
  createMeasure("percentile", 25),
  createMeasure("percentile", 50),
  createMeasure("percentile", 75)
]);

const WORKSHOP_MEASURES = Object.freeze([
  ...Array.from({ length: 9 }, (_, index) => createMeasure("decile", index + 1)),
  createMeasure("quartile", 1),
  createMeasure("quartile", 3),
  ...[10, 20, 30, 40, 60, 75, 80, 90].map((value) =>
    createMeasure("percentile", value)
  )
]);

const PRECISION_MEASURES = Object.freeze([
  ...[12, 18, 25, 37, 43, 62, 73, 84, 91].map((value) =>
    createMeasure("percentile", value)
  ),
  createMeasure("decile", 2),
  createMeasure("decile", 7),
  createMeasure("quartile", 3),
  createMeasure("median")
]);

const MATERIALS = Object.freeze([
  { name: "Cinta lavanda", color: "#8b6ad2", dark: "#5c409d" },
  { name: "Cordón coral", color: "#d76f66", dark: "#9d453f" },
  { name: "Listón azul", color: "#4c91bd", dark: "#286386" },
  { name: "Hilo esmeralda", color: "#3b9a78", dark: "#217157" },
  { name: "Cinta dorada", color: "#c9953e", dark: "#90671f" }
]);

const REQUEST_TEMPLATES = Object.freeze([
  (label) => `Necesito la cinta cortada en ${label}.`,
  (label) => `Ubica ${label} y realiza el corte.`,
  (label) => `Marca ${label} sobre la cinta.`,
  (label) => `El pedido indica un corte en ${label}.`
]);

function pick(values, random) {
  const rawIndex = Math.floor(random() * values.length);
  return values[Math.min(values.length - 1, Math.max(0, rawIndex))];
}

function spokenLabel(measure, useNotation) {
  if (measure.type === "median") {
    return "la mediana";
  }

  if (useNotation) {
    return measure.notation;
  }

  if (measure.type === "percentile") {
    return `el percentil ${measure.index}`;
  }

  return `el ${measure.longName.toLocaleLowerCase("es-MX")}`;
}

export function levelForRound(roundNumber) {
  if (roundNumber <= 3) {
    return { name: "Fundamentos", pool: FOUNDATION_MEASURES };
  }

  if (roundNumber <= 6) {
    return { name: "Taller", pool: WORKSHOP_MEASURES };
  }

  return { name: "Precisión", pool: PRECISION_MEASURES };
}

export function createOrder(
  roundNumber,
  previousOrder = null,
  random = Math.random
) {
  if (
    !Number.isInteger(roundNumber)
    || roundNumber < 1
    || roundNumber > GAME_LENGTH
  ) {
    throw new RangeError(`La ronda debe estar entre 1 y ${GAME_LENGTH}.`);
  }

  const level = levelForRound(roundNumber);
  const candidates = level.pool.filter(
    (measure) =>
      measure.percent !== previousOrder?.measure.percent
      && measure.notation !== previousOrder?.measure.notation
  );
  const measure = pick(candidates.length ? candidates : level.pool, random);
  const material = pick(MATERIALS, random);
  const label = spokenLabel(measure, random() >= 0.48);
  const template = pick(REQUEST_TEMPLATES, random);

  return {
    id: `${roundNumber}-${measure.type}-${measure.index ?? "median"}-${material.name}`,
    roundNumber,
    levelName: level.name,
    measure,
    material,
    prompt: template(label)
  };
}

export function evaluateCut(order, selectedPercent) {
  const numericPercent = Number(selectedPercent);

  if (!Number.isInteger(numericPercent) || numericPercent < 0 || numericPercent > 100) {
    throw new RangeError("La posición elegida debe ser un entero entre 0 y 100.");
  }

  return {
    correct: numericPercent === order.measure.percent,
    selectedPercent: numericPercent,
    targetPercent: order.measure.percent,
    equivalence: equivalenceText(order.measure.percent)
  };
}

function initialiseCuttingGame() {
  const game = document.querySelector("[data-cutting-game]");
  if (!game) return;

  const roundCount = game.querySelector("[data-round-count]");
  const correctCount = game.querySelector("[data-correct-count]");
  const streakCount = game.querySelector("[data-streak-count]");
  const levelName = game.querySelector("[data-level-name]");
  const progressLabel = game.querySelector("[data-progress-label]");
  const progressBar = game.querySelector("[data-progress-bar]");
  const progressFill = game.querySelector("[data-progress-fill]");
  const playArea = game.querySelector("[data-play-area]");
  const orderCard = game.querySelector("[data-order-card]");
  const orderNumber = game.querySelector("[data-order-number]");
  const orderPrompt = game.querySelector("[data-order-prompt]");
  const materialName = game.querySelector("[data-material-name]");
  const threadPreview = game.querySelector("[data-thread-preview]");
  const stage = game.querySelector("[data-cutting-stage]");
  const positionInput = game.querySelector("[data-position-input]");
  const positionOutput = game.querySelector("[data-position-output]");
  const markerValue = game.querySelector("[data-marker-value]");
  const selectedValue = game.querySelector("[data-selected-value]");
  const targetMarker = game.querySelector("[data-target-marker]");
  const targetValue = game.querySelector("[data-target-value]");
  const stepDown = game.querySelector("[data-step-down]");
  const stepUp = game.querySelector("[data-step-up]");
  const feedback = game.querySelector("[data-feedback]");
  const feedbackSymbol = game.querySelector("[data-feedback-symbol]");
  const feedbackTitle = game.querySelector("[data-feedback-title]");
  const feedbackText = game.querySelector("[data-feedback-text]");
  const feedbackEquivalence = game.querySelector("[data-feedback-equivalence]");
  const cutButton = game.querySelector("[data-cut-button]");
  const nextButton = game.querySelector("[data-next-button]");
  const shiftSummary = game.querySelector("[data-shift-summary]");
  const summaryTitle = game.querySelector("#shift-summary-title");
  const summaryMessage = game.querySelector("[data-summary-message]");
  const summaryCorrect = game.querySelector("[data-summary-correct]");
  const summaryPercent = game.querySelector("[data-summary-percent]");
  const summaryStreak = game.querySelector("[data-summary-streak]");
  const playAgain = game.querySelector("[data-play-again]");

  const state = {
    round: 1,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    locked: false,
    order: null
  };

  const setControlsDisabled = (disabled) => {
    positionInput.disabled = disabled;
    stepDown.disabled = disabled;
    stepUp.disabled = disabled;
    cutButton.disabled = disabled;
  };

  const updatePosition = (value) => {
    const normalized = Math.min(100, Math.max(0, Number(value)));
    const label = `${normalized}%`;
    positionInput.value = String(normalized);
    positionInput.setAttribute(
      "aria-valuetext",
      `${normalized} por ciento del recorrido`
    );
    stage.style.setProperty("--cut-position", `${normalized}%`);
    positionOutput.value = label;
    markerValue.textContent = label;
    selectedValue.textContent = label;
  };

  const updateHud = (answered = state.round - 1) => {
    roundCount.textContent = `${state.round} de ${GAME_LENGTH}`;
    correctCount.textContent = String(state.correct);
    streakCount.textContent = String(state.streak);
    levelName.textContent = state.order?.levelName ?? levelForRound(state.round).name;
    if (answered === GAME_LENGTH) {
      progressLabel.textContent = "Turno completado";
    } else if (answered === state.round) {
      progressLabel.textContent = `Pedido ${state.round} evaluado`;
    } else {
      progressLabel.textContent = `Comienza el pedido ${state.round} de ${GAME_LENGTH}`;
    }
    progressBar.setAttribute("aria-valuenow", String(answered));
    progressFill.style.width = `${(answered / GAME_LENGTH) * 100}%`;
  };

  const prepareOrder = ({ moveFocus = true } = {}) => {
    const previousOrder = state.order;
    state.order = createOrder(state.round, previousOrder);
    state.locked = false;

    orderNumber.textContent = `Pedido ${String(state.round).padStart(2, "0")}`;
    orderPrompt.textContent = state.order.prompt;
    materialName.textContent = state.order.material.name;
    orderCard.style.setProperty("--thread-color", state.order.material.color);
    orderCard.style.setProperty("--thread-color-dark", state.order.material.dark);
    stage.style.setProperty("--thread-color", state.order.material.color);
    stage.style.setProperty("--thread-color-dark", state.order.material.dark);
    threadPreview.style.backgroundColor = state.order.material.color;
    stage.classList.remove("is-cut", "is-wrong");
    targetMarker.hidden = true;
    feedback.hidden = true;
    feedback.classList.remove("is-wrong");
    cutButton.hidden = false;
    nextButton.hidden = true;
    setControlsDisabled(false);
    updateHud();

    if (moveFocus) {
      orderPrompt.focus({ preventScroll: true });
    }
  };

  const showSummary = () => {
    const accuracy = Math.round((state.correct / GAME_LENGTH) * 100);
    playArea.hidden = true;
    shiftSummary.hidden = false;
    progressBar.setAttribute("aria-valuenow", String(GAME_LENGTH));
    progressFill.style.width = "100%";
    progressLabel.textContent = "Turno completado";
    summaryCorrect.textContent = `${state.correct} de ${GAME_LENGTH}`;
    summaryPercent.textContent = `${accuracy}%`;
    summaryStreak.textContent = String(state.bestStreak);

    if (state.correct === GAME_LENGTH) {
      summaryMessage.textContent =
        "¡Todos los cortes fueron exactos! Reconociste cada equivalencia sin errores.";
    } else if (state.correct >= 6) {
      summaryMessage.textContent =
        "Muy buen trabajo. Ya reconoces la mayoría de las posiciones; revisa las correcciones y vuelve a intentarlo.";
    } else {
      summaryMessage.textContent =
        "Cada corte te ayudó a practicar. Repasa las reglas y comienza otro turno cuando quieras.";
    }

    summaryTitle.focus({ preventScroll: true });
  };

  const makeCut = () => {
    if (state.locked) return;

    const result = evaluateCut(state.order, positionInput.value);
    state.locked = true;
    setControlsDisabled(true);
    stage.classList.add("is-cut");
    feedback.hidden = false;
    feedback.classList.toggle("is-wrong", !result.correct);
    cutButton.hidden = true;
    nextButton.hidden = false;

    if (result.correct) {
      state.correct += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      feedbackSymbol.textContent = "✓";
      feedbackTitle.textContent = "¡Corte exacto!";
      feedbackText.textContent = `Las tijeras quedaron justo en ${result.targetPercent}%. Pedido completado.`;
      targetMarker.hidden = true;
    } else {
      state.streak = 0;
      stage.classList.add("is-wrong");
      stage.style.setProperty("--target-position", `${result.targetPercent}%`);
      targetValue.textContent = `${result.targetPercent}%`;
      targetMarker.hidden = false;
      feedbackSymbol.textContent = "↗";
      feedbackTitle.textContent = "Estuviste cerca; revisemos el pedido";
      feedbackText.textContent = `Cortaste en ${result.selectedPercent}%, pero ${state.order.measure.notation} corresponde a ${result.targetPercent}%.`;
    }

    feedbackEquivalence.textContent = result.equivalence;
    updateHud(state.round);
    feedback.focus({ preventScroll: true });
  };

  const nextOrder = () => {
    if (!state.locked) return;

    if (state.round === GAME_LENGTH) {
      showSummary();
      return;
    }

    state.round += 1;
    prepareOrder();
  };

  const startShift = () => {
    state.round = 1;
    state.correct = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.locked = false;
    state.order = null;
    playArea.hidden = false;
    shiftSummary.hidden = true;
    updatePosition(50);
    prepareOrder({ moveFocus: false });
  };

  positionInput.addEventListener("input", () => {
    updatePosition(positionInput.value);
  });

  positionInput.addEventListener("keydown", (event) => {
    const currentValue = Number(positionInput.value);
    const keyboardValues = {
      ArrowLeft: currentValue - 1,
      ArrowDown: currentValue - 1,
      ArrowRight: currentValue + 1,
      ArrowUp: currentValue + 1,
      Home: 0,
      End: 100
    };

    if (!(event.key in keyboardValues)) return;

    event.preventDefault();
    updatePosition(keyboardValues[event.key]);
  });

  stepDown.addEventListener("click", () => {
    updatePosition(Number(positionInput.value) - 1);
    positionInput.focus();
  });

  stepUp.addEventListener("click", () => {
    updatePosition(Number(positionInput.value) + 1);
    positionInput.focus();
  });

  cutButton.addEventListener("click", makeCut);
  nextButton.addEventListener("click", nextOrder);
  playAgain.addEventListener("click", () => {
    startShift();
    orderPrompt.focus({ preventScroll: true });
  });

  startShift();
}

if (typeof document !== "undefined") {
  initialiseCuttingGame();
}
