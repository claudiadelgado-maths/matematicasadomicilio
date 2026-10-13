export const integer = (min, max, rng = Math.random) => min + Math.floor(rng() * (max-min+1));
export function shuffle(values, rng = Math.random) {
  const result = [...values];
  for (let i=result.length-1;i>0;i--) { const j=integer(0,i,rng); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export const nonzero = (rng = Math.random) => { const n=integer(1,200,rng); return n<=100 ? -n : n-100; };
export function key(base) { return Object.entries(base).filter(([,e])=>e>0).sort(([a],[b])=>a.localeCompare(b)).map(([l,e])=>`${l}:${e}`).join('|'); }
export function literal(base) { return Object.entries(base).filter(([,e])=>e>0).sort(([a],[b])=>a.localeCompare(b)).map(([l,e])=>l+(e===1?'':`^{${e}}`)).join(''); }
export function bases(count, rng = Math.random) {
  const result=[]; const seen=new Set();
  while(result.length<count) {
    const letters=shuffle(['x','y','z','w','s','d','t','a','b','c'],rng).slice(0,integer(1,3,rng));
    const base=Object.fromEntries(letters.map(l=>[l,integer(0,9,rng)]));
    const identity=key(base);
    if(!seen.has(identity)) {seen.add(identity); result.push(base);}
  }
  return result;
}
export function term(c, base) {
  if(c===0) return '0';
  const part=literal(base);
  return `${c<0?'-':''}${Math.abs(c)===1 && part?'':Math.abs(c)}${part}`;
}
export function polynomial(terms) {
  const nonzeroTerms=terms.filter(t=>t.c!==0);
  return nonzeroTerms.length ? nonzeroTerms.map((t,i)=>(i && t.c>0?'+':'')+term(t.c,t.base)).join(' ') : '0';
}
export function group(left,right) {
  const map=new Map();
  [...left,...right].forEach(t=>{
    const id=key(t.base);
    if(!map.has(id)) map.set(id,{base:t.base,values:[]});
    map.get(id).values.push(t.c);
  });
  return [...map.values()];
}
export const simplified = groups => groups.map(g=>({base:g.base,c:g.values.reduce((a,b)=>a+b,0)}));
// Une sumandos sin +(-n); null conserva una casilla pendiente.
export function signedSum(values) {
  return values.map((v,i)=>v===null?(i?' + ':'')+'\\square':(v<0?' - ':i?' + ':'')+Math.abs(v)).join('').trim();
}
export function coefficientGroups(groups) {
  return groups.map(g=>`(${signedSum(g.values)})${literal(g.base)}`).join(' + ');
}
export function grouped(groups) {
  return groups.map((g,i)=>{
    const negative=g.values[0]!==null && g.values[0]<0;
    const values=g.values.map(v=>v===null?null:negative?-v:v);
    const body=values.length===1?(values[0]===null?'\\square{}'+literal(g.base):term(values[0],g.base)):`(${signedSum(values)})${literal(g.base)}`;
    return (negative?' - ':i?' + ':'')+body;
  }).join('').trim();
}
export function numbers(rng = Math.random) {
  const a=integer(-100,100,rng), b=integer(-100,100,rng), answer=a+b;
  const delta=integer(1,15,rng);
  const options=answer===0?[-delta,0,delta]:[answer,-answer,Math.sign(answer)*(Math.abs(answer)+delta)];
  return {a,b,answer,latex:`${a} + ${b<0?`(${b})`:b}`,options:shuffle(options,rng)};
}
export function pairs(rng = Math.random) {
  return shuffle(bases(3,rng).flatMap((base,i)=>[0,1].map(j=>({id:`card-${i}-${j}`,base,c:nonzero(rng)}))),rng);
}
export function trinomials(rng = Math.random) {
  const parts=bases(3,rng);
  return {parts,left:shuffle(parts.map(base=>({base,c:nonzero(rng)})),rng),right:shuffle(parts.map(base=>({base,c:nonzero(rng)})),rng)};
}
export function validGroup(a,b,left,right,base) {
  const x=left.find(t=>key(t.base)===key(base)).c, y=right.find(t=>key(t.base)===key(base)).c;
  return (a===x && b===y) || (a===y && b===x);
}
export function polynomials(rng = Math.random) {
  // Potencias distintas de una variable: garantiza términos exclusivos y semejantes.
  const variable=shuffle(['x','y','a','b','m','n','t'],rng)[0];
  const parts=shuffle([0,1,2,3,4,5],rng).map(e=>({[variable]:e}));
  const count=integer(2,3,rng);
  const left=parts.slice(0,count).map(base=>({base,c:nonzero(rng)}));
  const right=[parts[0],...parts.slice(count)].map(base=>({base,c:nonzero(rng)}));
  // Para count=3 quedan 3 y 4 términos; para count=2 quedan 2 y 5.
  const correct=group(left,right);
  const wrongA=structuredClone(correct), wrongB=structuredClone(correct);
  const shared=correct.findIndex(g=>g.values.length===2);
  wrongA[shared].values[1]*=-1;
  const single=correct.findIndex(g=>g.values.length===1);
  wrongB.splice(single,1); // Error habitual: perder un término sin pareja.
  const result=simplified(correct), badA=structuredClone(result), badB=structuredClone(result);
  badA[shared].c+=1;
  badB[single].c*=-1;
  return {left,right,groups:correct,result,
    groupingOptions:shuffle([{latex:grouped(correct),correct:true},{latex:grouped(wrongA),correct:false},{latex:grouped(wrongB),correct:false}],rng),
    resultOptions:shuffle([{latex:polynomial(result),correct:true},{latex:polynomial(badA),correct:false},{latex:polynomial(badB),correct:false}],rng)};
}
export function parseInteger(text) { return /^[+-]?\d{1,4}$/.test(text.trim())?Number(text.trim()):null; }
