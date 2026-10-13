import {r,add,mul,div,neg,eq,poly,constant,X,Y,ONE,plus,minus,scale,times,power,equalPoly,degree,evaluatePoly,P,F,S,equivalent,evaluate,denominators,latex,symbolic} from './algebra.mjs';
export function random(seed){let s=seed>>>0;return ()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
const pick=(rng,a)=>a[Math.floor(rng()*a.length)];
const int=(rng,a,b)=>a+Math.floor(rng()*(b-a+1));
export function shuffle(rng,a){a=[...a];for(let i=a.length-1;i>0;i--){const j=int(rng,0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
const nz=rng=>pick(rng,[-5,-4,-3,-2,-1,1,2,3,4,5]);
const line=(a,b)=>plus(scale(X,a),constant(b));
function system(rng,v){
  let solution=[r(int(rng,1,5)),r(int(rng,1,5))];if(v>=3)solution=[r(nz(rng)),r(nz(rng))];if([7,8,9].includes(v))solution=[r(nz(rng),pick(rng,[2,3,4,6])),r(nz(rng),pick(rng,[2,3,4]))];
  let coefficients=[int(rng,1,5),int(rng,1,5),int(rng,1,5),int(rng,1,5)].map(n=>r(n));
  if(v>=2)coefficients[1]=neg(coefficients[1]);
  if(v===4||v===9)coefficients=coefficients.map(c=>div(c,r(pick(rng,v===4?[6,7,8]:[2,3,4,5,6,7,8]))));
  if(v===5)coefficients=coefficients.map((c,i)=>i>1?div(c,r(pick(rng,[3,4,5]))):c);
  if(v===6)coefficients[0]=r(1,2);
  if(v===10){const factor=pick(rng,[r(-2),r(3),r(1,2)]);coefficients=coefficients.map((c,i)=>i<2?mul(c,factor):c);}
  const [a,b,c,d]=coefficients;if(eq(mul(a,d),mul(b,c)))throw Error('Determinante nulo');
  const equations=[poly([[a,1],[b,0,1]]),poly([[c,1],[d,0,1]])].map(left=>({left,right:evaluatePoly(left,solution)}));
  const [x,y]=solution,options=[solution];
  const candidates=[[y,x],[neg(x),y],[x,neg(y)],[add(x,r(1)),y],[x,add(y,r(-1))],[add(x,r(1)),add(y,neg(div(a,b)))]];
  for(const candidate of shuffle(rng,candidates))if(!options.some(o=>o.every((z,i)=>eq(z,candidate[i])))){options.push(candidate);if(options.length===4)break;}
  return {kind:'system',equations,solution,options,variables:['x','y'],difficulty:v<=3?'easy':'hard',prompt:'¿Qué valores satisfacen las dos ecuaciones?'};
}
function division(rng,v){
  const a=nz(rng),b=nz(rng),c=nz(rng),d=nz(rng);let D=line(1,a),Q=line(1,b),R=constant(0),asked='quotient';
  if([2,3,10].includes(v))Q=poly([[v===2?1:int(rng,2,4),2],[b,1],[c]]);
  if(v===3)D=line(1,-a);
  if(v===4){D=poly([[1,2],[a,1],[b]]);Q=poly([[1,2],[c,1],[d]]);}
  if(v===5){D=poly([[int(rng,1,3),2],[a,1],[b]]);Q=poly([[int(rng,1,3),3],[c,2],[d,1],[nz(rng)]]);}
  if(v===6){D=minus(power(X,2),constant(a*a));Q=plus(power(X,2),constant(b*b));}
  if(v===7){D=poly([[2,2],[a,1,1],[-2,0,2]]);Q=poly([[int(rng,1,3),2],[b,1,1],[3,0,2]]);}
  if(v===8){D=plus(scale(X,a),scale(Y,b));Q=poly([[c,2],[d,1,1],[nz(rng),0,2]]);}
  if(v===9){D=line(pick(rng,[3,5,7]),a);Q=poly([[pick(rng,[3,5,9]),2],[b,1],[pick(rng,[7,12,15])]]);}
  if(v===10)D=line(1,r(1,2));
  if(v>=11){D=v===11?line(1,a):poly([[1,2],[a,1],[b]]);Q=poly([[int(rng,1,3),2],[c,1],[d]]);R=v===11?constant(nz(rng)):line(nz(rng),nz(rng));asked=pick(rng,['quotient','remainder']);}
  const dividend=plus(times(D,Q),R),correct=P(asked==='quotient'?Q:R),original=F(dividend,D);
  if(v===5)original.n.reverse=true;
  return {kind:'division',D,Q,R,dividend,asked,original,correct,difficulty:v<=3?'easy':'hard',prompt:asked==='remainder'?'¿Cuál es el residuo?':'¿Cuál es el cociente?',given:degree(R)>=0?P(asked==='quotient'?R:Q):null};
}
function fractions(rng,v,factor){
  const a=nz(rng),b=nz(rng),k=int(rng,2,5);let D=line(1,a),N=line(k,b),G=D,H=ONE;
  if(!factor){
    if(v===1||v===2){D=scale(power(X,int(rng,1,3)),v===2?2:1);N=constant(nz(rng));}
    if(v===3)D=line(2,a);
    if(v===5)N=scale(X,k);
    if(v===6||v===7){N=constant(v===7?1:k);G=ONE;H=D;}
    else G=D;
    if(v===8){D=plus(plus(X,scale(Y,pick(rng,[-1,1]))),constant(a));G=D;N=plus(scale(X,k),scale(Y,b));}
    if(v===9){D=poly([[1,2],[a,1],[a*a+1]]);G=D;}
    if(v===10)N=plus(scale(X,r(1,2)),constant(b));
  }else{
    H=line(1,a);G=line(1,b===a?b+1:b);N=constant(k);
    if(v===1){G=line(1,-a);}
    if(v===4){N=line(k,b+1);if(equalPoly(N,scale(G,k)))N=plus(N,constant(1));}
    if(v===5||v===10){H=plus(minus(X,Y),constant(a));G=minus(plus(X,Y),constant(a));N=v===10?plus(scale(X,k),constant(b)):constant(k);}
    if(v===6)H=scale(times(X,line(1,a)),3);
    if(v===8){H=minus(power(X,2),constant(a*a));G=ONE;N=constant(k*k);}
    D=times(G,H);
  }
  const combined=times(N,H),three=[1,2,4,9,10].includes(v),subtract=[2,4,9,10].includes(v);
  let first=(v<=2&&!factor)?constant(int(rng,1,7)):line(int(rng,1,3),nz(rng));
  if(v===8||v===10)first=plus(first,scale(Y,nz(rng)));
  const sign=subtract?-1:1,items=[{sign:1,node:F(first,D)}];
  if(three){const second=(v<=2&&!factor)?constant(int(rng,1,5)):line(nz(rng),nz(rng)),sign2=v===9?-1:1;const last=scale(minus(minus(combined,first),scale(second,sign)),sign2);items.push({sign,node:F(second,D)},{sign:sign2,node:F(last,D)});}
  else items.push({sign,node:F(scale(minus(combined,first),sign),D)});
  if(v===10)items.forEach(i=>{i.node.n.reverse=true;i.node.d.reverse=true;});
  let correct=equalPoly(G,ONE)?P(N):F(N,G);
  return {kind:'expression',original:S(items),correct,difficulty:factor||v>=8?'hard':'easy',prompt:'¿Qué expresión es equivalente?',N,G};
}
function optionsFor(rng,p){
  const v=symbolic(p.correct),out=[p.correct],candidates=[];
  // Local sign/coefficient/denominator mistakes; symbolic filtering removes disguised duplicates.
  for(const [key,c]of Object.entries(v.n)){const [x,y]=key.split(',').map(Number);candidates.push(F(plus(v.n,poly([[neg(mul(c,r(2))),x,y]])),v.d),F(plus(v.n,poly([[c,x,y]])),v.d));}
  candidates.push(F(v.n,scale(v.d,2)),F(scale(v.n,-1),v.d),F(plus(v.n,X),v.d),F(plus(v.n,ONE),v.d),F(minus(v.n,ONE),v.d));
  if(p.kind==='expression')candidates.push(F(v.n,plus(v.d,ONE)));
  for(const o of shuffle(rng,candidates)){if(!Object.keys(symbolic(o).d).length||out.some(a=>equivalent(a,o)))continue;out.push(equalPoly(symbolic(o).d,ONE)?P(symbolic(o).n):o);if(out.length===4)break;}
  if(out.length!==4)throw Error('Opciones insuficientes');return out;
}
export function variablesOf(p){let hasY=false;const inspect=e=>{if(e.kind==='poly'){if(Object.keys(e.p).some(k=>Number(k.split(',')[1])))hasY=true;}else if(e.kind==='fraction'){inspect(e.n);inspect(e.d);}else e.items.forEach(i=>inspect(i.node));};inspect(p.original);p.options.forEach(inspect);if(p.given)inspect(p.given);return hasY?['x','y']:['x'];}
export function validate(p){
  if(p.options.length!==4)throw Error('Se requieren cuatro opciones');
  if(p.kind==='system'){
    const [a,b]=p.equations.map(e=>e.left),det=add(mul(a['1,0']||r(0),b['0,1']||r(0)),neg(mul(a['0,1']||r(0),b['1,0']||r(0))));if(!det.n)throw Error('Sistema singular');
    let count=0;for(let i=0;i<4;i++){const o=p.options[i];if(p.options.slice(0,i).some(k=>k.every((v,j)=>eq(v,o[j]))))throw Error('Parejas duplicadas');if(p.equations.every(e=>eq(evaluatePoly(e.left,o),e.right)))count++;}if(count!==1)throw Error('Sistema ambiguo');return true;
  }
  for(let i=0;i<4;i++){if(!Object.keys(symbolic(p.options[i]).d).length)throw Error('Denominador idénticamente nulo');for(let j=0;j<i;j++)if(equivalent(p.options[i],p.options[j]))throw Error('Opciones equivalentes');}
  if(p.options.filter(o=>equivalent(o,p.correct)).length!==1)throw Error('Respuesta ambigua');
  if(p.kind==='division'){
    if(!equalPoly(p.dividend,plus(times(p.D,p.Q),p.R))||degree(p.R)>=degree(p.D))throw Error('División inválida');
    if(!equivalent(p.correct,P(p.asked==='quotient'?p.Q:p.R)))throw Error('Parte incorrecta');
  }else if(!equivalent(p.original,p.correct))throw Error('Identidad inválida');
  const all=[p.original,...p.options];let validPoints=0;
  for(let x=-3;x<=4;x++)for(let y=1;y<=3;y++)try{all.forEach(e=>evaluate(e,[r(x),r(y)]));validPoints++;}catch{}
  if(validPoints<3)throw Error('Dominio sin pruebas sencillas');return true;
}
export function generate(rng=Math.random,family=pick(rng,['A','B','C','D']),variant=null){
  for(let attempt=0;attempt<80;attempt++)try{
    const v=variant||pick(rng,family==='B'?[1,2,3,4,5,6,7,8,9,11,12,10]:family==='C'?[1,2,3,4,5,6,7,8,9,1,3,10]:[1,2,3,4,5,6,7,8,9,10]);
    const p=family==='A'?system(rng,v):family==='B'?division(rng,v):fractions(rng,v,family==='D');p.family=family;p.variant=v;
    if(p.kind!=='system'){p.options=optionsFor(rng,p);p.variables=variablesOf(p);if(rng()<.22)p.variables=p.variables.length===2?['a','b']:['t'];}
    p.options=shuffle(rng,p.options);validate(p);
    p.correctIndex=p.kind==='system'?p.options.findIndex(o=>p.equations.every(e=>eq(evaluatePoly(e.left,o),e.right))):p.options.findIndex(o=>equivalent(o,p.correct));
    p.fingerprint=p.kind==='system'?p.equations.map(e=>latex(P(e.left))+String(e.right.n)+String(e.right.d)).join(';'):latex(p.original);
    return p;
  }catch(e){if(attempt===79)throw Error(`No se pudo construir una pregunta válida: ${e.message}`);}
}
export class Bank{
  constructor(seed=Date.now()){this.rng=random(seed);this.bag=[];this.last=null;this.recent=[];this.templates={};}
  next(){
    if(!this.bag.length){this.bag=shuffle(this.rng,['A','B','C','D']);if(this.bag[0]===this.last)[this.bag[0],this.bag[1]]=[this.bag[1],this.bag[0]];}
    const family=this.bag.shift();let p;
    for(let i=0;i<50;i++){p=generate(this.rng,family);if(!this.recent.includes(p.fingerprint)&&this.templates[family]!==p.variant)break;}
    this.last=family;this.templates[family]=p.variant;this.recent.push(p.fingerprint);this.recent=this.recent.slice(-20);return p;
  }
}
