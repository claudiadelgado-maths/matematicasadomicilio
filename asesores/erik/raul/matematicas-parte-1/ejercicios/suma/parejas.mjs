import {pairs,key,term} from './algebra.mjs';
import {$,math,showFeedback,spoken} from './ui.mjs';
let cards,placed,selected,drag,frame,suppressUntil=0;
const status=$('pairs-feedback');
const slotNames=['Fila superior, izquierda','Fila superior, derecha','Fila central, izquierda','Fila central, derecha','Fila inferior, izquierda','Fila inferior, derecha'];
function clearResult() {showFeedback(status);document.querySelectorAll('.pair-result').forEach(el=>{el.replaceChildren();delete el.dataset.result;});}
function render() {
  $('card-bank').replaceChildren();
  cards.filter(c=>!placed.includes(c.id)).forEach(card=>{
    const button=document.createElement('button');button.type='button';button.className='monomial-card';button.dataset.card=card.id;button.setAttribute('aria-label',spoken(term(card.c,card.base)));button.setAttribute('aria-pressed',String(selected===card.id));math(button,term(card.c,card.base));
    button.addEventListener('click',event=>{
      if(event.detail>0 && performance.now()<suppressUntil)return;
      selected=selected===card.id?null:card.id;render();
      $('card-bank').querySelector(`[data-card="${card.id}"]`)?.focus({preventScroll:true});
      showFeedback(status,selected?'Tarjeta seleccionada. Elige una casilla.':'Selección cancelada.');
    });
    button.addEventListener('pointerdown',event=>{
      if(event.button!==0 || !event.isPrimary)return;
      drag={card:card.id,button,id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY};button.setPointerCapture(event.pointerId);
    });
    button.addEventListener('pointermove',event=>{
      if(!drag || event.pointerId!==drag.id)return;
      drag.x=event.clientX;drag.y=event.clientY;
      if(!drag.ghost && Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>8) {
        drag.ghost=document.createElement('div');drag.ghost.className='sum-drag-ghost';drag.ghost.setAttribute('aria-hidden','true');math(drag.ghost,term(card.c,card.base));document.body.append(drag.ghost);draw();
      }
    });
    button.addEventListener('pointerup',()=>finish(true));button.addEventListener('pointercancel',()=>finish(false));button.addEventListener('lostpointercapture',()=>finish(false));
    $('card-bank').append(button);
  });
  document.querySelectorAll('[data-slot]').forEach(button=>{
    const card=cards.find(c=>c.id===placed[Number(button.dataset.slot)]);
    if(card) math(button,term(card.c,card.base));else button.textContent='Colocar aquí';
    button.classList.toggle('is-filled',!!card);
    button.setAttribute('aria-label',`${slotNames[Number(button.dataset.slot)]}: ${card?term(card.c,card.base)+'. Pulsa para devolver la tarjeta':'casilla vacía'}`);
  });
}
function place(index,id) {
  clearResult();placed[index]=id;selected=null;render();showFeedback(status,'Tarjeta colocada.');
  document.querySelector(`[data-slot="${index}"]`).focus({preventScroll:true});
}
function draw() {
  if(!drag?.ghost)return;
  drag.ghost.style.left=`${Math.max(5,Math.min(drag.x+10,innerWidth-drag.ghost.offsetWidth-5))}px`;drag.ghost.style.top=`${Math.max(5,drag.y-55)}px`;
  document.querySelectorAll('[data-slot]').forEach(el=>el.classList.remove('is-over'));
  document.elementFromPoint(drag.x,drag.y)?.closest('[data-slot]')?.classList.add('is-over');
  if(drag.y>innerHeight-65)scrollBy({top:10,behavior:'instant'});else if(drag.y<65)scrollBy({top:-10,behavior:'instant'});
  frame=requestAnimationFrame(draw);
}
function finish(commit) {
  if(!drag)return;
  const active=drag;drag=null;cancelAnimationFrame(frame);
  if(active.button.hasPointerCapture(active.id))active.button.releasePointerCapture(active.id);
  document.querySelectorAll('[data-slot]').forEach(el=>el.classList.remove('is-over'));
  if(!active.ghost)return;
  active.ghost.remove();suppressUntil=performance.now()+350;
  const slot=document.elementFromPoint(active.x,active.y)?.closest('[data-slot]');
  if(commit && slot)place(Number(slot.dataset.slot),active.card);
  else showFeedback(status,'Arrastre cancelado. Puedes seleccionar la tarjeta y pulsar una casilla.');
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'){finish(false);selected=null;render();}});
window.addEventListener('pagehide',()=>finish(false));
function reset(focus=false) {
  finish(false);cards=pairs();placed=Array(6).fill(null);selected=null;$('pair-rows').replaceChildren();showFeedback(status);
  for(let row=0;row<3;row++) {
    const wrapper=document.createElement('div');wrapper.className='pair-row';
    for(let col=0;col<2;col++) {
      if(col){const sign=document.createElement('span');sign.textContent='+';sign.className='pair-plus';wrapper.append(sign);}
      const index=row*2+col,button=document.createElement('button');button.type='button';button.className='drop-slot';button.dataset.slot=index;
      button.addEventListener('click',()=>{
        if(selected)place(index,selected);
        else if(placed[index]) {const id=placed[index];placed[index]=null;clearResult();render();$('card-bank').querySelector(`[data-card="${id}"]`)?.focus({preventScroll:true});}
      });wrapper.append(button);
    }
    const result=document.createElement('div');result.className='pair-result';result.id=`pair-result-${row}`;wrapper.append(result);$('pair-rows').append(wrapper);
  }
  render();if(focus)$('card-bank').querySelector('button').focus({preventScroll:true});
}
$('submit-pairs').addEventListener('click',()=>{
  let valid=0;
  for(let row=0;row<3;row++) {
    const a=cards.find(c=>c.id===placed[row*2]),b=cards.find(c=>c.id===placed[row*2+1]),el=$(`pair-result-${row}`);
    el.replaceChildren();
    if(!a || !b){el.textContent='Completa las dos casillas.';el.dataset.result='incorrect';continue;}
    if(key(a.base)!==key(b.base)){el.textContent='× No son semejantes: revisa todas las letras y sus exponentes.';el.dataset.result='incorrect';continue;}
    valid++;el.dataset.result='correct';const check=document.createElement('span');check.textContent='✓ ';const result=document.createElement('span');math(result,`${term(a.c,a.base)} + (${term(b.c,b.base)}) = ${term(a.c+b.c,a.base)}`);el.append(check,result);
  }
  showFeedback(status,valid===3?'✓ ¡Correcto! Las tres parejas son semejantes.':'× Revisa las filas señaladas. Puedes devolver y cambiar las tarjetas.',valid===3?'correct':'incorrect');
});
$('new-pairs').addEventListener('click',()=>reset(true));reset();
