import test from 'node:test';
import assert from 'node:assert/strict';
import {generate,random,validate,Bank,variablesOf} from './generador.mjs';
import {r,eq,X,Y,ONE,plus,scale,times,constant,P,F,S,latex,equivalent,parse,evaluate} from './algebra.mjs';
import {probe} from './ayuda.mjs';
test('Las 42 estructuras generan preguntas válidas: identidad simbólica y cuatro opciones únicas',()=>{
  for(const family of ['A','B','C','D'])for(let variant=1;variant<=(family==='B'?12:10);variant++)for(let i=0;i<30;i++){
    const p=generate(random(variant*100+i),family,variant);assert.equal(validate(p),true);assert.equal(p.options.length,4);assert.ok(p.correctIndex>=0&&p.correctIndex<4);
    if(p.kind!=='system')for(const values of [[r(2),r(1)],[r(-2),r(3)]])try{const result=probe(p,values.slice(0,p.variables.length));assert.ok(result.matches.includes(p.correctIndex));}catch(e){assert.match(e.message,/denominador/);}
  }
});
test('La mezcla no repite familia consecutiva ni enunciados recientes',()=>{const bank=new Bank(4096);let last='',recent=[];const counts={};for(let i=0;i<200;i++){const p=bank.next();assert.notEqual(p.family,last);assert.ok(!recent.includes(p.fingerprint));last=p.family;recent.push(p.fingerprint);recent=recent.slice(-20);counts[p.family]=(counts[p.family]||0)+1;}assert.deepEqual(counts,{A:50,B:50,C:50,D:50});});
test('Coincidencia numérica no equivale a identidad: dos pruebas descartan opciones',()=>{
  const p={kind:'division',variables:['x','y'],D:plus(X,scale(Y,2)),Q:plus(X,scale(Y,2)),R:constant(0),asked:'quotient',options:[P(plus(X,Y)),P(plus(X,scale(Y,2))),P(plus(times(X,X),Y)),P(plus(scale(X,2),times(Y,Y)))]};p.dividend=times(p.D,p.Q);p.original=F(p.dividend,p.D);
  const a=probe(p,[r(1),r(1)]),b=probe(p,[r(2),r(1)]);assert.deepEqual(a.matches,[1,3]);assert.deepEqual(b.matches,[1]);assert.equal(a.collision,true);assert.throws(()=>probe(p,[r(-2),r(1)]),/denominador/);
  assert.ok(latex(p.original,p.variables,[r(-2),r(4)]).includes('\\left(-2\\right)^{2}'));
});
test('Opciones indefinidas se señalan sin rechazar una prueba válida para el original',()=>{
  const p={kind:'expression',variables:['x'],original:P(X),options:[P(X),F(ONE,X),P(plus(X,ONE)),P(scale(X,2))]};const result=probe(p,[r(0)]);assert.equal(result.options[1],null);assert.deepEqual(result.matches,[0,3]);
});
test('Equivalencias disfrazadas, cancelación y dominio original',()=>{
  assert.ok(equivalent(F(constant(-2),times(X,X)),F(constant(-4),scale(times(X,X),2))));
  const p={kind:'expression',variables:['x'],original:F(plus(X,ONE),plus(X,ONE)),options:[P(ONE),P(constant(2)),P(X),P(constant(3))]};assert.throws(()=>probe(p,[r(-1)]),/denominador/);
});
test('Sistemas: probar una pareja verifica ambas ecuaciones',()=>{const p=generate(random(77),'A',8);const result=probe(p,p.options[p.correctIndex]);assert.ok(result.equations.every(e=>e.match));const wrong=probe(p,p.options[(p.correctIndex+1)%4]);assert.ok(wrong.equations.some(e=>!e.match));});
test('Entradas exactas y errores de dominio',()=>{assert.ok(eq(parse('-0.25'),r(-1,4)));assert.ok(eq(parse('1/6'),r(1,6)));assert.throws(()=>parse('1/0'));assert.throws(()=>parse('x+1'));assert.throws(()=>parse('1e200'));});
test('Las variables que se cancelan siguen presentes para renderizar y sustituir el enunciado',()=>{
  const p={original:S([{sign:1,node:P(plus(X,Y))},{sign:-1,node:P(Y)}]),options:[P(X),P(ONE),P(constant(2)),P(constant(3))]};
  assert.deepEqual(variablesOf(p),['x','y']);
  for(let seed=0;seed<100;seed++){
    const q=generate(random(seed),'D',8);
    assert.deepEqual(q.variables.length,2);
    const source=latex(q.original,q.variables),substituted=latex(q.original,q.variables,[r(2),r(3)]);
    assert.ok(!source.includes('undefined'));assert.ok(!substituted.includes('undefined'));
    assert.ok(eq(evaluate(q.original,[r(0),r(3)]),evaluate(q.correct,[r(0),r(3)])));
  }
});
