export const TIPOS=['cuadrado','rectángulo','rombo','romboide','trapecio','trapezoide'];
export const TRAPECIOS=['isósceles','rectángulo','escaleno'];
export const LADOS=['AB','BC','CD','DA'];
const rad=Math.PI/180;
const pick=(list,r)=>list[Math.floor(r()*list.length)];
export function mezclar(list,r=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function cerca(a,b){return Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b));}
const length=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
export function propiedades(points){
  const lados=points.map((p,i)=>length(p,points[(i+1)%4]));
  const angulos=points.map((p,i)=>{const a=points[(i+3)%4],b=points[(i+1)%4],u={x:a.x-p.x,y:a.y-p.y},v={x:b.x-p.x,y:b.y-p.y};return Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y)))))/rad;});
  const pairs=[[0,2],[1,3]].filter(([i,j])=>{const a=points[i],b=points[(i+1)%4],c=points[j],d=points[(j+1)%4];return cerca((b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x),0);});
  return {lados,angulos,paralelos:pairs,rectos:angulos.map((a,i)=>cerca(a,90)?i:-1).filter(i=>i>=0),iguales:lados.every(a=>cerca(a,lados[0])),diagonales:[length(points[0],points[2]),length(points[1],points[3])]};
}
export function clasificar(points){
  const p=propiedades(points);
  if(p.paralelos.length===2)return p.rectos.length===4?(p.iguales?'cuadrado':'rectángulo'):p.iguales?'rombo':'romboide';
  return p.paralelos.length===1?'trapecio':'trapezoide';
}
export function tipoTrapecio(points){
  const p=propiedades(points);if(p.paralelos.length!==1)return null;
  if(p.rectos.length===2)return 'rectángulo';
  const bases=p.paralelos[0],legs=[0,1,2,3].filter(i=>!bases.includes(i));
  return cerca(p.lados[legs[0]],p.lados[legs[1]])?'isósceles':'escaleno';
}
export function crearFigura(tipo,subtipo='isósceles',r=Math.random){
  let pts;const theta=pick([40,50,60,70,110,120,130,140],r),leg=pick([3,4,5],r),h=leg*Math.sin(theta*rad),dx=leg*Math.cos(theta*rad);
  if(tipo==='cuadrado'){const s=pick([3,4,5,6],r);pts=[[0,0],[s,0],[s,s],[0,s]];}
  else if(tipo==='rectángulo'){const w=pick([6,7,8],r),h=pick([2,3,4],r);pts=[[0,0],[w,0],[w,h],[0,h]];}
  else if(tipo==='rombo'||tipo==='romboide'){const w=tipo==='rombo'?leg:pick([6,7,8],r);pts=[[0,0],[w,0],[w+dx,h],[dx,h]];}
  else if(tipo==='trapecio'){
    const top=pick([2,3,4],r),height=pick([2,3,4],r);let base,shift;
    if(subtipo==='isósceles'){shift=height/Math.tan(pick([40,50,60,70],r)*rad);base=top+2*shift;}
    else if(subtipo==='rectángulo'){base=top+pick([2,3,4],r);shift=r()<.5?0:base-top;}
    else if(subtipo==='escaleno'){base=top+4;shift=pick([.5,1,1.5,2.5,3,3.5],r);}
    else throw new RangeError('Tipo de trapecio inválido');
    pts=[[0,0],[base,0],[shift+top,height],[shift,height]];
  }else if(tipo==='trapezoide'){pts=[[0,0],[6,0],[pick([4.5,5,5.5],r),pick([2.5,3,3.5],r)],[pick([.5,1,1.5],r),pick([4,4.5,5],r)]];}
  else throw new RangeError('Cuadrilátero inválido');
  return {tipo,subtipo:tipo==='trapecio'?subtipo:null,puntos:pts.map(([x,y])=>({x,y})),giro:pick([0,30,60,90,120,150,180,210,240,270,300,330],r),tamano:pick([.78,.9,1],r)};
}
export function transformar(figura){
  const angle=figura.giro*rad,points=figura.puntos.map(({x,y})=>({x:x*Math.cos(angle)-y*Math.sin(angle),y:-(x*Math.sin(angle)+y*Math.cos(angle))}));
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
  const scale=Math.min(300/w,220/h)*figura.tamano;
  const convert=p=>{const x=p.x*Math.cos(angle)-p.y*Math.sin(angle),y=-(p.x*Math.sin(angle)+p.y*Math.cos(angle));return {x:260+(x-x0-w/2)*scale,y:205+(y-y0-h/2)*scale};};
  return {puntos:figura.puntos.map(convert),altura:convert({x:figura.puntos[3].x,y:0}),escala:scale};
}
export const INFO={
  cuadrado:{titulo:'Cuadrado',familia:'Paralelogramo',resumen:'Cuatro lados iguales y cuatro ángulos rectos. Tiene dos pares de lados paralelos.',pistas:['4 lados iguales','4 ángulos de 90°','2 pares de lados paralelos']},
  rectángulo:{titulo:'Rectángulo',familia:'Paralelogramo',resumen:'Tiene cuatro ángulos rectos. Los lados opuestos son iguales y paralelos. Aquí exploramos uno que no es cuadrado.',pistas:['4 ángulos de 90°','Lados opuestos iguales','Sus lados vecinos tienen distinta longitud']},
  rombo:{titulo:'Rombo',familia:'Paralelogramo',resumen:'Sus cuatro lados son iguales y sus lados opuestos son paralelos. Aquí sus ángulos no son rectos.',pistas:['4 lados iguales','2 pares de lados paralelos','No tiene ángulos rectos']},
  romboide:{titulo:'Romboide',familia:'Paralelogramo',resumen:'Los lados opuestos son iguales y paralelos. Los lados vecinos tienen distinta longitud y no hay ángulos rectos.',pistas:['2 pares de lados paralelos','Lados vecinos de distinta longitud','No tiene ángulos rectos']},
  trapecio:{titulo:'Trapecio',familia:'Un par paralelo',resumen:'Tiene exactamente un par de lados paralelos: sus bases. Los otros dos lados no son paralelos entre sí.',pistas:['Exactamente 1 par de lados paralelos','Sus lados paralelos se llaman bases','No es un paralelogramo']},
  trapezoide:{titulo:'Trapezoide',familia:'Sin lados paralelos',resumen:'Ningún par de lados es paralelo. Sigue teniendo cuatro lados, cuatro vértices y una suma interior de 360°.',pistas:['Ningún par de lados paralelos','4 lados y 4 vértices','Ángulos interiores que suman 360°']}
};
export const INFO_TRAP={
  isósceles:{resumen:'Sus lados no paralelos son iguales. Los dos ángulos de cada base son iguales y sus diagonales tienen la misma longitud.',pistas:['Lados no paralelos iguales','Ángulos iguales en cada base','Diagonales de igual longitud']},
  rectángulo:{resumen:'Un lado no paralelo es perpendicular a las bases. Por eso tiene dos ángulos rectos; ese lado también puede usarse como altura.',pistas:['2 ángulos de 90°','Un lateral perpendicular a las bases','Ese lateral mide lo mismo que la altura']},
  escaleno:{resumen:'Sus lados no paralelos tienen distinta longitud y no tiene ángulos rectos. En este recorrido separamos los rectángulos como otro tipo.',pistas:['Laterales de distinta longitud','No tiene ángulos rectos','No es isósceles ni rectángulo']}
};
const opciones=(values,r)=>mezclar(values.map(id=>({id,texto:id[0].toUpperCase()+id.slice(1)})),r);
const preguntaBase=(etapa,figura,formato,enunciado,respuesta,pista,explicacion)=>({etapa,figura,formato,enunciado,respuesta,pista,explicacion});
function reconocer(etapa,tipo,r,pistas=false){
  const figura=crearFigura(etapa===1?tipo:'trapecio',etapa===1?pick(TRAPECIOS,r):tipo,r),nombre=etapa===1?tipo:`trapecio ${tipo}`;
  const info=etapa===1?INFO[tipo]:INFO_TRAP[tipo];
  const q=preguntaBase(etapa,figura,pistas?'pistas':'opciones',pistas?'Resuelve el enigma de las pistas':etapa===1?'¿Cuál es su nombre más específico?':'¿Qué tipo de trapecio es?',tipo,'Observa paralelismo, lados iguales y ángulos rectos.',`Es un ${nombre}. ${info.resumen}`);
  q.opciones=opciones(etapa===1?TIPOS:TRAPECIOS,r);q.pistas=pistas?info.pistas:[];return q;
}
function siNo(etapa,figura,truth,r){
  const p=propiedades(figura.puntos),iso=figura.subtipo==='isósceles';
  const claims=etapa===1?[
    ['¿Tiene dos pares de lados paralelos?',p.paralelos.length===2,'Cuenta pares de lados opuestos paralelos.'],
    ['¿Tiene exactamente un par de lados paralelos?',p.paralelos.length===1,'Dos pares corresponden a un paralelogramo; un par, a un trapecio.'],
    ['¿Sus cuatro lados son iguales?',p.iguales,'Compara las marcas de longitud en sus cuatro lados.'],
    ['¿Sus cuatro ángulos son rectos?',p.rectos.length===4,'Un pequeño cuadrado señala cada ángulo de 90°.'],
    ['¿Es un paralelogramo?',p.paralelos.length===2,'Un paralelogramo tiene dos pares de lados paralelos.'],
    ['¿Sus ángulos interiores suman 360°?',true,'Una diagonal lo divide en dos triángulos: 180° + 180°.'],
    ['¿Girar la figura cambia su clasificación?',false,'Girar no modifica lados, paralelismo ni ángulos.']
  ]:[
    ['¿AB y CD son sus bases paralelas?',true,'Las bases son los dos lados paralelos; no dependen de cómo se gire el dibujo.'],
    ['¿Sus diagonales tienen la misma longitud?',cerca(...p.diagonales),'En estos trapecios, la igualdad de diagonales caracteriza al isósceles.'],
    ['¿Tiene dos ángulos rectos?',p.rectos.length===2,'Un trapecio rectángulo tiene un lateral perpendicular a ambas bases.'],
    ['¿Los ángulos A y B son iguales?',cerca(p.angulos[0],p.angulos[1]),'En el isósceles, los dos ángulos de cada base son iguales.'],
    ['¿A y D suman 180°?',true,'DA corta las dos bases paralelas: sus interiores del mismo lado son suplementarios.'],
    ['¿La altura siempre es uno de los lados?',false,'La altura es una distancia perpendicular. Solo puede coincidir con un lateral perpendicular a las bases.'],
    ['¿Tiene dos pares de lados paralelos?',false,'Aquí un trapecio tiene exactamente un par de lados paralelos.'],
    ['¿Sus lados no paralelos tienen igual longitud?',iso,'Compara BC y DA, los laterales.']
  ];
  const [enunciado,respuesta,reason]=pick(claims.filter(c=>c[1]===truth),r),q=preguntaBase(etapa,figura,'sino',enunciado,respuesta,'Usa las marcas de la figura y las propiedades que exploraste.',`${respuesta?'Sí':'No'}. ${reason}`);
  q.opciones=[{id:true,texto:'Sí'},{id:false,texto:'No'}];return q;
}
function parte(index,r){
  const parts=['bases','laterales','altura','diagonales'],part=parts[index],f=crearFigura('trapecio',pick(TRAPECIOS,r),r);
  const reasons={bases:'AB y CD son lados paralelos: son las bases.',laterales:'BC y DA son los lados no paralelos.',altura:'DH une perpendicularmente las rectas de las bases. Su longitud es la altura.',diagonales:'AC y BD unen vértices opuestos. No son lados del contorno.'};
  const q=preguntaBase(2,f,'parte','¿Qué se resalta en el dibujo?',part,'Sigue el trazo grueso. Fíjate en sus extremos y en si forma un ángulo recto.',reasons[part]);
  q.enfoque=part;q.opciones=mezclar(parts.map(id=>({id,texto:{bases:'Bases',laterales:'Lados no paralelos',altura:'Altura',diagonales:'Diagonales'}[id]})),r);return q;
}
function numerico(etapa,index,r){
  const figure=crearFigura(etapa===1?[pick(['cuadrado','rectángulo'],r),'rombo','romboide',pick(['rombo','romboide'],r)][index]:'trapecio',etapa===2&&index===3?'rectángulo':'isósceles',r);
  const angles=propiedades(figure.puntos).angulos.map(Math.round),target=pick([0,1,2,3],r);let q;
  if(etapa===1){
    q=preguntaBase(1,figure,'numero',`¿Cuánto mide el ángulo ${'ABCD'[target]}?`,angles[target],'Resta a 360° la suma de los otros tres ángulos.',`360° − (${angles.filter((_,i)=>i!==target).join('° + ')}°) = ${angles[target]}°.`);
    q.medidas=angles.map((v,i)=>i===target?'?':String(v));q.datos=q.medidas.map((v,i)=>`${'ABCD'[i]} = ${v}°`);q.unidad='°';
  }else if(index===2){
    const value=pick([6,8,10,12,15,18],r);q=preguntaBase(2,figure,'numero','Si AC mide '+value+' cm, ¿cuánto mide BD?',value,'En un trapecio isósceles, las diagonales son iguales.',`Es isósceles: AC = BD. Por eso BD = ${value} cm.`);
    const factor=value/propiedades(figure.puntos).diagonales[0];figure.puntos=figure.puntos.map(p=>({x:p.x*factor,y:p.y*factor}));
    q.datos=['Trapecio isósceles',`AC = ${value} cm`,'BD = ?'];q.enfoque='diagonales';q.unidad='cm';
  }else if(index===3){
    const [known,missing]=propiedades(figure.puntos).rectos;
    q=preguntaBase(2,figure,'numero',`El ángulo ${'ABCD'[known]} es recto. ¿Cuánto mide ${'ABCD'[missing]}?`,90,'Un lateral perpendicular a una base también es perpendicular a la otra, porque las bases son paralelas.',`Los ángulos ${'ABCD'[known]} y ${'ABCD'[missing]} son rectos. Ambos miden 90°.`);
    q.medidas=angles.map((_,i)=>i===known?'90':i===missing?'?':'');q.datos=['Trapecio rectángulo',`${'ABCD'[known]} = 90°`,`${'ABCD'[missing]} = ?`];q.unidad='°';
  }else{
    const a=angles[0],op=index===1?'B':'D',answer=op==='B'?a:180-a;
    q=preguntaBase(2,figure,'numero',`A mide ${a}°. ¿Cuánto mide ${op}?`,answer,op==='B'?'En el isósceles, los ángulos de una misma base son iguales.':'A y D están junto al mismo lateral: suman 180°.',op==='B'?`A = B porque es isósceles. B = ${a}°.`:`A + D = 180°. D = 180° − ${a}° = ${answer}°.`);
    q.medidas=[String(a),op==='B'?'?':'','',op==='D'?'?':''];q.datos=['Trapecio isósceles',`A = ${a}°`,`${op} = ?`];q.unidad='°';
  }
  return q;
}
export function crearSerie(etapa,r=Math.random){
  if(![1,2].includes(etapa))throw new RangeError('Etapa inválida');
  const kinds=mezclar(etapa===1?TIPOS:TRAPECIOS,r),series=[];
  for(let i=0;i<4;i++)series.push(reconocer(etapa,kinds[i%kinds.length],r));
  if(etapa===1){
    for(let i=0;i<4;i++)series.push(siNo(1,crearFigura(kinds[(i+2)%6],pick(TRAPECIOS,r),r),i%2===0,r));
    for(let i=0;i<4;i++)series.push(reconocer(1,kinds[(i+4)%6],r,true));
  }else{
    series.push(...mezclar([0,1,2,3],r).map(i=>parte(i,r)));
    for(let i=0;i<4;i++)series.push(siNo(2,crearFigura('trapecio',kinds[i%3],r),i%2===0,r));
  }
  for(let i=0;i<4;i++)series.push(numerico(etapa,i,r));
  return series;
}
export function crearEstado(etapa,r=Math.random){return {etapa,serie:crearSerie(etapa,r),indice:0,resueltos:0,primerIntento:0,intentos:0,completo:false,fase:'inicio',borrador:'',respuesta:null,retro:null};}
export function responder(s,value){
  if(s.completo)return 'bloqueado';
  const q=s.serie[s.indice];
  if(q.formato==='numero'){
    if(typeof value!=='string'||!/^\s*\d+(?:[.,]\d+)?\s*$/.test(value))return 'vacio';
    value=Number(value.trim().replace(',','.'));
  }else if(!q.opciones.some(o=>o.id===value))return 'vacio';
  s.intentos++;s.respuesta=value;
  if(value!==q.respuesta)return 'incorrecto';
  s.completo=true;s.resueltos++;if(s.intentos===1)s.primerIntento++;return 'correcto';
}
export function avanzar(s){if(!s.completo||s.indice===15)return false;s.indice++;Object.assign(s,{completo:false,intentos:0,fase:'reto',borrador:'',respuesta:null,retro:null});return true;}
