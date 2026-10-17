import test from 'node:test';
import assert from 'node:assert/strict';
import { bank, categories, cards, structures } from './contenido.mjs';
import { createRoundGenerator, createQuizState, answerQuestion, nextQuestion, scoreQuiz, createErrorRound } from '../../biologia-parte-1/recursos/modelo-repaso.mjs';

test('Las 20 preguntas conservan las claves del docente y diez pares temáticos',()=>{
  assert.equal(bank.length,20);
  const keys=[1,2,0,0,1,2,0,1,0,2,1,2,0,1,2,0,1,2,1,0];
  bank.forEach((q,i)=>{
    assert.equal(q.correctId,`p${i+1}-${keys[i]}`);
    assert.equal(q.choices.length,3);
    assert.equal(new Set(q.choices.map(c=>c.text)).size,3);
    assert.ok(q.explanation.length>30);
  });
  assert.equal(categories.length,10);
  categories.forEach(c=>assert.equal(bank.filter(q=>q.categoryId===c.id).length,2));
});
test('Dos rondas breves cubren el banco; el repaso completo no repite preguntas',()=>{
  for(let run=0;run<100;run++){
    const generate=createRoundGenerator(bank,categories);
    const first=generate(1),second=generate(1),complete=generate(2);
    assert.equal(new Set([...first,...second].map(q=>q.id)).size,20);
    assert.equal(new Set(complete.map(q=>q.id)).size,20);
    for(const round of [first,second,complete]){
      assert.equal(new Set(round.map(q=>q.categoryId)).size,10);
      round.forEach(q=>assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1));
    }
  }
});
test('Puntaje, respuesta única y repaso separado de los errores en las 20 preguntas',()=>{
  const state=createQuizState(bank,categories);
  assert.equal(nextQuestion(state),false);
  for(let i=0;i<20;i++){
    const q=state.round[state.index];
    answerQuestion(state,i%2?q.correctId:q.choices.find(c=>c.id!==q.correctId).id);
    assert.equal(answerQuestion(state,q.correctId),null);
    nextQuestion(state);
  }
  assert.deepEqual([state.finished,scoreQuiz(state).correct,scoreQuiz(state).percent],[true,10,50]);
  const errors=createErrorRound(state);
  assert.equal(errors.length,10);
  const review=createQuizState(errors,categories);
  errors.forEach(q=>{answerQuestion(review,q.correctId);nextQuestion(review);});
  assert.equal(scoreQuiz(review).correct,10);
  assert.equal(scoreQuiz(state).correct,10);
});
test('Clasificación: diez ejemplos, cuatro pistas y cuatro procariotas concretas',()=>{
  assert.equal(cards.length,14);
  assert.equal(cards.filter(c=>c.icon==='pista').length,4);
  assert.equal(cards.filter(c=>c.icon!=='pista'&&c.correctId==='pro').length,4);
  const state=createQuizState(cards,[{id:'clasificacion',name:'Tipos'}]);
  cards.forEach(q=>{assert.ok(q.explanation.length>30);answerQuestion(state,q.correctId);nextQuestion(state);});
  assert.equal(scoreQuiz(state).correct,14);
  assert.equal(createErrorRound(state).length,0);
});
test('Las ocho estructuras tienen función, pista y coordenadas dentro del esquema',()=>{
  assert.equal(structures.length,8);
  assert.equal(new Set(structures.map(s=>s.id)).size,8);
  structures.forEach(s=>{assert.ok(s.x>0&&s.x<720&&s.y>0&&s.y<430);assert.ok(s.function&&s.cue&&s.detail&&s.question);});
  assert.match(structures.find(s=>s.id==='nucleoide').detail,/No hay una membrana/);
  assert.match(structures.find(s=>s.id==='capsula').detail,/algunas/);
});
