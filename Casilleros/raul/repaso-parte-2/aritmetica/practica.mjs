import {categories,levels,generate,reference} from './generador.mjs';
import {math,N,chain,escape} from '../recursos/matematicas.mjs';
const $=s=>document.querySelector(s);let current=null,answered=false,correct=0,attempts=0,streak=0,timer=null,last='';
const clear=()=>{clearTimeout(timer);timer=null;};
$('#category').innerHTML=Object.entries(categories).map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
$('#table').innerHTML='<option value="all">Todas aleatorias</option>'+Array.from({length:9},(_,i)=>`<option value="${i+2}">Tabla del ${i+2}</option>`).join('');
$('#category').addEventListener('change',()=>$('#table-control').hidden=$('#category').value!=='tables');
$('#reference-content').innerHTML=reference.map(r=>`<section><h3>${r.name}</h3><div class="reference-math">${chain([r.expression,...(r.intermediate?[r.intermediate]:[]),...(r.result?[r.result]:[])])}</div><p>${r.note}</p></section>`).join('');
$('#formulario').addEventListener('toggle',()=>{if($('#formulario').open)clear();});
function counters(){$('#counters').textContent=`Aciertos: ${correct} · Intentos: ${attempts} · Racha: ${streak}`;}
function next(){clear();const level=$('input[name="level"]:checked').value;for(let i=0;i<10;i++){current=generate($('#category').value,level,$('#table').value);if(current.id!==last)break;}last=current.id;answered=false;
  $('#question-meta').textContent=`${categories[current.category]} · ${levels[level]}`;$('#question-title').textContent=current.prompt;
  $('#values').innerHTML=current.values?Object.entries(current.values).map(([v,n])=>`${v} = ${math(N(n))}`).join(' · '):'';$('#values').hidden=!current.values;
  $('#expression').innerHTML=math(current.expression);$('#answers').innerHTML=current.options.map((o,i)=>`<button type="button" data-option="${i}" aria-label="Respuesta ${i+1}${o.label?': '+escape(o.label):''}"><span class="option-key" aria-hidden="true">${i+1}</span>${o.label?escape(o.label):math(o.expression)}</button>`).join('');
  $('#feedback').textContent='';$('#feedback').className='feedback';$('#show-solution').hidden=true;$('#solution').hidden=true;$('#solution').innerHTML='';$('#question-title').focus({preventScroll:true});counters();
}
$('#settings').addEventListener('submit',e=>{e.preventDefault();clear();correct=attempts=streak=0;$('#setup').hidden=true;$('#practice').hidden=false;next();$('#practice').scrollIntoView({block:'start'});});
function answer(i){if(answered||!current)return;answered=true;attempts++;const ok=current.options[i].correct;if(ok){correct++;streak++;}else streak=0;counters();$('#feedback').textContent=ok?'✓ Correcto':'Esa no es la respuesta.';$('#feedback').className=`feedback ${ok?'correct':'incorrect'}`;
  document.querySelectorAll('[data-option]').forEach((b,j)=>{b.disabled=true;if(i===j)b.classList.add(ok?'chosen-correct':'chosen-wrong');});$('#show-solution').hidden=ok;
  if(ok&&$('#auto-next').checked&&!$('#formulario').open)timer=setTimeout(next,850);
}
$('#answers').addEventListener('click',e=>{const b=e.target.closest('[data-option]');if(b)answer(Number(b.dataset.option));});
$('#show-solution').addEventListener('click',()=>{clear();$('#solution').hidden=false;$('#solution').innerHTML=`<div class="solution-math">${current.values?math(current.expression)+'<span> = </span>'+math(current.expression,current.values)+'<span> = </span>'+math(current.solution.at(-1)):chain(current.solution)}</div>${current.note?`<p>${current.note}</p>`:''}`;});
$('#next').addEventListener('click',next);$('#auto-next').addEventListener('change',clear);
$('#change').addEventListener('click',()=>{clear();$('#practice').hidden=true;$('#setup').hidden=false;$('#setup-title').focus();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
document.addEventListener('keydown',e=>{if($('#practice').hidden||e.target.closest('input,select,textarea,summary')||e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;if(/^[1-4]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}else if(e.key==='Enter'&&!e.target.closest('button,a')){e.preventDefault();next();}});
