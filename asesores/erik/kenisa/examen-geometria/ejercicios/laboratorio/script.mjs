import {FORMULAS,formula,bancoMemoria,opcionesMemoria,bancoDespejes,bancoLados,bancoAlgebra,bancoCirculos,FIGURAS,CASOS_CIRCULO,crearBolsa,sacar,reiniciarBolsa} from './banco.mjs?v=20261011-2';
import {comprobar,formulaHTML} from './matematicas.mjs?v=20261011-2';
import {crearEditor} from './editor.mjs?v=20261011-2';
import {dibujarFigura,COLORES} from './figuras.mjs?v=20261011-2';
const $=id=>document.getElementById(id);
const nod=(tag,clase,texto)=>{const n=document.createElement(tag);if(clase)n.className=clase;if(texto!==undefined)n.textContent=texto;return n;};
const ACTIVIDADES=[
  {id:'memoria',titulo:'Reconoce la fórmula',sub:'Del concepto a la fórmula… y de la fórmula al concepto.',banco:bancoMemoria(),filtros:FORMULAS.map(f=>[f.id,f.nombre])},
  {id:'construccion',titulo:'Construye la fórmula',sub:'Elige las piezas y crea la expresión. Puedes cambiar cualquier parte.',banco:FORMULAS.map(f=>({id:f.id,filtro:f.id,familia:f.id,f})),filtros:FORMULAS.map(f=>[f.id,f.nombre])},
  {id:'despejes',titulo:'Encuentra el dato que falta',sub:'Identifica los datos, sustitúyelos y despeja. Puedes consultar la fórmula.',banco:bancoDespejes(),filtros:FORMULAS.map(f=>[f.id,f.nombre])},
  {id:'lados',titulo:'Dale un valor a cada lado',sub:'Sustituye x, multiplica primero y después suma o resta.',banco:bancoLados(),filtros:Object.entries(FIGURAS)},
  {id:'algebra',titulo:'Del enunciado a la ecuación',sub:'Relaciona las medidas y las fórmulas para descubrir lo que falta.',banco:bancoAlgebra(),filtros:[['perimetros','Perímetros'],['areas','Áreas'],['poligonos','Polígonos regulares']]},
  {id:'circulos',titulo:'Círculos, siempre con π',sub:'De la circunferencia al área y de regreso. Conserva π; nunca uses 3.14.',banco:bancoCirculos(),filtros:Object.entries(CASOS_CIRCULO)}
];
const estados=new Map();
function aviso(st,texto,tipo='pista'){st.feedback.hidden=false;st.feedback.className=`lab-feedback ${tipo}`;st.feedback.textContent=(tipo==='bien'?'✓ ':tipo==='error'?'× ':'')+texto;}
function progreso(st){const qs=st.config.banco.filter(q=>st.filtro==='todos'||q.filtro===st.filtro);st.progreso.textContent=`${qs.filter(q=>st.bolsa.vistas.has(q.id)).length} de ${qs.length} ${qs.length===1?'ejercicio explorado':'ejercicios explorados'} en esta selección · Ronda ${st.bolsa.ronda}`;}
function solucion(st){
  st.ayuda.replaceChildren();st.ayuda.hidden=false;
  st.ayuda.append(nod('h3','','Así se resuelve'));
  const q=st.q;
  if(st.config.id==='memoria'||st.config.id==='construccion'){
    const f=q.f;const m=nod('div','formula-display');m.innerHTML=formulaHTML(f.expr,f.lhs);st.ayuda.append(m,nod('p','',f.leyenda));
    if(f.id==='borde')st.ayuda.append(nod('p','','Recorre el borde y suma cada lado una sola vez.'));
  }else{
    const pasos=st.config.id==='lados'?q.lados.map(l=>`Lado ${l.letra}: ${l.expr} → ${l.a}·${q.x}${l.b>=0?' + '+l.b:' − '+(-l.b)} = ${l.valor} cm.`):q.pasos;
    const lista=nod('ol');pasos.forEach(p=>lista.append(nod('li','',p)));st.ayuda.append(lista);
    if(q.respuesta!==undefined){const res=nod('div','answer-line');res.append(nod('strong','','Resultado: '));const m=nod('span');m.innerHTML=formulaHTML(q.respuesta);res.append(m,nod('span','',q.unidad||''));st.ayuda.append(res);}
  }
}
function pista(st){
  const q=st.q,id=st.config.id;
  if(id==='memoria'||id==='construccion'){aviso(st,q.f.id==='borde'?'El perímetro reúne todos los lados, una sola vez.':q.f.id==='central'||q.f.id==='exterior'?'Una vuelta completa tiene 360°. Repártela entre el número de lados.':q.f.leyenda);}
  else if(id==='lados'){const l=q.lados[0];aviso(st,`Empieza con el lado A: donde aparece x, escribe ${q.x}. ${l.a}·${q.x}${l.b>=0?' + '+l.b:' − '+(-l.b)}. Respeta el orden de las operaciones.`);}
  else aviso(st,q.pasos[0]);
}
function comprobarActual(st){
  if(!st.q)return;const id=st.config.id,q=st.q;
  if(id==='memoria')return;
  if(id==='lados'){
    let bien=0;const problemas=[];
    q.lados.forEach((l,i)=>{const {input,row,marca}=st.inputs[i],r=comprobar(input.value,String(l.valor),{numerico:true});row.classList.toggle('bien',r.correcta);row.classList.toggle('error',!r.correcta);input.setAttribute('aria-invalid',String(!r.correcta));marca.textContent=r.correcta?'✓ Correcto':r.valida?'Revisa':'Completa';if(r.correcta)bien++;else problemas.push(l.letra);});
    if(bien===q.lados.length){aviso(st,'¡Todos los lados correctos! Puedes explorar otra figura.','bien');solucion(st);}else aviso(st,`${bien} de ${q.lados.length} lados correctos. Revisa ${problemas.join(', ')} y comprueba otra vez.`,'error');
    return;
  }
  const texto=st.editor.leer(),expected=id==='construccion'?q.f.expr:q.respuesta,r=comprobar(texto,expected,{numerico:id!=='construccion'});
  st.editorHost.classList.toggle('bien',r.correcta);st.editorHost.classList.toggle('error',!r.correcta);
  if(r.correcta){aviso(st,id==='construccion'?'¡Fórmula correcta! Las expresiones equivalentes también valen.':'¡Correcto! Revisa los pasos o prueba un ejercicio nuevo.','bien');solucion(st);}
  else aviso(st,!r.valida?r.mensaje:id==='circulos'?'Todavía no coincide. Si corresponde, escribe π con su botón o con la tecla p. Revisa radio, área y circunferencia.':'Todavía no coincide. Puedes modificar tu respuesta y volver a comprobar.','error');
}
function editor(st,letras,prefijo){
  st.editorHost=nod('div','response-editor');st.respuesta.append(st.editorHost);
  st.editor=crearEditor(st.editorHost,{letras,prefijo,etiqueta:st.config.id==='construccion'?'Construye la fórmula':'Valor de la respuesta',onChange:()=>{st.editorHost.classList.remove('bien','error');st.feedback.hidden=true;st.ayuda.hidden=true;}});
}
function nueva(st,enfocar=false){
  st.q=sacar(st.bolsa,st.filtro);st.feedback.hidden=true;st.ayuda.hidden=true;st.ayuda.replaceChildren();st.cuerpo.replaceChildren();st.respuesta.replaceChildren();st.editor=null;st.inputs=[];progreso(st);
  const q=st.q,id=st.config.id;st.actions.hidden=!q;st.next.hidden=!q;st.agotado.hidden=!!q;
  st.panel.dataset.pregunta=q?.id||'';
  if(!q){st.pregunta.textContent='¡Recorriste esta selección!';st.agotado.textContent='Puedes elegir otro tema o volver a mezclar esta selección.';st.reiniciar.hidden=false;return;}
  st.reiniciar.hidden=true;
  if(id==='memoria'){
    st.pregunta.textContent=q.tipo==='formula'?`¿Cuál es la fórmula de ${q.f.nombre.toLowerCase()}?`:'¿Qué se calcula con esta expresión?';
    if(q.tipo==='concepto'){const m=nod('div','formula-display memory-formula');m.innerHTML=formulaHTML(q.f.expr);st.cuerpo.append(m);}
    else st.cuerpo.append(nod('p','legend-note',q.f.leyenda));
    const opciones=nod('div','memory-options');
    opcionesMemoria(q).forEach((o,i)=>{const b=nod('button','memory-option');b.type='button';const letra=nod('span','option-code','ABCD'[i]);const content=nod('span');if(o.matematica)content.innerHTML=formulaHTML(o.valor,q.f.lhs);else content.textContent=o.valor;b.append(letra,content);b.addEventListener('click',()=>{if(o.correcta){opciones.querySelectorAll('button').forEach(el=>el.disabled=true);b.classList.add('bien');aviso(st,'¡Correcto! Esa es la relación.','bien');solucion(st);}else{b.classList.add('error');b.disabled=true;aviso(st,'Esa opción no corresponde. Prueba otra; puedes pedir una pista.','error');}});opciones.append(b);});st.respuesta.append(opciones);
  }else if(id==='construccion'){
    st.pregunta.textContent=q.f.nombre;st.cuerpo.append(nod('p','legend-note',q.f.leyenda),nod('p','legend-note','El signo = ya está puesto: construye solo la parte de la derecha.'));editor(st,q.f.letras,q.f.lhs+' =');
  }else if(id==='lados'){
    st.pregunta.textContent=`${q.nombre}: si x = ${q.x}, ¿cuánto mide cada lado?`;
    const layout=nod('div','sides-layout'),fig=nod('div','figure-wrap'),badge=nod('span','x-badge',`x = ${q.x}`);fig.append(badge,dibujarFigura(q),nod('p','figure-caption','Cada color y letra identifica un lado. Las expresiones están en centímetros.'));
    const campos=nod('div','side-fields');
    q.lados.forEach((l,i)=>{const row=nod('label','side-field');row.style.setProperty('--side-color',COLORES[i]);const title=nod('span','side-title',`Lado ${l.letra}`),expr=nod('span','side-expression',l.expr+' ='),input=nod('input');input.type='text';input.inputMode='numeric';input.autocomplete='off';input.setAttribute('aria-label',`Medida del lado ${l.letra} en centímetros`);const unit=nod('span','','cm'),marca=nod('span','side-mark');input.addEventListener('input',()=>{row.classList.remove('bien','error');input.removeAttribute('aria-invalid');marca.textContent='';st.feedback.hidden=true;st.ayuda.hidden=true;});input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();comprobarActual(st);}});row.append(title,expr,input,unit,marca);campos.append(row);st.inputs.push({input,row,marca});});layout.append(fig,campos);st.respuesta.append(layout);
  }else{
    st.pregunta.textContent=q.pregunta;
    if(id==='despejes'){
      const f=formula(q.formula),mf=nod('div','formula-reference');mf.innerHTML=formulaHTML(f.expr,f.lhs);mf.append(nod('p','legend-note',f.leyenda));st.cuerpo.append(mf);
      const datos=nod('div','given-data');q.datos.forEach(d=>{const el=nod('div','datum');const nombre=({E:'Ángulo exterior',I:'Ángulo interior'})[d.nombre]||d.nombre.replace('L1','L₁').replace('L2','L₂').replace('L3','L₃');el.append(nod('strong','',nombre+' = '+d.valor),nod('span','',d.unidad));datos.append(el);});st.cuerpo.append(datos);
    }
    editor(st,[],(id==='despejes'?(q.formula==='borde'&&q.target==='L'?'L₃':q.target):'Respuesta')+' =');st.respuesta.append(nod('p','answer-unit',q.unidad?`Responde en ${q.unidad==='°'?'grados (°)':q.unidad}. No necesitas escribir la unidad en el editor.`:'Escribe el valor de x.'));
  }
  if(enfocar)st.pregunta.focus({preventScroll:true});
}
for(const [index,config]of ACTIVIDADES.entries()){
  const panel=nod('section','lab-panel');panel.id='panel-'+config.id;panel.hidden=index!==0;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','tab-'+config.id);
  const head=nod('header','activity-heading');head.append(nod('p','eyebrow',`ESTACIÓN ${index+1} DE 6`),nod('h2','',config.titulo),nod('p','',config.sub));
  const toolbar=nod('div','lab-toolbar'),label=nod('label','','Qué quieres practicar'),filter=nod('select');filter.setAttribute('aria-label','Tema de '+config.titulo);
  for(const [value,name]of [['todos','Todos los casos'],...config.filtros]){const o=nod('option','',name);o.value=value;filter.append(o);}label.append(filter);
  const contador=nod('p','lab-progress');contador.setAttribute('aria-live','polite');toolbar.append(label,contador);
  const card=nod('div','lab-card'),pregunta=nod('h3','lab-question');pregunta.tabIndex=-1;
  const cuerpo=nod('div','question-content'),respuesta=nod('div','question-response'),feedback=nod('div','lab-feedback');feedback.hidden=true;feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
  const actions=nod('div','lab-actions'),comprobarBtn=nod('button','geo-button primary','Comprobar'),pistaBtn=nod('button','geo-button','Pista'),solBtn=nod('button','geo-button','Ver procedimiento');for(const b of [comprobarBtn,pistaBtn,solBtn])b.type='button';if(config.id!=='memoria')actions.append(comprobarBtn);actions.append(pistaBtn,solBtn);
  const ayuda=nod('div','lab-solution');ayuda.hidden=true;
  const next=nod('button','geo-button next-exercise','Nuevo ejercicio →');next.type='button';
  const agotado=nod('p','end-message');agotado.hidden=true;const reiniciar=nod('button','geo-button primary','Mezclar otra ronda ↻');reiniciar.type='button';reiniciar.hidden=true;
  card.append(pregunta,cuerpo,respuesta,actions,feedback,ayuda,agotado,reiniciar);panel.append(head,toolbar,card,next);
  $('estaciones').append(panel);
  const st={config,panel,bolsa:crearBolsa(config.banco),filtro:'todos',filter,progreso:contador,pregunta,cuerpo,respuesta,actions,feedback,ayuda,next,agotado,reiniciar};estados.set(config.id,st);
  filter.addEventListener('change',()=>{st.filtro=filter.value;if(st.q&&(st.filtro==='todos'||st.q.filtro===st.filtro)){progreso(st);return;}nueva(st);});next.addEventListener('click',()=>nueva(st,true));comprobarBtn.addEventListener('click',()=>comprobarActual(st));pistaBtn.addEventListener('click',()=>pista(st));solBtn.addEventListener('click',()=>solucion(st));reiniciar.addEventListener('click',()=>{if(reiniciarBolsa(st.bolsa,st.filtro))nueva(st,true);});
  panel.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.math-editor input')){e.preventDefault();comprobarActual(st);}});
  nueva(st);
}
const tabs=[...document.querySelectorAll('[data-estacion]')];
function activar(id,enfocar=false){if(!estados.has(id))return;for(const tab of tabs){const activo=tab.dataset.estacion===id;tab.setAttribute('aria-selected',String(activo));tab.tabIndex=activo?0:-1;estados.get(tab.dataset.estacion).panel.hidden=!activo;if(activo&&enfocar)tab.focus();}history.replaceState(null,'','#'+id);}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activar(tab.dataset.estacion));tab.addEventListener('keydown',e=>{const k=e.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(k))return;e.preventDefault();const j=k==='Home'?0:k==='End'?tabs.length-1:(i+(k==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activar(tabs[j].dataset.estacion,true);});});
activar(location.hash.slice(1)||'memoria');
