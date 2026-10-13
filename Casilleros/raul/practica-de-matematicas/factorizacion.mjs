// Polinomios multivariables exactos: monomio (letras ordenadas) -> BigInt.
const n=value=>({op:'n',n:value}),v=name=>({op:'v',v:name});
const add=(a,b)=>({op:'+',a,b}),sub=(a,b)=>({op:'-',a,b}),mul=(a,b)=>({op:'*',a,b,brackets:true}),square=a=>({op:'square',a});
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const shuffle=(r,a)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=int(r,0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
export const combine=(a,b,sign=1n)=>{const out=new Map(a);for(const [k,c] of b){const value=(out.get(k)||0n)+sign*c;if(value)out.set(k,value);else out.delete(k);}return out;};
export const product=(a,b)=>{let out=new Map();for(const [k,c] of a)for(const [l,d] of b)out=combine(out,new Map([[[...k,...l].sort().join(''),c*d]]));return out;};
export function expand(t){
 if(t.op==='n')return t.n?new Map([['',BigInt(t.n)]]):new Map();
 if(t.op==='v')return new Map([[t.v,1n]]);
 const a=expand(t.a);if(t.op==='neg')return new Map([...a].map(([k,c])=>[k,-c]));
 if(t.op==='square')return product(a,a);
 if(t.op==='power'){let p=new Map([['',1n]]);for(let i=0;i<t.exponent;i++)p=product(p,a);return p;}
 const b=expand(t.b);if(t.op==='*')return product(a,b);if(t.op==='+')return combine(a,b);if(t.op==='-')return combine(a,b,-1n);throw Error('Operación polinómica no soportada');
}
export const polynomialKey=t=>[...expand(t)].sort(([a],[b])=>a.localeCompare(b)).map(([k,c])=>`${k}:${c}`).join('|');
export function expandedTree(poly){
 const entries=[...poly].sort(([a],[b])=>b.length-a.length||a.localeCompare(b));let result;
 for(const [letters,c] of entries){let term;for(const letter of [...new Set(letters)]){const exponent=[...letters].filter(x=>x===letter).length;const power=exponent===1?v(letter):{op:'power',a:v(letter),exponent};term=term?{op:'*',a:term,b:power}:power;}
 const coefficient=Number(c<0n?-c:c);term=term?(coefficient===1?term:{op:'*',a:n(coefficient),b:term}):n(coefficient);
 result=result?(c<0n?sub(result,term):add(result,term)):(c<0n?{op:'neg',a:term}:term);
 }return result||n(0);
}
export function factorProblem(level,r=Math.random,type=int(r,0,5)){
 const many=level===25,signed=level>=24,letter=many?shuffle(r,['a','b','m','n','y'])[0]:null;
 const A=v('x'),B=many?v(letter):n(1),a=int(r,1,6),b=int(r,1,9),c=int(r,1,5),d=int(r,1,6);
 const s=signed?(r()<.5?-1:1):1,t=signed?-s:1;
 const scale=(k,z)=>z.op==='n'?n(k*z.n):k===1?z:{op:'*',a:n(k),b:z};
 const bin=(left,k,right)=>k<0?sub(left,scale(-k,right)):add(left,scale(k,right));
 const U=scale(a,A),V=scale(b,B);
 let correct;
 switch(type){
 case 0:correct=mul(scale(c+1,A),bin(U,s*b,B));break;
 case 1:correct=mul(bin(U,s*b,n(1)),bin(scale(c,many?B:square(A)),t*d,n(1)));break;
 case 2:correct=square(bin(U,s*b,B));break;
 case 3:correct=mul(sub(U,V),add(U,V));if(signed&&r()<.5)correct=mul(sub(V,U),add(V,U));break;
 case 4:correct=mul(bin(scale(a+1,A),s*b,B),bin(scale(c+1,A),t*d,B));break;
 case 5:correct=mul(sub(U,V),add(add(square(U),{op:'*',a:U,b:V}),square(V)));if(signed&&r()<.5)correct=mul(sub(V,U),add(add(square(V),{op:'*',a:V,b:U}),square(U)));break;
 }
 const expression=expandedTree(expand(correct)),target=polynomialKey(correct),options=[{expression:correct,correct:true}],seen=new Set([target]);
 // Alterar constantes, coeficientes y signos de los factores; descartar equivalencias exactas.
 function mutate(node){const numbers=[];const collect=q=>{if(q.op==='n'||q.op==='v')numbers.push(q);if(q.a)collect(q.a);if(q.b)collect(q.b);};collect(node);const chosen=numbers[int(r,0,numbers.length-1)];const delta=shuffle(r,[-3,-2,-1,1,2,3])[0];const copy=q=>q===chosen?(q.op==='n'?n(q.n+delta):{op:'*',a:n(delta===1?2:delta),b:q}):{...q,...(q.a?{a:copy(q.a)}:{}),...(q.b?{b:copy(q.b)}:{})};return copy(node);}
 for(let tries=0;options.length<4&&tries<200;tries++){const candidate=mutate(correct),key=polynomialKey(candidate);if(!seen.has(key)){seen.add(key);options.push({expression:clean(candidate),correct:false});}}
 if(options.length!==4)throw Error('No se pudieron generar opciones distintas');
 return {id:target,level,expression,factorType:type,steps:[{prompt:'¿Cuál es la factorización?',options:shuffle(r,options.map(o=>({...o,expression:factorView(o.expression)})))}],explanation:'Comprueba multiplicando los factores: deben recuperarse todos los términos del ejercicio. También puedes sustituir valores; si los resultados difieren, las expresiones no son equivalentes.'};
}
export function factorRun(level,r,excluded=[]){
 const types=shuffle(r,Array.from({length:level.count},(_,i)=>i%6));
 // El orden de los seis tipos se sortea antes de asignar los sobrantes.
 const order=shuffle(r,[0,1,2,3,4,5]),seen=new Set(excluded),problems=[];
 for(const index of types){let problem;for(let tries=0;tries<20000;tries++){const candidate=factorProblem(level.id,r,order[index]);if(!seen.has(candidate.id)){problem=candidate;break;}}if(!problem)throw Error('No se pudieron generar problemas nuevos');seen.add(problem.id);problems.push(problem);}
 return problems;
}

function clean(t){
 if(!t.a)return t;const a=clean(t.a),b=t.b?clean(t.b):null;
 if(t.op==='*'&&!t.brackets){if(a.op==='n'&&b.op==='n')return n(a.n*b.n);if(a.op==='n'&&b.op==='*'&&b.a.op==='n')return clean({op:'*',a:n(a.n*b.a.n),b:b.b});if(a.op==='n'&&a.n===1)return b;}
 return {...t,a,...(b?{b}:{})};
}

function factorView(t){
 if(t.op==='square')return {...t,a:expandedTree(expand(t.a))};
 if(t.op==='*'&&t.brackets)return {...t,a:expandedTree(expand(t.a)),b:expandedTree(expand(t.b))};
 return t;
}
