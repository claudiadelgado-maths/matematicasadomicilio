import {types,practice,mixedChallenge,createRound,format} from './modelo.mjs';
const root=document.querySelector('[data-mode]');
if(root){
  const el=id=>document.getElementById(id),text=(id,value)=>{el(id).textContent=value;},mixed=root.dataset.mode==='mixed';let items,round,index;
  function updateCounters(){
    text('solved-count',`Resueltos: ${round.solved} / ${items.length}`);text('first-count',`A la primera: ${round.firstTry}`);text('error-count',`Intentos incorrectos: ${round.errors}`);
    el('work-progress').max=items.length;el('work-progress').value=round.solved;
    if(!mixed)el('type-list').replaceChildren(...types.map((name,type)=>{
      const li=document.createElement('li'),count=round.records.filter(r=>r.item.type===type&&r.solved).length;li.className=count===5?'done':items[index].type===type?'current':'';
      li.setAttribute('aria-label',`${name}: ${count} de 5 resueltos`);if(items[index].type===type)li.setAttribute('aria-current','step');
      const number=document.createElement('span'),label=document.createElement('span'),score=document.createElement('small');number.className='type-number';number.textContent=String(type+1).padStart(2,'0');label.className='type-name';label.textContent=name;score.textContent=`${count}/5`;li.append(number,label,score);if(!mixed){const button=document.createElement('button');button.type='button';button.className='type-choice';button.setAttribute('aria-label',`Elegir tipo ${type+1}: ${name}, ${count} de 5 resueltos`);button.append(number,label,score);button.addEventListener('click',()=>selectType(type));li.append(button);}else li.append(number,label,score);return li;
    }));
  }
  function selectType(type){
    const first=items.findIndex((item,i)=>item.type===type&&!round.records[i].solved);
    const fallback=items.findIndex(item=>item.type===type);
    index=first>=0?first:fallback;render(true);
  }
  function nextIndex(){
    if(mixed)return index+1<items.length?index+1:-1;
    const currentType=items[index].type;
    const next=items.findIndex((item,i)=>item.type===currentType&&!round.records[i].solved);
    return next;
  }
  function render(focus=false){
    const item=items[index];text('question-count',`Ejercicio ${index+1} de ${items.length}`);text('problem-title',mixed?'Despeja x':`${types[item.type]} · ${index%5+1} de 5`);
    el('equation').innerHTML=item.equation;el('answer').value=round.records[index].solved?format(item.value):'';el('answer').readOnly=round.records[index].solved;el('answer').removeAttribute('aria-invalid');el('check-answer').disabled=round.records[index].solved;el('next-question').hidden=!round.records[index].solved;text('answer-feedback',round.records[index].solved?'Este ejercicio ya está resuelto. Puedes elegir otro tipo o continuar.':'');if(round.records[index].solved)text('next-question',nextIndex()===-1?(round.complete?'Ver resultados →':'Elegir otro tipo →'):'Siguiente ejercicio →');el('solution').open=false;
    el('solution-steps').replaceChildren(...item.steps.map(step=>{const li=document.createElement('li'),label=document.createElement('span'),formula=document.createElement('div');label.textContent=step.label;formula.innerHTML=step.math;li.append(label,formula);return li;}));
    updateCounters();if(focus){el('problem-title').focus({preventScroll:true});el('work-card').scrollIntoView({block:'nearest',behavior:'auto'});el('answer').focus({preventScroll:true});}
  }
  function start(focus=false){items=mixed?mixedChallenge():practice;round=createRound(items);index=0;el('practice-layout').hidden=false;el('completion').hidden=true;render(focus);}
  function finish(){
    if(!round.complete)return;
    el('practice-layout').hidden=true;el('completion').hidden=false;text('completion-title',mixed?'Desafío completado.':'Los siete tipos, resueltos.');
    text('result-solved',`${round.solved}/${items.length}`);text('result-first',String(round.firstTry));text('result-errors',String(round.errors));
    const review=el('results');review.replaceChildren();
    if(mixed){
      const scroll=document.createElement('div');scroll.className='result-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Resultados de los 14 ejercicios');const table=document.createElement('table');table.innerHTML='<thead><tr><th scope="col">Ecuación</th><th scope="col">x</th><th scope="col">Intentos</th><th scope="col">Procedimiento</th></tr></thead>';const tbody=document.createElement('tbody');
      round.records.forEach(record=>{const tr=document.createElement('tr');const equation=document.createElement('td');equation.innerHTML=record.item.equation;const value=document.createElement('td');value.textContent=format(record.item.value);const attempts=document.createElement('td');attempts.textContent=String(record.attempts);const help=document.createElement('td');help.textContent=record.help?'Consultado':'Sin consultar';tr.append(equation,value,attempts,help);tbody.append(tr);});table.append(tbody);scroll.append(table);review.append(scroll);
    }else{
      const ul=document.createElement('ul');ul.className='result-type-list';types.forEach((type,i)=>{const li=document.createElement('li'),label=document.createElement('span'),score=document.createElement('b');label.textContent=type;score.textContent=`${round.records.filter(r=>r.item.type===i&&r.attempts===1).length}/5 a la primera`;li.append(label,score);ul.append(li);});review.append(ul);
    }
    el('completion-title').focus();
  }
  el('answer-form').addEventListener('submit',event=>{
    event.preventDefault();const result=round.submit(index,el('answer').value);if(result.ignored)return;
    if(!result.valid){text('answer-feedback','Escribe un número entero o con hasta dos decimales. Puedes usar punto o coma; no escribas fracciones ni fórmulas.');el('answer-feedback').dataset.state='wrong';el('answer').setAttribute('aria-invalid','true');el('answer').focus();return;}
    updateCounters();el('answer-feedback').dataset.state=result.correct?'correct':'wrong';el('answer').setAttribute('aria-invalid',String(!result.correct));
    if(result.correct){text('answer-feedback',`Correcto. x = ${format(items[index].value)}${Number.isInteger(items[index].value)?'.':' (valor exacto o redondeado a dos decimales).'}`);el('answer').readOnly=true;el('check-answer').disabled=true;el('next-question').hidden=false;text('next-question',nextIndex()===-1?(round.complete?'Ver resultados →':'Elegir otro tipo →'):'Siguiente ejercicio →');el('next-question').focus({preventScroll:true});}
    else{text('answer-feedback',result.domain?'Todavía no coincide. Revisa tu despeje y el redondeo a dos decimales; puedes abrir el procedimiento.':'Ese valor no cumple el dominio: el argumento del logaritmo debe ser mayor que cero. Prueba de nuevo.');el('answer').focus({preventScroll:true});el('answer').select();}
  });
  el('answer').addEventListener('input',()=>{if(!round.records[index].solved){el('answer').removeAttribute('aria-invalid');text('answer-feedback','');}});
  el('solution').addEventListener('toggle',()=>{if(el('solution').open)round.useHelp(index);});
  el('next-question').addEventListener('click',()=>{if(!round.records[index].solved)return;const next=nextIndex();if(next===-1){if(round.complete)finish();else{const pending=items.findIndex((item,i)=>!round.records[i].solved);index=pending;render(true);}}else{index=next;render(true);}});
  el('restart').addEventListener('click',()=>start(true));el('repeat-round').addEventListener('click',()=>start(true));
  start();root.querySelectorAll('[data-interactive]').forEach(element=>{element.hidden=false;});
}
