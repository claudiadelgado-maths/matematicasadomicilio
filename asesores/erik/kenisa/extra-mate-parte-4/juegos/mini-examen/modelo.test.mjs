import test from 'node:test';
import assert from 'node:assert/strict';
import {TEMAS,CASOS,PARES,generar,crearBanco,siguientePregunta,crearExamen,responderExamen,avanzarExamen,resultado,responderPractica,redondear} from './modelo.mjs';
import {dibujar} from './figuras.mjs';
import {LADOS,angulosDe} from '../../recursos/matematicas-triangulos.mjs';
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
const cerca=(a,b,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon,`${a} ≠ ${b}`);
const distancia=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const medidas=t=>LADOS.map(([a,b])=>distancia(t.puntos[a],t.puntos[b]));
const vector=(a,b)=>({x:b.x-a.x,y:b.y-a.y});
function clasificarCuadrilatero(p){
 const lados=p.map((v,i)=>vector(v,p[(i+1)%4])),ls=p.map((v,i)=>distancia(v,p[(i+1)%4]));
 const paralelo=(u,v)=>Math.abs(u.x*v.y-u.y*v.x)<1e-7,pares=Number(paralelo(lados[0],lados[2]))+Number(paralelo(lados[1],lados[3]));
 const rectos=lados.every((u,i)=>Math.abs(u.x*lados[(i+1)%4].x+u.y*lados[(i+1)%4].y)<1e-7),iguales=ls.every(l=>Math.abs(l-ls[0])<1e-7);
 return pares===0?'trapezoide':pares===1?'trapecio':rectos?(iguales?'cuadrado':'rectangulo'):(iguales?'rombo':'romboide');
}
test('5 950 preguntas: cuatro opciones únicas, dibujos finitos y respuestas matemáticas correctas',()=>{
 const r=rng(991);let cuenta=0;
 for(const [tipo,casos] of Object.entries(CASOS))for(const caso of casos)for(let i=0;i<25;i++){
  const q=generar(tipo,caso,r);cuenta++;assert.equal(q.opciones.length,4);assert.equal(new Set(q.opciones.map(o=>o.id)).size,4);assert.equal(q.opciones.filter(o=>o.id===q.correcta).length,1);
  assert.ok(q.pregunta&&q.explicacion&&q.pista);const answer=q.opciones.find(o=>o.id===q.correcta);
  if(q.valor!==undefined){assert.ok(Number.isInteger(q.valor)&&q.valor>=0);assert.equal(q.correcta,'v'+q.valor);}
  for(const d of [q.dibujo,...q.opciones.map(o=>o.dibujo)].filter(Boolean)){
   const markup=dibujar(d);assert.ok(markup.includes('role='));assert.ok(!/NaN|undefined|Infinity/.test(markup));
  }
  if(tipo==='angulos'){const g=q.dibujo.grados,clase=g===0?'nulo':g<90?'agudo':g===90?'recto':g<180?'obtuso':g===180?'llano':g<360?'concavo':'completo';assert.equal(q.correcta,clase);}
  if(tipo==='paralelas'){const matches=Object.entries(PARES).filter(([,ps])=>ps.some(v=>[...v].sort().join()===q.dibujo.par.join()));assert.equal(matches.length,1);assert.equal(matches[0][0],q.correcta);}
  if(tipo==='triangulos'){
   const t=q.dibujo.t,ls=medidas(t),ang=angulosDe(t.puntos);assert.equal(q.opciones.at(-1).label,'No es un triángulo');
   const a=ls.map(v=>Math.round(v*1e7));const clase=caso.startsWith('lados')?(new Set(a).size===1?'equilatero':new Set(a).size===2?'isosceles':'escaleno'):(ang.some(v=>Math.abs(v-90)<1e-6)?'rectangulo':ang.some(v=>v>90)?'obtusangulo':'acutangulo');assert.equal(q.correcta,clase);
   for(const [j,d] of Object.entries(t.lados))cerca(+d.texto,ls[j]);for(const [j,d] of Object.entries(t.angulos))cerca(parseFloat(d.texto),ang[j]);
  }
  if(tipo==='medidas-triangulo'){const ang=angulosDe(q.dibujo.t.puntos);cerca(q.valor,caso==='exterior'?180-ang[1]:caso==='exterior-adyacente'?ang[1]:ang[2]);for(const [j,d] of Object.entries(q.dibujo.t.angulos))if(!d.objetivo)cerca(parseFloat(d.texto),ang[j]);}
  if(tipo==='cuadrilateros'){const verdaderas=q.opciones.filter(o=>clasificarCuadrilatero(o.dibujo.puntos)===caso);assert.equal(verdaderas.length,1);assert.equal(verdaderas[0].id,q.correcta);}
  if(tipo==='trapecios'){
   const d=q.dibujo,ls=d.puntos.map((p,i)=>distancia(p,d.puntos[(i+1)%4]));ls.forEach((v,i)=>cerca(v,d.lados[i]));assert.equal(clasificarCuadrilatero(d.puntos),'trapecio');assert.equal(q.opciones.at(-1).label,'No es un trapecio');
   const recto=d.puntos[0].x===d.puntos[3].x,iso=Math.abs(ls[1]-ls[3])<1e-7;assert.equal(q.correcta,recto?'rectangulo':iso?'isosceles':'escaleno');
  }
  if(tipo==='circulo')assert.equal(q.correcta,q.dibujo.parte);
  if(tipo==='perimetros'||tipo==='areas'){
   const d=q.dibujo,a=q.audit,area=tipo==='areas';let v;
   if(caso==='circulo'){v=area?a.radio**2:2*a.radio;assert.ok(q.pi);assert.equal(d.medida,a.radio);}
   else if(caso==='trapecio'){const ls=d.puntos.map((p,i)=>distancia(p,d.puntos[(i+1)%4]));v=area?(a.B+a.b)*a.h/2:ls.reduce((x,y)=>x+y,0);}
   else v=area?a.b*a.h:2*(a.b+a.h);cerca(q.valor,v);
   if(d.labels)for(const [j,l] of Object.entries(d.labels))cerca(l,distancia(d.puntos[j],d.puntos[(+j+1)%4]));
  }
  if(tipo==='nombres'){const n=q.audit.n;if(q.audit.modo==='figura'){assert.equal(answer.dibujo.n,n);assert.equal(new Set(q.opciones.map(o=>o.dibujo.n)).size,4);}else if(q.audit.modo==='lados')assert.equal(q.valor,n);else assert.equal(+q.correcta,n);}
  if(tipo==='partes'){if(q.audit.modo==='figura'){assert.equal(answer.dibujo.parte,q.audit.parte);assert.equal(new Set(q.opciones.map(o=>o.dibujo.parte)).size,4);}else assert.equal(q.correcta,q.dibujo.parte);for(const d of [q.dibujo,...q.opciones.map(o=>o.dibujo)].filter(Boolean))if(d.parte==='diagonal')assert.ok(d.n>=4);}
  if(tipo==='formulas'){
   const {n,l,apotema}=q.audit;assert.equal(q.dibujo.n,n);assert.match(q.datos[0],/regular$/);let v;
   if(caso==='perimetro')v=n*l;
   else if(caso==='area'){v=redondear(n*l*apotema/2);cerca(apotema,l/(2*Math.tan(Math.PI/n)),.05000001);assert.equal(q.dibujo.aproximado,n!==4);if(n!==4)assert.match(q.nota,/redondeada/);}
   else if(caso==='diagonales-vertice')v=n-3;
   else if(caso==='diagonales-total')v=n*(n-3)/2;
   else{const destino=caso.split('-')[1];v=destino==='suma'?(n-2)*180:destino==='interior'?180-360/n:360/n;}
   cerca(q.valor,v);
  }
  if(tipo==='relacion'){
   const ls=q.dibujo.ts.map(medidas),ks=ls[1].map((v,i)=>v/ls[0][i]);assert.equal(q.correcta,ks.every(k=>Math.abs(k-1)<1e-7)?'congruentes':ks.every(k=>Math.abs(k-ks[0])<1e-7)?'semejantes':'ninguno');
   q.dibujo.ts.forEach(t=>{const aa=angulosDe(t.puntos);Object.entries(t.angulos).forEach(([j,d])=>cerca(parseFloat(d.texto.replace(',','.')),aa[j],.0051));});
  }
  if(tipo==='ecuaciones'){const {a,b,c}=q.dibujo;cerca(q.valor,(c-b)/a);assert.ok(a>=2&&a<=6&&c>=0);}
 }
 assert.equal(cuenta,5950);
});
test('Bolsas sin repetición y primeras vueltas variadas de nombres, partes y paralelas',()=>{
 const r=rng(17);for(const t of TEMAS){const b=crearBanco(),v=[];for(let i=0;i<CASOS[t.id].length;i++)v.push(siguientePregunta(b,t.id,r).caso);assert.equal(new Set(v).size,CASOS[t.id].length);assert.notEqual(siguientePregunta(b,t.id,r).caso,v.at(-1));
  if(t.id==='partes')assert.equal(new Set(v.slice(0,9).map(c=>c.split(':')[1])).size,9);
  if(t.id==='nombres')assert.equal(new Set(v.slice(0,10).map(c=>c.split(':')[1])).size,10);
  if(t.id==='paralelas')assert.equal(new Set(v.slice(0,7).map(c=>c.split(':')[0])).size,7);
 }
});
test('Examen: dos preguntas diferentes por cada tema, bloqueo y calificación exacta',()=>{
 const r=rng(67);for(let intento=0;intento<80;intento++){
  const e=crearExamen(r);assert.equal(e.preguntas.length,28);assert.equal(resultado(e),null);assert.equal(avanzarExamen(e),false);let aciertos=0;
  for(const t of TEMAS){const qs=e.preguntas.filter(q=>q.tipo===t.id);assert.equal(qs.length,2);assert.notEqual(qs[0].caso,qs[1].caso);}
  for(let i=0;i<28;i++){
   assert.equal(e.indice,i);assert.equal(responderExamen(e,'inexistente'),null);const q=e.preguntas[i],bien=i<intento%29,id=bien?q.correcta:q.opciones.find(o=>o.id!==q.correcta).id;
   assert.equal(responderExamen(e,id),bien);assert.equal(responderExamen(e,q.correcta),null);assert.equal(e.respuestas[i].id,id);if(bien)aciertos++;assert.ok(avanzarExamen(e));
  }
  assert.ok(e.terminado);assert.equal(avanzarExamen(e),false);assert.equal(responderExamen(e,e.preguntas[27].correcta),null);
  const nota=resultado(e);assert.equal(nota.aciertos,aciertos);assert.equal(nota.nota,Math.max(1,Math.round(aciertos*100/28)));assert.equal(nota.temas.reduce((s,t)=>s+t.aciertos,0),aciertos);
 }
});
test('Práctica: reintentos y acierto único',()=>{
 const q=generar('ecuaciones','suma',rng(12)),mala=q.opciones.find(o=>o.id!==q.correcta).id;
 assert.equal(responderPractica(q,'inexistente'),null);assert.equal(q.intentos,0);assert.equal(responderPractica(q,mala),false);assert.equal(responderPractica(q,mala),null);assert.equal(responderPractica(q,q.correcta),true);assert.equal(q.intentos,2);assert.equal(responderPractica(q,q.correcta),null);
});
