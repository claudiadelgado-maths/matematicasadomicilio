import { renderMath } from "../../matematicas.mjs";

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 2,
});

const FAMILY_LABELS = {
  core: "Relación porcentual",
  change: "Cambio porcentual",
  discount: "Descuentos",
  iva: "IVA",
};

const inlineMath = (latex) => `\\(${latex}\\)`;

export function randomItem(values, random = Math.random) {
  return values[Math.floor(random() * values.length)];
}

export function randomInteger(minimum, maximum, random = Math.random) {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

export function greatestCommonDivisor(first, second) {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatNumber(value) {
  return NUMBER_FORMATTER.format(value);
}

export function formatCurrency(value) {
  return CURRENCY_FORMATTER.format(value);
}

function compatiblePair(percent, random, { minimum = 100, maximum = 2000 } = {}) {
  const unit = 100 / greatestCommonDivisor(percent, 100);
  const minimumMultiplier = Math.ceil(minimum / unit);
  const maximumMultiplier = Math.max(minimumMultiplier, Math.floor(maximum / unit));
  const total = unit * randomInteger(minimumMultiplier, maximumMultiplier, random);
  return { total, part: (total * percent) / 100 };
}

function field(id, label, expected, options = {}) {
  return {
    id,
    label,
    expected: roundMoney(expected),
    prefix: options.prefix ?? "",
    suffix: options.suffix ?? "",
    kind: options.kind ?? "number",
    hint: options.hint ?? "Revisa qué cantidad representa el 100% y elige la operación correspondiente.",
  };
}

function questionSignature(question) {
  return `${question.variant}|${question.prompt}|${question.fields.map((item) => item.expected).join("|")}`;
}

export function createCoreQuestion(random = Math.random) {
  const percent = randomItem([5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80], random);
  const { total, part } = compatiblePair(percent, random, { minimum: 120, maximum: 1200 });
  const variant = randomItem(["part", "percent", "total"], random);

  if (variant === "part") {
    return {
      family: "core",
      variant,
      type: "Calcular una parte",
      prompt: `En una preparatoria hay ${formatNumber(total)} estudiantes. El ${percent}% participa en una actividad. ¿Cuántos estudiantes participan?`,
      basis: `${formatNumber(total)} estudiantes representan el 100% del grupo.`,
      fields: [field("part", "Estudiantes que participan", part, { suffix: "estudiantes", hint: `Convierte ${percent}% a decimal y multiplícalo por ${formatNumber(total)}.` })],
      steps: [`Convierte la tasa: ${inlineMath(`${percent}\\%=\\frac{${percent}}{100}=${percent / 100}`)}.`, `Calcula la parte: ${inlineMath(`${formatNumber(total)}\\cdot${percent / 100}=${formatNumber(part)}`)}.`, `<strong>Participan ${formatNumber(part)} estudiantes.</strong>`],
    };
  }

  if (variant === "percent") {
    return {
      family: "core",
      variant,
      type: "Descubrir un porcentaje",
      prompt: `De ${formatNumber(total)} estudiantes, ${formatNumber(part)} participan en una actividad. ¿Qué porcentaje del grupo participa?`,
      basis: `${formatNumber(total)} estudiantes representan el 100% del grupo.`,
      fields: [field("percent", "Porcentaje que participa", percent, { suffix: "%", kind: "percent", hint: `Divide la parte (${formatNumber(part)}) entre el total (${formatNumber(total)}) y multiplica por 100.` })],
      steps: [`Compara parte y total: ${inlineMath(`\\frac{${formatNumber(part)}}{${formatNumber(total)}}=${formatNumber(part / total)}`)}.`, `Convierte a porcentaje: ${inlineMath(`${formatNumber(part / total)}\\cdot100=${percent}\\%`)}.`, `<strong>Participa el ${percent}% del grupo.</strong>`],
    };
  }

  return {
    family: "core",
    variant,
    type: "Recuperar el total",
    prompt: `${formatNumber(part)} estudiantes representan el ${percent}% de un grupo. ¿Cuántos estudiantes hay en total?`,
    basis: `El grupo completo es el 100%; ${formatNumber(part)} es solamente el ${percent}%.`,
    fields: [field("total", "Total de estudiantes", total, { suffix: "estudiantes", hint: `Divide ${formatNumber(part)} entre el decimal ${percent / 100}; no multipliques otra vez por el porcentaje.` })],
    steps: [`Convierte la tasa: ${inlineMath(`${percent}\\%=\\frac{${percent}}{100}=${percent / 100}`)}.`, `Recupera el total: ${inlineMath(`\\frac{${formatNumber(part)}}{${percent / 100}}=${formatNumber(total)}`)}.`, `<strong>El grupo tiene ${formatNumber(total)} estudiantes.</strong>`],
  };
}

export function createChangeQuestion(random = Math.random) {
  const percent = randomItem([10, 20, 25, 30, 40, 50], random);
  const { total: initial, part: change } = compatiblePair(percent, random, { minimum: 100, maximum: 1500 });
  const direction = randomItem(["increase", "decrease"], random);
  const final = direction === "increase" ? initial + change : initial - change;
  const variant = randomItem(["apply", "rate", "initial"], random);
  const directionText = direction === "increase" ? "aumenta" : "disminuye";
  const pastDirectionText = direction === "increase" ? "aumentó" : "disminuyó";
  const sign = direction === "increase" ? "+" : "−";
  const factor = direction === "increase" ? 1 + percent / 100 : 1 - percent / 100;

  if (variant === "apply") {
    return {
      family: "change",
      variant: `${variant}-${direction}`,
      type: direction === "increase" ? "Aplicar un aumento" : "Aplicar una disminución",
      prompt: `Una medición inicial de ${formatNumber(initial)} unidades ${directionText} ${percent}%. ¿Cuál es la nueva medición?`,
      basis: `${formatNumber(initial)} unidades representan el 100% inicial.`,
      fields: [field("final", "Nueva medición", final, { suffix: "unidades", hint: `Usa el factor ${formatNumber(factor)} o calcula ${percent}% de ${formatNumber(initial)} y luego ${direction === "increase" ? "suma" : "resta"}.` })],
      steps: [`Cambio: ${inlineMath(`${formatNumber(initial)}\\cdot${percent / 100}=${formatNumber(change)}`)}.`, `Nuevo valor: ${inlineMath(`${formatNumber(initial)}${sign === "−" ? "-" : "+"}${formatNumber(change)}=${formatNumber(final)}`)}.`, `Con factor: ${inlineMath(`${formatNumber(initial)}\\cdot${formatNumber(factor)}=${formatNumber(final)}`)}.`],
    };
  }

  if (variant === "rate") {
    return {
      family: "change",
      variant: `${variant}-${direction}`,
      type: "Encontrar el cambio porcentual",
      prompt: `Una medición pasó de ${formatNumber(initial)} a ${formatNumber(final)} unidades. ¿En qué porcentaje ${pastDirectionText}?`,
      basis: `La medición inicial, ${formatNumber(initial)}, es la base que representa 100%.`,
      fields: [field("rate", "Cambio porcentual", percent, { suffix: "%", kind: "percent", hint: `Primero encuentra la diferencia y divídela entre el valor inicial de ${formatNumber(initial)}.` })],
      steps: [`Diferencia: ${inlineMath(`\\left|${formatNumber(final)}-${formatNumber(initial)}\\right|=${formatNumber(change)}`)}.`, `Compara con el inicio: ${inlineMath(`\\frac{${formatNumber(change)}}{${formatNumber(initial)}}\\cdot100=${percent}\\%`)}.`, `<strong>La medición ${pastDirectionText} ${percent}%.</strong>`],
    };
  }

  return {
    family: "change",
    variant: `${variant}-${direction}`,
    type: "Recuperar el valor inicial",
      prompt: `Después de que una medición ${pastDirectionText} ${percent}%, quedó en ${formatNumber(final)} unidades. ¿Cuál era la medición inicial?`,
    basis: `El valor final representa ${formatNumber(factor * 100)}% del valor inicial.`,
    fields: [field("initial", "Medición inicial", initial, { suffix: "unidades", hint: `Para deshacer el cambio, divide ${formatNumber(final)} entre el factor ${formatNumber(factor)}.` })],
    steps: [`El factor aplicado fue ${inlineMath(formatNumber(factor))}.`, `Deshaz el cambio: ${inlineMath(`\\frac{${formatNumber(final)}}{${formatNumber(factor)}}=${formatNumber(initial)}`)}.`, `<strong>La medición inicial era ${formatNumber(initial)} unidades.</strong>`],
  };
}

export function createDiscountQuestion(random = Math.random) {
  const products = ["una mochila", "un par de audífonos", "una calculadora científica", "una chamarra", "una silla de escritorio", "un par de tenis"];
  const product = randomItem(products, random);
  const percent = randomItem([10, 15, 20, 25, 30, 40, 50], random);
  const { total: original, part: discountAmount } = compatiblePair(percent, random, { minimum: 300, maximum: 2400 });
  const final = original - discountAmount;
  const variant = randomItem(["direct", "original", "rate"], random);
  const remainingFactor = 1 - percent / 100;

  if (variant === "direct") {
    return {
      family: "discount",
      variant,
      type: "Calcular descuento y precio final",
      prompt: `El precio de ${product} es ${formatCurrency(original)} y tiene ${percent}% de descuento. Calcula cuánto dinero se descuenta y el precio final.`,
      basis: `El precio original, ${formatCurrency(original)}, representa el 100%.`,
      fields: [
        field("discount", "Dinero descontado", discountAmount, { prefix: "$", kind: "money", hint: `El dinero descontado es ${percent}% del precio original; multiplica ${formatNumber(original)} por ${percent / 100}.` }),
        field("final", "Precio final", final, { prefix: "$", kind: "money", hint: `Resta el dinero descontado al precio original o multiplica por ${formatNumber(remainingFactor)}.` }),
      ],
      steps: [`Dinero descontado: ${inlineMath(`${formatNumber(original)}\\cdot${percent / 100}=${formatNumber(discountAmount)}`)}.`, `Precio final: ${inlineMath(`${formatNumber(original)}-${formatNumber(discountAmount)}=${formatNumber(final)}`)}.`, `<strong>Se descuentan ${formatCurrency(discountAmount)} y se pagan ${formatCurrency(final)}.</strong>`],
    };
  }

  if (variant === "original") {
    return {
      family: "discount",
      variant,
      type: "Recuperar el precio original",
      prompt: `Después de un descuento de ${percent}%, el precio de ${product} es ${formatCurrency(final)}. ¿Cuál era su precio original?`,
      basis: `Después del descuento se conserva ${100 - percent}% del precio original.`,
      fields: [field("original", "Precio original", original, { prefix: "$", kind: "money", hint: `Divide ${formatNumber(final)} entre el factor que quedó: ${formatNumber(remainingFactor)}. No sumes ${percent}% al precio rebajado.` })],
      steps: [`La parte conservada es ${inlineMath(`${100 - percent}\\%=${formatNumber(remainingFactor)}`)}.`, `Precio original: ${inlineMath(`\\frac{${formatNumber(final)}}{${formatNumber(remainingFactor)}}=${formatNumber(original)}`)}.`, `<strong>El precio original era ${formatCurrency(original)}.</strong>`],
    };
  }

  return {
    family: "discount",
    variant,
    type: "Descubrir la tasa de descuento",
    prompt: `El precio de ${product} era ${formatCurrency(original)} y ahora es ${formatCurrency(final)}. ¿Qué porcentaje de descuento se aplicó?`,
    basis: `El descuento se compara con el precio original de ${formatCurrency(original)}.`,
    fields: [field("rate", "Porcentaje de descuento", percent, { suffix: "%", kind: "percent", hint: `Primero resta los precios. Después divide esa diferencia entre ${formatNumber(original)} y multiplica por 100.` })],
    steps: [`Dinero descontado: ${inlineMath(`${formatNumber(original)}-${formatNumber(final)}=${formatNumber(discountAmount)}`)}.`, `Tasa: ${inlineMath(`\\frac{${formatNumber(discountAmount)}}{${formatNumber(original)}}\\cdot100=${percent}\\%`)}.`, `<strong>El descuento fue de ${percent}%.</strong>`],
  };
}

export function createIvaQuestion(random = Math.random) {
  const IVA_RATE = 16;
  const base = randomItem([250, 375, 500, 625, 750, 875, 1000, 1250, 1500, 1750, 2000], random);
  const tax = roundMoney(base * 0.16);
  const total = roundMoney(base + tax);
  const variant = randomItem(["base", "total", "tax", "discount-tax"], random);

  if (variant === "base") {
    return {
      family: "iva",
      variant,
      type: "Calcular IVA desde la base",
      prompt: `Un producto tiene un precio sin IVA de ${formatCurrency(base)}. Calcula el IVA de 16% y el precio total.`,
      basis: `${formatCurrency(base)} es la base y representa 100%; el total representará 116%.`,
      fields: [
        field("tax", "IVA", tax, { prefix: "$", kind: "money", hint: `Multiplica la base de ${formatNumber(base)} por 0.16.` }),
        field("total", "Precio con IVA", total, { prefix: "$", kind: "money", hint: `Suma el IVA a la base o multiplica ${formatNumber(base)} por 1.16.` }),
      ],
      steps: [`IVA: ${inlineMath(`${formatNumber(base)}\\cdot0.16=${formatNumber(tax)}`)}.`, `Total: ${inlineMath(`${formatNumber(base)}+${formatNumber(tax)}=${formatNumber(total)}`)}.`, `<strong>IVA ${formatCurrency(tax)}; total ${formatCurrency(total)}.</strong>`],
    };
  }

  if (variant === "total") {
    return {
      family: "iva",
      variant,
      type: "Recuperar la base desde el total",
      prompt: `El precio con IVA de un producto es ${formatCurrency(total)}. Calcula el precio sin IVA y el IVA incluido.`,
      basis: `El total representa 116% de la base, no 100%.`,
      fields: [
        field("base", "Precio sin IVA", base, { prefix: "$", kind: "money", hint: `Divide el total de ${formatNumber(total)} entre 1.16; restar 16% del total usa una base incorrecta.` }),
        field("tax", "IVA incluido", tax, { prefix: "$", kind: "money", hint: `Después de recuperar la base, resta la base al total.` }),
      ],
      steps: [`Base: ${inlineMath(`\\frac{${formatNumber(total)}}{1.16}=${formatNumber(base)}`)}.`, `IVA incluido: ${inlineMath(`${formatNumber(total)}-${formatNumber(base)}=${formatNumber(tax)}`)}.`, `<strong>Base ${formatCurrency(base)}; IVA ${formatCurrency(tax)}.</strong>`],
    };
  }

  if (variant === "tax") {
    return {
      family: "iva",
      variant,
      type: "Recuperar la base desde el IVA",
      prompt: `En una compra se pagaron ${formatCurrency(tax)} de IVA, equivalentes al 16% de la base. Calcula el precio sin IVA y el total.`,
      basis: `${formatCurrency(tax)} representa 16% del precio base.`,
      fields: [
        field("base", "Precio sin IVA", base, { prefix: "$", kind: "money", hint: `Divide el IVA de ${formatNumber(tax)} entre 0.16.` }),
        field("total", "Precio total", total, { prefix: "$", kind: "money", hint: `Suma el IVA conocido al precio base recuperado.` }),
      ],
      steps: [`Base: ${inlineMath(`\\frac{${formatNumber(tax)}}{0.16}=${formatNumber(base)}`)}.`, `Total: ${inlineMath(`${formatNumber(base)}+${formatNumber(tax)}=${formatNumber(total)}`)}.`, `<strong>Base ${formatCurrency(base)}; total ${formatCurrency(total)}.</strong>`],
    };
  }

  const original = randomItem([500, 1000, 1500, 2000], random);
  const discountRate = randomItem([10, 20, 25, 50], random);
  const discounted = roundMoney(original * (1 - discountRate / 100));
  const discountedTax = roundMoney(discounted * 0.16);
  const discountedTotal = roundMoney(discounted + discountedTax);
  return {
    family: "iva",
    variant,
    type: "Aplicar descuento e IVA",
    prompt: `Un artículo cuesta ${formatCurrency(original)}, recibe ${discountRate}% de descuento y después se agrega 16% de IVA. Calcula el precio descontado, el IVA y el total.`,
    basis: `Primero cambia la base con el descuento; el IVA se calcula sobre el precio ya descontado.`,
    fields: [
      field("discounted", "Precio después del descuento", discounted, { prefix: "$", kind: "money", hint: `Conserva ${100 - discountRate}% del precio original: usa el factor ${formatNumber(1 - discountRate / 100)}.` }),
      field("tax", "IVA sobre el precio descontado", discountedTax, { prefix: "$", kind: "money", hint: `Calcula 16% del precio después del descuento, no del precio original.` }),
      field("total", "Total de la compra", discountedTotal, { prefix: "$", kind: "money", hint: `Suma el precio descontado y el IVA calculado sobre esa nueva base.` }),
    ],
    steps: [`Precio descontado: ${inlineMath(`${formatNumber(original)}\\cdot${formatNumber(1 - discountRate / 100)}=${formatNumber(discounted)}`)}.`, `IVA: ${inlineMath(`${formatNumber(discounted)}\\cdot0.16=${formatNumber(discountedTax)}`)}.`, `Total: ${inlineMath(`${formatNumber(discounted)}+${formatNumber(discountedTax)}=${formatNumber(discountedTotal)}`)}.`],
  };
}

export function numericCandidates(rawValue) {
  const original = String(rawValue ?? "").trim();
  if (!original) return [];
  const clean = original
    .replace(/\s+/g, "")
    .replace(/(?:MXN|mxn|pesos?|unidades?|estudiantes?)/g, "")
    .replace(/[$%]/g, "")
    .replace(/[^0-9,\.\-+]/g, "");
  if (!clean || !/[0-9]/.test(clean)) return [];

  const values = [];
  const add = (candidate) => {
    const value = Number(candidate);
    if (Number.isFinite(value) && !values.some((item) => Object.is(item, value))) values.push(value);
  };

  if (clean.includes(",") && clean.includes(".")) {
    if (clean.lastIndexOf(",") > clean.lastIndexOf(".")) {
      add(clean.replace(/\./g, "").replace(",", "."));
    } else {
      add(clean.replace(/,/g, ""));
    }
  } else if (clean.includes(",")) {
    add(clean.replace(",", "."));
    add(clean.replace(/,/g, ""));
  } else {
    add(clean);
    if ((clean.match(/\./g) ?? []).length === 1) add(clean.replace(".", ""));
  }

  return values;
}

export function answerMatches(rawValue, expected, tolerance = 0.011) {
  return numericCandidates(rawValue).some((value) => Math.abs(value - expected) <= tolerance);
}

export function evaluateQuestion(question, rawAnswers) {
  const results = question.fields.map((item) => {
    const rawValue = rawAnswers[item.id] ?? "";
    const empty = String(rawValue).trim() === "";
    const correct = !empty && answerMatches(rawValue, item.expected, item.kind === "money" ? 0.011 : 0.001);
    return { id: item.id, correct, empty, expected: item.expected, hint: item.hint };
  });
  return { correct: results.every((result) => result.correct), results };
}

function createAnswerField(family, item) {
  const wrapper = document.createElement("div");
  wrapper.className = "answer-field";
  wrapper.dataset.field = item.id;

  const inputId = `${family}-${item.id}`;
  const statusId = `${inputId}-status`;
  const label = document.createElement("label");
  label.htmlFor = inputId;
  label.textContent = item.label;

  const inputUnit = document.createElement("div");
  inputUnit.className = "input-unit";
  if (item.prefix) {
    const prefix = document.createElement("span");
    prefix.textContent = item.prefix;
    inputUnit.append(prefix);
  }

  const input = document.createElement("input");
  input.id = inputId;
  input.name = item.id;
  input.type = "text";
  input.inputMode = "decimal";
  input.autocomplete = "off";
  input.setAttribute("aria-describedby", statusId);
  inputUnit.append(input);

  if (item.suffix) {
    const suffix = document.createElement("span");
    suffix.textContent = item.suffix;
    inputUnit.append(suffix);
  }

  const status = document.createElement("span");
  status.className = "answer-status";
  status.id = statusId;
  status.setAttribute("aria-live", "polite");
  wrapper.append(label, inputUnit, status);
  return wrapper;
}

function setCardState(card, state) {
  card.classList.remove("is-correct", "is-incorrect");
  const stateElement = card.querySelector("[data-state]");
  if (state === "correct") {
    card.classList.add("is-correct");
    stateElement.textContent = "Correcto";
  } else if (state === "incorrect") {
    card.classList.add("is-incorrect");
    stateElement.textContent = "Por corregir";
  } else {
    stateElement.textContent = "Sin comprobar";
  }
}

function renderSolution(element, question) {
  const heading = document.createElement("h4");
  heading.textContent = "Procedimiento de comprobación";
  const list = document.createElement("ol");
  question.steps.forEach((step) => {
    const item = document.createElement("li");
    item.innerHTML = step;
    list.append(item);
  });
  element.replaceChildren(heading, list);
  element.hidden = false;
  renderMath(element);
}

function initialisePractice() {
  const cards = [...document.querySelectorAll("[data-exercise]")];
  if (!cards.length) return;

  const generators = {
    core: createCoreQuestion,
    change: createChangeQuestion,
    discount: createDiscountQuestion,
    iva: createIvaQuestion,
  };
  const state = Object.fromEntries(cards.map((card) => [card.dataset.exercise, { question: null, signature: "", correct: false }]));
  const progressCount = document.querySelector("[data-progress-count]");
  const progressMessage = document.querySelector("[data-progress-message]");

  const updateProgress = () => {
    const correctCount = Object.values(state).filter((item) => item.correct).length;
    progressCount.textContent = `${correctCount} de ${cards.length}`;
    progressMessage.textContent = correctCount === cards.length
      ? "Las cuatro áreas están correctas. Puedes generar otros problemas para confirmar el dominio."
      : correctCount === 0
        ? "Aún no hay ejercicios correctos."
        : `${correctCount} ${correctCount === 1 ? "área resuelta" : "áreas resueltas"}; faltan ${cards.length - correctCount}.`;
  };

  cards.forEach((card) => {
    const family = card.dataset.exercise;
    const form = card.querySelector("[data-form]");
    const questionType = card.querySelector("[data-question-type]");
    const questionText = card.querySelector("[data-question]");
    const basis = card.querySelector("[data-basis]");
    const fields = card.querySelector("[data-fields]");
    const feedback = card.querySelector("[data-feedback]");
    const solution = card.querySelector("[data-solution]");
    const newButton = card.querySelector("[data-new]");

    const renderQuestion = ({ focus = false } = {}) => {
      let nextQuestion = generators[family]();
      let nextSignature = questionSignature(nextQuestion);
      for (let attempt = 0; attempt < 8 && nextSignature === state[family].signature; attempt += 1) {
        nextQuestion = generators[family]();
        nextSignature = questionSignature(nextQuestion);
      }

      state[family] = { question: nextQuestion, signature: nextSignature, correct: false };
      questionType.textContent = nextQuestion.type;
      questionText.textContent = nextQuestion.prompt;
      basis.textContent = nextQuestion.basis;
      fields.replaceChildren(...nextQuestion.fields.map((item) => createAnswerField(family, item)));
      feedback.className = "exercise-feedback";
      feedback.textContent = focus ? `Nuevo ejercicio de ${FAMILY_LABELS[family]} generado.` : "";
      solution.hidden = true;
      solution.replaceChildren();
      setCardState(card, "unanswered");
      updateProgress();
      if (focus) questionText.focus({ preventScroll: true });
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = state[family].question;
      const rawAnswers = Object.fromEntries(new FormData(form).entries());
      const evaluation = evaluateQuestion(question, rawAnswers);
      let correctFields = 0;

      evaluation.results.forEach((result) => {
        const fieldWrapper = fields.querySelector(`[data-field="${result.id}"]`);
        const input = fieldWrapper.querySelector("input");
        const status = fieldWrapper.querySelector(".answer-status");
        fieldWrapper.classList.remove("is-correct", "is-incorrect");
        if (result.correct) {
          correctFields += 1;
          fieldWrapper.classList.add("is-correct");
          input.removeAttribute("aria-invalid");
          status.textContent = "Correcto.";
        } else {
          fieldWrapper.classList.add("is-incorrect");
          input.setAttribute("aria-invalid", "true");
          status.textContent = result.empty ? "Escribe una respuesta antes de comprobar." : result.hint;
        }
      });

      state[family].correct = evaluation.correct;
      setCardState(card, evaluation.correct ? "correct" : "incorrect");
      feedback.className = `exercise-feedback is-${evaluation.correct ? "correct" : "incorrect"}`;
      feedback.textContent = evaluation.correct
        ? "Respuesta correcta. El procedimiento confirma que identificaste y utilizaste la base adecuada."
        : `Hay ${correctFields} de ${question.fields.length} ${question.fields.length === 1 ? "respuesta correcta" : "respuestas correctas"}. Revisa cada campo marcado y vuelve a comprobar.`;
      renderSolution(solution, question);
      updateProgress();
    });

    newButton.addEventListener("click", () => renderQuestion({ focus: true }));
    renderQuestion();
  });
}

if (typeof document !== "undefined") initialisePractice();
