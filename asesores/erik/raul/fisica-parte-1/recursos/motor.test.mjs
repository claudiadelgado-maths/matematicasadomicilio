import test from 'node:test';
import assert from 'node:assert/strict';
import {prefixes,parseDecimal,convert,decimal,scientific,equal,decimalPower,compactPower,prefixPair,voltageRound,timeRound,capacitorRound,wordGrid} from './motor.mjs';
test('Conversiones exactas solicitadas y sin errores binarios',()=>{
  for(const [value,from,to,m,expected] of [['150','-3','0','corriente','0.15'],['20','-6','-9','capacitancia','20000'],['30','min','0','tiempo','1800'],['63.5','-6','0','tiempo','0.0000635'],['2.4','3','0','resistencia','2400'],['0.3','0','-3','corriente','300'],['1','24','-24','carga','1'+'0'.repeat(48)],['1','-24','24','carga','0.'+'0'.repeat(47)+'1'],['-0','6','-3','voltaje','0']])assert.equal(decimal(convert(value,from,to,m)).text,expected);
  assert.equal(scientific(convert('150','-3','0','corriente')).tex,'1.5\\times10^{-1}');
  assert.equal(decimal(convert('1','0','min','tiempo')).approx,true);
  assert.equal(decimal(convert('60','0','min','tiempo')).text,'1');
  assert(equal(parseDecimal('1,5e-3'),parseDecimal('0.0015')));
  assert.equal(prefixes.find(p=>p.symbol==='M').exponent,6);assert.equal(prefixes.find(p=>p.symbol==='m').exponent,-3);assert.equal(prefixes.find(p=>p.name==='micro').symbol,'μ');
  assert.equal(prefixes.length,21);assert.equal(compactPower(-6),'0. [5 ceros] 1');assert.equal(compactPower(-1),'0.1');assert.equal(compactPower(0),'1');
});
test('Todos los pares de prefijos conservan el valor en el viaje de ida y vuelta',()=>{
  for(const from of prefixes)for(const to of prefixes)for(const value of ['0','1','-2.45','0.00000635','12345678901234567890.123456789']){
    const original=parseDecimal(value),converted=convert(original,from.id,to.id,'frecuencia');assert(equal(convert(converted,to.id,from.id,'frecuencia'),original));
    const display=decimal(converted);assert.equal(display.approx,false);assert(equal(parseDecimal(display.text.length<=60?display.text:value),display.text.length<=60?converted:original));
  }
  for(const invalid of ['','NaN','Infinity','1/2','<script>','1e99','1,2,3'])assert.throws(()=>parseDecimal(invalid));
  assert.throws(()=>convert('1','min','0','voltaje'));assert.throws(()=>convert('1','unknown','0','carga'));assert.throws(()=>convert('1','0','0','unknown'));
});
test('Generación: objetivos alcanzables, prefijos distintos, orden único y sopa válida',()=>{
  for(let n=0;n<1000;n++){
    const pair=prefixPair();assert.notEqual(pair[0].id,pair[1].id);
    const v=voltageRound();assert(v.target>=0&&v.target<=100&&v.target*2%1===0);assert(equal(convert(v.amount,v.from,'0','voltaje'),parseDecimal(String(v.target))));
    const t=timeRound();assert(equal(t.answer,convert(t.amount,t.from,t.to,'tiempo')));
    const caps=capacitorRound();assert.equal(new Set(caps.values.map(v=>v.nano)).size,4);caps.values.forEach(v=>assert(equal(convert(v.amount,v.from,'-9','capacitancia'),parseDecimal(String(v.nano)))));
    const words=wordGrid();assert.equal(words.grid.length,64);assert(words.grid.every(c=>typeof c==='string'&&c.length===1));words.placements.forEach(p=>assert.equal(p.cells.map(i=>words.grid[i]).join(''),p.word));
  }
  for(const p of prefixes)assert.equal(decimal(convert('1',p.id,'0','voltaje')).text,decimalPower(p.exponent));
});
