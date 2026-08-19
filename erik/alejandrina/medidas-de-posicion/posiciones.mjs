export const ORDINALS = [
  "",
  "Primer",
  "Segundo",
  "Tercer",
  "Cuarto",
  "Quinto",
  "Sexto",
  "Séptimo",
  "Octavo",
  "Noveno"
];

export const QUARTILE_PERCENTAGES = Object.freeze({
  1: 25,
  2: 50,
  3: 75
});

export function createMeasure(type, index = null) {
  if (type === "median") {
    return {
      type,
      index: null,
      notation: "Mediana",
      longName: "Mediana",
      percent: 50
    };
  }

  const numericIndex = Number(index);
  if (!Number.isInteger(numericIndex)) {
    throw new TypeError("El índice de la medida debe ser un número entero.");
  }

  if (type === "quartile" && numericIndex >= 1 && numericIndex <= 3) {
    return {
      type,
      index: numericIndex,
      notation: `Q${numericIndex}`,
      longName: `${ORDINALS[numericIndex]} cuartil`,
      percent: QUARTILE_PERCENTAGES[numericIndex]
    };
  }

  if (type === "decile" && numericIndex >= 1 && numericIndex <= 9) {
    return {
      type,
      index: numericIndex,
      notation: `D${numericIndex}`,
      longName: `${ORDINALS[numericIndex]} decil`,
      percent: numericIndex * 10
    };
  }

  if (type === "percentile" && numericIndex >= 1 && numericIndex <= 99) {
    return {
      type,
      index: numericIndex,
      notation: `P${numericIndex}`,
      longName: `Percentil ${numericIndex}`,
      percent: numericIndex
    };
  }

  throw new RangeError("La medida solicitada está fuera del intervalo permitido.");
}

export function exactMeasuresAt(percent) {
  const numericPercent = Number(percent);
  if (
    !Number.isInteger(numericPercent)
    || numericPercent < 1
    || numericPercent > 99
  ) {
    throw new RangeError("El porcentaje debe ser un entero entre 1 y 99.");
  }

  const measures = [];

  const quartileEntry = Object.entries(QUARTILE_PERCENTAGES).find(
    ([, value]) => value === numericPercent
  );
  if (quartileEntry) {
    measures.push(createMeasure("quartile", Number(quartileEntry[0])));
  }

  if (numericPercent % 10 === 0) {
    measures.push(createMeasure("decile", numericPercent / 10));
  }

  measures.push(createMeasure("percentile", numericPercent));

  if (numericPercent === 50) {
    measures.push(createMeasure("median"));
  }

  return measures;
}

export function conversionFor(measure) {
  const normalized = createMeasure(measure.type, measure.index);
  return {
    measure: normalized,
    percent: normalized.percent,
    percentile: createMeasure("percentile", normalized.percent),
    exactMeasures: exactMeasuresAt(normalized.percent)
  };
}

export function equivalenceText(percent) {
  return `${exactMeasuresAt(percent)
    .map((measure) => measure.notation)
    .join(" = ")} = ${percent}%`;
}

export function conversionReason(measure) {
  const normalized = createMeasure(measure.type, measure.index);

  if (normalized.type === "quartile") {
    return `Los cuartiles dividen el recorrido en cuatro partes de 25%. ${normalized.notation} marca ${normalized.index} de esas partes: ${normalized.percent}%.`;
  }

  if (normalized.type === "decile") {
    return `Cada decil representa 10%. ${normalized.notation} corresponde a ${normalized.index} × 10% = ${normalized.percent}%.`;
  }

  if (normalized.type === "percentile") {
    return `${normalized.notation} indica directamente la posición ${normalized.percent}% del recorrido.`;
  }

  return "La mediana es la posición central del recorrido, por eso corresponde al 50%.";
}

export const CORE_MEASURES = Object.freeze([
  createMeasure("quartile", 1),
  createMeasure("quartile", 2),
  createMeasure("quartile", 3),
  ...Array.from({ length: 9 }, (_, index) => createMeasure("decile", index + 1)),
  createMeasure("median")
]);
