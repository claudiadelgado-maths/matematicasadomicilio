import {generate,initial,layout,equation,equationTex,transition,check,solved} from './motor.mjs';
import {positions,animateChanges} from './animaciones.mjs';
const $=s=>document.querySelector(s),board=$('#equation-board');
let state=generate(),selected=[],history=[],busy=false,verified=false,counted=false,count=0;
const names={coefficient:'Coeficiente',variable:'Variable',constant:'Constante',numerator:'Numerador',denominator:'Denominador',multiplier:'Factor',result:'Resultado'};
function renderMath(){const el=$('#math-view');el.textContent=equationTex(state);if(window.katex)window.katex.render(equationTex(state),el,{throwOnError:false,displayMode:true});}
window.addEventListener('load',renderMath);
const fraction=(top,bottom)=>`<div class="interactive-fraction" aria-label="Fracción"><span>${top}</span><span>${bottom}</span></div>`;
function feedback(el,text,status='neutral'){
 el.replaceChildren();el.classList.toggle('success',status==='success');el.classList.toggle('error',status==='error');
 if(text&&status!=='neutral'){const icon=document.createElement('span');icon.className=`feedback-icon ${status}`;icon.setAttribute('aria-hidden','true');icon.textContent=status==='success'?'👍':'!';el.append(icon);}
 el.append(document.createTextNode(text));
}
function message(text,status='neutral'){feedback($('#feedback'),text,status===true?'success':status);}
function token(b,label){const sign=b.n<0?'−':'+';const text=label??(b.type==='x'?'x':b.n===0?'0':`<span class="card-sign">${sign}</span>${b.d===1?Math.abs(b.n):fraction(Math.abs(b.n),b.d)}`);return `<button type="button" class="factor-token ${b.type==='x'?'variable':b.n===0?'zero-token':b.n<0?'negative-token':'positive-token'}" data-block="${b.id}" aria-label="${b.type==='x'?'Variable x':`Número ${b.n}${b.d!==1?'/'+b.d:''}`}" aria-pressed="false">${text}</button>`;}
function expression(e,additive=false){
 if(e.type==='x')return token(e,(e.sign===-1?'<span class="card-sign">−</span>':additive?'<span class="card-sign">+</span>':'')+'x');
 if(e.type==='num'){if(['unit','zero','sign'].includes(e.id))return `<span class="factor-token neutral-token ${e.n===0?'zero-token':'positive-token'}" aria-label="${e.n===0?'Cero':'Uno'}">${e.n===0?'0':e.n>0?'+'+e.n:e.n}</span>`;return token(e);}
 if(e.type==='sum')return `<span class="sum-group">${e.terms.map(t=>`<span class="sum-term">${expression(t,true)}</span>`).join('')}</span>`;
 const product=(xs,additive=false)=>xs.map((t,i)=>{const next=xs[i+1];if(t.type==='num'&&t.d===1&&Math.abs(t.n)===1&&next?.type==='x')return t.n<0?token(t,'<span class="card-sign">−</span>'):'';const html=expression(t,additive&&i===0),wrapped=t.type==='sum';return `${i&&t.type!=='x'?'<span class="times">·</span>':''}${wrapped?'<span class="parenthesis">(</span>':''}${html}${wrapped?'<span class="parenthesis">)</span>':''}`;}).join('')||'1';
 const group=(items,add=false)=>{const joined=items.length===2&&items.some(t=>t.type==='num')&&items.some(t=>t.type==='x');const ordered=joined?[items.find(t=>t.type==='num'),items.find(t=>t.type==='x')]:items;const html=product(ordered,add);return joined?`<span class="joined-term">${html}</span>`:html;};const top=group(e.top,additive);return `<span class="coefficient-group">${e.bottom.length?fraction(top,group(e.bottom)):top}</span>`;
}
function controls(){document.querySelectorAll('[data-action],#undo,#reset,[data-block],#new-equation,#check-answer,#answer').forEach(el=>el.disabled=busy||(el.id==='undo'&&!history.length));board.setAttribute('aria-busy',String(busy));}
function draw(){
 const {left,right}=layout(state);
 $('#left-side').innerHTML=expression(left);$('#right-side').innerHTML=expression(right);
 $('#equation-text').textContent=equation(state);
 $('#step-label').textContent=solved(state)?'La x está sola':'Explora: transforma, combina o cambia el orden';
 renderMath();
 $('#domain-note').hidden=!state.nonzeroX;
 $('#final-question').hidden=!solved(state);
 $('#new-equation').hidden=!verified;
 $('#answer').value='';$('#answer').removeAttribute('aria-invalid');$('#answer-feedback').textContent='';
 selected=[];controls();
 board.querySelectorAll('[data-block]').forEach(el=>el.addEventListener('click',()=>{
  if(busy)return;const id=el.dataset.block;
  if(selected.includes(id))selected=selected.filter(x=>x!==id);else selected=selected.length<2?[...selected,id]:[id];
  board.querySelectorAll('[data-block]').forEach(b=>{const active=selected.includes(b.dataset.block);b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  message(selected.length===2?'Dos bloques seleccionados. Elige una operación.':selected.length?'Ahora elige una operación.':'Selecciona un término.');
 }));
}
async function apply(action){
 if(busy)return;const result=transition(state,selected,action);
 if(!result.ok){message(result.message,'error');return;}
 const before=positions(board);history.push({...state});state=result.state;verified=false;busy=true;draw();message('');
 try{await animateChanges(board,before,result);}finally{busy=false;controls();message(result.message,true);if(solved(state))$('#answer').focus({preventScroll:true});else board.querySelector('[data-block]')?.focus({preventScroll:true});}
}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.action)));
$('#undo').onclick=()=>{if(busy||!history.length)return;state=history.pop();verified=false;draw();message('Volviste un paso.');$('#undo').disabled?board.querySelector('[data-block]').focus():$('#undo').focus();};
$('#reset').onclick=()=>{if(busy)return;state=initial(state);history=[];verified=false;draw();message('La misma ecuación, desde el inicio.');};
$('#answer-form').onsubmit=e=>{e.preventDefault();if(busy)return;const valid=check(state,$('#answer').value);feedback($('#answer-feedback'),valid?'¡Correcto!':'Todavía no. Revisa tu despeje e inténtalo otra vez.',valid?'success':'error');$('#answer').setAttribute('aria-invalid',String(!valid));if(valid){if(!counted){count++;counted=true;}verified=true;$('#completed').textContent=String(count);$('#new-equation').hidden=false;$('#new-equation').focus();}};
$('#new-equation').onclick=()=>{if(busy||!verified)return;state=generate();history=[];verified=false;counted=false;draw();message('Selecciona un término.');board.querySelector('[data-block]').focus();};
draw();message('Selecciona un término.');

