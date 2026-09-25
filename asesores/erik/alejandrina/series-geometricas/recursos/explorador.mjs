import {fraction,fractionTex,fractionSequence,numberFraction} from './fracciones.mjs';
import {parseNumber} from './modelo.mjs';
import {math,formula,renderMath,escape} from './ui.mjs';

export function mountExplorer(host){
  const widget=document.createElement('section');widget.className='explorer';
  let fractions=false;
  const field=(id,title,value)=>`<div class="explorer-value"><span class="value-symbol">${title} =</span>${fractions?`<div class="fraction-control"><input id="${id}-p" value="${value.p}" maxlength="16" aria-label="Numerador de ${title}"><span class="fraction-bar" aria-hidden="true"></span><input id="${id}-q" value="${value.q}" maxlength="16" aria-label="Denominador de ${title}"></div>`:`<input id="${id}" value="${escape(value.q===1n?String(value.p):`${value.p}/${value.q}`)}" maxlength="32" aria-label="${title}">`}</div>`;
  widget.innerHTML=`<h2>Recorre los saltos</h2><button type="button" id="fraction-mode" aria-pressed="false" aria-controls="explorer-values">Usar fracciones</button><div class="explorer-settings" id="explorer-values"></div><label for="position">Posición <output id="position-value">1</output></label><input id="position" type="range" min="1" max="7" value="1"><p id="walk-feedback" role="status"></p><div id="walk"></div>`;
  host.before(widget);
  const settings=(a,r)=>{widget.querySelector('#explorer-values').innerHTML=field('walk-a','a₁',a)+field('walk-r','r',r);};
  settings(fraction(2),fraction(2));
  function readValues(){
    const values={};
    for(const id of fractions?['walk-a-p','walk-a-q','walk-r-p','walk-r-q']:['walk-a','walk-r']){
      const input=widget.querySelector('#'+id),text=input.value.trim();input.removeAttribute('aria-invalid');
      if(fractions){
        if(!/^[+-]?\d{1,15}$/.test(text)){input.setAttribute('aria-invalid','true');throw Error('Completa el numerador y el denominador con números enteros.');}
        values[id]=BigInt(text);
        if(id.endsWith('-q')&&values[id]===0n){input.setAttribute('aria-invalid','true');throw Error('El denominador no puede ser cero.');}
      }else{
        const value=parseNumber(text);
        if(value===null||Math.abs(value)>10000){input.setAttribute('aria-invalid','true');throw Error('Escribe un número válido entre −10000 y 10000.');}
        values[id]=numberFraction(value);
      }
    }
    return fractions?[fraction(values['walk-a-p'],values['walk-a-q']),fraction(values['walk-r-p'],values['walk-r-q'])]:[values['walk-a'],values['walk-r']];
  }
  function draw(){
    const n=Number(widget.querySelector('#position').value);widget.querySelector('output').textContent=String(n);
    const feedback=widget.querySelector('#walk-feedback'),walk=widget.querySelector('#walk');
    let a,r;try{[a,r]=readValues();}catch(error){feedback.textContent=error.message;walk.innerHTML='';return;}
    const terms=fractionSequence(a,r,n),at=fractionTex(a),rt=fractionTex(r);
    feedback.textContent='';
    walk.innerHTML=`<div class="sequence fraction-walk">${terms.map((t,i)=>`<div class="walk-term"><small>Posición ${i+1}</small><span class="term ${i===n-1?'current':''}">${math(fractionTex(t))}</span></div>`).join(`<span class="jump">${math(`\\times\\left(${rt}\\right)`)}</span>`)}</div>${formula(n===1?`a_1=${at}`:`a_${n}=\\left(${at}\\right)\\cdot\\left(${rt}\\right)^{${n-1}}=${fractionTex(terms.at(-1))}`)}<p>${n-1} ${n===2?'salto':'saltos'} desde el primer término.</p>`;
    renderMath(walk);
  }
  widget.querySelector('#fraction-mode').addEventListener('click',()=>{
    let values;try{values=readValues();}catch(error){widget.querySelector('#walk-feedback').textContent=error.message;return;}
    fractions=!fractions;settings(...values);
    const button=widget.querySelector('#fraction-mode');button.textContent=fractions?'Usar campos simples':'Usar fracciones';button.setAttribute('aria-pressed',String(fractions));draw();
  });
  widget.addEventListener('input',draw);draw();
}
