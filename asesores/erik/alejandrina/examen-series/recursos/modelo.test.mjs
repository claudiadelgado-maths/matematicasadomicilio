import test from 'node:test';
import assert from 'node:assert/strict';
import {R,parse,acepta,eq,sub,div,mul,pow,num,add} from './fracciones.mjs';
import {generar,nivel,termino,suma,barajar} from './modelo.mjs';
import {EJERCICIOS} from './banco-ejercicios.mjs';
import {PROBLEMAS} from './banco-problemas.mjs';
export function azar(seed=730){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
test('fracciones exactas, equivalencias, decimales y entradas inválidas',()=>{
  for(const value of ['1/2','2/4','-3/-6','0.5','0,50','.5'])assert.ok(acepta(R(1,2),value));
  for(const value of ['',' ','1/0','3x','Infinity','NaN','1/2/3'])assert.equal(parse(value),null);
  assert.ok(acepta(R(0),'0/4'));assert.ok(acepta(R(-1,4),'−2/8'));
});
test('d/r: los cuatro casos, índices y signos determinan la respuesta',()=>{
 const r=azar(26);for(const tipo of ['aritmetica','geometrica'])for(const caso of ['sucesion','consecutivos','extremos','dos-terminos'])for(let i=0;i<250;i++){
  const q=generar('diferencia-razon',caso,tipo,i,r);assert.ok(eq(q.pasos[0].respuesta,q.p));
  if(q.m){const am=termino(tipo,q.a,q.p,q.m),an=termino(tipo,q.a,q.p,q.j);if(tipo==='aritmetica')assert.ok(eq(div(sub(an,am),R(q.j-q.m)),q.p));else {assert.ok(eq(div(an,am),{n:q.p.n**BigInt(q.j-q.m),d:q.p.d**BigInt(q.j-q.m)}));if((q.j-q.m)%2===0)assert.match(q.enunciado,q.p.n<0n?/negativa/:/positiva/);}}
  if(i<3)assert.ok(q.a.n>0n&&q.p.n>0n&&q.a.d===1n&&q.p.d===1n);
 }
});
test('identificación inequívoca y dificultad de los primeros tres ejercicios',()=>{
  const r=azar();for(let i=0;i<600;i++){
    const q=generar('identificar','tipo','ambas',i,r),v=q.secuencia;
    const ar=v.slice(1).every((n,j)=>eq(sub(n,v[j]),sub(v[1],v[0])));
    const ge=v.slice(0,-1).every(n=>n.n!==0n)&&v.slice(1).every((n,j)=>eq(div(n,v[j]),div(v[1],v[0])));
    assert.notEqual(ar,ge);assert.equal(q.respuesta,ar?'aritmetica':'geometrica');
    if(i<3)assert.ok(v.every(n=>n.n>0n&&n.d===1n));
  }
  assert.deepEqual([0,1,2,3,5,6].map(nivel),[0,0,0,1,1,2]);
});
test('a1: tres casos, recuperación exacta y orden d/r antes de a1',()=>{
 const r=azar(37);for(const tipo of ['aritmetica','geometrica'])for(const caso of ['sucesion','termino-parametro','dos-terminos'])for(let i=0;i<200;i++){
  const q=generar('primer-termino',caso,tipo,i,r),n=q.m??q.n,an=termino(tipo,q.a,q.p,n);
  const recovered=tipo==='aritmetica'?sub(an,mul(R(n-1),q.p)):div(an,pow(q.p,n-1));assert.ok(eq(recovered,q.a));assert.ok(eq(q.pasos.at(-1).respuesta,q.a));
  if(caso==='dos-terminos'){assert.equal(q.secuencial,true);assert.ok(eq(q.pasos[0].respuesta,q.p));}
 }
});
test('an y n: resultados enteros para posiciones y logaritmos definidos',()=>{
 const r=azar(48);for(const tipo of ['aritmetica','geometrica'])for(const caso of ['termino','posicion'])for(let i=0;i<300;i++){
  const q=generar('terminos-posiciones',caso,tipo,i,r),an=termino(tipo,q.a,q.p,q.n);assert.ok(eq(q.pasos[0].respuesta,caso==='posicion'?R(q.n):an));
  if(caso==='posicion'&&tipo==='geometrica'){assert.ok(q.p.n>0n);assert.notEqual(num(q.p),1);assert.ok(Math.abs(Math.log(num(div(an,q.a)))/Math.log(num(q.p))+1-q.n)<1e-9);}
 }
});
test('sumas: cinco casos, despejes sin división por cero y sumas parciales exactas',()=>{
 const r=azar(59),directa=(q,n)=>Array.from({length:n},(_,i)=>termino(q.tipo,q.a,q.p,i+1)).reduce(add,R(0));
 for(const tipo of ['aritmetica','geometrica'])for(const caso of ['extremos','sucesion','dos-terminos','despejes','intervalo'])for(let i=0;i<300;i++){
  const q=generar('sumas',caso,tipo,i,r),sn=directa(q,q.n);assert.ok(eq(sn,suma(tipo,q.a,q.p,q.n)));
  for(const p of q.pasos){const expected={a1:q.a,an:termino(tipo,q.a,q.p,q.n),n:R(q.n),r:q.p,d:q.p,sn,previa:directa(q,(q.m??1)-1),intervalo:sub(sn,directa(q,(q.m??1)-1))}[p.id];assert.ok(eq(p.respuesta,expected));assert.ok(Math.abs(num(p.respuesta))<50000);assert.ok(p.respuesta.d<=4096n,'denominador razonable para calcular a mano');assert.ok(p.respuesta.n<50000n&&p.respuesta.n>-50000n);}
  if(caso==='despejes'&&q.objetivo==='n'){if(tipo==='aritmetica')assert.notEqual(add(q.a,termino(tipo,q.a,q.p,q.n)).n,0n);else {assert.ok(num(q.p)>0&&num(q.p)!==1);assert.ok(Math.abs(Math.log(num(add(div(mul(sn,sub(q.p,R(1))),q.a),R(1))))/Math.log(num(q.p))-q.n)<1e-8);}}
 }
});
test('banco fijo: datos y soluciones contrastados con sucesiones de referencia',()=>{
 const refs={a01:['4','5'],a02:['-8','5'],a03:['-3','4'],a04:['13','-3'],a05:['-7','3'],a06:['-3','4'],a07:['-1','4'],a08:['3/2','1/2'],a09:['7','-3',9],a10:['4','3'],a11:['2','3'],a12:['-8','3'],a13:['3','3',11],a14:['5','3',null,4,9],a15:['5','4'],a16:['-3','5'],g01:['3','2'],g02:['-3','-2'],g03:['2','3'],g04:['2','-3'],g05:['1/2','-2'],g06:['3','2'],g07:['3','2'],g08:['16','1/2'],g09:['3','2',6],g10:['2','3'],g11:['3','-2'],g12:['4','2'],g13:['3','2'],g14:['2','3',null,3,5],g15:['3','2',6]};
 const texValue=t=>parse(t.replace(/\\frac\{(-?\d+)\}\{(\d+)\}/g,'$1/$2'));
 assert.equal(EJERCICIOS.length,31);assert.equal(new Set(EJERCICIOS.map(q=>q.id)).size,31);
 for(const q of EJERCICIOS){
  const [aRaw,pRaw,n,from,to]=refs[q.id],a=parse(aRaw),p=parse(pRaw),term=k=>q.tipo==='aritmetica'?add(a,mul(R(k-1),p)):mul(a,pow(p,k-1)),sum=k=>Array.from({length:k},(_,i)=>term(i+1)).reduce(add,R(0));
  const resolve=label=>{const t=label.replace(/[{}]/g,'');if(t==='d'||t==='r')return p;if(t==='n')return R(n);if(t==='a_n')return term(n);if(t==='S_n')return sum(n);if(t.startsWith('a_'))return term(Number(t.slice(2)));if(t.startsWith('S_'))return sum(Number(t.slice(2)));return sub(sum(to),sum(from-1));};
  q.datos.forEach(d=>{const [key,value]=d.split('=');assert.ok(eq(resolve(key),texValue(value)),`${q.id}: dato ${d}`);});
  q.secuencia?.forEach((v,i)=>assert.ok(eq(v,term(i+1))));q.pasos.forEach(s=>assert.ok(eq(s.respuesta,resolve(s.label)),`${q.id}: ${s.label}`));assert.equal(q.formulas.length,0);assert.ok(Object.isFrozen(q));
 }
});
test('problemas aplicados: cálculo independiente, unidades y dos bancos inmutables',()=>{
 const total=xs=>xs.reduce((a,b)=>a+b,0),ar=(a,d,n)=>Array.from({length:n},(_,i)=>a+i*d),ge=(a,r,n)=>Array.from({length:n},(_,i)=>a*r**i);
 const expected={pa01:[22-18],pa02:[2400-3*((3300-2400)/3)],pa03:[12+8*3],pa04:[(150-30)/10+1],pa05:[total(ar(16,2,12))],pa06:[ar(8,4,6).length],pa07:[total(ar(7,3,8).slice(3))],pa08:[2*2100/6-600],pa09:[-3,8-6*3],pa10:[(50+5*25)/100,total(ar(50,25,8))/100],pg01:[36/12],pg02:[80/2**3],pg03:[5*3**4],pg04:[Math.log2(32)+1],pg05:[total(ge(3,2,6))],pg06:[160*(3/4)**3],pg07:[total(ge(4,2,6).slice(2))],pg08:[1270/total(ge(1,2,7))],pg09:[Math.log(341*3+1)/Math.log(4)],pg10:[Math.cbrt(324/12),12/3,total(ge(4,3,5))]};
 assert.equal(PROBLEMAS.length,20);for(const tipo of ['aritmetica','geometrica'])assert.equal(PROBLEMAS.filter(q=>q.tipo===tipo).length,10);
 for(const q of PROBLEMAS){assert.ok(Object.isFrozen(q));assert.equal(q.formulas.length,0);q.pasos.forEach((p,i)=>assert.ok(Math.abs(num(p.respuesta)-expected[q.id][i])<1e-9,`${q.id}: respuesta ${i}`));}
 for(const bank of [EJERCICIOS,PROBLEMAS]){const before=bank.map(q=>q.id).join(',');const mixed=barajar(bank,azar());assert.equal(bank.map(q=>q.id).join(','),before);assert.notEqual(mixed.map(q=>q.id).join(','),before);assert.deepEqual([...mixed].sort((a,b)=>a.id.localeCompare(b.id)),[...bank].sort((a,b)=>a.id.localeCompare(b.id)));}
});
test('medios: extremos exactos, cantidad de casillas, progresión y signo de la raíz',()=>{
 const r=azar(81);for(const caso of ['aritmeticos','geometricos'])for(let i=0;i<800;i++){
  const q=generar('medios',caso,'ambas',i,r),ar=caso==='aritmeticos',list=[q.medios.inicio,...q.pasos.map(p=>p.respuesta),q.medios.fin];
  assert.equal(q.tipo,ar?'aritmetica':'geometrica');assert.equal(list.length,q.medios.k+2);assert.equal(q.pasos.length,q.medios.k);
  list.slice(1).forEach((v,j)=>assert.ok(eq(ar?sub(v,list[j]):div(v,list[j]),q.p)));
  if(i<3)list.forEach(v=>assert.ok(v.n>0n&&v.d===1n));
  if(!ar&&(q.medios.k+1)%2===0){assert.match(q.enunciado,q.p.n<0n?/negativa/:/positiva/);assert.equal(q.formulas[0].startsWith('r=-'),q.p.n<0n);}
  for(const p of q.pasos){assert.ok(acepta(p.respuesta,`${p.respuesta.n*3n}/${p.respuesta.d*3n}`));assert.ok(Math.abs(num(p.respuesta))<10000);}
 }
});
