import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {structures,nutritionSteps,checkOrder,gradeSelections,caseFields,cases,reproduction} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';

test('Cinco estructuras y nueve etapas señalan ilustraciones reales',()=>{
 const svg=readFileSync(new URL('./recursos/hongo.svg',import.meta.url),'utf8');
 const page=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.ok(page.includes(svg));assert.equal(structures.length,5);
 for(const p of structures){assert.ok(svg.includes(`data-part="${p.id}"`));assert.ok(p.x>0&&p.x<800&&p.y>0&&p.y<550);}
 const cycles=readFileSync(new URL('./recursos/ciclos.svg',import.meta.url),'utf8');
 assert.equal(reproduction.length,3);for(const r of reproduction){assert.equal(r.steps.length,3);r.steps.forEach(s=>assert.ok(cycles.includes(`id="${s[2]}"`)));}
});
test('Solo una de las 24 secuencias completas es correcta; no admite incompletas ni duplicadas',()=>{
 const ids=nutritionSteps.map(s=>s.id);
 function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[v,...rest])):[[]];}
 assert.equal(permutations(ids).filter(a=>checkOrder(a).correct).length,1);
 assert.equal(checkOrder(ids).correct,true);assert.equal(checkOrder(ids.slice(1)).complete,false);
 assert.equal(checkOrder([ids[0],ids[0],ids[0],ids[0]]).correct,false);
});
test('Los ocho casos tienen una combinación válida de tres características e imágenes disponibles',()=>{
 assert.equal(cases.length,8);assert.equal(new Set(cases.map(c=>c.id)).size,8);
 const icons=readFileSync(new URL('./recursos/tipos.svg',import.meta.url),'utf8');
 for(const c of cases){
  assert.ok(icons.includes(`id="${c.icon}"`));assert.equal(gradeSelections(c.expected,{}).missing.length,3);
  let matches=0;
  for(const form of caseFields[0].options)for(const organization of caseFields[1].options)for(const nutrition of caseFields[2].options){
   if(gradeSelections(c.expected,{form,organization,nutrition}).complete)matches++;
  }
  assert.equal(matches,1);assert.equal(gradeSelections(c.expected,c.expected).correct,3);
 }
 const expected=Object.fromEntries(structures.map(p=>[p.id,p.id]));assert.equal(gradeSelections(expected,expected).correct,5);
 assert.equal(cases.find(c=>c.id==='raiz').expected.nutrition,'Mutualista');
 assert.equal(cases.find(c=>c.id==='moho-pan').expected.nutrition,'Saprótrofa');
});
test('Banco de 60 preguntas equilibrado y sincronizado con la copia docente',()=>{
 assert.equal(bank.length,60);assert.equal(categories.length,10);assert.equal(new Set(bank.map(q=>q.prompt)).size,60);
 const markdown=readFileSync(new URL('./preguntas.md',import.meta.url),'utf8');
 for(const c of categories)assert.equal(bank.filter(q=>q.categoryId===c.id).length,6);
 for(const q of bank){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.ok(markdown.includes(q.prompt));assert.ok(markdown.includes(q.explanation));}
});
test('Rondas 10/20 agotan variantes y el repaso conserva la puntuación inicial',()=>{
 const generate=createRoundGenerator(bank,categories),rounds=[generate(1),generate(1),generate(2),generate(2)];
 assert.deepEqual(rounds.map(r=>r.length),[10,10,20,20]);assert.equal(new Set(rounds.flat().map(q=>q.id)).size,60);
 const state=createQuizState(rounds[2],categories);assert.equal(nextQuestion(state),false);
 state.round.forEach((q,i)=>{answerQuestion(state,i===0?q.choices.find(c=>c.id!==q.correctId).id:q.correctId);assert.equal(answerQuestion(state,q.correctId),null);nextQuestion(state);});
 assert.equal(scoreQuiz(state).correct,19);const errors=createErrorRound(state);assert.equal(errors.length,1);
 const review=createQuizState(errors,categories);answerQuestion(review,errors[0].correctId);nextQuestion(review);assert.equal(scoreQuiz(review).correct,1);assert.equal(scoreQuiz(state).correct,19);
});
