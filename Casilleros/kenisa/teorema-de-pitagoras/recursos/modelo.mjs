export const triples = [[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25]];
// a = distancia horizontal; b = altura; c = diagonal.
const level = (title,scene,a,b,c,missing,text) => ({title,scene,a,b,c,missing,text});
export const versions = [
 {name:'Expedición al parque',levels:[
  level('La cuerda del árbol','tree',6,8,10,'b','Una cuerda de 10 m une la punta de un árbol vertical con una estaca a 6 m de su base. ¿Qué altura tiene el árbol?'),
  level('Un atajo por el jardín','park',9,12,15,'c','Un jardín rectangular mide 9 m de ancho y 12 m de largo. ¿Cuánto mide el atajo diagonal entre esquinas opuestas?'),
  level('La escalera del mirador','ladder',5,12,13,'a','Una escalera de 13 m alcanza una altura de 12 m en una pared vertical. ¿A qué distancia de la pared está su base?'),
  level('Sujeta la tienda','tent',3,4,5,'c','Una cuerda irá desde lo alto de un poste vertical de 4 m hasta una estaca a 3 m de su base. ¿Cuánta cuerda necesitas, sin contar nudos?') ]},
 {name:'Equipo de rescate',levels:[
  level('Alcanza la ventana','ladder',6,8,10,'b','Una escalera de 10 m tiene su base a 6 m de una pared vertical. ¿A qué altura llega?'),
  level('Cruza la plaza','park',5,12,13,'c','Una plaza rectangular mide 5 m por 12 m. ¿Cuánto mide el recorrido diagonal entre dos esquinas opuestas?'),
  level('Ancla el mástil','tent',8,15,17,'a','Un cable de 17 m sujeta la punta de un mástil vertical de 15 m. ¿A qué distancia de la base debes anclarlo al suelo?'),
  level('Prepara la rampa','ramp',3,4,5,'c','Una rampa salva 4 m de altura y ocupa 3 m de distancia horizontal. ¿Cuánto mide la superficie inclinada?') ]},
 {name:'Taller de aventuras',levels:[
  level('El cable del árbol','tree',9,12,15,'c','Un árbol vertical mide 12 m. Una estaca está a 9 m de su base. ¿Cuánto mide el cable recto desde la punta hasta la estaca?'),
  level('La altura del acceso','ramp',5,12,13,'b','Una rampa mide 13 m de longitud inclinada y ocupa 5 m horizontales. ¿Qué altura alcanza?'),
  level('El ancho del terreno','park',8,15,17,'a','Un terreno rectangular tiene 15 m de largo y una diagonal de 17 m. ¿Cuál es su ancho?'),
  level('Escalera a la azotea','ladder',7,24,25,'c','Necesitas alcanzar una azotea a 24 m de altura con la base de la escalera a 7 m de la pared. ¿Qué longitud debe tener la escalera en este modelo?') ]}
];
export function number(text) {
 const s=String(text).trim().replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s)) return NaN;
 const [a,b]=s.split('/').map(Number);return b===undefined?a:b===0?NaN:a/b;
}
export const correct=(text,value)=>Number.isFinite(number(text)) && Math.abs(number(text)-value)<1e-8;
export function steps(q){
 const {a,b,c,missing:m}=q;
 return m==='c'?[`c^2=${a}^2+${b}^2`,`c^2=${a*a}+${b*b}=${c*c}`,`c=\\sqrt{${c*c}}=${c}`]:[`${m}^2=${c}^2-${m==='a'?b:a}^2`,`${m}^2=${c*c}-${(m==='a'?b:a)**2}=${q[m]**2}`,`${m}=\\sqrt{${q[m]**2}}=${q[m]}`];
}
export function practice(i,rng=Math.random){const [a,b,c]=triples[Math.floor(rng()*triples.length)];return {a,b,c,missing:['c','a','b','c'][i%4],scene:'plain',title:'Encuentra el lado faltante',text:'Calcula la longitud marcada con ?. Las medidas están en centímetros.'};}
export function chooseVersion(previous=-1,rng=Math.random){const pool=versions.map((_,i)=>i).filter(i=>i!==previous);return pool[Math.floor(rng()*pool.length)];}
