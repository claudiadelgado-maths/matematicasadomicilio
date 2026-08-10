document.querySelectorAll("[data-solution-toggle]").forEach((button) => {
  const panel = document.getElementById(button.dataset.solutionToggle);
  if (!panel) return;

  const label = button.querySelector("span");
  const solutionName = button.classList.contains("solution-toggle-quick")
    ? "solución rápida"
    : "solución detallada";

  button.addEventListener("click", () => {
    const willOpen = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(willOpen));
    button.classList.toggle("is-open", willOpen);
    panel.hidden = !willOpen;
    label.textContent = `${willOpen ? "Ocultar" : "Ver"} ${solutionName}`;
  });
});
