(() => {
  const iniciar = async () => {
    const math = await import("../../matematicas.mjs");
    const operations = ["add", "subtract", "multiply", "divide"];
    const placements = ["positive", "external-negative", "negative-numerator", "negative-denominator", "double-negative"];

    document.querySelectorAll("[data-integer-input]").forEach((input) => {
      input.addEventListener("input", () => {
        const negative = input.value.trimStart().startsWith("-");
        input.value = `${negative ? "-" : ""}${input.value.replace(/\D/g, "")}`;
      });
    });
    document.querySelectorAll("[data-nonnegative-input]").forEach((input) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
      });
    });

    const positiveOperand = () => ({
      numerator: math.enteroAleatorio(1, 9),
      denominator: math.enteroAleatorio(2, 12),
      placement: "positive",
    });

    const signedOperand = () => {
      const placement = placements[math.enteroAleatorio(0, placements.length - 1)];
      const displayNumerator = math.enteroAleatorio(1, 9);
      const denominator = math.enteroAleatorio(2, 12);
      const negative = ["external-negative", "negative-numerator", "negative-denominator"].includes(placement);
      return { numerator: negative ? -displayNumerator : displayNumerator, denominator, displayNumerator, placement };
    };

    const createQuestion = (level) => {
      const operation = operations[math.enteroAleatorio(0, operations.length - 1)];
      let first = level === "signed" ? signedOperand() : positiveOperand();
      let second = level === "signed" ? signedOperand() : positiveOperand();
      if (level === "simplified") {
        const special = math.enteroAleatorio(1, 5);
        if (special === 1) second = { ...first };
        if (special === 2) {
          first = { numerator: math.enteroAleatorio(2, 7), denominator: 3, placement: "positive" };
          second = { numerator: 1, denominator: 3, placement: "positive" };
        }
      }
      const raw = math.operarFraccionesSinSimplificar(first, second, operation);
      const simplified = math.simplificarFraccion(raw);
      const presented = (operand) => level === "signed"
        ? math.fraccionPresentadaLatex({ numerator: operand.displayNumerator, denominator: operand.denominator, placement: operand.placement })
        : math.fraccionLatex(operand, { forceFraction: true });
      const firstLatex = presented(first);
      const secondLatex = presented(second);
      return { operation, first, second, raw, simplified, original: `${firstLatex}${math.simboloOperacion(operation)}${secondLatex}` };
    };

    const generalFormula = (operation) => {
      if (operation === "add") return "\\frac ab+\\frac cd=\\frac{ad+bc}{bd}";
      if (operation === "subtract") return "\\frac ab-\\frac cd=\\frac{ad-bc}{bd}";
      if (operation === "multiply") return "\\frac ab\\cdot\\frac cd=\\frac{ac}{bd}";
      return "\\frac ab\\div\\frac cd=\\frac ab\\cdot\\frac dc=\\frac{ad}{bc}";
    };

    const appendMathItem = (list, latex, text) => {
      const item = document.createElement("li");
      const expression = document.createElement("span");
      math.renderizarMatematica(expression, latex);
      item.append(expression, document.createTextNode(` ${text}`));
      list.append(item);
    };

    const showFeedback = (section, question, status, message) => {
      const feedback = section.querySelector("[data-feedback]");
      feedback.className = `fraction-feedback is-${status}`;
      feedback.replaceChildren();
      const heading = document.createElement("strong");
      heading.textContent = message;
      const procedure = document.createElement("ol");
      procedure.className = "feedback-procedure";
      appendMathItem(procedure, question.original, "Operación original.");
      appendMathItem(procedure, generalFormula(question.operation), "Regla general.");
      appendMathItem(procedure, `\\frac{${question.raw.numerator}}{${question.raw.denominator}}`, "Resultado directo.");
      const divisor = math.maximoComunDivisor(question.raw.numerator, question.raw.denominator);
      appendMathItem(procedure, `\\operatorname{MCD}(${Math.abs(question.raw.numerator)},${question.raw.denominator})=${divisor}`, "Factor común máximo.");
      appendMathItem(procedure, math.fraccionLatex(question.simplified), "Forma simplificada y normalizada.");
      feedback.append(heading, procedure);
    };

    const initializeLevel = (section) => {
      const level = section.dataset.exerciseLevel;
      const form = section.querySelector("form");
      const numeratorInput = form.elements.numerator;
      const denominatorInput = form.elements.denominator;
      let question;

      const newQuestion = () => {
        question = createQuestion(level);
        math.renderizarMatematica(section.querySelector("[data-question]"), question.original, { display: true });
        form.reset();
        const feedback = section.querySelector("[data-feedback]");
        feedback.className = "fraction-feedback";
        feedback.replaceChildren();
      };

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const numerator = math.leerEntero(numeratorInput, { nonNegative: level === "signed" });
        const denominator = math.leerEntero(denominatorInput, { positive: true });
        if (numerator === null || denominator === null) {
          showFeedback(section, question, "error", "Escribe números enteros válidos y un denominador mayor que cero.");
          return;
        }
        if (level === "raw") {
          const correct = numerator === question.raw.numerator && denominator === question.raw.denominator;
          showFeedback(section, question, correct ? "correct" : "incorrect", correct ? "¡Correcto! Conservaste el resultado directo." : "Todavía no coincide con el resultado directo de la fórmula.");
          return;
        }
        const answer = level === "signed"
          ? math.fraccionDesdeCampos({ sign: form.elements.sign.value, numerator, denominator })
          : { numerator, denominator };
        const targetSign = math.signoDeFraccion(question.simplified);
        const signIsExact = level !== "signed" || (
          form.elements.sign.value === targetSign &&
          numerator === Math.abs(question.simplified.numerator)
        );
        const exact = signIsExact &&
          answer.numerator === question.simplified.numerator &&
          answer.denominator === question.simplified.denominator;
        const equivalent = math.sonEquivalentes(answer, question.simplified);
        const message = exact ? "¡Correcto! El resultado está simplificado y normalizado." : equivalent ? "El valor es equivalente, pero falta simplificar o normalizar la escritura." : "La respuesta aún no representa el resultado de la operación.";
        showFeedback(section, question, exact ? "correct" : "incorrect", message);
      });

      section.querySelector("[data-new-question]").addEventListener("click", () => {
        newQuestion();
        numeratorInput.focus();
      });
      newQuestion();
    };

    document.querySelectorAll("[data-exercise-level]").forEach(initializeLevel);
  };

  iniciar().catch((error) => {
    document.querySelectorAll("[data-feedback]").forEach((feedback) => {
      feedback.className = "fraction-feedback is-error";
      feedback.textContent = "No fue posible iniciar los ejercicios. Recarga la página.";
    });
    console.error(error);
  });
})();
