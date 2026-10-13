import {integer,shuffle,term,polynomial,group,grouped,simplified} from '../../recursos/algebra.mjs';
export const signedTerm=t=>(t.c>0?'+':'')+term(t.c,t.base);
const coefficient=()=>integer(1,20)*(Math.random()<.5?-1:1);
export function memoryExercise() {
  const parts=[{}, {x:integer(1,5)}, {y:integer(1,5)}, {a:integer(1,3),b:integer(1,3)}];
  return shuffle(parts.flatMap((base,pair)=>{
    const c=coefficient();
    return [{pair,kind:'original',latex:`-(${signedTerm({c,base})})`},{pair,kind:'result',latex:signedTerm({c:-c,base})}];
  }));
}
export function reviewExercise(previousMask) {
  let mask;do {mask=integer(1,14);} while(mask===previousMask);
  const terms=shuffle([{}, {x:integer(1,5)}, {y:integer(1,5)}, {w:1,z:integer(1,5)}]).map(base=>({base,c:coefficient()}));
  return {mask,terms,proposed:terms.map((t,i)=>({...t,c:t.c*(mask&(1<<i)?-1:1)})),correct:terms.map((_,i)=>Boolean(mask&(1<<i)))};
}
export function subtractExercise() {
  const variable=shuffle(['x','y','a','t'])[0];
  const parts=[{[variable]:2},{[variable]:1},{}];
  const left=parts.map(base=>({base,c:coefficient()})),right=parts.map(base=>({base,c:coefficient()}));
  const negated=right.map(t=>({...t,c:-t.c}));
  const result=simplified(group(left,negated));
  const addition=simplified(group(left,right));
  const partial=result.map((t,i)=>({...t,c:t.c+(i===0?2*right[i].c:0)}));
  return {left,right,result,options:shuffle([{latex:polynomial(result),correct:true},{latex:polynomial(addition),correct:false},{latex:polynomial(partial),correct:false}]),steps:[polynomial([...left,...negated]),grouped(group(left,negated)),polynomial(result)]};
}
