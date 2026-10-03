import {PARTES,seriePartes,serieMedidas,serieConversiones,responder,nuevoEjercicio,simplificar} from './modelo.mjs?v=20261002-circulos5';

export function iniciarJuegos({states,partsDiagram,measureDiagram,piHTML,piText,esc,updateProgress}){
  let level=1;
  const timers=new Map(),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const keyFor=section=>section.dataset.game==='medidas'?`medidas${level}`:section.dataset.game;
  const deck=key=>{if(key==='partes')return seriePartes();if(key==='conversiones')return serieConversiones(Math.random,states.conversiones.filtro||'mixto');const all=serieMedidas(Number(key.at(-1))),filter=states[key].filtro||'mixto';return filter==='mixto'?all:all.filter(q=>q.from+q.to===filter);};
  function conversionDiagram(q,solved){
    const g=q.degrees,r=133,cx=240,cy=208,x=cx+r*Math.cos(g*Math.PI/180),y=cy-r*Math.sin(g*Math.PI/180);
    const path=`M ${cx+r} ${cy} A ${r} ${r} 0 ${g>180?1:0} 0 ${x} ${y}`;
    const sector=g===0?'':g===360?`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#dcefeb"/>`:`<path d="M ${cx} ${cy} L ${cx+r} ${cy} A ${r} ${r} 0 ${g>180?1:0} 0 ${x} ${y} Z" fill="#dcefeb"/>`;
    const arc=g===0?'':g===360?`<circle cx="${cx}" cy="${cy}" r="${r}"/>`:`<path d="${path}"/>`;
    const arcText=q.to==='deg'||solved?`${piText(q.ratio)} rad`:'¿Cuántos radianes?',degreeText=q.to==='rad'||solved?`${g}°`:'¿Cuántos grados?';
    return `<svg viewBox="0 0 480 410" role="img" aria-label="Porción de círculo. Ángulo: ${degreeText}. Arco: ${arcText}. Radio 1."><circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="#a4b2c5" stroke-width="2"/>${sector}<g fill="none" stroke="#18766e" stroke-width="${solved?9:5}" class="${solved?'arc-glow':''}">${arc}</g><path d="M ${cx+r} ${cy} L ${cx} ${cy} L ${x} ${y}" fill="none" stroke="#7052a2" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="4" fill="#293548"/><g font-size="21" text-anchor="middle" font-weight="700"><text x="240" y="35">Ángulo: ${degreeText}</text><text x="240" y="378">Arco: ${arcText}</text></g><text x="280" y="232" font-size="16">r = 1</text></svg><p class="small-note">La zona coloreada es la porción de vuelta. En este círculo de radio 1, la longitud del arco coincide con la medida en radianes.${g===0?' Con 0° no se recorre ningún arco.':solved?' ¡El arco brilla: las dos medidas coinciden!':''}</p>`;
  }
  const keypad=()=>`<div class="keypad" role="group" aria-label="Teclado de respuesta">${['7','8','9','4','5','6','1','2','3','π','0','/','⌫','Borrar'].map(k=>`<button class="geo-button" type="button" data-key="${k}" aria-label="${k==='⌫'?'Borrar último carácter':k==='π'?'Pi':k==='/'?'Dividir':k}">${k}</button>`).join('')}</div><small>También puedes escribir con tu teclado: P = π, / = dividir.</small>`;
  function render(section,focus=false){
    const key=keyFor(section),s=states[key],host=section.querySelector('.game-host'),q=s.preguntas[s.indice],size=key==='partes'?5:4;
    clearTimeout(timers.get(key));updateProgress();
    const isPart=q.kind==='partes',isMeasure=q.kind==='medidas',choice=isPart||(isMeasure&&level===1),rad=q.to==='rad';
    const options=isPart?PARTES.map(p=>({value:p.id,label:p.nombre})):isMeasure?q.opciones.map(v=>({value:v,label:`${v} ${q.unit}`})):[];
    const drawing=isPart?partsDiagram(q.target,q.giro,q.radio,`game-${key}`):isMeasure?measureDiagram(q):`<div class="angle-prompt">${rad?`${q.degrees}°`:`${piHTML(q.ratio)} rad`}</div><div data-angle-drawing></div>`;
    const question=isPart?'¿Cómo se llama el elemento resaltado?':isMeasure?`El ${q.from==='r'?'radio':'diámetro'} es ${q.given} ${q.givenUnit}. Encuentra el ${q.to==='A'?'área':'perímetro'}.`:rad?'Convierte este ángulo a radianes.':'Convierte este ángulo a grados.';
    const input=(name,label,value,mode='text')=>`<label for="${key}-${name}">${label}</label><input id="${key}-${name}" data-field="${name}" type="text" inputmode="${mode}" maxlength="30" autocomplete="off" spellcheck="false" value="${esc(value||'')}" aria-describedby="${key}-help ${key}-feedback">`;
    let controls;
    if(choice)controls=`<div class="options">${options.map(o=>`<button class="geo-button" type="button" data-option="${esc(o.value)}">${o.label}</button>`).join('')}</div>`;
    else if(isMeasure)controls=`<form class="answer-form"><div class="input-row">${input('answer','Tu respuesta completa',s.borrador)}<span>${q.unit}</span></div>${keypad()}<p id="${key}-help" class="small-note">Conserva π: para ocho pi escribe 8π. Las unidades ya están junto al campo.</p><button class="geo-button primary" type="submit">Comprobar</button></form>`;
    else if(!rad)controls=`<form class="answer-form"><div class="input-row">${input('answer','Respuesta en grados',s.borrador,'numeric')}<span>°</span></div><p id="${key}-help" class="small-note">Escribe solo los grados: por ejemplo, para π/2 escribe 90.</p><button class="geo-button primary" type="submit">Comprobar</button></form>`;
    else controls=`<form class="answer-form calculator"><p class="calculator-title">Simplificador de fracciones</p><div class="fraction-fields"><div>${input('numerador','Numerador',s.numerador,'numeric')}</div><div>${input('denominador','Denominador',s.denominador,'numeric')}</div></div><p id="${key}-help" class="small-note">Copia los grados en el numerador y escribe 180 en el denominador. Simplifica: la fracción resultante multiplica a π.</p><button class="geo-button" type="button" data-calculate>Simplificar fracción</button><div class="calc-result" role="status" aria-live="polite"></div><button class="geo-button primary" type="submit" data-deliver disabled>Entregar resultado</button></form>`;
    host.innerHTML=`${!isPart?`<label class="practice-filter" for="${key}-filter">Quiero practicar<select id="${key}-filter" data-filter>${(isMeasure?[['mixto','Todos los casos'],['rP','Radio → perímetro'],['dP','Diámetro → perímetro'],['rA','Radio → área'],['dA','Diámetro → área']]:[['mixto','Ambas conversiones'],['rad','Grados → radianes'],['deg','Radianes → grados']]).map(([value,label])=>`<option value="${value}" ${value===(s.filtro||'mixto')?'selected':''}>${label}</option>`).join('')}</select></label>`:''}<div class="game-top"><span data-round></span><span data-score></span><button class="geo-button" type="button" data-new>Nuevo ejercicio ↻</button></div><progress max="${size}" value="0" aria-label="Aciertos de la ronda"></progress><div class="challenge"><div class="challenge-visual">${drawing}</div><div><p class="mode-tag">${isPart?'Observa y elige':isMeasure?`Nivel ${level} · ${level===1?'Opciones':'Teclado con π'}`:rad?'Grados → radianes':'Radianes → grados'}</p><h4 tabindex="-1">${question}</h4>${controls}<details class="help"><summary>Necesito una pista</summary><p>${q.hint}</p></details><div id="${key}-feedback" class="answer-feedback" role="status" aria-live="polite" aria-atomic="true"></div><button class="geo-button primary" type="button" data-next disabled>Siguiente reto →</button></div></div>`;
    const fields=[...host.querySelectorAll('input')],answer=host.querySelector('[data-field="answer"]');
    function showCalc(){
      const out=host.querySelector('.calc-result');if(!out)return;
      out.innerHTML=s.calculo?`${rad?`(${esc(s.numerador)}/${esc(s.denominador)})π = `:`(${esc(s.borrador)}) × (180/π) = `}<strong>${rad?`${piHTML(s.calculo)} rad`:`${s.calculo.d===1?s.calculo.n:`${s.calculo.n}/${s.calculo.d}`}°`}</strong>`:'Calcula para ver y entregar tu resultado.';
      host.querySelector('[data-deliver]').disabled=!s.calculo||s.completo;
    }
    function refresh(){
      const done=s.resueltos%size,finished=s.completo&&done===0;
      const angleDrawing=host.querySelector('[data-angle-drawing]');if(angleDrawing)angleDrawing.innerHTML=conversionDiagram(q,s.completo);
      host.querySelector('[data-round]').textContent=`Ronda ${Math.floor(Math.max(0,s.resueltos-(finished?1:0))/size)+1} · ${finished?size:done} de ${size} aciertos${finished?' · ¡Ronda superada! ✦':''}`;
      host.querySelector('[data-score]').textContent=`${s.resueltos} resueltos · ${s.primerIntento} al primer intento`;
      host.querySelector('progress').value=finished?size:done;
      fields.forEach(input=>{input.readOnly=s.completo;input.classList.toggle('correct',s.completo);input.classList.toggle('wrong',s.resultado==='error');input.setAttribute('aria-invalid',String(['error','invalida'].includes(s.resultado)));});
      host.querySelectorAll('[data-key], [data-calculate], [type="submit"]').forEach(b=>b.disabled=s.completo);
      host.querySelectorAll('[data-option]').forEach(b=>{b.disabled=s.completo;b.classList.toggle('correct',s.completo&&b.dataset.option===s.borrador);b.classList.toggle('wrong',s.resultado==='error'&&b.dataset.option===s.borrador);});
      const feedback=host.querySelector('.answer-feedback');feedback.dataset.kind=s.resultado;
      feedback.innerHTML=`${s.resultado==='error'&&Date.now()<s.errorUntil?'<span class="error-mark" aria-hidden="true">×</span>':''}${esc(s.mensaje)}`;
      const mark=feedback.querySelector('.error-mark');clearTimeout(timers.get(key));if(mark)timers.set(key,setTimeout(()=>mark.hidden=true,Math.max(0,s.errorUntil-Date.now())));
      host.querySelector('[data-next]').disabled=!s.completo;showCalc();updateProgress();
    }
    function check(raw){
      if(s.completo)return;if(choice)s.borrador=raw;
      const result=responder(s,raw);s.resultado=result;
      s.mensaje=result==='correcta'?`✓ ¡Lo lograste! ${isPart?q.explain:isMeasure?`${q.to} = ${q.expected}π ${q.unit}.`:`${q.degrees}° = ${piText(q.ratio)} rad.`}`:result==='invalida'?(isMeasure?'Escribe una cantidad exacta con π, como 8π.':'Escribe solo un número entero de grados, como 90.'):`Todavía no. ${q.hint}`;
      if(result==='error')s.errorUntil=Date.now()+1100;refresh();
    }
    function calculate(){
      s.calculo=simplificar(s.numerador,s.denominador);
      if(!s.calculo){s.resultado='invalida';s.mensaje=rad?'Escribe dos enteros; el denominador debe ser mayor que cero.':'Escribe una cantidad con π, como π/2, 7π/6 o 2π. El denominador debe ser mayor que cero.';}else{s.resultado='';s.mensaje='';}refresh();
    }
    fields.forEach(input=>input.addEventListener('input',()=>{if(s.completo)return;const name=input.dataset.field;s[name==='answer'?'borrador':name]=input.value;s.calculo=null;s.resultado='';s.mensaje='';refresh();}));
    if(!choice&&!isMeasure&&rad)fields.forEach(input=>input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(s.completo)return;if(s.calculo)check(`${s.calculo.n}/${s.calculo.d}`);else calculate();}}));
    function insert(value){
      if(!answer||s.completo)return;const start=answer.selectionStart??answer.value.length,end=answer.selectionEnd??start;
      if(value==='Borrar'){answer.value='';answer.setSelectionRange(0,0);}
      else if(value==='⌫'){const a=start===end?Math.max(0,start-1):start;answer.setRangeText('',a,end,'end');}
      else if(answer.value.length-(end-start)+value.length<=30)answer.setRangeText(value,start,end,'end');
      answer.dispatchEvent(new Event('input',{bubbles:true}));answer.focus({preventScroll:true});
    }
    if(isMeasure)answer?.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='p'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();insert('π');}});
    host.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>insert(b.dataset.key));
    host.querySelector('[data-calculate]')?.addEventListener('click',calculate);
    host.querySelector('form')?.addEventListener('submit',e=>{e.preventDefault();if(s.completo)return;if(isMeasure||!rad)check(s.borrador);else if(!s.calculo)calculate();else check(`${s.calculo.n}/${s.calculo.d}`);});
    host.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>check(b.dataset.option));
    host.querySelector('[data-filter]')?.addEventListener('change',e=>{s.filtro=e.target.value;s.indice=s.preguntas.length-1;nuevoEjercicio(s,()=>deck(key));render(section);host.querySelector('[data-filter]').focus({preventScroll:true});});
    const next=()=>{nuevoEjercicio(s,()=>deck(key));render(section,true);};
    host.querySelector('[data-new]').onclick=next;host.querySelector('[data-next]').onclick=()=>{if(s.completo)next();};
    refresh();if(focus)host.querySelector('h4').focus({preventScroll:true});
  }
  $$('[data-level]').forEach(b=>b.onclick=()=>{level=Number(b.dataset.level);$$('[data-level]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render($('[data-game="medidas"]'));});
  $$('[data-game]').forEach(s=>render(s));
}
