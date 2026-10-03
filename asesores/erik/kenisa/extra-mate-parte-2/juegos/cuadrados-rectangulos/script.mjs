import {crearEstado,responder,siguiente} from './modelo.mjs?v=20261002-rectangulos1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const states={medidas:crearEstado('medidas'),diagonal:crearEstado('diagonal')};
const timers=new Map();let shape='cuadrado',view='P';
const exact=n=>Number.isInteger(Math.sqrt(n))?String(Math.sqrt(n)):`√${n}`;
function drawing(q,solved=false,grid=false){
 const scale=Math.min(310/q.a,210/q.b),w=q.a*scale,h=q.b*scale,x=(520-w)/2,y=(320-h)/2;
 const perimeter=`M${x} ${y} H${x+w} V${y+h} H${x} Z`;
 let body=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${q.goal==='A'?'#daefe9':'#f1f0fa'}" stroke="#18776c" stroke-width="3"/>`;
 if(q.goal==='P')body+=`<path class="perimeter" pathLength="1" d="${perimeter}" fill="none" stroke="#a15c19" stroke-width="5"/>`;
 if(grid&&q.goal==='A'){for(let i=1;i<q.a;i++)body+=`<path d="M${x+i*scale} ${y} v${h}" stroke="#87bcb0"/>`;for(let i=1;i<q.b;i++)body+=`<path d="M${x} ${y+i*scale} h${w}" stroke="#87bcb0"/>`;}
 const corner=Math.min(15,w/4,h/4);body+=`<path d="M${x+w-corner} ${y+h} v${-corner} h${corner}" fill="none" stroke="#7855a1" stroke-width="2"/>`;
 if(q.figura==='cuadrado')body+=`<path d="M${x+w/2} ${y-6} v12 M${x+w/2} ${y+h-6} v12 M${x-6} ${y+h/2} h12 M${x+w-6} ${y+h/2} h12" stroke="#7855a1" stroke-width="3"/>`;
 if(q.goal==='D')body+=`<path d="M${x} ${y+h} L${x+w} ${y} L${x+w} ${y+h} Z" fill="#d9efe9" opacity=".7"/><path d="M${x} ${y+h} L${x+w} ${y}" stroke="#a15c19" stroke-width="4"/><text text-anchor="middle" x="260" y="${y+h/2-18}">d = ${solved?exact(q.a*q.a+q.b*q.b):'?'}</text>`;
 body+=`<text text-anchor="middle" x="260" y="${y+h+35}">${q.a} ${q.unit}</text>`;
 if(q.figura==='rectangulo')body+=`<text text-anchor="start" x="${x+w+13}" y="${y+h/2+7}">${q.b} ${q.unit}</text>`;
 if(solved&&q.goal!=='D')body+=`<text text-anchor="middle" x="260" y="365">${q.goal} = ${q.goal==='P'?2*(q.a+q.b):q.a*q.b} ${q.unit}${q.goal==='A'?'²':''}</text>`;
 return `<svg viewBox="0 0 520 390" role="img" aria-label="${q.figura==='cuadrado'?`Cuadrado de lado ${q.a}`:`Rectángulo de base ${q.a} y altura ${q.b}`} ${q.unit}.${q.goal==='D'?' Diagonal entre vértices opuestos.':''}">${body}</svg>`;
}
function renderLab(){
 const a=Number($('#side-a').value),b=shape==='cuadrado'?a:Number($('#side-b').value);
 $('#side-b-control').hidden=shape==='cuadrado';$('#side-a-value').textContent=`${a} cm`;$('#side-b-value').textContent=`${b} cm`;
 $('#lab-property').textContent=shape==='cuadrado'?'Un lado basta: los cuatro son iguales.':'Conoce dos lados vecinos: la base y la altura.';
 $('#lab-formula').textContent=view==='P'?(shape==='cuadrado'?'P = 4 × lado':'P = 2 × (base + altura)'):(shape==='cuadrado'?'A = lado²':'A = base × altura');
 $('#lab-result').textContent=view==='P'?`P = ${a} + ${b} + ${a} + ${b} = ${2*(a+b)} cm`:`A = ${a} × ${b} = ${a*b} cm²`;
 $('#lab-drawing').innerHTML=drawing({a,b,figura:shape,goal:view,unit:'cm'},false,true);
 $$('[data-shape]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shape===shape)));$$('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
}
$$('[data-shape]').forEach(b=>b.onclick=()=>{shape=b.dataset.shape;renderLab();});$$('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;renderLab();});
$('#side-a').oninput=renderLab;$('#side-b').oninput=renderLab;
function demo(mode){const a=mode==='entero'?3:1,b=mode==='entero'?4:1,n=a*a+b*b;$('#diagonal-demo').innerHTML=drawing({a,b,figura:mode==='entero'?'rectangulo':'cuadrado',goal:'D',unit:'cm'},true);$('#diagonal-steps').innerHTML=[`Los catetos miden ${a} cm y ${b} cm.`,`d² = ${a}² + ${b}² = ${n}.`,`d = √${n}${mode==='entero'?' = 5':''} cm.`].map(t=>`<li>${t}</li>`).join('');$$('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demo===mode)));}
$$('[data-demo]').forEach(b=>b.onclick=()=>demo(b.dataset.demo));
function renderGame(key,focus=false){
 const s=states[key],q=s.q,host=$(`[data-game="${key}"] .exercise-host`),diag=key==='diagonal';clearTimeout(timers.get(key));
 host.innerHTML=`<div class="toolbar"><label for="${key}-shape">Figura<select id="${key}-shape" data-shape-filter><option value="mixto">Ambas figuras</option><option value="cuadrado">Cuadrados</option><option value="rectangulo">Rectángulos</option></select></label>${diag?'':`<label for="${key}-goal">Quiero calcular<select id="${key}-goal" data-goal-filter><option value="mixto">Área y perímetro</option><option value="A">Área</option><option value="P">Perímetro</option></select></label>`}<button type="button" class="lab-button" data-new>Nuevo ejercicio ↻</button></div><div class="stats"><span data-round></span><span data-score></span></div><progress max="4" value="0" aria-label="Aciertos de la ronda"></progress><div class="two-columns"><div class="drawing" data-drawing>${drawing(q)}</div><div><h3 tabindex="-1">${q.pregunta}</h3><form><label for="${key}-answer" data-answer-label>Tu respuesta</label>${diag?'<div class="actions"><button type="button" class="lab-button" data-root aria-pressed="false">√ Raíz</button><span class="small">Pulsa para activar o quitar la raíz.</span></div>':''}<div class="answer-row"><span class="answer-box"><span class="radical-sign" aria-hidden="true" hidden>√</span><input id="${key}-answer" type="text" inputmode="numeric" autocomplete="off" maxlength="7" aria-describedby="${key}-help ${key}-feedback"></span><span>${q.unit}${q.goal==='A'?'²':''}</span></div><p id="${key}-help" class="small">${diag?'Puedes responder con un entero o una raíz equivalente. Para √2, activa la raíz y escribe 2.':'Escribe el número; las unidades ya aparecen junto al campo.'}</p><button type="submit" class="lab-button primary">Comprobar</button></form><details><summary>Necesito una pista</summary><p>${q.pista}</p></details><div class="feedback" id="${key}-feedback" role="status" aria-live="polite" aria-atomic="true"></div><button type="button" class="lab-button primary" data-next disabled>Siguiente reto →</button></div></div>`;
 const input=host.querySelector('input'),box=host.querySelector('.answer-box'),feedback=host.querySelector('.feedback');
 const stats=()=>{const n=s.completo&&s.resueltos%4===0?4:s.resueltos%4;host.querySelector('progress').value=n;host.querySelector('[data-round]').textContent=`Ronda ${Math.floor(Math.max(0,s.resueltos-(s.completo?1:0))/4)+1} · ${n}/4 aciertos${n===4?' · ¡Completada! ✦':''}`;host.querySelector('[data-score]').textContent=`${s.resueltos} resueltos · ${s.primerIntento} al primer intento`;};
 const clear=()=>{box.classList.remove('wrong');input.removeAttribute('aria-invalid');feedback.textContent='';feedback.removeAttribute('data-kind');};
 function toggleRoot(){if(s.completo)return;s.raiz=!s.raiz;box.classList.toggle('radical',s.raiz);host.querySelector('.radical-sign').hidden=!s.raiz;host.querySelector('[data-root]').setAttribute('aria-pressed',String(s.raiz));host.querySelector('[data-answer-label]').textContent=s.raiz?'Número dentro de la raíz':'Tu respuesta';clear();input.focus({preventScroll:true});}
 host.querySelector('[data-root]')?.addEventListener('click',toggleRoot);input.oninput=clear;
 host.querySelector('form').onsubmit=e=>{e.preventDefault();const result=responder(s,input.value);if(result==='bloqueada')return;clearTimeout(timers.get(key));feedback.dataset.kind=result;feedback.textContent=result==='correcta'?`✓ ¡Correcto! ${q.explicacion}`:result==='invalida'?'Escribe un número entero; si necesitas una raíz, usa el botón √.':`Todavía no. ${q.pista} Revisa también si activaste la raíz.`;box.classList.toggle('correct',s.completo);box.classList.toggle('wrong',result==='error');input.setAttribute('aria-invalid',String(result!=='correcta'));if(result==='error'){const mark=document.createElement('span');mark.className='error-mark';mark.textContent='×';mark.setAttribute('aria-hidden','true');feedback.prepend(mark);timers.set(key,setTimeout(()=>mark.remove(),1100));}if(s.completo){input.readOnly=true;host.querySelector('[type="submit"]').disabled=true;if(diag)host.querySelector('[data-root]').disabled=true;host.querySelector('[data-next]').disabled=false;host.querySelector('[data-drawing]').innerHTML=drawing(q,true);}stats();};
 const next=()=>{siguiente(s);renderGame(key,true);};host.querySelector('[data-new]').onclick=next;host.querySelector('[data-next]').onclick=()=>{if(s.completo)next();};
 const shapeSelect=host.querySelector('[data-shape-filter]');shapeSelect.value=s.figura;shapeSelect.onchange=()=>{s.figura=shapeSelect.value;siguiente(s);renderGame(key);$(`#${key}-shape`).focus({preventScroll:true});};
 const goalSelect=host.querySelector('[data-goal-filter]');if(goalSelect){goalSelect.value=s.objetivo;goalSelect.onchange=()=>{s.objetivo=goalSelect.value;siguiente(s);renderGame(key);$(`#${key}-goal`).focus({preventScroll:true});};}
 stats();if(focus)host.querySelector('h3').focus({preventScroll:true});
}
renderLab();demo('entero');renderGame('medidas');renderGame('diagonal');
