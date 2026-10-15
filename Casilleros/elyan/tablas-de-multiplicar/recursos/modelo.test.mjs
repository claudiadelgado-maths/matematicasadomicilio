import test from 'node:test';
import assert from 'node:assert/strict';
import {createPath,optionsFor,cleanProgress,loadProgress,saveProgress,triviaRound,createTrivia,storageKey} from './modelo.mjs';
test('Las 100 multiplicaciones ofrecen cuatro opciones únicas, cercanas y con una respuesta correcta',()=>{
  for(let table=1;table<=10;table++)for(let step=1;step<=10;step++)for(let i=0;i<30;i++){
    const answer=table*step,options=optionsFor(answer,table);assert.equal(options.length,4);assert.equal(new Set(options).size,4);assert.ok(options.includes(answer));assert.ok(options.every(value=>Number.isInteger(value)&&value>=0&&Math.abs(value-answer)<=Math.max(2,2*table)));
  }
});
test('Se desbloquean las diez tablas únicamente tras sus diez saltos; no hay doble avance durante el movimiento',()=>{
  const path=createPath();assert.equal(path.select(2),false);
  for(let level=1;level<=10;level++){
    assert.equal(path.select(level),true);
    for(let i=1;i<=10;i++){
      assert.equal(path.choose(level*i),true);assert.equal(path.position,level*i);assert.equal(path.choose(level*(i+1)),null);
      path.landed();assert.equal(path.phase,i===10?'complete':'ready');
    }
    assert.equal(path.completed.length,level);assert.equal(path.unlocked,Math.min(level+1,10));
  }
  assert.equal(path.select(3),true);path.restart();assert.equal(path.completed.length,10);assert.equal(path.position,0);
});
test('Una caída reinicia solo el nivel actual y requiere reintentar',()=>{
  const path=createPath([1,2]);path.select(3);path.choose(3);path.landed();assert.equal(path.choose(7),false);assert.equal(path.position,0);assert.equal(path.phase,'fallen');assert.equal(path.choose(3),null);assert.deepEqual(path.completed,[1,2]);path.restart();assert.equal(path.choose(3),true);
});
test('El progreso admite datos dañados y almacenamiento bloqueado sin romper el juego',()=>{
  assert.deepEqual(cleanProgress([1,2,2,4,100,'3']),[1,2]);assert.deepEqual(cleanProgress({}),[]);
  const memory=new Map(),storage={getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)};
  assert.equal(saveProgress(storage,[1,2]),true);assert.deepEqual(loadProgress(storage),[1,2]);memory.set(storageKey,'no es json');assert.deepEqual(loadProgress(storage),[]);assert.deepEqual(loadProgress(undefined),[]);assert.equal(saveProgress(undefined,[1]),false);
});
test('Trivia en orden contiene los diez factores; mezclada incluye dos preguntas distintas de cada tabla',()=>{
  for(let table=1;table<=10;table++)assert.deepEqual(triviaRound('ordered',table).map(q=>q.b),[1,2,3,4,5,6,7,8,9,10]);
  for(let i=0;i<100;i++){const mixed=triviaRound('mixed');assert.equal(mixed.length,20);assert.equal(new Set(mixed.map(q=>`${q.a}-${q.b}`)).size,20);for(let table=1;table<=10;table++)assert.equal(mixed.filter(q=>q.a===table).length,2);}
});
test('La trivia cuenta una sola elección por pregunta y finaliza con resultados coherentes',()=>{
  const quiz=createTrivia(triviaRound('ordered',7));assert.equal(quiz.next(),false);
  for(let i=0;i<10;i++){assert.equal(quiz.choose(i%2?quiz.current.answer:0),i%2===1);assert.equal(quiz.choose(quiz.current.answer),null);if(i<9)assert.equal(quiz.next(),true);}
  assert.equal(quiz.complete,true);assert.equal(quiz.correct,5);assert.equal(quiz.errors,5);assert.equal(quiz.count,10);assert.equal(quiz.next(),false);
});
