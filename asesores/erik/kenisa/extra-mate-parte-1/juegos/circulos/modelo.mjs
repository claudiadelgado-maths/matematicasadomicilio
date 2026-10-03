export const PARTES=[
  {id:'circunferencia',nombre:'Circunferencia',color:'#426ba1',texto:'Es el borde: todos sus puntos están a la misma distancia del centro. El círculo incluye también el interior.',pista:'Busca el contorno curvo completo.'},
  {id:'radio',nombre:'Radio',color:'#18766e',texto:'Segmento que une el centro con un punto de la circunferencia.',pista:'Uno de sus extremos está en el centro.'},
  {id:'diametro',nombre:'Diámetro',color:'#7052a2',texto:'Segmento que une dos puntos de la circunferencia y pasa por el centro. Mide dos radios: d = 2r.',pista:'Cruza el centro y sus extremos están en el borde.'},
  {id:'secante',nombre:'Secante',color:'#a35f16',texto:'Recta que corta la circunferencia en dos puntos. Continúa fuera del círculo por ambos lados.',pista:'Es una recta que atraviesa el borde dos veces.'},
  {id:'tangente',nombre:'Tangente',color:'#ae416b',texto:'Recta que toca la circunferencia en un solo punto. Es perpendicular al radio que llega a ese punto.',pista:'Solo toca el borde una vez.'},
  {id:'arco',nombre:'Arco',color:'#bc4b26',texto:'Porción curva de la circunferencia comprendida entre dos puntos.',pista:'Es solo una parte curva del borde, no la circunferencia completa.'},
  {id:'cuerda',nombre:'Cuerda',color:'#825499',texto:'Segmento que une dos puntos de la circunferencia. El diámetro es una cuerda especial que pasa por el centro.',pista:'Es recto, sus dos extremos están en el borde y no continúa fuera del círculo.'}
];
export const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1;};
export function fraccion(n,d=1){const g=gcd(n,d);return {n:n/g,d:d/g};}
export const radianes=grados=>fraccion(grados,180);
export const grados=f=>180*f.n/f.d;
export const limitar=g=>Math.min(360,Math.max(0,g));
export const deltaGiro=(anterior,actual)=>(actual-anterior+540)%360-180;
export const punto=(g,r=150,cx=240,cy=240)=>({x:cx+r*Math.cos(g*Math.PI/180),y:cy-r*Math.sin(g*Math.PI/180)});
export const formato=n=>Number(n.toFixed(2)).toLocaleString('es-MX',{maximumFractionDigits:2,useGrouping:false});
export const redondear=n=>Math.round((n+Number.EPSILON)*100)/100;
export const pick=(a,r=Math.random)=>a[Math.floor(r()*a.length)];
export function mezclar(a,r=Math.random){const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function elemento(id,giro=0,r=110){
  const transform=([x,y])=>({x:240+x*Math.cos(giro*Math.PI/180)+y*Math.sin(giro*Math.PI/180),y:230-x*Math.sin(giro*Math.PI/180)+y*Math.cos(giro*Math.PI/180)});
  const h=r*.5,c=Math.sqrt(r*r-h*h);
  const lines={radio:[[0,0],[r*.5,-r*Math.sqrt(3)/2]],diametro:[[-r,0],[r,0]],secante:[[-1.7*r,h],[1.7*r,h]],tangente:[[r,-1.65*r],[r,1.65*r]],cuerda:[[-c,-h],[c,-h]]};
  const cuts={radio:[[r*.5,-r*Math.sqrt(3)/2]],diametro:[[-r,0],[r,0]],secante:[[-c,h],[c,h]],tangente:[[r,0]],circunferencia:[],cuerda:[[-c,-h],[c,-h]],arco:[[-r*Math.cos(Math.PI/9),r*Math.sin(Math.PI/9)],[0,r]]};
  return {id,r,centro:{x:240,y:230},segmento:lines[id]?.map(transform),cortes:cuts[id].map(transform)};
}
export function seriePartes(r=Math.random){return [0,1].flatMap(round=>mezclar(PARTES,r).map((p,i)=>({id:`p${round}-${i}`,kind:'partes',target:p.id,giro:pick([0,25,55,90,130,175,210,255,300],r),radio:pick([90,100,110],r),hint:p.pista,explain:p.texto})));}
export function serieMedidas(nivel,r=Math.random){
  return [0,1].flatMap(round=>mezclar([['r','P'],['d','P'],['r','A'],['d','A']],r).map(([from,to],i)=>{
    const radio=1+Math.floor(r()*25),expected=to==='P'?2*radio:radio*radio,unit=pick(['cm','m','mm'],r);
    const distractors=[...new Set([radio,2*radio,radio*radio,4*radio,4*radio*radio,expected+radio,expected+1,expected+2,expected+3])].filter(n=>n!==expected);
    const opciones=mezclar([expected,...mezclar(distractors,r).slice(0,3)],r).map(n=>`${n}π`);
    return {id:`m${nivel}-${round}-${i}`,kind:'medidas',nivel,from,to,radio,given:from==='d'?2*radio:radio,expected,opciones,unit:unit+(to==='A'?'²':''),givenUnit:unit,hint:to==='P'?'P = 2πr = πd. Conserva π en tu respuesta.':'A = πr². Si conoces el diámetro, primero calcula r = d ÷ 2.'};
  }));
}
export function serieConversiones(r=Math.random,direccion='mixto'){
  return Array.from({length:12},(_,i)=>{
    const g=Math.floor(r()*361),to=direccion==='mixto'?(i%2===0?'rad':'deg'):direccion;
    return {id:`c-${i}`,kind:'conversion',to,degrees:g,ratio:radianes(g),hint:to==='rad'?'Divide los grados entre 180, simplifica y conserva π.':'Multiplica el coeficiente de π por 180. Escribe solo el número entero de grados.'};
  });
}
export function leerNumero(raw){
  const s=String(raw).trim().replace(/−/g,'-').replace(',','.');if(s.length>30)return null;
  if(/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(s)){const [a,b]=s.split('/').map(Number);return b&&Math.abs(a)<=1e9&&Math.abs(b)<=1e9?a/b:null;}
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return null;
  const n=Number(s);return Number.isFinite(n)&&Math.abs(n)<=1e9?n:null;
}
export function validar(q,raw){
  if(q.kind==='partes')return raw===q.target?'correcta':'error';
  if(q.kind==='medidas'){const f=leerPi(raw);return !f?'invalida':f.n===q.expected*f.d?'correcta':'error';}
  if(q.kind==='conversion'&&q.to==='deg')return !/^\s*\d+\s*$/.test(raw)?'invalida':Number(raw)===q.degrees?'correcta':'error';
  if(q.kind==='conversion'&&q.to==='rad'){
    const s=String(raw).trim(),match=s.match(/^(\d+)(?:\s*\/\s*(\d+))?$/);if(!match)return 'invalida';
    const n=Number(match[1]),d=Number(match[2]||1);if(!d||n>1e6||d>1e6)return 'invalida';
    if(n*q.ratio.d!==q.ratio.n*d)return 'error';return gcd(n,d)===1?'correcta':'equivalente';
  }
  const n=leerNumero(raw);if(n===null)return 'invalida';const expected=q.kind==='conversion'?q.degrees:q.expected;
  return Math.abs(n-expected)<1e-8?'correcta':'error';
}
export function crearEstado(preguntas){return {preguntas,indice:0,resueltos:0,primerIntento:0,errores:0,completo:false,fase:'reto',borrador:'',mensaje:'',resultado:'',racha:0};}
export function responder(s,raw){if(s.completo)return 'correcta';const result=validar(s.preguntas[s.indice],raw);if(result==='correcta'){s.completo=true;s.resueltos++;if(!s.errores){s.primerIntento++;s.racha++;}else s.racha=0;}else if(result==='error'){s.errores++;s.racha=0;}return result;}
export function avanzar(s){if(!s.completo||s.indice===s.preguntas.length-1)return false;s.indice++;s.completo=false;s.errores=0;s.borrador='';s.mensaje='';s.resultado='';s.fase='reto';return true;}

// Solo cantidades exactas nπ/d: no eval, aproximaciones ni expresiones ejecutables.
export function leerPi(raw){
  const s=String(raw).replace(/\s/g,'').replace(/pi/gi,'π').replace(/p/gi,'π');
  const m=s.match(/^(\d*)π(?:\/(\d+))?$/);if(!m)return null;
  const n=Number(m[1]||1),d=Number(m[2]||1);
  return n<=1e6&&d>0&&d<=1e6?fraccion(n,d):null;
}
export function simplificar(n,d){
  if(!/^\d+$/.test(String(n))||!/^\d+$/.test(String(d)))return null;
  n=Number(n);d=Number(d);return n<=1e6&&d>0&&d<=1e6?fraccion(n,d):null;
}
export function convertirEntrada(raw){const f=leerPi(raw);return f?fraccion(f.n*180,f.d):null;}
export function nuevoEjercicio(s,generar){
  const previous=s.preguntas[s.indice];
  if(s.indice===s.preguntas.length-1){
    s.preguntas=generar();s.indice=-1;
    const signature=q=>JSON.stringify([q.kind,q.target,q.giro,q.radio,q.from,q.to,q.degrees]);
    if(signature(s.preguntas[0])===signature(previous))s.preguntas.push(s.preguntas.shift());
  }
  s.indice++;s.vistos=(s.vistos||0)+1;s.completo=false;s.errores=0;s.borrador='';s.numerador='';s.denominador='';s.calculo=null;s.mensaje='';s.resultado='';s.errorUntil=0;s.fase='reto';
}
