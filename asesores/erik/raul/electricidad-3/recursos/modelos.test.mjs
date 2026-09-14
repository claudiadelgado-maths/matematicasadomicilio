import test from 'node:test';
import assert from 'node:assert/strict';
import {heating,battery,capacitance,charge,equivalent,junction,loop} from './modelos.mjs';
import {pages} from './contenido.mjs';
test('conservación de corriente y balance de voltaje',()=>{
 for(const share of [3,5,7]){const n=junction(share);assert.equal(n.inA+n.inB,n.outA+n.outB);}
 for(const r of [0,1,3])for(const load of [2,6])for(const open of [true,false]){const b=battery(r,load,open);assert(Math.abs(b.terminal+b.loss-b.emf)<1e-10);assert(b.terminal>=0);if(open||r===0)assert.equal(b.terminal,b.emf);if(!open)assert(Math.abs(b.current*load-b.terminal)<1e-10);}
 assert(battery(1,2).loss>battery(1,6).loss);
 assert.equal(loop[0].potential,loop.at(-1).potential);
 const changes=loop.slice(1).map((v,i)=>v.potential-loop[i].potential);assert.equal(changes.reduce((a,b)=>a+b,0),0);assert(changes[0]>0&&changes[1]<0&&changes[2]<0);
});
test('relaciones de Joule, capacitancia y asociaciones',()=>{
 assert.equal(heating(2,1),4*heating(1,1));assert.equal(heating(1,2),2*heating(1,1));
 assert.equal(capacitance(2,1,1),2*capacitance(1,1,1));assert.equal(capacitance(1,2,1),capacitance(1,1,1)/2);assert.equal(capacitance(1,1,2),2*capacitance(1,1,1));
 for(const v of [1,2,3])assert.equal(charge(2,v),2*charge(1,v));
 assert.equal(equivalent(1,1,true),2);assert.equal(equivalent(1,1,false),.5);
 for(const a of [1,2,4])for(const b of [1,3,6]){assert(equivalent(a,b,false)<Math.min(a,b));assert(equivalent(a,b,true)>Math.max(a,b));}
});
test('banco conceptual y recorrido completos',()=>{
 assert.equal(pages.length,9);assert.equal(pages.reduce((n,p)=>n+p.questions.length,0),20);assert.equal(new Set(pages.map(p=>p.slug)).size,9);
 for(const p of pages)for(const q of p.questions){assert(q.prompt&&q.why);assert(q.options.length>=3);assert.equal(new Set(q.options).size,q.options.length);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);}
});
