import assert from 'node:assert/strict';
import {generate,challenge,methods,eq,expand,common,divide,mulM,mono,grouping,tex} from './algebra.mjs';
let checked=0;
for(const hard of [false,true])for(const method of methods){const seen=new Set();for(let i=0;i<350;i++){
 const r=generate(method,hard);assert(eq(expand(r.factors),r.expression),`${method}: ${tex(r.expression)}`);assert(r.expression.every(m=>Number.isInteger(m.c)&&Object.values(m.p).every(e=>Number.isInteger(e)&&e>=0)));seen.add(tex(r.expression));
 if(method==='comun'){const g=common(r.expression);assert(eq(r.expression,r.expression.map(m=>mulM(divide(m,g),g))));}
 if(method==='agrupacion'){let found=false;for(let mask=1;mask<2**r.expression.length;mask++){const indices=r.expression.map((_,i)=>i).filter(i=>mask&(1<<i));const g=grouping(r.expression,indices);if(g){found=true;assert(eq(expand([g.factors,g.inner]),r.expression));}}assert(found);}
 checked++;
 }assert(seen.size>=20,`${method}: falta variedad ${seen.size}`);}
for(const hard of [false,true])for(let i=0;i<500;i++){const r=challenge(hard);assert.equal(r.options.length,3);assert.equal(r.options.filter(f=>eq(expand(f),r.expression)).length,1);checked++;}
assert.equal(divide(mono(3,{x:2}),mono(1,{x:3})),null);
assert.deepEqual(divide(mono(-12,{x:4}),mono(2,{x:1})),mono(-6,{x:3}));
assert(eq([mono(3,{x:1}),mono(-2,{x:1})],[mono(1,{x:1})]));
console.log(`${checked} ejercicios comprobados: expansión, raíces enteras, agrupaciones válidas, variedad y una respuesta correcta por reto.`);
