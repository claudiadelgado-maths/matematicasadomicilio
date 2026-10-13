import { TIPOS, EJEMPLOS, clasificar, vertices, crearEstado, responder, nuevoReto, elegirNivel, ecuacionTexto } from './modelo.mjs?v=20261002-triangulos3';

const root=document.querySelector('.triangle-site');
if(root) iniciar();
function iniciar(){
  const $=s=>root.querySelector(s), $$=s=>[...root.querySelectorAll(s)];
  const names=['Tipos de triángulos','Ángulos internos','Ángulos exteriores'];
  const hashes=['tipos','internos','exteriores'];
  const states=[1,2,3].map(n=>crearEstado(n));
  let stage=1,errorTimer,animationFrame,sumJoined=false,sumProgress=0;
  let selectedType='equilátero',exampleIndex=0,rotation=0,relation='adyacente';
  const state=()=>states[stage-1],question=()=>state().retos[state().indice];
  const focusTitle=selector=>{const el=$(selector);el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'instant'});};
  const rad=Math.PI/180,xy=(p,r,a)=>({x:p.x+r*Math.cos(a*rad),y:p.y+r*Math.sin(a*rad)});
  function sector(p,r,start,span){const a=xy(p,r,start),b=xy(p,r,start+span);return `M ${p.x} ${p.y} L ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y} Z`;}
  function corner(points,i){
    const p=points[i],a=points[(i+1)%3],b=points[(i+2)%3];
    let start=Math.atan2(a.y-p.y,a.x-p.x)/rad,end=Math.atan2(b.y-p.y,b.x-p.x)/rad;
    let delta=((end-start+540)%360)-180;
    if(delta<0){start=end;delta=-delta;}
    return {start,span:delta};
  }
  function label(points,i,value){
    const p=points[i],center={x:points.reduce((s,v)=>s+v.x,0)/3,y:points.reduce((s,v)=>s+v.y,0)/3};
    let dx=p.x-center.x,dy=p.y-center.y,len=Math.hypot(dx,dy);dx/=len;dy/=len;
    const text=`${'ABC'[i]}${value!==''?` · ${value}°`:''}`;
    const margin=Math.max(53,text.length*7.5+12);
    const outerY=p.y>=Math.max(...points.map(v=>v.y))-1?p.y+37:p.y<=Math.min(...points.map(v=>v.y))+1?p.y-37:p.y+dy*40;
    const x=Math.max(margin,Math.min(520-margin,p.x+dx*40)),y=Math.max(30,Math.min(322,outerY));
    return `<text class="triangle-label" text-anchor="middle" x="${x}" y="${y}" dominant-baseline="middle">${text}</text>`;
  }
  function marks(points,angles){
    const values=[...new Set(angles)].sort((a,b)=>a-b);let svg='';
    // El lado opuesto al ángulo i tiene la misma longitud que otros con el mismo ángulo.
    for(let i=0;i<3;i++){
      const a=points[(i+1)%3],b=points[(i+2)%3],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),n=values.indexOf(angles[i])+1;
      for(let k=0;k<n;k++){const t=(k-(n-1)/2)*7,mx=(a.x+b.x)/2+dx/len*t,my=(a.y+b.y)/2+dy/len*t;svg+=`<path class="side-tick" d="M ${mx-dy/len*6} ${my+dx/len*6} L ${mx+dy/len*6} ${my-dx/len*6}"/>`;}
    }return svg;
  }
  function triangle(angles,{labels=angles.map(String),giro=0,exterior=false,exteriorLabel='',ticks=false,highlight='todos'}={}){
    const points=vertices(angles,giro,exterior),b=points[1];
    let svg=`<svg class="triangle-svg" viewBox="0 0 520 350" role="img" aria-label="Triángulo. ${labels.map((v,i)=>`${'ABC'[i]}${v!==''?`: ${v} grados`:''}`).join('. ')}${exterior?`. Exterior E: ${exteriorLabel} grados`:''}"><path class="triangle-outline" d="M ${points.map(p=>`${p.x} ${p.y}`).join(' L ')} Z"/>`;
    if(exterior)svg+=`<path class="extension-line" d="M ${b.x} ${b.y} H 500"/><path class="corner color-e" d="${sector(b,55,-(180-angles[1]),180-angles[1])}"/>`;
    points.forEach((p,i)=>{const c=corner(points,i);const faded=exterior&&(highlight==='adyacente'?i!==1:highlight==='remotos'&&i===1);svg+=`<path class="corner color-${i} ${faded?'muted-sector':''}" d="${sector(p,38,c.start,c.span)}"/>`;
      if(angles[i]===90){const s=xy(p,15,c.start),end=xy(p,15,c.start+c.span),mid={x:s.x+end.x-p.x,y:s.y+end.y-p.y};svg+=`<path fill="none" stroke="#344658" stroke-width="2" d="M ${s.x} ${s.y} L ${mid.x} ${mid.y} L ${end.x} ${end.y}"/>`;}
    });
    if(ticks)svg+=marks(points,angles);
    points.forEach((p,i)=>svg+=label(points,i,labels[i]));
    if(exterior){const p=xy(b,96,-(180-angles[1])/2),text=`E${exteriorLabel!==''?` · ${exteriorLabel}°`:''}`,margin=Math.max(53,text.length*7.5+12);svg+=`<text class="triangle-label" text-anchor="middle" x="${Math.min(520-margin,Math.max(b.x+35,p.x))}" y="${p.y-3}">${text}</text>`;}
    return svg+'</svg>';
  }
  const descriptions={
    equilátero:'Sus tres lados son iguales. También tiene tres ángulos iguales: 60°, 60° y 60°.',
    isósceles:'Tiene exactamente dos lados iguales. Los ángulos opuestos a esos lados también son iguales.',
    escaleno:'Sus tres lados tienen longitudes diferentes. Sus tres ángulos también son distintos.',
    acutángulo:'Sus tres ángulos son agudos: cada uno mide menos de 90°.',
    rectángulo:'Tiene un ángulo recto de 90°. El pequeño cuadrado te ayuda a reconocerlo.',
    obtusángulo:'Tiene un ángulo mayor de 90°. Los otros dos son agudos.'
  };
  function renderType(){
    const angles=EJEMPLOS[selectedType][exampleIndex%EJEMPLOS[selectedType].length],c=clasificar(angles);
    $('#type-diagram').innerHTML=triangle(angles,{ticks:true,giro:rotation});
    $('#type-result').innerHTML=`<h3>${selectedType}</h3><p>${descriptions[selectedType]}</p><div class="classification-tags"><span>Por lados: ${c.lados}</span><span>Por ángulos: ${c.angulos}</span></div>`;
    $$('[data-type]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.type===selectedType)));
  }
  $$('[data-type]').forEach(b=>b.addEventListener('click',()=>{selectedType=b.dataset.type;exampleIndex=0;renderType();}));
  $('#type-example').addEventListener('click',()=>{exampleIndex++;rotation=(rotation+45)%360;renderType();});
  $('#type-rotate').addEventListener('click',()=>{rotation=(rotation+45)%360;renderType();});
  function sumAngles(){const a=Number($('#sum-shape').value);return [a,60,120-a];}
  function renderSum(){
    const angles=sumAngles(),points=vertices(angles),t=sumProgress;
    let svg=`<svg class="triangle-svg" viewBox="0 0 520 425" role="img" aria-label="${angles.join(' más ')} grados suman 180 grados. ${t===1?'Los tres ángulos forman un ángulo llano.':'Los ángulos se separan del triángulo.'}"><path class="triangle-outline" opacity="${1-t*.8}" d="M ${points.map(p=>`${p.x} ${p.y}`).join(' L ')} Z"/><path class="straight-line" opacity="${t}" d="M 140 350 H 380"/>`;
    let targetAngle=-180;
    angles.forEach((a,i)=>{
      const p=points[i],c=corner(points,i),spread=Math.sin(Math.PI*t)*35;
      const x=p.x+(260-p.x)*t+(i-1)*spread,y=p.y+(350-p.y)*t-spread;
      let start=c.start;while(start-targetAngle>180)start-=360;while(start-targetAngle< -180)start+=360;
      const angle=start+(targetAngle-start)*t,scale=1+t*.8;
      svg+=`<g class="moving-corner" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path class="corner color-${i}" d="${sector({x:0,y:0},44,0,a)}"/></g>`;
      svg+=`<g opacity="${1-t}">${label(points,i,String(a))}</g>`;targetAngle+=a;
    });
    svg+=`<text class="triangle-label" text-anchor="middle" x="260" y="395" opacity="${t}">Un ángulo llano · 180°</text></svg>`;
    $('#sum-diagram').innerHTML=svg;$('#sum-values').textContent=`${angles.join('° + ')}° = 180°`;
    $('#sum-shape-value').textContent=`A = ${angles[0]}°`;
  }
  function stopAnimation(){cancelAnimationFrame(animationFrame);}
  function updateSumButton(){
    $('#sum-animate').textContent=sumJoined?'Volver a armar el triángulo ↶':'Separar y unir las puntas →';
    $('#sum-animate').setAttribute('aria-pressed',String(sumJoined));
    $('#sum-caption').textContent=sumJoined?'Las tres aberturas juntas forman exactamente 180°.':'Las tres puntas aún están en su triángulo.';
  }
  $('#sum-animate').addEventListener('click',()=>{
    stopAnimation();sumJoined=!sumJoined;updateSumButton();
    const from=sumProgress,to=sumJoined?1:0,start=performance.now();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){sumProgress=to;renderSum();return;}
    function frame(now){const t=Math.min(1,(now-start)/1600),ease=t*t*(3-2*t);sumProgress=from+(to-from)*ease;renderSum();if(t<1)animationFrame=requestAnimationFrame(frame);}
    animationFrame=requestAnimationFrame(frame);
  });
  $('#sum-shape').addEventListener('input',()=>{stopAnimation();sumJoined=false;sumProgress=0;updateSumButton();renderSum();});
  function renderExterior(){
    const b=Number($('#exterior-shape').value),a=40,c=140-b,e=180-b;
    $('#exterior-diagram').innerHTML=triangle([a,b,c],{exterior:true,exteriorLabel:String(e),highlight:relation});
    $('#exterior-shape-value').textContent=`B = ${b}°`;
    $('#exterior-result').innerHTML=relation==='adyacente'?`<h3>Completan una recta</h3><p>B y E son suplementarios: juntos suman 180°.</p><p class="equation">${b}° + ${e}° = 180°</p>`:`<h3>El exterior reúne los otros dos</h3><p>A y C no son adyacentes a E. Su suma es exactamente E.</p><p class="equation">${e}° = ${a}° + ${c}°</p>`;
    $$('[data-relation]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.relation===relation)));
  }
  $('#exterior-shape').addEventListener('input',renderExterior);
  $$('[data-relation]').forEach(el=>el.addEventListener('click',()=>{relation=el.dataset.relation;renderExterior();}));
  function updateProgress(){
    states.forEach((s,i)=>$(`[data-progress="${i+1}"]`).textContent=`${s.resueltos} resueltos`);
    $('#total-progress').textContent=`${states.reduce((n,s)=>n+s.resueltos,0)} retos resueltos`;
    $('#game-progress').max=4;$('#game-progress').value=((state().completo&&state().resueltos%4===0)?4:state().resueltos%4);
    $('#round-label').textContent=`Ronda ${Math.floor(state().indice/4)+1} de 3 · Reto ${state().indice%4+1} de 4`;
    $('#round-label').textContent=`Ronda ${Math.floor(Math.max(0,state().resueltos-(state().completo?1:0))/4)+1} · ${$('#game-progress').value} de 4 aciertos${state().completo&&state().resueltos%4===0?' · ¡Ronda superada!':''}`;
    $('#score-label').textContent=`${state().resueltos} resueltos · ${state().primerIntento} al primer intento`;
  }
  function renderStage(moveFocus=false){
    clearTimeout(errorTimer);stopAnimation();sumProgress=sumJoined?1:0;renderSum();
    hashes.forEach((id,i)=>$('#'+id).hidden=stage!==i+1);
    $$('[data-stage]').forEach(el=>{if(Number(el.dataset.stage)===stage)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    $('#practice-title').textContent=['Detective de triángulos','La misión de los 180°','Conecta interior y exterior'][stage-1];
    $('#practice-description').textContent=stage===1?'Figuras variadas. Decide sí o no y descubre por qué.':'Elige el tipo de ejercicio. Todos están disponibles desde el inicio.';
    renderGame();if(moveFocus)focusTitle('#'+hashes[stage-1]+'-title');
  }
  function route(moveFocus=true){const i=hashes.indexOf(location.hash.slice(1));if(i>=0){stage=i+1;renderStage(moveFocus);}}
  window.addEventListener('hashchange',()=>route());
  $$('[data-stage]').forEach(el=>el.addEventListener('click',()=>{if(location.hash===el.hash)focusTitle(el.hash+'-title');}));
  function renderGame(){
    const s=state();updateProgress();$('#level-picker').hidden=stage===1;$('#level-select').value=s.nivelElegido===null?'mixto':String(s.nivelElegido);
    const q=question();$('#question-title').textContent=q.pregunta;
    $('#difficulty-label').textContent=stage===1?`Reto ${s.indice+1} · Observa antes de responder`:`Nivel ${q.nivel+1} · ${['Medidas conocidas','Primeras ecuaciones','Expresiones y conexiones'][q.nivel]}`;
    const labels=stage===1?q.angulos.map(String):q.etiquetas;
    $('#game-diagram').innerHTML=triangle(q.angulos,{labels,giro:q.giro||0,ticks:stage===1,exterior:stage===3,exteriorLabel:q.etiquetaExterior,highlight:q.regla==='remotos'?'remotos':stage===3?'adyacente':'todos'});
    $('#game-caption').textContent=stage===1?'Las marcas comparan lados; las medidas comparan ángulos.':stage===3?'La línea punteada prolonga AB. E está fuera, junto a B.':'Cada expresión representa la medida del ángulo señalado.';
    const chipValues=labels.map((v,i)=>({letter:'ABC'[i],v}));if(stage===3)chipValues.push({letter:'E',v:q.etiquetaExterior});
    $('#given-chips').innerHTML=chipValues.filter(c=>c.v!=='').map(c=>`<span class="given-chip" data-letter="${c.letter}">${c.letter} = ${c.v}°</span>`).join('');
    $('#answer-controls').replaceChildren();
    if(stage===1){
      const box=document.createElement('div');box.className='yes-no';
      [true,false].forEach(value=>{const button=document.createElement('button');button.type='button';button.className='geo-button';button.textContent=value?'Sí':'No';button.dataset.answer=String(value);button.disabled=s.completo;button.addEventListener('click',()=>check(value));box.append(button);});$('#answer-controls').append(box);
    }else{
      const form=document.createElement('form');form.className='answer-form';form.noValidate=true;
      const label=document.createElement('label');label.htmlFor='numeric-answer';label.textContent=q.objetivo==='x'?'Valor de x':'Medida en grados';
      const wrap=document.createElement('div');wrap.className='input-wrap';
      const input=document.createElement('input');input.className='answer-input';input.id='numeric-answer';input.type='text';input.inputMode='decimal';input.autocomplete='off';input.value=s.borrador;input.readOnly=s.completo;input.setAttribute('aria-describedby','answer-feedback');input.addEventListener('input',()=>s.borrador=input.value);
      const unit=document.createElement('span');unit.textContent=q.objetivo==='x'?'':'°';wrap.append(input,unit);
      const submit=document.createElement('button');submit.className='geo-button primary';submit.type='submit';submit.textContent='Comprobar';submit.disabled=s.completo;
      form.append(label,wrap,submit);form.addEventListener('submit',ev=>{ev.preventDefault();check(input.value);});$('#answer-controls').append(form);
    }
    $('#question-hint').open=false;$('#hint-copy').textContent=q.pista;$('#hint-equation').hidden=stage===1;$('#hint-equation').textContent=stage===1?'':ecuacionTexto(q);
    $('#next-question').disabled=!s.completo;$('#next-question').textContent='Siguiente reto →';
    paintFeedback();
  }
  function paintFeedback(flash=false){
    const s=state(),feedback=s.feedback,el=$('#answer-feedback');el.replaceChildren();el.removeAttribute('data-kind');
    if(!feedback){el.textContent='Observa la figura. Puedes usar la pista y volver a intentarlo.';return;}
    el.dataset.kind=feedback.tipo;
    if(flash&&feedback.tipo==='incorrecto'){const mark=document.createElement('span');mark.className='error-flash';mark.textContent='×';mark.setAttribute('aria-hidden','true');el.append(mark);clearTimeout(errorTimer);errorTimer=setTimeout(()=>mark.remove(),1100);}
    el.append(document.createTextNode(feedback.text));
    const input=$('#numeric-answer');
    if(input){input.classList.toggle('is-correct',feedback.tipo==='correcto');input.classList.toggle('is-wrong',feedback.tipo==='incorrecto');input.setAttribute('aria-invalid',String(feedback.tipo==='incorrecto'));}
    $$('[data-answer]').forEach(button=>{button.classList.remove('is-wrong','is-correct');if(button.dataset.answer===String(feedback.value))button.classList.add(feedback.tipo==='correcto'?'is-correct':'is-wrong');});
  }
  function check(raw){
    const s=state(),q=question(),result=responder(s,raw);if(result.tipo==='bloqueado')return;
    const numericNote=stage!==1&&q.objetivo==='x'?' Recuerda: se pide x, no la medida de uno de sus múltiplos.':'';
    s.feedback={tipo:result.tipo,value:raw,text:result.tipo==='correcto'?`✓ ¡Correcto! ${stage===1?'':ecuacionTexto(q)+'. '}${q.explicacion}`:result.tipo==='incorrecto'?`Todavía no. ${q.pista}${numericNote} Puedes corregirlo.`:'Escribe un número para comprobar tu respuesta.'};
    paintFeedback(true);updateProgress();
    if(s.completo){$$('#answer-controls button').forEach(b=>b.disabled=true);if($('#numeric-answer'))$('#numeric-answer').readOnly=true;$('#next-question').disabled=false;$('#next-question').focus({preventScroll:true});}
  }
  function next(){clearTimeout(errorTimer);nuevoReto(state());renderGame();focusTitle('#question-title');}
  $('#next-question').addEventListener('click',()=>{if(state().completo)next();});
  $('#new-exercise').addEventListener('click',next);
  $('#level-select').addEventListener('change',e=>{clearTimeout(errorTimer);elegirNivel(state(),e.target.value==='mixto'?null:Number(e.target.value));renderGame();});
  renderType();renderSum();renderExterior();
  const initial=hashes.indexOf(location.hash.slice(1));if(initial>=0)stage=initial+1;renderStage();
}
