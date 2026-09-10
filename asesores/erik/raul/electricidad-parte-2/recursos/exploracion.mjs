import {defaults,experiments,measurement} from './comparaciones.mjs';
import {quantity,shuffle} from './motor.mjs';
import {formula,render} from './ui.mjs';

export function exploration(root,topic,setValues){
 const host=document.createElement('div');host.className='lab-experiments';root.prepend(host);
 host.innerHTML='<h3>¿Qué pasaría si…?</h3><p>Elige una comparación, haz tu predicción y observa el cambio. Cada caso parte de los valores iniciales del laboratorio.</p><div class="experiment-picker" aria-label="Comparaciones disponibles"></div><div class="experiment-question"></div>';
 const picker=host.querySelector('.experiment-picker'),question=host.querySelector('.experiment-question');
 experiments[topic].forEach(ex=>{
  const b=document.createElement('button');b.type='button';b.textContent=ex.title;b.setAttribute('aria-pressed','false');picker.append(b);
  b.onclick=()=>{
   picker.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));
   setValues(defaults[topic]);
   question.innerHTML=`<h4>${ex.question}</h4><div class="prediction-answers answers"></div><div class="prediction-result" role="status"></div>`;
   const choices=shuffle([ex.answer,...shuffle(['Se duplica.','Se cuadruplica.','Se reduce a la mitad.','Se reduce a la cuarta parte.','Permanece igual.','Se vuelve cero.'].filter(x=>x!==ex.answer)).slice(0,2)]);
   choices.forEach(answer=>{
    const option=document.createElement('button');option.type='button';option.textContent=answer;question.querySelector('.answers').append(option);
    option.onclick=()=>{
     question.querySelectorAll('.prediction-answers button').forEach(el=>{el.disabled=true;if(el.textContent===ex.answer)el.classList.add('correct');});
     const ok=answer===ex.answer;option.classList.add(ok?'correct':'incorrect');
     const before=measurement(topic,defaults[topic]),afterState={...defaults[topic],...ex.change},after=measurement(topic,afterState),max=Math.max(before.value,after.value);
     setValues(afterState);
     question.querySelector('.prediction-result').innerHTML=`<p class="${ok?'good':'retry'}">${ok?'✓ Tu predicción coincide.':'Observa qué ocurrió.'} <strong>${ex.answer}</strong></p><div class="comparison-bars" aria-label="Comparación de ${before.label.toLowerCase()}">${[[before,'Antes'],[after,'Después']].map(([m,label])=>`<div><span>${label} · ${m.label}</span>${formula(quantity(m.value,m.unit))}<div class="bar-track" aria-hidden="true"><i style="width:${100*m.value/max}%"></i></div></div>`).join('')}</div><p>${ex.explanation}</p><div class="comparison-switch"><button type="button" data-state="before" aria-pressed="false">Ver antes</button><button type="button" data-state="after" aria-pressed="true">Ver después</button></div><p class="comparison-note">El dibujo muestra el caso «Después». Las barras comparan los dos casos fijos.</p>`;
     question.querySelectorAll('[data-state]').forEach(button=>button.onclick=()=>{
      const isBefore=button.dataset.state==='before';setValues(isBefore?defaults[topic]:afterState);
      question.querySelectorAll('[data-state]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
      question.querySelector('.comparison-note').textContent=`El dibujo muestra el caso «${isBefore?'Antes':'Después'}». Las barras comparan los dos casos fijos.`;
     });render(question);
    };
   });
  };
 });
 const reset=document.createElement('button');reset.type='button';reset.className='lab-reset';reset.textContent='Restablecer laboratorio ↺';
 reset.onclick=()=>{setValues(defaults[topic]);question.innerHTML='';picker.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed','false'));};
 root.querySelector('.lab-controls').after(reset);
 root.querySelectorAll('.lab-controls input,.lab-controls select').forEach(el=>el.addEventListener('input',()=>{
  const note=question.querySelector('.comparison-note');if(note)note.textContent='Ahora exploras valores libres. Las barras conservan los casos «Antes» y «Después»; usa sus botones para volver a ellos.';
  question.querySelectorAll('[data-state]').forEach(el=>el.setAttribute('aria-pressed','false'));
 }));
}

export function energyReading(root,power){
 let time=1;root.innerHTML='<h4>De potencia a energía</h4><p>Si la potencia permanece constante, ¿cuánta energía se transforma durante este tiempo?</p><div class="energy-times" aria-label="Tiempo de funcionamiento"><button type="button" data-time="1" aria-pressed="true">1 segundo</button><button type="button" data-time="10" aria-pressed="false">10 segundos</button><button type="button" data-time="60" aria-pressed="false">1 minuto</button></div><div class="energy-result" role="status"></div>';
 const update=()=>{root.querySelector('.energy-result').innerHTML=formula(`E=Pt=(${quantity(power(),'W')})(${time}\\,s)=${quantity(power()*time,'J')}`)+`<p>La potencia sigue siendo ${Number(power().toPrecision(5))} W. La energía acumulada depende también del tiempo.</p>`;render(root);};
 root.querySelectorAll('button').forEach(b=>b.onclick=()=>{time=Number(b.dataset.time);root.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));update();});update();return update;
}
