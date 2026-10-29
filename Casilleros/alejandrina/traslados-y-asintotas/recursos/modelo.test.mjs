import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,quadraticRoots,evaluate,degree,buildBank,parseNumber,checkAnswer,translation,FAMILIES,rationalValue,HORIZONTAL_EXAMPLES,VERTICAL_EXAMPLES,MIXED_EXAMPLES,fraction,divideLinear,multiply,fromRoots} from './modelo.mjs';
import {sampleSegments} from './graficas.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} ≠ ${b}`);

test('Tres reglas horizontales: cero, razón con signos y ninguna; ignora coeficientes finales nulos',()=>{
  assert.equal(analyze([1,2],[1,0,1]).horizontal,0);
  assert.equal(analyze([1,2,-3],[1,0,2]).horizontal,-1.5);
  assert.equal(analyze([1,0,0,1],[1,0,1]).horizontal,null);
  assert.equal(analyze([1,0,3,0],[1,0,2]).horizontal,1.5);
});
test('Cuadráticas con dos raíces, una raíz doble, ninguna y raíces fraccionarias',()=>{
  assert.deepEqual(quadraticRoots([-4,0,1]),[{x:-2,multiplicity:1},{x:2,multiplicity:1}]);
  assert.deepEqual(quadraticRoots([4,-4,1]),[{x:2,multiplicity:2}]);
  assert.deepEqual(quadraticRoots([1,0,1]),[]);
  assert.deepEqual(quadraticRoots([-1,-1,2]).map(r=>r.x),[-.5,1]);
  assert.throws(()=>quadraticRoots([1,1]));
});
test('Cancelación completa deja huecos; parcial de raíz doble conserva la vertical',()=>{
  const hole=analyze([-2,1],[-4,0,1]);
  assert.deepEqual(hole.verticals,[-2]);assert.deepEqual(hole.holes,[{x:2,y:.25}]);
  const partial=analyze([-2,1],[4,-4,1]);
  assert.deepEqual(partial.verticals,[2]);assert.deepEqual(partial.holes,[]);
  const all=analyze([-4,0,1],[-4,0,1]);
  assert.deepEqual(all.verticals,[]);assert.deepEqual(all.holes,[{x:-2,y:1},{x:2,y:1}]);
  const repeated=analyze([4,-4,1],[4,-4,1]);
  assert.deepEqual(repeated.verticals,[]);assert.deepEqual(repeated.holes,[{x:2,y:1}]);
  const cubic=analyze([-2,1,-2,1],[-4,0,1]);
  assert.deepEqual(cubic.verticals,[-2]);assert.deepEqual(cubic.holes,[{x:2,y:1.25}]);assert.equal(cubic.horizontal,null);
});
test('Bancos completos sin duplicados: cuadráticas reales, grados permitidos y claves verificables',()=>{
  for(const type of ['horizontales','verticales','ambas']){
    const bank=buildBank(type);assert.ok(bank.length>=48);
    assert.equal(new Set(bank.map(q=>JSON.stringify([q.numerator,q.denominator]))).size,bank.length);
    assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
    for(const q of bank){
      assert.equal(degree(q.denominator),2);
      if(type==='ambas')assert.ok([1,2,3].includes(degree(q.numerator)));
      const correct={noHorizontal:q.horizontal===null,horizontal:q.horizontal,verticals:[...q.verticals].reverse()};
      assert.ok(checkAnswer(type,q,correct),q.id);
      for(const r of q.roots)close(evaluate(q.denominator,r.x),0);
      assert.equal(q.roots.length,q.verticals.length+q.holes.length);
      for(const hole of q.holes){
        assert.ok(!Number.isFinite(rationalValue(q,hole.x)));
        const x=hole.x+1e-4,y=rationalValue(q,x);
        assert.ok(Number.isFinite(y));assert.ok(Math.abs(y-hole.y)<.2,`${q.id}: hole ${hole.x}`);
      }
      if(q.horizontal!==null){
        assert.ok(Math.abs(rationalValue(q,1e7)-q.horizontal)<.001);
        assert.ok(Math.abs(rationalValue(q,-1e7)-q.horizontal)<.001);
      }
    }
  }
});
test('Ejemplos y banco vertical cubren 0, 1, 2 verticales y cancelaciones',()=>{
  assert.deepEqual(HORIZONTAL_EXAMPLES.map(q=>q.horizontal),[0,1.5,null]);
  assert.deepEqual(VERTICAL_EXAMPLES.map(q=>q.verticals.length),[2,1,0,1,1,0]);
  assert.deepEqual(MIXED_EXAMPLES.map(q=>q.nDegree),[1,2,3,3]);
  for(const count of [0,1,2])assert.ok(buildBank('verticales').some(q=>q.verticals.length===count));
});
test('Traslados: punto de referencia, dominio logarítmico y asíntotas se trasladan correctamente',()=>{
  const bank=buildBank('traslados');assert.equal(bank.length,120);
  assert.equal(new Set(bank.map(q=>q.id)).size,120);
  for(const q of bank){
    const t=translation(q.family,q.h,q.k);
    close(t.f(t.point[0]),t.point[1]);
    for(const x of [1,2,3])close(t.f(x+q.h),FAMILIES[q.family].f(x)+q.k);
    if(FAMILIES[q.family].kind==='log'){
      assert.ok(Number.isNaN(t.f(q.h)));assert.ok(Number.isNaN(t.f(q.h-1)));assert.equal(t.vertical,q.h);assert.equal(t.horizontal,null);
    }else if(FAMILIES[q.family].kind==='exp'){
      assert.equal(t.horizontal,q.k);assert.ok(t.f(0)>q.k);assert.equal(t.vertical,null);
    }
    assert.ok(checkAnswer('traslados',q,{h:q.h,k:q.k}));
    assert.ok(!checkAnswer('traslados',q,{h:q.h+1,k:q.k}));
  }
});
test('Entradas: acepta fracciones, punto y coma; rechaza vacíos, división por cero y texto',()=>{
  for(const [text,value] of [['-3/2',-1.5],['−1,5',-1.5],['0',0],[' .25 ',.25],['2 / -4',-.5]])close(parseNumber(text),value);
  for(const text of ['', ' ', '1/0','abc','1/2/3','1,2,3','Infinity','2+2','x=2'])assert.equal(parseNumber(text),null,text);
  assert.equal(fraction(-1.5),'-3/2');
  assert.ok(!checkAnswer('traslados',{h:0,k:0},{h:null,k:0}));
  assert.ok(!checkAnswer('horizontales',{horizontal:0},{horizontal:null,noHorizontal:false}));
  assert.ok(!checkAnswer('verticales',{verticals:[2]},{verticals:[2,2]}));
});
test('La gráfica no conecta ramas separadas por asíntotas o huecos',()=>{
  for(const q of [...VERTICAL_EXAMPLES,...MIXED_EXAMPLES]){
    const segments=sampleSegments(x=>rationalValue(q,x),-8,8,q.roots.map(r=>r.x));
    for(const segment of segments){
      assert.ok(segment.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)));
      for(const r of q.roots)assert.ok(!(segment[0][0]<r.x&&segment.at(-1)[0]>r.x),q.id);
    }
  }
  const log=translation('log',2,1);
  assert.ok(sampleSegments(log.f,-8,8,[2]).flat().every(([x])=>x>2));
});
test('La división por un factor conserva el polinomio y la multiplicidad',()=>{
  for(const [r,s] of [[-3,2],[2,2],[0,-1],[-.5,1]]){
    const p=fromRoots(r,s,2),d=divideLinear(p,r);close(d.remainder,0);
    assert.deepEqual(multiply(d.quotient,[-r,1]),p);
  }
});
