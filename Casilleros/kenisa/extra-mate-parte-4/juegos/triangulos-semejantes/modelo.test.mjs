import test from 'node:test';
import assert from 'node:assert/strict';
import {CASOS,crearPregunta,crearPractica,siguiente,responder,fr,valor,texto,leerRespuesta,iguales,LADOS,angulosDe,ejemploCriterio} from './modelo.mjs';
import {transformar,ajustarPareja} from './figuras.mjs';
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
const cerca=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} ≠ ${b}`);
const longitudes=p=>LADOS.map(([a,b])=>Math.hypot(p[a].x-p[b].x,p[a].y-p[b].y));
function evaluar(s,x){s=s.replace('°','').replaceAll(' ','').replace('−','-').replace(',','.').replace(/[()]/g,'');if(s.includes('x')){const m=s.match(/^(\d*)x([+-]\d+)?$/);assert.ok(m);return +(m[1]||1)*x+ +(m[2]||0);}return valor(leerRespuesta(s));}
test('Fracciones exactas, equivalentes y entradas inválidas',()=>{
 for(const s of ['3/2','6/4','1.5','1,50'])assert.ok(iguales(leerRespuesta(s),fr(3,2)));
 for(const s of ['', '3/0','Infinity','2x','-3','3/2/2','1e3','<script>'])assert.equal(leerRespuesta(s),null);
 assert.equal(texto(fr(12,4)),'3');assert.equal(texto(fr(15,6)),'5/2');
});
test('6 000 ejercicios: geometría válida, datos consistentes y soluciones exactas',()=>{
 const r=rng(20261009);let total=0;
 for(const [modo,casos] of Object.entries(CASOS))for(const [tipo] of casos)for(const orientacion of ['alineados','girados','reflejados','variados'])for(let n=0;n<100;n++){
  const q=crearPregunta(modo,tipo,orientacion,r),sol=q.campos[0]&&valor(q.campos[0].respuesta);total++;
  const medidas=q.triangulos.map(t=>longitudes(t.puntos)),ang=q.triangulos.map(t=>angulosDe(t.puntos));
  q.triangulos.forEach((t,i)=>{
   assert.ok(medidas[i].every(l=>l>0));cerca(ang[i].reduce((s,a)=>s+a,0),180);
   for(const [id,d] of Object.entries(t.lados))if(!d.texto.includes('?'))cerca(evaluar(d.texto,sol),medidas[i][id]);
   for(const [id,d] of Object.entries(t.angulos))if(!d.texto.includes('?'))cerca(evaluar(d.texto,sol),ang[i][id]);
   const transformed=longitudes(transformar(t));transformed.forEach((l,j)=>cerca(l,medidas[i][j]));
  });
  if(q.respuesta!=='NO'){
   const ratios=medidas[1].map((v,i)=>v/medidas[0][i]);ratios.forEach(k=>cerca(k,valor(q.k)));ang[0].forEach((v,i)=>cerca(v,ang[1][i]));
  }else{
   const sorted=medidas.map(v=>[...v].sort((a,b)=>a-b)),ks=sorted[1].map((v,i)=>v/sorted[0][i]);assert.ok(ks.some(k=>Math.abs(k-ks[0])>1e-6));
  }
  if(modo==='encuentra'){
   const t=q.triangulos[1],objetivos=[];for(const [i,d] of Object.entries(t.lados))if(d.objetivo)objetivos.push(medidas[1][i]);for(const [i,d] of Object.entries(t.angulos))if(d.objetivo)objetivos.push(ang[1][i]);
   assert.equal(objetivos.length,q.campos.length);q.campos.forEach((c,i)=>cerca(valor(c.respuesta),objetivos[i]));
   if(q.campos[0].unidad==='°')q.campos.forEach(c=>assert.equal(c.respuesta.d,1));
   assert.equal(new Set(q.campos.map(c=>c.unidad)).size,1);
  }
  if(modo==='ecuacion'){
   assert.ok(Number.isInteger(sol)&&sol>0);const {izq,der}=q.ecuacion;assert.notEqual(izq[0],der[0]);cerca(izq[0]*sol+izq[1],der[0]*sol+der[1]);
  }
  if(modo==='decide'){
   const t=q.triangulos[0];
   if(tipo==='aa'||tipo==='no-angulos'){assert.equal(Object.keys(t.lados).length,0);assert.equal(Object.keys(t.angulos).length,2);}
   if(tipo==='lal'){assert.deepEqual(Object.keys(t.lados),['0','2']);assert.deepEqual(Object.keys(t.angulos),['0']);}
   if(tipo==='lll'||tipo==='no-lados'){assert.equal(Object.keys(t.lados).length,3);assert.equal(Object.keys(t.angulos).length,0);}
  }
  const fitted=ajustarPareja(q.triangulos);fitted.flat().forEach(p=>assert.ok(p.x>=80&&p.x<=320&&p.y>=70&&p.y<=265));
 }
 assert.equal(total,6000);
});
test('Pistas del explorador: únicamente datos dados, conclusiones sin inventar longitudes',()=>{
 for(const id of ['AA','LAL','LLL']){
  const [a,b]=ejemploCriterio(id);assert.equal(Object.keys(a.lados).length,{AA:0,LAL:2,LLL:3}[id]);assert.equal(Object.keys(a.angulos).length,{AA:2,LAL:1,LLL:0}[id]);
  assert.equal(Object.keys(a.lados).length,Object.keys(b.lados).length);
  const completos=ejemploCriterio(id,true);completos.forEach(t=>{assert.equal(Object.keys(t.lados).length,3);assert.equal(Object.keys(t.angulos).length,3);});
  if(id==='AA')assert.equal(completos[1].lados[0].texto,'ka');
  if(id==='LAL')assert.equal(completos[1].lados[2].texto,'c/2');
  if(id==='LLL')assert.equal(completos[1].angulos[0].texto,'α');
 }
});
test('Reintentos, campos parciales y puntuación una sola vez',()=>{
 const s=crearPractica('encuentra');s.filtro='varios-lados';siguiente(s,rng(3));const q=s.pregunta,correctas=Object.fromEntries(q.campos.map(c=>[c.id,texto(c.respuesta)]));
 assert.equal(responder(s,{}).valida,false);assert.equal(q.intentos,0);
 const mal={...correctas,[q.campos[0].id]:'0'};assert.deepEqual(responder(s,mal).resultados,[false,true,true]);assert.equal(s.aciertos,0);
 assert.equal(responder(s,correctas).correcta,true);assert.equal(s.aciertos,1);assert.equal(s.primero,0);assert.equal(responder(s,correctas),null);assert.equal(s.aciertos,1);
 const d=crearPractica('decide');siguiente(d,rng(7));const incorrecta=d.pregunta.respuesta==='AA'?'LLL':'AA';responder(d,incorrecta);assert.equal(responder(d,incorrecta),null);responder(d,d.pregunta.respuesta);assert.equal(d.aciertos,1);
});
test('Mezcla cubre todos los casos y permite nuevos ejercicios sin desbloqueos',()=>{
 const r=rng(8);for(const m of Object.keys(CASOS)){
  const s=crearPractica(m);s.filtro='mezcla';const vistos=new Set();for(let i=0;i<CASOS[m].length;i++)vistos.add(siguiente(s,r).tipo);assert.equal(vistos.size,CASOS[m].length);
  const anterior=JSON.stringify(s.pregunta);siguiente(s,r);assert.notEqual(JSON.stringify(s.pregunta),anterior);assert.equal(s.aciertos,0);
 }
});
