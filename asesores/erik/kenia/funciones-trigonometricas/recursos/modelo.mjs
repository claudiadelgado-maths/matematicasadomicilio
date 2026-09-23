export const FUNCIONES = [
  { slug:'seno', nombre:'Seno', simbolo:'\\sin', arriba:'CO', abajo:'H', frase:'Compara el cateto opuesto con la hipotenusa.' },
  { slug:'coseno', nombre:'Coseno', simbolo:'\\cos', arriba:'CA', abajo:'H', frase:'Compara el cateto adyacente con la hipotenusa.' },
  { slug:'tangente', nombre:'Tangente', simbolo:'\\tan', arriba:'CO', abajo:'CA', frase:'Compara el cateto opuesto con el cateto adyacente.' },
  { slug:'cotangente', nombre:'Cotangente', simbolo:'\\cot', arriba:'CA', abajo:'CO', frase:'Compara el cateto adyacente con el cateto opuesto.' },
  { slug:'secante', nombre:'Secante', simbolo:'\\sec', arriba:'H', abajo:'CA', frase:'Compara la hipotenusa con el cateto adyacente.' },
  { slug:'cosecante', nombre:'Cosecante', simbolo:'\\csc', arriba:'H', abajo:'CO', frase:'Compara la hipotenusa con el cateto opuesto.' },
];
export const ABREVIATURAS = { CO:'C.O.', CA:'C.A.', H:'H.' };
export const TRIPLES = [[4,3,5],[12,5,13],[8,15,17],[15,8,17],[7,24,25],[12,5,13]];
export const NIVELES = [0,105,220];
export function lados(a,b,h,referencia=1) {
  return referencia === 1 ? {CO:b,CA:a,H:h} : {CO:a,CA:b,H:h};
}
export function ejemplo(indice,variante=0) {
  const original = ['seno','coseno','tangente','cosecante','secante','cotangente'].indexOf(FUNCIONES[indice].slug);
  const [a,b,h] = TRIPLES[(original+variante)%TRIPLES.length];
  const inicial = [1,1,2,1,2,1][original];
  const referencia = variante%2 === 0 ? inicial : 3-inicial;
  return {a,b,h,referencia,rotacion:[0,105,220][variante%3],valores:lados(a,b,h,referencia)};
}
export function validarFraccion(numerador,denominador,esperadoN,esperadoD) {
  const n=String(numerador).trim(), d=String(denominador).trim();
  if (!n || !d) return {ok:false,motivo:'Completa el numerador y el denominador.'};
  if (![n,d].every(v=>/^[+-]?\d{1,9}$/.test(v))) return {ok:false,motivo:'Escribe números enteros (hasta nueve cifras), sin decimales ni barras.'};
  if (BigInt(d)===0n) return {ok:false,motivo:'El denominador no puede ser cero.'};
  const ok=BigInt(n)*BigInt(esperadoD)===BigInt(d)*BigInt(esperadoN);
  return {ok,motivo:ok?'¡Correcto! Tu fracción representa la razón pedida.':'Todavía no. Revisa qué lado corresponde al numerador y cuál al denominador.'};
}
export function validarLados(asignaciones) {
  return asignaciones.length===3 && asignaciones[0]==='cateto' && asignaciones[1]==='cateto' && asignaciones[2]==='hipotenusa';
}
export function validarIntegrador(valores) {
  const esperados=FUNCIONES.flatMap(f=>[f.arriba,f.abajo]);
  const correctas=esperados.map((valor,i)=>valores[i]===valor);
  return {ok:valores.length===12&&correctas.every(Boolean),correctas,total:correctas.filter(Boolean).length};
}

// C es el vértice recto; CA y CB son los catetos, AB es la hipotenusa.
// El dibujo se rota y escala sin deformar sus proporciones.
export function geometria(a,b,rotacion=0) {
  const angle=rotacion*Math.PI/180;
  let vertices=[[0,0],[a,0],[0,-b]].map(([x,y])=>[x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle)]);
  const xs=vertices.map(p=>p[0]),ys=vertices.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const scale=Math.min(280/(maxX-minX),180/(maxY-minY));
  vertices=vertices.map(([x,y])=>[250+(x-(minX+maxX)/2)*scale,165+(y-(minY+maxY)/2)*scale]);
  const centro=[vertices.reduce((sum,p)=>sum+p[0],0)/3,vertices.reduce((sum,p)=>sum+p[1],0)/3];
  const aristas=[[0,1],[0,2],[1,2]];
  const etiquetas=aristas.map(([i,j])=>{
    const p=vertices[i],q=vertices[j],medio=[(p[0]+q[0])/2,(p[1]+q[1])/2];
    let normal=[-(q[1]-p[1]),q[0]-p[0]];
    if(normal[0]*(medio[0]-centro[0])+normal[1]*(medio[1]-centro[1])<0) normal=normal.map(v=>-v);
    const length=Math.hypot(...normal);
    return [medio[0]+normal[0]/length*36,medio[1]+normal[1]/length*36];
  });
  return {vertices,etiquetas,centro};
}
