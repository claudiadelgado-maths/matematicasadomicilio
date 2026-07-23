(() => {
  const formatNumber = (value) =>
    Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));

  const shuffle = (values) => {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  };

  const analyseData = (data) => {
    const sorted = [...data].sort((first, second) => first - second);
    const frequencies = new Map();
    data.forEach((value) => frequencies.set(value, (frequencies.get(value) || 0) + 1));
    const entries = [...frequencies.entries()].sort((first, second) => first[0] - second[0]);
    const maximumFrequency = Math.max(...entries.map((entry) => entry[1]));
    const allFrequenciesEqual =
      entries.length > 1 && entries.every((entry) => entry[1] === entries[0][1]);
    const modes = allFrequenciesEqual
      ? []
      : entries.filter((entry) => entry[1] === maximumFrequency).map((entry) => entry[0]);
    const middle = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    const sum = data.reduce((total, value) => total + value, 0);

    return {
      original: [...data],
      sorted,
      entries,
      modes,
      noUniqueMode: allFrequenciesEqual,
      median,
      sum,
      mean: sum / data.length,
      count: data.length,
    };
  };

  const setFieldFeedback = (element, correct, message) => {
    element.className = correct ? "field-check is-correct" : "field-check is-incorrect";
    element.textContent = `${correct ? "✓" : "✕"} ${message}`;
  };

  const setGeneralFeedback = (element, type, message) => {
    element.className = `answer-feedback statistics-exercise-feedback is-${type}`;
    element.textContent = `${type === "correct" ? "✓" : "✕"} ${message}`;
  };

  document.querySelectorAll("[data-stats-integer]").forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
    });
  });

  const statisticsExerciseForm = document.querySelector("#statistics-exercise-form");

  if (statisticsExerciseForm) {
    const exerciseBank = [
      [4, 2, 5, 5, 3, 1, 4, 5, 7],
      [2, 6, 4, 6, 8, 6, 3, 5, 5],
      [1, 3, 7, 3, 5, 9, 3, 4, 10],
      [2, 4, 8, 4, 6, 4, 5, 7, 5],
      [3, 6, 9, 6, 12, 6, 4, 5, 3],
    ];
    const datasetElement = document.querySelector("[data-exercise-dataset]");
    const frequencyBody = document.querySelector("[data-exercise-frequency-body]");
    const frequencyTotal = document.querySelector("[data-frequency-total]");
    const modeInput = document.querySelector("#exercise-mode");
    const medianInput = document.querySelector("#exercise-median");
    const meanInput = document.querySelector("#exercise-mean");
    const modeFeedback = document.querySelector("[data-mode-feedback]");
    const medianFeedback = document.querySelector("[data-median-feedback]");
    const meanFeedback = document.querySelector("[data-mean-feedback]");
    const generalFeedback = document.querySelector("[data-statistics-exercise-feedback]");
    const newExerciseButton = document.querySelector("[data-new-statistics-exercise]");
    let currentBankIndex = -1;
    let currentAnalysis;
    let submitting = false;

    const updateFrequencyTotal = () => {
      const enteredTotal = [...frequencyBody.querySelectorAll("input")].reduce((total, input) => {
        return total + (/^\d+$/.test(input.value) ? Number.parseInt(input.value, 10) : 0);
      }, 0);
      frequencyTotal.textContent = `Frecuencias registradas: ${enteredTotal} de ${currentAnalysis.count}`;
    };

    const renderExercise = () => {
      let nextIndex = Math.floor(Math.random() * exerciseBank.length);
      if (exerciseBank.length > 1 && nextIndex === currentBankIndex) {
        nextIndex = (nextIndex + 1) % exerciseBank.length;
      }
      currentBankIndex = nextIndex;
      const data = shuffle(exerciseBank[currentBankIndex]);
      currentAnalysis = analyseData(data);
      datasetElement.textContent = data.join(", ");
      frequencyBody.replaceChildren();

      currentAnalysis.entries.forEach(([value]) => {
        const row = document.createElement("tr");
        const valueCell = document.createElement("td");
        valueCell.textContent = value;
        const inputCell = document.createElement("td");
        const label = document.createElement("label");
        label.className = "table-input-label";
        label.textContent = `Frecuencia del dato ${value}`;
        const input = document.createElement("input");
        input.type = "text";
        input.inputMode = "numeric";
        input.autocomplete = "off";
        input.dataset.frequencyValue = value;
        input.addEventListener("input", () => {
          input.value = input.value.replace(/\D/g, "");
          updateFrequencyTotal();
        });
        label.append(input);
        inputCell.append(label);
        const feedbackCell = document.createElement("td");
        const feedback = document.createElement("span");
        feedback.className = "field-check";
        feedback.dataset.frequencyFeedback = value;
        feedbackCell.append(feedback);
        row.append(valueCell, inputCell, feedbackCell);
        frequencyBody.append(row);
      });

      [modeInput, medianInput, meanInput].forEach((input) => {
        input.value = "";
      });
      [modeFeedback, medianFeedback, meanFeedback].forEach((element) => {
        element.className = "";
        element.textContent = "";
      });
      generalFeedback.className = "answer-feedback statistics-exercise-feedback";
      generalFeedback.textContent = "";
      updateFrequencyTotal();
    };

    statisticsExerciseForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (submitting) return;
      submitting = true;

      const frequencyInputs = [...frequencyBody.querySelectorAll("input")];
      const allInputs = [...frequencyInputs, modeInput, medianInput, meanInput];
      if (allInputs.some((input) => !/^\d+$/.test(input.value))) {
        setGeneralFeedback(
          generalFeedback,
          "error",
          "Completa todas las respuestas utilizando números enteros no negativos."
        );
        submitting = false;
        return;
      }

      let allCorrect = true;
      frequencyInputs.forEach((input) => {
        const value = Number.parseInt(input.dataset.frequencyValue, 10);
        const answer = Number.parseInt(input.value, 10);
        const expected = currentAnalysis.entries.find((entry) => entry[0] === value)[1];
        const correct = answer === expected;
        allCorrect = allCorrect && correct;
        setFieldFeedback(
          frequencyBody.querySelector(`[data-frequency-feedback="${value}"]`),
          correct,
          correct ? "Correcto" : "Revisa cuántas veces aparece."
        );
      });

      const expectedMode = currentAnalysis.modes[0];
      const modeCorrect = Number.parseInt(modeInput.value, 10) === expectedMode;
      const medianCorrect = Number.parseInt(medianInput.value, 10) === currentAnalysis.median;
      const meanCorrect = Number.parseInt(meanInput.value, 10) === currentAnalysis.mean;
      allCorrect = allCorrect && modeCorrect && medianCorrect && meanCorrect;

      setFieldFeedback(
        modeFeedback,
        modeCorrect,
        modeCorrect ? "Correcto" : "Busca el dato con mayor frecuencia."
      );
      setFieldFeedback(
        medianFeedback,
        medianCorrect,
        medianCorrect ? "Correcto" : "Ordena los nueve datos y encuentra el valor central."
      );
      setFieldFeedback(
        meanFeedback,
        meanCorrect,
        meanCorrect ? "Correcto" : "Suma los datos y divide el resultado entre nueve."
      );

      const enteredFrequencyTotal = frequencyInputs.reduce(
        (total, input) => total + Number.parseInt(input.value, 10),
        0
      );

      if (allCorrect) {
        setGeneralFeedback(
          generalFeedback,
          "correct",
          "¡Todo correcto! Organizaste los datos y calculaste las tres medidas."
        );
      } else if (enteredFrequencyTotal !== currentAnalysis.count) {
        setGeneralFeedback(
          generalFeedback,
          "incorrect",
          `Revisa la tabla: la suma de tus frecuencias es ${enteredFrequencyTotal}, pero debe ser ${currentAnalysis.count}. Puedes corregir y volver a entregar.`
        );
      } else {
        setGeneralFeedback(
          generalFeedback,
          "incorrect",
          "Algunas respuestas necesitan revisión. Usa las orientaciones y vuelve a entregar."
        );
      }
      submitting = false;
    });

    newExerciseButton.addEventListener("click", renderExercise);
    renderExercise();
  }

  const statisticsCalculatorForm = document.querySelector("#statistics-calculator-form");

  if (statisticsCalculatorForm) {
    const input = document.querySelector("#statistics-data-input");
    const errorElement = document.querySelector("[data-statistics-calculator-error]");
    const results = document.querySelector("[data-statistics-calculator-results]");
    const overview = document.querySelector("[data-statistics-overview]");
    const frequencyBody = document.querySelector("[data-statistics-calculator-frequency]");
    const measures = document.querySelector("[data-statistics-measures]");

    const parseList = (text) => {
      if (!text.trim()) return { error: "Escribe al menos un dato." };
      const parts = text.trim().split(/,|\r?\n/);
      if (parts.some((part) => !part.trim())) {
        return { error: "Revisa la lista: existe una coma o separación sin un número válido." };
      }
      if (parts.some((part) => !/^-?\d+$/.test(part.trim()))) {
        return { error: "Todos los valores deben ser números enteros. No utilices letras ni decimales." };
      }
      return { data: parts.map((part) => Number.parseInt(part.trim(), 10)) };
    };

    const createOverviewItem = (label, value) => {
      const article = document.createElement("article");
      const title = document.createElement("span");
      title.textContent = label;
      const content = document.createElement("strong");
      content.textContent = value;
      article.append(title, content);
      return article;
    };

    const createMeasure = (title, lines) => {
      const article = document.createElement("article");
      const heading = document.createElement("h3");
      heading.textContent = title;
      article.append(heading);
      lines.forEach((line) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        article.append(paragraph);
      });
      return article;
    };

    statisticsCalculatorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      errorElement.textContent = "";
      const parsed = parseList(input.value);

      if (parsed.error) {
        results.hidden = true;
        errorElement.textContent = parsed.error;
        return;
      }

      const analysis = analyseData(parsed.data);
      overview.replaceChildren(
        createOverviewItem("Datos originales", analysis.original.join(", ")),
        createOverviewItem("Datos ordenados", analysis.sorted.join(", ")),
        createOverviewItem("Cantidad", String(analysis.count)),
        createOverviewItem("Suma", String(analysis.sum))
      );

      frequencyBody.replaceChildren();
      analysis.entries.forEach(([value, frequency]) => {
        const row = document.createElement("tr");
        const valueCell = document.createElement("td");
        valueCell.textContent = value;
        const frequencyCell = document.createElement("td");
        frequencyCell.textContent = frequency;
        row.append(valueCell, frequencyCell);
        frequencyBody.append(row);
      });

      let modeText;
      if (analysis.noUniqueMode) {
        modeText = "No existe una moda única porque todos los valores aparecen la misma cantidad de veces.";
      } else if (analysis.modes.length === 1) {
        modeText = `Moda: ${analysis.modes[0]}`;
      } else {
        modeText = `Modas: ${analysis.modes.join(" y ")}`;
      }

      const medianLines =
        analysis.count % 2 === 1
          ? [
              `Datos ordenados: ${analysis.sorted.join(", ")}`,
              `El valor central es ${formatNumber(analysis.median)}.`,
            ]
          : [
              `Datos ordenados: ${analysis.sorted.join(", ")}`,
              `Los valores centrales son ${analysis.sorted[analysis.count / 2 - 1]} y ${analysis.sorted[analysis.count / 2]}.`,
              `Mediana: (${analysis.sorted[analysis.count / 2 - 1]} + ${analysis.sorted[analysis.count / 2]}) ÷ 2 = ${formatNumber(analysis.median)}`,
            ];

      measures.replaceChildren(
        createMeasure("Moda", [modeText]),
        createMeasure("Mediana", medianLines),
        createMeasure("Media o promedio", [
          `Suma: ${analysis.original.join(" + ")} = ${analysis.sum}`,
          `Cantidad de datos: ${analysis.count}`,
          `Media o promedio: ${analysis.sum} ÷ ${analysis.count} = ${formatNumber(analysis.mean)}`,
        ])
      );
      results.hidden = false;
    });

    statisticsCalculatorForm.addEventListener("reset", () => {
      window.setTimeout(() => {
        errorElement.textContent = "";
        overview.replaceChildren();
        frequencyBody.replaceChildren();
        measures.replaceChildren();
        results.hidden = true;
        input.focus();
      }, 0);
    });
  }

  const musicGame = document.querySelector("#music-interview-game");

  if (musicGame) {
    const songNames = [
      "Luz de verano",
      "Camino azul",
      "Noche de estrellas",
      "Último tren",
      "Ritmo del mar",
      "Cielo de papel",
      "Viento del sur",
      "Pasos de luna",
      "Horizonte",
      "Mañana clara",
    ];
    const playBanks = [
      [320, 480, 560, 740, 400],
      [250, 430, 610, 370, 590],
      [180, 360, 540, 720, 450],
      [275, 425, 575, 725, 500],
      [150, 350, 550, 750, 700],
    ];
    const progressText = musicGame.querySelector("[data-music-progress]");
    const progressBar = musicGame.querySelector("[data-music-progress-bar]");
    const scene = musicGame.querySelector("[data-music-scene]");
    const tableBody = musicGame.querySelector("[data-music-table]");
    const questionLabel = musicGame.querySelector("[data-music-question-label]");
    const question = musicGame.querySelector("[data-music-question]");
    const help = musicGame.querySelector("[data-music-help]");
    const form = musicGame.querySelector("#music-question-form");
    const options = musicGame.querySelector("[data-music-options]");
    const submitButton = form.querySelector('button[type="submit"]');
    const continueButton = musicGame.querySelector("[data-music-continue]");
    const feedback = musicGame.querySelector("[data-music-feedback]");
    const outcome = musicGame.querySelector("[data-music-outcome]");
    const stamp = musicGame.querySelector("[data-music-stamp]");
    const outcomeMessage = musicGame.querySelector("[data-music-outcome-message]");
    const restartButton = musicGame.querySelector("[data-music-restart]");
    let songs = [];
    let stage = 0;
    let locked = false;
    let comparison;

    const createOption = (value, label) => {
      const optionLabel = document.createElement("label");
      optionLabel.className = "music-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "music-answer";
      input.value = value;
      const span = document.createElement("span");
      span.textContent = label;
      optionLabel.append(input, span);
      return optionLabel;
    };

    const renderSongTable = () => {
      tableBody.replaceChildren();
      songs.forEach((song) => {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        name.textContent = song.name;
        const plays = document.createElement("td");
        plays.textContent = song.plays.toLocaleString("es-MX");
        row.append(name, plays);
        tableBody.append(row);
      });
    };

    const createComparison = (mean) => {
      const relation = Math.random() < 0.5 ? "superior" : "inferior";
      const shouldBeTrue = Math.random() < 0.5;
      const difference = 20 + Math.floor(Math.random() * 4) * 10;
      let threshold;
      if (relation === "superior") {
        threshold = shouldBeTrue ? mean - difference : mean + difference;
      } else {
        threshold = shouldBeTrue ? mean + difference : mean - difference;
      }
      return { relation, threshold, answer: shouldBeTrue ? "yes" : "no" };
    };

    const clearMusicFeedback = () => {
      feedback.className = "answer-feedback music-feedback";
      feedback.textContent = "";
    };

    const renderStage = () => {
      locked = false;
      progressText.textContent = `Pregunta ${stage + 1} de 3`;
      progressBar.style.width = `${((stage + 1) / 3) * 100}%`;
      options.replaceChildren();
      continueButton.hidden = true;
      submitButton.hidden = false;
      submitButton.disabled = false;
      outcome.hidden = true;
      clearMusicFeedback();
      scene.className = "music-interview-scene";

      if (stage === 0) {
        questionLabel.textContent = "Moda";
        question.textContent = "¿Cuál es tu canción más popular?";
        help.textContent = "Selecciona la canción que tiene la mayor cantidad de reproducciones.";
        songs.forEach((song) => options.append(createOption(song.name, song.name)));
      } else if (stage === 1) {
        questionLabel.textContent = "Mediana";
        question.textContent = "¿Cuál fue la canción a la que no le fue ni tan bien ni tan mal?";
        help.textContent =
          "Ordena mentalmente las reproducciones de menor a mayor y selecciona la canción que queda en medio.";
        songs.forEach((song) => options.append(createOption(song.name, song.name)));
      } else {
        questionLabel.textContent = "Media o promedio";
        question.textContent = `¿El promedio de tus reproducciones es ${comparison.relation} a ${comparison.threshold}?`;
        help.textContent = "Suma las cinco cantidades, divide entre cinco y compara el resultado.";
        options.append(createOption("yes", "Sí"), createOption("no", "No"));
      }
    };

    const explainAnswer = () => {
      if (stage === 0) {
        const mostPopular = songs.reduce((best, song) => (song.plays > best.plays ? song : best));
        return `La canción más popular es “${mostPopular.name}” porque tiene ${mostPopular.plays.toLocaleString("es-MX")} reproducciones, la cantidad más alta.`;
      }
      if (stage === 1) {
        const ordered = [...songs].sort((first, second) => first.plays - second.plays);
        const medianSong = ordered[2];
        return `Al ordenar las reproducciones: ${ordered.map((song) => song.plays).join(", ")}, la cantidad central es ${medianSong.plays}; corresponde a “${medianSong.name}”.`;
      }
      const sum = songs.reduce((total, song) => total + song.plays, 0);
      const mean = sum / songs.length;
      const isTrue =
        comparison.relation === "superior"
          ? mean > comparison.threshold
          : mean < comparison.threshold;
      return `El promedio real es ${sum} ÷ 5 = ${mean}. La afirmación es ${isTrue ? "verdadera" : "falsa"}.`;
    };

    const correctAnswer = () => {
      if (stage === 0) {
        return songs.reduce((best, song) => (song.plays > best.plays ? song : best)).name;
      }
      if (stage === 1) {
        return [...songs].sort((first, second) => first.plays - second.plays)[2].name;
      }
      return comparison.answer;
    };

    const disableMusicOptions = () => {
      options.querySelectorAll("input").forEach((input) => {
        input.disabled = true;
      });
      submitButton.disabled = true;
    };

    const finishInterview = (hired, explanation) => {
      locked = true;
      disableMusicOptions();
      submitButton.hidden = true;
      continueButton.hidden = true;
      outcome.hidden = false;
      stamp.className = hired ? "is-hired" : "is-rejected";
      stamp.textContent = hired ? "✓ CONTRATADO" : "✕ RECHAZADO";
      outcomeMessage.textContent = hired
        ? "Respondiste correctamente las preguntas sobre moda, mediana y promedio."
        : explanation;
      restartButton.textContent = hired ? "Nueva entrevista" : "Intentar de nuevo";
      scene.className = `music-interview-scene ${hired ? "is-hired" : "is-rejected"}`;
      feedback.className = `answer-feedback music-feedback is-${hired ? "correct" : "incorrect"}`;
      feedback.textContent = hired
        ? `✓ ${explanation}`
        : `✕ Respuesta incorrecta. ${explanation}`;
    };

    const startInterview = () => {
      const names = shuffle(songNames).slice(0, 5);
      const plays = shuffle(playBanks[Math.floor(Math.random() * playBanks.length)]);
      songs = names.map((name, index) => ({ name, plays: plays[index] }));
      const mean = plays.reduce((total, value) => total + value, 0) / plays.length;
      comparison = createComparison(mean);
      stage = 0;
      locked = false;
      renderSongTable();
      renderStage();
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (locked) return;
      const selected = form.querySelector('input[name="music-answer"]:checked');
      if (!selected) {
        feedback.className = "answer-feedback music-feedback is-error";
        feedback.textContent = "Selecciona una respuesta antes de continuar.";
        return;
      }

      locked = true;
      disableMusicOptions();
      const explanation = explainAnswer();
      if (selected.value === correctAnswer()) {
        feedback.className = "answer-feedback music-feedback is-correct";
        feedback.textContent = `✓ Respuesta correcta. ${explanation}`;
        scene.className = "music-interview-scene is-positive";
        if (stage === 2) {
          finishInterview(true, explanation);
        } else {
          continueButton.hidden = false;
        }
      } else {
        finishInterview(false, explanation);
      }
    });

    continueButton.addEventListener("click", () => {
      if (!locked || stage >= 2) return;
      stage += 1;
      renderStage();
    });
    restartButton.addEventListener("click", startInterview);
    startInterview();
  }

  const taskBoard = document.querySelector("[data-task-board]");

  if (taskBoard) {
    const storageKey = "matematicasADomicilio_usuario_jose_tareas_v1";
    const initialTasks = [
      {
        id: "jose-inicial-barrer",
        title: "Barrer",
        description:
          "Usar la escoba y moverla de un lado a otro para juntar la basura. Recogerla con el recogedor y terminar la actividad antes de las 3:00.",
        zone: "available",
        position: 0,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "jose-inicial-trapear",
        title: "Trapear",
        description:
          "Preparar el agua utilizando media tapita de Pinol. Trapear el espacio indicado y dejar el piso limpio.",
        zone: "available",
        position: 1,
        createdAt: "2026-01-01T00:00:01.000Z",
      },
      {
        id: "jose-inicial-sacudir",
        title: "Sacudir",
        description:
          "Empezar con los cajones de atrás y avanzar hacia los que están al frente. Retirar el polvo con cuidado y volver a colocar los objetos en su lugar.",
        zone: "available",
        position: 2,
        createdAt: "2026-01-01T00:00:02.000Z",
      },
      {
        id: "jose-inicial-formatear",
        title: "Formatear",
        description:
          "Usar los siguientes comandos: escribe aquí los comandos y el procedimiento necesario para realizar el formateo.",
        zone: "available",
        position: 3,
        createdAt: "2026-01-01T00:00:03.000Z",
      },
      {
        id: "jose-inicial-publicacion",
        title: "Crear publicación",
        description:
          "Usar ChatGPT tomando en consideración que: escribe aquí el objetivo, el público, el formato, el tono y la información que debe contener la publicación.",
        zone: "available",
        position: 4,
        createdAt: "2026-01-01T00:00:04.000Z",
      },
    ];
    const zones = {
      available: {
        label: "Tareas disponibles",
        status: "Disponible",
        symbol: "☰",
        next: "todo",
        moveLabel: "Mover a Por hacer",
        empty: "No hay tareas disponibles. Crea una nueva tarea.",
      },
      todo: {
        label: "Por hacer",
        status: "Pendiente",
        symbol: "◷",
        next: "done",
        moveLabel: "Marcar como hecha",
        empty: "No hay tareas pendientes. Mueve una actividad aquí cuando quieras comenzar.",
      },
      done: {
        label: "Hechas",
        status: "Completada",
        symbol: "✓",
        next: "available",
        moveLabel: "Regresar a Tareas",
        empty: "Todavía no hay tareas completadas.",
      },
    };
    const lists = {
      available: taskBoard.querySelector('[data-task-list="available"]'),
      todo: taskBoard.querySelector('[data-task-list="todo"]'),
      done: taskBoard.querySelector('[data-task-list="done"]'),
    };
    const statusElement = document.querySelector("[data-task-status]");
    const newTaskButton = document.querySelector("[data-new-task]");
    const resetTasksButton = document.querySelector("[data-reset-tasks]");
    const editorDialog = document.querySelector("#task-editor-dialog");
    const editorForm = document.querySelector("#task-editor-form");
    const editorEyebrow = document.querySelector("[data-task-editor-eyebrow]");
    const editorTitle = document.querySelector("[data-task-editor-title]");
    const editorSubmit = document.querySelector("[data-task-editor-submit]");
    const editorError = document.querySelector("[data-task-editor-error]");
    const titleInput = document.querySelector("#task-title");
    const descriptionInput = document.querySelector("#task-description");
    const closeEditorButton = document.querySelector("[data-close-task-editor]");
    const deleteDialog = document.querySelector("#task-delete-dialog");
    const deleteForm = document.querySelector("#task-delete-form");
    const deleteName = document.querySelector("[data-task-delete-name]");
    const closeDeleteButton = document.querySelector("[data-close-task-delete]");
    let tasks = [];
    let editingTaskId = null;
    let deletingTaskId = null;
    let draggingTaskId = null;
    let savingTask = false;
    let storageAvailable = true;

    const cloneInitialTasks = () => initialTasks.map((task) => ({ ...task }));

    const saveTasks = () => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(tasks));
        storageAvailable = true;
      } catch {
        storageAvailable = false;
        statusElement.textContent =
          "Los cambios funcionan en esta página, pero el navegador no permitió guardarlos localmente.";
      }
    };

    const loadTasks = () => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === null) {
          tasks = cloneInitialTasks();
          saveTasks();
          return;
        }
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) throw new Error("Formato inválido");
        tasks = parsed
          .filter(
            (task) =>
              task &&
              typeof task.id === "string" &&
              typeof task.title === "string" &&
              Object.prototype.hasOwnProperty.call(zones, task.zone)
          )
          .map((task, index) => ({
            id: task.id,
            title: task.title.trim() || "Tarea sin título",
            description: typeof task.description === "string" ? task.description : "",
            zone: task.zone,
            position: Number.isFinite(task.position) ? task.position : index,
            createdAt: typeof task.createdAt === "string" ? task.createdAt : new Date().toISOString(),
          }));
      } catch {
        storageAvailable = false;
        tasks = cloneInitialTasks();
        statusElement.textContent =
          "No fue posible leer las tareas guardadas. Se muestran las tareas iniciales sin eliminar la información anterior.";
      }
    };

    const sortedTasks = (zone) =>
      tasks.filter((task) => task.zone === zone).sort((first, second) => first.position - second.position);

    const normalizePositions = (zone) => {
      sortedTasks(zone).forEach((task, index) => {
        task.position = index;
      });
    };

    const announce = (message) => {
      statusElement.textContent = message;
    };

    const openDialog = (dialog) => {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    };

    const closeDialog = (dialog) => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };

    const createButton = (label, className, handler) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = label;
      button.addEventListener("click", handler);
      return button;
    };

    const moveTask = (taskId) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task) return;
      const previousZone = task.zone;
      const targetZone = zones[previousZone].next;
      task.zone = targetZone;
      task.position = sortedTasks(targetZone).length;
      normalizePositions(previousZone);
      normalizePositions(targetZone);
      saveTasks();
      renderBoard();
      announce(`“${task.title}” se movió de ${zones[previousZone].label} a ${zones[targetZone].label}.`);
    };

    const reorderTask = (taskId, direction) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task) return;
      const zoneTasks = sortedTasks(task.zone);
      const index = zoneTasks.findIndex((candidate) => candidate.id === taskId);
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= zoneTasks.length) return;
      const otherTask = zoneTasks[targetIndex];
      [task.position, otherTask.position] = [otherTask.position, task.position];
      saveTasks();
      renderBoard();
      announce(`“${task.title}” cambió de posición dentro de ${zones[task.zone].label}.`);
    };

    const openEditor = (taskId = null) => {
      editingTaskId = taskId;
      editorError.textContent = "";
      if (taskId) {
        const task = tasks.find((candidate) => candidate.id === taskId);
        if (!task) return;
        editorEyebrow.textContent = "Modificar actividad";
        editorTitle.textContent = "Editar tarea";
        editorSubmit.textContent = "Guardar cambios";
        titleInput.value = task.title;
        descriptionInput.value = task.description;
      } else {
        editorEyebrow.textContent = "Nueva actividad";
        editorTitle.textContent = "Nueva tarea";
        editorSubmit.textContent = "Agregar tarea";
        editorForm.reset();
      }
      openDialog(editorDialog);
      titleInput.focus();
    };

    const openDeleteConfirmation = (taskId) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task) return;
      deletingTaskId = taskId;
      deleteName.textContent = `Tarea: “${task.title}”`;
      openDialog(deleteDialog);
    };

    const createTaskCard = (task, index, zoneTasks) => {
      const article = document.createElement("article");
      article.className = `task-card task-card-${task.zone}`;
      article.dataset.taskId = task.id;
      article.draggable = true;

      const status = document.createElement("p");
      status.className = "task-card-status";
      status.textContent = `${zones[task.zone].symbol} ${zones[task.zone].status}`;
      const title = document.createElement("h4");
      title.textContent = task.title;
      const description = document.createElement("p");
      description.className = "task-card-description";
      description.textContent = task.description || "Sin descripción.";

      const mainActions = document.createElement("div");
      mainActions.className = "task-card-main-actions";
      mainActions.append(
        createButton(zones[task.zone].moveLabel, "task-action task-action-move", () => moveTask(task.id)),
        createButton("Editar", "task-action", () => openEditor(task.id)),
        createButton("Eliminar", "task-action task-action-delete", () =>
          openDeleteConfirmation(task.id)
        )
      );

      const orderActions = document.createElement("div");
      orderActions.className = "task-card-order-actions";
      const upButton = createButton("Subir", "task-order-button", () => reorderTask(task.id, -1));
      const downButton = createButton("Bajar", "task-order-button", () => reorderTask(task.id, 1));
      upButton.disabled = index === 0;
      downButton.disabled = index === zoneTasks.length - 1;
      orderActions.append(upButton, downButton);

      article.append(status, title, description, mainActions, orderActions);
      article.addEventListener("dragstart", (event) => {
        draggingTaskId = task.id;
        article.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
      });
      article.addEventListener("dragend", () => {
        draggingTaskId = null;
        article.classList.remove("is-dragging");
        Object.values(lists).forEach((list) => list.classList.remove("is-drop-target"));
      });
      article.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      });
      article.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleDrop(draggingTaskId || event.dataTransfer.getData("text/plain"), task.zone, task.id);
      });
      return article;
    };

    const renderBoard = () => {
      Object.entries(lists).forEach(([zone, list]) => {
        const zoneTasks = sortedTasks(zone);
        list.replaceChildren();
        document.querySelector(`[data-zone-count="${zone}"]`).textContent = zoneTasks.length;
        if (zoneTasks.length === 0) {
          const empty = document.createElement("p");
          empty.className = "task-empty-state";
          empty.textContent = zones[zone].empty;
          list.append(empty);
        } else {
          zoneTasks.forEach((task, index) => list.append(createTaskCard(task, index, zoneTasks)));
        }
      });
    };

    const reorderByDrop = (task, targetZone, beforeTaskId = null) => {
      const zoneTasks = sortedTasks(targetZone).filter((candidate) => candidate.id !== task.id);
      const targetIndex = beforeTaskId
        ? Math.max(
            0,
            zoneTasks.findIndex((candidate) => candidate.id === beforeTaskId)
          )
        : zoneTasks.length;
      zoneTasks.splice(targetIndex, 0, task);
      zoneTasks.forEach((candidate, index) => {
        candidate.position = index;
      });
    };

    const handleDrop = (taskId, targetZone, beforeTaskId = null) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task || !Object.prototype.hasOwnProperty.call(zones, targetZone)) return;
      if (task.id === beforeTaskId) return;
      const previousZone = task.zone;
      if (targetZone !== previousZone && targetZone !== zones[previousZone].next) {
        announce(
          `Ese movimiento no forma parte del ciclo. Desde ${zones[previousZone].label} la siguiente zona es ${zones[zones[previousZone].next].label}.`
        );
        return;
      }
      task.zone = targetZone;
      reorderByDrop(task, targetZone, beforeTaskId);
      if (previousZone !== targetZone) normalizePositions(previousZone);
      saveTasks();
      renderBoard();
      announce(
        previousZone === targetZone
          ? `“${task.title}” cambió de posición.`
          : `“${task.title}” se movió a ${zones[targetZone].label}.`
      );
    };

    Object.entries(lists).forEach(([zone, list]) => {
      list.addEventListener("dragover", (event) => {
        event.preventDefault();
        list.classList.add("is-drop-target");
      });
      list.addEventListener("dragleave", (event) => {
        if (!list.contains(event.relatedTarget)) list.classList.remove("is-drop-target");
      });
      list.addEventListener("drop", (event) => {
        event.preventDefault();
        list.classList.remove("is-drop-target");
        handleDrop(draggingTaskId || event.dataTransfer.getData("text/plain"), zone);
      });
    });

    editorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (savingTask) return;
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      if (!title) {
        editorError.textContent = "Escribe un título para la tarea.";
        titleInput.focus();
        return;
      }

      savingTask = true;
      editorSubmit.disabled = true;
      if (editingTaskId) {
        const task = tasks.find((candidate) => candidate.id === editingTaskId);
        if (task) {
          task.title = title;
          task.description = description;
          announce(`Se guardaron los cambios de “${task.title}”.`);
        }
      } else {
        tasks.push({
          id: `jose-tarea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title,
          description,
          zone: "available",
          position: sortedTasks("available").length,
          createdAt: new Date().toISOString(),
        });
        announce(`Se agregó “${title}” a Tareas disponibles.`);
      }
      saveTasks();
      renderBoard();
      closeDialog(editorDialog);
      editorForm.reset();
      editingTaskId = null;
      savingTask = false;
      editorSubmit.disabled = false;
    });

    deleteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const task = tasks.find((candidate) => candidate.id === deletingTaskId);
      if (!task) return;
      tasks = tasks.filter((candidate) => candidate.id !== deletingTaskId);
      normalizePositions(task.zone);
      saveTasks();
      renderBoard();
      closeDialog(deleteDialog);
      announce(`Se eliminó la tarea “${task.title}”.`);
      deletingTaskId = null;
    });

    newTaskButton.addEventListener("click", () => openEditor());
    closeEditorButton.addEventListener("click", () => {
      editingTaskId = null;
      editorError.textContent = "";
      closeDialog(editorDialog);
    });
    closeDeleteButton.addEventListener("click", () => {
      deletingTaskId = null;
      closeDialog(deleteDialog);
    });
    [editorDialog, deleteDialog].forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener("cancel", () => {
        editingTaskId = null;
        deletingTaskId = null;
      });
    });
    resetTasksButton.addEventListener("click", () => {
      if (!window.confirm("¿Deseas eliminar las tareas actuales y recuperar las cinco tareas iniciales?")) {
        return;
      }
      tasks = cloneInitialTasks();
      saveTasks();
      renderBoard();
      announce("El tablero se restableció con las cinco tareas iniciales.");
    });

    loadTasks();
    renderBoard();
    if (storageAvailable && !statusElement.textContent) {
      announce("Las tareas se guardan automáticamente en este dispositivo.");
    }
  }
})();
