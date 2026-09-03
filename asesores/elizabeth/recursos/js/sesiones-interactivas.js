(() => {
  const fitFormula = (formula) => {
    const katex = formula.querySelector(".katex-display > .katex");
    if (!katex || formula.clientWidth === 0) return;

    formula.style.setProperty("--formula-fit", "1");
    const availableWidth = Math.max(formula.clientWidth - 4, 1);
    const naturalWidth = katex.getBoundingClientRect().width;
    const scale = naturalWidth > availableWidth ? availableWidth / naturalWidth : 1;
    formula.style.setProperty("--formula-fit", String(scale));
  };

  const fitVisibleFormulas = () => {
    document.querySelectorAll(".formula-display").forEach(fitFormula);
  };

  const scheduleFormulaFit = () => requestAnimationFrame(fitVisibleFormulas);

  document.querySelectorAll("[data-formula-explorer]").forEach((explorer) => {
    const buttons = [...explorer.querySelectorAll("[data-formula-target]")];
    const panels = [...explorer.querySelectorAll("[data-formula-panel]")];
    const placeholder = explorer.querySelector("[data-formula-placeholder]");
    const showAllButton = explorer.querySelector("[data-show-all-formulas]");

    const showPanel = (targetId) => {
      panels.forEach((panel) => { panel.hidden = panel.id !== targetId; });
      buttons.forEach((button) => {
        const isActive = button.dataset.formulaTarget === targetId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-expanded", String(isActive));
      });
      if (placeholder) placeholder.hidden = true;
      if (showAllButton) {
        showAllButton.setAttribute("aria-pressed", "false");
        showAllButton.textContent = "Mostrar todas";
      }
      document.getElementById(targetId)?.focus({ preventScroll: true });
      scheduleFormulaFit();
    };

    buttons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => showPanel(button.dataset.formulaTarget));
    });

    showAllButton?.addEventListener("click", () => {
      const willShowAll = showAllButton.getAttribute("aria-pressed") !== "true";
      panels.forEach((panel) => { panel.hidden = !willShowAll; });
      buttons.forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-expanded", "false");
      });
      if (placeholder) placeholder.hidden = willShowAll;
      showAllButton.setAttribute("aria-pressed", String(willShowAll));
      showAllButton.textContent = willShowAll ? "Ocultar todas" : "Mostrar todas";
      scheduleFormulaFit();
    });

    explorer.classList.add("is-enhanced");
    panels.forEach((panel) => { panel.hidden = true; });
    if (placeholder) placeholder.hidden = false;
  });

  document.querySelectorAll("details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open) scheduleFormulaFit();
    });
  });

  window.addEventListener("load", scheduleFormulaFit, { once: true });
  window.addEventListener("resize", scheduleFormulaFit);
  scheduleFormulaFit();
})();
