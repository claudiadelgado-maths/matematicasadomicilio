import test from 'node:test';
import assert from 'node:assert/strict';
import {numbers,pairs,trinomials,polynomials,key,literal,term,group,simplified,validGroup,polynomial,parseInteger} from './algebra.mjs';
function random(seed) {return ()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);}
test('5000 generaciones: opciones, parejas únicas, trinomios y polinomios desiguales',()=>{
 const rng=random(293);let zeros=0;const seen=new Set();
 for(let i=0;i<5000;i++) {
  const n=numbers(rng);assert(n.a>=-100&&n.a<=100&&n.b>=-100&&n.b<=100);assert.equal(n.answer,n.a+n.b);
  assert.equal(new Set(n.options).size,3);assert(n.options.includes(n.answer));
  if(n.answer){assert(n.options.includes(-n.answer));assert(n.options.some(v=>v!==n.answer&&Math.sign(v)===Math.sign(n.answer)));}else zeros++;
  const cards=pairs(rng),counts=new Map();assert.equal(cards.length,6);
  for(const c of cards){assert(c.c!==0&&Math.abs(c.c)<=100);counts.set(key(c.base),(counts.get(key(c.base))||0)+1);}
  assert.equal(counts.size,3);assert([...counts.values()].every(c=>c===2));
  const t=trinomials(rng);assert.equal(new Set(t.parts.map(key)).size,3);
  t.parts.forEach(base=>{
   const a=t.left.find(v=>key(v.base)===key(base)).c,b=t.right.find(v=>key(v.base)===key(base)).c;
   assert(validGroup(a,b,t.left,t.right,base));assert(validGroup(b,a,t.left,t.right,base));assert(!validGroup(a+1,b,t.left,t.right,base));
  });
  const p=polynomials(rng);assert.notEqual(p.left.length,p.right.length);
  assert.equal(p.groups.filter(g=>g.values.length===2).length,1);
  assert.deepEqual(simplified(group(p.left,p.right)),p.result);
  for(const options of [p.groupingOptions,p.resultOptions]) {assert.equal(options.length,3);assert.equal(new Set(options.map(o=>o.latex)).size,3);assert.equal(options.filter(o=>o.correct).length,1);}
  seen.add(polynomial(p.left));
 }
 assert(zeros>0);assert(seen.size>4500);
});
test('canonicalización completa, ceros, signos y entradas inválidas',()=>{
 assert.equal(key({y:3,x:2,z:0}),key({x:2,y:3}));assert.notEqual(key({x:2,y:3}),key({x:3,y:2}));
 assert.equal(literal({x:0}),'');assert.equal(term(0,{x:9}),'0');assert.equal(term(-1,{x:1}),'-x');
 assert.equal(polynomial([{c:0,base:{x:2}},{c:0,base:{}}]),'0');
 assert.equal(polynomial(simplified(group([{c:8,base:{x:3}}],[{c:-8,base:{x:3}}]))),'0');
 assert.equal(parseInteger('+7'),7);assert.equal(parseInteger(' -100 '),-100);
 for(const input of ['', '2x','1.5','--2','NaN','<script>'])assert.equal(parseInteger(input),null);
});
