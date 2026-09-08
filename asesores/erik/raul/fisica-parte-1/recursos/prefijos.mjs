import {prefixPair,shuffle,compactPower} from './motor.mjs';
import {$,math,feedback,result,renderStatic} from './ui.mjs';
import {draggable} from './arrastre.mjs';
renderStatic();let pair,cards,slots,selected=null;
const names=['Símbolo','Factor','Decimal'];
function renderPiece(el,card){if(card.type===1)math(el,`10^{${card.prefix.exponent}}`);else el.textContent=card.type===0?card.prefix.symbol||'—':compactPower(card.prefix.exponent);}
function place(id,index){const old=slots.indexOf(id);if(old>=0)slots[old]=null;slots[index]=id;selected=null;feedback();$('solution').hidden=true;render();}
function render(){
  $('prefix-bank').replaceChildren();cards.forEach((card,id)=>{if(slots.includes(id))return;const b=document.createElement('button');b.type='button';b.className='piece';b.setAttribute('aria-pressed',String(selected===id));renderPiece(b,card);b.setAttribute('aria-label',`${names[card.type]}: ${b.textContent}`);draggable(b,target=>place(id,Number(target.dataset.drop)),()=>{selected=selected===id?null:id;render();$('prefix-bank').querySelector(`[data-card="${id}"]`)?.focus();});b.dataset.card=id;$('prefix-bank').append(b);});
  $('prefix-columns').replaceChildren();pair.forEach((prefix,col)=>{const column=document.createElement('div');column.className='prefix-column';const title=document.createElement('h3');title.textContent=prefix.name;column.append(title);
    names.forEach((name,row)=>{const index=col*3+row,b=document.createElement('button');b.type='button';b.className='prefix-slot';b.dataset.drop=index;b.setAttribute('aria-label',`${prefix.name}: ${name}${slots[index]!==null?', ocupada; pulsa para devolver':''}`);
      if(slots[index]===null)b.textContent=name;else renderPiece(b,cards[slots[index]]);
      b.addEventListener('click',()=>{if(selected!==null)place(selected,index);else if(slots[index]!==null){slots[index]=null;feedback();$('solution').hidden=true;render();}$('prefix-columns').querySelector(`[data-drop="${index}"]`)?.focus();});column.append(b);});$('prefix-columns').append(column);});
}
function fresh(){pair=prefixPair();cards=shuffle(pair.flatMap(prefix=>[0,1,2].map(type=>({prefix,type}))));slots=Array(6).fill(null);selected=null;feedback();$('solution').hidden=true;render();}
$('check').addEventListener('click',()=>{let all=true;slots.forEach((id,i)=>{const ok=id!==null&&cards[id].type===i%3&&cards[id].prefix.id===pair[Math.floor(i/3)].id;const el=$('prefix-columns').querySelector(`[data-drop="${i}"]`);el.dataset.result=ok?'correct':'incorrect';const mark=document.createElement('span');mark.textContent=ok?' ✓':' ✕';el.querySelector('.mark')?.remove();mark.className='mark';el.append(mark);if(!ok)all=false;});result(all,'Revisa las casillas con ✕: cada prefijo necesita su símbolo, factor y decimal.');});
$('new').addEventListener('click',fresh);fresh();
