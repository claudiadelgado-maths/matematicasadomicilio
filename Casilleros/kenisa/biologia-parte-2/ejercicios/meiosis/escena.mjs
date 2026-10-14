import { phases } from './datos.mjs';

const maternal = '#8655a2', paternal = '#237f78';
const colors = [maternal, paternal];
const sideOf = homolog => [0, 1, 1, 0][homolog];
const mix = (a, b, t) => a + (b - a) * t;
const escapeText = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

// Eight persistent DNA molecules. The two pairs differ in length; each pair has
// a maternal and a paternal homolog. Only nonsister distal segments are exchanged.
export function frameFor(phase) {
  if (!Number.isInteger(phase) || phase < 0 || phase >= phases.length) throw new RangeError('Etapa no válida');
  return {
    parent: phase < 4 ? 1 : 0, two: phase >= 4 && phase < 8 ? 1 : 0, four: phase === 8 ? 1 : 0,
    pinchI: phase < 3 ? 0 : phase === 3 ? 35 : 238,
    pinchII: phase < 7 ? 0 : phase === 7 ? 25 : 163,
    nucleus: phase === 0 ? 1 : phase === 1 ? .18 : 0,
    nucleiI: phase === 4 ? 1 : phase === 5 ? .18 : 0,
    nucleiII: phase === 8 ? 1 : 0,
    equatorI: phase === 2 ? 1 : 0, equatorII: phase === 6 ? 1 : 0,
    arrowsI: phase === 3 ? 1 : 0, arrowsII: phase === 7 ? 1 : 0,
    fibers: [0, .2, 1, 1, 0, .2, 1, 1, 0][phase],
    chromosomes: Array.from({ length: 8 }, (_, index) => {
      const homolog = Math.floor(index / 2), sister = index % 2, origin = homolog % 2;
      const pair = Math.floor(homolog / 2), side = sideOf(homolog), sign = sister ? 1 : -1;
      let x, y, angle = 0;
      if (phase === 0) { x = 310 + origin * 180 + sign * 7; y = 190 + pair * 185; }
      else if (phase <= 2) { x = 348 + (phase === 1 ? origin : side) * 104 + sign * 4; y = 185 + pair * 200; }
      else if (phase === 3) { x = 210 + side * 380 + sign * 4; y = 185 + pair * 200; }
      else if (phase <= 5) { x = 205 + side * 390 + sign * 4; y = 195 + pair * 175; }
      else if (phase <= 7) { x = 145 + side * 390 + pair * 120; y = phase === 6 ? 290 + sign * 4 : 290 + sign * 122; angle = 90; }
      else { x = 160 + side * 390 + pair * 90; y = 160 + sister * 260; }
      return {
        x, y, angle, length: pair === 0 ? 54 : 36,
        compact: phase === 0 || phase === 8 ? .08 : 1,
        direction: phase >= 7 ? -sign : sign,
        // Sister 1 of the maternal homolog exchanges with sister 0 of its partner.
        exchange: phase > 0 && sister === 1 - origin ? 1 : 0,
        poleX: phase < 5 ? (side ? 748 : 52) : 205 + side * 390,
        poleY: phase < 5 ? 290 : (sister ? 532 : 48)
      };
    })
  };
}

function points(c) {
  const l = c.length, d = c.direction;
  const tight = [[d * 19, -l], [d * 19, -l * .7], [d * 3, -l * .35], [0, 0], [d * 3, l * .35], [d * 19, l * .7], [d * 19, l]];
  const loose = [[-10, -l], [-34, -l * .65], [24, -l * .35], [0, 0], [-24, l * .45], [26, l * .7], [8, l]];
  return tight.map((p, i) => p.map((v, j) => mix(loose[i][j], v, c.compact)));
}
function chromosomePath(c) {
  const p = points(c).map(point => point.join(' '));
  return `M${p[0]}C${p.slice(1, 4).join(' ')}C${p.slice(4).join(' ')}`;
}
// End portion of the lower cubic, split at t=.58 (De Casteljau), so the
// exchanged segment stays precisely attached during every morph.
function tipPath(c) {
  const p = points(c).slice(3), t = .58;
  const blend = (a, b) => a.map((v, j) => mix(v, b[j], t));
  const a = blend(p[0], p[1]), b = blend(p[1], p[2]), d = blend(p[2], p[3]);
  const e = blend(a, b), f = blend(b, d), g = blend(e, f);
  return `M${g.join(' ')}C${[f, d, p[3]].map(v => v.join(' ')).join(' ')}`;
}
function membrane(cx, cy, rx, ry, pinch) {
  return `M${cx-rx} ${cy}C${cx-rx} ${cy-ry} ${cx-rx*.5} ${cy-ry} ${cx} ${cy-ry+pinch}C${cx+rx*.5} ${cy-ry} ${cx+rx} ${cy-ry} ${cx+rx} ${cy}C${cx+rx} ${cy+ry} ${cx+rx*.5} ${cy+ry} ${cx} ${cy+ry-pinch}C${cx-rx*.5} ${cy+ry} ${cx-rx} ${cy+ry} ${cx-rx} ${cy}Z`;
}
const fiber = c => `M${c.poleX} ${c.poleY}Q${c.poleX} ${c.y} ${c.x} ${c.y}`;
const transform = c => `translate(${c.x} ${c.y}) rotate(${c.angle})`;
function chromatid(c, index) {
  const origin = Math.floor(index / 2) % 2, stroke = mix(4, 10, c.compact);
  return `<g data-dna="${index}" transform="${transform(c)}"><path data-body="" d="${chromosomePath(c)}" stroke="${colors[origin]}" stroke-width="${stroke}"/><path data-tip="" d="${tipPath(c)}" stroke="${colors[1-origin]}" stroke-width="${stroke}" opacity="${c.exchange}"/><circle data-centromere="" r="4" fill="#f9df91" stroke="#596349" stroke-width="1" opacity="${c.compact}"/></g>`;
}

export function sceneMarkup(phase = 0, label = phases[phase]?.alt) {
  const f = frameFor(phase);
  return `<svg class="meiosis-scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 580" role="img" aria-label="${escapeText(label)}">
    <g fill="#e6efe1" stroke="#668b69" stroke-width="2.5">
      <path data-parent="" d="${membrane(400,290,354,244,f.pinchI)}" opacity="${f.parent}"/>
      <g data-two="" opacity="${f.two}">${[205,595].map(x=>`<path data-membrane-ii="${x}" d="${membrane(x,290,240,165,f.pinchII)}" transform="rotate(90 ${x} 290)"/>`).join('')}</g>
      <g data-four="" opacity="${f.four}">${[205,595].flatMap(x=>[160,420].map(y=>`<ellipse cx="${x}" cy="${y}" rx="166" ry="122"/>`)).join('')}</g>
    </g>
    <g fill="#f2e8f8" stroke="#b5a0c4" stroke-width="2">
      <ellipse data-nucleus="" cx="400" cy="290" rx="238" ry="197" opacity="${f.nucleus}"/>
      <g data-nuclei-i="" opacity="${f.nucleiI}">${[205,595].map(x=>`<ellipse cx="${x}" cy="290" rx="110" ry="160"/>`).join('')}</g>
      <g data-nuclei-ii="" opacity="${f.nucleiII}">${[205,595].flatMap(x=>[160,420].map(y=>`<ellipse cx="${x}" cy="${y}" rx="119" ry="89"/>`)).join('')}</g>
    </g>
    <g fill="none" stroke="#a190ae" stroke-width="2" stroke-dasharray="5 7"><path data-equator-i="" d="M400 72V508" opacity="${f.equatorI}"/><path data-equator-ii="" d="M62 290H348M452 290H738" opacity="${f.equatorII}"/></g>
    <g data-fibers="" opacity="${f.fibers}" fill="none" stroke="#86a38b" stroke-width="2">${f.chromosomes.map((c,i)=>`<path data-fiber="${i}" d="${fiber(c)}"/>`).join('')}</g>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">${f.chromosomes.map(chromatid).join('')}</g>
    <g fill="none" stroke="#496b50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path data-arrows-i="" d="M348 290h-52l12-10m-12 10 12 10M452 290h52l-12-10m12 10-12 10" opacity="${f.arrowsI}"/><path data-arrows-ii="" d="M205 262v-38l-10 12m10-12 10 12M205 318v38l-10-12m10 12 10-12M595 262v-38l-10 12m10-12 10 12M595 318v38l-10-12m10 12 10-12" opacity="${f.arrowsII}"/></g>
  </svg>`;
}

export function createScene(container) {
  container.innerHTML = sceneMarkup();
  const svg = container.querySelector('svg');
  const nodes = Object.fromEntries(Object.entries({parent:'parent',two:'two',four:'four',nucleus:'nucleus',nucleiI:'nuclei-i',nucleiII:'nuclei-ii',equatorI:'equator-i',equatorII:'equator-ii',arrowsI:'arrows-i',arrowsII:'arrows-ii',fibers:'fibers'}).map(([key,attr])=>[key,svg.querySelector(`[data-${attr}]`)]));
  const dna = [...svg.querySelectorAll('[data-dna]')].map(node=>({node,body:node.querySelector('[data-body]'),tip:node.querySelector('[data-tip]'),centromere:node.querySelector('[data-centromere]')}));
  const fibers = [...svg.querySelectorAll('[data-fiber]')];
  const membranes = [...svg.querySelectorAll('[data-membrane-ii]')];
  let current = frameFor(0), request = 0;
  function draw(f) {
    current = f;
    Object.entries(nodes).forEach(([key,node])=>node.setAttribute('opacity', f[key]));
    nodes.parent.setAttribute('d', membrane(400,290,354,244,f.pinchI));
    membranes.forEach((node,i)=>node.setAttribute('d', membrane(205+i*390,290,240,165,f.pinchII)));
    dna.forEach(({node,body,tip,centromere}, i)=>{
      const c = f.chromosomes[i];
      node.setAttribute('transform',transform(c));
      body.setAttribute('d',chromosomePath(c)); tip.setAttribute('d',tipPath(c));
      for (const path of [body,tip]) path.setAttribute('stroke-width',mix(4,10,c.compact));
      tip.setAttribute('opacity',c.exchange); centromere.setAttribute('opacity',c.compact);
      fibers[i].setAttribute('d',fiber(c));
    });
  }
  return {
    setPhase(index, animate = true) {
      cancelAnimationFrame(request);
      const end = frameFor(index), start = current;
      svg.setAttribute('aria-label',phases[index].alt);
      if (!animate) { draw(end); return; }
      const time = performance.now();
      function step(now) {
        const t = Math.min(1,(now-time)/1000), eased = t*t*(3-2*t);
        const frame = Object.fromEntries(Object.keys(end).map(key=>[key,key === 'chromosomes' ? end.chromosomes.map((c,i)=>Object.fromEntries(Object.keys(c).map(k=>[k,mix(start.chromosomes[i][k],c[k],eased)]))) : mix(start[key],end[key],eased)]));
        draw(frame); if (t<1) request=requestAnimationFrame(step);
      }
      request=requestAnimationFrame(step);
    }
  };
}

export function crossoverMarkup(exchanged = false) {
  const chromosomes = Array.from({length:4},(_,i)=>({x:175+Math.floor(i/2)*170+(i%2 ? 4 : -4),y:145,angle:0,length:83,compact:1,direction:i%2 ? 1 : -1,exchange:exchanged && (i===1||i===2) ? 1 : 0}));
  const label = exchanged ? 'Después del entrecruzamiento: una cromátida de cada homólogo tiene un fragmento del otro. Las otras dos conservan su color.' : 'Antes del entrecruzamiento: un cromosoma homólogo materno morado y uno paterno verde, cada uno con dos cromátidas.';
  return `<svg class="cross-scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 290" role="img" aria-label="${label}"><rect x="50" y="20" width="420" height="250" rx="110" fill="#faf7ed"/><g fill="none" stroke-linecap="round" stroke-linejoin="round">${chromosomes.map(chromatid).join('')}</g><path d="M241 192h38m-8-7 8 7-8 7m-22 12h-38m8-7-8 7 8 7" stroke="#8c794d" stroke-width="2.5" fill="none" opacity="${exchanged ? 1 : 0}"/></svg>`;
}
