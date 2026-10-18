import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parts,grade,osmosis,cases,transportTypes,pumpSteps,vesicles} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('Ósmosis: tres medios y ambos tipos celulares, con límites y entradas inválidas',()=>{
 for(const cell of ['animal','vegetal'])for(let n=0;n<=10;n++){
  const r=osmosis(n,cell);assert.equal(r.direction,n<5?'entra':n>5?'sale':'equilibrio');
  assert.equal(r.medium,n<5?'hipotonico':n>5?'hipertonico':'isotonico');
 }
 assert.match(osmosis(2,'animal').detail,/hemólisis/);assert.match(osmosis(2,'vegetal').detail,/turgencia/);
 assert.match(osmosis(8,'vegetal').title,/plasmólisis/);assert.match(osmosis(8,'animal').detail,/crenación/);
 assert.match(osmosis(5,'animal').detail,/ambos sentidos/);assert.match(osmosis(5,'vegetal').title,/flácida/);
 for(const n of [-1,11,NaN,Infinity,'5'])assert.throws(()=>osmosis(n),RangeError);
 assert.throws(()=>osmosis(5,'roca'),RangeError);
});
test('Casos: una única pareja válida, vacíos y errores; cobertura de siete mecanismos',()=>{
 assert.equal(cases.length,12);assert.equal(new Set(cases.map(c=>c.id)).size,12);
 assert.deepEqual(new Set(cases.map(c=>c.mechanism)),new Set(transportTypes.map(t=>t.id)));
 for(const c of cases){
  const expected={mechanism:c.mechanism,energy:c.energy};let valid=0;
  for(const t of transportTypes)for(const e of ['si','no'])if(grade(expected,{mechanism:t.id,energy:e}).complete)valid++;
  assert.equal(valid,1);assert.equal(grade(expected,{}).missing.length,2);
  assert.equal(grade(expected,{mechanism:c.mechanism,energy:c.energy==='si'?'no':'si'}).correct,1);
  assert.equal(c.energy,['simple','facilitada','osmosis'].includes(c.mechanism)?'no':'si');assert.ok(c.why.length>50);
 }
});
test('Esquema y controles conservan componentes; recorridos completos y enlaces internos',()=>{
 const html=read('index.html'),diagram=read('recursos/membrana.svg');assert.ok(html.includes(diagram));assert.equal(parts.length,5);
 for(const part of parts){assert.ok(diagram.includes(`data-part="${part.id}"`));assert.ok(part.x>0&&part.x<100&&part.y>0&&part.y<100);}
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),id);
 assert.equal(pumpSteps.length,4);for(const v of Object.values(vesicles))assert.equal(v.steps.length,3);
});
test('60 preguntas únicas y documentadas: seis por tema, claves y distractores válidos',()=>{
 assert.equal(bank.length,60);assert.equal(categories.length,10);assert.equal(new Set(bank.map(q=>q.id)).size,60);assert.equal(new Set(bank.map(q=>q.prompt)).size,60);
 const teacher=read('preguntas.md');
 for(const cat of categories)assert.equal(bank.filter(q=>q.categoryId===cat.id).length,6);
 for(const q of bank){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.ok(q.explanation.length>45);assert.ok(teacher.includes(q.prompt));assert.ok(teacher.includes(q.explanation));}
});
test('Rondas agotan las 60 preguntas; errores y puntuación se mantienen independientes',()=>{
 const generate=createRoundGenerator(bank,categories),seen=new Set();
 for(const size of [1,2,1,2]){const round=generate(size);assert.equal(round.length,size*10);for(const q of round){assert.ok(!seen.has(q.id));seen.add(q.id);}}
 assert.equal(seen.size,60);
 const state=createQuizState(generate(2),categories);assert.equal(nextQuestion(state),false);
 for(let i=0;i<20;i++){const q=state.round[i];answerQuestion(state,i===0?q.choices.find(c=>c.id!==q.correctId).id:q.correctId);assert.equal(answerQuestion(state,q.correctId),null);nextQuestion(state);}
 assert.equal(scoreQuiz(state).correct,19);const errors=createErrorRound(state);assert.equal(errors.length,1);
 const review=createQuizState(errors,categories);answerQuestion(review,errors[0].correctId);nextQuestion(review);
 assert.equal(scoreQuiz(review).correct,1);assert.equal(scoreQuiz(state).correct,19);
});
