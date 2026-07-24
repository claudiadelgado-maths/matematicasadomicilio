(() => {
  const iniciar = async () => {
    const signs = await import("../../signos.mjs");
    const form = document.querySelector("#sign-calculator-form");
    const errorElement = document.querySelector("[data-error]");
    const procedure = document.querySelector("[data-procedure]");
    const steps = document.querySelector("[data-procedure-steps]");

    document.querySelectorAll("[data-integer-input]").forEach((input) => {
      input.addEventListener("input", () => {
        const negative = input.value.trimStart().startsWith("-");
        input.value = `${negative ? "-" : ""}${input.value.replace(/\D/g, "")}`;
      });
    });

    const addStep = (label, latex, explanation = "", final = false) => {
      const article = document.createElement("article");
      article.className = `sign-procedure-step${final ? " is-final" : ""}`;
      const heading = document.createElement("strong");
      heading.textContent = label;
      const content = document.createElement("div");
      const expression = document.createElement("div");
      signs.renderizarMatematica(expression, latex, { display: true });
      content.append(expression);
      if (explanation) {
        const paragraph = document.createElement("p");
        paragraph.textContent = explanation;
        content.append(paragraph);
      }
      article.append(heading, content);
      steps.append(article);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      errorElement.className = "sign-feedback calculator-message";
      errorElement.replaceChildren();
      procedure.hidden = true;
      steps.replaceChildren();
      const first = signs.leerEntero(form.elements.first);
      const second = signs.leerEntero(form.elements.second);
      const operation = form.elements.operation.value;
      if (first === null || second === null) {
        errorElement.className = "sign-feedback is-error calculator-message";
        errorElement.textContent = "Escribe dos números enteros válidos.";
        return;
      }
      if (Math.abs(first) > 1000000 || Math.abs(second) > 1000000) {
        errorElement.className = "sign-feedback is-error calculator-message";
        errorElement.textContent = "Usa enteros entre −1 000 000 y 1 000 000.";
        return;
      }
      if (operation === "divide" && second === 0) {
        errorElement.className = "sign-feedback is-error calculator-message";
        errorElement.textContent = "No se puede dividir entre cero. Cambia el segundo número.";
        return;
      }
      const result = signs.operar(first, second, operation);
      const resultSign = signs.signoDeNumero(result);
      const symbol = signs.simboloOperacion(operation);
      addStep("1 · Operación", `${signs.numeroLatex(first)}${symbol}${signs.numeroLatex(second)}`);
      addStep("2 · Signos", `${signs.signoLatex(signs.signoDeNumero(first))}${symbol}${signs.signoLatex(signs.signoDeNumero(second))}=${signs.signoLatex(resultSign)}`, signs.descripcionRegla(first, second));
      addStep("3 · Valores absolutos", `${Math.abs(first)}${symbol}${Math.abs(second)}=${Math.abs(result)}`, "Se calcula el tamaño del resultado sin atender todavía al signo.");
      addStep("4 · Signo final", `\\text{Signo: }${signs.signoLatex(resultSign)}`, resultSign === "zero" ? "El resultado es cero." : `El resultado debe ser ${resultSign === "positive" ? "positivo" : "negativo"}.`);
      addStep("5 · Resultado", `${signs.numeroLatex(first)}${symbol}${signs.numeroLatex(second)}=${result}`, "Operación completa.", true);
      procedure.hidden = false;
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        errorElement.className = "sign-feedback calculator-message";
        errorElement.replaceChildren();
        steps.replaceChildren();
        procedure.hidden = true;
        form.elements.first.focus();
      }, 0);
    });
  };

  iniciar().catch((error) => {
    const errorElement = document.querySelector("[data-error]");
    if (errorElement) errorElement.textContent = "No fue posible iniciar la calculadora. Recarga la página.";
    console.error(error);
  });
})();
