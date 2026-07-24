(() => {
  const iniciar = async () => {
    const math = await import("../../matematicas.mjs");
    const form = document.querySelector("#fraction-calculator-form");
    const errorElement = document.querySelector("[data-calculator-error]");
    const procedure = document.querySelector("[data-calculator-procedure]");
    const grid = document.querySelector("[data-procedure-grid]");

    document.querySelectorAll("[data-integer-input]").forEach((input) => {
      input.addEventListener("input", () => {
        const negative = input.value.trimStart().startsWith("-");
        input.value = `${negative ? "-" : ""}${input.value.replace(/\D/g, "")}`;
      });
    });

    const enteredLatex = (sign, numerator, denominator) => {
      const fraction = `\\frac{${numerator}}{${denominator}}`;
      return sign === "negative" ? `-\\left(${fraction}\\right)` : fraction;
    };

    const formulaFor = (operation) => {
      if (operation === "add") return "\\frac ab+\\frac cd=\\frac{ad+bc}{bd}";
      if (operation === "subtract") return "\\frac ab-\\frac cd=\\frac{ad-bc}{bd}";
      if (operation === "multiply") return "\\frac ab\\cdot\\frac cd=\\frac{ac}{bd}";
      return "\\dfrac{\\frac ab}{\\frac cd}=\\frac ab\\div\\frac cd=\\frac ab\\cdot\\frac dc";
    };

    const rawWithMethod = (first, second, operation) => {
      if (operation === "add" || operation === "subtract") {
        const common = math.minimoComunMultiplo(first.denominator, second.denominator);
        const firstScaled = first.numerator * (common / first.denominator);
        const secondScaled = second.numerator * (common / second.denominator);
        return {
          raw: { numerator: firstScaled + (operation === "add" ? secondScaled : -secondScaled), denominator: common },
          transformation: `\\frac{${firstScaled}}{${common}}${math.simboloOperacion(operation)}\\frac{${secondScaled}}{${common}}`,
          method: `\\operatorname{mcm}(${first.denominator},${second.denominator})=${common}`,
        };
      }
      if (operation === "multiply") {
        return {
          raw: math.operarFraccionesSinSimplificar(first, second, operation),
          transformation: `${math.fraccionLatex(first, { forceFraction: true })}\\cdot${math.fraccionLatex(second, { forceFraction: true })}`,
          method: "\\text{Multiplicamos numeradores y denominadores.}",
        };
      }
      return {
        raw: math.operarFraccionesSinSimplificar(first, second, operation),
        transformation: `${math.fraccionLatex(first, { forceFraction: true })}\\cdot\\frac{${second.denominator}}{${second.numerator}}`,
        method: "\\text{Multiplicamos por el recíproco de la segunda fracción.}",
      };
    };

    const addStep = (label, latex, explanation = "", final = false) => {
      const article = document.createElement("article");
      article.className = `procedure-step${final ? " final-result-card" : ""}`;
      const labelElement = document.createElement("div");
      labelElement.className = "procedure-step-label";
      labelElement.textContent = label;
      const content = document.createElement("div");
      content.className = "procedure-step-content";
      const expression = document.createElement("div");
      math.renderizarMatematica(expression, latex, { display: true });
      content.append(expression);
      if (explanation) {
        const paragraph = document.createElement("p");
        paragraph.textContent = explanation;
        content.append(paragraph);
      }
      article.append(labelElement, content);
      grid.append(article);
    };

    const readFraction = (prefix) => {
      const sign = form.elements[`${prefix}-sign`].value;
      const numerator = math.leerEntero(form.elements[`${prefix}-numerator`]);
      const denominator = math.leerEntero(form.elements[`${prefix}-denominator`]);
      if (numerator === null || denominator === null) return null;
      if (denominator === 0 || Math.abs(numerator) > 9999 || Math.abs(denominator) > 9999) return null;
      const multiplier = sign === "negative" ? -1 : 1;
      return {
        entered: enteredLatex(sign, numerator, denominator),
        normalized: math.normalizarFraccion(multiplier * numerator, denominator),
      };
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      errorElement.textContent = "";
      procedure.hidden = true;
      grid.replaceChildren();
      const firstInput = readFraction("first");
      const secondInput = readFraction("second");
      const operation = form.elements.operation.value;
      if (!firstInput || !secondInput) {
        errorElement.textContent = "Revisa los campos: usa enteros entre −9999 y 9999 y denominadores distintos de cero.";
        return;
      }
      if (operation === "divide" && secondInput.normalized.numerator === 0) {
        errorElement.textContent = "No se puede dividir entre cero: la segunda fracción debe tener numerador distinto de cero.";
        return;
      }

      const first = firstInput.normalized;
      const second = secondInput.normalized;
      const method = rawWithMethod(first, second, operation);
      const simplified = math.simplificarFraccion(method.raw);
      const gcd = math.maximoComunDivisor(method.raw.numerator, method.raw.denominator);
      const decimal = math.descripcionDecimal(simplified);
      const symbol = math.simboloOperacion(operation);

      addStep("1 · Entrada", `${firstInput.entered}${symbol}${secondInput.entered}`, "La operación tal como fue escrita.");
      addStep("2 · Normalización", `${math.fraccionLatex(first, { forceFraction: true })}${symbol}${math.fraccionLatex(second, { forceFraction: true })}`, "Se resuelven signos dobles y se dejan denominadores positivos.");
      addStep("3 · Regla general", formulaFor(operation));
      addStep("4 · Método", method.method);
      addStep("5 · Sustitución", method.transformation);
      addStep("6 · Resultado directo", `\\frac{${method.raw.numerator}}{${method.raw.denominator}}`, "Aún no se simplifica.");
      addStep("7 · Factores", `${method.raw.numerator}=${math.factoresLatex(method.raw.numerator)},\\qquad${method.raw.denominator}=${math.factoresLatex(method.raw.denominator)}`);
      addStep("8 · MCD", `\\operatorname{MCD}(${Math.abs(method.raw.numerator)},${method.raw.denominator})=${gcd}`);
      addStep("9 · Simplificación", `\\frac{${method.raw.numerator}\\div${gcd}}{${method.raw.denominator}\\div${gcd}}=${math.fraccionLatex(simplified)}`);
      addStep("10 · Resultado", math.fraccionLatex(simplified), simplified.denominator === 1 ? "El denominador es 1, por eso se presenta como entero." : "Fracción irreducible con denominador positivo.", true);
      addStep("11 · Decimal", `${decimal.text}`, decimal.exact ? "Expresión decimal exacta." : "Aproximación de un decimal periódico.");
      procedure.hidden = false;
      procedure.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        errorElement.textContent = "";
        grid.replaceChildren();
        procedure.hidden = true;
        form.elements["first-numerator"].focus();
      }, 0);
    });
  };

  iniciar().catch((error) => {
    const errorElement = document.querySelector("[data-calculator-error]");
    if (errorElement) errorElement.textContent = "No fue posible iniciar la calculadora. Recarga la página.";
    console.error(error);
  });
})();
