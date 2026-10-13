import {mission,titles,displayValue} from '../../recursos/modelo.mjs';
import {newState,restore,current,selected,answer,advance,startReview} from '../../recursos/mision-estado.mjs';
import {escape,formula,renderMath,seed,read,write,focus,storageNote} from '../../recursos/ui.mjs';

const key='alejandrina-geometria-mision-v2';
let state=restore(read(key),seed()),cards=mission(state.seed);
const host=document.querySelector('#mission');
const save=()=>storageNote(write(key,state));
function render(moveFocus=false){
  const review=state.mode==='review',total=review?state.wrong.length:24,index=review?state.reviewIndex:state.index;
  const ended=index===total,card=cards[current(state)],pick=selected(state),correct=card&&card.options[pick]===card.answer;
  host.innerHTML=`<div class="mission-top"><p class="eyebrow">${review?'Ruta de repaso':'Observatorio de patrones'}</p><button id="reset" type="button">Nueva misión</button></div><div class="reset-panel" id="reset-panel" hidden><p>Se reemplazará el avance de esta misión por 24 retos nuevos.</p><div class="actions"><button id="confirm-reset" type="button">Empezar otra misión</button><button id="cancel-reset" type="button">Conservar avance</button></div></div><p data-storage role="status" hidden></p>${!state.started?`<div class="mission-intro"><div class="orbit" aria-hidden="true">✧<span>✦</span>✧</div><h2 id="mission-title" tabindex="-1">Enciende tu constelación</h2><p>24 retos, dos por cada tipo de problema. Resuelve, conecta y descubre el cielo completo.</p><p>Sin cronómetro. Puedes corregir tus respuestas y retomar aquí tu avance.</p><button id="start" type="button" class="primary">Comenzar misión →</button></div>`:`<div class="mission-meter"><span>${index} de ${total} ${review?'repasados':'retos completados'}</span><progress value="${index}" max="${total}" aria-label="Avance de la misión"></progress></div><ol class="constellation" aria-label="Mapa de la misión">${Array.from({length:total},(_,i)=>`<li class="${i<index?'lit':i===index?'active':''}" aria-label="Reto ${i+1}: ${i<index?'completado':i===index?'actual':'pendiente'}">${i<index?'✦':i+1}</li>`).join('')}</ol>${ended?`<div class="mission-finish"><span class="finish-star" aria-hidden="true">✦</span><h2 id="mission-title" tabindex="-1">${review?'Repaso completo':'¡Constelación encendida!'}</h2><p>${review?'Volviste a resolver los retos que necesitaron otra mirada.':'Completaste los 24 retos y conectaste los procedimientos de la sesión.'}</p>${state.wrong.length?`<p>${state.wrong.length} ${state.wrong.length===1?'reto necesitó':'retos necesitaron'} un segundo intento. Puedes repasarlos cuando quieras.</p><button id="review" type="button" class="primary">Repasar esos retos</button>`:'<p>Resolviste todos los retos al primer intento.</p>'}<p><a href="../../index.html">Volver al menú de la sesión →</a></p></div>`:`<div class="mission-card"><p class="eyebrow">${escape(titles[card.family])}</p><h2 id="mission-title" tabindex="-1">${review?'Repaso':'Reto'} ${index+1}</h2><div class="case-stem">${card.prompt}</div><form id="mission-form"><fieldset ${correct?'disabled':''}><legend>Elige tu respuesta</legend><div class="choice-grid">${card.options.map((o,i)=>`<label class="choice-label ${correct&&i===pick?'correct':''}"><input type="radio" name="answer" value="${i}" ${i===pick?'checked':''}><span>${displayValue(o)}</span></label>`).join('')}</div></fieldset><button type="submit" class="primary" ${correct?'hidden':''}>Comprobar respuesta</button></form><p id="mission-feedback" role="status" aria-live="polite">${correct?'¡Estrella encendida! Tu respuesta es correcta.':pick!=null?'Todavía no. Revisa el procedimiento y elige otra respuesta.':''}</p>${correct||pick!=null?`<details class="example"><summary>Ver el procedimiento</summary><ol class="worked">${card.solution.map(eq=>`<li>${formula(eq)}</li>`).join('')}</ol></details>`:''}<button id="next" type="button" class="primary" ${correct?'':'hidden'}>${index+1===total?'Completar recorrido ✦':'Siguiente reto →'}</button></div>`}`}`;
  renderMath(host);save();
  host.querySelector('#reset').addEventListener('click',()=>{host.querySelector('#reset-panel').hidden=false;focus('#confirm-reset');});
  host.querySelector('#cancel-reset').addEventListener('click',()=>{host.querySelector('#reset-panel').hidden=true;focus('#reset');});
  host.querySelector('#confirm-reset').addEventListener('click',()=>{state=newState(seed());cards=mission(state.seed);save();render(true);});
  host.querySelector('#start')?.addEventListener('click',()=>{state.started=true;save();render(true);});
  host.querySelector('#review')?.addEventListener('click',()=>{startReview(state);save();render(true);});
  host.querySelector('#mission-form')?.addEventListener('submit',event=>{
    event.preventDefault();const chosen=host.querySelector('input:checked');
    if(!chosen){host.querySelector('#mission-feedback').textContent='Selecciona una opción antes de comprobar.';return;}
    answer(state,Number(chosen.value),cards);save();render();focus('#mission-feedback');
  });
  host.querySelector('#next')?.addEventListener('click',()=>{if(advance(state,cards)){save();render(true);}});
  host.querySelector('#mission-feedback')?.setAttribute('tabindex','-1');
  if(moveFocus)focus('#mission-title');
}
render();window.addEventListener('load',()=>renderMath());
