import {
  CORE_MEASURES,
  createMeasure,
  exactMeasuresAt,
  equivalenceText
} from "../../posiciones.mjs";

export function shuffle(values, random = Math.random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function randomItem(values, random) {
  return values[Math.floor(random() * values.length)];
}

function takeDifferentNumbers(correct, amount, random) {
  const candidates = shuffle(
    Array.from({ length: 99 }, (_, index) => index + 1).filter(
      (value) => value !== correct
    ),
    random
  );

  candidates.sort(
    (first, second) =>
      Math.abs(first - correct) - Math.abs(second - correct)
      || random() - 0.5
  );
  return candidates.slice(0, amount);
}

export function createPercentileQuestion(random = Math.random) {
  const target = randomItem(CORE_MEASURES, random);
  const correct = `P${target.percent}`;
  const distractors = takeDifferentNumbers(target.percent, 2, random)
    .map((value) => `P${value}`);

  return {
    target,
    display: random() < 0.48 ? target.longName : target.notation,
    correct,
    options: shuffle([correct, ...distractors], random),
    explanation: `${target.notation} representa ${target.percent}%, por eso corresponde a ${correct}.`
  };
}

const SINGLE_POSITION_SYSTEMS = ["quartile", "decile", "percentile"];
const ALL_POSITION_PERCENTAGES = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];

function uniqueChoiceOptions(type, percent, random) {
  if (type === "quartile") {
    return shuffle(
      [1, 2, 3].map((index) => createMeasure("quartile", index)),
      random
    );
  }

  if (type === "decile") {
    const correctIndex = percent / 10;
    const otherIndexes = shuffle(
      [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
        (index) => index !== correctIndex
      ),
      random
    ).slice(0, 2);
    return shuffle(
      [createMeasure("decile", correctIndex), ...otherIndexes.map(
        (index) => createMeasure("decile", index)
      )],
      random
    );
  }

  const otherValues = takeDifferentNumbers(percent, 2, random);
  return shuffle(
    [createMeasure("percentile", percent), ...otherValues.map(
      (value) => createMeasure("percentile", value)
    )],
    random
  );
}

function createSinglePositionQuestion(random) {
  const type = randomItem(SINGLE_POSITION_SYSTEMS, random);
  const percent = type === "quartile"
    ? randomItem([25, 50, 75], random)
    : type === "decile"
      ? randomItem([10, 20, 30, 40, 50, 60, 70, 80, 90], random)
      : randomItem([15, 20, 25, 30, 43, 50, 60, 70, 75, 80, 90], random);
  const options = uniqueChoiceOptions(type, percent, random);
  const correct = options.find((measure) => measure.percent === percent);
  const systemName = {
    quartile: "cuartil",
    decile: "decil",
    percentile: "percentil"
  }[type];

  return {
    mode: "single",
    percent,
    prompt: `¿Qué ${systemName} corresponde a esta posición?`,
    legend: "Selecciona una respuesta",
    options,
    correct: [correct.notation],
    explanation: `${percent}% corresponde a ${correct.notation}.`
  };
}

function createMultiplePositionQuestion(random) {
  const percent = randomItem(ALL_POSITION_PERCENTAGES, random);
  const correctMeasures = exactMeasuresAt(percent);
  const correct = new Set(correctMeasures.map((measure) => measure.notation));
  const distractorPool = shuffle(
    [
      createMeasure("quartile", 1),
      createMeasure("quartile", 2),
      createMeasure("quartile", 3),
      createMeasure("decile", 3),
      createMeasure("decile", 4),
      createMeasure("decile", 5),
      createMeasure("decile", 7),
      createMeasure("decile", 8),
      createMeasure("percentile", 25),
      createMeasure("percentile", 40),
      createMeasure("percentile", 50),
      createMeasure("percentile", 75),
      createMeasure("percentile", 80),
      createMeasure("median")
    ].filter((measure) => !correct.has(measure.notation)),
    random
  );
  const options = shuffle(
    [
      ...correctMeasures,
      ...distractorPool.slice(0, Math.max(1, 5 - correctMeasures.length))
    ],
    random
  );

  return {
    mode: "multiple",
    percent,
    prompt: "Selecciona todas las medidas que representan esta posición.",
    legend: "Puedes elegir más de una respuesta",
    options,
    correct: [...correct],
    explanation: equivalenceText(percent)
  };
}

export function createPositionQuestion(random = Math.random) {
  return random() < 0.42
    ? createMultiplePositionQuestion(random)
    : createSinglePositionQuestion(random);
}

export function createMatchingQuestion(random = Math.random) {
  const shuffledMeasures = shuffle(CORE_MEASURES, random);
  const usedPercentages = new Set();
  const selected = [];

  for (const measure of shuffledMeasures) {
    if (usedPercentages.has(measure.percent)) continue;
    selected.push(measure);
    usedPercentages.add(measure.percent);
    if (selected.length === 3) break;
  }

  const rows = shuffle(
    selected.map((measure) => ({
      measure,
      display: random() < 0.5 ? measure.longName : measure.notation,
      correct: `P${measure.percent}`
    })),
    random
  );

  return {
    rows,
    options: shuffle(rows.map((row) => row.correct), random)
  };
}

function createChoice(name, measure, inputType) {
  const label = document.createElement("label");
  label.className = "choice-option";

  const input = document.createElement("input");
  input.type = inputType;
  input.name = name;
  input.value = typeof measure === "string" ? measure : measure.notation;

  const text = document.createElement("span");
  text.textContent = typeof measure === "string" ? measure : measure.notation;
  label.append(input, text);
  return label;
}

function setFeedback(element, kind, text) {
  element.className = `exercise-feedback is-${kind}`;
  element.textContent = text;
}

function resetFeedback(element) {
  element.className = "exercise-feedback";
  element.textContent = "";
}

function initialiseExercises() {
  const one = document.querySelector("[data-exercise-one]");
  if (!one) return;

  const oneMeasure = one.querySelector("[data-one-measure]");
  const oneMeasureName = one.querySelector("[data-one-measure-name]");
  const oneOptions = one.querySelector("[data-one-options]");
  const oneForm = one.querySelector("[data-one-form]");
  const oneFeedback = one.querySelector("[data-one-feedback]");
  const oneNew = one.querySelector("[data-one-new]");
  const oneFocus = one.querySelector("[data-question-focus]");
  let oneQuestion;

  const renderOne = ({ focus = false } = {}) => {
    oneQuestion = createPercentileQuestion();
    oneMeasure.textContent = oneQuestion.display;
    oneMeasureName.textContent = oneQuestion.display === oneQuestion.target.notation
      ? oneQuestion.target.longName
      : oneQuestion.target.notation;
    oneOptions.replaceChildren(
      ...oneQuestion.options.map((option) =>
        createChoice("percentile-answer", option, "radio")
      )
    );
    resetFeedback(oneFeedback);
    if (focus) oneFocus.focus({ preventScroll: true });
  };

  oneForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = oneForm.querySelector(
      'input[name="percentile-answer"]:checked'
    );
    if (!selected) {
      setFeedback(oneFeedback, "notice", "Selecciona un percentil antes de comprobar.");
      return;
    }
    const correct = selected.value === oneQuestion.correct;
    setFeedback(
      oneFeedback,
      correct ? "correct" : "incorrect",
      `${correct ? "¡Correcto!" : "Revisa la conversión."} ${oneQuestion.explanation}`
    );
  });
  oneNew.addEventListener("click", () => renderOne({ focus: true }));

  const two = document.querySelector("[data-exercise-two]");
  const twoInstruction = two.querySelector("[data-two-instruction]");
  const twoPercent = two.querySelector("[data-two-percent]");
  const twoMarker = two.querySelector("[data-two-marker]");
  const twoQuestionText = two.querySelector("[data-two-question]");
  const twoLegend = two.querySelector("[data-two-legend]");
  const twoOptions = two.querySelector("[data-two-options]");
  const twoForm = two.querySelector("[data-two-form]");
  const twoFeedback = two.querySelector("[data-two-feedback]");
  const twoNew = two.querySelector("[data-two-new]");
  const twoFocus = two.querySelector("[data-question-focus]");
  let twoQuestion;

  const renderTwo = ({ focus = false } = {}) => {
    twoQuestion = createPositionQuestion();
    twoInstruction.textContent = twoQuestion.mode === "multiple"
      ? "Observa la marca y encuentra todas sus equivalencias exactas."
      : "Observa la marca y elige una medida equivalente.";
    twoPercent.textContent = `${twoQuestion.percent}%`;
    twoMarker.style.setProperty("--marker-position", `${twoQuestion.percent}%`);
    twoQuestionText.textContent = twoQuestion.prompt;
    twoLegend.textContent = twoQuestion.legend;
    const inputType = twoQuestion.mode === "multiple" ? "checkbox" : "radio";
    twoOptions.replaceChildren(
      ...twoQuestion.options.map((option) =>
        createChoice("position-answer", option, inputType)
      )
    );
    resetFeedback(twoFeedback);
    if (focus) twoFocus.focus({ preventScroll: true });
  };

  twoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = [
      ...twoForm.querySelectorAll('input[name="position-answer"]:checked')
    ].map((input) => input.value);

    if (!selected.length) {
      setFeedback(twoFeedback, "notice", "Selecciona al menos una medida antes de comprobar.");
      return;
    }

    const expected = new Set(twoQuestion.correct);
    const correct = selected.length === expected.size
      && selected.every((value) => expected.has(value));
    setFeedback(
      twoFeedback,
      correct ? "correct" : "incorrect",
      `${correct ? "¡Correcto!" : "Todavía falta ajustar la selección."} ${twoQuestion.explanation}`
    );
  });
  twoNew.addEventListener("click", () => renderTwo({ focus: true }));

  const three = document.querySelector("[data-exercise-three]");
  const threeRows = three.querySelector("[data-three-rows]");
  const threeForm = three.querySelector("[data-three-form]");
  const threeFeedback = three.querySelector("[data-three-feedback]");
  const threeNew = three.querySelector("[data-three-new]");
  const threeFocus = three.querySelector("[data-question-focus]");
  let threeQuestion;

  const renderThree = ({ focus = false } = {}) => {
    threeQuestion = createMatchingQuestion();
    threeRows.replaceChildren();

    threeQuestion.rows.forEach((row, index) => {
      const rowElement = document.createElement("div");
      rowElement.className = "matching-row";
      rowElement.dataset.matchingRow = String(index);

      const measure = document.createElement("div");
      measure.className = "matching-measure";
      measure.append(
        Object.assign(document.createElement("span"), {
          textContent: String(index + 1)
        }),
        Object.assign(document.createElement("strong"), {
          textContent: row.display
        }),
        Object.assign(document.createElement("small"), {
          textContent: row.display === row.measure.notation
            ? row.measure.longName
            : row.measure.notation
        })
      );

      const selectLabel = document.createElement("label");
      selectLabel.className = "matching-select";
      const hiddenLabel = document.createElement("span");
      hiddenLabel.textContent = `Percentil para ${row.display}`;
      const select = document.createElement("select");
      select.name = `match-${index}`;
      select.dataset.correct = row.correct;
      select.append(
        new Option("Selecciona…", ""),
        ...threeQuestion.options.map((option) => new Option(option, option))
      );
      selectLabel.append(hiddenLabel, select);
      rowElement.append(measure, selectLabel);
      threeRows.append(rowElement);
    });

    resetFeedback(threeFeedback);
    if (focus) threeFocus.focus({ preventScroll: true });
  };

  threeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selects = [...threeForm.querySelectorAll("select")];
    if (selects.some((select) => !select.value)) {
      setFeedback(threeFeedback, "notice", "Completa las tres relaciones antes de comprobar.");
      return;
    }

    let correctCount = 0;
    selects.forEach((select) => {
      const row = select.closest(".matching-row");
      const correct = select.value === select.dataset.correct;
      row.classList.toggle("is-correct", correct);
      row.classList.toggle("is-incorrect", !correct);
      if (correct) correctCount += 1;
    });

    if (correctCount === selects.length) {
      setFeedback(
        threeFeedback,
        "correct",
        "¡Todas las relaciones son correctas! Cada percentil conserva el mismo porcentaje."
      );
    } else {
      setFeedback(
        threeFeedback,
        "incorrect",
        `${correctCount} de 3 relaciones están correctas. Ajusta las filas marcadas y vuelve a comprobar.`
      );
    }
  });

  threeForm.addEventListener("change", (event) => {
    const row = event.target.closest(".matching-row");
    row?.classList.remove("is-correct", "is-incorrect");
  });
  threeNew.addEventListener("click", () => renderThree({ focus: true }));

  renderOne();
  renderTwo();
  renderThree();
}

if (typeof document !== "undefined") {
  initialiseExercises();
}
