import {r,eq,evaluate,evaluatePoly,denominators,mul,add} from './algebra.mjs';
export function probe(p,values){
  if(values.length!==p.variables.length)throw Error('Completa todas las variables.');
  if(p.kind==='system')return {values,equations:p.equations.map(e=>{const left=evaluatePoly(e.left,values);return {left,right:e.right,match:eq(left,e.right)};})};
  if(denominators(p.original).some(e=>evaluate(e,values).n===0n))throw Error('No puedes utilizar esos valores: un denominador de la expresión original vale 0. Elige otros valores.');
  const original=evaluate(p.original,values),options=p.options.map(o=>{try{return evaluate(o,values)}catch{return null;}});
  const result={values,original,options,matches:[],collision:false};
  if(p.kind==='division'){
    const dividend=evaluatePoly(p.dividend,values),divisor=evaluatePoly(p.D,values),companion=evaluatePoly(p.asked==='quotient'?p.R:p.Q,values);
    result.division={dividend,divisor,companion,checks:options.map(o=>o?(p.asked==='quotient'?add(mul(divisor,o),companion):add(mul(divisor,companion),o)):null)};
    result.matches=result.division.checks.map((v,i)=>v&&eq(v,dividend)?i:-1).filter(i=>i>=0);
  }else result.matches=options.map((v,i)=>v&&eq(v,original)?i:-1).filter(i=>i>=0);
  result.collision=options.some((v,i)=>v&&options.slice(0,i).some(w=>w&&eq(v,w)));
  return result;
}
