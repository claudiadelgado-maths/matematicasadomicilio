import {mono,mt,tex,product,expand,mulM,powM,eq,common,divide,unit,generate,challenge,shuffle,names,grouping,ordered} from './algebra.mjs';
import {completionSteps,coefficientResult} from './procedimientos.mjs';
const $=s=>document.querySelector(s),game=$('#game'),page=document.body.dataset.page;
// El respaldo mantiene exponentes y fracciones legibles si KaTeX no está disponible.
function fallback(t){
 let at=0;
 const group=()=>{if(t[at]==='{'){at++;return parse('}');}return t[at++]||'';};
 function parse(end=''){let out='';while(at<t.length){if(end&&t[at]===end){at++;break;}if(t.startsWith('\\frac',at)){at+=5;const a=group(),b=group();out+=`<span class="fraction"><span>${a}</span><span>${b}</span></span>`;}else if(t[at]==='^'){at++;out+=`<sup>${group()}</sup>`;}else if(t[at]==='{'){at++;out+=parse('}');}else if(t[at]==='\\'){const m=t.slice(at).match(/^\\([a-zA-Z]+|;)/);if(m){at+=m[0].length;out+=({left:'',right:'',quad:' ',cdot:'·',times:'×',neq:'≠',sqrt:'√',square:'□',longleftrightarrow:'↔',';':' '})[m[1]]??m[1];}else at++;}else out+=t[at++];}return out;}return parse();
}
export const math=t=>`<span class="math" data-tex="${t.replaceAll('"','&quot;')}">${fallback(t)}</span>`;
const formula=t=>`<div class="formula">${math(t)}</div>`;
const arrow='<div class="step-arrow" aria-hidden="true">↓</div>';
const btn=(text,attr='')=>`<button type="button" ${attr}>${text}</button>`;
function render(){document.querySelectorAll('[data-tex]').forEach(el=>{if(window.katex&&el.dataset.rendered!==el.dataset.tex){window.katex.render('\\displaystyle '+el.dataset.tex,el,{throwOnError:false});el.dataset.rendered=el.dataset.tex;}});}
function feedback(t,good=false){if(!$('#feedback'))return;$('#feedback').className='feedback '+(good?'good':'');$('#feedback').innerHTML=t;render();}
function heading(t){game.insertAdjacentHTML('beforeend',`<h3 tabindex="-1" class="current-step">${t}</h3>`);}
function choices(items,fn){const box=document.createElement('div');box.className='cards';items.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=math(item);b.setAttribute('aria-label',item.replaceAll('\\',''));b.onclick=()=>fn(i,b);box.append(b);});game.append(box);render();}
function finish(f=r.factors,answer=product(f)){
 game.querySelector('.success')?.remove();
 game.insertAdjacentHTML('beforeend',`<div class="success">${arrow}${formula(`${tex(r.expression)}=${answer}`)}<h3>Comprobación por multiplicación</h3>${formula(`${product(f)}=${tex(ordered(expand(f)))}`)}</div>`);
 feedback('✓ ¡Correcto! Al multiplicar los factores recuperas la expresión original.',true);render();
}
function detailed(){game.insertAdjacentHTML('beforeend',`<section class="solution"><h3>Solución · ${names[r.method]}</h3>${r.steps.map(([text,t])=>`<p>${text}</p>${formula(t)}`).join('')}<h4>Comprobación</h4>${formula(`${r.answer}=${tex(ordered(expand(r.factors)))}`)}</section>`);render();}
let hard=false,r,previous='',stage=0,answers=[],mode='factorizar',selected=null,marked=new Set(),groups=null,groupStage=0,firstGroup=[],secondGroup=[],order=[],bank=[],submitted=false,done=false;
function fresh(){let next;do{next=page==='reto'?challenge(hard):generate(page==='agrupacion'?(mode==='agrupar'?'agrupacion':'comun'):page,hard);}while(tex(next.expression)===previous);r=next;previous=tex(r.expression);reset();}
function reset(){stage=0;answers=[];selected=null;marked.clear();groups=null;groupStage=0;firstGroup=[];secondGroup=[];order=[];bank=shuffle([0,1,2,3]);submitted=false;done=false;feedback('');draw();}
function draw(){const active=game.contains(document.activeElement);feedback('');game.innerHTML='';
 if(page==='agrupacion')commonUI();
 else if(page==='monico'||page==='general')boxes();
 else{game.innerHTML=formula(tex(r.expression));if(page==='reto'){
  heading('Elige la factorización equivalente.');choices(r.options.map(product),(i,b)=>{game.querySelectorAll('.cards button').forEach(x=>x.disabled=true);const ok=eq(expand(r.options[i]),r.expression);b.classList.add(ok?'correct':'incorrect');feedback(ok?'✓ Correcto. Revisa cómo se obtiene.':'Revisa la solución y compara los productos.',ok);detailed();});
 }else if(page==='completar')completeUI();else rootsUI();}
 render();if(active)game.querySelector('.current-step:last-of-type')?.focus({preventScroll:true});
}
function rootsUI(){const {A,B,s}=r.data,n=page==='cubos'?3:2,rad=m=>`\\sqrt${n===3?'[3]':''}{${mt(powM(m,n))}}`;
 // Reconstruir la vista conserva TODAS las decisiones anteriores; solo los controles pendientes cambian.
 game.insertAdjacentHTML('beforeend',`<div class="root-history" aria-label="Raíces y procedimiento">${[A,B].map((root,i)=>`<div>${math(`${i===0?'A':'B'}=${rad(root)}${answers[i]?'='+mt(answers[i]):''}`)}</div>`).join('')}</div>`);
 if(stage<2){const root=stage===0?A:B;heading(`Selecciona la raíz ${n===3?'cúbica':'cuadrada'} de ${math(mt(powM(root,n)))}.`);
  const options=shuffle([root,mono(root.c+1,root.p),Object.keys(root.p).length?mono(root.c,powM(root,n).p):mono(root.c+2)]);
  choices(options.map(mt),i=>{if(eq([options[i]],[root])){answers.push(root);stage++;draw();}else feedback(`Revisa la raíz del coeficiente y los exponentes: ${math(`\\frac{e}{${n}}`)}.`);});return;
 }
 game.insertAdjacentHTML('beforeend',`${arrow}<div class="roots">${math('A='+mt(A))}${math('B='+mt(B))}</div>`);
 if(page==='tcp'){
  const central=mono(2*A.c*B.c,mulM(A,B).p);
  if(stage===2){heading('Calcula el doble producto');game.insertAdjacentHTML('beforeend',formula(`2AB=2(${mt(A)})(${mt(B)})`));const opts=shuffle([central,mulM(A,B),mono(central.c+1,central.p)]);choices(opts.map(mt),i=>{if(eq([opts[i]],[central])){stage++;draw();}else feedback('Multiplica las dos raíces y después multiplica por 2.');});return;}
  game.insertAdjacentHTML('beforeend',`<div class="procedure-line">${formula(`2AB=2(${mt(A)})(${mt(B)})=${mt(central)}`)}<p>Comparamos ${s===1?'el doble producto':'el doble producto con el signo negativo'} con el término central:</p>${formula(`${mt(mono(s*central.c,central.p))}=${mt(r.expression[1])}\\quad\\checkmark`)}</div>`);
  heading('Elige el signo del binomio');choices([`(${mt(A)}+${mt(B)})^{2}`,`(${mt(A)}-${mt(B)})^{2}`],(i,b)=>{if((i===0?1:-1)===s){game.querySelectorAll('.cards button').forEach(x=>x.disabled=true);b.classList.add('correct');finish(r.factors,`(${tex(r.factors[0])})^{2}`);}else feedback('El signo del binomio debe corresponder al término central.');});return;
 }
 if(page==='diferencia'){
  heading('Forma dos conjugados');game.insertAdjacentHTML('beforeend',`<div class="signs">${math(`(${mt(A)}`)}<select id="sign-a" aria-label="Signo del primer binomio"><option>+</option><option>−</option></select>${math(`${mt(B)})(${mt(A)}`)}<select id="sign-b" aria-label="Signo del segundo binomio"><option>+</option><option>−</option></select>${math(`${mt(B)})`)}</div>${btn('Comprobar conjugados','id="check"')}`);
  $('#check').onclick=()=>{if($('#sign-a').value!==$('#sign-b').value){$('#check').disabled=true;$('#sign-a').disabled=true;$('#sign-b').disabled=true;game.insertAdjacentHTML('beforeend',`<p>Los productos cruzados se cancelan:</p>${formula(`-${mt(mulM(A,B))}+${mt(mulM(A,B))}=0`)}`);finish();}else feedback('Los signos deben ser opuestos para cancelar los productos cruzados.');};return;
 }
 if(page==='cubos'){
  if(stage===2){heading('¿Qué estructura reconoces?');choices(['A^{3}+B^{3}','A^{3}-B^{3}'],i=>{if((i===0?1:-1)===s){stage++;draw();}else feedback('Observa el signo que separa los cubos.');});return;}
  const op=s===1?'+':'-',middle=s===1?'-':'+';
  game.insertAdjacentHTML('beforeend',`<p>${s===1?'Suma':'Diferencia'} de cubos. El signo central del segundo factor es contrario.</p>${formula(`(A${op}B)(A^{2}${middle}AB+B^{2})`)}${arrow}${formula(`(${mt(A)}${op}${mt(B)})((${mt(A)})^{2}${middle}(${mt(A)})(${mt(B)})+(${mt(B)})^{2})`)}${arrow}<div id="cube-live">${formula(`(${mt(A)}${op}${mt(B)})(${answers[2]?mt(answers[2]):'\\square'}${middle}${answers[3]?mt(answers[3]):'\\square'}+${answers[4]?mt(answers[4]):'\\square'})`)}</div>`);
  const pieces=[powM(A,2),mulM(A,B),powM(B,2)];
  if(answers.length<5){heading(['Calcula el cuadrado de A','Calcula el producto AB','Calcula el cuadrado de B'][answers.length-2]);const opts=shuffle(pieces);choices(opts.map(mt),i=>{if(eq([opts[i]],[pieces[answers.length-2]])){answers.push(opts[i]);draw();}else feedback('Revisa el producto indicado. Conserva las letras y suma sus exponentes al multiplicar.');});}
  else finish();
 }
}
function boxes(){const d=r.data,general=page==='general';
 const term=(m,i)=>math((i&&m.c>0?'+':'')+mt(m));
 const input=(name,label,unitMono)=>`<label class="coefficient-input"><span class="sr-label">${label}</span><input name="${name}" aria-label="${label}" type="number" step="1" min="-99" max="99" inputmode="numeric" autocomplete="off">${unit(unitMono)?'':math(mt(unitMono))}</label>`;
 game.innerHTML=`<div class="coefficient-work ${general?'traditional-cross':'simple-pair'}"><div class="polynomial-columns">${r.expression.map((m,i)=>`<div>${term(m,i)}</div>`).join('')}</div>${general?`<div class="coefficient-labels"><span>${math('a='+d.a)}</span><span>${math('b='+d.b)}</span><span>${math('c='+d.c)}</span></div>`:''}<div class="coefficient-columns">${general?`<div class="factor-stack"><span class="down-arrow">↓</span>${input('m','Primer factor del coeficiente principal',d.X)}${input('p','Segundo factor del coeficiente principal',d.X)}<div id="first-product" class="column-product"></div></div><div class="diagonals"><svg viewBox="0 0 240 160" aria-hidden="true" preserveAspectRatio="none"><path class="cross-one" d="M0 20L240 140"/><path class="cross-two" d="M0 140L240 20"/></svg><span id="cross-one" class="cross-value cross-one"></span><span id="cross-two" class="cross-value cross-two"></span></div>`:'<div class="pair-explanation">Escribe dos números cuyo producto dé el término final y cuya suma dé el coeficiente central.</div>'}<div class="factor-stack final-stack"><span class="down-arrow">↓</span>${input('n','Primer factor del término final',d.Z)}${input('q','Segundo factor del término final',d.Z)}<div id="last-product" class="column-product"></div></div></div><div id="checks" aria-live="polite"></div><div id="coefficient-answer" aria-live="polite"></div></div>`;
 const read=name=>{const el=game.querySelector(`input[name="${name}"]`);return el&&el.value!==''?Number(el.value):NaN;};
 const mark=(actual,target,t)=>`<div class="${actual===target?'good':'pending'}">${math(`${t}=${actual}`)} <span>${actual===target?'✓':'✗'}${actual===target?'':` Debe dar ${target}.`}</span></div>`;
 const update=()=>{
  const v={m:general?read('m'):1,p:general?read('p'):1,n:read('n'),q:read('q')},c=coefficientResult(d,v,general);
  $('#checks').innerHTML='';$('#coefficient-answer').innerHTML='';feedback('');
  if(general){$('#first-product').innerHTML=Number.isInteger(v.m)&&Number.isInteger(v.p)?mark(v.m*v.p,d.a,`(${v.m})(${v.p})`):'';$('#cross-one').innerHTML='';$('#cross-two').innerHTML='';}
  $('#last-product').innerHTML=general&&Number.isInteger(v.n)&&Number.isInteger(v.q)?mark(v.n*v.q,d.c,`(${v.n})(${v.q})`):'';
  if(!c){render();return;}
  if(general){
   $('#cross-one').innerHTML=math(mt(mono(c.crossA,mulM(d.X,d.Z).p)));
   $('#cross-two').innerHTML=math(mt(mono(c.crossB,mulM(d.X,d.Z).p)));
   $('#checks').innerHTML=`<div class="cross-calculations"><p>Productos cruzados</p>${formula(`(${mt(mono(v.m,d.X.p))})(${mt(mono(v.q,d.Z.p))})=${mt(mono(c.crossA,mulM(d.X,d.Z).p))}`)}${formula(`(${mt(mono(v.p,d.X.p))})(${mt(mono(v.n,d.Z.p))})=${mt(mono(c.crossB,mulM(d.X,d.Z).p))}`)}</div><p>Suma de los coeficientes cruzados</p>${mark(c.sum,d.b,tex([mono(c.crossA),mono(c.crossB)]))}`;
  }else $('#checks').innerHTML=`<div><p>Producto</p>${mark(c.last,d.c,`(${v.n})(${v.q})`)}</div><div><p>Suma</p>${mark(c.sum,d.b,tex([mono(v.n),mono(v.q)]))}</div>`;
  if(c.valid&&eq(expand(c.factors),r.expression)){$('#coefficient-answer').innerHTML=`<p class="good">✓ ¡Correcto!</p>${formula(product(c.factors))}`;}
  else if(c.last===d.c&&(!general||c.first===d.a)&&c.sum!==d.b)feedback('No coincide con el término central.');
  else feedback('Revisa los productos de las columnas.'+(general?' También deben coincidir los productos cruzados.':''));render();
 };
 game.querySelectorAll('input').forEach(el=>el.addEventListener('input',update));
}
function completeUI(){const steps=completionSteps(r);heading('Ordena los pasos');game.insertAdjacentHTML('beforeend','<p>Selecciona las tarjetas en el orden del procedimiento. Se irán colocando debajo de la expresión inicial.</p>');
 game.insertAdjacentHTML('beforeend',`<div class="ordered-procedure" aria-label="Tu procedimiento">${order.map(i=>arrow+formula(steps[i].tex)).join('')}</div>`);
 choices(bank.map(i=>steps[i].tex),(i)=>{order.push(bank[i]);submitted=false;draw();});game.querySelectorAll('.cards button').forEach((b,i)=>b.disabled=order.includes(bank[i]));
 game.insertAdjacentHTML('beforeend',`<div class="actions">${btn('↶ Deshacer último paso','id="order-undo"')}${btn('Entregar orden','id="submit-order"')}</div>`);
 $('#order-undo').disabled=!order.length;$('#order-undo').onclick=()=>{order.pop();submitted=false;draw();};$('#submit-order').disabled=order.length!==4;
 $('#submit-order').onclick=()=>{submitted=true;showSolution();};
 function showSolution(){game.querySelector('.solution')?.remove();const ok=order.every((value,i)=>value===i);feedback(ok?'✓ ¡Correcto!':'Revisa el orden y compáralo con la solución completa.',ok);game.insertAdjacentHTML('beforeend',`<section class="solution"><h3>Solución completa</h3>${formula(tex(r.expression))}${steps.map(step=>`${arrow}<p>${step.text}</p>${formula(step.tex)}`).join('')}</section>`);render();}
 if(submitted)showSolution();
}
function factorCards(terms){const g=common(terms),items=[g,mono(1,g.p),mono(2),mono(g.c+1,g.p),mono(g.c,{...g.p,x:(g.p.x||0)+1})];if(Object.keys(g.p).length){const v=Object.keys(g.p)[0];items.push(mono(1,{[v]:1}));}return items.filter((m,i,a)=>!unit(m)&&a.findIndex(v=>eq([v],[m]))===i);}
function commonUI(){game.innerHTML=`<div class="mode" role="group" aria-label="Actividad">${['factorizar','expandir','transformar','agrupar'].map(m=>btn(m[0].toUpperCase()+m.slice(1),`data-mode="${m}" aria-pressed="${mode===m}"`)).join('')}</div>`;game.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;fresh();});
 if(mode==='agrupar'){groupUI();return;}
 const residual=mode==='factorizar'?r.expression:r.data.inner;
 if(mode==='expandir'){selected=r.data.g;heading('Distribuye el factor a todos los términos');game.insertAdjacentHTML('beforeend',formula(product([[selected],residual])));}
 else if(mode==='transformar'){heading('Transforma esta expresión');game.insertAdjacentHTML('beforeend',`<p>Encuentra el multiplicador que produce este objetivo:</p>${formula(tex(r.expression))}`);}
 else{heading('Encuentra el factor común total');game.insertAdjacentHTML('beforeend','<p>Elige el máximo factor común y recorre todos los términos. También puedes seleccionarlos uno a uno y pulsar Factorizar. Este ejercicio se resuelve en una sola extracción.</p>');}
 game.insertAdjacentHTML('beforeend',`<p id="selected-factor" aria-live="polite">${selected?'Factor seleccionado: '+math(mt(selected)):'Selecciona un factor.'}</p>`);
 sweep(residual,()=>applyCommon(residual));
 if(mode!=='expandir'){const options=mode==='transformar'?[r.data.g,...factorCards(r.expression)].filter((m,i,a)=>a.findIndex(v=>eq([v],[m]))===i):factorCards(residual),opts=shuffle(options);choices(opts.map(mt),(i,b)=>{selected=opts[i];game.querySelectorAll('.cards button').forEach(e=>e.setAttribute('aria-pressed',String(e===b)));$('#selected-factor').innerHTML='Factor seleccionado: '+math(mt(selected));render();});}
 game.insertAdjacentHTML('beforeend',`<div class="actions">${btn(mode==='factorizar'?'Factorizar':'Multiplicar','id="apply"')}${btn('↶ Deshacer selección','id="undo"')}${mode==='factorizar'?btn('No hay un factor común distinto de 1.','id="none"'):''}</div><div id="transformation"></div>`);
 $('#apply').onclick=()=>applyCommon(residual);$('#undo').onclick=()=>{marked.clear();game.querySelectorAll('.term').forEach(b=>b.setAttribute('aria-pressed','false'));feedback('Selección despejada.');};
 if($('#none'))$('#none').onclick=()=>{if(unit(common(residual))){endCommon();$('#transformation').innerHTML='<p class="good">✓ ¡Correcto! No hay un factor común distinto de 1. Este ejercicio terminó; podría servir otro método de factorización.</p>';feedback('');}else feedback('Todavía existe un factor que divide todos los términos.');};
}
function endCommon(){done=true;game.querySelectorAll('.incorrect').forEach(b=>b.classList.remove('incorrect'));game.querySelectorAll('.sweep button,.cards button,#apply,#undo,#none').forEach(b=>b.disabled=true);}
function applyCommon(residual){if(done)return;if(!selected){feedback('Selecciona primero un factor.');return;}if(marked.size!==residual.length){feedback('Selecciona todos los términos antes de transformar.');return;}
 if(mode==='factorizar'){
  const quotients=residual.map(m=>divide(m,selected));if(quotients.some(m=>!m)){game.querySelectorAll('.term').forEach((b,i)=>b.classList.toggle('incorrect',!quotients[i]));feedback('El factor debe dividir a todos los términos. Revisa el término marcado.');return;}
  if(!eq([selected],[common(residual)])){feedback('Ese factor divide la expresión, pero no es el factor común total. Busca el MCD de los coeficientes y la menor potencia común de cada letra.');return;}
  endCommon();$('#transformation').innerHTML=`${arrow}<p>Dividimos cada término entre ${math(mt(selected))}:</p><div class="quotients">${residual.map((m,i)=>formula(`\\frac{${mt(m)}}{${mt(selected)}}=${mt(quotients[i])}`)).join('')}</div>${arrow}${formula(`${tex(r.expression)}=${product([[selected],ordered(quotients)])}`)}<p class="good">✓ ¡Correcto! Ya no hay más factor común que extraer.</p>`;feedback('');render();
 }else{
  const output=residual.map(m=>mulM(m,selected));if(!eq(output,r.expression)){feedback('Ese factor no produce el objetivo. Multiplica todos los términos.');return;}
  endCommon();$('#transformation').innerHTML=`${arrow}<div class="quotients">${residual.map((m,i)=>formula(`(${mt(selected)})(${mt(m)})=${mt(output[i])}`)).join('')}</div>${arrow}${formula(`${product([[selected],residual])}=${tex(ordered(output))}`)}<p class="good">✓ ¡Correcto! El factor multiplica cada término.</p>`;feedback('');render();
 }
}
function sweep(terms,onComplete){game.insertAdjacentHTML('beforeend',`<div class="sweep" aria-label="Términos de la expresión">${terms.map((m,i)=>btn(math((i&&m.c>0?'+':'')+mt(m)),`class="term" data-term="${i}" aria-label="Término ${i+1}: ${mt(m)}" aria-pressed="${marked.has(i)}"`)).join('')}</div>`);const zone=game.querySelector('.sweep');let down=false,moved=false,start=0,first=null;
 const visit=e=>{zone.querySelectorAll('.term').forEach(b=>{const rect=b.getBoundingClientRect();if(!b.disabled&&e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top-25&&e.clientY<=rect.bottom+25){marked.add(Number(b.dataset.term));b.setAttribute('aria-pressed','true');}});};
 zone.onpointerdown=e=>{if(e.button!==0||done)return;down=true;moved=false;start=e.clientX;first={clientX:e.clientX,clientY:e.clientY};zone.setPointerCapture(e.pointerId);};zone.onpointermove=e=>{if(!down)return;if(Math.abs(e.clientX-start)>6)moved=true;if(moved){visit(first);visit(e);const bounds=zone.getBoundingClientRect();if(e.clientX>bounds.right-35)zone.scrollLeft+=12;if(e.clientX<bounds.left+35)zone.scrollLeft-=12;}};
 zone.onpointerup=e=>{if(!down)return;down=false;if(moved){visit(e);if(marked.size===terms.length)onComplete();else feedback('Recorre todos los términos. Puedes seleccionar los que faltan.');}else{const b=[...zone.querySelectorAll('.term')].find(b=>{const a=b.getBoundingClientRect();return !b.disabled&&e.clientX>=a.left&&e.clientX<=a.right;});if(b){const i=Number(b.dataset.term);marked.has(i)?marked.delete(i):marked.add(i);b.setAttribute('aria-pressed',String(marked.has(i)));}}};zone.onpointercancel=()=>{down=false;};zone.querySelectorAll('.term').forEach(b=>b.onclick=e=>{if(e.detail===0&&!b.disabled){const i=Number(b.dataset.term);marked.has(i)?marked.delete(i):marked.add(i);b.setAttribute('aria-pressed',String(marked.has(i)));}});
}
function groupUI(){
 heading(groups?'Factoriza los grupos elegidos':firstGroup.length?'Selecciona el segundo grupo.':'Selecciona el primer grupo.');
 game.insertAdjacentHTML('beforeend',`<div class="group-expression" data-phase="${firstGroup.length?'two':'one'}" aria-label="Expresión original">${r.expression.map((m,i)=>btn(math((i&&m.c>0?'+':'')+mt(m)),`class="group-term ${firstGroup.includes(i)?'group-one':secondGroup.includes(i)?'group-two':''}" data-group-term="${i}" aria-label="Término ${i+1}: ${mt(m)}" aria-pressed="${marked.has(i)}" ${groups||firstGroup.includes(i)?'disabled':''}`)).join('')}</div>`);
 game.querySelectorAll('[data-group-term]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.groupTerm);marked.has(i)?marked.delete(i):marked.add(i);b.setAttribute('aria-pressed',String(marked.has(i)));});
 if(firstGroup.length)game.insertAdjacentHTML('beforeend',`<div class="group-legend"><span class="group-one">Grupo 1</span>${groups?'<span class="group-two">Grupo 2</span>':''}</div>`);
 if(!groups){game.insertAdjacentHTML('beforeend',`<p>${firstGroup.length?'Selecciona todos los términos restantes para el segundo grupo.':'Selecciona al menos dos términos. La expresión permanece completa durante todo el procedimiento.'}</p><div class="actions">${btn(firstGroup.length?'Confirmar segundo grupo':'Confirmar primer grupo','id="confirm-group"')}${btn('↶ Deshacer grupo','id="undo-group"')}</div>`);
  $('#undo-group').onclick=()=>{firstGroup=[];secondGroup=[];marked.clear();draw();};
  $('#confirm-group').onclick=()=>{if(!firstGroup.length){if(marked.size<2||r.expression.length-marked.size<2){feedback('Cada grupo necesita al menos dos términos.');return;}firstGroup=[...marked];marked.clear();draw();}
   else{const rest=r.expression.map((_,i)=>i).filter(i=>!firstGroup.includes(i));if(rest.length!==marked.size||rest.some(i=>!marked.has(i))){feedback('Incluye todos los términos que aún no pertenecen al primer grupo.');return;}const candidate=grouping(r.expression,firstGroup);if(!candidate){feedback('Estos grupos no dejan el mismo paréntesis. Usa Deshacer grupo para elegir otra agrupación.');return;}groups=candidate;secondGroup=rest;marked.clear();draw();}};return;
 }
 game.insertAdjacentHTML('beforeend',`${arrow}<div class="chosen-groups"><div class="group-one"><h4>Grupo 1</h4>${formula(tex(groups.groups[0]))}</div><div class="group-two"><h4>Grupo 2</h4>${formula(tex(groups.groups[1]))}</div></div>`);
 for(let i=0;i<groupStage&&i<2;i++)game.insertAdjacentHTML('beforeend',`${arrow}<div class="group-${i===0?'one':'two'} group-procedure"><p>Extraemos ${math(mt(groups.factors[i]))} del grupo ${i+1}.</p><div class="quotients">${groups.groups[i].map(m=>formula(`\\frac{${mt(m)}}{${mt(groups.factors[i])}}=${mt(divide(m,groups.factors[i]))}`)).join('')}</div>${formula(`${tex(groups.groups[i])}=${product([[groups.factors[i]],groups.inner])}`)}</div>`);
 if(groupStage<2){heading(`Elige el factor común del grupo ${groupStage+1}`);const expected=groups.factors[groupStage],opts=shuffle([expected,mono(expected.c+1,expected.p),mono(expected.c,{...expected.p,x:(expected.p.x||0)+1})].filter(m=>m.c));choices(opts.map(mt),i=>{if(eq([opts[i]],[expected])){groupStage++;draw();}else feedback('Revisa el factor y su signo: debe dejar el mismo paréntesis en ambos grupos.');});return;}
 game.insertAdjacentHTML('beforeend',`${arrow}<div class="combined-groups"><span class="group-one">${math(product([[groups.factors[0]],groups.inner]))}</span><span class="group-two">${math((groups.factors[1].c>0?'+':'')+product([[groups.factors[1]],groups.inner]))}</span></div>`);
 if(groupStage===2){heading('Selecciona el nuevo factor común');const opts=shuffle([groups.inner,[mono(1,{x:1})],groups.factors]);choices(opts.map(a=>'('+tex(a)+')'),i=>{if(eq(opts[i],groups.inner)){groupStage++;draw();}else feedback('El factor común es todo el paréntesis repetido.');});}
 else{game.insertAdjacentHTML('beforeend',`${arrow}<p>Nuevo factor común: ${math('('+tex(groups.inner)+')')}</p>`);finish([groups.inner,groups.factors]);}
}
if(game){$('#new').onclick=fresh;document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{hard=b.dataset.level==='hard';document.querySelectorAll('[data-level]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));fresh();});$('#restart').onclick=reset;fresh();}
 document.querySelectorAll('[data-open-topics]').forEach(b=>b.onclick=()=>{const menu=$('#topics');menu.open=!menu.open;if(menu.open)menu.querySelector('a')?.focus();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#topics')?.open){$('#topics').open=false;$('#topics summary').focus();}});
render();window.addEventListener('load',render);
