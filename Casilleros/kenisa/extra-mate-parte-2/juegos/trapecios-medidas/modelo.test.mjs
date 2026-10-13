import test from 'node:test';
import assert from 'node:assert/strict';
import {CASOS,generar,geometria,datosFigura,crearEstado,responder,siguiente} from './modelo.mjs';
let seed=97361;
const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
const entero=n=>{assert.ok(Number.isInteger(n)&&n>0,`Se esperaba entero positivo: ${n}`);return n;};
const known={A1:['B','b','h'],A2:['B','b','L1'],A3:['B','b','L1'],A4:['b','h','x','y'],A5:['B','b','y','L1'],P1:['B','b','L1','L2'],P2:['B','b','L1'],P3:['B','b','h'],P4:['b','h','x','y'],P6:['b','x','L1']};
// Reconstrucción desde los datos entregados, sin consultar la respuesta ni las medidas ocultas.
function resolver(q){
 let {B,b,h,x,y,L1,L2}=Object.fromEntries(q.given.map(k=>[k,q[k]]));
 switch(q.id){
  case 'A2':x=entero(B-b);h=entero(Math.sqrt(L1**2-x**2));break;
  case 'A3':x=entero((B-b)/2);h=entero(Math.sqrt(L1**2-x**2));break;
  case 'A4':B=entero(x+b+y);break;
  case 'A5':x=entero(B-b-y);h=entero(Math.sqrt(L1**2-x**2));break;
  case 'P2':L2=L1;break;
  case 'P3':x=entero(B-b);L1=entero(Math.sqrt(h**2+x**2));L2=h;break;
  case 'P4':B=entero(x+b+y);L1=entero(Math.sqrt(h**2+x**2));L2=entero(Math.sqrt(h**2+y**2));break;
  case 'P5':if(q.variant===1)b=entero(B-x-y);else B=entero(b+x+y);break;
  case 'P6':B=entero(b+2*x);L2=L1;break;
 }
 return q.goal==='A'?entero(entero((B+b)/2)*h):entero(B+b+L1+L2);
}
for(const {id} of CASOS)test(`${id}: 1000 figuras válidas, datos suficientes y operaciones enteras`,()=>{
 const signatures=new Set();const variants=new Set();
 for(let i=0;i<1000;i++){
  const q=generar(id,random);variants.add(q.variant);signatures.add(JSON.stringify(q));
  assert.equal(q.id,id);assert.ok(q.B>q.b&&q.b>0&&q.h>0&&q.x>0&&q.y>=0);
  assert.equal(q.B,q.x+q.b+q.y);assert.ok(Math.abs(q.L1**2-q.x**2-q.h**2)<1e-8);assert.ok(Math.abs(q.L2**2-q.y**2-q.h**2)<1e-8);
  if(q.iso){assert.equal(q.x,q.y);assert.equal(q.L1,q.L2);}else if(q.tipo==='rectángulo')assert.equal(q.y,0);else assert.notEqual(q.x,q.y);
  assert.deepEqual(q.given,id==='P5'?[q.variant===1?'B':'b','x','y','L1','L2']:known[id]);
  q.given.forEach(k=>entero(q[k]));q.unknown.forEach(k=>entero(q[k]));
  assert.equal(resolver(q),q.answer);entero(q.answer);
  const data=datosFigura(q);assert.deepEqual(Object.keys(data),[...q.given,...q.unknown]);
  for(const k of q.unknown)assert.equal(data[k],null);
  for(const k of q.given)assert.equal(data[k],q[k]);
  for(const k of [...q.given,...q.unknown])assert.equal(datosFigura(q,true)[k],q[k]);
  assert.ok(q.B<=90&&q.h<=48&&q.answer<=5000);
 }
 assert.ok(signatures.size>=20);if(id==='P5')assert.deepEqual([...variants].sort(),[1,2]);
});
test('Mover la base conserva el área y puede cambiar el perímetro',()=>{
 const shapes=[0,2,5,8,10].map(x=>geometria(20,10,8,x));
 shapes.forEach(g=>assert.equal(g.area,120));assert.equal(shapes[0].L1,8);assert.equal(shapes[4].L2,8);
 assert.equal(shapes[2].L1,shapes[2].L2);assert.notEqual(shapes[0].perimetro,shapes[2].perimetro);assert.equal(shapes[1].perimetro,shapes[3].perimetro);
});
test('Filtros, errores, reintentos, progreso y ejercicios nuevos',()=>{
 for(const filtro of ['area','perimetro',...CASOS.map(c=>c.id)]){
  const s=crearEstado();s.filtro=filtro;
  for(let i=0;i<20;i++){siguiente(s,random);assert.ok(filtro==='area'?s.q.id[0]==='A':filtro==='perimetro'?s.q.id[0]==='P':s.q.id===filtro);}
 }
 const s=crearEstado();for(const raw of ['','  ','NaN','1.5','2e2','-2','π','1000001'])assert.equal(responder(s,raw),'invalida');
 assert.equal(s.errores,0);assert.equal(responder(s,String(s.q.answer+1)),'error');assert.equal(s.errores,1);
 assert.equal(responder(s,String(s.q.answer)),'correcta');assert.equal(s.resueltos,1);assert.equal(s.primerIntento,0);
 assert.equal(responder(s,String(s.q.answer)),'bloqueada');assert.equal(s.resueltos,1);
 const previous=JSON.stringify(s.q);siguiente(s,random);assert.notEqual(JSON.stringify(s.q),previous);assert.equal(s.completo,false);assert.equal(s.errores,0);
 assert.equal(responder(s,String(s.q.answer)),'correcta');assert.equal(s.resueltos,2);assert.equal(s.primerIntento,1);
 siguiente(s,random);siguiente(s,random);assert.equal(s.resueltos,2);
 assert.throws(()=>generar('inexistente'),RangeError);
});
