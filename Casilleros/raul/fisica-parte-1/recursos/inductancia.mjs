import {wordGrid} from './motor.mjs';
import {$,feedback,renderStatic} from './ui.mjs';
renderStatic();let ex,start=null,found=new Set();
function choose(index){
  if(start===null){start=index;$('word-grid').children[index].setAttribute('aria-pressed','true');feedback('Selecciona la última letra de la palabra.');return;}
  const a=start;start=null;[...$('word-grid').children].forEach(b=>b.setAttribute('aria-pressed','false'));
  const word=ex.placements.find(p=>(p.cells[0]===a&&p.cells.at(-1)===index)||(p.cells[0]===index&&p.cells.at(-1)===a));
  if(!word){feedback('Esa selección no corresponde a una palabra de la lista. Inténtalo de nuevo.',false);return;}
  found.add(word.word);word.cells.forEach(i=>$('word-grid').children[i].classList.add('found'));[...$('word-list').children].find(el=>el.dataset.word===word.word).classList.add('found');
  feedback(found.size===ex.placements.length?'✓ ¡Completado!':'✓ Encontraste '+word.word+'.',true);
  if(found.size===ex.placements.length){$('solution').textContent='Inductancia → L → henry → H · Bobina / inductor';$('solution').hidden=false;}
}
function fresh(){ex=wordGrid();start=null;found=new Set();feedback();$('solution').hidden=true;$('word-list').replaceChildren();ex.placements.forEach(p=>{const word=document.createElement('span');word.textContent=p.word;word.dataset.word=p.word;$('word-list').append(word);});$('word-grid').replaceChildren();ex.grid.forEach((letter,i)=>{const b=document.createElement('button');b.type='button';b.textContent=letter;b.setAttribute('aria-label',`${letter}, fila ${Math.floor(i/8)+1}, columna ${i%8+1}`);b.setAttribute('aria-pressed','false');b.tabIndex=i===0?0:-1;b.addEventListener('click',()=>choose(i));b.addEventListener('keydown',e=>{const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8}[e.key];if(delta!==undefined){e.preventDefault();const j=Math.max(0,Math.min(63,i+delta));b.tabIndex=-1;$('word-grid').children[j].tabIndex=0;$('word-grid').children[j].focus();}if(e.key==='Escape'){start=null;[...$('word-grid').children].forEach(el=>el.setAttribute('aria-pressed','false'));feedback();}});$('word-grid').append(b);});}
$('new').addEventListener('click',fresh);fresh();
