const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;};
export function R(n,d=1){n=BigInt(n);d=BigInt(d);if(!d)throw Error('Denominador cero');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
export const plus=(a,b)=>R(a.n*b.d+b.n*a.d,a.d*b.d),times=(a,b)=>R(a.n*b.n,a.d*b.d),minus=(a,b)=>plus(a,R(-b.n,b.d));
export const rationalKey=a=>`${a.n}/${a.d}`;
const N=n=>({op:'n',n:Number(n)}),V=v=>({op:'v',v}),op=(op,a,b)=>({op,a,b});
export function rationalTree(a){if(a.d===1n)return N(a.n);const f=op('/',N(a.n<0n?-a.n:a.n),N(a.d));return a.n<0n?{op:'neg',a:f}:f;}
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),sign=r=>r()<.5?-1:1;
const shuffle=(r,list)=>{list=[...list];for(let i=list.length-1;i>0;i--){const j=int(r,0,i);[list[i],list[j]]=[list[j],list[i]];}return list;};
const pairKey=(a,b,roots)=>roots?[rationalKey(a),rationalKey(b)].sort().join('|'):[rationalKey(a),rationalKey(b)].join('|');
function pairOptions(r,a,b,roots){
 const pairs=[[a,b],[R(-a.n,a.d),b],[a,R(-b.n,b.d)],[b,a]];
 for(const delta of shuffle(r,[-2,-1,1,2,3])){pairs.push([plus(a,R(delta)),b],[a,plus(b,R(delta))]);}
 const seen=new Set(),out=[];for(const [x,y]of pairs){const key=pairKey(x,y,roots);if(seen.has(key))continue;seen.add(key);out.push({expression:{op:'pair',roots,a:rationalTree(x),b:rationalTree(y)},values:[x,y],correct:out.length===0});if(out.length===4)break;}
 return shuffle(r,out);
}
const coefficient=(a,term)=>a.n===a.d?term:a.n===-a.d?{op:'neg',a:term}:op('*',rationalTree(a),term);
function sumTerms(terms){let result;for(const [c,t]of terms){if(!c.n)continue;const magnitude=R(c.n<0n?-c.n:c.n,c.d),term=t?coefficient(magnitude,t):rationalTree(magnitude);result=result?op(c.n<0n?'-':'+',result,term):c.n<0n?(t?coefficient(c,t):rationalTree(c)):term;}return result||N(0);}
export function advancedEquation(level,r=Math.random){
 if(level<=31){
  const fractional=level===31;
  let a=fractional?R(int(r,-7,7),int(r,2,5)):R(int(r,-10,10));
  if(fractional&&a.d===1n)a=R(sign(r),int(r,2,5));
  const b=r()<.22?a:fractional?R(int(r,-7,7),int(r,1,5)):R(int(r,-10,10));
  const B=R(-plus(a,b).n,plus(a,b).d),C=times(a,b);
  const expression=op('=',sumTerms([[R(1),{op:'square',a:V('x')}],[B,V('x')],[C,null]]),N(0));
  return {id:JSON.stringify(expression),level,expression,meta:{roots:[a,b],B,C},steps:[{prompt:'¿Cuáles son x₁ y x₂?',options:pairOptions(r,a,b,true)}],explanation:'Las raíces hacen que cada factor sea cero. Comprueba sustituyendo cada valor en la ecuación. Si coinciden, se muestran ambas raíces iguales.'};
 }
 const solution=level===35?[R(sign(r)*int(r,1,5),int(r,2,5)),R(sign(r)*int(r,1,5),int(r,2,5))]:[R(int(r,level===32?0:-6,6)),R(int(r,level===32?0:-6,6))];
 let coefficients,determinant,common,valid=false;
 for(let tries=0;tries<200;tries++){
  common=level===34?[2,3,5][int(r,0,2)]:1;
  coefficients=Array.from({length:4},(_,i)=>{
   if(level===32)return R(int(r,1,3)*(i===3?-1:1));
   if(level===33)return R(int(r,1,5)*sign(r));
   if(level===34)return R(int(r,1,common-1)*sign(r),common);
   return R(int(r,1,4)*sign(r),[2,3,4,5][(i+int(r,0,3))%4]);
  });
  if(level===35&&new Set(coefficients.map(c=>String(c.d))).size<2)continue;
  if(level===35){const [x,y]=solution;const values=[plus(times(coefficients[0],x),times(coefficients[1],y)),plus(times(coefficients[2],x),times(coefficients[3],y))];if(values.some(v=>v.d>30n||v.n>60n||v.n< -60n))continue;}
  determinant=minus(times(coefficients[0],coefficients[3]),times(coefficients[1],coefficients[2]));if(determinant.n){valid=true;break;}
 }
 if(!valid)throw Error('No se pudo generar un sistema único');
 const [a,b,c,d]=coefficients,[x,y]=solution;
 const constants=[plus(times(a,x),times(b,y)),plus(times(c,x),times(d,y))];
 const row=(a,b,c)=>op('=',sumTerms([[a,V('x')],[b,V('y')]]),rationalTree(c));
 const expression={op:'system',a:row(a,b,constants[0]),b:row(c,d,constants[1])};
 return {id:JSON.stringify(expression),level,expression,meta:{solution,coefficients,constants,determinant,common},steps:[{prompt:'¿Qué valores de x e y resuelven ambas ecuaciones?',options:pairOptions(r,x,y,false)}],explanation:'El par debe satisfacer las dos ecuaciones a la vez. Puedes eliminar denominadores primero y luego usar sustitución o eliminación. Comprueba ambos valores en cada ecuación.'};
}
