import test from 'node:test';
import assert from 'node:assert/strict';
import {multiply,products,reduce,treeExercise,monomialExercise,cardsExercise,reviewExercise,sequenceExercise,randomProduct,polynomial} from './motor.mjs';
const value=(terms,x)=>terms.reduce((sum,t)=>sum+t.c*Object.values(t.base).reduce((v,e)=>v*x**e,1),0);
test('Producto estructurado: coeficientes, exponentes, letras exclusivas y cancelación',()=>{
  assert.deepEqual(multiply({c:-4,base:{x:3,y:2}},{c:7,base:{x:5,z:1}}),{c:-28,base:{x:8,y:2,z:1}});
  assert.equal(polynomial(reduce([{c:4,base:{x:2}},{c:-4,base:{x:2}}])),'0');
  assert.equal(polynomial(reduce([{c:1,base:{x:2,y:1}},{c:2,base:{y:1,x:2}}])),'3x^{2}y');
});
test('Miles de variantes: productos equivalentes, opciones únicas y proporciones correctas',()=>{
  const sizes=new Set();
  for(let n=0;n<2000;n++){
    const ex=randomProduct();sizes.add(`${ex.left.length},${ex.right.length}`);
    assert.equal(ex.steps.length,ex.wrong.length);
    for(const x of [-2,0,1,3])assert.equal(value(reduce(products(ex.left,ex.right)),x),value(ex.left,x)*value(ex.right,x)||0);
    ex.steps.forEach((step,i)=>assert.notEqual(step.latex,ex.wrong[i].latex));
    const mono=monomialExercise();assert(mono.result.c>=-10000&&mono.result.c<=10000);
    Object.keys(mono.result.base).forEach(l=>assert.equal(mono.result.base[l],(mono.left.base[l]||0)+(mono.right.base[l]||0)));
    Object.values(mono.left.base).concat(Object.values(mono.right.base)).forEach(e=>assert(e>=1&&e<=20));
    const tree=treeExercise();assert.equal(tree.branches.filter(b=>b.correct).length,1);assert(tree.right.length>=2&&tree.right.length<=4);assert.deepEqual(tree.left[0].base,{});
    tree.branches.forEach(b=>{assert.equal(new Set(b.options.map(o=>o.latex)).size,2);assert.equal(b.options.filter(o=>o.correct).length,1);});
    const cards=cardsExercise();assert.equal(new Set(cards.cards.map(c=>c.latex)).size,6);assert.equal(cards.cards.filter(c=>c.kind).length,2);
    const review=reviewExercise();assert(review.rows.some(r=>r.correct));assert(review.rows.some(r=>!r.correct));
    const sequence=sequenceExercise();sequence.questions.forEach(q=>{assert.equal(q.options.length,2);assert.equal(new Set(q.options.map(o=>o.latex)).size,2);assert.equal(q.options.filter(o=>o.correct).length,1);});
  }
  assert.equal(sizes.size,9);
});
