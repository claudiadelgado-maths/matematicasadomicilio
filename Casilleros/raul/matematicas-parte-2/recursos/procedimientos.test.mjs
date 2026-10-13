import assert from 'node:assert/strict';
import {coefficientResult,completionSteps} from './procedimientos.mjs';
import {generate,expand,eq,tex,mono,common,divide,unit,degree} from './algebra.mjs';

assert.equal(tex(expand([[mono(1,{x:1}),mono(3)],[mono(1,{x:1}),mono(4)]])),'x^{2}+7x+12');
for(const hard of [false,true])for(let i=0;i<200;i++){
 for(const method of ['monico','general']){
  const r=generate(method,hard),d=r.data,good=coefficientResult(d,d,method==='general');
  assert(good.valid);assert(eq(expand(good.factors),r.expression));
  const alternative=coefficientResult(d,{m:d.p,p:d.m,n:d.q,q:d.n},method==='general');
  assert(alternative.valid);assert(eq(expand(alternative.factors),r.expression));
  assert.equal(coefficientResult(d,{m:d.m,p:d.p,n:d.n,q:NaN},true),null);
  assert.equal(coefficientResult(d,{m:d.m,p:d.p,n:d.n,q:101},true),null);
  assert(!coefficientResult(d,{m:d.m,p:d.p,n:d.n,q:d.q+1},true).valid);
 }
 const r=generate('comun',hard),g=common(r.expression),q=r.expression.map(m=>divide(m,g));
 assert(unit(common(q)),'El factor total termina en una sola extracción.');
 const steps=completionSteps(generate('completar',hard));assert.equal(steps.length,4);
 const polynomial=expand(generate('tcp',hard).factors);assert(polynomial.every((m,i)=>!i||degree(polynomial[i-1])>=degree(m)));
}
console.log('Procedimientos: orden descendente, factor total terminal, 4 pasos y casillas automáticas válidas/alternativas/incompletas comprobados.');
