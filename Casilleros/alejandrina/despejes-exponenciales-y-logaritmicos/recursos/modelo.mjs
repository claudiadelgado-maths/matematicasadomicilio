export const types = [
  'Exponenciales directas', 'Igualación de bases', 'Exponenciales con logaritmos',
  'Coeficientes y base e', 'Logaritmos directos', 'Logaritmos con expresiones', 'Logaritmos naturales'
];
const number = value => String(value).replace('-', '−').replace('.', ',');
export const format = value => number(Number(value.toFixed(2)));
const n = value => value < 0 ? `<mrow><mo>−</mo><mn>${number(-value)}</mn></mrow>` : `<mn>${number(value)}</mn>`;
const x = '<mi>x</mi>', equal = '<mo>=</mo>', minus = '<mo>−</mo>', plus = '<mo>+</mo>';
const row = (...pieces) => `<mrow>${pieces.join('')}</mrow>`;
const power = (base, exponent) => `<msup>${typeof base==='number'?n(base):base}${exponent}</msup>`;
const frac = (a,b) => `<mfrac>${a}${b}</mfrac>`;
const paren = expression => row('<mo>(</mo>',expression,'<mo>)</mo>');
const ln = expression => row('<mi mathvariant="normal">ln</mi>',paren(expression));
const log = (base,expression) => row(`<msub><mi mathvariant="normal">log</mi>${n(base)}</msub>`,paren(expression));
const e = '<mi mathvariant="normal">e</mi>';
const linear = (m,c) => row(m===1?x:m===-1?row(minus,x):row(n(m),x), c===0?'':row(c<0?minus:plus,n(Math.abs(c))));
const linearText = (m,c) => `${m===1?'':m===-1?'−':number(m)}x${c===0?'':`${c<0?' − ':' + '}${number(Math.abs(c))}`}`;
const math = (markup,label) => `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="${label}">${markup}</math>`;
const formula = (markup) => `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">${markup}</math>`;
const step = (label,markup) => ({label,math:formula(markup)});

// Siete casos por tipo: cinco de práctica y dos exclusivos del desafío.
const parameters = [
  [[2,5],[3,3],[5,2],[4,3],[10,2],[2,7],[3,4]],
  [[3,2,-1,4],[2,3,1,7],[5,2,2,3],[4,2,-3,2],[2,4,-2,0],[3,4,1,3],[5,3,-2,4]],
  [[5,18,1],[2,7,1],[3,20,1],[10,6,1],[4,13,1],[7,30,1],[3,1,7]],
  [[4,2,0,28],[3,1,0,18],[2,3,0,10],[5,2,-1,20],[6,1,2,12],[7,2,0,35],[2,3,1,18]],
  [[2,4],[3,3],[5,2],[10,-1],[9,0.5],[4,3],[5,-1]],
  [[3,2,1,3],[2,3,-2,4],[5,2,3,2],[4,3,1,2],[10,2,-5,1],[2,5,2,5],[3,4,-1,2]],
  [[1,-2,1.5],[1,3,2],[2,1,1],[3,-4,0.5],[2,-3,-1],[1,-5,1.2],[4,2,0.8]]
];

function build(type,index,p) {
  let value,equation,label,steps,domain=null,residual;
  const solution = (exact) => step('Escribe el valor de x; redondea a dos decimales si hace falta.',row(x,equal,exact, '<mo>≈</mo>',n(Number(value.toFixed(2)))));
  if(type===0) {
    const [base,exponent]=p, rhs=base**exponent;value=exponent;
    equation=row(power(base,x),equal,n(rhs));label=`${base} elevado a x es igual a ${rhs}`;
    steps=[step('Expresa el segundo miembro como una potencia de la misma base.',row(power(base,x),equal,power(base,n(exponent)))),step('Iguala los exponentes.',row(x,equal,n(value)))];
    residual=v=>base**v-rhs;
  } else if(type===1) {
    const [base,m,c,k]=p,rhs=base**k;value=(k-c)/m;
    equation=row(power(base,linear(m,c)),equal,n(rhs));label=`${base} elevado a (${linearText(m,c)}) es igual a ${rhs}`;
    steps=[step('Reescribe el segundo miembro con la misma base.',row(power(base,linear(m,c)),equal,power(base,n(k)))),step('Iguala los exponentes.',row(linear(m,c),equal,n(k))),step('Aísla el término que contiene x.',row(n(m),x,equal,n(k-c))),step('Divide entre el coeficiente de x.',row(x,equal,frac(n(k-c),n(m)),equal,n(value)))];
    residual=v=>base**(m*v+c)-rhs;
  } else if(type===2) {
    const [base,a,b]=p,rhs=a/b,rhsMath=b===1?n(a):frac(n(a),n(b));value=Math.log(rhs)/Math.log(base);
    equation=row(power(base,x),equal,rhsMath);label=`${base} elevado a x es igual a ${b===1?a:`${a} entre ${b}`}`;
    steps=[step('Aplica logaritmo natural a ambos miembros.',row(ln(power(base,x)),equal,ln(rhsMath))),step('Baja el exponente como factor.',row(x,ln(n(base)),equal,ln(rhsMath))),solution(frac(ln(rhsMath),ln(n(base))))];
    residual=v=>base**v-rhs;
  } else if(type===3) {
    const [a,m,c,rhs]=p,ratio=rhs/a;value=(Math.log(ratio)-c)/m;
    equation=row(n(a),power(e,linear(m,c)),equal,n(rhs));label=`${a} por e elevado a (${linearText(m,c)}) es igual a ${rhs}`;
    const numerator=c===0?ln(n(ratio)):row(ln(n(ratio)),c<0?plus:minus,n(Math.abs(c)));
    steps=[step('Divide ambos miembros entre el coeficiente exterior.',row(power(e,linear(m,c)),equal,frac(n(rhs),n(a)),equal,n(ratio))),step('Aplica ln; el logaritmo natural cancela la base e.',row(linear(m,c),equal,ln(n(ratio)))),solution(m===1?numerator:frac(numerator,n(m)))];
    residual=v=>a*Math.exp(m*v+c)-rhs;
  } else if(type===4) {
    const [base,k]=p;value=base**k;equation=row(log(base,x),equal,n(k));label=`Logaritmo base ${base} de x es igual a ${number(k)}`;domain={m:1,c:0};
    steps=[step('Comprueba el dominio del logaritmo.',row(x,'<mo>&gt;</mo>',n(0))),step('Pasa a la forma exponencial.',row(x,equal,power(base,n(k)))),step('Calcula la potencia.',row(x,equal,n(value)))];
    residual=v=>Math.log(v)/Math.log(base)-k;
  } else if(type===5) {
    const [base,m,c,k]=p,result=base**k;value=(result-c)/m;domain={m,c};
    equation=row(log(base,linear(m,c)),equal,n(k));label=`Logaritmo base ${base} de (${linearText(m,c)}) es igual a ${number(k)}`;
    steps=[step('El argumento del logaritmo debe ser positivo.',row(linear(m,c),'<mo>&gt;</mo>',n(0))),step('Pasa a la forma exponencial.',row(linear(m,c),equal,power(base,n(k)),equal,n(result))),step('Aísla x.',row(x,equal,frac(n(result-c),n(m)),equal,n(value))),step('Comprueba el dominio con la solución.',row(n(m),'<mo>·</mo>',paren(n(value)),c<0?minus:plus,n(Math.abs(c)),equal,n(result),'<mo>&gt;</mo>',n(0)))];
    residual=v=>Math.log(m*v+c)/Math.log(base)-k;
  } else {
    const [m,c,k]=p;value=(Math.exp(k)-c)/m;domain={m,c};
    equation=row(ln(linear(m,c)),equal,n(k));label=`Logaritmo natural de (${linearText(m,c)}) es igual a ${number(k)}`;
    const numerator=c===0?power(e,n(k)):row(power(e,n(k)),c<0?plus:minus,n(Math.abs(c)));
    steps=[step('El argumento del logaritmo debe ser positivo.',row(linear(m,c),'<mo>&gt;</mo>',n(0))),step('Eleva e a ambos miembros.',row(linear(m,c),equal,power(e,n(k)))),solution(m===1?numerator:frac(numerator,n(m))),step('La solución exacta cumple el dominio.',row(linear(m,c),equal,power(e,n(k)),'<mo>&gt;</mo>',n(0)))];
    residual=v=>Math.log(m*v+c)-k;
  }
  return {id:`${type+1}-${index+1}`,type,value,equation:math(equation,label),label,steps,domain,residual};
}
const all=parameters.flatMap((items,type)=>items.map((p,index)=>build(type,index,p)));
export const practice=all.filter(item=>Number(item.id.split('-')[1])<=5);
export const challenge=all.filter(item=>Number(item.id.split('-')[1])>5);
export function shuffled(items,random=Math.random) {const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export function mixedChallenge(random=Math.random) {
  for(let i=0;i<80;i++){const mixed=shuffled(challenge,random);if(mixed.every((q,j)=>j===0||q.type!==mixed[j-1].type))return mixed;}
  const order=shuffled([0,1,2,3,4,5,6],random);
  return [0,1].flatMap(index=>order.map(type=>challenge.filter(q=>q.type===type)[index]));
}
export function parseAnswer(raw) {
  const text=String(raw).trim().replace('−','-');
  if(!/^[+-]?(?:\d+(?:[.,]\d{1,2})?|[.,]\d{1,2})$/.test(text))return null;
  const value=Number(text.replace(',','.'));return Number.isFinite(value)?value:null;
}
export function checkAnswer(item,raw) {
  const value=parseAnswer(raw);
  if(value===null)return {valid:false,correct:false};
  const domain=!item.domain||item.domain.m*value+item.domain.c>0;
  const rounded=Number(item.value.toFixed(2));
  return {valid:true,correct:domain&&Math.abs(value-rounded)<1e-9,domain};
}
export function createRound(items) {
  const records=items.map(item=>({item,attempts:0,solved:false,help:false,answer:''}));
  return {
    records,
    submit(index,raw) {
      const record=records[index];if(!record||record.solved)return {ignored:true};
      const result=checkAnswer(record.item,raw);if(!result.valid)return result;
      record.attempts++;record.answer=String(raw);record.solved=result.correct;return result;
    },
    useHelp(index){if(records[index])records[index].help=true;},
    get solved(){return records.filter(r=>r.solved).length;},
    get firstTry(){return records.filter(r=>r.solved&&r.attempts===1).length;},
    get errors(){return records.reduce((sum,r)=>sum+r.attempts-(r.solved?1:0),0);},
    get complete(){return records.every(r=>r.solved);}
  };
}
