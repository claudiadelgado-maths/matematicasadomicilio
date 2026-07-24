(() => {
  const iniciar = async () => {
    const signsMath = await import("../../signos.mjs");
    const signGame = document.querySelector("#sign-game");
    const scoreElement = signGame.querySelector("[data-game-score]");
    const stateElement = signGame.querySelector("[data-game-state]");
    const feedback = signGame.querySelector("[data-game-feedback]");
    const startButton = signGame.querySelector("[data-game-start]");
    const restartButton = signGame.querySelector("[data-game-restart]");
    const choiceButtons = Array.from(signGame.querySelectorAll("[data-game-choice]"));
    const operationElement = signGame.querySelector("[data-game-operation]");
    const signElements = {
      visitor: signGame.querySelector("[data-visitor-sign]"),
      door: signGame.querySelector("[data-door-sign]"),
      guard: signGame.querySelector("[data-guard-sign]"),
    };
    let signs = { visitor: 1, door: -1, guard: -1 };
    let operation = "multiply";
    let score = 0;
    let active = false;
    let roundLocked = true;
    let nextRoundTimer;

    const signSymbol = (value) => (value > 0 ? "+" : "−");

    const setSign = (element, value) => {
      const positive = value > 0;
      element.textContent = signSymbol(value);
      element.className = `game-sign is-${positive ? "positive" : "negative"}`;
      element.setAttribute("aria-label", `Signo ${positive ? "positivo" : "negativo"}`);
    };

    const setChoicesDisabled = (disabled) => {
      choiceButtons.forEach((button) => {
        button.disabled = disabled;
      });
    };

    const clearFeedback = () => {
      feedback.className = "answer-feedback game-feedback";
      feedback.replaceChildren();
    };

    const showFeedback = (type, title, explanation, resultSign) => {
      feedback.className = `answer-feedback game-feedback is-${type}`;
      feedback.replaceChildren();
      const heading = document.createElement("strong");
      heading.textContent = title;
      const equation = document.createElement("div");
      signsMath.renderizarMatematica(
        equation,
        `${signSymbol(signs.visitor)}${signsMath.simboloOperacion(operation)}${signSymbol(signs.door)}=${signSymbol(resultSign)}`,
        { display: true },
      );
      const paragraph = document.createElement("p");
      paragraph.textContent = explanation;
      feedback.append(heading, equation, paragraph);
    };

    const createRound = () => {
      signs = {
        visitor: Math.random() < 0.5 ? 1 : -1,
        door: Math.random() < 0.5 ? 1 : -1,
        guard: Math.random() < 0.5 ? 1 : -1,
      };
      operation = Math.random() < 0.5 ? "multiply" : "divide";
      setSign(signElements.visitor, signs.visitor);
      setSign(signElements.door, signs.door);
      setSign(signElements.guard, signs.guard);
      operationElement.textContent = operation === "multiply" ? "×" : "÷";
      operationElement.setAttribute("aria-label", operation === "multiply" ? "multiplicado por" : "dividido entre");
      clearFeedback();
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
      choiceButtons[0].focus();
    };

    const answerRound = (choice) => {
      if (!active || roundLocked) return;
      roundLocked = true;
      setChoicesDisabled(true);
      const resultSign = signs.visitor === signs.door ? 1 : -1;
      const shouldPass = resultSign === signs.guard;
      const correct = (choice === "pass") === shouldPass;
      const rule = `Los signos son ${signs.visitor === signs.door ? "iguales" : "diferentes"}; el resultado es ${resultSign > 0 ? "positivo" : "negativo"}.`;

      if (correct) {
        score += 1;
        scoreElement.textContent = score;
        stateElement.textContent = "¡Correcto! Preparando la siguiente ronda…";
        showFeedback("correct", "¡Decisión correcta!", `${rule} El signo del guardia ${shouldPass ? "coincide" : "no coincide"}.`, resultSign);
        nextRoundTimer = window.setTimeout(() => {
          if (active) createRound();
        }, 1100);
        return;
      }

      active = false;
      restartButton.hidden = false;
      const scoreMessage = `Lograste ${score} ${score === 1 ? "acierto" : "aciertos"}.`;
      stateElement.textContent = "Fin de la partida";
      showFeedback("incorrect", "Fin de la partida", `${rule} Por eso el visitante ${shouldPass ? "sí podía pasar" : "no podía pasar"}. ${scoreMessage}`, resultSign);
      restartButton.focus();
    };

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);
    choiceButtons.forEach((button) => {
      button.addEventListener("click", () => answerRound(button.dataset.gameChoice));
    });
    setChoicesDisabled(true);
  };

  iniciar().catch((error) => {
    const feedback = document.querySelector("[data-game-feedback]");
    if (feedback) feedback.textContent = "No fue posible iniciar el juego. Recarga la página.";
    console.error(error);
  });
})();
