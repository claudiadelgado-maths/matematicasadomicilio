import { crearBanco as bancoEcuaciones, mezclar } from '../../examenes/planteamiento-de-ecuaciones-y-despejes/banco.mjs?v=20261010-1';
export { mezclar };
export const FORMULAS = [
  {id:'triangulo',nombre:'Área de un triángulo',lhs:'A',expr:'b*h/2',letras:['b','h'],leyenda:'b: base · h: altura perpendicular a la base',errores:['b*h','(b+h)/2','2*b*h']},
  {id:'rectangulo',nombre:'Área de un rectángulo',lhs:'A',expr:'b*h',letras:['b','h'],leyenda:'b: base · h: altura',errores:['b+h','b*h/2','2*(b+h)']},
  {id:'cuadrado',nombre:'Área de un cuadrado',lhs:'A',expr:'L^2',letras:['L'],leyenda:'L: longitud de un lado',errores:['2*L','4*L','L/2']},
  {id:'trapecio',nombre:'Área de un trapecio',lhs:'A',expr:'(B+b)*h/2',letras:['B','b','h'],leyenda:'B: base mayor · b: base menor · h: altura perpendicular a las bases',errores:['(B-b)*h/2','(B+b)*h','B+b*h/2']},
  {id:'regular',nombre:'Área de un polígono regular',lhs:'A',expr:'P*a/2',letras:['P','a'],leyenda:'P: perímetro · a: apotema',errores:['P*a','P+a/2','2*P/a']},
  {id:'circulo',nombre:'Área de un círculo',lhs:'A',expr:'pi*r^2',letras:['r'],leyenda:'r: radio · π se conserva como símbolo',errores:['2*pi*r','pi*r','(pi*r)^2']},
  {id:'borde',nombre:'Perímetro de una figura con lados',lhs:'P',expr:'La suma de todos sus lados',letras:['La suma de todos sus lados'],literal:true,leyenda:'P: perímetro. Recorre el borde y cuenta cada lado una sola vez.',errores:['La multiplicación de todos sus lados','La mitad de la suma de todos sus lados','El área de la figura']},
  {id:'circunferencia',nombre:'Longitud de una circunferencia',lhs:'P',expr:'2*pi*r',letras:['r'],leyenda:'r: radio · P: longitud de la circunferencia',errores:['pi*r^2','pi*r','2*pi/r']},
  {id:'diagonal',nombre:'Diagonales desde un vértice',lhs:'d',expr:'N-3',letras:['N'],leyenda:'N: número de lados · d: diagonales que salen de un solo vértice',errores:['N-2','N*(N-3)/2','N+3']},
  {id:'diagonales',nombre:'Diagonales totales',lhs:'D',expr:'N*(N-3)/2',letras:['N'],leyenda:'N: número de lados · D: todas las diagonales, sin repetirlas',errores:['N-3','N*(N-2)/2','N*(N-3)']},
  {id:'central',nombre:'Ángulo central de un polígono regular',grupo:'Ángulo central o exterior de un polígono regular',lhs:'C',expr:'360/N',letras:['N'],leyenda:'N: número de lados · C: un ángulo central, en grados',errores:['180/N','360/(N-2)','N/360']},
  {id:'exterior',nombre:'Ángulo exterior de un polígono regular',grupo:'Ángulo central o exterior de un polígono regular',lhs:'E',expr:'360/N',letras:['N'],leyenda:'N: número de lados · E: un ángulo exterior, en grados',errores:['180/N','360/(N-2)','N/360']},
  {id:'interior',nombre:'Ángulo interior de un polígono regular',lhs:'I',expr:'180-ángulo exterior',letras:['ángulo exterior'],leyenda:'I: ángulo interior. El ángulo interior y su exterior adyacente suman 180°. Ambos se expresan en grados.',errores:['180+ángulo exterior','360-ángulo exterior','ángulo exterior-180']},
  {id:'suma',nombre:'Suma de ángulos interiores',lhs:'S',expr:'180*(N-2)',letras:['N'],leyenda:'N: número de lados · S: suma de todos los interiores, en grados',errores:['180-ángulo exterior','360/N','180*N']}
];
export const formula=id=>FORMULAS.find(f=>f.id===id);
const clean=n=>String(Number(n.toFixed(7)));
export const expresionLineal=(a,b)=>`${a===1?'':a}x${b>0?' + '+b:b<0?' − '+(-b):''}`;
const simbolica=(n,pi=false)=>pi?`${n}*pi`:clean(n);
const dado=(nombre,valor,unidad='cm')=>({nombre,valor:String(valor),unidad});
const CANTIDADES={A:'el área',b:'la base',B:'la base mayor',h:'la altura',a:'la apotema',P:'el perímetro',r:'el radio',L:'el lado',N:'el número de lados',d:'el número de diagonales desde un vértice',D:'el número total de diagonales',C:'el ángulo central',E:'el ángulo exterior',I:'el ángulo interior',S:'la suma de los ángulos interiores'};
export function bancoMemoria(){
  return FORMULAS.flatMap(f=>[{id:`${f.id}-formula`,filtro:f.id,familia:f.id,tipo:'formula',f},...(f.id==='exterior'?[]:[{id:`${f.id}-concepto`,filtro:f.id,familia:f.id,tipo:'concepto',f}])]);
}
export function opcionesMemoria(q,azar=Math.random){
  if(q.tipo==='formula')return mezclar([q.f.expr,...q.f.errores],azar).map(valor=>({valor,correcta:valor===q.f.expr,matematica:!q.f.literal}));
  const nombre=q.f.grupo||q.f.nombre;
  const otros=[...new Set(FORMULAS.map(f=>f.grupo||f.nombre))].filter(n=>n!==nombre);
  return mezclar([nombre,...mezclar(otros,azar).slice(0,3)],azar).map(valor=>({valor,correcta:valor===nombre,matematica:false}));
}
export function bancoDespejes(){
  const banco=[];
  const poner=(f,s,target,datos,respuesta,unidad,pasos,extra={})=>banco.push({id:`${f}-${target}-${s}`,familia:`${f}-${target}`,filtro:f,concepto:formula(f).nombre,pregunta:`Encuentra ${CANTIDADES[target]||target} (${target}).`,datos,respuesta:String(respuesta),unidad,pasos,formula:f,target,...extra});
  for(let s=0;s<18;s++){
    const b=6+2*s,h=4+2*(s%7),A=b*h/2;
    poner('triangulo',s,'A',[dado('b',b),dado('h',h)],A,'cm²',[`A = b·h/2 = ${b}·${h}/2 = ${A} cm².`]);
    poner('triangulo',s,'b',[dado('A',A,'cm²'),dado('h',h)],b,'cm',[`2A = bh → b = 2A/h.`,`b = 2·${A}/${h} = ${b} cm.`]);
    poner('triangulo',s,'h',[dado('A',A,'cm²'),dado('b',b)],h,'cm',[`2A = bh → h = 2A/b.`,`h = 2·${A}/${b} = ${h} cm.`]);
    const Ar=b*h;
    for(const target of ['A','b','h']){const v={A:Ar,b,h},known=Object.keys(v).filter(k=>k!==target).map(k=>dado(k,v[k],k==='A'?'cm²':'cm'));poner('rectangulo',s,target,known,v[target],target==='A'?'cm²':'cm',[target==='A'?`A = ${b}·${h} = ${Ar} cm².`:`${target} = A/${target==='b'?'h':'b'} = ${Ar}/${target==='b'?h:b} = ${v[target]} cm.`]);}
    const L=3+s;
    poner('cuadrado',s,'A',[dado('L',L)],L*L,'cm²',[`A = L² = ${L}² = ${L*L} cm².`]);
    poner('cuadrado',s,'L',[dado('A',L*L,'cm²')],L,'cm',[`L² = ${L*L}. Toma la raíz positiva porque una longitud no es negativa.`,`L = √${L*L} = ${L} cm.`]);
    const B=b+4,At=(B+b)*h/2;
    const tv={A:At,B,b,h};
    for(const target of ['A','B','b','h']){const pasos=target==='A'?[`A = (${B} + ${b})·${h}/2 = ${At} cm².`]:target==='h'?[`2A = (B + b)h → h = 2A/(B + b).`,`h = 2·${At}/(${B} + ${b}) = ${h} cm.`]:[`2A/h = B + b → ${target} = 2A/h − ${target==='B'?'b':'B'}.`,`${target} = 2·${At}/${h} − ${target==='B'?b:B} = ${tv[target]} cm.`];poner('trapecio',s,target,Object.keys(tv).filter(k=>k!==target).map(k=>dado(k,tv[k],k==='A'?'cm²':'cm')),tv[target],target==='A'?'cm²':'cm',pasos);}
    const a=2+s,P=8*a,Ap=P*a/2,rv={A:Ap,P,a};
    for(const target of ['A','P','a']){const pasos=target==='A'?[`A = Pa/2 = ${P}·${a}/2 = ${Ap} cm².`]:[`2A = Pa → ${target} = 2A/${target==='a'?'P':'a'}.`,`${target} = 2·${Ap}/${target==='a'?P:a} = ${rv[target]} cm.`];poner('regular',s,target,Object.keys(rv).filter(k=>k!==target).map(k=>dado(k,rv[k],k==='A'?'cm²':'cm')),rv[target],target==='A'?'cm²':'cm',pasos);}
    const r=2+s;
    poner('circulo',s,'A',[dado('r',r)],simbolica(r*r,true),'cm²',[`A = πr² = π·${r}² = ${r*r}π cm².`]);
    poner('circulo',s,'r',[dado('A',`${r*r}π`,'cm²')],r,'cm',[`Divide entre π: r² = ${r*r}.`,`r = √${r*r} = ${r} cm (raíz positiva).`]);
    poner('circunferencia',s,'P',[dado('r',r)],simbolica(2*r,true),'cm',[`P = 2πr = 2π·${r} = ${2*r}π cm.`]);
    poner('circunferencia',s,'r',[dado('P',`${2*r}π`)],r,'cm',[`r = P/(2π) = ${2*r}π/(2π) = ${r} cm.`]);
    const t=s+2,sides=[3*t,4*t,5*t],total=12*t;
    poner('borde',s,'P',sides.map((v,i)=>dado(`L${i+1}`,v)),total,'cm',[`Suma todos los lados: P = ${sides.join(' + ')} = ${total} cm.`],{pregunta:'Un triángulo tiene estos lados. Encuentra su perímetro.'});
    poner('borde',s,'L',[dado('P',total),dado('L1',sides[0]),dado('L2',sides[1])],sides[2],'cm',[`${total} = ${sides[0]} + ${sides[1]} + L₃.`,`L₃ = ${total} − ${sides[0]} − ${sides[1]} = ${sides[2]} cm.`],{pregunta:'En un triángulo, se conocen el perímetro y dos lados. Encuentra el tercer lado (L₃).'});
    const N=3+s,d=N-3,D=N*(N-3)/2,S=(N-2)*180;
    poner('diagonal',s,'d',[dado('N',N,'lados')],d,'diagonales',[`d = N − 3 = ${N} − 3 = ${d}.`]);
    poner('diagonal',s,'N',[dado('d',d,'diagonales')],N,'lados',[`d = N − 3 → N = d + 3.`,`N = ${d} + 3 = ${N} lados.`]);
    poner('diagonales',s,'D',[dado('N',N,'lados')],D,'diagonales',[`D = N(N − 3)/2 = ${N}·${N-3}/2 = ${D}.`]);
    poner('suma',s,'S',[dado('N',N,'lados')],S,'°',[`S = (N − 2)·180 = (${N} − 2)·180 = ${S}°.`]);
    poner('suma',s,'N',[dado('S',S,'°')],N,'lados',[`S/180 = N − 2 → N = S/180 + 2.`,`N = ${S}/180 + 2 = ${N} lados.`]);
  }
  // Solo estos números de lados dan ángulos enteros; nunca se redondea un dato para hallar N.
  for(const [s,N] of [3,4,5,6,8,9,10,12,15,18,20].entries()){
    for(const f of ['central','exterior']){const target=formula(f).lhs,v=360/N;
      poner(f,s,target,[dado('N',N,'lados')],v,'°',[`${target} = 360/${N} = ${v}°.`]);
      poner(f,s,'N',[dado(target,v,'°')],N,'lados',[`N = 360/${target} = 360/${v} = ${N} lados.`]);
    }
    const E=360/N,I=180-E;
    poner('interior',s,'I',[dado('E',E,'°')],I,'°',[`Ángulo interior = 180 − ángulo exterior.`,`Ángulo interior = 180 − ${E} = ${I}°.`]);
    poner('interior',s,'E',[dado('I',I,'°')],E,'°',[`Ángulo interior = 180 − ángulo exterior.`,`Ángulo exterior = 180 − ángulo interior = 180 − ${I} = ${E}°.`]);
  }
  return banco;
}
export const FIGURAS={triangulo:'Triángulo rectángulo',isosceles:'Triángulo isósceles',equilatero:'Triángulo equilátero',cuadrado:'Cuadrado',rectangulo:'Rectángulo',rombo:'Rombo',romboide:'Romboide',trapecio:'Trapecio isósceles',pentagono:'Pentágono regular',hexagono:'Hexágono regular'};
function puntosRegulares(n,L){const R=L/(2*Math.sin(Math.PI/n));return Array.from({length:n},(_,i)=>[R*Math.cos(-Math.PI/2+2*Math.PI*i/n),R*Math.sin(-Math.PI/2+2*Math.PI*i/n)]);}
export function bancoLados(){
  const out=[];
  for(const tipo of Object.keys(FIGURAS))for(let s=0;s<24;s++){
    const k=2+s%7,x=2+Math.floor(s/3),L=4*k;let puntos;
    if(tipo==='triangulo')puntos=[[0,0],[3*k,0],[0,4*k]];
    if(tipo==='isosceles')puntos=[[-3*k,0],[3*k,0],[0,-4*k]];
    if(tipo==='equilatero')puntos=puntosRegulares(3,L);
    if(tipo==='cuadrado')puntos=[[0,0],[L,0],[L,L],[0,L]];
    if(tipo==='rectangulo')puntos=[[0,0],[6*k,0],[6*k,3*k],[0,3*k]];
    if(tipo==='rombo')puntos=[[0,-4*k],[3*k,0],[0,4*k],[-3*k,0]];
    if(tipo==='romboide')puntos=[[0,0],[6*k,0],[9*k,4*k],[3*k,4*k]];
    if(tipo==='trapecio')puntos=[[0,0],[10*k,0],[7*k,-4*k],[3*k,-4*k]];
    if(tipo==='pentagono'||tipo==='hexagono')puntos=puntosRegulares(tipo==='pentagono'?5:6,L);
    const lados=puntos.map((p,i)=>{const v=Math.round(Math.hypot(p[0]-puntos[(i+1)%puntos.length][0],p[1]-puntos[(i+1)%puntos.length][1])),a=1+(s+i)%3,b=v-a*x;return {letra:'ABCDEF'[i],a,b,expr:expresionLineal(a,b),valor:v};});
    out.push({id:`${tipo}-${s}`,familia:tipo,filtro:tipo,tipo,nombre:FIGURAS[tipo],x,puntos,lados,giro:(s%8)*Math.PI/12});
  }
  return out;
}
export function bancoAlgebra(){
  const ids=['poligono-perimetro-expresion','area-perimetro-x','cuadrado-apotema'];
  const out=bancoEcuaciones().filter(q=>q.tema==='perimetros'||q.tema==='areas'||ids.includes(q.familia)).map(q=>({...q,filtro:q.tema,pregunta:q.enunciado,respuesta:String(q.respuesta),unidad:q.unidad}));
  for(let s=0;s<24;s++){
    const x=2+s,a=2*x+1,P=8*a,A=P*a/2;
    out.push({id:`apotema-lineal-${s}`,familia:'apotema-lineal',filtro:'poligonos',pregunta:`Un polígono regular tiene perímetro de ${P} cm y apotema (2x + 1) cm. Su área es ${A} cm². ¿Cuánto vale x?`,respuesta:String(x),unidad:'',pasos:[`A = Pa/2: ${A} = ${P}(2x + 1)/2.`,`2x + 1 = 2·${A}/${P} = ${a}.`,`2x = ${a-1}; x = ${x}.`],geometria:{P,a,A,x}});
  }
  return out;
}
export const CASOS_CIRCULO={'per-radio':'Circunferencia → radio','per-area':'Circunferencia → área','area-radio':'Área → radio','area-per':'Área → circunferencia'};
export function bancoCirculos(){
  const out=[];
  for(const tipo of Object.keys(CASOS_CIRCULO))for(let r=2;r<=41;r++){
    const esP=tipo.startsWith('per'),radio=tipo.endsWith('radio'),resultado=radio?r:esP?r*r:2*r;
    out.push({id:`${tipo}-${r}`,familia:tipo,filtro:tipo,r,pregunta:`${esP?'La longitud de una circunferencia':'El área de un círculo'} es ${esP?2*r:r*r}π ${esP?'cm':'cm²'}. ${radio?'¿Cuánto mide el radio?':esP?'¿Cuál es el área del círculo?':'¿Cuál es la longitud de su circunferencia?'}`,respuesta:simbolica(resultado,!radio),unidad:!radio&&esP?'cm²':'cm',pasos:[...(esP?[`P = 2πr → r = P/(2π).`,`r = ${2*r}π/(2π) = ${r} cm.`]:[`A = πr² → r² = A/π = ${r*r}.`,`r = √${r*r} = ${r} cm (raíz positiva).`]),...(radio?[]:esP?[`A = πr² = π·${r}² = ${r*r}π cm².`]:[`P = 2πr = 2π·${r} = ${2*r}π cm.`])],datos:{P:2*r,A:r*r}});
  }
  return out;
}
export function crearBolsa(banco,azar=Math.random){return {banco,azar,vistas:new Set(),orden:mezclar(banco,azar),ronda:1,actual:null};}
export function sacar(bolsa,filtro='todos'){
  const candidatas=bolsa.orden.filter(q=>!bolsa.vistas.has(q.id)&&(filtro==='todos'||q.filtro===filtro));
  const q=candidatas.find(q=>q.familia!==bolsa.actual?.familia)||candidatas[0];
  if(!q){bolsa.actual=null;return null;}
  bolsa.vistas.add(q.id);bolsa.actual=q;return q;
}
export function reiniciarBolsa(bolsa,filtro='todos'){
  const relevantes=bolsa.banco.filter(q=>filtro==='todos'||q.filtro===filtro);
  if(relevantes.some(q=>!bolsa.vistas.has(q.id)))return false;
  relevantes.forEach(q=>bolsa.vistas.delete(q.id));bolsa.orden=mezclar(bolsa.banco,bolsa.azar);bolsa.ronda++;return true;
}
