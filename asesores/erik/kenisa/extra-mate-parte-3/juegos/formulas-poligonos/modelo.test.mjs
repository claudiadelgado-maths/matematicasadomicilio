import test from 'node:test';
import assert from 'node:assert/strict';
import {CALCULAR,DESCUBRIR,FORMULAS,crearPregunta,crearPractica,siguiente,responder,leerNumero,redondear} from './modelo.mjs';
import {geometria,angulo,ilustracion} from './figuras.mjs';
const random=seed=>()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
const dato=(q,s)=>q.conocidos.find(d=>d.simbolo===s)?.valor;
const cerca=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} frente a ${b}`);

test('Las 49 vistas conservan segmentos, diagonales y ángulos matemáticamente correctos',()=>{
 for(let n=3;n<=9;n++){
  const {c,p,m,diagonales,desde}=geometria(n);
  assert.equal(diagonales.length,n*(n-3)/2);assert.equal(desde.length,n-3);
  assert.equal(new Set(diagonales.map(pair=>pair.join('-'))).size,diagonales.length);
  for(const [i,j] of diagonales){assert.ok(j-i>1);assert.notEqual(j-i,n-1);}
  cerca((c.x-m.x)*(p[1].x-p[0].x)+(c.y-m.y)*(p[1].y-p[0].y),0);
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  cerca(dist(c,p[1])**2,dist(c,m)**2+dist(m,p[1])**2);
  const exterior=angulo(p[1],{x:p[1].x+67,y:p[1].y},p[2]),interior=angulo(p[1],p[0],p[2]),central=angulo(c,p[0],p[1]);
  cerca(Math.abs(exterior.barrido),2*Math.PI/n);cerca(Math.abs(central.barrido),2*Math.PI/n);
  cerca(Math.abs(exterior.barrido)+Math.abs(interior.barrido),Math.PI);
  for(const f of FORMULAS){const svg=ilustracion(n,f.id,{animada:true});assert.ok(svg.includes('role="img"'));assert.ok(!/NaN|undefined/.test(svg));}
  assert.equal((ilustracion(n,'area').match(/data-area-piece=/g)||[]).length,n);
  assert.equal((ilustracion(n,'todas').match(/data-diagonal=/g)||[]).length,n*(n-3)/2);
 }
});

test('Todos los cálculos y despejes se obtienen de los datos mostrados, sin Pitágoras',()=>{
 for(const [tipo] of CALCULAR)for(let n=3;n<=9;n++)for(let seed=1;seed<=12;seed++){
  const q=crearPregunta('calcular',tipo,random(seed),n);assert.ok(!q.opciones);assert.notEqual(q.formula,'radio');
  assert.ok(q.conocidos.every(d=>d.simbolo!=='R'&&d.simbolo!=='S'));assert.ok(Number.isFinite(q.respuesta));
  assert.ok(q.respuesta>=0&&q.respuesta<=1260);let expected;
  if(tipo==='perimetro')expected=dato(q,'N')*dato(q,'L');
  if(tipo==='lado')expected=dato(q,'P')/dato(q,'N');
  if(tipo==='area')expected=dato(q,'P')*dato(q,'a')/2;
  if(tipo==='apotema')expected=2*dato(q,'A')/dato(q,'P');
  if(tipo==='perimetro-area')expected=2*dato(q,'A')/dato(q,'a');
  if(tipo==='desde')expected=n-3;
  if(tipo==='todas')expected=n*(n-3)/2;
  if(['central','exterior'].includes(tipo))expected=360/n;
  if(tipo==='interior')expected=180-360/n;
  if(tipo==='suma')expected=(n-2)*180;
  if(tipo==='exterior-central')expected=dato(q,'Ángulo central');
  if(tipo==='interior-exterior')expected=180-dato(q,'Ángulo exterior');
  if(tipo==='exterior-interior')expected=180-dato(q,'Ángulo interior');
  cerca(q.respuesta,redondear(expected));
 }
 assert.throws(()=>crearPregunta('calcular','radio'),RangeError);
 assert.throws(()=>crearPregunta('descubrir','pitagoras'),RangeError);
});

test('Las medidas de área respetan un polígono real y declaran sus aproximaciones',()=>{
 for(const tipo of ['area','apotema','perimetro-area'])for(let n=3;n<=9;n++)for(let seed=1;seed<30;seed++){
  const q=crearPregunta('calcular',tipo,random(seed),n);
  const p=tipo==='perimetro-area'?q.respuesta:dato(q,'P'),a=tipo==='apotema'?q.respuesta:dato(q,'a');
  const diferencia=tipo==='apotema'?Math.abs(p-2*n*a*Math.tan(Math.PI/n)):Math.abs(a-p/(2*n*Math.tan(Math.PI/n)));
  assert.ok(diferencia<=.0500001);assert.equal(q.aproximado,n!==4);
  if(tipo==='apotema'||tipo==='perimetro-area')assert.ok(Number.isInteger(q.respuesta));
 }
});

test('Los siete modos para descubrir N tienen cuatro figuras y una única solución',()=>{
 for(const [tipo] of DESCUBRIR.filter(([id])=>id.startsWith('figura-')))for(let seed=0;seed<200;seed++){
  const q=crearPregunta('descubrir',tipo,random(seed));
  assert.equal(q.visual,'misterio');assert.equal(q.opciones.length,4);assert.equal(new Set(q.opciones).size,4);
  assert.ok(q.opciones.every(n=>n>=3&&n<=9));assert.equal(q.opciones.filter(n=>n===q.respuesta).length,1);
  const posibles=[3,4,5,6,7,8,9].filter(n=>{
   if(tipo==='figura-perimetro')return n*dato(q,'L')===dato(q,'P');
   if(tipo==='figura-central'||tipo==='figura-exterior')return redondear(360/n)===q.conocidos[0].valor;
   if(tipo==='figura-interior')return redondear(180-360/n)===q.conocidos[0].valor;
   if(tipo==='figura-suma')return (n-2)*180===dato(q,'S');
   if(tipo==='figura-desde')return n-3===dato(q,'d');
   return n*(n-3)/2===dato(q,'D');
  });assert.deepEqual(posibles,[q.respuesta]);
 }
});

test('El modo mixto cubre todos los casos, incluye apotema y lado y evita repetir figura en un caso fijo',()=>{
 for(const modo of ['calcular','descubrir']){
  const s=crearPractica(modo),rng=random(82),lista=modo==='calcular'?CALCULAR:DESCUBRIR,ids=[];
  for(let i=0;i<lista.length;i++)ids.push(siguiente(s,rng).tipo);
  assert.deepEqual([...ids].sort(),lista.map(([id])=>id).sort());assert.ok(ids.includes('apotema'));assert.ok(ids.includes('lado'));
  for(const [id] of lista){s.filtro=id;const a=siguiente(s,()=>0),b=siguiente(s,()=>0);assert.equal(a.tipo,b.tipo);assert.notEqual(a.n,b.n);}
 }
});

test('Respuestas estrictas, redondeo a dos decimales, reintentos y aciertos contados una sola vez',()=>{
 assert.equal(leerNumero(' 51,43 '),51.43);assert.equal(leerNumero('0'),0);
 for(const bad of ['', ' ', '1e2','3/4','5 cm','1.2.3','Infinity','-4'])assert.equal(leerNumero(bad),null);
 const s=crearPractica('calcular');s.pregunta=crearPregunta('calcular','central',()=>0,7);
 assert.equal(responder(s,'').valida,false);assert.equal(s.pregunta.intentos,0);
 assert.equal(responder(s,'51.4').correcta,false);assert.equal(responder(s,'51,43').correcta,true);
 assert.equal(s.aciertos,1);assert.equal(s.primero,0);assert.equal(responder(s,'51.43'),null);
 s.pregunta=crearPregunta('calcular','desde',()=>0,3);assert.equal(responder(s,'0').correcta,true);
 const d=crearPractica('descubrir');d.pregunta=crearPregunta('descubrir','figura-todas',()=>0,3);
 const mal=d.pregunta.opciones.find(n=>n!==3);assert.equal(responder(d,mal).correcta,false);assert.equal(responder(d,mal),null);
 assert.equal(responder(d,3).correcta,true);assert.equal(d.aciertos,1);assert.equal(responder(d,3),null);
});
