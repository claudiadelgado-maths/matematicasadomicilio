import test from 'node:test';
import assert from 'node:assert/strict';
import {types,practice,challenge,mixedChallenge,parseAnswer,checkAnswer,createRound} from './modelo.mjs';
test('49 ejercicios únicos: cinco por tipo en práctica y dos exclusivos por tipo en desafío',()=>{
  assert.equal(types.length,7);assert.equal(practice.length,35);assert.equal(challenge.length,14);
  const all=[...practice,...challenge];assert.equal(new Set(all.map(q=>q.id)).size,49);assert.equal(new Set(all.map(q=>q.equation)).size,49);
  for(let type=0;type<7;type++){assert.equal(practice.filter(q=>q.type===type).length,5);assert.equal(challenge.filter(q=>q.type===type).length,2);}
  assert.ok(practice.every((q,i)=>q.type===Math.floor(i/5)));
});
test('Todas las soluciones satisfacen sus ecuaciones y sus dominios, incluso al redondearlas',()=>{
  for(const item of [...practice,...challenge]){
    assert.ok(Number.isFinite(item.value));assert.ok(Math.abs(item.residual(item.value))<1e-8,`${item.id}: ${item.residual(item.value)}`);
    assert.equal(checkAnswer(item,item.value.toFixed(2)).correct,true,item.id);assert.equal(checkAnswer(item,item.value.toFixed(2).replace('.',',')).correct,true,item.id);
    if(item.domain){assert.ok(item.domain.m*item.value+item.domain.c>0);assert.equal(checkAnswer(item,(-item.domain.c/item.domain.m).toFixed(2)).correct,false);}
    assert.ok(item.steps.length>=2);assert.doesNotMatch(item.equation,/NaN|undefined/);
  }
});
test('Los siete ejemplos iniciales tienen claves independientes correctas',()=>{
  const expected=[5,2.5,Math.log(18)/Math.log(5),Math.log(7)/2,16,13,Math.exp(1.5)+2];
  expected.forEach((value,type)=>assert.ok(Math.abs(practice[type*5].value-value)<1e-12));
});
test('La entrada permite coma, punto, signo y cero; rechaza fórmulas, infinitos y más de dos decimales',()=>{
  for(const [raw,value] of [['2',2],['-1,77',-1.77],['−1.77',-1.77],[' .5 ',.5],['+0,50',.5],['0',0]])assert.equal(parseAnswer(raw),value);
  for(const raw of ['', ' ', '1/2', 'NaN', 'Infinity', '1e2', '2,3.4', '3.141', '2x', '9'.repeat(500)])assert.equal(parseAnswer(raw),null);
  const item=practice.find(q=>q.id==='4-1');assert.equal(checkAnswer(item,'0.97').correct,true);assert.equal(checkAnswer(item,'0.98').correct,false);
});
test('El desafío mezcla los siete tipos sin vecinos del mismo tipo y conserva sus 14 casos',()=>{
  for(let i=0;i<100;i++){const round=mixedChallenge();assert.equal(new Set(round.map(q=>q.id)).size,14);assert.ok(round.every((q,j)=>j===0||q.type!==round[j-1].type));}
  const fallback=mixedChallenge(()=>0);assert.equal(fallback.length,14);assert.ok(fallback.every((q,j)=>j===0||q.type!==fallback[j-1].type));
});
test('Los reintentos se cuentan, las entradas inválidas no, y resolver dos veces no duplica aciertos',()=>{
  const round=createRound(challenge);assert.equal(round.submit(0,'').valid,false);assert.equal(round.errors,0);assert.equal(round.submit(0,'999').correct,false);assert.equal(round.errors,1);round.useHelp(0);
  challenge.forEach((item,index)=>{assert.equal(round.submit(index,item.value.toFixed(2)).correct,true);assert.equal(round.submit(index,item.value.toFixed(2)).ignored,true);});
  assert.equal(round.solved,14);assert.equal(round.firstTry,13);assert.equal(round.errors,1);assert.equal(round.complete,true);assert.equal(round.records[0].help,true);assert.equal(createRound(challenge).solved,0);
});
