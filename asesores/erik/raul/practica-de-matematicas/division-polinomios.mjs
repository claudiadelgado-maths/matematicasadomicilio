import {expand,expandedTree,product,combine,polynomialKey} from './factorizacion.mjs';
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const shuffle=(r,a)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=int(r,0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const coefficient=(r,max)=>BigInt(int(r,1,max)*(r()<.5?-1:1));
function univariate(r,letter,degree,count,max){
 const exponents=[degree,...shuffle(r,Array.from({length:degree},(_,i)=>i)).slice(0,count-1)];
 return new Map(exponents.map(e=>[letter.repeat(e),coefficient(r,max)]));
}
function homogeneous(r,letters,degree,count,max){
 const keys=Array.from({length:degree+1},(_,i)=>(letters[0].repeat(degree-i)+letters[1].repeat(i)).split('').sort().join(''));
 return new Map(shuffle(r,keys).slice(0,count).map(k=>[k,coefficient(r,max)]));
}
export function divisionProblem(level,r=Math.random){
 let divisor,quotient,dividend;const many=level===45&&r()<.75;
 for(let attempts=0;attempts<500;attempts++){
  if(many){
   const letters=shuffle(r,[['x','y'],['a','b'],['x','a'],['m','n']])[0];
   divisor=homogeneous(r,letters,2,int(r,2,3),3);quotient=homogeneous(r,letters,int(r,2,3),int(r,2,3),3);
   if(r()<.3)quotient.set('',coefficient(r,3));
  }else{
   const letter=level===45?shuffle(r,['x','a','y'])[0]:'x';
   const degree=level===43?(r()<.85?1:2):int(r,1,2);
   divisor=univariate(r,letter,degree,degree===1?2:int(r,2,3),level===43?2:3);
   const qdegree=level===43?int(r,1,2):int(r,2,3);
   quotient=univariate(r,letter,qdegree,level===43?2:int(r,2,qdegree+1),3);
  }
  dividend=product(divisor,quotient);
  if(dividend.size>=2&&dividend.size<=8&&[...dividend.values()].every(c=>c>=-36n&&c<=36n))break;
  dividend=null;
 }
 if(!dividend)throw Error('No se pudo construir una división manejable');
 const correct=expandedTree(quotient),options=[{expression:correct,correct:true}],seen=new Set([polynomialKey(correct)]);
 const terms=shuffle(r,[...quotient.keys()]);
 for(const key of terms){for(const delta of shuffle(r,[-3,-2,-1,1,2,3])){
  const candidate=expandedTree(combine(quotient,new Map([[key,BigInt(delta)]]))),id=polynomialKey(candidate);
  if(!seen.has(id)&&expand(candidate).size){seen.add(id);options.push({expression:candidate,correct:false});}if(options.length===4)break;
 }if(options.length===4)break;}
 const expression={op:'polyDivision',a:expandedTree(dividend),b:expandedTree(divisor)};
 // Verificación independiente del marcado de las opciones: A·opción = dividendo.
 for(const option of options){const equal=combine(product(divisor,expand(option.expression)),dividend,-1n).size===0;if(equal!==option.correct)throw Error('Cociente inconsistente');}
 if(options.length!==4)throw Error('Opciones insuficientes');
 return {id:polynomialKey(expression.a)+' entre '+polynomialKey(expression.b),level,expression,meta:{many},steps:[{prompt:'¿Cuál es el cociente?',options:shuffle(r,options)}],explanation:'La división es exacta: el residuo es 0. Puedes comprobar el cociente multiplicándolo por el divisor; debes recuperar todos los términos del dividendo.'};
}

export function remainderProblem(r=Math.random){
 const family=int(r,0,3),degree=family===3?2:int(r,1,2);
 const divisor=univariate(r,'x',degree,degree===1?2:int(r,2,3),2);
 const quotient=univariate(r,'x',int(r,1,2),2,3);
 const remainder=family===0?new Map():family===1?new Map([['',BigInt(int(r,1,8))]]):family===2?new Map([['',-BigInt(int(r,1,8))]]):new Map([['x',coefficient(r,3)],['',coefficient(r,5)]]);
 const dividend=combine(product(divisor,quotient),remainder),correct=expandedTree(remainder),options=[{expression:correct,correct:true}],seen=new Set([polynomialKey(correct)]);
 for(const delta of shuffle(r,[-3,-2,-1,1,2,3])){const candidate=expandedTree(combine(remainder,new Map([['',BigInt(delta)]]))),key=polynomialKey(candidate);if(!seen.has(key)){seen.add(key);options.push({expression:candidate,correct:false});}if(options.length===4)break;}
 return {id:polynomialKey(expandedTree(dividend))+' entre '+polynomialKey(expandedTree(divisor)),level:46,expression:{op:'polyDivision',a:expandedTree(dividend),b:expandedTree(divisor)},meta:{family,quotient:expandedTree(quotient),degree},steps:[{prompt:'¿Cuál es el residuo de la división?',options:shuffle(r,options)}],explanation:'El dividendo es divisor × cociente + residuo. El residuo debe tener grado menor que el divisor. Puede ser cero, una constante o, si el divisor es cuadrático, una expresión lineal.'};
}
