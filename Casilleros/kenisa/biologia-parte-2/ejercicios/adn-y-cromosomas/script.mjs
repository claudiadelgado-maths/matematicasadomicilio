import { views, anatomy, detective, questions } from './datos.mjs';
import { initQuiz } from '../../recursos/repaso.mjs';

const root = document.querySelector('.bio2');
if (root) {
  const el = id => document.getElementById(id);
  const setText = (id, text) => { el(id).textContent = text; };
  function scene(container, image, alt) {
    const svg = container.querySelector('svg');
    svg.setAttribute('aria-label', alt);
    svg.querySelector('use').setAttribute('href', `../../recursos/diagramas.svg?v=20261013a#${image}`);
    svg.classList.remove('scene-change');
    // La animación corta responde a una acción; se omite con movimiento reducido.
    void svg.getBoundingClientRect();
    svg.classList.add('scene-change');
  }
  function feedback(id, message, success = true) {
    setText(id, message);
    el(id).dataset.state = success ? 'success' : 'retry';
  }
  root.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.view;
    const view = views[key];
    root.querySelectorAll('[data-view]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    ['chip', 'title', 'text', 'link', 'caption'].forEach(field => setText(`explorer-${field}`, view[field]));
    scene(el('explorer-figure'), key, view.alt);
  }));

  let replicated = false;
  el('replicate').addEventListener('click', () => {
    replicated = !replicated;
    el('replicate').setAttribute('aria-pressed', String(replicated));
    setText('replicate', replicated ? 'Ver antes de copiar ↶' : 'Replicar el ADN ↗');
    setText('replication-title', replicated ? 'Después de la replicación' : 'Antes de la replicación');
    setText('copy-count', replicated ? '2' : '1');
    setText('copy-label', replicated ? 'moléculas de ADN' : 'molécula de ADN');
    setText('replication-text', replicated ? 'Sigue siendo un cromosoma. Ahora tiene dos cromátidas hermanas, cada una con una copia del ADN, unidas en la región del centrómero.' : 'Este cromosoma todavía no se ha duplicado. Observa qué cambia cuando se copia su ADN.');
    setText('replication-caption', replicated ? 'Una X: un cromosoma duplicado y condensado. El centro claro marca el centrómero.' : 'Cromosoma sin duplicar, representado compacto.');
    scene(el('replication-figure'), replicated ? 'doble' : 'simple', replicated ? 'Un cromosoma duplicado con dos cromátidas hermanas y un centrómero claro.' : 'Un cromosoma sin duplicar con una molécula de ADN.');
  });

  root.querySelectorAll('[data-ploidy]').forEach(button => button.addEventListener('click', () => {
    const diploid = button.dataset.ploidy === 'diploide';
    root.querySelectorAll('[data-ploidy]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    setText('ploidy-title', diploid ? '2n = 6: tres pares' : 'n = 3: un solo juego');
    setText('ploidy-description', diploid ? 'Hay dos juegos: dos cromosomas de cada tipo. Una célula diploide tiene pares de homólogos.' : 'Hay un juego: un cromosoma largo, uno mediano y uno corto. Un juego no tiene que proceder de un único progenitor.');
    scene(el('ploidy-figure'), button.dataset.ploidy, diploid ? 'Modelo diploide: seis cromosomas en tres pares del mismo tamaño.' : 'Modelo haploide: tres cromosomas, uno de cada tamaño, de distintos orígenes.');
  }));

  function practice(prefix, bank, unit) {
    let index = 0;
    let solved = false;
    function render(focus = false) {
      solved = false;
      const item = bank[index];
      setText(`${prefix}-progress`, `${unit} ${index + 1} de ${bank.length}`);
      setText(`${prefix}-question`, item.prompt);
      setText(`${prefix}-feedback`, '');
      el(`${prefix}-next`).hidden = true;
      el(`${prefix}-reset`).hidden = true;
      const options = el(`${prefix}-options`);
      options.replaceChildren();
      item.options.forEach((text, choice) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'option'; button.textContent = text;
        button.addEventListener('click', () => {
          if (solved) return;
          options.querySelectorAll('button').forEach(b => b.classList.remove('retry'));
          if (choice !== item.answer) {
            button.classList.add('retry');
            feedback(`${prefix}-feedback`, `Todavía no. ${item.explanation} Inténtalo de nuevo.`, false);
            return;
          }
          solved = true; button.classList.add('correct');
          options.querySelectorAll('button').forEach(b => { b.disabled = true; });
          const last = index === bank.length - 1;
          feedback(`${prefix}-feedback`, `¡Bien conectado! ${item.explanation}${last ? ' Completaste todas las pistas de esta práctica.' : ''}`);
          el(`${prefix}-next`).hidden = last;
          el(`${prefix}-reset`).hidden = !last;
          // Evita perder el foco al desactivar la opción elegida.
          el(`${prefix}-${last ? 'reset' : 'next'}`).focus({ preventScroll: true });
        });
        options.append(button);
      });
      if (item.image) scene(el(`${prefix}-figure`), item.image, item.alt);
      if (focus) el(`${prefix}-question`).focus({ preventScroll: true });
    }
    el(`${prefix}-next`).addEventListener('click', () => { if (solved && index < bank.length - 1) { index++; render(true); } });
    el(`${prefix}-reset`).addEventListener('click', () => { index = 0; render(true); });
    render();
  }
  practice('anatomy', anatomy, 'Etiqueta');
  practice('detective', detective, 'Pista');

  initQuiz(questions);
}
