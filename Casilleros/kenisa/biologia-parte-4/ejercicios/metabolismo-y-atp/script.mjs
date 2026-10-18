import {bank,categories} from './banco-preguntas.mjs';
import {mountQuiz} from '../../../biologia-parte-1/recursos/cuestionarios.mjs';
import {routeCases,energyCases,energyOptions,enzymes,substrates,products,gradeEnzyme,createATP,actATP,enzymeActivity,experiments} from './modelo.mjs';
const root=document.querySelector('.metabolism-page');
if(root){
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const el=(tag,text,attrs={})=>{const e=document.createElement(tag);if(text!==null)e.textContent=text;Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;};
 const feedback=(id,text,wrong=false)=>{const node=$(id);node.textContent=text;node.classList.toggle('wrong',wrong);};
 const pressed=(selector,match)=>$$(selector).forEach(b=>b.setAttribute('aria-pressed',String(match(b))));
 const totals={rutas:10,atp:1,enzimas:3,condiciones:5,energia:8},counts=Object.fromEntries(Object.keys(totals).map(k=>[k,0]));
 function progress(station,value){
  counts[station]=Math.min(value,totals[station]);const link=$(`[data-station="${station}"]`);
  link.querySelector('span').textContent=`${counts[station]}/${totals[station]}${station==='atp'?' ciclo':''}`;
  link.classList.toggle('done',counts[station]===totals[station]);
  const completed=Object.keys(totals).filter(k=>counts[k]===totals[k]).length;
  $('#station-progress').textContent=`${completed} de 5 estaciones completadas${completed===5?' · ¡Conectaste las ideas!':''}`;
 }

 function mountCards(prefix,items,options,station){
  let index=0;const solved=new Set();
  if(prefix==='energy')options.forEach(option=>{const b=el('button',option.name,{type:'button','data-energy-answer':option.id});$(`#${prefix}-answers`).append(b);});
  function render(){
   const item=items[index];$(`#${prefix}-title`).textContent=item.title;$(`#${prefix}-clue`).textContent=item.clue;$(`#${prefix}-number`).textContent=`${prefix==='route'?'Proceso':'Situación'} ${index+1} / ${items.length}`;
   pressed(`#${prefix}-tabs button`,b=>b.dataset.item===item.id);pressed(`#${prefix}-answers button`,()=>false);
   $$( `#${prefix}-tabs button`).forEach(b=>{b.classList.toggle('is-solved',solved.has(b.dataset.item));});
   feedback(`#${prefix}-feedback`,solved.has(item.id)?'Ya resolviste este caso. Puedes volver a responder para repasarlo.':'');
   $(`#${prefix}-next`).textContent=index===items.length-1?'Volver al primer caso ↻':'Siguiente caso →';
   if(prefix==='route')$('#route-hint-text').hidden=true;
  }
  items.forEach((item,i)=>{const b=el('button',String(i+1).padStart(2,'0'),{type:'button','data-item':item.id,'aria-label':`${prefix==='route'?'Proceso':'Situación'} ${i+1}: ${item.title}`});b.addEventListener('click',()=>{index=i;render();});$(`#${prefix}-tabs`).append(b);});
  $$( `#${prefix}-answers button`).forEach(b=>b.addEventListener('click',()=>{
   const item=items[index],answer=b.getAttribute(`data-${prefix}-answer`),ok=answer===item.answer;pressed(`#${prefix}-answers button`,candidate=>candidate===b);
   if(ok){solved.add(item.id);$(`#${prefix}-progress`).textContent=`${solved.size} de ${items.length} ${prefix==='route'?'procesos':'situaciones'} resuelt${prefix==='route'?'os':'as'}`;progress(station,solved.size);$(`#${prefix}-tabs [data-item="${item.id}"]`).classList.add('is-solved');}
   feedback(`#${prefix}-feedback`,`${ok?'✓ Correcto.':'Revisa la pista.'} ${item.why}${ok?'':' Vuelve a elegir.'}`,!ok);
  }));
  $(`#${prefix}-next`).addEventListener('click',()=>{index=(index+1)%items.length;render();$(`#${prefix}-answers button`).focus({preventScroll:true});});
  $(`#${prefix}-reset`).addEventListener('click',()=>{solved.clear();index=0;progress(station,0);$(`#${prefix}-progress`).textContent=`0 de ${items.length} ${prefix==='route'?'procesos resueltos':'situaciones resueltas'}`;render();feedback(`#${prefix}-feedback`,'Práctica reiniciada.');});
  if(prefix==='route')$('#route-hint').addEventListener('click',()=>{const item=items[index];$('#route-hint-text').textContent=item.answer==='anabolismo'?'Pista: se incorporan unidades para formar moléculas más complejas. ¿Cómo se llama esa construcción?':'Pista: una molécula se descompone en unidades menores. ¿Qué ruta describe la degradación?';$('#route-hint-text').hidden=false;});
  render();
 }
 mountCards('route',routeCases,[{id:'anabolismo'},{id:'catabolismo'}],'rutas');mountCards('energy',energyCases,energyOptions,'energia');

 let atp=createATP(),part='adenina';
 function atpPart(){
  $('#atp-part-detail').textContent=part==='adenina'?'Adenina: una base nitrogenada; permanece en ATP y ADP.':part==='ribosa'?'Ribosa: un azúcar de cinco carbonos. Junto con la adenina forma adenosina.':atp.form==='ATP'?'ATP tiene tres grupos fosfato unidos. Al usarlo en este ciclo se forma ADP y se libera un fosfato.':'ADP conserva dos fosfatos unidos. El tercero está libre y puede reincorporarse al regenerar ATP con energía.';
  pressed('#atp-parts button',b=>b.dataset.atpPart===part);
 }
 function renderATP(){
  const isATP=atp.form==='ATP';$('#atp-form').textContent=atp.form;$('#atp-count').textContent=isATP?'3 fosfatos unidos':'2 unidos + 1 fosfato libre';
  $('#atp-third').setAttribute('transform',isATP?'translate(0 0)':'translate(0 74)');$('#atp-last-bond').toggleAttribute('hidden',!isATP);$('#atp-free-label').toggleAttribute('hidden',isATP);
  $('#atp-machine-title').textContent=isATP?'ATP: adenina, ribosa y tres grupos fosfato unidos.':'ADP: adenina, ribosa y dos fosfatos unidos; hay un fosfato libre.';
  $('#atp-state-title').textContent=isATP?'Listo para impulsar trabajo.':atp.energy?'Hay energía para regenerar ATP.':'Ahora necesitas regenerar ATP.';
  $('#atp-state-description').textContent=isATP?'Usa esta molécula en un ciclo de la bomba. Después observa qué cambió y cómo puede regenerarse.':'El ADP conserva adenina, ribosa y dos fosfatos. Para incorporar de nuevo el fosfato libre se necesita energía.';
  $('#atp-energy-status').textContent=isATP?'ATP disponible para el siguiente ciclo.':atp.energy?'✓ Aporte energético disponible para la síntesis.':'Falta un aporte energético para la síntesis.';
  $('#atp-energy-status').classList.toggle('charged',atp.energy);$('#atp-progress').textContent=`${atp.cycles} ${atp.cycles===1?'ciclo completo':'ciclos completos'} · ${atp.uses} ${atp.uses===1?'uso':'usos'} de ATP`;progress('atp',atp.cycles);atpPart();
 }
 ['use','supply','regenerate'].forEach(action=>$(`#atp-${action}`).addEventListener('click',()=>{const result=actATP(atp,action);atp=result.state;renderATP();feedback('#atp-feedback',result.message,!result.ok);}));
 $$('#atp-parts button').forEach(b=>b.addEventListener('click',()=>{part=b.dataset.atpPart;atpPart();}));
 $('#atp-reset').addEventListener('click',()=>{atp=createATP();part='adenina';renderATP();feedback('#atp-feedback','Ciclo reiniciado. Comienza utilizando ATP.');});renderATP();

 let enzymeIndex=0;const solvedEnzymes=new Set(),enzymeDrafts=new Map();
 substrates.forEach(([id,name])=>$('#enzyme-substrate').append(el('option',name,{value:id})));products.forEach(([id,name])=>$('#enzyme-product').append(el('option',name,{value:id})));
 function clearEnzyme(){
  feedback('#enzyme-feedback','');['substrate','product'].forEach(f=>{$(`#enzyme-${f}`).removeAttribute('aria-invalid');$(`#enzyme-${f}-result`).textContent='';});
  $('#enzyme-input-name').textContent='¿Cuál corresponde?';$('#enzyme-output-name').textContent='¿Qué se obtiene?';$('.enzyme-workbench').classList.remove('reaction-complete');
 }
 function saveEnzyme(){enzymeDrafts.set(enzymes[enzymeIndex].id,{substrate:$('#enzyme-substrate').value,product:$('#enzyme-product').value});}
 function renderEnzyme(){const e=enzymes[enzymeIndex];$('#enzyme-name').textContent=e.name;$('#enzyme-clue').textContent=e.clue;pressed('#enzyme-tabs button',b=>b.dataset.enzyme===e.id);['substrate','product'].forEach(f=>$(`#enzyme-${f}`).value=enzymeDrafts.get(e.id)?.[f]||'');clearEnzyme();$('#enzyme-next').textContent=enzymeIndex===2?'Volver a la primera enzima ↻':'Siguiente enzima →';}
 enzymes.forEach((enzyme,i)=>{const b=el('button',enzyme.name,{type:'button','data-enzyme':enzyme.id});b.addEventListener('click',()=>{enzymeIndex=i;renderEnzyme();});$('#enzyme-tabs').append(b);});
 ['substrate','product'].forEach(f=>$(`#enzyme-${f}`).addEventListener('change',()=>{saveEnzyme();clearEnzyme();}));
 $('#enzyme-form').addEventListener('submit',event=>{
  event.preventDefault();saveEnzyme();clearEnzyme();const enzyme=enzymes[enzymeIndex],answers=enzymeDrafts.get(enzyme.id),result=gradeEnzyme(enzyme,answers);
  if(result.missing.length){feedback('#enzyme-feedback','Elige el sustrato y los productos antes de comprobar.',true);$(`#enzyme-${result.missing[0]}`).focus();return;}
  const name={substrate:substrates.find(([id])=>id===enzyme.substrate)[1],product:products.find(([id])=>id===enzyme.product)[1]};
  ['substrate','product'].forEach(f=>{const ok=answers[f]===enzyme[f];$(`#enzyme-${f}`).setAttribute('aria-invalid',String(!ok));$(`#enzyme-${f}-result`).textContent=ok?'✓ Relación correcta':`Corresponde: ${name[f]}.`;});
  if(result.correct===2){solvedEnzymes.add(enzyme.id);$('#enzyme-progress').textContent=`${solvedEnzymes.size} de 3 enzimas resueltas`;progress('enzimas',solvedEnzymes.size);$('#enzyme-input-name').textContent=name.substrate;$('#enzyme-output-name').textContent=name.product;$('.enzyme-workbench').classList.add('reaction-complete');}
  feedback('#enzyme-feedback',`${result.correct===2?'✓ Reacción identificada.':`${result.correct} de 2 relaciones correctas.`} ${enzyme.why}${result.correct===2?' La enzima queda disponible para otra reacción.':' Corrige y prueba otra vez.'}`,result.correct!==2);
 });
 $('#enzyme-next').addEventListener('click',()=>{enzymeIndex=(enzymeIndex+1)%3;renderEnzyme();$('#enzyme-substrate').focus({preventScroll:true});});
 $('#enzyme-reset').addEventListener('click',()=>{enzymeDrafts.clear();solvedEnzymes.clear();enzymeIndex=0;progress('enzimas',0);$('#enzyme-progress').textContent='0 de 3 enzimas resueltas';renderEnzyme();feedback('#enzyme-feedback','Relaciones reiniciadas.');});renderEnzyme();

 let experimentIndex=0,prediction='',damaged=false;const solvedExperiments=new Set();
 const settings=()=>({enzyme:$('#condition-enzyme').value,temperature:$('#condition-temperature').value,ph:$('#condition-ph').value,damaged});
 function clearAssay(){prediction='';pressed('#condition-predictions button',()=>false);$('#condition-result').hidden=true;feedback('#condition-feedback','');$('#assay-level').textContent='Haz una predicción';$('#assay-tube').dataset.level='pending';$('.activity-meter').dataset.level='pending';$('#assay-sample').textContent=damaged?'Muestra desnaturalizada por calor previo.':'Muestra funcional, sin desnaturalización previa.';}
 function loadExperiment(i){experimentIndex=i;const experiment=experiments[i];damaged=false;$('#condition-enzyme').value=experiment.enzyme;$('#condition-temperature').value=experiment.temperature;$('#condition-ph').value=experiment.ph;$('#experiment-question').textContent=experiment.question+' Se utiliza una muestra nueva.';pressed('#experiment-tabs button',b=>b.dataset.experiment===experiment.id);clearAssay();}
 experiments.forEach((ex,i)=>{const b=el('button',`${i+1} · ${ex.name}`,{type:'button','data-experiment':ex.id});b.addEventListener('click',()=>loadExperiment(i));$('#experiment-tabs').append(b);});
 ['enzyme','temperature','ph'].forEach(field=>$(`#condition-${field}`).addEventListener('change',()=>{experimentIndex=null;if(field==='enzyme')damaged=false;clearAssay();pressed('#experiment-tabs button',()=>false);$('#experiment-question').textContent='Exploración libre: cambia condiciones y compara. Para completar los cinco retos, selecciónalos en los botones de arriba.';if(field==='enzyme')feedback('#condition-feedback','Cambiaste de enzima: se usa una muestra nueva.');}));
 $$('#condition-predictions button').forEach(b=>b.addEventListener('click',()=>{prediction=b.dataset.levelAnswer;pressed('#condition-predictions button',candidate=>candidate===b);feedback('#condition-feedback','');}));
 $('#condition-run').addEventListener('click',()=>{
  if(!prediction){feedback('#condition-feedback','Primero predice si la actividad será alta, baja o inactiva.',true);$('#condition-predictions button').focus();return;}
  const result=enzymeActivity(settings()),ok=prediction===result.level;damaged=result.damaged;
  $('#assay-level').textContent={alta:'Actividad alta',lenta:'Actividad baja',inactiva:'Muestra inactiva'}[result.level];$('#assay-tube').dataset.level=result.level;$('.activity-meter').dataset.level=result.level;
  $('#assay-sample').textContent=damaged?'Esta muestra quedó desnaturalizada.':'La muestra conserva su función.';
  $('#condition-result').hidden=false;$('#condition-result-title').textContent=result.title;$('#condition-result-why').textContent=result.why;
  if(ok&&experimentIndex!==null){solvedExperiments.add(experiments[experimentIndex].id);$('#condition-progress').textContent=`${solvedExperiments.size} de 5 retos experimentales resueltos`;progress('condiciones',solvedExperiments.size);}
  feedback('#condition-feedback',ok?'✓ Tu predicción coincide con el modelo. Lee la explicación y compara otra condición.':`La observación fue: ${$('#assay-level').textContent.toLowerCase()}. Revisa la explicación y vuelve a predecir.`,!ok);
 });
 $('#condition-fresh').addEventListener('click',()=>{damaged=false;clearAssay();feedback('#condition-feedback','Muestra nueva. Conservaste la enzima y las condiciones seleccionadas; vuelve a predecir.');});
 $('#condition-reset').addEventListener('click',()=>{solvedExperiments.clear();progress('condiciones',0);$('#condition-progress').textContent='0 de 5 retos experimentales resueltos';loadExperiment(0);feedback('#condition-feedback','Laboratorio reiniciado.');});loadExperiment(0);

 mountQuiz($('#repaso-metabolismo'),{bank,categories,categoryLabel:'ideas de metabolismo y ATP',studyLink:'#metabolismo'});
 $$('.interactive-lab').forEach(lab=>lab.hidden=false);
}
