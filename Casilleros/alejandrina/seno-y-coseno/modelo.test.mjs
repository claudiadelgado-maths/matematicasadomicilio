import test from 'node:test';
import assert from 'node:assert/strict';
import {parseValue,buildModel,numberOf,texQ,texPi,texX} from './modelo.mjs';

const model=(kind,A,B,C,K)=>buildModel(kind,Object.fromEntries(Object.entries({A,B,C,K}).map(([key,value])=>[key,parseValue(value,key==='C')])));
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} ≠ ${expected}`);

test('decimales y fracciones se conservan exactamente',()=>{
  assert.equal(texQ(parseValue('-.125').coefficient),'-\\frac{1}{8}');
  assert.equal(texQ(parseValue('1,25').coefficient),'\\frac{5}{4}');
  assert.equal(texQ(parseValue('3/-6').coefficient),'-\\frac{1}{2}');
  assert.equal(texPi(parseValue('-pi/2',true).coefficient),'-\\frac{\\pi}{2}');
  near(parseValue('π',true).value,Math.PI);
  near(parseValue('3*pi/4',true).value,3*Math.PI/4);
  near(parseValue('+pi',true).value,Math.PI);
});
test('rechaza entradas incompletas, código, cero en denominador y valores fuera de límites',()=>{
  for(const value of ['', '-', '1/', '1/0', 'NaN','Infinity','1e2','sin(0)','alert(1)','0.0000001','1000001']) assert.throws(()=>parseValue(value));
  assert.throws(()=>parseValue('pi'));
  assert.throws(()=>parseValue('pi+1',true));
});
for(const kind of ['sin','cos']) for(const A of [-2,2]) for(const B of [-3,3]) {
  test(`${kind}, A=${A}, B=${B}: patrón, período y coordenadas coinciden con la función`,()=>{
    const m=model(kind,A,B,'-pi/2',4);
    assert.equal(m.constant,false);
    assert.equal(numberOf(m.minimum),2);assert.equal(numberOf(m.maximum),6);
    near(numberOf(m.period)*Math.PI,2*Math.PI/Math.abs(B));
    near(numberOf(m.step)*Math.PI,Math.PI/(2*Math.abs(B)));
    const units=kind==='sin'?[0,Math.sign(A*B),0,-Math.sign(A*B),0]:[Math.sign(A),0,-Math.sign(A),0,Math.sign(A)];
    assert.deepEqual(m.points.map(p=>p.unit),units);
    let previous=-Infinity;
    for(const p of m.points){const x=numberOf(p.x.base)+numberOf(p.x.pi)*Math.PI;assert.ok(x>previous);previous=x;near(numberOf(p.y),A*Math[kind](B*x-Math.PI/2)+4);near(m.valueAtCycle(p.z/4),numberOf(p.y));}
  });
}
test('ejemplo resuelto: seno desplazado con coordenadas exactas',()=>{
  const m=model('sin',2,2,'-pi',1);
  assert.deepEqual(m.points.map(p=>p.xTex),['\\frac{\\pi}{2}','\\frac{3\\pi}{4}','\\pi','\\frac{5\\pi}{4}','\\frac{3\\pi}{2}']);
  assert.deepEqual(m.points.map(p=>numberOf(p.y)),[1,3,1,-1,1]);
});
test('fase numérica conserva base racional más múltiplo de pi',()=>{
  const m=model('cos','-1/2','2/3','1/3','3/2');
  assert.equal(texX(m.start),'-\\frac{1}{2}');
  assert.equal(m.points[1].xTex,'-\\frac{1}{2}+\\frac{3\\pi}{4}');
  assert.equal(texQ(m.minimum),'1'); assert.equal(texQ(m.maximum),'2');
});
for(const kind of ['sin','cos']) {
  test(`${kind}: A=0 conserva K, incluso con B=0`,()=>{
    for(const B of [0,2]){const m=model(kind,0,B,'pi/3','-3/2');assert.equal(m.constant,true);assert.equal(m.height,-1.5);assert.equal(m.heightTex,'-\\frac{3}{2}');assert.deepEqual(m.points,[]);assert.equal(m.period,undefined);}
  });
  test(`${kind}: B=0 evalúa la fase, no supone altura K`,()=>{
    for(const C of ['pi/2','-pi','3pi/2','0','1/3']){const m=model(kind,3,0,C,2);assert.equal(m.constant,true);near(m.height,2+3*Math[kind](parseValue(C,true).value));assert.deepEqual(m.points,[]);assert.equal(m.period,undefined);}
  });
}
test('escala extrema conserva amplitud y puntos exactos',()=>{
  const m=model('sin','0.000001','0.000001','1000000','1000000');
  assert.equal(texQ(m.amplitude),'\\frac{1}{1000000}');
  assert.equal(m.points[1].xTex,'-1000000000000+500000\\pi');
  assert.equal(texQ(m.points[1].y),'\\frac{1000000000001}{1000000}');
});
