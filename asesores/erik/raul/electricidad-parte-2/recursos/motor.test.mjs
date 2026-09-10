import assert from 'node:assert/strict';
import {numeric,coulomb,wire,parse,close,units,relation} from './motor.mjs';
import {questions} from './preguntas.mjs';
assert(close(coulomb(-16e-6,18e-6,.06),720));
assert(close(coulomb(2e-6,3e-6,.2),coulomb(2e-6,3e-6,.1)/4));
assert(close(wire(1.72e-8,20,.001).R,2*wire(1.72e-8,10,.001).R));
assert(close(wire(1.72e-8,10,.002).R,wire(1.72e-8,10,.001).R/4));
assert.equal(relation(-1,-2),'Repulsión');assert.equal(relation(-1,2),'Atracción');
assert.equal(parse(' 2,5e-6 '),2.5e-6);assert(Number.isNaN(parse('2/3')));assert(Number.isNaN(parse('Infinity')));
let count=0;
for(const topic of ['coulomb','corriente','voltaje','resistencia','ohm','potencia','joule']){
 const targets=new Set();
 for(let i=0;i<700;i++){
  const r=numeric(topic),d=Object.fromEntries(r.data.map(d=>[d.symbol,d.si]));let expected;
  for(const x of r.data)assert(close(x.si,x.value*units[x.unit][1],1e-12));
  if(topic==='coulomb')expected=9e9*Math.abs(d.q_1*d.q_2)/d.r**2;
  if(topic==='corriente')expected=r.target==='I'?d.q/d.t:r.target==='q'?d.I*d.t:d.q/d.I;
  if(topic==='voltaje')expected=r.target==='V'?d.E/d.q:d.V*d.q;
  if(topic==='resistencia')expected=d['\\rho']*d.L/(d.A??Math.PI*(d.d/2)**2);
  if(topic==='ohm')expected=r.target==='I'?d.V/d.R:r.target==='V'?d.I*d.R:d.V/d.I;
  if(topic==='potencia'||topic==='joule')expected=d.V!==undefined&&d.I!==undefined?d.V*d.I:d.I!==undefined?d.I**2*d.R:d.V**2/d.R;
  assert(close(r.answer,expected,1e-10),topic);assert(r.answer>0&&Number.isFinite(r.answer));assert.equal(new Set(r.options).size,3);assert(r.options.includes(r.rearranged));assert(r.formula&&r.interpretation&&r.unit);targets.add(r.target);count++;
 }
 if(topic==='ohm'||topic==='corriente')assert.equal(targets.size,3);
}
assert(questions.filter(q=>q.topic!=='repaso').length>=30);assert.equal(new Set(questions.map(q=>q.question)).size,questions.length);
for(const q of questions){assert.equal(new Set(q.options).size,3);assert(q.options.includes(q.answer));assert(q.explanation.length>50);}
console.log(`${count} problemas, ${questions.length} preguntas, conversiones SI, despejes, Coulomb y geometría de cables comprobados.`);
