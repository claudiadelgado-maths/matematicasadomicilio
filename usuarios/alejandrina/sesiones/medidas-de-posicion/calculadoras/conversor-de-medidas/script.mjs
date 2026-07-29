import {
  conversionFor,
  conversionReason,
  createMeasure
} from "../../posiciones.mjs";

const INDEX_OPTIONS = {
  quartile: [1, 2, 3],
  decile: [1, 2, 3, 4, 5, 6, 7, 8, 9]
};

function sameMeasure(first, second) {
  return first.type === second.type && first.index === second.index;
}

function initialiseConverter() {
  const form = document.querySelector("[data-converter-form]");
  if (!form) return;

  const typeSelect = form.querySelector("[data-measure-type]");
  const indexField = form.querySelector("[data-index-select-field]");
  const indexLabel = form.querySelector("[data-index-label]");
  const indexSelect = form.querySelector("[data-measure-index]");
  const indexHelp = form.querySelector("[data-index-help]");
  const percentileField = form.querySelector("[data-percentile-field]");
  const percentileInput = form.querySelector("[data-percentile-index]");
  const medianNote = form.querySelector("[data-median-note]");
  const message = form.querySelector("[data-converter-message]");
  const results = document.querySelector("[data-converter-results]");
  const resultTitle = results.querySelector("[data-result-title]");
  const resultReason = results.querySelector("[data-result-reason]");
  const resultMeasure = results.querySelector("[data-result-measure]");
  const resultPercent = results.querySelector("[data-result-percent]");
  const resultPercentile = results.querySelector("[data-result-percentile]");
  const percentileEquals = results.querySelector("[data-percentile-equals]");
  const marker = results.querySelector("[data-result-marker]");
  const markerLabel = results.querySelector("[data-marker-label]");
  const equivalences = results.querySelector("[data-result-equivalences]");
  const resultNote = results.querySelector("[data-result-note]");
  let hasConverted = false;

  const setMessage = (text = "", kind = "") => {
    message.textContent = text;
    if (kind) message.dataset.kind = kind;
    else delete message.dataset.kind;
  };

  const markChanged = () => {
    if (!hasConverted) return;
    results.hidden = true;
    setMessage("La medida cambió. Presiona “Convertir medida” para actualizar el resultado.");
  };

  const renderIndexControl = () => {
    const type = typeSelect.value;
    indexField.hidden = type === "percentile" || type === "median";
    percentileField.hidden = type !== "percentile";
    medianNote.hidden = type !== "median";

    if (type === "quartile" || type === "decile") {
      const prefix = type === "quartile" ? "Q" : "D";
      indexLabel.textContent = type === "quartile" ? "Cuartil" : "Decil";
      indexHelp.textContent = type === "quartile"
        ? "Selecciona Q1, Q2 o Q3."
        : "Selecciona un decil entre D1 y D9.";
      indexSelect.replaceChildren(
        ...INDEX_OPTIONS[type].map(
          (index) => new Option(`${prefix}${index}`, String(index))
        )
      );
    }
  };

  const selectedMeasure = () => {
    const type = typeSelect.value;
    if (type === "median") return createMeasure("median");
    if (type === "percentile") {
      const raw = percentileInput.value.trim();
      if (!raw) {
        throw new RangeError("Escribe un número de percentil antes de convertir.");
      }
      const value = Number(raw);
      if (!Number.isInteger(value) || value < 1 || value > 99) {
        throw new RangeError("El percentil debe ser un número entero entre 1 y 99.");
      }
      return createMeasure("percentile", value);
    }
    return createMeasure(type, Number(indexSelect.value));
  };

  const renderResult = (measure) => {
    const conversion = conversionFor(measure);
    const otherMeasures = conversion.exactMeasures.filter(
      (candidate) => !sameMeasure(candidate, conversion.measure)
    );

    resultTitle.textContent = `La posición de ${conversion.measure.notation}`;
    resultReason.textContent = conversionReason(conversion.measure);
    resultMeasure.textContent = conversion.measure.notation;
    resultPercent.textContent = `${conversion.percent}%`;
    resultPercentile.textContent = conversion.percentile.notation;
    const percentileIsInput = conversion.measure.type === "percentile";
    resultPercentile.hidden = percentileIsInput;
    percentileEquals.hidden = percentileIsInput;
    marker.style.setProperty("--result-position", `${conversion.percent}%`);
    markerLabel.textContent = `${conversion.percent}%`;
    equivalences.replaceChildren();

    conversion.exactMeasures.forEach((candidate) => {
      const chip = document.createElement("span");
      chip.textContent = candidate.notation;
      if (sameMeasure(candidate, conversion.measure)) chip.classList.add("is-input");
      equivalences.append(chip);
    });

    if (!otherMeasures.length) {
      resultNote.textContent = "Esta posición no tiene un cuartil, decil entero ni nombre especial adicional.";
    } else {
      resultNote.textContent = `También puede expresarse exactamente como ${otherMeasures
        .map((candidate) => candidate.notation)
        .join(", ")}.`;
    }

    results.hidden = false;
    hasConverted = true;
    setMessage("Conversión lista.", "success");
    resultTitle.focus({ preventScroll: true });
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  typeSelect.addEventListener("change", () => {
    renderIndexControl();
    markChanged();
  });
  indexSelect.addEventListener("change", markChanged);
  percentileInput.addEventListener("input", markChanged);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setMessage();
    results.hidden = true;
    try {
      renderResult(selectedMeasure());
    } catch (error) {
      setMessage(error.message, "error");
      if (typeSelect.value === "percentile") percentileInput.focus();
    }
  });

  form.querySelectorAll("[data-preset-type]").forEach((button) => {
    button.addEventListener("click", () => {
      typeSelect.value = button.dataset.presetType;
      renderIndexControl();
      if (button.dataset.presetIndex) {
        if (button.dataset.presetType === "percentile") {
          percentileInput.value = button.dataset.presetIndex;
        } else {
          indexSelect.value = button.dataset.presetIndex;
        }
      }
      markChanged();
      renderResult(selectedMeasure());
    });
  });

  renderIndexControl();
}

if (typeof document !== "undefined") {
  initialiseConverter();
}
