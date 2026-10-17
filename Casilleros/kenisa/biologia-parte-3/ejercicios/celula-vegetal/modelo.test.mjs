import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {structures,identificationRound,classification,photosynthesisState,dayNightState} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';

test('Once elementos apuntan a grupos reales y sus coordenadas caben en el dibujo',()=>{
 const svg=fs.readFileSync(new URL('./recursos/celula-vegetal.svg',import.meta.url),'utf8');
 assert.equal(structures.length,11);assert.equal(new Set(structures.map(s=>s.id)).size,11);
 for(const s of structures){assert.ok(svg.includes(`data-part="${s.id}"`));assert.ok(s.x>0&&s.x<800&&s.y>0&&s.y<540);assert.ok(s.fn&&s.detail&&s.cue);}
 assert.match(structures.find(s=>s.id==='clorofila').detail,/No es otro organelo/);
});
test('Identificación cubre once elementos con tres alternativas únicas y una correcta',()=>{
 for(let i=0;i<100;i++){
  const round=identificationRound();assert.equal(new Set(round.map(q=>q.id)).size,11);
  for(const q of round){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.id)).size,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);}
 }
});
test('Clasificación cubre 18 pistas y trata la ausencia de cloroplastos sin falsas exclusiones',()=>{
 assert.equal(classification.length,18);assert.equal(new Set(classification.map(q=>q.id)).size,18);
 assert.deepEqual([...new Set(classification.map(q=>q.correctId))].sort(),['ambas','animal','vegetal']);
 assert.equal(classification.find(q=>q.prompt.startsWith('Puede carecer de cloroplastos')).correctId,'ambas');
 assert.equal(classification.find(q=>q.prompt.includes('célula viva de una raíz')).correctId,'vegetal');
 classification.forEach(q=>{assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.ok(q.explanation.length>30);});
});
test('Ocho combinaciones de insumos: solo las tres entradas permiten fotosíntesis en el modelo',()=>{
 for(let bits=0;bits<8;bits++){
  const result=photosynthesisState({light:!!(bits&1),water:!!(bits&2),co2:!!(bits&4)});
  assert.equal(result.active,bits===7);assert.equal(result.missing.length,3-[1,2,4].filter(n=>bits&n).length);
 }
 assert.deepEqual(dayNightState('day'),{photosynthesis:true,respiration:true});
 assert.deepEqual(dayNightState('night'),{photosynthesis:false,respiration:true});
 assert.throws(()=>dayNightState('invalid'));
});
test('El banco mantiene 48 preguntas y agota variantes antes de reciclarlas en rondas de 8/16',()=>{
 assert.equal(bank.length,48);assert.equal(categories.length,8);
 for(const c of categories)assert.equal(bank.filter(q=>q.categoryId===c.id).length,6);
 const markdown=fs.readFileSync(new URL('./preguntas.md',import.meta.url),'utf8');
 bank.forEach(q=>{assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.ok(q.choices.some(c=>c.id===q.correctId));assert.ok(markdown.includes(q.prompt));assert.ok(markdown.includes(q.explanation));});
 for(let run=0;run<50;run++){
  const generate=createRoundGenerator(bank,categories);
  const rounds=[generate(1),generate(1),generate(2),generate(2)];assert.deepEqual(rounds.map(r=>r.length),[8,8,16,16]);assert.equal(new Set(rounds.flat().map(q=>q.id)).size,48);
 }
});
test('Prácticas independientes, respuestas bloqueadas y repaso que conserva la nota original',()=>{
 const state=createQuizState(classification,[]),other=createQuizState(identificationRound(),[]);
 assert.equal(nextQuestion(state),false);
 for(let i=0;i<classification.length;i++){
  const q=state.round[state.index];const choice=i===0?q.choices.find(c=>c.id!==q.correctId).id:q.correctId;
  answerQuestion(state,choice);assert.equal(answerQuestion(state,q.correctId),null);nextQuestion(state);
 }
 assert.equal(scoreQuiz(state).correct,17);assert.equal(other.answers.length,0);
 const errors=createErrorRound(state);assert.equal(errors.length,1);
 const review=createQuizState(errors,[]);answerQuestion(review,errors[0].correctId);nextQuestion(review);
 assert.equal(scoreQuiz(review).correct,1);assert.equal(scoreQuiz(state).correct,17);assert.equal(createErrorRound(review).length,0);
});
