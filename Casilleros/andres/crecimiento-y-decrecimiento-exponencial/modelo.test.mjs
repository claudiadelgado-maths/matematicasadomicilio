import test from 'node:test';
import assert from 'node:assert/strict';
import {parseDecimal,createModel,recoverInitial,isCorrect,challenges} from './modelo.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);

test('lee punto, coma y signo; no confunde entradas inválidas con cero',()=>{
  assert.equal(parseDecimal(' −12,5 '),-12.5);assert.equal(parseDecimal('.25'),.25);assert.equal(parseDecimal('0'),0);
  for(const value of ['', ' ', '-', '1/2', '1,000.50', '1 000', 'NaN', 'Infinity','2e3','10%','alert(1)']) assert.throws(()=>parseDecimal(value));
});
test('crecimiento conserva el factor y calcula incrementos cambiantes',()=>{
  const m=createModel(500,20,3);near(m.factor,1.2);near(m.final,864);near(m.totalPercent,72.8);
  assert.equal(m.rows[0].change,null);near(m.rows[1].change,100);near(m.rows[2].change,120);near(m.rows[3].change,144);
});
test('decrecimiento: pérdidas sobre el valor anterior, cantidades positivas',()=>{
  const m=createModel(1000,-20,2);near(m.final,640);near(m.totalPercent,-36);near(m.rows[2].change,-160);
  for(const row of m.rows)assert.ok(row.quantity>0);
});
test('tasa cero conserva la cantidad, período cero es siempre el inicio',()=>{
  for(const rate of [-90,-10,0,20,100])assert.equal(createModel(350,rate,12).rows[0].quantity,350);
  const m=createModel(350,0,12);assert.equal(m.kind,'Cantidad constante');assert.equal(m.totalPercent,0);
  for(const row of m.rows)assert.equal(row.quantity,350);
});
test('no redondea entre pasos',()=>{
  const m=createModel(123.45,3.25,12);near(m.final,123.45*1.0325**12);
  for(let n=1;n<m.rows.length;n++)near(m.rows[n].quantity/m.rows[n-1].quantity,m.factor);
});
test('límites admitidos conservan valores finitos y no negativos',()=>{
  for(const initial of [.01,1e6])for(const rate of [-90,100]){const m=createModel(initial,rate,12);assert.ok(Number.isFinite(m.final)&&m.final>0);}
  for(const args of [[0,20,3],[-1,20,3],[1e6+1,20,3],[100,-100,3],[100,101,3],[100,NaN,3],[100,10,0],[100,10,13],[100,10,1.5]])assert.throws(()=>createModel(...args));
});
test('recupera el inicio de crecimiento y decrecimiento',()=>{
  near(recoverInitial(968,1.1,2),800);near(recoverInitial(405,.9,2),500);
  near(recoverInitial(250,1,12),250);near(recoverInitial(250,1.2,0),250);
  for(const args of [[100,0,2],[100,-1,2],[100,1.1,-1],[0,1.1,2]])assert.throws(()=>recoverInitial(...args));
});
test('respuestas admiten redondeo a dos decimales y rechazan errores comunes',()=>{
  assert.ok(isCorrect('72,8',72.8));assert.ok(isCorrect('1.23',1.2345));assert.ok(isCorrect('-8',-8));
  assert.equal(isCorrect('60',72.8),false);assert.equal(isCorrect('600',640),false);assert.equal(isCorrect('100',99),false);
  assert.throws(()=>isCorrect('',0));
});
test('diez retos cubren factores, modelo, porcentaje, inversa y cambios sucesivos',()=>{
  assert.equal(challenges.length,10);
  const expected=[1.12,.8,400,720,640,72.8,800,-8,99,500];
  challenges.forEach((challenge,index)=>{near(challenge.answer,expected[index]);assert.ok(challenge.hint&&challenge.wrong&&challenge.steps.length>=2);});
});
