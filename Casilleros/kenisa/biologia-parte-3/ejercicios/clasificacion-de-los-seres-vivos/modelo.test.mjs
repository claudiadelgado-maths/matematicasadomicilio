import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fields,organisms,gradePassport,statements} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';

test('Los siete pasaportes distinguen las ocho combinaciones y rechazan incompletos',()=>{
 assert.equal(organisms.length,7);assert.equal(new Set(organisms.map(o=>o.id)).size,7);
 for(const o of organisms){
  assert.equal(gradePassport(o,{}).missing.length,3);
  let accepted=0;
  for(const cell of fields[0].options)for(const organization of fields[1].options)for(const nutrition of fields[2].options){
   const result=gradePassport(o,{cell,organization,nutrition});
   if(result.complete){accepted++;assert.deepEqual([cell,organization,nutrition],fields.map(f=>o[f.id]));}
  }
  assert.equal(accepted,1);
  const [asset,fragment]=o.icon.split('#');assert.ok(readFileSync(new URL(asset,import.meta.url),'utf8').includes(`id="${fragment}"`));
 }
 assert.equal(organisms.find(o=>o.id==='levadura').cell,'Eucariota');
 assert.equal(organisms.find(o=>o.id==='ciano').cell,'Procariota');
 assert.equal(organisms.find(o=>o.id==='champinon').nutrition,'Heterótrofa');
 assert.equal(statements.length,6);assert.equal(statements.filter(s=>s.answer).length,3);
});

test('Banco equilibrado, opciones válidas y copia docente sincronizada',()=>{
 assert.equal(bank.length,60);assert.equal(categories.length,10);
 assert.equal(new Set(bank.map(q=>q.id)).size,60);assert.equal(new Set(bank.map(q=>q.prompt)).size,60);
 const markdown=readFileSync(new URL('./preguntas.md',import.meta.url),'utf8');
 for(const c of categories)assert.equal(bank.filter(q=>q.categoryId===c.id).length,6);
 for(const q of bank){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.ok(q.explanation.length>30);assert.ok(markdown.includes(q.prompt));assert.ok(markdown.includes(q.explanation));}
});

test('Tres rondas de 20 agotan las 60 preguntas sin repetir y la ronda breve cubre todos los temas',()=>{
 const generate=createRoundGenerator(bank,categories),seen=new Set();
 for(let i=0;i<3;i++){const round=generate(2);assert.equal(round.length,20);for(const q of round){assert.ok(!seen.has(q.id));seen.add(q.id);}}
 assert.equal(seen.size,60);
 const short=generate(1);assert.equal(short.length,10);assert.equal(new Set(short.map(q=>q.categoryId)).size,10);
});

test('El examen bloquea doble respuesta y el repaso no modifica la nota original',()=>{
 const state=createQuizState(createRoundGenerator(bank,categories)(2),categories);
 assert.equal(nextQuestion(state),false);
 for(let i=0;i<20;i++){
  const q=state.round[state.index];const id=i===0?q.choices.find(c=>c.id!==q.correctId).id:q.correctId;
  assert.ok(answerQuestion(state,id));assert.equal(answerQuestion(state,q.correctId),null);nextQuestion(state);
 }
 assert.equal(scoreQuiz(state).correct,19);
 const errors=createErrorRound(state);assert.equal(errors.length,1);
 const retry=createQuizState(errors,categories);answerQuestion(retry,errors[0].correctId);nextQuestion(retry);
 assert.equal(scoreQuiz(retry).correct,1);assert.equal(scoreQuiz(state).correct,19);
});
