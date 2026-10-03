import {NIVELES,PREGUNTAS} from './datos.mjs?v=20261003-niveles1';
import {dibujo} from './ilustraciones.mjs?v=20261003-niveles1';
import {crearEscalera,colocar} from './modelo.mjs?v=20261003-niveles1';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../recursos/modelo-repaso.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let current=0,visited=new Set([0]);
$('#level-tabs').innerHTML=NIVELES.map((n,i)=>`<button type="button" class="level-tab" data-level="${i}" aria-pressed="false"><span class="visit-check" aria-hidden="true"></span>${dibujo(n.id,{decorative:true})}<span>${n.name}</span></button>`).join('');
function explore(index,focus=false){
 current=index;visited.add(index);const n=NIVELES[index];
 $$('[data-level]').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===index));button.querySelector('.visit-check').textContent=visited.has(i)?'✓':'';});
 $('#visited').textContent=`${visited.size} de 8 paradas exploradas${visited.size===8?' · ¡Ruta completa!':''}`;
 $('#stage').innerHTML=`<div class="stage-art">${dibujo(n.id,{label:n.id==='sistema'?'Persona con corazón y vasos sanguíneos: sistema circulatorio.':n.tag+'. '+n.examples[0]})}<p class="art-caption">${n.tag}</p></div><div class="stage-copy" style="--level-color:${n.color}"><span class="level-position">Parada ${index+1} de 8</span><h3 id="level-title" tabindex="-1">${n.name}</h3><p class="definition">${n.definition}</p><ul class="example-chips" aria-label="Ejemplos">${n.examples.map(e=>`<li>${e}</li>`).join('')}</ul><div class="connection"><strong>${index===7?'Una idea para recordar':'¿Cómo se conecta con el siguiente?'}</strong><p>${n.connection}</p><p class="detail">${n.detail}</p></div><div class="actions"><button type="button" class="bio-button" data-prev ${index===0?'disabled':''}>← Anterior</button><button type="button" class="bio-button primary" data-forward>${index===7?'Volver al átomo ↺':`Sigue: ${NIVELES[index+1].name} →`}</button></div></div>`;
 $('[data-prev]').onclick=()=>explore(Math.max(0,current-1),true);$('[data-forward]').onclick=()=>explore((current+1)%8,true);
 if(focus)$('#level-title').focus({preventScroll:true});
}
$$('[data-level]').forEach(button=>button.onclick=()=>explore(Number(button.dataset.level)));
function being(id){
 $('#being-drawing').innerHTML=dibujo(id,{label:id==='bacteria'?'Bacteria: organismo de una sola célula.':'Persona: organismo de muchas células.'});
 $('#being-text').textContent=id==='bacteria'?'Una bacteria es unicelular: su única célula realiza las funciones necesarias para vivir. Es célula y organismo a la vez; no tiene tejidos, órganos ni sistemas.':'Una persona es pluricelular: tiene muchas células organizadas en tejidos, órganos y sistemas que trabajan coordinadamente.';
 $$('[data-being]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.being===id)));
}
$$('[data-being]').forEach(b=>b.onclick=()=>being(b.dataset.being));
let ladder=crearEscalera(),errorTimer;
function drawLadder(){
 $('#ladder').innerHTML=NIVELES.map((n,i)=>`<li class="${i<ladder.placed.length?'filled':''}">${i<ladder.placed.length?`${dibujo(n.id,{decorative:true})}<span>${i+1}. ${n.name} ✓</span>`:`<span class="slot-number">${i+1}</span><span>${i===ladder.placed.length?'Tu siguiente pieza':'Por construir'}</span>`}</li>`).join('');
 $('#build-count').textContent=`${ladder.placed.length}/8 niveles · ${ladder.firstTry} al primer intento`;
 $('#build-progress').value=ladder.placed.length;
 $$('[data-piece]').forEach(b=>{b.disabled=ladder.placed.includes(b.dataset.piece);b.classList.remove('wrong');});
}
function resetBuilder(){
 clearTimeout(errorTimer);ladder=crearEscalera();
 $('#build-bank').innerHTML=ladder.order.map(id=>{const n=NIVELES.find(n=>n.id===id);return `<button type="button" class="build-card" data-piece="${id}">${dibujo(id,{decorative:true})}<span>${n.name}</span></button>`;}).join('');
 $$('[data-piece]').forEach(b=>b.onclick=()=>{
  const result=colocar(ladder,b.dataset.piece);if(result===null)return;
  clearTimeout(errorTimer);const feedback=$('#build-feedback');feedback.dataset.kind=result?'correct':'error';drawLadder();
  if(result){feedback.textContent=ladder.placed.length===8?'✓ ¡Construiste el recorrido completo! Del átomo al organismo: cada nivel se relaciona con el siguiente.':`✓ ${NIVELES[ladder.placed.length-1].name} está en su lugar. ${NIVELES[ladder.placed.length-1].memory}`;const next=$$('[data-piece]').find(b=>!b.disabled);(next||$('#reset-build')).focus({preventScroll:true});}
  else{b.classList.add('wrong');feedback.textContent=`Todavía no. ${NIVELES[ladder.placed.length].hint}`;const mark=document.createElement('span');mark.className='error-mark';mark.textContent='×';mark.setAttribute('aria-hidden','true');feedback.prepend(mark);errorTimer=setTimeout(()=>mark.remove(),1100);}
 });
 drawLadder();$('#build-feedback').textContent='Elige la primera pieza.';$('#build-feedback').removeAttribute('data-kind');
}
$('#reset-build').onclick=resetBuilder;
const generator=createRoundGenerator(PREGUNTAS,NIVELES);let quiz,reviewing=false,initial=null;
function fresh(){reviewing=false;initial=null;$('#initial-result').hidden=true;quiz=createQuizState(generator(Number($('#round-size').value)),NIVELES);showQuestion();}
function showQuestion(focus=false){
 const host=$('#quiz-host'),q=quiz.round[quiz.index];
 host.innerHTML=`<div class="quiz-status"><span>${reviewing?'Repaso de errores':'Ronda de aprendizaje'} · Pregunta ${quiz.index+1} de ${quiz.round.length}</span><span>${scoreQuiz(quiz).correct} aciertos</span></div><progress class="quiz-progress" max="${quiz.round.length}" value="${quiz.index}" aria-label="Preguntas respondidas"></progress><div class="question-card"><h3 id="question-title" tabindex="-1">${q.prompt}</h3><div class="question-options" role="group" aria-labelledby="question-title">${q.choices.map((c,i)=>`<button type="button" class="option" data-choice="${c.id}"><span class="letter" aria-hidden="true">${'ABC'[i]}</span><span>${c.text}</span></button>`).join('')}</div><p class="feedback" id="quiz-feedback" role="status" aria-live="polite" aria-atomic="true">Elige la opción que mejor responde a la pregunta.</p><button type="button" class="bio-button primary" data-next disabled>${quiz.index===quiz.round.length-1?'Ver mi resultado →':'Siguiente pregunta →'}</button></div>`;
 $$('[data-choice]').forEach(button=>button.onclick=()=>{
  const response=answerQuestion(quiz,button.dataset.choice);if(!response)return;
  $$('[data-choice]').forEach(b=>{b.disabled=true;if(b.dataset.choice===q.correctId){b.classList.add('correct');b.querySelector('.letter').textContent='✓';}else if(b===button){b.classList.add('wrong');b.querySelector('.letter').textContent='×';}});
  const correct=q.choices.find(c=>c.id===q.correctId).text,feedback=$('#quiz-feedback');feedback.dataset.kind=response.correct?'correct':'error';feedback.textContent=`${response.correct?'✓ ¡Bien conectado!':`La respuesta es: ${correct}.`} ${q.explanation}`;
  $('.quiz-progress').value=quiz.index+1;$('.quiz-status span:last-child').textContent=`${scoreQuiz(quiz).correct} aciertos`;$('[data-next]').disabled=false;$('[data-next]').focus({preventScroll:true});
 });
 $('[data-next]').onclick=()=>{if(!nextQuestion(quiz))return;if(quiz.finished)summary();else showQuestion(true);};
 if(focus)$('#question-title').focus({preventScroll:true});
}
function summary(){
 const score=scoreQuiz(quiz),missed=quiz.answers.filter(a=>!a.correct),host=$('#quiz-host');
 if(!reviewing)initial={correct:score.correct,total:score.total};
 host.innerHTML=`<div class="summary"><div class="score-medal" aria-hidden="true">${score.correct}/${score.total}</div><h3 id="summary-title" tabindex="-1">${reviewing?'Repaso terminado':'¡Ronda completada!'}</h3><p>${score.correct} de ${score.total} respuestas correctas · ${score.percent}%.</p><p>${missed.length?'Ya sabes qué conexiones conviene reforzar. Revisa las explicaciones y vuelve a intentarlo.':'¡Conectaste todas las pistas! Puedes probar otra ronda con preguntas distintas.'}</p>${missed.length?`<details><summary>Entender mis ${missed.length} errores</summary><ol class="mistakes">${missed.map(a=>{const q=quiz.round.find(q=>q.id===a.questionId);return `<li><strong>${q.prompt}</strong><p>Elegiste: ${q.choices.find(c=>c.id===a.choiceId).text}<br>Respuesta: ${q.choices.find(c=>c.id===q.correctId).text}</p><p>${q.explanation}</p></li>`;}).join('')}</ol></details><p>Para repasar: ${score.categories.filter(c=>c.correct<c.total).map(c=>c.name).join(', ')}.</p>`:''}<div class="actions">${missed.length?'<button type="button" class="bio-button primary" data-review>Practicar mis errores</button>':''}<button type="button" class="bio-button" data-again>Otra ronda ↻</button><a class="bio-button" href="#explora">Volver a explorar ↑</a></div></div>`;
 $('[data-again]').onclick=()=>{fresh();$('#question-title').focus();};
 $('[data-review]')?.addEventListener('click',()=>{const round=createErrorRound(quiz);if(!round.length)return;reviewing=true;$('#initial-result').hidden=false;$('#initial-result').textContent=`Resultado de la ronda inicial: ${initial.correct}/${initial.total}. Este repaso tiene su propio resultado.`;quiz=createQuizState(round,NIVELES);showQuestion(true);});
 $('#summary-title').focus({preventScroll:true});
}
$('#round-size').onchange=()=>{fresh();$('#round-size').focus({preventScroll:true});};
explore(0);being('organismo');resetBuilder();fresh();
