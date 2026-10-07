import {FORMULAS,formula,nombre,numero,tipos,crearPractica,siguiente,responder} from './modelo.mjs?v=20261007-formulas1';
import {ilustracion,miniatura,datosExplorador} from './figuras.mjs?v=20261007-formulas1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const estados={calcular:crearPractica('calcular'),descubrir:crearPractica('descubrir')};
let figura=5,concepto='perimetro',vista='explora';
const timers=new Map();
function matematicas(el,f,extra=false){
 const tex=extra?f.extra:f.tex,mml=extra?f.extraMml:f.mml;
 el.dataset.tex=tex;el.dataset.mml=mml;
 el.innerHTML=`<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">${mml}</math>`;
 if(window.katex)try{window.katex.render(tex,el,{displayMode:true,throwOnError:true,output:'htmlAndMathml'});}catch{/* MathML conserva una fórmula legible sin depender de la red. */}
}
window.addEventListener('load',()=>$$('[data-tex]').forEach(el=>matematicas(el,{tex:el.dataset.tex,mml:el.dataset.mml})));
$('#figure-picker').innerHTML=Array.from({length:7},(_,i)=>`<button type="button" data-n="${i+3}" aria-pressed="false">${miniatura(i+3)}<span>${nombre(i+3)}</span><small>${i+3} lados</small></button>`).join('');
$('#formula-picker').innerHTML=FORMULAS.map(f=>`<button type="button" data-formula="${f.id}" aria-pressed="false"><span aria-hidden="true">${f.icono}</span>${f.nombre}</button>`).join('');
function explorar(){
 const f=formula(concepto);
 $$('[data-n]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.n===figura)));
 $$('[data-formula]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.formula===concepto)));
 $('#explore-art').innerHTML=ilustracion(figura,concepto,{animada:true});
 $('#formula-title').textContent=f.titulo;$('#formula-description').textContent=f.texto;$('#formula-legend').textContent=f.leyenda;
 $('#explore-result').textContent=datosExplorador(figura,concepto);$('#explore-name').textContent=nombre(figura)+' regular';
 $('#formula-card').classList.toggle('wide',concepto==='angulos');
 matematicas($('#main-formula'),f);$('#extra-formula').hidden=!f.extra;if(f.extra)matematicas($('#extra-formula'),f,true);
}
$$('[data-n]').forEach(b=>b.onclick=()=>{figura=+b.dataset.n;explorar();});
$$('[data-formula]').forEach(b=>b.onclick=()=>{concepto=b.dataset.formula;explorar();});
$('#animate-again').onclick=explorar;
function mensaje(modo,texto,tipo='neutral'){
 clearTimeout(timers.get(modo));const el=$(`#${modo}-feedback`);el.textContent=texto;el.dataset.kind=tipo;
 if(tipo==='incorrect'){
  const cruz=document.createElement('span');cruz.className='error-mark';cruz.textContent='×';cruz.setAttribute('aria-hidden','true');el.prepend(cruz);
  timers.set(modo,setTimeout(()=>cruz.remove(),1100));
 }
}
function progreso(modo){const s=estados[modo];$(`#${modo}-progress`).textContent=`${s.aciertos} ${s.aciertos===1?'resuelto':'resueltos'} · ${s.primero} al primer intento`;}
function dibujarPregunta(modo){
 const s=estados[modo],q=s.pregunta;
 $(`#${modo}-number`).textContent=`Reto ${s.numero}`;
 $(`#${modo}-question`).textContent=q.pregunta;
 $(`#${modo}-known`).innerHTML=q.conocidos.map(d=>`<div class="data-chip"><span>${d.simbolo}</span><strong>${numero(d.valor)} <small>${d.unidad}</small></strong></div>`).join('');
 const nota=q.aproximado?(q.opciones||q.angular?'El ángulo mostrado está redondeado a 2 decimales.':'Medidas aproximadas. Calcula con los datos que aparecen aquí.'):'Todos los lados y todos los ángulos interiores son iguales.';
 $(`#${modo}-note`).textContent=nota;
 $(`#${modo}-art`).innerHTML=q.opciones?`<div class="mystery-mark" aria-hidden="true">?<span>✧</span></div><p class="mystery-copy">Las pistas esconden una figura.<br>Encuentra cuántos lados tiene.</p>`:ilustracion(q.n,q.visual,{resumen:false});
 $(`#${modo}-figure-name`).textContent=q.opciones?'Un polígono por descubrir':nombre(q.n)+' regular';
 const answers=$(`#${modo}-options`),form=$(`#${modo}-form`);
 answers.hidden=!q.opciones;form.hidden=!!q.opciones;
 answers.innerHTML=q.opciones?q.opciones.map(n=>`<button type="button" class="shape-option" data-answer="${n}" aria-label="${nombre(n)}, ${n} lados">${miniatura(n)}<strong>${nombre(n)}</strong><small>${n} lados</small><span class="option-result" aria-hidden="true"></span></button>`).join(''):'';
 answers.querySelectorAll('button').forEach(b=>b.onclick=()=>comprobar(modo,b.dataset.answer,b));
 const input=$(`#${modo}-answer`);input.value='';input.disabled=false;input.removeAttribute('aria-invalid');form.querySelector('button').disabled=false;form.dataset.state='';
 $(`#${modo}-unit`).textContent=q.unidad;
 $(`#${modo}-rounding`).textContent=q.angular?'Si tiene decimales, redondea a 2 decimales. Puedes usar coma o punto.':'Escribe solo el número. Puedes usar coma o punto decimal.';
 $(`#${modo}-help`).hidden=true;$(`[data-hint="${modo}"]`).setAttribute('aria-expanded','false');
 $(`#${modo}-hint`).textContent=q.pista;matematicas($(`#${modo}-hint-formula`),formula(q.formula));
 $(`#${modo}-steps`).innerHTML=q.pasos.map(t=>`<li>${t}</li>`).join('');$(`#${modo}-solution`).hidden=true;
 $(`[data-next="${modo}"]`).hidden=true;
 mensaje(modo,q.opciones?'Toca la figura que corresponde a las pistas.':'Prueba tu respuesta. Puedes corregirla y volver a intentar.');progreso(modo);
}
function nuevo(modo,enfocar=false){siguiente(estados[modo]);dibujarPregunta(modo);if(enfocar)$(`#${modo}-question`).focus({preventScroll:true});}
function comprobar(modo,valor,boton){
 const s=estados[modo],q=s.pregunta,out=responder(s,valor);if(!out)return;
 if(!out.valida){mensaje(modo,'Escribe un número válido; por ejemplo 12 o 51,43.','incorrect');$(`#${modo}-answer`).setAttribute('aria-invalid','true');return;}
 if(boton){boton.classList.add(out.correcta?'correct':'incorrect');boton.querySelector('.option-result').textContent=out.correcta?'✓':'↻';boton.disabled=true;}
 else{$(`#${modo}-form`).dataset.state=out.correcta?'correct':'incorrect';$(`#${modo}-answer`).setAttribute('aria-invalid',String(!out.correcta));}
 if(out.correcta){
  mensaje(modo,q.opciones?`✓ ¡Es el ${nombre(q.n).toLocaleLowerCase('es')}! Tiene ${q.n} lados.`:`✓ ¡Correcto! ${numero(q.respuesta)} ${q.unidad}.`,'correct');
  $$(`#${modo}-options button`).forEach(b=>b.disabled=true);$(`#${modo}-answer`).disabled=true;$(`#${modo}-form button`).disabled=true;
  $(`#${modo}-solution`).hidden=false;$(`[data-next="${modo}"]`).hidden=false;progreso(modo);
 }else mensaje(modo,`Todavía no. ${q.pista}`,'incorrect');
}
for(const modo of ['calcular','descubrir']){
 const select=$(`#${modo}-type`);select.innerHTML='<option value="mezcla">Un poco de todo</option>'+tipos(modo).map(([id,label])=>`<option value="${id}">${label}</option>`).join('');
 select.onchange=()=>{estados[modo].filtro=select.value;estados[modo].bolsa=[];nuevo(modo);};
 $(`#${modo}-form`).onsubmit=e=>{e.preventDefault();comprobar(modo,$(`#${modo}-answer`).value);};
 $(`[data-hint="${modo}"]`).onclick=()=>{const panel=$(`#${modo}-help`);panel.hidden=!panel.hidden;$(`[data-hint="${modo}"]`).setAttribute('aria-expanded',String(!panel.hidden));};
 $$(`[data-new="${modo}"],[data-next="${modo}"]`).forEach(b=>b.onclick=()=>nuevo(modo,true));
}
function mostrarVista(id){
 vista=['explora','calcular','descubrir'].includes(id)?id:'explora';
 $$('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==vista);
 $$('[data-view]').forEach(a=>{if(a.dataset.view===vista)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
 if(vista!=='explora'&&!estados[vista].pregunta)nuevo(vista);
}
function navegar(id){
 history.replaceState(null,'',`#${id}`);mostrarVista(id);
 $('.view-switch').scrollIntoView({block:'start',behavior:'instant'});
 $(`.view-switch [data-view="${id}"]`).focus({preventScroll:true});
}
$$('[data-view]').forEach(a=>a.onclick=e=>{e.preventDefault();navegar(a.dataset.view);});
$$('[data-review]').forEach(a=>a.onclick=e=>{e.preventDefault();const q=estados[a.dataset.review].pregunta;concepto=q.formula;if(!q.opciones)figura=q.n;explorar();navegar('explora');});
window.addEventListener('hashchange',()=>mostrarVista(location.hash.slice(1)));
explorar();mostrarVista(location.hash.slice(1));
