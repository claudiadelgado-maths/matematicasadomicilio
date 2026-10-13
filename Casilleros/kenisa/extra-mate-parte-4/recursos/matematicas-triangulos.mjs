const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
export function fr(n,d=1){if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d===0)throw new RangeError('Fracción inválida');const g=gcd(n,d);return {n:n/g*Math.sign(d),d:Math.abs(d/g)};}
export const mul=(a,b)=>fr(a.n*b.n,a.d*b.d);
export const div=(a,b)=>fr(a.n*b.d,a.d*b.n);
export const valor=a=>a.n/a.d;
export const texto=a=>a.d===1?String(a.n):`${a.n}/${a.d}`;
export const iguales=(a,b)=>a.n*b.d===b.n*a.d;
export function leerRespuesta(s){
 const t=String(s).trim();let m=t.match(/^(\d{1,8})\s*\/\s*(\d{1,8})$/);
 if(m)return +m[2]===0?null:fr(+m[1],+m[2]);
 m=t.match(/^(\d{1,8})(?:[.,](\d{1,4}))?$/);if(!m)return null;
 return fr(+(m[1]+(m[2]||'')),10**(m[2]?.length||0));
}
export const LADOS=[[0,1],[1,2],[0,2]];
export const BASES=[[3,4,5],[4,5,6],[5,6,7],[5,7,8],[6,8,9],[7,8,10]];
export const ANGULOS=[[30,60,90],[40,60,80],[35,65,80],[45,60,75],[30,70,80],[50,60,70],[25,65,90],[35,60,85],[40,55,85]];
export const elegir=(a,r)=>a[Math.floor(r()*a.length)];
export const entero=(min,max,r)=>min+Math.floor(r()*(max-min+1));
export function mezclar(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function puntosLados(lados){
 const [ab,bc,ac]=lados.map(valor);if(Math.min(ab+bc-ac,ab+ac-bc,ac+bc-ab)<=0)throw new RangeError('Triángulo imposible');
 const x=(ac*ac+ab*ab-bc*bc)/(2*ab);return [{x:0,y:0},{x:ab,y:0},{x,y:Math.sqrt(Math.max(0,ac*ac-x*x))}];
}
// Solo geometría de los dibujos. Ningún ejercicio pide trigonometría.
export function puntosAngulos(angulos){
 if(angulos.some(a=>a<=0)||Math.abs(angulos.reduce((a,b)=>a+b)-180)>1e-8)throw new RangeError('Ángulos imposibles');
 const a=angulos[0]*Math.PI/180,b=angulos[1]*Math.PI/180;
 const t=10*Math.sin(b)/Math.sin(a+b);return [{x:0,y:0},{x:10,y:0},{x:t*Math.cos(a),y:t*Math.sin(a)}];
}
export function angulosDe(p){return p.map((v,i)=>{const a=p[(i+1)%3],b=p[(i+2)%3],u={x:a.x-v.x,y:a.y-v.y},w={x:b.x-v.x,y:b.y-v.y};return Math.acos(Math.max(-1,Math.min(1,(u.x*w.x+u.y*w.y)/(Math.hypot(u.x,u.y)*Math.hypot(w.x,w.y)))))*180/Math.PI;});}
export function triangulo(nombres,puntos,orientacion,r){return {nombres,puntos,lados:{},angulos:{},giro:orientacion==='alineados'?0:elegir([45,90,135,180,225,270],r),reflejo:orientacion==='reflejados'||orientacion==='variados'&&r()<.5};}
export const ladoNombre=(t,i)=>LADOS[i].map(j=>t.nombres[j]).join('');
export const marcarLado=(t,i,v,extra={})=>t.lados[i]={texto:typeof v==='string'?v:texto(v),...extra};
export const marcarAngulo=(t,i,v,extra={})=>t.angulos[i]={texto:(String(v).includes('x')?`(${v})`:String(v)).replace('.',',')+'°',...extra};
export const copiaEscalada=(p,k)=>p.map(v=>({x:v.x*valor(k),y:v.y*valor(k)}));
export function expresion(a,b){return `${a===1?'':a}x${b>0?' + '+b:b<0?' − '+Math.abs(b):''}`;}

export function crearMotor({CASOS,OPCIONES,crearPregunta}){
function crearPractica(modo){if(!CASOS[modo])throw new RangeError('Modo desconocido');return {modo,filtro:CASOS[modo][0][0],orientacion:'alineados',bolsa:[],numero:0,aciertos:0,primero:0,pregunta:null};}
function siguiente(s,r=Math.random){
 let tipo=s.filtro;
 if(tipo==='mezcla'){
  if(!s.bolsa.length){s.bolsa=mezclar(CASOS[s.modo].map(([id])=>id),r);if(s.bolsa[0]===s.pregunta?.tipo)[s.bolsa[0],s.bolsa[1]]=[s.bolsa[1],s.bolsa[0]];}
  tipo=s.bolsa.shift();
 }
 let q;const fingerprint=p=>JSON.stringify([p.tipo,p.triangulos,p.datos]);
 for(let i=0;i<8;i++){q=crearPregunta(s.modo,tipo,s.orientacion,r);if(!s.pregunta||fingerprint(q)!==fingerprint(s.pregunta))break;}
 s.pregunta=q;s.numero++;return q;
}
function responder(s,respuestas){
 const q=s.pregunta;if(q.resuelta)return null;
 let resultados;
 if(q.modo==='decide'){
  if(!OPCIONES.some(([id])=>id===respuestas)||q.descartadas.includes(respuestas))return null;
  resultados=[respuestas===q.respuesta];
 }else{
  const entradas=q.campos.map(f=>leerRespuesta(respuestas[f.id]??''));if(entradas.some(v=>v===null))return {valida:false,correcta:false};
  resultados=entradas.map((v,i)=>iguales(v,q.campos[i].respuesta));
 }
 q.intentos++;const correcta=resultados.every(Boolean);
 if(correcta){q.resuelta=true;s.aciertos++;if(q.intentos===1)s.primero++;}else if(q.modo==='decide')q.descartadas.push(respuestas);
 return {valida:true,correcta,resultados};
}
return {crearPractica,siguiente,responder};
}
