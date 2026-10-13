import {expand,combine,product,expandedTree} from './factorizacion.mjs';
const N=n=>({op:'n',n}),V=v=>({op:'v',v}),op=(op,a,b)=>({op,a,b}),add=(a,b)=>op('+',a,b),sub=(a,b)=>op('-',a,b),mul=(a,b)=>({...op('*',a,b),brackets:true}),frac=(a,b)=>op('/',a,b),eq=(a,b)=>op('=',a,b);
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),sign=r=>r()<.5?-1:1;
const shuffle=(r,a)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=int(r,0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const one=()=>new Map([['',1n]]);
export function rational(t){
 if(t.op==='/'||t.op==='divide'){const a=rational(t.a),b=rational(t.b);if(!b.n.size)throw Error('Divisor cero');return {n:product(a.n,b.d),d:product(a.d,b.n)};}
 if(['+','-','*'].includes(t.op)){const a=rational(t.a),b=rational(t.b);return {n:t.op==='*'?product(a.n,b.n):combine(product(a.n,b.d),product(b.n,a.d),t.op==='+'?1n:-1n),d:product(a.d,b.d)};}
 return {n:expand(t),d:one()};
}
export function equivalent(a,b){a=rational(a);b=rational(b);return combine(product(a.n,b.d),product(b.n,a.d),-1n).size===0;}
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;};
function options(r,correct,candidates){const out=[{expression:correct,correct:true}];for(const expression of candidates){if(!out.some(o=>equivalent(o.expression,expression)))out.push({expression,correct:false});if(out.length===4)break;}if(out.length!==4)throw Error('Opciones insuficientes');return shuffle(r,out);}
const linear=p=>p===0?V('x'):p>0?add(V('x'),N(p)):sub(V('x'),N(-p));
const poly=coeff=>new Map(coeff.flatMap((c,i)=>c?[['x'.repeat(i),BigInt(c)]]:[]));
function reduced(coeff,roots){coeff=[...coeff];roots=[...roots];for(let i=roots.length-1;i>=0;i--){const p=roots[i];let rem=0;for(let j=coeff.length-1;j>=0;j--)rem=rem*(-p)+coeff[j];if(rem===0){const q=Array(coeff.length-1).fill(0);q[q.length-1]=coeff.at(-1);for(let j=q.length-2;j>=0;j--)q[j]=coeff[j+1]-p*q[j+1];coeff=q;roots.splice(i,1);}}
 const numerator=expandedTree(poly(coeff));return roots.length?frac(numerator,roots.map(linear).reduce(mul)):numerator;
}
function monomial(c,powers){const m=new Map([[Object.entries(powers).map(([v,p])=>v.repeat(p)).join('').split('').sort().join(''),BigInt(c)]]);return expandedTree(m);}
function monoResult(n,d,powers){const g=gcd(n,d);n/=g;d/=g;if(d<0){n=-n;d=-d;}const pos={},neg={};for(const [v,p] of Object.entries(powers)){if(p>0)pos[v]=p;if(p<0)neg[v]=-p;}const a=monomial(n,pos),b=monomial(d,neg);return d===1&&!Object.keys(neg).length?a:frac(a,b);}
export function algebraFractionProblem(level,r=Math.random){
 let expression,correct,condition,meta={};
 if(level===26){
  const p=int(r,-5,5);let q=int(r,-5,5);if(q===p)q=q===5?-5:q+1;
  const a=int(r,1,5)*sign(r),b=int(r,1,5)*sign(r),third=r()<.5,c=third?int(r,1,4)*sign(r):0;
  const common=mul(linear(p),linear(q));expression=add(frac(N(a),linear(p)),frac(N(b),linear(q)));if(third)expression=add(expression,frac({op:'*',a:N(c),b:V('x')},common));
  const coeff=[a*q+b*p,a+b+c];correct=reduced(coeff,[p,q]);meta={p,q,a,b,c,coeff};condition=`Dominio original: x ≠ ${-p} y x ≠ ${-q}.`;
 }else if(level===27||level===28){
  const letters=shuffle(r,['x','y','a','b','m','n']).slice(0,int(r,2,3));const P={},Q={};for(const v of letters){P[v]=int(r,1,4);Q[v]=int(r,1,4);}
  const factor=int(r,2,6),a=int(r,1,7),b=int(r,1,7);condition='Supón que todas las variables que aparecen son distintas de cero.';
  if(level===27){expression=frac(monomial(a*factor,P),monomial(b*factor,Q));const powers=Object.fromEntries(letters.map(v=>[v,P[v]-Q[v]]));correct=monoResult(a,b,powers);meta={powers};}
  else{const R={},S={};for(const v of letters){R[v]=int(r,1,4);S[v]=int(r,1,4);}const c=int(r,1,7),d=int(r,1,7),division=r()<.5;
   const left=frac(monomial(a*factor,P),monomial(b,Q)),right=frac(monomial(c,R),monomial(d*factor,S));
   // El factor común numérico y las potencias positivas garantizan cancelación.
   expression=division?op('divide',left,right):mul(left,right);
   const powers=Object.fromEntries(letters.map(v=>[v,P[v]-Q[v]+(division?S[v]-R[v]:R[v]-S[v])]));correct=monoResult(division?a*d*factor*factor:a*c,division?b*c:b*d,powers);meta={division,powers};
  }
 }else if(level===29){
  const root=int(r,-6,6);let p=int(r,-5,5),q=int(r,-5,5);while(p===-root)p=int(r,-5,5);while(q===p||q===-root)q=int(r,-5,5);
  const common=mul(linear(p),linear(q)),a=int(r,1,5),b=int(r,1,5),variant=int(r,0,1);
  let slope,constant;
  if(variant===0){const c=(a+b)*root+a*q+b*p;if(c===0)return algebraFractionProblem(level,r);expression=eq(add(frac(N(a),linear(p)),frac(N(b),linear(q))),frac(N(c),common));slope=a+b;constant=a*q+b*p-c;}
  else{const k=b+int(r,1,4),d=(b-k)*root+b*q;expression=eq(frac(expandedTree(poly([d,k])),common),frac(N(b),linear(p)));slope=k-b;constant=d-b*q;}
  correct=N(root);meta={root,p,q,slope,constant,variant};condition=`Dominio original: x ≠ ${-p} y x ≠ ${-q}.`;
 }else throw Error('Nivel no válido');
 // Diferencias constantes no nulas garantizan distractores no equivalentes.
 const candidates=[];for(const delta of shuffle(r,[-3,-2,-1,1,2,3])){if(level===29){const v=meta.root+delta;if(v===-meta.p||v===-meta.q)continue;candidates.push(N(v));}else if(level===26){candidates.push(reduced([meta.coeff[0]+delta,meta.coeff[1]],[meta.p,meta.q]));}else{const result=rational(correct),n=Number([...result.n.values()][0]),d=Number([...result.d.values()][0]);candidates.push(monoResult(n+delta*d,d,meta.powers));}}
 if(level===29)for(let i=7;candidates.length<3;i++)candidates.push(N(meta.root+i));
 return {id:JSON.stringify(expression),level,expression,condition,meta,steps:[{prompt:level===29?'¿Cuánto vale x?':'Elige el resultado simplificado.',options:options(r,correct,candidates)}],explanation:level===29?'Multiplica ambos lados por el denominador común, resuelve la ecuación lineal y verifica que x pertenezca al dominio original.':'Conserva las restricciones del dominio original. Opera los numeradores y denominadores y cancela únicamente factores comunes, nunca términos de una suma.'};
}
