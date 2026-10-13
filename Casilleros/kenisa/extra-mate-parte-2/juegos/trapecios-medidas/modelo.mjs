export const CASOS=[
 {id:'A1',nombre:'Área · Bases y altura'},
 {id:'A2',nombre:'Área · Rectángulo: encuentra h'},
 {id:'A3',nombre:'Área · Isósceles: encuentra x y h'},
 {id:'A4',nombre:'Área · Suma x, b e y'},
 {id:'A5',nombre:'Área · Despeja x y encuentra h'},
 {id:'P1',nombre:'Perímetro · Cuatro lados'},
 {id:'P2',nombre:'Perímetro · Dos lados iguales'},
 {id:'P3',nombre:'Perímetro · Encuentra el lado inclinado'},
 {id:'P4',nombre:'Perímetro · Base y dos lados'},
 {id:'P5',nombre:'Perímetro · Encuentra una base'},
 {id:'P6',nombre:'Perímetro · Isósceles: encuentra B'}
];
const TERNAS=[[3,4,5],[6,8,10],[5,12,13],[8,6,10],[9,12,15],[10,24,26],[18,24,30]];
// h, x, y: los dos triángulos rectángulos comparten altura.
const PARES=[[8,6,15],[12,5,9],[12,9,16],[20,15,21],[24,10,18]];
const pick=(a,r)=>a[Math.floor(r()*a.length)];
export function geometria(B,b,h,x){
 const y=B-b-x,L1=Math.sqrt(x*x+h*h),L2=Math.sqrt(y*y+h*h);
 return {B,b,h,x,y,L1,L2,area:(B+b)*h/2,perimetro:B+b+L1+L2};
}
export function generar(filtro='todos',r=Math.random,variante){
 const cases=CASOS.filter(c=>filtro==='todos'||filtro==='area'&&c.id[0]==='A'||filtro==='perimetro'&&c.id[0]==='P'||filtro===c.id);
 if(!cases.length)throw new RangeError('Caso inválido');
 const id=pick(cases,r).id,b=2*(3+Math.floor(r()*6));let x,y,h,tipo;
 const iso=['A3','P2','P6'].includes(id),rect=['A2','P3'].includes(id);
 if(iso||rect){let [dx,dh]=pick(rect?TERNAS.filter(t=>t[0]%2===0):TERNAS,r);const k=pick([1,1,2],r);x=dx*k;h=dh*k;y=iso?x:0;tipo=iso?'isósceles':'rectángulo';}
 else if(id==='A1'||id==='A4'){
  x=1+Math.floor(r()*7);y=pick([1,2,3,4,5,6,7,8].filter(v=>v!==x&&v%2===x%2),r);h=2*(2+Math.floor(r()*7));tipo='no isósceles';
 }else{
  [h,x,y]=pick(PARES,r);const k=(x+y)%2?2:1;h*=k;x*=k;y*=k;
  if(r()<.5)[x,y]=[y,x];tipo='no isósceles';
 }
 const g=geometria(x+b+y,b,h,x),{B,L1,L2}=g,area=id[0]==='A',variant=id==='P5'?(variante??(r()<.5?1:2)):null;
 let given,unknown=[],guides=false,segments=false,pistas,steps;
 const areaStep=`A = (${B} + ${b}) × ${h} ÷ 2 = ${g.area} cm².`;
 const perimeterStep=`P = ${B} + ${b} + ${L1} + ${L2} = ${g.perimetro} cm.`;
 switch(id){
  case 'A1':given=['B','b','h'];guides=true;pistas=['Suma las dos bases, multiplica por la altura y divide entre 2.'];steps=[areaStep];break;
  case 'A2':given=['B','b','L1'];unknown=['x','h'];guides=segments=true;pistas=['x = B − b.','h² = L₁² − x². Después usa A = (B + b)h/2.'];steps=[`x = ${B} − ${b} = ${x} cm.`,`h = √(${L1}² − ${x}²) = √${h*h} = ${h} cm.`,areaStep];break;
  case 'A3':given=['B','b','L1'];unknown=['x','h'];guides=segments=true;pistas=['Los dos extremos son iguales: 2x + b = B. Por eso x = (B − b)/2.','h² = L² − x². Después calcula el área.'];steps=[`x = (${B} − ${b}) ÷ 2 = ${x} cm.`,`h = √(${L1}² − ${x}²) = √${h*h} = ${h} cm.`,areaStep];break;
  case 'A4':given=['b','h','x','y'];unknown=['B'];guides=segments=true;pistas=['B = x + b + y.','Con B, b y h ya puedes aplicar la fórmula del área.'];steps=[`B = ${x} + ${b} + ${y} = ${B} cm.`,areaStep];break;
  case 'A5':given=['B','b','y','L1'];unknown=['x','h'];guides=segments=true;pistas=['x + b + y = B: resta b e y para obtener x.','Usa h² = L₁² − x². Al encontrar h, calcula el área.'];steps=[`x = ${B} − ${b} − ${y} = ${x} cm.`,`h = √(${L1}² − ${x}²) = √${h*h} = ${h} cm.`,areaStep];break;
  case 'P1':given=['B','b','L1','L2'];pistas=['El perímetro recorre los cuatro lados: P = B + b + L₁ + L₂.'];steps=[perimeterStep];break;
  case 'P2':given=['B','b','L1'];pistas=['Las marcas iguales indican que los dos laterales miden L.','P = B + b + 2L.'];steps=[`P = ${B} + ${b} + 2 × ${L1} = ${g.perimetro} cm.`];break;
  case 'P3':given=['B','b','h'];unknown=['x','L1'];guides=segments=true;pistas=['x = B − b.','El lado inclinado es la hipotenusa: L₁² = h² + x². El lateral vertical mide h.'];steps=[`x = ${B} − ${b} = ${x} cm.`,`L₁ = √(${h}² + ${x}²) = √${L1*L1} = ${L1} cm.`,perimeterStep];break;
  case 'P4':given=['b','h','x','y'];unknown=['B','L1','L2'];guides=segments=true;pistas=['B = x + b + y.','L₁² = h² + x² y L₂² = h² + y². Encuentra ambos lados y suma los cuatro.'];steps=[`B = ${x} + ${b} + ${y} = ${B} cm.`,`L₁ = √(${h}² + ${x}²) = ${L1} cm.`,`L₂ = √(${h}² + ${y}²) = ${L2} cm.`,perimeterStep];break;
  case 'P5':given=[variant===1?'B':'b','x','y','L1','L2'];unknown=[variant===1?'b':'B'];guides=segments=true;pistas=[variant===1?'b = B − x − y.':'B = b + x + y.','Con las dos bases, suma los cuatro lados.'];steps=[variant===1?`b = ${B} − ${x} − ${y} = ${b} cm.`:`B = ${b} + ${x} + ${y} = ${B} cm.`,perimeterStep];break;
  case 'P6':given=['b','x','L1'];unknown=['B'];guides=segments=true;pistas=['En un isósceles, ambos extremos miden x: B = b + 2x.','Después P = B + b + 2L.'];steps=[`B = ${b} + 2 × ${x} = ${B} cm.`,`P = ${B} + ${b} + 2 × ${L1} = ${g.perimetro} cm.`];break;
 }
 return {...g,id,tipo,variant,given,unknown,guides,segments,iso,goal:area?'A':'P',answer:area?g.area:g.perimetro,unit:area?'cm²':'cm',pistas,steps,pregunta:`Encuentra el ${area?'área':'perímetro'} del trapecio ${tipo}.`};
}
export function datosFigura(q,solved=false){return Object.fromEntries([...q.given,...q.unknown].map(key=>[key,q.given.includes(key)||solved?q[key]:null]));}
export function crearEstado(){return {filtro:'todos',q:generar('A1'),resueltos:0,primerIntento:0,errores:0,completo:false};}
export function responder(s,raw){
 if(s.completo)return 'bloqueada';if(!/^\s*\d+\s*$/.test(raw)||Number(raw)>1e6)return 'invalida';
 if(Number(raw)!==s.q.answer){s.errores++;return 'error';}s.completo=true;s.resueltos++;if(!s.errores)s.primerIntento++;return 'correcta';
}
export function siguiente(s,r=Math.random){const old=JSON.stringify(s.q);for(let i=0;i<20;i++){s.q=generar(s.filtro,r);if(JSON.stringify(s.q)!==old)break;}s.errores=0;s.completo=false;}
