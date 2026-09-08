// Pointer Events for mouse, pen and touch; native buttons remain the keyboard path.
export function draggable(button,onDrop,onClick){
  let pointer=null,ghost=null,x=0,y=0,startX=0,startY=0,frame,suppress=0;
  function cancel(){if(pointer!==null&&button.hasPointerCapture(pointer))button.releasePointerCapture(pointer);pointer=null;ghost?.remove();ghost=null;cancelAnimationFrame(frame);document.querySelectorAll('.drop-hover').forEach(el=>el.classList.remove('drop-hover'));}
  function move(){if(!ghost)return;ghost.style.left=x+12+'px';ghost.style.top=y+12+'px';document.querySelectorAll('.drop-hover').forEach(el=>el.classList.remove('drop-hover'));document.elementFromPoint(x,y)?.closest('[data-drop]')?.classList.add('drop-hover');if(y<70)window.scrollBy(0,-12);else if(y>innerHeight-70)window.scrollBy(0,12);frame=requestAnimationFrame(move);}
  button.addEventListener('pointerdown',event=>{if(event.button!==0)return;pointer=event.pointerId;startX=x=event.clientX;startY=y=event.clientY;button.setPointerCapture(pointer);});
  button.addEventListener('pointermove',event=>{if(event.pointerId!==pointer)return;x=event.clientX;y=event.clientY;if(!ghost&&Math.hypot(x-startX,y-startY)>8){ghost=document.createElement('div');ghost.className='electric-drag-ghost';ghost.setAttribute('aria-hidden','true');ghost.innerHTML=button.innerHTML;document.body.append(ghost);move();}});
  button.addEventListener('pointerup',event=>{if(event.pointerId!==pointer)return;if(ghost){const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-drop]');suppress=Date.now()+350;cancel();if(target)onDrop(target);}else cancel();});
  button.addEventListener('pointercancel',cancel);button.addEventListener('lostpointercapture',cancel);
  button.addEventListener('keydown',event=>{if(event.key==='Escape'){suppress=Date.now()+350;cancel();}});
  button.addEventListener('click',()=>{if(Date.now()>suppress)onClick?.();});
}
