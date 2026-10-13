import assert from 'node:assert/strict';
import {middle,means,direct,missing,tramo,application,meansGame,sumsGame,parse,close,sequence,term,sum,segment} from './motor.mjs';
import {normalizeMath,m} from './ui.mjs';
let checked=0;
const explicit=(a,d,n)=>Array.from({length:n},(_,i)=>a+i*d);
for(let i=0;i<300;i++){
 for(const mode of ['centro','extremo','decimal','baja']){const r=middle(mode),v=r.values;assert.equal(v[1]-v[0],v[2]-v[1]);assert.equal(r.steps[0].fields[0].answer,v[r.hidden[0]]);checked++;}
 for(const mode of ['sube','baja','decimal','estudio','cuantos']){const r=means(mode);assert.equal((r.b-r.a)/(r.k+1),r.d);if(mode==='cuantos')assert.equal(r.steps[0].fields[0].answer,(r.b-r.a)/r.d-1);else{assert.equal(r.values.length,r.k+2);assert.equal(r.steps[0].fields[0].answer,r.k+1);assert.deepEqual(r.steps[2].fields.map(f=>f.answer),explicit(r.a,r.d,r.k+2).slice(1,-1));}checked++;}
 for(const r of [direct(),missing(),missing('cantidad'),missing('inverso'),application(),application('termino')]){const v=explicit(r.a,r.d,r.n),answer=r.steps.at(-1).fields[0].answer;assert.equal(answer,['inverso','termino'].includes(r.kind)?v.at(-1):v.reduce((a,b)=>a+b,0));checked++;}
 for(const r of [tramo(),application('tramo')]){const v=explicit(r.a,r.d,r.q).slice(r.p-1);assert.equal(r.steps.at(-1).fields[0].answer,v.reduce((a,b)=>a+b,0));assert.equal(r.steps[0].fields[0].answer,v.length);checked++;}
 for(const [make,n] of [[meansGame,6],[sumsGame,7]])for(let j=0;j<n;j++){const r=make(j);assert.ok(r.prompt);if(r.choice){assert.ok(r.choice.options.includes(r.choice.answer));assert.ok(r.choice.explanation.length>30);}else{assert.ok(r.steps.length);for(const step of r.steps)for(const f of step.fields)assert.ok(Number.isFinite(f.answer));}checked++;}
 const a=i-100,d=(i%11)-5,n=i%30+1,p=Math.min(3,n);assert.equal(term(a,d,n),explicit(a,d,n).at(-1));assert.equal(sum(a,d,n),explicit(a,d,n).reduce((a,b)=>a+b,0));assert.equal(segment(a,d,p,n),explicit(a,d,n).slice(p-1).reduce((a,b)=>a+b,0));
}
assert.equal(parse('3/2'),1.5);assert.equal(parse('-3/2'),-1.5);assert.equal(parse('1,5'),1.5);assert.equal(parse(' -2 '),-2);
for(const s of ['', '1/0','1/2/3','2+3','Infinity','abc'])assert.ok(Number.isNaN(parse(s)));
assert.ok(close(1.5,3/2));assert.ok(!close(1.51,1.5));assert.deepEqual(sequence(5,5,5),[5,10,15,20,25]);
assert.equal(normalizeMath('a_12+S_20+M_10+a_{12}'),'a_{12}+S_{20}+M_{10}+a_{12}');
assert.match(m('a_12'),/<sub>12<\/sub>/);
for(let i=0;i<100;i++)for(const r of [missing(),tramo(),application('tramo'),means()])for(const s of r.steps)for(const f of s.fields)assert.ok(!/_\d{2,}/.test(f.label),'Los subíndices de varias cifras deben estar agrupados.');
console.log(`${checked} ejercicios y retos comprobados, con medios, sumas explícitas, tramos y entradas decimales/fraccionarias.`);
