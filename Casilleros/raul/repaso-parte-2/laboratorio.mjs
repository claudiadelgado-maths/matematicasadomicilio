import {apply,empty,find,term,availability,generate,checkResult,value,text} from './motor.mjs';
import {esc,signed,formula,expression,procedure} from './vista.mjs';
const $=s=>document.querySelector(s);
let mode='creator',state=empty(),selected=[],multi=false,history=[],powerKeys=null,pending=null,problem=null,seed=0;
const saved={},dialog=$('#new-term'),status=$('#status'),board=$('#board');
const names={add:'Nuevo factor',up:'Traslado al numerador',down:'Traslado al denominador',left:'Reordenar',right:'Reordenar',power:'Crear potencia',absolute:'Crear valor absoluto',evaluate:'Evaluar potencia',evaluateAbs:'Evaluar valor absoluto',normalize:'Normalizar',scientific:'Notación científica',decimal:'Forma decimal',round:'Redondear',combine:'Combinar factores',cancel:'Cancelación exacta',delete:'Eliminar factores',reset:'Reiniciar'};
function announce(message,error=false){status.textContent=message;status.classList.toggle('error',error);status.classList.remove('success');}
function clearPending(){powerKeys=null;pending=null;$('#procedure').hidden=true;}
function atom(t){const key=String(t.id);return `<span class="factor-shell"><button type="button" class="factor" data-key="${key}" aria-pressed="${selected.includes(key)}" title="Seleccionar el factor completo">${formula(t)}</button>${t.kind==='sci'?`<button type="button" class="ten-select" data-key="${key}:ten" aria-pressed="${selected.includes(key+':ten')}" aria-label="Seleccionar solo la potencia de diez, exponente ${t.b}">Solo 10<sup>${signed(t.b)}</sup></button>`:''}</span>`;}
function node(t){
  if(!t.type)return atom(t);
  return `<div class="math-group ${t.type}" data-group="${t.id}"><button type="button" class="group-select" data-key="${t.id}" aria-pressed="${selected.includes(String(t.id))}">Seleccionar ${t.type==='power'?'potencia':'valor absoluto'}</button><div class="group-expression"><span class="group-bracket" aria-hidden="true">${t.type==='power'?'(':'|'}</span><div class="group-children">${row(t.children)}</div><span class="group-bracket" aria-hidden="true">${t.type==='power'?')':'|'}</span>${t.type==='power'?`<sup class="group-exponent" aria-label="elevado a ${t.p}">${signed(t.p)}</sup>`:''}</div></div>`;
}
function row(list){
  let pieces=[];
  for(const t of list){
    if(powerKeys?.includes(String(t.id))){
      if(String(t.id)!==powerKeys[0])continue;
      const children=powerKeys.map(k=>find(state,k).t);
      pieces.push(`<div class="inline-power"><div class="power-draft"><span>(</span><span>${children.map(formula).join(' · ')}</span><span>)</span><input id="power-value" aria-label="Exponente de la nueva potencia" type="text" inputmode="text" value="2" maxlength="3" autocomplete="off"></div><div class="inline-actions"><button type="button" id="apply-power" class="primary">Crear potencia</button><button type="button" id="cancel-power">Cancelar</button></div><small>Se guardará sin evaluar.</small></div>`);
    }else pieces.push(node(t));
  }
  return pieces.join('<span class="multiply" aria-hidden="true">×</span>')||'<span class="identity">1</span>';
}
function render(){
  const focus=document.activeElement?.dataset?.key;
  $('#top').innerHTML=row(state.top);$('#bottom').innerHTML=row(state.bottom);
  $('#bottom-row').hidden=!state.bottom.length;$('#fraction-line').hidden=!state.bottom.length;
  $('#board-help').hidden=!!(state.top.length+state.bottom.length)||mode==='solve';
  $('#selection-label').textContent=selected.length?`${selected.length} ${selected.length===1?(selected[0].endsWith(':ten')?'potencia de diez seleccionada':'elemento seleccionado'):'elementos seleccionados'}`:'Selecciona un factor o un grupo';
  $('#approximation').hidden=!state.approx;
  $('#multiple').setAttribute('aria-pressed',multi);$('#multiple').textContent=multi?'✓ Selección múltiple':'Selección múltiple';
  const allowed=availability(state,selected,mode);
  for(const b of document.querySelectorAll('[data-action]')){const a=b.dataset.action;b.disabled=a==='undo'?!history.length:a==='reset'?false:!allowed[a];if(['power','absolute','delete'].includes(a))b.hidden=mode==='solve';}
  $('#new').hidden=mode==='solve';$('#solve-controls').hidden=mode!=='solve';$('#check').hidden=mode!=='solve';
  $('[data-action="reset"]').textContent=mode==='solve'?'Reiniciar ejercicio':'Reiniciar';
  $('#mode-description').textContent=mode==='creator'?'Construye libremente. Las operaciones conservan el valor; crear, eliminar o elevar cambia la expresión.':'Simplifica con operaciones exactas. No puedes añadir, borrar ni redondear factores.';
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));
  $('#objective').textContent=problem?.label||'Simplifica la expresión';
  $('#original').innerHTML=problem?expression(problem.state):'';
  $('#select-all').disabled=!(state.top.length+state.bottom.length);
  $('#history-empty').hidden=history.length>0;
  $('#history').innerHTML=history.map(h=>`<li><h3>${esc(h.label)}</h3><p>${esc(h.explanation)}</p><div class="history-math"><div class="step-equation">${expression(h.before)} <strong>${h.relation}</strong> ${expression(h.after)}</div>${procedure(h.steps)}</div></li>`).join('');
  if(focus)board.querySelector(`[data-key="${focus}"]`)?.focus({preventScroll:true});
}
function commit(result,action){
  history.push({before:state,selection:[...selected],after:result.state,label:names[action],...result});if(history.length>100)history.shift();
  state=result.state;selected=result.selected;clearPending();render();announce(result.explanation);
}
function operate(action,arg){
  try{
    if(action==='reset'&&mode==='solve'){history=[];state=structuredClone(problem.state);selected=[];clearPending();render();announce('Volviste a la expresión inicial de este ejercicio.');return;}
    const result=apply(state,action,selected,arg,mode);
    if(action==='combine'&&$('#educational').checked){pending={result,action};$('#procedure-content').innerHTML=`<p>${esc(result.explanation)}</p>${procedure(result.steps)}`;$('#procedure').hidden=false;$('#confirm-step').focus();announce('Revisa los coeficientes y exponentes. Aplica el paso cuando estés listo.');return;}
    commit(result,action);
  }catch(e){announce(e.message,true);}
}
function undo(){if(!history.length)return;const h=history.pop();state=h.before;selected=h.selection;clearPending();render();announce(`Deshecho: ${h.label.toLowerCase()}.`);}
function select(key,extend){
  if(extend){
    if(selected.includes(key))selected=selected.filter(k=>k!==key);
    else{const f=find(state,key);selected=selected.filter(k=>{const g=find(state,k);return f.t.id!==g.t.id&&!f.ancestors.includes(g.t.id)&&!g.ancestors.includes(f.t.id)});selected.push(key);}
  }else selected=selected.length===1&&selected[0]===key?[]:[key];
  clearPending();render();
}
board.addEventListener('click',ev=>{
  if(ev.target.closest('#apply-power')){operate('power',$('#power-value').value);return;}
  if(ev.target.closest('#cancel-power')){clearPending();render();return;}
  const b=ev.target.closest('[data-key]');if(b)select(b.dataset.key,multi||ev.ctrlKey||ev.metaKey);
});
board.addEventListener('keydown',ev=>{if(ev.target.id==='power-value'&&ev.key==='Enter'){ev.preventDefault();operate('power',ev.target.value);}else if(ev.key==='Escape'&&powerKeys){clearPending();render();}});
$('#multiple').addEventListener('click',()=>{multi=!multi;if(!multi&&selected.length>1)selected=selected.slice(-1);clearPending();render();});
$('#select-all').addEventListener('click',()=>{multi=true;selected=[...state.top,...state.bottom].map(t=>String(t.id));clearPending();render();});
function showPower(){if(!availability(state,selected,mode).power)return announce('En Creador, selecciona uno o varios factores del mismo grupo o fila.',true);clearPending();powerKeys=selected.slice().sort((a,b)=>find(state,a).index-find(state,b).index);render();$('#power-value').focus();$('#power-value').select();}
function dispatch(a){if(a==='undo')undo();else if(a==='power')showPower();else operate(a);}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>dispatch(b.dataset.action)));
$('#confirm-step').addEventListener('click',()=>{if(pending)commit(pending.result,pending.action)});
$('#cancel-step').addEventListener('click',()=>{clearPending();announce('Paso sin aplicar. La expresión se conserva.');});
function newProblem(){problem=generate($('#level').value,seed++);state=structuredClone(problem.state);selected=[];history=[];clearPending();render();announce('Selecciona los factores que quieras simplificar. Puedes elegir tu propio orden.');}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
  if(mode===b.dataset.mode)return;saved[mode]={state,selected,history,problem};mode=b.dataset.mode;clearPending();
  if(saved[mode])({state,selected,history,problem}=saved[mode]);else if(mode==='solve'){newProblem();return;}
  render();announce(mode==='creator'?'Recuperaste tu construcción libre.':'Recuperaste tu ejercicio y su recorrido.');
}));
$('#new-problem').addEventListener('click',newProblem);$('#level').addEventListener('change',newProblem);
function check(){if(mode!=='solve')return;try{const result=checkResult(state,problem.state,problem.requireScientific);announce(result.message+(result.ok&&problem.unit?` Resultado: ${text(value(state))} ${problem.unit}.`:''),!result.ok);$('#status').classList.toggle('success',result.ok);}catch(e){announce(e.message,true);}}
$('#check').addEventListener('click',check);
function openNew(){if(mode!=='creator'||dialog.open)return;clearPending();render();$('#new-form').reset();$('#new-error').textContent='';updateNew();dialog.showModal();$('#coefficient').focus();}
$('#new').addEventListener('click',openNew);
function newTerm(){const kind=$('#input-kind').value;return {term:term(kind==='sci'?$('#coefficient').value:$('#decimal-value').value,$('#exponent').value,kind),side:$('#new-side').value};}
function updateNew(){const scientific=$('#input-kind').value==='sci';$('#scientific-fields').hidden=!scientific;$('#decimal-fields').hidden=scientific;try{const v=newTerm();$('#term-preview').innerHTML=formula(v.term);$('#preview-side').textContent=v.side==='top'?'Se añadirá al numerador.':'Se añadirá al denominador.';}catch{$('#term-preview').textContent='Completa el término para ver la vista previa.';$('#preview-side').textContent='';}}
$('#new-form').addEventListener('input',()=>{updateNew();$('#new-error').textContent='';});$('#new-form').addEventListener('change',updateNew);
$('#new-form').addEventListener('submit',ev=>{ev.preventDefault();try{commit(apply(state,'add',[],newTerm(),mode),'add');dialog.close();}catch(e){$('#new-error').textContent=e.message;}});
$('#cancel-new').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>$('#new').focus());
const shortcuts={n:'new',p:'power',e:'evaluate',c:'combine',x:'cancel',s:'normalize',d:'decimal',t:'scientific',r:'round',z:'undo',ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Delete:'delete',Backspace:'delete'};
document.addEventListener('keydown',ev=>{
  if(dialog.open||ev.altKey||ev.metaKey||ev.ctrlKey||ev.repeat||ev.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(ev.key==='Escape'){selected=[];clearPending();render();announce('Selección retirada.');return;}
  if(ev.key==='Enter'&&!ev.target.closest('button,a')){ev.preventDefault();check();return;}
  const a=shortcuts[ev.key.length===1?ev.key.toLowerCase():ev.key];if(!a)return;ev.preventDefault();
  if(a==='new')openNew();else if(a==='evaluate'&&availability(state,selected,mode).evaluateAbs)operate('evaluateAbs');else dispatch(a);
});
render();
