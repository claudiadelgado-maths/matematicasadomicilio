import {letters,flat} from './motor.mjs';
export {esc,signed} from '../vista.mjs';
import {esc,signed,fraction} from '../vista.mjs';
export const coefficient=t=>`<span class="coef">${t.a.d===1n?signed(t.a.n):fraction(signed(t.a.n),String(t.a.d))}</span>`;
export function formula(t){
  if(t.type)return `<span class="number">[${t.children.map(formula).join(' · ')}]<sup>${signed(t.p)}</sup></span>`;
  const vars=letters.filter(v=>t.vars[v]!==0);
  const c=vars.length&&t.a.d===1n&&(t.a.n===1n||t.a.n===-1n)?(t.a.n<0n?'−':''):coefficient(t);
  return `<span class="number">${c}${vars.map(v=>`<span class="var-${v}"><i>${v}</i>${t.vars[v]!==1?`<sup>${signed(t.vars[v])}</sup>`:''}</span>`).join('')}</span>`;
}
export const product=ts=>ts.length?ts.map(t=>`(${formula(t)})`).join(' · '):'1';
export const expression=s=>`<span class="history-expression"><span>${product(s.top)}</span>${s.bottom.length?`<span class="history-denominator">${product(s.bottom)}</span>`:''}</span>`;
export function procedure(steps){return steps.map(s=>{
  if(s.type==='cancel')return `<div class="number">${fraction(formula(s.before),formula(s.before))} = 1</div><p>Las letras siguen siendo distintas de cero.</p>`;
  if(s.type==='power'){
    const base=flat({...s.before,p:1});return `<div class="step-equation">${formula(s.before)} = ${formula(s.result)}</div><p>Coeficiente</p><div class="number">(${coefficient(base)})<sup>${signed(s.before.p)}</sup> = ${coefficient(s.result)}</div>${letters.filter(v=>base.vars[v]).map(v=>`<p>Variable ${v}</p><div class="number var-${v}">${v}<sup>(${signed(base.vars[v])}) · (${signed(s.before.p)})</sup> = ${v}<sup>${signed(s.result.vars[v])}</sup>${s.result.vars[v]===0?' = 1':''}</div>`).join('')}`;
  }
  const cp=ts=>ts.length?ts.map(t=>`(${coefficient(t)})`).join(' · '):'1';
  const ep=(ts,v)=>ts.length?ts.map(t=>`(${signed(t.vars[v])})`).join(' + '):'0';
  return `<p>Coeficientes</p><div class="number">${s.denom.length?fraction(cp(s.numer),cp(s.denom)):cp(s.numer)} = ${coefficient(s.result)}</div>${letters.filter(v=>[...s.numer,...s.denom].some(t=>t.vars[v])).map(v=>`<p>Variable ${v}</p><div class="number var-${v}">${v}<sup>${ep(s.numer,v)}${s.denom.length?` − [${ep(s.denom,v)}]`:''}</sup> = ${v}<sup>${signed(s.result.vars[v])}</sup>${s.result.vars[v]===0?' = 1':''}</div>`).join('')}<p>Resultado de la selección</p>${formula(s.result)}`;
}).join('');}
