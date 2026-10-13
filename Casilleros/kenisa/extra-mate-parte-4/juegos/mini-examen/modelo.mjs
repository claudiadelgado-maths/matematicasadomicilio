import {fr,puntosLados,puntosAngulos,angulosDe,mezclar,entero,elegir,triangulo,marcarLado,marcarAngulo,copiaEscalada} from '../../recursos/matematicas-triangulos.mjs?v=20261009-2';
export const TEMAS=[
 ['angulos','Tipos de ángulos','∠'],['paralelas','Ángulos entre paralelas','∥'],['triangulos','Clasificar triángulos','△'],['medidas-triangulo','Ángulos de triángulos','180°'],['cuadrilateros','Cuadriláteros','▱'],['trapecios','Tipos de trapecios','▰'],['circulo','Partes del círculo','◯'],['perimetros','Perímetros','P'],['areas','Áreas','A'],['nombres','Nombres de polígonos','⬡'],['partes','Partes de un polígono','•'],['formulas','Fórmulas de polígonos','N'],['relacion','Semejanza y congruencia','≅'],['ecuaciones','Ecuaciones lineales','x']
].map(([id,nombre,icono],i)=>({id,nombre,icono,numero:i+1}));
export const NOMBRES={3:'Triángulo',4:'Cuadrado',5:'Pentágono',6:'Hexágono',7:'Heptágono',8:'Octágono',9:'Eneágono',10:'Decágono',11:'Endecágono',12:'Dodecágono'};
export const PARTES={lado:'Lado',vertice:'Vértice',diagonal:'Diagonal',interior:'Ángulo interior',exterior:'Ángulo exterior',centro:'Centro',radio:'Radio',apotema:'Apotema',central:'Ángulo central'};
export const CIRCULO={cuerda:'Cuerda',diametro:'Diámetro',radio:'Radio',tangente:'Tangente',secante:'Secante',circunferencia:'Circunferencia',arco:'Arco'};
export const CUADS={cuadrado:'Cuadrado',rectangulo:'Rectángulo',rombo:'Rombo',romboide:'Romboide',trapecio:'Trapecio',trapezoide:'Trapezoide'};
export const ANGULOS={nulo:'Nulo',agudo:'Agudo',recto:'Recto',obtuso:'Obtuso',llano:'Llano',concavo:'Cóncavo',completo:'Completo / perigonal'};
export const RELACIONES={correspondientes:'Correspondientes','alternos-internos':'Alternos internos','alternos-externos':'Alternos externos','colaterales-internos':'Colaterales internos','colaterales-externos':'Colaterales externos',adyacentes:'Adyacentes',opuestos:'Opuestos por el vértice'};
export const PARES={correspondientes:[[0,4],[1,5],[2,6],[3,7]],'alternos-internos':[[2,4],[3,5]],'alternos-externos':[[0,6],[1,7]],'colaterales-internos':[[2,5],[3,4]],'colaterales-externos':[[0,7],[1,6]],adyacentes:[[0,1],[1,2],[2,3],[0,3],[4,5],[5,6],[6,7],[4,7]],opuestos:[[0,2],[1,3],[4,6],[5,7]]};
const FORMULAS=['perimetro','area','diagonales-vertice','diagonales-total','central-interior','central-exterior','interior-exterior','interior-central','n-central','n-interior','n-exterior','n-suma','interior-suma'];
const secuencia=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
export const CASOS={
 angulos:Object.keys(ANGULOS),paralelas:Object.entries(PARES).flatMap(([k,ps])=>ps.map((_,i)=>k+':'+i)),triangulos:['lados:equilatero','lados:isosceles','lados:escaleno','angulos:acutangulo','angulos:rectangulo','angulos:obtusangulo'],
 'medidas-triangulo':['interior','exterior','exterior-adyacente','exterior-remoto'],cuadrilateros:Object.keys(CUADS),trapecios:['rectangulo','isosceles','escaleno'],circulo:Object.keys(CIRCULO),perimetros:['cuadrado','rectangulo','trapecio','circulo'],areas:['cuadrado','rectangulo','trapecio','circulo'],
 nombres:secuencia(3,12).flatMap(n=>['nombre','figura','lados'].map(m=>m+':'+n)),partes:Object.keys(PARTES).flatMap(p=>secuencia(p==='diagonal'?4:3,9).flatMap(n=>['nombre','figura'].map(m=>[m,p,n].join(':')))),formulas:FORMULAS,relacion:['semejantes','congruentes','ninguno'],ecuaciones:['suma','resta','multiplo']
};
export const redondear=(n,d=2)=>Math.round((n+Number.EPSILON)*10**d)/10**d;
export const numero=n=>String(redondear(n)).replace('.',',');
const punto=(x,y)=>({x,y});
export function regular(n,giro=-90){return secuencia(0,n-1).map(i=>{const a=(giro+i*360/n)*Math.PI/180;return punto(Math.cos(a),Math.sin(a));});}
export function figuraCuadrilatero(tipo,r=Math.random){
 const puntos={cuadrado:[[0,0],[6,0],[6,6],[0,6]],rectangulo:[[0,0],[9,0],[9,5],[0,5]],rombo:[[0,0],[6,0],[9,Math.sqrt(27)],[3,Math.sqrt(27)]],romboide:[[0,0],[9,0],[12,4],[3,4]],trapecio:[[0,0],[12,0],[9,4],[3,4]],trapezoide:[[0,0],[9,0],[7,5],[1,7]]}[tipo].map(([x,y])=>punto(x,y));
 return {kind:'shape',puntos,giro:elegir([0,30,-25,180],r)};
}
export function trapecio(tipo,r=Math.random){
 const k=entero(1,2,r),b=entero(4,8,r),[izq,der,h,li,ld]=tipo==='isosceles'?[3,3,4,5,5]:tipo==='rectangulo'?[0,3,4,4,5]:[5,9,12,13,15];
 const B=b+izq+der;return {kind:'shape',puntos:[[0,0],[B,0],[izq+b,h],[izq,h]].map(([x,y])=>punto(x*k,y*k)),giro:0,b:b*k,B:B*k,h:h*k,lados:[B,ld,b,li].map(v=>v*k),rectos:tipo==='rectangulo'?[0,3]:[],tipo};
}
function opciones(q,correcta,lista,r,{fijaUltima=null,figuras=null}={}){
 const otros=mezclar(lista.filter(([id])=>id!==correcta&&id!==fijaUltima),r).slice(0,fijaUltima?2:3);
 let elegidas=mezclar([lista.find(([id])=>id===correcta),...otros],r);if(fijaUltima)elegidas.push(lista.find(([id])=>id===fijaUltima));
 q.correcta=correcta;q.opciones=elegidas.map(([id,label])=>({id,label,...(figuras?{dibujo:figuras(id)}:{})}));return q;
}
function numericas(q,respuesta,r,unidad='',pi=false,distractores=[]){
 const n=redondear(respuesta),candidatos=[n,...distractores,n+1,Math.max(0,n-1),n+2,n+5,n+10].map(v=>redondear(v)).filter(v=>Number.isFinite(v)&&v>=0);
 const unicos=[...new Set(candidatos)];q.valor=n;q.unidad=unidad;q.pi=pi;
 return opciones(q,'v'+n,unicos.map(v=>['v'+v,`${numero(v)}${pi?'π':''}${unidad?' '+unidad:''}`]),r);
}
function triangular(angles){return triangulo(['A','B','C'],puntosAngulos(angles),'alineados',Math.random);}
function nombreLado(i){return ['AB','BC','AC'][i];}
function basePregunta(tipo,caso){return {tipo,caso,pregunta:'',nota:'',datos:[],dibujo:null,opciones:[],correcta:null,explicacion:'',pista:'',audit:{},intentos:0,resuelta:false,descartadas:[]};}
export function generar(tipo,caso,r=Math.random){
 if(!CASOS[tipo]?.includes(caso))throw new RangeError('Tipo o caso desconocido');
 const q=basePregunta(tipo,caso);
 if(tipo==='angulos'){
  const g={nulo:0,agudo:entero(3,16,r)*5,recto:90,obtuso:entero(21,33,r)*5,llano:180,concavo:entero(39,69,r)*5,completo:360}[caso];
  q.pregunta='¿Cómo se llama este ángulo?';q.dibujo={kind:'angle',grados:g};q.audit={grados:g};
  q.explicacion={nulo:'Un ángulo nulo mide 0°.',agudo:'Un ángulo agudo mide más de 0° y menos de 90°.',recto:'Un ángulo recto mide 90°.',obtuso:'Un ángulo obtuso mide más de 90° y menos de 180°.',llano:'Un ángulo llano mide 180°: media vuelta.',concavo:'Un ángulo cóncavo mide más de 180° y menos de 360°.',completo:'Un ángulo completo o perigonal mide 360°: una vuelta entera.'}[caso];q.pista='Compara la abertura con 90°, 180° y una vuelta de 360°.';
  return opciones(q,caso,Object.entries(ANGULOS),r);
 }
 if(tipo==='paralelas'){
  const [rel,index]=caso.split(':'),par=PARES[rel][+index];q.pregunta='¿Qué relación tienen los ángulos A y B?';q.dibujo={kind:'parallels',par,inclination:elegir([45,55,65],r)};q.audit={rel,par};
  q.explicacion={correspondientes:'Ocupan la misma posición en los dos cruces.','alternos-internos':'Están entre las paralelas y a lados opuestos de la transversal.','alternos-externos':'Están fuera de las paralelas y a lados opuestos de la transversal.','colaterales-internos':'Están entre las paralelas y al mismo lado de la transversal.','colaterales-externos':'Están fuera de las paralelas y al mismo lado de la transversal.',adyacentes:'Comparten vértice y un lado; los otros dos lados forman una recta.',opuestos:'Están enfrentados en el mismo cruce y no comparten un lado.'}[rel];q.pista='Busca si están dentro o fuera, en el mismo cruce y al mismo lado o a lados opuestos de la transversal.';
  return opciones(q,rel,Object.entries(RELACIONES),r);
 }
 if(tipo==='triangulos'){
  const [por,clase]=caso.split(':'),escala=entero(1,3,r);let t;
  if(por==='lados'){
   const ls={equilatero:[4,4,4],isosceles:[5,5,6],escaleno:[3,4,5]}[clase].map(v=>v*escala);t=triangulo(['A','B','C'],puntosLados(ls.map(v=>fr(v))),'alineados',r);ls.forEach((v,i)=>marcarLado(t,i,fr(v)));q.audit={lados:ls};
  }else{
   const a={acutangulo:elegir([[40,60,80],[50,60,70],[45,65,70]],r),rectangulo:elegir([[30,60,90],[40,50,90]],r),obtusangulo:elegir([[30,40,110],[25,35,120]],r)}[clase];t=triangular(a);a.forEach((v,i)=>marcarAngulo(t,i,v));q.audit={angulos:a};
  }
  t.giro=elegir([0,40,140],r);q.dibujo={kind:'triangle',t};q.pregunta=`Según sus ${por}, ¿cómo se clasifica este triángulo?`;q.nota='Elige el nombre más específico.';
  q.explicacion={equilatero:'Sus tres lados son iguales: equilátero.',isosceles:'Tiene exactamente dos lados iguales: isósceles.',escaleno:'Sus tres lados tienen medidas diferentes: escaleno.',acutangulo:'Sus tres ángulos son menores de 90°: acutángulo.',rectangulo:'Tiene un ángulo de 90°: rectángulo.',obtusangulo:'Tiene un ángulo mayor de 90°: obtusángulo.'}[clase];q.pista=por==='lados'?'Cuenta cuántos lados tienen la misma medida.':'Busca si algún ángulo alcanza o supera 90°.';
  const opts=por==='lados'?[['equilatero','Equilátero'],['isosceles','Isósceles'],['escaleno','Escaleno']]:[['acutangulo','Acutángulo'],['rectangulo','Rectángulo'],['obtusangulo','Obtusángulo']];
  return opciones(q,clase,[...opts,['no','No es un triángulo']],r,{fijaUltima:'no'});
 }
 if(tipo==='medidas-triangulo'){
  const a=entero(4,12,r)*5,b=entero(5,13,r)*5,c=180-a-b,angles=[a,b,c],exterior=180-b,t=triangular(angles);let respuesta;
  if(caso==='interior'){marcarAngulo(t,0,a);marcarAngulo(t,1,b);marcarAngulo(t,2,'?',{objetivo:true});respuesta=c;q.pregunta='¿Cuánto mide el ángulo C?';q.explicacion=`C = 180° − ${a}° − ${b}° = ${c}°.`;}
  if(caso==='exterior'){marcarAngulo(t,0,a);marcarAngulo(t,2,c);respuesta=exterior;q.pregunta='¿Cuánto mide el ángulo exterior señalado?';q.explicacion=`Primero B = 180° − ${a}° − ${c}° = ${b}°. Después, exterior = 180° − ${b}° = ${exterior}°.`;}
  if(caso==='exterior-adyacente'){marcarAngulo(t,1,'?',{objetivo:true});respuesta=b;q.pregunta='¿Cuánto mide el ángulo interior B?';q.explicacion=`El interior B y su exterior suman 180°: B = 180° − ${exterior}° = ${b}°.`;}
  if(caso==='exterior-remoto'){marcarAngulo(t,0,a);marcarAngulo(t,2,'?',{objetivo:true});respuesta=c;q.pregunta='¿Cuánto mide el ángulo C?';q.explicacion=`B = 180° − ${exterior}° = ${b}°. Luego C = 180° − ${a}° − ${b}° = ${c}°.`;}
  q.dibujo={kind:'triangle',t,...(caso==='interior'?{}:{exterior:caso==='exterior'?'?':exterior})};q.audit={angles,exterior};q.pista='Los tres interiores suman 180°. Un interior y su exterior adyacente también suman 180°.';
  return numericas(q,respuesta,r,'°',false,[180-respuesta,a+b,180-a]);
 }
 if(tipo==='cuadrilateros'){
  const pistas={cuadrado:['2 pares de lados paralelos','4 lados iguales','4 ángulos rectos'],rectangulo:['2 pares de lados paralelos','4 ángulos rectos','No tiene los 4 lados iguales'],rombo:['2 pares de lados paralelos','4 lados iguales','Ningún ángulo recto'],romboide:['2 pares de lados paralelos','No tiene los 4 lados iguales','Ningún ángulo recto'],trapecio:['Exactamente 1 par de lados paralelos'],trapezoide:['Ningún par de lados paralelos']};
  q.pregunta='¿Qué figura cumple todas estas pistas?';q.datos=pistas[caso];q.explicacion=`${CUADS[caso]}: ${pistas[caso].join(', ').toLowerCase()}.`;q.pista='Usa todas las pistas a la vez. Aquí trapecio significa exactamente un par de lados paralelos.';q.audit={clase:caso};
  return opciones(q,caso,Object.entries(CUADS),r,{figuras:id=>figuraCuadrilatero(id,r)});
 }
 if(tipo==='trapecios'){
  const t=trapecio(caso,r);q.dibujo={...t,mostrarLados:true,paralelas:true};q.pregunta='¿Qué tipo de trapecio aparece?';q.audit=t;
  q.nota='Isósceles: laterales iguales. Escaleno: laterales distintos y sin ángulos rectos.';q.explicacion={rectangulo:'Tiene dos ángulos rectos: es un trapecio rectángulo.',isosceles:`Sus lados no paralelos miden lo mismo (${t.lados[1]} cm): es isósceles.`,escaleno:'Sus laterales son distintos y no tiene ángulos rectos: es escaleno.'}[caso];q.pista='Las bases son paralelas. Compara los otros dos lados y busca marcas de 90°.';
  return opciones(q,caso,[['rectangulo','Rectángulo'],['isosceles','Isósceles'],['escaleno','Escaleno'],['no','No es un trapecio']],r,{fijaUltima:'no'});
 }
 if(tipo==='circulo'){
  q.pregunta='¿Cuál es el nombre más específico del elemento resaltado?';q.dibujo={kind:'circle',parte:caso,giro:elegir([0,25,-20],r)};
  q.explicacion={cuerda:'La cuerda une dos puntos de la circunferencia; la señalada no pasa por el centro.',diametro:'El diámetro une dos puntos de la circunferencia pasando por el centro.',radio:'El radio va del centro a un punto de la circunferencia.',tangente:'La tangente toca la circunferencia en un solo punto.',secante:'La secante atraviesa la circunferencia en dos puntos y continúa fuera de ella.',circunferencia:'La circunferencia es todo el borde curvo del círculo.',arco:'Un arco es una porción de la circunferencia.'}[caso];q.pista='Fíjate en sus extremos, si pasa por el centro y si es un segmento, una recta o una curva.';
  return opciones(q,caso,Object.entries(CIRCULO),r);
 }
 if(tipo==='perimetros'||tipo==='areas'){
  const area=tipo==='areas';let respuesta,pi=false;
  q.pregunta=`¿Cuánto mide ${area?'el área':'el perímetro'}?`;
  if(caso==='cuadrado'||caso==='rectangulo'){
   const b=entero(3,12,r),h=caso==='cuadrado'?b:entero(2,b-1,r);q.dibujo={kind:'shape',puntos:[[0,0],[b,0],[b,h],[0,h]].map(([x,y])=>punto(x,y)),labels:caso==='cuadrado'?{0:b}:{0:b,1:h},rectos:[0],giro:0};
   q.datos=[CUADS[caso]];respuesta=area?b*h:2*(b+h);q.audit={b,h};q.explicacion=area?`Área = ${b} × ${h} = ${respuesta} cm².`:`Perímetro = ${caso==='cuadrado'?`4 × ${b}`:`2 × (${b} + ${h})`} = ${respuesta} cm.`;
  }else if(caso==='trapecio'){
   const t=trapecio(elegir(['isosceles','rectangulo','escaleno'],r),r);q.dibujo={...t,mostrarLados:!area,labels:area?{0:t.B,2:t.b}:null,altura:area};q.audit=t;q.datos=['Trapecio'];respuesta=area?(t.B+t.b)*t.h/2:t.lados.reduce((a,b)=>a+b,0);
   q.explicacion=area?`Área = (${t.B} + ${t.b}) × ${t.h} ÷ 2 = ${respuesta} cm².`:`Perímetro = ${t.lados.join(' + ')} = ${respuesta} cm.`;
  }else{
   const radio=entero(2,10,r);q.dibujo={kind:'circle',parte:'radio',medida:radio};q.audit={radio};respuesta=area?radio*radio:2*radio;pi=true;q.nota='Deja π en el resultado; no necesitas usar decimales.';q.explicacion=area?`Área = π × ${radio}² = ${respuesta}π cm².`:`Longitud de la circunferencia = 2 × π × ${radio} = ${respuesta}π cm.`;
  }
  q.pista=area?'El área mide el interior. Usa base × altura, (B + b) × h ÷ 2 o πr², según la figura.':'El perímetro recorre el borde: suma todos los lados; en la circunferencia usa 2πr.';
  return numericas(q,respuesta,r,area?'cm²':'cm',pi,[respuesta*2,respuesta/2,respuesta+4]);
 }
 if(tipo==='nombres'){
  const [modo,num]=caso.split(':'),n=+num,poligono={kind:'polygon',n,giro:elegir([-90,-65,-30],r)};q.audit={n,modo};
  q.explicacion=`${NOMBRES[n]}: tiene ${n} lados.`;q.pista='Recorre el borde y cuenta cada segmento una sola vez.';
  if(modo==='figura'){q.pregunta=`¿Cuál es el ${NOMBRES[n].toLowerCase()}?`;return opciones(q,String(n),Object.keys(NOMBRES).map(k=>[k,'']),r,{figuras:id=>({...poligono,n:+id})});}
  q.dibujo=poligono;q.pregunta=modo==='nombre'?'¿Cómo se llama este polígono?':'¿Cuántos lados tiene esta figura?';
  return modo==='nombre'?opciones(q,String(n),Object.entries(NOMBRES),r):numericas(q,n,r,'lados',false,[n-1,n+1,n+2]);
 }
 if(tipo==='partes'){
  const [modo,parte,num]=caso.split(':'),n=+num;q.audit={n,parte,modo};q.pista='Busca dónde empieza y termina lo resaltado: una esquina, el centro, el borde o un lado.';
  q.explicacion={lado:'Lado: segmento del borde entre dos vértices consecutivos.',vertice:'Vértice: esquina donde se unen dos lados.',diagonal:'Diagonal: une dos vértices que no son consecutivos.',interior:'Ángulo interior: queda dentro de la figura, entre dos lados consecutivos.',exterior:'Ángulo exterior: queda entre un lado y la prolongación del lado vecino.',centro:'Centro: punto central del polígono regular.',radio:'Radio: va del centro a un vértice.',apotema:'Apotema: va del centro al punto medio de un lado y es perpendicular a él.',central:'Ángulo central: está en el centro, entre dos radios hacia vértices consecutivos.'}[parte];
  if(modo==='figura'){q.pregunta=`¿Qué imagen muestra ${PARTES[parte].toLowerCase()}?`;return opciones(q,parte,Object.keys(PARTES).map(k=>[k,'']),r,{figuras:id=>({kind:'polygon',n:id===parte?n:entero(id==='diagonal'?4:3,9,r),parte:id,giro:-90})});}
  q.pregunta='¿Qué parte del polígono está resaltada?';q.dibujo={kind:'polygon',n,parte,giro:elegir([-90,-70,-30],r)};return opciones(q,parte,Object.entries(PARTES),r);
 }
 if(tipo==='formulas'){
  // Pares tomados de geometría real: cuentas cortas y resultados enteros aun cuando la apotema se aproxima.
  const parArea=caso==='area'?elegir([[4,2],[4,4],[4,6],[5,2],[5,4],[6,4],[10,2]],r):null;
  const angular=caso.includes('central')||caso.includes('interior')||caso.includes('exterior'),n=parArea?parArea[0]:elegir(angular?[3,4,5,6,8,9,10,12]:secuencia(3,12),r),l=parArea?parArea[1]:elegir([2,4,6],r),central=360/n,interior=180-central,suma=(n-2)*180;
  q.dibujo={kind:'polygon',n,giro:-90};q.datos=[`${NOMBRES[n]} regular`];q.audit={n,l,central,interior,suma};let respuesta,unidad='';
  if(caso==='perimetro'){q.pregunta='¿Cuál es el perímetro del polígono?';q.datos.push(`N = ${n} lados`,`Cada lado mide ${l} cm`);q.dibujo.lado=l;respuesta=n*l;unidad='cm';q.explicacion=`P = N × L = ${n} × ${l} = ${respuesta} cm.`;}
  else if(caso==='area'){
   const real=l/(2*Math.tan(Math.PI/n)),a=redondear(real,1);q.audit.apotema=a;q.audit.apotemaReal=real;q.dibujo.parte='apotema';q.dibujo.apotema=a;q.dibujo.lado=l;q.dibujo.aproximado=n!==4;
   q.pregunta=n===4?'¿Cuál es el área?':'¿Cuál es el área aproximada usando estos datos?';q.datos.push(`N = ${n} lados`,`Cada lado mide ${l} cm`,`Apotema ${n===4?'=':'≈'} ${numero(a)} cm`);q.nota=n===4?'':'La apotema está redondeada a una décima. Calcula con el valor mostrado.';
   respuesta=redondear(n*l*a/2);unidad='cm²';q.explicacion=`P = ${n} × ${l} = ${n*l} cm. A ${n===4?'=':'≈'} ${n*l} × ${numero(a)} ÷ 2 = ${numero(respuesta)} cm².`;
  }else if(caso==='diagonales-vertice'){q.pregunta='¿Cuántas diagonales salen de un solo vértice?';q.datos.push(`N = ${n} lados`);respuesta=n-3;q.explicacion=`Desde un vértice: N − 3 = ${n} − 3 = ${respuesta}. No se une consigo mismo ni con sus dos vecinos.`;}
  else if(caso==='diagonales-total'){q.pregunta='¿Cuántas diagonales tiene en total?';q.datos.push(`N = ${n} lados`);respuesta=n*(n-3)/2;q.explicacion=`D = N(N − 3) ÷ 2 = ${n} × ${n-3} ÷ 2 = ${respuesta}. Se divide entre 2 para no contar cada diagonal dos veces.`;}
  else{
   const [origen,destino]=caso.split('-'),dado=origen==='n'?n:origen==='central'?central:interior;
   const nombres={central:'central',interior:'interior',exterior:'exterior',suma:'la suma de todos los interiores'};
   q.datos.push(origen==='n'?`N = ${n} lados`:`Ángulo ${origen} = ${dado}°`);q.pregunta=destino==='suma'?'¿Cuánto suman todos sus ángulos interiores?':`¿Cuánto mide el ángulo ${nombres[destino]}?`;
   respuesta=destino==='suma'?suma:destino==='interior'?interior:central;unidad='°';
   if(origen!=='n')q.dibujo.parte=origen;
   q.explicacion=destino==='suma'?`${origen==='interior'?`Exterior = 180° − ${interior}° = ${central}°. N = 360° ÷ ${central}° = ${n}. `:''}S = (N − 2) × 180° = ${suma}°.`:origen==='n'?`Central = exterior = 360° ÷ ${n} = ${central}°. Interior = 180° − ${central}° = ${interior}°.`:`Central y exterior miden lo mismo; interior + exterior = 180°. El ángulo pedido mide ${respuesta}°.`;
  }
  q.pista=caso==='area'?'Primero calcula P = N × L. Después A = P × a ÷ 2.':caso.startsWith('diagonales')?'Desde un vértice: N − 3. En total: N(N − 3) ÷ 2.':'P = N × L. Central = exterior = 360° ÷ N. Interior = 180° − exterior. Suma interior = (N − 2) × 180°.';
  return numericas(q,respuesta,r,unidad,false,[respuesta+ n,respuesta/2,respuesta*2]);
 }
 if(tipo==='relacion'){
  const k=entero(1,3,r),ls=[3,4,5].map(v=>v*k),otro=caso==='ninguno'?[4,5,7].map(v=>v*k):ls.map(v=>v*(caso==='semejantes'?2:1));
  const ts=[ls,otro].map((val,i)=>{const t=triangulo(i?['X','Y','Z']:['A','B','C'],puntosLados(val.map(v=>fr(v))),i?elegir(['girados','reflejados'],r):'alineados',r);val.forEach((v,j)=>marcarLado(t,j,fr(v)));angulosDe(t.puntos).forEach((v,j)=>marcarAngulo(t,j,redondear(v)));return t;});
  q.pregunta='¿Qué relación tienen estos triángulos?';q.nota='Elige «Congruentes» si también tienen el mismo tamaño. Aquí «Semejantes» significa misma forma y distinto tamaño. Los ángulos mostrados están redondeados.';q.dibujo={kind:'pair',ts};q.audit={lados:[ls,otro]};
  q.explicacion=caso==='congruentes'?'Los tres pares de lados son iguales: misma forma y tamaño. La respuesta más específica es Congruentes.':caso==='semejantes'?'Cada lado del segundo mide el doble: tienen la misma forma, pero diferente tamaño. Son semejantes.':'Los lados correspondientes no son proporcionales y sus ángulos tampoco coinciden: ninguno de los dos vínculos.';q.pista='Compara los tres pares de lados. Si son iguales, congruentes; si guardan una misma razón distinta de 1, semejantes.';
  q.correcta=caso;q.opciones=[['semejantes','Semejantes'],['congruentes','Congruentes'],['ninguno','Ninguno'],['no','No son triángulos']].map(([id,label])=>({id,label}));return q;
 }
 const a=entero(2,6,r),x=entero(1,12,r),b=caso==='multiplo'?0:entero(1,caso==='resta'?Math.min(12,a*x-1):12,r)*(caso==='resta'?-1:1),c=a*x+b;
 q.pregunta='¿Cuánto vale x?';q.dibujo={kind:'equation',a,b,c};q.audit={a,b,c,x};q.pista='Deshaz primero la suma o resta. Después divide entre el número que multiplica a x.';q.explicacion=`${a}x = ${c} ${b<0?'+ '+(-b):b>0?'− '+b:''} = ${a*x}. Por tanto x = ${a*x} ÷ ${a} = ${x}.`;
 return numericas(q,x,r,'',false,[x+1,x+2,a*x]);
}
export function crearBanco(){return {bolsas:{},ultimos:{}};}
function bolsaVariada(tipo,r){
 if(!['partes','nombres','paralelas'].includes(tipo))return mezclar(CASOS[tipo],r);
 const grupos={};for(const caso of mezclar(CASOS[tipo],r)){const trozos=caso.split(':'),clave=tipo==='paralelas'?trozos[0]:trozos[1];(grupos[clave]??=[]).push(caso);}
 const bolsa=[];let ultimo=null;
 while(Object.values(grupos).some(g=>g.length)){
  const claves=mezclar(Object.keys(grupos).filter(k=>grupos[k].length),r);if(claves.length>1&&claves[0]===ultimo)[claves[0],claves[1]]=[claves[1],claves[0]];
  for(const k of claves){bolsa.push(grupos[k].pop());ultimo=k;}
 }
 return bolsa;
}
export function siguientePregunta(banco,tipo,r=Math.random){
 if(!CASOS[tipo])throw new RangeError('Tema desconocido');
 if(!banco.bolsas[tipo]?.length){const bolsa=bolsaVariada(tipo,r);if(bolsa[0]===banco.ultimos[tipo]&&bolsa.length>1)[bolsa[0],bolsa[1]]=[bolsa[1],bolsa[0]];banco.bolsas[tipo]=bolsa;}
 const caso=banco.bolsas[tipo].shift();banco.ultimos[tipo]=caso;return generar(tipo,caso,r);
}
export function crearExamen(r=Math.random){const banco=crearBanco(),preguntas=mezclar(TEMAS.flatMap(t=>[siguientePregunta(banco,t.id,r),siguientePregunta(banco,t.id,r)]),r);return {preguntas,respuestas:Array(28).fill(null),indice:0,terminado:false};}
export function responderExamen(examen,id){
 const i=examen.indice,q=examen.preguntas[i];if(examen.terminado||examen.respuestas[i]!==null||!q.opciones.some(o=>o.id===id))return null;
 const correcto=id===q.correcta;examen.respuestas[i]={id,correcto};return correcto;
}
export function avanzarExamen(examen){if(examen.terminado||examen.respuestas[examen.indice]===null)return false;if(examen.indice===27)examen.terminado=true;else examen.indice++;return true;}
export function resultado(examen){if(!examen.terminado)return null;const aciertos=examen.respuestas.filter(r=>r?.correcto).length;return {aciertos,total:28,nota:Math.max(1,Math.round(aciertos*100/28)),temas:TEMAS.map(t=>({...t,aciertos:examen.preguntas.reduce((s,q,i)=>s+(q.tipo===t.id&&examen.respuestas[i]?.correcto?1:0),0)}))};}
export function responderPractica(q,id){if(q.resuelta||q.descartadas.includes(id)||!q.opciones.some(o=>o.id===id))return null;q.intentos++;const bien=id===q.correcta;if(bien)q.resuelta=true;else q.descartadas.push(id);return bien;}
