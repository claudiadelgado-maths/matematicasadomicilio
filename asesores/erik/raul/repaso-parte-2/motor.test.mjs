import test from 'node:test';
import assert from 'node:assert/strict';
import {empty,apply,term,parse,rat,normalized,same,value,decimal,generate,find,checkResult,availability} from './motor.mjs';
import {formula,procedure} from './vista.mjs';
const add=(s,a,b=0,side='top',kind='sci')=>apply(s,'add',[],{term:term(a,b,kind),side}).state;
function exact(s,a,keys){const r=apply(s,a,keys,undefined,'solve');assert.ok(same(value(s),value(r.state)),a);assert.equal(r.relation,'=');return r.state;}
test('Traslado completo conserva el recíproco pendiente y ambas direcciones son exactas',()=>{
  let s=add(empty(),'3.2',5),initial=structuredClone(s);
  s=exact(s,'down',[1]);assert.equal(s.bottom[0].type,'power');assert.equal(s.bottom[0].p,-1);
  s=exact(s,'evaluate',[s.bottom[0].id]);assert.deepEqual(s.bottom[0].a,parse('0.3125'));assert.equal(s.bottom[0].b,-5);
  s=exact(s,'up',[s.bottom[0].id]);s=exact(s,'evaluate',[s.top[0].id]);assert.ok(same(value(s),value(initial)));
});
test('Solo la potencia cruza: coeficiente permanece, incluidos cero y signos',()=>{
  for(const a of ['3.2','-3.2','0','1']){let s=add(empty(),a,5);s=exact(s,'down',['1:ten']);assert.equal(s.bottom[0].b,-5);if(a!=='1'){assert.equal(s.top[0].kind,'decimal');assert.deepEqual(s.top[0].a,parse(a));}s=exact(s,'up',[s.bottom[0].id]);}
});
test('Potencias visibles sin evaluar; creación y evaluación son distintas',()=>{
  let s=add(empty(),'0.060',0,'bottom','decimal');s=apply(s,'power',[1],2).state;
  assert.equal(s.bottom[0].type,'power');assert.match(formula(s.bottom[0]),/0.060/);assert.match(formula(s.bottom[0]),/<sup>2/);
  s=exact(s,'evaluate',[s.bottom[0].id]);assert.deepEqual(s.bottom[0].a,parse('0.0036'));
  let group=add(add(empty(),'2',3),'5',-2);group=apply(group,'power',[1,2],2).state;
  const original=structuredClone(group);group=exact(group,'combine',group.top[0].children.map(t=>t.id));assert.equal(group.top[0].type,'power');group=exact(group,'evaluate',[group.top[0].id]);assert.ok(same(value(group),value(original)));assert.deepEqual(value(group),rat(10000n));
});
test('Combinar ambas filas deja exponente negativo arriba y muestra fracciones',()=>{
  const s=add(add(empty(),'3',2),'6',8,'bottom');const r=apply(s,'combine',[1,2],undefined,'solve');
  assert.equal(r.state.bottom.length,0);assert.equal(r.state.top[0].b,-6);assert.deepEqual(value(r.state),parse('0.0000005'));assert.ok(same(value(s),value(r.state)));assert.match(procedure(r.steps),/small-fraction/);assert.ok(!procedure(r.steps).includes('÷'));
});
test('Cancelación exacta acepta valores equivalentes y rechaza distintos o selección solapada',()=>{
  let s=add(add(empty(),'3',5),'300000',0,'bottom','decimal');assert.ok(availability(s,[1,2],'solve').cancel);s=exact(s,'cancel',[1,2]);assert.equal(s.top.length+s.bottom.length,0);
  s=add(add(empty(),'3',5),'4',5,'bottom');assert.throws(()=>apply(s,'cancel',[1,2]));
  s=apply(s,'power',[1],2).state;assert.throws(()=>apply(s,'combine',[s.top[0].id,s.top[0].children[0].id]));
});
test('Coulomb: rutas distintas llegan a 720 y comprobación exige terminar',()=>{
  for(const route of [0,1]){
    const p=generate('coulomb');let s=p.state;assert.deepEqual(value(s),rat(720n));assert.equal(checkResult(s,p.state).ok,false);
    if(route===0)s=exact(s,'combine',s.top[1].children.map(t=>t.id));
    s=exact(s,'evaluateAbs',[s.top[1].id]);s=exact(s,'evaluate',[s.bottom[0].id]);
    if(route===0){s=exact(s,'scientific',[s.bottom[0].id]);s=exact(s,'combine',s.top.map(t=>t.id));}
    s=exact(s,'combine',[...s.top,...s.bottom].map(t=>t.id));s=exact(s,'decimal',[s.top[0].id]);assert.deepEqual(s.top[0].a,rat(720n));assert.equal(checkResult(s,p.state).ok,true);assert.equal(checkResult(s,p.state,true).ok,false);
    s=exact(s,'normalize',[s.top[0].id]);assert.deepEqual(s.top[0].a,parse('7.2'));assert.equal(s.top[0].b,2);assert.equal(checkResult(s,p.state,true).ok,true);
  }
});
test('Resolver impide mutaciones arbitrarias; redondear solo Creador y relación aproximada',()=>{
  const s=add(empty(),'3.8123',6);for(const a of ['add','power','absolute','delete','round','reset'])assert.throws(()=>apply(s,a,[1],2,'solve'));
  const rounded=apply(s,'round',[1]);assert.equal(rounded.relation,'≈');assert.equal(rounded.state.approx,true);assert.deepEqual(rounded.state.top[0].a,parse('3.81'));assert.notDeepEqual(s,rounded.state);
  assert.throws(()=>add(empty(),'0',0,'bottom'));assert.throws(()=>apply(add(empty(),'0'),'power',[1],0));assert.throws(()=>apply(add(empty(),'0'),'power',[1],-1));
});
test('Normalización, conversiones exactas y signos no arrastran literal anterior',()=>{
  for(const [a,b,expected,k] of [['232',5,'2.32',7],['0.07',-2,'7',-4],['-232',5,'-2.32',7],['0',9,'0',0]]){const t=normalized(term(a,b));assert.deepEqual(t.a,parse(expected));assert.equal(t.b,k);}
  let s=add(empty(),'0.060',0,'top','decimal');s=exact(s,'scientific',[1]);assert.ok(!formula(s.top[0]).includes('0.060'));s=exact(s,'decimal',[1]);assert.match(formula(s.top[0]),/0.06/);
  assert.equal(decimal(rat(1n,3n)).repeat,'3');
});
test('Generador controlado: 120 problemas resolubles sin redondeos ni formato textual',()=>{
  for(const level of ['basic','intermediate','advanced'])for(let seed=0;seed<40;seed++){
    const p=generate(level,seed);let s=structuredClone(p.state);
    for(const t of [...s.top,...s.bottom])if(t.type)s=exact(s,t.type==='power'?'evaluate':'evaluateAbs',[t.id]);
    if(s.top.length+s.bottom.length>1)s=exact(s,'combine',[...s.top,...s.bottom].map(t=>t.id));
    s=exact(s,p.requireScientific?'normalize':'decimal',[s.top[0].id]);assert.equal(checkResult(s,p.state,p.requireScientific).ok,true,`${level} ${seed}`);assert.equal(decimal(value(s)).repeat,'');
  }
});
