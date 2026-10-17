import {structures,nutritionSteps,checkOrder,gradeSelections,caseFields,cases,reproduction} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {shuffle} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';
import {mountQuiz} from '../../../biologia-parte-1/recursos/cuestionarios.mjs';

const root=document.querySelector('.fungi-page');
if(root){
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 const visited=new Set();
 function selectPart(id){
  const i=structures.findIndex(p=>p.id===id),p=structures[i];visited.add(id);
  $('#structure-name').textContent=p.name;$('#structure-function').textContent=p.fn;$('#structure-detail').textContent=p.detail;$('#structure-cue').textContent=p.cue;
  $('#structure-number').textContent=`${String(i+1).padStart(2,'0')} / 05`;
  $('#structure-progress').textContent=`${visited.size} de 5 estructuras exploradas`;
  $$('[data-structure]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.structure===id)));
  $$('.fungi-diagram [data-part]').forEach(g=>g.classList.toggle('selected',g.dataset.part===id));
 }
 $$('[data-structure]').forEach(b=>b.addEventListener('click',()=>selectPart(b.dataset.structure)));selectPart('hifa');
 const relation=$('#relation-form');
 function clearRelations(){
  $('#relation-feedback').textContent='';relation.querySelectorAll('select').forEach(s=>s.removeAttribute('aria-invalid'));
  $$('[data-relation-result]').forEach(e=>e.textContent='');
 }
 relation.addEventListener('change',clearRelations);relation.addEventListener('reset',clearRelations);
 relation.addEventListener('submit',event=>{
  event.preventDefault();clearRelations();
  const expected=Object.fromEntries(structures.map(p=>[p.id,p.id]));
  const answers=Object.fromEntries(new FormData(relation));const result=gradeSelections(expected,answers);
  if(result.missing.length){$('#relation-feedback').textContent='Elige las cinco estructuras antes de comprobar.';relation.elements.namedItem(result.missing[0]).focus();return;}
  structures.forEach(p=>{const correct=answers[p.id]===p.id;relation.elements.namedItem(p.id).setAttribute('aria-invalid',String(!correct));$(`[data-relation-result="${p.id}"]`).textContent=correct?'✓ Relación correcta':`Corresponde a: ${p.name}.`;});
  $('#relation-feedback').textContent=result.complete?'✓ 5 de 5. ¡Estructuras y funciones conectadas!':`${result.correct} de 5 correctas. Revisa las correcciones y vuelve a intentarlo.`;
 });

 let order=[];
 function renderOrder(){
  $('#nutrition-order').replaceChildren(...order.map(id=>{const step=nutritionSteps.find(s=>s.id===id);const item=el('li');item.append(el('strong',step.title),el('p',step.text));return item;}));
  $('#nutrition-count').textContent=`${order.length} de 4 pasos elegidos`;
  $('#nutrition-undo').disabled=!order.length;
  $$('#nutrition-options button').forEach(b=>{b.disabled=order.includes(b.dataset.step);});
  $('#nutrition-feedback').textContent='';
 }
 function resetOrder(){
  order=[];$('#nutrition-options').replaceChildren(...shuffle(nutritionSteps).map(step=>{
   const b=el('button',step.title);b.type='button';b.dataset.step=step.id;
   b.addEventListener('click',()=>{if(order.includes(step.id))return;order.push(step.id);renderOrder();
    const target=$$('#nutrition-options button').find(b=>!b.disabled)||$('#nutrition-check');target.focus({preventScroll:true});
   });return b;
  }));renderOrder();
 }
 $('#nutrition-undo').addEventListener('click',()=>{order.pop();renderOrder();});
 $('#nutrition-reset').addEventListener('click',resetOrder);
 $('#nutrition-check').addEventListener('click',()=>{
  const result=checkOrder(order);
  $('#nutrition-feedback').textContent=!result.complete?'Selecciona los cuatro pasos para revisar la secuencia.':result.correct?'✓ Correcto: primero digestión externa, después absorción. Los nutrientes se utilizan dentro de la célula.':`Revisa el paso ${result.firstWrong+1}: ahí corresponde «${nutritionSteps[result.firstWrong].title}». Puedes deshacer pasos o reiniciar.`;
 });resetOrder();

 let mechanism=0,stage=0;
 function showStage(announce=false){
  const m=reproduction[mechanism],s=m.steps[stage];
  $$('#reproduction-modes button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===mechanism)));
  $('#reproduction-kind').textContent=m.kind;$('#reproduction-count').textContent=`Etapa ${stage+1} de ${m.steps.length}`;
  $('#reproduction-title').textContent=s[0];$('#reproduction-copy').textContent=s[1];$('#reproduction-image').setAttribute('href',`recursos/ciclos.svg#${s[2]}`);
  $('#reproduction-visual-title').textContent=`${m.name}: ${s[0]}`;
  $('#reproduction-prev').disabled=stage===0;$('#reproduction-next').textContent=stage===m.steps.length-1?'Ver desde el inicio ↻':'Siguiente etapa →';
  $('#reproduction-announcement').textContent=announce?`${m.name}. Etapa ${stage+1}: ${s[0]}. ${s[1]}`:'';
 }
 reproduction.forEach((m,i)=>{const b=el('button',m.name);b.type='button';b.dataset.mechanism=m.id;b.addEventListener('click',()=>{mechanism=i;stage=0;showStage(true);});$('#reproduction-modes').append(b);});
 $('#reproduction-prev').addEventListener('click',()=>{if(stage>0)stage--;showStage(true);});
 $('#reproduction-next').addEventListener('click',()=>{stage=(stage+1)%reproduction[mechanism].steps.length;showStage(true);});showStage();

 let caseIndex=0;const drafts=new Map(),solved=new Set();
 function clearCase(){
  $('#case-feedback').textContent='';$('#case-explanation').hidden=true;
  caseFields.forEach(f=>{$(`#case-field-${f.id}`).removeAttribute('aria-invalid');$(`#case-result-${f.id}`).textContent='';});
 }
 function saveCase(){drafts.set(cases[caseIndex].id,Object.fromEntries(caseFields.map(f=>[f.id,$(`#case-field-${f.id}`).value])));}
 function caseProgress(){$('#case-progress').textContent=`${solved.size} de 8 casos resueltos`;}
 function showCase(i){
  caseIndex=(i+cases.length)%cases.length;const c=cases[caseIndex];
  $('#case-name').textContent=c.name;$('#case-clue').textContent=c.clue;$('#case-number').textContent=`Caso ${caseIndex+1} / 08`;
  $('#case-image').setAttribute('href',`recursos/tipos.svg#${c.icon}`);
  $$('#case-tabs button').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===caseIndex)));
  caseFields.forEach(f=>{$(`#case-field-${f.id}`).value=drafts.get(c.id)?.[f.id]||'';});clearCase();caseProgress();
  $('#case-next').textContent=caseIndex===cases.length-1?'Volver al primer caso ↻':'Siguiente caso →';
 }
 caseFields.forEach(f=>{
  const row=el('div'),label=el('label',f.label),select=el('select'),result=el('span',null,'field-result');
  label.htmlFor=`case-field-${f.id}`;select.id=label.htmlFor;select.name=f.id;result.id=`case-result-${f.id}`;select.setAttribute('aria-describedby',result.id);
  ['',...f.options].forEach(v=>{const option=el('option',v||'Elige una etiqueta…');option.value=v;select.append(option);});
  select.addEventListener('change',()=>{saveCase();clearCase();});row.append(label,select,result);$('#case-fields').append(row);
 });
 cases.forEach((c,i)=>{const b=el('button',String(i+1).padStart(2,'0'));b.type='button';b.dataset.case=c.id;b.setAttribute('aria-label',`Caso ${i+1}: ${c.name}`);b.addEventListener('click',()=>showCase(i));$('#case-tabs').append(b);});
 $('#case-form').addEventListener('submit',event=>{
  event.preventDefault();clearCase();saveCase();const c=cases[caseIndex],answers=drafts.get(c.id),result=gradeSelections(c.expected,answers);
  if(result.missing.length){$('#case-feedback').textContent='Completa las tres etiquetas antes de comprobar.';$(`#case-field-${result.missing[0]}`).focus();return;}
  caseFields.forEach(f=>{const correct=answers[f.id]===c.expected[f.id];$(`#case-field-${f.id}`).setAttribute('aria-invalid',String(!correct));$(`#case-result-${f.id}`).textContent=correct?'✓ Etiqueta correcta':`Corresponde: ${c.expected[f.id]}.`;});
  if(result.complete){solved.add(c.id);caseProgress();$('#case-feedback').textContent=`✓ Caso resuelto.${solved.size===cases.length?' Completaste los ocho casos; conecta las ideas en el examen.':''}`;$('#case-explanation').textContent=c.explanation;$('#case-explanation').hidden=false;}
  else $('#case-feedback').textContent=`${result.correct} de 3 etiquetas correctas. ${c.explanation} Corrige las etiquetas indicadas y prueba de nuevo.`;
 });
 $('#case-next').addEventListener('click',()=>{showCase(caseIndex+1);$('#case-form select').focus({preventScroll:true});});
 $('#case-reset').addEventListener('click',()=>{drafts.clear();solved.clear();showCase(0);$('#case-feedback').textContent='Casos reiniciados. Puedes comenzar otra vez.';});showCase(0);
 mountQuiz($('#repaso-fungi'),{bank,categories,categoryLabel:'ideas del Reino Fungi',studyLink:'#identidad'});
}
