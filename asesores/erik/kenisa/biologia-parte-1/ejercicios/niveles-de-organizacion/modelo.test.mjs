import test from 'node:test';
import assert from 'node:assert/strict';
import {NIVELES,PREGUNTAS} from './datos.mjs';
import {crearEscalera,colocar} from './modelo.mjs';
import {dibujo} from './ilustraciones.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../recursos/modelo-repaso.mjs';
let seed=7359;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
test('Ocho niveles, ilustraciones y 24 preguntas sin ambigüedad de opciones',()=>{
 assert.deepEqual(NIVELES.map(n=>n.id),['atomo','molecula','organelo','celula','tejido','organo','sistema','organismo']);
 assert.equal(PREGUNTAS.length,24);assert.equal(new Set(PREGUNTAS.map(q=>q.id)).size,24);
 for(const n of NIVELES){assert.equal(PREGUNTAS.filter(q=>q.categoryId===n.id).length,3);assert.ok(n.definition&&n.memory&&n.hint&&n.connection&&n.detail);assert.ok(n.examples.length>=2);assert.ok(!/undefined|NaN/.test(dibujo(n.id,{label:n.name})));}
 for(const q of PREGUNTAS){assert.equal(q.choices.length,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.ok(q.explanation.length>60);}
});
test('Escalera: error, acierto, duplicados y reinicio conservan un orden válido',()=>{
 const state=crearEscalera(random);assert.equal(new Set(state.order).size,8);
 assert.equal(colocar(state,'tejido'),false);assert.equal(state.placed.length,0);assert.equal(state.errors,1);
 assert.equal(colocar(state,'inexistente'),null);assert.equal(colocar(state,'atomo'),true);assert.equal(state.firstTry,0);
 assert.equal(colocar(state,'atomo'),null);for(const n of NIVELES.slice(1))assert.equal(colocar(state,n.id),true);
 assert.equal(state.firstTry,7);assert.deepEqual(state.placed,NIVELES.map(n=>n.id));assert.equal(colocar(state,'celula'),null);
 const reset=crearEscalera(random);assert.equal(reset.placed.length,0);assert.equal(reset.errors,0);
});
test('Rondas de 8 y 16 cubren todos los niveles y mezclan las opciones',()=>{
 const original=JSON.stringify(PREGUNTAS),positions=new Set(),generate=createRoundGenerator(PREGUNTAS,NIVELES,{random});
 for(let i=0;i<250;i++)for(const size of [1,2]){const round=generate(size);assert.equal(round.length,8*size);assert.equal(new Set(round.map(q=>q.id)).size,round.length);for(const n of NIVELES)assert.equal(round.filter(q=>q.categoryId===n.id).length,size);round.forEach(q=>positions.add(q.choices.findIndex(c=>c.id===q.correctId)));}
 assert.equal(positions.size,3);assert.equal(JSON.stringify(PREGUNTAS),original);
 const other=createRoundGenerator(PREGUNTAS,NIVELES,{random}),three=[...other(1),...other(1),...other(1)];assert.equal(new Set(three.map(q=>q.id)).size,24);
});
test('Resultado y repaso: puntuación única y calificación inicial inalterada',()=>{
 const generate=createRoundGenerator(PREGUNTAS,NIVELES,{random});
 for(const allCorrect of [true,false]){
  const s=createQuizState(generate(1),NIVELES);assert.equal(nextQuestion(s),false);
  for(const q of s.round){const choice=allCorrect?q.correctId:q.choices.find(c=>c.id!==q.correctId).id;assert.ok(answerQuestion(s,choice));assert.equal(answerQuestion(s,choice),null);assert.equal(nextQuestion(s),true);}
  assert.equal(s.finished,true);assert.equal(scoreQuiz(s).correct,allCorrect?8:0);
  const old=JSON.stringify(s),round=createErrorRound(s,random);assert.equal(round.length,allCorrect?0:8);
  if(round.length){const review=createQuizState(round,NIVELES);for(const q of round){answerQuestion(review,q.correctId);nextQuestion(review);}assert.equal(scoreQuiz(review).percent,100);}
  assert.equal(JSON.stringify(s),old);
 }
});
