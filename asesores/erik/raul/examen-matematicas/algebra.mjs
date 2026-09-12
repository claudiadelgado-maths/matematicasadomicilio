// Coeficientes racionales y polinomios de dos variables. Sin eval ni comparación por muestreo.
const abs=n=>n<0n?-n:n;
export function r(n,d=1){n=BigInt(n);d=BigInt(d);if(!d)throw Error('Un denominador vale 0.');if(d<0n){n=-n;d=-d}let a=abs(n),b=d;while(b)[a,b]=[b,a%b];a||=1n;return {n:n/a,d:d/a};}
export const add=(a,b)=>r(a.n*b.d+b.n*a.d,a.d*b.d),mul=(a,b)=>r(a.n*b.n,a.d*b.d),neg=a=>r(-a.n,a.d),div=(a,b)=>r(a.n*b.d,a.d*b.n),eq=(a,b)=>a.n===b.n&&a.d===b.d;
export const scalar=a=>typeof a==='object'?a:r(a);
export function parse(s){s=String(s).trim().replace('−','-').replace(',','.');if(s.length>24)throw Error('Usa un valor de hasta 24 caracteres.');if(/^[-+]?\d+\/[+-]?\d+$/.test(s)){const [a,b]=s.split('/');const v=r(a,b);if(abs(v.n)>1000n*v.d)throw Error('Prueba valores entre −1000 y 1000.');return v;}if(!/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(s))throw Error('Escribe un entero, decimal o fracción, por ejemplo −2, 0.5 o 1/3.');const [a,b='']=s.split('.');const v=r((a+b).replace('+',''),10n**BigInt(b.length));if(abs(v.n)>1000n*v.d)throw Error('Prueba valores entre −1000 y 1000.');return v;}
export const plain=a=>`${a.n}${a.d===1n?'':`/${a.d}`}`;
export const rationalTex=a=>a.d===1n?String(a.n):`${a.n<0n?'-':''}\\frac{${abs(a.n)}}{${a.d}}`;
export function poly(terms){const out={};for(const [a,x=0,y=0] of terms){const k=`${x},${y}`;out[k]=add(out[k]||r(0),scalar(a));if(!out[k].n)delete out[k];}return out;}
export const constant=a=>poly([[a]]),X=poly([[1,1]]),Y=poly([[1,0,1]]),ONE=constant(1);
export function plus(a,b){return poly([...Object.entries(a),...Object.entries(b)].map(([k,c])=>[c,...k.split(',').map(Number)]));}
export const scale=(p,c)=>poly(Object.entries(p).map(([k,a])=>[mul(a,scalar(c)),...k.split(',').map(Number)]));
export const minus=(a,b)=>plus(a,scale(b,-1));
export function times(a,b){const ts=[];for(const [k,c]of Object.entries(a))for(const [l,d]of Object.entries(b)){const [x,y]=k.split(',').map(Number),[u,v]=l.split(',').map(Number);ts.push([mul(c,d),x+u,y+v]);}return poly(ts);}
export function power(p,k){let out=ONE;for(let i=0;i<k;i++)out=times(out,p);return out;}
export const equalPoly=(a,b)=>Object.keys(minus(a,b)).length===0;
export const degree=p=>Math.max(-1,...Object.keys(p).map(k=>k.split(',').map(Number).reduce((a,b)=>a+b,0)));
export function evaluatePoly(p,values){let out=r(0);for(const [k,c]of Object.entries(p)){const exps=k.split(',').map(Number);let term=c;exps.forEach((e,i)=>{const v=values[i]||r(0);term=mul(term,r(v.n**BigInt(e),v.d**BigInt(e)));});out=add(out,term);}return out;}
export const P=p=>({kind:'poly',p}),F=(n,d)=>({kind:'fraction',n:P(n),d:P(d)}),S=items=>({kind:'sum',items});
export function symbolic(e){if(e.kind==='poly')return {n:e.p,d:ONE};if(e.kind==='fraction'){const a=symbolic(e.n),b=symbolic(e.d);return {n:times(a.n,b.d),d:times(a.d,b.n)};}return e.items.reduce((acc,{sign,node})=>{const v=symbolic(node);return {n:plus(times(acc.n,v.d),scale(times(v.n,acc.d),sign)),d:times(acc.d,v.d)}},{n:constant(0),d:ONE});}
export function equivalent(a,b){const x=symbolic(a),y=symbolic(b);return equalPoly(times(x.n,y.d),times(y.n,x.d));}
export function evaluate(e,v){if(e.kind==='poly')return evaluatePoly(e.p,v);if(e.kind==='fraction')return div(evaluate(e.n,v),evaluate(e.d,v));return e.items.reduce((s,item)=>add(s,mul(r(item.sign),evaluate(item.node,v))),r(0));}
export function denominators(e){if(e.kind==='poly')return [];if(e.kind==='fraction')return [e.d,...denominators(e.n),...denominators(e.d)];return e.items.flatMap(i=>denominators(i.node));}
export function entries(p,reverse=false){const a=Object.entries(p).sort(([a],[b])=>{const [x,y]=a.split(',').map(Number),[u,v]=b.split(',').map(Number);return u+v-x-y||u-x});return reverse?a.reverse():a;}
export function polyTex(p,vars=['x','y'],values=null,reverse=false){
  if(!Object.keys(p).length)return '0';
  return entries(p,reverse).map(([key,c],i)=>{const exps=key.split(',').map(Number),has=exps.some(Boolean),magnitude=r(abs(c.n),c.d);let str=(c.n<0n?'-':i?'+':'')+(has&&eq(magnitude,r(1))?'':rationalTex(magnitude));exps.forEach((e,j)=>{if(e){const base=values?`\\left(${rationalTex(values[j])}\\right)`:vars[j];str+=base+(e===1?'':`^{${e}}`);}});return str;}).join(' ');
}
export function latex(e,vars=['x','y'],values=null){if(e.kind==='poly')return polyTex(e.p,vars,values,e.reverse);if(e.kind==='fraction')return `\\frac{${latex(e.n,vars,values)}}{${latex(e.d,vars,values)}}`;return e.items.map(({sign,node},i)=>(sign<0?'-':i?'+':'')+latex(node,vars,values)).join(' ');}
// MathML fallback: the same tree remains legible if the optional KaTeX CDN is unavailable.
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function rationalML(a){return a.d===1n?`<mn>${a.n}</mn>`:`<mrow>${a.n<0n?'<mo>−</mo>':''}<mfrac><mn>${abs(a.n)}</mn><mn>${a.d}</mn></mfrac></mrow>`;}
export function mathML(e,vars=['x','y'],values=null){
  if(e.kind==='fraction')return `<mfrac>${mathML(e.n,vars,values)}${mathML(e.d,vars,values)}</mfrac>`;
  if(e.kind==='sum')return `<mrow>${e.items.map(({sign,node},i)=>`${sign<0?'<mo>−</mo>':i?'<mo>+</mo>':''}${mathML(node,vars,values)}`).join('')}</mrow>`;
  return `<mrow>${entries(e.p,e.reverse).map(([k,c],i)=>{const es=k.split(',').map(Number),mag=r(abs(c.n),c.d);return `${c.n<0n?'<mo>−</mo>':i?'<mo>+</mo>':''}${es.some(Boolean)&&eq(mag,r(1))?'':rationalML(mag)}${es.map((v,j)=>{if(!v)return '';const base=values?`<mrow><mo>(</mo>${rationalML(values[j])}<mo>)</mo></mrow>`:`<mi>${xml(vars[j])}</mi>`;return v===1?base:`<msup>${base}<mn>${v}</mn></msup>`;}).join('')}`;}).join('')||'<mn>0</mn>'}</mrow>`;
}
