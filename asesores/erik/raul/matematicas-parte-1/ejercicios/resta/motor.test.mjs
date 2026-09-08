import test from 'node:test';
import assert from 'node:assert/strict';
import {memoryExercise,reviewExercise,subtractExercise} from './motor.mjs';
import {grouped,polynomial} from '../../recursos/algebra.mjs';
test('Generadores: cuatro parejas, revisión mixta y restas con opciones únicas',()=>{
 let previous;
 for(let n=0;n<5000;n++){
  const cards=memoryExercise();assert.equal(cards.length,8);assert.equal(new Set(cards.map(c=>c.latex)).size,8);
  for(let pair=0;pair<4;pair++)assert.equal(cards.filter(c=>c.pair===pair).length,2);
  const review=reviewExercise(previous);assert.notEqual(review.mask,previous);previous=review.mask;
  assert(review.correct.some(Boolean));assert(review.correct.some(v=>!v));
  review.terms.forEach((t,i)=>assert.equal(review.correct[i],review.proposed[i].c===-t.c));
  const ex=subtractExercise();assert.equal(new Set(ex.options.map(o=>o.latex)).size,3);assert.equal(ex.options.filter(o=>o.correct).length,1);
  ex.result.forEach((t,i)=>assert.equal(t.c,ex.left[i].c-ex.right[i].c));
  assert.equal(ex.options.find(o=>o.correct).latex,polynomial(ex.result));
 }
});
test('Notación sin paréntesis individuales y signos consecutivos',()=>{
 assert.equal(grouped([{base:{x:2},values:[7,-4]},{base:{},values:[-8]}]),'(7 - 4)x^{2} - 8');
 assert.equal(grouped([{base:{x:1},values:[-7,4]}]),'- (7 - 4)x');
 assert.equal(grouped([{base:{x:1},values:[null,-4]}]),'(\\square - 4)x');
});
