export const POLIGONOS=Array.from({length:18},(_,i)=>{
 const lados=i+3,nombres={3:'Triángulo',4:'Cuadrilátero',5:'Pentágono',6:'Hexágono',7:'Heptágono',8:'Octágono',9:'Eneágono',10:'Decágono',11:'Endecágono',12:'Dodecágono',20:'Icoságono'};
 return {lados,nombre:nombres[lados]||`Polígono de ${lados} lados`,nota:lados===3?'Aquí lo dibujamos como un triángulo equilátero.':lados===4?'El cuadrilátero regular es el cuadrado.':lados>12&&lados<20?'También podemos nombrarlo diciendo cuántos lados tiene.':''};
});
export const MAX_ALTURA=6;
export const NIVEL_INICIAL=3,NIVEL_FINAL=20,FILAS_INICIALES=4,TOTAL_DEFENSAS=5*FILAS_INICIALES;
export const nombre=n=>POLIGONOS.find(p=>p.lados===n)?.nombre??'';
const pick=(a,r)=>a[Math.floor(r()*a.length)];
export function puntos(n,cx=0,cy=0,radio=1,giro=-Math.PI/2){
 if(!Number.isInteger(n)||n<3||n>20)throw new RangeError('Polígono fuera del recorrido');
 return Array.from({length:n},(_,i)=>({x:cx+radio*Math.cos(giro+i*2*Math.PI/n),y:cy+radio*Math.sin(giro+i*2*Math.PI/n)}));
}
export const frente=s=>s.columnas.map(col=>col.at(-1)||null);
export const pasillos=s=>s.columnas.map((c,i)=>c.length===0?i:-1).filter(i=>i>=0);
export function elegirFigura(s,random=Math.random){
 const opciones=[...new Set(frente(s).filter(Boolean).map(b=>b.lados))];
 const libre=pasillos(s).length>0;
 // Una vía libre añade al jefe como objetivo, incluso fuera del rango de defensas.
 // La figura necesaria aparece, como máximo, al tercer turno con una vía libre.
 if(libre&&!opciones.includes(s.nivel))opciones.push(s.nivel);
 if(libre&&s.esperaJefe>=2){s.figura=s.nivel;s.esperaJefe=0;return s.figura;}
 const nuevas=opciones.filter(n=>n!==s.figura);s.figura=pick(nuevas.length?nuevas:opciones,random)??s.figura;
 s.esperaJefe=libre&&s.figura!==s.nivel?s.esperaJefe+1:0;
 return s.figura;
}
export function crearJuego(max=12,random=Math.random,nivel=NIVEL_INICIAL){
 if(![12,20].includes(max))throw new RangeError('Elige hasta 12 o hasta 20');
 if(!Number.isInteger(nivel)||nivel<NIVEL_INICIAL||nivel>NIVEL_FINAL)throw new RangeError('Nivel fuera del recorrido');
 let serial=0;
 const s={max,nivel,esperaJefe:0,columnas:Array.from({length:5},()=>Array.from({length:FILAS_INICIALES},()=>({id:++serial,lados:3+Math.floor(random()*(max-2)),tipo:'bloque'}))),serial,figura:null,columna:2,fase:'listo',turno:0,aciertos:0,errores:0,ayudas:0,ultimoAgregado:null,pendiente:null};
 elegirFigura(s,random);return s;
}
export function avanzarNivel(s,random=Math.random){
 return s.fase==='ganado'&&s.nivel<NIVEL_FINAL?crearJuego(s.max,random,s.nivel+1):null;
}
export function apuntar(s,columna){if(s.fase!=='listo'||!Number.isInteger(columna)||columna<0||columna>4)return false;s.columna=columna;return true;}
export function iniciarDisparo(s){
 if(s.fase!=='listo')return null;
 const col=s.columnas[s.columna],objetivo=col.at(-1)||null;
 const shot={id:++s.turno,columna:s.columna,figura:s.figura,indice:col.length-1,objetivo:objetivo?{...objetivo}:null};
 s.pendiente=shot;s.fase='vuelo';return shot;
}
export function cancelarDisparo(s){
 if(s.fase!=='vuelo')return false;
 s.pendiente=null;s.fase='listo';return true;
}
export function resolverDisparo(s,id,random=Math.random){
 if(s.fase!=='vuelo'||s.pendiente?.id!==id)return null;
 const shot=s.pendiente,col=s.columnas[shot.columna];s.pendiente=null;
 if(!shot.objetivo){
  if(shot.figura===s.nivel){s.fase='ganado';return {tipo:'victoria',...shot};}
  s.errores++;s.fase='listo';s.figura=s.nivel;s.esperaJefe=0;
  return {tipo:'escudo',...shot};
 }
 let tipo;
 if(shot.figura===shot.objetivo.lados){col.pop();s.aciertos++;tipo='acierto';s.fase='listo';}
 else{const added={id:++s.serial,lados:shot.figura,tipo:'figura'};col.push(added);s.ultimoAgregado={columna:shot.columna,id:added.id};s.errores++;tipo='error';s.fase=col.length>=MAX_ALTURA?'ayuda':'listo';}
 elegirFigura(s,random);return {tipo,...shot};
}
export function rescatar(s,random=Math.random){
 if(s.fase!=='ayuda'||!s.ultimoAgregado)return false;
 const {columna,id}=s.ultimoAgregado,col=s.columnas[columna];
 if(col.at(-1)?.id!==id||col.at(-1)?.tipo!=='figura')return false;
 col.pop();s.ayudas++;s.fase='listo';s.ultimoAgregado=null;elegirFigura(s,random);return true;
}
