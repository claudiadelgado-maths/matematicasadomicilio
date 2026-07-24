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
})();
