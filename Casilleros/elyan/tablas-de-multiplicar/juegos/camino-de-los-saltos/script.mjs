import {createPath,optionsFor,loadProgress,saveProgress} from '../../recursos/modelo.mjs';
const root=document.querySelector('[data-game="path"]');
if(root){
  const el=id=>document.getElementById(id),text=(id,value)=>{el(id).textContent=value;};
  let storage;try{storage=window.localStorage;}catch{}
  const path=createPath(loadProgress(storage));path.select(path.unlocked);
  let busy=false,animation=null,version=0;
  const buttons=[...root.querySelectorAll('[data-direction]')];
  const levels=el('level-grid');
  for(let i=1;i<=10;i++){
    const button=document.createElement('button');button.type='button';button.dataset.level=String(i);button.innerHTML=`<span>${i}</span><small></small>`;
    button.addEventListener('click',()=>{cancel();if(path.select(i)){render();setFeedback(`Tabla del ${i}: salta de ${i} en ${i}.`);el('jump-prompt').focus({preventScroll:true});}});levels.append(button);
  }
  function setFeedback(value,state=''){text('jump-feedback',value);el('jump-feedback').dataset.state=state;}
  function cancel(){version++;animation?.cancel();animation=null;busy=false;el('frog').classList.remove('celebrate');}
  function render(){
    text('level-name',`Tabla del ${path.level}`);text('jump-prompt',`${path.position} + ${path.level} = ?`);text('jump-count',`${path.jumps} de 10 saltos`);text('current-number',String(path.position));
    text('completed-count',`${path.completed.length} de 10 completados`);
    levels.querySelectorAll('button').forEach(button=>{const level=Number(button.dataset.level),done=path.completed.includes(level);button.disabled=level>path.unlocked||busy;button.setAttribute('aria-pressed',String(level===path.level));button.querySelector('small').textContent=done?'✓ Listo':level>path.unlocked?'Bloqueado':'Jugar';button.setAttribute('aria-label',`Tabla del ${level}${done?', completada':level>path.unlocked?', bloqueada':''}`);});
    el('jump-track').replaceChildren(...Array.from({length:10},(_,i)=>{const li=document.createElement('li');li.className=i<path.jumps?'passed':'';li.setAttribute('aria-label',`Salto ${i+1}${i<path.jumps?' completado': ' pendiente'}`);return li;}));
    const options=optionsFor(path.position+path.level,path.level);
    buttons.forEach((button,i)=>{button.textContent=String(options[i]);button.dataset.value=String(options[i]);button.setAttribute('aria-label',`Saltar al ${options[i]}`);button.disabled=busy||path.phase!=='ready';button.classList.remove('pit','target');});
    const done=path.phase==='complete';el('level-finish').hidden=!done;el('try-again').hidden=path.phase!=='fallen';
    if(done){
      text('finish-title',path.completed.length===10?'¡Los diez caminos son tuyos!':`¡Tabla del ${path.level} completada!`);
      text('finish-message',`Llegaste a ${path.position} con 10 saltos de ${path.level}.${path.level<10?` El camino del ${path.level+1} está disponible.`:' ¡Puedes repetir tus favoritos o jugar a la trivia!'}`);
      el('next-level').hidden=path.level===10;text('next-level',`Ir a la tabla del ${Math.min(10,path.level+1)} →`);
      text('jump-prompt',`10 saltos de ${path.level} → ${path.position}`);
    }
  }
  async function jump(button){
    if(busy||path.phase!=='ready')return;
    const old=path.position,value=Number(button.dataset.value),correct=path.choose(value),thisVersion=++version;
    busy=true;buttons.forEach(b=>{b.disabled=true;});levels.querySelectorAll('button').forEach(b=>{b.disabled=true;});
    button.classList.add(correct?'target':'pit');
    const frog=el('frog'),stage=el('island-stage').getBoundingClientRect(),destination=button.getBoundingClientRect();
    const dx=destination.x+destination.width/2-stage.x-stage.width/2,dy=destination.y+destination.height/2-stage.y-stage.height/2;
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&frog.animate){
      const frames=[{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${dx*.5}px,${dy*.5-45}px) rotate(-8deg)`,opacity:1,offset:.45},{transform:`translate(${dx}px,${dy}px) scale(1)`,opacity:1,offset:.75},correct?{transform:`translate(${dx}px,${dy}px) scale(1)`,opacity:1}:{transform:`translate(${dx}px,${dy+28}px) rotate(25deg) scale(.08)`,opacity:0}];
      animation=frog.animate(frames,{duration:correct?650:1000,easing:'ease-in-out',fill:'forwards'});
      try{await animation.finished;}catch{return;}
    }
    if(thisVersion!==version)return;
    animation?.cancel();animation=null;busy=false;path.landed();render();
    if(correct){
      setFeedback(`¡Buen salto! ${old} + ${path.level} = ${path.position}.`,'correct');
      if(path.phase==='complete'){
        const saved=saveProgress(storage,path.completed);text('storage-note',saved?'Tus caminos completados se guardan en este navegador.':'El navegador no permite guardar: tu avance dura esta visita.');
        frog.classList.add('celebrate');el('finish-title').focus({preventScroll:true});el('level-finish').scrollIntoView({block:'nearest',behavior:'auto'});
      }else el('jump-prompt').focus({preventScroll:true});
    }else{setFeedback(`¡Plop! Era ${old} + ${path.level} = ${old+path.level}. Volvemos al 0 para intentarlo otra vez.`,'wrong');el('try-again').focus({preventScroll:true});}
  }
  buttons.forEach(button=>button.addEventListener('click',()=>jump(button)));
  const reset=()=>{cancel();path.restart();render();setFeedback(`Otra salida desde 0. ¡Saltos de ${path.level}!`);el('jump-prompt').focus({preventScroll:true});};
  el('reset-level').addEventListener('click',reset);el('try-again').addEventListener('click',reset);el('repeat-level').addEventListener('click',reset);
  el('next-level').addEventListener('click',()=>{cancel();if(path.select(path.level+1)){render();setFeedback(`Nuevo camino: salta de ${path.level} en ${path.level}.`);el('jump-prompt').focus({preventScroll:true});el('jump-prompt').scrollIntoView({block:'center',behavior:'auto'});}});
  window.addEventListener('pagehide',cancel);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&busy){cancel();path.restart();render();setFeedback('Retomamos el camino desde 0. Tus niveles completados siguen listos.');}});
  render();root.querySelectorAll('[data-interactive]').forEach(node=>{node.hidden=false;});
}
