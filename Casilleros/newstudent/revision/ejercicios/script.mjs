import { grade } from './matematicas.mjs';

const root = document.querySelector('.diagnostic-site');
if (root) {
  const key = 'newstudent-revision-v1';
  const forms = [...root.querySelectorAll('[data-exercise]')];
  const areas = ['aritmetica', 'algebra', 'geometria'];
  let current = 'aritmetica';
  let storageAvailable = true;
  const inputs = form => [...form.querySelectorAll('input')];
  const answered = form => inputs(form).every(input => input.value.trim());
  const storageMessage = () => {
    root.querySelector('#save-status').textContent = storageAvailable
      ? 'Respuestas guardadas en este navegador.'
      : 'No se pudo guardar en este navegador. Mantén abierta esta página.';
  };
  const save = () => {
    const answers = Object.fromEntries(forms.map(form => [form.dataset.exercise, inputs(form).map(input => input.value)]));
    try { localStorage.setItem(key, JSON.stringify({ version: 1, area: current, answers })); storageAvailable = true; }
    catch { storageAvailable = false; }
    storageMessage();
  };
  const progress = () => {
    root.querySelector('#overall-progress').textContent = `${forms.filter(answered).length} de ${forms.length} ejercicios respondidos`;
    for (const area of areas) {
      const activity = root.querySelector(`#${area}`);
      const exercises = [...activity.querySelectorAll('form')];
      activity.querySelector('[data-area-progress]').textContent = `${exercises.filter(answered).length} de ${exercises.length} respondidos`;
    }
  };
  const check = form => {
    const fields = inputs(form);
    const result = grade(form.dataset.exercise, fields.map(input => input.value));
    const feedback = form.querySelector('.feedback');
    fields.forEach(input => input.removeAttribute('aria-invalid'));
    if (result.status === 'blank') feedback.textContent = fields.some(input => input.value.trim()) ? 'Respuesta incompleta.' : 'Sin responder.';
    else if (result.status === 'invalid') {
      feedback.textContent = 'No se pudo interpretar la respuesta. Revisa la escritura.';
      fields.forEach(input => input.setAttribute('aria-invalid', 'true'));
    } else if (fields.length === 2 && form.dataset.exercise !== 'cuadratica') {
      feedback.textContent = `Área: ${result.checks[0] ? 'correcta' : 'incorrecta'}. Perímetro: ${result.checks[1] ? 'correcto' : 'incorrecto'}.`;
    } else feedback.textContent = result.correct ? 'Respuesta correcta.' : 'Respuesta incorrecta.';
    feedback.dataset.status = result.correct ? 'correct' : result.status;
    return result;
  };
  const summary = () => {
    const list = document.createElement('ul');
    list.className = 'summary-list';
    for (const area of areas) {
      const panel = root.querySelector(`#${area}`);
      const exercises = [...panel.querySelectorAll('form')];
      const correct = exercises.map(check).filter(result => result.correct).length;
      const item = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = panel.querySelector('h2').textContent;
      const score = document.createElement('span');
      score.textContent = `${exercises.filter(answered).length}/${exercises.length} respondidos · ${correct}/${exercises.length} correctos`;
      item.append(name, score); list.append(item);
    }
    root.querySelector('#summary-content').replaceChildren(list);
  };
  const show = (area, focus = false) => {
    const isSummary = area === 'resumen';
    if (!isSummary && !areas.includes(area)) area = current;
    if (isSummary) summary(); else current = area;
    for (const id of [...areas, 'resumen']) root.querySelector(`#${id}`).hidden = id !== area;
    root.querySelectorAll('[data-area-link]').forEach(link => {
      if (link.dataset.areaLink === area) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    if (focus) {
      const heading = root.querySelector(`#${area} h2`);
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    save();
  };

  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved?.version === 1 && saved.answers && typeof saved.answers === 'object') {
      for (const form of forms) inputs(form).forEach((input, i) => {
        const value = saved.answers[form.dataset.exercise]?.[i];
        if (typeof value === 'string') input.value = value.slice(0, 180);
      });
      if (areas.includes(saved.area)) current = saved.area;
    }
  } catch { storageAvailable = false; }
  forms.forEach(form => {
    form.addEventListener('submit', event => { event.preventDefault(); check(form); save(); });
    form.addEventListener('input', () => {
      const feedback = form.querySelector('.feedback');
      feedback.textContent = ''; delete feedback.dataset.status;
      inputs(form).forEach(input => input.removeAttribute('aria-invalid'));
      progress(); save();
    });
  });
  root.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const area = link.getAttribute('href').slice(1);
    if (![...areas, 'resumen'].includes(area)) return;
    event.preventDefault();
    history.pushState(null, '', `#${area}`);
    show(area, true);
  });
  root.querySelector('#finish-review').addEventListener('click', () => {
    history.pushState(null, '', '#resumen'); show('resumen', true);
  });
  window.addEventListener('hashchange', () => show(location.hash.slice(1) || 'aritmetica', true));
  progress(); show(location.hash.slice(1) || current);
}
