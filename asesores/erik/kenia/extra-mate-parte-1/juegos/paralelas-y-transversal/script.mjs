import { RELACIONES, relacion, medida, mezcla, geometria, crearProgreso, terminarReto, avanzar, guardarMedida, guardarVariable, confirmarMedida, confirmarVariable, retoNumericoResuelto, reiniciarRespuestas } from './modelo.mjs?v=20260930-paralelas3';

const $ = selector => document.querySelector(selector);
const feedbackBox = $('#game-feedback');
const names = ['', 'Identifica la relación', 'Completa todos los ángulos', 'Encuentra x', 'Reto con x e y'];
const getRelation = id => RELACIONES.find(r=>r.id===id);
const angles = [1,2,3,4,5,6,7,8];
const confirmarAlSalir = event => !event.relatedTarget?.closest('[data-game], #restart-game, #replay-game, #retry-question, a');
class Diagrama {
  constructor(root, choose, write=()=>{}, confirm=()=>{}) {
    this.root = root;
    root.innerHTML = `<svg class="parallel-svg" viewBox="0 0 500 500" role="img"><title>Dos paralelas r y s cortadas por la transversal t</title><rect class="interior-band" x="15" y="158" width="470" height="184" rx="8"/><g class="sectors"></g><line class="parallel-line" x1="15" y1="158" x2="485" y2="158"/><line class="parallel-line" x1="15" y1="342" x2="485" y2="342"/><path class="parallel-symbol" d="M 36 152 l 8 6 l -8 6 M 36 336 l 8 6 l -8 6"/><line class="transversal-line"/><text class="diagram-text" x="18" y="139">r</text><text class="diagram-text" x="18" y="374">s</text><text class="diagram-text" x="271" y="254">t</text></svg>`;
    this.svg = root.querySelector('svg');
    this.sectors = angles.map(n=>{
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.classList.add('region-sector'); this.svg.querySelector('.sectors').append(path); return path;
    });
    this.buttons = angles.map(n=>{
      const button=document.createElement('button'); button.type='button'; button.className='angle-token'; button.dataset.slot=n;
      button.addEventListener('click',()=>choose(n)); root.append(button); return button;
    });
    this.entries = angles.map(n=>{
      const entry=document.createElement('label'); entry.className='angle-entry'; entry.dataset.slot=n; entry.hidden=true;
      entry.innerHTML='<span class="angle-id"></span><span class="angle-expression" hidden></span><span class="angle-input-row"><input class="angle-measure-input" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><span class="angle-unit" aria-hidden="true">°</span></span><span class="entry-status" aria-hidden="true" hidden></span>';
      const input=entry.querySelector('input'); input.id=`${root.id}-measure-${n}`; input.dataset.slot=n; entry.htmlFor=input.id;
      input.addEventListener('focus',()=>{input.questionAtFocus=this.context; choose(n);});
      input.addEventListener('input',()=>write(n,input.value,input.questionAtFocus));
      input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();confirm(n,input.questionAtFocus);}});
      input.addEventListener('blur',event=>{if(confirmarAlSalir(event))confirm(n,input.questionAtFocus);});
      root.append(entry); return entry;
    });
  }
  update(inclination, {values={},selected=[],given=[],correct=[],interactive=true,numeros=angles,campos=false,expressions={},drafts={},errors={},context=null,label='Explora los ocho ángulos'}={}) {
    this.context=context;
    const data=geometria(inclination,campos);
    this.svg.setAttribute('aria-label',label);
    const line=this.svg.querySelector('.transversal-line');
    for (const [key,val] of Object.entries({x1:data.upper.x,y1:data.upper.y,x2:data.lower.x,y2:data.lower.y})) line.setAttribute(key,val);
    const [upper,lower]=data.vertices;
    const band=this.svg.querySelector('.interior-band'); band.setAttribute('y',upper.y);band.setAttribute('height',lower.y-upper.y);
    this.svg.querySelectorAll('.parallel-line').forEach((el,i)=>{el.setAttribute('y1',data.vertices[i].y);el.setAttribute('y2',data.vertices[i].y);});
    this.svg.querySelector('.parallel-symbol').setAttribute('d',`M 36 ${upper.y-6} l 8 6 l -8 6 M 36 ${lower.y-6} l 8 6 l -8 6`);
    const text=this.svg.querySelectorAll('.diagram-text');text[0].setAttribute('y',upper.y-19);text[1].setAttribute('y',lower.y+32);
    data.angles.forEach((shape,i)=>{
      const n=i+1, number=numeros[i], button=this.buttons[i], sector=this.sectors[i], entry=this.entries[i];
      button.dataset.angle=number;
      const selection=selected.indexOf(n);
      sector.setAttribute('d',shape.path);
      for (const el of [button,sector,entry]) {
        el.classList.toggle('is-given',given.includes(n));
        el.classList.toggle('is-a',selection===0); el.classList.toggle('is-b',selection===1);
        el.classList.toggle('is-correct',correct.includes(n)); el.classList.toggle('is-wrong',Boolean(errors[n]));
      }
      for (const el of [button,entry]) {el.style.left=`${shape.label.x/5}%`;el.style.top=`${shape.label.y/5}%`;}
      const editable=campos && !given.includes(n);
      entry.hidden=!editable;button.hidden=editable;
      const value=values[n], valueText=value===undefined ? (selection>=0 ? ['A','B'][selection] : '?') : typeof value==='number' ? `${value}°` : value;
      button.innerHTML=`<span class="angle-id">∠${number}</span><span>${valueText}</span>`;
      button.disabled=!interactive || campos;
      button.setAttribute('aria-label',`Ángulo ${number}${selection>=0 ? `, selección ${['A','B'][selection]}` : ''}${value===undefined ? ', sin medida' : `, ${typeof value==='number' ? `${value} grados` : value}`}${given.includes(n) ? ', dato inicial' : ''}`);
      button.setAttribute('aria-pressed',String(selection>=0));
      entry.querySelector('.angle-id').textContent=`∠${number}`;
      const expression=entry.querySelector('.angle-expression'); expression.hidden=!expressions[n]; expression.textContent=expressions[n] ? `${expressions[n].replace(/\s/g,'')}°` : '';
      entry.classList.toggle('has-expression',Boolean(expressions[n]));
      const input=entry.querySelector('input'), raw=correct.includes(n) ? String(values[n]) : drafts[n]??'';
      if(input.value!==raw)input.value=raw;
      input.readOnly=correct.includes(n) || !interactive;
      input.setAttribute('aria-label',`Medida del ángulo ${number}${expressions[n] ? `, expresión ${expressions[n]}` : ''}, en grados${correct.includes(n) ? ', correcto' : ''}`);
      input.setAttribute('aria-invalid',String(Boolean(errors[n])));
      const status=entry.querySelector('.entry-status'); status.hidden=!correct.includes(n) && !errors[n];status.textContent=errors[n] ? '❌' : '✅';
    });
  }
}

let inclination=60, selected=[1,5];
const explore=new Diagrama($('#explore-diagram'),n=>{
  if (selected.includes(n)) selected=selected.filter(i=>i!==n);
  else selected=selected.length===2 ? [n] : [...selected,n];
  updateExplore();
});
function updateExplore() {
  explore.update(inclination,{values:$('#show-measures').checked ? Object.fromEntries(angles.map(n=>[n,medida(n,inclination)])) : {},selected});
  $('#inclinacion-valor').value=`${inclination}°`;
  const box=$('#pair-readout');
  if (selected.length<2) {
    box.innerHTML=`<span class="pair-tag">${selected.length ? `A · ∠${selected[0]}` : 'Elige A'}</span><h3>${selected.length ? 'Ahora elige otro ángulo' : 'Elige una pareja'}</h3><p>Puedes tocar de nuevo una selección para quitarla.</p>`;
    return;
  }
  const [a,b]=selected, r=relacion(a,b), av=medida(a,inclination), bv=medida(b,inclination);
  const equation=r.regla==='igual' ? `${av}° = ${bv}°` : `${av}° + ${bv}° = 180°`;
  const result=r.regla==='igual' ? 'Son iguales: tienen la misma medida.' : 'Son suplementarios: juntos forman 180°.';
  box.innerHTML=`<span class="pair-tag">A · ∠${a}</span> <span class="pair-tag second">B · ∠${b}</span><h3>${r.nombre}</h3><p>${r.pista}</p><p class="pair-equation">${equation}</p><p>${result}</p>${inclination===90 ? '<p class="small-note">Caso perpendicular: los ocho miden 90°. Son iguales y también suplementarios (90° + 90° = 180°); el nombre de la pareja sigue dependiendo de su posición.</p>' : ''}`;
}
$('#inclinacion').addEventListener('input',event=>{ inclination=Number(event.target.value); updateExplore(); });
$('#show-measures').addEventListener('change',updateExplore);
$('#clear-pair').addEventListener('click',()=>{ selected=[]; updateExplore(); explore.buttons[0].focus(); });
$('#random-pair').addEventListener('click',()=>{ selected=mezcla(angles).slice(0,2); updateExplore(); });
$('#relation-guide').innerHTML=RELACIONES.map(r=>`<div class="guide-item"><strong>${r.nombre}</strong><p>${r.pista}</p><p><strong>${r.regla==='igual' ? 'Iguales' : 'Suman 180°'}</strong> · Ejemplo: ∠${r.pares[0][0]} y ∠${r.pares[0][1]}</p></div>`).join('');
updateExplore();

const states=new Map();
let mode=1, focusedVariable='x';
const state=()=>states.get(mode);
const question=()=>state().serie[state().index];
const numero=n=>question().numeros[n-1];
const game=new Diagrama($('#game-diagram'),n=>{
  if (state().completado) return;
  if (mode===1) {feedback('La pareja de este reto está marcada como A y B. Elige su relación en las opciones.');return;}
  const v=question().variables.find(v=>v.target===n || v.reference===n);
  if(v){focusedVariable=v.variable;updateGameDiagram();}
},(n,raw,origin)=>{
  if(origin!==question())return;
  guardarMedida(state(),n,raw);updateGameDiagram();
},(n,origin)=>{
  if(origin!==question())return;
  const result=confirmarMedida(state(),n);
  if(result.tipo==='correcto')feedback(`✅ ∠${numero(n)} = ${result.valor}°. ¡Bien!`,'correct');
  else if(result.tipo==='incorrecto')feedback(`❌ Revisa la medida de ∠${numero(n)}. Compara con los ángulos conocidos; puedes corregirla.`,'wrong');
  updateGameDiagram();updateFillCount();finishIfReady();
});
function feedback(text,kind='neutral') {
  feedbackBox.textContent=text;feedbackBox.dataset.kind=kind;
  state().retro={pregunta:question(),text,kind};
}
function error(text) {const s=state();s.huboError=true;s.errores++;feedback(text,'wrong');}
function updateMenus() {
  document.querySelectorAll('[data-game]').forEach(button=>{
    const m=Number(button.dataset.game),s=states.get(m);
    button.setAttribute('aria-pressed',String(mode===m));
    button.querySelector('[data-game-progress]').textContent=`${s ? s.index+(s.completado ? 1 : 0) : 0} de 20 retos`;
  });
}
function chooseGame(m,focus=true) {
  mode=m;if(!states.has(m))states.set(m,crearProgreso(m));
  focusedVariable='x';renderGame();
  if(focus)(state().fase==='celebracion' ? $('#celebration-title') : $('#challenge-title')).focus();
}
document.querySelectorAll('[data-game]').forEach(button=>button.addEventListener('click',()=>chooseGame(Number(button.dataset.game))));
function updateGameDiagram() {
  const s=state(),q=question(),values={...q.dados,...s.respuestas};
  let pair=[];
  if(mode===1)pair=q.par;
  else if(q.variables.length && !s.completado){const v=q.variables.find(v=>v.variable===focusedVariable)||q.variables[0];pair=[v.target,v.reference];}
  game.update(q.inclinacion,{values,numeros:q.numeros,selected:pair,given:Object.keys(q.dados).map(Number),correct:Object.keys(s.respuestas).map(Number),
    campos:mode>=2,expressions:Object.fromEntries(q.variables.map(v=>[v.target,v.texto])),drafts:s.borradores,errors:s.erroresAngulos,context:q,interactive:!s.completado,
    label:`${names[mode]}. Ocho ángulos, r paralela a s y t transversal.`});
}
function renderGame() {
  const s=state(),q=question();updateMenus();updateToolbar();
  $('#challenge-panel').hidden=s.fase==='celebracion';$('#round-celebration').hidden=s.fase!=='celebracion';
  if(s.fase==='celebracion'){renderCelebration();return;}
  $('#challenge-label').textContent=`Juego ${mode} · ${['Observa la posición','Completa las medidas','Encuentra el valor de x','Encuentra los valores de x e y'][mode-1]}`;
  $('#challenge-title').textContent=mode===1 ? `¿Qué relación tienen ∠${numero(q.par[0])} y ∠${numero(q.par[1])}?` : mode===2 ? 'Una pista, ocho medidas' : mode===3 ? 'Encuentra el valor de x' : 'Encuentra los valores de x e y';
  $('#challenge-instruction').textContent=mode===1 ? 'Elige la relación de la pareja A y B. El nombre depende de su ubicación.' : mode===2 ? 'Escribe la medida de cada ángulo vacío directamente en el dibujo.' : mode===3 ? 'Puedes usar el dibujo para apuntar medidas. Al comprobar x correctamente, se completan los ángulos pendientes y puedes avanzar.' : 'Resuelve x e y en cualquier orden. Puedes apuntar medidas en el dibujo; cuando ambos valores estén comprobados y correctos, se completan los ángulos pendientes y puedes avanzar.';
  $('#game-caption').textContent=mode===1 ? 'A y B son los ángulos que debes comparar. Los números cambian de posición.' : 'Confirma cada número con Enter o al salir del campo. Verde ✅: correcto. Rojo ❌: revisa y corrige.';
  $('#given-list').innerHTML=[...Object.entries(q.dados).map(([n,v])=>`<span class="given-chip numeric">∠${numero(Number(n))} = ${v}° · dado</span>`),...q.variables.map(v=>`<span class="given-chip">∠${numero(v.target)} = (${v.texto})°</span>`)].join('');
  $('#next-question').disabled=!s.completado;$('#next-question').textContent=s.index%5===4 ? 'Ver mi ronda →' : 'Siguiente reto →';$('#retry-question').hidden=s.completado;
  renderControls();updateGameDiagram();
  const previous=s.retro;
  if(previous?.pregunta===q)feedback(previous.text,previous.kind);
  else feedback(mode===1 ? 'Elige una opción. Si hace falta, puedes corregirla.' : 'Escribe tus respuestas. Los campos vacíos no cuentan como errores.');
}
function updateToolbar() {
  const s=state(),q=question(),end=s.completado && s.index%5===4;
  $('#progress-copy').textContent=`${names[mode]} · Ronda ${q.ronda+1} de 4 · Reto ${s.index%5+1} de 5 · ${s.aciertos} al primer intento`;
  $('#round-progress').innerHTML=Array.from({length:4},(_,i)=>`<span class="${i<q.ronda || (end && i===q.ronda) ? 'done' : i===q.ronda ? 'current' : ''}"></span>`).join('');
}
function renderControls() {
  const s=state(),q=question(),root=$('#question-controls');root.replaceChildren();$('#diagram-tools').replaceChildren();root.after(feedbackBox);
  if(mode===1){
    const options=document.createElement('div');options.className='relation-options';
    q.opciones.forEach(id=>{
      const button=document.createElement('button');button.type='button';button.className='geo-button relation-option';button.dataset.relation=id;button.textContent=getRelation(id).nombre;
      if(s.completado){button.disabled=true;if(id===q.relacion){button.classList.add('is-correct');button.textContent=`✅ ${button.textContent}`;}}
      button.addEventListener('click',()=>{
        if(s.completado)return;
        if(id!==q.relacion){button.classList.add('is-wrong');button.textContent=`❌ ${getRelation(id).nombre}`;error(`❌ Revisa la posición: ${getRelation(q.relacion).pista} Intenta de nuevo.`);return;}
        button.classList.remove('is-wrong');button.classList.add('is-correct');button.textContent=`✅ ${getRelation(id).nombre}`;
        options.querySelectorAll('button').forEach(b=>b.disabled=true);
        const r=getRelation(id);complete(`✅ ${r.nombre}. ${r.pista} ${r.regla==='igual' ? 'Tienen la misma medida.' : 'Son suplementarios: suman 180°.'}`);
      });options.append(button);
    });root.append(options);return;
  }
  q.variables.forEach(v=>root.append(variableCard(v)));
  const count=document.createElement('p');count.className='fill-count';count.id='fill-count';$('#diagram-tools').append(count);updateFillCount();
  if(mode===2)$('#diagram-feedback').append(feedbackBox);
}
function variableCard(v) {
  const s=state(),q=question(),card=document.createElement('div');card.className='variable-card';card.dataset.variable=v.variable;
  const heading=document.createElement('h4');heading.textContent=`Encuentra ${v.variable}`;card.append(heading);
  const expression=document.createElement('p');expression.className='small-note';expression.textContent=`En ∠${numero(v.target)}: (${v.texto})°`;card.append(expression);
  const form=document.createElement('form');form.className='variable-form';form.noValidate=true;
  const label=document.createElement('label');label.htmlFor=`answer-${v.variable}`;label.textContent=`${v.variable} =`;
  const input=document.createElement('input');input.id=label.htmlFor;input.name=v.variable;input.type='text';input.inputMode='decimal';input.autocomplete='off';input.setAttribute('aria-label',`Valor de ${v.variable}`);input.setAttribute('aria-describedby',`result-${v.variable}`);
  const submit=document.createElement('button');submit.type='submit';submit.className='geo-button primary';submit.textContent=`Comprobar ${v.variable}`;
  const result=document.createElement('p');result.id=`result-${v.variable}`;result.className='variable-result';
  const isCurrent=()=>q===question() && s===state();
  input.addEventListener('input',()=>{if(!isCurrent())return;guardarVariable(s,v.variable,input.value);updateVariableCard(v);});
  input.addEventListener('focus',()=>{if(!isCurrent())return;focusedVariable=v.variable;updateGameDiagram();});
  const confirm=()=>{
    if(!isCurrent())return;
    const answer=confirmarVariable(s,v.variable);
    if(answer.tipo==='correcto'){
      const pending=q.variables.filter(item=>!s.resueltas[item.variable]).map(item=>item.variable);
      feedback(`✅ ${v.variable} = ${answer.valor}. ¡Correcto!${pending.length ? ` Comprueba ${pending.join(' e ')} para completar el dibujo.` : ''}`,'correct');
    }
    else if(answer.tipo==='incorrecto')feedback(`❌ Revisa el valor de ${v.variable} en la expresión ${v.texto}. Puedes corregirlo.`,'wrong');
    else if(answer.tipo==='vacio')feedback(`Escribe un valor para ${v.variable}.`);
    updateVariableCard(v);finishIfReady(answer.autocompletadas);
  };
  input.addEventListener('blur',event=>{if(confirmarAlSalir(event))confirm();});
  form.addEventListener('submit',event=>{event.preventDefault();confirm();});
  form.append(label,input,submit);card.append(form,result);rootAppendState(card,v);return card;
}
function rootAppendState(card,v) {
  const s=state(),done=Boolean(s.resueltas[v.variable]),wrong=Boolean(s.erroresVariables[v.variable]);
  card.classList.toggle('is-correct',done);card.classList.toggle('is-wrong',wrong);
  const input=card.querySelector('input'),raw=s.valoresVariables[v.variable]??'';
  if(input.value!==raw)input.value=raw;
  input.readOnly=done;input.setAttribute('aria-invalid',String(wrong));card.querySelector('button').disabled=done;
  card.querySelector('.variable-result').textContent=done ? `✅ ${v.variable} = ${v.solucion}` : wrong ? `❌ Revisa ${v.variable} e inténtalo de nuevo.` : '';
}
function updateVariableCard(v) {const card=document.querySelector(`[data-variable="${v.variable}"]`);if(card)rootAppendState(card,v);}
function updateFillCount() {
  const count=$('#fill-count');if(!count)return;
  count.textContent=`${Object.keys(question().dados).length+Object.keys(state().respuestas).length} de 8 ángulos completos`;
}
function finishIfReady(autocompletadas=0) {
  if(!state().completado && retoNumericoResuelto(state()))complete(autocompletadas ? `✅ ${mode===3 ? 'x es correcto' : 'x e y son correctos'}. Completamos los ángulos pendientes del dibujo. ¡Ya puedes pasar al siguiente reto!` : '✅ ¡Reto completo! Todas las medidas y los valores de las variables son correctos.');
}
function complete(text) {
  const s=state();if(!terminarReto(s))return;
  $('#next-question').disabled=false;$('#retry-question').hidden=true;
  $('#question-controls').querySelectorAll('button').forEach(button=>button.disabled=true);
  feedback(text,'correct');updateMenus();updateToolbar();updateGameDiagram();updateFillCount();
}
function renderCelebration() {
  const s=state(),final=s.index===19,count=s.index+1;
  $('#celebration-label').textContent=final ? `${names[mode]} · Serie completa` : `Ronda ${Math.floor(s.index/5)+1} de 4 completada`;
  $('#celebration-title').textContent=final ? '¡Veinte retos conquistados!' : '¡Cinco conexiones nuevas!';
  $('#celebration-copy').textContent=`Completaste ${count} de 20 retos. ${s.aciertos} al primer intento (${Math.round(s.aciertos/count*100)}%). ${final ? 'Ya puedes intentar otra serie con problemas nuevos.' : 'La próxima ronda trae posiciones y medidas nuevas; las expresiones se vuelven un poco más retadoras.'}`;
  $('#continue-round').hidden=final;$('#next-game').hidden=!final || mode===4;
}
$('#next-question').addEventListener('click',()=>{
  const s=state();if(!s.completado)return;
  if(s.index%5===4){s.fase='celebracion';renderGame();$('#celebration-title').focus();}
  else{avanzar(s);focusedVariable='x';renderGame();$('#challenge-title').focus();}
});
$('#continue-round').addEventListener('click',()=>{if(avanzar(state())){focusedVariable='x';renderGame();$('#challenge-title').focus();}});
$('#retry-question').addEventListener('click',()=>{
  const s=state();if(s.completado)return;
  reiniciarRespuestas(s);delete s.retro;focusedVariable='x';renderGame();
  feedback('Mismo reto, campos vacíos. Puedes practicar sin límite.');$('#challenge-title').focus();
});
function restart(){states.set(mode,crearProgreso(mode));focusedVariable='x';renderGame();$('#challenge-title').focus();}
$('#restart-game').addEventListener('click',restart);$('#replay-game').addEventListener('click',restart);
$('#next-game').addEventListener('click',()=>{if(mode<4)chooseGame(mode+1);});
chooseGame(1,false);
