import test from 'node:test';
import assert from 'node:assert/strict';
import {CASOS,crearPregunta,crearPractica,siguiente,responder,ejemploCriterio} from './modelo.mjs';
import {fr,valor,texto,leerRespuesta,iguales,LADOS,angulosDe} from '../../recursos/matematicas-triangulos.mjs';
import {transformar,ajustarPareja} from '../../recursos/figuras-triangulos.mjs';
import {puntosCopia} from './animacion.mjs';
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
const cerca=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} ≠ ${b}`);
const lados=p=>LADOS.map(([a,b])=>Math.hypot(p[a].x-p[b].x,p[a].y-p[b].y));
function evaluar(s,x){s=s.replace('°','').replaceAll(' ','').replace('−','-').replace(',','.').replace(/[()]/g,'');if(s.includes('x')){const m=s.match(/^(\d*)x([+-]\d+)?$/);assert.ok(m);return +(m[1]||1)*x+ +(m[2]||0);}return valor(leerRespuesta(s));}
test('6 400 ejercicios: congruencia, medidas, soluciones y casos negativos demostrables',()=>{
 const r=rng(321090);let count=0;
 for(const [modo,casos] of Object.entries(CASOS))for(const [tipo] of casos)for(const orientacion of ['alineados','girados','reflejados','variados'])for(let n=0;n<100;n++){
  count++;const q=crearPregunta(modo,tipo,orientacion,r),sol=q.campos[0]&&valor(q.campos[0].respuesta),ls=q.triangulos.map(t=>lados(t.puntos)),as=q.triangulos.map(t=>angulosDe(t.puntos));
  q.triangulos.forEach((t,i)=>{
   assert.ok(ls[i].every(v=>v>0));cerca(as[i].reduce((a,b)=>a+b,0),180);
   for(const [j,d] of Object.entries(t.lados))if(!d.texto.includes('?'))cerca(evaluar(d.texto,sol),ls[i][j]);
   for(const [j,d] of Object.entries(t.angulos))if(!d.texto.includes('?'))cerca(evaluar(d.texto,sol),as[i][j]);
   lados(transformar(t)).forEach((v,j)=>cerca(v,ls[i][j]));
  });
  if(q.respuesta!=='NO'){ls[0].forEach((v,j)=>cerca(v,ls[1][j]));as[0].forEach((v,j)=>cerca(v,as[1][j]));}
  else{
   const sort=ls.map(v=>[...v].sort((a,b)=>a-b));assert.ok(sort[0].some((v,j)=>Math.abs(v-sort[1][j])>1e-5));
   if(tipo==='no-angulos'){const angles=as.map(v=>[...v].sort((a,b)=>a-b));assert.ok(angles[0].some((v,j)=>Math.abs(v-angles[1][j])>1e-5));}
   if(tipo==='no-tamano'){as[0].forEach((v,j)=>cerca(v,as[1][j]));assert.notEqual(q.triangulos[0].lados[0].texto,q.triangulos[1].lados[0].texto);}
  }
  if(modo==='decide'){
   const t=q.triangulos[0],sides=Object.keys(t.lados),angles=Object.keys(t.angulos);
   if(tipo==='lll'||tipo==='no-lados'){assert.equal(sides.length,3);assert.equal(angles.length,0);}
   if(tipo==='lal'){assert.deepEqual(sides,['0','2']);assert.deepEqual(angles,['0']);}
   if(tipo==='ala'||tipo==='no-tamano'){assert.deepEqual(sides,['0']);assert.deepEqual(angles,['0','1']);}
   if(tipo==='no-angulos'){assert.equal(sides.length,0);assert.equal(angles.length,2);}
  }
  if(modo==='encuentra'){
   const t=q.triangulos[1],objetivos=[];for(const [i,d] of Object.entries(t.lados))if(d.objetivo)objetivos.push(ls[1][i]);for(const [i,d] of Object.entries(t.angulos))if(d.objetivo)objetivos.push(as[1][i]);
   assert.equal(objetivos.length,q.campos.length);q.campos.forEach((c,j)=>cerca(valor(c.respuesta),objetivos[j]));assert.equal(new Set(q.campos.map(c=>c.unidad)).size,1);
   if(q.campos[0].unidad==='°')q.campos.forEach(c=>assert.equal(c.respuesta.d,1));
   if(tipo==='lado-fraccion')assert.equal(q.campos[0].respuesta.d,2);
  }
  if(modo==='ecuacion'){assert.ok(Number.isInteger(sol)&&sol>0);const {izq,der}=q.ecuacion;assert.notEqual(izq[0],der[0]);cerca(izq[0]*sol+izq[1],der[0]*sol+der[1]);}
  const ps=ajustarPareja(q.triangulos,true),ratio=lados(ps[0])[0]/ls[0][0];lados(ps[1]).forEach((v,j)=>cerca(v/ls[1][j],ratio));
 }
 assert.equal(count,6400);
});
test('Criterios: ALA usa el lado entre los dos ángulos; LAL usa el ángulo comprendido',()=>{
 for(const id of ['LLL','LAL','ALA']){
  for(const t of ejemploCriterio(id)){
   assert.equal(Object.keys(t.lados).length,{LLL:3,LAL:2,ALA:1}[id]);assert.equal(Object.keys(t.angulos).length,{LLL:0,LAL:1,ALA:2}[id]);
   assert.ok([...Object.values(t.lados),...Object.values(t.angulos)].every(d=>!d.deducido));
   if(id==='ALA'){assert.deepEqual(Object.keys(t.lados),['0']);assert.deepEqual(Object.keys(t.angulos),['0','1']);}
   if(id==='LAL'){assert.deepEqual(Object.keys(t.lados),['0','1']);assert.deepEqual(Object.keys(t.angulos),['1']);}
  }
  const [a,b]=ejemploCriterio(id,true);assert.deepEqual(a.lados,b.lados);assert.deepEqual(a.angulos,b.angulos);
  assert.equal(Object.keys(a.lados).length,3);assert.equal(Object.keys(a.angulos).length,3);
  if(id==='LAL')assert.equal(a.lados[2].texto,'c');if(id==='ALA')assert.equal(a.lados[1].texto,'b');
 }
});
test('Clon: movimientos rígidos y superposición exacta en móvil y escritorio',()=>{
 for(const movil of [false,true]){
  const base=puntosCopia({separacion:0,giro:0,espejo:1},movil),longitud=lados(base);
  for(const giro of [0,120,240,360,-120])for(const espejo of [1,-1]){
   const copia=puntosCopia({separacion:1,giro,espejo},movil);lados(copia).forEach((v,j)=>cerca(v,longitud[j]));
  }
  const vuelta=puntosCopia({separacion:0,giro:0,espejo:1},movil);assert.deepEqual(vuelta,base);
 }
});
test('Fracciones equivalentes, corrección parcial y un único acierto por reto',()=>{
 assert.ok(iguales(leerRespuesta('10/4'),fr(5,2)));assert.equal(leerRespuesta('5/0'),null);
 const s=crearPractica('encuentra');s.filtro='varios-lados';siguiente(s,rng(12));const q=s.pregunta,bien=Object.fromEntries(q.campos.map(c=>[c.id,texto(c.respuesta)]));
 assert.equal(responder(s,{}).valida,false);assert.equal(q.intentos,0);
 assert.deepEqual(responder(s,{...bien,[q.campos[0].id]:'0'}).resultados,[false,true,true]);assert.equal(s.aciertos,0);
 assert.equal(responder(s,bien).correcta,true);assert.equal(s.aciertos,1);assert.equal(s.primero,0);assert.equal(responder(s,bien),null);
 const d=crearPractica('decide');siguiente(d,rng(8));assert.equal(responder(d,'AA'),null);responder(d,'NO');assert.equal(responder(d,'NO'),null);responder(d,'LLL');assert.equal(d.aciertos,1);
});
test('Casos elegibles, mezcla completa y retos nuevos sin resolver anteriores',()=>{
 const r=rng(912);for(const m of Object.keys(CASOS)){
  const s=crearPractica(m);s.filtro='mezcla';const vistos=new Set();for(let i=0;i<CASOS[m].length;i++)vistos.add(siguiente(s,r).tipo);assert.equal(vistos.size,CASOS[m].length);
  const anterior=JSON.stringify(s.pregunta);siguiente(s,r);assert.notEqual(JSON.stringify(s.pregunta),anterior);assert.equal(s.aciertos,0);
 }
});
