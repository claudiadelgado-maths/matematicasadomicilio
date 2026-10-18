import {bank,categories} from './banco-preguntas.mjs';
import {mountQuiz} from '../../../biologia-parte-1/recursos/cuestionarios.mjs';
import {stages,initialOrder,gradeOrder,missions,statements} from './modelo.mjs';
const root=document.querySelector('.respiration-page');
if(root){
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const make=(tag,text,attrs={})=>{const e=document.createElement(tag);e.textContent=text;for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e;};
 const say=(selector,text,wrong=false)=>{const e=$(selector);e.textContent=text;e.classList.toggle('wrong',wrong);};
 const totals={mapa:4,orden:1,casos:16,ideas:8},done={mapa:0,orden:0,casos:0,ideas:0};
 function progress(id,count){done[id]=count;const a=$(`[data-station="${id}"]`);a.querySelector('span').textContent=`${count}/${totals[id]}`;a.classList.toggle('done',count===totals[id]);$('#practice-progress').textContent=`${Object.keys(totals).filter(k=>done[k]===totals[k]).length} de 4 prácticas completadas`;}
 let current=0;const seen=new Set();
 function showStage(index,count=true){
  current=index;const stage=stages[index];if(count)seen.add(stage.id);
  $$('#stage-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stage===stage.id)));
  $$('#route-map [data-region]').forEach(e=>e.classList.toggle('selected',e.dataset.region===stage.id));
  $('#stage-name').textContent=stage.name;$('#stage-place').textContent=stage.place;$('#stage-detail').textContent=stage.detail;$('#stage-energy').textContent=stage.energy;$('#stage-key').textContent=stage.key;
  $('#stage-counter').textContent=`Paso ${index+1} de 4 · ${seen.size} etapas exploradas`;
  $('#stage-prev').disabled=index===0;$('#stage-next').disabled=index===3;progress('mapa',seen.size);
 }
 stages.forEach((s,i)=>{const b=make('button',`${i+1} · ${s.name}`,{type:'button','data-stage':s.id,'aria-pressed':String(i===0)});b.addEventListener('click',()=>showStage(i));$('#stage-tabs').append(b);});
 $('#stage-prev').addEventListener('click',()=>showStage(Math.max(0,current-1)));$('#stage-next').addEventListener('click',()=>showStage(Math.min(3,current+1)));
 $('#stage-reset').addEventListener('click',()=>{seen.clear();showStage(0,false);});showStage(0);
 const orderFields=$$('#order-form select');
 orderFields.forEach((select,i)=>{for(const id of initialOrder){const stage=stages.find(s=>s.id===id);select.append(make('option',stage.name,{value:id}));}select.addEventListener('change',()=>{say('#order-feedback','');orderFields.forEach(s=>s.removeAttribute('aria-invalid'));$$('[data-order-result]').forEach(e=>e.textContent='');});});
 $('#order-form').addEventListener('submit',event=>{
  event.preventDefault();const result=gradeOrder(orderFields.map(s=>s.value));
  if(result.missing.length){say('#order-feedback','Completa las cuatro posiciones antes de comprobar.',true);orderFields[result.missing[0]].focus();return;}
  if(result.duplicate){say('#order-feedback','Cada etapa debe aparecer una sola vez. Revisa las opciones repetidas.',true);return;}
  result.correct.forEach((ok,i)=>{orderFields[i].setAttribute('aria-invalid',String(!ok));$(`[data-order-result="${i}"]`).textContent=ok?'✓ En su lugar':`Pista: aquí ocurre ${stages[i].short.toLowerCase()}.`;});
  if(result.complete)progress('orden',1);
  say('#order-feedback',result.complete?'✓ Ruta conectada: glucólisis → oxidación del piruvato → Krebs → cadena y fosforilación oxidativa. Observa que solo el primer paso ocurre en el citosol.':`${result.correct.filter(Boolean).length} de 4 posiciones correctas. Usa las pistas y vuelve a intentarlo.`,!result.complete);
 });
 $('#order-reset').addEventListener('click',()=>{orderFields.forEach(s=>{s.value='';s.removeAttribute('aria-invalid');});$$('[data-order-result]').forEach(e=>e.textContent='');progress('orden',0);say('#order-feedback','Orden reiniciado.');});
 function mountCases(prefix,items,station){
  let index=0;const solved=new Set();
  function render(){const item=items[index];$(`#${prefix}-number`).textContent=`${index+1} / ${items.length}`;$(`#${prefix}-title`).textContent=item.title;$(`#${prefix}-prompt`).textContent=item.prompt;
   $$( `#${prefix}-tabs button`).forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.case===item.id));b.classList.toggle('solved',solved.has(b.dataset.case));});
   const answers=$(`#${prefix}-answers`);answers.replaceChildren();item.options.forEach(([id,name])=>{const b=make('button',name,{type:'button','data-answer':id,'aria-pressed':'false'});b.addEventListener('click',()=>{const ok=id===item.answer;[...answers.children].forEach(e=>e.setAttribute('aria-pressed',String(e===b)));if(ok){solved.add(item.id);progress(station,solved.size);$(`#${prefix}-progress`).textContent=`${solved.size} de ${items.length} resueltos`;$(`#${prefix}-tabs [data-case="${item.id}"]`).classList.add('solved');}say(`#${prefix}-feedback`,`${ok?'✓ Correcto.':'Revisa tu respuesta.'} ${item.why}${ok?'':' Puedes intentarlo otra vez.'}`,!ok);});answers.append(b);});
   say(`#${prefix}-feedback`,solved.has(item.id)?'Ya resolviste este caso. Puedes repasarlo sin sumar puntos de nuevo.':'');$(`#${prefix}-next`).textContent=index===items.length-1?'Volver al primero ↻':'Siguiente →';
  }
  items.forEach((item,i)=>{const b=make('button',String(i+1).padStart(2,'0'),{type:'button','data-case':item.id,'aria-label':`${i+1}: ${item.title}`});b.addEventListener('click',()=>{index=i;render();});$(`#${prefix}-tabs`).append(b);});
  $(`#${prefix}-next`).addEventListener('click',()=>{index=(index+1)%items.length;render();$(`#${prefix}-answers button`).focus({preventScroll:true});});
  $(`#${prefix}-reset`).addEventListener('click',()=>{solved.clear();index=0;progress(station,0);$(`#${prefix}-progress`).textContent=`0 de ${items.length} resueltos`;render();say(`#${prefix}-feedback`,'Práctica reiniciada.');});render();
 }
 mountCases('mission',missions,'casos');mountCases('truth',statements,'ideas');
 mountQuiz($('#repaso-respiracion'),{bank,categories,categoryLabel:'ideas de respiración celular',studyLink:'#concepto'});
 $$('.interactive').forEach(e=>e.hidden=false);
}
