const purple = '#8655a2', teal = '#237f78';
const wrap = (label, content, box = '0 0 720 410') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${label}">${content}</svg>`;
function dna(color, x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${color}" stroke-width="3.8" stroke-linecap="round">${Array.from({length:23}, (_,i) => { const a=(i%6)*12-30, b=Math.floor(i/6)*19-28; return `<path d="M${a} ${b}q-4 4 0 8t0 8"/>`; }).join('')}</g>`;
}
function egg(x,y,r=125) {
  return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#f7dce8" stroke="#b67a97" stroke-width="2.5"/><circle r="${r-13}" fill="none" stroke="#e8b9ce" stroke-width="2" stroke-dasharray="4 10"/><circle r="${r*.57}" fill="#f5ecfa" stroke="#bc9bc9" stroke-width="2"/>${dna(purple,0,0,r/125)}</g>`;
}
function sperm(x,y) {
  return `<g transform="translate(${x} ${y})"><path d="M35 0C92-75 130 74 205-5" fill="none" stroke="${teal}" stroke-width="8" stroke-linecap="round"/><path d="M25 0H70" stroke="#77b0a0" stroke-width="13" stroke-linecap="round"/><ellipse rx="45" ry="58" fill="#dcefe5" stroke="${teal}" stroke-width="2.5"/>${dna(teal,0,0,.69)}</g>`;
}
function zygote(x,y,r=130) {
  return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#eef1cc" stroke="#80935c" stroke-width="2.5"/><circle r="${r*.73}" fill="#fffdf4" stroke="#b5bd90" stroke-width="2"/>${dna(purple,-r*.32,0,r/160)}${dna(teal,r*.32,0,r/160)}</g>`;
}
const label = (text,x,y,size=20) => `<text x="${x}" y="${y}" text-anchor="middle" fill="#273c37" font-family="system-ui,sans-serif" font-size="${size}" font-weight="700">${text}</text>`;
export function fertilizationMarkup(step) {
  const descriptions = ['Un óvulo y un espermatozoide separados. Cada gameto humano tiene 23 cromosomas.', 'Tras la fecundación hay un cigoto diploide con 46 cromosomas: 23 de cada progenitor.', 'Después de replicar su ADN y completar una mitosis, el cigoto origina dos células con 46 cromosomas cada una.'];
  if (!Number.isInteger(step)||step<0||step>2) throw new RangeError('Vista de fecundación desconocida');
  let content;
  if(step===0) content=egg(190,185)+sperm(470,185)+label('+',365,199,42)+label('Óvulo · 23',190,358)+label('Espermatozoide · 23',512,358);
  if(step===1) content=zygote(360,183)+label('Cigoto · 46',360,358);
  if(step===2) content=zygote(209,185,123)+zygote(511,185,123)+label('46',209,358)+label('46',511,358);
  return wrap(descriptions[step],content);
}
export function coverMarkup() {
  return wrap('Dos gametos haploides aportan 23 cromosomas cada uno. Al unirse forman un cigoto diploide de 46 cromosomas.', `<path d="M40 270C-20 80 150 3 335 40S714 17 677 253S620 584 406 570S70 564 40 270" fill="#f4d4be"/><path d="M83 388C158 265 534 230 614 390" stroke="#bc8f75" fill="none" stroke-width="2" stroke-dasharray="6 9"/>${egg(195,175,101)}${sperm(457,173)}${label('23',195,299,30)}${label('23',456,261,28)}${label('+',336,185,40)}<path d="M351 254v60m-13-13 13 13 13-13" fill="none" stroke="#225d49" stroke-width="3" stroke-linecap="round"/>${zygote(350,433,116)}${label('46',350,590,34)}<g fill="#225d49"><path d="M587 389l5 16 16 5-16 5-5 16-5-16-16-5 16-5Z"/><circle cx="96" cy="341" r="6"/><circle cx="537" cy="533" r="4"/></g>`, '0 0 720 620');
}
export function diversityMarkup(kind) {
  const chromosome=(x,y,color,tip)=>`<path d="M${x-9} ${y-32}Q${x-9} ${y-9} ${x} ${y}T${x+9} ${y+32}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>${tip?`<path d="M${x+6} ${y+18}Q${x+9} ${y+25} ${x+9} ${y+32}" fill="none" stroke="${tip}" stroke-width="9" stroke-linecap="round"/>`:''}`;
  if(kind==='cross') return wrap('Dos cromátidas de homólogos con segmentos intercambiados.',chromosome(105,80,purple,teal)+chromosome(175,80,teal,purple),'0 0 280 160');
  if(kind==='assort') return wrap('Dos grupos, cada uno con un cromosoma de cada par y una combinación de colores diferente.',`<ellipse cx="78" cy="80" rx="60" ry="65" fill="#fbfaf5"/><ellipse cx="203" cy="80" rx="60" ry="65" fill="#fbfaf5"/>${chromosome(59,80,purple)}<g transform="translate(103 80) scale(.6)">${chromosome(0,0,teal)}</g>${chromosome(184,80,teal)}<g transform="translate(229 80) scale(.6)">${chromosome(0,0,purple)}</g>`,'0 0 280 160');
  return wrap('Un gameto de cada progenitor aporta su información a la fecundación.',`<circle cx="79" cy="80" r="51" fill="#f7dce8"/>${chromosome(79,80,purple)}<circle cx="205" cy="80" r="51" fill="#dcefe5"/>${chromosome(205,80,teal)}${label('+',142,87,28)}`,'0 0 280 160');
}
