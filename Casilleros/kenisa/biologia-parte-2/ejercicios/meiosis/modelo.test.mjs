import test from 'node:test';
import assert from 'node:assert/strict';
import { phases, separations, trail, questions } from './datos.mjs';
import { frameFor, sceneMarkup, crossoverMarkup } from './escena.mjs';
import { createTrail, createAttempt, shuffled } from './modelo.mjs';

test('Banco completo: nueve vistas, dos prácticas y 18 preguntas con tres imágenes',()=>{
  assert.equal(phases.length,9); assert.equal(separations.length,3); assert.equal(trail.length,5); assert.equal(questions.length,18);
  assert.equal(questions.filter(q=>q.phase!==undefined).length,3);
  assert.equal(new Set(questions.map(q=>q.prompt)).size,questions.length);
  for(const q of questions) {
    assert.equal(q.options.length,3); assert.equal(new Set(q.options).size,3);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
    assert.ok(q.explanation.length>40&&q.section);
    if(q.phase!==undefined) assert.ok(phases[q.phase]);
  }
  for(const step of trail) {assert.equal(step.options.length,3);assert.equal(new Set(step.options).size,3);assert.ok(step.options.includes(step.target));}
});

test('El recorrido no avanza con errores, sin resolver o con doble respuesta; se puede reiniciar',()=>{
  const path=createTrail(trail);
  for(let i=0;i<trail.length;i++) {
    assert.equal(path.index,i); assert.equal(path.next(),false);
    assert.equal(path.choose(-1),false); assert.equal(path.solved,false);
    assert.equal(path.choose(trail[i].target),true); assert.equal(path.choose(trail[i].target),false);
    assert.equal(path.next(),i<trail.length-1);
  }
  assert.equal(path.complete,true); assert.equal(createTrail(trail).complete,false);
  assert.deepEqual(shuffled([1,2,3],()=>0).sort(),[1,2,3]);
});

test('Se conservan ocho moléculas de ADN sin nueva replicación entre divisiones',()=>{
  for(let phase=0;phase<9;phase++) {
    const f=frameFor(phase);
    assert.equal(f.chromosomes.length,8);
    for(const c of f.chromosomes) for(const value of Object.values(c)) assert.ok(Number.isFinite(value));
    assert.equal(f.parent+f.two+f.four,1);
    assert.equal((sceneMarkup(phase).match(/data-dna=/g)||[]).length,8);
  }
  assert.throws(()=>frameFor(9),RangeError);
  assert.throws(()=>frameFor(1.5),RangeError);
});

test('En Meiosis I viajan homólogos completos a polos opuestos; cada célula recibe un largo y un corto duplicados',()=>{
  const f=frameFor(3).chromosomes;
  for(let h=0;h<4;h++) {
    assert.equal(f[h*2].poleX,f[h*2+1].poleX);
    assert.ok(Math.abs(f[h*2].x-f[h*2+1].x)<10);
  }
  for(let p=0;p<2;p++) assert.notEqual(f[p*4].poleX,f[p*4+2].poleX);
  const end=frameFor(4).chromosomes;
  for(const left of [true,false]) {
    const items=end.filter(c=>(c.x<400)===left);
    assert.equal(items.length,4);
    assert.deepEqual(items.map(c=>c.length).sort((a,b)=>a-b),[36,36,54,54]);
  }
});

test('En Meiosis II las hermanas viajan a polos opuestos y cada una de las cuatro células recibe un largo y un corto',()=>{
  const f=frameFor(7).chromosomes;
  for(let h=0;h<4;h++) {assert.equal(f[h*2].poleX,f[h*2+1].poleX);assert.notEqual(f[h*2].poleY,f[h*2+1].poleY);}
  const end=frameFor(8).chromosomes;
  for(const left of [true,false]) for(const top of [true,false]) {
    const items=end.filter(c=>(c.x<400)===left&&(c.y<290)===top);
    assert.equal(items.length,2); assert.deepEqual(items.map(c=>c.length).sort((a,b)=>a-b),[36,54]);
  }
});

test('El intercambio afecta a no hermanas del mismo par y persiste hasta el final',()=>{
  assert.ok(frameFor(0).chromosomes.every(c=>c.exchange===0));
  for(let phase=1;phase<9;phase++) {
    const changed=frameFor(phase).chromosomes.flatMap((c,i)=>c.exchange?[i]:[]);
    assert.deepEqual(changed,[1,2,5,6]);
  }
  assert.equal((crossoverMarkup(true).match(/data-dna=/g)||[]).length,4);
  assert.notEqual(crossoverMarkup(false),crossoverMarkup(true));
});

test('SVG válido para exportación y reutilización: atributos explícitos, descripción y geometría finita',()=>{
  for(const svg of [...phases.map((_,i)=>sceneMarkup(i)),crossoverMarkup(false),crossoverMarkup(true)]) {
    assert.match(svg,/xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.match(svg,/role="img" aria-label="[^"]+"/);
    assert.doesNotMatch(svg,/NaN|undefined|Infinity|\sid=/);
    assert.doesNotMatch(svg,/\sdata-[\w-]+(?=\s|>)/);
  }
});

test('Resultados extremos 0/18 y 18/18, primera respuesta única y reinicio limpio',()=>{
  const right=createAttempt(questions), wrong=createAttempt(questions);
  questions.forEach((q,i)=>{
    assert.equal(right.submit(i,q.answer),true); assert.equal(right.submit(i,(q.answer+1)%3),false);
    wrong.submit(i,(q.answer+1)%3);
  });
  assert.equal(right.score,18); assert.equal(right.complete,true); assert.equal(right.mistakes.length,0);
  assert.equal(wrong.score,0); assert.equal(wrong.mistakes.length,18);
  const fresh=createAttempt(questions); assert.equal(fresh.count,0); assert.equal(fresh.complete,false);
});
