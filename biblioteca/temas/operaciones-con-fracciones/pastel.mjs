const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const CENTER = 160;
const RADIUS = 126;

const polarPoint = (angle) => ({
  x: CENTER + RADIUS * Math.cos(angle),
  y: CENTER + RADIUS * Math.sin(angle),
});

const sectorPath = (startAngle, endAngle, total) => {
  if (total === 1) {
    return [
      `M ${CENTER - RADIUS} ${CENTER}`,
      `a ${RADIUS} ${RADIUS} 0 1 0 ${RADIUS * 2} 0`,
      `a ${RADIUS} ${RADIUS} 0 1 0 ${-RADIUS * 2} 0`,
      "Z",
    ].join(" ");
  }
  const start = polarPoint(startAngle);
  const end = polarPoint(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

export const renderizarPastel = (
  svg,
  {
    total,
    selected = new Set(),
    interactive = false,
    onToggle = () => {},
    label = "Representación de una fracción mediante un pastel",
  },
) => {
  svg.replaceChildren();
  svg.setAttribute("viewBox", "0 0 320 320");
  svg.setAttribute("role", interactive ? "group" : "img");
  svg.setAttribute("aria-label", label);

  for (let index = 0; index < total; index += 1) {
    const start = -Math.PI / 2 + (index * Math.PI * 2) / total;
    const end = -Math.PI / 2 + ((index + 1) * Math.PI * 2) / total;
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    const isSelected = selected.has(index);
    path.setAttribute("d", sectorPath(start, end, total));
    path.setAttribute("class", `pie-sector${isSelected ? " is-selected" : ""}`);
    path.dataset.sector = String(index);

    if (interactive) {
      path.setAttribute("role", "button");
      path.setAttribute("tabindex", "0");
      path.setAttribute("aria-pressed", String(isSelected));
      path.setAttribute(
        "aria-label",
        `Parte ${index + 1} de ${total}, ${isSelected ? "seleccionada" : "no seleccionada"}`,
      );
      const toggle = () => onToggle(index);
      path.addEventListener("click", toggle);
      path.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      });
    }
    svg.append(path);
  }
};
