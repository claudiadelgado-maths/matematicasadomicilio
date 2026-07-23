(() => {
  const randomInteger = (minimum, maximum) =>
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  const readInteger = (input) => {
    const value = input.value.trim();
    return /^-?\d+$/.test(value) ? Number.parseInt(value, 10) : null;
  };

  const displaySign = (sign) => (sign === "+" ? "+" : "−");

  document.querySelectorAll("[data-integer-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const startsNegative = input.value.trimStart().startsWith("-");
      const digits = input.value.replace(/\D/g, "");
      input.value = `${startsNegative ? "-" : ""}${digits}`;
    });
  });

  const resetFeedbackState = (element) => {
    element.classList.remove("is-correct", "is-incorrect", "is-error");
  };

  const showFeedback = (element, type, message) => {
    const symbol = type === "correct" ? "✓" : "✕";
    resetFeedbackState(element);
    element.classList.add("answer-feedback", `is-${type}`);
    element.replaceChildren();

    const symbolElement = document.createElement("span");
    symbolElement.className = "feedback-symbol";
    symbolElement.setAttribute("aria-hidden", "true");
    symbolElement.textContent = symbol;

    element.append(symbolElement, document.createTextNode(message));
  };

  const showFeedbackError = (element, message) => {
    resetFeedbackState(element);
    element.classList.add("answer-feedback", "is-error");
    element.textContent = message;
  };

  const clearFeedback = (element) => {
    resetFeedbackState(element);
    element.classList.add("answer-feedback");
    element.textContent = "";
  };

  const fractionExerciseForm = document.querySelector("#fraction-exercise-form");

  if (fractionExerciseForm) {
    const operations = [
      {
        symbol: "+",
        answer: ({ a, b, c, d }) => ({ numerator: a * d + b * c, denominator: b * d }),
      },
      {
        symbol: "−",
        answer: ({ a, b, c, d }) => ({ numerator: a * d - b * c, denominator: b * d }),
      },
      {
        symbol: "×",
        answer: ({ a, b, c, d }) => ({ numerator: a * c, denominator: b * d }),
      },
      {
        symbol: "÷",
        answer: ({ a, b, c, d }) => ({ numerator: a * d, denominator: b * c }),
      },
    ];

    const questionElements = {
      a: document.querySelector("[data-fraction-a-num]"),
      b: document.querySelector("[data-fraction-a-den]"),
      c: document.querySelector("[data-fraction-b-num]"),
      d: document.querySelector("[data-fraction-b-den]"),
      operation: document.querySelector("[data-fraction-operation]"),
    };
    const answerNumerator = document.querySelector("#fraction-answer-num");
    const answerDenominator = document.querySelector("#fraction-answer-den");
    const feedback = document.querySelector("#fraction-feedback");
    const newExerciseButton = document.querySelector("[data-new-fraction]");
    let currentQuestion;

    const createFractionExercise = (focusAnswer = false) => {
      currentQuestion = {
        a: randomInteger(1, 9),
        b: randomInteger(2, 9),
        c: randomInteger(1, 9),
        d: randomInteger(2, 9),
        operation: operations[randomInteger(0, operations.length - 1)],
      };

      questionElements.a.textContent = currentQuestion.a;
      questionElements.b.textContent = currentQuestion.b;
      questionElements.c.textContent = currentQuestion.c;
      questionElements.d.textContent = currentQuestion.d;
      questionElements.operation.textContent = currentQuestion.operation.symbol;
      answerNumerator.value = "";
      answerDenominator.value = "";
      clearFeedback(feedback);
      if (focusAnswer) answerNumerator.focus();
    };

    fractionExerciseForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const numerator = readInteger(answerNumerator);
      const denominator = readInteger(answerDenominator);

      if (numerator === null || denominator === null) {
        showFeedbackError(feedback, "Escribe números enteros en el numerador y el denominador.");
        return;
      }

      const correctAnswer = currentQuestion.operation.answer(currentQuestion);
      const isCorrect =
        numerator === correctAnswer.numerator && denominator === correctAnswer.denominator;

      if (isCorrect) {
        showFeedback(feedback, "correct", " ¡Correcto! Conservaste el resultado sin simplificar.");
      } else {
        showFeedback(
          feedback,
          "incorrect",
          " Revisa tu respuesta. Recuerda aplicar la fórmula directamente y no simplificar."
        );
      }
    });

    newExerciseButton.addEventListener("click", () => createFractionExercise(true));
    createFractionExercise();
  }

  const signExerciseForm = document.querySelector("#sign-exercise-form");

  if (signExerciseForm) {
    const signAElement = document.querySelector("[data-sign-a]");
    const signBElement = document.querySelector("[data-sign-b]");
    const feedback = document.querySelector("#sign-feedback");
    const newExerciseButton = document.querySelector("[data-new-sign]");
    let signA = "+";
    let signB = "-";

    const createSignExercise = () => {
      signA = Math.random() < 0.5 ? "+" : "-";
      signB = Math.random() < 0.5 ? "+" : "-";
      signAElement.textContent = displaySign(signA);
      signBElement.textContent = displaySign(signB);
      signExerciseForm.querySelectorAll('input[name="sign-answer"]').forEach((input) => {
        input.checked = false;
      });
      clearFeedback(feedback);
    };

    signExerciseForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selectedAnswer = signExerciseForm.querySelector('input[name="sign-answer"]:checked');

      if (!selectedAnswer) {
        showFeedbackError(feedback, "Selecciona Positivo (+) o Negativo (−) antes de entregar.");
        return;
      }

      const correctSign = signA === signB ? "+" : "-";
      if (selectedAnswer.value === correctSign) {
        showFeedback(feedback, "correct", " ¡Correcto! Aplicaste la ley de los signos.");
      } else {
        showFeedback(
          feedback,
          "incorrect",
          ` Revisa tu respuesta. Los signos son ${signA === signB ? "iguales" : "diferentes"}.`
        );
      }
    });

    newExerciseButton.addEventListener("click", createSignExercise);
    createSignExercise();
  }

  const fractionCalculatorForm = document.querySelector("#fraction-calculator-form");

  if (fractionCalculatorForm) {
    const inputs = {
      a: document.querySelector("#calc-a-num"),
      b: document.querySelector("#calc-a-den"),
      c: document.querySelector("#calc-b-num"),
      d: document.querySelector("#calc-b-den"),
    };
    const errorElement = document.querySelector("#fraction-calculator-error");
    const resultsContainer = document.querySelector("#fraction-calculator-results");
    const resultsGrid = document.querySelector("[data-fraction-results]");

    const resultCard = (title, lines, unavailable = false) => {
      const article = document.createElement("article");
      article.className = `calculation-result${unavailable ? " is-unavailable" : ""}`;

      const heading = document.createElement("h4");
      heading.textContent = title;
      article.append(heading);

      lines.forEach((line) => {
        const lineElement = document.createElement("span");
        lineElement.className = "calculation-line";
        lineElement.textContent = line;
        article.append(lineElement);
      });

      return article;
    };

    fractionCalculatorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = {
        a: readInteger(inputs.a),
        b: readInteger(inputs.b),
        c: readInteger(inputs.c),
        d: readInteger(inputs.d),
      };

      errorElement.textContent = "";

      if (Object.values(values).some((value) => value === null)) {
        resultsContainer.hidden = true;
        errorElement.textContent = "Completa los cuatro campos utilizando números enteros.";
        return;
      }

      if (values.b === 0 || values.d === 0) {
        resultsContainer.hidden = true;
        errorElement.textContent = "Los denominadores no pueden ser cero. Corrige las fracciones.";
        return;
      }

      const { a, b, c, d } = values;
      const ad = a * d;
      const bc = b * c;
      const ac = a * c;
      const bd = b * d;

      resultsGrid.replaceChildren(
        resultCard("Suma", [
          `${a}/${b} + ${c}/${d}`,
          `(${a} × ${d} + ${b} × ${c}) / (${b} × ${d})`,
          `(${ad} + ${bc}) / ${bd}`,
          `${ad + bc}/${bd}`,
        ]),
        resultCard("Resta", [
          `${a}/${b} − ${c}/${d}`,
          `(${a} × ${d} − ${b} × ${c}) / (${b} × ${d})`,
          `(${ad} − ${bc}) / ${bd}`,
          `${ad - bc}/${bd}`,
        ]),
        resultCard("Multiplicación", [
          `${a}/${b} × ${c}/${d}`,
          `(${a} × ${c}) / (${b} × ${d})`,
          `${ac}/${bd}`,
        ]),
        c === 0
          ? resultCard(
              "División",
              [
                `${a}/${b} ÷ ${c}/${d}`,
                `No puede realizarse porque la segunda fracción tiene numerador cero y no posee un recíproco válido.`,
              ],
              true
            )
          : resultCard("División", [
              `${a}/${b} ÷ ${c}/${d}`,
              `${a}/${b} × ${d}/${c}`,
              `(${a} × ${d}) / (${b} × ${c})`,
              `${ad}/${bc}`,
            ])
      );

      resultsContainer.hidden = false;
    });

    fractionCalculatorForm.addEventListener("reset", () => {
      window.setTimeout(() => {
        errorElement.textContent = "";
        resultsGrid.replaceChildren();
        resultsContainer.hidden = true;
        inputs.a.focus();
      }, 0);
    });
  }

  const signCalculatorForm = document.querySelector("#sign-calculator-form");

  if (signCalculatorForm) {
    const signAInput = document.querySelector("#calc-sign-a");
    const signBInput = document.querySelector("#calc-sign-b");
    const resultContainer = document.querySelector("#sign-calculator-result");
    const resultSign = document.querySelector("[data-calculated-sign]");
    const equation = document.querySelector("[data-sign-equation]");
    const explanation = document.querySelector("[data-sign-explanation]");

    signCalculatorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const signA = signAInput.value;
      const signB = signBInput.value;
      const result = signA === signB ? "+" : "-";
      const areEqual = signA === signB;

      resultSign.textContent = displaySign(result);
      resultSign.className = `result-sign is-${result === "+" ? "positive" : "negative"}`;
      equation.textContent = `(${displaySign(signA)}) × (${displaySign(signB)}) = (${displaySign(result)})`;
      explanation.textContent = `Los signos son ${areEqual ? "iguales" : "diferentes"}, por eso el resultado es ${result === "+" ? "positivo" : "negativo"}.`;
      resultContainer.hidden = false;
    });
  }

  const signGame = document.querySelector("#sign-game");

  if (signGame) {
    const scoreElement = signGame.querySelector("[data-game-score]");
    const stateElement = signGame.querySelector("[data-game-state]");
    const feedback = signGame.querySelector("[data-game-feedback]");
    const startButton = signGame.querySelector("[data-game-start]");
    const restartButton = signGame.querySelector("[data-game-restart]");
    const choiceButtons = Array.from(signGame.querySelectorAll("[data-game-choice]"));
    const signElements = {
      visitor: signGame.querySelector("[data-visitor-sign]"),
      door: signGame.querySelector("[data-door-sign]"),
      guard: signGame.querySelector("[data-guard-sign]"),
    };
    let signs = { visitor: "+", door: "-", guard: "-" };
    let score = 0;
    let active = false;
    let roundLocked = true;
    let nextRoundTimer;

    const setSign = (element, sign) => {
      element.textContent = displaySign(sign);
      element.className = `game-sign is-${sign === "+" ? "positive" : "negative"}`;
      element.setAttribute("aria-label", `Signo ${sign === "+" ? "positivo" : "negativo"}`);
    };

    const setChoicesDisabled = (disabled) => {
      choiceButtons.forEach((button) => {
        button.disabled = disabled;
      });
    };

    const createRound = () => {
      signs = {
        visitor: Math.random() < 0.5 ? "+" : "-",
        door: Math.random() < 0.5 ? "+" : "-",
        guard: Math.random() < 0.5 ? "+" : "-",
      };

      setSign(signElements.visitor, signs.visitor);
      setSign(signElements.door, signs.door);
      setSign(signElements.guard, signs.guard);
      clearFeedback(feedback);
      roundLocked = false;
      setChoicesDisabled(false);
      stateElement.textContent = "¿El visitante puede pasar?";
    };

    const startGame = () => {
      window.clearTimeout(nextRoundTimer);
      score = 0;
      active = true;
      scoreElement.textContent = score;
      startButton.hidden = true;
      restartButton.hidden = true;
      createRound();
    };

    const finishGame = (resultSign, shouldPass) => {
      active = false;
      roundLocked = true;
      setChoicesDisabled(true);
      restartButton.hidden = false;
      const scoreMessage = `Lograste ${score} ${score === 1 ? "acierto" : "aciertos"}.`;
      stateElement.textContent = "Fin de la partida";
      showFeedback(
        feedback,
        "incorrect",
        ` Fin de la partida. ${displaySign(signs.visitor)} × ${displaySign(signs.door)} = ${displaySign(resultSign)}; por eso el visitante ${shouldPass ? "sí podía pasar" : "no podía pasar"}. ${scoreMessage}`
      );
    };

    const answerRound = (choice) => {
      if (!active || roundLocked) return;

      roundLocked = true;
      setChoicesDisabled(true);
      const resultSign = signs.visitor === signs.door ? "+" : "-";
      const shouldPass = resultSign === signs.guard;
      const playerSaysPass = choice === "pass";

      if (playerSaysPass === shouldPass) {
        score += 1;
        scoreElement.textContent = score;
        stateElement.textContent = "¡Correcto! Preparando la siguiente ronda…";
        showFeedback(
          feedback,
          "correct",
          ` ¡Correcto! ${displaySign(signs.visitor)} × ${displaySign(signs.door)} = ${displaySign(resultSign)}.`
        );
        nextRoundTimer = window.setTimeout(() => {
          if (active) createRound();
        }, 900);
      } else {
        finishGame(resultSign, shouldPass);
      }
    };

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);
    choiceButtons.forEach((button) => {
      button.addEventListener("click", () => answerRound(button.dataset.gameChoice));
    });
    setChoicesDisabled(true);
  }
})();
