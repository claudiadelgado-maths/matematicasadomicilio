import {q,N,V,A,S,M,D,P,evaluate,same,add,neg,render} from '../recursos/matematicas.mjs';
export const categories={mix:'Mezcla todo',sum:'Suma y resta',tables:'Tablas',multiply:'Multiplicación',divide:'División',fractions:'Fracciones',powers:'Potencias',scientific:'Notación científica',formulas:'Fórmulas',substitution:'Sustitución'};
export const levels={easy:'Fácil',medium:'Medio',hard:'Difícil'};
const pick=(rng,a)=>a[Math.floor(rng()*a.length)],int=(rng,a,b)=>a+Math.floor(rng()*(b-a+1));
export function shuffle(rng,a){a=[...a];for(let i=a.length-1;i>0;i--){const j=int(rng,0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
const a=V('a'),b=V('b'),c=V('c'),d=V('d'),n=V('n');
export const rules=[
  {name:'Suma de fracciones',expression:A(D(a,b),D(c,d)),result:D(A(M(a,d),M(b,c)),M(b,d)),note:'Puedes simplificar después o elegir un denominador común menor. b y d deben ser distintos de cero.'},
  {name:'Resta de fracciones',expression:S(D(a,b),D(c,d)),result:D(S(M(a,d),M(b,c)),M(b,d)),note:'Resta todo el segundo producto. b y d deben ser distintos de cero.'},
  {name:'Multiplicación de fracciones',expression:M(D(a,b),D(c,d)),result:D(M(a,c),M(b,d)),note:'Multiplica numeradores y denominadores. b y d deben ser distintos de cero.'},
  {name:'División de fracciones',expression:D(D(a,b),D(c,d)),intermediate:M(D(a,b),D(d,c)),result:D(M(a,d),M(b,c)),note:'Multiplica por el recíproco de la segunda fracción. b, c y d deben ser distintos de cero.'},
  {name:'Entero como fracción',expression:n,result:D(n,N(1)),note:'El denominador 1 conserva el valor.'},
  {name:'Simplificación',expression:D(N(18),N(24)),intermediate:D(D(N(18),N(6)),D(N(24),N(6))),result:N(q(3,4)),note:'Divide numerador y denominador entre el mismo número no nulo.'}
];
export const reference=[...rules,
  {name:'Producto de potencias',expression:M(P(a,V('m')),P(a,n)),result:P(a,A(V('m'),n)),note:'Suma exponentes de la misma base.'},
  {name:'Cociente de potencias',expression:D(P(a,V('m')),P(a,n)),result:P(a,S(V('m'),n)),note:'Resta exponentes. a ≠ 0.'},
  {name:'Potencia de potencia',expression:P(P(a,V('m')),n),result:P(a,M(V('m'),n)),note:'Multiplica exponentes.'},
  {name:'Exponente cero',expression:P(a,0),result:N(1),note:'Siempre que a ≠ 0.'},
  {name:'Notación científica',expression:M(a,P(N(10),n)),note:'Forma normalizada: 1 ≤ |a| < 10, con n entero. El cero se escribe 0 × 10⁰.'}
];
function formulaQuestion(rng){const i=int(rng,0,5),rule=rules[i];
  if(i===3&&rng()<.5)return {prompt:'¿A qué operación corresponde multiplicar por el recíproco?',expression:rule.intermediate,options:rules.slice(0,4).map((r,i)=>({label:r.name,correct:i===3})),solution:[rule.expression,rule.intermediate,rule.result],note:rule.note};
  const candidates=i===4?[rule.result,D(N(1),n),D(n,n),D(n,N(2))]:i===5?[rule.result,N(q(4,3)),N(q(2,3)),N(q(3,8))]:[rule.result,...rules.slice(0,4).filter((r,j)=>j!==i).map(r=>r.result)];
  return {prompt:i===5?'¿Cuál es la fracción simplificada?':i===4?'¿Cómo escribes un entero como fracción?':'Completa la regla.',expression:rule.expression,options:candidates.map((expression,i)=>({expression,correct:i===0})),solution:[rule.expression,...(rule.intermediate?[rule.intermediate]:[]),rule.result],note:rule.note};
}
function build(rng,category,level,table){
  const k=['easy','medium','hard'].indexOf(level);let expression,solution=[],prompt='Calcula.',distractors=[],values=null,note='',expected=null,sciOptions=false;
  if(category==='formulas')return formulaQuestion(rng);
  if(category==='sum'){const a=int(rng,k?10:2,k===2?150:k?90:35)*(rng()<.2?-1:1),b=int(rng,2,k?50:20);expression=(rng()<.5?A:S)(N(a),N(b));distractors=[q(a+b),q(a-b),q(b-a),q(a+b+10)];}
  if(category==='tables'){const a=table==='all'?int(rng,2,10):Number(table),b=int(rng,1,10);expression=M(N(a),N(b));distractors=[q(a*(b+1)),q(a*(b-1)),q(a+b)];}
  if(category==='multiply'){const a=int(rng,k===2?12:3,k===2?45:9),b=k===2?int(rng,12,30):k===1?int(rng,12,35):pick(rng,[int(rng,2,10),20,30,50]);expression=M(N(a),N(b));distractors=[q(a+b),q(a*(b-1)),q(a*(b+1))];if(b>=12)solution=[expression,A(M(N(a),N(Math.floor(b/10)*10)),M(N(a),N(b%10)))];}
  if(category==='divide'){let a,b;if(k===0||rng()<.35){b=int(rng,2,k?15:10);a=b*int(rng,2,k?15:12);}else{const g=int(rng,2,k===2?7:4);a=int(rng,3,k===2?16:9)*g;b=int(rng,3,k===2?12:8)*g;}expression=D(N(a),N(b));distractors=[q(b,a),q(a,b+1),q(a-1,b)];prompt='Calcula y simplifica.';}
  if(category==='fractions'){
    const v=int(rng,0,k?4:3),b=int(rng,2,k===2?12:8),d=k===0?b:k===1?b*2:pick(rng,[3,4,6,8,10,12]);const a=int(rng,1,b-1),c=int(rng,1,d-1);
    if(v===3&&k===0){expression=D(N(a*2),N(b*2));prompt='Simplifica.';}
    else if(v===2){expression=M(N(int(rng,2,7)),D(N(a),N(b)));solution=[expression,D(M(expression.a,N(a)),N(b))];}
    else if(v===4){expression=D(D(N(a),N(b)),D(N(c),N(d)));solution=[expression,M(D(N(a),N(b)),D(N(d),N(c)))];}
    else{const op=v===0?A:v===1?S:M;expression=op(D(N(a),N(b)),D(N(c),N(d)));if(v<2){solution=[expression,b===d?D((v===0?A:S)(N(a),N(c)),N(b)):D((v===0?A:S)(N(a*d),N(c*b)),N(b*d))];}else solution=[expression,D(M(N(a),N(c)),M(N(b),N(d)))];}
    distractors=[q(a+c,b+d),q(a*c,b*d),q(a*d+c*b,b*d),q(a*d-c*b,b*d)];
  }
  if(category==='powers'){
    const a=pick(rng,k===0?[2,3,4,10]:[-3,2,3,4,5,10]),b=int(rng,2,3);
    if(k===0)expression=P(N(a),b);
    else if(k===1){expression=rng()<.35?P(N(10),-int(rng,1,3)):P(N(a),b);distractors=[neg(evaluate(expression)),q(a*b)];}
    else{const v=int(rng,0,3),a=pick(rng,[2,3,10]),m=int(rng,2,3),n=int(rng,1,2);expression=v===0?P(P(N(a),m),n):v===1?M(P(N(a),m),P(N(a),n)):v===2?D(P(N(a),m),P(N(a),n)):P(P(N(10),-m),2);solution=[expression,v===0?P(N(a),m*n):v===1?P(N(a),m+n):v===2?P(N(a),m-n):P(N(10),-2*m)];distractors=[evaluate(P(N(a),m+n)),evaluate(P(N(a),m*n)),evaluate(P(N(a),m-n))];}
  }
  if(category==='scientific'){
    const coef=k? q(int(rng,11,95),10):q(int(rng,2,9)),exp=pick(rng,k===0?[-3,-2,2,3]:[-6,-5,-4,-3,4,5,6]),sci=M(N(coef,'decimal'),P(N(10),exp)),val=evaluate(sci),direction=int(rng,0,2);
    if(direction===0){expression=N(val,'decimal');prompt='Escribe en notación científica.';sciOptions=true;expected=val;solution=[expression,sci];distractors=[evaluate(M(N(coef),P(N(10),-exp))),evaluate(M(N(coef),P(N(10),exp+1))),evaluate(M(N(coef),P(N(10),exp-1)))];}
    else if(direction===1){expression=sci;prompt='Escribe como número decimal.';expected=val;solution=[expression,N(val,'decimal')];distractors=[evaluate(M(N(coef),P(N(10),-exp))),evaluate(M(N(coef),P(N(10),exp+1))),evaluate(M(N(coef),P(N(10),exp-1)))];}
    else{return {prompt:'¿Cuál está en notación científica normalizada?',expression:N(val,'decimal'),options:[sci,M(N(q(coef.n*10n,coef.d),'decimal'),P(N(10),exp-1)),M(N(q(coef.n,coef.d*10n),'decimal'),P(N(10),exp+1)),M(N(q(coef.n*100n,coef.d),'decimal'),P(N(10),exp-2))].map((expression,i)=>({expression,correct:i===0})),solution:[N(val,'decimal'),sci],note:'El coeficiente debe cumplir 1 ≤ |a| < 10. Las otras escrituras valen lo mismo, pero no están normalizadas.'};}
  }
  if(category==='substitution'){
    const x=V('x'),y=V('y');values={x:q(int(rng,k?-3:1,4))};
    if(k===0)expression=rng()<.5?M(N(int(rng,2,5)),x):P(x,2);
    else{values.y=q(int(rng,1,k===2?3:5));if(k===2&&rng()<.2)values.x=q(1,2);expression=k===1?(rng()<.5?M(P(x,2),y):A(P(x,2),M(N(2),y))):A(M(P(x,2),P(y,3)),M(N(2),x));}
    expected=evaluate(expression,values);solution=[expression,N(expected)];prompt='Sustituye y calcula.';distractors=[neg(expected),add(expected,q(2)),add(expected,q(-2))];
  }
  expected??=evaluate(expression,values||{});if(!solution.length)solution=[expression];if(!values&&!(solution.at(-1)?.op==='n'&&same(solution.at(-1).value,expected)))solution.push(N(expected,category==='scientific'?'decimal':'fraction'));
  let choices=[expected];for(const v of [...distractors,add(expected,q(1)),add(expected,q(-1)),add(expected,q(10)),add(expected,q(-10))])if(!choices.some(x=>same(x,v))){choices.push(v);if(choices.length===4)break;}
  const scientific=v=>{if(!v.n)return N(v);let c=v,e=0;const abs=n=>n<0n?-n:n;while(abs(c.n)>=10n*c.d){c=q(c.n,c.d*10n);e++;}while(abs(c.n)<c.d){c=q(c.n*10n,c.d);e--;}return M(N(c,'decimal'),P(N(10),e));};
  return {prompt,expression,values,expected,options:choices.map((value,i)=>({value,expression:sciOptions?scientific(value):N(value,category==='scientific'?'decimal':'fraction'),correct:i===0})),solution,note};
}
export function generate(category='mix',level='easy',table='all',rng=Math.random){if(category==='mix'){category=pick(rng,Object.keys(categories).filter(c=>c!=='mix'));table='all';}const p=build(rng,category,level,table);p.category=category;p.level=level;p.options=shuffle(rng,p.options);if(p.options.length!==4||p.options.filter(o=>o.correct).length!==1)throw Error('Pregunta inválida');if(p.expected&&p.options.some((o,i)=>p.options.slice(0,i).some(v=>same(v.value,o.value))))throw Error('Opciones equivalentes');p.id=category+render(p.expression,true)+JSON.stringify(p.values,(_,v)=>typeof v==='bigint'?String(v):v);return p;}
