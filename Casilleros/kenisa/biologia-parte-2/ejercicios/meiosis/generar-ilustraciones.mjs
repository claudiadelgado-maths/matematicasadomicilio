// Herramienta local de autoría. No se carga en el navegador ni exige compilación.
import { readFile, writeFile } from 'node:fs/promises';
import { sceneMarkup, crossoverMarkup } from './escena.mjs';
import { phases } from './datos.mjs';

const htmlPath = new URL('./index.html', import.meta.url);
let html = await readFile(htmlPath, 'utf8');
function insert(name, content) {
  const marker = `<!-- ${name} -->`, end = `<!-- /${name} -->`;
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`Falta el marcador ${name}`);
  const finish = html.indexOf(end, start);
  html = html.slice(0, start) + marker + content + end + html.slice(finish < 0 ? start + marker.length : finish + end.length);
}
insert('INITIAL_SCENE',sceneMarkup(0));
insert('SEPARATION_I',sceneMarkup(3));
insert('SEPARATION_II',sceneMarkup(7));
insert('CROSS_SCENE',crossoverMarkup(false));
insert('PHASE_REFERENCE',phases.map(p=>`<li><strong>${p.name}</strong><p>${p.description} ${p.note}</p></li>`).join(''));

const colors = ['#8655a2','#237f78'];
function chromosome(x,y,length,origin) {
  return `<path d="M${x-10} ${y-length}Q${x-10} ${y-12} ${x} ${y}Q${x+10} ${y+12} ${x+10} ${y+length}M${x+10} ${y-length}Q${x+10} ${y-12} ${x} ${y}Q${x-10} ${y+12} ${x-10} ${y+length}" stroke="${colors[origin]}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="4" fill="#f9df91"/>`;
}
const assortment = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 410" role="img" aria-label="Dos repartos posibles sin entrecruzamiento: en A los dos cromosomas maternos van a una célula y los paternos a otra; en B cada célula recibe uno de cada origen. Siempre hay un largo y un corto por célula.">${[0,1].map(row=>{
  const y=105+row*205;
  return `<text x="280" y="${y-83}" text-anchor="middle" fill="#273c37" font-family="sans-serif" font-size="17" font-weight="700">Reparto ${row===0?'A':'B'}</text>`+[0,1].map(side=>`<ellipse cx="${140+side*280}" cy="${y}" rx="117" ry="73" fill="#fbfaf5" stroke="#8cac8b" stroke-width="2"/>`+chromosome(105+side*280,y,42,side)+chromosome(175+side*280,y,28,row===0?side:1-side)).join('');
}).join('')}</svg>`;
insert('ASSORTMENT',assortment);
await writeFile(htmlPath,html);
await writeFile(new URL('../../recursos/meiosis.svg',import.meta.url),sceneMarkup(8));
console.log('Actualizadas las ilustraciones estáticas y la portada de Meiosis.');
