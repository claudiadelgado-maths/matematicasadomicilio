export const CASOS=[
 {id:'lados',nombre:'Tres lados → perímetro'},
 {id:'altura',nombre:'Base y altura → área'},
 {id:'equilatero',nombre:'Equilátero → perímetro'},
 {id:'isosceles',nombre:'Isósceles → perímetro'},
 {id:'rectangulo',nombre:'Rectángulo + Pitágoras'}
];
export const TERNAS=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]];
const pick=(a,r)=>a[Math.floor(r()*a.length)];
export function generar(tipo='mezcla',r=Math.random,variant){
 const id=tipo==='mezcla'?pick(CASOS,r).id:tipo,k=1+Math.floor(r()*3),unit=pick(['cm','m'],r);
 let base,height,left,right,goal='P',hidden=null,explain,steps,title;
 if(id==='rectangulo'){
  const [a,b,c]=pick(TERNAS,r).map(n=>n*k);base=a;left=b;right=c;height=b;
  const mode=variant??Math.floor(r()*4);hidden=mode===0?'right':mode===1||mode===2?'left':null;goal=mode>=2?'A':'P';
  title=goal==='P'?'Encuentra el perímetro del triángulo rectángulo.':'Encuentra el área del triángulo rectángulo.';
  steps=hidden==='right'?[`c² = ${a}² + ${b}² = ${a*a+b*b}`,`c = √${c*c} = ${c} ${unit}`]:hidden==='left'?[`b² = ${c}² − ${a}² = ${b*b}`,`b = √${b*b} = ${b} ${unit}`]:[`Los catetos son perpendiculares: base = ${a} y altura = ${b}.`];
  explain=goal==='P'?`P = ${a} + ${b} + ${c} = ${a+b+c} ${unit}`:`A = (${a} × ${b}) ÷ 2 = ${a*b/2} ${unit}²`;
  steps.push(explain);
 }else if(id==='altura'){
  base=2*(3+Math.floor(r()*10));height=3+Math.floor(r()*14);goal='A';left=null;right=null;
  title='La base y su altura están señaladas. ¿Cuál es el área?';
  steps=[`Base = ${base} ${unit}; altura perpendicular = ${height} ${unit}.`,`Multiplica: ${base} × ${height} = ${base*height}.`,`Divide entre 2: A = ${base*height/2} ${unit}².`];explain=steps.at(-1);
 }else if(id==='equilatero'){
  base=left=right=3+Math.floor(r()*23);height=base*Math.sqrt(3)/2;
  title='Un lado del equilátero está indicado. Encuentra su perímetro.';
  steps=['Las tres marcas iguales indican tres lados iguales.',`P = 3 × ${base} = ${3*base} ${unit}.`];explain=steps.at(-1);
 }else if(id==='isosceles'){
  left=right=5+Math.floor(r()*16);base=3+Math.floor(r()*(2*left-5));if(base===left)base++;
  height=Math.sqrt(left*left-base*base/4);
  title='Las marcas indican dos lados iguales. ¿Cuál es el perímetro?';
  steps=[`Los dos lados con la misma marca miden ${left} ${unit}.`,`La base mide ${base} ${unit}.`,`P = ${left} + ${left} + ${base} = ${2*left+base} ${unit}.`];explain=steps.at(-1);
 }else{
  [base,left,right]=pick([[5,6,7],[6,8,9],[7,10,12],[8,11,13]],r).map(n=>n*k);
  const foot=(left*left+base*base-right*right)/(2*base);height=Math.sqrt(left*left-foot*foot);
  title='Conoces los tres lados. Encuentra el perímetro.';
  steps=['Recorre el contorno completo: suma los tres lados.',`P = ${base} + ${left} + ${right} = ${base+left+right} ${unit}.`];explain=steps.at(-1);
 }
 const foot=id==='rectangulo'?0:id==='altura'?base*(pick([.25,.4,.65],r)):id==='equilatero'||id==='isosceles'?base/2:(left*left+base*base-right*right)/(2*base);
 const answer=goal==='A'?base*height/2:base+left+right;
 return {id,base,height,left,right,foot,goal,hidden,unit,title,answer,steps,explain,hint:goal==='A'?'A = (base × altura perpendicular) ÷ 2. En un rectángulo los dos catetos son base y altura.':id==='equilatero'?'P = 3 × lado.':id==='isosceles'?'P = 2 × lado igual + base.':id==='rectangulo'?'Primero encuentra el lado faltante con a² + b² = c²; después suma los tres lados.':'P = lado 1 + lado 2 + lado 3.'};
}
export function crearEstado(tipo='mezcla',r=Math.random){return {tipo,q:generar(tipo,r),resueltos:0,primerIntento:0,errores:0,completo:false};}
export function responder(s,raw){
 if(s.completo)return 'bloqueada';if(!/^\s*\d+\s*$/.test(raw))return 'invalida';
 if(Number(raw)!==s.q.answer){s.errores++;return 'error';}
 s.completo=true;s.resueltos++;if(!s.errores)s.primerIntento++;return 'correcta';
}
export function siguiente(s,r=Math.random){
 const previous=s.q;let q;
 for(let i=0;i<20;i++){q=generar(s.tipo,r);if(JSON.stringify(q)!==JSON.stringify(previous))break;}
 s.q=q;s.errores=0;s.completo=false;
}
