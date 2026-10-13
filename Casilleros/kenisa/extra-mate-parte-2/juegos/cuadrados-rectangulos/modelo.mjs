const pick=(values,r)=>values[Math.floor(r()*values.length)];
export function generar(tipo='medidas',figura='mixto',objetivo='mixto',r=Math.random){
  const shape=figura==='mixto'?pick(['cuadrado','rectangulo'],r):figura;
  let a=1+Math.floor(r()*24),b=shape==='cuadrado'?a:1+Math.floor(r()*24);
  if(shape==='rectangulo'&&b===a)b=b%24+1;
  if(tipo==='diagonal'&&shape==='rectangulo'&&r()<.45){const scale=1+Math.floor(r()*3);[a,b]=pick([[3,4],[5,12],[8,15],[7,24]],r).map(n=>n*scale);}
  const goal=tipo==='diagonal'?'D':objetivo==='mixto'?pick(['P','A'],r):objetivo;
  const unit=pick(['cm','m'],r),square=a*a+b*b,answer=goal==='A'?a*b:goal==='P'?2*(a+b):null;
  const solution=goal==='D'?(Number.isInteger(Math.sqrt(square))?String(Math.sqrt(square)):`√${square}`):String(answer);
  return {tipo,figura:shape,a,b,goal,unit,square,answer,solution,
    pregunta:`Encuentra ${goal==='A'?'el área':goal==='P'?'el perímetro':'la diagonal'} del ${shape==='cuadrado'?'cuadrado':'rectángulo'}.`,
    pista:goal==='D'?`d² = ${a}² + ${b}². Suma los cuadrados y usa la raíz cuadrada.`:goal==='A'?(shape==='cuadrado'?'A = lado × lado.':'A = base × altura.'):(shape==='cuadrado'?'P = 4 × lado.':'P = 2 × (base + altura).'),
    explicacion:goal==='D'?`d² = ${a}² + ${b}² = ${square}. Entonces d = √${square}${Number.isInteger(Math.sqrt(square))?` = ${solution}`:''} ${unit}.`:goal==='A'?`A = ${a} × ${b} = ${answer} ${unit}².`:`P = ${a} + ${b} + ${a} + ${b} = ${answer} ${unit}.`};
}
export function validar(q,raw,raiz=false){
  const text=String(raw).trim();if(!/^\d+$/.test(text)||Number(text)>1e6)return 'invalida';
  const n=Number(text);
  return q.goal==='D'?((raiz?n:n*n)===q.square?'correcta':'error'):(!raiz&&n===q.answer?'correcta':'error');
}
export function crearEstado(tipo){return {tipo,figura:'mixto',objetivo:'mixto',q:generar(tipo),resueltos:0,primerIntento:0,errores:0,completo:false,raiz:false};}
export function responder(s,raw){if(s.completo)return 'bloqueada';const result=validar(s.q,raw,s.raiz);if(result==='correcta'){s.completo=true;s.resueltos++;if(s.errores===0)s.primerIntento++;}else if(result==='error')s.errores++;return result;}
export function siguiente(s,r=Math.random){const old=JSON.stringify(s.q);for(let i=0;i<20;i++){s.q=generar(s.tipo,s.figura,s.objetivo,r);if(JSON.stringify(s.q)!==old)break;}s.errores=0;s.completo=false;s.raiz=false;}
