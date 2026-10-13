import {parseNumber,accepts,term,texnum} from './modelo.mjs';
import {escape,math,formula,renderMath,focus} from './ui.mjs';

export function mountBuilder(host,problem,state,save,complete,moveFocus){
  const calculating=problem.topic==='termino';
  const keys=calculating?['a','r','n']:['a','r'];
  const labels={a:'Primer término a₁',r:'Razón r',n:'Posición n'};
  state.fields??={a:'',r:'',n:''};
  const {a,r,n}=problem.data;
  const sequence=[a,a*r,a*r*r];
  host.querySelector('#guided').innerHTML=`<div class="case-stem">${calculating?problem.stem:`Construye la fórmula de la sucesión ${sequence.map(v=>math(texnum(v))).join(', ')}, …`}</div><h3 id="active-step" tabindex="-1">${calculating?'Completa los datos y calcula':'Construye tu fórmula'}</h3><form id="builder" novalidate><div class="formula-fields"><span aria-hidden="true">a${calculating?'ₙ':'ₙ'} =</span><label>${labels.a}<input name="a" aria-label="${labels.a}" value="${escape(state.fields.a)}" autocomplete="off" maxlength="80"></label><span aria-hidden="true">× (</span><label>${labels.r}<input name="r" aria-label="${labels.r}" value="${escape(state.fields.r)}" autocomplete="off" maxlength="80"></label><span aria-hidden="true">)</span><div class="exponent-fields">${calculating?`<label>${labels.n}<input name="n" aria-label="${labels.n}" value="${escape(state.fields.n)}" inputmode="numeric" autocomplete="off" maxlength="8"></label><span aria-hidden="true">− 1</span>`:'<span aria-label="exponente n menos uno">n − 1</span>'}</div></div><div id="live-formula" aria-label="Vista previa de la fórmula"></div><button type="submit" class="primary">${calculating?'Calcular':'Comprobar fórmula'}</button><div id="builder-result" role="status" aria-live="polite"></div></form>`;
  const form=host.querySelector('#builder');
  function preview(){
    const value=k=>{const parsed=parseNumber(state.fields[k]);return parsed===null?'\\square':texnum(parsed);};
    host.querySelector('#live-formula').innerHTML=formula(`a_{${calculating?value('n'):'n'}}=${value('a')}\\cdot\\left(${value('r')}\\right)^{${calculating?value('n'):'n'}-1}`);
    renderMath(host.querySelector('#live-formula'));
  }
  form.addEventListener('input',()=>{
    for(const k of keys)state.fields[k]=form.elements[k].value;
    host.querySelector('#builder-result').textContent='';host.querySelector('#practice-feedback').textContent='';
    form.querySelectorAll('input').forEach(el=>el.removeAttribute('aria-invalid'));
    preview();save();
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const result=host.querySelector('#builder-result');
    for(const k of keys){
      const input=form.elements[k],value=parseNumber(input.value);
      if(value===null||(k==='n'&&(!Number.isInteger(value)||value<1))){result.textContent=k==='n'?'Completa n con una posición entera positiva.':'Completa todas las casillas con números válidos.';input.setAttribute('aria-invalid','true');input.focus();return;}
      if(!accepts({answer:{a,r,n}[k]},input.value)){result.textContent=`Revisa ${labels[k]}. Debe corresponder a la sucesión del ejercicio.`;input.setAttribute('aria-invalid','true');input.focus();return;}
    }
    const value=term(a,r,n);
    result.innerHTML=calculating?`<p>¡Datos correctos!</p>${formula(`a_${n}=${texnum(a)}\\cdot(${texnum(r)})^{${n-1}}=${texnum(value)}`)}`:`<p>¡Fórmula correcta! Puedes usarla para cualquier posición.</p>${formula(`a_n=${texnum(a)}\\cdot(${texnum(r)})^{n-1}`)}`;
    renderMath(result);complete();save();
  });
  preview();renderMath(host);if(moveFocus)focus('#active-step');
}
