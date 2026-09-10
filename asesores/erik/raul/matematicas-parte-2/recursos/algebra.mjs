// Polinomios exactos con coeficientes enteros; ninguna expresión se evalúa como código.
export const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
export const pick=a=>a[rnd(0,a.length-1)];
export const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
export const mono=(c=1,p={})=>({c,p:Object.fromEntries(Object.entries(p).filter(([,v])=>v).sort())});
const key=m=>JSON.stringify(m.p);
export const degree=m=>Object.values(m.p).reduce((a,b)=>a+b,0);
export const ordered=a=>[...a].sort((a,b)=>degree(b)-degree(a)||key(a).localeCompare(key(b)));
export function norm(a){const map=new Map();for(const m of a){const k=key(m);map.set(k,mono((map.get(k)?.c||0)+m.c,m.p));}return ordered([...map.values()].filter(m=>m.c));}
export const eq=(a,b)=>JSON.stringify(norm(a))===JSON.stringify(norm(b));
export const mulM=(a,b)=>mono(a.c*b.c,Object.fromEntries([...new Set([...Object.keys(a.p),...Object.keys(b.p)])].map(v=>[v,(a.p[v]||0)+(b.p[v]||0)])));
export const scale=(a,k)=>a.map(m=>mono(m.c*k,m.p));
export const add=(...a)=>norm(a.flat());
export const mul=(a,b)=>norm(a.flatMap(x=>b.map(y=>mulM(x,y))));
export const pow=(a,n)=>{let r=[mono()];for(let i=0;i<n;i++)r=mul(r,a);return r;};
export const powM=(a,n)=>mono(a.c**n,Object.fromEntries(Object.entries(a.p).map(([v,e])=>[v,e*n])));
export function divide(a,b){if(!b.c||a.c%b.c||Object.keys(b.p).some(v=>(a.p[v]||0)<b.p[v]))return null;return mono(a.c/b.c,Object.fromEntries(Object.entries(a.p).map(([v,e])=>[v,e-(b.p[v]||0)])));}
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
export function common(a){return mono(a.reduce((n,m)=>gcd(n,m.c),0),Object.fromEntries(Object.keys(a[0].p).map(v=>[v,Math.min(...a.map(m=>m.p[v]||0))])));}
export const unit=m=>m.c===1&&!Object.keys(m.p).length;
export function mt(m){if(m.c===0)return '0';const letters=Object.entries(m.p).map(([v,e])=>v+(e===1?'':`^{${e}}`)).join('');return (m.c===-1&&letters?'-':m.c===1&&letters?'':String(m.c))+letters;}
export function tex(a){return a.length?a.map((m,i)=>(i&&m.c>0?'+':'')+mt(m)).join(''):'0';}
export const product=f=>f.map(a=>a.length===1?mt(a[0]):`\\left(${tex(a)}\\right)`).join('');
export const expand=f=>f.reduce(mul,[mono()]);
const signed=()=>pick([-1,1])*rnd(1,5);
export const methods=['comun','agrupacion','tcp','diferencia','completar','monico','general','cubos'];
export const names={comun:'Factor común',agrupacion:'Agrupación',tcp:'Trinomio cuadrado perfecto',diferencia:'Diferencia de cuadrados',completar:'TCP por adición y sustracción',monico:'Trinomio x² + bx + c',general:'Trinomio ax² + bx + c',cubos:'Suma y diferencia de cubos'};
export function generate(method,hard=false){
 const numericBoxes=method==='monico'||method==='general';
 const X=mono(1,hard?pick(numericBoxes?[{x:1,y:1},{x:2,y:1},{x:3}]:[{x:1,y:1},{a:2,b:1},{m:3}]):{x:1});
 const Z=mono(1,hard?pick(numericBoxes?[{z:1},{z:2},{z:3}]:[{z:1},{c:2},{n:2}]):{});
 const A=mono(rnd(1,5),X.p),B=mono(rnd(1,5),Z.p),s=pick([-1,1]);
 let factors,expression,data={X,Z,A,B,s},steps=[];
 if(method==='comun'){
  const g=Math.random()<.16?mono():mono(rnd(2,6),hard?{x:rnd(2,4),y:1}:{x:rnd(1,2)});
  const inner=[mono(rnd(1,5),hard?{x:2,y:1}:{x:1}),mono(s*rnd(1,5)),...(hard?[mono(rnd(1,4),{z:1})]:[])];
  factors=[[g],inner];expression=inner.map(m=>mulM(m,g));data={...data,g,inner};
  const G=common(expression);steps=[['Encuentra el MCD de los coeficientes y la menor potencia de cada letra común.',mt(G)],['Divide todos los términos entre ese factor.',product([[G],expression.map(m=>divide(m,G))])]];
 }else if(method==='agrupacion'){
  const U=mono(rnd(1,5),hard?{a:2,b:3}:{a:1}),V=mono(s*rnd(1,5),hard?{n:4}:{b:1});
  const inner=hard?[mono(1,{x:2}),mono(-rnd(1,4),{x:1}),mono(1)]:[mono(1,{x:1}),mono(1,{y:1})];
  factors=[[U,V],inner];expression=[...inner.map(t=>mulM(U,t)),...inner.map(t=>mulM(V,t))];if(hard)expression=shuffle(expression);
  data={...data,U,V,inner};steps=[['Reúne los términos con el mismo factor.',`${tex(inner.map(t=>mulM(U,t)))}+\\left(${tex(inner.map(t=>mulM(V,t)))}\\right)`],['Extrae el factor de cada grupo; observa el paréntesis repetido.',`${mt(U)}(${tex(inner)})${V.c>0?'+':''}${mt(V)}(${tex(inner)})`],['Extrae ahora el paréntesis común.',product(factors)]];
 }else if(method==='tcp'){
  factors=[[A,mono(s*B.c,B.p)],[A,mono(s*B.c,B.p)]];expression=[powM(A,2),mono(2*s*A.c*B.c,mulM(A,B).p),powM(B,2)];
  steps=[['Obtén las raíces de los cuadrados.',`A=${mt(A)},\\quad B=${mt(B)}`],['Comprueba el doble producto.',`2AB=${mt(mono(2*A.c*B.c,mulM(A,B).p))}`],['El signo central determina el signo del binomio.',`(${tex(factors[0])})^2`]];
 }else if(method==='diferencia'){
  factors=[[A,mono(-B.c,B.p)],[A,B]];expression=[powM(A,2),mono(-(B.c**2),powM(B,2).p)];steps=[['Reconoce dos cuadrados separados por una resta.',`A=${mt(A)},\\quad B=${mt(B)}`],['Forma binomios conjugados: los mismos términos, signos opuestos.',product(factors)],['Los productos cruzados se cancelan.',`-${mt(mulM(A,B))}+${mt(mulM(A,B))}=0`]];
 }else if(method==='completar'){
  const P=hard?mono(rnd(1,2),X.p):mono(rnd(1,2),{[pick(['x','y','t'])]:1}),Q=hard?mono(rnd(1,3),Z.p):mono(rnd(1,4));
  const PP=powM(P,2),QQ=powM(Q,2),PQ=mulM(P,Q),missing=powM(PQ,2);
  factors=[[PP,mono(-PQ.c,PQ.p),QQ],[PP,PQ,QQ]];expression=[powM(P,4),missing,powM(Q,4)];data={...data,P,Q,PP,QQ,PQ,missing};
  steps=[['Falta una copia del término central para completar el cuadrado. Suma y resta la misma cantidad.',`${tex(expression)}+${mt(missing)}-${mt(missing)}`],['Los tres términos positivos forman un cuadrado perfecto.',`(${mt(PP)}+${mt(QQ)})^2-(${mt(PQ)})^2`],['Aplica diferencia de cuadrados.',product(factors)]];
 }else if(method==='monico'||method==='general'){
  let m=method==='monico'?1:rnd(2,5),p=method==='monico'?1:rnd(1,4),n=signed(),q=signed();while(m*q+p*n===0)q=signed();
  factors=[[mono(m,X.p),mono(n,Z.p)],[mono(p,X.p),mono(q,Z.p)]];
  const a=m*p,b=m*q+p*n,c=n*q;expression=[mono(a,powM(X,2).p),mono(b,mulM(X,Z).p),mono(c,powM(Z,2).p)];data={...data,m,p,n,q,a,b,c};
  steps=method==='monico'?[['Busca dos coeficientes con esta suma y este producto.',`p+q=${b},\\quad pq=${c}`],['Esta pareja cumple ambas condiciones.',`${n}+(${q})=${b},\\quad (${n})(${q})=${c}`],['Forma los dos binomios.',product(factors)]]:[['Identifica los coeficientes respecto a las bases.',`X=${mt(X)},\\quad Z=${mt(Z)},\\quad a=${a},b=${b},c=${c}`],['Encuentra los productos de las filas.',`(${m})(${p})=${a},\\quad (${n})(${q})=${c}`],['Comprueba los productos cruzados.',`(${m})(${q})+(${p})(${n})=${b}`],['Lee cada columna como un binomio.',product(factors)]];
 }else if(method==='cubos'){
  factors=[[A,mono(s*B.c,B.p)],[powM(A,2),mono(-s*A.c*B.c,mulM(A,B).p),powM(B,2)]];expression=[powM(A,3),mono(s*B.c**3,powM(B,3).p)];steps=[['Extrae las raíces cúbicas.',`A=${mt(A)},\\quad B=${mt(B)}`],[s===1?'Es una suma de cubos.':'Es una diferencia de cubos.',`A^3${s===1?'+':'-'}B^3`],['Primer signo igual, signo central contrario, último signo positivo.',product(factors)]];
 }else throw Error('Método desconocido');
 return {method,hard,expression,factors,data,steps,answer:product(factors)};
}
export function challenge(hard=false){let r;do{r=generate(pick(methods),hard);}while(r.method==='comun'&&unit(common(r.expression)));
 const wrong=[];for(let i=0;wrong.length<2&&i<100;i++){const f=structuredClone(r.factors),j=rnd(0,f.length-1),k=rnd(0,f[j].length-1);f[j][k].c=i%2?-f[j][k].c:f[j][k].c+pick([-2,-1,1,2]);if(!f[j][k].c||eq(expand(f),r.expression)||wrong.some(w=>eq(expand(w),expand(f))))continue;wrong.push(f);}
 return {...r,options:shuffle([r.factors,...wrong])};
}
export function grouping(terms,indices){const selected=terms.filter((_,i)=>indices.includes(i)),rest=terms.filter((_,i)=>!indices.includes(i));if(selected.length<2||rest.length<2)return null;let g=common(selected),h=common(rest);const normalize=(arr,f)=>{let q=arr.map(m=>divide(m,f));if(norm(q)[0].c<0){f=mono(-f.c,f.p);q=scale(q,-1);}return {f,q};};const a=normalize(selected,g),b=normalize(rest,h);return eq(a.q,b.q)?{groups:[selected,rest],factors:[a.f,b.f],inner:a.q}:null;}
