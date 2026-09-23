import {topics,tex,evaluar,crearRonda} from '../recursos/practica-modelo.mjs';
const $=id=>document.getElementById(id),api=window.repasoFisica,KEY='repaso-fisica-ronda-v1';
let mode=new URLSearchParams(location.search).get('modo')==='errores'?'review':'new';
let state=api.read(KEY,null),reviewIndex=0,review=[],reviewSolved=false;
if(!state||!Array.isArray(state.items)||state.items.length!==6||!state.items.every(x=>x&&typeof x.prompt==='string')||!Number.isInteger(state.index)||state.index<0||state.index>6)state=null;
for(const [value,name] of topics){const o=document.createElement('option');o.value=value;o.textContent=name;$('topic').append(o);}
function save(){if(!api.write(KEY,state)){ $('save-note').hidden=false;$('save-note').textContent='El navegador no permite guardar; puedes continuar en esta pestaña.';}}
function newRound(){const topic=$('topic').value;state={items:crearRonda(topic),index:0,draft:{},solved:false,topic};save();render();}
function item(){return mode==='review'?review[reviewIndex]:state?.items[state.index];}
function math(...nodes){window.typesetMath?.(...nodes);}
function input(name,title,value=''){const label=document.createElement('label');label.textContent=title;const control=document.createElement('input');control.name=name;control.type='text';control.inputMode=name==='exponent'?'numeric':'decimal';control.autocomplete='off';control.value=value;label.append(control);return label;}
function render(){
 const pending=api.pendientes();$('pending').textContent=`(${pending.length})`;$('mode-review').setAttribute('aria-pressed',String(mode==='review'));$('mode-new').setAttribute('aria-pressed',String(mode==='new'));$('new-settings').hidden=mode==='review';
 if(mode==='new'&&!state){newRound();return;}
 const current=item(),solved=mode==='review'?reviewSolved:state.solved;
 $('exercise').hidden=!current;$('empty').hidden=!!current;$('bar').hidden=!current;
 if(!current){$('empty-title').textContent=mode==='review'?'¡Sin errores pendientes!':'¡Ronda completada!';$('empty-copy').textContent=mode==='review'?'Los errores que cometas en las actividades aparecerán aquí para volver a practicarlos.':'Resolviste los seis casos. Puedes comenzar otra ronda o explorar los circuitos.';$('progress').textContent='';return;}
 const index=mode==='review'?reviewIndex:state.index,total=mode==='review'?review.length:6;
 $('progress').textContent=`${mode==='review'?'Repaso':'Ronda'} · ${index+1} de ${total}`;$('bar').max=total;$('bar').value=index+(solved?1:0);
 $('source').textContent=mode==='review'?'Error por reforzar':topics.find(x=>x[0]===current.topic)?.[1]||'Práctica';$('prompt').textContent=current.prompt;
 const fields=$('fields');window.MathJax?.typesetClear?.([fields]);fields.replaceChildren();
 const draft=mode==='new'?state.draft||{}:api.read('repaso-fisica-borrador-'+current.id,{});
 if(current.type==='choice'){
  const set=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent='Tu respuesta';set.append(legend);
  const options=[...new Set(current.options||[current.correct])];for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
  options.forEach(option=>{const label=document.createElement('label');label.className='choice';const radio=document.createElement('input');radio.type='radio';radio.name='choice';radio.value=option;radio.checked=draft.choice===option;label.append(radio,document.createTextNode(option));set.append(label);});fields.append(set);
 }else{
  fields.append(input('answer',current.type==='scientific'?'Coeficiente':'Resultado',draft.answer));
  if(current.type==='scientific'){const times=document.createElement('span');times.textContent=tex('\\times10');fields.append(times,input('exponent','Exponente',draft.exponent));}
  else{const unit=document.createElement('span');unit.textContent=current.unit?.includes('\\(')?current.unit:tex(current.unit||'');fields.append(unit);}
  if(current.type==='coulomb'){const label=document.createElement('label');label.textContent='Interacción';const select=document.createElement('select');select.name='interaction';for(const [v,t] of [['',''],['atraccion','Atracción'],['repulsion','Repulsión']]){const o=document.createElement('option');o.value=v;o.textContent=t;select.append(o);}select.value=draft.interaction||'';label.append(select);fields.append(label);}
 }
 fields.querySelectorAll('input,select').forEach(c=>c.disabled=solved);
 $('check').hidden=solved;$('next').hidden=!solved;$('feedback').textContent=solved?'Correcto. Puedes continuar.':'';$('feedback').removeAttribute('data-ok');$('solution').hidden=true;$('solution').open=false;
 math($('prompt'),fields);
}
function values(){return Object.fromEntries(new FormData($('answer-form')).entries());}
$('answer-form').addEventListener('input',()=>{if(mode==='new'){state.draft=values();save();}else if(item())api.write('repaso-fisica-borrador-'+item().id,values());});
$('answer-form').addEventListener('submit',e=>{e.preventDefault();const current=item();if(!current||(mode==='new'?state.solved:reviewSolved))return;const result=evaluar(current,values());$('feedback').dataset.ok=String(result.ok);
 if(!result.valid){$('feedback').textContent='Completa tu respuesta antes de comprobar.';return;}
 if(!result.ok){$('feedback').textContent='Todavía no. Revisa el cálculo y vuelve a intentarlo.';api.registrar(current,false);$('pending').textContent=`(${api.pendientes().length})`;
 $('solution').hidden=false;$('solution-text').textContent=current.solution||current.explanation||(current.type==='choice'?current.correct:current.type==='scientific'?tex(`${current.coefficient}\\times10^{${current.exponent}}`):tex(String(current.answer))+(current.type==='coulomb'?'. '+(current.interaction==='atraccion'?'Atracción':'Repulsión'):''));math($('solution-text'));return;}
 if(mode==='review'){reviewSolved=true;api.resolver(current.id);api.write('repaso-fisica-borrador-'+current.id,{});}else{state.draft=values();state.solved=true;save();}render();$('feedback').dataset.ok='true';
});
$('next').addEventListener('click',()=>{if(mode==='review'){if(!reviewSolved)return;reviewIndex++;reviewSolved=false;}else{if(!state.solved)return;state.index++;state.solved=false;state.draft={};save();}render();(item()?$('prompt'):$('empty')).focus();});
$('mode-review').addEventListener('click',()=>{mode='review';review=api.pendientes();reviewIndex=0;reviewSolved=false;render();});
$('mode-new').addEventListener('click',()=>{mode='new';render();});
$('new-round').addEventListener('click',newRound);
review=api.pendientes();if(state?.topic)$('topic').value=state.topic;render();
