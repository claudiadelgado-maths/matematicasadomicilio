import test from 'node:test';
import assert from 'node:assert/strict';
import {POLIGONOS,puntos,nombre,crearJuego,frente,pasillos,apuntar,iniciarDisparo,cancelarDisparo,resolverDisparo,rescatar,MAX_ALTURA,avanzarNivel,elegirFigura,NIVEL_INICIAL,NIVEL_FINAL} from './modelo.mjs';

function random(seed){return ()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);}
function shoot(s,col,rng=()=>0){apuntar(s,col);const shot=iniciarDisparo(s);return resolverDisparo(s,shot.id,rng);}
function available(s){assert.ok(frente(s).some(b=>b?.lados===s.figura)||(pasillos(s).length&&s.figura===s.nivel),'El turno tiene un objetivo correcto accesible');}
function correctColumn(s){return s.figura===s.nivel&&pasillos(s).length?pasillos(s)[0]:frente(s).findIndex(b=>b?.lados===s.figura);}

test('Los 18 polígonos tienen el número correcto de vértices y lados iguales',()=>{
 assert.equal(POLIGONOS.length,18);
 for(const p of POLIGONOS){
  assert.ok(nombre(p.lados));const pts=puntos(p.lados,10,20,30);
  assert.equal(pts.length,p.lados);
  const lens=pts.map((v,i)=>Math.hypot(v.x-pts[(i+1)%pts.length].x,v.y-pts[(i+1)%pts.length].y));
  assert.ok(lens.every(l=>Math.abs(l-lens[0])<1e-10));
 }
 assert.equal(nombre(4),'Cuadrilátero');assert.equal(nombre(12),'Dodecágono');assert.equal(nombre(20),'Icoságono');
 assert.throws(()=>puntos(2),RangeError);assert.throws(()=>crearJuego(13),RangeError);
});

test('Cada modo comienza con 4 filas de 5 y su primer nombre siempre es jugable',()=>{
 for(const max of [12,20])for(let seed=0;seed<300;seed++){
  const s=crearJuego(max,random(seed),3+seed%18);assert.equal(s.columnas.length,5);
  assert.ok(s.columnas.every(c=>c.length===4));assert.equal(new Set(s.columnas.flat().map(b=>b.id)).size,20);
  assert.ok(s.columnas.flat().every(b=>b.lados>=3&&b.lados<=max&&b.tipo==='bloque'));available(s);
 }
 assert.equal(crearJuego(20,()=>.999999).columnas[0][0].lados,20);
 assert.equal(crearJuego(12,()=>0).columnas[0][0].lados,3);
});

test('Un pentágono contra 3 se acumula como 5 y luego se retira sin destruir el 3',()=>{
 const s=crearJuego(12,()=>0);s.columnas[1].at(-1).lados=5;s.figura=5;
 const originals=structuredClone(s.columnas[0]);
 assert.equal(shoot(s,0).tipo,'error');assert.equal(s.columnas[0].length,5);
 assert.deepEqual(s.columnas[0].slice(0,4),originals);
 assert.equal(frente(s)[0].lados,5);assert.equal(frente(s)[0].tipo,'figura');available(s);
 s.figura=5;assert.equal(shoot(s,0).tipo,'acierto');assert.deepEqual(s.columnas[0],originals);
 assert.equal(s.errores,1);assert.equal(s.aciertos,1);available(s);
});

test('Solo importa el frente: una coincidencia escondida no elimina otro bloque',()=>{
 const s=crearJuego(12,()=>0);s.columnas[0][0].lados=5;s.figura=5;
 assert.equal(shoot(s,0).tipo,'error');assert.equal(s.columnas[0][0].lados,5);assert.equal(s.columnas[0].length,5);
});

test('Se abre una columna con cuatro aciertos y el siguiente disparo llega al enemigo',()=>{
 const s=crearJuego(12,()=>0);
 for(let i=0;i<4;i++){assert.equal(shoot(s,2).tipo,'acierto');assert.equal(s.columnas[2].length,3-i);}
 assert.deepEqual(pasillos(s),[2]);assert.equal(s.fase,'listo');assert.equal(s.columnas.flat().length,16);
 assert.equal(shoot(s,2).tipo,'victoria');assert.equal(s.fase,'ganado');assert.equal(iniciarDisparo(s),null);
});

test('La torre se limita a seis y la ayuda retira solo la última figura añadida',()=>{
 const s=crearJuego(12,()=>0), originals=structuredClone(s.columnas[0]);
 for(let i=0;i<2;i++){s.figura=4+i;assert.equal(shoot(s,0).tipo,'error');}
 assert.equal(s.columnas[0].length,MAX_ALTURA);assert.equal(s.fase,'ayuda');available(s);
 assert.equal(iniciarDisparo(s),null);assert.equal(apuntar(s,1),false);
 const before=structuredClone(s.columnas[0]);assert.equal(rescatar(s),true);
 assert.deepEqual(s.columnas[0],before.slice(0,-1));assert.deepEqual(s.columnas[0].slice(0,4),originals);
 assert.equal(s.ayudas,1);assert.equal(s.fase,'listo');assert.equal(rescatar(s),false);available(s);
});

test('El disparo bloquea dobles acciones y no acepta resoluciones antiguas',()=>{
 const s=crearJuego(12,()=>0);assert.equal(apuntar(s,-1),false);assert.equal(apuntar(s,5),false);
 const shot=iniciarDisparo(s);assert.equal(iniciarDisparo(s),null);assert.equal(apuntar(s,4),false);
 assert.equal(resolverDisparo(s,shot.id+1),null);assert.equal(s.columnas.flat().length,20);
 assert.equal(resolverDisparo(s,shot.id).tipo,'acierto');assert.equal(resolverDisparo(s,shot.id),null);
 const next=iniciarDisparo(s);assert.equal(resolverDisparo(s,shot.id),null);
 assert.equal(resolverDisparo(s,next.id).tipo,'acierto');
});

test('Cerrar o redimensionar cancela el vuelo sin alterar las defensas y permite continuar',()=>{
 const s=crearJuego(12,random(52)),before=structuredClone(s.columnas),shot=iniciarDisparo(s);
 assert.equal(cancelarDisparo(s),true);assert.equal(s.fase,'listo');assert.equal(s.pendiente,null);
 assert.deepEqual(s.columnas,before);assert.equal(resolverDisparo(s,shot.id),null);
 assert.equal(cancelarDisparo(s),false);
 const next=iniciarDisparo(s);assert.notEqual(next.id,shot.id);assert.equal(resolverDisparo(s,shot.id),null);
 assert.ok(resolverDisparo(s,next.id));available(s);
});

test('Partidas variadas mantienen un nombre posible y siempre permiten terminar',()=>{
 for(const max of [12,20])for(let seed=1;seed<=150;seed++){
  const rng=random(seed),s=crearJuego(max,rng,3+seed%18);
  for(let n=0;n<70;n++){
   if(s.fase==='ganado')break;
   available(s);assert.ok(s.columnas.every(c=>c.length<=MAX_ALTURA));
   if(s.fase==='ayuda'){assert.equal(rescatar(s,rng),true);continue;}
   const nonempty=frente(s).map((b,i)=>b?i:-1).filter(i=>i>=0);
   if(!nonempty.length)break;
   const match=correctColumn(s);
   shoot(s,rng()<.5?match:nonempty[Math.floor(rng()*nonempty.length)],rng);
  }
  if(s.fase==='ayuda')rescatar(s,rng);
  let safe=0;
  while(s.fase!=='ganado'&&safe++<33){available(s);shoot(s,correctColumn(s),rng);}
  assert.ok(pasillos(s).length,'Los aciertos abren un camino sin desbloqueos');
  assert.equal(s.fase,'ganado');
 }
});

test('El jefe exige sus lados: un proyectil distinto rebota sin victoria ni nueva defensa',()=>{
 const s=crearJuego(12,()=>0,5);
 for(let i=0;i<4;i++)assert.equal(shoot(s,0).tipo,'acierto');
 const before=structuredClone(s.columnas);s.figura=3;
 const shot=iniciarDisparo(s),outcome=resolverDisparo(s,shot.id,()=>0);
 assert.equal(outcome.tipo,'escudo');assert.equal(s.fase,'listo');assert.equal(s.errores,1);
 assert.deepEqual(s.columnas,before);assert.equal(s.figura,5);available(s);
 assert.equal(resolverDisparo(s,shot.id),null);
 assert.equal(shoot(s,0).tipo,'victoria');assert.equal(s.fase,'ganado');
 assert.equal(iniciarDisparo(s),null);
});

test('El polígono del jefe no atraviesa una columna ocupada',()=>{
 const s=crearJuego(12,()=>0,5);s.figura=5;
 assert.equal(shoot(s,0).tipo,'error');assert.equal(s.fase,'listo');
 assert.equal(s.columnas[0].length,5);assert.equal(pasillos(s).length,0);
});

test('Cada jefe recibe munición en tres turnos como máximo aunque no aparezca en las defensas',()=>{
 for(let nivel=3;nivel<=20;nivel++)for(let seed=0;seed<20;seed++){
  const rng=random(seed),s=crearJuego(12,rng,nivel);s.columnas[0]=[];
  let turns=0;
  do{elegirFigura(s,rng);available(s);turns++;}while(s.figura!==nivel&&turns<3);
  assert.equal(s.figura,nivel);
  s.columnas=s.columnas.map(()=>[]);
  assert.equal(elegirFigura(s,rng),nivel);assert.equal(shoot(s,0,rng).tipo,'victoria');
 }
});

test('Los niveles avanzan solo tras vencer, conservan el rango y terminan en el 20',()=>{
 for(const max of [12,20]){
  const rng=random(302),finished=[];let s=crearJuego(max,rng);
  assert.equal(s.nivel,NIVEL_INICIAL);
  while(s){
   assert.equal(avanzarNivel(s,rng),null);assert.equal(s.max,max);
   assert.ok(s.columnas.every(c=>c.length===4));assert.equal(s.aciertos,0);
   for(let turn=0;s.fase!=='ganado'&&turn<25;turn++){available(s);shoot(s,correctColumn(s),rng);}
   assert.equal(s.fase,'ganado');finished.push(s.nivel);
   s=avanzarNivel(s,rng);
  }
  assert.deepEqual(finished,Array.from({length:18},(_,i)=>i+3));
  const replay=crearJuego(max,rng,NIVEL_FINAL);assert.equal(replay.nivel,20);assert.equal(replay.fase,'listo');
 }
 for(const nivel of [0,1,2,21,3.5])assert.throws(()=>crearJuego(12,()=>0,nivel),RangeError);
});
