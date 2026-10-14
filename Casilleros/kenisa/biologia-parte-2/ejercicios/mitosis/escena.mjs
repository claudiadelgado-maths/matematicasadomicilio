import { phases } from './datos.mjs';

const colors = ['#7953a2', '#b35f88', '#327d6a', '#a77b32'];
const lerp = (a, b, t) => a + (b - a) * t;
const positions = [[328, 140], [432, 148], [328, 265], [438, 267]];

// Dos pares de homólogos: dos largos y dos cortos. Cada color sigue un cromosoma.
// Cada hermana conserva su identidad al moverse; nunca se eliminan o crean copias.
export function frameFor(phase) {
  if (!Number.isInteger(phase) || phase < 0 || phase >= phases.length) throw new RangeError('Etapa no válida');
  const separated = phase >= 3;
  return {
    pinch: phase < 4 ? 0 : phase === 4 ? 115 : 158,
    cell: phase === 5 ? 0 : 1,
    daughters: phase === 5 ? 1 : 0,
    nucleus: phase === 0 ? 1 : phase === 1 ? .27 : 0,
    newNuclei: phase >= 4 ? 1 : 0,
    fibers: [0, .25, 1, 1, 0, 0][phase],
    poles: phase >= 1 && phase <= 3 ? 1 : 0,
    equator: phase === 2 ? 1 : 0,
    arrows: phase === 3 ? 1 : 0,
    chromosomes: Array.from({ length: 8 }, (_, index) => {
      const i = Math.floor(index / 2), sister = index % 2;
      const sign = sister === 0 ? -1 : 1;
      let x, y, angle;
      if (phase < 2) { x = positions[i][0] + sign * 5; y = positions[i][1]; angle = [18, -18, -12, 16][i]; }
      else if (phase === 2) { x = 380 + sign * 5; y = [105, 178, 250, 310][i]; angle = 0; }
      else if (phase === 3) { x = sister === 0 ? 235 : 525; y = [112, 182, 248, 310][i]; angle = 0; }
      else { x = (sister === 0 ? 220 : 540) + (i % 2 ? 33 : -33); y = i < 2 ? 165 : 255; angle = [15, -15, -15, 15][i]; }
      return { x, y, angle, compact: phase === 0 ? 0 : phase >= 4 ? .15 : 1, direction: separated ? -sign : sign, length: i < 2 ? 30 : 22 };
    })
  };
}

function mixFrame(a, b, t) {
  const result = {};
  for (const key of Object.keys(b)) {
    result[key] = key === 'chromosomes' ? b[key].map((ch, i) => Object.fromEntries(Object.keys(ch).map(k => [k, lerp(a[key][i][k], ch[k], t)]))) : lerp(a[key], b[key], t);
  }
  return result;
}

function chromosomePath(c) {
  const l = c.length, d = c.direction;
  const tight = [[d * 15, -l], [d * 15, -l * .65], [d * 2, -l * .3], [0, 0], [d * 2, l * .3], [d * 15, l * .65], [d * 15, l]];
  const loose = [[-13, -l * 1.15], [-42, -l * .85], [26, -l * .6], [0, 0], [-30, l * .7], [35, l], [6, l * 1.2]];
  const p = tight.map((point, i) => point.map((v, j) => lerp(loose[i][j], v, c.compact).toFixed(2)).join(' '));
  return `M${p[0]}C${p.slice(1, 4).join(' ')}C${p.slice(4).join(' ')}`;
}

function membrane(pinch) {
  return `M70 210C70 90 230 35 380 ${50 + pinch}C530 35 690 90 690 210C690 330 530 385 380 ${370 - pinch}C230 385 70 330 70 210Z`;
}
function fiberPath(c, sister) {
  const x = sister === 0 ? 112 : 648;
  return `M${x} 210Q${(x + c.x) / 2} ${c.y} ${c.x} ${c.y}`;
}
const escapeText = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export function sceneMarkup(phase = 0, label = phases[phase]?.alt) {
  const f = frameFor(phase);
  return `<svg class="cell-scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 420" role="img" aria-label="${escapeText(label)}">
    <path data-cell="" d="${membrane(f.pinch)}" fill="#e0eee6" stroke="#4e8a70" stroke-width="3" opacity="${f.cell}"/>
    <g data-daughters="" opacity="${f.daughters}" fill="#e0eee6" stroke="#4e8a70" stroke-width="3"><ellipse cx="220" cy="210" rx="147" ry="157"/><ellipse cx="540" cy="210" rx="147" ry="157"/></g>
    <ellipse data-nucleus="" cx="380" cy="210" rx="156" ry="134" fill="#ebe1f4" stroke="#9176ab" stroke-width="3" stroke-dasharray="${phase === 1 ? '8 8' : 'none'}" opacity="${f.nucleus}"/>
    <g data-new-nuclei="" opacity="${f.newNuclei}" fill="#ebe1f4" stroke="#9176ab" stroke-width="3"><ellipse cx="220" cy="210" rx="106" ry="109"/><ellipse cx="540" cy="210" rx="106" ry="109"/></g>
    <path data-equator="" d="M380 61V359" fill="none" stroke="#786886" stroke-width="2" stroke-dasharray="5 7" opacity="${f.equator}"/>
    <g data-fibers="" fill="none" stroke="#5c977b" stroke-width="2.2" opacity="${f.fibers}">${f.chromosomes.map((c, i) => `<path data-fiber="${i}" d="${fiberPath(c, i % 2)}"/>`).join('')}</g>
    <g data-poles="" opacity="${f.poles}" fill="#ffe5a1" stroke="#687d50" stroke-width="2"><circle cx="112" cy="210" r="8"/><circle cx="648" cy="210" r="8"/><path d="M112 192v36m-18-18h36m518-18v36m-18-18h36" fill="none"/></g>
    ${f.chromosomes.map((c, i) => `<g data-chromosome="${i}" transform="translate(${c.x} ${c.y}) rotate(${c.angle})"><path d="${chromosomePath(c)}" fill="none" stroke="${colors[Math.floor(i / 2)]}" stroke-width="${lerp(3.5, 11, c.compact)}" stroke-linecap="round"/><circle r="4" fill="#f8ecb7" stroke="#5b714d" stroke-width="1" opacity="${c.compact}"/></g>`).join('')}
    <g data-arrows="" opacity="${f.arrows}" stroke="#315c49" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M337 210h-52l12-9m-12 9 12 9M423 210h52l-12-9m12 9-12 9"/></g>
  </svg>`;
}

export function createCellScene(container, phase = 0) {
  container.innerHTML = sceneMarkup(phase);
  const svg = container.querySelector('svg');
  const select = key => svg.querySelector(`[data-${key}]`);
  const nodes = { cell: select('cell'), daughters: select('daughters'), nucleus: select('nucleus'), newNuclei: select('new-nuclei'), fibers: select('fibers'), poles: select('poles'), equator: select('equator'), arrows: select('arrows') };
  const chromosomes = [...svg.querySelectorAll('[data-chromosome]')];
  const fibers = [...svg.querySelectorAll('[data-fiber]')];
  let current = frameFor(phase), request = 0;
  function draw(f) {
    current = f;
    nodes.cell.setAttribute('d', membrane(f.pinch));
    Object.entries(nodes).forEach(([key, node]) => node.setAttribute('opacity', f[key]));
    chromosomes.forEach((node, i) => {
      const c = f.chromosomes[i];
      node.setAttribute('transform', `translate(${c.x} ${c.y}) rotate(${c.angle})`);
      node.querySelector('path').setAttribute('d', chromosomePath(c));
      node.querySelector('path').setAttribute('stroke-width', lerp(3.5, 11, c.compact));
      node.querySelector('circle').setAttribute('opacity', c.compact);
      fibers[i].setAttribute('d', fiberPath(c, i % 2));
    });
  }
  return {
    setPhase(index, animate = true) {
      cancelAnimationFrame(request);
      const target = frameFor(index), origin = current;
      svg.setAttribute('aria-label', phases[index].alt);
      nodes.nucleus.setAttribute('stroke-dasharray', index === 1 ? '8 8' : 'none');
      if (!animate) { draw(target); return; }
      const start = performance.now();
      function tick(now) {
        const elapsed = Math.min((now - start) / 950, 1);
        const eased = elapsed * elapsed * (3 - 2 * elapsed);
        draw(mixFrame(origin, target, eased));
        if (elapsed < 1) request = requestAnimationFrame(tick);
      }
      request = requestAnimationFrame(tick);
    }
  };
}
