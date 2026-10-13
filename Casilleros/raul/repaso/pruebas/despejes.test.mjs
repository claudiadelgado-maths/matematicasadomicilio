import assert from 'node:assert/strict';
import {initial,move,flip,isolated,signature,sideTex} from '../recursos/despejes/motor.mjs';
function product(state,side,values){return state.filter(x=>x.side===side).reduce((v,x)=>v*values[x.id]**x.power,1);}
let statesChecked=0,solutions=0;
for(let shape=0;shape<4;shape++){
 const start=initial(shape),ids=start.map(x=>x.id),base=signature(start),seen=new Set(),queue=[start];
 const values={a:1,b:2,c:3,d:5,e:7};values.a=product(start,1,values)/product(start,0,values);
 while(queue.length){const state=queue.shift(),key=JSON.stringify(state);if(seen.has(key))continue;seen.add(key);statesChecked++;
  assert.ok(Math.abs(product(state,0,values)-product(state,1,values))<1e-8);
  const sig=signature(state),orientation=sig.a/base.a;for(const id of ids)assert.equal(sig[id],base[id]*orientation);
  assert.deepEqual(flip(flip(state)),state);
  for(const id of ids){assert.deepEqual(move(move(state,id),id),state);queue.push(move(state,id));}
  queue.push(flip(state));
  for(const target of ids){let working=state;if(working.find(x=>x.id===target).power===-1)working=move(working,target);const side=working.find(x=>x.id===target).side;for(const x of [...working])if(x.side===side&&x.id!==target)working=move(working,x.id);if(working.find(x=>x.id===target).side===1)working=flip(working);assert.ok(isolated(working,target));assert.equal(sideTex(working,0),target);assert.ok(Math.abs(product(working,1,values)-values[target])<1e-8);solutions++;}
 }
}
let b=initial();for(const id of ['b','c','d'])b=move(b,id);b=flip(b);assert.equal(sideTex(b,1),'\\frac{a\\cdot d}{c}');
console.log(`${statesChecked} estados equivalentes y ${solutions} despejes verificados; multiplicar/dividir, voltear y revertir conservan la igualdad.`);
