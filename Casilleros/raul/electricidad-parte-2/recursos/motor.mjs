export const pick=a=>a[Math.floor(Math.random()*a.length)];
export const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export const materials=[['Plata',1.6e-8],['Cobre',1.72e-8],['Oro',2.4e-8],['Aluminio',2.8e-8],['Tungsteno',5.5e-8],['Hierro',9.5e-8],['Plomo',10e-8],['Nicromo',100e-8]];
export const units={C:['C',1,'C'],μC:['\\mu C',1e-6,'C'],nC:['nC',1e-9,'C'],N:['N',1,'N'],m:['m',1,'m'],mm:['mm',.001,'m'],cm:['cm',.01,'m'],A:['A',1,'A'],mA:['mA',.001,'A'],s:['s',1,'s'],min:['min',60,'s'],V:['V',1,'V'],Ω:['\\Omega',1,'Ω'],kΩ:['k\\Omega',1000,'Ω'],m2:['m^{2}',1,'m2'],mm2:['mm^{2}',1e-6,'m2'],ρ:['\\Omega\\cdot m',1,'ρ'],W:['W',1,'W'],J:['J',1,'J']};
export const ut=u=>units[u]?.[0]||u;
export function num(v){if(v===0)return '0';const a=Math.abs(v);if(a>=1e5||a<.001){const [c,e]=v.toExponential(4).split('e');return `${Number(c)}\\times10^{${Number(e)}}`;}return String(Number(v.toPrecision(6)));}
export const quantity=(v,u)=>`${num(v)}\\,${ut(u)}`;
export const parse=s=>{s=String(s).trim().replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)?Number(s):NaN;};
export const close=(a,b,tolerance=.005)=>Number.isFinite(a)&&Math.abs(a-b)<=Math.max(Math.abs(b)*tolerance,1e-14);
export const coulomb=(q1,q2,r)=>9e9*Math.abs(q1*q2)/(r*r);
export const wire=(rho,L,d)=>({area:Math.PI*(d/2)**2,R:rho*L/(Math.PI*(d/2)**2)});
export const relation=(q1,q2)=>q1*q2<0?'Atracción':'Repulsión';
const datum=(symbol,value,u)=>({symbol,value,unit:u,si:value*units[u][1],siUnit:units[u][2]});
const as=(symbol,si,u)=>datum(symbol,si/units[u][1],u);
export function numeric(topic){
 let data,target,answer,unit,formula,rearranged,substitution,interpretation,prep=[],extra={};
 if(topic==='coulomb'){
  const q1=pick([-1,1])*pick([2,4,6,8]),q2=pick([-1,1])*pick([1,3,5,9]),u=pick(['μC','nC']),distance=pick([20,40,60,100]);data=[datum('q_1',q1,u),datum('q_2',q2,u),datum('r',distance,'mm')];
  if(Math.random()<.5)data[2]=as('r',data[2].si,'cm');const [a,b,r]=data.map(x=>x.si);answer=coulomb(a,b,r);target='F';unit='N';formula='F=k_e\\frac{|q_1q_2|}{r^{2}}';rearranged=formula;substitution=`F=9\\times10^{9}\\frac{|(${num(a)})(${num(b)})|}{(${num(r)})^{2}}`;extra.interaction=relation(a,b);interpretation=`Las fuerzas sobre las dos cargas tienen igual magnitud y sentidos opuestos. ${extra.interaction}: ${a*b<0?'los signos son diferentes':'los signos son iguales'}. Modelo de cargas puntuales en vacío; aire aproximado.`;
 }else if(topic==='corriente'){
  const I=pick([.05,.15,.2,.5,1,2,3]),t=pick([10,30,60,120,1800]),q=I*t;target=pick(['I','q','t']);formula='I=\\frac{q}{t}';
  if(target==='I'){data=[datum('q',q,'C'),as('t',t,t>=60?'min':'s')];answer=I;unit='A';rearranged=formula;substitution=`I=\\frac{${num(q)}}{${num(t)}}`;}
  if(target==='q'){data=[as('I',I,I<1?'mA':'A'),as('t',t,t>=60?'min':'s')];answer=q;unit='C';rearranged='q=It';substitution=`q=(${num(I)})(${num(t)})`;}
  if(target==='t'){data=[as('I',I,I<1?'mA':'A'),datum('q',q,'C')];answer=t;unit='s';rearranged='t=\\frac{q}{I}';substitution=`t=\\frac{${num(q)}}{${num(I)}}`;}
  interpretation=`En el intervalo, ${num(q)} C atraviesan una sección en ${num(t)} s. La corriente promedio es ${num(I)} A. No es la velocidad de un electrón.`;
 }else if(topic==='voltaje'){
  const V=pick([3,6,9,12,24]),q=pick([1,2,3,4]),U=V*q;target=pick(['V','E']);formula='V=\\frac{E}{q}';
  if(target==='V'){data=[datum('E',U,'J'),datum('q',q,'C')];answer=V;unit='V';rearranged=formula;substitution=`V=\\frac{${U}}{${q}}`;}
  else{data=[datum('V',V,'V'),datum('q',q,'C')];answer=U;unit='J';rearranged='E=qV';substitution=`E=(${q})(${V})`;}
  interpretation=`Aquí E es la magnitud del cambio de energía eléctrica para una carga positiva. ${V} V corresponden a ${V} J por cada coulomb entre los dos puntos.`;
 }else if(topic==='resistencia'){
  const [material,rho]=pick(materials.filter(([n])=>['Cobre','Aluminio','Hierro','Nicromo'].includes(n))),L=pick([5,10,20,50]),diam=pick([.5,1,2,4]),useDiameter=Math.random()<.65;let area;
  data=[datum('\\rho',rho,'ρ'),datum('L',L,'m')];
  if(useDiameter){data.push(datum('d',diam,'mm'));area=wire(rho,L,diam*.001).area;prep=[`r=\\frac{d}{2}=\\frac{${num(diam*.001)}}{2}=${quantity(diam*.0005,'m')}`,`A=\\pi r^{2}=\\pi(${num(diam*.0005)})^{2}\\approx${quantity(area,'m2')}`];}
  else{const mm=pick([.5,1,2.5,4]);data.push(datum('A',mm,'mm2'));area=mm*1e-6;}
  answer=rho*L/area;target='R';unit='Ω';formula='R=\\rho\\frac{L}{A}';rearranged=formula;substitution=`R=\\frac{(${num(rho)})(${L})}{${num(area)}}`;extra={material,area};interpretation=`Es la resistencia de un conductor uniforme de ${material.toLowerCase()} a aproximadamente 20 °C. La resistividad pertenece al material; la resistencia también depende de la longitud y de la sección.`;
 }else{
  const V=pick([3,6,12,24,48]),R=pick([6,12,24,100,200,1000]),I=V/R;
  if(topic==='ohm'){
   target=pick(['V','I','R']);formula='V=IR';
   if(target==='V'){data=[as('I',I,I<1?'mA':'A'),as('R',R,R>=1000?'kΩ':'Ω')];answer=V;unit='V';rearranged=formula;substitution=`V=(${num(I)})(${R})`;}
   if(target==='I'){data=[datum('V',V,'V'),as('R',R,R>=1000?'kΩ':'Ω')];answer=I;unit='A';rearranged='I=\\frac{V}{R}';substitution=`I=\\frac{${V}}{${R}}`;}
   if(target==='R'){data=[datum('V',V,'V'),as('I',I,I<1?'mA':'A')];answer=R;unit='Ω';rearranged='R=\\frac{V}{I}';substitution=`R=\\frac{${V}}{${num(I)}}`;}
   interpretation=`El resistor óhmico se considera a condiciones constantes. Con ${V} V y ${R} Ω, la corriente es ${num(I)} A. Las tres formas son despejes de una sola relación.`;
  }else{
   target='P';unit='W';formula='P=VI';const type=topic==='joule'?'IR':pick(['VI','IR','VR']);let current=I,resistance=R,voltage=V;
   if(topic==='joule'){current=pick([.2,.5,1,2,3]);resistance=pick([1,2,5,10]);voltage=current*resistance;}
   if(type==='VI'){data=[datum('V',voltage,'V'),as('I',current,current<1?'mA':'A')];rearranged=formula;substitution=`P=(${num(voltage)})(${num(current)})`;}
   if(type==='IR'){data=[as('I',current,current<1?'mA':'A'),datum('R',resistance,'Ω')];rearranged='P=I^{2}R';prep=['P=VI=(IR)I=I^{2}R'];substitution=`P=(${num(current)})^{2}(${resistance})`;}
   if(type==='VR'){data=[datum('V',voltage,'V'),as('R',resistance,resistance>=1000?'kΩ':'Ω')];rearranged='P=\\frac{V^{2}}{R}';prep=['P=VI=V\\frac{V}{R}=\\frac{V^{2}}{R}'];substitution=`P=\\frac{${voltage}^{2}}{${resistance}}`;}
   answer=voltage*current;interpretation=`La potencia es ${num(answer)} J transformados por segundo. En este resistor, la energía eléctrica suministrada por la fuente se convierte en energía interna del material; esto no determina por sí solo su temperatura.`;
  }
 }
 const distractors={coulomb:['F=k_e\\frac{|q_1q_2|}{r}','F=k_e|q_1q_2|r^{2}'],corriente:['I=qt','q=\\frac{I}{t}','t=qI'],voltaje:['V=Eq','E=\\frac{V}{q}'],resistencia:['R=\\rho LA','R=\\rho\\frac{A}{L}'],ohm:['I=VR','R=VI','V=\\frac{I}{R}'],potencia:['P=\\frac{I}{V}','P=IR'],joule:['P=IR','P=\\frac{R}{I^{2}}']}[topic];
 return {topic,data,target,answer,unit,formula,rearranged,substitution,prep,interpretation,...extra,options:shuffle([rearranged,...distractors.filter(t=>t!==rearranged).slice(0,2)])};
}
