import {fields,organisms,gradePassport,statements} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {mountQuiz} from '../../../biologia-parte-1/recursos/cuestionarios.mjs';

const root=document.querySelector('.classification-page');
if(root){
 const $=s=>root.querySelector(s);
 let index=0;
 const drafts=new Map(), achieved=new Set();
 const feedback=$('#passport-feedback');
 const element=(tag,text,className)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;};
 function progress(){$('#passport-progress').textContent=`${achieved.size} de ${organisms.length} pasaportes logrados`;}
 function clearFeedback(){feedback.replaceChildren();$('#passport-extra').hidden=true;fields.forEach(f=>{$(`#result-${f.id}`).textContent='';$(`#field-${f.id}`).removeAttribute('aria-invalid');});}
 function save(){drafts.set(organisms[index].id,Object.fromEntries(fields.map(f=>[f.id,$(`#field-${f.id}`).value])));}
 fields.forEach(f=>{
  const label=element('label',f.label),select=element('select'),status=element('span',null,'field-result');
  label.htmlFor=`field-${f.id}`;select.id=label.htmlFor;select.name=f.id;
  select.setAttribute('aria-describedby',`result-${f.id}`);status.id=`result-${f.id}`;
  [{value:'',text:'Elige una etiqueta…'},...f.options.map(text=>({value:text,text}))].forEach(o=>{const option=element('option',o.text);option.value=o.value;select.append(option);});
  select.addEventListener('change',()=>{save();clearFeedback();});
  const row=element('div');row.append(label,select,status);$('#passport-fields').append(row);
 });
 function show(next){
  index=(next+organisms.length)%organisms.length;const o=organisms[index];
  $('#organism-name').textContent=o.name;$('#organism-number').textContent=`Pasaporte ${index+1} / ${organisms.length}`;
  $('#organism-clue').textContent=o.clue;$('#organism-icon').setAttribute('href',o.icon);
  $('#organism-tabs').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.organism===o.id)));
  fields.forEach(f=>{$(`#field-${f.id}`).value=drafts.get(o.id)?.[f.id]||'';});
  clearFeedback();progress();
  $('#passport-next').textContent=index===organisms.length-1?'Volver al primer organismo ↻':'Siguiente organismo →';
 }
 organisms.forEach((o,i)=>{
  const b=element('button',o.name);b.type='button';b.dataset.organism=o.id;b.addEventListener('click',()=>show(i));$('#organism-tabs').append(b);
  const tr=element('tr'),name=element('th',o.name);name.scope='row';tr.append(name,...fields.map(f=>element('td',o[f.id])));$('#organism-table').append(tr);
 });
 $('#passport-form').addEventListener('submit',event=>{
  event.preventDefault();save();clearFeedback();const o=organisms[index],result=gradePassport(o,drafts.get(o.id));
  if(result.missing.length){feedback.textContent='Completa las tres etiquetas antes de comprobar.';$(`#field-${result.missing[0]}`).focus();return;}
  result.results.forEach(r=>{const select=$(`#field-${r.id}`);select.setAttribute('aria-invalid',String(!r.correct));$(`#result-${r.id}`).textContent=r.correct?'✓ Etiqueta correcta':`Revisa: corresponde ${r.expected.toLowerCase()}.`;});
  if(result.complete){achieved.add(o.id);progress();feedback.textContent=`✓ ¡Pasaporte completo! ${o.name}: ${fields.map(f=>o[f.id].toLowerCase()).join(' · ')}.${achieved.size===organisms.length?' Lograste los siete. Ahora comprueba las ideas y prueba el examen.':''}`;$('#passport-extra').textContent=o.extra;$('#passport-extra').hidden=false;}
  else feedback.textContent=`${result.correct} de 3 etiquetas correctas. Revisa las indicadas: ${result.results.filter(r=>!r.correct).map(r=>`${r.label.toLowerCase()} → ${r.expected.toLowerCase()}`).join('; ')}. Puedes corregirlas y comprobar de nuevo.`;
 });
 $('#passport-next').addEventListener('click',()=>{show(index+1);$('#field-cell').focus({preventScroll:true});});
 $('#passport-reset').addEventListener('click',()=>{drafts.clear();achieved.clear();show(0);feedback.textContent='Pasaportes reiniciados. Puedes comenzar de nuevo.';});
 show(0);

 const clarified=new Set();
 statements.forEach((s,i)=>{
  const card=element('article',null,'truth-card'),number=element('p',`IDEA ${String(i+1).padStart(2,'0')}`,'eyebrow'),title=element('h3',s.text),controls=element('div',null,'mode-controls'),message=element('p',null,'truth-feedback');
  title.id=`truth-${i}`;controls.setAttribute('role','group');controls.setAttribute('aria-labelledby',title.id);message.setAttribute('role','status');message.setAttribute('aria-live','polite');
  [true,false].forEach(value=>{const b=element('button',value?'Verdadero':'Falso');b.type='button';b.dataset.truth=String(value);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{
   const correct=value===s.answer;controls.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));
   message.textContent=`${correct?'✓ ¡Correcto!':`Revisa: la afirmación es ${s.answer?'verdadera':'falsa'}.`} ${s.explanation}`;
   card.classList.toggle('is-solved',correct);
   if(correct){clarified.add(i);controls.querySelectorAll('button').forEach(button=>button.disabled=true);}
   $('#truth-progress').textContent=`${clarified.size} de ${statements.length} ideas aclaradas.${clarified.size===statements.length?' ¡Listas para el examen!':''}`;
  });controls.append(b);});
  card.append(number,title,controls,message);$('#truth-cards').append(card);
 });
 mountQuiz($('#repaso-clasificacion'),{bank,categories,categoryLabel:'criterios de clasificación',studyLink:'#numero'});
}
