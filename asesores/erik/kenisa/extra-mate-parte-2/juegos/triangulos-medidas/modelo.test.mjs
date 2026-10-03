import test from 'node:test';
import assert from 'node:assert/strict';
import {CASOS,generar,crearEstado,responder,siguiente} from './modelo.mjs';
const random=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
test('5000 ejercicios: lados válidos, área perpendicular y respuestas enteras',()=>{
 const r=random(72),seen=new Set();
 for(const c of CASOS)for(let i=0;i<1000;i++){
  const q=generar(c.id,r);seen.add([q.id,q.base,q.left,q.right,q.goal,q.hidden].join(','));
  assert.ok(Number.isInteger(q.answer)&&q.answer>0);assert.ok(q.height>0);assert.ok(q.foot>=0&&q.foot<=q.base);
  if(q.left){assert.ok(q.base+q.left>q.right&&q.base+q.right>q.left&&q.left+q.right>q.base);assert.ok(Math.abs(Math.hypot(q.foot,q.height)-q.left)<1e-8);assert.ok(Math.abs(Math.hypot(q.base-q.foot,q.height)-q.right)<1e-8);}
  assert.equal(q.answer,q.goal==='P'?q.base+q.left+q.right:q.base*q.height/2);
  if(q.id==='rectangulo')assert.equal(q.base*q.base+q.left*q.left,q.right*q.right);
  if(q.id==='equilatero')assert.equal(q.answer,3*q.base);
  if(q.id==='isosceles'){assert.equal(q.left,q.right);assert.notEqual(q.base,q.left);}
 }
 assert.ok(seen.size>250);
});
test('todos los casos de Pitágoras y puntuación sin duplicados',()=>{
 for(let mode=0;mode<4;mode++){const q=generar('rectangulo',random(42),mode);assert.equal(q.goal,mode<2?'P':'A');assert.equal(q.hidden,mode===0?'right':mode===3?null:'left');}
 const r=random(15),s=crearEstado('rectangulo',r);
 assert.equal(responder(s,''),'invalida');assert.equal(s.errores,0);assert.equal(responder(s,String(s.q.answer+1)),'error');assert.equal(responder(s,String(s.q.answer)),'correcta');assert.equal(responder(s,String(s.q.answer)),'bloqueada');assert.equal(s.resueltos,1);assert.equal(s.primerIntento,0);
 for(let i=0;i<100;i++)siguiente(s,r);assert.equal(s.resueltos,1);assert.equal(s.completo,false);assert.equal(responder(s,String(s.q.answer)),'correcta');assert.equal(s.primerIntento,1);
});
