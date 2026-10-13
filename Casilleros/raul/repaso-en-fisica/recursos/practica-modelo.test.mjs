import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {topics,generar,evaluar,numero,circuito,crearRonda} from './practica-modelo.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
test('circuitos conservan corriente, voltaje, carga y potencia en todo el rango',()=>{
 for(let v=1;v<=24;v++)for(let a=1;a<=20;a++)for(let b=1;b<=20;b++){
  let x=circuito('serie',v,a,b);close(x.v1+x.v2,v);close(x.power,x.current*x.current*x.total);
  x=circuito('paralelo',v,a,b);close(x.current,x.i1+x.i2);assert.ok(x.total<Math.min(a,b));
  x=circuito('cap-serie',v,a,b);close(x.v1+x.v2,v);close(x.v1*a,x.charge);close(x.v2*b,x.charge);
  x=circuito('cap-paralelo',v,a,b);close(x.charge,x.q1+x.q2);
  x=circuito('ohm',v,a,b);close(x.current*a,v);close(x.power,v*x.current);
 }
 assert.throws(()=>circuito('ohm',12,0,4),RangeError);
});
test('generadores producen valores válidos y admiten sus soluciones; rechazan valores vacíos y erróneos',()=>{
 let seed=51;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/2**32);
 for(const [topic] of topics)for(let i=0;i<150;i++){
  const q=generar(topic,random),answer=q.type==='scientific'?q.coefficient:q.answer;
  assert.ok(Number.isFinite(answer));assert.ok(answer>0);assert.ok(q.prompt.length>20);
  const values={answer:String(answer),exponent:String(q.exponent),interaction:q.interaction};
  assert.equal(evaluar(q,values).ok,true,q.prompt);
  assert.equal(evaluar(q,{}).valid,false);
  assert.equal(evaluar(q,{...values,answer:String(answer*2+1)}).ok,false);
 }
});
test('coma decimal, notación normalizada y respuesta de Coulomb completa',()=>{
 assert.equal(numero('1,69'),1.69);for(const x of ['',' ','2abc','1/2','Infinity','0x10'])assert.ok(Number.isNaN(numero(x)));
 const q={type:'scientific',coefficient:1,exponent:-3};assert.equal(evaluar(q,{answer:'10',exponent:'-4'}).ok,false);assert.equal(evaluar(q,{answer:'1',exponent:'-3'}).ok,true);
 assert.equal(evaluar({type:'coulomb',answer:720,interaction:'atraccion'},{answer:'720'}).valid,false);
 assert.equal(evaluar({type:'coulomb',answer:720,interaction:'atraccion'},{answer:'720',interaction:'repulsion'}).ok,false);
});
test('errores se deduplican, se resuelven y una importación antigua no los reactiva',()=>{
 const memory=new Map(),sandbox={location:{pathname:'/sesion/actividad-3/'},document:{querySelectorAll:()=>[]},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)}};
 sandbox.window={addEventListener:()=>{}};vm.runInNewContext(fs.readFileSync(new URL('./repaso.js',import.meta.url),'utf8'),sandbox);
 const api=sandbox.window.repasoFisica,q={type:'numeric',prompt:'Calcula la corriente',answer:2};
 api.registrar(q,true);assert.equal(api.pendientes().length,0);api.registrar(q,false);api.registrar(q,false);assert.equal(api.pendientes().length,1);
 const id=api.pendientes()[0].id;api.resolver(id);assert.equal(api.pendientes().length,0);api.registrar(q,false,true);assert.equal(api.pendientes().length,0);api.registrar(q,false);assert.equal(api.pendientes().length,1);
 sandbox.localStorage.setItem=()=>{throw Error('cuota')};api.write('draft',{answer:'2'});assert.equal(api.read('draft',null).answer,'2');
});

test('rondas de seis sin duplicados y seis temas distintos en modo mixto',()=>{
 for(const t of ['mixto',...topics.map(x=>x[0])])for(const seed of [0,.1,.5,.99]){
  const round=crearRonda(t,()=>seed);assert.equal(round.length,6);assert.equal(new Set(round.map(x=>x.prompt)).size,6);
  if(t==='mixto')assert.equal(new Set(round.map(x=>x.topic)).size,6);else assert.ok(round.every(x=>x.topic===t));
 }
});
