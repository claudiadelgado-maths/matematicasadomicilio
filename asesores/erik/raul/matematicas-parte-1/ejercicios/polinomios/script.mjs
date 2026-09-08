import {generateExercise, toLatex, questions, hints} from './polinomios.mjs';
import {showFeedback} from '../../recursos/feedback.mjs';
const render = (element, latex) => {
  if (window.katex) window.katex.render(latex,element,{throwOnError:false,strict:'ignore'});
};
document.querySelectorAll('[data-tex]').forEach(el=>render(el,el.dataset.tex));
const expression = document.querySelector('#polynomial-expression');
const options = document.querySelector('#answer-options');
const feedback = document.querySelector('#exercise-feedback');
let current;
let solved = false;
function mathNode(tag,text) {
  const el = document.createElementNS('http://www.w3.org/1998/Math/MathML',tag);
  if (text !== undefined) el.textContent = String(text);
  return el;
}
function newExercise(focus = false) {
  current = generateExercise(Math.random,current);
  solved = false;
  const math = mathNode('math');
  const row = mathNode('mrow');
  current.terms.forEach((t,i)=>{
    if(t.coefficient<0 || i) row.append(mathNode('mo',t.coefficient<0?'−':'+'));
    if(Math.abs(t.coefficient)!==1 || !t.exponent) row.append(mathNode('mn',Math.abs(t.coefficient)));
    if(t.exponent>1) {
      const power = mathNode('msup'); power.append(mathNode('mi',current.variable),mathNode('mn',t.exponent)); row.append(power);
    } else if(t.exponent===1) row.append(mathNode('mi',current.variable));
  });
  math.append(row); expression.replaceChildren(math);
  render(expression,toLatex(current));
  document.querySelector('#question').textContent = questions[current.kind];
  options.replaceChildren();
  showFeedback(feedback,focus?'Nuevo ejercicio. Selecciona una respuesta.':'');
  for(const value of current.options) {
    const button = document.createElement('button');
    button.type='button'; button.className='answer-option'; button.setAttribute('aria-label',String(value));
    const number=document.createElement('span'); number.textContent=String(value); render(number,String(value));
    const mark=document.createElement('span'); mark.className='option-mark'; mark.setAttribute('aria-hidden','true');
    button.append(number,mark);
    button.addEventListener('click',()=>{
      if(solved) return;
      const correct=value===current.answer;
      button.dataset.result=correct?'correct':'incorrect';
      mark.textContent=correct?'✓':'×';
      showFeedback(feedback,correct?`✓ ¡Correcto! ${hints[current.kind]} Respuesta: ${current.answer}.`:`× Revisa tu respuesta. ${hints[current.kind]}`,correct?'correct':'incorrect');
      if(correct) {
        solved=true;
        options.querySelectorAll('button').forEach(b=>b.setAttribute('aria-disabled','true'));
      }
    });
    options.append(button);
  }
  if(focus) options.querySelector('button').focus({preventScroll:true});
}
document.querySelector('#new-exercise').addEventListener('click',()=>newExercise(true));
document.querySelector('#practice').hidden=false;
newExercise();
