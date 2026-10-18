import {bank,categories} from './banco-preguntas.mjs';
import {mountQuiz} from '../../../biologia-parte-1/recursos/cuestionarios.mjs';
import {routes,createCycle,stepCycle,yields,agents,products,foodCases,gradeFood,cases,caseOptions} from './modelo.mjs';
const root=document.querySelector('.fermentation-page');
if(root){
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const make=(tag,text,attrs={})=>{const e=document.createElement(tag);e.textContent=text;Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;};
 const feedback=(id,text,wrong=false)=>{const e=$(id);e.textContent=text;e.classList.toggle('wrong',wrong);};
 const counts={ciclo:0,alimentos:0,energia:0,casos:0},totals={ciclo:2,alimentos:5,energia:5,casos:12};
 function progress(id,count){counts[id]=count;const link=$(`[data-station="${id}"]`);link.querySelector('span').textContent=`${count}/${totals[id]}`;link.classList.toggle('done',count===totals[id]);$('#practice-progress').textContent=`${Object.keys(totals).filter(k=>counts[k]===totals[k]).length} de 4 prácticas completadas`;}
 let cycle=createCycle();const completedRoutes=new Set();
 function renderCycle(){
  for(const field of ['glucose','pyruvate','nad','nadh','atp','product','co2'])$(`[data-molecule="${field}"]`).textContent=cycle[field];
  $('.molecule-dots').textContent=cycle.glucose?'● '.repeat(cycle.glucose).trim():'—';
  $('#cycle-product-name').textContent=routes[cycle.route].product;$('#cycle-route-note').textContent=routes[cycle.route].note;
  $('#nad-status').textContent=cycle.nad===2?'NAD⁺ disponible para recibir electrones.':'Los transportadores están como NADH. Necesitas regenerar NAD⁺.';
  $('#cycle-board').dataset.phase=cycle.nad===2?'ready':'recycle';
  $('#cycle-counter').textContent=`${completedRoutes.size} de 2 rutas comprobadas · ${cycle.cycles} ciclos en esta muestra`;
  $$('[data-cycle-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cycleRoute===cycle.route)));
 }
 $$('[data-cycle-route]').forEach(b=>b.addEventListener('click',()=>{if(cycle.route===b.dataset.cycleRoute)return;cycle=createCycle(b.dataset.cycleRoute);renderCycle();feedback('#cycle-feedback','Cambiaste de ruta: comienza una muestra nueva. Conservas las rutas ya comprobadas.');}));
 for(const action of ['glycolysis','ferment'])$(`#cycle-${action}`).addEventListener('click',()=>{const result=stepCycle(cycle,action);cycle=result.state;if(result.ok&&action==='ferment'){completedRoutes.add(cycle.route);progress('ciclo',completedRoutes.size);}renderCycle();feedback('#cycle-feedback',result.message,!result.ok);});
 $('#cycle-reset').addEventListener('click',()=>{completedRoutes.clear();cycle=createCycle(cycle.route);progress('ciclo',0);renderCycle();feedback('#cycle-feedback','Simulador reiniciado. Realiza glucólisis y después regenera NAD⁺.');});renderCycle();

 let foodIndex=0;const solvedFoods=new Set(),drafts=new Map();
 for(const [field,options] of [['agent',agents],['product',products]])for(const [id,name] of options)$(`#food-${field}`).append(make('option',name,{value:id}));
 function clearFood(){for(const field of ['agent','product']){$(`#food-${field}`).removeAttribute('aria-invalid');$(`#food-${field}-result`).textContent='';}feedback('#food-feedback','');}
 function renderFood(){const item=foodCases[foodIndex];$('#food-title').textContent=item.title;$('#food-prompt').textContent=item.prompt;$('#food-icon').textContent={pan:'🍞',yogur:'🥛',musculo:'💪',queso:'🧀',industria:'⚗'}[item.icon];$('#food-number').textContent=`Caso ${foodIndex+1} de 5`;
  for(const field of ['agent','product'])$(`#food-${field}`).value=drafts.get(item.id)?.[field]||'';clearFood();
  $$('#food-tabs button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.food===item.id));b.classList.toggle('solved',solvedFoods.has(b.dataset.food));});
  if(solvedFoods.has(item.id))feedback('#food-feedback','Ya relacionaste este caso. Puedes revisarlo otra vez.');
  $('#food-next').textContent=foodIndex===4?'Volver al primer caso ↻':'Siguiente caso →';
 }
 foodCases.forEach((item,i)=>{const b=make('button',`${i+1}`,{type:'button','data-food':item.id,'aria-label':`${i+1}: ${item.title}`});b.addEventListener('click',()=>{foodIndex=i;renderFood();});$('#food-tabs').append(b);});
 for(const field of ['agent','product'])$(`#food-${field}`).addEventListener('change',()=>{drafts.set(foodCases[foodIndex].id,{agent:$('#food-agent').value,product:$('#food-product').value});clearFood();});
 $('#food-form').addEventListener('submit',event=>{event.preventDefault();clearFood();const item=foodCases[foodIndex],answers={agent:$('#food-agent').value,product:$('#food-product').value},result=gradeFood(item,answers);drafts.set(item.id,answers);
  if(result.missing.length){feedback('#food-feedback','Elige quién actúa y qué produce antes de comprobar.',true);$(`#food-${result.missing[0]}`).focus();return;}
  for(const [field,options] of [['agent',agents],['product',products]]){const ok=answers[field]===item[field];$(`#food-${field}`).setAttribute('aria-invalid',String(!ok));$(`#food-${field}-result`).textContent=ok?'✓ Relación correcta':`Corresponde: ${options.find(([id])=>id===item[field])[1]}.`;}
  const ok=result.correct.length===2;if(ok){solvedFoods.add(item.id);$('#food-progress').textContent=`${solvedFoods.size} de 5 casos relacionados`;progress('alimentos',solvedFoods.size);$(`#food-tabs [data-food="${item.id}"]`).classList.add('solved');}
  feedback('#food-feedback',`${ok?'✓ Conectaste las dos ideas.':`${result.correct.length} de 2 relaciones correctas.`} ${item.why}${ok?'':' Corrige y vuelve a comprobar.'}`,!ok);
 });
 $('#food-next').addEventListener('click',()=>{foodIndex=(foodIndex+1)%5;renderFood();$('#food-agent').focus({preventScroll:true});});
 $('#food-reset').addEventListener('click',()=>{solvedFoods.clear();drafts.clear();foodIndex=0;progress('alimentos',0);$('#food-progress').textContent='0 de 5 casos relacionados';renderFood();feedback('#food-feedback','Relaciones reiniciadas.');});renderFood();

 const solvedAmounts=new Set();
 function renderYield(){const n=Number($('#glucose-amount').value),result=yields(n);$('#glucose-label').textContent=`${n} ${n===1?'glucosa':'glucosas'}`;$('#yield-prompt').textContent=`Si ${n} ${n===1?'glucosa completa':'glucosas completan'} glucólisis y fermentación típica, ¿cuántos ATP netos se obtienen?`;
  $('#yield-result').hidden=true;feedback('#yield-feedback','');const answers=$('#yield-answers');answers.replaceChildren();
  for(const value of [4*n,2*n,32*n]){const b=make('button',`${value} ATP`,{type:'button','data-yield':value,'aria-pressed':'false'});b.addEventListener('click',()=>{const ok=value===result.fermentation;[...answers.children].forEach(e=>e.setAttribute('aria-pressed',String(e===b)));
   if(ok){solvedAmounts.add(n);progress('energia',solvedAmounts.size);$('#yield-progress').textContent=`${solvedAmounts.size} de 5 cantidades resueltas`;$('#yield-result').hidden=false;$('#fermentation-total').textContent=`${result.fermentation} ATP netos`;$('#aerobic-total').textContent=`≈ ${result.aerobicMin}–${result.aerobicMax} ATP`;}
   feedback('#yield-feedback',ok?`✓ ${n} × 2 = ${result.fermentation} ATP netos. Se obtienen en glucólisis; regenerar NAD⁺ no añade ATP en estas rutas.`:value===4*n?'Cuidado: 4 ATP es la producción bruta por glucosa. Hay que descontar 2 invertidos; la ganancia neta es 2.':'Ese rendimiento se parece al de la respiración aerobia. En estas fermentaciones, la glucólisis aporta 2 ATP netos por glucosa.',!ok);
  });answers.append(b);}
 }
 $('#glucose-amount').addEventListener('input',renderYield);$('#yield-reset').addEventListener('click',()=>{solvedAmounts.clear();$('#glucose-amount').value='1';progress('energia',0);$('#yield-progress').textContent='0 de 5 cantidades resueltas';renderYield();feedback('#yield-feedback','Comparación reiniciada.');});renderYield();

 let caseIndex=0;const solvedCases=new Set();
 function renderCase(){const item=cases[caseIndex];$('#case-title').textContent=item.title;$('#case-prompt').textContent=item.prompt;$('#case-number').textContent=`${caseIndex+1} / 12`;
  $$('#case-tabs button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.case===item.id));b.classList.toggle('solved',solvedCases.has(b.dataset.case));});
  $$('#case-answers button').forEach(b=>b.setAttribute('aria-pressed','false'));feedback('#case-feedback',solvedCases.has(item.id)?'Caso resuelto. Puedes repasarlo sin sumar puntos otra vez.':'');$('#case-next').textContent=caseIndex===11?'Volver al primero ↻':'Siguiente →';
 }
 cases.forEach((item,i)=>{const b=make('button',String(i+1).padStart(2,'0'),{type:'button','data-case':item.id,'aria-label':`${i+1}: ${item.title}`});b.addEventListener('click',()=>{caseIndex=i;renderCase();});$('#case-tabs').append(b);});
 caseOptions.forEach(([id,name])=>{const b=make('button',name,{type:'button','data-case-answer':id,'aria-pressed':'false'});b.addEventListener('click',()=>{const item=cases[caseIndex],ok=id===item.answer;$$('#case-answers button').forEach(e=>e.setAttribute('aria-pressed',String(e===b)));if(ok){solvedCases.add(item.id);progress('casos',solvedCases.size);$('#case-progress').textContent=`${solvedCases.size} de 12 casos resueltos`;$(`#case-tabs [data-case="${item.id}"]`).classList.add('solved');}feedback('#case-feedback',`${ok?'✓ Correcto.':'Revisa las pistas.'} ${item.why}${ok?'':' Puedes volver a elegir.'}`,!ok);});$('#case-answers').append(b);});
 $('#case-next').addEventListener('click',()=>{caseIndex=(caseIndex+1)%12;renderCase();$('#case-answers button').focus({preventScroll:true});});$('#case-reset').addEventListener('click',()=>{solvedCases.clear();caseIndex=0;progress('casos',0);$('#case-progress').textContent='0 de 12 casos resueltos';renderCase();feedback('#case-feedback','Casos reiniciados.');});renderCase();
 mountQuiz($('#repaso-fermentacion'),{bank,categories,categoryLabel:'ideas de fermentación',studyLink:'#concepto'});
 $$('.interactive').forEach(e=>e.hidden=false);
}
