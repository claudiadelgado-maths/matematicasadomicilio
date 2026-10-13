import {decimal,flat} from './motor.mjs';
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const signed=n=>String(n).replace('-','−');
export const fraction=(a,b)=>`<span class="small-fraction"><span>${a}</span><span>${b}</span></span>`;
export function coefficient(t){
  if(t.literal)return esc(t.literal).replace('-','−');
  if(t.places===2){const n=(t.a.n<0n?-t.a.n:t.a.n)*100n/t.a.d;return `${t.a.n<0n?'−':''}${n/100n}.${String(n%100n).padStart(2,'0')}`;}
  try{const d=decimal(t.a,t.kind==='decimal'?350:35);return `${d.sign}${d.whole}${d.fraction||d.repeat?'.':''}${d.fraction}${d.repeat?`<span class="repeating" title="Cifras periódicas">${d.repeat}</span>`:''}`;}catch{return fraction(signed(t.a.n),t.a.d);}
}
export function formula(t){
  if(t.type){const inside=t.children.map(c=>`(${formula(c)})`).join('<span class="times"> · </span>');return `<span class="number">${t.type==='absolute'?`|${inside}|`:`[${inside}]<sup>${signed(t.p)}</sup>`}</span>`;}
  return `<span class="number">${coefficient(t)}${t.kind==='sci'?`<span class="times"> × </span>10<sup>${signed(t.b)}</sup>`:''}</span>`;
}
export const product=ts=>ts.length?ts.map(t=>`(${formula(t)})`).join('<span class="times"> · </span>'):'1';
export function expression(s){return `<span class="history-expression"><span>${product(s.top)}</span>${s.bottom.length?`<span class="history-denominator">${product(s.bottom)}</span>`:''}</span>`;}
export function procedure(steps){return steps.map(step=>{
  if(step.type==='combine'){
    const cp=ts=>ts.length?ts.map(t=>`(${coefficient(t)})`).join(' × '):'1';
    const ep=ts=>ts.length?ts.map(t=>`(${signed(t.b)})`).join(' + '):'0';
    return `<p>Coeficientes</p><div class="number">${step.denom.length?fraction(cp(step.numer),cp(step.denom)):cp(step.numer)} = ${coefficient(step.result)}</div><p>Potencias de diez</p><div class="number">10<sup>${ep(step.numer)}${step.denom.length?` − [${ep(step.denom)}]`:''}</sup> = 10<sup>${signed(step.result.b)}</sup></div><p>Resultado de la selección</p>${formula(step.result)}`;
  }
  if(step.type==='power'){
    // Preserve the sign of the product; absolute is not part of this intermediate calculation.
    const base=flat({type:'power',p:1,children:step.before.children});
    return `<div class="step-equation">${formula(step.before)} <span>=</span> <span class="number">(${coefficient(base)})<sup>${signed(step.before.p)}</sup>${base.kind==='sci'?` × 10<sup>(${signed(base.b)}) · (${signed(step.before.p)})</sup>`:''}</span> <span>=</span> ${formula(step.result)}</div>`;
  }
  if(step.type==='absolute')return `<div class="step-equation">${formula(step.before)} <span>=</span> ${formula(step.result)}</div>`;
  if(step.type==='cancel')return `<div class="number">${fraction(`<s>${formula(step.before)}</s>`,`<s>${formula(step.before)}</s>`)} = 1</div>`;
  return '';
}).join('');}
