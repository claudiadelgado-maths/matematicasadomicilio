import test from 'node:test';
import assert from 'node:assert/strict';
import {generar,validar,crearEstado,responder,siguiente} from './modelo.mjs';
const random=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
test('6000 figuras válidas, fórmulas y filtros',()=>{
 const r=random(35);let integer=0,irrational=0;
 for(const shape of ['cuadrado','rectangulo'])for(const goal of ['P','A','D'])for(let i=0;i<1000;i++){
  const q=generar(goal==='D'?'diagonal':'medidas',shape,goal,r);
  assert.equal(q.figura,shape);assert.equal(q.goal,goal);assert.ok(q.a>0&&q.b>0);
  if(shape==='cuadrado')assert.equal(q.a,q.b);else assert.notEqual(q.a,q.b);
  if(goal==='D'){assert.equal(q.square,q.a*q.a+q.b*q.b);assert.equal(validar(q,String(q.square),true),'correcta');const root=Math.sqrt(q.square);if(Number.isInteger(root)){integer++;assert.equal(validar(q,String(root)),'correcta');}else{irrational++;assert.equal(validar(q,String(Math.floor(root))),'error');}}
  else{assert.equal(q.answer,goal==='P'?2*(q.a+q.b):q.a*q.b);assert.equal(validar(q,String(q.answer)),'correcta');}
 }
 assert.ok(integer>100&&irrational>100);
});
test('raíces equivalentes sin aproximaciones ni ejecución de texto',()=>{
 const q={goal:'D',square:9};assert.equal(validar(q,'3'),'correcta');assert.equal(validar(q,'9',true),'correcta');assert.equal(validar(q,'3',true),'error');assert.equal(validar(q,'9'),'error');
 assert.equal(validar({goal:'D',square:2},'2',true),'correcta');
 for(const v of ['', '-3','1.414','√9','NaN','Infinity','1e2','1000001','<script>'])assert.equal(validar(q,v),'invalida');
});
test('aciertos únicos y saltos sin puntos',()=>{
 const s=crearEstado('diagonal');s.raiz=true;assert.equal(responder(s,''),'invalida');assert.equal(s.errores,0);assert.equal(responder(s,String(s.q.square+1)),'error');assert.equal(responder(s,String(s.q.square)),'correcta');assert.equal(responder(s,String(s.q.square)),'bloqueada');assert.equal(s.resueltos,1);assert.equal(s.primerIntento,0);
 for(let i=0;i<40;i++)siguiente(s);assert.equal(s.resueltos,1);assert.equal(s.raiz,false);assert.equal(s.completo,false);
});
