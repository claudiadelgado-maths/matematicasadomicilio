import {divisionProblem,remainderProblem} from './division-polinomios.mjs';
import {verbalProblem} from './problemas-verbales.mjs';
import {advancedEquation} from './cuadraticas-sistemas.mjs';
import {algebraFractionProblem} from './fracciones-algebraicas.mjs';
import {factorProblem,factorRun} from './factorizacion.mjs';
export const levels=[
 [1,'Sumas',12,60,1,'Suma números de 0 a 20.'],
 [2,'Restas',12,60,1,'Resta el menor al mayor. Usamos números de 0 a 20.'],
 [3,'Sumas y restas con negativos',15,90,1,'Opera con enteros entre −20 y 20.'],
 [4,'Simplificación de signos',10,45,1,'Simplifica signos, paréntesis y cuadrados. Las letras representan números.'],
 [5,'Simplificación de fracciones con signos',10,130,1,'Resuelve los signos y reduce la fracción.'],
 [6,'Fracciones con igual denominador',6,180,1,'Suma dos o tres fracciones positivas y simplifica.'],
 [7,'Signos e igual denominador',10,240,2,'Primero reúne los términos en una fracción; después simplifica.'],
 [8,'Fracciones con diferente denominador',4,90,1,'Suma dos fracciones positivas y simplifica.'],
 [9,'Diferente denominador y signos',6,150,2,'Usa un denominador común positivo; después simplifica.'],
 [10,'Multiplicación de fracciones',4,60,1,'Multiplica fracciones positivas y simplifica el resultado.'],
 [11,'Multiplicación con signos',5,90,1,'Multiplica los factores entre paréntesis. También puede aparecer un entero.'],
 [12,'Sustitución básica',8,120,1,'Sustituye x por el valor indicado y calcula.'],
 [13,'Sustitución con signos',8,150,1,'Sustituye con cuidado: escribe los valores negativos entre paréntesis.'],
 [14,'Sustitución avanzada',8,180,1,'Resuelve primero paréntesis y potencias; después las operaciones restantes.'],
 [15,'Sustitución en una fracción',6,120,1,'Calcula numerador y denominador, y simplifica la fracción.'],
 [16,'Sustitución en fracciones con signos',6,150,1,'Sustituye, resuelve los signos y simplifica.'],
 [17,'Varias fracciones con igual denominador',6,180,1,'Sustituye x, reúne los numeradores y simplifica el resultado.'],
 [18,'Despeje básico',10,120,1,'Encuentra x con una operación inversa.'],
 [19,'Despeje completo',9,165,1,'Elimina la suma y después el coeficiente de x.'],
 [20,'Despeje con signos',8,180,1,'Despeja x cuidando los signos.'],
 [21,'Despeje en distintas posiciones',7,195,1,'Identifica el término con x, sin importar su posición.'],
 [22,'Despeje con otras variables',6,195,1,'Despeja x. Las otras letras representan constantes.'],
 [23,'Factorización positiva',12,600,1,'Elige una expresión equivalente escrita en factores.'],
 [24,'Factorización con signos',12,600,1,'Comprueba los factores y cuida los signos.'],
 [25,'Factorización con varias letras',12,600,1,'Comprueba la equivalencia conservando todas las variables.'],
 [26,'Operaciones con fracciones algebraicas',5,120,1,'Opera las fracciones y simplifica el resultado.'],
 [27,'Simplificación de fracciones algebraicas',6,120,1,'Cancela factores comunes y simplifica.'],
 [28,'Multiplicación y división de fracciones algebraicas',5,150,1,'Opera las fracciones y simplifica completamente.'],
 [29,'Ecuaciones fraccionarias de primer grado',6,180,1,'Resuelve la ecuación y respeta su dominio.'],
 [30,'Ecuaciones cuadráticas',6,180,1,'Encuentra las dos raíces enteras, incluso si son iguales.'],
 [31,'Ecuaciones cuadráticas con fracciones',6,240,1,'Encuentra ambas raíces y expresa las fracciones simplificadas.'],
 [32,'Sistemas de ecuaciones básicos',4,300,1,'Encuentra un par que cumpla las dos ecuaciones.'],
 [33,'Sistemas con signos',4,300,1,'Resuelve ambas ecuaciones cuidando los signos.'],
 [34,'Sistemas con fracciones de igual denominador',4,300,1,'Elimina el denominador común y resuelve el sistema.'],
 [35,'Sistemas con fracciones generales',4,300,1,'Resuelve el sistema y simplifica las dos respuestas.'],
 [36,'Expresiones algebraicas simples',15,360,1,'Representa el número desconocido con x y traduce la frase.'],
 [37,'Expresiones algebraicas compuestas',15,360,1,'Respeta el orden de las operaciones y el alcance de los paréntesis.'],
 [38,'Ecuaciones escritas con palabras',10,300,1,'Traduce la frase a una ecuación y encuentra el número.'],
 [39,'Planteamiento con relaciones entre números',8,360,1,'Representa los números con una incógnita y plantea su relación lineal.'],
 [40,'Problemas con ecuaciones lineales',6,360,1,'Define una incógnita, plantea una ecuación lineal y resuélvela.'],
 [41,'Problemas con sistemas lineales',5,420,1,'Define dos incógnitas y plantea dos ecuaciones lineales independientes.'],
 [42,'Problemas algebraicos aplicados',5,480,1,'Identifica las relaciones, plantea una ecuación y comprueba el resultado.'],
 [43,'División básica de polinomios',6,240,1,'Encuentra el cociente de esta división exacta.'],
 [44,'División intermedia de polinomios',6,300,1,'Ordena los términos y encuentra el cociente.'],
 [45,'División de polinomios con varias variables',5,360,1,'Conserva las variables y potencias al dividir.'],
 [46,'Residuo de división de polinomios',6,240,1,'Encuentra lo que queda después de dividir los polinomios.']
].map(([id,title,count,seconds,steps,description])=>({id,title,count,seconds,steps,description}));
export const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;};
export function rat(n,d=1n){n=BigInt(n);d=BigInt(d);if(!d)throw Error('Denominador cero');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
export const N=n=>({op:'n',n:Number(n)}),V=v=>({op:'v',v}),neg=a=>({op:'neg',a}),add=(a,b)=>({op:'+',a,b}),sub=(a,b)=>({op:'-',a,b}),frac=(a,b)=>({op:'/',a,b}),mul=(a,b,brackets=false)=>({op:'*',a,b,brackets}),pow=a=>({op:'square',a});
const mono=(c,v='',p=0)=>({c,v:c.n===0n?'':v,p:c.n===0n?0:p});
export function evaluate(t){
 if(t.op==='n')return mono(rat(t.n));if(t.op==='v')return mono(rat(1),t.v,1);
 const a=evaluate(t.a),b=t.b?evaluate(t.b):null;
 if(t.op==='neg')return mono(rat(-a.c.n,a.c.d),a.v,a.p);
 if(t.op==='square')return mono(rat(a.c.n*a.c.n,a.c.d*a.c.d),a.v,a.p*2);
 if(t.op==='+'||t.op==='-'){if(a.v!==b.v||a.p!==b.p)throw Error('Suma simbólica no soportada');return mono(rat(a.c.n*b.c.d+(t.op==='+'?1n:-1n)*b.c.n*a.c.d,a.c.d*b.c.d),a.v,a.p);}
 if(a.v&&b.v&&a.v!==b.v)throw Error('Variables diferentes');
 const c=t.op==='*'?rat(a.c.n*b.c.n,a.c.d*b.c.d):rat(a.c.n*b.c.d,a.c.d*b.c.n);
 return mono(c,a.v||b.v,t.op==='*'?a.p+b.p:a.p-b.p);
}
export const key=x=>`${x.c.n}/${x.c.d}:${x.v}:${x.p}`;
export const equal=(a,b)=>key(a)===key(b);
export const expressionKey=t=>{const normalized=x=>{if(!x.a)return x;const a=normalized(x.a),b=x.b?normalized(x.b):null;if(b?.op==='n'&&b.n<0&&(x.op==='+'||x.op==='-'))return {op:x.op==='+'?'-':'+',a,b:N(-b.n)};return {...x,a,...(b?{b}:{})};};return JSON.stringify(normalized(t));};
export function answerExpression(x,forceFraction=false){
 if(!x.v&&x.c.d===1n&&!forceFraction)return N(x.c.n);
 const abs=x.c.n<0n?-x.c.n:x.c.n;
 let n=x.v?(x.p===2?pow(V(x.v)):V(x.v)):N(abs);
 if(x.v&&abs!==1n){if(x.c.d===1n&&!forceFraction)return mul(N(x.c.n),n);n=mul(N(abs),n);}
 if(x.c.d!==1n||forceFraction)n=frac(n,N(x.c.d));
 if(x.c.n<0n)n=neg(n);return n;
}
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),pick=(r,a)=>a[int(r,0,a.length-1)];
export function shuffle(r,list){list=[...list];for(let i=list.length-1;i>0;i--){const j=int(r,0,i);[list[i],list[j]]=[list[j],list[i]];}return list;}
function choiceSet(r,correct,candidates,forceFraction=false){
 const target=evaluate(correct),options=[{expression:correct,correct:true}],seen=new Set([key(target)]);
 function push(expression){const k=key(evaluate(expression));if(!seen.has(k)){options.push({expression,correct:false});seen.add(k);}}
 for(const c of candidates){if(options.length===4)break;push(c);}
 for(let i=1;options.length<4;i++)push(answerExpression(mono(rat(target.c.n+BigInt(i)*target.c.d,target.c.d),target.v,target.p),forceFraction));
 return shuffle(r,options);
}
function numericStep(r,expression,forceFraction=false){
 const value=evaluate(expression),a=value.c;
 const candidates=[mono(rat(-a.n,a.d),value.v,value.p),mono(rat(a.n+a.d,a.d),value.v,value.p),mono(rat(a.n-a.d,a.d),value.v,value.p),mono(rat(a.n*2n,a.d),value.v,value.p)];
 if(a.n&&forceFraction)candidates.unshift(mono(rat(a.d,a.n),value.v,value.p));
 return {prompt:'Elige el resultado simplificado.',options:choiceSet(r,answerExpression(value,forceFraction),candidates.map(x=>answerExpression(x,forceFraction)),forceFraction),expected:value};
}
function signedSumProblem(r,different){
 const size=different?2:int(r,2,3),den=int(r,1,10),parts=[];
 for(let i=0;i<size;i++){
  let d=different&&i===1?int(r,1,9):den;if(different&&i===1&&d>=den)d++;
  parts.push({n:int(r,1,12),d,ns:pick(r,[-1,1]),ds:pick(r,[-1,1]),operation:i?pick(r,[-1,1]):1});
 }
 // Cada problema de signos contiene al menos un signo negativo visible.
 if(parts.every(p=>p.ns===1&&p.ds===1&&p.operation===1))parts[0].ns=-1;
 let expression=null;
 for(const p of parts){const f=frac(N(p.n*p.ns),N(p.d*p.ds));expression=expression?(p.operation===1?add(expression,f):sub(expression,f)):f;}
 const denominator=different?parts[0].d*parts[1].d:den;
 const signed=parts.map(p=>p.n*p.ns*p.ds*p.operation);
 // En denominadores distintos se dejan visibles los productos cruzados.
 const arrange=values=>values.reduce((a,value,i)=>{
  const term=different?mul(N(Math.abs(value)),N(parts[1-i].d)):N(Math.abs(value));
  if(i===0)return different?mul(N(value),N(parts[1-i].d)):N(value);
  return value<0?sub(a,term):add(a,term);
 },null);
 const numerator=arrange(signed);
 const arranged=frac(numerator,N(denominator));
 const wrong=[];
 for(let i=0;i<signed.length;i++){const changed=[...signed];changed[i]*=-1;wrong.push(frac(arrange(changed),N(denominator)));}
 wrong.push(frac(numerator,N(denominator+1)),frac(arrange(signed.map(Math.abs)),N(denominator)));
 for(const offset of [-2,-1,1,2]){const changed=[...signed];changed[0]+=offset;wrong.push(frac(arrange(changed),N(denominator)));}
 return {expression,parts,steps:[{prompt:'Reacomoda en una sola fracción con denominador positivo.',options:choiceSet(r,arranged,wrong),expected:evaluate(arranged)},numericStep(r,expression,true)],explanation:different?'Pasa los signos al numerador y usa el producto de los denominadores como denominador común. Multiplica cada numerador por el denominador de la otra fracción.':'Pasa los signos de los denominadores al numerador. Después reúne los numeradores respetando las sumas y restas.'};
}
export function generate(id,r=Math.random){
 if(id===46)return remainderProblem(r);
 if(id>=43&&id<=45)return divisionProblem(id,r);
 if(id>=36&&id<=42)return verbalProblem(id,r);
 if(id>=30&&id<=35)return advancedEquation(id,r);
 if(id>=26&&id<=29)return algebraFractionProblem(id,r);
 if(id>=23&&id<=25)return factorProblem(id,r);
 if(id>=18&&id<=22)return equationProblem(id,r);
 if(id>=12&&id<=17)return substitutionProblem(id,r);
 let expression,meta={},explanation='';
 if(id===1){const a=int(r,0,20),b=int(r,0,20);expression=add(N(a),N(b));meta={a,b};explanation='Suma las dos cantidades.';}
 else if(id===2){let a=int(r,0,20),b=int(r,0,19);if(b>=a)b++;[a,b]=[Math.max(a,b),Math.min(a,b)];expression=sub(N(a),N(b));meta={a,b};explanation='Resta el menor al mayor. El resultado es positivo.';}
 else if(id===3){let a=int(r,-20,20),b=int(r,-20,20);const subtract=r()<.5;if(a>=0&&b>=0){if(subtract&&b>a){}else a=-int(r,1,20);}expression=subtract?sub(N(a),N(b)):add(N(a),N(b));meta={a,b,subtract};explanation='Sumar un negativo resta su magnitud; restar un negativo equivale a sumar su positivo.';}
 else if(id===4){
  const symbolic=r()<.6,v=pick(r,['a','x','m','t']),n=int(r,1,6),base=symbolic?(n===1?V(v):mul(N(n),V(v))):N(n),family=int(r,0,5);meta={family,symbolic,n,v};
  if(family===0)expression=neg(neg(base));
  if(family===1)expression=neg(neg(neg(base)));
  if(family===2)expression=pow(neg(base));
  if(family===3)expression=neg(pow(base));
  if(family===4)expression=neg(sub(N(n),N(int(r,1,15))));
  if(family===5)expression=neg(add(N(-n),N(int(r,1,15))));
  explanation='Cada par de signos negativos se convierte en positivo. En (−a)² se eleva todo el paréntesis; en −a², el signo exterior permanece.';
 }
 else if(id===5){
  let a=int(r,1,12),b=int(r,2,15);const reduced=rat(a,b);a=Number(reduced.n);b=Number(reduced.d);const factor=int(r,2,9),signs=int(r,1,3),spots=shuffle(r,[0,1,2]).slice(0,signs);expression=frac(N(spots.includes(0)?-a*factor:a*factor),N(spots.includes(1)?-b*factor:b*factor));if(spots.includes(2))expression=neg(expression);meta={a,b,factor,signs};explanation=`Los signos negativos se cancelan por pares. Divide numerador y denominador entre ${factor} para reducir la fracción.`;
 }
 else if(id===6){const d=int(r,2,12),numerators=Array.from({length:int(r,2,3)},()=>int(r,1,12));expression=numerators.map(n=>frac(N(n),N(d))).reduce(add);meta={d,numerators};explanation='Suma los numeradores y conserva el denominador. Al final reduce la fracción.';}
 else if(id===7||id===9){const p=signedSumProblem(r,id===9);return {...p,id:expressionKey(p.expression),level:id};}
 else if(id===8){const d1=int(r,2,10);let d2=int(r,2,9);if(d2>=d1)d2++;const n1=int(r,1,12),n2=int(r,1,12);expression=add(frac(N(n1),N(d1)),frac(N(n2),N(d2)));meta={d1,d2,n1,n2};explanation='Convierte las fracciones a un denominador común, suma los numeradores y simplifica.';}
 else if(id===10||id===11){
  const a=int(r,1,20),b=int(r,1,20),c=int(r,1,20),d=int(r,1,20);let left=frac(N(a),N(b)),right=frac(N(c),N(d));
  if(id===11){const form=int(r,0,2);if(form===1)left=N(a);if(form===2)right=N(c);if(r()<.5)left=neg(left);if(r()<.5)right=neg(right);}
  expression=mul(left,right,id===11);meta={a,b,c,d};explanation='Multiplica numeradores y denominadores y simplifica. Un entero puede escribirse con denominador 1. Los signos negativos se cancelan por pares.';
 }else throw Error('Nivel no encontrado');
 const step=numericStep(r,expression,id>=5);
 // Distractores de signos simbólicos: distinguir a, a² y sus opuestos.
 if(id===4&&step.expected.v){const x=step.expected,alternatives=[mono(rat(-x.c.n,x.c.d),x.v,x.p),mono(x.c,x.v,x.p===2?1:2),mono(rat(-x.c.n,x.c.d),x.v,x.p===2?1:2)];step.options=choiceSet(r,answerExpression(x),alternatives.map(a=>answerExpression(a)));}
 return {id:expressionKey(expression),level:id,expression,meta,steps:[step],explanation};
}
export function substitute(t,x){
 if(t.op==='v')return N(x);
 return {...t,...(t.a?{a:substitute(t.a,x)}:{}),...(t.b?{b:substitute(t.b,x)}:{})};
}
function substitutionProblem(id,r){
 const signed=[13,14,16,17].includes(id),x=signed?int(r,1,5)*(r()<.7?-1:1):int(r,1,6);
 const a=int(r,1,4),b=int(r,1,6),c=int(r,1,5),d=int(r,2,8),X=V('x');
 const linear=(co=a,constant=b)=>add(mul(N(co),X),N(constant));
 const family=int(r,0,id===14?5:id===12||id===13?6:2);
 let expression;
 if(id===12){expression=[mul(N(a),X),linear(),add(pow(X),mul(N(a),X)),add(add(mul(N(a),pow(X)),mul(N(b),X)),N(c)),frac(X,N(d)),frac(add(X,N(b)),N(d)),pow(X)][family];}
 if(id===13){expression=[mul(N(-a),X),sub(mul(N(a),X),N(b)),add(neg(X),N(b)),sub(pow(X),mul(N(a),X)),frac(sub(X,N(b)),N(d)),add(sub(mul(N(a),pow(X)),mul(N(b),X)),N(-c)),neg(add(X,N(b)))][family];}
 if(id===14){expression=[add(sub(mul(N(a),pow(X)),mul(N(b),X)),N(c)),neg(pow(add(X,N(b)))),frac(sub(mul(N(a),X),N(b)),N(d)),frac(sub(pow(X),mul(N(b),X)),N(d)),mul(N(-a),pow(sub(X,N(c)))),frac(sub(pow(sub(X,N(c))),N(b)),N(d))][family];}
 if(id===15||id===16){
  const co=id===16?-a:a,constant=id===16?-b:b;
  const numerator=family===1?N(id===16?-c:c):linear(co,constant);
  let denominator=family===0?N(d):add(X,N(id===16?-c:c));
  if(evaluate(substitute(denominator,x)).c.n===0n)denominator=add(X,N(c+6));
  expression=frac(numerator,denominator);
 }
 if(id===17){
  const count=int(r,2,3),terms=Array.from({length:count},()=>frac(linear(int(r,1,4)*(r()<.5?-1:1),int(r,1,6)*(r()<.5?-1:1)),N(d)));
  expression=terms.reduce((left,right)=>r()<.5?add(left,right):sub(left,right));
 }
 const resolved=substitute(expression,x),step=numericStep(r,resolved,false);
 step.prompt='Sustituye el valor de x y elige el resultado simplificado.';
 return {id:expressionKey(expression)+':x='+x,level:id,expression,substitution:x,resolved,meta:{family},steps:[step],explanation:`Sustituye cada x por ${x}${x<0?' entre paréntesis':''}. Resuelve paréntesis y potencias, luego multiplicaciones y divisiones, y finalmente sumas y restas. Simplifica la fracción si es necesario.`};
}
export function makeRun(level,r=Math.random,excluded=[]){
 if(level.id>=23&&level.id<=25)return factorRun(level,r,excluded);
 const problems=[],seen=new Set(excluded);let tries=0;
 while(problems.length<level.count&&tries++<10000){const p=generate(level.id,r);if(!seen.has(p.id)){seen.add(p.id);problems.push(p);}}
 if(problems.length!==level.count)throw Error('No se pudieron generar problemas nuevos. Intenta comenzar otra vez.');
 return problems;
}

// Una ecuación conserva sus dos miembros; nunca se evalúa como una expresión.
const equation=(a,b)=>({op:'=',a,b});
const term=(a,v)=>a===1?V(v):a===-1?neg(V(v)):mul(N(a),V(v));
function equationProblem(id,r){
 if(id===22)return symbolicEquation(r);
 const signed=id>=20,x=int(r,1,id===18?12:10)*(signed&&r()<.5?-1:1);
 let a=int(r,2,6)*(signed&&r()<.5?-1:1),b=int(r,1,12)*(signed&&r()<.5?-1:1);
 if(id===18){if(r()<.5)b=0;else a=1;}
 if(id>=20&&a>0&&b>0&&x>0)b=-b;
 const c=a*x+b,ax=term(a,'x');let left=b?add(ax,N(b)):ax,right=N(c);
 const order=id===21?int(r,0,3):0;
 if(order===1)left=a<0?sub(N(b),term(-a,'x')):add(N(b),ax);
 if(order===2)[left,right]=[right,left];
 if(order===3){left=N(c);right=a<0?sub(N(b),term(-a,'x')):add(N(b),ax);}
 const expression=equation(left,right),step=numericStep(r,N(x));step.prompt='¿Cuánto vale x?';
 return {id:expressionKey(expression),level:id,expression,resolved:N(x),meta:{a,b,c,x,order},steps:[step],explanation:`El coeficiente de x es ${a}. ${b?`Resta ${b<0?'('+b+')':b} en ambos lados y después divide entre ${a}.`:`Divide ambos lados entre ${a}.`} Así obtienes x = ${x}.`};
}
// Forma canónica exacta: (u + v·letra)/(d·parametro), con d positivo.
export function algebraKey({u,v,d,parameter=''}){const a=rat(u,d),b=rat(v,d);return `${a.n}/${a.d}:${b.n}/${b.d}:${parameter}`;}
function algebraExpression({u,v,d,letter,parameter}){
 if(d<0){u=-u;v=-v;d=-d;}const g=Number(gcd(gcd(BigInt(u),BigInt(v)),BigInt(d)));u/=g;v/=g;d/=g;
 let numerator=v===0?N(u):u===0?term(v,letter):v<0?sub(N(u),term(-v,letter)):add(N(u),term(v,letter));
 const denominator=parameter?(d===1?V(parameter):term(d,parameter)):N(d);
 return !parameter&&d===1?numerator:frac(numerator,denominator);
}
function symbolicEquation(r){
 const letter=pick(r,['b','c','m','n']),parameter=r()<.35?'a':'',factor=int(r,1,3);
 const a=int(r,1,5)*(r()<.5?-1:1),b=int(r,1,5)*(r()<.5?-1:1),c=int(r,1,10);
 const coefficient=parameter?(a*factor===1?V('a'):mul(N(a*factor),V('a'))):N(a*factor);
 const ax=parameter?mul(coefficient,V('x')):term(a*factor,'x');
 let left=b<0?sub(ax,term(-b*factor,letter)):add(ax,term(b*factor,letter)),right=N(c*factor);
 if(r()<.5)[left,right]=[right,left];
 const correct={u:c,v:-b,d:a,letter,parameter};
 const candidates=[correct,{...correct,v:b},{...correct,u:-c},{...correct,d:-a},{...correct,u:c+a},{...correct,u:c+2*a}];
 const seen=new Set(),options=[];for(const candidate of candidates){const k=algebraKey(candidate);if(seen.has(k))continue;seen.add(k);options.push({expression:algebraExpression(candidate),correct:options.length===0,algebra:candidate});if(options.length===4)break;}
 const expression=equation(left,right);
 return {id:expressionKey(expression),level:22,expression,condition:parameter?'Supón que a ≠ 0.':'',meta:{a:a*factor,b:b*factor,c:c*factor,letter,parameter},steps:[{prompt:'¿Cuánto vale x?',options:shuffle(r,options),algebra:correct}],explanation:'Resta el término que no contiene x en ambos lados. Divide entre el coeficiente de x y cancela los factores comunes. Las otras letras se conservan como constantes.'};
}
