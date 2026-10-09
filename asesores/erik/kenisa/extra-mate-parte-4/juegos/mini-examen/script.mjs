import {TEMAS,crearBanco,siguientePregunta,crearExamen,responderExamen,avanzarExamen,resultado,responderPractica} from './modelo.mjs?v=20261009-mini1';
import {dibujar,escapar} from './figuras.mjs?v=20261009-mini1';
const $=id=>document.getElementById(id),banco=crearBanco(),practicas=new Map();let tema=TEMAS[0].id,examen=null,flash=0;
const info=id=>TEMAS.find(t=>t.id===id);
// Las opciones visuales no llevan medidas: encuadre cercano para reconocer detalles en móvil.
const miniatura=d=>dibujar(d).replace('viewBox="0 0 400 340"','viewBox="65 15 270 280"');
function actual(){if(!practicas.has(tema))practicas.set(tema,{pregunta:siguientePregunta(banco,tema),numero:1,resueltos:0,primero:0});return practicas.get(tema);}
function opcionesHTML(q,prefix,{respuesta=null,definitivo=false}={}){
 return q.opciones.map((o,i)=>{
  const correcto=definitivo&&o.id===q.correcta,incorrecto=definitivo&&respuesta===o.id&&respuesta!==q.correcta||!definitivo&&q.descartadas.includes(o.id),bloqueado=definitivo||incorrecto;
  return `<button class="answer-option ${o.dibujo?'visual-option ':''}${correcto?'correct ':incorrecto?'incorrect ':''}" type="button" data-option="${escapar(o.id)}" ${bloqueado?'disabled':''}><span class="option-letter">${'ABCD'[i]}</span>${o.dibujo?`<span class="option-art">${miniatura(o.dibujo)}</span>`:''}<span class="option-label">${escapar(o.label||'Opción '+ 'ABCD'[i])}</span><span class="option-mark" aria-hidden="true">${correcto?'✓':incorrecto?'×':''}</span><span class="sr-only">${correcto?'Correcta':incorrecto?'Incorrecta':''}</span></button>`;
 }).join('');
}
function dibujarPregunta(q,prefix){
 $(`${prefix}-question`).textContent=q.pregunta;$(`${prefix}-note`).textContent=q.nota;$(`${prefix}-note`).hidden=!q.nota;
 $(`${prefix}-data`).innerHTML=q.datos.map(d=>`<span>${escapar(d)}</span>`).join('');$(`${prefix}-data`).hidden=!q.datos.length;
 $(`${prefix}-art`).innerHTML=dibujar(q.dibujo);$(`${prefix}-art`).hidden=!q.dibujo;$(`${prefix}-art`).classList.toggle('wide-art',q.dibujo?.kind==='pair');
 $(`${prefix}-options`).classList.toggle('has-figures',q.opciones.some(o=>o.dibujo));
 const fb=$(`${prefix}-feedback`);fb.className='answer-message';fb.textContent='';
}
function mensaje(prefix,texto,ok,temporal=false){
 const fb=$(`${prefix}-feedback`);fb.className='answer-message '+(ok?'correct':'incorrect');fb.innerHTML=`<span class="message-mark" aria-hidden="true">${ok?'✓':'×'}</span><span>${escapar(texto)}</span>`;
 if(temporal){clearTimeout(flash);flash=setTimeout(()=>{fb.querySelector('.message-mark')?.remove();},1200);}
}
function pintarPractica(enfocar=false){
 const s=actual(),q=s.pregunta;clearTimeout(flash);dibujarPregunta(q,'practice');$('practice-number').textContent=`${info(tema).numero.toString().padStart(2,'0')} · ${info(tema).nombre} · Ejercicio ${s.numero}`;
 $('practice-options').innerHTML=opcionesHTML(q,'practice',{definitivo:q.resuelta});
 $('practice-options').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
  const ok=responderPractica(q,b.dataset.option);if(ok===null)return;
  if(ok){s.resueltos++;if(q.intentos===1)s.primero++;pintarPractica();$('next-practice').focus({preventScroll:true});}
  else{pintarPractica();mensaje('practice','Inténtalo otra vez. '+q.pista,false,true);const disponible=$('practice-options').querySelector('button:not(:disabled)');disponible?.focus({preventScroll:true});}
 }));
 $('practice-hint-text').textContent=q.pista;$('practice-progress').textContent=`${s.resueltos} resueltos · ${s.primero} al primer intento en este tema`;
 $('next-practice').hidden=!q.resuelta;if(q.resuelta)mensaje('practice',q.explicacion,true);else if(q.descartadas.length)mensaje('practice','Puedes probar otra opción. '+q.pista,false);
 if(enfocar)$('practice-question').focus();
}
function nuevoEjercicio(){const s=actual();s.pregunta=siguientePregunta(banco,tema);s.numero++;$('practice-hint').open=false;pintarPractica(true);}
function pintarExamen(enfocar=false){
 if(!examen)examen=crearExamen();
 $('exam-running').hidden=examen.terminado;$('exam-result').hidden=!examen.terminado;
 $('examen').setAttribute('aria-labelledby',examen.terminado?'result-title':'exam-question');
 if(examen.terminado){pintarResultado(enfocar);return;}
 const q=examen.preguntas[examen.indice],respuesta=examen.respuestas[examen.indice],contestadas=examen.respuestas.filter(Boolean).length;
 dibujarPregunta(q,'exam');$('exam-number').textContent=`Pregunta ${examen.indice+1} de 28 · ${info(q.tipo).nombre}`;$('exam-bar').value=contestadas;$('exam-progress-text').textContent=`${contestadas} de 28 respuestas`;
 $('exam-options').innerHTML=opcionesHTML(q,'exam',{respuesta:respuesta?.id,definitivo:!!respuesta});
 $('exam-options').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
  const ok=responderExamen(examen,b.dataset.option);if(ok===null)return;pintarExamen();$('exam-next').focus({preventScroll:true});
 }));
 $('exam-next').disabled=!respuesta;$('exam-next').textContent=examen.indice===27?'Ver resultado →':'Siguiente →';
 if(respuesta)mensaje('exam',(respuesta.correcto?'¡Correcto! ':'Respuesta registrada. ')+q.explicacion,respuesta.correcto);
 if(enfocar)$('exam-question').focus();
}
function pintarRevision(){
 const soloErrores=$('only-errors').checked,entradas=examen.preguntas.map((q,i)=>({q,i,a:examen.respuestas[i]})).filter(v=>!soloErrores||!v.a.correcto);
 if(!entradas.length){$('exam-review').innerHTML='<p class="all-correct">✓ ¡Todas correctas! Desmarca el filtro si quieres volver a verlas.</p>';return;}
 $('exam-review').innerHTML=entradas.map(({q,i,a})=>`<details class="review-item" data-review="${i}"><summary><span>${String(i+1).padStart(2,'0')} · ${escapar(info(q.tipo).nombre)}</span><b class="${a.correcto?'review-ok':'review-retry'}">${a.correcto?'✓ Correcta':'× Por repasar'}</b></summary><div class="review-content"></div></details>`).join('');
 $('exam-review').querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{
  if(!d.open||d.dataset.loaded)return;d.dataset.loaded='true';const i=+d.dataset.review,q=examen.preguntas[i],a=examen.respuestas[i];
  d.querySelector('.review-content').innerHTML=`<h4>${escapar(q.pregunta)}</h4>${q.nota?`<p class="question-note">${escapar(q.nota)}</p>`:''}${q.datos.length?`<div class="exam-data">${q.datos.map(v=>`<span>${escapar(v)}</span>`).join('')}</div>`:''}${q.dibujo?`<div class="question-art ${q.dibujo.kind==='pair'?'wide-art':''}">${dibujar(q.dibujo)}</div>`:''}<div class="answer-grid ${q.opciones.some(o=>o.dibujo)?'has-figures':''}">${opcionesHTML(q,'review',{respuesta:a.id,definitivo:true})}</div><p class="review-explanation">${escapar(q.explicacion)}</p>`;
 }));
}
function pintarResultado(enfocar=false){
 const r=resultado(examen);$('score').textContent=r.nota;$('score-detail').textContent=`${r.aciertos} respuestas correctas de ${r.total}.`;
 $('topic-results').innerHTML=r.temas.map(t=>`<button type="button" data-practice-topic="${t.id}" class="topic-result ${t.aciertos===2?'complete':''}"><span>${t.icono}</span><b>${escapar(t.nombre)}</b><small>${t.aciertos} / 2 · Practicar →</small></button>`).join('');
 $('topic-results').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{tema=b.dataset.practiceTopic;$('topic').value=tema;nuevoEjercicio();location.hash='practica';cambiarModo();$('practice-question').focus();}));
 pintarRevision();if(enfocar)$('result-title').focus();
}
function nuevoExamen(){examen=crearExamen();$('restart-box').open=false;$('only-errors').checked=true;pintarExamen(true);}
function cambiarModo(){
 const modo=location.hash==='#examen'?'examen':'practica';document.querySelectorAll('[data-mode-panel]').forEach(p=>p.hidden=p.dataset.modePanel!==modo);
 document.querySelectorAll('[data-mode]').forEach(a=>{if(a.dataset.mode===modo)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(modo==='examen')pintarExamen();else pintarPractica();
}
$('topic').innerHTML=TEMAS.map(t=>`<option value="${t.id}">${t.numero.toString().padStart(2,'0')} · ${t.nombre}</option>`).join('');
$('topic').addEventListener('change',e=>{tema=e.target.value;$('practice-hint').open=false;pintarPractica();});
$('new-practice').addEventListener('click',nuevoEjercicio);$('next-practice').addEventListener('click',nuevoEjercicio);
$('exam-next').addEventListener('click',()=>{if(avanzarExamen(examen))pintarExamen(true);});
$('restart-exam').addEventListener('click',nuevoExamen);$('another-exam').addEventListener('click',nuevoExamen);$('only-errors').addEventListener('change',pintarRevision);
window.addEventListener('hashchange',cambiarModo);cambiarModo();
