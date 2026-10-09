import {pareja,escapar} from './figuras-triangulos.mjs?v=20261009-2';
export function iniciarPracticas(modelo,{simboloNo='≁',mismaEscala=false}={}){
const {CASOS,OPCIONES,crearPractica,siguiente,responder,texto}=modelo;
const $=id=>document.getElementById(id),modos=['decide','encuentra','ecuacion'];
if(!modos.every(m=>$(m+'-form')))return;
const practicas=Object.fromEntries(modos.map(m=>[m,crearPractica(m)]));
const errores=new Map();
function progreso(m){
 const s=practicas[m];$(`${m}-progress`).textContent=`${s.aciertos} resueltos · ${s.primero} al primer intento`;
 const n=s.aciertos%5|| (s.aciertos?5:0);$(`${m}-dots`).innerHTML=Array.from({length:5},(_,i)=>`<span class="${i<n?'filled':''}">✦</span>`).join('');
}
function dibujarPregunta(m,enfocar=false){
 const s=practicas[m],q=s.pregunta;clearTimeout(errores.get(m));
 $(`${m}-number`).textContent=`Reto ${s.numero}`;$(`${m}-question`).textContent=q.pregunta;$(`${m}-context`).textContent=q.contexto;
 $(`${m}-art`).innerHTML=pareja(q.triangulos,mismaEscala);$(`${m}-art`).classList.remove('solved');
 $(`${m}-data`).innerHTML=q.datos.map(d=>`<span>${escapar(d)}</span>`).join('');$(`${m}-data`).hidden=!q.datos.length;
 $(`${m}-hint`).textContent=q.pista;document.querySelector(`#${m} .hint`).open=false;
 $(`${m}-solution`).hidden=true;$(`${m}-steps`).innerHTML='';document.querySelector(`[data-next="${m}"]`).hidden=true;
 const feedback=$(`${m}-feedback`);feedback.textContent='';feedback.className='feedback';
 const opciones=$(`${m}-options`),form=$(`${m}-form`);opciones.hidden=m!=='decide';form.hidden=m==='decide';
 if(m==='decide'){
  opciones.innerHTML=OPCIONES.map(([id,nombre])=>`<button type="button" class="choice" data-answer="${id}"><span>${id==='NO'?simboloNo:id}</span>${nombre}</button>`).join('');
  opciones.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>comprobar(m,b.dataset.answer)));
 }else{
  $(`${m}-fields`).innerHTML=q.campos.map(c=>`<label class="answer-label" for="${m}-${c.id}"><span>${escapar(c.etiqueta)}</span><span class="input-wrap"><input id="${m}-${c.id}" name="${c.id}" type="text" inputmode="text" autocomplete="off" maxlength="20" aria-describedby="${m}-input-help ${m}-feedback"><span class="unit">${escapar(c.unidad)}</span><span class="field-mark" aria-hidden="true"></span></span></label>`).join('');
  $(`${m}-input-help`).textContent=q.campos.every(c=>c.unidad==='°')?'Escribe cada ángulo en grados. Todos son enteros.':m==='ecuacion'?'Escribe el valor de x. En estos retos x es un número entero.':'Puedes escribir un entero o una fracción: 3/2. Las fracciones equivalentes también valen.';
  form.querySelector('button[type=submit]').disabled=false;
  form.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{i.removeAttribute('aria-invalid');i.closest('.input-wrap').classList.remove('correct','retry');i.nextElementSibling.nextElementSibling.textContent='';}));
 }
 progreso(m);if(enfocar)$(`${m}-question`).focus();
}
function completarDibujo(q){
 const ts=structuredClone(q.triangulos),t=ts[1];let i=0;
 if(q.modo==='encuentra')for(const grupo of [t.lados,t.angulos])for(const dato of Object.values(grupo))if(dato.objetivo){const c=q.campos[i++];dato.texto=texto(c.respuesta)+(c.unidad==='°'?'°':'');dato.objetivo=false;dato.deducido=true;}
 return ts;
}
function comprobar(m,seleccion){
 const s=practicas[m],q=s.pregunta,form=$(`${m}-form`);
 const entradas=m==='decide'?seleccion:Object.fromEntries(new FormData(form));
 const resultado=responder(s,entradas);if(!resultado)return;
 const feedback=$(`${m}-feedback`);clearTimeout(errores.get(m));
 if(!resultado.valida){feedback.className='feedback retry';feedback.textContent='Completa todos los campos con un número o una fracción válida, por ejemplo 3/2. El denominador no puede ser 0.';return;}
 if(m==='decide'){
  const boton=$(`${m}-options`).querySelector(`[data-answer="${seleccion}"]`);boton.classList.add(resultado.correcta?'correct':'retry');boton.disabled=true;
 }else q.campos.forEach((c,i)=>{const input=$(`${m}-${c.id}`),ok=resultado.resultados[i],wrap=input.closest('.input-wrap');wrap.classList.toggle('correct',ok);wrap.classList.toggle('retry',!ok);input.setAttribute('aria-invalid',String(!ok));wrap.querySelector('.field-mark').textContent=ok?'✓':'×';});
 feedback.className=`feedback ${resultado.correcta?'correct':'retry'}`;
 if(resultado.correcta){
  feedback.textContent=`✓ ¡Bien conectado! ${s.aciertos%5===0?'¡Cinco retos más resueltos! ✦':'Encontraste la relación.'}`;
  document.querySelectorAll(`#${m}-options button, #${m}-form input, #${m}-form button`).forEach(b=>b.disabled=true);
  $(`${m}-art`).innerHTML=pareja(completarDibujo(q),mismaEscala);$(`${m}-art`).classList.add('solved');
  $(`${m}-steps`).innerHTML=q.pasos.map(p=>`<li>${escapar(p)}</li>`).join('');$(`${m}-solution`).hidden=false;
  const continuar=document.querySelector(`[data-next="${m}"]`);continuar.hidden=false;continuar.focus({preventScroll:true});
 }else{
  feedback.innerHTML='<span class="error-flash" aria-hidden="true">×</span><span>'+ (m==='decide'?'Mira otra vez los datos marcados. Puedes probar otra opción.':'Revisa los campos en rosa. Los verdes ya están bien; puedes conservarlos.')+'</span>';
  errores.set(m,setTimeout(()=>{feedback.querySelector('.error-flash')?.remove();document.querySelectorAll(`#${m} .retry .field-mark`).forEach(el=>el.textContent='');},1200));
 }
 progreso(m);
}
for(const m of modos){
 const s=practicas[m];$(`${m}-type`).innerHTML=CASOS[m].map(([id,n])=>`<option value="${id}">${n}</option>`).join('')+'<option value="mezcla">Mezcla de todos los casos</option>';
 if(m==='decide'){s.filtro='mezcla';$(`${m}-type`).value='mezcla';}
 const nuevo=()=>{siguiente(s);dibujarPregunta(m,true);};
 $(`${m}-type`).addEventListener('change',e=>{s.filtro=e.target.value;s.bolsa=[];siguiente(s);dibujarPregunta(m);});
 $(`${m}-orientation`).addEventListener('change',e=>{s.orientacion=e.target.value;siguiente(s);dibujarPregunta(m);});
 document.querySelector(`[data-new="${m}"]`).addEventListener('click',nuevo);document.querySelector(`[data-next="${m}"]`).addEventListener('click',nuevo);
 $(`${m}-form`).addEventListener('submit',e=>{e.preventDefault();comprobar(m);});
 siguiente(s);dibujarPregunta(m);
}
function cambiarVista(){
 const hash=location.hash.slice(1),vista=modos.includes(hash)?hash:'explora';
 document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==vista);
 document.querySelectorAll('[data-view]').forEach(a=>{if(a.dataset.view===vista)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
 if(hash==='criterios')requestAnimationFrame(()=>$('criterios').scrollIntoView({block:'start'}));
}
window.addEventListener('hashchange',cambiarVista);
cambiarVista();

}
