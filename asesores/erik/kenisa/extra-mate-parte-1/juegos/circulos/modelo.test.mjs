import test from 'node:test';
import assert from 'node:assert/strict';
import {PARTES,radianes,grados,punto,limitar,deltaGiro,elemento,seriePartes,serieMedidas,serieConversiones,validar,crearEstado,responder,avanzar,leerPi,simplificar,convertirEntrada,nuevoEjercicio} from './modelo.mjs';
const azar=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
test('radianes a grados: respuesta entera directa, todos los ángulos de 0 a 360',()=>{
 for(let g=0;g<=360;g++){
  const q=serieConversiones(()=>(g+.1)/361,'deg')[0];assert.equal(q.degrees,g);assert.deepEqual(q.ratio,radianes(g));assert.equal(validar(q,String(g)),'correcta');assert.equal(validar(q,String(g+1)),'error');assert.equal(validar(q,'1/2'),'invalida');assert.equal(validar(q,'90.0'),'invalida');assert.equal(validar(q,'π/2'),'invalida');
 }
 for(const direction of ['rad','deg'])assert.ok(serieConversiones(Math.random,direction).every(q=>q.to===direction));
});
test('300 series: dos niveles directos, opciones únicas y conversiones exactas',()=>{
 const values=new Set();
 for(let seed=0;seed<300;seed++){
  const r=azar(seed),parts=seriePartes(r);assert.equal(parts.length,14);
  for(const p of PARTES)assert.equal(parts.filter(q=>q.target===p.id).length,2);
  for(const level of [1,2]){
   const deck=serieMedidas(level,r);assert.equal(deck.length,8);
   for(const start of [0,4])assert.equal(new Set(deck.slice(start,start+4).map(q=>q.from+q.to)).size,4);
   for(const q of deck){
    assert.ok(['r','d'].includes(q.from));assert.ok(['P','A'].includes(q.to));
    assert.equal(q.given,q.from==='d'?2*q.radio:q.radio);assert.equal(q.expected,q.to==='A'?q.radio**2:2*q.radio);
    assert.equal(q.opciones.length,4);assert.equal(new Set(q.opciones).size,4);
    assert.equal(q.opciones.filter(v=>validar(q,v)==='correcta').length,1);
    assert.equal(validar(q,`${q.expected}π`),'correcta');assert.equal(validar(q,`${q.expected+1}π`),'error');
    assert.equal(validar(q,String(q.expected)),'invalida');assert.equal(validar(q,'3.14'),'invalida');
    values.add(`${q.from}:${q.given}:${q.to}:${q.unit}`);
   }
  }
  const deck=serieConversiones(r);assert.equal(deck.length,12);assert.equal(deck.filter(q=>q.to==='rad').length,6);
  for(const q of deck){
   assert.deepEqual(simplificar(String(q.degrees),'180'),q.ratio);
   const f=convertirEntrada(`${q.ratio.n}π/${q.ratio.d}`);assert.deepEqual(f,{n:q.degrees,d:1});
   assert.equal(validar(q,q.to==='rad'?`${q.ratio.n}/${q.ratio.d}`:String(q.degrees)),'correcta');
  }
 }
 assert.ok(values.size>250);
});
test('calculadoras exactas: pi, P, fracciones, ceros y entradas inválidas',()=>{
 for(const s of ['π/2','1π/2','1P/2','1pi/2',' 1 π / 2 '])assert.deepEqual(leerPi(s),{n:1,d:2});
 for(const s of ['', '2','2.5π','2π/0','π/','ππ','2π+1','π/2π','Infinityπ','1000001π','<script>'])assert.equal(leerPi(s),null);
 for(const pair of [['','2'],['1','0'],['2.5','180'],['-1','180'],['1','Infinity']])assert.equal(simplificar(...pair),null);
 assert.deepEqual(simplificar('150','180'),{n:5,d:6});assert.deepEqual(simplificar('0','180'),{n:0,d:1});
 assert.deepEqual(convertirEntrada('7π/6'),{n:210,d:1});assert.deepEqual(convertirEntrada('π/7'),{n:180,d:7});
});
test('generación continua, saltos sin puntos y confirmación sin duplicados',()=>{
 const r=azar(73),s=crearEstado(serieMedidas(2,r));
 for(let i=0;i<500;i++){
  const q=s.preguntas[s.indice],before=s.resueltos;
  if(i%3){assert.equal(responder(s,''),'invalida');assert.equal(s.errores,0);assert.equal(responder(s,`${q.expected+1}π`),'error');assert.equal(responder(s,`${q.expected}π`),'correcta');responder(s,`${q.expected}π`);assert.equal(s.resueltos,before+1);}
  nuevoEjercicio(s,()=>serieMedidas(2,r));assert.equal(s.resueltos,before+(i%3?1:0));assert.equal(s.completo,false);assert.equal(s.borrador,'');assert.equal(s.calculo,null);assert.ok(s.preguntas.length<=8);
 }
 assert.equal(s.vistos,500);assert.equal(s.primerIntento,0);
});
test('grados, radianes simplificados y giro continuo: 0 no es 360',()=>{
 for(let g=0;g<=360;g++){const f=radianes(g);close(grados(f),g);close(Math.hypot(punto(g).x-240,punto(g).y-240),150);}
 assert.deepEqual(radianes(90),{n:1,d:2});assert.deepEqual(radianes(270),{n:3,d:2});assert.deepEqual(radianes(360),{n:2,d:1});assert.deepEqual(radianes(0),{n:0,d:1});
 assert.equal(deltaGiro(359,1),2);assert.equal(deltaGiro(1,359),-2);assert.equal(limitar(362),360);assert.equal(limitar(-2),0);
});
test('trazos geométricos: radio, diámetro, dos cortes secantes y tangencia',()=>{
 for(let g=0;g<360;g+=7)for(const radius of [90,100,110])for(const p of PARTES){const e=elemento(p.id,g,radius),c=e.centro;
  e.cortes.forEach(v=>close(Math.hypot(v.x-c.x,v.y-c.y),radius));
  if(p.id==='circunferencia'||p.id==='arco')continue;
  const [a,b]=e.segmento,len=Math.hypot(a.x-b.x,a.y-b.y);
  if(p.id==='radio'){close(len,radius);close(Math.hypot(a.x-c.x,a.y-c.y),0);}
  if(p.id==='diametro'){close(len,2*radius);close((a.x+b.x)/2,c.x);close((a.y+b.y)/2,c.y);}
  if(p.id==='secante'){assert.equal(e.cortes.length,2);assert.ok(len>2*radius);}
  if(p.id==='cuerda'){assert.equal(e.cortes.length,2);assert.ok(len<2*radius);}
  if(p.id==='tangente'){const v=e.cortes[0];close((b.x-a.x)*(v.x-c.x)+(b.y-a.y)*(v.y-c.y),0);assert.equal(e.cortes.length,1);}
 }
});
