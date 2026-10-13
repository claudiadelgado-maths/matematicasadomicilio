import test from 'node:test';
import assert from 'node:assert/strict';
import {PARTES,disponible,crearPregunta,crearPractica,siguiente,responder} from './modelo.mjs';
import {geometria,RADIO} from './figuras.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function random(seed){return ()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);}
function dentro(p,vs){let result=false;for(let i=0,j=vs.length-1;i<vs.length;j=i++){const a=vs[i],b=vs[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)result=!result;}return result;}

test('Las 63 combinaciones están definidas; únicamente el triángulo carece de diagonales',()=>{
 let total=0;
 for(let n=3;n<=9;n++)for(const p of PARTES){
  const g=geometria({n,parte:p.id});assert.equal(g.puntos.length,n);assert.equal(g.existe,!(n===3&&p.id==='diagonal'));
  for(let i=0;i<n;i++){near(dist(g.puntos[i],g.c),RADIO);near(dist(g.puntos[i],g.puntos[(i+1)%n]),dist(g.puntos[0],g.puntos[1]));}
  total++;
 }
 assert.equal(total,63);assert.throws(()=>geometria({n:10,parte:'radio'}),RangeError);
});

test('Radio, apotema y diagonal conservan sus extremos al cambiar figura, esquina y orientación',()=>{
 for(let n=3;n<=9;n++)for(let k=0;k<n;k++)for(let r=0;r<8;r++){
  const options={n,vertice:k,giro:r*Math.PI/4},radio=geometria({...options,parte:'radio'}),apo=geometria({...options,parte:'apotema'});
  near(dist(radio.a,radio.c),0);near(dist(radio.b,radio.v),0);near(dist(radio.a,radio.b),RADIO);
  near(apo.b.x,(apo.v.x+apo.next.x)/2);near(apo.b.y,(apo.v.y+apo.next.y)/2);
  const a={x:apo.b.x-apo.a.x,y:apo.b.y-apo.a.y},b={x:apo.next.x-apo.v.x,y:apo.next.y-apo.v.y};near(a.x*b.x+a.y*b.y,0);
  assert.ok(dist(apo.a,apo.b)<RADIO);assert.equal(apo.escuadra.length,3);
  if(n===3)continue;
  for(let salto=2;salto<=n-2;salto++){
   const d=geometria({...options,parte:'diagonal',salto});assert.notEqual(d.destino,k);assert.notEqual(d.destino,(k+1)%n);assert.notEqual(d.destino,(k+n-1)%n);
   near(dist(d.a,d.puntos[k]),0);near(dist(d.b,d.puntos[d.destino]),0);
  }
 }
});

test('Los sectores interior y central quedan dentro; el exterior queda fuera y prolonga el lado vecino',()=>{
 for(let n=3;n<=9;n++)for(let k=0;k<n;k++)for(let r=0;r<12;r++)for(const id of ['interior','exterior','central']){
  const g=geometria({n,parte:id,giro:r*Math.PI/6,vertice:k});
  near(Math.abs(g.barrido),id==='interior'?Math.PI-2*Math.PI/n:2*Math.PI/n);
  const ang=g.inicio+g.barrido/2,p={x:g.origen.x+12*Math.cos(ang),y:g.origen.y+12*Math.sin(ang)};
  assert.equal(dentro(p,g.puntos),id!=='exterior',`${id} del polígono ${n}`);
  near(dist(g.origen,id==='central'?g.c:g.v),0);
  if(id==='exterior'){
   const a={x:g.v.x-g.prev.x,y:g.v.y-g.prev.y},b={x:g.extension.x-g.v.x,y:g.extension.y-g.v.y};near(a.x*b.y-a.y*b.x,0);assert.ok(a.x*b.x+a.y*b.y>0);
  }
 }
});

test('Dos mil preguntas tienen cuatro conceptos distintos, una solución y solo dibujos válidos',()=>{
 const rng=random(1759),vistos=new Set();
 for(const modo of ['imagenes','palabras'])for(let i=0;i<1000;i++){
  const id=PARTES[i%9].id,q=crearPregunta(modo,id,rng);assert.equal(q.opciones.length,4);assert.equal(new Set(q.opciones.map(o=>o.parte)).size,4);assert.equal(q.opciones.filter(o=>o.parte===id).length,1);
  for(const f of modo==='imagenes'?q.opciones:[q.figura]){assert.ok(disponible(f.parte,f.n));assert.ok(geometria(f).existe);vistos.add(`${f.n}:${f.parte}`);}
 }
 assert.equal(vistos.size,62);
});

test('Cada grupo de nueve preguntas recorre los nueve conceptos, sin repetir al cambiar de grupo',()=>{
 for(const modo of ['imagenes','palabras']){
  const rng=random(89),s=crearPractica(modo,rng);let anterior=null;
  for(let ronda=0;ronda<20;ronda++){
   const vistos=new Set();for(let i=0;i<9;i++){if(i===0)assert.notEqual(s.pregunta.objetivo,anterior);vistos.add(s.pregunta.objetivo);anterior=s.pregunta.objetivo;siguiente(s,rng);}assert.equal(vistos.size,9);
  }
 }
});

test('Los errores permiten reintentar, un acierto se cuenta una vez y las prácticas conservan avances independientes',()=>{
 const a=crearPractica('imagenes',random(1)),b=crearPractica('palabras',random(3));
 const q=a.pregunta,incorrecta=q.opciones.findIndex(o=>o.parte!==q.objetivo),correcta=q.opciones.findIndex(o=>o.parte===q.objetivo);
 assert.equal(responder(a,incorrecta).correcta,false);assert.equal(a.aciertos,0);assert.equal(responder(a,incorrecta),null);
 assert.equal(responder(a,correcta).correcta,true);assert.equal(a.aciertos,1);assert.equal(a.primero,0);assert.equal(a.descubiertas.size,1);
 assert.equal(responder(a,correcta),null);assert.equal(a.aciertos,1);assert.equal(b.aciertos,0);
 siguiente(a,random(7));assert.equal(a.aciertos,1);assert.equal(a.pregunta.intentos,0);assert.equal(a.numero,2);
});
