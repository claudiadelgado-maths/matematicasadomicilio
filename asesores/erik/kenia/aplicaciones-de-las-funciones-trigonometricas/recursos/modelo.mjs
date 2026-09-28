const rad=x=>x*Math.PI/180;
const deg=x=>x*180/Math.PI;
export const round=x=>Math.round((x+Number.EPSILON)*100)/100;
export const fmt=x=>String(round(x));
export const roles={a:'C.A.',b:'C.O.',c:'H.'};
export function parse(text){const s=String(text).trim().replace(',','.');if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s))return NaN;const [a,b]=s.split('/').map(Number);return b===undefined?a:b===0?NaN:a/b;}
export function answer(q){
 if(q.target==='theta'||q.target==='all'){
  const theta=q.a!==undefined&&q.b!==undefined?deg(Math.atan(q.b/q.a)):q.b!==undefined?deg(Math.asin(q.b/q.c)):deg(Math.acos(q.a/q.c));
  return q.target==='all'?[theta,90-theta,90]:[theta];
 }
 const t=rad(q.theta);
 return [q.target==='b'?(q.c!==undefined?q.c*Math.sin(t):q.a*Math.tan(t)):q.target==='a'?(q.c!==undefined?q.c*Math.cos(t):q.b/Math.tan(t)):(q.a!==undefined?q.a/Math.cos(t):q.b/Math.sin(t))];
}
export function correct(q,values){const expected=answer(q);return values.length===expected.length&&values.every((s,i)=>{const n=parse(s);return Number.isFinite(n)&&n>0&&(q.target==='theta'||q.target==='all'?n<=90:true)&&round(n)===round(expected[i]);});}
export function working(q){
 const t=q.theta,angle=q.target==='theta'||q.target==='all',v=answer(q),x=roles[q.target],result=`\\mathrm{${x}}\\approx ${fmt(v[0])}\\,\\mathrm{m}`;
 if(angle){const f=q.a!==undefined&&q.b!==undefined?'tan':q.b!==undefined?'sin':'cos';const num=f==='cos'?q.a:q.b,den=f==='tan'?q.a:q.c;return [`\\${f}\\theta=\\frac{${num}}{${den}}`,`\\theta=\\${f}^{-1}\\left(\\frac{${num}}{${den}}\\right)\\approx ${fmt(v[0])}^\\circ`,q.target==='all'?`\\alpha=90^\\circ-\\theta\\approx ${fmt(v[1])}^\\circ,\\quad \\gamma=90^\\circ`:'\\text{Usa el modo DEG de tu calculadora.}'];}
 if(q.target==='b')return q.c!==undefined?[`\\sin ${t}^\\circ=\\frac{\\mathrm{C.O.}}{${q.c}}`,`\\mathrm{C.O.}=${q.c}\\sin ${t}^\\circ`,result]:[`\\tan ${t}^\\circ=\\frac{\\mathrm{C.O.}}{${q.a}}`,`\\mathrm{C.O.}=${q.a}\\tan ${t}^\\circ`,result];
 if(q.target==='a')return q.c!==undefined?[`\\cos ${t}^\\circ=\\frac{\\mathrm{C.A.}}{${q.c}}`,`\\mathrm{C.A.}=${q.c}\\cos ${t}^\\circ`,result]:[`\\tan ${t}^\\circ=\\frac{${q.b}}{\\mathrm{C.A.}}`,`\\mathrm{C.A.}\\tan ${t}^\\circ=${q.b}`,`\\mathrm{C.A.}=\\frac{${q.b}}{\\tan ${t}^\\circ}`,result];
 const f=q.a!==undefined?'cos':'sin',known=q.a??q.b;return [`\\${f} ${t}^\\circ=\\frac{${known}}{\\mathrm H}`,`\\mathrm H\\,\\${f} ${t}^\\circ=${known}`,`\\mathrm H=\\frac{${known}}{\\${f} ${t}^\\circ}`,result];
}
const make=(title,scene,target,data,text)=>({title,scene,target,...data,text});
export const examples=[
 make('1. Encuentra el cateto opuesto','tree','b',{c:10,theta:30},'Conoces la hipotenusa y el ángulo. El seno relaciona esos datos con el cateto opuesto.'),
 make('2. Encuentra el cateto adyacente','tent','a',{b:6,theta:45},'Conoces el cateto opuesto y el ángulo. Usa tangente. La incógnita está abajo: multiplica y luego divide.'),
 make('3. Encuentra la hipotenusa','ladder','c',{a:8,theta:60},'Conoces el cateto adyacente y el ángulo. Usa coseno y despeja la hipotenusa del denominador.'),
 make('4. Encuentra los tres ángulos','park','all',{a:4,b:3},'Conoces los dos catetos. Usa tangente inversa para θ; después resta a 90° para hallar α. El ángulo recto ya mide 90°.')
];
export const versions=[
 {name:'Explora el parque',levels:[
  make('La cuerda del árbol','tree','b',{a:6,theta:40},'Una estaca está a 6 m de la base de un árbol vertical. La cuerda que llega a su punta forma 40° con el suelo. ¿Cuánto mide el árbol?'),
  make('Alcanza la ventana','ladder','theta',{b:8,c:10},'Una escalera de 10 m se apoya en una pared vertical y llega a una ventana a 8 m de altura. ¿Qué ángulo θ forma con el suelo?'),
  make('Un atajo por el jardín','park','all',{a:9,b:12},'El jardín rectangular mide 9 m por 12 m. Su diagonal forma un triángulo rectángulo: encuentra θ, α y el ángulo recto.') ]},
 {name:'Prepara la expedición',levels:[
  make('La escalera del mirador','ladder','c',{a:5,theta:65},'La base de una escalera queda a 5 m de una pared y forma 65° con el suelo. ¿Cuánto mide la escalera?'),
  make('Prepara la rampa','ramp','b',{c:13,theta:30},'Una rampa de 13 m de longitud inclinada forma 30° con el suelo. ¿Qué altura alcanza?'),
  make('Ancla el mástil','tent','theta',{a:8,b:15},'Un mástil vertical mide 15 m y el anclaje está a 8 m de su base. ¿Qué ángulo θ forma el cable con el suelo?') ]},
 {name:'Diseña una aventura',levels:[
  make('La estaca del árbol','tree','a',{b:12,theta:50},'Un árbol vertical mide 12 m. Su cable forma 50° con el suelo. ¿A qué distancia de la base está la estaca?'),
  make('Inclinación del acceso','ramp','theta',{a:5,c:13},'Una rampa mide 13 m de longitud inclinada y ocupa 5 m horizontales. ¿Qué ángulo θ forma con el suelo?'),
  make('Los ángulos del terreno','park','all',{a:8,b:15},'La diagonal de un terreno rectangular de 8 m por 15 m delimita un triángulo rectángulo. Encuentra sus tres ángulos.') ]}
];
export function choose(previous=-1,rng=Math.random){const ids=[0,1,2].filter(i=>i!==previous);return ids[Math.floor(rng()*ids.length)];}
export function practice(rng=Math.random){const theta=[30,35,40,45,50,60][Math.floor(rng()*6)],n=[6,8,10,12,14][Math.floor(rng()*5)];return [make('El cateto opuesto','tree','b',{a:n,theta},'Encuentra el cateto opuesto al ángulo θ.'),make('El cateto adyacente','tent','a',{c:n+5,theta},'Encuentra el cateto adyacente al ángulo θ.'),make('La hipotenusa','ladder','c',{b:n,theta},'Encuentra la hipotenusa.'),make('Los tres ángulos','park','all',{a:n,b:n+3},'Encuentra θ, α y el ángulo recto.')];}
