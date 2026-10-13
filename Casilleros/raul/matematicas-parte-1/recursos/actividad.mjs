import {showFeedback} from './feedback.mjs';
export {showFeedback};
export const $ = id => document.getElementById(id);
export const spoken = latex => latex.replace(/\^\{(\d+)\}/g,' elevado a $1 ').replaceAll('\\square','casilla').replace(/[{}]/g,'');
export function math(el,latex) {
  if(window.katex) window.katex.render(latex,el,{throwOnError:false,strict:'ignore'});
  else {
    // Respaldo legible de la notación generada, sin interpretar HTML del alumno.
    el.replaceChildren();
    const parts=latex.split(/(\^\{\d+\})/g);
    for(const part of parts) {
      if(part.startsWith('^{')) {const sup=document.createElement('sup');sup.textContent=part.slice(2,-1);el.append(sup);}
      else el.append(document.createTextNode(part.replaceAll('\\square','□').replaceAll('\\cdot','·')));
    }
  }
}
export function choice(container,options,status,hint,onCorrect=()=>{}) {
  container.replaceChildren(); showFeedback(status);
  let done=false;
  options.forEach(option=>{
    const button=document.createElement('button');button.type='button';button.className='answer-option';button.setAttribute('aria-label',spoken(option.latex));
    const formula=document.createElement('span');math(formula,option.latex);
    const mark=document.createElement('span');mark.className='option-mark';mark.setAttribute('aria-hidden','true');button.append(formula,mark);
    button.addEventListener('click',()=>{
      if(done) return;
      button.dataset.result=option.correct?'correct':'incorrect';mark.textContent=option.correct?'✓':'×';
      showFeedback(status,option.correct?'✓ ¡Correcto!':'× Revisa tu respuesta. '+hint,option.correct?'correct':'incorrect');
      if(option.correct) {done=true;container.querySelectorAll('button').forEach(b=>b.setAttribute('aria-disabled','true'));onCorrect();}
    });
    container.append(button);
  });
}
