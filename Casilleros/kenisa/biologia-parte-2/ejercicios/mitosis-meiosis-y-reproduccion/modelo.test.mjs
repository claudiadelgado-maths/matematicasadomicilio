import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {cycleCards,comparisons,fertilization,situations,questions} from './datos.mjs';
import {createCycle,createAttempt,shuffled} from './modelo.mjs';
import {fertilizationMarkup} from './escena.mjs';

test('El ciclo rechaza saltos, duplicados y valores ajenos; permite deshacer y reiniciar',()=>{
  const cycle=createCycle();
  assert.equal(cycle.choose('cigoto'),false);assert.equal(cycle.choose(undefined),false);
  assert.equal(cycle.undo(),undefined);assert.equal(cycle.count,0);
  for(const card of cycleCards){assert.equal(cycle.choose(card.id),true);assert.equal(cycle.choose(card.id),false);}
  assert.equal(cycle.complete,true);assert.equal(cycle.choose('mitosis'),false);
  assert.equal(cycle.undo(),'mitosis');assert.equal(cycle.complete,false);assert.equal(cycle.count,5);
  assert.equal(cycle.choose('mitosis'),true);assert.equal(createCycle().count,0);
  assert.deepEqual(shuffled(cycleCards,()=>.1).map(c=>c.id).sort(),cycleCards.map(c=>c.id).sort());
});
test('La práctica cubre conservar, reducir y reunir sin confundir homólogos con hermanas',()=>{
  assert.equal(situations.length,8);
  assert.deepEqual([...new Set(situations.map(s=>s.answer))].sort(),['fecundacion','meiosis','mitosis']);
  assert.equal(situations.find(s=>s.prompt.includes('homólogos')).answer,'meiosis');
  assert.match(situations.find(s=>s.prompt.includes('homólogos')).why,/Anafase I/);
});
test('El integrador tiene 22 preguntas, cuatro dibujos y destinos reales para revisar errores',async()=>{
  const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
  assert.equal(questions.length,22);assert.equal(new Set(questions.map(q=>q.prompt)).size,22);
  assert.deepEqual(questions.filter(q=>q.visual).map(q=>q.visual),['mitosis','meiosis','gametos','cigoto']);
  for(const q of questions){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);assert.ok(q.explanation.length>40);assert.ok(html.includes(`id="${q.section}"`));}
});
test('Puntuación extrema y primera confirmación: no se ganan puntos por doble envío',()=>{
  for(const correct of [true,false]){
    const attempt=createAttempt(questions);
    questions.forEach((q,i)=>{assert.equal(attempt.submit(i,correct?q.answer:(q.answer+1)%3),true);assert.equal(attempt.submit(i,q.answer),false);});
    assert.equal(attempt.complete,true);assert.equal(attempt.score,correct?22:0);assert.equal(attempt.mistakes.length,correct?0:22);
  }
  assert.equal(createAttempt(questions).complete,false);
});
test('La comparación conserva el resultado mitótico y muestra las dos divisiones meióticas',()=>{
  assert.deepEqual(comparisons.map(c=>c.mitosis.phase),[0,5,5]);
  assert.deepEqual(comparisons.map(c=>c.meiosis.phase),[0,4,8]);
  assert.match(comparisons[1].meiosis.count,/n = 2/);assert.match(comparisons[1].meiosis.note,/duplicados/);
});
test('El esquema humano conserva los dos aportes y duplica el ADN antes del primer reparto',()=>{
  const copies=step=>(fertilizationMarkup(step).match(/q-4 4 0 8t0 8/g)||[]).length;
  assert.equal(copies(0),46);assert.equal(copies(1),46);assert.equal(copies(2),92);
  assert.match(fertilization[2].text,/Antes de cada mitosis se replica el ADN/);
  for(let step=0;step<3;step++){const svg=fertilizationMarkup(step);assert.match(svg,/role="img" aria-label=/);assert.doesNotMatch(svg,/NaN|undefined/);}
  assert.throws(()=>fertilizationMarkup(3),RangeError);
});
