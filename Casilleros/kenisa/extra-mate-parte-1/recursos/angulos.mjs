import { ANGLE_TYPES, clampAngle, classifyAngle, polarPoint, anglePaths, AngleTurn } from './modelo.mjs';

let diagramId = 0;
const ns = 'http://www.w3.org/2000/svg';
const svgNode = (tag, attributes = {}) => {
  const node = document.createElementNS(ns, tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
  return node;
};

export function createAngleDiagram(container, { axes = false, interactive = false, miniature = false, fixedColor = null, exposeType = true, onChange = () => {} } = {}) {
  if (!container) return null;
  const id = `angle-${++diagramId}`;
  let angle = 45;
  let gesture = null;
  const svg = svgNode('svg', { viewBox: '0 0 480 480', class: 'angle-diagram', role: 'img', 'aria-labelledby': `${id}-title ${id}-description` });
  const title = svgNode('title', { id: `${id}-title` });
  title.textContent = interactive ? 'Ángulo con una semirrecta móvil' : 'Ángulo para observar';
  const description = svgNode('desc', { id: `${id}-description` });
  svg.append(title, description);
  if (miniature) { svg.setAttribute('aria-hidden', 'true'); svg.removeAttribute('aria-labelledby'); svg.setAttribute('viewBox', '35 35 410 410'); }
  const definitions = svgNode('defs');
  const rayArrow = svgNode('marker', { id: `${id}-ray`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
  rayArrow.append(svgNode('path', { d: 'M0 0L10 5L0 10Z', fill: 'context-stroke' }));
  const arcArrow = svgNode('marker', { id: `${id}-arc`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 4, markerHeight: 4, orient: 'auto' });
  arcArrow.append(svgNode('path', { d: 'M0 0L10 5L0 10Z', fill: 'context-stroke' }));
  definitions.append(rayArrow, arcArrow);
  svg.append(definitions);
  if (axes) {
    const grid = svgNode('g', { class: 'angle-grid', 'aria-hidden': 'true' });
    for (let position = 60; position <= 420; position += 30) {
      grid.append(svgNode('path', { d: `M${position} 40V440M40 ${position}H440` }));
    }
    svg.append(grid);
    svg.append(svgNode('path', { d: 'M36 240H444M240 36V444', class: 'coordinate-axes', 'aria-hidden': 'true' }));
    const labels = [[453, 262, 'x'], [255, 28, 'y'], [426, 220, '0° / 360°'], [249, 65, '90°'], [29, 226, '180°'], [246, 430, '270°']];
    labels.forEach(([x, y, text]) => {
      const label = svgNode('text', { x, y, class: 'coordinate-label', 'text-anchor': text === '0° / 360°' ? 'middle' : 'start', 'aria-hidden': 'true' });
      label.textContent = text;
      svg.append(label);
    });
    svg.append(svgNode('circle', { cx: 240, cy: 240, r: 156, class: 'circle-guide', 'aria-hidden': 'true' }));
  }
  const sector = svgNode('path', { class: 'angle-sector', 'aria-hidden': 'true' });
  const initial = svgNode('path', { d: 'M240 240H428', class: 'initial-ray', 'marker-end': `url(#${id}-ray)`, 'aria-hidden': 'true' });
  const mobile = svgNode('path', { class: 'moving-ray', 'marker-end': `url(#${id}-ray)`, 'aria-hidden': 'true' });
  const arc = svgNode('path', { class: 'angle-arc', 'marker-end': `url(#${id}-arc)`, 'aria-hidden': 'true' });
  const innerArc = svgNode('path', { class: 'inner-arc', 'aria-hidden': 'true' });
  const rightAngle = svgNode('path', { d: 'M240 211H269V240', class: 'right-angle-mark', 'aria-hidden': 'true' });
  const vertex = svgNode('circle', { cx: 240, cy: 240, r: 6, class: 'angle-vertex', 'aria-hidden': 'true' });
  svg.append(sector, initial, mobile, arc, innerArc, rightAngle, vertex);
  let handle;
  let handleArt;
  if (interactive) {
    handleArt = svgNode('g', { 'aria-hidden': 'true' });
    handleArt.append(svgNode('circle', { r: 19, class: 'handle-ring' }));
    handleArt.append(svgNode('circle', { r: 7, class: 'handle-center' }));
    svg.append(handleArt);
    // Un control HTML superpuesto mantiene touch-action fiable en navegadores móviles.
    handle = document.createElement('div');
    handle.className = 'angle-handle';
    handle.tabIndex = 0;
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Girar la semirrecta móvil');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '360');
    container.classList.add('angle-stage');
  }
  container.replaceChildren(svg);
  if (handle) container.append(handle);

  const setAngle = (value) => {
    angle = Math.round(clampAngle(value));
    const type = classifyAngle(angle);
    svg.style.setProperty('--angle-color', fixedColor || type.color);
    const endpoint = polarPoint(angle, 188);
    const point = polarPoint(angle, 156);
    const paths = anglePaths(angle, axes ? 156 : 110);
    sector.setAttribute('d', paths.sector);
    arc.setAttribute('d', paths.arc);
    innerArc.setAttribute('d', anglePaths(angle, 53).arc);
    mobile.setAttribute('d', `M240 240L${endpoint.x} ${endpoint.y}`);
    rightAngle.style.display = angle === 90 ? '' : 'none';
    svg.dataset.angle = angle;
    const turn = angle === 0 ? 'No hubo giro.' : angle === 360 ? 'Se recorrió una vuelta entera aunque los lados coinciden.' : 'Giro en sentido antihorario desde el eje x positivo.';
    description.textContent = `${angle} grados. ${turn}${exposeType ? ` ${type.name}.` : ''}`;
    if (handle) {
      handleArt.setAttribute('transform', `translate(${point.x} ${point.y})`);
      handle.style.left = `${point.x / 480 * 100}%`;
      handle.style.top = `${point.y / 480 * 100}%`;
      handle.setAttribute('aria-valuenow', angle);
      handle.setAttribute('aria-valuetext', `${angle} grados${exposeType ? `, ${type.name}` : ''}. ${turn}`);
    }
    return angle;
  };

  if (handle) {
    const pointerAngle = (event) => {
      const matrix = svg.getScreenCTM();
      if (!matrix) return null;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
      if (Math.hypot(point.x - 240, point.y - 240) < 24) return null;
      return (Math.atan2(240 - point.y, point.x - 240) * 180 / Math.PI + 360) % 360;
    };
    const endGesture = () => {
      if (!gesture) return;
      const pointerId = gesture.pointerId;
      gesture = null;
      if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
      svg.classList.remove('is-manipulating');
      container.classList.remove('is-manipulating');
    };
    handle.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      const raw = pointerAngle(event);
      if (raw === null) return;
      handle.focus({ preventScroll: true });
      onChange(angle, 'start');
      gesture = { pointerId: event.pointerId, tracker: new AngleTurn(angle, raw) };
      handle.setPointerCapture(event.pointerId);
      svg.classList.add('is-manipulating');
      container.classList.add('is-manipulating');
    });
    handle.addEventListener('pointermove', (event) => {
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const raw = pointerAngle(event);
      if (raw === null) return;
      let value = gesture.tracker.move(raw);
      const cardinal = Math.round(value / 90) * 90;
      if (Math.abs(value - cardinal) <= 1.5) value = cardinal;
      onChange(value, 'drag');
    });
    handle.addEventListener('pointerup', endGesture);
    handle.addEventListener('pointercancel', endGesture);
    handle.addEventListener('lostpointercapture', endGesture);
    handle.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 10 : 1;
      const value = event.key === 'Home' ? 0 : event.key === 'End' ? 360 : ['ArrowRight', 'ArrowUp'].includes(event.key) ? angle + step : ['ArrowLeft', 'ArrowDown'].includes(event.key) ? angle - step : null;
      if (value === null) return;
      event.preventDefault();
      endGesture();
      onChange(value, 'keyboard');
    });
    window.addEventListener('blur', endGesture);
  }
  setAngle(angle);
  return { setAngle, get angle() { return angle; } };
}

export function createAngleExplorer(root, { initial = 45, axes = false, showType = true } = {}) {
  if (!root) return null;
  let frame = null;
  let angle = initial;
  const range = root.querySelector('[data-angle-range]');
  const announce = root.querySelector('[data-angle-announcement]');
  const stopAnimation = () => { if (frame !== null) cancelAnimationFrame(frame); frame = null; };
  const diagram = createAngleDiagram(root.querySelector('[data-angle-drawing]'), { axes, interactive: true, exposeType: showType, onChange: (value, source) => {
    stopAnimation();
    update(value);
    if (source === 'keyboard' && announce) announce.textContent = `${angle} grados${showType ? `. ${classifyAngle(angle).name}` : ''}.`;
  } });
  if (!diagram) return null;

  function update(value) {
    angle = diagram.setAngle(value);
    const type = classifyAngle(angle);
    range.value = angle;
    range.setAttribute('aria-valuetext', `${angle} grados${showType ? `, ${type.name}` : ''}`);
    root.querySelector('[data-angle-value]').textContent = `${angle}°`;
    root.style.setProperty('--angle-color', type.color);
    const typeLabel = root.querySelector('[data-angle-type]');
    if (typeLabel) typeLabel.textContent = type.name;
    const rule = root.querySelector('[data-angle-rule]');
    if (rule) rule.textContent = type.rule;
    root.querySelector('[data-turn-label]').textContent = angle === 0 ? 'Sin giro · 0 vueltas' : angle === 360 ? 'Una vuelta entera · 1 vuelta' : angle === 90 ? 'Un cuarto de vuelta' : angle === 180 ? 'Media vuelta' : `${angle} de 360 grados de una vuelta`;
    const note = root.querySelector('[data-turn-note]');
    if (note) note.textContent = angle === 0 ? 'Los lados coinciden porque todavía no giraste.' : angle === 360 ? 'Los lados coinciden después de recorrer todo el círculo. El sector lleno muestra el giro.' : 'La flecha del arco indica el giro desde el lado fijo. Observa el sector, incluso si supera media vuelta.';
    root.querySelectorAll('[data-example]').forEach((button) => {
      const current = classifyAngle(Number(button.dataset.example)).key === type.key;
      button.classList.toggle('is-current', current);
      button.setAttribute('aria-pressed', String(current));
    });
  }

  const setAngle = (value, { animate = false, duration = 420 } = {}) => {
    stopAnimation();
    const target = Math.round(clampAngle(value));
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { update(target); return; }
    const start = angle;
    const began = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - began) / duration);
      update(start + (target - start) * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else { frame = null; if (announce) announce.textContent = `${angle} grados${showType ? `. ${classifyAngle(angle).name}` : ''}.`; }
    };
    frame = requestAnimationFrame(tick);
  };

  range.addEventListener('input', () => setAngle(Number(range.value)));
  root.querySelectorAll('[data-example]').forEach((button) => {
    let lastTouch = -Infinity;
    const choose = (peek) => {
      setAngle(Number(button.dataset.example), { animate: true });
      const drawing = root.querySelector('[data-angle-drawing]');
      const bounds = drawing.getBoundingClientRect();
      if (peek && (bounds.bottom < 0 || bounds.top > window.innerHeight - 140)) {
        requestAnimationFrame(() => drawing.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
      }
    };
    // Un toque se resuelve al levantar el dedo, incluso tras arrastrar el punto.
    // Si el navegador emite además click, no se inicia la animación dos veces.
    button.addEventListener('pointerup', (event) => {
      if (event.pointerType !== 'touch') return;
      lastTouch = performance.now();
      choose(true);
    });
    button.addEventListener('click', (event) => {
      const touchClick = event.pointerType === 'touch' || event.sourceCapabilities?.firesTouchEvents || (!event.pointerType && event.detail > 0);
      if (touchClick && performance.now() - lastTouch < 700) return;
      choose(event.detail > 0);
    });
  });
  root.querySelector('[data-zero]')?.addEventListener('click', () => { setAngle(0); if (announce) announce.textContent = '0 grados. Sin giro.'; });
  root.querySelector('[data-full-turn]')?.addEventListener('click', () => {
    setAngle(0);
    setAngle(360, { animate: true, duration: 1500 });
  });
  root.addEventListener('keydown', (event) => { if (event.key === 'Escape') stopAnimation(); });
  update(initial);
  return { setAngle, get angle() { return angle; } };
}

export function createTypeCards(container) {
  if (!container) return;
  ANGLE_TYPES.forEach((type) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-card';
    button.dataset.example = type.example;
    button.style.setProperty('--type-color', type.color);
    const picture = document.createElement('span');
    picture.className = 'type-picture';
    const name = document.createElement('strong');
    name.textContent = type.name;
    const range = document.createElement('span');
    range.className = 'type-range';
    range.textContent = type.range;
    button.append(picture, name, range);
    container.append(button);
    createAngleDiagram(picture, { miniature: true }).setAngle(type.example);
  });
}
