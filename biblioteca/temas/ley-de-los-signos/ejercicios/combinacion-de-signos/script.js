(() => {
  const iniciar = async () => {
    const signs = await import("../../signos.mjs");
    const form = document.querySelector("#sign-exercise-form");
    const questionElement = document.querySelector("[data-question]");
    const feedback = document.querySelector("[data-feedback]");
    let question;

    const signedValue = (absoluteValue) =>
      (Math.random() < 0.5 ? 1 : -1) * absoluteValue;

    const createQuestion = () => {
      const operation = Math.random() < 0.5 ? "multiply" : "divide";
      const zeroRound = signs.enteroAleatorio(1, 8) === 1;
      let first;
      let second;
      if (operation === "divide") {
        const divisor = signedValue(signs.enteroAleatorio(1, 10));
        const quotient = zeroRound ? 0 : signedValue(signs.enteroAleatorio(1, 10));
        first = divisor * quotient;
        second = divisor;
      } else {
        first = zeroRound ? 0 : signedValue(signs.enteroAleatorio(1, 12));
        second = signedValue(signs.enteroAleatorio(1, 12));
      }
      const result = signs.operar(first, second, operation);
      question = { first, second, operation, result };
      const latex = `${signs.numeroLatex(first)}${signs.simboloOperacion(operation)}${signs.numeroLatex(second)}=?`;
      signs.renderizarMatematica(questionElement, latex, { display: true });
      form.reset();
      feedback.className = "sign-feedback";
      feedback.replaceChildren();
    };

    const addMathStep = (list, latex, text) => {
      const item = document.createElement("li");
      const mathElement = document.createElement("span");
      signs.renderizarMatematica(mathElement, latex);
      item.append(mathElement, document.createTextNode(` ${text}`));
      list.append(item);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const answer = form.querySelector('input[name="sign-answer"]:checked');
      if (!answer) {
        feedback.className = "sign-feedback is-error";
        feedback.textContent = "Selecciona Positivo, Negativo o Cero antes de comprobar.";
        return;
      }
      const correctSign = signs.signoDeNumero(question.result);
      const correct = answer.value === correctSign;
      feedback.className = `sign-feedback is-${correct ? "correct" : "incorrect"}`;
      feedback.replaceChildren();
      const heading = document.createElement("strong");
      heading.textContent = correct ? "¡Correcto! Identificaste el signo." : "Revisa la relación entre los signos.";
      const steps = document.createElement("ol");
      steps.className = "sign-feedback-steps";
      addMathStep(steps, `${signs.signoLatex(signs.signoDeNumero(question.first))}${signs.simboloOperacion(question.operation)}${signs.signoLatex(signs.signoDeNumero(question.second))}=${signs.signoLatex(correctSign)}`, signs.descripcionRegla(question.first, question.second));
      addMathStep(steps, `${Math.abs(question.first)}${signs.simboloOperacion(question.operation)}${Math.abs(question.second)}=${Math.abs(question.result)}`, "Operación con valores absolutos.");
      addMathStep(steps, `${signs.numeroLatex(question.first)}${signs.simboloOperacion(question.operation)}${signs.numeroLatex(question.second)}=${question.result}`, "Resultado completo.");
      feedback.append(heading, steps);
    });

    document.querySelector("[data-new-sign]").addEventListener("click", () => {
      createQuestion();
      form.querySelector('input[name="sign-answer"]')?.focus();
    });
    createQuestion();
  };

  iniciar().catch((error) => {
    const feedback = document.querySelector("[data-feedback]");
    if (feedback) feedback.textContent = "No fue posible iniciar el ejercicio. Recarga la página.";
    console.error(error);
  });
})();
