(() => {
  const game = document.querySelector("[data-measure-game]");
  if (!game) return;

  const animals = {
    dog: {
      label: "Perro", name: "perro", emoji: "🐶",
      weight: { value: "10 kg", options: ["2 kg", "10 kg", "50 kg"] },
      height: { value: "60 cm", options: ["20 cm", "60 cm", "2 m"] },
    },
    cat: {
      label: "Gato", name: "gato", emoji: "🐱",
      weight: { value: "4 kg", options: ["1 kg", "4 kg", "20 kg"] },
      height: { value: "40 cm", options: ["10 cm", "40 cm", "3 m"] },
    },
    elephant: {
      label: "Elefante bebé", name: "elefante bebé", emoji: "🐘",
      weight: { value: "100 kg", options: ["10 kg", "100 kg", "500 kg"] },
      height: { value: "1 m", options: ["30 cm", "1 m", "8 m"] },
    },
    monkey: {
      label: "Mono", name: "mono", emoji: "🐒",
      weight: { value: "8 kg", options: ["2 kg", "8 kg", "30 kg"] },
      height: { value: "60 cm", options: ["15 cm", "60 cm", "4 m"] },
    },
    mouse: {
      label: "Ratón", name: "ratón", emoji: "🐭",
      weight: { value: "50 g", options: ["10 g", "50 g", "5 kg"] },
      height: { value: "10 cm", options: ["2 cm", "10 cm", "1 m"] },
    },
    rabbit: {
      label: "Conejo", name: "conejo", emoji: "🐰",
      weight: { value: "2 kg", options: ["2 kg", "10 kg", "40 kg"] },
      height: { value: "30 cm", options: ["10 cm", "30 cm", "2 m"] },
    },
    horse: {
      label: "Caballo", name: "caballo", emoji: "🐴",
      weight: { value: "400 kg", options: ["40 kg", "100 kg", "400 kg"] },
      height: { value: "2 m", options: ["20 cm", "1 m", "2 m"] },
    },
    turtle: {
      label: "Tortuga", name: "tortuga", emoji: "🐢",
      weight: { value: "5 kg", options: ["1 kg", "5 kg", "30 kg"] },
      height: { value: "25 cm", options: ["5 cm", "25 cm", "3 m"] },
    },
  };

  const exerciseSets = [
    ["dog", "cat", "elephant", "monkey"],
    ["mouse", "rabbit", "horse", "turtle"],
  ];
  const animalsContainer = game.querySelector("[data-animals]");
  const toolButtons = [...game.querySelectorAll("[data-tool]")];
  const question = game.querySelector("[data-question]");
  const answers = game.querySelector("[data-answers]");
  const feedback = game.querySelector("[data-feedback]");
  const scoreLabel = game.querySelector("[data-score]");
  let setIndex = 0;
  let currentAnimals = exerciseSets[setIndex];
  let animalKey = currentAnimals[0];
  let toolKey = null;
  let score = 0;
  let solved = false;

  const selectAnimal = (key) => {
    animalKey = key;
    toolKey = null;
    solved = false;
    game.querySelectorAll("[data-animal]").forEach((button) => {
      const selected = button.dataset.animal === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    game.querySelector("[data-animal-emoji]").textContent = animals[key].emoji;
    game.querySelector("[data-discovery-label]").textContent = "Ahora usa una herramienta";
    game.querySelector("[data-discovery-value]").textContent = "¿?";
    question.hidden = true;
    toolButtons.forEach((button) => button.classList.remove("is-selected"));
  };

  const renderAnimals = () => {
    animalsContainer.innerHTML = "";
    currentAnimals.forEach((key) => {
      const animal = animals[key];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "animal-button";
      button.dataset.animal = key;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<span aria-hidden="true">${animal.emoji}</span><strong>${animal.label}</strong>`;
      button.addEventListener("click", () => selectAnimal(key));
      animalsContainer.append(button);
    });
  };

  const answerQuestion = (button, option) => {
    if (solved) return;
    const correct = animals[animalKey][toolKey].value;
    if (option === correct) {
      solved = true;
      score += 1;
      scoreLabel.textContent = String(score);
      button.classList.add("is-right");
      feedback.textContent = "¡Lo encontraste! ⭐ El laboratorio confirma tu respuesta.";
      answers.querySelectorAll("button").forEach((answer) => { answer.disabled = true; });
    } else {
      button.classList.add("is-wrong");
      feedback.textContent = "Mira otra vez el número grande de arriba. 👀";
    }
  };

  const useTool = (key) => {
    toolKey = key;
    solved = false;
    const animal = animals[animalKey];
    const measurement = animal[key];
    const isWeight = key === "weight";
    toolButtons.forEach((button) => button.classList.toggle("is-selected", button.dataset.tool === key));
    game.querySelector("[data-discovery-label]").textContent = isWeight
      ? `El ${animal.name} pesa…`
      : `El ${animal.name} mide…`;
    game.querySelector("[data-discovery-value]").textContent = measurement.value;
    game.querySelector("[data-question-text]").textContent = isWeight
      ? `¿Cuánto pesa el ${animal.name}?`
      : `¿Cuánto mide el ${animal.name}?`;
    answers.innerHTML = "";
    measurement.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "measure-answer";
      button.textContent = option;
      button.addEventListener("click", () => answerQuestion(button, option));
      answers.append(button);
    });
    feedback.textContent = "Toca la respuesta que acabas de descubrir.";
    question.hidden = false;
  };

  toolButtons.forEach((button) => button.addEventListener("click", () => useTool(button.dataset.tool)));
  game.querySelector("[data-new-exercises]").addEventListener("click", () => {
    setIndex = (setIndex + 1) % exerciseSets.length;
    currentAnimals = exerciseSets[setIndex];
    animalKey = currentAnimals[0];
    renderAnimals();
    selectAnimal(animalKey);
    game.querySelector("[data-animals] button")?.focus();
  });
  renderAnimals();
  selectAnimal(animalKey);
})();
