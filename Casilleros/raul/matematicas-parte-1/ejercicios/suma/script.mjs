import {numbers,trinomials,polynomials,polynomial,literal,key,validGroup,parseInteger,group,simplified,grouped,coefficientGroups} from './algebra.mjs';
import {$,math,choice,showFeedback} from './ui.mjs';
import './recta.mjs';
import './parejas.mjs';
document.querySelectorAll('[data-tex]').forEach(el=>{if(window.katex)math(el,el.dataset.tex);});
function newNumbers(focus=false) {
  const ex=numbers();math($('numbers-expression'),ex.latex);
  choice($('numbers-options'),ex.options.map(n=>({latex:String(n),correct:n===ex.answer})),$('numbers-feedback'),'Suma los valores absolutos si los signos coinciden; si no, réstalos y conserva el signo del mayor.');
  if(focus)$('numbers-options').querySelector('button').focus({preventScroll:true});
}
$('new-numbers').addEventListener('click',()=>newNumbers(true));newNumbers();

let tri;
function read(id) {return parseInteger($(id).value);}
function preview() {
  math($('tri-group-preview'),coefficientGroups(tri.parts.map((base,i)=>({base,values:[read(`group-${i}-a`),read(`group-${i}-b`)]}))));
  const values=tri.parts.map((base,i)=>({base,c:read(`result-${i}`)}));
  math($('tri-result-preview'),values.every(t=>t.c!==null)?polynomial(values):grouped(values.map(t=>({base:t.base,values:[t.c]}))));
}
function makeInput(id,label,feedbackId) {
  const input=document.createElement('input');input.id=id;input.type='text';input.inputMode='text';input.maxLength=5;input.autocomplete='off';input.setAttribute('aria-label',label);input.setAttribute('aria-describedby',feedbackId);
  input.addEventListener('input',()=>{
    delete input.dataset.result;input.removeAttribute('aria-invalid');
    const related=input.closest('.coefficient-unit');related.querySelectorAll('input').forEach(field=>{delete field.dataset.result;field.removeAttribute('aria-invalid');});
    $(feedbackId).textContent='';showFeedback($('tri-feedback'));$('tri-solution').hidden=true;preview();
  });return input;
}
function newTri(focus=false) {
  tri=trinomials();math($('tri-left'),polynomial(tri.left));math($('tri-right'),polynomial(tri.right));math($('tri-operation'),`(${polynomial(tri.left)})+(${polynomial(tri.right)})`);
  $('tri-groups').replaceChildren();$('tri-results').replaceChildren();showFeedback($('tri-feedback'));$('tri-solution').hidden=true;
  tri.parts.forEach((base,i)=>{
    const part=literal(base),name=part||'término independiente';
    const unit=document.createElement('div');unit.className='coefficient-unit';
    const line=document.createElement('div');line.className='group-inputs';
    const a=makeInput(`group-${i}-a`,`Primer coeficiente de ${name}`,`group-feedback-${i}`),b=makeInput(`group-${i}-b`,`Segundo coeficiente de ${name}`,`group-feedback-${i}`);
    const symbol=document.createElement('span');symbol.textContent='y';const baseLabel=document.createElement('span');if(part)math(baseLabel,part);else baseLabel.textContent='constante';
    line.append(a,symbol,b,baseLabel);
    const message=document.createElement('p');message.id=`group-feedback-${i}`;message.className='coefficient-feedback';unit.append(line,message);$('tri-groups').append(unit);
    const finalUnit=document.createElement('div');finalUnit.className='coefficient-unit';const label=document.createElement('label');
    const labelMath=document.createElement('span');if(part)math(labelMath,part);else labelMath.textContent='constante';const input=makeInput(`result-${i}`,`Coeficiente final de ${name}`,`result-feedback-${i}`);
    label.append(input,labelMath);const finalMessage=document.createElement('p');finalMessage.id=`result-feedback-${i}`;finalMessage.className='coefficient-feedback';finalUnit.append(label,finalMessage);$('tri-results').append(finalUnit);
  });preview();if(focus)$('group-0-a').focus({preventScroll:true});
}
$('tri-form').addEventListener('submit',event=>{
  event.preventDefault();let allCorrect=true,firstInvalid;
  tri.parts.forEach((base,i)=>{
    const a=read(`group-${i}-a`),b=read(`group-${i}-b`),result=read(`result-${i}`);
    const groupedOk=a!==null && b!==null && validGroup(a,b,tri.left,tri.right,base);
    const expected=[...tri.left,...tri.right].filter(t=>key(t.base)===key(base)).reduce((sum,t)=>sum+t.c,0);
    const resultOk=result!==null && result===expected;
    for(const [ids,correct,messageId,message] of [
      [[`group-${i}-a`,`group-${i}-b`],groupedOk,`group-feedback-${i}`,'Busca los dos coeficientes de esta parte literal, con sus signos.'],
      [[`result-${i}`],resultOk,`result-feedback-${i}`,'Suma los coeficientes de esta parte literal.']]) {
      ids.forEach(id=>{$(id).dataset.result=correct?'correct':'incorrect';$(id).setAttribute('aria-invalid',String(!correct));if(!correct)firstInvalid||=$(id);});
      $(messageId).textContent=correct?'✓ Correcto.':'× '+message;$(messageId).dataset.result=correct?'correct':'incorrect';
    }
    allCorrect&&=groupedOk && resultOk;
  });
  showFeedback($('tri-feedback'),allCorrect?'✓ ¡Correcto! Agrupaste y sumaste los términos semejantes.':'× Revisa los campos señalados. Usa enteros con su signo.',allCorrect?'correct':'incorrect');
  $('tri-solution').hidden=!allCorrect;if(allCorrect)math($('tri-solution'),`${polynomial(simplified(group(tri.left,tri.right)))}`);
  firstInvalid?.focus({preventScroll:true});
});
$('new-tri').addEventListener('click',()=>newTri(true));newTri();
function newPoly(focus=false) {
  const ex=polynomials();math($('poly-left'),polynomial(ex.left));math($('poly-right'),polynomial(ex.right));
  choice($('poly-group-options'),ex.groupingOptions,$('poly-group-feedback'),'Conserva cada término y su signo; agrupa solo partes literales iguales.');
  choice($('poly-result-options'),ex.resultOptions,$('poly-result-feedback'),'Suma los coeficientes de cada grupo y conserva los términos sin pareja.');
  if(focus)$('poly-group-options').querySelector('button').focus({preventScroll:true});
}
$('new-poly').addEventListener('click',()=>newPoly(true));newPoly();
