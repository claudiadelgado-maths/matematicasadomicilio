import test from 'node:test';
import assert from 'node:assert/strict';
import {empty,term,apply,value,equivalent,generate,checkResult} from './motor.mjs';
function add(s,c,v={},side='top'){return apply(s,'add',[],{term:term(c,v),side}).state;}
const all=s=>[...s.top,...s.bottom].map(t=>String(t.id));
test('productos multivariables, cocientes, cancelación y cero',()=>{
 let s=add(add(empty(),'2',{x:2,y:1}),'3',{x:1,y:3});
 let r=apply(s,'combine',all(s)).state;assert.deepEqual(value(r),{a:{n:6n,d:1n},vars:{x:3,y:4,z:0}});
 s=add(add(empty(),'12',{x:4,y:5}),'3',{x:2,y:1},'bottom');r=apply(s,'combine',all(s)).state;assert.deepEqual(value(r),{a:{n:4n,d:1n},vars:{x:2,y:4,z:0}});
 s=add(add(empty(),'1',{x:3}),'1',{x:3},'bottom');r=apply(s,'cancel',all(s)).state;assert.equal(value(r).a.n,1n);assert.deepEqual(r.domain,s.domain);assert(equivalent(s,r));
 s=add(add(empty(),'0',{x:2}),'4',{y:3});r=apply(s,'combine',all(s)).state;assert.equal(value(r).a.n,0n);assert(equivalent(s,r));
});
test('traslados recíprocos, exponentes positivos y potencias pendientes',()=>{
 let s=add(empty(),'3/4',{x:2,y:-1});let r=apply(s,'down',all(s)).state;assert(equivalent(s,r));assert.equal(r.bottom[0].a.n,4n);assert.equal(r.bottom[0].vars.x,-2);
 r=apply(r,'positive',all(r)).state;assert(equivalent(s,r));
 s=apply(s,'power',all(s),'3').state;assert.equal(s.top[0].type,'power');r=apply(s,'evaluate',all(s)).state;assert(equivalent(s,r));assert.equal(value(r).vars.x,6);
 assert.throws(()=>apply(add(empty(),'0'),'power',['1'],'0'));
 assert.throws(()=>add(empty(),'0',{},'bottom'));
 assert.throws(()=>apply(s,'power',all(s),'2','solve'));
 assert.throws(()=>apply(s,'add',[],{term:term('2'),side:'top'},'solve'));
});
test('todos los niveles se resuelven de forma exacta sin comparar textos',()=>{
 for(const level of ['basic','intermediate','advanced'])for(let seed=0;seed<100;seed++){
  const p=generate(level,seed);let s=p.state;
  for(const t of [...s.top,...s.bottom])if(t.type)s=apply(s,'evaluate',[String(t.id)],undefined,'solve').state;
  s=apply(s,'combine',all(s),undefined,'solve').state;
  assert(equivalent(s,p.state));assert(checkResult(s,p.state).ok);
  const bad=structuredClone(s);bad.top[0].vars.x++;assert(!checkResult(bad,p.state).ok);
 }
});
