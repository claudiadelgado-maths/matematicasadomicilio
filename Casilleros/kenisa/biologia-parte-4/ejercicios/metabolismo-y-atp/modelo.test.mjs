import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createATP,actATP,enzymeActivity,experiments,enzymes,substrates,products,gradeEnzyme,routeCases,energyCases,energyOptions} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');

test('ATP exige uso y aporte energético antes de regenerar; no crea ciclos por acciones inválidas',()=>{
 let state=createATP();const initial={...state};
 for(const action of ['supply','regenerate']){const r=actATP(state,action);assert.equal(r.ok,false);assert.deepEqual(r.state,initial);}
 const used=actATP(state,'use');assert.equal(used.ok,true);assert.deepEqual(state,initial);state=used.state;
 assert.equal(state.form,'ADP');assert.equal(state.uses,1);
 for(const action of ['use','regenerate']){const r=actATP(state,action);assert.equal(r.ok,false);assert.deepEqual(r.state,state);}
 state=actATP(state,'supply').state;assert.equal(state.energy,true);assert.equal(actATP(state,'supply').ok,false);
 state=actATP(state,'regenerate').state;assert.equal(state.form,'ATP');assert.equal(state.cycles,1);assert.equal(state.energy,false);
 for(let i=0;i<2;i++)for(const action of ['use','supply','regenerate'])state=actATP(state,action).state;
 assert.equal(state.cycles,3);assert.equal(state.uses,3);assert.deepEqual(createATP(),initial);assert.throws(()=>actATP(state,'magia'),RangeError);
});
test('La actividad enzimática distingue frío, pH favorable y calor extremo en 18 condiciones',()=>{
 for(const enzyme of ['A','B'])for(const temperature of ['fria','moderada','extrema'])for(const ph of ['acido','neutro','basico']){
  const r=enzymeActivity({enzyme,temperature,ph});
  assert.equal(r.level,temperature==='extrema'?'inactiva':temperature==='moderada'&&ph===(enzyme==='A'?'neutro':'acido')?'alta':'lenta');
  assert.equal(r.damaged,temperature==='extrema');
 }
 assert.deepEqual(experiments.map(e=>enzymeActivity(e).level),['lenta','alta','inactiva','lenta','alta']);
 assert.throws(()=>enzymeActivity({enzyme:'C',temperature:'moderada',ph:'neutro'}),RangeError);
});
test('Enfriar no repara una muestra desnaturalizada; una muestra nueva sí recupera la condición inicial',()=>{
 const heated=enzymeActivity({enzyme:'A',temperature:'extrema',ph:'neutro'});
 const cooled=enzymeActivity({enzyme:'A',temperature:'moderada',ph:'neutro',damaged:heated.damaged});
 assert.equal(cooled.level,'inactiva');assert.equal(cooled.damaged,true);
 const fresh=enzymeActivity({enzyme:'A',temperature:'moderada',ph:'neutro',damaged:false});assert.equal(fresh.level,'alta');
 const cold=enzymeActivity({enzyme:'A',temperature:'fria',ph:'neutro'});assert.equal(cold.damaged,false);
 assert.equal(enzymeActivity({enzyme:'A',temperature:'moderada',ph:'neutro',damaged:cold.damaged}).level,'alta');
});
test('Cada enzima tiene una pareja válida entre nueve combinaciones; admite vacíos y correcciones',()=>{
 for(const e of enzymes){let successes=0;for(const [s] of substrates)for(const [p] of products)if(gradeEnzyme(e,{substrate:s,product:p}).correct===2)successes++;
  assert.equal(successes,1);assert.deepEqual(gradeEnzyme(e,{}).missing,['substrate','product']);
  assert.equal(gradeEnzyme(e,{substrate:e.substrate}).correct,1);assert.equal(gradeEnzyme(e,{substrate:e.substrate,product:e.product}).wrong.length,0);
 }
});
test('Retos completos, sin IDs repetidos, con respuestas válidas y explicaciones',()=>{
 assert.equal(routeCases.length,10);assert.equal(energyCases.length,8);assert.equal(enzymes.length,3);assert.equal(experiments.length,5);
 for(const cases of [routeCases,energyCases]){assert.equal(new Set(cases.map(c=>c.id)).size,cases.length);cases.forEach(c=>assert.ok(c.why.length>50));}
 assert.ok(routeCases.every(c=>['anabolismo','catabolismo'].includes(c.answer)));
 for(const o of energyOptions)assert.equal(energyCases.filter(c=>c.answer===o.id).length,2);
});
test('HTML conserva anclajes únicos y todos los destinos internos',()=>{
 const html=read('index.html'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),id);
 for(const id of ['taller-rutas','taller-atp','taller-enzimas','taller-condiciones','taller-energia'])assert.ok(ids.includes(id));
});
test('Banco de 48 preguntas y copia docente sincronizados; rondas y práctica de errores independientes',()=>{
 assert.equal(bank.length,48);assert.equal(categories.length,8);assert.equal(new Set(bank.map(q=>q.prompt)).size,48);const teacher=read('preguntas.md');
 for(const cat of categories)assert.equal(bank.filter(q=>q.categoryId===cat.id).length,6);
 for(const q of bank){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.ok(teacher.includes(q.prompt));assert.ok(teacher.includes(q.explanation));}
 const gen=createRoundGenerator(bank,categories),seen=new Set();for(const count of [1,2,1,2])for(const q of gen(count)){assert.ok(!seen.has(q.id));seen.add(q.id);}assert.equal(seen.size,48);
 const state=createQuizState(gen(1),categories);for(let i=0;i<8;i++){const q=state.round[i];answerQuestion(state,i===0?q.choices.find(c=>c.id!==q.correctId).id:q.correctId);nextQuestion(state);}assert.equal(scoreQuiz(state).correct,7);
 const errors=createErrorRound(state);assert.equal(errors.length,1);const review=createQuizState(errors,categories);answerQuestion(review,errors[0].correctId);nextQuestion(review);assert.equal(scoreQuiz(review).correct,1);assert.equal(scoreQuiz(state).correct,7);
});
