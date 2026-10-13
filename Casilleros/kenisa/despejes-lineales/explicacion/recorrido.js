(() => {
  const course = document.querySelector('.despeje-course');
  if (!course) return;
  const render = (node) => {
    if (globalThis.katex) globalThis.katex.render(node.dataset.tex, node, { throwOnError:false, strict:'ignore', output:'htmlAndMathml' });
  };
  course.querySelectorAll('[data-tex]').forEach(render);
  course.querySelectorAll('[data-walk]').forEach((panel) => {
    const steps = [...panel.querySelectorAll('.equation-steps li')];
    const next = panel.querySelector('[data-next]');
    const status = panel.querySelector('[data-step-status]');
    let current = 0;
    panel.querySelector('.walk-actions').hidden = false;
    const update = () => {
      steps.forEach((step, i) => { step.hidden = i > current; });
      next.disabled = current === steps.length - 1;
      next.textContent = next.disabled ? 'Ejemplo completo' : 'Ver el siguiente paso';
      status.textContent = `Paso ${current + 1} de ${steps.length}. ${steps[current].querySelector('p').textContent}`;
    };
    next.addEventListener('click', () => { current = Math.min(current + 1, steps.length - 1); update(); });
    panel.querySelector('[data-reset]').addEventListener('click', () => { current = 0; update(); next.focus(); });
    update();
  });
  course.querySelectorAll('[data-quiz]').forEach((quiz) => {
    const buttons = [...quiz.querySelectorAll('button')];
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed','false');
      button.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed',String(b === button)));
        const correct = button.dataset.correct === 'true';
        const feedback = quiz.querySelector('.feedback');
        feedback.dataset.result = correct ? 'correct' : 'incorrect';
        feedback.textContent = `${correct ? '¡Bien! ' : 'Inténtalo otra vez. '}${button.dataset.feedback}`;
      });
    });
  });
  const balance = course.querySelector('[data-balance]');
  if (balance) {
    const input = balance.querySelector('input');
    const update = () => {
      const x = Number(input.value), left = x + 3, difference = left - 7;
      balance.querySelector('output').value = String(x);
      balance.querySelector('[data-left]').textContent = String(left);
      const drawing = balance.querySelector('.balance');
      drawing.style.setProperty('--tilt',`${-difference * 3}deg`);
      drawing.style.setProperty('--left-offset',`${difference * 4}px`);
      drawing.style.setProperty('--right-offset',`${-difference * 4}px`);
      drawing.setAttribute('aria-label',`Izquierda ${left}, derecha 7. ${difference === 0 ? 'Balanza equilibrada.' : 'Balanza desequilibrada.'}`);
      const status = balance.querySelector('[data-balance-status]');
      status.textContent = difference === 0 ? '¡Equilibrio! 4 + 3 = 7. Encontraste x = 4.' : `Izquierda: ${left}. Derecha: 7. ${difference < 0 ? 'Aumenta' : 'Disminuye'} x para igualarlas.`;
    };
    input.addEventListener('input',update);
    update();
  }
  const verify = course.querySelector('[data-verify]');
  if (verify) verify.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = verify.elements.respuesta;
    if (!input.reportValidity()) return;
    const x = Number(input.value);
    if (!Number.isFinite(x)) return;
    const left = 2*x+3;
    const output = course.querySelector('[data-verification]');
    const equation = document.createElement('span');
    equation.className = 'math';
    equation.dataset.tex = `2\\cdot(${x})+3=${left}${left === 11 ? '=' : '\\ne'}11`;
    equation.textContent = equation.dataset.tex;
    const message = document.createElement('p');
    message.textContent = left === 11 ? '¡Funciona! x = 4 satisface la ecuación original.' : `Todavía no: el lado izquierdo vale ${left}, no 11. Prueba otro valor.`;
    output.replaceChildren(equation,message);
    render(equation);
  });
})();
