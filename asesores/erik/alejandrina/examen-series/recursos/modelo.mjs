import {R,add,mul,pow,tex,neg,sub,div} from './fracciones.mjs?v=20260930-series2';
export const pick=(a,r)=>a[Math.floor(r()*a.length)];
export function barajar(list,r=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const termino=(tipo,a,p,n)=>tipo==='aritmetica'?add(a,mul(R(n-1),p)):mul(a,pow(p,n-1));
export function nivel(indice){return indice<3?0:indice<6?1:2;}
export function datos(tipo,indice,r=Math.random){
  const level=nivel(indice);
  const a=level===0?R(pick([2,3,4,5,6],r)):level===1?R(pick([-8,-6,-4,-2,3,5],r)):R(pick([-5,-3,1,3,5],r),pick([2,3,4],r));
  const p=tipo==='aritmetica'?(level===0?R(pick([2,3,4,5],r)):level===1?R(pick([-5,-3,-2,2,4],r)):R(pick([-5,-3,-1,1,3,5],r),pick([2,3,4],r))):level===0?R(pick([2,3],r)):level===1?R(pick([-3,-2,2,3],r)):pick([R(1,2),R(2,3),R(3,2),R(-1,2),R(-3,2),R(-2)],r);
  return {tipo,a,p,n:pick(level===0?[3,4,5]:level===1?[4,5,6]:[5,6,7],r),nivel:level};
}
export function generar(actividad,caso,filtro,indice,r=Math.random){
  const tipo=actividad==='medios'?(caso==='aritmeticos'?'aritmetica':'geometrica'):filtro==='ambas'?pick(['aritmetica','geometrica'],r):filtro,base=datos(tipo,indice,r);
  if(actividad==='identificar')return {...base,enunciado:'¿Qué tipo de sucesión es?',secuencia:Array.from({length:4},(_,i)=>termino(tipo,base.a,base.p,i+1)),opciones:[{id:'aritmetica',texto:'Aritmética'},{id:'geometrica',texto:'Geométrica'}],respuesta:tipo,formulas:[],pasos:[]};
  if(actividad==='diferencia-razon')return parametro(base,caso,r);
  if(actividad==='primer-termino')return primero(base,caso,r);
  if(actividad==='terminos-posiciones')return terminoPosicion(base,caso);
  if(actividad==='sumas')return sumas(base,caso,indice,r);
  if(actividad==='medios')return medios(base,r);
  throw new RangeError('Actividad todavía no implementada');
}
export const paso=(id,respuesta,label=id)=>({id,label,respuesta});
export const dato=(name,value)=>`${name}=${typeof value==='number'?value:tex(value)}`;
export const lista=b=>Array.from({length:4},(_,i)=>termino(b.tipo,b.a,b.p,i+1));
export function indices(b,r){
  // Potencias altas de 2/3 y 3/2 producen fracciones poco prácticas a mano.
  const compactos=b.tipo==='geometrica'&&b.p.d>1n&&(b.p.d===3n||b.p.n===3n||b.p.n===-3n);
  const m=pick(b.nivel===0||compactos?[2,3]:[2,3,4],r),gap=pick(b.nivel===0||compactos?[2,3]:b.nivel===1?[2,3,4]:[3,4,5],r);return {m,j:m+gap};
}
export function condicion(b,gap){return b.tipo==='geometrica'&&gap%2===0?`Halla r ${b.p.n<0n?'negativa':'positiva'}.`:`Halla ${b.tipo==='aritmetica'?'d':'r'}.`;}
export function formulaParametro(b,m,j){
  const ar=b.tipo==='aritmetica',den=m===1?'n-1':'n-m',low=m===1?'a_1':'a_m';
  return ar?`d=\\frac{a_n-${low}}{${den}}`:`r=${(j-m)%2===0&&b.p.n<0n?'-':''}\\sqrt[${den}]{\\frac{a_n}{${low}}}`;
}
function parametro(b,caso,r){
  const symbol=b.tipo==='aritmetica'?'d':'r',q={...b,datos:[],formulas:[],pasos:[paso(symbol,b.p)],enunciado:`Halla ${symbol}.`};
  if(caso==='sucesion'){q.secuencia=lista(b);return q;}
  let m,j;
  if(caso==='consecutivos'){m=pick(b.nivel===0?[2,3,4]:[3,4,5,6],r);j=m+1;}
  else if(caso==='extremos'){m=1;j=b.n;}
  else ({m,j}=indices(b,r));
  q.m=m;q.j=j;q.datos=[dato(`a_{${m}}`,termino(b.tipo,b.a,b.p,m)),dato(`a_{${j}}`,termino(b.tipo,b.a,b.p,j))];q.enunciado=condicion(b,j-m);
  if(caso!=='consecutivos')q.formulas=[formulaParametro(b,m,j)];
  return q;
}
function primero(b,caso,r){
  const ar=b.tipo==='aritmetica',sym=ar?'d':'r',q={...b,enunciado:'Halla el primer término.',datos:[],formulas:[],pasos:[paso('a1',b.a,'a_1')]};
  if(caso==='sucesion'){q.secuencia=lista(b);return q;}
  if(caso==='termino-parametro'){
    q.datos=[dato(`a_{${b.n}}`,termino(b.tipo,b.a,b.p,b.n)),dato('n',b.n),dato(sym,b.p)];
    q.formulas=[ar?'a_1=a_n-(n-1)d':'a_1=\\frac{a_n}{r^{n-1}}'];
  }else{
    const {m,j}=indices(b,r);q.m=m;q.j=j;
    q.datos=[dato(`a_{${m}}`,termino(b.tipo,b.a,b.p,m)),dato(`a_{${j}}`,termino(b.tipo,b.a,b.p,j))];
    q.enunciado=`${condicion(b,j-m)} Después halla el primer término.`;
    q.formulas=[ar?'a_1=a_m-(m-1)d':'a_1=\\frac{a_m}{r^{m-1}}'];q.pasos=[paso(sym,b.p),paso('a1',b.a,'a_1')];q.secuencial=true;
  }return q;
}
function terminoPosicion(base,caso){
  const b={...base},ar=b.tipo==='aritmetica',pos=caso==='posicion',sym=ar?'d':'r';
  if(pos&&!ar&&b.p.n<0n)b.p=neg(b.p);
  const an=termino(b.tipo,b.a,b.p,b.n);
  return {...b,enunciado:pos?'Halla la posición n.':`Halla el término en la posición ${b.n}.`,datos:[dato('a_1',b.a),dato(sym,b.p),pos?dato('a_n',an):dato('n',b.n)],formulas:[pos?(ar?'n=\\frac{a_n-a_1}{d}+1':'n=\\frac{\\ln\\left(\\frac{a_n}{a_1}\\right)}{\\ln(r)}+1'):(ar?'a_n=a_1+(n-1)d':'a_n=a_1r^{n-1}')],pasos:[paso(pos?'n':'an',pos?R(b.n):an,pos?'n':'a_n')]};
}
export const suma=(tipo,a,p,n)=>tipo==='aritmetica'?div(mul(R(n),add(a,termino(tipo,a,p,n))),R(2)):div(mul(a,sub(pow(p,n),R(1))),sub(p,R(1)));
export const formulaSuma=tipo=>tipo==='aritmetica'?'S_n=\\frac{n(a_1+a_n)}{2}':'S_n=\\frac{a_1(r^n-1)}{r-1}';
function sumas(base,caso,indice,r){
  const b={...base},ar=b.tipo==='aritmetica',sym=ar?'d':'r';let m,j;
  const objetivo=caso==='despejes'?(ar?['n','a1','an'][indice%3]:['a1','n'][indice%2]):null;
  if(objetivo==='n'&&!ar&&b.p.n<0n)b.p=neg(b.p);
  if(caso==='dos-terminos'){
    ({m,j}=b.nivel===0?{m:2,j:4}:indices(b,r));b.n=j+1;
  }
  // Una suma cero no determina n mediante el despeje solicitado.
  if(objetivo==='n'&&ar&&suma(b.tipo,b.a,b.p,b.n).n===0n)b.a=add(b.a,R(1));
  const an=termino(b.tipo,b.a,b.p,b.n),sn=suma(b.tipo,b.a,b.p,b.n);
  const q={...b,m,j,objetivo,enunciado:`Halla la suma de los primeros ${b.n} términos.`,datos:[],formulas:[formulaSuma(b.tipo)],pasos:[],secuencial:true};
  const end=[paso('an',an,'a_n'),paso('sn',sn,'S_n')];
  if(caso==='extremos'){
    q.datos=[dato('a_1',b.a),dato('a_n',an),dato('n',b.n)];q.pasos=ar?[paso('sn',sn,'S_n')]:[paso('r',b.p),paso('sn',sn,'S_n')];
    if(!ar)q.enunciado=`${condicion(b,b.n-1)} Después calcula la suma.`;
  }else if(caso==='sucesion'){
    q.secuencia=lista(b);q.datos=[dato('n',b.n)];q.pasos=[paso('a1',b.a,'a_1'),paso(sym,b.p),...end];
  }else if(caso==='dos-terminos'){
    q.datos=[dato(`a_{${m}}`,termino(b.tipo,b.a,b.p,m)),dato(`a_{${j}}`,termino(b.tipo,b.a,b.p,j)),dato('n',b.n)];
    q.enunciado=`${condicion(b,j-m)} Completa los datos para hallar la suma.`;q.pasos=[paso(sym,b.p),paso('a1',b.a,'a_1'),...end];
  }else if(caso==='despejes'){
    q.enunciado=objetivo==='n'?'Halla la cantidad de términos.':objetivo==='a1'?'Halla el primer término.':'Halla el último término.';
    q.datos=[dato('S_n',sn)];q.pasos=[paso(objetivo,objetivo==='n'?R(b.n):objetivo==='a1'?b.a:an,objetivo==='n'?'n':objetivo==='a1'?'a_1':'a_n')];
    if(ar){
      if(objetivo==='n'){q.datos.push(dato('a_1',b.a),dato('a_n',an));q.formulas=['n=\\frac{2S_n}{a_1+a_n}'];}
      else if(objetivo==='a1'){q.datos.push(dato('n',b.n),dato('a_n',an));q.formulas=['a_1=\\frac{2S_n}{n}-a_n'];}
      else {q.datos.push(dato('n',b.n),dato('a_1',b.a));q.formulas=['a_n=\\frac{2S_n}{n}-a_1'];}
    }else{
      q.datos.push(dato('r',b.p),objetivo==='n'?dato('a_1',b.a):dato('n',b.n));
      q.formulas=[objetivo==='n'?'n=\\frac{\\ln\\left(\\frac{S_n(r-1)}{a_1}+1\\right)}{\\ln(r)}':'a_1=\\frac{S_n(r-1)}{r^n-1}'];
    }
  }else if(caso==='intervalo'){
    m=pick(b.nivel===0?[2]:[2,3,4],r);if(b.n<=m)b.n=m+2;q.m=m;q.n=b.n;
    const before=suma(b.tipo,b.a,b.p,m-1),total=suma(b.tipo,b.a,b.p,b.n);
    q.enunciado=`Halla la suma desde la posición ${m} hasta la ${b.n}, incluyendo ambas.`;
    q.datos=[dato('a_1',b.a),dato(sym,b.p),dato('m',m),dato('n',b.n)];
    q.formulas.push('\\text{Suma de }a_m\\text{ a }a_n=S_n-S_{m-1}');
    q.pasos=[paso('sn',total,'S_n'),paso('previa',before,'S_{m-1}'),paso('intervalo',sub(total,before),'S_n-S_{m-1}')];
  }return q;
}
function medios(b,r){
  const k=pick(b.nivel===0?[2,3]:[2,3,4],r),ar=b.tipo==='aritmetica',ambiguo=!ar&&(k+1)%2===0;
  return {...b,n:k+2,enunciado:`Inserta ${k} medios ${ar?'aritméticos':'geométricos'} entre los extremos.${ambiguo?` Usa r ${b.p.n<0n?'negativa':'positiva'}.`:''}`,datos:[dato('k',k)],formulas:[ar?'d=\\frac{b-a}{k+1}':`r=${ambiguo&&b.p.n<0n?'-':''}\\sqrt[k+1]{\\frac{b}{a}}`],medios:{inicio:b.a,fin:termino(b.tipo,b.a,b.p,k+2),k},pasos:Array.from({length:k},(_,i)=>paso(`medio${i+1}`,termino(b.tipo,b.a,b.p,i+2),`a_{${i+2}}`))};
}
