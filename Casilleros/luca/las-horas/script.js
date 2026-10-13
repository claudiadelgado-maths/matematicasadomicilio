(() => {
  const game = document.querySelector("[data-clock-game]");
  if (!game) return;

  const challengeSets = [
    [
      { prompt: "Pon el reloj a las 4 🕓", start: null, target: 4 },
      { prompt: "Suma 2 horas. ¿Qué hora será?", start: 3, target: 5 },
      { prompt: "Resta 5 horas. ¿Qué hora será?", start: 8, target: 3 },
      { prompt: "Pon el reloj a las 11 🕚", start: null, target: 11 },
      { prompt: "Suma 3 horas. ¿Qué hora será?", start: 10, target: 1 },
      { prompt: "Resta 4 horas. ¿Qué hora será?", start: 2, target: 10 },
    ],
    [
      { prompt: "Pon el reloj a las 7 🕖", start: null, target: 7 },
      { prompt: "Suma 4 horas. ¿Qué hora será?", start: 1, target: 5 },
      { prompt: "Resta 3 horas. ¿Qué hora será?", start: 12, target: 9 },
      { prompt: "Pon el reloj a las 2 🕑", start: null, target: 2 },
      { prompt: "Suma 5 horas. ¿Qué hora será?", start: 8, target: 1 },
      { prompt: "Resta 6 horas. ¿Qué hora será?", start: 4, target: 10 },
    ],
  ];

  const face = game.querySelector("[data-clock-face]");
  const hand = game.querySelector("[data-hour-hand]");
  const hourButtons = [...game.querySelectorAll("[data-hour]")];
  const selectedLabel = game.querySelector("[data-selected-hour]");
  const feedback = game.querySelector("[data-feedback]");
  const next = game.querySelector("[data-next]");
  const scoreLabel = game.querySelector("[data-score]");
  let setIndex = 0;
  let challenges = challengeSets[setIndex];
  let challengeIndex = 0;
  let selectedHour = 12;
  let score = 0;
  let solved = false;

  const setHour = (hour, check = true) => {
    selectedHour = hour === 0 ? 12 : hour;
    hand.style.transform = `rotate(${selectedHour * 30}deg)`;
    selectedLabel.textContent = String(selectedHour);
    hourButtons.forEach((button) => button.classList.toggle("is-selected", Number(button.dataset.hour) === selectedHour));
    if (check) checkHour();
  };

  const checkHour = () => {
    if (solved) return;
    const target = challenges[challengeIndex].target;
    if (selectedHour === target) {
      solved = true;
      score += 1;
      scoreLabel.textContent = String(score);
      feedback.className = "clock-feedback is-success";
      feedback.textContent = `¡Exacto! La manecilla está en las ${target}. 🎉`;
      next.hidden = false;
    } else {
      feedback.className = "clock-feedback is-error";
      feedback.textContent = "Esa no es todavía. Prueba con otro número. 💜";
    }
  };

  const renderChallenge = () => {
    const challenge = challenges[challengeIndex];
    solved = false;
    game.querySelector("[data-challenge-number]").textContent = String(challengeIndex + 1);
    game.querySelector("[data-prompt]").textContent = challenge.prompt;
    game.querySelector("[data-start]").textContent = challenge.start ? `Son las ${challenge.start}.` : "Mira el reto.";
    feedback.className = "clock-feedback";
    feedback.textContent = "La manecilla te está esperando.";
    next.hidden = true;
    next.textContent = challengeIndex === challenges.length - 1 ? "Jugar otra vez ↻" : "Siguiente reto →";
    setHour(challenge.start ?? 12, false);
  };

  hourButtons.forEach((button) => button.addEventListener("click", () => setHour(Number(button.dataset.hour))));
  face.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    const rect = face.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const degrees = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const normalized = (degrees + 360) % 360;
    const hour = Math.round(normalized / 30) % 12;
    setHour(hour === 0 ? 12 : hour);
  });
  next.addEventListener("click", () => {
    challengeIndex = (challengeIndex + 1) % challenges.length;
    if (challengeIndex === 0) {
      score = 0;
      scoreLabel.textContent = "0";
    }
    renderChallenge();
  });
  game.querySelector("[data-new-exercises]").addEventListener("click", () => {
    setIndex = (setIndex + 1) % challengeSets.length;
    challenges = challengeSets[setIndex];
    challengeIndex = 0;
    score = 0;
    scoreLabel.textContent = "0";
    renderChallenge();
    hourButtons[0]?.focus();
  });
  renderChallenge();
})();
