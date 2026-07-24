import { analyseData, createBarChart, renderMath } from "../estadistica.mjs";

const analysis = analyseData([1, 2, 2, 3, 1, 4, 2, 3, 3, 2]);

createBarChart(
  document.querySelector("[data-theory-absolute-chart]"),
  analysis.entries,
  {
    title: "Frecuencia absoluta de libros leídos",
    type: "absolute",
    description:
      "La barra del valor 2 es la más alta: cuatro de las diez personas leyeron dos libros.",
  }
);

createBarChart(
  document.querySelector("[data-theory-percentage-chart]"),
  analysis.entries,
  {
    title: "Porcentaje de libros leídos",
    type: "percentage",
    description:
      "El eje llega siempre a 100%. Cada barra muestra el porcentaje exacto de su valor, no el acumulado.",
  }
);

renderMath(document.body);
