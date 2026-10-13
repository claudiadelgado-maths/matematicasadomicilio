(() => {
  const challenges = [...document.querySelectorAll('.challenge')];
  const complete = document.querySelector('.game-complete');
  const stars = document.querySelector('#score-stars');
  const scoreText = document.querySelector('#score-text');
  const gameProgress = document.querySelector('#game-progress-bar');
  const restart = document.querySelector('#restart-game');
  const celebration = document.querySelector('#celebration');
  let score = 0;

  // Laboratorio: mueve una recta paralela dentro del triángulo sin usar librerías.
  const slider = document.querySelector('#parallel-slider');
  const movable = document.querySelector('#movable-parallel');
  const leftDot = document.querySelector('#lab-left');
  const rightDot = document.querySelector('#lab-right');
  const scaleReadout = document.querySelector('#scale-readout');
  const ratioReadout = document.querySelector('#ratio-readout');

  function updateLab() {
    if (!slider || !movable) return;
    const t = Number(slider.value) / 100;
    const apexX = 260;
    const apexY = 35;
    const baseY = 355;
    const halfBase = 190;
    const y = apexY + (baseY - apexY) * t;
    const halfWidth = halfBase * t;
    const x1 = apexX - halfWidth;
    const x2 = apexX + halfWidth;
    movable.setAttribute('d', `M${x1.toFixed(1)} ${y.toFixed(1)} H${x2.toFixed(1)}`);
    leftDot?.setAttribute('cx', x1.toFixed(1));
    leftDot?.setAttribute('cy', y.toFixed(1));
    rightDot?.setAttribute('cx', x2.toFixed(1));
    rightDot?.setAttribute('cy', y.toFixed(1));
    if (scaleReadout) scaleReadout.textContent = `${Math.round(t * 100)}%`;
    if (ratioReadout) ratioReadout.textContent = t.toFixed(2);
  }
  slider?.addEventListener('input', updateLab);
  updateLab();

  // Ejemplo guiado: revela el razonamiento un paso a la vez.
  const guidedSteps = [...document.querySelectorAll('#guided-steps [data-step]')];
  const nextStep = document.querySelector('#next-step');
  const stepProgress = document.querySelector('#step-progress-bar');
  let visibleSteps = 1;

  function updateGuidedSteps() {
    guidedSteps.forEach((step, index) => {
      const visible = index < visibleSteps;
      step.classList.toggle('is-visible', visible);
      step.classList.toggle('is-current', index === visibleSteps - 1);
    });
    if (stepProgress) stepProgress.style.width = `${(visibleSteps / guidedSteps.length) * 100}%`;
    if (nextStep) {
      if (visibleSteps >= guidedSteps.length) {
        nextStep.innerHTML = 'Listo: x = 12 <span aria-hidden="true">✓</span>';
        nextStep.disabled = true;
      } else {
        nextStep.innerHTML = 'Ver siguiente paso <span aria-hidden="true">→</span>';
      }
    }
  }

  nextStep?.addEventListener('click', () => {
    if (visibleSteps < guidedSteps.length) visibleSteps += 1;
    updateGuidedSteps();
  });
  updateGuidedSteps();

  function updateScore() {
    stars.textContent = `${'★ '.repeat(score)}${'☆ '.repeat(3 - score)}`.trim();
    scoreText.textContent = `${score} de 3 retos`;
    if (gameProgress) gameProgress.style.width = `${(score / 3) * 100}%`;
  }

  function launchCelebration() {
    if (!celebration || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    celebration.replaceChildren();
    for (let i = 0; i < 24; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.left = `${4 + ((i * 37) % 92)}%`;
      piece.style.setProperty('--drift', `${((i % 7) - 3) * 18}px`);
      piece.style.animationDelay = `${(i % 6) * 0.07}s`;
      celebration.appendChild(piece);
    }
  }

  function reset() {
    score = 0;
    challenges.forEach((challenge, index) => {
      challenge.hidden = index !== 0;
      challenge.querySelectorAll('button[data-answer]').forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'incorrect');
      });
      challenge.querySelector('.feedback').textContent = '';
    });
    complete.hidden = true;
    celebration?.replaceChildren();
    updateScore();
  }

  challenges.forEach((challenge, index) => {
    challenge.querySelectorAll('button[data-answer]').forEach(button => {
      button.addEventListener('click', () => {
        const feedback = challenge.querySelector('.feedback');
        if (button.hasAttribute('data-correct')) {
          challenge.querySelectorAll('button[data-answer]').forEach(item => item.disabled = true);
          button.classList.add('correct');
          feedback.textContent = index === 2
            ? '¡Eso! Cerraste el laboratorio: x = 14.'
            : '¡Correcto! Muy bien: comparaste segmentos correspondientes.';
          score += 1;
          updateScore();
          window.setTimeout(() => {
            challenge.hidden = true;
            if (index + 1 < challenges.length) {
              challenges[index + 1].hidden = false;
              challenges[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              complete.hidden = false;
              launchCelebration();
              complete.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 650);
        } else {
          button.classList.add('incorrect');
          button.disabled = true;
          feedback.textContent = 'Casi. Revisa qué segmentos ocupan la misma posición e inténtalo otra vez.';
        }
      });
    });
  });

  restart?.addEventListener('click', () => {
    reset();
    document.querySelector('#juego')?.scrollIntoView({ behavior: 'smooth' });
  });

  updateScore();
})();
