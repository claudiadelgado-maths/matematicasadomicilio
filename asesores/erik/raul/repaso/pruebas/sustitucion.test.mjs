import assert from 'node:assert/strict';
import {generate,evaluate,steps,tex,num,operation,variable,substitute,readNumber,decimal} from '../recursos/sustitucion/motor.mjs';
import {equal,gcd} from '../recursos/motor.mjs';
const lessons=['sustitucion','construir-sustitucion','negativos','variable-repetida','varias-variables','sustitucion-fracciones','decimales','exponentes','formulas','orden','errores','reto-sustitucion'];
let count=0;
for(const lesson of lessons)for(let round=1;round<=500;round++){
 const c=generate(lesson,round),answer=evaluate(c.tree,c.values),chain=steps(c.tree,c.values);
 assert.ok(answer.every(Number.isSafeInteger));assert.ok(answer[1]>0);assert.equal(gcd(...answer),1);assert.ok(Math.abs(answer[0]/answer[1])<1000);
 assert.ok(chain.length>1&&chain.length<15);assert.equal(chain.at(-1).kind,'num');
 for(const t of chain){assert.ok(equal(evaluate(t),answer));assert.ok(!/[xyzabchqt]/.test(tex(t,c.family).replaceAll('frac','').replaceAll('left','').replaceAll('right','').replaceAll('cdot','')));}
 if(c.family==='decimal'){assert.ok(equal(readNumber(decimal(answer)),answer));assert.ok(!tex(chain[0],c.family).includes('frac'));}
 if(c.family==='fraction')assert.ok(!tex(chain[0],c.family).includes('.'));
 count++;
}
assert.deepEqual(readNumber('-0,25'),[-1,4]);assert.equal(readNumber('2abc'),null);assert.equal(readNumber(''),null);assert.equal(readNumber('1e3'),null);
assert.equal(decimal([3,10]),'0.3');assert.deepEqual(evaluate(operation('^',num(-3),num(2))),[9,1]);assert.deepEqual(evaluate(operation('^',num(-2),num(3))),[-8,1]);
assert.throws(()=>evaluate(operation('÷',num(1),num(0))));
assert.equal(tex(substitute(operation('^',variable('x'),num(2)),{x:[-3,1]})),'\\left(-3\\right)^{2}');
console.log(`${count} ejercicios generados: valores exactos, todas las transformaciones equivalentes, negativos, decimales y divisiones por cero comprobados.`);
