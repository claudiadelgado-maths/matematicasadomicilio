import {
  analyseData,
  approximatelyEqual,
  calculateMeanFromFrequencies,
  formatNumber,
  formatPercentage,
  parseDataList,
  renderMath,
} from "../../estadistica.mjs";

const form = document.querySelector("#statistics-exercise-form");

if (form) {
  const frequencyDataBank = [
    { context: "Libros leídos", data: [1, 2, 2, 3, 1, 4, 2, 3, 3, 2] },
    { context: "Número de mascotas", data: [0, 1, 2, 1, 3, 2, 1, 0, 2, 1] },
    { context: "Puntuaciones", data: [2, 3, 3, 4, 5, 4, 4, 5, 2, 4] },
    { context: "Goles por partido", data: [0, 1, 1, 2, 2, 2, 3, 1, 2, 4] },
  ];

  const measuresBank = [
    { data: [2, 3, 3, 4, 5], note: "cantidad impar y una moda" },
    { data: [1, 1, 2, 2, 3, 4], note: "cantidad par y dos modas" },
    { data: [1, 2, 3, 4, 5], note: "cantidad impar y sin moda" },
    { data: [2, 3, 3, 4, 20], note: "cantidad impar y un valor extremo" },
    { data: [2, 4, 6, 10], note: "cantidad par y sin moda" },
    { data: [1, 1, 2, 3, 3, 4, 5], note: "cantidad impar y dos modas" },
  ];

  const summaryBank = [
    { values: [1, 2, 3, 4], frequencies: [2, 4, 3, 1] },
    { values: [0, 1, 2, 3], frequencies: [1, 3, 4, 2] },
    { values: [2, 4, 6, 8], frequencies: [2, 3, 3, 2] },
    { values: [5, 6, 7, 8], frequencies: [1, 4, 3, 2] },
  ];

  const columnDefinitions = [
    { key: "absolute", label: "frecuencia absoluta", decimals: 0 },
    { key: "relative", label: "frecuencia relativa", decimals: 2 },
    { key: "percentage", label: "porcentaje", decimals: 1 },
    { key: "cumulative", label: "frecuencia acumulada", decimals: 0 },
    { key: "cumulativePercentage", label: "porcentaje acumulado", decimals: 1 },
  ];

  const identifyDataset = form.querySelector("[data-identify-dataset]");
  const identifyFrequencyLabel = form.querySelector("[data-identify-frequency-label]");
  const frequencyBody = form.querySelector("[data-frequency-exercise-body]");
  const frequencyFoot = form.querySelector("[data-frequency-exercise-foot]");
  const interpretBody = form.querySelector("[data-interpret-table-body]");
  const measuresDataset = form.querySelector("[data-measures-dataset]");
  const summaryBody = form.querySelector("[data-summary-table-body]");
  const summaryFoot = form.querySelector("[data-summary-table-foot]");
  const overallFeedback = form.querySelector("[data-statistics-exercise-feedback]");
  const newExerciseButton = form.querySelector("[data-new-statistics-exercise]");

  let exerciseIndex = -1;
  let currentFrequency;
  let currentMeasures;
  let currentSummary;
  let identifyTarget;
  let interpretationTargets;
  let tablePattern = 0;

  const parseNumericAnswer = (value) => {
    const normalised = value.trim().replace(",", ".");
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalised)) return Number.NaN;
    return Number(normalised);
  };

  const parseAnswerList = (value) => {
    const parsed = parseDataList(value, 50);
    return parsed.error ? null : parsed.data;
  };

  const arraysEqual = (first, second) =>
    first.length === second.length &&
    first.every((value, index) => approximatelyEqual(value, second[index], 0.000001));

  const setFieldState = (input, correct, message) => {
    const feedback = input.closest(".exercise-field")?.querySelector(".field-feedback");
    input.removeAttribute("aria-invalid");
    input.dataset.answerState = correct ? "correct" : "incorrect";
    if (!correct) input.setAttribute("aria-invalid", "true");
    if (feedback) {
      feedback.className = `field-feedback is-${correct ? "correct" : "incorrect"}`;
      feedback.textContent = `${correct ? "✓" : "Revisa:"} ${message}`;
    }
    return correct;
  };

  const setBlockFeedback = (name, correct, message) => {
    const element = form.querySelector(`[data-${name}-feedback]`);
    element.className = `exercise-feedback is-${correct ? "correct" : "incorrect"}`;
    element.textContent = `${correct ? "✓" : "Todavía no:"} ${message}`;
  };

  const clearFieldStates = () => {
    form.querySelectorAll("input").forEach((input) => {
      input.value = "";
      input.removeAttribute("aria-invalid");
      delete input.dataset.answerState;
    });
    form.querySelectorAll(".field-feedback, .cell-feedback").forEach((element) => {
      element.className = element.classList.contains("cell-feedback")
        ? "cell-feedback"
        : "field-feedback";
      element.textContent = "";
    });
    form
      .querySelectorAll(".exercise-feedback")
      .forEach((element) => {
        element.className = "exercise-feedback";
        element.textContent = "";
      });
    form.querySelectorAll(".exercise-procedure").forEach((element) => {
      element.hidden = true;
      element.replaceChildren();
    });
  };

  const formatEntryValue = (entry, definition) => {
    if (definition.key === "percentage" || definition.key === "cumulativePercentage") {
      return formatNumber(entry[definition.key], definition.decimals);
    }
    return formatNumber(entry[definition.key], definition.decimals);
  };

  const createInputCell = (entry, definition, rowIndex, columnIndex) => {
    const cell = document.createElement("td");
    const shouldAsk = (rowIndex + columnIndex + tablePattern) % 3 !== 0;
    if (!shouldAsk) {
      const given = document.createElement("span");
      given.className = "given-value";
      given.textContent = formatEntryValue(entry, definition);
      given.title = `${definition.label} proporcionada`;
      cell.append(given);
      return cell;
    }

    const input = document.createElement("input");
    input.className = "exercise-table-input";
    input.type = "text";
    input.inputMode =
      definition.key === "absolute" || definition.key === "cumulative"
        ? "numeric"
        : "decimal";
    input.autocomplete = "off";
    input.dataset.tableKey = definition.key;
    input.dataset.expected = String(entry[definition.key]);
    input.dataset.decimals = String(definition.decimals);
    input.setAttribute(
      "aria-label",
      `${definition.label} para el valor ${formatNumber(entry.value)}`
    );
    const feedback = document.createElement("span");
    feedback.className = "cell-feedback";
    feedback.setAttribute("aria-live", "polite");
    cell.append(input, feedback);
    return cell;
  };

  const renderFrequencyTable = () => {
    frequencyBody.replaceChildren();
    currentFrequency.entries.forEach((entry, rowIndex) => {
      const row = document.createElement("tr");
      const valueCell = document.createElement("td");
      valueCell.textContent = formatNumber(entry.value);
      row.append(valueCell);
      columnDefinitions.forEach((definition, columnIndex) => {
        row.append(createInputCell(entry, definition, rowIndex, columnIndex));
      });
      frequencyBody.append(row);
    });

    const totalRow = document.createElement("tr");
    [
      "Total",
      String(currentFrequency.count),
      "1.00",
      "100.0",
      String(currentFrequency.count),
      "100.0",
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      totalRow.append(cell);
    });
    frequencyFoot.replaceChildren(totalRow);
  };

  const renderInterpretationTable = () => {
    interpretBody.replaceChildren();
    currentFrequency.entries.forEach((entry) => {
      const row = document.createElement("tr");
      [
        formatNumber(entry.value),
        String(entry.absolute),
        formatPercentage(entry.percentage, 1),
        String(entry.cumulative),
        formatPercentage(entry.cumulativePercentage, 1),
      ].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });
      interpretBody.append(row);
    });

    const entries = currentFrequency.entries;
    interpretationTargets = {
      frequency: entries[Math.min(1, entries.length - 1)],
      percentage: entries[Math.min(2, entries.length - 1)],
      cumulative: entries[Math.min(2, entries.length - 1)],
      cumulativePercentage: entries[Math.min(1, entries.length - 1)],
    };
    form.querySelector('[data-interpret-label="frequency"]').textContent =
      `¿Cuántas observaciones tienen valor ${formatNumber(interpretationTargets.frequency.value)}?`;
    form.querySelector('[data-interpret-label="percentage"]').textContent =
      `¿Qué porcentaje corresponde al valor ${formatNumber(interpretationTargets.percentage.value)}?`;
    form.querySelector('[data-interpret-label="cumulative"]').textContent =
      `¿Cuántas observaciones son menores o iguales que ${formatNumber(interpretationTargets.cumulative.value)}?`;
    form.querySelector('[data-interpret-label="cumulativePercentage"]').textContent =
      `¿Qué porcentaje se acumula hasta ${formatNumber(interpretationTargets.cumulativePercentage.value)}?`;
  };

  const renderSummaryTable = () => {
    summaryBody.replaceChildren();
    let cumulative = 0;
    let weightedSum = 0;
    currentSummary.values.forEach((value, index) => {
      const frequency = currentSummary.frequencies[index];
      cumulative += frequency;
      weightedSum += value * frequency;
      const row = document.createElement("tr");
      [value, frequency, value * frequency, cumulative].forEach((item) => {
        const cell = document.createElement("td");
        cell.textContent = formatNumber(item);
        row.append(cell);
      });
      summaryBody.append(row);
    });
    currentSummary.total = cumulative;
    currentSummary.weightedSum = weightedSum;
    currentSummary.expanded = currentSummary.values.flatMap((value, index) =>
      Array(currentSummary.frequencies[index]).fill(value)
    );
    currentSummary.analysis = analyseData(currentSummary.expanded);

    const totalRow = document.createElement("tr");
    ["Total", cumulative, weightedSum, cumulative].forEach((item) => {
      const cell = document.createElement("td");
      cell.textContent = String(item);
      totalRow.append(cell);
    });
    summaryFoot.replaceChildren(totalRow);
  };

  const renderExercise = () => {
    exerciseIndex = (exerciseIndex + 1) % Math.max(frequencyDataBank.length, measuresBank.length);
    tablePattern = (tablePattern + 1) % 3;
    const frequencySource = frequencyDataBank[exerciseIndex % frequencyDataBank.length];
    const shuffled = [...frequencySource.data].sort(() => Math.random() - 0.5);
    currentFrequency = analyseData(shuffled);
    currentMeasures = analyseData(measuresBank[exerciseIndex % measuresBank.length].data);
    currentMeasures.note = measuresBank[exerciseIndex % measuresBank.length].note;
    currentSummary = {
      values: [...summaryBank[exerciseIndex % summaryBank.length].values],
      frequencies: [...summaryBank[exerciseIndex % summaryBank.length].frequencies],
    };

    identifyTarget =
      currentFrequency.entries[(exerciseIndex + 1) % currentFrequency.entries.length];
    identifyDataset.textContent = `${frequencySource.context}: ${shuffled
      .map((value) => formatNumber(value))
      .join(", ")}`;
    identifyFrequencyLabel.textContent =
      `Frecuencia absoluta del valor ${formatNumber(identifyTarget.value)}`;
    measuresDataset.textContent = `${currentMeasures.original
      .map((value) => formatNumber(value))
      .join(", ")} · ${currentMeasures.note}`;

    clearFieldStates();
    renderFrequencyTable();
    renderInterpretationTable();
    renderSummaryTable();
    overallFeedback.textContent =
      "Completa las actividades a tu ritmo. No se bloquean los campos después de comprobar.";
    overallFeedback.className = "exercise-summary";
    renderMath(form);
  };

  const validateIdentification = () => {
    const sortedInput = form.querySelector('[data-identify-answer="sorted"]');
    const distinctInput = form.querySelector('[data-identify-answer="distinct"]');
    const countInput = form.querySelector('[data-identify-answer="count"]');
    const frequencyInput = form.querySelector('[data-identify-answer="frequency"]');
    const sortedAnswer = parseAnswerList(sortedInput.value);
    const distinctAnswer = parseAnswerList(distinctInput.value);

    const checks = [
      setFieldState(
        sortedInput,
        Boolean(sortedAnswer && arraysEqual(sortedAnswer, currentFrequency.sorted)),
        sortedAnswer
          ? "ordena todos los datos, incluidos los repetidos."
          : "escribe una lista numérica separada por comas o espacios."
      ),
      setFieldState(
        distinctInput,
        Boolean(
          distinctAnswer &&
            arraysEqual(
              distinctAnswer,
              currentFrequency.entries.map((entry) => entry.value)
            )
        ),
        distinctAnswer
          ? "escribe cada valor distinto una sola vez y en orden."
          : "escribe una lista numérica válida."
      ),
      setFieldState(
        countInput,
        parseNumericAnswer(countInput.value) === currentFrequency.count,
        `\(n\) cuenta todas las observaciones; debe ser ${currentFrequency.count}.`
      ),
      setFieldState(
        frequencyInput,
        parseNumericAnswer(frequencyInput.value) === identifyTarget.absolute,
        `\(f_i\) indica cuántas veces aparece ${formatNumber(identifyTarget.value)}.`
      ),
    ];
    const correct = checks.every(Boolean);
    setBlockFeedback(
      "identify",
      correct,
      correct
        ? "Ordenaste la lista, separaste los valores distintos y contaste correctamente."
        : "La lista ordenada conserva todos los datos; la lista de valores distintos no repite ninguno."
    );
    const procedure = form.querySelector("[data-identify-procedure]");
    procedure.hidden = false;
    procedure.innerHTML = `<h4>Procedimiento</h4><ol><li>Ordenados: ${currentFrequency.sorted
      .map((value) => formatNumber(value))
      .join(", ")}.</li><li>Valores distintos: ${currentFrequency.entries
      .map((entry) => formatNumber(entry.value))
      .join(", ")}.</li><li>Hay \\(n=${currentFrequency.count}\\) datos.</li><li>El valor ${formatNumber(
      identifyTarget.value
    )} aparece ${identifyTarget.absolute} ${
      identifyTarget.absolute === 1 ? "vez" : "veces"
    }.</li></ol>`;
    renderMath(procedure);
    return correct;
  };

  const validateFrequencyTable = () => {
    const inputs = [...frequencyBody.querySelectorAll("input")];
    const incorrectColumns = new Set();
    let correctCount = 0;
    inputs.forEach((input) => {
      const answer = parseNumericAnswer(input.value);
      const expected = Number(input.dataset.expected);
      const decimals = Number(input.dataset.decimals);
      const tolerance = decimals === 0 ? 0.000001 : decimals === 1 ? 0.051 : 0.0051;
      const correct = Number.isFinite(answer) && approximatelyEqual(answer, expected, tolerance);
      const feedback = input.parentElement.querySelector(".cell-feedback");
      input.removeAttribute("aria-invalid");
      input.dataset.answerState = correct ? "correct" : "incorrect";
      if (correct) {
        correctCount += 1;
        feedback.textContent = "✓";
        feedback.style.color = "#0c6841";
      } else {
        input.setAttribute("aria-invalid", "true");
        incorrectColumns.add(input.dataset.tableKey);
        feedback.textContent = "Revisa";
        feedback.style.color = "";
      }
    });

    const correct = correctCount === inputs.length;
    const labels = columnDefinitions
      .filter((definition) => incorrectColumns.has(definition.key))
      .map((definition) => definition.label);
    setBlockFeedback(
      "frequency",
      correct,
      correct
        ? "La tabla cumple todas las sumas y acumulaciones."
        : `Revisa ${labels.join(", ")}. La acumulada incluye la fila actual y todas las anteriores.`
    );
    const procedure = form.querySelector("[data-frequency-procedure]");
    procedure.hidden = false;
    procedure.innerHTML = `<h4>Comprobaciones</h4><ul><li>\\(\\sum f_i=${currentFrequency.count}=n\\).</li><li>\\(\\sum h_i=1\\) y \\(\\sum p_i=100\\%\\).</li><li>\\(F_{\\text{final}}=${currentFrequency.count}\\).</li><li>\\(P_{\\text{final}}=100\\%\\).</li><li>Por ejemplo, para \\(x_i=${formatNumber(
      currentFrequency.entries[1].value
    )}\\): \\(h_i=\\frac{${currentFrequency.entries[1].absolute}}{${
      currentFrequency.count
    }}=${formatNumber(currentFrequency.entries[1].relative, 2)}\\).</li></ul>`;
    renderMath(procedure);
    return correct;
  };

  const validateInterpretation = () => {
    const inputs = Object.fromEntries(
      [...form.querySelectorAll("[data-interpret-answer]")].map((input) => [
        input.dataset.interpretAnswer,
        input,
      ])
    );
    const expectedMode = currentFrequency.modes[0];
    const checks = [
      setFieldState(
        inputs.frequency,
        parseNumericAnswer(inputs.frequency.value) ===
          interpretationTargets.frequency.absolute,
        "la frecuencia absoluta cuenta apariciones."
      ),
      setFieldState(
        inputs.percentage,
        approximatelyEqual(
          parseNumericAnswer(inputs.percentage.value),
          interpretationTargets.percentage.percentage,
          0.051
        ),
        "lee la columna de porcentaje de esa fila."
      ),
      setFieldState(
        inputs.cumulative,
        parseNumericAnswer(inputs.cumulative.value) ===
          interpretationTargets.cumulative.cumulative,
        "“menor o igual” se lee en la frecuencia acumulada."
      ),
      setFieldState(
        inputs.cumulativePercentage,
        approximatelyEqual(
          parseNumericAnswer(inputs.cumulativePercentage.value),
          interpretationTargets.cumulativePercentage.cumulativePercentage,
          0.051
        ),
        "usa el porcentaje acumulado, no el porcentaje de una sola fila."
      ),
      setFieldState(
        inputs.mode,
        parseNumericAnswer(inputs.mode.value) === expectedMode,
        "la moda es el valor con mayor frecuencia, no la frecuencia misma."
      ),
    ];
    const correct = checks.every(Boolean);
    setBlockFeedback(
      "interpret",
      correct,
      correct
        ? "Interpretaste correctamente conteos, porcentajes y acumulados."
        : "Distingue entre una fila individual y todo lo acumulado hasta esa fila."
    );
    const procedure = form.querySelector("[data-interpret-procedure]");
    procedure.hidden = false;
    procedure.innerHTML = `<h4>Lectura clave</h4><ul><li>Para un valor exacto se usa \\(f_i\\) o \\(p_i\\).</li><li>Para “menor o igual que” se usa \\(F_i\\) o \\(P_i\\).</li><li>La mayor frecuencia es ${
      currentFrequency.maximumFrequency
    }; corresponde al valor ${formatNumber(expectedMode)}.</li></ul>`;
    renderMath(procedure);
    return correct;
  };

  const normaliseModeAnswer = (text) => {
    const clean = text.trim().toLocaleLowerCase("es-MX");
    if (/^(sin moda|no hay moda|ninguna|ninguno)$/.test(clean)) return [];
    const matches = clean.match(/[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)/g);
    if (!matches) return null;
    return [...new Set(matches.map((value) => Number(value.replace(",", "."))))].sort(
      (first, second) => first - second
    );
  };

  const validateMeasures = () => {
    const meanInput = form.querySelector('[data-measures-answer="mean"]');
    const medianInput = form.querySelector('[data-measures-answer="median"]');
    const modeInput = form.querySelector('[data-measures-answer="mode"]');
    const modeAnswer = normaliseModeAnswer(modeInput.value);
    const checks = [
      setFieldState(
        meanInput,
        approximatelyEqual(parseNumericAnswer(meanInput.value), currentMeasures.mean, 0.011),
        `la media utiliza los ${currentMeasures.count} datos; redondea a dos decimales.`
      ),
      setFieldState(
        medianInput,
        approximatelyEqual(parseNumericAnswer(medianInput.value), currentMeasures.median, 0.001),
        "para encontrar la mediana, primero ordena los datos."
      ),
      setFieldState(
        modeInput,
        Boolean(modeAnswer && arraysEqual(modeAnswer, currentMeasures.modes)),
        currentMeasures.hasMode
          ? `escribe todos los valores con frecuencia ${currentMeasures.maximumFrequency}.`
          : "ningún valor se repite más que los demás; escribe “sin moda”."
      ),
    ];
    const correct = checks.every(Boolean);
    setBlockFeedback(
      "measures",
      correct,
      correct
        ? "Calculaste las tres medidas sin confundir sus significados."
        : "La media usa todos los datos, la mediana usa el orden y la moda usa las frecuencias."
    );
    const modeText = currentMeasures.hasMode
      ? currentMeasures.modes.map((value) => formatNumber(value)).join(" y ")
      : "sin moda";
    const middleExplanation =
      currentMeasures.middleValues.length === 1
        ? `el dato central es ${formatNumber(currentMeasures.median)}`
        : `los centrales son ${currentMeasures.middleValues
            .map((value) => formatNumber(value))
            .join(" y ")}, cuyo promedio es ${formatNumber(currentMeasures.median)}`;
    const procedure = form.querySelector("[data-measures-procedure]");
    procedure.hidden = false;
    procedure.innerHTML = `<h4>Procedimiento</h4><ol><li>Suma: ${currentMeasures.original
      .map((value) => formatNumber(value))
      .join(" + ")} = ${formatNumber(currentMeasures.sum)}.</li><li>\\(\\bar{x}=\\frac{${
      currentMeasures.sum
    }}{${currentMeasures.count}}=${formatNumber(
      currentMeasures.mean,
      2
    )}\\).</li><li>Ordenados: ${currentMeasures.sorted
      .map((value) => formatNumber(value))
      .join(", ")}; ${middleExplanation}.</li><li>Resultado de moda: ${modeText}.</li></ol>`;
    renderMath(procedure);
    return correct;
  };

  const validateSummary = () => {
    const meanInput = form.querySelector('[data-summary-answer="mean"]');
    const medianInput = form.querySelector('[data-summary-answer="median"]');
    const meanFromTable = calculateMeanFromFrequencies(
      currentSummary.values,
      currentSummary.frequencies
    );
    const checks = [
      setFieldState(
        meanInput,
        approximatelyEqual(parseNumericAnswer(meanInput.value), meanFromTable, 0.011),
        "suma la columna \(x_i f_i\) y divide entre \(n\)."
      ),
      setFieldState(
        medianInput,
        approximatelyEqual(
          parseNumericAnswer(medianInput.value),
          currentSummary.analysis.median,
          0.001
        ),
        "localiza la posición o las posiciones centrales en \(F_i\)."
      ),
    ];
    const correct = checks.every(Boolean);
    setBlockFeedback(
      "summary",
      correct,
      correct
        ? "Usaste correctamente los productos y la frecuencia acumulada."
        : "No necesitas escribir todos los datos: \(x_i f_i\) aporta la suma y \(F_i\) ubica el centro."
    );
    const positions =
      currentSummary.total % 2 === 1
        ? `posición ${(currentSummary.total + 1) / 2}`
        : `posiciones ${currentSummary.total / 2} y ${currentSummary.total / 2 + 1}`;
    const procedure = form.querySelector("[data-summary-procedure]");
    procedure.hidden = false;
    procedure.innerHTML = `<h4>Procedimiento</h4><ol><li>\\(n=\\sum f_i=${
      currentSummary.total
    }\\).</li><li>\\(\\sum x_i f_i=${
      currentSummary.weightedSum
    }\\).</li><li>\\(\\bar{x}=\\frac{${currentSummary.weightedSum}}{${
      currentSummary.total
    }}=${formatNumber(meanFromTable, 2)}\\).</li><li>Busca ${positions} en \\(F_i\\): la mediana es ${formatNumber(
      currentSummary.analysis.median
    )}.</li></ol>`;
    renderMath(procedure);
    return correct;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const results = [
      validateIdentification(),
      validateFrequencyTable(),
      validateInterpretation(),
      validateMeasures(),
      validateSummary(),
    ];
    const correctCount = results.filter(Boolean).length;
    overallFeedback.className = `exercise-summary ${
      correctCount === results.length ? "is-correct" : ""
    }`;
    overallFeedback.textContent =
      correctCount === results.length
        ? "¡Excelente! Las cinco actividades están correctas. Puedes generar otro ejercicio para practicar casos diferentes."
        : `Completaste correctamente ${correctCount} de 5 actividades. Revisa la retroalimentación específica, corrige y vuelve a comprobar.`;
    const firstIncorrect = results.findIndex((result) => !result);
    if (firstIncorrect >= 0) {
      form.querySelectorAll(".exercise-block")[firstIncorrect].scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
    renderMath(form);
  });

  newExerciseButton.addEventListener("click", () => {
    renderExercise();
    form.querySelector(".exercise-block input")?.focus();
  });

  renderExercise();
}
