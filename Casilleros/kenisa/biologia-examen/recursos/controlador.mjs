import {createState,restoreState,remaining,startRound,currentQuestion,submitAnswer,advance,closeRound,newCycle,summarize} from './modelo.mjs';
export function initExam({bank,topics,storageKey:STORAGE_KEY,drawFigure=()=>'',groupLabel='Parte',groupTitle=p=>`Biología parte ${p}`,unit='actividad',guideLabel='Consultar esta idea en la guía ↗',reviewLabel='Volver a la guía ↗'}) {
const root=document.querySelector('[data-exam]');
if(root){
 const $=selector=>root.querySelector(selector);
 const make=(tag,text,attrs={})=>{const node=document.createElement(tag);node.textContent=text;for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);return node;};
 const learningNote=text=>{const note=make('aside','',{class:'learning-note','aria-label':'Para recordarlo'});note.append(make('strong','Para recordarlo'),make('p',text));return note;};
 const answerCopy=make('p','',{id:'feedback-answer',class:'correct-copy'});
 $('#feedback-text').before(answerCopy);
 const takeawaySlot=make('div','',{id:'feedback-takeaway'});takeawaySlot.hidden=true;$('#guide-link').before(takeawaySlot);
 let storageOK=true,state=createState();
 try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)state=restoreState(JSON.parse(raw),bank,topics);}catch{storageOK=false;}
 const store=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{storageOK=false;}$('#storage-note').textContent=storageOK?'El historial y tu ronda se guardan solo en este navegador. Puedes cerrar y continuar aquí; no se envían respuestas.':'Este navegador no permite guardar el avance. El historial dura esta visita: al recargar puede perderse.';};
 const announce=text=>{$('#exam-notice').textContent=text;};
 const mode=()=>root.querySelector('input[name="mode"]:checked').value;
 const currentTopic=()=>$('#topic-select').value;
 for(const part of [...new Set(topics.map(t=>t.part))]){const group=make('optgroup','',{label:groupTitle(part)});for(const t of topics.filter(t=>t.part===part))group.append(make('option',t.title,{value:t.id}));$('#topic-select').append(group);}
 function globalProgress(){
  const left=remaining(bank,state).length;
  $('#cycle-label').textContent=`Vuelta ${state.cycle}`;$('#global-count').textContent=`${bank.length-left} de ${bank.length} contestadas`;
  $('#global-meter').max=bank.length;$('#global-meter').value=bank.length-left;$('#global-left').textContent=`${left} preguntas nuevas por descubrir`;
 }
 function setup(){
  const selectedMode=mode(),left=remaining(bank,state),pool=remaining(bank,state,selectedMode==='tema'?currentTopic():null),activeTopics=topics.filter(t=>left.some(q=>q.topicId===t.id));
  $('#topic-field').hidden=selectedMode!=='tema';$('#length-field').hidden=selectedMode==='cada';
  for(const opt of $('#topic-select').options){const t=topics.find(t=>t.id===opt.value),count=left.filter(q=>q.topicId===t.id).length;opt.textContent=`${t.title} · ${count} nuevas`;}
  const length=selectedMode==='cada'?activeTopics.length:Math.min(pool.length,$('#round-length').value==='todas'?pool.length:Number($('#round-length').value));
  $('#round-preview').textContent=left.length===0?'¡Recorriste todo el banco! Ya puedes comenzar una nueva vuelta.':pool.length===0?'Ya contestaste todas las preguntas de este tema en esta vuelta. Elige otro tema o modo para continuar con las que faltan.':selectedMode==='cada'?`Esta ronda tendrá ${length} preguntas: una por cada ${unit} que aún tiene preguntas nuevas. Los temas agotados descansan hasta la siguiente vuelta.`:`Esta ronda tendrá ${length} preguntas nuevas de ${pool.length} disponibles${selectedMode==='tema'?' en este tema':''}.`;
  $('#start-round').disabled=pool.length===0;$('#start-round').hidden=left.length===0;$('#new-cycle').hidden=left.length!==0;
  const list=$('#topic-inventory');list.replaceChildren();
  for(const t of topics){const count=left.filter(q=>q.topicId===t.id).length,li=make('li','');li.dataset.part=t.part;
   const button=make('button',t.title,{type:'button','data-topic':t.id});button.addEventListener('click',()=>{$('input[name="mode"][value="tema"]').checked=true;$('#topic-select').value=t.id;setup();$('#topic-select').focus();});
   li.append(make('span',`${groupLabel} ${t.part}`,{class:'eyebrow'}),button,make('span',`${t.count-count}/${t.count} contestadas · ${count} nuevas`,{class:'small'}));list.append(li);
  }
 }
 function renderQuestion(focus){
  const a=state.attempt,q=currentQuestion(state,bank),t=topics.find(t=>t.id===q.topicId),record=a.records.find(r=>r.id===q.id);
  $('#round-mode').textContent={aleatorio:'Todo aleatorio',tema:'Por tema',cada:`1 de cada ${unit}`}[a.mode];
  $('#question-count').textContent=`Pregunta ${a.index+1} de ${a.ids.length}`;
  $('#round-meter').max=a.ids.length;$('#round-meter').value=a.records.length;
  $('#question-topic').textContent=`${groupLabel} ${q.part} · ${t.title}`;$('#question-kind').textContent=q.kind;
  $('#question-title').textContent=q.prompt;$('#question-title').dataset.questionId=q.id;
  $('#question-figure').hidden=!q.figure;$('#question-figure').innerHTML=drawFigure(q.figure);
  const field=$('#answer-choices');field.replaceChildren();
  a.orders[q.id].forEach((id,i)=>{const choice=q.choices.find(c=>c.id===id),label=make('label','',{class:'answer-choice'}),input=make('input','',{type:'radio',name:'answer',value:id});input.checked=record?.choiceId===id;input.disabled=Boolean(record);
   label.append(input,make('span',String.fromCharCode(65+i),{class:'choice-letter','aria-hidden':'true'}),make('span',choice.text,{class:'choice-text'}));
   if(record&&id===q.correctId){label.classList.add('correct');label.append(make('span','✓ Correcta',{class:'choice-tag'}));}
   else if(record&&id===record.choiceId){label.classList.add('incorrect');label.append(make('span','Tu respuesta',{class:'choice-tag'}));}
   field.append(label);
  });
  const feedback=$('#answer-feedback');feedback.hidden=!record;
  takeawaySlot.replaceChildren();takeawaySlot.hidden=true;
  if(record){feedback.dataset.correct=String(record.choiceId===q.correctId);$('#feedback-title').textContent=record.choiceId===q.correctId?'✓ Conexión correcta':'Una idea para reforzar';answerCopy.textContent=`Respuesta correcta: ${q.choices.find(c=>c.id===q.correctId).text}`;$('#feedback-text').textContent=q.explanation;$('#guide-link').href=q.guide;$('#guide-link').textContent=guideLabel;
   if(q.takeaway){takeawaySlot.append(learningNote(q.takeaway));takeawaySlot.hidden=false;}
  }
  $('#answer-alert').textContent='';$('#confirm-answer').hidden=Boolean(record);$('#next-question').hidden=!record;$('#close-round').disabled=!record;
  $('#next-question').textContent=a.index===a.ids.length-1?'Ver mi resultado →':'Siguiente pregunta →';
  $('#close-help').textContent=record?'Puedes ver tu resultado ahora; las preguntas todavía no mostradas quedan disponibles.':'Confirma esta respuesta para cerrar la ronda. También puedes salir de la página y retomarla después.';
  if(focus)$('#question-title').focus();
 }
 function renderSummary(focus){
  const result=summarize(state.attempt,bank,topics);$('#score-value').textContent=result.percent;$('#score-fraction').textContent=`${result.correct} de ${result.total} respuestas correctas`;
  $('#result-title').textContent=result.percent===100?'¡Todas las ideas conectadas!':'Ya sabes qué reforzar.';
  $('#result-message').textContent='Esta es la calificación de la ronda que acabas de responder. Las preguntas contestadas quedan fuera de las siguientes rondas, también si cambias de modo.';
  const list=$('#result-topics');list.replaceChildren();for(const t of result.topics){const row=make('li','');row.append(make('span',t.title),make('strong',`${t.correct}/${t.total}`));list.append(row);}
  const review=$('#review-list');review.replaceChildren();$('#review-details').open=false;
  $('#review-details').querySelector('summary').textContent=`Revisar respuestas y explicaciones (${result.total})`;
  for(const [i,r] of result.records.entries()){
   const item=make('details','',{class:'review-item'});item.append(make('summary',`${r.correct?'✓':'↺'} ${i+1}. ${r.question.prompt}`));
   item.append(make('p',`Tu respuesta: ${r.question.choices.find(c=>c.id===r.choiceId).text}`));
   if(!r.correct)item.append(make('p',`Correcta: ${r.question.choices.find(c=>c.id===r.question.correctId).text}`,{class:'correct-copy'}));
   if(r.question.figure){const art=make('div','',{class:'review-figure'});art.innerHTML=drawFigure(r.question.figure);item.append(art);}
   item.append(make('p',r.question.explanation));if(r.question.takeaway)item.append(learningNote(r.question.takeaway));item.append(make('a',reviewLabel,{href:r.question.guide}));review.append(item);
  }
  if(focus)$('#result-title').focus();
 }
 function render(focus=false){
  const active=state.attempt&&!state.attempt.finished,finished=state.attempt?.finished;
  $('#setup-panel').hidden=Boolean(active||finished);$('#round-panel').hidden=!active;$('#result-panel').hidden=!finished;
  globalProgress();if(active)renderQuestion(focus);else if(finished)renderSummary(focus);else{setup();if(focus)$('#setup-title').focus();}
 }
 function commit(next,focus=true){if(!next)return;state=next;store();render(focus);}
 $('#setup-form').addEventListener('submit',event=>{event.preventDefault();announce('');commit(startRound(state,bank,topics,{mode:mode(),topicId:currentTopic(),length:$('#round-length').value==='todas'?'todas':Number($('#round-length').value)}));});
 root.querySelectorAll('input[name="mode"]').forEach(input=>input.addEventListener('change',setup));$('#topic-select').addEventListener('change',setup);$('#round-length').addEventListener('change',setup);
 $('#answer-form').addEventListener('submit',event=>{event.preventDefault();const selected=$('input[name="answer"]:checked');if(!selected){$('#answer-alert').textContent='Elige una opción antes de confirmar.';$('input[name="answer"]').focus();return;}commit(submitAnswer(state,bank,selected.value),false);$('#answer-feedback').focus();});
 $('#next-question').addEventListener('click',()=>commit(advance(state)));
 $('#close-round').addEventListener('click',()=>commit(closeRound(state)));
 $('#choose-round').addEventListener('click',()=>commit({...state,attempt:null}));
 $('#new-cycle').addEventListener('click',()=>{commit(newCycle(state,bank));announce(`Comienza la vuelta ${state.cycle}. Todas las preguntas vuelven a estar disponibles, con un orden nuevo.`);});
 window.addEventListener('storage',event=>{if(event.key!==STORAGE_KEY||!event.newValue)return;try{state=restoreState(JSON.parse(event.newValue),bank,topics);render();announce('El avance se actualizó desde otra pestaña de este navegador.');}catch{/* Ignore incomplete or unrelated storage writes. */}});
 store();render();$('#loading-note').hidden=true;$('#exam-app').hidden=false;
}

}
