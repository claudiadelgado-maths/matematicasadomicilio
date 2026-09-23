export const topics=[['ohm','Ley de Ohm'],['potencia','Potencia'],['coulomb','Coulomb'],['carga','Corriente y carga'],['resistencias','Resistencias'],['capacitores','Capacitores'],['notacion','Notación científica']];
export const tex=s=>`\\(${s}\\)`;
export function numero(s){const t=String(s??'').trim().replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(t)?Number(t):NaN;}
export function evaluar(item,values){
 if(item.type==='choice')return {valid:values.choice!==undefined,ok:values.choice===item.correct};
 const n=numero(values.answer),d=numero(values.exponent);
 if(!Number.isFinite(n))return {valid:false,ok:false};
 if(item.type==='scientific')return {valid:Number.isInteger(d),ok:Number.isInteger(d)&&Math.abs(n-item.coefficient)<=(item.tolerance??1e-6)&&d===item.exponent&&Math.abs(n)>=1&&Math.abs(n)<10};
 if(item.type==='coulomb'&&!values.interaction)return {valid:false,ok:false};
 const ok=Math.abs(n-item.answer)<=(item.tolerance??Math.max(.005,Math.abs(item.answer)*.001))+1e-10;
 return {valid:true,ok:ok&&(item.type!=='coulomb'||values.interaction===item.interaction)};
}
export function circuito(mode,v,a,b){
 if(![v,a,b].every(x=>Number.isFinite(x)&&x>0))throw new RangeError('Valores positivos requeridos');
 if(mode==='ohm')return {total:a,current:v/a,power:v*v/a};
 if(mode==='serie'){const total=a+b,i=v/total;return {total,current:i,v1:i*a,v2:i*b,power:v*i};}
 if(mode==='paralelo'){const total=a*b/(a+b);return {total,current:v/total,i1:v/a,i2:v/b,power:v*v/total};}
 if(mode==='cap-serie'){const total=a*b/(a+b),q=total*v;return {total,charge:q,v1:q/a,v2:q/b};}
 if(mode==='cap-paralelo')return {total:a+b,charge:(a+b)*v,q1:a*v,q2:b*v};
 throw new RangeError('Circuito desconocido');
}
export function generar(topic,random=Math.random){
 const n=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1)),a=n(2,12),b=n(2,10),v=n(2,8),m=tex;
 let x={type:'numeric',topic,tolerance:.01};
 if(topic==='ohm'){const mode=n(0,2);x=mode===0?{...x,prompt:`Una resistencia de ${m(a+'\\,\\Omega')} conduce ${m(b+'\\,\\mathrm A')}. Calcula el voltaje.`,answer:a*b,unit:'V',solution:m(`V=IR=${a*b}\\,\\mathrm V`)}:mode===1?{...x,prompt:`Una resistencia de ${m(a+'\\,\\Omega')} tiene ${m(a*b+'\\,\\mathrm V')}. Calcula la corriente.`,answer:b,unit:'A',solution:m(`I=V/R=${b}\\,\\mathrm A`)}:{...x,prompt:`Un circuito tiene ${m(a*b+'\\,\\mathrm V')} y conduce ${m(b+'\\,\\mathrm A')}. Calcula su resistencia.`,answer:a,unit:'\\Omega',solution:m(`R=V/I=${a}\\,\\Omega`)};}
 else if(topic==='potencia')x={...x,prompt:`Por una resistencia de ${m(a+'\\,\\Omega')} circulan ${m(b+'\\,\\mathrm A')}. Calcula la potencia.`,answer:b*b*a,unit:'W',solution:m(`P=I^2R=${b*b*a}\\,\\mathrm W`)};
 else if(topic==='coulomb'){const r=v/10;const answer=9e9*a*b*1e-12/(r*r);x={...x,type:'coulomb',prompt:`Dos cargas de ${m(a+'\\,\\mu C')} y ${m('-'+b+'\\,\\mu C')} están separadas ${m(v*10+'\\,\\mathrm{cm}')}. Calcula la magnitud de la fuerza y la interacción. Usa ${m('k=9\\times10^9\\,\\mathrm{N\\,m^2/C^2}')}.`,answer,interaction:'atraccion',unit:'N',tolerance:Math.max(.000005,answer*.005),solution:m(`F=k\\frac{|q_1q_2|}{r^2}=${Number(answer.toPrecision(6))}\\,\\mathrm N`)+'. Atracción.'};}
 else if(topic==='carga')x={...x,prompt:`Circulan ${m(a*10+'\\,\\mathrm{mA}')} durante ${m(b+'\\,\\mathrm{min}')}. Calcula la carga transportada.`,answer:a*.01*b*60,unit:'C',solution:m(`Q=It=${Number((a*.01*b*60).toFixed(4))}\\,\\mathrm C`)};
 else if(topic==='resistencias'||topic==='capacitores'){const series=n(0,1)===0,cap=topic==='capacitores';const sum=cap?!series:series;const answer=sum?a+b:a*b/(a+b);x={...x,prompt:`${cap?'Dos capacitores':'Dos resistencias'} de ${m(a+(cap?'\\,\\mu F':'\\,\\Omega'))} y ${m(b+(cap?'\\,\\mu F':'\\,\\Omega'))} están en ${series?'serie':'paralelo'}. Calcula ${cap?'la capacitancia':'la resistencia'} equivalente.`,answer,unit:cap?'\\mu F':'\\Omega',solution:m(`${cap?'C':'R'}_T=${sum?`${a}+${b}`:`\\frac{${a}\\cdot${b}}{${a}+${b}}`}\\approx${Number(answer.toPrecision(6))}\\,${cap?'\\mu F':'\\Omega'}`)};}
 else if(topic==='notacion'){const e=n(-5,5),f=n(-5,5),product=a*b,power=Math.floor(Math.log10(product));x={...x,type:'scientific',prompt:`Simplifica ${m(`(${a}\\times10^{${e}})(${b}\\times10^{${f}})`)}.`,coefficient:product/10**power,exponent:e+f+power,tolerance:1e-6,solution:m(`${product/10**power}\\times10^{${e+f+power}}`)};}
 else throw new RangeError('Tema desconocido');
 return x;
}

export function crearRonda(topic='mixto',random=Math.random){
 let seed=(random()*4294967296)>>>0;
 const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const pool=topics.map(x=>x[0]);
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 const chosen=topic==='mixto'?pool.slice(0,6):Array(6).fill(topic),items=[],seen=new Set();
 for(const name of chosen){let q;for(let attempt=0;attempt<500;attempt++){q=generar(name,rng);if(!seen.has(q.prompt))break;}
  if(seen.has(q.prompt))throw new Error('No se pudo generar una ronda distinta');
  seen.add(q.prompt);items.push(q);
 }
 return items;
}
