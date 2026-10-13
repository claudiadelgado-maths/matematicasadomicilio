import {FUNCIONES,ABREVIATURAS,NIVELES,ejemplo,validarFraccion,validarLados,validarIntegrador,geometria} from './modelo.mjs';
const root=document.querySelector('.trig-session');
const renderMath=(container=root)=>container.querySelectorAll('[data-tex]').forEach(node=>{
  if(globalThis.katex) globalThis.katex.render(node.dataset.tex,node,{throwOnError:false,strict:'ignore'});
});
const math=(node,tex)=>{node.dataset.tex=tex;node.textContent=tex;if(globalThis.katex) globalThis.katex.render(tex,node,{throwOnError:false,strict:'ignore'});};
const SVG='http://www.w3.org/2000/svg';
const svgElement=(name,attrs,text)=>{const node=document.createElementNS(SVG,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));if(text)node.textContent=text;return node;};

function dibujar(container,{a=4,b=3,h=5,rotacion=0,referencia=1,modo='numeros',angulo=true}={}) {
  const {vertices:v,etiquetas,centro}=geometria(a,b,rotacion);
  const aria=`Triángulo rectángulo ABC. Ángulo recto en C.${angulo?` Ángulo de referencia θ en ${referencia===1?'A':'B'}.`:''}${modo==='numeros'?` CA mide ${a}, CB mide ${b}, AB mide ${h}.`:''}`;
  const svg=svgElement('svg',{viewBox:'0 0 500 360',role:'img','aria-label':aria});
  const sides=[[0,1],[0,2],[1,2]];
  svg.append(svgElement('polygon',{points:v.map(p=>p.join(',')).join(' '),class:'triangle-fill'}));
  const roles=referencia===1?['CA','CO','H']:['CO','CA','H'];
  sides.forEach(([i,j],index)=>svg.append(svgElement('line',{x1:v[i][0],y1:v[i][1],x2:v[j][0],y2:v[j][1],class:`triangle-edge ${modo==='roles'?'edge-'+roles[index]:''}`})));
  const unit=(p,q)=>{const n=Math.hypot(q[0]-p[0],q[1]-p[1]);return [(q[0]-p[0])/n,(q[1]-p[1])/n];};
  const u=unit(v[0],v[1]),w=unit(v[0],v[2]);
  const corner=[ [v[0][0]+u[0]*16,v[0][1]+u[1]*16], [v[0][0]+(u[0]+w[0])*16,v[0][1]+(u[1]+w[1])*16], [v[0][0]+w[0]*16,v[0][1]+w[1]*16] ];
  svg.append(svgElement('polyline',{points:corner.map(p=>p.join(',')).join(' '),class:'right-marker'}));
  v.forEach((p,i)=>{const vec=unit(centro,p);svg.append(svgElement('text',{x:p[0]+vec[0]*18,y:p[1]+vec[1]*18+4,'text-anchor':'middle',class:'vertex-label'},['C','A','B'][i]));});
  if(angulo){
    const origin=v[referencia],others=v.filter((_,i)=>i!==referencia);
    const start=Math.atan2(others[0][1]-origin[1],others[0][0]-origin[0]);
    let delta=Math.atan2(others[1][1]-origin[1],others[1][0]-origin[0])-start;
    while(delta>Math.PI)delta-=2*Math.PI;while(delta< -Math.PI)delta+=2*Math.PI;
    const point=(r,t)=>[origin[0]+r*Math.cos(t),origin[1]+r*Math.sin(t)];
    const p=point(30,start),q=point(30,start+delta),label=point(49,start+delta/2);
    svg.append(svgElement('path',{d:`M${p} A30 30 0 0 ${delta>0?1:0} ${q}`,class:'angle-arc'}));
    svg.append(svgElement('text',{x:label[0],y:label[1]+5,'text-anchor':'middle',class:'theta'},'θ'));
  }
  const labels=modo==='numeros'?[a,b,h]:modo==='roles'?roles.map(r=>ABREVIATURAS[r]):modo==='nombres'?['Cateto','Cateto','Hipotenusa']:[];
  labels.forEach((label,i)=>svg.append(svgElement('text',{x:etiquetas[i][0],y:etiquetas[i][1]+5,'text-anchor':'middle',class:'side-label'},String(label))));
  container.querySelector('svg')?.remove();container.prepend(svg);
  container.querySelectorAll('[data-slot]').forEach((slot,i)=>{
    slot.style.left=`${etiquetas[i][0]/5}%`;slot.style.top=`${etiquetas[i][1]/3.6}%`;
  });
}

// Mismo contrato para arrastre con ratón/táctil y selección con clic/teclado.
function conectarTarjetas(board,onPlace) {
  let selected=null,drag=null,ghost=null,suppressClick=false;
  const tokens=[...board.querySelectorAll('[data-token]')];
  const select=(token)=>{
    selected=token;
    tokens.forEach(t=>t.setAttribute('aria-pressed',String(t===token)));
    board.querySelector('[data-selection]').textContent=`Seleccionaste ${token.dataset.label}. Ahora elige una casilla.`;
  };
  tokens.forEach(token=>{
    token.setAttribute('aria-pressed','false');
    token.addEventListener('click',()=>{if(!suppressClick)select(token);});
    token.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;
      drag={token,x:event.clientX,y:event.clientY,id:event.pointerId,moved:false};
      token.setPointerCapture(event.pointerId);
    });
    token.addEventListener('pointermove',event=>{
      if(!drag||drag.id!==event.pointerId)return;
      if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>8&&!drag.moved){
        drag.moved=true;select(token);ghost=document.createElement('div');ghost.className='trig-drag-ghost';ghost.textContent=token.dataset.label;ghost.setAttribute('aria-hidden','true');document.body.append(ghost);
      }
      if(ghost){ghost.style.left=`${event.clientX}px`;ghost.style.top=`${event.clientY}px`;}
    });
    const end=(event,cancel=false)=>{
      if(!drag||drag.id!==event.pointerId)return;
      if(drag.moved){
        const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-slot]');
        if(!cancel&&target&&board.contains(target))onPlace(token,target);
        suppressClick=true;setTimeout(()=>{suppressClick=false;},0);
      }
      ghost?.remove();ghost=null;drag=null;
    };
    token.addEventListener('pointerup',event=>end(event));
    token.addEventListener('pointercancel',event=>end(event,true));
  });
  board.querySelectorAll('[data-slot]').forEach(slot=>slot.addEventListener('click',()=>{
    if(selected)onPlace(selected,slot);
    else board.querySelector('[data-selection]').textContent='Primero selecciona una tarjeta; después elige dónde colocarla.';
  }));
  return ()=>{selected=null;board.querySelector('[data-selection]').textContent='Selecciona una tarjeta y después una casilla.';tokens.forEach(t=>t.setAttribute('aria-pressed','false'));};
}

if(root){
  renderMath();
  root.querySelectorAll('[data-diagram="intro"]').forEach(node=>dibujar(node,{modo:'nombres',angulo:false}));
  const reference=root.querySelector('[data-reference]');
  if(reference){
    let angle=1;
    const update=()=>{
      dibujar(reference.querySelector('.diagram'),{modo:'roles',referencia:angle});
      reference.querySelector('[data-angle-status]').textContent=`θ está en ${angle===1?'A':'B'}. C.O. es ${angle===1?'CB':'CA'}; C.A. es ${angle===1?'CA':'CB'}. La hipotenusa sigue siendo AB.`;
    };
    reference.querySelector('button').addEventListener('click',()=>{angle=angle===1?2:1;update();});update();
  }
  const identify=root.querySelector('[data-identify]');
  if(identify){
    let level=0,assignments=[null,null,null];
    const slots=[...identify.querySelectorAll('[data-slot]')];
    const tokens=[...identify.querySelectorAll('[data-token]')];
    const feedback=identify.querySelector('[data-feedback]');
    const next=identify.querySelector('[data-next-level]');
    const continuation=root.querySelector('[data-continue]');
    const refresh=()=>{
      slots.forEach((slot,i)=>{const token=tokens.find(t=>t.dataset.token===assignments[i]);slot.textContent=token?.dataset.label||`Lado ${i+1}`;slot.setAttribute('aria-label',`${['Lado CA','Lado CB','Lado AB'][i]}: ${token?.dataset.label||'sin tarjeta'}`);slot.removeAttribute('aria-invalid');});
      tokens.forEach(token=>token.classList.toggle('placed',assignments.includes(token.dataset.token)));
      next.hidden=true;continuation.hidden=true;feedback.textContent='Completa los tres lados y comprueba tus tarjetas.';feedback.removeAttribute('data-result');
    };
    const clearSelection=conectarTarjetas(identify,(token,slot)=>{
      assignments=assignments.map(value=>value===token.dataset.token?null:value);assignments[Number(slot.dataset.slot)]=token.dataset.token;refresh();
    });
    identify.querySelector('[data-check-sides]').addEventListener('click',()=>{
      const types=assignments.map(id=>tokens.find(t=>t.dataset.token===id)?.dataset.kind);
      const ok=validarLados(types);
      feedback.textContent=ok?`¡Nivel ${level+1} completo! La hipotenusa siempre está frente al ángulo recto.`:'Revisa los lados: los dos catetos forman el ángulo recto; la hipotenusa queda enfrente. Completa las tres tarjetas.';
      feedback.dataset.result=ok?'ok':'error';
      slots.forEach((slot,i)=>slot.setAttribute('aria-invalid',String(types[i]!==['cateto','cateto','hipotenusa'][i])));
      next.hidden=!ok||level===2;continuation.hidden=!ok||level!==2;
    });
    const start=()=>{
      assignments=[null,null,null];clearSelection();refresh();feedback.removeAttribute('data-result');
      identify.querySelector('[data-selection]').textContent='Arrastra una tarjeta, o selecciónala y toca un lado.';
      identify.querySelector('[data-level]').textContent=`Nivel ${level+1} de 3`;
      dibujar(identify.querySelector('.diagram'),{rotacion:NIVELES[level],modo:'slots',angulo:false});
    };
    next.addEventListener('click',()=>{if(level<2){level++;start();tokens[0].focus();}});
    identify.querySelector('[data-reset]').addEventListener('click',()=>{level=0;start();tokens[0].focus();});start();
  }
  const exercise=root.querySelector('[data-function]');
  if(exercise){
    const index=FUNCIONES.findIndex(f=>f.slug===exercise.dataset.function),f=FUNCIONES[index];
    let variant=0,example;
    const form=exercise.querySelector('form'),feedback=exercise.querySelector('[data-feedback]');
    const next=root.querySelector('[data-continue]');
    const update=()=>{
      example=ejemplo(index,variant);dibujar(exercise.querySelector('.diagram'),{...example,modo:'numeros'});
      form.reset();next.hidden=true;feedback.textContent='Escribe una fracción. También se aceptan fracciones equivalentes.';feedback.removeAttribute('data-result');
      exercise.querySelector('[data-reference-note]').textContent=`Ángulo recto en C. Calcula respecto a θ, señalado en ${example.referencia===1?'A':'B'}.`;
    };
    form.addEventListener('input',()=>{next.hidden=true;feedback.textContent='Comprueba de nuevo tu respuesta.';feedback.removeAttribute('data-result');});
    form.addEventListener('submit',event=>{
      event.preventDefault();const result=validarFraccion(form.elements.numerador.value,form.elements.denominador.value,example.valores[f.arriba],example.valores[f.abajo]);
      feedback.textContent=result.motivo+(result.ok?' Puedes continuar.':` ${f.frase}`);feedback.dataset.result=result.ok?'ok':'error';next.hidden=!result.ok;
    });
    exercise.querySelector('[data-new-example]').addEventListener('click',()=>{variant++;update();form.elements.numerador.focus();});update();
  }
  const final=root.querySelector('[data-final]');
  if(final){
    const slots=[...final.querySelectorAll('[data-slot]')];
    let values=Array(12).fill(null);
    const deliver=final.querySelector('[data-deliver]');
    const feedback=final.querySelector('[data-feedback]');
    const success=final.querySelector('[data-success]');
    const refresh=()=>{
      slots.forEach((slot,i)=>{const part=i%2?'denominador':'numerador';slot.textContent=ABREVIATURAS[values[i]]||'—';slot.setAttribute('aria-label',`${FUNCIONES[Math.floor(i/2)].nombre}, ${part}: ${ABREVIATURAS[values[i]]||'vacío'}`);slot.removeAttribute('aria-invalid');});
      const filled=values.filter(Boolean).length;final.querySelector('[data-count]').textContent=`${filled} de 12 casillas completas`;
      deliver.hidden=filled!==12;success.hidden=true;feedback.textContent=filled===12?'Ya puedes entregar. Se comprobarán las doce casillas.':'Completa cada fracción con las tarjetas reutilizables.';feedback.removeAttribute('data-result');
      final.querySelectorAll('[data-row-feedback]').forEach(node=>node.textContent='');
    };
    const clearSelection=conectarTarjetas(final,(token,slot)=>{values[Number(slot.dataset.slot)]=token.dataset.token;refresh();});
    deliver.addEventListener('click',()=>{
      const result=validarIntegrador(values);
      slots.forEach((slot,i)=>slot.setAttribute('aria-invalid',String(!result.correctas[i])));
      final.querySelectorAll('[data-row-feedback]').forEach((node,i)=>{node.textContent=result.correctas[2*i]&&result.correctas[2*i+1]?'Correcta.':`Revisa esta razón. ${FUNCIONES[i].frase}`;});
      feedback.textContent=result.ok?'¡Las 12 casillas son correctas!':`${result.total} de 12 correctas. Corrige las casillas señaladas y vuelve a entregar.`;feedback.dataset.result=result.ok?'ok':'error';
      success.hidden=!result.ok;
      if(result.ok){deliver.hidden=true;success.focus();}else slots[result.correctas.indexOf(false)].focus();
    });
    final.querySelector('[data-reset]').addEventListener('click',()=>{values=Array(12).fill(null);clearSelection();refresh();final.querySelector('[data-token]').focus();});refresh();
  }
}
