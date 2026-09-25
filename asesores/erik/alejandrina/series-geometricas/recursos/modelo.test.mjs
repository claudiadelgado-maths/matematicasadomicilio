import test from 'node:test';
import assert from 'node:assert/strict';
import {generate,variants,mission,parseNumber,accepts,VERSION} from './modelo.mjs';
import {newState,restore,answer,advance,startReview,current,selected} from './mision-estado.mjs';
import {read,write} from './ui.mjs';
import {generatePractice,nextPractice} from './modelo.mjs';
import {fraction,fractionTex,numberFraction,fractionSequence} from './fracciones.mjs';

test('fracciones reducidas y recorrido exacto sin redondear',()=>{
  assert.equal(fractionTex(numberFraction(.75)),'\\frac{3}{4}');
  assert.equal(fractionTex(numberFraction(1/3)),'\\frac{1}{3}');
  assert.equal(fractionTex(numberFraction(-1.5)),'-\\frac{3}{2}');
  assert.equal(fractionTex(fraction(4,-6)),'-\\frac{2}{3}');
  assert.throws(()=>fraction(1,0));
  assert.deepEqual(fractionSequence(fraction(2,3),fraction(3,4),3).map(fractionTex),['\\frac{2}{3}','\\frac{1}{2}','\\frac{3}{8}']);
  assert.deepEqual(fractionSequence(fraction(2),fraction(0),3).map(fractionTex),['2','0','0']);
});

test('variedad de razones y otro ejercicio sin repetir la razón',()=>{
  for(const [topic,v] of [['patron',1],['termino',1],['formula',0],['sumas',2],['aplicacion',2]]){
    const reasons=new Set();let previous;
    for(let i=0;i<100;i++){
      const c=nextPractice(topic,v,i,previous);reasons.add(c.data.r);
      if(previous)assert.notEqual(c.data.r,previous.data.r);
      if(topic==='patron'||topic==='sumas'||topic==='aplicacion')assert.ok(c.data.r>0&&c.data.r<1);
      previous=c;
    }
    assert.ok(reasons.size>=3);
  }
});

test('datos de las prácticas variadas y resultados finitos',()=>{
  for(let seed=0;seed<100;seed++)for(const [topic,vs] of Object.entries(variants))for(let v=0;v<vs.length;v++){
    const c=generatePractice(topic,v,seed);
    for(const s of c.steps)if(typeof s.answer==='number')assert.ok(Number.isFinite(s.answer));
    if(topic==='termino')assert.ok(accepts(c.steps.at(-1),String(c.data.a*c.data.r**(c.data.n-1))));
  }
});

test('entradas numéricas equivalentes y entradas incompletas',()=>{
  for(const text of ['0,5','.5','1/2',' 2 / 4 '])assert.equal(parseNumber(text),.5);
  for(const text of ['', ' ', '1/0','1/2/3','2abc','Infinity','1,2,3','--4'])assert.equal(parseNumber(text),null);
  assert.equal(accepts({answer:3},'6/2'),true);
  assert.equal(accepts({answer:3},'3.01'),false);
  assert.equal(parseNumber('1/'+'9'.repeat(400)),null);
  assert.equal(parseNumber('9'.repeat(400)+'/1'),null);
});

test('la variante Disminuir siempre produce términos positivos decrecientes',()=>{
  for(let seed=0;seed<1000;seed++){
    const c=generate('patron',1,seed);
    assert.ok(c.data.r>0&&c.data.r<1);
    assert.ok(c.data.a*c.data.r<c.data.a);
  }
});

test('todos los generadores coinciden con sucesiones construidas por multiplicación',()=>{
  for(let seed=0;seed<150;seed++)for(const [topic,vs] of Object.entries(variants))for(let v=0;v<vs.length;v++){
    const c=generate(topic,v,seed),{a,r,n,p,q,k,end}=c.data;
    const seq=[a];for(let i=1;i<10;i++)seq.push(seq.at(-1)*r);
    const last=c.steps.at(-1).answer;
    assert.ok(c.steps.length>0);
    for(const s of c.steps){assert.ok(s.hint&&s.equation);assert.ok(accepts(s,String(s.answer)));if(typeof s.answer==='number')assert.ok(Number.isFinite(s.answer));}
    if(topic==='patron')assert.equal(last,seq[1]/seq[0]);
    if(topic==='termino')assert.equal(last,seq[n-1]);
    if(topic==='inicio')assert.equal(last,a);
    if(topic==='razon')assert.equal(last,seq[1]/seq[0]);
    if(topic==='dos'){assert.equal(last,a);assert.equal(seq[p-1],c.data.ap);assert.equal(seq[q-1],c.data.aq);}
    if(topic==='sumas')assert.equal(last,v===3?a:seq.slice(0,n).reduce((s,x)=>s+x,0));
    if(topic==='aplicacion')assert.equal(last,v%2===0?seq[n-1]:seq.slice(0,n).reduce((s,x)=>s+x,0));
    if(topic==='combinar')assert.equal(last,v===0?seq.slice(0,q).reduce((s,x)=>s+x,0):seq[q]);
    if(topic==='medios'){assert.equal(seq[k+1],end);assert.deepEqual(c.steps.slice(2,-1).map(s=>s.answer),seq.slice(1,k+1));assert.equal(last,end);}
    if(topic==='posicion'&&v<2)assert.equal(last,n);
    if(topic==='posicion'&&v===2)assert.ok(!seq.includes(seq[n-1]+a));
    if(topic==='raices'){
      if(v<2)assert.equal(last**c.data.k,c.data.power);
      if(v===2){assert.equal(c.data.root**c.data.k,c.data.power);assert.equal((-c.data.root)**c.data.k,c.data.power);}
      if(v===3){assert.equal(c.data.k%2,0);assert.ok(c.data.power<0);assert.equal(last,'No hay solución real');}
    }
  }
});

test('1000 misiones: dos retos por familia, opciones distintas y una sola respuesta',()=>{
  for(let seed=0;seed<1000;seed++){
    const cards=mission(seed),families=new Map();
    assert.equal(cards.length,24);assert.equal(new Set(cards.map(c=>c.id)).size,24);
    for(const c of cards){families.set(c.family,(families.get(c.family)||0)+1);assert.equal(new Set(c.options).size,4);assert.equal(c.options.filter(x=>x===c.answer).length,1);}
    assert.equal(families.size,12);assert.ok([...families.values()].every(n=>n===2));
    assert.equal(new Set(cards.map(c=>c.prompt)).size,24);
  }
  assert.deepEqual(mission(10),mission(10));assert.notDeepEqual(mission(10),mission(11));
});

test('una misión y su repaso sobreviven a recargas sin saltar retos',()=>{
  let state=newState(51);state.started=true;const cards=mission(51);
  assert.equal(advance(state,cards),false);
  for(let i=0;i<24;i++){
    assert.equal(current(state),i);
    const right=cards[i].options.indexOf(cards[i].answer),wrong=(right+1)%4;
    if(i%3===0){assert.equal(answer(state,wrong,cards),false);state=restore(JSON.parse(JSON.stringify(state)),8);assert.equal(selected(state),wrong);assert.equal(advance(state,cards),false);}
    assert.equal(answer(state,right,cards),true);state=restore(state,8);assert.equal(advance(state,cards),true);
  }
  assert.equal(state.index,24);assert.equal(state.wrong.length,8);
  assert.equal(startReview(state),true);
  for(let j=0;j<8;j++){const i=current(state);answer(state,cards[i].options.indexOf(cards[i].answer),cards);advance(state,cards);state=restore(state,8);}
  assert.equal(state.reviewIndex,8);
});

test('estado inválido se reinicia o limita al prefijo comprobado',()=>{
  for(const raw of [null,[],{}, {version:1,seed:3}, {version:VERSION,seed:-1}])assert.equal(restore(raw,12).seed,12);
  const raw={...newState(5),started:true,index:24,picks:[500],wrong:[-1,90,'3'],mode:'review',reviewIndex:200};
  const state=restore(raw,12);assert.equal(state.index,0);assert.deepEqual(state.wrong,[]);assert.equal(state.mode,'mission');
  assert.equal(answer(state,999,mission(5)),false);
});

test('almacenamiento bloqueado o JSON corrupto no impide continuar',()=>{
  const original=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  try{
    Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem(){throw Error('bloqueado');},setItem(){throw Error('cuota');}}});
    assert.equal(read('prueba'),null);assert.equal(write('prueba',{}),false);
    Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem(){return '{invalido';},setItem(){}}});
    assert.equal(read('prueba'),null);assert.equal(write('prueba',{}),true);
  }finally{if(original)Object.defineProperty(globalThis,'localStorage',original);else delete globalThis.localStorage;}
});
