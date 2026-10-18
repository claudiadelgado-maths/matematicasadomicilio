import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stages,expectedOrder,initialOrder,gradeOrder,missions,statements} from './modelo.mjs';
import {bank,categories} from './banco-preguntas.mjs';
import {createRoundGenerator,createQuizState,answerQuestion,nextQuestion,scoreQuiz,createErrorRound} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
test('Orden: vacíos, duplicados y todas las permutaciones; una sola ruta válida',()=>{
 assert.equal(gradeOrder([]).missing.length,4);
 assert.equal(gradeOrder(['glucolisis','glucolisis','krebs','cadena']).duplicate,true);
 const permutations=a=>a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>i!==j)).map(rest=>[x,...rest])):[[]];
 const orders=permutations(expectedOrder);assert.equal(orders.length,24);
 assert.equal(orders.filter(a=>gradeOrder(a).complete).length,1);
 assert.equal(gradeOrder(expectedOrder).complete,true);assert.equal(gradeOrder(initialOrder).complete,false);
 assert.equal(gradeOrder(['glucolisis','piruvato','cadena','krebs']).correct.filter(Boolean).length,2);
});
test('Etapas, dieciséis casos y ocho afirmaciones tienen opciones, claves y explicaciones válidas',()=>{
 assert.equal(stages.length,4);assert.equal(missions.length,16);assert.equal(statements.length,8);
 for(const set of [stages,missions,statements])assert.equal(new Set(set.map(x=>x.id)).size,set.length);
 for(const q of [...missions,...statements]){assert.ok(q.why.length>50);assert.equal(q.options.filter(([id])=>id===q.answer).length,1);assert.equal(new Set(q.options.map(([id])=>id)).size,q.options.length);}
 assert.equal(statements.filter(q=>q.answer==='verdadero').length,4);
 assert.equal(stages[0].place,'Citosol');assert.equal(stages[3].place,'Membrana interna mitocondrial');
});
test('SVG compartido con portada, copia del mapa y anclajes íntegros',()=>{
 const html=read('index.html'),svg=read('recursos/mitocondria.svg'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(html.toLowerCase().startsWith('<!doctype html>'));assert.ok(html.includes('<meta charset="utf-8">'));
 assert.ok(html.includes('src="script.mjs"'));assert.ok(html.includes('href="estilos.css"'));assert.ok(html.includes('class="bio4 biology-site respiration-page"'));
 assert.equal(new Set(ids).size,ids.length);assert.ok(html.includes(svg));
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),id);
 for(const stage of stages)assert.ok(svg.includes(`data-region="${stage.id}"`));
});
test('Banco y copia docente: 48 preguntas únicas, ocho temas equilibrados y claves válidas',()=>{
 assert.equal(bank.length,48);assert.equal(categories.length,8);assert.equal(new Set(bank.map(q=>q.prompt)).size,48);assert.equal(new Set(bank.map(q=>q.id)).size,48);
 const teacher=read('preguntas.md');
 for(const cat of categories)assert.equal(bank.filter(q=>q.categoryId===cat.id).length,6);
 for(const q of bank){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.text)).size,3);assert.equal(q.choices.filter(c=>c.id===q.correctId).length,1);assert.ok(teacher.includes(q.prompt));assert.ok(teacher.includes(q.explanation));for(const c of q.choices)assert.ok(teacher.includes(c.text));}
});
test('Rondas 8/16 sin repetir hasta agotar banco; el repaso no cambia la calificación original',()=>{
 const generator=createRoundGenerator(bank,categories),seen=new Set();
 for(const count of [1,2,1,2]){const round=generator(count);assert.equal(round.length,count*8);for(const q of round){assert.ok(!seen.has(q.id));seen.add(q.id);}}
 assert.equal(seen.size,48);const state=createQuizState(generator(1),categories);
 for(let i=0;i<8;i++){const q=state.round[i];answerQuestion(state,i===0?q.choices.find(c=>c.id!==q.correctId).id:q.correctId);nextQuestion(state);}
 assert.equal(scoreQuiz(state).correct,7);const errors=createErrorRound(state);assert.equal(errors.length,1);
 const review=createQuizState(errors,categories);answerQuestion(review,errors[0].correctId);nextQuestion(review);assert.equal(scoreQuiz(review).correct,1);assert.equal(scoreQuiz(state).correct,7);
});
