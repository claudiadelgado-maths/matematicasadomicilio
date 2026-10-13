export const PARTES=[
 {id:'lado',nombre:'Lado',texto:'Cada segmento que forma el borde del polígono.',pista:'Busca un segmento que siga el contorno.',descripcion:'Un segmento del contorno está resaltado.'},
 {id:'vertice',nombre:'Vértice',texto:'La esquina donde se unen dos lados.',pista:'Busca un punto en una esquina.',descripcion:'Está resaltado el punto donde se encuentran dos lados del contorno.'},
 {id:'diagonal',nombre:'Diagonal',texto:'Une dos vértices no consecutivos: salta al menos una esquina.',pista:'Une dos esquinas sin seguir un lado del contorno.',descripcion:'Un segmento resaltado une dos esquinas no vecinas.'},
 {id:'interior',nombre:'Ángulo interior',texto:'Se forma dentro del polígono, entre dos lados que se encuentran en un vértice.',pista:'La zona de color se abre hacia dentro desde una esquina.',descripcion:'Una zona angular está resaltada dentro de la figura, junto a una esquina, entre dos lados consecutivos.'},
 {id:'exterior',nombre:'Ángulo exterior',texto:'Se forma fuera del polígono, entre un lado y la prolongación del lado vecino.',pista:'Busca una zona angular fuera del contorno y un lado prolongado.',descripcion:'Una zona angular está resaltada fuera de la figura, entre un lado y la continuación del lado vecino.'},
 {id:'centro',nombre:'Centro',texto:'El punto central del polígono regular. Está a la misma distancia de todos sus vértices.',pista:'Busca el punto en medio de la figura.',descripcion:'Solo el punto en medio de la figura está resaltado.'},
 {id:'radio',nombre:'Radio',texto:'El segmento que va del centro a un vértice.',pista:'Va del punto central hasta una esquina.',descripcion:'Un segmento resaltado va del punto central a una esquina.'},
 {id:'apotema',nombre:'Apotema',texto:'Va del centro a la mitad de un lado y es perpendicular a él. La pequeña escuadra marca el ángulo recto.',pista:'Llega a la mitad de un lado y tiene una pequeña escuadra.',descripcion:'Un segmento resaltado va del punto central a la mitad de un lado. Una pequeña escuadra indica que es perpendicular al lado.'},
 {id:'central',nombre:'Ángulo central',texto:'Tiene su vértice en el centro y se abre hacia dos vértices consecutivos.',pista:'La punta del ángulo está en el punto central.',descripcion:'Una zona angular resaltada tiene su punta en el punto central y se abre hacia dos esquinas vecinas.'}
];
export const FIGURAS=['Triángulo','Cuadrado','Pentágono','Hexágono','Heptágono','Octágono','Eneágono'];
export const parte=id=>PARTES.find(p=>p.id===id);
export const nombreFigura=n=>FIGURAS[n-3];
export const disponible=(id,n)=>Number.isInteger(n)&&n>=3&&n<=9&&!!parte(id)&&!(id==='diagonal'&&n===3);
export function mezclar(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function dibujo(id,random){
 const min=id==='diagonal'?4:3,n=min+Math.floor(random()*(10-min));
 return {parte:id,n,giro:random()*Math.PI*2,vertice:Math.floor(random()*n),salto:2+Math.floor(random()*Math.max(1,n-3))};
}
export function crearPregunta(modo,id,random=Math.random){
 if(!['imagenes','palabras'].includes(modo)||!parte(id))throw new RangeError('Modo o concepto desconocido');
 const opciones=mezclar([id,...mezclar(PARTES.filter(p=>p.id!==id).map(p=>p.id),random).slice(0,3)],random);
 return {modo,objetivo:id,opciones:opciones.map(p=>modo==='imagenes'?dibujo(p,random):{parte:p}),figura:modo==='palabras'?dibujo(id,random):null,color:Math.floor(random()*5),resuelta:false,intentos:0,descartadas:[],ultima:null};
}
export function siguiente(s,random=Math.random){
 if(!s.bolsa.length){s.bolsa=mezclar(PARTES.map(p=>p.id),random);if(s.bolsa[0]===s.pregunta?.objetivo)[s.bolsa[0],s.bolsa[1]]=[s.bolsa[1],s.bolsa[0]];}
 s.pregunta=crearPregunta(s.modo,s.bolsa.shift(),random);s.numero++;return s.pregunta;
}
export function crearPractica(modo,random=Math.random){const s={modo,bolsa:[],numero:0,aciertos:0,primero:0,descubiertas:new Set(),pregunta:null};siguiente(s,random);return s;}
export function responder(s,index){
 const q=s.pregunta;if(q.resuelta||!Number.isInteger(index)||index<0||index>=q.opciones.length||q.descartadas.includes(index))return null;
 q.intentos++;const correcta=q.opciones[index].parte===q.objetivo;q.ultima={index,correcta};
 if(correcta){q.resuelta=true;s.aciertos++;if(q.intentos===1)s.primero++;s.descubiertas.add(q.objetivo);}else q.descartadas.push(index);
 return q.ultima;
}
