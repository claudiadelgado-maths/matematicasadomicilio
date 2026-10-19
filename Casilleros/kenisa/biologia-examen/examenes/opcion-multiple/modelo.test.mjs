import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {bank,topics} from './banco.mjs';
import {drawFigure} from './figuras.mjs';
import {createState,startRound,currentQuestion,remaining,submitAnswer,advance,closeRound,newCycle,summarize,restoreState} from './modelo.mjs';
const rng=()=>{let n=983;return()=>{n=(n*16807)%2147483647;return n/2147483647;};};
function complete(state,seen){while(!state.attempt.finished){const q=currentQuestion(state,bank);if(seen){assert.ok(!seen.has(q.id),q.id);seen.add(q.id);}state=submitAnswer(state,bank,q.correctId);state=advance(state);}return state;}
test('Banco completo: 690 preguntas, quince actividades, claves e IDs únicos y guías reales',()=>{
 assert.equal(bank.length,690);assert.equal(topics.length,15);assert.equal(new Set(bank.map(q=>q.id)).size,690);
 assert.deepEqual([1,2,3,4].map(n=>bank.filter(q=>q.part===n).length),[228,70,188,204]);
 for(const t of topics)assert.equal(bank.filter(q=>q.topicId===t.id).length,t.count);
 for(const q of bank){assert.ok(q.prompt&&q.explanation);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.equal(new Set(q.choices.map(c=>c.id)).size,q.choices.length);
  const url=new URL(q.guide,import.meta.url),hash=url.hash.slice(1);url.hash='';assert.ok(existsSync(url),q.guide);if(hash)assert.ok(readFileSync(url,'utf8').includes(`id="${hash}"`),q.guide);
 }
 const meta=JSON.parse(readFileSync(new URL('examen.json',import.meta.url),'utf8'));assert.equal(meta.preguntas,bank.length);assert.equal(meta.temas,topics.length);
});
test('Las nueve preguntas visuales usan su proceso correcto y conservan dibujos',()=>{
 const questions=bank.filter(q=>q.figure);assert.equal(questions.length,9);
 for(const q of questions){const svg=drawFigure(q.figure);assert.ok(svg.includes('<svg'));assert.ok(svg.includes('viewBox='));assert.ok(svg.includes('aria-label='));}
 assert.equal(bank.find(q=>q.id==='mitosis/metafase').figure.type,'mitosis');assert.equal(bank.find(q=>q.id==='mitosis/metafase').figure.phase,2);
});
test('Todo aleatorio agota las 690 sin repetir entre rondas y permite repetir solo después',()=>{
 let state=createState();const random=rng(),seen=new Set();assert.equal(newCycle(state,bank),null);
 while(remaining(bank,state).length){state=startRound(state,bank,topics,{mode:'aleatorio',length:20},random);state=complete(state,seen);}
 assert.equal(seen.size,690);assert.equal(startRound(state,bank,topics,{mode:'aleatorio'}),null);state=newCycle(state,bank);assert.equal(state.cycle,2);assert.equal(remaining(bank,state).length,690);
});
test('Por tema: todas las preguntas de cada actividad, con historial común y sin reinicio prematuro',()=>{
 let state=createState();const seen=new Set(),random=rng();
 for(const topic of topics){state=startRound(state,bank,topics,{mode:'tema',topicId:topic.id,length:'todas'},random);assert.equal(state.attempt.ids.length,topic.count);assert.ok(state.attempt.ids.every(id=>bank.find(q=>q.id===id).topicId===topic.id));state=complete(state,seen);assert.equal(startRound(state,bank,topics,{mode:'tema',topicId:topic.id}),null);}
 assert.equal(seen.size,690);
});
test('Una de cada actividad cubre bancos desiguales completos y omite los agotados',()=>{
 let state=createState();const seen=new Set(),random=rng();let rounds=0;
 while(remaining(bank,state).length){const active=topics.filter(t=>remaining(bank,state,t.id).length);state=startRound(state,bank,topics,{mode:'cada'},random);assert.equal(state.attempt.ids.length,active.length);assert.equal(new Set(state.attempt.ids.map(id=>bank.find(q=>q.id===id).topicId)).size,active.length);state=complete(state,seen);rounds++;}
 assert.equal(seen.size,690);assert.equal(rounds,105);
});
test('Cambiar de modo nunca reinicia el historial ni reserva preguntas no mostradas',()=>{
 const random=rng();let state=startRound(createState(),bank,topics,{mode:'tema',topicId:'adn',length:'todas'},random);state=complete(state);
 assert.equal(newCycle(state,bank),null);state=startRound(state,bank,topics,{mode:'cada'},random);assert.equal(state.attempt.ids.length,14);assert.ok(state.attempt.ids.every(id=>!id.startsWith('adn/')));
 const q=currentQuestion(state,bank);assert.equal(closeRound(state),null);assert.equal(advance(state),null);assert.equal(submitAnswer(state,bank,'inexistente'),null);
 state=submitAnswer(state,bank,q.choices.find(c=>c.id!==q.correctId).id);assert.equal(submitAnswer(state,bank,q.correctId),null);state=closeRound(state);
 const score=summarize(state.attempt,bank,topics);assert.equal(score.total,1);assert.equal(score.correct,0);assert.equal(state.seen.length,15);assert.equal(remaining(bank,state).length,675);
 state=startRound(state,bank,topics,{mode:'aleatorio',length:'todas'},random);assert.equal(state.attempt.ids.length,675);assert.ok(state.attempt.ids.every(id=>!state.seen.includes(id)));
});
test('Restaurar una ronda conserva pregunta, opciones, respuestas y nota sin doble puntuación',()=>{
 let state=startRound(createState(),bank,topics,{mode:'aleatorio',length:10},rng());
 assert.deepEqual(restoreState(JSON.parse(JSON.stringify(state)),bank,topics),state);
 const q=currentQuestion(state,bank);state=submitAnswer(state,bank,q.correctId);const restored=restoreState(JSON.parse(JSON.stringify(state)),bank,topics);assert.deepEqual(restored,state);assert.equal(submitAnswer(restored,bank,q.correctId),null);
 state=complete(advance(state));assert.deepEqual(restoreState(state,bank,topics),state);assert.equal(summarize(state.attempt,bank,topics).percent,100);
});
test('Datos inválidos no borran IDs válidos; entradas y rondas activas se validan',()=>{
 const id=bank[0].id,state=restoreState({schema:1,cycle:-1,seen:[id,id,'desconocido'],attempt:{ids:['desconocido']}},bank,topics);assert.deepEqual(state.seen,[id]);assert.equal(state.attempt,null);assert.equal(state.cycle,1);
 assert.deepEqual(restoreState(null,bank,topics),createState());assert.throws(()=>startRound(state,bank,topics,{mode:'tema',topicId:'inexistente'}),RangeError);assert.throws(()=>startRound(state,bank,topics,{mode:'aleatorio',length:0}),RangeError);
 const active=startRound(state,bank,topics,{mode:'cada'},rng());assert.throws(()=>startRound(active,bank,topics,{mode:'aleatorio'}));
 const corrupt=JSON.parse(JSON.stringify(active));corrupt.attempt.records=[{id:corrupt.attempt.ids[0],choiceId:'inexistente'}];assert.equal(restoreState(corrupt,bank,topics).attempt,null);
});
