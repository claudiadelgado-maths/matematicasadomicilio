import {
  analyseData,
  createBarChart,
  formatNumber,
  formatPercentage,
  parseDataList,
  renderMath,
} from "../../estadistica.mjs";

const form = document.querySelector("#statistics-calculator-form");

if (form) {
  const input = form.querySelector("#statistics-data-input");
  const errorElement = form.querySelector("[data-statistics-calculator-error]");
  const results = document.querySelector("[data-statistics-calculator-results]");
  const resultsTitle = results.querySelector("[data-results-title]");
  const overview = results.querySelector("[data-statistics-overview]");
  const frequencyBody = results.querySelector("[data-statistics-calculator-frequency]");
  const frequencyFoot = results.querySelector(
    "[data-statistics-calculator-frequency-foot]"
  );
  const measures = results.querySelector("[data-statistics-measures]");
  const cumulativeInterpretation = results.querySelector(
    "[data-cumulative-interpretation]"
  );
  const absoluteChart = results.querySelector("[data-calculator-absolute-chart]");
  const percentageChart = results.querySelector("[data-calculator-percentage-chart]");
  const status = results.querySelector("[data-calculator-status]");

  const createOverviewItem = (label, value) => {
    const article = document.createElement("article");
    const title = document.createElement("span");
    title.textContent = label;
    const content = document.createElement("strong");
    content.textContent = value;
    article.append(title, content);
    return article;
  };

  const createMeasure = (title, result, explanation) => {
    const article = document.createElement("article");
    const heading = document.createElement("h3");
    heading.textContent = title;
    const value = document.createElement("p");
    value.className = "measure-result";
    value.textContent = result;
    const detail = document.createElement("p");
    detail.textContent = explanation;
    article.append(heading, value, detail);
    return article;
  };

  const createCell = (value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
  };

  const formatDataList = (data, visibleLimit = 40) => {
    if (data.length <= visibleLimit) {
      return data.map((value) => formatNumber(value)).join(", ");
    }
    const beginning = data
      .slice(0, visibleLimit - 3)
      .map((value) => formatNumber(value));
    const ending = data.slice(-3).map((value) => formatNumber(value));
    return `${beginning.join(", ")}, …, ${ending.join(", ")}`;
  };

  const modeDescription = (analysis) => {
    if (!analysis.hasMode) {
      return {
        result: "Sin moda",
        explanation:
          "Ningún valor aparece más que los demás; la calculadora no fuerza una moda.",
      };
    }
    if (analysis.modes.length === 1) {
      return {
        result: `Moda: ${formatNumber(analysis.modes[0])}`,
        explanation: `Aparece ${analysis.maximumFrequency} ${
          analysis.maximumFrequency === 1 ? "vez" : "veces"
        }, la frecuencia más alta.`,
      };
    }
    return {
      result: `Modas: ${analysis.modes.map((value) => formatNumber(value)).join(", ")}`,
      explanation: `Todos esos valores comparten la frecuencia máxima de ${analysis.maximumFrequency}.`,
    };
  };

  const renderFrequencyTable = (analysis) => {
    frequencyBody.replaceChildren();
    analysis.entries.forEach((entry) => {
      const row = document.createElement("tr");
      row.append(
        createCell(formatNumber(entry.value)),
        createCell(String(entry.absolute)),
        createCell(formatNumber(entry.relative, 4)),
        createCell(formatPercentage(entry.percentage, 1)),
        createCell(String(entry.cumulative)),
        createCell(formatPercentage(entry.cumulativePercentage, 1))
      );
      frequencyBody.append(row);
    });

    const totalRow = document.createElement("tr");
    totalRow.append(
      createCell("Total"),
      createCell(String(analysis.count)),
      createCell("1"),
      createCell("100%"),
      createCell(String(analysis.count)),
      createCell("100%")
    );
    frequencyFoot.replaceChildren(totalRow);
  };

  const renderProcedures = (analysis) => {
    const sample = analysis.entries[Math.min(1, analysis.entries.length - 1)];
    const sampleIndex = analysis.entries.indexOf(sample);
    const priorFrequencies = analysis.entries
      .slice(0, sampleIndex + 1)
      .map((entry) => entry.absolute);
    const weightedTerms = analysis.entries
      .slice(0, 8)
      .map((entry) => `${formatNumber(entry.value)}(${entry.absolute})`);
    const weightedSuffix = analysis.entries.length > 8 ? "+\\cdots" : "";

    results.querySelector(
      "[data-procedure-frequency]"
    ).innerHTML = `<p>Para \\(x_i=${formatNumber(
      sample.value
    )}\\), contamos \\(f_i=${sample.absolute}\\).</p><p>\\(h_i=\\frac{${
      sample.absolute
    }}{${analysis.count}}=${formatNumber(
      sample.relative,
      4
    )}\\).</p><p>\\(p_i=${formatNumber(
      sample.relative,
      4
    )}\\cdot100\\%=${formatPercentage(sample.percentage, 1)}\\).</p>`;

    results.querySelector(
      "[data-procedure-cumulative]"
    ).innerHTML = `<p>Hasta \\(x_i=${formatNumber(
      sample.value
    )}\\):</p><p>\\(F_i=${priorFrequencies.join("+")}=${
      sample.cumulative
    }\\).</p><p>\\(P_i=\\frac{${sample.cumulative}}{${
      analysis.count
    }}\\cdot100\\%=${formatPercentage(
      sample.cumulativePercentage,
      1
    )}\\).</p>`;

    results.querySelector(
      "[data-procedure-mean]"
    ).innerHTML = `<p>Con la tabla:</p><p>\\(\\bar{x}=\\frac{\\sum x_i f_i}{n}\\).</p><p>\\(\\bar{x}=\\frac{${weightedTerms.join(
      "+"
    )}${weightedSuffix}}{${analysis.count}}=\\frac{${formatNumber(
      analysis.sum
    )}}{${analysis.count}}=${formatNumber(analysis.mean, 4)}\\).</p>`;

    const middleText =
      analysis.middleValues.length === 1
        ? `La posición central contiene ${formatNumber(analysis.median)}.`
        : `Los valores centrales son ${analysis.middleValues
            .map((value) => formatNumber(value))
            .join(" y ")}; su promedio es ${formatNumber(analysis.median)}.`;
    const mode = modeDescription(analysis);
    results.querySelector(
      "[data-procedure-median-mode]"
    ).innerHTML = `<p>Ordenamos: ${formatDataList(
      analysis.sorted
    )}.</p><p>${middleText}</p><p>${mode.result}. ${
      mode.explanation
    }</p>`;
  };

  const renderChecks = (analysis) => {
    const sumAbsolute = analysis.entries.reduce(
      (total, entry) => total + entry.absolute,
      0
    );
    const sumRelative = analysis.entries.reduce(
      (total, entry) => total + entry.relative,
      0
    );
    const sumPercentage = analysis.entries.reduce(
      (total, entry) => total + entry.percentage,
      0
    );
    const finalEntry = analysis.entries.at(-1);
    results.querySelector(
      "[data-check-absolute]"
    ).textContent = `✓ Σfᵢ = ${sumAbsolute} = n`;
    results.querySelector(
      "[data-check-relative]"
    ).textContent = `✓ Σhᵢ = ${formatNumber(sumRelative, 4)}`;
    results.querySelector(
      "[data-check-percentage]"
    ).textContent = `✓ Σpᵢ = ${formatPercentage(sumPercentage, 1)}`;
    results.querySelector(
      "[data-check-cumulative]"
    ).textContent = `✓ F final = ${finalEntry.cumulative} = n`;
    results.querySelector(
      "[data-check-cumulative-percentage]"
    ).textContent = `✓ P final = ${formatPercentage(
      finalEntry.cumulativePercentage,
      1
    )}`;
  };

  const renderAnalysis = (analysis) => {
    overview.replaceChildren(
      createOverviewItem(
        "Datos originales",
        formatDataList(analysis.original)
      ),
      createOverviewItem(
        "Datos ordenados",
        formatDataList(analysis.sorted)
      ),
      createOverviewItem("Cantidad total n", String(analysis.count)),
      createOverviewItem("Valores distintos", String(analysis.distinctCount)),
      createOverviewItem("Suma", formatNumber(analysis.sum))
    );

    renderFrequencyTable(analysis);

    const mode = modeDescription(analysis);
    measures.replaceChildren(
      createMeasure(
        "Media",
        `x̄ = ${formatNumber(analysis.mean, 4)}`,
        `Se dividió la suma ${formatNumber(analysis.sum)} entre ${analysis.count}.`
      ),
      createMeasure(
        "Mediana",
        `Mediana = ${formatNumber(analysis.median, 4)}`,
        analysis.middleValues.length === 1
          ? `Es el valor central de los ${analysis.count} datos ordenados.`
          : `Se promediaron los dos valores centrales: ${analysis.middleValues
              .map((value) => formatNumber(value))
              .join(" y ")}.`
      ),
      createMeasure("Moda", mode.result, mode.explanation)
    );

    const lastEntry = analysis.entries.at(-1);
    const middleEntry = analysis.entries[Math.floor((analysis.entries.length - 1) / 2)];
    cumulativeInterpretation.textContent = `Hasta el valor ${formatNumber(
      middleEntry.value
    )} se acumulan ${middleEntry.cumulative} observaciones, equivalentes a ${formatPercentage(
      middleEntry.cumulativePercentage,
      1
    )}. La última fila alcanza ${lastEntry.cumulative} datos y 100%.`;

    createBarChart(absoluteChart, analysis.entries, {
      type: "absolute",
      title: "Frecuencia absoluta",
      description:
        "La altura se calcula respecto de la frecuencia máxima; la etiqueta conserva el conteo real.",
    });
    createBarChart(percentageChart, analysis.entries, {
      type: "percentage",
      title: "Frecuencia porcentual",
      description:
        "El eje vertical permanece entre 0% y 100%. Estas barras no son porcentajes acumulados.",
    });

    renderProcedures(analysis);
    renderChecks(analysis);
    status.textContent = `Análisis de ${analysis.count} ${
      analysis.count === 1 ? "dato" : "datos"
    } completado. La tabla y las dos gráficas representan los mismos valores.`;
    results.hidden = false;
    renderMath(results);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorElement.textContent = "";
    const parsed = parseDataList(input.value);
    if (parsed.error) {
      results.hidden = true;
      errorElement.textContent = parsed.error;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }

    input.removeAttribute("aria-invalid");
    const analysis = analyseData(parsed.data);
    renderAnalysis(analysis);
    resultsTitle.focus({ preventScroll: true });
    results.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  });

  form.querySelectorAll("[data-example-list]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.exampleList;
      form.requestSubmit();
    });
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      errorElement.textContent = "";
      input.removeAttribute("aria-invalid");
      overview.replaceChildren();
      frequencyBody.replaceChildren();
      frequencyFoot.replaceChildren();
      measures.replaceChildren();
      absoluteChart.replaceChildren();
      percentageChart.replaceChildren();
      results.hidden = true;
      input.focus();
    }, 0);
  });
}
