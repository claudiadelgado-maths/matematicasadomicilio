import {CASOS,geometria,datosFigura,crearEstado,responder,siguiente} from './modelo.mjs?v=20261002-trapecios1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const exact=n=>Number.isInteger(Math.sqrt(n))?String(Math.sqrt(n)):`√${n}`;
const names={B:'B',b:'b',h:'h',x:'x',y:'y',L1:'L₁',L2:'L₂'};
function drawing(q,solved=false,lab=false){
 const data=lab?{B:q.B,b:q.b,h:q.h,L1:exact(q.x*q.x+q.h*q.h),L2:exact(q.y*q.y+q.h*q.h)}:datosFigura(q,solved);
 const scale=Math.min(380/q.B,210/q.h),left=(600-q.B*scale)/2,right=left+q.B*scale,bottom=300,top=bottom-q.h*scale,u=left+q.x*scale,v=u+q.b*scale;
 const label=(key)=>`${q.iso&&key.startsWith('L')?'L':names[key]} = ${data[key]??'?'}`;
 const text=(x,y,t,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
 const path=(d,color='#65788f',dash=false)=>`<path d="${d}" stroke="${color}" stroke-width="2" fill="none"${dash?' stroke-dasharray="6 5"':''}/>`;
 const dimension=(a,b,y)=>path(`M${a} ${y-5} v10 M${a} ${y} H${b} M${b} ${y-5} v10`);
 let body=`<polygon points="${left},${bottom} ${u},${top} ${v},${top} ${right},${bottom}" fill="${q.goal==='P'?'#fff0dc':'#dcefe8'}" stroke="#18776c" stroke-width="4"/>`;
 // Matching arrows mark the two parallel bases.
 body+=path(`M${(u+v)/2-5} ${top-5} l6 5 -6 5 M${(left+right)/2-5} ${bottom-5} l6 5 -6 5`,'#18776c');
 if(q.guides||lab){
  const feet=lab||q.id==='A1'?[(u+v)/2]:[u,v];
  for(const foot of feet){body+=path(`M${foot} ${top} V${bottom}`,'#7551a0',true);const sign=foot===right?-1:1;body+=path(`M${foot} ${bottom-10} h${10*sign} v10`,'#7551a0');}
  if('h' in data)body+=text(feet[0]+12,(top+bottom)/2+7,label('h'),'start');
 }
 if(q.x===0)body+=path(`M${left+12} ${bottom} v-12 h-12 M${u+12} ${top} v12 h-12`,'#7551a0');
 if(q.y===0)body+=path(`M${right-12} ${bottom} v-12 h12 M${v-12} ${top} v12 h12`,'#7551a0');
 if(q.iso){
  for(const [a,b] of [[[left,bottom],[u,top]],[[right,bottom],[v,top]]]){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);body+=path(`M${mx-dy/len*7} ${my+dx/len*7} L${mx+dy/len*7} ${my-dx/len*7}`,'#7551a0');}
 }
 if('b' in data)body+=text((u+v)/2,top-23,label('b'));
 if('B' in data){body+=dimension(left,right,361);body+=text(300,389,label('B'));}
 if('L1' in data)body+=text((left+u)/2-20,(top+bottom)/2-10,label('L1'),'end');
 if('L2' in data)body+=text((right+v)/2+20,(top+bottom)/2-10,label('L2'),'start');
 if(q.segments){
  if('x' in data&&q.x>0){body+=dimension(left,u,316);body+=text((left+u)/2,343,label('x'));}
  if(q.iso){body+=dimension(v,right,316);body+=text((v+right)/2,343,label('x'));}
  else if('y' in data&&q.y>0){body+=dimension(v,right,316);body+=text((v+right)/2,343,label('y'));}
 }
 const accessible=Object.keys(data).map(k=>label(k)).join(', ');
 return `<svg viewBox="0 0 600 420" role="img" aria-label="Trapecio ${q.tipo}. ${accessible}. Medidas en centímetros.${q.iso?' Las marcas indican laterales iguales.':''}">${body}</svg>`;
}
function renderLab(){
 const B=Number($('#base-major').value);$('#base-minor').max=B-2;
 const b=Number($('#base-minor').value),h=Number($('#height').value);$('#shift').max=B-b;const x=Number($('#shift').value),g=geometria(B,b,h,x);
 const iso=x===g.y,tipo=x===0||g.y===0?'rectángulo':iso?'isósceles':'escaleno';
 for(const [id,n] of [['base-major',B],['base-minor',b],['height',h]])$(`#${id}-value`).textContent=`${n} cm`;
 $('#shift-value').textContent=`${x} cm desde la izquierda`;
 $('#lab-drawing').innerHTML=drawing({...g,iso,tipo,goal:'A'},false,true);
 $('#lab-type').textContent=`Trapecio ${tipo}${iso?' · Laterales iguales':tipo==='rectángulo'?' · Un lateral perpendicular a las bases':' · Laterales distintos'}`;
 $('#lab-area').textContent=`A = (${B} + ${b}) × ${h} ÷ 2 = ${g.area} cm²`;
 const l1=exact(x*x+h*h),l2=exact(g.y*g.y+h*h),p=Number.isInteger(g.L1)&&Number.isInteger(g.L2)?g.perimetro:`${B+b} + ${l1} + ${l2}`;
 $('#lab-perimeter').textContent=`P = ${B} + ${b} + ${l1} + ${l2} = ${p} cm`;
 $$('[data-align]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.align==='center'?iso:button.dataset.align==='left'?x===0:g.y===0)));
}
$$('.controls input').forEach(input=>input.addEventListener('input',renderLab));
$$('[data-align]').forEach(button=>button.onclick=()=>{const diff=Number($('#base-major').value)-Number($('#base-minor').value);$('#shift').value=button.dataset.align==='center'?diff/2:button.dataset.align==='left'?0:diff;renderLab();});
const s=crearEstado();let errorTimer;
function renderGame(focus=false){
 clearTimeout(errorTimer);const q=s.q,host=$('#exercise-host');
 const options=['A','P'].map(prefix=>`<optgroup label="${prefix==='A'?'Área':'Perímetro'}">${CASOS.filter(c=>c.id[0]===prefix).map(c=>`<option value="${c.id}">${c.id} · ${c.nombre.split(' · ')[1]}</option>`).join('')}</optgroup>`).join('');
 host.innerHTML=`<div class="toolbar"><label for="case-filter">Quiero practicar<select id="case-filter"><option value="todos">Todos los casos</option><option value="area">Solo área · Casos variados</option><option value="perimetro">Solo perímetro · Casos variados</option>${options}</select></label><button type="button" class="lab-button" data-new>Nuevo ejercicio ↻</button></div><div class="stats"><span data-round></span><span data-score></span></div><progress max="4" value="0" aria-label="Aciertos de la ronda"></progress><div class="two-columns"><div><div class="drawing" data-drawing>${drawing(q)}</div><p class="figure-note">Todas las medidas están en cm.${q.iso?' Las rayitas iguales marcan lados iguales.':''}</p></div><div><p class="exercise-case">${CASOS.find(c=>c.id===q.id).nombre}</p><h3 tabindex="-1">${q.pregunta}</h3><form><label for="answer">${q.goal==='A'?'Área':'Perímetro'} del trapecio</label><div class="answer-row"><span class="answer-box"><input id="answer" type="text" inputmode="numeric" autocomplete="off" maxlength="7" aria-describedby="answer-help feedback"></span><span>${q.unit}</span></div><p class="small" id="answer-help">Escribe solo el número. Puedes usar papel para tus cuentas.</p><button type="submit" class="lab-button primary">Comprobar</button></form><details><summary>Necesito una pista</summary><ol>${q.pistas.map(t=>`<li>${t}</li>`).join('')}</ol></details><div class="feedback" id="feedback" role="status" aria-live="polite" aria-atomic="true"></div><div class="solution" hidden><h4>Así se resuelve</h4><ol></ol></div><button type="button" class="lab-button primary" data-next disabled>Siguiente reto →</button></div></div>`;
 const input=$('#answer'),feedback=$('#feedback'),box=host.querySelector('.answer-box');
 const stats=()=>{const n=s.completo&&s.resueltos%4===0?4:s.resueltos%4;host.querySelector('progress').value=n;host.querySelector('[data-round]').textContent=`Ronda ${Math.floor(Math.max(0,s.resueltos-(s.completo?1:0))/4)+1} · ${n}/4 aciertos${n===4?' · ¡Completada! ✦':''}`;host.querySelector('[data-score]').textContent=`${s.resueltos} resueltos · ${s.primerIntento} al primer intento`;};
 input.oninput=()=>{if(s.completo)return;box.classList.remove('wrong');input.removeAttribute('aria-invalid');feedback.textContent='';feedback.removeAttribute('data-kind');};
 host.querySelector('form').onsubmit=e=>{e.preventDefault();const result=responder(s,input.value);if(result==='bloqueada')return;clearTimeout(errorTimer);feedback.dataset.kind=result;feedback.textContent=result==='correcta'?`✓ ¡Correcto! ${q.goal} = ${q.answer} ${q.unit}.`:result==='invalida'?'Escribe un número entero para comprobar.':'Todavía no. Revisa los datos y prueba otra vez. Puedes abrir la pista.';box.classList.toggle('correct',s.completo);box.classList.toggle('wrong',result==='error');input.setAttribute('aria-invalid',String(!s.completo));if(result==='error'){const mark=document.createElement('span');mark.className='error-mark';mark.textContent='×';mark.setAttribute('aria-hidden','true');feedback.prepend(mark);errorTimer=setTimeout(()=>mark.remove(),1100);}if(s.completo){input.readOnly=true;host.querySelector('[type="submit"]').disabled=true;host.querySelector('[data-next]').disabled=false;host.querySelector('[data-drawing]').innerHTML=drawing(q,true);host.querySelector('.solution').hidden=false;host.querySelector('.solution ol').innerHTML=q.steps.map(t=>`<li>${t}</li>`).join('');}stats();};
 const next=()=>{siguiente(s);renderGame(true);};host.querySelector('[data-new]').onclick=next;host.querySelector('[data-next]').onclick=()=>{if(s.completo)next();};
 $('#case-filter').value=s.filtro;$('#case-filter').onchange=e=>{s.filtro=e.target.value;siguiente(s);renderGame();$('#case-filter').focus({preventScroll:true});};
 stats();if(focus)host.querySelector('h3').focus({preventScroll:true});
}
renderLab();renderGame();
