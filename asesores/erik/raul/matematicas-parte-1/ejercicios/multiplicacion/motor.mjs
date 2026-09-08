import {integer,shuffle,term,polynomial,key,group,simplified,coefficientGroups} from '../../recursos/algebra.mjs';
export {polynomial,term,shuffle};
const coefficient=(max=9)=>integer(1,max)*(Math.random()<.5?-1:1);
export function multiply(a,b){
  const base={...a.base};
  for(const [letter,exponent] of Object.entries(b.base))base[letter]=(base[letter]||0)+exponent;
  return {c:a.c*b.c,base};
}
export const products=(left,right)=>left.flatMap(a=>right.map(b=>multiply(a,b)));
export const reduce=terms=>simplified(group(terms,[])).filter(t=>t.c!==0);
export const expression=(left,right)=>`(${polynomial(left)})(${polynomial(right)})`;
const signedPieces=items=>items.map(({c,body},i)=>(c<0?'-':i?'+':'')+body).join(' ');
export const distribute=(left,right)=>signedPieces(left.map(t=>({c:t.c,body:`${term(Math.abs(t.c),t.base)}(${polynomial(right)})`})));
export const expand=(left,right)=>signedPieces(left.flatMap(a=>right.map(b=>({c:a.c,body:`${term(Math.abs(a.c),a.base)}(${term(b.c,b.base)})`}))));
export function procedure(left,right){
  const raw=products(left,right);
  const steps=[];
  if(left.length>1 && right.length>1)steps.push({label:'Distribuir el primer polinomio',latex:distribute(left,right)});
  if(left.length*right.length>1)steps.push({label:'Distribuir cada término',latex:expand(left,right)});
  steps.push({label:'Multiplicar coeficientes y sumar exponentes',latex:polynomial(raw)});
  if(group(raw,[]).some(g=>g.values.length>1))steps.push({label:'Agrupar términos semejantes',latex:coefficientGroups(group(raw,[]))});
  if(raw.length>1)steps.push({label:'Simplificar',latex:polynomial(reduce(raw))});
  return steps;
}
function smallPolynomial(count,letter){return Array.from({length:count},(_,i)=>({c:coefficient(),base:count-i-1?{[letter]:count-i-1}:{}}));}
export function randomProduct(leftCount=integer(1,3),rightCount=integer(1,3)){
  const letter=shuffle(['x','y','a','b','t','w'])[0];
  const left=smallPolynomial(leftCount,letter),right=smallPolynomial(rightCount,letter);
  if(leftCount===1)left[0].base={[letter]:integer(1,4)};
  if(rightCount===1)right[0].base={[letter]:integer(1,4)};
  const badLeft=structuredClone(left);badLeft[0].c*=-1;
  return {left,right,original:expression(left,right),steps:procedure(left,right),wrong:procedure(badLeft,right)};
}
export function treeExercise(){
  const count=integer(2,4),numeric=Math.random()<.35;
  const right=numeric?Array.from({length:count},()=>({c:coefficient(),base:{}})):smallPolynomial(count,shuffle(['x','y','a'])[0]);
  const left=[{c:coefficient(),base:{}}];
  const badRight=structuredClone(right);badRight[0].c+=badRight[0].c>0?1:-1;
  const branches=shuffle([right,badRight].map((terms,i)=>{
    const raw=products(left,terms),answer=reduce(raw),bad=structuredClone(answer);
    if(bad.length)bad[0].c+=1;else bad.push({c:1,base:{}});
    const intermediate=polynomial(raw),result=polynomial(answer);
    return {correct:i===0,latex:expand(left,terms),options:shuffle([{correct:true,latex:intermediate===result?result:`${intermediate}=${result}`},{correct:false,latex:intermediate===result?polynomial(bad):`${intermediate}=${polynomial(bad)}`} ])};
  }));
  return {left,right,original:`${left[0].c}(${polynomial(right)})`,branches,steps:procedure(left,right)};
}
export function monomialExercise(){
  const letters=shuffle(['x','y','z','a','b','c','w','t']).slice(0,integer(1,3));
  const left={c:coefficient(100),base:{}},right={c:coefficient(100),base:{}};
  letters.forEach(letter=>{const where=integer(0,2);if(where!==1)left.base[letter]=integer(1,20);if(where!==0)right.base[letter]=integer(1,20);});
  return {left,right,result:multiply(left,right),original:expression([left],[right])};
}
export function cardsExercise(){
  const letter=shuffle(['x','y','a','w'])[0],other=letter==='y'?'z':'y';
  const left=[{c:coefficient(),base:{[letter]:integer(1,3),[other]:1}}],right=smallPolynomial(integer(2,4),letter);
  const changed=structuredClone(right);changed[0].c*=-1;
  const raw=products(left,right),badCoefficient=structuredClone(raw),badExponent=structuredClone(raw);
  badCoefficient[0].c+=1;badExponent[0].base[letter]+=1;
  return {original:expression(left,right),steps:[{label:'Distribuir',latex:expand(left,right)},{label:'Multiplicar',latex:polynomial(raw)}],cards:shuffle([
    {kind:'distribution',latex:expand(left,right)},{kind:'result',latex:polynomial(raw)},
    {kind:null,latex:expand(left,changed)},{kind:null,latex:expand(left,right.slice(1))},
    {kind:null,latex:polynomial(badCoefficient)},{kind:null,latex:polynomial(badExponent)}
  ])};
}
export function reviewExercise(){
  const ex=randomProduct(2,2),mask=integer(1,(1<<ex.steps.length)-2);
  return {...ex,rows:ex.steps.map((step,i)=>({label:step.label,correct:Boolean(mask&(1<<i)),latex:mask&(1<<i)?step.latex:ex.wrong[i].latex}))};
}
export function sequenceExercise(){
  const ex=randomProduct();
  return {...ex,questions:ex.steps.map((step,i)=>({label:step.label,options:shuffle([{latex:step.latex,correct:true},{latex:ex.wrong[i].latex,correct:false}])}))};
}
