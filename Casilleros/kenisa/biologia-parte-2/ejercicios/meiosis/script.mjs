import { phases, separations, trail, questions } from './datos.mjs';
import { createScene, sceneMarkup, crossoverMarkup } from './escena.mjs';
import { sceneMarkup as mitosisScene } from '../mitosis/escena.mjs';
import { createTrail, shuffled } from './modelo.mjs';
import { initQuiz } from '../../recursos/repaso.mjs';

const root = document.querySelector('.meiosis');
if (root) {
  const el = id => document.getElementById(id);
  const text = (id,value) => { el(id).textContent=value; };
  const feedback = (id,value,ok=true) => { text(id,value); el(id).dataset.state=ok?'success':'retry'; };
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  el('reduce-motion').checked=preference.matches;
  const scene=createScene(el('main-scene'));
  let phaseIndex=0, timer=null;
  function pause(message) {
    clearInterval(timer); timer=null;
    text('play-sequence',phaseIndex===8?'↻ Volver a ver':'▶ Ver secuencia');
    el('play-sequence').setAttribute('aria-pressed','false');
    if (message) text('player-status',message);
  }
  function showPhase(index,automatic=false) {
    if (!Number.isInteger(index)||index<0||index>=phases.length) return;
    if (!automatic) pause();
    phaseIndex=index; const phase=phases[index];
    scene.setPhase(index,!el('reduce-motion').checked);
    root.querySelectorAll('[data-phase]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.phase)===index)));
    for(const key of ['group','name','verb','description','note']) text(`phase-${key}`,phase[key]);
    for(const key of ['count','detail','cells']) text(`scene-${key}`,phase[key]);
    text('scene-number',`VISTA ${index+1} / ${phases.length}`);
    el('previous-phase').disabled=index===0; el('next-phase').disabled=index===8;
    if(index===8) pause('Recorrido completo: cuatro células haploides, con dos cromosomas cada una. Puedes repetir o elegir cualquier etapa.');
    else text('player-status',automatic?`${phase.name}. Reproduciendo: seis segundos por etapa.`:`${phase.name}. ${phase.verb}`);
    if(timer===null) text('play-sequence',index===8?'↻ Volver a ver':'▶ Ver secuencia');
  }
  root.querySelectorAll('[data-phase]').forEach(b=>b.addEventListener('click',()=>showPhase(Number(b.dataset.phase))));
  el('previous-phase').addEventListener('click',()=>showPhase(phaseIndex-1));
  el('next-phase').addEventListener('click',()=>showPhase(phaseIndex+1));
  el('play-sequence').addEventListener('click',()=>{
    if(timer!==null) { pause('En pausa. Continúa a tu ritmo o elige una etapa.'); return; }
    if(phaseIndex===8) showPhase(0);
    timer=setInterval(()=>showPhase(phaseIndex+1,true),6000);
    text('play-sequence','Ⅱ Pausar recorrido'); el('play-sequence').setAttribute('aria-pressed','true');
    text('player-status','Reproduciendo: cada etapa permanece seis segundos. Puedes pausar cuando quieras.');
  });
  function reduceMotion() { pause('Recorrido en pausa. Se aplicó el ajuste de movimiento.'); scene.setPhase(phaseIndex,false); }
  el('reduce-motion').addEventListener('change',reduceMotion);
  preference.addEventListener('change',event=>{el('reduce-motion').checked=event.matches;reduceMotion();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden) pause('Recorrido en pausa. Continúa cuando quieras.');});
  window.addEventListener('pagehide',()=>pause());
  root.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>pause()));

  root.querySelectorAll('[data-cross]').forEach(button=>button.addEventListener('click',()=>{
    const exchanged=button.dataset.cross==='after';
    root.querySelectorAll('[data-cross]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    el('cross-scene').innerHTML=crossoverMarkup(exchanged);
    text('cross-caption',exchanged?'Una cromátida de cada homólogo recibió un segmento del otro. Participan dos cromátidas no hermanas; las otras dos no intercambiaron ese fragmento.':'Un homólogo materno y uno paterno. Cada uno tiene dos cromátidas.');
  }));

  let separationRound=shuffled(separations), separationIndex=0, separationSolved=false;
  function showSeparation(focus=false) {
    separationSolved=false;
    const item=separationRound[separationIndex];
    el('separation-scene').innerHTML=item.phase==='mitosis'?mitosisScene(3):sceneMarkup(item.phase);
    text('separation-name',item.name); text('separation-progress',`Imagen ${separationIndex+1} de ${separations.length}`);
    text('separation-prompt',item.prompt); text('separation-feedback','');
    root.querySelectorAll('[data-separation]').forEach(b=>{b.disabled=false;b.classList.remove('correct','retry');});
    el('separation-next').hidden=true; el('separation-reset').hidden=true;
    if(focus) el('separation-prompt').focus({preventScroll:true});
  }
  root.querySelectorAll('[data-separation]').forEach(button=>button.addEventListener('click',()=>{
    if(separationSolved) return;
    const item=separationRound[separationIndex], correct=Number(button.dataset.separation)===item.answer;
    root.querySelectorAll('[data-separation]').forEach(b=>b.classList.remove('retry'));
    if(!correct) { button.classList.add('retry'); feedback('separation-feedback',`Mira otra vez. ${item.explanation} Vuelve a elegir.`,false); return; }
    separationSolved=true; button.classList.add('correct');
    root.querySelectorAll('[data-separation]').forEach(b=>{b.disabled=true;});
    const last=separationIndex===separations.length-1;
    feedback('separation-feedback',`¡Bien observado! ${item.explanation}${last?' Completaste las tres imágenes.':''}`);
    el('separation-next').hidden=last; el('separation-reset').hidden=!last;
    el(last?'separation-reset':'separation-next').focus({preventScroll:true});
  }));
  el('separation-next').addEventListener('click',()=>{if(separationSolved&&separationIndex<separations.length-1){separationIndex++;showSeparation(true);}});
  el('separation-reset').addEventListener('click',()=>{separationRound=shuffled(separations);separationIndex=0;showSeparation(true);});
  showSeparation();

  let path=createTrail(trail);
  function showTrail(focus=false) {
    const item=trail[path.index];
    text('trail-progress',`Parada ${path.index+1} de ${trail.length}`); text('trail-prompt',item.prompt); text('trail-feedback','');
    el('trail-current').innerHTML=sceneMarkup(item.start); el('trail-next').hidden=true;
    el('trail-options').replaceChildren(...shuffled(item.options).map((phase,i)=>{
      const button=document.createElement('button'); button.type='button'; button.className='option picture-option'; button.dataset.choice=String(phase);
      button.innerHTML=sceneMarkup(phase)+`<span>Imagen ${String.fromCharCode(65+i)}</span>`;
      button.addEventListener('click',()=>{
        if(path.solved) return;
        el('trail-options').querySelectorAll('button').forEach(b=>b.classList.remove('retry'));
        if(!path.choose(phase)) { button.classList.add('retry'); feedback('trail-feedback',`Todavía no. ${item.explanation} Busca esa imagen.`,false); return; }
        button.classList.add('correct'); el('trail-options').querySelectorAll('button').forEach(b=>{b.disabled=true;});
        feedback('trail-feedback',`¡Encontraste el reparto! ${item.explanation}${path.complete?' Recorrido completo: copiar una vez, repartir dos.':''}`);
        el('trail-next').hidden=path.complete;
        el(path.complete?'trail-reset':'trail-next').focus({preventScroll:true});
      });
      return button;
    }));
    if(focus) el('trail-prompt').focus({preventScroll:true});
  }
  el('trail-next').addEventListener('click',()=>{if(path.next())showTrail(true);});
  el('trail-reset').addEventListener('click',()=>{path=createTrail(trail);showTrail(true);});
  showTrail();
  initQuiz(questions,item=>{el('quiz-image').hidden=item.phase===undefined;el('quiz-image').innerHTML=item.phase===undefined?'':sceneMarkup(item.phase);});
  el('start-quiz').addEventListener('click',()=>pause());
  root.querySelectorAll('[data-interactive]').forEach(element=>{element.hidden=false;});
}
