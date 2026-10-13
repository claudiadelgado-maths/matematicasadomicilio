import {$,math,quantity,unit,feedback,result,renderStatic,selected,formula} from './ui.mjs';
import {integer,shuffle,voltageRound,timeRound,parseDecimal,equal,decimal,scientific,unitLabel} from './motor.mjs';
renderStatic();const page=document.querySelector('[data-page]').dataset.page;
function targetText(text,tex){const span=document.createElement('span');math(span,tex);$('target').replaceChildren(document.createTextNode(text),span);}
function clear(){feedback();$('solution').hidden=true;$('solution').replaceChildren();}
function explain(tex){$('solution').replaceChildren(formula(tex));$('solution').hidden=false;}
function choices(container,items,callback){container.replaceChildren();items.forEach(item=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed','false');if(item.tex)math(b,item.tex);else b.textContent=item.label;b.addEventListener('click',()=>{selected(container,b);$('solution').hidden=true;callback(item);});container.append(b);});}
if(page==='voltaje'){
  let ex;const update=()=>{math($('reading'),quantity($('voltage').value,'V'));clear();};
  const fresh=()=>{ex=voltageRound();$('voltage').value=0;update();targetText('Ajusta el medidor a ',quantity(ex.amount,unitLabel(page,ex.from)));};
  $('voltage').addEventListener('input',update);$('check').addEventListener('click',()=>{const ok=Number($('voltage').value)===ex.target;result(ok,'Convierte el objetivo a volts y ajusta el medidor.');if(ok)explain(`${quantity(ex.amount,unitLabel(page,ex.from))}=${quantity(ex.target,'V')}`);});$('new').addEventListener('click',fresh);fresh();
}
if(page==='corriente'){
  let target,current=100,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(){const count=current/100*3;$('particles').replaceChildren();for(let i=0;i<count;i++){const dot=document.createElement('span');dot.className='particle';dot.style.animationDelay=`${-4*i/count}s`;if(matchMedia('(prefers-reduced-motion: reduce)').matches){if(paused)dot.style.left=`${i/count*98}%`;else dot.style.animation='charge-flow 4s linear infinite';}$('particles').append(dot);}math($('flow-reading'),`${quantity(current,'mA')}=${quantity(current/1000,'A')}`);$('wire').classList.toggle('paused',paused);$('pause').textContent=paused?'Reanudar animación':'Pausar animación';}
  const fresh=()=>{clear();target=shuffle([100,500,1000])[0];current=100;targetText('Configura el flujo equivalente a ',quantity(target/1000,'A'));choices($('flow-options'),[100,500,1000].map(value=>({value,tex:quantity(value,'mA')})),item=>{current=item.value;draw();});$('flow-options').firstElementChild.setAttribute('aria-pressed','true');draw();};
  $('pause').addEventListener('click',()=>{paused=!paused;draw();});$('check').addEventListener('click',()=>result(current===target,'Compara la corriente elegida con el objetivo; 1000 mA equivalen a 1 A.'));$('new').addEventListener('click',fresh);fresh();
}
if(page==='carga'){
  let chosen=null,options;const fresh=()=>{clear();chosen=null;const n=integer(2,90),type=integer(0,2);
    if(type===0){$('target').textContent='¿Cuál es la unidad de carga eléctrica?';options=[{tex:unit('C'),correct:true},{tex:unit('A'),correct:false},{tex:unit('V'),correct:false}];}
    else if(type===1){$('target').textContent='¿Cuál representa una cantidad de carga?';options=[{tex:quantity(n,'nC'),correct:true},{tex:quantity(n,'V'),correct:false},{tex:quantity(n,'Ω'),correct:false}];}
    else{math($('target'),`${quantity(n,'nC')}=\\,?`);options=[{tex:`${n}\\times10^{-9}\\,${unit('C')}`,correct:true},{tex:`${n}\\times10^{9}\\,${unit('C')}`,correct:false},{tex:`${n}\\times10^{-3}\\,${unit('C')}`,correct:false}];}
    choices($('charge-options'),shuffle(options),item=>chosen=item);};
  $('check').addEventListener('click',()=>result(chosen?.correct===true,chosen?'La carga se mide en coulombs (C); nano significa 10⁻⁹.':'Elige una respuesta.'));$('new').addEventListener('click',fresh);fresh();
}
if(page==='tiempo'){
  let ex;const fresh=()=>{clear();ex=timeRound();targetText('Convierte ',`${quantity(ex.amount,unitLabel(page,ex.from))}\\text{ a }${unit(unitLabel(page,ex.to))}`);$('time-answer').value='';$('time-unit').textContent=unitLabel(page,ex.to);};
  function check(){try{const ok=equal(parseDecimal($('time-answer').value),ex.answer);result(ok,'Recuerda: 1 min = 60 s; mili = 10⁻³ y micro = 10⁻⁶.');if(ok)explain(`${quantity(ex.amount,unitLabel(page,ex.from))}=${quantity(decimal(ex.answer).text,unitLabel(page,ex.to))}=${quantity(scientific(ex.answer).tex,unitLabel(page,ex.to))}`);}catch(error){feedback(error.message,false);}}
  $('time-form').addEventListener('submit',e=>{e.preventDefault();check();});$('time-answer').addEventListener('input',clear);$('check').addEventListener('click',check);$('new').addEventListener('click',fresh);fresh();
}
if(page==='resistencia'){
  let answer,choice=null;const fresh=()=>{clear();choice=null;const length=Math.random()<.5,small=integer(2,10),large=small+integer(3,15),values=shuffle([small,large]);answer=length?large:small;$('target').textContent='¿Qué cable tiene mayor resistencia?';$('conditions').textContent=length?'Mismo material, sección transversal y temperatura. Solo cambia la longitud.':'Mismo material, longitud y temperatura. Solo cambia la sección transversal.';$('cables').replaceChildren();
    values.forEach(value=>{const b=document.createElement('button');b.type='button';b.className='cable-option';b.setAttribute('aria-pressed','false');const drawing=document.createElement('span');drawing.className='cable-drawing';drawing.style.width=length?`${40+value/large*60}%`:'90%';drawing.style.height=length?'12px':`${6+Math.sqrt(value)*5}px`;const text=document.createElement('span');text.textContent=length?`${value} m de longitud`:`${value} mm² de sección`;b.append(drawing,text);b.addEventListener('click',()=>{choice=value;selected($('cables'),b);});$('cables').append(b);});};
  $('check').addEventListener('click',()=>{const ok=choice===answer;result(ok,choice===null?'Selecciona un cable.':'Más longitud aumenta la resistencia; más sección la reduce, con lo demás igual.');if(ok){$('solution').textContent='Con las demás condiciones iguales, la resistencia crece con la longitud y disminuye al aumentar la sección transversal.';$('solution').hidden=false;}});$('new').addEventListener('click',fresh);fresh();
}
if(page==='potencia'){
  let target;function update(){clear();const v=Number($('volts').value),i=Number($('amps').value);$('volts-output').textContent=v+' V';$('amps-output').textContent=i+' A';math($('power-output'),quantity(v*i,'W'));}
  const fresh=()=>{target=integer(2,20)*integer(1,5);$('volts').value=1;$('amps').value=1;update();targetText('Configura los controles para obtener ',quantity(target,'W'));};
  $('volts').addEventListener('input',update);$('amps').addEventListener('input',update);$('check').addEventListener('click',()=>{const v=Number($('volts').value),i=Number($('amps').value),ok=v*i===target;result(ok,'Multiplica el voltaje por la corriente. Puede haber más de una combinación correcta.');if(ok)explain(`${quantity(v,'V')}\\times${quantity(i,'A')}=${quantity(target,'W')}`);});$('new').addEventListener('click',fresh);fresh();
}
if(page==='frecuencia'){
  let current=1,target,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,frame,phase=0,last=0;
  function draw(){const points=[];for(let x=0;x<=600;x+=2)points.push(`${x===0?'M':'L'}${x+20},${100-55*Math.sin(2*Math.PI*(current*x/600-phase))}`);$('wave-path').setAttribute('d',points.join(' '));}
  function animate(now){if(!paused&&!document.hidden&&last)phase+=(now-last)/1000*current;last=now;draw();frame=requestAnimationFrame(animate);}
  const fresh=()=>{clear();target=shuffle([1,2,5,10])[0];current=1;targetText('Ajusta la señal a ',quantity(target,'Hz'));choices($('frequency-options'),[1,2,5,10].map(value=>({value,tex:quantity(value,'Hz')})),item=>{current=item.value;$('cycles').textContent=`${current} ciclos en un segundo. La amplitud se mantiene.`;draw();});$('frequency-options').firstElementChild.setAttribute('aria-pressed','true');$('cycles').textContent='1 ciclo en un segundo.';draw();};
  $('pause').textContent=paused?'Reanudar animación':'Pausar animación';$('pause').addEventListener('click',()=>{paused=!paused;$('pause').textContent=paused?'Reanudar animación':'Pausar animación';});$('check').addEventListener('click',()=>result(current===target,'Cuenta los ciclos en el mismo intervalo de un segundo.'));$('new').addEventListener('click',fresh);fresh();frame=requestAnimationFrame(animate);window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',event=>{if(event.persisted){last=0;frame=requestAnimationFrame(animate);}});
}
