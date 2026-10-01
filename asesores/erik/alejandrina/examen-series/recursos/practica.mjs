import {ACTIVIDADES} from './actividades.mjs?v=20260930-series2';
import {generar,barajar} from './modelo.mjs?v=20260930-series2';
import {EJERCICIOS} from './banco-ejercicios.mjs?v=20260930-series2';
import {PROBLEMAS} from './banco-problemas.mjs?v=20260930-series2';
import {tex,acepta} from './fracciones.mjs?v=20260930-series2';
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labelTexto=t=>t.replace(/\\text\{([^}]+)\}/g,'$1').replace(/[_{}\\]/g,' ');
export function math(t){return `<span data-math="${esc(t)}">${esc(t)}</span>`;}
export function renderMath(root=document){root.querySelectorAll('[data-math]').forEach(el=>{if(window.katex)window.katex.render(el.dataset.math,el,{throwOnError:false,strict:'error'});else el.textContent=el.dataset.math;});}
const root=document.querySelector('[data-actividad]');
if(root) iniciar();
function iniciar(){
  const config=ACTIVIDADES.find(a=>a.id===root.dataset.actividad);if(!config)return;
  const states=new Map(),decks=new Map(),fixed=config.banco==='ejercicios'?EJERCICIOS:config.banco==='problemas'?PROBLEMAS:null;let filter='ambas';
  const deck=()=>{if(!decks.has(filter))decks.set(filter,barajar(fixed.filter(q=>filter==='ambas'||q.tipo===filter)));return decks.get(filter);};
  const fresh=(caso,indice=0)=>({indice,resueltos:0,primerIntento:0,errores:0,completo:false,finalizado:false,values:{},valid:{},q:fixed?deck()[indice]:generar(config.id,caso,filter,indice)});
  const get=caso=>{const key=`${caso}:${filter}`;if(!states.has(key))states.set(key,fresh(caso));return states.get(key);};
  function progress(section,s){section.querySelector('.case-progress').textContent=`${fixed?`Pregunta ${Math.min(s.indice+1,deck().length)} de ${deck().length}`:`Ejercicio ${s.indice+1}`} · ${s.resueltos} resueltos · ${s.primerIntento} al primer intento`;}
  function finish(section,s){if(!s.completo){s.completo=true;s.resueltos++;if(!s.errores)s.primerIntento++;}progress(section,s);const next=section.querySelector('[data-next]');if(next)next.disabled=false;}
  function feedback(el,ok,text){el.dataset.kind=ok?'correct':'wrong';el.textContent=text||(ok?'✓ Correcto.':'✕ Incorrecto. Intenta de nuevo.');}
  function render(section){
    const s=get(section.dataset.caso),q=s.q;progress(section,s);
    const host=section.querySelector('.problem');
    if(s.finalizado){host.innerHTML=`<div class="exam-result"><p class="eyebrow">Ronda completada</p><h3>¡Terminaste el mini examen!</h3><p>${s.resueltos} de ${deck().length} ejercicios resueltos. ${s.primerIntento} al primer intento.</p><button type="button" class="button primary" data-repeat>Repetir en otro orden</button><p>Los ejercicios conservan sus mismos datos.</p></div>`;host.querySelector('[data-repeat]').addEventListener('click',()=>{decks.delete(filter);states.delete(`${section.dataset.caso}:${filter}`);render(section);section.querySelector('h2').focus({preventScroll:true});});return;}
    host.innerHTML=`${q.opciones?'':`<span class="type-badge">Sucesión ${q.tipo==='aritmetica'?'aritmética':'geométrica'}</span>`}<p class="question">${esc(q.enunciado)}</p>${q.secuencia?`<div class="sequence">${q.secuencia.map(v=>math(tex(v))).join('<span class="comma">,</span>')}<span>, …</span></div>`:''}${q.datos?.length?`<div class="given-data">${q.datos.map(math).join('')}</div>`:''}${q.formulas?.length?`<div class="formulas" aria-label="Fórmulas disponibles">${q.formulas.map(math).join('')}</div>`:''}${q.opciones?`<div class="answer-options">${q.opciones.map(o=>`<button type="button" class="button" data-answer="${o.id}">${o.texto}</button>`).join('')}</div>`:`<p class="input-help" id="${section.id}-help">Escribe un número o una fracción, como −3/4. Confirma con Enter o Comprobar.</p><div class="steps">${q.pasos.map((p,i)=>`<form class="answer-step" data-step="${p.id}" novalidate><label for="${section.id}-${p.id}">${math(p.label)} <span>=</span></label><input id="${section.id}-${p.id}" name="respuesta" type="text" autocomplete="off" spellcheck="false" maxlength="60" aria-label="Respuesta ${esc(labelTexto(p.label))}" aria-describedby="${section.id}-help ${section.id}-${p.id}-feedback" value="${esc(s.values[p.id]??'')}"${q.secuencial&&i>0&&!s.valid[q.pasos[i-1].id]?' disabled':''}><button class="button" type="submit">Comprobar</button><p id="${section.id}-${p.id}-feedback" class="feedback step-feedback" role="status" aria-live="polite"></p></form>`).join('')}</div>`}<p class="feedback main-feedback" role="status" aria-live="polite">${s.completo?'✓ Ejercicio completo.':''}</p><div class="actions"><button type="button" class="button primary" data-next>Otro ejercicio →</button></div>`;
    if(config.banco==='problemas')host.querySelector('.type-badge')?.remove();
    if(q.medios){
      const track=host.querySelector('.steps');track.classList.add('means-track');track.setAttribute('aria-label','Sucesión: extremo inicial, medios a completar y extremo final');
      track.querySelectorAll('form').forEach((form,i)=>{form.classList.add('means-cell');form.querySelector('input').setAttribute('aria-label',`Medio ${i+1} de ${q.medios.k}`);});
      track.insertAdjacentHTML('afterbegin',`<div class="mean-end"><span>Extremo a</span>${math(tex(q.medios.inicio))}</div>`);
      track.insertAdjacentHTML('beforeend',`<div class="mean-end"><span>Extremo b</span>${math(tex(q.medios.fin))}</div>`);
      host.querySelector('.actions').insertAdjacentHTML('afterbegin','<button type="button" class="button" data-check-all>Comprobar casillas</button>');
    }
    const nextButton=host.querySelector('[data-next]');
    if(fixed){nextButton.disabled=!s.completo;nextButton.textContent=s.indice===deck().length-1?'Terminar mini examen':'Siguiente ejercicio →';}
    if(q.opciones){
      host.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=s.completo;if(s.completo&&b.dataset.answer===q.respuesta)b.classList.add('correct');b.addEventListener('click',()=>{
        if(s.completo)return;const ok=b.dataset.answer===q.respuesta;if(ok){finish(section,s);host.querySelectorAll('[data-answer]').forEach(button=>button.disabled=true);}else s.errores++;
        b.classList.add(ok?'correct':'wrong');feedback(host.querySelector('.main-feedback'),ok);
      });});
    }else{
      const forms=[...host.querySelectorAll('[data-step]')],checks=[];
      const sync=()=>forms.forEach((form,i)=>{
        const p=q.pasos[i],input=form.querySelector('input'),locked=q.secuencial&&i>0&&!s.valid[q.pasos[i-1].id];
        input.disabled=!!locked;input.readOnly=!!s.valid[p.id];form.querySelector('button').disabled=!!locked||!!s.valid[p.id];
        if(s.valid[p.id]!==undefined){
          const ok=s.valid[p.id];input.classList.toggle('correct',ok);input.classList.toggle('wrong',!ok);
          input.setAttribute('aria-invalid',String(!ok));feedback(form.querySelector('.feedback'),ok);
        }
      });
      forms.forEach((form,i)=>{
        const p=q.pasos[i],input=form.querySelector('input');
        function check(){if(input.disabled||s.valid[p.id])return;const raw=input.value.trim();if(!raw){feedback(form.querySelector('.feedback'),false,'Escribe una respuesta.');return;}
          const ok=acepta(p.respuesta,raw);s.values[p.id]=raw;s.valid[p.id]=ok;input.classList.toggle('correct',ok);input.classList.toggle('wrong',!ok);input.setAttribute('aria-invalid',String(!ok));feedback(form.querySelector('.feedback'),ok);
          if(!ok)s.errores++;sync();if(q.pasos.every(p=>s.valid[p.id])){finish(section,s);feedback(host.querySelector('.main-feedback'),true,'✓ Ejercicio completo.');}
        }
        checks.push(check);
        form.addEventListener('submit',e=>{e.preventDefault();check();if(s.valid[p.id]){const next=forms[i+1]?.querySelector('input');if(next&&!next.disabled)next.focus({preventScroll:true});}});
        input.addEventListener('input',()=>{s.values[p.id]=input.value;delete s.valid[p.id];input.classList.remove('wrong');input.removeAttribute('aria-invalid');form.querySelector('.feedback').textContent='';});
        input.addEventListener('change',()=>{if(input.value.trim())check();});
      });sync();host.querySelector('[data-check-all]')?.addEventListener('click',()=>checks.forEach(check=>check()));
    }
    host.querySelector('[data-next]').addEventListener('click',()=>{if(fixed&&s.indice===deck().length-1)s.finalizado=true;else {const old={resueltos:s.resueltos,primerIntento:s.primerIntento};Object.assign(s,fresh(section.dataset.caso,s.indice+1),old);}render(section);section.querySelector('h2').focus({preventScroll:true});});renderMath(host);
  }
  const sections=[...root.querySelectorAll('[data-caso]')];
  root.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;root.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));sections.forEach(render);}));
  sections.forEach(render);window.addEventListener('load',()=>renderMath(root));
}
