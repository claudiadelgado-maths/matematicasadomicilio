import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bank,topics,STORAGE_KEY} from './banco.mjs';
import {drawFigure} from './figuras.mjs';
import {STORAGE_KEY as firstKey} from '../opcion-multiple/modelo.mjs';
import {bank as firstBank,topics as firstTopics} from '../opcion-multiple/banco.mjs';
import {createState,startRound,remaining,currentQuestion,submitAnswer,advance,newCycle,closeRound,summarize,restoreState} from '../../recursos/modelo.mjs';
const random=()=>{let n=7927;return()=>{n=(n*16807)%2147483647;return n/2147483647;};};
function complete(state,seen){while(!state.attempt.finished){const q=currentQuestion(state,bank);assert.ok(!seen.has(q.id),q.id);seen.add(q.id);state=advance(submitAnswer(state,bank,q.correctId));}return state;}

test('300 reactivos únicos, 54 verdadero/falso y distribución proporcional al contenido',()=>{
 assert.equal(bank.length,300);assert.equal(topics.length,11);
 assert.deepEqual(topics.map(t=>t.count),[14,12,28,12,10,26,40,54,28,34,42]);
 assert.equal(new Set(bank.map(q=>q.id)).size,300);assert.equal(new Set(bank.map(q=>q.prompt)).size,300);
 assert.equal(bank.filter(q=>q.kind==='Verdadero o falso').length,54);
 for(const q of bank){assert.ok(q.prompt&&q.explanation&&q.covers.length);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.equal(new Set(q.choices.map(c=>c.text)).size,q.choices.length);assert.equal(q.choices.length,q.kind==='Verdadero o falso'?2:4);}
 const meta=JSON.parse(readFileSync(new URL('examen.json',import.meta.url),'utf8'));assert.equal(meta.preguntas,300);assert.equal(meta.temas,11);
});

test('Los 147 descriptores del temario están cubiertos, con una sola pregunta sobre Hooke',()=>{
 const html=readFileSync(new URL('index.html',import.meta.url),'utf8');
 assert.equal(topics.reduce((n,t)=>n+t.coverage.length,0),147);
 for(const t of topics){const questions=bank.filter(q=>q.topicId===t.id);assert.equal(questions.length,t.expected);assert.ok(html.includes(`id="temario-${t.id}"`));assert.ok(html.includes(`${t.title} · ${t.count} preguntas`));
  for(const c of t.coverage){assert.ok(questions.some(q=>q.covers.includes(c.id)),`${t.id}: ${c.id}`);assert.ok(html.includes(c.label),c.label);}
  for(const q of questions)for(const id of q.covers)assert.ok(t.coverage.some(c=>c.id===id),`${q.id}: ${id}`);
 }
 assert.equal(bank.filter(q=>q.covers.includes('hooke')).length,1);
});

test('Doce preguntas visuales y cinco tipos de esquema accesibles, sin IDs SVG repetidos',()=>{
 const visual=bank.filter(q=>q.figure);assert.equal(visual.length,12);assert.equal(new Set(visual.map(q=>q.figure.type)).size,5);
 for(const q of visual){const svg=drawFigure(q.figure);assert.ok(svg.includes('viewBox="0 0 640 360"'));assert.ok(svg.includes('role="img"'));assert.ok(svg.includes('aria-label="'));assert.ok(!svg.includes('undefined'));assert.ok(!svg.includes(' id='));}
});

for(const mode of ['aleatorio','tema','cada'])test(`${mode}: recorre las 300 una sola vez antes de habilitar otra vuelta`,()=>{
 let state=createState(),rounds=0;const seen=new Set(),rng=random();
 while(remaining(bank,state).length){const active=topics.filter(t=>remaining(bank,state,t.id).length);state=startRound(state,bank,topics,{mode,topicId:active[0].id,length:mode==='tema'?'todas':20},rng);
  if(mode==='cada'){assert.equal(state.attempt.ids.length,active.length);assert.equal(new Set(state.attempt.ids.map(id=>bank.find(q=>q.id===id).topicId)).size,active.length);}
  state=complete(state,seen);rounds++;if(seen.size<300)assert.equal(newCycle(state,bank),null);
 }
 assert.equal(seen.size,300);if(mode==='cada')assert.equal(rounds,54);if(mode==='tema')assert.equal(rounds,11);
 assert.equal(startRound(state,bank,topics,{mode:'aleatorio'}),null);state=newCycle(state,bank);assert.equal(state.cycle,2);assert.equal(remaining(bank,state).length,300);
});

test('Historial cruzado, cierre parcial y persistencia de una respuesta V/F',()=>{
 let state=startRound(createState(),bank,topics,{mode:'tema',topicId:'irritabilidad',length:'todas'},random());const seen=new Set();state=complete(state,seen);
 assert.equal(startRound(state,bank,topics,{mode:'tema',topicId:'irritabilidad'}),null);
 state=startRound(state,bank,topics,{mode:'cada'},random());assert.equal(state.attempt.ids.length,10);assert.ok(state.attempt.ids.every(id=>!seen.has(id)));
 const q=currentQuestion(state,bank);state=closeRound(submitAnswer(state,bank,q.correctId));assert.equal(state.seen.length,11);assert.equal(summarize(state.attempt,bank,topics).percent,100);
 assert.deepEqual(restoreState(JSON.parse(JSON.stringify(state)),bank,topics),state);
 const vf=bank.find(q=>q.kind==='Verdadero o falso');const onlyVF=[vf],onlyTopics=topics.filter(t=>t.id===vf.topicId);
 let single=startRound(createState(),onlyVF,onlyTopics,{mode:'aleatorio'},random());single=submitAnswer(single,onlyVF,vf.correctId==='v'?'f':'v');assert.equal(submitAnswer(single,onlyVF,vf.correctId),null);
 single=advance(restoreState(JSON.parse(JSON.stringify(single)),onlyVF,onlyTopics));assert.equal(summarize(single.attempt,onlyVF,onlyTopics).percent,0);
});

test('Ambos exámenes mantienen identidad, opciones e historiales independientes',()=>{
 assert.notEqual(STORAGE_KEY,firstKey);
 const first=startRound(createState(),firstBank,firstTopics,{mode:'aleatorio',length:10},random());const snapshot=JSON.stringify(first);
 let second=startRound(createState(),bank,topics,{mode:'aleatorio',length:10},random());second=complete(second,new Set());
 assert.equal(JSON.stringify(first),snapshot);assert.equal(second.seen.length,10);assert.deepEqual(restoreState(JSON.parse(snapshot),firstBank,firstTopics),first);
});

test('Las 100 preguntas añadidas incluyen una idea para recordar y respetan las claves anteriores',()=>{
 const added=bank.filter(q=>q.takeaway),original=bank.filter(q=>!q.takeaway);
 assert.equal(added.length,100);assert.equal(original.length,200);
 for(const q of added){assert.ok(q.takeaway.length>25&&q.takeaway.length<240,q.id);assert.notEqual(q.takeaway,q.explanation);}
 assert.equal(added.filter(q=>q.kind==='Verdadero o falso').length,20);
});

test('Una ronda guardada con el banco de 200 se conserva al ampliarlo; después quedan las 100 nuevas',()=>{
 const original=bank.filter(q=>!q.takeaway),rng=random();
 let old=startRound(createState(),original,topics,{mode:'aleatorio',length:10},rng);
 const q=currentQuestion(old,original);old=submitAnswer(old,original,q.correctId);
 const restored=restoreState(JSON.parse(JSON.stringify(old)),bank,topics);
 assert.deepEqual(restored,old);assert.equal(currentQuestion(restored,bank).id,q.id);assert.equal(submitAnswer(restored,bank,q.correctId),null);
 let full=startRound(createState(),original,topics,{mode:'aleatorio',length:'todas'},rng);
 while(!full.attempt.finished){const item=currentQuestion(full,original);full=advance(submitAnswer(full,original,item.correctId));}
 full=restoreState(JSON.parse(JSON.stringify(full)),bank,topics);
 assert.equal(full.seen.length,200);assert.equal(summarize(full.attempt,bank,topics).percent,100);
 assert.equal(remaining(bank,full).length,100);assert.ok(remaining(bank,full).every(item=>item.takeaway));
 assert.equal(newCycle(full,bank),null);
 full=startRound(full,bank,topics,{mode:'aleatorio',length:'todas'},rng);
 assert.equal(full.attempt.ids.length,100);full=complete(full,new Set(full.seen));
 assert.equal(full.seen.length,300);assert.equal(newCycle(full,bank).cycle,2);
});
