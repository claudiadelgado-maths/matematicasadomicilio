import test from 'node:test';
import assert from 'node:assert/strict';
import {CASOS,FAMILIAS,generar,crearEstado,responder,siguiente} from './modelo.mjs';
import {dibujo} from './figuras.mjs';
let seed=14683;
const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
const integer=n=>{assert.ok(Number.isInteger(n)&&n>0,`Entero positivo esperado: ${n}`);return n;};
// Recupera las medidas solo a partir de los datos entregados en cada plantilla.
function solve(q){
 const {P,A,k,d,h,b,L}=q.parameters;let x,B,base,side;
 switch(q.id){
  case 'R1':case 'R3':x=integer(P/(2*(k+1)));base=integer(k*x);return q.goal==='area'?base*x:q.goal==='base'?base:x;
  case 'R2':case 'R4':x=integer((integer(P/2)-d)/2);base=integer(x+d);return q.goal==='area'?base*x:q.goal==='base'?base:x;
  case 'C1':return integer(P/4);
  case 'C2':side=integer(P/4);return side*side;
  case 'C3':return integer(Math.sqrt(A));
  case 'C4':return integer(Math.sqrt(A))*4;
  case 'T1':return integer(P/(1+2*k));
  case 'T2':return integer((P-2*d)/3);
  case 'T3':base=integer(L+(b>L?d:-d));return base+2*L;
  case 'T4':return integer((P-d)/4);
  case 'TR1':return integer((integer(2*A/h)-d)/2);
  case 'TR2':return integer(integer(2*A/h)/(k+1));
  case 'TR3':B=integer(b+d);return integer((B+b)*h/2);
  case 'TR4':return integer(integer(2*A/h)-b);
  case 'TR5':return integer((P-2*L-d)/2);
  case 'TR6':return integer((P-2*L)/3);
 }
}
for(const {id} of CASOS)test(`${id}: 1000 problemas enteros, coherentes y variados`,()=>{
 const variants=new Set();
 for(let i=0;i<1000;i++){
  const q=generar(id,random),g=q.geom;assert.equal(q.id,id);assert.equal(solve(q),q.answer);integer(q.answer);assert.ok(q.answer<=500);
  assert.ok(q.statement&&q.question&&q.meaning&&q.equation);assert.equal(q.hints.length,3);assert.ok(q.steps.length>=2);
  assert.equal(q.answerUnit,q.unit+(q.goal==='area'?'²':''));
  if(q.shape==='triangulo'){assert.ok(g.L1+g.L2>g.b&&g.L1+g.b>g.L2&&g.L2+g.b>g.L1);assert.equal(g.b+g.L1+g.L2,q.parameters.P);}
  if(q.shape==='trapecio'){assert.ok(g.B>g.b&&g.b>0&&g.h>0);if(g.L1){assert.ok(g.L1>(g.B-g.b)/2);assert.ok(Math.abs(g.L1*g.L1-g.h*g.h-((g.B-g.b)/2)**2)<1e-8);assert.equal(g.B+g.b+g.L1+g.L2,q.parameters.P);}else assert.equal((g.B+g.b)*g.h/2,q.parameters.A);}
  if(q.shape==='rectangulo'||q.shape==='cuadrado'){assert.equal(g.b*g.h,q.parameters.A);assert.equal(2*(g.b+g.h),q.parameters.P);}
  assert.deepEqual(Object.keys(q.labels),Object.keys(q.solvedLabels));
  for(const label of Object.values(q.solvedLabels))integer(Number(label));
  const svg=dibujo(q);assert.ok(!/NaN|undefined|Infinity/.test(svg));assert.ok(!svg.includes('Así se'));assert.ok(Object.values(q.labels).every(label=>svg.includes(label)));
  assert.ok(!/NaN|undefined|Infinity/.test(dibujo(q,true)));variants.add(q.statement+' '+q.question);
 }
 assert.ok(variants.size>=18,`${id}: ${variants.size} variantes`);
});
test('Familias, variedad, error, acierto, ayudas y salto sin puntuación',()=>{
 for(const family of Object.keys(FAMILIAS))for(let i=0;i<100;i++)assert.equal(generar(family,random).familia,family);
 assert.equal(new Set(Array.from({length:2000},()=>generar('todos',random).id)).size,18);
 assert.throws(()=>generar('invalido'),RangeError);
 const s=crearEstado();assert.equal(s.q.id,'C1');
 for(const raw of ['',' ','-2','2.5','2e1','NaN','100001'])assert.equal(responder(s,raw),'invalida');assert.equal(s.errores,0);
 assert.equal(responder(s,'0'),'error');assert.equal(s.errores,1);assert.equal(responder(s,String(s.q.answer)),'correcta');assert.equal(s.resueltos,1);assert.equal(s.primerIntento,0);
 assert.equal(responder(s,String(s.q.answer)),'bloqueada');assert.equal(s.resueltos,1);
 s.ayudas=3;s.filtro='TR1';siguiente(s,random);assert.equal(s.q.id,'TR1');assert.equal(s.ayudas,0);assert.equal(s.errores,0);assert.equal(s.completo,false);
 assert.equal(responder(s,String(s.q.answer)),'correcta');assert.equal(s.primerIntento,1);
 siguiente(s,random);const old=JSON.stringify(s.q);siguiente(s,random);assert.notEqual(JSON.stringify(s.q),old);assert.equal(s.resueltos,2);
});
