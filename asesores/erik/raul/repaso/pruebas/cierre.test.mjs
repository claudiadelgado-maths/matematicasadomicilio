import assert from 'node:assert/strict';
import {direct,inverse,factors,prime,split,read} from '../recursos/cierre/motor.mjs';
import {equal,calc} from '../recursos/motor.mjs';
for(let r=1;r<=1000;r++)for(const word of [false,true]){
 const d=direct(r,word);assert.ok(equal(calc(d.y,[d.a,1],'÷'),d.rate));assert.ok(equal(calc(d.answer,[d.b,1],'÷'),d.rate));assert.ok(d.answer[1]>0);assert.ok(d.a!==d.b);
 const i=inverse(r,word);assert.ok(equal(calc([i.b,1],i.answer,'×'),[i.total,1]));assert.equal(i.a*i.time,i.total);assert.ok(i.answer[0]>0);if(!word)assert.equal((i.answer[0]/i.answer[1])%0.5,0);
}
for(let n=2;n<=200;n++){
 const expected=factors(n);assert.equal(expected.reduce((a,b)=>a*b,1),n);assert.ok(expected.every(prime));
 for(const path of ['balanced','smallest']){const leaves=[];function visit(v){if(prime(v)){leaves.push(v);return;}const pair=split(v,path);assert.equal(pair[0]*pair[1],v);assert.ok(pair.every(x=>x>1&&x<v));pair.forEach(visit);}visit(n);assert.deepEqual(leaves.sort((a,b)=>a-b),expected);}
}
assert.deepEqual(split(60),[6,10]);assert.deepEqual(split(12),[3,4]);assert.deepEqual(split(12,'smallest'),[2,6]);assert.equal(prime(1),false);assert.deepEqual(read('4,5'),[9,2]);assert.equal(read(''),null);assert.equal(read('1e3'),null);
console.log('4,000 modelos proporcionales y 398 árboles: invariantes, factores primos, caminos y entradas correctos.');
