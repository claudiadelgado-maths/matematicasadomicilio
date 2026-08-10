import { renderLatex } from "../../matematicas.mjs";

export const TAX_RATES = Object.freeze([10, 12, 16, 19, 21]);
export const DEFAULT_TAX_RATE = 16;
export const TARGET_SCORE = 4;
export const MAX_MISTAKES = 3;
export const STARTING_HINTS = 2;

export const PRODUCTS = Object.freeze([
  { id: "audifonos", name: "Audífonos cósmicos", emoji: "🎧", priceCents: 25000, discountRate: 20, tone: "violet" },
  { id: "mochila", name: "Mochila exploradora", emoji: "🎒", priceCents: 30000, discountRate: 25, tone: "coral" },
  { id: "tenis", name: "Tenis relámpago", emoji: "👟", priceCents: 40000, discountRate: 25, tone: "blue" },
  { id: "videojuego", name: "Videojuego galáctico", emoji: "🎮", priceCents: 50000, discountRate: 20, tone: "mint" },
  { id: "lampara", name: "Lámpara lunar", emoji: "💡", priceCents: 25000, discountRate: 10, tone: "yellow" },
  { id: "sudadera", name: "Sudadera pixel", emoji: "🧥", priceCents: 32000, discountRate: 25, tone: "violet" },
  { id: "planta", name: "Planta miniatura", emoji: "🪴", priceCents: 12500, discountRate: 20, tone: "mint" },
  { id: "patineta", name: "Patineta urbana", emoji: "🛹", priceCents: 30000, discountRate: 10, tone: "coral" },
  { id: "camara", name: "Cámara instantánea", emoji: "📷", priceCents: 60000, discountRate: 25, tone: "blue" },
  { id: "termo", name: "Termo aventurero", emoji: "🥤", priceCents: 20000, discountRate: 10, tone: "yellow" }
]);

export const AUDITABLE_KEYS = Object.freeze(["subtotal", "tax", "total"]);

const LINE_LABELS = {
  subtotal: "Después del descuento",
  tax: "IVA",
  total: "Total"
};

const MONEY_CARD = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const MONEY_TICKET = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const MATH_NUMBER = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

export function shuffle(values, random = Math.random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

export function pickTaxRate(random = Math.random) {
  return TAX_RATES[Math.floor(random() * TAX_RATES.length)];
}

export function calculateTicket(product, taxRate = DEFAULT_TAX_RATE) {
  const original = product.priceCents;
  const discount = Math.round(original * product.discountRate / 100);
  const subtotal = original - discount;
  const tax = Math.round(subtotal * taxRate / 100);
  const total = subtotal + tax;
  return { original, discount, subtotal, tax, total };
}

export function createTicket(product, { hasError = false, errorKey = null, taxRate = DEFAULT_TAX_RATE, random = Math.random } = {}) {
  const canonical = calculateTicket(product, taxRate);
  const display = { ...canonical };
  let selectedErrorKey = null;

  if (hasError) {
    selectedErrorKey = AUDITABLE_KEYS.includes(errorKey)
      ? errorKey
      : AUDITABLE_KEYS[Math.floor(random() * AUDITABLE_KEYS.length)];
    const correctValue = canonical[selectedErrorKey];
    const possibleDeltas = correctValue <= 2000 ? [300, 500] : [500, 1000];
    const delta = possibleDeltas[Math.floor(random() * possibleDeltas.length)];
    const subtract = random() < 0.5 && correctValue > delta;
    display[selectedErrorKey] = correctValue + (subtract ? -delta : delta);
  }

  return { product, taxRate, canonical, display, hasError, errorKey: selectedErrorKey };
}

export function createTicketPattern(random = Math.random) {
  return shuffle([false, false, false, true, true, true], random);
}

export function pickProducts(previousProductId = "", random = Math.random) {
  const available = PRODUCTS.filter((product) => product.id !== previousProductId);
  return shuffle(available, random).slice(0, 3);
}

function formatMoney(cents, ticket = false) {
  return (ticket ? MONEY_TICKET : MONEY_CARD).format(cents / 100);
}

function formatMathNumber(cents) {
  return MATH_NUMBER.format(cents / 100).replace(/,/g, "{,}");
}

function createElement(tagName, className = "", text = "") {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== "") element.textContent = text;
  return element;
}

function explainTicket(ticket) {
  const { product, taxRate, canonical, display, errorKey } = ticket;
  const latexRows = [
    `S&=${formatMathNumber(canonical.original)}\\left(1-\\frac{${product.discountRate}}{100}\\right)=${formatMathNumber(canonical.subtotal)}`,
    `I&=${formatMathNumber(canonical.subtotal)}\\cdot\\frac{${taxRate}}{100}=${formatMathNumber(canonical.tax)}`,
    `T&=${formatMathNumber(canonical.subtotal)}+${formatMathNumber(canonical.tax)}=${formatMathNumber(canonical.total)}`
  ];
  const latex = `\\begin{aligned}${latexRows.join("\\\\[0.45em]")}\\end{aligned}`;

  if (!ticket.hasError) {
    return {
      text: `Las tres líneas coinciden: quedan ${formatMoney(canonical.subtotal)}, el IVA ficticio es ${formatMoney(canonical.tax)} y el total es ${formatMoney(canonical.total)}.`,
      latex,
      label: "Comprobación correcta del descuento, el IVA y el total"
    };
  }

  const shown = formatMoney(display[errorKey]);
  const correct = formatMoney(canonical[errorKey]);
  return {
    text: `La línea alterada era ${LINE_LABELS[errorKey]}: debía mostrar ${correct}, no ${shown}.`,
    latex,
    label: `Cálculo correcto; la línea alterada era ${LINE_LABELS[errorKey]}`
  };
}

function initialiseTicketGame() {
  const game = document.querySelector("[data-ticket-game]");
  if (!game) return;

  const screens = Object.fromEntries([...game.querySelectorAll("[data-screen]")].map((screen) => [screen.dataset.screen, screen]));
  const roundElement = game.querySelector("[data-round]");
  const scoreElement = game.querySelector("[data-score]");
  const opportunitiesElement = game.querySelector("[data-opportunities]");
  const opportunitiesVisual = game.querySelector("[data-opportunities-visual]");
  const hintsElement = game.querySelector("[data-hints]");
  const statusElement = game.querySelector("[data-game-status]");
  const progressItems = [...game.querySelectorAll("[data-progress] li")];
  const productGrid = game.querySelector("[data-product-grid]");
  const shopTitle = game.querySelector("[data-shop-title]");
  const purchaseEmoji = game.querySelector("[data-purchase-emoji]");
  const purchaseName = game.querySelector("[data-purchase-name]");
  const purchasePrice = game.querySelector("[data-purchase-price]");
  const purchaseRate = game.querySelector("[data-purchase-rate]");
  const ticketNumber = game.querySelector("[data-ticket-number]");
  const ticketTaxLabel = game.querySelector("[data-ticket-tax-label]");
  const receipt = game.querySelector("[data-receipt]");
  const receiptProduct = game.querySelector("[data-receipt-product]");
  const receiptOriginal = game.querySelector("[data-receipt-original]");
  const ticketLines = game.querySelector("[data-ticket-lines]");
  const auditStep = game.querySelector("[data-audit-step]");
  const auditTitle = game.querySelector("[data-audit-title]");
  const auditInstruction = game.querySelector("[data-audit-instruction]");
  const decisions = game.querySelector("[data-decisions]");
  const locatePanel = game.querySelector("[data-locate-panel]");
  const hintButton = game.querySelector("[data-hint]");
  const hintMessage = game.querySelector("[data-hint-message]");
  const resultScreen = screens.result;
  const resultSymbol = game.querySelector("[data-result-symbol]");
  const resultKicker = game.querySelector("[data-result-kicker]");
  const resultTitle = game.querySelector("[data-result-title]");
  const resultMessage = game.querySelector("[data-result-message]");
  const resultExplanation = game.querySelector("[data-result-explanation]");
  const nextRoundButton = game.querySelector("[data-next-round]");
  const endScreen = screens.end;
  const endSymbol = game.querySelector("[data-end-symbol]");
  const endKicker = game.querySelector("[data-end-kicker]");
  const endTitle = game.querySelector("[data-end-title]");
  const endMessage = game.querySelector("[data-end-message]");
  const endSummary = game.querySelector("[data-end-summary]");

  const state = {
    score: 0,
    mistakes: 0,
    hints: STARTING_HINTS,
    round: 0,
    pattern: [],
    options: [],
    previousProductId: "",
    previousErrorKey: "",
    ticket: null,
    hintUsed: false,
    terminal: false
  };

  const showScreen = (name, focusTarget = null) => {
    Object.entries(screens).forEach(([screenName, screen]) => {
      screen.hidden = screenName !== name;
    });
    if (focusTarget) requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
  };

  const updateHud = () => {
    const remaining = MAX_MISTAKES - state.mistakes;
    roundElement.textContent = state.round ? `${state.round} / 6` : "Lista";
    scoreElement.textContent = `${state.score} / ${TARGET_SCORE}`;
    opportunitiesElement.textContent = `${remaining} de ${MAX_MISTAKES}`;
    opportunitiesVisual.textContent = `${"♥ ".repeat(remaining)}${"♡ ".repeat(state.mistakes)}`.trim();
    hintsElement.textContent = String(state.hints);
    progressItems.forEach((item, index) => item.classList.toggle("is-earned", index < state.score));
    hintButton.disabled = state.hints === 0 || state.hintUsed;
    hintButton.textContent = state.hintUsed ? "Pista utilizada" : state.hints ? `Usar una pista (${state.hints})` : "Sin pistas disponibles";
  };

  const resetState = () => {
    state.score = 0;
    state.mistakes = 0;
    state.hints = STARTING_HINTS;
    state.round = 0;
    state.pattern = [];
    state.options = [];
    state.previousProductId = "";
    state.previousErrorKey = "";
    state.ticket = null;
    state.hintUsed = false;
    state.terminal = false;
    hintMessage.hidden = true;
    hintMessage.textContent = "";
    updateHud();
    statusElement.textContent = "Partida reiniciada. Inicia la misión cuando quieras.";
    showScreen("intro", game.querySelector("[data-intro-title]"));
  };

  const renderProducts = () => {
    productGrid.replaceChildren();
    state.options.forEach((product) => {
      const button = createElement("button", `product-card product-${product.tone}`);
      button.type = "button";
      button.dataset.productId = product.id;
      button.setAttribute("aria-label", `${product.name}: cantidad original ${formatMoney(product.priceCents)}, descuento ${product.discountRate}%`);
      const art = createElement("span", "product-art", product.emoji);
      art.setAttribute("aria-hidden", "true");
      const badge = createElement("span", "product-discount", `−${product.discountRate}%`);
      const name = createElement("strong", "", product.name);
      const priceLabel = createElement("small", "", "Cantidad original");
      const price = createElement("b", "", formatMoney(product.priceCents));
      const action = createElement("i", "", "Elegir compra →");
      button.append(art, badge, name, priceLabel, price, action);
      button.addEventListener("click", () => selectProduct(product));
      productGrid.append(button);
    });
  };

  const startNextRound = () => {
    state.round += 1;
    state.options = pickProducts(state.previousProductId);
    state.ticket = null;
    state.hintUsed = false;
    hintMessage.hidden = true;
    hintMessage.textContent = "";
    updateHud();
    renderProducts();
    statusElement.textContent = `Ronda ${state.round}. Elige uno de los tres productos.`;
    showScreen("shop", shopTitle);
  };

  const addReceiptLine = (key, interactive) => {
    const value = state.ticket.display[key];
    const row = createElement(interactive ? "button" : "div", `receipt-line receipt-line-${key}`);
    row.dataset.lineKey = key;
    row.dataset.cents = String(value);
    if (interactive) {
      row.type = "button";
      row.setAttribute("aria-label", `Señalar ${LINE_LABELS[key]} como la línea alterada: ${formatMoney(value, true)}`);
      row.addEventListener("click", () => evaluateLocation(key));
    }
    const labelText = key === "discount"
      ? `Descuento ${state.ticket.product.discountRate}%`
      : key === "tax" ? `IVA ${state.ticket.taxRate}%` : LINE_LABELS[key];
    const label = createElement("span", "", labelText);
    const amount = createElement("strong", "", `${key === "discount" ? "−" : key === "tax" ? "+" : ""}${formatMoney(value, true)}`);
    row.append(label, amount);
    if (interactive) row.append(createElement("small", "", "Señalar esta línea"));
    ticketLines.append(row);
  };

  const renderReceipt = (interactive = false) => {
    ticketLines.replaceChildren();
    receipt.classList.toggle("is-selecting", interactive);
    receipt.dataset.originalCents = String(state.ticket.canonical.original);
    receipt.dataset.discountRate = String(state.ticket.product.discountRate);
    receipt.dataset.taxRate = String(state.ticket.taxRate);
    AUDITABLE_KEYS.forEach((key) => addReceiptLine(key, interactive));
  };

  const selectProduct = (product) => {
    state.previousProductId = product.id;
    const hasError = state.pattern[state.round - 1];
    const availableErrorKeys = AUDITABLE_KEYS.filter((key) => key !== state.previousErrorKey);
    const errorKey = hasError ? availableErrorKeys[Math.floor(Math.random() * availableErrorKeys.length)] : null;
    const taxRate = pickTaxRate();
    state.previousErrorKey = errorKey ?? state.previousErrorKey;
    state.ticket = createTicket(product, { hasError, errorKey, taxRate });

    purchaseEmoji.textContent = product.emoji;
    purchaseName.textContent = product.name;
    purchasePrice.textContent = formatMoney(product.priceCents);
    purchaseRate.textContent = `${product.discountRate}%`;
    ticketNumber.textContent = `TICKET ${String(state.round).padStart(4, "0")}`;
    ticketTaxLabel.textContent = `Tasa ficticia del juego · IVA ${taxRate}%`;
    receiptProduct.textContent = product.name;
    receiptOriginal.textContent = formatMoney(product.priceCents, true);
    auditStep.textContent = "Paso 2 · Da tu dictamen";
    auditTitle.textContent = "¿Este ticket está correcto?";
    auditInstruction.textContent = "Compara la cantidad después del descuento, el IVA y el total.";
    decisions.hidden = false;
    locatePanel.hidden = true;
    hintMessage.hidden = true;
    renderReceipt(false);
    updateHud();
    statusElement.textContent = `Ticket ${state.round} preparado. Decide si las tres líneas coinciden.`;
    showScreen("audit", auditTitle);
  };

  const finishRound = (success, message) => {
    if (success) state.score += 1;
    else state.mistakes += 1;
    state.terminal = state.score >= TARGET_SCORE || state.mistakes >= MAX_MISTAKES;
    updateHud();

    resultScreen.classList.toggle("is-success", success);
    resultScreen.classList.toggle("is-miss", !success);
    resultSymbol.textContent = success ? "★" : "↻";
    resultKicker.textContent = success ? "Dictamen correcto" : "Aprendizaje registrado";
    resultTitle.textContent = success ? "¡Sello conseguido!" : "Esta vez se escapó un detalle";
    resultMessage.textContent = message;
    const explanation = explainTicket(state.ticket);
    const explanationText = createElement("p", "", explanation.text);
    const explanationMath = createElement("div", "result-math");
    resultExplanation.replaceChildren(explanationText, explanationMath);
    renderLatex(explanationMath, explanation.latex, { display: true, label: explanation.label });
    nextRoundButton.textContent = state.terminal ? "Ver resultado de la misión" : "Siguiente compra";
    statusElement.textContent = success
      ? `Respuesta correcta. Llevas ${state.score} de ${TARGET_SCORE} sellos.`
      : `Respuesta incorrecta. Te quedan ${MAX_MISTAKES - state.mistakes} oportunidades.`;
    showScreen("result", resultTitle);
  };

  const handleDecision = (decision) => {
    if (decision === "correct") {
      if (state.ticket.hasError) {
        finishRound(false, "Aceptaste el ticket, pero una de sus líneas había sido alterada.");
      } else {
        finishRound(true, "Revisaste la cadena completa y aceptaste un ticket que sí estaba bien calculado.");
      }
      return;
    }

    if (!state.ticket.hasError) {
      finishRound(false, "Presentaste una reclamación, pero todas las operaciones del ticket eran correctas.");
      return;
    }

    auditStep.textContent = "Paso 3 · Localiza el error";
    auditTitle.textContent = "¿Qué línea fue alterada?";
    auditInstruction.textContent = "Haz clic en la cantidad después del descuento, el IVA o el total que no coincide.";
    decisions.hidden = true;
    locatePanel.hidden = false;
    renderReceipt(true);
    statusElement.textContent = "La reclamación procede. Selecciona una línea del ticket.";
    requestAnimationFrame(() => auditTitle.focus({ preventScroll: true }));
  };

  function evaluateLocation(key) {
    if (key === state.ticket.errorKey) {
      finishRound(true, `Encontraste la línea alterada: ${LINE_LABELS[key]}. La reclamación fue aceptada.`);
    } else {
      finishRound(false, `La línea ${LINE_LABELS[key]} estaba bien. El dato alterado se encontraba en ${LINE_LABELS[state.ticket.errorKey]}.`);
    }
  }

  const useHint = () => {
    if (state.hints <= 0 || state.hintUsed || !state.ticket) return;
    state.hints -= 1;
    state.hintUsed = true;
    const { product, canonical, taxRate } = state.ticket;
    const remainingRate = 100 - product.discountRate;
    const hintText = createElement("p", "", `Atajo: después del descuento queda ${remainingRate}%. Luego aplica la tasa ficticia de ${taxRate}% a esa cantidad.`);
    const hintMath = createElement("div", "hint-math");
    hintMessage.replaceChildren(hintText, hintMath);
    renderLatex(
      hintMath,
      `S=${formatMathNumber(canonical.original)}\\cdot\\frac{${remainingRate}}{100}=${formatMathNumber(canonical.subtotal)}\\qquad I=${formatMathNumber(canonical.subtotal)}\\cdot\\frac{${taxRate}}{100}`,
      { display: true, label: "Atajo para calcular la cantidad descontada y el IVA ficticio" }
    );
    hintMessage.hidden = false;
    updateHud();
    statusElement.textContent = `Pista utilizada. Te queda${state.hints === 1 ? "" : "n"} ${state.hints} ${state.hints === 1 ? "pista" : "pistas"}.`;
  };

  const showEnding = () => {
    const won = state.score >= TARGET_SCORE;
    endScreen.classList.toggle("is-victory", won);
    endScreen.classList.toggle("is-defeat", !won);
    endSymbol.textContent = won ? "★" : "⌕";
    endKicker.textContent = won ? "Misión cumplida" : "La tienda cerró por hoy";
    endTitle.textContent = won ? "¡Eres Auditor Estrella!" : "Casi obtienes la credencial";
    endMessage.textContent = won
      ? "Conseguiste cuatro dictámenes correctos y demostraste que sabes conectar descuento, subtotal, IVA y total."
      : "Usaste tus tres oportunidades, pero cada ticket revisado dejó una pista útil para la siguiente partida.";
    endSummary.textContent = `${state.score} sellos · ${state.round} tickets revisados · ${state.hints} ${state.hints === 1 ? "pista disponible" : "pistas disponibles"}`;
    statusElement.textContent = won ? "Victoria: credencial de Auditor Estrella conseguida." : "Fin de la partida. Puedes comenzar de nuevo inmediatamente.";
    showScreen("end", endTitle);
  };

  const startGame = () => {
    state.score = 0;
    state.mistakes = 0;
    state.hints = STARTING_HINTS;
    state.round = 0;
    state.pattern = createTicketPattern();
    state.previousProductId = "";
    state.previousErrorKey = "";
    state.terminal = false;
    updateHud();
    startNextRound();
  };

  game.querySelector("[data-start]").addEventListener("click", startGame);
  game.querySelector("[data-restart]").addEventListener("click", resetState);
  game.querySelector("[data-play-again]").addEventListener("click", startGame);
  game.querySelectorAll("[data-decision]").forEach((button) => button.addEventListener("click", () => handleDecision(button.dataset.decision)));
  hintButton.addEventListener("click", useHint);
  nextRoundButton.addEventListener("click", () => state.terminal ? showEnding() : startNextRound());

  updateHud();
}

if (typeof document !== "undefined") {
  initialiseTicketGame();
}
