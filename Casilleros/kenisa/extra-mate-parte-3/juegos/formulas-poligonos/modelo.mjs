export const NOMBRES=['Triángulo','Cuadrado','Pentágono','Hexágono','Heptágono','Octágono','Eneágono'];
export const nombre=n=>NOMBRES[n-3];
export const redondear=(n,d=2)=>Math.round((n+Number.EPSILON)*10**d)/10**d;
export const numero=n=>String(redondear(n)).replace('.',',');
const elegir=(a,r)=>a[Math.floor(r()*a.length)];
export function mezclar(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

// MathML es el respaldo sin red; la misma expresión LaTeX se presenta con KaTeX.
const mi=s=>`<mi>${s}</mi>`,mo=s=>`<mo>${s}</mo>`,mn=s=>`<mn>${s}</mn>`;
const row=(...s)=>`<mrow>${s.join('')}</mrow>`,frac=(a,b)=>`<mfrac>${a}${b}</mfrac>`,pow=(a,b)=>`<msup>${a}${mn(b)}</msup>`;
const N=mi('N'),L=mi('L'),P=mi('P'),a=mi('a'),A=mi('A'),deg=n=>row(mn(n),mo('°')),eq=mo('='),dot=mo('·');
const nm3=row(mo('('),N,mo('−'),mn(3),mo(')'));
export const FORMULAS=[
 {id:'perimetro',nombre:'Perímetro',icono:'P',titulo:'Todo el borde, lado a lado',texto:'Todos los lados miden lo mismo. Multiplica lo que mide uno por la cantidad de lados.',tex:String.raw`P=N\cdot L`,mml:row(P,eq,N,dot,L),leyenda:'N cuenta los lados · L mide un lado · P mide todo el contorno.'},
 {id:'area',nombre:'Área',icono:'A',titulo:'El espacio que hay dentro',texto:'Cada triángulo tiene un lado como base y la apotema como altura. Juntos llenan todo el polígono.',tex:String.raw`A=\frac{P\cdot a}{2}`,mml:row(A,eq,frac(row(P,dot,a),mn(2))),leyenda:'P es el perímetro · a es la apotema · A se mide en unidades cuadradas.'},
 {id:'desde',nombre:'Desde un vértice',icono:'d',titulo:'Conexiones desde una sola esquina',texto:'No puedes unir un vértice consigo mismo ni contar sus dos lados vecinos. Por eso restamos 3.',tex:String.raw`d=N-3`,mml:row(mi('d'),eq,N,mo('−'),mn(3)),leyenda:'d cuenta las diagonales que salen de un único vértice.'},
 {id:'todas',nombre:'Todas las diagonales',icono:'D',titulo:'La red de todo el polígono',texto:'Cuenta las conexiones de todos los vértices. Divide entre 2 porque cada diagonal une dos extremos y se contaría dos veces.',tex:String.raw`D=\frac{N(N-3)}{2}`,mml:row(mi('D'),eq,frac(row(N,nm3),mn(2))),leyenda:'D cuenta cada diagonal de toda la figura una sola vez.'},
 {id:'angulos',nombre:'Tres ángulos',icono:'°',titulo:'Una vuelta, tres miradas',texto:'Los ángulos centrales reparten una vuelta de 360°. En un polígono regular, cada exterior mide lo mismo que el central.',tex:String.raw`\text{Central}=\text{Exterior}=\frac{360^\circ}{N}`,mml:row('<mtext>Central</mtext>',eq,'<mtext>Exterior</mtext>',eq,frac(deg(360),N)),extra:String.raw`\text{Interior}+\text{Exterior}=180^\circ`,extraMml:row('<mtext>Interior</mtext>',mo('+'),'<mtext>Exterior</mtext>',eq,deg(180)),leyenda:'Interior y exterior son vecinos: juntos forman un ángulo llano.'},
 {id:'suma',nombre:'Suma de interiores',icono:'S',titulo:'Todas las esquinas cuentan',texto:'Suma los ángulos de dentro. Puedes dividir el polígono en N − 2 triángulos; cada uno aporta 180°.',tex:String.raw`S=(N-2)\cdot180^\circ`,mml:row(mi('S'),eq,mo('('),N,mo('−'),mn(2),mo(')'),dot,deg(180)),leyenda:'S es la suma de todos los ángulos interiores, no la medida de uno solo.'},
 {id:'radio',nombre:'Radio y apotema',icono:'R',titulo:'Un pequeño triángulo rectángulo',texto:'El radio llega a una esquina. La apotema llega perpendicularmente a la mitad de un lado. La escuadra señala el ángulo recto.',tex:String.raw`R^2=a^2+\left(\frac{L}{2}\right)^2`,mml:row(pow(mi('R'),2),eq,pow(a,2),mo('+'),pow(row(mo('('),frac(L,mn(2)),mo(')')),2)),leyenda:'R: radio · a: apotema · L/2: medio lado. Solo para explorar; no habrá ejercicios de esta relación.'}
];
export const formula=id=>FORMULAS.find(f=>f.id===id);
export const CALCULAR=[
 ['perimetro','Perímetro · N y L → P'],['lado','Lado · P y N → L'],['area','Área · P y a → A'],['apotema','Apotema · A y P → a'],['perimetro-area','Perímetro · A y a → P'],
 ['desde','Diagonales desde un vértice'],['todas','Diagonales de todo el polígono'],['central','Ángulo central · dado N'],['exterior','Ángulo exterior · dado N'],['interior','Ángulo interior · dado N'],
 ['exterior-central','Del central al exterior'],['interior-exterior','Del exterior al interior'],['exterior-interior','Del interior al exterior'],['suma','Suma de ángulos interiores']
];
export const DESCUBRIR=[
 ['figura-exterior','Figura · por el ángulo exterior'],['figura-central','Figura · por el ángulo central'],['figura-interior','Figura · por el ángulo interior'],['figura-suma','Figura · por la suma interior'],['figura-desde','Figura · por diagonales desde un vértice'],['figura-todas','Figura · por todas las diagonales'],['figura-perimetro','Figura · por perímetro y lado'],
 ['apotema','Dato faltante · apotema'],['lado','Dato faltante · lado'],['perimetro-area','Dato faltante · perímetro'],['interior-exterior','Dato faltante · interior'],['exterior-interior','Dato faltante · exterior']
];
export const tipos=modo=>modo==='calcular'?CALCULAR:modo==='descubrir'?DESCUBRIR:[];
const medida=(simbolo,valor,unidad='')=>({simbolo,valor,unidad});
export function crearPregunta(modo,tipo,r=Math.random,nForzado){
 if(!tipos(modo).some(([id])=>id===tipo))throw new RangeError('Ejercicio fuera del catálogo');
 const n=nForzado??3+Math.floor(r()*7);if(!Number.isInteger(n)||n<3||n>9)throw new RangeError('Solo polígonos de 3 a 9 lados');
 const l=2*(1+Math.floor(r()*4)),p=n*l,ang=360/n,inter=180-ang;
 // Las medidas aproximadas proceden de una figura regular real, nunca de P y a arbitrarios.
 // Para el despeje de a partimos de una apotema entera y redondeamos el perímetro medido.
 const ap=tipo==='apotema'?1+Math.floor(r()*5):redondear(l/(2*Math.tan(Math.PI/n)),1);
 const pa=tipo==='apotema'?redondear(2*n*ap*Math.tan(Math.PI/n),1):p,ar=redondear(pa*ap/2);
 const q={modo,tipo,n,conocidos:[],respuesta:0,unidad:'',pregunta:'',visual:'perimetro',formula:'perimetro',pista:'',pasos:[],aproximado:false,angular:false,opciones:null,resuelta:false,intentos:0,descartadas:[]};
 if(tipo.startsWith('figura-')){
  const origen=tipo.slice(7);q.pregunta='¿Qué figura es?';q.visual='misterio';q.respuesta=n;q.unidad='lados';q.formula=['central','exterior','interior'].includes(origen)?'angulos':origen==='perimetro'?'perimetro':origen;
  if(origen==='perimetro'){q.conocidos=[medida('P',p,'cm'),medida('L',l,'cm')];q.pista='Divide el perímetro entre lo que mide un lado.';q.pasos=[`N = P ÷ L = ${p} ÷ ${l} = ${n}`];}
  if(['central','exterior','interior'].includes(origen)){
   const valor=origen==='interior'?inter:ang;q.conocidos=[medida(`Ángulo ${origen}`,redondear(valor),'°')];q.aproximado=!Number.isInteger(valor);
   q.pista=origen==='interior'?'Primero halla el exterior: 180° menos el interior. Después divide 360° entre el exterior.':'Una vuelta completa tiene 360°. Divide entre el ángulo que conoces.';
   q.pasos=origen==='interior'?[`Exterior = 180° − ${numero(redondear(inter))}° = ${numero(redondear(ang))}°`]:[];
   q.pasos.push(`N ${q.aproximado?'≈':'='} 360° ÷ ${numero(redondear(ang))}° ${q.aproximado?'≈':'='} ${n}`);
  }
  if(origen==='suma'){q.conocidos=[medida('S',(n-2)*180,'°')];q.pista='Divide S entre 180° y después suma 2.';q.pasos=[`N = S ÷ 180° + 2 = ${(n-2)*180} ÷ 180 + 2 = ${n}`];}
  if(origen==='desde'){q.conocidos=[medida('d',n-3,'diagonales desde un vértice')];q.pista='Si d = N − 3, recupera N sumando 3.';q.pasos=[`N = d + 3 = ${n-3} + 3 = ${n}`];}
  if(origen==='todas'){q.conocidos=[medida('D',n*(n-3)/2,'diagonales en total')];q.pista='Prueba el número de lados de cada opción en N × (N − 3) ÷ 2. No necesitas una ecuación complicada.';q.pasos=[`${n} × (${n} − 3) ÷ 2 = ${n*(n-3)/2} diagonales`];}
  q.opciones=mezclar([n,...mezclar([3,4,5,6,7,8,9].filter(x=>x!==n),r).slice(0,3)],r);
  q.pasos.push(`${nombre(n)}: ${n} lados.`);return q;
 }
 const set=(pregunta,conocidos,respuesta,unidad,visual,form,pista,pasos)=>Object.assign(q,{pregunta,conocidos,respuesta,unidad,visual,formula:form,pista,pasos});
 if(tipo==='perimetro')set('¿Cuánto mide el perímetro?',[medida('N',n,'lados'),medida('L',l,'cm')],p,'cm','perimetro','perimetro','Multiplica el número de lados por la longitud de uno.',[`P = N × L = ${n} × ${l} = ${p} cm`]);
 if(tipo==='lado')set('¿Cuánto mide un lado?',[medida('P',p,'cm'),medida('N',n,'lados')],l,'cm','lado','perimetro','Reparte el perímetro entre todos los lados iguales.',[`L = P ÷ N = ${p} ÷ ${n} = ${l} cm`]);
 if(tipo==='area')set('¿Cuánto mide el área?',[medida('P',pa,'cm'),medida('a',ap,'cm')],ar,'cm²','area','area','Multiplica el perímetro por la apotema y divide entre 2.',[`A = P × a ÷ 2 = ${numero(pa)} × ${numero(ap)} ÷ 2 = ${numero(ar)} cm²`]);
 if(tipo==='apotema')set('¿Cuánto mide la apotema?',[medida('A',ar,'cm²'),medida('P',pa,'cm')],ap,'cm','apotema','area','Duplica el área y divide entre el perímetro.',[`a = 2 × A ÷ P = 2 × ${numero(ar)} ÷ ${numero(pa)} = ${numero(ap)} cm`]);
 if(tipo==='perimetro-area')set('¿Cuánto mide el perímetro?',[medida('A',ar,'cm²'),medida('a',ap,'cm')],pa,'cm','area','area','Duplica el área y divide entre la apotema.',[`P = 2 × A ÷ a = 2 × ${numero(ar)} ÷ ${numero(ap)} = ${numero(pa)} cm`]);
 if(['area','apotema','perimetro-area'].includes(tipo))q.aproximado=n!==4;
 if(tipo==='desde'||tipo==='todas'){
  const uno=tipo==='desde',result=uno?n-3:n*(n-3)/2;
  set(uno?'¿Cuántas diagonales salen de un vértice?':'¿Cuántas diagonales hay en total?',[medida('N',n,'lados')],result,'diagonales',tipo,tipo,uno?'No cuentes el propio vértice ni sus dos vecinos.':'Cuenta las de cada vértice y divide entre 2 para no repetir.',[uno?`d = N − 3 = ${n} − 3 = ${result}`:`D = N × (N − 3) ÷ 2 = ${n} × ${n-3} ÷ 2 = ${result}`]);
 }
 if(['central','exterior','interior'].includes(tipo)){
  const ans=tipo==='interior'?inter:ang;
  set(`¿Cuánto mide el ángulo ${tipo}?`,[medida('N',n,'lados')],redondear(ans),'°',tipo,'angulos',tipo==='interior'?'Primero calcula el exterior (360° ÷ N). Réstalo de 180°.':'Reparte la vuelta de 360° entre los lados.',tipo==='interior'?[`Exterior = 360° ÷ ${n}`,`Interior = 180° − 360° ÷ ${n} ${Number.isInteger(ans)?'=':'≈'} ${numero(redondear(ans))}°`]:[`${tipo==='central'?'Central':'Exterior'} = 360° ÷ ${n} ${Number.isInteger(ans)?'=':'≈'} ${numero(redondear(ans))}°`]);q.angular=true;
 }
 if(tipo==='exterior-central')set('¿Cuánto mide el ángulo exterior?',[medida('Ángulo central',redondear(ang),'°')],redondear(ang),'°','exterior','angulos','En un polígono regular, central y exterior miden lo mismo.',[`Exterior = Central = ${numero(redondear(ang))}°`]);
 if(tipo==='interior-exterior')set('¿Cuánto mide el ángulo interior?',[medida('Ángulo exterior',redondear(ang),'°')],redondear(180-redondear(ang)),'°','interior','angulos','Interior y exterior suman 180°. Resta el dato conocido.',[`Interior = 180° − ${numero(redondear(ang))}° = ${numero(redondear(180-redondear(ang)))}°`]);
 if(tipo==='exterior-interior')set('¿Cuánto mide el ángulo exterior?',[medida('Ángulo interior',redondear(inter),'°')],redondear(180-redondear(inter)),'°','exterior','angulos','Interior y exterior suman 180°. Resta el dato conocido.',[`Exterior = 180° − ${numero(redondear(inter))}° = ${numero(redondear(180-redondear(inter)))}°`]);
 if(['exterior-central','interior-exterior','exterior-interior'].includes(tipo)){q.angular=true;q.aproximado=!Number.isInteger(ang);}
 if(tipo==='suma')set('¿Cuánto suman todos los ángulos interiores?',[medida('N',n,'lados')],(n-2)*180,'°','suma','suma','Resta 2 al número de lados y multiplica por 180°.',[`S = (N − 2) × 180° = ${n-2} × 180° = ${(n-2)*180}°`]);
 return q;
}
export function crearPractica(modo){if(!tipos(modo).length)throw new RangeError('Modo desconocido');return {modo,filtro:'mezcla',bolsa:[],numero:0,aciertos:0,primero:0,pregunta:null};}
export function siguiente(s,r=Math.random){
 let tipo=s.filtro;
 if(tipo==='mezcla'){
  if(!s.bolsa.length){s.bolsa=mezclar(tipos(s.modo).map(([id])=>id),r);if(s.bolsa[0]===s.pregunta?.tipo)[s.bolsa[0],s.bolsa[1]]=[s.bolsa[1],s.bolsa[0]];}
  tipo=s.bolsa.shift();
 }
 let q=crearPregunta(s.modo,tipo,r);
 if(q.tipo===s.pregunta?.tipo&&q.n===s.pregunta.n)q=crearPregunta(s.modo,tipo,r,3+(q.n-2)%7);
 s.pregunta=q;s.numero++;return q;
}
export function leerNumero(texto){
 const t=String(texto).trim().replace(',','.');
 return /^\d+(?:\.\d+)?$/.test(t)?Number(t):null;
}
export function responder(s,valor){
 const q=s.pregunta;if(q.resuelta)return null;
 const v=leerNumero(valor);if(v===null||!Number.isFinite(v))return {valida:false,correcta:false};
 if(q.opciones&&!q.opciones.includes(v))return {valida:false,correcta:false};
 if(q.opciones&&q.descartadas.includes(v))return null;
 q.intentos++;
 // Se acepta exactamente el valor pedido redondeado, no un ángulo a un decimal.
 const correcta=Math.abs(v-q.respuesta)<1e-8;
 if(correcta){q.resuelta=true;s.aciertos++;if(q.intentos===1)s.primero++;}
 else if(q.opciones)q.descartadas.push(v);
 return {valida:true,correcta};
}
