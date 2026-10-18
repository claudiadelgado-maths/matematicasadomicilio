import {parts,grade,osmosis,transportTypes,cases,passive,pumpSteps,vesicles} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {mountQuiz} from '../../../biologia-parte-1/recursos/cuestionarios.mjs';

const root=document.querySelector('.transport-page');
if(root){
 const $=s=>root.querySelector(s), $$=s=>[...root.querySelectorAll(s)];
 const el=(tag,text,attrs={})=>{const e=document.createElement(tag);if(text!==null)e.textContent=text;Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;};
 const svg=(tag,attrs={})=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;};
 const dot=(x,y,r,color)=>svg('circle',{cx:x,cy:y,r,fill:color});
 const status=(id,text,wrong=false)=>{const e=$(id);e.textContent=text;e.classList.toggle('wrong',wrong);};
 const press=(nodes,predicate)=>nodes.forEach(b=>b.setAttribute('aria-pressed',String(predicate(b))));

 const visited=new Set();
 function showPart(id){
  const p=parts.find(p=>p.id===id);visited.add(id);
  $('#part-name').textContent=p.name;$('#part-role').textContent=p.role;$('#part-detail').textContent=p.detail;
  $('#part-progress').textContent=`${visited.size} de 5 componentes explorados`;
  press($$('[data-pick-part]'),b=>b.dataset.pickPart===id);
  $$('.membrane-board [data-part]').forEach(g=>g.classList.toggle('selected',g.dataset.part===id));
 }
 parts.forEach((p,i)=>{
  const pin=el('button',String(i+1),{type:'button',class:'pin','aria-label':`${i+1}. ${p.name}`,'data-pick-part':p.id});
  pin.style.left=p.x+'%';pin.style.top=p.y+'%';pin.addEventListener('click',()=>showPart(p.id));$('#membrane-board').append(pin);
  const b=el('button',`${i+1} · ${p.short}`,{type:'button','data-pick-part':p.id});b.addEventListener('click',()=>showPart(p.id));$('#parts-buttons').append(b);
 });showPart(parts[0].id);

 const expectedMatch=Object.fromEntries(parts.map(p=>[p.id,p.id]));
 // Present the functions in a different order from the component list.
 [parts[3],parts[0],parts[4],parts[2],parts[1]].forEach((p,i)=>{
  const row=el('div',null),label=el('label',`${i+1}. ${p.match}`,{for:`match-${p.id}`}),select=el('select',null,{id:`match-${p.id}`,'aria-describedby':`match-result-${p.id}`});
  select.append(el('option','Elige un componente…',{value:''}));parts.forEach(c=>select.append(el('option',c.name,{value:c.id})));
  const result=el('span',null,{class:'field-result',id:`match-result-${p.id}`});
  select.addEventListener('change',()=>{select.removeAttribute('aria-invalid');result.textContent='';status('#match-feedback','');});
  row.append(label,select,result);$('#match-fields').append(row);
 });
 $('#match-form').addEventListener('submit',e=>{
  e.preventDefault();const answers=Object.fromEntries(parts.map(p=>[p.id,$(`#match-${p.id}`).value])),result=grade(expectedMatch,answers);
  if(result.missing.length){status('#match-feedback','Relaciona las cinco funciones antes de comprobar.',true);$(`#match-${result.missing[0]}`).focus();return;}
  parts.forEach(p=>{const ok=answers[p.id]===p.id;$(`#match-${p.id}`).setAttribute('aria-invalid',String(!ok));$(`#match-result-${p.id}`).textContent=ok?'✓ Relación correcta':`Corresponde: ${p.name}. ${p.role}`;});
  status('#match-feedback',result.complete?'✓ 5 de 5. Conectaste las piezas con sus funciones.':`${result.correct} de 5. Revisa las correcciones y vuelve a intentar.`,!result.complete);
 });
 $('#match-reset').addEventListener('click',()=>{$('#match-form').reset();$$('#match-fields select').forEach(s=>s.removeAttribute('aria-invalid'));$$('#match-fields .field-result').forEach(s=>s.textContent='');status('#match-feedback','Relaciones reiniciadas.');});

 let passiveMode='simple',passiveStage=0;
 function drawPassive(){
  const p=passive[passiveMode],water=passiveMode==='osmosis';
  $('#passive-name').textContent=p.name;$('#passive-route').textContent=p.route;$('#passive-detail').textContent=p.detail;$('#passive-cargo').textContent=p.cargo;
  $('#passive-pore').toggleAttribute('hidden',passiveMode==='simple');
  const left=water?[8,6,4][passiveStage]:[8,6,5][passiveStage],right=water?12-left:10-left;
  const circles=[];for(let side=0;side<2;side++){const count=side?right:left-(passiveStage===1?1:0);for(let i=0;i<count;i++)circles.push(dot((side?320:55)+(i%3)*48,62+Math.floor(i/3)*63,11,p.color));}
  if(passiveStage===1)circles.push(dot(260,150,10,p.color));
  $('#passive-particles').replaceChildren(...circles);
  const solute=[];if(water){for(let i=0;i<2;i++)solute.push(svg('rect',{x:80+i*52,y:230,width:12,height:12,fill:'#8467a3'}));for(let i=0;i<7;i++)solute.push(svg('rect',{x:315+(i%4)*37,y:218+Math.floor(i/4)*23,width:12,height:12,fill:'#8467a3'}));}$('#passive-solute').replaceChildren(...solute);
  const descriptions=water?[
   'Inicio: hay más solutos no penetrantes a la derecha (cuadrados violetas). El agua puede cruzar; los solutos no.',
   'Flujo neto: más agua cruza hacia el lado derecho, que tiene mayor concentración de solutos no penetrantes.',
   'Tendencia: el lado derecho recibe agua. En una célula cambiaría su volumen; este esquema no calcula el equilibrio final.'
  ]:[
   'Inicio: la sustancia está más concentrada a la izquierda. Los dos compartimentos se representan con igual volumen.',
   'Movimiento: el flujo neto va hacia la derecha, de mayor a menor concentración.',
   'Equilibrio dinámico: los movimientos se compensan. Las moléculas siguen cruzando en ambos sentidos.'
  ];
  $('#passive-step-text').textContent=descriptions[passiveStage]+(passiveMode==='facilitada'?' En este dibujo suponemos que no hay una diferencia eléctrica adicional.':'');
  $('#passive-stage-caption').textContent=`Paso ${passiveStage+1} de 3 · ${water?'Azul: agua · Violeta: soluto que no cruza.':'Puntos: la sustancia que puede cruzar.'}`;
  $('#passive-svg-title').textContent=`${p.name}. ${descriptions[passiveStage]}`;
  $('#passive-arrow').setAttribute('d',!water&&passiveStage===2?'M190 260H320m-12-10 12 10-12 10M190 260l12-10m-12 10 12 10':'M190 260H320m-12-10 12 10-12 10');
  $('#passive-prev').disabled=passiveStage===0;$('#passive-next').textContent=passiveStage===2?'Volver al inicio ↻':'Ver movimiento →';
  press($$('#passive-modes button'),b=>b.dataset.passive===passiveMode);
 }
 $$('#passive-modes button').forEach(b=>b.addEventListener('click',()=>{passiveMode=b.dataset.passive;passiveStage=0;drawPassive();}));
 $('#passive-prev').addEventListener('click',()=>{passiveStage=Math.max(0,passiveStage-1);drawPassive();});$('#passive-next').addEventListener('click',()=>{passiveStage=(passiveStage+1)%3;drawPassive();});drawPassive();

 const osmSolved=new Set();
 const osmCondition=()=>osmosis(Number($('#osm-outside').value),$('#osm-cell-type').value);
 function prepareOsmosis(){
  const plant=$('#osm-cell-type').value==='vegetal',outside=Number($('#osm-outside').value);
  $('#osm-value').value=String(outside);$('#osm-outside-label').textContent=`Fuera al inicio: ${outside}`;
  $('#osm-result').hidden=true;status('#osm-feedback','');$('#osm-cytoplasm').style.transform='scale(1)';
  $('#osm-wall').toggleAttribute('hidden',!plant);$('#osm-vacuole').toggleAttribute('hidden',!plant);$('#osm-rbc').toggleAttribute('hidden',plant);
  $('#osm-plant-cell').toggleAttribute('hidden',!plant);$('#osm-cell').toggleAttribute('hidden',plant);
  $('#osm-cell').setAttribute('fill',plant?'#e7edd0':'#f1c9b6');$('#osm-cell').setAttribute('stroke',plant?'#7d9263':'#ad7059');
  $('#osm-in-arrow').setAttribute('opacity','0');$('#osm-out-arrow').setAttribute('opacity','0');
  $('#osm-svg-title').textContent=`Célula ${plant?'vegetal':'animal'} antes del cambio. Interior: 5; exterior: ${outside}. Predice el flujo neto de agua.`;
  const positions=[[64,77],[436,75],[45,128],[462,127],[66,293],[441,288],[74,349],[446,349],[72,390],[456,395]];
  $('#osm-outside-dots').replaceChildren(...positions.slice(0,outside).map(([x,y])=>dot(x,y,7,'#8467a3')));
  $$('#osm-answers button').forEach(b=>{b.disabled=false;b.removeAttribute('aria-pressed');});
 }
 $('#osm-cell-type').addEventListener('change',prepareOsmosis);$('#osm-outside').addEventListener('input',prepareOsmosis);
 $$('#osm-answers button').forEach(b=>b.addEventListener('click',()=>{
  const result=osmCondition(),ok=b.dataset.water===result.direction;
  press($$('#osm-answers button'),candidate=>candidate===b);
  if(!ok){const hint=result.direction==='entra'?'Hay menos solutos no penetrantes fuera. El agua tiende hacia el interior.':result.direction==='sale'?'Hay más solutos no penetrantes fuera. El agua tiende hacia el exterior.':'Las concentraciones son iguales. El agua se mueve en ambos sentidos, sin flujo neto.';
   status('#osm-feedback',`Revisa la comparación. ${hint} Vuelve a elegir para observar el resultado.`,true);$('#osm-result').hidden=true;return;}
  osmSolved.add(`${$('#osm-cell-type').value}-${result.medium}`);$('#osm-progress').textContent=`${osmSolved.size} de 6 combinaciones resueltas`;
  $$('#osm-answers button').forEach(answer=>answer.disabled=true);
  status('#osm-feedback',`✓ ${result.direction==='equilibrio'?'Sin movimiento neto.':result.direction==='entra'?'El agua tiende a entrar.':'El agua tiende a salir.'}${osmSolved.size===6?' Comparaste los tres medios en ambos tipos de célula.':''}`);
  $('#osm-medium').textContent=`Medio exterior ${result.name.toLowerCase()}`;$('#osm-effect').textContent=result.title;$('#osm-explanation').textContent=result.detail;$('#osm-result').hidden=false;
  $('#osm-cytoplasm').style.transform=`scale(${result.scale})`;
  $('#osm-in-arrow').setAttribute('opacity',result.direction==='sale'?'.3':'1');$('#osm-out-arrow').setAttribute('opacity',result.direction==='entra'?'.3':'1');
  $('#osm-svg-title').textContent=`Medio ${result.name}. ${result.title} ${result.detail}`;
 }));
 $('#osm-reset').addEventListener('click',()=>{osmSolved.clear();$('#osm-cell-type').value='animal';$('#osm-outside').value='2';$('#osm-progress').textContent='0 de 6 combinaciones resueltas';prepareOsmosis();status('#osm-feedback','Laboratorio reiniciado. Compara y predice.');});prepareOsmosis();

 let pumpStage=0;
 function drawPump(){
  const [title,description]=pumpSteps[pumpStage];$('#pump-title').textContent=title;$('#pump-description').textContent=description;$('#pump-count').textContent=`${pumpStage+1} / 4`;$('#pump-svg-title').textContent=`${title}. ${description}`;
  const sodium=pumpStage<2,count=sodium?3:2,y=[247,67,70,257][pumpStage],color=sodium?'#dc9861':'#438da8';
  const ions=[];for(let i=0;i<count;i++){const x=226+i*30;ions.push(dot(x,y,14,color));const t=svg('text',{x,y:y+4,'text-anchor':'middle','font-family':'sans-serif','font-size':'11',fill:sodium?'#4c321e':'#fff'});t.textContent=sodium?'Na⁺':'K⁺';ions.push(t);}$('#pump-ions').replaceChildren(...ions);
  $('#pump-arrow').setAttribute('d',sodium?'M166 256V61m-10 14 10-14 10 14':'M351 62V257m-10-14 10 14 10-14');$('#pump-arrow').setAttribute('stroke',color);
  $('#pump-atp').textContent=pumpStage===1?'Energía del ATP':'1 ATP / ciclo';$('#pump-prev').disabled=pumpStage===0;$('#pump-next').textContent=pumpStage===3?'Repetir ciclo ↻':'Siguiente paso →';
 }
 $('#pump-prev').addEventListener('click',()=>{pumpStage=Math.max(0,pumpStage-1);drawPump();});$('#pump-next').addEventListener('click',()=>{pumpStage=(pumpStage+1)%4;drawPump();});drawPump();

 let vesicleMode='fagocitosis',vesicleStage=0;
 function drawVesicle(){
  const data=vesicles[vesicleMode],[title,description]=data.steps[vesicleStage],exit=vesicleMode==='exocitosis';
  $('#vesicle-subtitle').textContent=data.subtitle;$('#vesicle-title').textContent=title;$('#vesicle-description').textContent=description;$('#vesicle-count').textContent=`${vesicleStage+1} / 3`;$('#vesicle-svg-title').textContent=`${data.name}: ${title}. ${description}`;
  const shape=vesicleStage===0&&!exit||vesicleStage===1&&exit?'M20 170H181Q198 170 202 143L210 98Q222 79 234 97L231 154Q230 210 260 216Q295 212 291 154L290 98Q302 79 314 98L320 143Q325 170 343 170H500':'M20 170H500';
  $('#vesicle-membrane').setAttribute('d',shape);$('#vesicle-cytoplasm').setAttribute('d',`${shape}V330H20Z`);
  const y=exit?[254,155,92][vesicleStage]:[125,243,253][vesicleStage];
  const nodes=[];if((!exit&&vesicleStage>0)||(exit&&vesicleStage===0))nodes.push(svg('ellipse',{cx:260,cy:y,rx:67,ry:53,fill:'#e8f2e2',stroke:'#568b7a','stroke-width':6}));
  if(vesicleMode==='fagocitosis'&&vesicleStage<2){nodes.push(svg('rect',{x:237,y:y-14,width:46,height:28,rx:14,fill:'#9475b3',stroke:'#654886','stroke-width':2}));for(let i=0;i<3;i++)nodes.push(dot(247+i*13,y,3,'#d6c7e6'));}
  else{for(let i=0;i<7;i++){const x=235+(i%3)*25,cy=y-20+Math.floor(i/3)*20;nodes.push(dot(x,cy,6,'#9475b3'));}}
  if(vesicleMode==='fagocitosis'&&vesicleStage===2){nodes.push(dot(341,256,21,'#eab77b'));const label=svg('text',{x:330,y:296,'text-anchor':'middle','font-size':13,'font-family':'sans-serif',fill:'#5c6757'});label.textContent='Digestión';nodes.push(label);}
  $('#vesicle-content').replaceChildren(...nodes);press($$('#vesicle-modes button'),b=>b.dataset.vesicle===vesicleMode);$('#vesicle-prev').disabled=vesicleStage===0;$('#vesicle-next').textContent=vesicleStage===2?'Volver al inicio ↻':'Siguiente paso →';
 }
 $$('#vesicle-modes button').forEach(b=>b.addEventListener('click',()=>{vesicleMode=b.dataset.vesicle;vesicleStage=0;drawVesicle();}));$('#vesicle-prev').addEventListener('click',()=>{vesicleStage=Math.max(0,vesicleStage-1);drawVesicle();});$('#vesicle-next').addEventListener('click',()=>{vesicleStage=(vesicleStage+1)%3;drawVesicle();});drawVesicle();

 let caseIndex=0;const drafts=new Map(),solved=new Set();const fields=['mechanism','energy'];
 transportTypes.forEach(t=>$('#case-mechanism').append(el('option',t.name,{value:t.id})));
 function clearCase(){status('#case-feedback','');fields.forEach(f=>{$(`#case-${f}`).removeAttribute('aria-invalid');$(`#case-${f}-result`).textContent='';});}
 function saveCase(){drafts.set(cases[caseIndex].id,Object.fromEntries(fields.map(f=>[f,$(`#case-${f}`).value])));}
 function showCase(index){
  caseIndex=(index+cases.length)%cases.length;const c=cases[caseIndex];$('#case-title').textContent=c.title;$('#case-clue').textContent=c.clue;$('#case-number').textContent=`Caso ${String(caseIndex+1).padStart(2,'0')} / 12`;
  fields.forEach(f=>$(`#case-${f}`).value=drafts.get(c.id)?.[f]||'');clearCase();press($$('#case-tabs button'),b=>b.dataset.case===c.id);$('#case-next').textContent=caseIndex===11?'Volver al primer caso ↻':'Siguiente caso →';
 }
 cases.forEach((c,i)=>{const b=el('button',String(i+1).padStart(2,'0'),{type:'button','data-case':c.id,'aria-label':`Caso ${i+1}: ${c.title}`});b.addEventListener('click',()=>showCase(i));$('#case-tabs').append(b);});
 fields.forEach(f=>{const select=$(`#case-${f}`);select.setAttribute('aria-describedby',`case-${f}-result`);select.addEventListener('change',()=>{saveCase();clearCase();});});
 $('#case-form').addEventListener('submit',e=>{
  e.preventDefault();saveCase();clearCase();const c=cases[caseIndex],answers=drafts.get(c.id),result=grade({mechanism:c.mechanism,energy:c.energy},answers);
  if(result.missing.length){status('#case-feedback','Elige el mecanismo y la energía antes de comprobar.',true);$(`#case-${result.missing[0]}`).focus();return;}
  fields.forEach(f=>{const ok=answers[f]===c[f];$(`#case-${f}`).setAttribute('aria-invalid',String(!ok));$(`#case-${f}-result`).textContent=ok?'✓ Correcto':f==='mechanism'?`Corresponde: ${transportTypes.find(t=>t.id===c.mechanism).name}.`:`Corresponde: ${c.energy==='no'?'sin gasto directo de ATP, pasivo':'requiere energía celular'}.`;});
  if(result.complete){solved.add(c.id);$('#case-progress').textContent=`${solved.size} de 12 casos resueltos`;}
  status('#case-feedback',`${result.complete?'✓ Caso resuelto.':`${result.correct} de 2 decisiones correctas.`} ${c.why}${result.complete?'':' Corrige y vuelve a intentar.'}`,!result.complete);
 });
 $('#case-next').addEventListener('click',()=>{showCase(caseIndex+1);$('#case-mechanism').focus({preventScroll:true});});$('#case-reset').addEventListener('click',()=>{drafts.clear();solved.clear();$('#case-progress').textContent='0 de 12 casos resueltos';showCase(0);status('#case-feedback','Casos reiniciados.');});showCase(0);
 mountQuiz($('#repaso-transporte'),{bank,categories,categoryLabel:'ideas de transporte celular',studyLink:'#membrana'});
}
