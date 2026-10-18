import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCycle,stepCycle,yields,foodCases,agents,products,gradeFood,cases,caseOptions} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
test('Ambas rutas conservan carbono y transportadores; solo glucólisis añade ATP neto',()=>{
 for(const route of ['lactica','alcoholica']){
  let state=createCycle(route);
  const carbon=s=>s.glucose*6+s.pyruvate*3+s.product*(route==='lactica'?3:2)+s.co2;
  const blocked=stepCycle(state,'ferment');assert.equal(blocked.ok,false);assert.deepEqual(blocked.state,state);
  for(let i=1;i<=3;i++){
   const previous={...state},gly=stepCycle(state,'glycolysis');assert.deepEqual(state,previous);assert.equal(gly.ok,true);state=gly.state;
   assert.equal(state.atp,i*2);assert.equal(state.pyruvate,2);assert.equal(state.nad,0);assert.equal(state.nadh,2);assert.equal(carbon(state),18);
   const repeat=stepCycle(state,'glycolysis');assert.equal(repeat.ok,false);assert.deepEqual(repeat.state,state);
   const fermented=stepCycle(state,'ferment');assert.equal(fermented.ok,true);state=fermented.state;
   assert.equal(state.atp,i*2);assert.equal(state.nad,2);assert.equal(state.nadh,0);assert.equal(state.product,i*2);assert.equal(state.co2,route==='alcoholica'?i*2:0);assert.equal(state.cycles,i);assert.equal(carbon(state),18);
   const repeatFerment=stepCycle(state,'ferment');assert.equal(repeatFerment.ok,false);assert.deepEqual(repeatFerment.state,state);
  }
  assert.equal(state.glucose,0);assert.equal(stepCycle(state,'glycolysis').ok,false);
 }
 assert.throws(()=>createCycle('otra'),RangeError);assert.throws(()=>stepCycle(createCycle(),'otra'),RangeError);
});
test('La comparación usa rendimiento neto y limita las cantidades del modelo',()=>{
 for(let n=1;n<=5;n++)assert.deepEqual(yields(n),{fermentation:n*2,aerobicMin:n*30,aerobicMax:n*32});
 for(const n of [0,6,1.5,NaN,'2'])assert.throws(()=>yields(n),RangeError);
});
test('Cinco relaciones y doce casos completos, con vacíos y respuestas parciales',()=>{
 assert.equal(foodCases.length,5);assert.equal(cases.length,12);
 for(const set of [foodCases,cases])assert.equal(new Set(set.map(x=>x.id)).size,set.length);
 for(const item of foodCases){
  assert.deepEqual(gradeFood(item,{}).missing,['agent','product']);assert.equal(gradeFood(item,{agent:item.agent}).correct.length,1);
  let valid=0;for(const [agent] of agents)for(const [product] of products){const result=gradeFood(item,{agent,product});assert.equal(result.missing.length,0);assert.equal(result.correct.length+result.wrong.length,2);if(result.correct.length===2)valid++;}assert.equal(valid,1);assert.ok(item.why.length>80);
 }
 for(const item of cases){assert.equal(caseOptions.filter(([id])=>id===item.answer).length,1);assert.ok(item.why.length>70);}
 assert.equal(cases.filter(x=>x.answer==='falta').length,2);
});
test('Página, navegación y anclajes íntegros',()=>{
 const html=read('index.html'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(html.toLowerCase().startsWith('<!doctype html>'));assert.ok(html.includes('<meta charset="utf-8">'));assert.ok(html.includes('class="bio4 biology-site fermentation-page"'));
 assert.ok(html.includes('src="script.mjs"'));assert.ok(html.includes('href="estilos.css"'));assert.equal(new Set(ids).size,ids.length);
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),id);
 assert.ok(!html.includes('href="#"'));assert.ok(read('../../index.html').includes('ejercicios/fermentacion/index.html'));
});
test('48 preguntas, ocho categorías equilibradas y copia docente sincronizada',()=>{
 assert.equal(bank.length,48);assert.equal(categories.length,8);assert.equal(new Set(bank.map(q=>q.prompt)).size,48);assert.equal(new Set(bank.map(q=>q.id)).size,48);
 const teacher=read('preguntas.md');
 for(const cat of categories)assert.equal(bank.filter(q=>q.categoryId===cat.id).length,6);
 for(const q of bank){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.ok(teacher.includes(q.prompt));assert.ok(teacher.includes(q.explanation));for(const c of q.choices)assert.ok(teacher.includes(c.text));}
});
test('Rondas de 8/16 sin repeticiones prematuras; repaso conserva nota inicial',()=>{
 const generator=createRoundGenerator(bank,categories),seen=new Set();
 for(const count of [1,2,1,2]){const round=generator(count);assert.equal(round.length,count*8);for(const q of round){assert.ok(!seen.has(q.id));seen.add(q.id);}}
 assert.equal(seen.size,48);const state=createQuizState(generator(1),categories);
 for(let i=0;i<8;i++){const q=state.round[i];answerQuestion(state,i===0?q.choices.find(c=>c.id!==q.correctId).id:q.correctId);nextQuestion(state);}
 assert.equal(scoreQuiz(state).correct,7);const errors=createErrorRound(state);assert.equal(errors.length,1);
 const review=createQuizState(errors,categories);answerQuestion(review,errors[0].correctId);nextQuestion(review);assert.equal(scoreQuiz(review).correct,1);assert.equal(scoreQuiz(state).correct,7);
});
