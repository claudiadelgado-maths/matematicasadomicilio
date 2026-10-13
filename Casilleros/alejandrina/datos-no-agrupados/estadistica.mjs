const MAXIMUM_DATA_COUNT = 200;
const MAXIMUM_ABSOLUTE_VALUE = 1_000_000_000_000;

const normaliseZero = (value) => (Object.is(value, -0) ? 0 : value);

export const formatNumber = (value, maximumDecimals = 4) => {
  const normalised = normaliseZero(value);
  if (Number.isInteger(normalised)) return String(normalised);
  return String(Number(normalised.toFixed(maximumDecimals)));
};

export const formatPercentage = (value, maximumDecimals = 1) =>
  `${formatNumber(value, maximumDecimals)}%`;

export const parseDataList = (text, maximumItems = MAXIMUM_DATA_COUNT) => {
  const cleanText = text.trim();
  if (!cleanText) {
    return { error: "Escribe al menos un dato antes de calcular." };
  }

  if (/^,|,$|,\s*,/.test(cleanText)) {
    return {
      error:
        "Hay una coma sin un número a uno de sus lados. Revisa los separadores de la lista.",
    };
  }

  const tokens = cleanText.split(/[,\s]+/);
  if (tokens.length > maximumItems) {
    return {
      error: `La calculadora admite hasta ${maximumItems} datos por análisis. Reduce la lista e inténtalo de nuevo.`,
    };
  }

  const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  const invalidToken = tokens.find((token) => !numberPattern.test(token));
  if (invalidToken) {
    return {
      error: `“${invalidToken}” no es un número válido. Usa punto para los decimales y separa los datos con comas o espacios.`,
    };
  }

  const data = tokens.map((token) => normaliseZero(Number(token)));
  const invalidValue = data.find(
    (value) => !Number.isFinite(value) || Math.abs(value) > MAXIMUM_ABSOLUTE_VALUE
  );
  if (invalidValue !== undefined) {
    return {
      error:
        "Uno de los valores es demasiado grande. Utiliza números entre −1 000 000 000 000 y 1 000 000 000 000.",
    };
  }

  return { data };
};

export const sortData = (data) => [...data].sort((first, second) => first - second);

export const calculateMean = (data) =>
  data.reduce((total, value) => total + value, 0) / data.length;

export const calculateMeanFromFrequencies = (values, frequencies) => {
  const total = frequencies.reduce((sum, frequency) => sum + frequency, 0);
  if (total === 0) return Number.NaN;
  const weightedSum = values.reduce(
    (sum, value, index) => sum + value * frequencies[index],
    0
  );
  return weightedSum / total;
};

export const calculateMedian = (data) => {
  const sorted = sortData(data);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

export const obtainFrequencies = (data) => {
  const frequencies = new Map();
  data.forEach((value) => {
    const normalised = normaliseZero(value);
    frequencies.set(normalised, (frequencies.get(normalised) || 0) + 1);
  });
  return [...frequencies.entries()]
    .sort((first, second) => first[0] - second[0])
    .map(([value, absolute]) => ({ value, absolute }));
};

export const calculateModes = (frequencyEntries) => {
  const maximumFrequency = Math.max(...frequencyEntries.map((entry) => entry.absolute));
  const allFrequenciesEqual =
    frequencyEntries.length > 1 &&
    frequencyEntries.every((entry) => entry.absolute === frequencyEntries[0].absolute);

  return {
    modes: allFrequenciesEqual
      ? []
      : frequencyEntries
          .filter((entry) => entry.absolute === maximumFrequency)
          .map((entry) => entry.value),
    maximumFrequency,
    hasMode: !allFrequenciesEqual,
  };
};

export const analyseData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Se necesita al menos un dato para realizar el análisis.");
  }

  const original = [...data];
  const sorted = sortData(data);
  const count = data.length;
  const sum = data.reduce((total, value) => total + value, 0);
  const baseEntries = obtainFrequencies(data);
  let cumulative = 0;
  const entries = baseEntries.map(({ value, absolute }) => {
    cumulative += absolute;
    const relative = absolute / count;
    const cumulativeRelative = cumulative / count;
    return {
      value,
      absolute,
      relative,
      percentage: relative * 100,
      cumulative,
      cumulativeRelative,
      cumulativePercentage: cumulativeRelative * 100,
    };
  });
  const modeAnalysis = calculateModes(entries);
  const middle = Math.floor(count / 2);

  return {
    original,
    sorted,
    count,
    sum,
    distinctCount: entries.length,
    entries,
    mean: sum / count,
    median:
      count % 2 === 1
        ? sorted[middle]
        : (sorted[middle - 1] + sorted[middle]) / 2,
    middleValues:
      count % 2 === 1 ? [sorted[middle]] : [sorted[middle - 1], sorted[middle]],
    ...modeAnalysis,
  };
};

export const approximatelyEqual = (first, second, tolerance = 0.01) =>
  Math.abs(first - second) <= tolerance;

export const renderMath = (root = document.body) => {
  if (typeof globalThis.renderMathInElement !== "function") {
    if (document.readyState !== "complete") {
      window.addEventListener("load", () => renderMath(root), { once: true });
    }
    return;
  }

  globalThis.renderMathInElement(root, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
    strict: "ignore",
  });
};

const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

export const createBarChart = (
  container,
  entries,
  {
    type = "absolute",
    title = "Gráfica de frecuencia absoluta",
    description = "",
  } = {}
) => {
  if (!container || !entries.length) return;

  const percentageChart = type === "percentage";
  const maximumValue = percentageChart
    ? 100
    : Math.max(...entries.map((entry) => entry.absolute));
  const middleTick = maximumValue / 2;

  const figure = createElement("figure", "statistics-chart");
  const caption = createElement("figcaption", "statistics-chart-caption");
  caption.append(
    createElement("strong", "", title),
    createElement(
      "span",
      "",
      percentageChart
        ? "Eje horizontal: valores. Eje vertical: porcentaje."
        : "Eje horizontal: valores. Eje vertical: frecuencia absoluta."
    )
  );

  const body = createElement("div", "statistics-chart-body");
  const yAxis = createElement("div", "statistics-chart-y-axis");
  [
    percentageChart
      ? formatPercentage(maximumValue, 0)
      : formatNumber(maximumValue, 2),
    percentageChart
      ? formatPercentage(middleTick, 0)
      : formatNumber(middleTick, 2),
    "0",
  ].forEach((tick) => yAxis.append(createElement("span", "", tick)));

  const viewport = createElement("div", "statistics-chart-scroll");
  viewport.tabIndex = 0;
  viewport.setAttribute(
    "aria-label",
    `${title}. Desplázate horizontalmente si hay muchos valores.`
  );

  const plot = createElement(
    "div",
    `statistics-chart-plot${entries.length > 8 ? " is-crowded" : ""}`
  );
  plot.style.minWidth = `${Math.max(480, entries.length * (entries.length > 12 ? 58 : 72))}px`;
  const grid = createElement("div", "statistics-chart-grid");
  grid.setAttribute("aria-hidden", "true");
  grid.append(createElement("span"), createElement("span"), createElement("span"));
  plot.append(grid);

  const bars = createElement("div", "statistics-chart-bars");
  entries.forEach((entry) => {
    const realValue = percentageChart ? entry.percentage : entry.absolute;
    const visualHeight = Math.max(3, (realValue / maximumValue) * 100);
    const group = createElement("div", "statistics-bar-group");
    const track = createElement("div", "statistics-bar-track");
    const bar = createElement(
      "div",
      `statistics-bar ${percentageChart ? "is-percentage" : "is-absolute"}`
    );
    bar.style.height = `${visualHeight}%`;
    bar.title = `${formatNumber(entry.value)}: ${
      percentageChart
        ? formatPercentage(entry.percentage, 1)
        : `${entry.absolute} observación${entry.absolute === 1 ? "" : "es"}`
    }`;
    bar.append(
      createElement(
        "span",
        "statistics-bar-value",
        percentageChart
          ? formatPercentage(entry.percentage, 1)
          : formatNumber(entry.absolute)
      )
    );
    track.append(bar);
    group.append(track, createElement("span", "statistics-bar-label", formatNumber(entry.value)));
    bars.append(group);
  });
  plot.append(bars);
  viewport.append(plot);
  body.append(yAxis, viewport);
  figure.append(caption, body);
  if (description) {
    figure.append(createElement("p", "statistics-chart-description", description));
  }
  container.replaceChildren(figure);
};
