import {levels,N} from './generador.mjs';
import {Game} from './partida.mjs';
import {math} from './vista.mjs';
const $=s=>document.querySelector(s),game=new Game();let timer=null,warned=false;
const time=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
function menu(){$('#levels').innerHTML=levels.map(base=>game.configuration(base.id)).map(l=>`<button type="button" data-level="${l.id}" aria-current="${game.level.id===l.id?'step':'false'}"><strong>${game.completed.has(l.id)?'✓ ':''}Nivel ${l.id}</strong><span>${l.title}</span><small>${l.count} problemas · ${time(l.seconds)}${l.steps===2?' · 2 pasos por problema':''}</small></button>`).join('');$('#level-menu summary').textContent=`Cambiar nivel · ${game.level.id} de ${levels.length}`;}
function clock(){$('#timer').textContent=time(game.remaining);$('#timer').classList.toggle('urgent',game.state==='running'&&game.remaining<=10);}
function stop(){clearInterval(timer);timer=null;}
function start(){stop();$('#edit-level').open=false;try{game.start();warned=false;$('#notice').textContent='El tiempo ha comenzado.';render();timer=setInterval(tick,150);}catch(e){$('#notice').textContent=e.message;}}
function tick(){if(game.tick()){stop();render();}else clock();if(game.state==='running'&&game.remaining<=10&&!warned){warned=true;$('#notice').textContent='Quedan 10 segundos o menos.';}}
function render(){
 menu();clock();settingsView();$('#level-title').textContent=`Nivel ${game.level.id} · ${game.level.title}`;
 $('#description').textContent=game.level.description;$('#ready').hidden=game.state!=='ready';$('#question-area').hidden=['ready','complete'].includes(game.state);$('#complete').hidden=game.state!=='complete';$('#failure').hidden=!['failed','timeout'].includes(game.state);
 $('#setup-count').textContent=`${game.level.count} problemas${game.level.steps===2?` · ${game.level.count*2} respuestas en total`:''}`;$('#setup-time').textContent=time(game.level.seconds);
 const total=game.level.count*game.level.steps;$('#progress').max=total;$('#progress').value=game.correct;
 $('#progress-label').textContent=game.state==='ready'?'Listo para empezar':game.state==='complete'?`${game.level.count} de ${game.level.count} problemas completados`:`Problema ${game.index+1} de ${game.level.count}${game.level.steps===2?` · Paso ${game.step+1} de 2`:''} · ${game.correct}/${total} respuestas correctas`;
 if(!['ready','complete'].includes(game.state)){
  const p=game.problem,q=game.question;$('#substitution').hidden=p.substitution===undefined&&!p.condition;if(p.condition)$('#substitution').textContent=p.condition;if(p.substitution!==undefined)$('#substitution').innerHTML=`Si <strong>x = ${math(N(p.substitution))}</strong>, calcula:`;$('#story').hidden=!p.story;$('#story').textContent=p.story||'';$('#expression').hidden=!!p.story;$('#expression').innerHTML=p.story?'':math(p.expression);$('#question-title').textContent=q.prompt;
  $('#previous-step').hidden=game.step!==1;if(game.step===1){$('#previous-step').innerHTML=`<span>Reacomodo correcto:</span> ${math(p.steps[0].options.find(o=>o.correct).expression)}`;}
  $('#answers').classList.toggle('paired-answers',['pair','wordAnswer'].includes(q.options[0]?.expression.op)||game.level.id>=43);$('#answers').innerHTML=q.options.map((o,i)=>`<button type="button" data-answer="${i}" ${game.state!=='running'?'disabled':''} class="${game.state!=='running'&&o.correct?'right':game.selected===i?'wrong':''}"><span class="answer-letter">${'ABCD'[i]}</span>${math(o.expression)}</button>`).join('');
 }
 if(game.state==='failed'||game.state==='timeout'){
  stop();$('#failure-title').textContent=game.state==='failed'?'Respuesta incorrecta':'Se terminó el tiempo';$('#correct-answer').innerHTML=`<span>Respuesta correcta${game.level.steps===2?` del paso ${game.step+1}`:''}:</span> ${math(game.question.options.find(o=>o.correct).expression)}`;$('#explanation').textContent=game.problem.explanation;$('#notice').textContent=game.state==='failed'?'El nivel se detuvo. Revisa la respuesta y reinicia.':'El tiempo se agotó. Reinicia el nivel para intentarlo con problemas nuevos.';
 }
 if(game.state==='complete'){stop();$('#success-text').textContent=`Completaste los ${game.level.count} problemas. Te quedaron ${time(game.remaining)}.`;$('#next-level').hidden=game.level.id===levels.length;$('#notice').textContent='✓ Nivel completado.';}
 $('#question-title').focus({preventScroll:true});
}
$('#levels').addEventListener('click',e=>{const b=e.target.closest('[data-level]');if(!b)return;stop();game.choose(b.dataset.level);warned=false;$('#level-menu').open=false;$('#notice').textContent='Pulsa Comenzar nivel cuando estés listo.';render();$('#start').focus();});
$('#start').onclick=start;$('#restart').onclick=start;$('#repeat').onclick=start;
$('#next-level').onclick=()=>{game.choose(game.level.id+1);render();$('#notice').textContent='Pulsa Comenzar nivel cuando estés listo.';$('#start').focus();};
function answer(i){if(game.state!=='running')return;const ok=game.answer(i);if(ok)$('#notice').textContent=game.step===1?'✓ Ahora elige el resultado simplificado.':'✓ Correcto. Continúa.';render();}
$('#answers').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b)answer(Number(b.dataset.answer));});
document.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||e.target.closest('input,select,textarea,summary')||$('#level-menu').open)return;if(/^[1-4]$/.test(e.key)&&game.state==='running'){e.preventDefault();answer(Number(e.key)-1);}});
document.addEventListener('visibilitychange',tick);window.addEventListener('pageshow',tick);
render();

function settingsView(){
 const c=game.configuration(game.level.id);$('#edit-level').hidden=game.state==='running';
 $('#current-settings').textContent=`Configuración actual: ${c.count} problemas · ${time(c.seconds)}`;
 $('#edit-count').value=c.count;$('#edit-minutes').value=Math.floor(c.seconds/60);$('#edit-seconds').value=c.seconds%60;
}
$('#level-settings').onsubmit=e=>{e.preventDefault();const minutes=Number($('#edit-minutes').value),seconds=Number($('#edit-seconds').value);if(!Number.isInteger(minutes)||minutes<0||minutes>5999||!Number.isInteger(seconds)||seconds<0||seconds>59)return;try{game.configure(Number($('#edit-count').value),minutes*60+seconds);render();$('#settings-message').textContent='Cambios aplicados. El próximo intento usará estos valores.';}catch(error){$('#settings-message').textContent=error.message;}};
$('#reset-settings').onclick=()=>{const original=levels.find(l=>l.id===game.level.id);game.configure(original.count,original.seconds);render();$('#settings-message').textContent='Valores originales restaurados.';};
