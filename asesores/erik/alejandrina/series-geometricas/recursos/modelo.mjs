// Pure, seeded generators shared by guided practice and the final mission.
import {numberFraction,fractionTex} from './fracciones.mjs';
export const VERSION = 2;
export const variants = {
  patron: ['Multiplicar', 'Disminuir'], elementos: ['Posición y valor', 'Contar saltos'],
  formula: ['Construir la fórmula', 'Contar factores'], termino: ['Razón entera', 'Razón fraccionaria'],
  inicio: ['Retroceder', 'Razón fraccionaria'],
  raices: ['Aislar la potencia', 'Raíz impar negativa', 'Dos raíces reales', 'Sin raíz real'],
  razon: ['Raíz impar', 'Raíz par positiva'],
  posicion: ['Reconocer potencias', 'Usar logaritmos', 'No pertenece', 'Razón igual a uno'],
  dos: ['Términos vecinos', 'Términos separados'],
  sumas: ['Sumar', 'Razón igual a uno', 'Razón menor que uno', 'Primer término desconocido'],
  aplicacion: ['Una cantidad', 'Un total', 'Disminución: una cantidad', 'Disminución: un total'], medios: ['Un medio', 'Varios medios'],
  combinar: ['Reconstruir y sumar', 'Reconstruir y avanzar']
};
export const titles = {patron:'El patrón',elementos:'Los elementos',formula:'La fórmula',termino:'Un término',inicio:'El primer término',raices:'Potencias y raíces',razon:'La razón',posicion:'La posición',dos:'Dos términos',sumas:'Sumatoria',aplicacion:'Aplicaciones',medios:'Medios geométricos',combinar:'Conectar procedimientos',aplicacionTermino:'Una cantidad en contexto',aplicacionSuma:'Un total en contexto'};
export function rng(seed) { let x = seed >>> 0; return () => ((x = (Math.imul(1664525,x)+1013904223)>>>0) / 4294967296); }
export function shuffle(values, random) { const a=[...values]; for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
export function parseNumber(value) {
  if(typeof value !== 'string') return null;
  const parts=value.trim().replaceAll(',','.').split('/');
  if(parts.length>2 || parts.some(x=>! /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(x.trim()))) return null;
  const numbers=parts.map(Number);
  if(numbers.some(n=>!Number.isFinite(n)) || (numbers.length===2&&numbers[1]===0))return null;
  const v=numbers.length===2?numbers[0]/numbers[1]:numbers[0];
  return Number.isFinite(v)?v:null;
}
export const fmt = n => Number.isInteger(n)?String(n):String(Number(n.toFixed(8))).replace('.',',');
export const texnum = n => fractionTex(numberFraction(n));
export const term = (a,r,n) => a*r**(n-1);
export const sum = (a,r,n) => r===1 ? a*n : a*(r**n-1)/(r-1);
export function accepts(step, value) {
  if(step.choices) return value===step.answer;
  const n=parseNumber(value);
  return n!==null && Math.abs(n-step.answer)<=1e-8*Math.max(1,Math.abs(step.answer));
}
export const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function math(tex) {tex=tex.replace(/-?\d+\.\d+(?:e[+-]?\d+)?/gi,n=>texnum(Number(n)));return `<span class="math" data-math="${escape(tex)}">${escape(tex.replace(/\\cdot/g,'×').replace(/\\(?:quad|qquad)/g,' ').replace(/\\ne/g,'≠').replace(/\\log/g,'log'))}</span>`;}
export const displayValue=text=>String(text).split(/(-?\d+[.,]\d+)/).map((part,i)=>i%2?math(texnum(Number(part.replace(',','.')))):escape(part)).join('');
const numstep=(label,answer,equation,hint)=>({label,answer,equation,hint});
const choicestep=(label,answer,choices,equation,hint)=>({label,answer,choices,equation,hint});

export function generate(topic, variant=0, seed=1, varied=false) {
  if(!variants[topic] || !Number.isInteger(variant) || variant<0 || variant>=variants[topic].length) throw Error('Variante desconocida');
  const random=rng(seed), pick=xs=>xs[Math.floor(random()*xs.length)], int=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1));
  let a=int(2,8), r=pick([2,3,4]), n=int(4,6), steps=[], stem='', data={};
  const step=(label,answer,eq,hint)=>steps.push(numstep(label,answer,eq,hint));
  const choice=(label,answer,choices,eq,hint)=>steps.push(choicestep(label,answer,choices,eq,hint));
  if(['patron','termino','inicio'].includes(topic) && variant===1){r=pick([0.5,1.5]);a=int(2,5)*2**(n-1);}
  if(topic==='patron'&&variant===1)r=0.5;
  if(varied){
    r=pick([2,3,4,5,6]);
    if(['patron','termino','inicio','formula'].includes(topic)&&variant===1){
      r=pick(topic==='patron'?[0.25,0.5,0.75]:[0.25,0.5,0.75,1.5,2.5]);
      a=int(2,9)*4;
    }
  }
  if(topic==='patron') {
    const values=Array.from({length:4},(_,i)=>term(a,r,i+1));
    stem=`Observa ${values.map(v=>math(texnum(v))).join(', ')}. Encuentra la razón.`;
    step('Razón',r,`r=\\frac{${texnum(values[1])}}{${a}}=${texnum(r)}`,'Divide un término entre el anterior; no restes.');
  } else if(topic==='elementos' || topic==='formula') {
    const an=term(a,r,n); stem=`En una sucesión, ${math(`a_1=${a},\\quad r=${r},\\quad a_${n}=${an}`)}.`;
    if(topic==='elementos' && variant===0){
      stem+=' Distingue la posición y el valor del término indicado.';
      step('Posición n',n,`n=${n}`,'El subíndice indica la posición.');
      step('Valor del término',an,`a_${n}=${an}`,'El valor es la cantidad que está en esa posición.');
    }else{
      stem+=` ¿Cuántas multiplicaciones separan el primer término del término ${n}?`;
      step('Número de saltos',n-1,`${n}-1=${n-1}`,'El primer término no ha dado ningún salto.');
      if(topic==='formula' && variant===0) choice('Elige la fórmula general','aₙ = a₁ · rⁿ⁻¹',['aₙ = a₁ · rⁿ⁻¹','aₙ = a₁ · rⁿ','aₙ = a₁ + (n−1)r','aₙ = (a₁ · r)ⁿ⁻¹'],'a_n=a_1r^{n-1}','La potencia cuenta las multiplicaciones de r, y a₁ queda fuera de ella.');
    }
  } else if(topic==='termino') {
    stem=`Encuentra ${math(`a_${n}`)} si ${math(`a_1=${a},\\quad r=${texnum(r)}`)}.`;
    step('Exponente',n-1,`n-1=${n-1}`,'Resta uno a la posición.');
    step('Valor de la potencia',r**(n-1),`${texnum(r)}^{${n-1}}=${texnum(r**(n-1))}`,'Eleva la razón, sin multiplicar todavía por a₁.');
    step(`Valor de a${n}`,term(a,r,n),`a_${n}=${a}\\cdot ${texnum(r**(n-1))}=${texnum(term(a,r,n))}`,'Multiplica el primer término por la potencia.');
  } else if(topic==='inicio') {
    const an=term(a,r,n); stem=`Encuentra el primer término si ${math(`a_${n}=${texnum(an)},\\quad r=${texnum(r)}`)}.`;
    step('Número de saltos',n-1,`n-1=${n-1}`,'Cuenta los saltos desde la posición 1.');
    step('Potencia de la razón',r**(n-1),`r^{${n-1}}=${texnum(r**(n-1))}`,'Calcula la potencia antes de dividir.');
    step('Primer término',a,`a_1=\\frac{${texnum(an)}}{${texnum(r**(n-1))}}=${a}`,'Deshaz las multiplicaciones dividiendo.');
  } else if(topic==='raices') {
    const k=variant===0?pick([3,5]):variant===1?3:pick([2,4]), c=int(2,6), root=variant===1?-int(2,5):int(2,5), power=variant===3?-(root**k):root**k;
    data={root,k,c,power}; stem=`Resuelve en los números reales: ${math(`${c}r^{${k}}=${c*power}`)}.`;
    step('Valor de la potencia aislada',power,`r^{${k}}=\\frac{${c*power}}{${c}}=${power}`,'Primero divide ambos lados entre el coeficiente.');
    if(variant<2) step('Valor de r',root,`r=\\sqrt[${k}]{${power}}=${root}`,'Una raíz impar conserva el signo del radicando. Comprueba elevando tu respuesta.');
    else if(variant===2) choice('Todas las soluciones reales',`−${root} y ${root}`,[`−${root} y ${root}`,String(root),String(-root),'No hay solución real'],`r=\\pm ${root}`,'Una potencia par de un número y de su opuesto produce el mismo resultado.');
    else choice('Soluciones reales','No hay solución real',['No hay solución real',String(root),String(-root),`−${root} y ${root}`],`r^{${k}}<0\\;\\text{no tiene solución real}`,'Una potencia par de un número real nunca es negativa.');
  } else if(topic==='razon') {
    n=variant===0?4:5; const an=term(a,r,n); stem=`Encuentra la razón positiva si ${math(`a_1=${a},\\quad a_${n}=${an}`)}.`;
    step('Número de saltos',n-1,`n-1=${n-1}`,'Ese número será el índice de la raíz.');
    step('Valor de la potencia',an/a,`r^{${n-1}}=\\frac{${an}}{${a}}=${an/a}`,'Divide el término final entre el primero.');
    step('Razón positiva',r,`r=\\sqrt[${n-1}]{${an/a}}=${r}`,'Extrae la raíz del índice indicado. Se pide la rama positiva.');
  } else if(topic==='posicion') {
    if(variant===1){r=1.5;n=int(4,7);a=2**(n-1);}
    if(variant===3){r=1;stem=`Todos los términos de una sucesión tienen ${math(`a_1=${a},\\quad r=1`)}. ¿En qué posición aparece ${a}?`;choice('Posiciones posibles','En todas las posiciones',['En todas las posiciones','Solo en la primera','En ninguna posición','Solo en la segunda'],'a_n=a_1\\cdot1^{n-1}=a_1','La razón 1 deja el mismo valor en cada lugar.');}
    else {
      const an=variant===2?term(a,r,n)+a:term(a,r,n);stem=`¿En qué posición aparece ${fmt(an)} si ${math(`a_1=${a},\\quad r=${texnum(r)}`)}?`;
      step('Cociente entre el término y a₁',an/a,`r^{n-1}=\\frac{${texnum(an)}}{${a}}=${texnum(an/a)}`,'Primero divide para aislar la potencia.');
      if(variant===2) choice('Pertenencia','No pertenece',['No pertenece',`Posición ${n}`,`Posición ${n+1}`,`Posición ${n-1}`],`${r}^{${n-1}}<${an/a}<${r}^{${n}}`,'El cociente está entre dos potencias consecutivas. Una posición no entera no se redondea.');
      else {step('Cantidad de saltos',n-1,variant===1?`n-1=\\frac{\\log(${texnum(an/a)})}{\\log(${texnum(r)})}=${n-1}`:`${texnum(an/a)}=${texnum(r)}^{${n-1}}`,'Reconoce la potencia o calcula log(cociente) ÷ log(r). Puedes usar calculadora.');step('Posición n',n,`n=${n-1}+1=${n}`,'Suma uno a la cantidad de saltos.');}
    }
  } else if(topic==='dos' || topic==='combinar') {
    const p=int(2,4), q=p+(topic==='dos'&&variant===0?1:pick([2,3])), ap=term(a,r,p), aq=term(a,r,q);
    data={p,q,ap,aq}; stem=`Una sucesión con razón positiva tiene ${math(`a_${p}=${ap},\\quad a_${q}=${aq}`)}. `;
    stem+=topic==='dos'?'Encuentra la razón y el primer término.':variant===0?`Calcula la suma de sus primeros ${q} términos.`:`Encuentra el término de posición ${q+1}.`;
    step('Saltos entre los términos conocidos',q-p,`${q}-${p}=${q-p}`,'Resta las posiciones; no los valores.');
    step('Cociente de los términos',aq/ap,`r^{${q-p}}=\\frac{${aq}}{${ap}}=${aq/ap}`,'Divide el término posterior entre el anterior.');
    step('Razón positiva',r,`r=\\sqrt[${q-p}]{${aq/ap}}=${r}`,'Extrae la raíz usando el número de saltos.');
    step('Primer término',a,`a_1=\\frac{${ap}}{${r}^{${p-1}}}=${a}`,'Retrocede p−1 saltos desde aₚ.');
    if(topic==='combinar') step(variant===0?'Suma de los términos':`Término de posición ${q+1}`,variant===0?sum(a,r,q):term(a,r,q+1),variant===0?`S_${q}=\\frac{${a}(${r}^{${q}}-1)}{${r}-1}=${sum(a,r,q)}`:`a_${q+1}=${a}\\cdot${r}^{${q}}=${term(a,r,q+1)}`,'Usa los datos reconstruidos en la fórmula que corresponde a la pregunta.');
  } else if(topic==='sumas') {
    if(variant===1)r=1;
    if(variant===2){r=varied?pick([0.25,0.5,0.75]):0.5;a=int(2,5)*(varied?4:2)**(n-1);}
    const sn=sum(a,r,n);
    stem=variant===3?`Encuentra el primer término si ${math(`S_${n}=${sn},\\quad r=${r}`)}.`:`Suma los primeros ${n} términos si ${math(`a_1=${a},\\quad r=${texnum(r)}`)}.`;
    if(r===1)step('Suma',sn,`S_${n}=${n}\\cdot${a}=${sn}`,'Con r = 1 todos los términos son iguales. No dividas entre r−1.');
    else if(variant===3){step('Suma de factores 1 + r + … + rⁿ⁻¹',sn/a,`\\frac{${r}^{${n}}-1}{${r}-1}=${sn/a}`,'Calcula el factor que multiplica a a₁ en la fórmula de la suma.');step('Primer término',a,`a_1=\\frac{${sn}}{${sn/a}}=${a}`,'Divide la suma dada entre el factor obtenido.');}
    else {step('Potencia rⁿ',r**n,`${texnum(r)}^{${n}}=${texnum(r**n)}`,'En una suma el exponente es n, no n−1.');step('Numerador a₁(rⁿ−1)',a*(r**n-1),`${a}(${texnum(r**n)}-1)=${texnum(a*(r**n-1))}`,'Resta 1 de la potencia antes de multiplicar por a₁. El resultado puede ser negativo.');step('Suma',sn,`S_${n}=\\frac{${texnum(a*(r**n-1))}}{${texnum(r-1)}}=${texnum(sn)}`,'Divide entre r−1. Si r<1, numerador y denominador son negativos.');}
  } else if(topic==='aplicacion') {
    r=variant<2?(varied?pick([2,3,4,5]):2):(varied?pick([0.25,0.5,0.75]):0.5);n=int(3,6);a=int(3,9)*(variant<2?1:(varied?4:2)**(n-1)); const sn=sum(a,r,n),an=term(a,r,n),single=variant%2===0;
    stem=variant<2?`Un taller fabrica ${a} piezas el día 1 y multiplica la producción por ${r} cada día. ${single?`¿Cuántas fabrica solo el día ${n}?`:`¿Cuántas fabrica en total durante los primeros ${n} días?`}`:`Un experimento usa ${a} mL de una solución el día 1 y cada día usa el ${r*100}% de la cantidad del día anterior. ${single?`¿Cuántos mL usa solo el día ${n}?`:`¿Cuántos mL usa en total durante los primeros ${n} días?`}`;
    choice('¿Qué necesitas calcular?',single?'Un término':'Una suma',['Un término','Una suma'],single?`a_${n}`:`S_${n}`,'Distingue una cantidad de un solo día del acumulado de todos los días.');
    step(variant<2?'Cantidad de piezas':'Cantidad en mL',single?an:sn,single?`a_${n}=${a}\\cdot${texnum(r)}^{${n-1}}=${an}`:`S_${n}=\\frac{${a}(${texnum(r)}^{${n}}-1)}{${texnum(r)}-1}=${sn}`,'El día 1 es el primer término, no la posición cero.');
  } else if(topic==='medios') {
    const k=variant===0?1:int(2,4), end=term(a,r,k+2); data={k,end};
    stem=`Inserta ${k} ${k===1?'medio geométrico positivo':'medios geométricos positivos'} entre ${a} y ${end}.`;
    step('Número total de saltos',k+1,`${k}+1=${k+1}`,'Los extremos también cuentan: hay k+2 términos y k+1 saltos.');
    step('Razón positiva',r,`r=\\sqrt[${k+1}]{\\frac{${end}}{${a}}}=${r}`,'Divide los extremos y aplica la raíz cuyo índice es el número de saltos.');
    for(let i=1;i<=k;i++)step(`Medio ${i}`,term(a,r,i+1),`a_${i+1}=${term(a,r,i)}\\cdot${r}=${term(a,r,i+1)}`,'Multiplica el término anterior por la misma razón.');
    step('Comprueba el extremo final',end,`${term(a,r,k+1)}\\cdot${r}=${end}`,'Da un último salto: debe coincidir con el extremo dado.');
  }
  return {topic,variant,seed,stem,steps,data:{a,r,n,...data}};
}

export const generatePractice=(topic,variant,seed)=>generate(topic,variant,seed,true);
export function nextPractice(topic,variant,seed,previous){
  for(let i=0;i<100;i++){
    const candidate=generatePractice(topic,variant,(seed+i*2654435761)>>>0);
    if(!previous||(candidate.stem!==previous.stem&&candidate.data.r!==previous.data.r))return candidate;
  }
  // Some variants deliberately have a fixed reason (for example r = 1).
  for(let i=0;i<100;i++){const candidate=generatePractice(topic,variant,(seed+i*2654435761)>>>0);if(!previous||candidate.stem!==previous.stem)return candidate;}
  return generatePractice(topic,variant,seed);
}

const missionFamilies=['elementos','termino','inicio','raices','razon','posicion','dos','sumas','aplicacionTermino','aplicacionSuma','medios','combinar'];
export function mission(seed) {
  const random=rng(seed); const cards=[];
  for(const family of missionFamilies) for(let v=0;v<2;v++){
    const topic=family.startsWith('aplicacion')?'aplicacion':family;
    const variant=family==='aplicacionTermino'?v*2:family==='aplicacionSuma'?v*2+1:v;
    const c=generate(topic,variant,Math.floor(random()*4294967296));
    // A single final goal per mission card, including all requested means / two-term data.
    let answer=c.steps.at(-1).answer, options, prompt=c.stem, solution=c.steps.map(s=>s.equation);
    if(family==='dos'){
      answer=`a₁ = ${c.data.a}; r = ${c.data.r}`;
      options=[answer,`a₁ = ${c.data.ap}; r = ${c.data.r}`,`a₁ = ${c.data.a+1}; r = ${c.data.r}`,`a₁ = ${c.data.a}; r = ${c.data.r+1}`];
    }else if(family==='medios'){
      answer=Array.from({length:c.data.k},(_,i)=>fmt(term(c.data.a,c.data.r,i+2))).join('; ');
      options=[answer,Array.from({length:c.data.k},(_,i)=>fmt(term(c.data.a,c.data.r,i+1))).join('; '),Array.from({length:c.data.k},(_,i)=>fmt(term(c.data.a,c.data.r,i+3))).join('; '),Array.from({length:c.data.k},(_,i)=>fmt(term(c.data.a,c.data.r,i+2)+1)).join('; ')];
    }else if(family==='elementos' && v===0){prompt+=` ¿Cuál es el valor de ${math(`a_${c.data.n}`)}?`;}
    if(!options && c.steps.at(-1).choices) options=c.steps.at(-1).choices;
    if(!options){
      const val=Number(answer); answer=fmt(val);
      options=[answer,...[val+1,val-1,val*2,val/2,val+3].filter(x=>Number.isFinite(x)&&x!==val).map(fmt)];
    }
    options=[...new Set(options)].slice(0,4);
    // All string option families are constructed with four distinct answers.
    if(options.length!==4 || !options.includes(String(answer)))throw Error('Opciones inválidas: '+family+' '+JSON.stringify({answer,options}));
    options=shuffle(options,random);
    cards.push({...c,family,prompt,answer:String(answer),options,solution,id:`${family}-${v}`});
  }
  return shuffle(cards,random);
}


