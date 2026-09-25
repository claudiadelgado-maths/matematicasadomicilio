import {VERSION,variants,generatePractice as generate,nextPractice,accepts,fmt,term,texnum,displayValue} from './modelo.mjs';
import {mountExplorer} from './explorador.mjs';
import {mountBuilder} from './constructor.mjs';
import {restore} from './mision-estado.mjs';
import {escape,math,formula,renderMath,seed,read,write,focus,storageNote,validSeed} from './ui.mjs';

const pages={'el-patron':'patron','los-elementos':'elementos','la-formula':'formula','hallar-un-termino':'termino','primer-termino':'inicio','raices':'raices','encontrar-la-razon':'razon','encontrar-la-posicion':'posicion','dos-terminos':'dos','sumar-terminos':'sumas','problemas-aplicados':'aplicacion','medios-geometricos':'medios','conectar-procedimientos':'combinar'};
const slug=location.pathname.split('/').filter(Boolean).filter(s=>s!=='index.html').at(-1);
const topic=pages[slug];
const prefix='alejandrina-geometria-v2-';
renderMath(); window.addEventListener('load',()=>renderMath());
const done=read(prefix+'completados');
const completed=new Set(Array.isArray(done)?done.filter(x=>Object.values(pages).includes(x)):[]);
document.querySelectorAll('.lesson-list a').forEach(link=>{
  const id=Object.keys(pages).find(s=>link.getAttribute('href').includes('/'+s+'/'));
  if(completed.has(pages[id])) {const badge=document.createElement('span');badge.className='completion';badge.textContent='Practicado ✓';link.querySelector('strong').after(badge);}
});

if(!topic){
  const storedLast=read(prefix+'ultima-pagina');
  const last=typeof storedLast==='string'&&Object.hasOwn(pages,storedLast)?storedLast:null;
  const missionState=restore(read('alejandrina-geometria-mision-v2'),0);
  const group=document.querySelector('.menu-group');
  if(group&&(completed.size||pages[last]||missionState.started)){
    const panel=document.createElement('section');panel.className='journey-summary';
    panel.setAttribute('aria-label','Tu recorrido');
    panel.innerHTML=`<h2>Tu recorrido</h2><p>${completed.size} de 13 temas practicados</p><progress max="13" value="${completed.size}" aria-label="Temas practicados"></progress>${missionState.started?`<p class="mission-summary">${missionState.index===24?'✦ Misión completada':`Misión: ${missionState.index} de 24 retos completados`}</p>`:''}${pages[last]?`<a href="explicacion/${escape(last)}/index.html">Retomar donde me quedé →</a>`:''}`;
    group.before(panel);
  }
}

if(topic){
  write(prefix+'ultima-pagina',slug);
  const host=document.querySelector('.practice'),key=prefix+'variado-'+topic;
  const saved=read(key);
  let state={version:VERSION,seed:seed(),variant:0,answers:[],draft:''};
  if(saved?.version===VERSION&&validSeed(saved.seed)&&Number.isInteger(saved.variant)&&variants[topic][saved.variant]){
    state={...state,seed:saved.seed,variant:saved.variant,draft:typeof saved.draft==='string'?saved.draft.slice(0,80):''};
    if(saved.fields&&typeof saved.fields==='object')state.fields=Object.fromEntries(['a','r','n'].map(k=>[k,typeof saved.fields[k]==='string'?saved.fields[k].slice(0,80):'']));
    const check=generate(topic,state.variant,state.seed);
    if(Array.isArray(saved.answers)) for(let i=0;i<Math.min(check.steps.length,saved.answers.length);i++){
      if(typeof saved.answers[i]!=='string'||!accepts(check.steps[i],saved.answers[i]))break;
      state.answers.push(saved.answers[i]);
    }
  }
  let problem=generate(topic,state.variant,state.seed);
  host.innerHTML=`<p class="eyebrow">Tu taller</p><h2 id="practice-title">Paso a paso</h2><div class="practice-toolbar"><label for="variant">Practicar <select id="variant">${(topic==='formula'?['Razón entera','Razón fraccionaria']:variants[topic]).map((v,i)=>`<option value="${i}">${escape(v)}</option>`).join('')}</select></label><button type="button" id="another">Otro ejercicio ↻</button></div><p data-storage hidden role="status"></p><div id="guided"></div><p class="feedback" id="practice-feedback" role="status" aria-live="polite"></p>`;
  host.querySelector('#variant').value=String(state.variant);
  const save=()=>storageNote(write(key,state));
  function draw(moveFocus=false){
    if(topic==='formula'||topic==='termino'){mountBuilder(host,problem,state,save,()=>{completed.add(topic);write(prefix+'completados',[...completed]);},moveFocus);return;}
    const index=state.answers.length,finished=index===problem.steps.length,current=problem.steps[index];
    host.querySelector('#guided').innerHTML=`<div class="case-stem">${problem.stem}</div><p class="step-count">${finished?'Procedimiento completo':`Paso ${index+1} de ${problem.steps.length}`}</p><ol class="solved-steps">${problem.steps.slice(0,index).map(s=>`<li><span>${escape(s.label)} ✓</span>${formula(s.equation)}</li>`).join('')}</ol>${finished?`<div class="task-complete"><h3 id="active-step" tabindex="-1">¡Lo construiste paso a paso!</h3><p>Puedes probar otra variante o continuar con la sesión.</p>${topic==='medios'?`<div class="sequence">${Array.from({length:problem.data.k+2},(_,i)=>`<span class="term">${math(texnum(term(problem.data.a,problem.data.r,i+1)))}</span>`).join('<span class="jump">→</span>')}</div>`:''}</div>`:`<form id="guided-form" novalidate><h3 id="active-step" tabindex="-1">${escape(current.label)}</h3>${current.choices?`<fieldset><legend class="sr-only">${escape(current.label)}</legend><div class="choice-grid">${current.choices.map((c,i)=>`<label class="choice-label"><input type="radio" name="answer" value="${escape(c)}" ${state.draft===c?'checked':''}><span>${displayValue(c)}</span></label>`).join('')}</div></fieldset>`:`<label class="sr-only" for="step-answer">${escape(current.label)}</label><input id="step-answer" name="answer" type="text" inputmode="${current.answer<0?'text':'decimal'}" autocomplete="off" maxlength="80" value="${escape(state.draft)}" aria-describedby="practice-feedback">`}<div class="actions"><button type="submit" class="primary">Comprobar paso</button><button type="button" id="help">Ver orientación</button></div><div class="hint" id="hint" hidden>${escape(current.hint)}</div></form>`}`;
    renderMath(host);
    if(finished){completed.add(topic);write(prefix+'completados',[...completed]);}
    else {
      const form=host.querySelector('form');
      form.addEventListener('input',()=>{state.draft=current.choices?(form.querySelector('input:checked')?.value||''):form.querySelector('input').value;save();host.querySelector('#practice-feedback').textContent='';form.querySelectorAll('input').forEach(el=>el.removeAttribute('aria-invalid'));});
      form.addEventListener('submit',event=>{
        event.preventDefault();
        const value=current.choices?form.querySelector('input:checked')?.value:form.querySelector('input').value;
        const feedback=host.querySelector('#practice-feedback');
        if(!value?.trim()){feedback.textContent=current.choices?'Selecciona una respuesta.':'Escribe tu respuesta para comprobarla.';return;}
        if(!accepts(current,value)){feedback.textContent='Todavía no. '+current.hint+' Puedes corregirlo.';form.querySelectorAll('input').forEach(el=>el.setAttribute('aria-invalid','true'));return;}
        state.answers.push(value);state.draft='';save();draw(true);feedback.textContent='Paso correcto. Tu operación queda arriba para consultarla.';
      });
      form.querySelector('#help').addEventListener('click',()=>{form.querySelector('#hint').hidden=false;form.querySelector('#help').setAttribute('aria-expanded','true');});
    }
    if(moveFocus)focus('#active-step');
  }
  function fresh(variant){state={version:VERSION,seed:seed(),variant,answers:[],draft:''};problem=nextPractice(topic,variant,state.seed,problem);state.seed=problem.seed;save();host.querySelector('#practice-feedback').textContent='';draw(true);}
  host.querySelector('#variant').addEventListener('change',e=>fresh(Number(e.target.value)));
  host.querySelector('#another').addEventListener('click',()=>fresh(state.variant));
  draw();save();

  // Small local manipulatives complement the formulas, without adding another page.
  if(['formula','elementos'].includes(topic)){
    mountExplorer(host);
  }
  if(topic==='sumas'){
    const widget=document.createElement('section');widget.className='explorer';
    widget.innerHTML='<h2>Observa qué se cancela</h2><p>Multiplica S₄ por 3. Resta la segunda fila de la primera; toca los términos que se cancelan entre ellas.</p><div id="cancel"></div><p id="cancel-status" role="status"></p>';
    host.before(widget);
    const cancelled=new Set();
    function drawCancel(){widget.querySelector('#cancel').innerHTML=`<div class="cancel-row"><strong>3S₄</strong>${[6,18,54,162].map(v=>v===162?'<span class="term">162</span>':`<button type="button" data-pair="${v}" aria-label="Cancelar el par ${v}" aria-pressed="${cancelled.has(v)}" class="${cancelled.has(v)?'cancelled':''}">${v}</button>`).join('<span>+</span>')}</div><div class="cancel-row"><strong>S₄</strong>${[2,6,18,54].map(v=>v===2?'<span class="term">2</span>':`<button type="button" data-pair="${v}" aria-label="Cancelar el par ${v}" aria-pressed="${cancelled.has(v)}" class="${cancelled.has(v)?'cancelled':''}">${v}</button>`).join('<span>+</span>')}</div>${cancelled.size===3?formula('2S_4=162-2=160')+formula('S_4=80'):''}`;
      widget.querySelectorAll('[data-pair]').forEach(button=>button.addEventListener('click',()=>{const v=Number(button.dataset.pair);cancelled.has(v)?cancelled.delete(v):cancelled.add(v);drawCancel();widget.querySelector(`[data-pair="${v}"]`).focus();widget.querySelector('#cancel-status').textContent=cancelled.size===3?'Solo quedan los extremos. Divide 160 entre 2.':`${cancelled.size} de 3 pares cancelados.`;}));renderMath(widget);}
    drawCancel();
  }
}



