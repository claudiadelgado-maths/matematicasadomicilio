// Adaptación local del FLIP de Raúl → Repaso → recursos/despejes/actividad.mjs.
// Conserva identidades de bloques; no cambia el modelo ni recursos de Raúl.
export function positions(board){return new Map([...board.querySelectorAll('[data-block]')].map(el=>[el.dataset.block,{rect:el.getBoundingClientRect(),text:el.textContent,clone:el.cloneNode(true)}]));}
export async function animateChanges(board,before,change={}){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!Element.prototype.animate)return;
 const duration=720,pending=[],timers=[];
 const play=(el,frames,options)=>{const animation=el.animate(frames,options);pending.push(animation.finished.catch(()=>{}));};
 const destination=change.target&&board.querySelector(`[data-block="${change.target}"]`);
 const ghosts=[];
 try{
  for(const el of board.querySelectorAll('[data-block]')){
   const old=before.get(el.dataset.block);if(!old)continue;
   const now=el.getBoundingClientRect(),dx=old.rect.x-now.x,dy=old.rect.y-now.y;
   if(!dx&&!dy)continue;
   el.style.zIndex='3';
   play(el,[{transform:`translate(${dx}px,${dy}px)`,background:'#fff0bc'},{transform:`translate(${dx*.5}px,${dy*.5-26}px)`,offset:.5,background:'#fff0bc'},{transform:'translate(0,0)'}],{duration,easing:'ease-in-out'});
   if(old.text!==el.textContent){const next=el.innerHTML;el.innerHTML=old.clone.innerHTML;timers.push(setTimeout(()=>{el.innerHTML=next;},duration*.5));}
  }
  if(destination&&change.merge){
   const target=destination.getBoundingClientRect(),area=board.getBoundingClientRect();
   for(const id of change.merge){const old=before.get(id);if(!old)continue;const ghost=old.clone;ghost.removeAttribute('id');ghost.removeAttribute('data-block');ghost.setAttribute('aria-hidden','true');ghost.tabIndex=-1;ghost.classList.add('motion-ghost');Object.assign(ghost.style,{position:'absolute',left:`${old.rect.x-area.x}px`,top:`${old.rect.y-area.y}px`,width:`${old.rect.width}px`,height:`${old.rect.height}px`,margin:'0'});board.append(ghost);ghosts.push(ghost);play(ghost,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${target.x-old.rect.x}px,${target.y-old.rect.y}px) scale(.7)`,opacity:.75,offset:.8},{transform:`translate(${target.x-old.rect.x}px,${target.y-old.rect.y}px) scale(.4)`,opacity:0}],{duration:560,easing:'ease-in-out'});}
   play(destination,[{opacity:0,transform:'scale(.7)'},{opacity:0,offset:.65},{opacity:1,transform:'scale(1)'}],{duration:720,easing:'ease-out'});
  }
  await Promise.all(pending);
 }finally{timers.forEach(clearTimeout);ghosts.forEach(el=>el.remove());board.querySelectorAll('[data-block]').forEach(el=>el.style.removeProperty('z-index'));}
}
