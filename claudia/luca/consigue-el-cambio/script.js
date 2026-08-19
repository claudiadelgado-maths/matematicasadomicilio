(() => {
  const game = document.querySelector("[data-shop-game]");
  if (!game) return;

  const products = {
    apple: { label: "Manzana", name: "La manzana", emoji: "🍎", cost: 2, paid: 5, answers: [1, 3, 5] },
    juice: { label: "Zumo", name: "El zumo", emoji: "🧃", cost: 3, paid: 5, answers: [1, 2, 4] },
    bear: { label: "Osito", name: "El osito", emoji: "🧸", cost: 5, paid: 10, answers: [2, 5, 8] },
    banana: { label: "Plátano", name: "El plátano", emoji: "🍌", cost: 1, paid: 5, answers: [2, 3, 4] },
    pencil: { label: "Lápiz", name: "El lápiz", emoji: "✏️", cost: 2, paid: 10, answers: [5, 8, 9] },
    ball: { label: "Pelota", name: "La pelota", emoji: "⚽", cost: 4, paid: 10, answers: [4, 5, 6] },
    notebook: { label: "Cuaderno", name: "El cuaderno", emoji: "📒", cost: 3, paid: 10, answers: [5, 7, 8] },
    cookie: { label: "Galleta", name: "La galleta", emoji: "🍪", cost: 2, paid: 5, answers: [1, 2, 3] },
    car: { label: "Coche", name: "El coche", emoji: "🚗", cost: 6, paid: 10, answers: [2, 4, 6] },
  };

  const exerciseSets = [
    ["apple", "juice", "bear"],
    ["banana", "pencil", "ball"],
    ["notebook", "cookie", "car"],
  ];
  const productsContainer = game.querySelector("[data-products]");
  const answers = game.querySelector("[data-answers]");
  const feedback = game.querySelector("[data-feedback]");
  const next = game.querySelector("[data-next]");
  const scoreLabel = game.querySelector("[data-score]");
  let setIndex = 0;
  let currentKeys = exerciseSets[setIndex];
  let currentKey = currentKeys[0];
  let score = 0;
  let solved = false;

  const setText = (selector, value) => {
    const node = game.querySelector(selector);
    if (node) node.textContent = value;
  };

  const chooseAnswer = (button, amount) => {
    if (solved) return;
    const product = products[currentKey];
    const correct = product.paid - product.cost;
    if (amount === correct) {
      solved = true;
      score += 1;
      scoreLabel.textContent = String(score);
      button.classList.add("is-right");
      feedback.className = "game-feedback is-success";
      feedback.textContent = `¡Sí! ${product.paid} € menos ${product.cost} € deja ${correct} €. 🎉`;
      next.hidden = false;
      answers.querySelectorAll("button").forEach((answer) => { answer.disabled = true; });
      return;
    }
    button.classList.add("is-wrong");
    feedback.className = "game-feedback is-error";
    feedback.textContent = "Casi. Cuenta otra vez las monedas. 💛";
  };

  const render = (key, focusAnswer = false) => {
    currentKey = key;
    solved = false;
    const product = products[key];
    setText("[data-product-emoji]", product.emoji);
    setText("[data-product-name]", product.name);
    setText("[data-cost]", `${product.cost} €`);
    setText("[data-paid]", `${product.paid} €`);
    feedback.className = "game-feedback";
    feedback.textContent = "Toca una moneda.";
    next.hidden = true;
    answers.innerHTML = "";
    product.answers.forEach((amount) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = `${amount} €`;
      button.addEventListener("click", () => chooseAnswer(button, amount));
      answers.append(button);
    });
    game.querySelectorAll("[data-product]").forEach((button) => {
      const selected = button.dataset.product === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (focusAnswer) answers.querySelector("button")?.focus();
  };

  const renderProducts = () => {
    productsContainer.innerHTML = "";
    currentKeys.forEach((key) => {
      const product = products[key];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-button";
      button.dataset.product = key;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<span aria-hidden="true">${product.emoji}</span><strong>${product.label}</strong><small>${product.cost} €</small>`;
      button.addEventListener("click", () => render(key));
      productsContainer.append(button);
    });
  };

  next.addEventListener("click", () => {
    render(currentKeys[(currentKeys.indexOf(currentKey) + 1) % currentKeys.length], true);
  });
  game.querySelector("[data-new-exercises]").addEventListener("click", () => {
    setIndex = (setIndex + 1) % exerciseSets.length;
    currentKeys = exerciseSets[setIndex];
    currentKey = currentKeys[0];
    renderProducts();
    render(currentKey, true);
  });
  renderProducts();
  render(currentKey);
})();
