// Banco finito y reproducible. Las familias cambian el planteamiento, no solo los números.
export const TEMAS = {
  angulos: 'Ángulos y paralelas', triangulos: 'Ángulos de triángulos',
  perimetros: 'Perímetros y relaciones entre lados', areas: 'Áreas y medidas desconocidas',
  circulos: 'Círculos', poligonos: 'Polígonos regulares', semejanza: 'Semejanza', pitagoras: 'Pitágoras con enteros'
};
export const VARIANTES = 12;
const FAMILIAS = [];
const familia = (id, tema, nombre, generar) => FAMILIAS.push({ id, tema, nombre, generar });
const num = n => String(Number(n.toFixed(8))).replace('.', ',');
const ex = (a, b = 0) => `${a === 1 ? '' : a === -1 ? '−' : num(a)}x${b > 0 ? ' + ' + num(b) : b < 0 ? ' − ' + num(-b) : ''}`;
const afin = (a = 1, b = 0) => ({ tipo: 'afin', a, b });
const cuadrado = (k = 1, b = 0) => ({ tipo: 'cuadrado', k, b });
const inverso = k => ({ tipo: 'inverso', k });
export function evaluarObjetivo(obj, x) {
  if (obj.tipo === 'cuadrado') return obj.k * (x + obj.b) ** 2;
  if (obj.tipo === 'inverso') return obj.k / x;
  return obj.a * x + obj.b;
}
function reto(enunciado, a, b, c, d, objetivo = afin(), unidad = '', pasos = [], geometria = {}) {
  const x = (d - b) / (a - c), respuesta = evaluarObjetivo(objetivo, x);
  return { enunciado, ecuacion: { a, b, c, d }, x, objetivo, respuesta, unidad, pasos, geometria };
}
const nombres = {3:'triángulo equilátero',4:'cuadrado',5:'pentágono regular',6:'hexágono regular',7:'heptágono regular',8:'octágono regular',9:'eneágono regular',10:'decágono regular',11:'endecágono regular',12:'dodecágono regular'};
const ns = [3,4,5,6,8,9,10,12];

familia('complementarios-diferencia','angulos','Complementarios con diferencia',s=>{
  const x=24+s,d=90-2*x;
  return reto(`Dos ángulos complementarios se diferencian en ${d}°. ¿Cuánto mide el mayor?`,2,d,0,90,afin(1,d),'°',[`Llama x al menor; el mayor mide x + ${d}.`,`x + (x + ${d}) = 90.`,`2x = ${90-d}; x = ${x}.`,`El mayor mide ${x} + ${d} = ${x+d}°.`],{tipo:'suma-angulos',angulos:[x,x+d],total:90});
});
familia('suplementarios-relacion','angulos','Suplementarios con múltiplo y diferencia',s=>{
  const x=35+s,d=180-3*x;
  return reto(`Dos ángulos son suplementarios. El mayor mide ${d}° más que el doble del menor. ¿Cuánto mide el menor?`,3,d,0,180,afin(),'°',[`Menor = x; mayor = 2x + ${d}.`,`x + (2x + ${d}) = 180.`,`3x = ${180-d}; x = ${x}°.`],{tipo:'suma-angulos',angulos:[x,2*x+d],total:180});
});
familia('conjugados','angulos','Conjugados con relación algebraica',s=>{
  const x=70+s,d=360-3*x;
  return reto(`Dos ángulos conjugados suman una vuelta. Uno mide ${d}° más que el doble del otro. ¿Cuánto mide el menor?`,3,d,0,360,afin(),'°',[`Menor = x; mayor = 2x + ${d}.`,`x + (2x + ${d}) = 360.`,`3x = ${360-d}; x = ${x}°.`],{tipo:'suma-angulos',angulos:[x,2*x+d],total:360});
});
familia('adyacentes-expresiones','angulos','Ángulos adyacentes con dos expresiones',s=>{
  const x=20+s,d=175-5*x;
  return reto(`Dos ángulos adyacentes forman una línea recta. Miden (2x + 5)° y (${ex(3,d)})°. ¿Cuánto vale x?`,5,5+d,0,180,afin(),'', [`Sus medidas suman 180°: (2x + 5) + (${ex(3,d)}) = 180.`,`5x + ${5+d} = 180.`,`5x = ${5*x}; x = ${x}.`],{tipo:'suma-angulos',angulos:[2*x+5,3*x+d],total:180});
});
familia('vuelta-tres-partes','angulos','Tres partes de una vuelta',s=>{
  const x=30+s,d=350-6*x;
  return reto(`Una vuelta completa se divide, sin superposiciones, en tres ángulos: x°, (2x + 10)° y (${ex(3,d)})°. ¿Cuánto vale x?`,6,10+d,0,360,afin(),'', [`x + (2x + 10) + (${ex(3,d)}) = 360.`,`6x + ${10+d} = 360.`,`6x = ${6*x}; x = ${x}.`],{tipo:'suma-angulos',angulos:[x,2*x+10,3*x+d],total:360});
});
familia('correspondientes','angulos','Igualar ángulos correspondientes',s=>{
  const x=5+s,d=2*x+8;
  return reto(`Dos paralelas son cortadas por una transversal. Dos ángulos correspondientes miden (3x + 8)° y (${ex(1,d)})°. ¿Cuánto vale x?`,3,8,1,d,afin(),'', [`Los correspondientes tienen igual medida: 3x + 8 = ${ex(1,d)}.`,`2x = ${d} − 8 = ${2*x}.`,`x = ${x}.`],{tipo:'iguales-angulos',angulos:[3*x+8,x+d]});
});
familia('opuestos-vertice','angulos','Resolver x y hallar el ángulo opuesto',s=>{
  const x=5+s,d=2*x+6;
  return reto(`Dos ángulos opuestos por el vértice miden (4x + 6)° y (${ex(2,d)})°. ¿Cuánto mide cada uno?`,4,6,2,d,afin(4,6),'°',[`4x + 6 = ${ex(2,d)}.`,`2x = ${d-6}; x = ${x}.`,`Sustituye: 4(${x}) + 6 = ${4*x+6}°.`],{tipo:'iguales-angulos',angulos:[4*x+6,2*x+d]});
});
familia('alternos-internos','angulos','Alternos internos con x en ambos lados',s=>{
  const x=20+s,d=x+9;
  return reto(`En dos paralelas cortadas por una transversal, los ángulos alternos internos miden (2x + 9)° y (${ex(1,d)})°. ¿Cuánto mide el primero?`,2,9,1,d,afin(2,9),'°',[`2x + 9 = ${ex(1,d)}.`,`x = ${d} − 9 = ${x}.`,`El primero mide 2(${x}) + 9 = ${2*x+9}°.`],{tipo:'iguales-angulos',angulos:[2*x+9,x+d]});
});
familia('alternos-externos','angulos','Despejar una expresión de alternos externos',s=>{
  const x=15+s,g=3*x-5;
  return reto(`Dos paralelas son cortadas por una transversal. Un ángulo exterior mide ${g}° y su alterno externo mide (3x − 5)°. ¿Cuánto vale x?`,3,-5,0,g,afin(),'', [`Los alternos externos son iguales: 3x − 5 = ${g}.`,`3x = ${g} + 5 = ${3*x}.`,`x = ${x}.`],{tipo:'iguales-angulos',angulos:[g,3*x-5]});
});
familia('colaterales-internos','angulos','Colaterales internos con expresiones',s=>{
  const x=12+s,d=170-5*x;
  return reto(`Dos paralelas son cortadas por una transversal. Dos ángulos colaterales internos miden (2x + 10)° y (${ex(3,d)})°. ¿Cuánto mide el primero?`,5,10+d,0,180,afin(2,10),'°',[`Los colaterales internos suman 180°: (2x + 10) + (${ex(3,d)}) = 180.`,`5x = ${5*x}; x = ${x}.`,`El primero mide 2(${x}) + 10 = ${2*x+10}°.`],{tipo:'suma-angulos',angulos:[2*x+10,3*x+d],total:180});
});
familia('colaterales-externos','angulos','Relación verbal entre colaterales externos',s=>{
  const x=24+s,d=180-3*x;
  return reto(`En dos paralelas cortadas por una transversal, el ángulo colateral externo A mide ${d}° más que el doble de B. ¿Cuánto mide B?`,3,d,0,180,afin(),'°',[`B = x y A = 2x + ${d}.`,`A + B = 180: 3x + ${d} = 180.`,`3x = ${3*x}; B = ${x}°.`],{tipo:'suma-angulos',angulos:[x,2*x+d],total:180});
});
familia('angulo-dividido','angulos','Ángulo recto dividido en dos',s=>{
  const x=12+s,d=86-3*x;
  return reto(`Una semirrecta divide un ángulo recto en dos: (x + 4)° y (${ex(2,d)})°. ¿Cuánto mide la primera parte?`,3,4+d,0,90,afin(1,4),'°',[`(x + 4) + (${ex(2,d)}) = 90.`,`3x = ${3*x}; x = ${x}.`,`Primera parte: ${x} + 4 = ${x+4}°.`],{tipo:'suma-angulos',angulos:[x+4,2*x+d],total:90});
});

familia('interiores-expresiones','triangulos','Tres interiores algebraicos',s=>{
  const x=25+s,d=170-4*x;
  return reto(`Los interiores de un triángulo miden x°, (x + 10)° y (${ex(2,d)})°. ¿Cuánto mide el tercero?`,4,10+d,0,180,afin(2,d),'°',[`x + (x + 10) + (${ex(2,d)}) = 180.`,`4x = ${4*x}; x = ${x}.`,`Tercero: 2(${x}) + ${d} = ${2*x+d}°.`],{tipo:'triangulo-angulos',angulos:[x,x+10,2*x+d]});
});
familia('isosceles-angulos','triangulos','Usar los dos ángulos iguales',s=>{
  const x=15+s,d=160-4*x;
  return reto(`En un triángulo isósceles, cada ángulo de la base mide (x + 10)° y el del vértice mide (${ex(2,d)})°. ¿Cuánto vale x?`,4,20+d,0,180,afin(),'', [`Los dos ángulos de la base son iguales: 2(x + 10) + (${ex(2,d)}) = 180.`,`4x = ${4*x}.`,`x = ${x}.`],{tipo:'triangulo-angulos',angulos:[x+10,x+10,2*x+d]});
});
familia('rectangulo-agudos','triangulos','Dos agudos de un triángulo rectángulo',s=>{
  const x=6+s,d=88-5*x;
  return reto(`Los ángulos agudos de un triángulo rectángulo miden (2x + 2)° y (${ex(3,d)})°. ¿Cuánto vale x?`,5,2+d,0,90,afin(),'', [`Después del ángulo de 90°, quedan 90°: (2x + 2) + (${ex(3,d)}) = 90.`,`5x = ${5*x}.`,`x = ${x}.`],{tipo:'triangulo-angulos',angulos:[90,2*x+2,3*x+d]});
});
familia('exterior-adyacente','triangulos','Exterior e interior adyacente algebraicos',s=>{
  const x=14+s,d=175-6*x;
  return reto(`Un interior de un triángulo mide (4x + 5)° y su exterior adyacente mide (${ex(2,d)})°. ¿Cuánto mide el exterior?`,6,5+d,0,180,afin(2,d),'°',[`Interior + exterior = 180: (4x + 5) + (${ex(2,d)}) = 180.`,`6x = ${6*x}; x = ${x}.`,`Exterior = 2(${x}) + ${d} = ${2*x+d}°.`],{tipo:'suma-angulos',angulos:[4*x+5,2*x+d],total:180});
});
familia('exterior-remotos','triangulos','Exterior y dos interiores no adyacentes',s=>{
  const x=15+s,e=3*x+13;
  return reto(`Un exterior de un triángulo mide ${e}°. Los interiores no adyacentes a él miden (2x + 8)° y (x + 5)°. ¿Cuánto vale x?`,3,13,0,e,afin(),'', [`El interior adyacente es 180 − ${e} = ${180-e}°.`,`(2x + 8) + (x + 5) + ${180-e} = 180; por tanto 3x + 13 = ${e}.`,`3x = ${3*x}; x = ${x}.`],{tipo:'triangulo-angulos',angulos:[2*x+8,x+5,180-e]});
});
familia('triangulo-relacion','triangulos','Dos interiores relacionados y uno conocido',s=>{
  const x=28+s,g=180-3*x;
  return reto(`Un interior de un triángulo mide ${g}°. De los otros dos, uno mide el doble del otro. ¿Cuánto mide el mayor de estos dos?`,3,g,0,180,afin(2),'°',[`Los otros son x y 2x: x + 2x + ${g} = 180.`,`3x = ${3*x}; x = ${x}.`,`El mayor de los dos mide 2(${x}) = ${2*x}°.`],{tipo:'triangulo-angulos',angulos:[x,2*x,g]});
});

familia('rectangulo-razon-area','perimetros','Del perímetro y una razón al área',s=>{
  const x=4+s,k=2+s%2,p=2*(k+1)*x;
  return reto(`Un terreno rectangular tiene una base ${k} veces su altura. Su perímetro mide ${p} m. ¿Cuál es su área?`,2*(k+1),0,0,p,cuadrado(k),'m²',[`Altura = x; base = ${k}x.`,`2(${k}x + x) = ${p}; ${2*(k+1)}x = ${p}; x = ${x}.`,`Base = ${k*x} m. Área = ${k*x} × ${x} = ${k*x*x} m².`],{tipo:'rectangulo',base:k*x,altura:x,perimetro:p,area:k*x*x});
});
familia('rectangulo-diferencia','perimetros','Perímetro y diferencia de lados',s=>{
  const x=5+s,d=3+s%4,p=4*x+2*d;
  return reto(`La base de un rectángulo supera su altura en ${d} cm. Su perímetro es ${p} cm. ¿Cuánto mide la base?`,4,2*d,0,p,afin(1,d),'cm',[`Altura = x; base = x + ${d}.`,`2(x + x + ${d}) = ${p}; 4x = ${4*x}; x = ${x}.`,`Base = ${x} + ${d} = ${x+d} cm.`],{tipo:'rectangulo',base:x+d,altura:x,perimetro:p});
});
familia('rectangulo-dos-expresiones','perimetros','Dos dimensiones algebraicas',s=>{
  const x=3+s,b=3*x+2,h=x+1,p=2*(b+h);
  return reto(`Una cartulina rectangular mide (3x + 2) cm de base y (x + 1) cm de altura. Su perímetro es ${p} cm. ¿Cuánto mide la altura?`,8,6,0,p,afin(1,1),'cm',[`2[(3x + 2) + (x + 1)] = ${p}.`,`8x + 6 = ${p}; x = (${p} − 6) ÷ 8 = ${x}.`,`Altura = ${x} + 1 = ${h} cm.`],{tipo:'rectangulo',base:b,altura:h,perimetro:p});
});
familia('cuadrado-lado-algebraico','perimetros','Cuatro lados con expresión lineal',s=>{
  const x=3+s,l=2*x+3,p=4*l;
  return reto(`Cada lado de una plaza cuadrada mide (2x + 3) m. Se necesitan ${p} m de cinta para rodearla una vez. ¿Cuánto vale x?`,8,12,0,p,afin(),'', [`4(2x + 3) = ${p}.`,`8x + 12 = ${p}; 8x = ${8*x}.`,`x = ${x}.`],{tipo:'rectangulo',base:l,altura:l,perimetro:p});
});
familia('cerca-tres-lados','perimetros','Cercar un rectángulo junto a una pared',s=>{
  const x=4+s,d=4,c=3*x+d;
  return reto(`Un corral rectangular usa una pared para uno de sus lados largos. Se cercan solo los otros tres lados con ${c} m de malla. El lado largo mide 4 m más que cada lado corto. ¿Cuánto mide el lado largo?`,3,d,0,c,afin(1,d),'m',[`Cada lado corto = x; el largo = x + 4.`,`La malla cubre x + x + (x + 4) = ${c}.`,`3x = ${3*x}; x = ${x}; lado largo = ${x+4} m.`],{tipo:'cerca',corto:x,largo:x+d,total:c});
});
familia('cuadrado-dos-vueltas','perimetros','Dos vueltas de cerca con una entrada',s=>{
  const x=5+s,g=2+s%3,t=2*(4*x-g);
  return reto(`Se colocan dos vueltas de alambre alrededor de un patio cuadrado. En cada vuelta se deja sin alambre una entrada de ${g} m. Se usan ${t} m de alambre. ¿Cuánto mide un lado del patio?`,8,-2*g,0,t,afin(),'m',[`Una vuelta usa 4x − ${g} metros.`,`2(4x − ${g}) = ${t}; 8x − ${2*g} = ${t}.`,`8x = ${8*x}; x = ${x} m.`],{tipo:'cerca-cuadrado',lado:x,entrada:g,total:t});
});
familia('romboide-opuestos','perimetros','Lados opuestos iguales y perímetro',s=>{
  const x=4+s,d=2*x+2,l=3*x+2,t=5+s%3;
  return reto(`Dos lados opuestos de un romboide miden (3x + 2) cm y (${ex(1,d)}) cm. Cada uno de los otros lados mide ${t} cm. ¿Cuál es su perímetro?`,3,2,1,d,afin(6,4+2*t),'cm',[`Los opuestos son iguales: 3x + 2 = ${ex(1,d)}.`,`2x = ${2*x}; x = ${x}; ese lado mide ${l} cm.`,`P = 2(${l} + ${t}) = ${2*(l+t)} cm.`],{tipo:'romboide',lados:[l,t,l,t],perimetro:2*(l+t)});
});
familia('equilatero-perimetro','perimetros','Perímetro de un equilátero con resta',s=>{
  const x=3+s,l=2*x-1,p=3*l;
  return reto(`Un triángulo equilátero tiene perímetro ${p} cm. Cada lado se expresa como (2x − 1) cm. ¿Cuánto vale x?`,6,-3,0,p,afin(),'', [`3(2x − 1) = ${p}.`,`6x − 3 = ${p}; 6x = ${6*x}.`,`x = ${x}.`],{tipo:'triangulo-lados',lados:[l,l,l],perimetro:p});
});
familia('isosceles-perimetro','perimetros','Lados repetidos en un isósceles',s=>{
  const x=5+s,p=3*x+7;
  return reto(`Los lados iguales de un triángulo isósceles miden (x + 3) cm cada uno y su base mide (x + 1) cm. Su perímetro es ${p} cm. ¿Cuánto mide cada lado igual?`,3,7,0,p,afin(1,3),'cm',[`2(x + 3) + (x + 1) = ${p}.`,`3x + 7 = ${p}; x = ${x}.`,`Cada lado igual mide ${x} + 3 = ${x+3} cm.`],{tipo:'triangulo-lados',lados:[x+3,x+3,x+1],perimetro:p});
});
familia('escaleno-perimetro','perimetros','Tres lados con diferencias',s=>{
  const x=6+s,p=3*x+7;
  return reto(`El lado mediano de un triángulo mide 2 cm más que el menor y el mayor mide 5 cm más que el menor. El perímetro es ${p} cm. ¿Cuánto mide el lado mayor?`,3,7,0,p,afin(1,5),'cm',[`Los lados son x, x + 2 y x + 5.`,`x + (x + 2) + (x + 5) = ${p}; 3x = ${3*x}; x = ${x}.`,`Mayor = ${x} + 5 = ${x+5} cm.`],{tipo:'triangulo-lados',lados:[x,x+2,x+5],perimetro:p});
});
familia('trapecio-perimetro','perimetros','Perímetro y lados iguales de un trapecio',s=>{
  const x=4+s,b=6+s%3,B=b+6,l=x+2,p=b+B+2*l;
  return reto(`Un trapecio isósceles tiene bases de ${b} cm y ${B} cm. Cada lado no paralelo mide (x + 2) cm y su perímetro es ${p} cm. ¿Cuánto vale x?`,2,b+B+4,0,p,afin(),'', [`${b} + ${B} + 2(x + 2) = ${p}.`,`2x + ${b+B+4} = ${p}; 2x = ${2*x}.`,`x = ${x}.`],{tipo:'trapecio-isosceles',b,B,l,perimetro:p});
});

familia('rectangulo-area-expresion','areas','Despejar una altura algebraica',s=>{
  const x=3+s,b=4+s%4,h=2*x+1,A=b*h;
  return reto(`Un rectángulo tiene base de ${b} cm y altura (2x + 1) cm. Su área es ${A} cm². ¿Cuánto vale x?`,2*b,b,0,A,afin(),'', [`A = b·h: ${b}(2x + 1) = ${A}.`,`2x + 1 = ${A} ÷ ${b} = ${h}.`,`2x = ${2*x}; x = ${x}.`],{tipo:'rectangulo',base:b,altura:h,area:A});
});
familia('rectangulo-area-perimetro','areas','Del área al perímetro de un rectángulo',s=>{
  const x=4+s,h=4+s%3,b=x+3,A=b*h;
  return reto(`Un rectángulo tiene altura de ${h} m y base (x + 3) m. Su área es ${A} m². ¿Cuál es su perímetro?`,h,3*h,0,A,afin(2,6+2*h),'m',[`${h}(x + 3) = ${A}; x + 3 = ${b}; x = ${x}.`,`La base mide ${b} m.`,`P = 2(${b} + ${h}) = ${2*(b+h)} m.`],{tipo:'rectangulo',base:b,altura:h,area:A,perimetro:2*(b+h)});
});
familia('triangulo-area-altura','areas','Altura algebraica a partir de un área triangular',s=>{
  const x=3+s,b=6+s%3*2,h=2*x+2,A=b*h/2;
  return reto(`Una bandera triangular tiene base de ${b} cm, altura (2x + 2) cm y área ${A} cm². ¿Cuánto vale x?`,b,b,0,A,afin(),'', [`${b}(2x + 2) ÷ 2 = ${A}.`,`2x + 2 = 2(${A}) ÷ ${b} = ${h}.`,`2x = ${2*x}; x = ${x}.`],{tipo:'triangulo-area',base:b,altura:h,area:A});
});
familia('triangulo-area-base','areas','Base con múltiplo y resta',s=>{
  const x=3+s,b=3*x-2,h=6,A=3*b;
  return reto(`El área de un triángulo es ${A} m² y su altura mide 6 m. La base mide (3x − 2) m. ¿Cuánto vale x?`,9,-6,0,A,afin(),'', [`(3x − 2)·6 ÷ 2 = ${A}.`,`3x − 2 = ${A} ÷ 3 = ${b}.`,`3x = ${3*x}; x = ${x}.`],{tipo:'triangulo-area',base:b,altura:h,area:A});
});
familia('triangulo-area-borde','areas','Del área al borde de un isósceles',s=>{
  const k=1+s,b=6*k,h=4*k,l=5*k,A=b*h/2;
  return reto(`Un triángulo isósceles tiene dos lados iguales de ${l} cm, altura a la base de ${h} cm y área ${A} cm². ¿Cuánto mide su perímetro?`,h/2,0,0,A,afin(1,2*l),'cm',[`Llama x a la base: x·${h} ÷ 2 = ${A}.`,`x = 2(${A}) ÷ ${h} = ${b} cm.`,`P = ${b} + ${l} + ${l} = ${b+2*l} cm.`],{tipo:'isosceles-area',base:b,altura:h,lado:l,area:A,perimetro:b+2*l});
});
familia('trapecio-area-diferencia','areas','Dos bases relacionadas por una diferencia',s=>{
  const x=6+s,d=2+s%4,h=4+s%2*2,A=(2*x+d)*h/2;
  return reto(`Un trapecio tiene altura de ${h} m. Su base mayor mide ${d} m más que la menor y su área es ${A} m². ¿Cuánto mide la base menor?`,h,d*h/2,0,A,afin(),'m',[`Base menor = x; mayor = x + ${d}.`,`[x + (x + ${d})]·${h} ÷ 2 = ${A}.`,`2x + ${d} = ${2*A/h}; 2x = ${2*x}; x = ${x} m.`],{tipo:'trapecio-area',b:x,B:x+d,h,area:A});
});
familia('trapecio-area-razon','areas','Dos bases relacionadas por un múltiplo',s=>{
  const x=5+s,h=4+s%2*2,A=3*x*h/2;
  return reto(`La base mayor de un trapecio mide el doble de la menor. La altura es ${h} cm y el área ${A} cm². ¿Cuánto mide la base mayor?`,3*h/2,0,0,A,afin(2),'cm',[`Bases: x y 2x.`,`(x + 2x)·${h} ÷ 2 = ${A}; 3x = ${2*A/h}; x = ${x}.`,`Base mayor = 2(${x}) = ${2*x} cm.`],{tipo:'trapecio-area',b:x,B:2*x,h,area:A});
});
familia('trapecio-area-expresiones','areas','Área con dos bases algebraicas',s=>{
  const x=3+s,b=2*x+1,B=3*x+3,h=4,A=(b+B)*2;
  return reto(`Las bases de un trapecio miden (2x + 1) m y (3x + 3) m. Su altura es 4 m y su área ${A} m². ¿Cuánto vale x?`,10,8,0,A,afin(),'', [`[(2x + 1) + (3x + 3)]·4 ÷ 2 = ${A}.`,`2(5x + 4) = ${A}; 10x + 8 = ${A}.`,`10x = ${10*x}; x = ${x}.`],{tipo:'trapecio-area',b,B,h,area:A});
});
familia('trapecio-altura-expresion','areas','Despejar una altura en la fórmula del trapecio',s=>{
  const x=3+s,b=6,B=10,h=x+2,A=8*h;
  return reto(`Un trapecio tiene bases de 6 cm y 10 cm, altura (x + 2) cm y área ${A} cm². ¿Cuánto vale x?`,8,16,0,A,afin(),'', [`(10 + 6)(x + 2) ÷ 2 = ${A}.`,`8(x + 2) = ${A}; x + 2 = ${h}.`,`x = ${h} − 2 = ${x}.`],{tipo:'trapecio-area',b,B,h,area:A});
});
familia('trapecio-base-despeje','areas','Despejar una base con la otra conocida',s=>{
  const b=5+s%3,B=11+s,h=4+s%2*2,A=(B+b)*h/2;
  return reto(`Un trapecio tiene área de ${A} m², altura de ${h} m y base menor de ${b} m. ¿Cuánto mide la base mayor?`,h/2,b*h/2,0,A,afin(),'m',[`(x + ${b})·${h} ÷ 2 = ${A}.`,`x + ${b} = 2(${A}) ÷ ${h} = ${B+b}.`,`x = ${B+b} − ${b} = ${B} m.`],{tipo:'trapecio-area',b,B,h,area:A});
});
familia('areas-iguales','areas','Igualar áreas de dos figuras',s=>{
  const x=3+s,b=6,h=2*x+4,A=b*h;
  return reto(`Un rectángulo de 6 cm de base y ${h} cm de altura tiene la misma área que un triángulo de base 8 cm y altura (3x + 6) cm. ¿Cuánto vale x?`,12,24,0,A,afin(),'', [`Área del rectángulo = 6·${h} = ${A} cm².`,`8(3x + 6) ÷ 2 = ${A}; 12x + 24 = ${A}.`,`x = (${A} − 24) ÷ 12 = ${x}.`],{tipo:'areas-iguales',rectBase:b,rectAltura:h,triBase:8,triAltura:3*x+6,area:A});
});

familia('circunferencia-radio-expresion','circulos','Despejar un radio con π',s=>{
  const x=3+s,r=2*x+1,L=2*r;
  return reto(`Una circunferencia mide ${L}π cm. Su radio se expresa como (2x + 1) cm. ¿Cuánto vale x?`,4,2,0,L,afin(),'', [`L = 2πr: 2π(2x + 1) = ${L}π.`,`Divide entre π: 4x + 2 = ${L}.`,`4x = ${4*x}; x = ${x}.`],{tipo:'circulo',radio:r,longitudCoef:L});
});
familia('circunferencia-area','circulos','De la longitud de la circunferencia al área',s=>{
  const r=3+s;
  return reto(`La longitud de una circunferencia es ${2*r}π cm. ¿Cuál es el área del círculo que encierra? Conserva π.`,2,0,0,2*r,cuadrado(),'π cm²',[`2πr = ${2*r}π; 2r = ${2*r}; r = ${r} cm.`,`A = πr².`,`A = π·${r}² = ${r*r}π cm².`],{tipo:'circulo',radio:r,longitudCoef:2*r,areaCoef:r*r});
});
familia('circunferencia-diametro-expresion','circulos','Diámetro algebraico y longitud',s=>{
  const x=3+s,d=3*x+2;
  return reto(`Una circunferencia tiene diámetro (3x + 2) cm y longitud ${d}π cm. ¿Cuánto vale x?`,3,2,0,d,afin(),'', [`Como d = 2r, L = πd.`,`π(3x + 2) = ${d}π; 3x + 2 = ${d}.`,`3x = ${3*x}; x = ${x}.`],{tipo:'circulo',radio:d/2,longitudCoef:d});
});
familia('circulos-radio-diferencia','circulos','Longitud de un círculo y radio de otro',s=>{
  const r=6+s;
  return reto(`La circunferencia de un círculo grande mide ${2*r}π cm. El radio de otro círculo es 3 cm menor. ¿Cuál es el área del círculo pequeño? Conserva π.`,2,0,0,2*r,cuadrado(1,-3),'π cm²',[`2πr = ${2*r}π; r = ${r} cm.`,`Radio pequeño = ${r} − 3 = ${r-3} cm.`,`A = π(${r-3})² = ${(r-3)**2}π cm².`],{tipo:'circulos-relacion',grande:r,pequeno:r-3,longitudCoef:2*r,areaCoef:(r-3)**2});
});

familia('poligono-perimetro-expresion','poligonos','Perímetro de un polígono con lado algebraico',s=>{
  const x=3+s,n=5+s%6,L=2*x+1,P=n*L;
  return reto(`Un ${nombres[n]} tiene perímetro ${P} cm. Cada lado mide (2x + 1) cm. ¿Cuánto vale x?`,2*n,n,0,P,afin(),'', [`P = nL: ${n}(2x + 1) = ${P}.`,`2x + 1 = ${P} ÷ ${n} = ${L}.`,`2x = ${2*x}; x = ${x}.`],{tipo:'poligono',n,L,P});
});
familia('interior-exterior-expresiones','poligonos','Interior y exterior con expresiones',s=>{
  const x=2+s,n=ns[s%ns.length],E=360/n,I=180-E,b=E-2*x,d=I-3*x;
  return reto(`En un polígono regular, un exterior mide (${ex(2,b)})° y su interior adyacente mide (${ex(3,d)})°. ¿Cuánto vale x?`,5,b+d,0,180,afin(),'', [`Interior + exterior = 180: (${ex(2,b)}) + (${ex(3,d)}) = 180.`,`5x + ${b+d} = 180; 5x = ${5*x}.`,`x = ${x}.`],{tipo:'poligono',n,interior:I,exterior:E});
});
familia('central-exterior','poligonos','Número de lados y exterior algebraico',s=>{
  const x=2+s,n=ns[s%ns.length],E=360/n,b=E-3*x;
  return reto(`Un polígono regular tiene ${n} lados. Su ángulo exterior mide (${ex(3,b)})°. ¿Cuánto vale x?`,3,b,0,E,afin(),'', [`Exterior = 360 ÷ ${n} = ${E}°.`,`Entonces ${ex(3,b)} = ${E}.`,`3x = ${3*x}; x = ${x}.`],{tipo:'poligono',n,exterior:E});
});
familia('interior-algebraico','poligonos','Interior algebraico de una figura conocida',s=>{
  const x=2+s,n=ns[s%ns.length],I=180-360/n,b=I-5*x;
  return reto(`Un ${nombres[n]} tiene cada ángulo interior expresado como (${ex(5,b)})°. ¿Cuánto vale x?`,5,b,0,I,afin(),'', [`Interior = 180 − 360 ÷ ${n} = ${I}°.`,`${ex(5,b)} = ${I}.`,`5x = ${5*x}; x = ${x}.`],{tipo:'poligono',n,interior:I});
});
familia('suma-lados-algebraicos','poligonos','Suma interior y número de lados algebraico',s=>{
  const x=2+s,n=x+3,S=(n-2)*180;
  return reto(`Un polígono convexo tiene (x + 3) lados y sus ángulos interiores suman ${S}°. ¿Cuánto vale x?`,180,180,0,S,afin(),'', [`S = (n − 2)·180; n = x + 3.`,`[(x + 3) − 2]·180 = ${S}; x + 1 = ${S/180}.`,`x = ${S/180} − 1 = ${x}.`],{tipo:'poligono',n,suma:S});
});
familia('suma-perimetro','poligonos','De la suma interior al perímetro',s=>{
  const n=3+s,L=3+s%3,S=(n-2)*180;
  return reto(`Los interiores de un polígono regular suman ${S}°. Cada lado mide ${L} cm. ¿Cuál es su perímetro?`,180,-360,0,S,afin(L),'cm',[`(n − 2)·180 = ${S}.`,`n − 2 = ${S/180}; n = ${n}.`,`P = nL = ${n}·${L} = ${n*L} cm.`],{tipo:'poligono',n,L,P:n*L,suma:S});
});
familia('diagonales-lado','poligonos','De diagonales desde un vértice a longitud de lado',s=>{
  const n=4+s,d=n-3,L=4+s%4,P=n*L;
  return reto(`Desde un vértice de un polígono regular ${d===1?'sale 1 diagonal':`salen ${d} diagonales`}. Su perímetro mide ${P} cm. ¿Cuánto mide cada lado?`,1,-3,0,d,inverso(P),'cm',[`d = n − 3: ${d} = n − 3; n = ${n}.`,`P = nL: ${P} = ${n}L.`,`L = ${P} ÷ ${n} = ${L} cm.`],{tipo:'poligono',n,L,P,diagonalesVertice:d});
});
familia('central-lado','poligonos','Del ángulo central al lado',s=>{
  const n=ns[s%ns.length],L=3+s,E=360/n,P=n*L;
  return reto(`El ángulo central de un polígono regular mide ${E}° y su perímetro es ${P} cm. ¿Cuánto mide cada lado?`,E,0,0,360,inverso(P),'cm',[`360 ÷ n = ${E}; ${E}n = 360; n = ${n}.`,`P = nL: ${P} = ${n}L.`,`L = ${P} ÷ ${n} = ${L} cm.`],{tipo:'poligono',n,L,P,central:E});
});
function datosArea(s) {
  const n=[5,6,8,10][s%4],L=2*(3+Math.floor(s/4)),a=Math.round(L/(2*Math.tan(Math.PI/n))),P=n*L,A=P*a/2;
  return {tipo:'poligono-area-aproximada',n,L,a,P,A};
}
familia('apotema-despeje','poligonos','Calcular perímetro y despejar apotema',s=>{
  const g=datosArea(s),{n,L,P,A,a}=g;
  return reto(`Un ${nombres[n]} tiene lados de ${L} cm. Al redondear su apotema a centímetros enteros, se calculó un área aproximada de ${A} cm². Usando esos datos en A ≈ Pa/2, ¿qué apotema se utilizó?`,P/2,0,0,A,afin(),'cm',[`P = ${n}·${L} = ${P} cm.`,`${A} ≈ ${P}a ÷ 2.`,`Apotema usada: a = 2(${A}) ÷ ${P} = ${a} cm (aproximada).`],g);
});
familia('area-lado-despeje','poligonos','Despejar el lado desde área y apotema',s=>{
  const g=datosArea(s),{n,L,a,A}=g;
  return reto(`Para un ${nombres[n]}, se usó la apotema redondeada de ${a} cm y se obtuvo el área aproximada de ${A} cm². Con A ≈ nLa/2, ¿qué longitud de lado se usó?`,n*a/2,0,0,A,afin(),'cm',[`${A} ≈ ${n}·L·${a} ÷ 2.`,`2(${A}) ≈ ${n*a}L.`,`L = ${2*A} ÷ ${n*a} = ${L} cm.`],g);
});
familia('area-perimetro-x','poligonos','Dos fórmulas para recuperar x',s=>{
  const g=datosArea(s),{n,L,a,A,P}=g,x=L/2-1;
  return reto(`Cada lado de un ${nombres[n]} mide (2x + 2) cm. Con una apotema redondeada de ${a} cm se calculó un área aproximada de ${A} cm². Usando A ≈ Pa/2, ¿cuánto vale x?`,2*n,n*2,0,P,afin(),'', [`P = 2A ÷ a ≈ 2(${A}) ÷ ${a} = ${P} cm.`,`${n}(2x + 2) = ${P}; 2x + 2 = ${L}.`,`2x = ${L-2}; x = ${x}.`],g);
});
familia('cuadrado-apotema','poligonos','Apotema y perímetro de un cuadrado',s=>{
  const x=3+s,a=x+1,L=2*a,P=4*L;
  return reto(`La apotema de un cuadrado mide (x + 1) cm. Su perímetro es ${P} cm. Recuerda que, en un cuadrado, el lado mide el doble de la apotema. ¿Cuánto vale x?`,8,8,0,P,afin(),'', [`L = 2(x + 1).`,`P = 4L: 8(x + 1) = ${P}.`,`x + 1 = ${a}; x = ${x}.`],{tipo:'poligono-cuadrado',n:4,L,a,P});
});

familia('semejanza-lado','semejanza','Razón de semejanza y lado algebraico',s=>{
  const x=3+s,l=2*x+2;
  return reto(`ABC y DEF son semejantes, con A ↔ D, B ↔ E y C ↔ F. AB = 5 cm, DE = 10 cm, BC = (2x + 2) cm y EF = ${2*l} cm. ¿Cuánto vale x?`,4,4,0,2*l,afin(),'', [`La razón de ABC a DEF es 10 ÷ 5 = 2.`,`EF = 2·BC: ${2*l} = 2(2x + 2).`,`4x = ${4*x}; x = ${x}.`],{tipo:'semejanza',par1:[5,10],par2:[l,2*l]});
});
familia('semejanza-dos-expresiones','semejanza','Correspondientes con x en ambas medidas',s=>{
  const x=4+s,b=x+2,d=x+4,l=x+b;
  return reto(`Dos triángulos semejantes tienen razón de ampliación 2. Un lado del pequeño mide (${ex(1,b)}) cm y su correspondiente del grande mide (${ex(3,d)}) cm. ¿Cuánto vale x?`,2,2*b,3,d,afin(),'', [`Lado grande = 2·lado pequeño: ${ex(3,d)} = 2(${ex(1,b)}).`,`3x + ${d} = 2x + ${2*b}.`,`x = ${2*b} − ${d} = ${x}.`],{tipo:'semejanza',par1:[1,2],par2:[l,2*l]});
});
familia('semejanza-perimetro','semejanza','Razón de lados y perímetro algebraico',s=>{
  const x=6+s,k=2+s%3,p=12*k,P=2*p,d=P-3*x;
  return reto(`Dos triángulos son semejantes. Un lado del pequeño mide ${3*k} cm y su correspondiente del grande mide ${6*k} cm. El perímetro del pequeño es ${p} cm y el del grande es (${ex(3,d)}) cm. ¿Cuánto vale x?`,3,d,0,P,afin(),'', [`La razón de ampliación es ${6*k} ÷ ${3*k} = 2.`,`El perímetro grande es 2·${p} = ${P} cm.`,`${ex(3,d)} = ${P}; 3x = ${3*x}; x = ${x}.`],{tipo:'semejanza',par1:[3*k,6*k],par2:[p,P],lados:[3*k,4*k,5*k]});
});
familia('sombras-semejanza','semejanza','Sombras y altura con expresión',s=>{
  const x=3+s,h=2*x+4,sombra=3*h/2;
  return reto(`Al mismo tiempo, una vara vertical de 2 m proyecta una sombra de 3 m y un poste proyecta una sombra de ${sombra} m sobre el mismo suelo horizontal. La altura del poste es (2x + 4) m. Por semejanza, ¿cuánto vale x?`,6,12,0,2*sombra,afin(),'', [`Altura/sombra: 2/3 = (2x + 4)/${sombra}.`,`Multiplica en cruz: 2·${sombra} = 3(2x + 4).`,`6x = ${6*x}; x = ${x}.`],{tipo:'semejanza',par1:[2,h],par2:[3,sombra]});
});

const ternas=[[3,4,5],[5,12,13],[8,15,17],[7,24,25]];
function terna(s) { const k=1+Math.floor(s/4); return ternas[s%4].map(n=>n*k); }
familia('pitagoras-cateto','pitagoras','Despejar un cateto y luego x',s=>{
  const [a,b,c]=terna(s),d=1+s%3,x=b-d;
  return reto(`En un triángulo rectángulo, la hipotenusa mide ${c} cm y un cateto ${a} cm. El otro cateto mide (${ex(1,d)}) cm. ¿Cuánto vale x?`,1,d,0,b,afin(),'', [`${a}² + (${ex(1,d)})² = ${c}².`,`El cateto positivo es √(${c*c} − ${a*a}) = √${b*b} = ${b} cm.`,`${ex(1,d)} = ${b}; x = ${x}.`],{tipo:'pitagoras',a,b,c,incognita:'b'});
});
familia('pitagoras-hipotenusa','pitagoras','Hipotenusa expresada con x',s=>{
  const [a,b,c]=terna(s),d=1+s%3,x=c-d;
  return reto(`Los catetos de un triángulo rectángulo miden ${a} cm y ${b} cm. La hipotenusa mide (${ex(1,d)}) cm. ¿Cuánto vale x?`,1,d,0,c,afin(),'', [`(${ex(1,d)})² = ${a}² + ${b}² = ${c*c}.`,`La hipotenusa es positiva: ${ex(1,d)} = √${c*c} = ${c}.`,`x = ${c} − ${d} = ${x}.`],{tipo:'pitagoras',a,b,c,incognita:'c'});
});
familia('diagonal-perimetro','pitagoras','De una diagonal al perímetro rectangular',s=>{
  const [a,b,c]=terna(s);
  return reto(`Un rectángulo tiene diagonal de ${c} cm y altura de ${a} cm. ¿Cuál es su perímetro?`,1,0,0,b,afin(2,2*a),'cm',[`Base² + ${a}² = ${c}².`,`Base = √(${c*c} − ${a*a}) = ${b} cm.`,`P = 2(${b} + ${a}) = ${2*(b+a)} cm.`],{tipo:'pitagoras',a,b,c,incognita:'b',perimetro:2*(a+b)});
});
familia('pitagoras-area','pitagoras','Del cateto desconocido al área',s=>{
  const [a,b,c]=terna(s);
  return reto(`Un triángulo rectángulo tiene hipotenusa de ${c} cm y un cateto de ${a} cm. ¿Cuál es su área?`,1,0,0,b,afin(a/2),'cm²',[`Otro cateto² = ${c}² − ${a}² = ${b*b}.`,`Otro cateto = √${b*b} = ${b} cm.`,`A = ${a}·${b} ÷ 2 = ${a*b/2} cm².`],{tipo:'pitagoras',a,b,c,incognita:'b',area:a*b/2});
});

export function aleatorioSemilla(semilla) {
  return () => { semilla |= 0; semilla = semilla + 0x6D2B79F5 | 0; let t = Math.imul(semilla ^ semilla >>> 15, 1 | semilla); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function mezclar(lista, azar = Math.random) {
  const nueva = [...lista];
  for (let i=nueva.length-1; i>0; i--) { const j=Math.floor(azar()*(i+1)); [nueva[i],nueva[j]]=[nueva[j],nueva[i]]; }
  return nueva;
}
export function etiquetaRespuesta(valor, unidad='') {
  return `${num(valor)}${unidad.startsWith('π')?'':' '}${unidad}`.trim();
}
export function crearBanco() {
  const banco=[];
  FAMILIAS.forEach((f,fi)=>{
    for(let s=0;s<VARIANTES;s++){
      const q=f.generar(s),v=q.respuesta;
      if(!Number.isFinite(v)||v<=0)throw new Error(`Respuesta inválida: ${f.id}/${s}`);
      const candidatos=[v,q.x,2*v,v+2,v-2,v+1,v-1,v+5,v+10].filter(n=>Number.isFinite(n)&&n>0);
      const unicos=[...new Set(candidatos.map(n=>Number(n.toFixed(8))))];
      const azar=aleatorioSemilla((fi+1)*1000+s+1),otros=mezclar(unicos.filter(n=>Math.abs(n-v)>1e-7),azar).slice(0,3);
      const valores=mezclar([v,...otros],azar);
      banco.push({...q,id:`${f.id}-${s+1}`,familia:f.id,tema:f.tema,plantilla:f.nombre,variante:s+1,opciones:valores.map((n,i)=>({id:'abcd'[i],valor:n,texto:etiquetaRespuesta(n,q.unidad)})),correcta:'abcd'[valores.indexOf(v)]});
    }
  });
  return banco;
}
export const CATALOGO = FAMILIAS.map(({id,tema,nombre})=>({id,tema,nombre}));
