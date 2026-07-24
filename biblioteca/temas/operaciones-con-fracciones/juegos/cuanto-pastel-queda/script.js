(() => {
  const iniciar = async () => {
    const [math, pie] = await Promise.all([import("../../matematicas.mjs"), import("../../pastel.mjs")]);
    const svg = document.querySelector("[data-pie]");
    const form = document.querySelector("[data-game-form]");
    const feedback = document.querySelector("[data-feedback]");
    let round;

    document.querySelectorAll("[data-number-input]").forEach((input) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
      });
    });

    const newRound = () => {
      const total = math.enteroAleatorio(1, 12);
      const remaining = math.enteroAleatorio(0, total);
      round = { total, remaining };
      const selected = new Set(Array.from({ length: remaining }, (_, index) => index));
      pie.renderizarPastel(svg, {
        total,
        selected,
        label: `Pastel dividido en ${total} partes iguales; ${remaining} ${remaining === 1 ? "parte azul representa" : "partes azules representan"} lo que queda`,
      });
      form.reset();
      feedback.className = "fraction-feedback";
      feedback.replaceChildren();
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const remaining = math.leerEntero(form.elements.remaining, { nonNegative: true });
      const total = math.leerEntero(form.elements.total, { positive: true });
      if (remaining === null || total === null) {
        feedback.className = "fraction-feedback is-error";
        feedback.textContent = "Escribe dos números enteros: las partes que quedan y el total de partes.";
        return;
      }
      const correct = math.sonEquivalentes({ numerator: remaining, denominator: total }, { numerator: round.remaining, denominator: round.total });
      const simplified = math.simplificarFraccion({ numerator: round.remaining, denominator: round.total });
      feedback.className = `fraction-feedback is-${correct ? "correct" : "incorrect"}`;
      feedback.replaceChildren();
      const message = document.createElement("strong");
      message.textContent = correct ? "¡Correcto! Tu fracción representa la parte azul." : "Aún no. Cuenta de nuevo las partes azules y el total.";
      const result = document.createElement("div");
      math.renderizarMatematica(result, `\\frac{${round.remaining}}{${round.total}}=${math.fraccionLatex(simplified)}`, { display: true });
      feedback.append(message, result);
    });

    document.querySelector("[data-new-round]").addEventListener("click", () => {
      newRound();
      form.elements.remaining.focus();
    });
    newRound();
  };

  iniciar().catch((error) => {
    const feedback = document.querySelector("[data-feedback]");
    if (feedback) feedback.textContent = "No fue posible iniciar el juego. Recarga la página.";
    console.error(error);
  });
})();
