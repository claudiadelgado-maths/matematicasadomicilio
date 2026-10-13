import {rat,mul,div,same,decimal} from '../motor.mjs';
export {mul,div,same};
export const q=(n,d=1)=>rat(BigInt(n),BigInt(d));
export const add=(a,b)=>rat(a.n*b.d+b.n*a.d,a.d*b.d);
export const neg=a=>rat(-a.n,a.d);
export const N=(n,format='fraction')=>({op:'n',value:typeof n==='object'?n:q(n),format});
export const V=name=>({op:'v',name});
export const A=(a,b)=>({op:'+',a,b}),S=(a,b)=>({op:'-',a,b}),M=(a,b)=>({op:'*',a,b}),D=(a,b)=>({op:'/',a,b}),P=(a,b)=>({op:'^',a,b:typeof b==='number'?N(b):b});
export function evaluate(t,values={}){if(t.op==='n')return t.value;if(t.op==='v'){if(!values[t.name])throw Error(`Falta ${t.name}`);return values[t.name];}const a=evaluate(t.a,values),b=evaluate(t.b,values);if(t.op==='+')return add(a,b);if(t.op==='-')return add(a,neg(b));if(t.op==='*')return mul(a,b);if(t.op==='/')return div(a,b);if(b.d!==1n||b.n>30n||b.n< -30n)throw Error('Exponente no permitido');if(!a.n&&b.n<=0n)throw Error('Potencia indefinida');const k=b.n<0n?-b.n:b.n;const r=rat(a.n**k,a.d**k);return b.n<0n?div(q(1),r):r;}
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function fraction(a,b){return `<span class="math-frac"><span>${a}</span><span>${b}</span></span>`;}
export function number(r,format='fraction',tex=false){
  if(format==='decimal'){const d=decimal(r,50);return `${d.sign==='−'?'-':''}${d.whole}${d.fraction?'.'+d.fraction:''}`;}
  const sign=r.n<0n?'-':'',n=r.n<0n?-r.n:r.n;
  return r.d===1n?String(r.n):sign+(tex?`\\frac{${n}}{${r.d}}`:fraction(n,r.d));
}
export function render(t,tex=false,values=null){
  const par=s=>tex?`\\left(${s}\\right)`:`(${s})`;
  if(t.op==='n')return number(t.value,t.format,tex);
  if(t.op==='v')return values?par(number(values[t.name],'fraction',tex)):escape(t.name);
  const a=render(t.a,tex,values),b=render(t.b,tex,values),group=(n,s)=>['+','-'].includes(n.op)||(n.op==='n'&&n.value.n<0n)?par(s):s;
  if(t.op==='/')return tex?`\\frac{${a}}{${b}}`:fraction(a,b);
  if(t.op==='^'){const base=t.a.op==='v'||(t.a.op==='n'&&t.a.value.n>=0n&&t.a.value.d===1n)?a:par(a);return tex?`${base}^{${b}}`:`${base}<sup>${b}</sup>`;}
  if(t.op==='*')return group(t.a,a)+(tex?'\\cdot ':' · ')+group(t.b,b);
  return a+(t.op==='+'?' + ':' − ')+group(t.b,b);
}
export function math(t,values=null){const tex=render(t,true,values);if(globalThis.katex)try{return `<span class="math">${globalThis.katex.renderToString('\\displaystyle '+tex,{throwOnError:true,trust:false})}</span>`;}catch{}return `<span class="math native-math">${render(t,false,values)}</span>`;}
export const chain=steps=>steps.map(t=>math(t)).join('<span class="equals"> = </span>');
