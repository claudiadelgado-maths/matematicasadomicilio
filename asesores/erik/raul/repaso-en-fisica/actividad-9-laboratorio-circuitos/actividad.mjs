import {circuito,tex} from '../recursos/practica-modelo.mjs';
const $=id=>document.getElementById(id),api=window.repasoFisica,KEY='repaso-fisica-laboratorio-v1';
const fmt=n=>Number(n.toFixed(3));
const svg=(tag,attrs={},text)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;return e;};
function render(){
 const mode=$('circuit').value,v=+$('voltage').value,a=+$('part-a').value,b=+$('part-b').value,cap=mode.startsWith('cap-'),parallel=mode.endsWith('paralelo'),single=mode==='ohm',r=circuito(mode,v,a,b);
 api.write(KEY,{mode,v,a,b});$('second-part').hidden=single;$('a-label').textContent=cap?'Capacitor 1':'Resistencia 1';$('b-label').textContent=cap?'Capacitor 2':'Resistencia 2';
 $('v-value').textContent=tex(v+'\\,\\mathrm V');$('a-value').textContent=tex(a+(cap?'\\,\\mu F':'\\,\\Omega'));$('b-value').textContent=tex(b+(cap?'\\,\\mu F':'\\,\\Omega'));
 $('voltage').setAttribute('aria-valuetext',v+' volts');$('part-a').setAttribute('aria-valuetext',a+(cap?' microfarads':' ohms'));$('part-b').setAttribute('aria-valuetext',b+(cap?' microfarads':' ohms'));
 const diagram=svg('svg',{viewBox:'0 0 560 260',role:'img','aria-label':`${cap?'Capacitores':'Resistencias'} en ${single?'un circuito simple':parallel?'paralelo':'serie'}, con una fuente de ${v} volts.`});
 const line=(x1,y1,x2,y2)=>diagram.append(svg('line',{x1,y1,x2,y2,stroke:'#28609a','stroke-width':3}));
 const path=(d)=>diagram.append(svg('path',{d,fill:'none',stroke:'#28609a','stroke-width':3,class:cap?'':'flow'}));
 const part=(x,y,label)=>{if(cap){line(x-30,y,x-7,y);line(x-7,y-18,x-7,y+18);line(x+7,y-18,x+7,y+18);line(x+7,y,x+30,y);}else diagram.append(svg('rect',{x:x-30,y:y-12,width:60,height:24,rx:3,fill:'#e7f0fc',stroke:'#28609a','stroke-width':3}));diagram.append(svg('text',{x,y:y-26,'text-anchor':'middle',fill:'#243344','font-size':18},label));};
 path('M70 115 V60 H160 M430 60 H490 V215 H70 V145');line(50,115,90,115);line(58,145,82,145);diagram.append(svg('text',{x:35,y:105,'font-size':20},'+'));
 if(parallel){path('M160 60 V155 H245 M305 155 H430 V60 M160 60 H245 M305 60 H430');part(275,60,cap?'C₁':'R₁');part(275,155,cap?'C₂':'R₂');}
 else if(single){path('M160 60 H245 M305 60 H430');part(275,60,'R');}
 else{path('M160 60 H185 M245 60 H345 M405 60 H430');part(215,60,cap?'C₁':'R₁');part(375,60,cap?'C₂':'R₂');}
 $('diagram').replaceChildren(diagram);const readings=$('readings');window.MathJax?.typesetClear?.([readings]);readings.replaceChildren();
 const add=t=>{const p=document.createElement('p');p.textContent=tex(t);readings.append(p);};
 if(cap){add(`C_T=${fmt(r.total)}\\,\\mu F`);add(`Q_T=${fmt(r.charge)}\\,\\mu C`);if(parallel){add(`Q_1=${fmt(r.q1)}\\,\\mu C`);add(`Q_2=${fmt(r.q2)}\\,\\mu C`);}else{add(`V_1=${fmt(r.v1)}\\,\\mathrm V`);add(`V_2=${fmt(r.v2)}\\,\\mathrm V`);}}
 else{add(`R_T=${fmt(r.total)}\\,\\Omega`);add(`I_T=${fmt(r.current)}\\,\\mathrm A`);add(`P_T=${fmt(r.power)}\\,\\mathrm W`);if(parallel){add(`I_1=${fmt(r.i1)}\\,\\mathrm A`);add(`I_2=${fmt(r.i2)}\\,\\mathrm A`);}else if(!single){add(`V_1=${fmt(r.v1)}\\,\\mathrm V`);add(`V_2=${fmt(r.v2)}\\,\\mathrm V`);}}
 $('law').textContent=cap?(parallel?tex('C_T=C_1+C_2,\\quad Q_T=Q_1+Q_2'):tex('\\frac1{C_T}=\\frac1{C_1}+\\frac1{C_2},\\quad V=V_1+V_2')):single?tex('I=V/R,\\quad P=VI'):parallel?tex('I_T=I_1+I_2,\\quad V_1=V_2=V'):tex('V=V_1+V_2,\\quad I_1=I_2=I_T');
 $('observation').textContent=cap?'Capacitores ideales ya cargados: se muestra la carga almacenada; no circula corriente continua en régimen permanente.':single?'Con resistencia fija, más voltaje produce más corriente.':'La fuente y los cables son ideales. Las lecturas permiten comprobar las leyes de Kirchhoff.';
 $('challenge').textContent=cap?'Si duplicas el voltaje y conservas los capacitores, ¿qué ocurre con la carga total almacenada?':'Si duplicas el voltaje y conservas las resistencias, ¿qué ocurre con la corriente total?';$('prediction-feedback').textContent='';
 window.typesetMath?.($('v-value'),$('a-value'),$('b-value'),readings,$('law'));
}
for(const id of ['voltage','part-a','part-b'])$(id).addEventListener('input',render);$('circuit').addEventListener('change',render);
$('reset').addEventListener('click',()=>{$('voltage').value=12;$('part-a').value=4;$('part-b').value=6;render();});
for(const button of document.querySelectorAll('[data-predict]'))button.addEventListener('click',()=>{$('prediction-feedback').textContent=button.dataset.predict==='double'?'Correcto: se duplica. Prueba dos valores de voltaje para comprobarlo.':'Vuelve a intentarlo: cambia solo el voltaje y compara las lecturas.';});
const saved=api.read(KEY,null);if(saved&&['ohm','serie','paralelo','cap-serie','cap-paralelo'].includes(saved.mode)&&[saved.v,saved.a,saved.b].every(Number.isFinite)){$('circuit').value=saved.mode;$('voltage').value=saved.v;$('part-a').value=saved.a;$('part-b').value=saved.b;}render();
