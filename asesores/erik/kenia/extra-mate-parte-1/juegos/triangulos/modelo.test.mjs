import test from 'node:test';
import assert from 'node:assert/strict';
import { TIPOS, EJEMPLOS, clasificar, crearSerie, crearEstado, responder, avanzar, evaluar, vertices } from './modelo.mjs';

function random(seed=1937){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function angleAt(points,i){const p=points[i],a=points[(i+1)%3],b=points[(i+2)%3];const u=[a.x-p.x,a.y-p.y],v=[b.x-p.x,b.y-p.y];return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))))*180/Math.PI;}
test('clasificación: límites de 90°, convención de lados y seis tipos cubiertos',()=>{
  assert.deepEqual(clasificar([60,60,60]),{lados:'equilátero',angulos:'acutángulo'});
  assert.deepEqual(clasificar([45,45,90]),{lados:'isósceles',angulos:'rectángulo'});
  assert.equal(clasificar([40,49,91]).angulos,'obtusángulo');
  assert.equal(clasificar([40,51,89]).angulos,'acutángulo');
  for(const [tipo,examples] of Object.entries(EJEMPLOS))for(const a of examples)assert.ok(Object.values(clasificar(a)).includes(tipo));
  const r=random();
  for(let i=0;i<100;i++){
    const serie=crearSerie(1,r);assert.equal(serie.length,12);
    for(const tipo of TIPOS){const cases=serie.filter(q=>q.tipo===tipo);assert.equal(cases.length,2);assert.equal(cases.filter(q=>q.respuesta).length,1);}
    for(const q of serie)assert.equal(Object.values(clasificar(q.angulos)).includes(q.tipo),q.respuesta);
  }
});
test('12000 retos algebraicos y numéricos tienen solución entera única y medidas válidas',()=>{
  const r=random(9);const goals=new Set(),rules=new Set();
  for(const etapa of [2,3])for(let i=0;i<500;i++)for(const [index,q] of crearSerie(etapa,r).entries()){
    assert.equal(q.nivel,Math.floor(index/4));assert.equal(q.angulos.reduce((a,b)=>a+b,0),180);
    assert.ok(q.angulos.every(a=>a>0&&a<180));assert.ok(Number.isInteger(q.respuesta)&&q.respuesta>0);
    const eq=q.ecuacion;
    const sum=(side,x)=>side.reduce((total,t)=>total+evaluar(t,x),0);
    assert.equal(sum(eq.izquierda,q.respuesta),sum(eq.derecha,q.respuesta));
    assert.notEqual(eq.izquierda.reduce((n,t)=>n+t.a,0),eq.derecha.reduce((n,t)=>n+t.a,0));
    q.terminos.forEach((t,j)=>assert.equal(evaluar(t,q.respuesta),q.angulos[j]));
    if(etapa===3){const e=evaluar(q.exterior,q.respuesta);assert.equal(e+q.angulos[1],180);assert.equal(e,q.angulos[0]+q.angulos[2]);rules.add(q.regla);goals.add(q.objetivo);}
  }
  assert.equal(rules.size,2);assert.ok(goals.has('el ángulo interior B')&&goals.has('el ángulo interior C')&&goals.has('el ángulo exterior E')&&goals.has('x'));
});
test('la geometría dibujada coincide con los ángulos incluso al rotar o extender',()=>{
  const r=random(38);
  for(const etapa of [1,2,3])for(let n=0;n<70;n++)for(const q of crearSerie(etapa,r)){
    const points=vertices(q.angulos,q.giro||0,etapa===3);
    points.forEach((p,i)=>{assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(Math.abs(angleAt(points,i)-q.angulos[i])<1e-8);assert.ok(p.x>=50&&p.x<=470&&p.y>=60&&p.y<=290);});
  }
});
test('reintentos, vacíos y confirmaciones duplicadas no inflan el progreso',()=>{
  for(const etapa of [1,2,3]){
    const s=crearEstado(etapa,random(55));s.fase='reto';
    assert.equal(avanzar(s),false);
    assert.equal(responder(s,'').tipo,'vacio');assert.equal(s.intentos,0);
    for(let i=0;i<12;i++){
      const answer=s.retos[i].respuesta;
      if(i%3===0){assert.equal(responder(s,etapa===1?!answer:'999').tipo,'incorrecto');assert.equal(s.completo,false);assert.equal(avanzar(s),false);}
      assert.equal(responder(s,etapa===1?answer:`${answer},0`).tipo,'correcto');
      assert.equal(responder(s,etapa===1?answer:String(answer)).tipo,'bloqueado');
      assert.equal(s.resueltos,i+1);assert.equal(avanzar(s),i<11);
    }
    assert.equal(s.resueltos,12);assert.equal(s.primerIntento,8);
  }
});
