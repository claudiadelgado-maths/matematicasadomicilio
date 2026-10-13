(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const money = value => new Intl.NumberFormat('es-MX', {style:'currency',currency:'MXN',maximumFractionDigits:2}).format(value);
  const num = value => new Intl.NumberFormat('es-MX',{maximumFractionDigits:4}).format(value);
  const svgNS = 'http://www.w3.org/2000/svg';
  const makeSvg = (tag, attrs, content) => {const el=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));if(content!==undefined)el.textContent=content;return el;};
  const form=$('simulador');
  function render(){
    const c=Number($('capital').value), t=Number($('tasa').value), n=Number($('periodos').value), i=t/100;
    $('periodos-valor').textContent=n;
    const valid=Number.isFinite(c)&&c>0&&c<=1e9&&Number.isFinite(t)&&t>=0&&t<=100&&Number.isInteger(n)&&n>=1&&n<=30;
    $('lab-error').hidden=valid;
    if(!valid){$('lab-error').textContent='Ingresa un capital mayor que 0 y hasta 1,000,000,000, y una tasa entre 0 % y 100 %.';return;}
    const simple=Array.from({length:n+1},(_,k)=>c*(1+k*i));
    const compuesto=Array.from({length:n+1},(_,k)=>c*Math.pow(1+i,k));
    const ms=simple[n],mc=compuesto[n];
    $('monto-simple').textContent=money(ms);$('monto-compuesto').textContent=money(mc);
    $('ganancia-simple').textContent='Ganancia: '+money(ms-c);
    $('ganancia-compuesto').textContent='Ganancia: '+money(mc-c);
    $('diferencia').textContent=money(Math.max(0,mc-ms));
    $('explicacion-dinamica').textContent=`Con ${money(c)} al ${num(t)} % por periodo durante ${n} ${n===1?'periodo':'periodos'}, el interés simple añade ${money(c*i)} en cada periodo: ${num(c)} × (1 + ${n} × ${num(i)}) = ${money(ms)}. En el compuesto, el saldo se multiplica por ${num(1+i)} cada periodo: ${num(c)} × (${num(1+i)})^${n} = ${money(mc)}.`;
    const tbody=$('tabla-dinamica');tbody.replaceChildren();
    for(let k=0;k<=n;k++){const tr=document.createElement('tr');[k===0?'Inicio':String(k),money(simple[k]),money(compuesto[k]),k===0?'—':money(compuesto[k]-compuesto[k-1])].forEach((v,j)=>{const cell=document.createElement(j===0?'th':'td');if(j===0)cell.scope='row';cell.textContent=v;tr.appendChild(cell);});tbody.appendChild(tr);}
    const svg=$('grafica-interes');svg.replaceChildren();
    const L=90,R=25,T=24,B=45,W=700,H=310,plotW=W-L-R,plotH=H-T-B,max=Math.max(...compuesto,...simple)*1.08||1;
    const x=k=>L+k/n*plotW,y=v=>T+plotH-v/max*plotH;
    for(let j=0;j<=4;j++){const val=max*j/4,yy=y(val);svg.appendChild(makeSvg('line',{x1:L,y1:yy,x2:W-R,y2:yy,stroke:'#d9e3dd','stroke-width':1}));svg.appendChild(makeSvg('text',{x:L-9,y:yy+4,'text-anchor':'end','font-size':12,fill:'#465b53'},val>=1000000?(num(val/1000000)+' M'):val>=1000?(num(val/1000)+' mil'):num(val)));}
    const ticks=Math.min(n,6);for(let j=0;j<=ticks;j++){const k=Math.round(j*n/ticks);svg.appendChild(makeSvg('text',{x:x(k),y:H-15,'text-anchor':'middle','font-size':12,fill:'#465b53'},String(k)));}
    [[simple,'#268775'],[compuesto,'#cc8734']].forEach(([arr,color])=>{const points=arr.map((v,k)=>`${x(k)},${y(v)}`).join(' ');svg.appendChild(makeSvg('polyline',{points,fill:'none',stroke:color,'stroke-width':4,'stroke-linejoin':'round','stroke-linecap':'round'}));svg.appendChild(makeSvg('circle',{cx:x(n),cy:y(arr[n]),r:5,fill:color}));});
    svg.setAttribute('aria-label',`Gráfica de ${n} periodos: interés simple termina en ${money(ms)} e interés compuesto en ${money(mc)}.`);
  }
  form.addEventListener('input',render);form.addEventListener('reset',()=>setTimeout(render,0));
  document.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>{const presets={inicio:[1000,10,3],largo:[1000,8,20],suave:[5000,3,10]};const [c,t,n]=presets[btn.dataset.preset];$('capital').value=c;$('tasa').value=t;$('periodos').value=n;render();}));
  let problem,attempts=0,correct=0,solved=false;
  function newProblem(){const capitals=[200,400,500,800,1000,1500],rates=[5,10,15,20],periods=[2,3,4,5];const c=capitals[Math.floor(Math.random()*capitals.length)],r=rates[Math.floor(Math.random()*rates.length)],n=periods[Math.floor(Math.random()*periods.length)],type=Math.random()<.5?'simple':'compuesto';problem={c,r,n,type,answer:type==='simple'?c*(1+n*r/100):c*Math.pow(1+r/100,n)};solved=false;$('reto-pregunta').textContent=`Si inviertes ${money(c)} al ${r} % por periodo durante ${n} periodos con interés ${type}, ¿cuál será el monto final?`;$('reto-respuesta').value='';$('reto-feedback').textContent='';$('reto-ayuda').hidden=true;$('reto-ayuda').textContent='';}
  $('reto-nuevo').addEventListener('click',newProblem);
  $('reto-pista').addEventListener('click',()=>{$('reto-ayuda').hidden=false;$('reto-ayuda').textContent=problem.type==='simple'?`Usa M = C × (1 + n × i). Convierte ${problem.r} % en ${num(problem.r/100)} y sustituye los datos.`:`Usa M = C × (1 + i)^n. Convierte ${problem.r} % en ${num(problem.r/100)}. Primero calcula la potencia.`;});
  $('reto-comprobar').addEventListener('click',()=>{const raw=$('reto-respuesta').value;if(raw.trim()===''||!Number.isFinite(Number(raw))||Number(raw)<0){$('reto-feedback').textContent='Introduce primero una cantidad válida.';return;}if(solved){$('reto-feedback').textContent='Este reto ya está resuelto. Genera otro para seguir.';return;}attempts++;const value=Number(raw),ok=Math.abs(value-problem.answer)<=0.011;if(ok){correct++;solved=true;$('reto-feedback').textContent=`¡Correcto! El monto es ${money(problem.answer)}.`;}else{$('reto-feedback').textContent=`Todavía no. Revisa el cálculo y prueba otra vez. Recuerda que ${problem.r} % = ${num(problem.r/100)}.`;}$('reto-marcador').textContent=`Aciertos: ${correct} de ${attempts} intentos`;});
  render();newProblem();
})();
