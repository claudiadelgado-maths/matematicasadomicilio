(() => {
  const iniciar = async () => {
    const [math, pie] = await Promise.all([import("../../matematicas.mjs"), import("../../pastel.mjs")]);
    const svg = document.querySelector("[data-pie]");
    const targetMath = document.querySelector("[data-target-math]");
    const targetWords = document.querySelector("[data-target-words]");
    const status = document.querySelector("[data-selection-status]");
    const feedback = document.querySelector("[data-feedback]");
    let round;
    let selected = new Set();

    const render = () => {
      pie.renderizarPastel(svg, {
        total: round.denominator,
        selected,
        interactive: true,
        onToggle: (index) => {
          if (selected.has(index)) selected.delete(index);
          else selected.add(index);
          feedback.className = "fraction-feedback";
          feedback.replaceChildren();
          render();
          svg.querySelector(`[data-sector="${index}"]`)?.focus();
        },
        label: `Pastel interactivo dividido en ${round.denominator} partes iguales`,
      });
      status.textContent = `${selected.size} de ${round.denominator} partes seleccionadas.`;
    };

    const newRound = () => {
      const denominator = math.enteroAleatorio(1, 12);
      const numerator = math.enteroAleatorio(1, denominator);
      round = { numerator, denominator };
      selected = new Set();
      math.renderizarMatematica(targetMath, `\\frac{${numerator}}{${denominator}}`, { display: true });
      targetWords.textContent = `${numerator} de ${denominator} ${denominator === 1 ? "parte" : "partes"}`;
      feedback.className = "fraction-feedback";
      feedback.replaceChildren();
      render();
    };

    document.querySelector("[data-check]").addEventListener("click", () => {
      const correct = selected.size === round.numerator;
      feedback.className = `fraction-feedback is-${correct ? "correct" : "incorrect"}`;
      feedback.textContent = correct
        ? `¡Correcto! Seleccionaste ${round.numerator} de ${round.denominator} partes.`
        : `Seleccionaste ${selected.size}; necesitas seleccionar exactamente ${round.numerator}.`;
    });
    document.querySelector("[data-clear]").addEventListener("click", () => {
      selected = new Set();
      feedback.className = "fraction-feedback";
      feedback.replaceChildren();
      render();
      svg.querySelector("[data-sector]")?.focus();
    });
    document.querySelector("[data-new-round]").addEventListener("click", newRound);
    newRound();
  };

  iniciar().catch((error) => {
    const feedback = document.querySelector("[data-feedback]");
    if (feedback) feedback.textContent = "No fue posible iniciar el juego. Recarga la página.";
    console.error(error);
  });
})();
