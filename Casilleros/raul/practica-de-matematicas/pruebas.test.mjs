import {R,plus,times,minus,rationalKey} from './cuadraticas-sistemas.mjs';
import {equivalent,rational} from './fracciones-algebraicas.mjs';
import {factorProblem,polynomialKey,expand,combine,product} from './factorizacion.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {levels,generate,makeRun,evaluate,equal,key,gcd,algebraKey} from './generador.mjs';
import {Game} from './partida.mjs';
import {render} from './vista.mjs';
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
test('configuración exacta de los cuarenta y seis niveles',()=>{
 assert.deepEqual(levels.map(l=>[l.count,l.seconds,l.steps]),[[12,60,1],[12,60,1],[15,90,1],[10,45,1],[10,130,1],[6,180,1],[10,240,2],[4,90,1],[6,150,2],[4,60,1],[5,90,1],[8,120,1],[8,150,1],[8,180,1],[6,120,1],[6,150,1],[6,180,1],[10,120,1],[9,165,1],[8,180,1],[7,195,1],[6,195,1],[12,600,1],[12,600,1],[12,600,1],[5,120,1],[6,120,1],[5,150,1],[6,180,1],[6,180,1],[6,240,1],[4,300,1],[4,300,1],[4,300,1],[4,300,1],[15,360,1],[15,360,1],[10,300,1],[8,360,1],[6,360,1],[5,420,1],[5,480,1],[6,240,1],[6,300,1],[5,360,1],[6,240,1]]);
});
test('21000 problemas: cuatro opciones únicas, una correcta y pasos equivalentes',()=>{
 const r=rng(739);
 for(const l of levels.filter(l=>l.id<22))for(let i=0;i<1000;i++){
  const p=generate(l.id,r),value=evaluate(p.resolved??p.expression);assert.equal(p.steps.length,l.steps);
  for(const step of p.steps){assert.equal(step.options.length,4);assert.equal(step.options.filter(o=>o.correct).length,1);assert.equal(new Set(step.options.map(o=>key(evaluate(o.expression)))).size,4);assert(equal(step.expected,value));for(const option of step.options){assert.equal(equal(evaluate(option.expression),value),option.correct);assert(!render(option.expression).includes('undefined'));}}
  if(l.id===1){assert(p.meta.a>=0&&p.meta.a<=20);assert(p.meta.b>=0&&p.meta.b<=20);assert.equal(value.c.n,BigInt(p.meta.a+p.meta.b));}
  if(l.id===2){assert(p.meta.a>p.meta.b);assert.equal(value.c.n,BigInt(p.meta.a-p.meta.b));}
  if(l.id===3)assert(p.meta.a<0||p.meta.b<0||p.meta.a-p.meta.b<0);
  if(l.id===5){assert.equal(gcd(BigInt(p.meta.a),BigInt(p.meta.b)),1n);assert(p.meta.factor>1);assert(p.meta.signs<=3);assert.equal(value.c.n<0n,p.meta.signs%2===1);}
  if(l.id===6)assert([2,3].includes(p.meta.numerators.length));
  if(l.id===7)assert(p.parts.every(a=>a.d===p.parts[0].d));
  if(l.id===9){assert.notEqual(p.parts[0].d,p.parts[1].d);assert(p.parts.every(a=>a.d>=1&&a.d<=10));}
  if(l.id===8)assert.notEqual(p.meta.d1,p.meta.d2);
  if(l.id===10||l.id===11)assert(Object.values(p.meta).every(n=>n>=1&&n<=20));
 }
});
test('reinicios generan lotes nuevos sin repetir el intento anterior',()=>{
 const r=rng(42);for(const l of levels){const first=makeRun(l,r),second=makeRun(l,r,first.map(p=>p.id));assert.equal(new Set(first.map(p=>p.id)).size,l.count);assert(second.every(p=>!first.some(q=>q.id===p.id)));}
});
test('fallo detiene el nivel, conserva la pregunta y exige reinicio',()=>{
 let now=1000;const g=new Game({now:()=>now,random:rng(21)});g.start();const p=g.problem;g.answer(g.question.options.findIndex(o=>!o.correct));assert.equal(g.state,'failed');assert.equal(g.problem,p);const remaining=g.remaining;now+=5000;assert.equal(g.remaining,remaining);assert.equal(g.answer(0),false);const old=g.problems.map(p=>p.id);g.start();assert.equal(g.state,'running');assert.equal(g.correct,0);assert.equal(g.remaining,60);assert(g.problems.every(p=>!old.includes(p.id)));
});
test('el tiempo vence incluso antes de que llegue el próximo tick',()=>{
 let now=0;const g=new Game({now:()=>now,random:rng(43)});g.choose(7);g.start();now=240000;g.answer(g.question.options.findIndex(o=>o.correct));assert.equal(g.state,'timeout');assert.equal(g.correct,0);assert.equal(g.remaining,0);g.start();assert.equal(g.remaining,240);
});
test('dos pasos por problema, final exacto y cambio de nivel libre',()=>{
 let now=0;const g=new Game({now:()=>now,random:rng(3)});g.choose(9);g.start();const first=g.problem;g.answer(g.question.options.findIndex(o=>o.correct));assert.equal(g.problem,first);assert.equal(g.step,1);g.answer(g.question.options.findIndex(o=>o.correct));assert.equal(g.index,1);assert.equal(g.step,0);
 while(g.state==='running'){now+=1000;g.answer(g.question.options.findIndex(o=>o.correct));}assert.equal(g.state,'complete');assert.equal(g.correct,12);assert(g.completed.has(9));const left=g.remaining;now+=100000;assert.equal(g.remaining,left);g.choose(11);assert.equal(g.state,'ready');assert.equal(g.remaining,90);assert(g.completed.has(9));
});

test('sustitución: evaluación independiente, dominio y variedad',()=>{
 const numeric=(t,x)=>{if(t.op==='n')return t.n;if(t.op==='v')return x;const a=numeric(t.a,x),b=t.b?numeric(t.b,x):0;switch(t.op){case 'neg':return -a;case 'square':return a*a;case '+':return a+b;case '-':return a-b;case '*':return a*b;case '/':assert.notEqual(b,0);return a/b;}};
 const walk=(t,fn)=>{fn(t);if(t.a)walk(t.a,fn);if(t.b)walk(t.b,fn);};
 const r=rng(910);
 for(let level=12;level<=17;level++){
  const families=new Set(),signs=new Set();
  for(let i=0;i<1000;i++){
   const p=generate(level,r),expected=p.steps[0].expected.c;
   assert(Math.abs(numeric(p.expression,p.substitution)-Number(expected.n)/Number(expected.d))<1e-9);
   families.add(p.meta.family);signs.add(Math.sign(p.substitution));
   if(level===12||level===15){assert(p.substitution>0);walk(p.expression,t=>{assert(t.op!=='-'&&t.op!=='neg');if(t.op==='n')assert(t.n>0);});}
   if(level===15||level===16){assert.equal(p.expression.op,'/');let fractions=0;walk(p.expression,t=>{if(t.op==='/')fractions++;});assert.equal(fractions,1);}
   if(level===17){const denominators=[];walk(p.expression,t=>{if(t.op==='/')denominators.push(numeric(t.b,p.substitution));});assert([2,3].includes(denominators.length));assert.equal(new Set(denominators).size,1);}
  }
  assert(families.size>=3);if(![12,15].includes(level))assert.equal(signs.size,2);
 }
});
test('niveles nuevos: completar, fallar, reiniciar y agotar tiempo',()=>{
 for(let level=12;level<=17;level++){
  let now=0;const g=new Game({now:()=>now,random:rng(level)});g.choose(level);g.start();
  g.answer(g.question.options.findIndex(o=>!o.correct));assert.equal(g.state,'failed');
  g.start();while(g.state==='running')g.answer(g.question.options.findIndex(o=>o.correct));assert.equal(g.state,'complete');assert.equal(g.correct,g.level.count);
  g.start();now=g.level.seconds*1000;g.tick();assert.equal(g.state,'timeout');
 }
});

test('configuración independiente, reinicio, límites y valores originales',()=>{
 const originals=JSON.stringify(levels);const g=new Game({random:rng(883)});
 for(const level of levels){g.choose(level.id);g.configure(5,90);assert.equal(g.level.count,5);g.start();assert.equal(g.problems.length,5);assert.equal(g.remaining,90);assert.throws(()=>g.configure(3,60));g.answer(g.question.options.findIndex(o=>!o.correct));const failed=g.problem;g.configure(2,45);assert.equal(g.problem,failed);g.start();assert.equal(g.problems.length,2);assert.equal(g.remaining,45);}
 g.choose(1);assert.equal(g.level.count,2);assert.throws(()=>g.configure(0,60));assert.throws(()=>g.configure(5,0));assert.throws(()=>g.configure(1.5,60));g.configure(12,60);assert.equal(JSON.stringify(levels),originals);assert.equal(new Game().level.count,12);
});

test('despejes: igualdad independiente y cuatro soluciones algebraicas distintas',()=>{
 const value=(t,env)=>{if(t.op==='n')return t.n;if(t.op==='v')return env[t.v];const a=value(t.a,env),b=t.b?value(t.b,env):0;switch(t.op){case 'neg':return -a;case '+':return a+b;case '-':return a-b;case '*':return a*b;case '/':return a/b;}};
 const r=rng(128);for(let id=18;id<=22;id++)for(let i=0;i<1000;i++){
  const p=generate(id,r);assert.equal(p.expression.op,'=');
  if(id<22){const env={x:p.meta.x};assert.equal(value(p.expression.a,env),value(p.expression.b,env));if(id<20)assert(p.meta.x>0&&p.meta.a>0&&p.meta.b>=0&&p.meta.c>0);}
  else{const q=p.steps[0];assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>algebraKey(o.algebra))).size,4);for(const o of q.options){assert.equal(algebraKey(o.algebra)===algebraKey(q.algebra),o.correct);for(const k of [-3,2,7]){const env={a:k,[p.meta.letter]:k+1};env.x=value(o.expression,env);const difference=value(p.expression.a,env)-value(p.expression.b,env);if(o.correct)assert(Math.abs(difference)<1e-9);}}}
 }
 for(const l of levels.filter(l=>l.id>=18&&l.id<=25)){const first=makeRun({...l,count:100},r);assert.equal(makeRun({...l,count:100},r,first.map(p=>p.id)).length,100);}
});

test('factorización: expansión exacta, variedad y reparto equilibrado editable',()=>{
 const r=rng(9928);
 const numeric=(t,env)=>{if(t.op==='n')return t.n;if(t.op==='v')return env[t.v];const a=numeric(t.a,env),b=t.b?numeric(t.b,env):0;switch(t.op){case '+':return a+b;case '-':return a-b;case 'neg':return -a;case '*':return a*b;case 'square':return a*a;case 'power':return a**t.exponent;}};
 for(let level=23;level<=25;level++){
  for(let type=0;type<6;type++)for(let i=0;i<150;i++){
   const p=factorProblem(level,r,type),options=p.steps[0].options,target=polynomialKey(p.expression);
   assert.equal(options.length,4);assert.equal(new Set(options.map(o=>polynomialKey(o.expression))).size,4);
   assert.equal(options.filter(o=>o.correct).length,1);
   for(const o of options){assert.equal(polynomialKey(o.expression)===target,o.correct);assert(!render(o.expression,true).includes('undefined'));if(o.correct)for(const z of [-3,0,2,5]){const env={x:z,a:2,b:3,m:-2,n:4,y:-1};assert(numeric(p.expression,env)===numeric(o.expression,env));}}
   if(level===23&&![3,5].includes(type))assert([...expand(p.expression).values()].every(c=>c>0n));
   const letters=new Set([...expand(p.expression).keys()].join(''));assert.equal(letters.size,level===25?2:1);
  }
  for(const count of [1,3,5,6,12,14,25,100]){const l={...levels[level-1],count},first=makeRun(l,r),second=makeRun(l,r,first.map(p=>p.id));for(const run of [first,second]){const counts=Array(6).fill(0);run.forEach(p=>counts[p.factorType]++);assert(Math.max(...counts)-Math.min(...counts)<=1);assert.equal(new Set(run.map(p=>p.id)).size,count);}assert(second.every(p=>!first.some(q=>p.id===q.id)));}
 }
});

test('fracciones algebraicas: equivalencia exacta, dominio, cancelación y ecuaciones lineales',()=>{
 const r=rng(90812);
 for(let level=26;level<=29;level++)for(let i=0;i<1000;i++){
  const p=generate(level,r),q=p.steps[0],correct=q.options.find(o=>o.correct).expression;
  assert.equal(q.options.filter(o=>o.correct).length,1);assert.equal(q.options.length,4);
  for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)assert(!equivalent(q.options[a].expression,q.options[b].expression));
  if(level<29){assert(equivalent(p.expression,correct));const z=rational(correct);assert(z.d.size>0);if(level===27||level===28){assert(z.n.size<=1);assert.equal(z.d.size,1);const numerator=[...z.n][0],denominator=[...z.d][0];if(numerator){assert.equal(gcd(numerator[1],denominator[1]),1n);assert(![...numerator[0]].some(v=>denominator[0].includes(v)));}}}
  else{const {root,p:a,q:b,slope,constant}=p.meta;assert.notEqual(root,-a);assert.notEqual(root,-b);assert.notEqual(slope,0);assert.equal(slope*root+constant,0);assert.equal(correct.n,root);const left=rational(p.expression.a),right=rational(p.expression.b);const difference=combine(product(left.n,right.d),product(right.n,left.d),-1n);let sum=0n;for(const [key,c]of difference)sum+=c*BigInt(root)**BigInt(key.length);assert.equal(sum,0n);}
  for(const o of q.options)assert(!render(o.expression,true).includes('undefined'));
 }
 for(const id of [23,24,25]){const run=makeRun(levels[id-1],r),counts=Array(6).fill(0);run.forEach(p=>counts[p.factorType]++);assert.deepEqual(counts,[2,2,2,2,2,2]);}
});

test('cuadráticas y sistemas: soluciones exactas, pares únicos y configuración editable',()=>{
 const random=rng(98213),zero=x=>x.n===0n;let repeated=0;
 for(let id=30;id<=35;id++){
  for(let i=0;i<1000;i++){
   const p=generate(id,random),q=p.steps[0];assert.equal(q.options.length,4);assert.equal(q.options.filter(o=>o.correct).length,1);
   const keys=q.options.map(o=>{const k=o.values.map(rationalKey);return (id<=31?k.sort():k).join('|');});assert.equal(new Set(keys).size,4);
   if(id<=31){const {roots:[a,b],B,C}=p.meta;if(rationalKey(a)===rationalKey(b))repeated++;if(id===30){assert.equal(a.d,1n);assert.equal(b.d,1n);}if(id===31)assert(a.d>1n);
    const target=[rationalKey(a),rationalKey(b)].sort().join('|');for(const o of q.options){assert.equal(o.values.map(rationalKey).sort().join('|')===target,o.correct);if(o.correct)for(const x of o.values)assert(zero(plus(plus(times(x,x),times(B,x)),C)));}
   }else{const {coefficients:[a,b,c,d],constants:[e,f]}=p.meta;assert(!zero(minus(times(a,d),times(b,c))));if(id===34)assert.equal(new Set(p.meta.coefficients.map(x=>String(x.d))).size,1);if(id===35)assert(new Set(p.meta.coefficients.map(x=>String(x.d))).size>1);
    for(const o of q.options){const [x,y]=o.values;const solves=zero(minus(plus(times(a,x),times(b,y)),e))&&zero(minus(plus(times(c,x),times(d,y)),f));assert.equal(solves,o.correct);}
   }
   assert(!render(p.expression,true).includes('undefined'));for(const o of q.options){assert.equal(o.expression.op,'pair');assert(!render(o.expression,true).includes('undefined'));}
  }
  const l={...levels[id-1],count:100},first=makeRun(l,random),second=makeRun(l,random,first.map(p=>p.id));assert.equal(second.length,100);assert(second.every(p=>!first.some(q=>q.id===p.id)));
 }
 assert(repeated>100);
});

test('lenguaje verbal: familias, opciones válidas y lotes editados',()=>{
 const r=rng(39174),sizes=[5,6,4,5,5,5,6];
 for(let id=36;id<=42;id++){
  const families=new Set(),stories=new Set();
  for(let i=0;i<800;i++){
   const p=generate(id,r),options=p.steps[0].options;families.add(p.meta.family);stories.add(p.story);
   assert(p.story.length>10);assert(!p.story.includes('undefined'));assert.equal(options.length,4);assert.equal(options.filter(o=>o.correct).length,1);
   for(const o of options){assert.equal(p.verify(id<=37?o.expression:o.values),o.correct);assert(!render(o.expression).includes('undefined'));}
   if(id<=37){for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)assert(!equivalent(options[a].expression,options[b].expression));}
   else assert.equal(new Set(options.map(o=>o.values.join(','))).size,4);

  }
  assert.equal(families.size,sizes[id-36]);assert(stories.size>100);
  const l={...levels[id-1],count:100},first=makeRun(l,r),second=makeRun(l,r,first.map(p=>p.id));assert.equal(second.length,100);assert(second.every(p=>!first.some(q=>q.id===p.id)));
  let now=0;const game=new Game({random:r,now:()=>now});game.choose(id);game.configure(2,30);game.start();game.answer(game.question.options.findIndex(o=>!o.correct));assert.equal(game.state,'failed');game.start();while(game.state==='running')game.answer(game.question.options.findIndex(o=>o.correct));assert.equal(game.state,'complete');game.start();now=30000;game.tick();assert.equal(game.state,'timeout');
 }
});

test('división exacta: producto, cociente único, límites, variedad y reinicios',()=>{
 const r=rng(761234);
 for(let id=43;id<=45;id++){
  const kinds=new Set(),counts=new Set();
  for(let i=0;i<1000;i++){
   const p=generate(id,r),a=expand(p.expression.b),dividend=expand(p.expression.a),options=p.steps[0].options;
   assert(a.size>=2);assert.equal(options.length,4);assert.equal(new Set(options.map(o=>polynomialKey(o.expression))).size,4);assert.equal(options.filter(o=>o.correct).length,1);
   assert([...dividend.values()].every(c=>c>=-36n&&c<=36n));assert(dividend.size<=8);assert(render(p.expression,true).includes('text{entre}'));assert(!render(p.expression).includes('÷'));
   for(const o of options)assert.equal(combine(product(a,expand(o.expression)),dividend,-1n).size===0,o.correct);
   const letters=new Set([...dividend.keys()].join(''));if(id<45)assert.deepEqual([...letters],['x']);else kinds.add(letters.size);
   counts.add(expand(options.find(o=>o.correct).expression).size);
  }
  if(id===44)assert.deepEqual([...counts].sort(),[2,3,4]);if(id===45)assert.deepEqual([...kinds].sort(),[1,2]);
  const level={...levels[id-1],count:100},first=makeRun(level,r),next=makeRun(level,r,first.map(p=>p.id));assert.equal(next.length,100);assert(next.every(p=>!first.some(q=>p.id===q.id)));
 }
});

test('residuo: identidad DQ+R, grado estricto y variedad',()=>{
 const r=rng(456),families=new Set();for(let i=0;i<2000;i++){const p=generate(46,r),D=expand(p.expression.b),P=expand(p.expression.a),Q=expand(p.meta.quotient),options=p.steps[0].options;families.add(p.meta.family);const actual=combine(P,product(D,Q),-1n);assert.equal(new Set(options.map(o=>polynomialKey(o.expression))).size,4);for(const o of options){const R=expand(o.expression);assert([...R.keys()].every(k=>k.length<p.meta.degree));assert.equal(combine(actual,R,-1n).size===0,o.correct);}assert(render(p.expression,true).includes('text{entre}'));}assert.equal(families.size,4);
});
