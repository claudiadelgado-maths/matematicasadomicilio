export const TIPOS = ['equilátero', 'isósceles', 'escaleno', 'acutángulo', 'rectángulo', 'obtusángulo'];
export const EJEMPLOS = {
  equilátero: [[60,60,60]],
  isósceles: [[50,50,80],[45,45,90],[35,35,110],[70,70,40]],
  escaleno: [[40,65,75],[30,60,90],[25,45,110],[50,60,70]],
  acutángulo: [[60,60,60],[50,65,65],[45,60,75]],
  rectángulo: [[30,60,90],[45,45,90],[35,55,90]],
  obtusángulo: [[25,35,120],[40,40,100],[30,45,105]]
};
const pick = (a,r) => a[Math.floor(r()*a.length)];
export function mezclar(a,r=Math.random) {
  const out=[...a]; for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]];} return out;
}
export function clasificar(angles) {
  const unique=new Set(angles).size;
  return {lados:unique===1?'equilátero':unique===2?'isósceles':'escaleno', angulos:Math.max(...angles)===90?'rectángulo':Math.max(...angles)>90?'obtusángulo':'acutángulo'};
}
export function termino(a=0,b=0){return {a,b};}
export function evaluar(t,x){return t.a*x+t.b;}
export function expresion(t){
  if(!t.a)return String(t.b);
  return `${t.a===1?'':t.a}x${t.b>0?` + ${t.b}`:t.b<0?` − ${-t.b}`:''}`;
}
export function ecuacionTexto(q){
  const text=`${q.ecuacion.izquierda.map(expresion).join(' + ')} = ${q.ecuacion.derecha.map(expresion).join(' + ')}`;
  return q.nivel===0?text.replace(/x/g,'?'):text;
}
function angulos(r){
  const a=pick([30,35,40,45,50,55,60,65,70,75,80],r);
  const b=pick([30,35,40,45,50,55,60,65,70,75,80].filter(b=>180-a-b>=25),r);
  return mezclar([a,b,180-a-b],r);
}
function tipoReto(tipo,si,r){
  const pool=Object.values(EJEMPLOS).flat().filter(a=>Object.values(clasificar(a)).includes(tipo)===si);
  const angles=mezclar(pick(pool,r),r);
  const names=clasificar(angles);
  return {etapa:1,angulos:angles,tipo,respuesta:si,giro:pick([0,45,90,135,180,225,270,315],r),
    pregunta:`¿Este triángulo es ${tipo}?`,pista:TIPOS.indexOf(tipo)<3?'Compara los lados: las marcas iguales indican longitudes iguales.':'Busca si hay un ángulo de 90°, uno mayor de 90° o si todos son menores.',
    explicacion:`Es ${names.lados} por sus lados y ${names.angulos} por sus ángulos. Sus ángulos miden ${angles.join('°, ')}°.`};
}
function internos(nivel,r){
  let angles,terms,x,answer,goal;
  if(nivel===0){
    angles=angulos(r); const i=pick([0,1,2],r); terms=angles.map((v,j)=>termino(j===i?1:0,j===i?0:v));
    x=angles[i];answer=x;goal=`el ángulo ${'ABC'[i]}`;
  }else if(nivel===1){
    x=pick([25,30,35,40,45],r);const k=pick([1,2],r);
    terms=mezclar([termino(1),termino(k),termino(0,180-(k+1)*x)],r);
    angles=terms.map(t=>evaluar(t,x));answer=x;goal='x';
  }else{
    for(let attempt=0;attempt<200;attempt++){
      x=pick([15,20,25,30],r);
      terms=[termino(pick([1,2,3],r),pick([-10,0,10,20],r)),termino(pick([1,2,3],r),pick([-10,0,10,20],r)),termino(pick([1,2,3],r))];
      terms[2].b=180-terms.reduce((s,t)=>s+evaluar(t,x),0);
      angles=terms.map(t=>evaluar(t,x));
      if(angles.every(v=>v>=25&&v<=120)&&Math.abs(terms[2].b)<=40&&terms.some(t=>t.b!==0))break;
      terms=null;
    }
    if(!terms){x=25;terms=[termino(2),termino(1,20),termino(3,10)];angles=terms.map(t=>evaluar(t,x));}
    answer=x;goal='x';
  }
  return {etapa:2,nivel,angulos:angles,terminos:terms,respuesta:answer,objetivo:goal,pregunta:`Encuentra ${goal}`,
    ecuacion:{izquierda:terms,derecha:[termino(0,180)]},
    etiquetas:terms.map(t=>nivel===0&&t.a?'?':expresion(t)),
    pista:'Suma los tres ángulos interiores. El resultado siempre es 180°.',
    explicacion:`Los tres interiores suman 180°. ${goal==='x'?`x = ${x}; sustituye ese valor en cada expresión.`:`${goal} mide ${answer}°.`} Las medidas son ${angles.join('° + ')}° = 180°.`};
}
function linealPara(value,x,r){
  const options=[1,2,3,4,5].map(a=>termino(a,value-a*x)).filter(t=>Math.abs(t.b)<=35);
  return pick(options.length?options:[termino(0,value)],r);
}
function exteriores(nivel,index,r){
  const angles=angulos(r), exterior=180-angles[1];
  let terms=angles.map(v=>termino(0,v)),ext=termino(0,exterior),x,goal,rule;
  const mode=index%3;
  if(nivel===0){
    if(mode===0){x=exterior;ext=termino(1);goal='el ángulo exterior E';rule='remotos';}
    else if(mode===1){x=angles[2];terms[2]=termino(1);goal='el ángulo interior C';rule='remotos';}
    else{x=angles[1];terms[1]=termino(1);goal='el ángulo interior B';rule='suplementarios';}
  }else if(nivel===1){
    // Asegura coeficientes pequeños, constantes sencillas y una solución entera.
    x=pick([20,25,30,35],r);goal='x';
    if(mode===2){angles[1]=2*x;angles[0]=pick([30,40,50],r);angles[2]=180-angles[0]-angles[1];terms=angles.map(v=>termino(0,v));terms[1]=termino(2);ext=termino(0,180-angles[1]);rule='suplementarios';}
    else{angles[0]=x;angles[2]=2*x;angles[1]=180-3*x;terms=[termino(1),termino(0,angles[1]),termino(2)];ext=termino(0,3*x);rule='remotos';}
  }else{
    x=pick([15,20,25,30],r);goal='x';rule=mode===2?'suplementarios':'remotos';
    terms=angles.map(v=>linealPara(v,x,r));
    if(rule==='suplementarios'){ext=linealPara(exterior,x,r);}
    else{
      ext=linealPara(exterior,x,r);
      if(ext.a===terms[0].a+terms[2].a)ext=termino(0,exterior);
    }
  }
  const eq=rule==='remotos'?{izquierda:[ext],derecha:[terms[0],terms[2]]}:{izquierda:[terms[1],ext],derecha:[termino(0,180)]};
  const labels=terms.map((t,i)=>rule==='remotos'&&i===1||rule==='suplementarios'&&i!==1?'':nivel===0&&t.a?'?':expresion(t));
  return {etapa:3,nivel,angulos:angles,terminos:terms,exterior:ext,respuesta:x,objetivo:goal,regla:rule,ecuacion:eq,
    etiquetas:labels,etiquetaExterior:nivel===0&&ext.a?'?':expresion(ext),pregunta:`Encuentra ${goal}`,
    pista:rule==='remotos'?'E es igual a A + C. Son los dos interiores que no están junto a E.':'B y E están sobre una recta: B + E = 180°.',
    explicacion:`${rule==='remotos'?`E = A + C: ${180-angles[1]}° = ${angles[0]}° + ${angles[2]}°.`:`B + E = 180°: ${angles[1]}° + ${180-angles[1]}° = 180°.`} ${goal==='x'?`x = ${x}. Sustituir x da medidas de ángulos, no necesariamente el mismo número.`:`${goal} mide ${x}°.`}`};
}
export function crearSerie(etapa,r=Math.random){
  if(![1,2,3].includes(etapa))throw new RangeError('Etapa inválida');
  if(etapa===1)return mezclar(TIPOS.flatMap(tipo=>[tipoReto(tipo,true,r),tipoReto(tipo,false,r)]),r);
  return Array.from({length:12},(_,i)=>etapa===2?internos(Math.floor(i/4),r):exteriores(Math.floor(i/4),i,r));
}
export function crearEstado(etapa,r=Math.random){return {etapa,retos:crearSerie(etapa,r),indice:0,resueltos:0,primerIntento:0,intentos:0,completo:false,fase:'inicio',borrador:'',feedback:null};}
export function responder(s,raw){
  if(s.completo)return {tipo:'bloqueado'};
  const q=s.retos[s.indice];
  const value=q.etapa===1?raw:typeof raw==='string'&&/^\s*[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)\s*$/.test(raw)?Number(raw.trim().replace(',','.')):NaN;
  if(q.etapa===1?typeof value!=='boolean':!Number.isFinite(value))return {tipo:'vacio'};
  s.intentos++;
  if(value!==q.respuesta)return {tipo:'incorrecto'};
  s.completo=true;s.resueltos++;if(s.intentos===1)s.primerIntento++;
  return {tipo:'correcto'};
}
export function avanzar(s){
  if(!s.completo||s.indice>=11)return false;
  s.indice++;s.intentos=0;s.completo=false;s.borrador='';s.feedback=null;s.fase='reto';return true;
}
// Coordenadas euclidianas: el lado AB es horizontal y C se deduce de A y B.
export function vertices(angles,giro=0,exterior=false){
  const rad=Math.PI/180,[a,b]=angles.map(v=>v*rad);
  // Ley de senos, estable incluso si A o B mide exactamente 90°.
  const side=Math.sin(b)/Math.sin((180-angles[0]-angles[1])*rad);
  const points=[[0,0],[1,0],[side*Math.cos(a),-side*Math.sin(a)]];
  const theta=giro*rad,rot=points.map(([x,y])=>[x*Math.cos(theta)-y*Math.sin(theta),x*Math.sin(theta)+y*Math.cos(theta)]);
  const xs=rot.map(p=>p[0]),ys=rot.map(p=>p[1]),minX=Math.min(...xs),minY=Math.min(...ys);
  const scale=Math.min((exterior?290:340)/(Math.max(...xs)-minX),190/(Math.max(...ys)-minY));
  const width=(Math.max(...xs)-minX)*scale,height=(Math.max(...ys)-minY)*scale;
  const left=exterior?65:(520-width)/2,top=(350-height)/2;
  return rot.map(([x,y])=>({x:left+(x-minX)*scale,y:top+(y-minY)*scale}));
}
