import test from 'node:test';
import assert from 'node:assert/strict';
import {generateExercise, answerFor, toLatex} from './polinomios.mjs';
test('10 000 preguntas coherentes, tres opciones únicas y una respuesta correcta',()=>{
  let seed=982;
  const random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
  let previous; const kinds=new Set(), variables=new Set(), positions=new Set();
  for(let i=0;i<10000;i++) {
    const e=generateExercise(random,previous);
    assert(e.terms.length>=3 && e.terms.length<=5);
    assert.equal(new Set(e.terms.map(t=>t.exponent)).size,e.terms.length);
    assert.equal(e.terms.at(-1).exponent,0);
    assert(e.terms.every(t=>t.coefficient!==0 && Math.abs(t.coefficient)<=20));
    assert.equal(e.options.length,3); assert.equal(new Set(e.options).size,3);
    assert.equal(e.options.filter(v=>v===answerFor(e.terms,e.kind)).length,1);
    if(previous) {assert.notEqual(e.kind,previous.kind); assert.notEqual(toLatex(e),toLatex(previous)); assert.notEqual(e.answer,previous.answer);}
    kinds.add(e.kind); variables.add(e.variable); positions.add(e.options.indexOf(e.answer)); previous=e;
  }
  assert.equal(kinds.size,5); assert.equal(variables.size,7); assert.equal(positions.size,3);
});
test('signos, coeficiente implícito y término independiente',()=>{
  const terms=[{coefficient:-1,exponent:5},{coefficient:-7,exponent:2},{coefficient:3,exponent:0}];
  assert.equal(toLatex({terms,variable:'x'}),'-x^{5} -7x^{2} +3');
  assert.equal(answerFor(terms,'mayor'),3); assert.equal(answerFor(terms,'menor'),-7);
  assert.equal(answerFor(terms,'grado'),5); assert.equal(answerFor(terms,'terminos'),3);
  assert.equal(answerFor(terms,'independiente'),3);
});
