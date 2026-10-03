export const CASOS=[
 ['R1','rectangulos','Doble o triple → área'],['R2','rectangulos','Un poco más → altura o base'],['R3','rectangulos','Doble o triple → altura o base'],['R4','rectangulos','Un poco más → área'],
 ['C1','cuadrados','Perímetro → lado'],['C2','cuadrados','Perímetro → área'],['C3','cuadrados','Área → lado'],['C4','cuadrados','Área → perímetro'],
 ['T1','triangulos','Lados iguales: doble o triple'],['T2','triangulos','Lados iguales: unos cm más'],['T3','triangulos','Encuentra la base y suma'],['T4','triangulos','Tres lados relacionados'],
 ['TR1','trapecios','Área y diferencia entre bases'],['TR2','trapecios','Área y base doble o triple'],['TR3','trapecios','Encuentra la base y el área'],['TR4','trapecios','Área y una base conocida'],['TR5','trapecios','Perímetro y diferencia entre bases'],['TR6','trapecios','Perímetro y base doble']
].map(([id,familia,nombre])=>({id,familia,nombre}));
export const FAMILIAS={rectangulos:'Rectángulos',cuadrados:'Cuadrados',triangulos:'Triángulos',trapecios:'Trapecios'};
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const entero=(min,max,r)=>min+Math.floor(r()*(max-min+1));
const multiple=(k,r)=>pick(k===2?['mide el doble que','tiene el doble de longitud que']:['mide el triple que','tiene el triple de longitud que'],r);
export function generar(filtro='todos',r=Math.random){
 let familia=filtro;
 if(filtro==='todos')familia=pick([pick(['rectangulos','cuadrados'],r),'triangulos','trapecios'],r);
 let candidates=CASOS.filter(c=>c.familia===familia||c.id===filtro);
 if(!candidates.length)throw new RangeError('Caso desconocido');
 // Predominan relaciones sencillas; T4 aparece menos en la mezcla.
 if(familia==='triangulos')candidates=[...candidates,...candidates.filter(c=>c.id!=='T4')];
 if(familia==='trapecios')candidates=[...candidates,...candidates.filter(c=>c.id==='TR1')];
 const spec=pick(candidates,r),{id}=spec;
 let x=entero(3,9,r),d=entero(1,6,r),k=pick([2,2,2,3],r),h=2*entero(2,5,r),b,B,L,P,A,goal,answer,shape,geom,labels,solvedLabels,statement,question,meaning,equation,steps,hints;
 let unit=pick(['cm','m'],r),target;
 const plus=()=>pick([`mide ${d} ${unit} más que`,`es ${d} ${unit} mayor que`],r);
 if(id.startsWith('R')){
  const mult=id==='R1'||id==='R3';b=mult?k*x:x+d;h=x;P=2*(b+h);A=b*h;shape='rectangulo';geom={b,h};
  labels={b:mult?`${k}x`:`x + ${d}`,h:'x'};solvedLabels={b:String(b),h:String(h)};
  meaning='x representa la altura.';
  target=id==='R1'||id==='R4'?'area':pick(['altura','base'],r);goal=target;answer=target==='area'?A:target==='base'?b:h;
  statement=`${pick(['Un rectángulo','Una cartulina rectangular'],r)} tiene un perímetro de ${P} ${unit}. Su base ${mult?multiple(k,r):plus()} su altura.`;
  question=target==='area'?'¿Cuál es su área?':`¿Cuánto mide la ${target}?`;
  equation=mult?`2(x + ${k}x) = ${P}`:`2x + 2(x + ${d}) = ${P}`;
  hints=[`${meaning} ${mult?`La base es ${k}x.`:`La base es x + ${d}.`}`,'El perímetro suma dos bases y dos alturas: P = 2(b + h).',`Plantea ${equation}. ${target==='area'?'Después de encontrar x, multiplica base por altura.':target==='base'?'Después de encontrar x, usa la relación para obtener la base.':'Encuentra el valor de x.'}`];
  steps=[equation,mult?`${2*(k+1)}x = ${P} → x = ${P} ÷ ${2*(k+1)} = ${x} ${unit}.`:`4x + ${2*d} = ${P} → 4x = ${P-2*d} → x = ${x} ${unit}.`,`Altura = ${h} ${unit}; base = ${mult?`${k} × ${x}`:`${x} + ${d}`} = ${b} ${unit}.`];
  if(target==='area')steps.push(`A = ${b} × ${h} = ${A} ${unit}².`);
 }else if(id.startsWith('C')){
  x=entero(4,12,r);b=h=x;P=4*x;A=x*x;shape='cuadrado';geom={b,h};labels={b:'x'};solvedLabels={b:String(x)};meaning='x representa un lado. Los cuatro lados son iguales.';
  const fromArea=id==='C3'||id==='C4';goal=id==='C2'?'area':id==='C4'?'perimetro':'lado';answer=goal==='area'?A:goal==='perimetro'?P:x;
  statement=`${pick(['Un cuadrado',unit==='m'?'Un jardín cuadrado':'Una baldosa cuadrada'],r)} tiene ${fromArea?`un área de ${A} ${unit}²`:`un perímetro de ${P} ${unit}`}.`;
  question=goal==='area'?'¿Cuál es su área?':goal==='perimetro'?'¿Cuál es su perímetro?':'¿Cuánto mide cada lado?';equation=fromArea?`x × x = ${A}`:`4x = ${P}`;
  hints=[meaning,fromArea?`Busca un número que, multiplicado por sí mismo, dé ${A}.`:'El perímetro es cuatro veces el lado: P = 4x.',goal==='area'?'Primero divide el perímetro entre 4. Después multiplica el lado por sí mismo.':goal==='perimetro'?'Primero encuentra el lado. Después multiplícalo por 4.':fromArea?'Puedes repasar los cuadrados: 4 × 4, 5 × 5, 6 × 6…':'Divide el perímetro entre los cuatro lados iguales.'];
  steps=[equation,fromArea?`${x} × ${x} = ${A}; por eso x = ${x} ${unit}.`:`x = ${P} ÷ 4 = ${x} ${unit}.`];if(goal!=='lado')steps.push(goal==='area'?`A = ${x} × ${x} = ${A} ${unit}².`:`P = 4 × ${x} = ${P} ${unit}.`);
 }else if(id.startsWith('T')){
  // TR se resuelve abajo; T representa únicamente las cuatro plantillas de triángulos.
  if(!id.startsWith('TR')){
   shape='triangulo';unit='cm';
   if(id==='T3'){
    L=entero(6,10,r);d=entero(1,3,r);const sign=pick([-1,1],r);b=L+sign*d;x=b;geom={b,L1:L,L2:L};labels={b:'x',L1:String(L),L2:String(L)};solvedLabels={...labels,b:String(b)};P=b+2*L;goal='perimetro';answer=P;meaning='x representa la base.';
    statement=`Los lados iguales de un triángulo isósceles miden ${L} cm cada uno. Su base mide ${d} cm ${sign===1?'más':'menos'} que cada lado igual.`;question='¿Cuál es su perímetro?';equation=`x = ${L} ${sign===1?'+':'−'} ${d}`;
    hints=[meaning,`Para encontrar la base, ${sign===1?'suma':'resta'} ${d} a ${L}.`,'El perímetro es la base más los dos lados iguales.'];steps=[`${equation} = ${b} cm.`,`P = ${b} + ${L} + ${L} = ${P} cm.`];
   }else{
    x=entero(4,9,r);d=entero(1,3,r);b=id==='T4'?2*x:x;const l1=id==='T1'?k*x:id==='T2'?x+d:x,l2=id==='T4'?x+d:l1;geom={b,L1:l1,L2:l2};P=b+l1+l2;goal=id==='T4'?'primer lado':'base';answer=x;meaning=`x representa ${id==='T4'?'el primer lado':'la base, que es el lado diferente'}.`;
    labels=id==='T4'?{b:'2x',L1:'x',L2:`x + ${d}`}:{b:'x',L1:id==='T1'?`${k}x`:`x + ${d}`,L2:id==='T1'?`${k}x`:`x + ${d}`};solvedLabels={b:String(b),L1:String(l1),L2:String(l2)};
    statement=id==='T4'?`El segundo lado de un triángulo mide ${d} cm más que el primero. El tercer lado mide el doble que el primero. Su perímetro es ${P} cm.`:`En un triángulo isósceles, cada lado igual ${id==='T1'?multiple(k,r):`mide ${d} cm más que`} ${id==='T1'?'el lado diferente':'la base'}. Su perímetro es ${P} cm.`;
    question=id==='T4'?'¿Cuánto mide el primer lado?':'¿Cuánto mide la base?';equation=id==='T1'?`x + ${k}x + ${k}x = ${P}`:id==='T2'?`x + (x + ${d}) + (x + ${d}) = ${P}`:`x + (x + ${d}) + 2x = ${P}`;
    hints=[meaning,'El perímetro es la suma de los tres lados. Usa las expresiones del dibujo.',`Plantea ${equation}. Junta los términos con x y después despeja.`];const coeff=id==='T1'?1+2*k:id==='T2'?3:4,constant=id==='T1'?0:id==='T2'?2*d:d;
    steps=[equation,`${coeff}x${constant?` + ${constant}`:''} = ${P} → ${coeff}x = ${P-constant}.`,`x = ${P-constant} ÷ ${coeff} = ${x} cm.`];
   }
  }
 }
 if(id.startsWith('TR')){
  shape='trapecio';b=x;B=id==='TR2'?k*x:id==='TR6'?2*x:x+d;goal=id==='TR3'?'area':id==='TR4'?'base mayor':'base menor';meaning=`x representa la ${id==='TR4'?'base mayor':'base menor'}.`;
  if(id==='TR5'||id==='TR6'){
   // L supera media diferencia entre bases; existe una altura real positiva.
   L=id==='TR5'?Math.ceil(d/2)+entero(2,4,r):x+entero(1,3,r);h=Math.sqrt(L*L-((B-b)/2)**2);P=B+b+2*L;
   geom={B,b,h,L1:L,L2:L};labels={B:id==='TR6'?'2x':`x + ${d}`,b:'x',L1:String(L),L2:String(L)};solvedLabels={B:String(B),b:String(b),L1:String(L),L2:String(L)};answer=x;
   statement=`Un trapecio isósceles tiene dos lados laterales de ${L} ${unit} cada uno. Su base mayor ${id==='TR6'?multiple(2,r):plus()} la base menor. Su perímetro es ${P} ${unit}.`;question='¿Cuánto mide la base menor?';equation=id==='TR6'?`x + 2x + ${L} + ${L} = ${P}`:`x + (x + ${d}) + ${L} + ${L} = ${P}`;
   const coeff=id==='TR6'?3:2,constant=2*L+(id==='TR5'?d:0);
   hints=[meaning,'Suma las dos bases y los dos lados laterales para obtener el perímetro.',`Plantea ${equation}. Resta las cantidades conocidas y divide entre ${coeff}.`];steps=[equation,`${coeff}x + ${constant} = ${P} → ${coeff}x = ${P-constant}.`,`x = ${P-constant} ÷ ${coeff} = ${x} ${unit}.`];
  }else{
   A=(B+b)*h/2;geom={B,b,h};answer=goal==='area'?A:goal==='base mayor'?B:b;
   labels={B:id==='TR4'?'x':id==='TR2'?`${k}x`:id==='TR3'?`${b} + ${d}`:`x + ${d}`,b:id==='TR3'||id==='TR4'?String(b):'x',h:String(h)};solvedLabels={B:String(B),b:String(b),h:String(h)};
   if(id==='TR3')meaning='Primero encuentra la base mayor: B = b + la diferencia.';
   statement=id==='TR3'?`La base menor de un trapecio mide ${b} ${unit}. La base mayor ${plus()} la menor y su altura mide ${h} ${unit}.`:id==='TR4'?`Un trapecio tiene un área de ${A} ${unit}² y una altura de ${h} ${unit}. Su base menor mide ${b} ${unit}.`:`Un trapecio tiene una altura de ${h} ${unit} y un área de ${A} ${unit}². Su base mayor ${id==='TR2'?multiple(k,r):plus()} la base menor.`;
   question=goal==='area'?'¿Cuál es su área?':`¿Cuánto mide la ${goal}?`;equation=id==='TR3'?`B = ${b} + ${d}`:id==='TR4'?`(x + ${b}) × ${h} ÷ 2 = ${A}`:id==='TR2'?`(x + ${k}x) × ${h} ÷ 2 = ${A}`:`(x + x + ${d}) × ${h} ÷ 2 = ${A}`;
   hints=[meaning,'El área del trapecio es (base mayor + base menor) × altura ÷ 2.',id==='TR3'?`Encuentra B con ${equation}. Luego sustituye las dos bases y la altura.`:`Plantea ${equation}. Primero calcula la suma de las bases: 2 × área ÷ altura.`];
   const sum=B+b;steps=id==='TR3'?[`${equation} = ${B} ${unit}.`,`A = (${B} + ${b}) × ${h} ÷ 2 = ${A} ${unit}².`]:[equation,`B + b = 2 × ${A} ÷ ${h} = ${sum} ${unit}.`,id==='TR4'?`x = ${sum} − ${b} = ${B} ${unit}.`:id==='TR2'?`${k+1}x = ${sum} → x = ${sum} ÷ ${k+1} = ${b} ${unit}.`:`2x + ${d} = ${sum} → x = (${sum} − ${d}) ÷ 2 = ${b} ${unit}.`];
  }
 }
 const fromArea=['C3','C4','TR1','TR2','TR4'].includes(id);
 const badge=id==='T3'||id==='TR3'?null:`${fromArea?'A':'P'} = ${fromArea?A:P} ${unit}${fromArea?'²':''}`;
 return {...spec,shape,geom,labels,solvedLabels,statement,question,meaning,equation,hints,steps,goal,answer,unit,answerUnit:unit+(goal==='area'?'²':''),badge,parameters:{x,d,k,h,b,B,L,P,A,target}};
}
export function crearEstado(){return {filtro:'todos',q:generar('C1'),resueltos:0,primerIntento:0,errores:0,ayudas:0,completo:false};}
export function responder(s,raw){
 if(s.completo)return 'bloqueada';if(!/^\s*\d+\s*$/.test(raw)||Number(raw)>100000)return 'invalida';
 if(Number(raw)!==s.q.answer){s.errores++;return 'error';}s.completo=true;s.resueltos++;if(s.errores===0)s.primerIntento++;return 'correcta';
}
export function siguiente(s,r=Math.random){const old=JSON.stringify(s.q);for(let i=0;i<20;i++){s.q=generar(s.filtro,r);if(JSON.stringify(s.q)!==old)break;}s.errores=0;s.ayudas=0;s.completo=false;}
