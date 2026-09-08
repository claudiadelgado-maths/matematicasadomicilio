import {$,math,choice,showFeedback,spoken} from '../../recursos/actividad.mjs';
import {polynomial} from '../../recursos/algebra.mjs';
import {memoryExercise,reviewExercise,subtractExercise,signedTerm} from './motor.mjs';
document.querySelectorAll('[data-tex]').forEach(el=>{if(window.katex)math(el,el.dataset.tex);});
let timer,opened=[],matched=0,locked=false;
function newMemory() {
  clearTimeout(timer);opened=[];matched=0;locked=false;showFeedback($('memory-feedback'));$('memory').replaceChildren();
  $('memory-equalities').replaceChildren();$('memory-equalities').hidden=true;
  const cards=memoryExercise();
  cards.forEach((card,index)=>{
    const button=document.createElement('button');button.type='button';button.className='memory-card';
    const hide=()=>{button.textContent='?';button.setAttribute('aria-label',`Descubrir tarjeta ${index+1}`);button.setAttribute('aria-pressed','false');};hide();
    button.addEventListener('click',()=>{
      if(locked||button.getAttribute('aria-disabled')==='true'||opened.some(item=>item.button===button))return;
      math(button,card.latex);button.setAttribute('aria-label',spoken(card.latex));button.setAttribute('aria-pressed','true');opened.push({card,button,hide});
      if(opened.length<2)return;
      if(opened[0].card.pair===card.pair){
        opened.forEach(item=>{item.button.dataset.pair=String(card.pair);item.button.setAttribute('aria-disabled','true');item.button.setAttribute('aria-label',spoken(item.card.latex)+', pareja encontrada');});
        opened=[];matched++;showFeedback($('memory-feedback'),matched===4?'✓ ¡Correcto! Encontraste todas las parejas.':'✓ Pareja encontrada.', 'correct');
        if(matched===4){
          for(let pair=0;pair<4;pair++){
            const original=cards.find(c=>c.pair===pair && c.kind==='original');
            const result=cards.find(c=>c.pair===pair && c.kind==='result');
            const equality=document.createElement('div');math(equality,`${original.latex}=${result.latex}`);$('memory-equalities').append(equality);
          }
          $('memory-equalities').hidden=false;
        }
      }else{
        locked=true;showFeedback($('memory-feedback'),'No son pareja. Busca el resultado de cambiar el signo.');
        timer=setTimeout(()=>{opened.forEach(item=>item.hide());opened=[];locked=false;},1300);
      }
    });$('memory').append(button);
  });
}
$('new-memory').addEventListener('click',newMemory);newMemory();
let review,decisions=[];
function newReview(){
  review=reviewExercise(review?.mask);decisions=Array(4).fill(null);$('review-terms').replaceChildren();$('review-solution').hidden=true;showFeedback($('review-feedback'));
  math($('review-original'),`-(${polynomial(review.terms)})`);
  review.terms.forEach((t,i)=>{
    const card=document.createElement('div');card.className='review-term';
    const original=document.createElement('div');math(original,signedTerm(t));
    const arrow=document.createElement('span');arrow.textContent='↓';arrow.setAttribute('aria-hidden','true');
    const proposed=document.createElement('div');math(proposed,signedTerm(review.proposed[i]));
    const controls=document.createElement('div');controls.className='judgment';controls.setAttribute('role','group');controls.setAttribute('aria-label',`Cambio de ${spoken(signedTerm(t))} a ${spoken(signedTerm(review.proposed[i]))}`);
    [true,false].forEach(value=>{
      const button=document.createElement('button');button.type='button';button.textContent=value?'✓':'✕';button.setAttribute('aria-label',value?'Cambio correcto':'Cambio incorrecto');button.setAttribute('aria-pressed','false');
      button.addEventListener('click',()=>{decisions[i]=value;controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('review-terms').querySelectorAll('.review-term').forEach(el=>{delete el.dataset.result;el.querySelector('.verdict').textContent='';});showFeedback($('review-feedback'));$('review-solution').hidden=true;});controls.append(button);
    });const verdict=document.createElement('p');verdict.className='verdict';card.append(original,arrow,proposed,controls,verdict);$('review-terms').append(card);
  });
}
$('submit-review').addEventListener('click',()=>{
  if(decisions.includes(null)){showFeedback($('review-feedback'),'Marca cada cambio antes de entregar.','incorrect');$('review-terms').children[decisions.indexOf(null)].querySelector('button').focus();return;}
  const correct=decisions.every((d,i)=>d===review.correct[i]);
  [...$('review-terms').children].forEach((el,i)=>{const ok=decisions[i]===review.correct[i];el.dataset.result=ok?'correct':'incorrect';el.querySelector('.verdict').textContent=ok?'✓ Bien revisado':'✕ Revisa tu marca';});
  showFeedback($('review-feedback'),correct?'✓ ¡Correcto! Revisaste todos los signos.':'× Revisa las tarjetas marcadas. Cada término debe tener el signo opuesto.',''+(correct?'correct':'incorrect'));
  math($('review-solution'),`-(${polynomial(review.terms)})=${polynomial(review.terms.map(t=>({...t,c:-t.c})))}`);$('review-solution').hidden=false;
});
$('new-review').addEventListener('click',newReview);newReview();
function newSubtract(){
  const ex=subtractExercise();$('subtract-solution').hidden=true;$('subtract-solution').replaceChildren();
  math($('subtract-original'),`(${polynomial(ex.left)})-(${polynomial(ex.right)})`);
  choice($('subtract-options'),ex.options,$('subtract-feedback'),'Cambia todos los signos del segundo trinomio y suma los coeficientes semejantes.',()=>{
    ex.steps.forEach((step,i)=>{const label=document.createElement('p');label.textContent=['Cambiar signos','Agrupar','Simplificar'][i];const formula=document.createElement('div');math(formula,step);$('subtract-solution').append(label,formula);});$('subtract-solution').hidden=false;
  });
}
$('new-subtract').addEventListener('click',newSubtract);newSubtract();
window.addEventListener('pagehide',()=>clearTimeout(timer));
