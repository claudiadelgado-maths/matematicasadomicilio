import {structures,identificationRound,classification,photosynthesisState,dayNightState} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {mountQuiz} from '../../../biologia-parte-1/recursos/cuestionarios.mjs';
import {shuffle,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs?v=20260929-3';

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const focus=element=>{element.focus({preventScroll:true});element.scrollIntoView({block:'nearest',behavior:'instant'});};

// The short practices share the existing scoring model, with independent states.
function mountPractice(element,questions,{onQuestion=()=>{},onFinish=()=>{}}={}){
 const find=selector=>element.querySelector(selector);
 let state,initialScore=null;
 const fresh=()=>typeof questions==='function'?questions():shuffle(questions).map(q=>({...q,choices:shuffle(q.choices)}));
 function progress(){
  const score=scoreQuiz(state);
  find('[data-mini-count]').textContent=`Reto ${state.index+1} de ${score.total}`;
  find('[data-mini-score]').textContent=`${score.correct} ${score.correct===1?'acierto':'aciertos'}`;
  const meter=find('[data-mini-meter]');meter.max=score.total;meter.value=score.answered;meter.textContent=`${score.answered} de ${score.total}`;
 }
 function show(moveFocus=false){
  const q=state.round[state.index];
  find('[data-mini-playing]').hidden=false;find('[data-mini-result]').hidden=true;
  const context=find('[data-mini-context]');context.hidden=!initialScore;
  context.textContent=initialScore?`Repaso de errores · Resultado inicial: ${initialScore.correct}/${initialScore.total}.`:'';
  find('[data-mini-prompt]').textContent=q.prompt;
  find('[data-mini-feedback]').textContent='';find('[data-mini-feedback]').className='feedback';
  find('[data-mini-next]').disabled=true;
  find('[data-mini-next]').textContent=state.index===state.round.length-1?'Ver resultado →':'Siguiente →';
  find('[data-mini-choices]').replaceChildren(...q.choices.map(choice=>{
   const b=document.createElement('button');b.type='button';b.dataset.answer=choice.id;b.textContent=choice.text;
   b.addEventListener('click',event=>{
    const answer=answerQuestion(state,choice.id);if(!answer)return;
    const correct=q.choices.find(c=>c.id===q.correctId);
    find('[data-mini-choices]').querySelectorAll('button').forEach(option=>{
     option.disabled=true;const right=option.dataset.answer===q.correctId;
     option.classList.toggle('is-correct',right);option.classList.toggle('is-wrong',option===b&&!answer.correct);
     if(right)option.textContent=`✓ ${correct.text}`;else if(option===b)option.textContent=`× ${choice.text}`;
    });
    find('[data-mini-feedback]').textContent=`${answer.correct?'✓ ¡Correcto!':`La respuesta es ${correct.text}.`} ${q.explanation}`;
    find('[data-mini-feedback]').classList.toggle('wrong',!answer.correct);
    find('[data-mini-next]').disabled=false;progress();
    if(event.detail===0)find('[data-mini-next]').focus({preventScroll:true});
    else find('[data-mini-feedback]').scrollIntoView({block:'nearest',behavior:'instant'});
   });return b;
  }));
  onQuestion(q);progress();if(moveFocus)focus(find('[data-mini-prompt]'));
 }
 function start(round=fresh(),reviewing=false,moveFocus=false){
  if(!reviewing)initialScore=null;
  state=createQuizState(round,[]);show(moveFocus);
 }
 function finish(){
  const score=scoreQuiz(state);const errors=createErrorRound(state);
  find('[data-mini-playing]').hidden=true;find('[data-mini-result]').hidden=false;
  find('[data-mini-title]').textContent=`${score.correct} de ${score.total} respuestas correctas`;
  find('[data-mini-result-text]').textContent=`${errors.length?'Revisa las explicaciones y vuelve a practicar lo que faltó.':'¡Todas las conexiones de esta ronda están claras!'}${initialScore?` Resultado inicial: ${initialScore.correct}/${initialScore.total}. Este repaso tiene su propio puntaje.`:''}`;
  const details=find('[data-mini-errors-list]');details.hidden=!errors.length;details.open=false;
  details.querySelector('ul').replaceChildren(...errors.map(q=>{
   const li=document.createElement('li'),title=document.createElement('strong'),copy=document.createElement('p');title.textContent=q.prompt;
   const answer=state.answers.find(a=>a.questionId===q.id);
   copy.textContent=`Elegiste: ${q.choices.find(c=>c.id===answer.choiceId).text}. Correcta: ${q.choices.find(c=>c.id===q.correctId).text}. ${q.explanation}`;
   li.append(title,copy);return li;
  }));
  find('[data-mini-errors]').hidden=!errors.length;find('[data-mini-errors]').textContent=`Practicar mis errores (${errors.length})`;
  onFinish();focus(find('[data-mini-title]'));
 }
 find('[data-mini-next]').addEventListener('click',()=>{if(!nextQuestion(state))return;if(state.finished)finish();else show(true);});
 find('[data-mini-restart]').addEventListener('click',()=>start(fresh(),false,true));
 find('[data-mini-errors]').addEventListener('click',()=>{const round=createErrorRound(state);if(!round.length)return;initialScore ||= scoreQuiz(state);start(round,true,true);});
 return {start:(moveFocus=false)=>start(fresh(),false,moveFocus)};
}

let selected=0;
const visited=new Set();
function pointTo(part){
 $$('.cell-drawing [data-part]').forEach(g=>g.classList.toggle('selected',g.dataset.part===part.id));
 $('.plant-pointer').setAttribute('transform',`translate(${part.x} ${part.y})`);
 $('.plant-pointer').removeAttribute('hidden');
 $('#plant-visual-cue').textContent=`Pista visual: ${part.cue}`;
}
function select(index){
 selected=(index+structures.length)%structures.length;const part=structures[selected];visited.add(part.id);pointTo(part);
 $('#plant-name').textContent=part.name;$('#plant-kind').textContent=`${selected+1} / 11 · ${part.id==='clorofila'?'Pigmento, no organelo':'Estructura celular'}`;
 $('#plant-function').textContent=part.fn;$('#plant-detail').textContent=part.detail;$('#plant-visited').textContent=`${visited.size} de 11 explorados`;
 $$('#plant-parts button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===part.id)));
}
structures.forEach((part,index)=>{
 const button=document.createElement('button');button.type='button';button.dataset.part=part.id;
 const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');button.append(number,document.createTextNode(part.name));
 button.addEventListener('click',()=>select(index));$('#plant-parts').append(button);
});
$('#plant-prev').addEventListener('click',()=>select(selected-1));$('#plant-next').addEventListener('click',()=>select(selected+1));
const anatomy=mountPractice($('#anatomy-practice'),identificationRound,{onQuestion:q=>pointTo(structures.find(p=>p.id===q.structureId)),onFinish:()=>{$('.plant-pointer').setAttribute('hidden','');}});
$$('[data-plant-mode]').forEach(button=>button.addEventListener('click',()=>{
 if(button.getAttribute('aria-pressed')==='true')return;
 const practice=button.dataset.plantMode==='practice';
 $$('[data-plant-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 $('#plant-info').hidden=practice;$('#plant-test').hidden=!practice;$('#plant-selector').hidden=practice;$('#plant-visited').hidden=practice;
 if(practice)anatomy.start(true);else select(selected);
}));
select(0);
const sorting=mountPractice($('#sorting-practice'),classification);sorting.start();

function renderSolar(){
 const state=photosynthesisState({light:$('#input-light').checked,water:$('#input-water').checked,co2:$('#input-co2').checked});
 $('#solar-machine').classList.toggle('is-active',state.active);
 $('#products-state').textContent=state.active?'Producción fotosintética posible':'Sin producción fotosintética nueva en este modelo';
 $('#solar-feedback').textContent=state.active?'✓ Están los tres insumos. El cloroplasto puede usar energía luminosa para formar azúcares y liberar oxígeno.':`Falta: ${state.missing.join(', ')}. No se mantiene la fotosíntesis en estas condiciones. La célula aún puede respirar usando azúcares y oxígeno disponibles.`;
 $('#solar-feedback').classList.toggle('wrong',!state.active);
}
['light','water','co2'].forEach(id=>$(`#input-${id}`).addEventListener('change',renderSolar));
$('#solar-reset').addEventListener('click',()=>{['light','water','co2'].forEach(id=>{$(`#input-${id}`).checked=true;});renderSolar();});
renderSolar();
function renderTime(time){
 const state=dayNightState(time);const day=state.photosynthesis;
 $$('[data-time]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.time===time)));
 $('#time-scene').classList.toggle('is-night',!day);$('#sky-symbol').textContent=day?'☀':'☾';
 $('#photo-state').classList.toggle('is-paused',!day);
 $('#photo-status-text').textContent=day?'Puede producir azúcares y liberar oxígeno con luz e insumos disponibles.':'Sin luz, no se mantiene la producción fotosintética de azúcares.';
 $('#resp-status-text').textContent=day?'Activa: la planta también obtiene ATP durante el día.':'Activa: obtiene ATP de azúcares disponibles o de sus reservas.';
 $('#time-feedback').textContent=day?'☀ Con luz pueden ocurrir ambos procesos. La fotosíntesis no reemplaza la respiración.':'☾ La planta sigue viva y necesita ATP. De noche continúa la respiración celular.';
}
$$('[data-time]').forEach(b=>b.addEventListener('click',()=>renderTime(b.dataset.time)));renderTime('day');
mountQuiz($('#repaso-vegetal'),{bank,categories,categoryLabel:'ideas sobre célula vegetal',studyLink:'#estructuras'});
