import assert from 'node:assert/strict';
import {defaults,experiments,measurement} from './comparaciones.mjs';
const ratioByAnswer={'Se duplica.':2,'Se cuadruplica.':4,'Se reduce a la mitad.':.5,'Se reduce a la cuarta parte.':.25,'Permanece igual.':1,'Se vuelve cero.':0};
let count=0;
for(const [topic,list] of Object.entries(experiments)){
 const before=measurement(topic,defaults[topic]);
 for(const ex of list){
  const after=measurement(topic,{...defaults[topic],...ex.change});
  assert.ok(Math.abs(after.value/before.value-ratioByAnswer[ex.answer])<1e-10,`${topic}: ${ex.title}`);
  assert.equal(after.unit,before.unit);
  assert.equal(Object.keys(ex.change).length,1,'Each comparison changes exactly one control.');
  assert.ok(ex.explanation.length>80);
  count++;
 }
}
assert.equal(count,20);
assert.equal(measurement('potencia',{voltage:12,resistance:6}).value*60,1440);
assert.equal(measurement('joule',{current:0,resistance:5}).value*60,0);
assert.equal(measurement('coulomb',defaults.coulomb).value,720);
console.log(`${count} comparaciones: relaciones, unidades y energía verificadas.`);
