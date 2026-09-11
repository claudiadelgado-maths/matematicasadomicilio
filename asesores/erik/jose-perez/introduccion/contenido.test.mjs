import test from 'node:test';
import assert from 'node:assert/strict';
import {numberValue,makePractice,topics,families} from './contenido.mjs';

test('acepta respuestas equivalentes y rechaza divisiones por cero o texto',()=>{
  for(const s of ['1/2','0.5','0,5',' 2 / 4 '])assert.equal(numberValue(s),.5);
  assert.equal(numberValue('−3/2'),-1.5);
  for(const s of ['', ' ', '1/0','1/0.0','2+3','3abc','Infinity','1/2/3'])assert.ok(Number.isNaN(numberValue(s)),s);
});
test('las variantes numéricas corresponden a operaciones independientes',()=>{
  for(let seed=0;seed<50;seed++){
    const n=2+seed%5;
    const expected={bases:n/6+1/6,distance:Math.hypot(3*n,4*n),slope:(-2*n)/n,function:2*n+3,derivative:((n+.0001)**2-(n-.0001)**2)/.0002,surface:1+3*n+n*n,area:n*n};
    for(const [kind,value]of Object.entries(expected))assert.ok(Math.abs(makePractice(kind,seed).answer-value)<1e-7,kind);
  }
});
test('familias respetan los valores y restricciones principales',()=>{
  const f=Object.fromEntries(families.map(f=>[f.id,f.fn]));
  assert.ok(Number.isNaN(f.root(-1)));assert.equal(f.root(0),0);
  assert.ok(!Number.isFinite(f.reciprocal(0)));assert.equal(f.reciprocal(-2),-.5);
  assert.ok(!Number.isFinite(f.log(0)));assert.equal(f.log(1),0);
  assert.equal(f.exp(0),1);assert.equal(f.sine(0),0);assert.equal(f.cosine(0),1);
});
test('hay veinte vistas, ejemplos consistentes y enlaces de tema únicos',()=>{
  assert.equal(topics.length,20);assert.equal(new Set(topics.map(t=>t.id)).size,20);
  for(const t of topics){assert.ok(t.idea&&t.formula&&t.life);if(t.quiz)assert.ok(t.quiz.options[t.quiz.correct]);for(const e of t.examples)assert.ok(e.steps.length);}
});
test('comprobaciones de cálculo del recorrido',()=>{
  const f=(x,y)=>x*x+3*x*y+y*y,h=1e-5;
  assert.ok(Math.abs((f(1+h,2)-f(1-h,2))/(2*h)-8)<1e-7);
  assert.ok(Math.abs((f(1,2+h)-f(1,2-h))/(2*h)-7)<1e-7);
  let integral=0;const N=100;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++)integral+=((i+.5)/N+2*(j+.5)/N)*2/(N*N);
  assert.ok(Math.abs(integral-3)<1e-10);
});
