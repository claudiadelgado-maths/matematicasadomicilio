import {CASOS,FAMILIAS,generar,crearEstado,responder,siguiente} from './modelo.mjs?v=20261002-problemas1';
import {dibujo} from './figuras.mjs?v=20261002-problemas1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const dialog=$('#formulas');let opener;
function openFormulas(button){opener=button;dialog.showModal();$('#close-formulas').focus();}
$('#close-formulas').onclick=()=>dialog.close();dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
dialog.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const controls=[...dialog.querySelectorAll('button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]')].filter(el=>el.getClientRects().length);
 const first=controls[0],last=controls.at(-1);
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
const formulas=[
 {shape:'rectangulo',geom:{b:8,h:4},labels:{b:'b',h:'h'}},
 {shape:'cuadrado',geom:{b:5,h:5},labels:{b:'l'}},
 {shape:'triangulo',geom:{b:6,L1:5,L2:5},labels:{b:'b',h:'h',L1:'L₁',L2:'L₂'}},
 {shape:'trapecio',geom:{B:12,b:6,h:5,L1:Math.sqrt(34),L2:Math.sqrt(34)},labels:{B:'B',b:'b',h:'h',L1:'L₁',L2:'L₂'}}
];
$$('[data-formula-figure]').forEach((el,i)=>el.innerHTML=dibujo(formulas[i]));
const example=generar('R1',()=>.25);let exampleStep=0;
function renderExample(){
 $('#example-statement').textContent=example.statement+' '+example.question;
 $('#example-drawing').innerHTML=dibujo(example,exampleStep===2,exampleStep===1);
 const titles=['Elige qué representa x','Escribe la relación','Resuelve y responde'];
 $('#example-title').textContent=titles[exampleStep];
 $('#example-text').innerHTML=exampleStep===0?`<p>${example.meaning} Si la base mide el doble, la representamos con <strong>2x</strong>.</p>`:exampleStep===1?`<p>El perímetro suma las cuatro orillas: <strong>${example.equation}</strong>.</p><p>Hay dos alturas y dos bases: 2x + 4x = 6x.</p>`:`<ol>${example.steps.map(t=>`<li>${t}</li>`).join('')}</ol><p>¡Ojo! x es la altura; la pregunta pide el área.</p>`;
 $$('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.step)===exampleStep)));
}
$$('[data-step]').forEach(b=>b.onclick=()=>{exampleStep=Number(b.dataset.step);renderExample();});
const s=crearEstado();let timer;
function render(focus=false){
 clearTimeout(timer);const q=s.q,host=$('#exercise-host');
 const options=Object.entries(FAMILIAS).map(([key,name])=>`<optgroup label="${name}"><option value="${key}">${name} · Variados</option>${CASOS.filter(c=>c.familia===key).map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('')}</optgroup>`).join('');
 host.innerHTML=`<div class="toolbar"><label for="case-filter">Quiero practicar<select id="case-filter"><option value="todos">Todas las figuras</option>${options}</select></label><div class="actions"><button type="button" class="lab-button" id="show-formulas">Ver fórmulas</button><button type="button" class="lab-button" data-new>Nuevo problema ↻</button></div></div><div class="stats"><span data-round></span><span data-score></span></div><progress max="4" value="0" aria-label="Aciertos de la ronda"></progress><div class="two-columns"><div><div class="drawing" data-drawing>${dibujo(q)}</div><p class="figure-note">Medidas en ${q.unit}. Las marcas iguales indican lados iguales.</p><p class="relation-key">${q.meaning}</p></div><div><p class="exercise-case">${FAMILIAS[q.familia]} · ${q.nombre}</p><p class="statement">${q.statement}</p><h3 tabindex="-1">${q.question}</h3><form><label for="answer">Tu respuesta</label><div class="answer-row"><span class="answer-box"><input id="answer" type="text" inputmode="numeric" autocomplete="off" maxlength="6" aria-describedby="answer-help feedback"></span><span>${q.answerUnit}</span></div><p class="small" id="answer-help">Escribe solo el número. Puedes hacer tus cuentas en papel.</p><button type="submit" class="lab-button primary">Comprobar</button></form><div class="hint-area"><button type="button" class="lab-button" data-hint aria-controls="hints">Dame una pista</button><ol id="hints" aria-live="polite"></ol></div><div class="feedback" id="feedback" role="status" aria-live="polite" aria-atomic="true"></div><div class="solution" hidden><h4>Así se plantea y se resuelve</h4><ol></ol></div><button type="button" class="lab-button primary" data-next disabled>Siguiente reto →</button></div></div>`;
 const input=$('#answer'),feedback=$('#feedback'),box=host.querySelector('.answer-box');
 const stats=()=>{const n=s.completo&&s.resueltos%4===0?4:s.resueltos%4;host.querySelector('progress').value=n;host.querySelector('[data-round]').textContent=`Ronda ${Math.floor(Math.max(0,s.resueltos-(s.completo?1:0))/4)+1} · ${n}/4 aciertos${n===4?' · ¡Completada! ✦':''}`;host.querySelector('[data-score]').textContent=`${s.resueltos} resueltos · ${s.primerIntento} al primer intento`;};
 input.oninput=()=>{if(s.completo)return;box.classList.remove('wrong');input.removeAttribute('aria-invalid');feedback.textContent='';feedback.removeAttribute('data-kind');};
 $('#show-formulas').onclick=e=>openFormulas(e.currentTarget);
 host.querySelector('[data-hint]').onclick=e=>{if(s.ayudas>=q.hints.length)return;const li=document.createElement('li');li.textContent=q.hints[s.ayudas++];$('#hints').append(li);host.querySelector('[data-drawing]').innerHTML=dibujo(q,s.completo,true);e.currentTarget.textContent=s.ayudas===q.hints.length?'Ya tienes todas las pistas':`Otra pista (${s.ayudas}/${q.hints.length})`;e.currentTarget.disabled=s.ayudas===q.hints.length;};
 host.querySelector('form').onsubmit=e=>{e.preventDefault();const result=responder(s,input.value);if(result==='bloqueada')return;clearTimeout(timer);feedback.dataset.kind=result;feedback.textContent=result==='correcta'?`✓ ¡Correcto! La respuesta es ${q.answer} ${q.answerUnit}.`:result==='invalida'?'Escribe un número entero para comprobar.':'Todavía no. Revisa qué pide la pregunta y prueba otra vez. Las pistas te pueden ayudar.';box.classList.toggle('correct',s.completo);box.classList.toggle('wrong',result==='error');input.setAttribute('aria-invalid',String(!s.completo));if(result==='error'){const mark=document.createElement('span');mark.className='error-mark';mark.textContent='×';mark.setAttribute('aria-hidden','true');feedback.prepend(mark);timer=setTimeout(()=>mark.remove(),1100);}if(s.completo){input.readOnly=true;host.querySelector('[type="submit"]').disabled=true;host.querySelector('[data-next]').disabled=false;host.querySelector('[data-drawing]').innerHTML=dibujo(q,true);host.querySelector('.solution').hidden=false;host.querySelector('.solution ol').innerHTML=q.steps.map(t=>`<li>${t}</li>`).join('');}stats();};
 const next=()=>{siguiente(s);render(true);};host.querySelector('[data-new]').onclick=next;host.querySelector('[data-next]').onclick=()=>{if(s.completo)next();};
 $('#case-filter').value=s.filtro;$('#case-filter').onchange=e=>{s.filtro=e.target.value;siguiente(s);render();$('#case-filter').focus({preventScroll:true});};stats();if(focus)host.querySelector('h3').focus({preventScroll:true});
}
renderExample();render();
