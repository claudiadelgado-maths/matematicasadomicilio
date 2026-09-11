import { families } from './contenido.mjs';
const ns='http://www.w3.org/2000/svg';
const fmt=n=>Number(n.toFixed(3)).toLocaleString('es-MX');
export function mountGraph(host, kind, renderMath) {
  host.innerHTML='<h2>Explora la idea</h2><div class="graph-controls"></div><div class="graph-layout"><div class="plot"></div><div class="graph-readout" aria-live="polite"></div></div>';
  const controls=host.querySelector('.graph-controls'),plot=host.querySelector('.plot'),out=host.querySelector('.graph-readout');
  const values={};
  function slider(key,label,min,max,value,step=1){const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('input');input.type='range';Object.assign(input,{min,max,step,value});input.setAttribute('aria-label',label);values[key]=Number(value);wrap.append(input);controls.append(wrap);input.addEventListener('input',()=>{values[key]=Number(input.value);draw()});}
  function select(key,label,opts){const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('select');opts.forEach(([value,text])=>{const o=document.createElement('option');o.value=value;o.textContent=text;input.append(o)});values[key]=opts[0][0];wrap.append(input);controls.append(wrap);input.addEventListener('change',()=>{values[key]=input.value;draw()});}
  if(kind==='points'){select('point','Punto de partida', [['3,2','(3, 2)'],['-2,4','(−2, 4)'],['-3,-1','(−3, −1)'],['4,-2','(4, −2)']]);slider('x','Mover x',-5,5,3);slider('y','Mover y',-5,5,2);controls.querySelector('select').addEventListener('change',()=>{const [x,y]=values.point.split(',').map(Number);values.x=x;values.y=y;controls.querySelectorAll('input').forEach((input,i)=>input.value=i?y:x);draw()});}
  if(kind==='distance'){slider('x','Cambio horizontal',-4,4,3);slider('y','Cambio vertical',-4,4,4);}
  if(kind==='slope')select('case','Tipo de pendiente',[['positive','Positiva'],['negative','Negativa'],['zero','Cero'],['vertical','No definida']]);
  if(kind==='line'){slider('m','Pendiente m',-3,3,2);slider('b','Intersección b',-4,4,3);}
  if(kind==='function')slider('x','Entrada x',-3,5,2);
  if(kind==='families')select('family','Familia',families.map(f=>[f.id,f.name]));
  if(kind==='domain')select('family','Función',[['root','Raíz cuadrada'],['reciprocal','Recíproco']]);
  if(kind==='limit'){select('side','Acercarse por',[['-1','La izquierda'],['1','La derecha']]);slider('zoom','Cercanía a 2',0,3,1);}
  if(kind==='continuity')select('case','Qué sucede en x = 2',[['normal','Continua'],['hole','Hay un hueco'],['different','Valor distinto'],['jump','Hay un salto']]);
  if(kind==='derivative')slider('h','Separación h (distinta de cero)',.05,2,1,.05);
  if(kind==='vectors')select('op','Operación',[['sum','Sumar vectores'],['subtract','Restar vectores'],['scale','Multiplicar por −2']]);
  if(kind==='surface'){slider('x','Entrada x',-2,2,1);slider('y','Entrada y',-2,2,2);}
  if(kind==='partial'){select('axis','Derivar respecto de',[['x','x (y se mantiene fija)'],['y','y (x se mantiene fija)']]);slider('fixed','Valor de la variable fija',-2,2,2);}
  if(kind==='area')select('case','Acumulación',[['positive','2x entre 0 y 2'],['signed','x entre −1 y 1']]);
  if(kind==='double')slider('slice','Mirar una franja en x',0,1,.5,.1);
  let svg, bounds, X,Y;
  function el(tag,attrs,text){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;svg.append(n);return n;}
  function axes(b=[-5,5,-5,5],label='Plano cartesiano'){
    bounds=b;plot.replaceChildren();svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 520 390');svg.setAttribute('role','img');svg.setAttribute('aria-label',label);plot.append(svg);
    const [xmin,xmax,ymin,ymax]=b;X=x=>45+(x-xmin)/(xmax-xmin)*430;Y=y=>345-(y-ymin)/(ymax-ymin)*300;
    el('rect',{x:45,y:45,width:430,height:300,rx:5,fill:'#fff'});
    for(let x=Math.ceil(xmin);x<=xmax;x++){el('line',{x1:X(x),x2:X(x),y1:45,y2:345,stroke:'#dce8ec'});if(x%2===0)el('text',{x:X(x),y:367,'text-anchor':'middle',fill:'#405b67','font-size':14},x);}
    for(let y=Math.ceil(ymin);y<=ymax;y++){el('line',{x1:45,x2:475,y1:Y(y),y2:Y(y),stroke:'#dce8ec'});if(y%2===0)el('text',{x:35,y:Y(y)+5,'text-anchor':'end',fill:'#405b67','font-size':14},y);}
    if(ymin<=0&&ymax>=0)el('line',{x1:45,x2:475,y1:Y(0),y2:Y(0),stroke:'#546d78','stroke-width':2});
    if(xmin<=0&&xmax>=0)el('line',{x1:X(0),x2:X(0),y1:45,y2:345,stroke:'#546d78','stroke-width':2});
    el('text',{x:493,y:366,fill:'#213d4a','font-size':18},'x');el('text',{x:22,y:28,fill:'#213d4a','font-size':18},'y');
  }
  function line(x1,y1,x2,y2,color='#d88535',dash=false){el('line',{x1:X(x1),y1:Y(y1),x2:X(x2),y2:Y(y2),stroke:color,'stroke-width':3,...(dash?{'stroke-dasharray':'7 5'}:{})});}
  function arrow(x1,y1,x2,y2,color='#176c80'){
    line(x1,y1,x2,y2,color);
    const angle=Math.atan2(Y(y2)-Y(y1),X(x2)-X(x1)),tx=X(x2),ty=Y(y2);
    el('polygon',{points:`${tx},${ty} ${tx-12*Math.cos(angle)+5*Math.sin(angle)},${ty-12*Math.sin(angle)-5*Math.cos(angle)} ${tx-12*Math.cos(angle)-5*Math.sin(angle)},${ty-12*Math.sin(angle)+5*Math.cos(angle)}`,fill:color});
  }
  function dot(x,y,label='',color='#176c80',empty=false){el('circle',{cx:X(x),cy:Y(y),r:6,fill:empty?'white':color,stroke:color,'stroke-width':3});if(label)el('text',{x:Math.min(420,Math.max(65,X(x)+10)),y:Math.max(60,Y(y)-12),fill:color,'font-size':17,'font-weight':700},label);}
  function curve(fn,color='#176c80',a=bounds[0],b=bounds[1]){
    let d='',active=false,previous;
    for(let i=0;i<=500;i++){const x=a+(b-a)*i/500,y=fn(x);if(!Number.isFinite(y)||y<bounds[2]||y>bounds[3]||(previous!==undefined&&Math.abs(y-previous)>(bounds[3]-bounds[2])/3)){active=false;previous=y;continue;}d+=`${active?'L':'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)} `;active=true;previous=y;}
    el('path',{d,fill:'none',stroke:color,'stroke-width':3.5,'stroke-linecap':'round'});
  }
  function polygon(points,color){el('polygon',{points:points.map(([x,y])=>`${X(x)},${Y(y)}`).join(' '),fill:color,opacity:.25});}
  function report(title,text,tex){out.replaceChildren();const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=text;out.append(h,p);if(tex){const f=document.createElement('div');f.className='math';f.dataset.math=tex;f.textContent=tex;out.append(f);renderMath(out)}}
  function draw(){
    const v=values;
    if(kind==='points'){axes(undefined,'Punto con desplazamientos horizontal y vertical');line(0,0,v.x,0,'#d88535',true);line(v.x,0,v.x,v.y,'#9b65a4',true);dot(v.x,v.y);const quad=v.x===0||v.y===0?'Está sobre un eje.':`Cuadrante ${v.x>0?(v.y>0?'I':'IV'):(v.y>0?'II':'III')}.`;report(`P = (${v.x}, ${v.y})`,`${quad} Horizontal: ${v.x}. Vertical: ${v.y}.`);}
    if(kind==='distance'){axes(undefined,'Triángulo rectángulo entre el origen y un punto');polygon([[0,0],[v.x,0],[v.x,v.y]],'#d88535');line(0,0,v.x,0,'#d88535',true);line(v.x,0,v.x,v.y,'#9b65a4',true);line(0,0,v.x,v.y,'#176c80');dot(0,0,'P₁');dot(v.x,v.y,'P₂');report(`Distancia: ${fmt(Math.hypot(v.x,v.y))}`,`Catetos: |Δx| = ${Math.abs(v.x)}, |Δy| = ${Math.abs(v.y)}. El segmento azul es la distancia directa.`,String.raw`d=\sqrt{(${v.x})^2+(${v.y})^2}`);}
    if(kind==='slope'){axes();const slopes={positive:1,negative:-1,zero:0};if(v.case==='vertical'){line(2,-5,2,5,'#176c80');report('Pendiente no definida','En x = 2, hay distintos valores de y sin cambio horizontal. Δx = 0. No podemos dividir entre cero.');}else{const s=slopes[v.case];curve(x=>s*x);line(0,0,2,0,'#d88535',true);line(2,0,2,s*2,'#9b65a4',true);report(`m = ${s}`,`Al avanzar 2 en x, y cambia ${s*2}.`,String.raw`m=\frac{${s*2}}2=${s}`);}}
    if(kind==='line'){axes();curve(x=>v.m*x+v.b);dot(0,v.b,'b');report(`Pendiente ${v.m}; intersección ${v.b}`,'La marca señala el cruce con el eje y.',`y=${v.m}x${v.b<0?'':'+'}${v.b}`);}
    if(kind==='function'){axes([-4,6,-5,15]);curve(x=>2*x+3);dot(v.x,2*v.x+3);report(`${v.x} → ${2*v.x+3}`,`El punto en la gráfica es (${v.x}, ${2*v.x+3}).`,`f(${v.x})=2(${v.x})+3=${2*v.x+3}`);}
    if(kind==='families'||kind==='domain'){axes();const f=families.find(f=>f.id===v.family);curve(f.fn);report(f.name,`${f.domain} ${f.detail} La ventana muestra x e y de −5 a 5; la función puede continuar fuera de ella.`,f.tex);}
    if(kind==='limit'){axes([-1,5,0,7]);curve(x=>x+2);dot(2,4,'', '#176c80',true);const h=Number(v.side)*10**(-v.zoom),x=2+h;dot(x,x+2,'P','#d88535');report(`x = ${fmt(x)}; f(x) = ${fmt(x+2)}`,'El círculo vacío en (2, 4) permanece excluido. Cuanto más te acercas a x = 2, más te acercas a la salida 4.');}
    if(kind==='continuity'){axes([-1,5,0,7]);if(v.case==='jump'){curve(()=>1,'#176c80',-1,2);curve(()=>3,'#176c80',2,5);dot(2,1,'','#176c80',true);dot(2,3);report('Los laterales no coinciden','Izquierda: 1. Derecha: 3. El límite bilateral no existe. Aquí asignamos f(2) = 3.');}else{curve(x=>x+2);dot(2,4,'','#176c80',v.case!=='normal');if(v.case==='different')dot(2,1,'f(2)','#d88535');report('El límite es 4',v.case==='normal'?'Además f(2) = 4: es continua en 2.':v.case==='hole'?'f(2) no está definida. El hueco no impide el límite.':'f(2) = 1, pero los valores cercanos se aproximan a 4.');}}
    if(kind==='derivative'){axes([-2,4,-2,10]);curve(x=>x*x);curve(x=>2*x-1,'#9b65a4');curve(x=>(2+v.h)*(x-1)+1,'#d88535');dot(1,1);dot(1+v.h,(1+v.h)**2);report(`Pendiente secante: ${fmt(2+v.h)}`,'Curva azul: x². Secante naranja: une los dos puntos. Tangente violeta en x = 1: pendiente 2. Acercar h a 0 aproxima las pendientes.',String.raw`h=${fmt(v.h)},\quad m_{\mathrm{tangente}}=2`);}
    if(kind==='vectors'){axes();let target,txt;if(v.op==='sum'){arrow(0,0,2,1);arrow(2,1,1,4,'#9b65a4');target=[1,4];txt='Azul: a = (2, 1). Violeta: b = (−1, 3), trasladado al final de a. Naranja: suma (1, 4).';}else if(v.op==='subtract'){arrow(0,0,2,1);arrow(2,1,3,-2,'#9b65a4');target=[3,-2];txt='Restar b equivale a sumar −b = (1, −3). El resultado es (3, −2).';}else{arrow(0,0,2,1);target=[-4,-2];txt='El vector naranja es −2a: doble longitud y sentido opuesto.';}arrow(0,0,...target,'#d88535');report(`Vector (${target.join(', ')})`,`${txt} Cada segmento se recorre hacia su extremo final.`);}
    if(kind==='surface'){axes([-3,3,-3,3],'Mapa de valores de una función de dos variables');for(let x=-2;x<=2;x++)for(let y=-2;y<=2;y++){const z=x*x+3*x*y+y*y;el('rect',{x:X(x-.4),y:Y(y+.4),width:X(.8)-X(0),height:Y(0)-Y(.8),fill:z>=0?'#b8dce3':'#eac5a4',rx:5});el('text',{x:X(x),y:Y(y)+5,'text-anchor':'middle','font-size':16,fill:'#183744'},z);}dot(v.x,v.y,'','#176c80',true);report(`f(${v.x}, ${v.y}) = ${v.x*v.x+3*v.x*v.y+v.y*v.y}`,'Cada casilla muestra la salida z para la pareja (x, y). Es un mapa de valores, no una vista en perspectiva.');}
    if(kind==='partial'){axes([-3,3,-5,15]);curve(t=>t*t+3*t*v.fixed+v.fixed*v.fixed);report(`Se mueve ${v.axis}; la otra variable vale ${v.fixed}`,`Este corte de la superficie es una curva de una variable. Eje horizontal: ${v.axis}. Eje vertical: salida f. La derivada de este corte es 2${v.axis} + 3(${v.fixed}).`);svg.querySelectorAll('text').forEach(t=>{if(t.textContent==='x')t.textContent=v.axis;if(t.textContent==='y')t.textContent='f'});}
    if(kind==='area'){if(v.case==='positive'){axes([-1,3,-1,5]);polygon([[0,0],[2,0],[2,4]],'#176c80');curve(x=>2*x);report('Acumulación = 4','La región sombreada está sobre el eje x: aporta positivamente. Base 2, altura 4; área 4.');}else{axes([-2,2,-2,2]);polygon([[-1,0],[-1,-1],[0,0]],'#d88535');polygon([[0,0],[1,1],[1,0]],'#176c80');curve(x=>x);report('Integral = 0; área total = 1','Naranja: contribución −1/2. Azul: contribución +1/2. Se cancelan en la integral con signo.');}}
    if(kind==='double'){axes([-1,3,-1,3],'Región rectangular de integración');polygon([[0,0],[1,0],[1,2],[0,2]],'#176c80');line(v.slice,0,v.slice,2,'#d88535');report(`Franja en x = ${fmt(v.slice)}`,`Primero recorre y de 0 a 2 con x fijo. La integral interior da 2x + 2 = ${fmt(2*v.slice+2)}. Luego acumula estas contribuciones al variar x entre 0 y 1. El total es 3.`);}
  }
  draw();
}
