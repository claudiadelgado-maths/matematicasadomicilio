import {Bank} from './generador.mjs';
import {parse} from './algebra.mjs';
import {probe} from './ayuda.mjs';
import {math,expression,option,letters,pair,trial,divisionReminder} from './vista.mjs';
const $=s=>document.querySelector(s);
const bank=new Bank();let mode=null,problem=null,count=0,firstCorrect=0,attempted=false,solved=false,helpOpen=false,trials=[];
function start(nextMode){mode=nextMode;count=0;firstCorrect=0;$('#welcome').hidden=true;$('#exam').hidden=false;$('#mode-name').textContent=mode==='normal'?'Modo normal':'Modo con ayuda';next();}
function next(){
  try{problem=bank.next();}catch{ $('#feedback').textContent='No se pudo preparar la pregunta. Pulsa Otra pregunta para intentarlo de nuevo.';$('#feedback').hidden=false;$('#next').hidden=false;return;}
  count++;attempted=false;solved=false;helpOpen=false;trials=[];
  $('#question-count').textContent=`Pregunta ${count}`;$('#first-correct').textContent=`${firstCorrect} ${firstCorrect===1?'acierto':'aciertos'} al primer intento`;
  $('#question-title').textContent=problem.prompt;$('#problem').innerHTML=expression(problem);
  $('#division-reference').hidden=problem.kind!=='division';$('#division-reference').open=false;$('#division-reference-content').innerHTML=divisionReminder();
  $('#domain').hidden=problem.kind==='system';$('#domain').textContent=problem.kind==='system'?'':'Considera los valores para los que los denominadores de la expresión original son distintos de cero.';
  $('#answers').innerHTML=problem.options.map((o,i)=>`<label class="answer"><input type="radio" name="answer" value="${i}"><span class="letter">${letters[i]}</span><span class="answer-math">${option(problem,i)}</span><span class="answer-mark" aria-hidden="true">✓</span></label>`).join('');
  $('#respond').disabled=true;$('#respond').textContent='Responder';$('#feedback').hidden=true;$('#feedback').className='feedback';$('#next').hidden=true;$('#use-help').hidden=false;$('#use-help').textContent='Usar ayuda';$('#help').hidden=true;$('#help-error').textContent='';$('#trial-notice').textContent='';$('#latest-trial').innerHTML='';$('#trial-history').innerHTML='';$('#past-trials').hidden=true;
  $('#question-title').focus({preventScroll:true});$('#exam').scrollIntoView({behavior:'instant',block:'start'});
}
$('#answer-form').addEventListener('change',()=>{if(!solved&&(!attempted||helpOpen))$('#respond').disabled=false;});
$('#answer-form').addEventListener('submit',ev=>{
  ev.preventDefault();if(solved||(attempted&&!helpOpen))return;
  const chosen=$('input[name="answer"]:checked');if(!chosen)return;
  const correct=Number(chosen.value)===problem.correctIndex;
  if(!attempted&&correct)firstCorrect++;
  attempted=true;solved=correct;
  $('#first-correct').textContent=`${firstCorrect} ${firstCorrect===1?'acierto':'aciertos'} al primer intento`;
  $('#feedback').hidden=false;$('#feedback').className=`feedback ${correct?'correct':'incorrect'}`;
  $('#feedback').textContent=correct?(helpOpen?'✓ ¡Correcto! Tus pruebas te ayudaron a comprobarlo.':'✓ ¡Correcto!'):(helpOpen?'Esa no es la respuesta. Prueba otros valores y vuelve a elegir.':'Esa no es la respuesta. Puedes investigar con la ayuda o ir a otra pregunta.');
  $('#respond').disabled=true;$('#next').hidden=false;$('#next').textContent=correct?'Siguiente pregunta':'Otra pregunta';$('#use-help').hidden=false;
  document.querySelectorAll('input[name="answer"]').forEach(input=>input.disabled=correct||!helpOpen);
});
$('#next').addEventListener('click',next);
$('#use-help').addEventListener('click',()=>{
  if(helpOpen){$('#help-title').focus();return;}helpOpen=true;$('#help').hidden=false;$('#use-help').textContent='Ir a la ayuda';$('#respond').textContent=attempted?'Volver a responder':'Responder';
  document.querySelectorAll('input[name="answer"]').forEach(input=>{input.disabled=solved;if(attempted&&!solved)input.checked=false});
  $('#variable-inputs').innerHTML=problem.variables.map((v,i)=>`<label>${v} = <input id="value-${i}" name="value-${i}" inputmode="text" autocomplete="off" maxlength="24" placeholder="Ej. −2 o 1/2" required></label>`).join('');
  $('#option-probes').hidden=problem.kind!=='system';
  $('#option-probes').innerHTML=problem.kind==='system'?`<p>Las opciones ya contienen valores. Puedes probar una pareja o escribir la tuya.</p><div class="probe-buttons">${letters.map((l,i)=>`<button type="button" data-probe="${i}">Probar ${l}</button>`).join('')}</div>`:'';
  $('#help-title').focus();
});
function substitute(values){
  try{
    const result=probe(problem,values);trials.push(result);$('#help-error').textContent='';$('#trial-notice').textContent='';$('#latest-trial').innerHTML=trial(problem,result,trials.length);
    $('#past-trials').hidden=trials.length<2;$('#trial-history').innerHTML=trials.slice(0,-1).map((t,i)=>`<details><summary>Prueba ${i+1} · ${pair(t.values,problem.variables)}</summary>${trial(problem,t,i+1)}</details>`).join('');
    $('#trial-notice').textContent=`Prueba ${trials.length} calculada. Compara el problema y las cuatro opciones.`;
  }catch(e){$('#help-error').textContent=e.message;$('#trial-notice').textContent='No se añadió una prueba. La pregunta y tus intentos no cambiaron.';}
}
$('#substitution-form').addEventListener('submit',ev=>{ev.preventDefault();try{substitute(problem.variables.map((v,i)=>parse($(`#value-${i}`).value)))}catch(e){$('#help-error').textContent=e.message;}});
$('#option-probes').addEventListener('click',ev=>{const button=ev.target.closest('[data-probe]');if(!button)return;const values=problem.options[Number(button.dataset.probe)];values.forEach((v,i)=>{$(`#value-${i}`).value=`${v.n}${v.d===1n?'':`/${v.d}`}`});substitute(values);});
document.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.start)));
$('#change-mode').addEventListener('click',()=>{$('#exam').hidden=true;$('#welcome').hidden=false;$('#welcome-title').focus();});
