import {triviaRound,createTrivia,optionsFor} from '../../recursos/modelo.mjs';
const root=document.querySelector('[data-game="trivia"]');
if(root){
  const el=id=>document.getElementById(id),text=(id,value)=>{el(id).textContent=value;};let round;
  function stats(){text('trivia-correct',`✓ Aciertos: ${round.correct}`);text('trivia-errors',`↻ Errores: ${round.errors}`);text('trivia-progress',`${round.count} de ${round.items.length}`);el('trivia-meter').value=round.count;el('trivia-meter').max=round.items.length;}
  function render(focus=false){
    const item=round.current;stats();text('question-position',`Pregunta ${round.index+1} de ${round.items.length}`);text('trivia-equation',`${item.a} × ${item.b} = ?`);text('trivia-feedback','');el('trivia-next').hidden=true;
    el('trivia-answers').replaceChildren(...optionsFor(item.answer,item.a).map(value=>{const button=document.createElement('button');button.type='button';button.textContent=String(value);button.dataset.answer=String(value);button.addEventListener('click',()=>{
      const correct=round.choose(value);if(correct===null)return;
      el('trivia-answers').querySelectorAll('button').forEach(b=>{b.disabled=true;const right=Number(b.dataset.answer)===item.answer;if(right){b.classList.add('correct');const small=document.createElement('small');small.textContent='✓ Correcta';b.append(small);}else if(b===button){b.classList.add('wrong');const small=document.createElement('small');small.textContent='Tu elección';b.append(small);}});
      text('trivia-feedback',correct?`¡Lo lograste! ${item.a} × ${item.b} = ${item.answer}.`:`Sigue practicando: ${item.a} × ${item.b} = ${item.answer}.`);el('trivia-feedback').dataset.state=correct?'correct':'wrong';stats();el('trivia-next').hidden=false;text('trivia-next',round.complete?'Ver mi resultado ★':'Siguiente pregunta →');el('trivia-next').focus({preventScroll:true});
    });return button;}));
    if(focus)el('trivia-equation').focus({preventScroll:true});
  }
  function start(focus=false){round=createTrivia(triviaRound(el('trivia-mode').value,Number(el('trivia-table').value)));el('table-setting').hidden=el('trivia-mode').value==='mixed';el('trivia-round').hidden=false;el('trivia-result').hidden=true;render(focus);}
  el('trivia-mode').addEventListener('change',()=>start(true));el('trivia-table').addEventListener('change',()=>start(true));el('trivia-reset').addEventListener('click',()=>start(true));el('trivia-repeat').addEventListener('click',()=>start(true));
  el('trivia-next').addEventListener('click',()=>{
    if(!round.answered)return;
    if(round.complete){el('trivia-round').hidden=true;el('trivia-result').hidden=false;text('trivia-result-title',round.correct===round.items.length?'¡Ronda perfecta!':'¡Ronda terminada!');text('trivia-result-score',`${round.correct} / ${round.items.length}`);text('trivia-result-text',`${round.correct} ${round.correct===1?'acierto':'aciertos'} y ${round.errors} ${round.errors===1?'error':'errores'}. Puedes repetir para seguir practicando.`);el('trivia-result-title').focus();}
    else if(round.next())render(true);
  });
  start();root.querySelectorAll('[data-interactive]').forEach(node=>{node.hidden=false;});
}
