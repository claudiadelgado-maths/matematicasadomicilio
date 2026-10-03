import {CASOS,generar,crearEstado,responder,siguiente} from './modelo.mjs?v=20261002-medidas1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let lesson='lados',example=generar(lesson),step=1,visual=false,pyth=0,timer;
const state=crearEstado();
const copy={lados:'El perímetro cuenta toda la orilla una vez. Suma los tres lados, aunque tengan medidas distintas.',altura:'La altura forma 90° con la base: no es el lado inclinado. Dos copias de un triángulo forman un paralelogramo de área b × h; una copia ocupa la mitad.',equilatero:'Las tres marcas iguales indican tres lados de la misma longitud. Con conocer uno basta: P = 3 × lado.',isosceles:'Las dos marcas iguales señalan los lados que se repiten. Suma dos veces esa medida y después la base.',rectangulo:'Los catetos se encuentran a 90°. Pueden ser base y altura. Para el perímetro necesitas los tres lados; Pitágoras ayuda si falta uno.'};
function diagram(q,{solved=false,duplicate=false,trace=false}={}){
 const scale=Math.min(330/(q.base+(duplicate?q.foot:0)),185/q.height),width=(q.base+(duplicate?q.foot:0))*scale;
 const ax=(520-width)/2,ay=280,bx=ax+q.base*scale,cx=ax+q.foot*scale,cy=ay-q.height*scale;
 const poly=`${ax},${ay} ${bx},${ay} ${cx},${cy}`,baseText=`${q.base} ${q.unit}`;
 const value=side=>q.hidden===side&&!solved?'?':`${q[side]} ${q.unit}`;
 let body=`<polygon points="${poly}" fill="${q.goal==='A'?'#d9f0e9':'#f1effa'}" stroke="#18776c" stroke-width="3"/>`;
 if(duplicate)body+=`<polygon class="copy-triangle" points="${bx},${ay} ${cx},${cy} ${bx+q.foot*scale},${cy}" fill="#e6dcf5" stroke="#7959a5" stroke-width="3"/><text x="260" y="35" text-anchor="middle">Dos copias: b × h</text>`;
 if(trace)body+=`<path class="trace" pathLength="1" d="M${ax} ${ay} L${bx} ${ay} L${cx} ${cy} Z" fill="none" stroke="#a45b14" stroke-width="7"/>`;
 body+=`<text x="${(ax+bx)/2}" y="317" text-anchor="middle">${q.id==='altura'?'b = ':''}${baseText}</text>`;
 if(q.id==='altura')body+=`<path d="M${cx} ${cy} V${ay}" stroke="#7752a4" stroke-width="3" stroke-dasharray="6 5"/><path d="M${cx} ${ay-15} H${cx+15} V${ay}" fill="none" stroke="#7752a4" stroke-width="2"/><text x="${cx+18}" y="${(cy+ay)/2}">h = ${q.height} ${q.unit}</text>`;
 else{
  if(q.id!=='equilatero')body+=`<text text-anchor="end" x="${Math.max(65,(ax+cx)/2-14)}" y="${(ay+cy)/2}">${value('left')}</text>`;
  if(!['equilatero','isosceles'].includes(q.id))body+=`<text text-anchor="start" x="${Math.min(414,(bx+cx)/2+14)}" y="${(ay+cy)/2}">${value('right')}</text>`;
  if(q.id==='rectangulo')body+=`<path d="M${ax} ${ay-17} H${ax+17} V${ay}" fill="none" stroke="#7752a4" stroke-width="2.5"/><text x="${ax+25}" y="${ay-22}">90°</text>`;
  if(['equilatero','isosceles'].includes(q.id)){
   const edges=[[[ax,ay],[cx,cy]],[[cx,cy],[bx,ay]]];if(q.id==='equilatero')edges.push([[ax,ay],[bx,ay]]);
   for(const [[x1,y1],[x2,y2]] of edges){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),mx=(x1+x2)/2,my=(y1+y2)/2;body+=`<path d="M${mx-dy/len*8} ${my+dx/len*8} L${mx+dy/len*8} ${my-dx/len*8}" stroke="#7752a4" stroke-width="3"/>`;}
  }
 }
 if(solved)body+=`<text x="260" y="355" text-anchor="middle">${q.goal} = ${q.answer} ${q.unit}${q.goal==='A'?'²':''}</text>`;
 const known=`Base ${q.base} ${q.unit}. ${q.id==='altura'?`Altura perpendicular ${q.height} ${q.unit}.`:q.id==='equilatero'?'Tres lados iguales.':q.id==='isosceles'?`Dos lados iguales de ${q.left} ${q.unit}.`:`Lado izquierdo ${value('left')}; lado derecho ${value('right')}.`}`;
 return `<svg viewBox="0 0 520 380" role="img" aria-label="${known}${q.id==='rectangulo'?' Ángulo recto entre los catetos.':''}">${body}</svg>`;
}
$('#case-tabs').innerHTML=CASOS.map(c=>`<button type="button" class="lab-button" data-case="${c.id}">${c.nombre}</button>`).join('');
$('#case-filter').insertAdjacentHTML('beforeend',CASOS.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join(''));
function renderLesson(){
 $$('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===lesson)));
 $('#lesson-title').textContent=CASOS.find(c=>c.id===lesson).nombre;$('#lesson-copy').textContent=copy[lesson];
 $('#lesson-diagram').innerHTML=diagram(example,{solved:step>=example.steps.length,duplicate:lesson==='altura'&&visual,trace:lesson!=='altura'&&visual});
 $('#lesson-caption').textContent=lesson==='altura'?'La línea discontinua es perpendicular a la base.':'Las marcas iguales indican lados iguales. El cuadrado señala un ángulo recto.';
 $('#pythagoras').hidden=lesson!=='rectangulo';$$('[data-pyth]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.pyth)===pyth)));
 $('#lesson-steps').innerHTML=example.steps.slice(0,step).map(s=>`<li>${s}</li>`).join('');$('#lesson-step').disabled=step===example.steps.length;
 $('#lesson-step').textContent=step===example.steps.length?'Ejemplo completo ✓':'Ver siguiente paso →';
 $('#visual-action').textContent=lesson==='altura'?(visual?'Volver a una copia':'Unir dos triángulos'):'Recorrer el contorno';
}
function newLesson(){example=generar(lesson,Math.random,pyth);step=1;visual=false;renderLesson();}
$$('[data-case]').forEach(b=>b.onclick=()=>{lesson=b.dataset.case;newLesson();});
$$('[data-pyth]').forEach(b=>b.onclick=()=>{pyth=Number(b.dataset.pyth);newLesson();});
$('#lesson-new').onclick=newLesson;$('#lesson-step').onclick=()=>{step++;renderLesson();};
$('#visual-action').onclick=()=>{visual=lesson==='altura'?!visual:true;renderLesson();};
function progress(){const complete=state.completo&&state.resueltos%4===0,n=complete?4:state.resueltos%4;$('#progress').value=n;$('#round-progress').textContent=`Ronda ${Math.floor(Math.max(0,state.resueltos-(complete?1:0))/4)+1} · ${n}/4 aciertos${complete?' · ¡Completada! ✦':''}`;$('#score').textContent=`${state.resueltos} resueltos · ${state.primerIntento} al primer intento`;}
function renderQuestion(focus=false){
 clearTimeout(timer);const q=state.q;$('#question-diagram').innerHTML=diagram(q);$('#question-title').textContent=q.title;
 $('#question-type').textContent=CASOS.find(c=>c.id===q.id).nombre;$('#question-caption').textContent=q.id==='altura'?'Usa la altura perpendicular, no el lado inclinado.':q.hidden?'El lado con ? se obtiene con Pitágoras. Todos los lados tienen medidas enteras.':'Las marcas iguales tienen la misma longitud.';
 $('#answer-unit').textContent=q.unit+(q.goal==='A'?'²':'');$('#answer').value='';$('#answer').readOnly=false;$('#answer').className='';$('#answer').removeAttribute('aria-invalid');$('#check').disabled=false;$('#next').disabled=true;$('#hint').open=false;$('#hint-copy').textContent=q.hint;$('#feedback').textContent='';$('#feedback').removeAttribute('data-kind');progress();if(focus)$('#question-title').focus({preventScroll:true});
}
$('#answer-form').onsubmit=e=>{
 e.preventDefault();const result=responder(state,$('#answer').value);if(result==='bloqueada')return;
 const out=$('#feedback');out.dataset.kind=result;clearTimeout(timer);
 out.textContent=result==='correcta'?`✓ ¡Correcto! ${state.q.steps.join(' · ')}`:result==='invalida'?'Escribe un número entero, sin las unidades.':`Todavía no. ${state.q.hint} Puedes intentarlo otra vez.`;
 $('#answer').className=result==='correcta'?'correct':result==='error'?'wrong':'';$('#answer').setAttribute('aria-invalid',String(result!=='correcta'));
 if(result==='error'){const mark=document.createElement('span');mark.className='error-mark';mark.textContent='×';mark.setAttribute('aria-hidden','true');out.prepend(mark);timer=setTimeout(()=>mark.remove(),1100);}
 if(state.completo){$('#answer').readOnly=true;$('#check').disabled=true;$('#next').disabled=false;$('#question-diagram').innerHTML=diagram(state.q,{solved:true,trace:state.q.goal==='P'});}progress();
};
$('#answer').oninput=()=>{if(!state.completo){$('#answer').className='';$('#answer').removeAttribute('aria-invalid');}};
function next(){siguiente(state);renderQuestion(true);}
$('#new-exercise').onclick=next;$('#next').onclick=()=>{if(state.completo)next();};$('#case-filter').onchange=e=>{state.tipo=e.target.value;next();};
renderLesson();renderQuestion();
