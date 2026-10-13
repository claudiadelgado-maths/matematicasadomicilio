import {PARTES,FIGURAS,parte,nombreFigura,crearPractica,siguiente,responder} from './modelo.mjs';
import {ilustracion,miniatura} from './figuras.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let figura=5,seleccion='lado',giro=-Math.PI/2,vista='explora';
const exploradas=new Set(),practicas={imagenes:crearPractica('imagenes'),palabras:crearPractica('palabras')},timers={},crossTimers={};
$('#figure-picker').innerHTML=FIGURAS.map((nombre,i)=>`<button type="button" data-figure="${i+3}" aria-pressed="false">${miniatura(i+3)}<span>${nombre}</span><small>${i+3} lados</small></button>`).join('');
$('#part-picker').innerHTML=PARTES.map((p,i)=>`<button type="button" data-part="${p.id}" aria-pressed="false"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span>${p.nombre}</button>`).join('');
function explorar(){
 const p=parte(seleccion),sinDiagonal=seleccion==='diagonal'&&figura===3;exploradas.add(seleccion);
 $('#explore-art').innerHTML=ilustracion({n:figura,parte:seleccion,giro},{color:(figura-3)%5,explorar:true});
 $('#explore-name').textContent=p.nombre;$('#explore-description').textContent=sinDiagonal?'El triángulo no tiene diagonales: todas sus esquinas son vecinas. Cambia a una figura con más lados para ver una.':p.texto;
 $('#explore-figure-name').textContent=nombreFigura(figura);$('#explore-counter').textContent=`${figura} lados`;
 $('#explored-summary').textContent=`${exploradas.size} de 9 partes exploradas · Puedes volver a cualquiera.`;
 $$('[data-figure]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.figure)===figura)));
 $$('[data-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===seleccion)));
}
$$('[data-figure]').forEach(b=>b.onclick=()=>{figura=Number(b.dataset.figure);explorar();});
$$('[data-part]').forEach(b=>b.onclick=()=>{seleccion=b.dataset.part;explorar();});
$('#rotate-figure').onclick=()=>{giro+=Math.PI/7;explorar();};
function cancelar(modo){clearTimeout(timers[modo]);clearTimeout(crossTimers[modo]);}
function mensaje(modo){
 const q=practicas[modo].pregunta,el=$(`#${modo}-feedback`),p=parte(q.objetivo);el.removeAttribute('data-kind');
 if(q.resuelta){el.dataset.kind='correct';el.textContent=`✓ ¡Sí! ${p.nombre}. ${p.texto}`;}
 else if(q.ultima){
  el.dataset.kind='incorrect';el.textContent=modo==='imagenes'?`Esa imagen muestra ${parte(q.opciones[q.ultima.index].parte).nombre.toLowerCase()}. ${p.pista} Prueba otra.`:`Mira de nuevo: ${p.pista} Prueba otra palabra.`;
 }else el.textContent='Toca una opción. Puedes volver a intentarlo.';
}
function pintar(modo){
 const s=practicas[modo],q=s.pregunta,esImagen=modo==='imagenes';
 $(`#${modo}-number`).textContent=`Reto ${s.numero}`;
 $(`#${modo}-question`).textContent=esImagen?parte(q.objetivo).nombre.toLocaleUpperCase('es'):'¿Qué parte es esta?';
 $(`#${modo}-instruction`).textContent=esImagen?'Encuentra la imagen que resalta esta parte.':'Ponle nombre a la parte de color.';
 const figuraEl=$(`#${modo}-figure`);figuraEl.hidden=esImagen;
 if(!esImagen)figuraEl.innerHTML=ilustracion(q.figura,{color:q.color})+`<figcaption>${nombreFigura(q.figura.n)} · C marca el centro</figcaption>`;
 $(`#${modo}-answers`).innerHTML=q.opciones.map((o,i)=>{
  const acertada=q.resuelta&&o.parte===q.objetivo,fallida=q.descartadas.includes(i),letra='ABCD'[i];
  const visual=esImagen?ilustracion(o,{color:q.color}):'';
  const texto=esImagen?nombreFigura(o.n):parte(o.parte).nombre;
  return `<button type="button" class="answer-card ${acertada?'correct':fallida?'incorrect':''}" data-answer="${i}" ${q.resuelta||fallida?'disabled':''}>${visual}<span class="answer-caption"><span class="answer-letter">${letra}</span><span>${texto}</span></span>${acertada?'<span class="answer-result" aria-label="Respuesta correcta">✓</span>':fallida?'<span class="answer-result" aria-label="Revisa esta opción">↻</span>':''}</button>`;
 }).join('');
 $(`[data-next="${modo}"]`).hidden=!q.resuelta;
 $(`#${modo}-score`).textContent=`Aciertos: ${s.aciertos} · Partes reconocidas: ${s.descubiertas.size}/9${s.descubiertas.size===9?' · ¡Colección completa!':''}`;
 $(`#${modo}-progress`).innerHTML=PARTES.map(p=>`<span class="${s.descubiertas.has(p.id)?'known':''}">${s.descubiertas.has(p.id)?'✓':'○'} ${p.nombre}</span>`).join('');mensaje(modo);
}
function avanzar(modo,enfocar=false){cancelar(modo);siguiente(practicas[modo]);pintar(modo);if(enfocar)$(`#${modo}-question`).focus({preventScroll:true});}
function programar(modo){
 clearTimeout(timers[modo]);const q=practicas[modo].pregunta;
 if(!q.resuelta||vista!==modo||!$(`[data-auto="${modo}"]`).checked||document.hidden)return;
 timers[modo]=setTimeout(()=>{
  if(vista===modo&&practicas[modo].pregunta===q&&!document.hidden){const enfocar=$(`#${modo}`).contains(document.activeElement);avanzar(modo,enfocar);}
 },3200);
}
for(const modo of ['imagenes','palabras']){
 $(`#${modo}-answers`).addEventListener('click',e=>{
  const b=e.target.closest('[data-answer]');if(!b)return;
  const mantenerFoco=$(`#${modo}-answers`).contains(document.activeElement),resultado=responder(practicas[modo],Number(b.dataset.answer));if(!resultado)return;
  cancelar(modo);pintar(modo);
  if(resultado.correcta){if(mantenerFoco)$(`[data-next="${modo}"]`).focus({preventScroll:true});programar(modo);}
  else{
   const cross=document.createElement('span');cross.className='error-mark';cross.textContent='×';cross.setAttribute('aria-hidden','true');$(`#${modo}-feedback`).prepend(cross);crossTimers[modo]=setTimeout(()=>cross.remove(),1100);
   if(mantenerFoco)$(`#${modo}-answers button:not(:disabled)`)?.focus({preventScroll:true});
  }
 });
 $(`[data-new="${modo}"]`).onclick=()=>avanzar(modo,true);
 $(`[data-next="${modo}"]`).onclick=()=>avanzar(modo,true);
 $(`[data-auto="${modo}"]`).onchange=()=>programar(modo);
 pintar(modo);
}
function mostrar(modo){
 if(!['explora','imagenes','palabras'].includes(modo))modo='explora';
 for(const m of ['imagenes','palabras'])cancelar(m);vista=modo;
 $$('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==modo);
 $$('.view-switch [data-view]').forEach(b=>{if(b.dataset.view===modo)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
}
$$('[data-view]').forEach(a=>a.onclick=e=>{
 e.preventDefault();history.replaceState(null,'',`#${a.dataset.view}`);mostrar(a.dataset.view);
 if(!a.closest('.view-switch')){
  const heading=$(`#${vista} h2`);heading.tabIndex=-1;heading.focus({preventScroll:true});$('.view-switch').scrollIntoView({block:'start',behavior:'instant'});
 }
});
addEventListener('hashchange',()=>mostrar(location.hash.slice(1)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const modo of ['imagenes','palabras'])cancelar(modo);});
explorar();mostrar(location.hash.slice(1));
