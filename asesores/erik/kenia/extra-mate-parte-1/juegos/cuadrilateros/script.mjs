import {TIPOS,TRAPECIOS,LADOS,INFO,INFO_TRAP,cerca,propiedades,crearFigura,transformar,crearEstado,responder,avanzar} from './modelo.mjs?v=20260930-cuadrilateros1';

const root=document.querySelector('.quad-site');
if(root) iniciar();
function iniciar(){
  const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
  let quad=crearFigura('cuadrado'),trap=crearFigura('trapecio','isósceles'),quadFocus='paralelos',trapFocus='bases',stage=1,errorTimer;
  quad.giro=0;trap.giro=0;
  const states=[crearEstado(1),crearEstado(2)],state=()=>states[stage-1],question=()=>state().serie[state().indice];
  const hashes=['cuadrilateros','trapecios'],rounds=[['Reconoce la figura','Sí o no: propiedades','Descifra las pistas','Completa los 360°'],['Reconoce el tipo','Investiga las partes','Sí o no: propiedades','Conecta y calcula']];
  const point=(p,r,a)=>({x:p.x+r*Math.cos(a),y:p.y+r*Math.sin(a)});
  const path=points=>`M ${points.map(p=>`${p.x} ${p.y}`).join(' L ')} Z`;
  const segment=(a,b,cls)=>`<line class="${cls}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
  const value=a=>cerca(a,Math.round(a))?`${Math.round(a)}°`:`≈ ${a.toFixed(1).replace('.',',')}°`;
  const focusTitle=selector=>{const el=$(selector);el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'instant'});};
  function corner(points,i){
    const p=points[i],a=points[(i+3)%4],b=points[(i+1)%4];
    let start=Math.atan2(a.y-p.y,a.x-p.x),end=Math.atan2(b.y-p.y,b.x-p.x),span=((end-start+Math.PI*3)%(Math.PI*2))-Math.PI;
    if(span<0){start=end;span=-span;}return {start,span};
  }
  function draw(fig,{focus='todo',medidas=null}={}){
    const prop=propiedades(fig.puntos),geo=transformar(fig),points=geo.puntos,letters='ABCD',side=LADOS.indexOf(focus),angle=focus.length===1?letters.indexOf(focus):-1;
    const baseMode=['bases','paralelos'].includes(focus),sideMode=focus==='lados'||focus==='laterales',parts=['bases','laterales','altura','diagonales'].includes(focus);
    let selectedSides=[];
    if(focus==='bases')selectedSides=[0,2];
    else if(focus==='laterales')selectedSides=[1,3];
    else if(focus==='paralelos')selectedSides=prop.paralelos.flat();
    else if(side>=0)selectedSides=[side,...prop.paralelos.filter(p=>p.includes(side)).flat()];
    if(side>=0&&fig.subtipo==='isósceles'&&[1,3].includes(side))selectedSides=[1,3];
    let selectedAngles=angle>=0?[angle]:focus==='angulos'?[0,1,2,3]:[];
    if(angle>=0&&fig.subtipo==='isósceles')selectedAngles=[angle,angle%2===0?angle+1:angle-1];
    else if(angle>=0&&prop.rectos.includes(angle))selectedAngles=prop.rectos;
    const measureAlt=medidas?medidas.map((v,i)=>v?`${letters[i]}: ${v} grados`:'').filter(Boolean).join('. '):'';
    const equals=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)if(cerca(prop.lados[i],prop.lados[j]))equals.push(`${LADOS[i]} igual a ${LADOS[j]}`);
    const lengthAlt=prop.iguales?'Cuatro lados iguales.':equals.length?`${equals.join('; ')}.`:'Los cuatro lados tienen longitudes distintas.';
    const emphasis=side>=0?`Lado ${focus} resaltado.`:angle>=0?`Ángulo ${focus} resaltado.`:focus==='bases'?'Segmentos AB y CD resaltados.':focus==='laterales'?'Segmentos BC y DA resaltados.':focus==='diagonales'?'Segmentos AC y BD resaltados.':focus==='altura'?'Segmento DH perpendicular a las bases resaltado.':'';
    let svg=`<svg class="shape-svg" viewBox="0 0 520 410" role="img" aria-label="Cuadrilátero ABCD. ${prop.paralelos.length} pares de lados paralelos. ${prop.rectos.length} ángulos rectos. ${lengthAlt} ${emphasis} ${measureAlt}"><path class="shape-fill" d="${path(points)}"/>`;
    if(focus==='suma')svg+=`<path class="split-one" d="${path([points[0],points[1],points[2]])}"/><path class="split-two" d="${path([points[0],points[2],points[3]])}"/>`;
    points.forEach((p,i)=>{
      const c=corner(points,i),a=point(p,27,c.start),b=point(p,27,c.start+c.span);
      if(!parts||focus==='angulos')svg+=`<path class="angle-sector ${selectedAngles.includes(i)?'selected':''}" d="M ${p.x} ${p.y} L ${a.x} ${a.y} A 27 27 0 0 1 ${b.x} ${b.y} Z"/>`;
      if(prop.rectos.includes(i)){const x=point(p,13,c.start),y=point(p,13,c.start+c.span);svg+=`<path class="right-mark" d="M ${x.x} ${x.y} L ${x.x+y.x-p.x} ${x.y+y.y-p.y} L ${y.x} ${y.y}"/>`;}
    });
    const groups=[];prop.lados.forEach(l=>{if(!groups.some(x=>cerca(x,l)))groups.push(l);});
    points.forEach((a,i)=>{
      const b=points[(i+1)%4],pair=prop.paralelos.findIndex(p=>p.includes(i));
      svg+=segment(a,b,`side-line ${selectedSides.includes(i)?'highlight':''} ${baseMode&&pair===1?'second-pair':''}`);
      const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,center={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
      if((baseMode||focus==='todo'||side>=0)&&pair>=0){
        // Los pares usan una o dos flechas, además de colores distintos.
        const direction=prop.paralelos[pair][1]===i?-1:1,vx=ux*direction,vy=uy*direction;
        for(let k=0;k<=pair;k++){const d=(k-pair/2)*10,px=center.x+vx*d,py=center.y+vy*d;svg+=`<path class="parallel-mark ${pair===1?'second-pair':''}" d="M ${px-vx*6-vy*6} ${py-vy*6+vx*6} L ${px} ${py} L ${px-vx*6+vy*6} ${py-vy*6-vx*6}"/>`;}
      }
      if((sideMode||focus==='todo'||side>=0)&&prop.lados.filter(l=>cerca(l,prop.lados[i])).length>1){
        const n=groups.findIndex(x=>cerca(x,prop.lados[i]))+1;
        for(let k=0;k<n;k++){const d=(k-(n-1)/2)*7+(focus==='todo'?20:0),px=center.x+ux*d,py=center.y+uy*d;svg+=segment({x:px-uy*6,y:py+ux*6},{x:px+uy*6,y:py-ux*6},'equal-mark');}
      }
    });
    if(focus==='diagonales'||focus==='suma'){svg+=segment(points[0],points[2],'diagonal');if(focus==='diagonales')svg+=segment(points[1],points[3],'diagonal');}
    if(focus==='suma')for(const ids of [[0,1,2],[0,2,3]]){const x=ids.reduce((s,i)=>s+points[i].x,0)/3,y=ids.reduce((s,i)=>s+points[i].y,0)/3;svg+=`<text class="split-label" text-anchor="middle" x="${x}" y="${y+7}">180°</text>`;}
    if(focus==='altura'){
      const h=geo.altura,d=points[3],base=points[1],a=points[0],len=Math.hypot(base.x-a.x,base.y-a.y),hl=Math.hypot(d.x-h.x,d.y-h.y),u={x:(base.x-a.x)/len*12,y:(base.y-a.y)/len*12},v={x:(d.x-h.x)/hl*12,y:(d.y-h.y)/hl*12};
      svg+=segment(d,h,'height-line')+`<path class="right-mark" d="M ${h.x+u.x} ${h.y+u.y} L ${h.x+u.x+v.x} ${h.y+u.y+v.y} L ${h.x+v.x} ${h.y+v.y}"/>`;
      if(Math.hypot(h.x-a.x,h.y-a.y)>2)svg+=`<text class="svg-label" text-anchor="middle" x="${h.x-v.x*2.2}" y="${h.y-v.y*2.2+7}">H</text>`;
    }
    const center={x:points.reduce((s,p)=>s+p.x,0)/4,y:points.reduce((s,p)=>s+p.y,0)/4};
    points.forEach((p,i)=>{
      const dx=p.x-center.x,dy=p.y-center.y,len=Math.hypot(dx,dy),label=`${letters[i]}${focus==='altura'&&i===0&&Math.hypot(p.x-geo.altura.x,p.y-geo.altura.y)<2?' / H':''}${medidas&&medidas[i]!==''?` · ${medidas[i]}°`:''}`,margin=Math.max(45,label.length*8+10);
      const x=Math.max(margin,Math.min(520-margin,p.x+dx/len*40)),y=Math.max(35,Math.min(378,p.y+dy/len*40));
      svg+=`<text class="svg-label" text-anchor="middle" dominant-baseline="middle" x="${x}" y="${y}">${label}</text>`;
    });
    return svg+'</svg>';
  }
  function renderQuad(){
    const info=INFO[quad.tipo],p=propiedades(quad.puntos);
    $('#quad-diagram').innerHTML=draw(quad,{focus:quadFocus});$('#quad-name').textContent=info.titulo;$('#quad-family').textContent=info.familia;$('#quad-description').textContent=info.resumen;
    $$('[data-quad]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.quad===quad.tipo)));
    $$('[data-quad-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.quadFocus===quadFocus)));
    const pairs=p.paralelos.map(pair=>pair.map(i=>LADOS[i]).join(' ∥ '));
    let title,copy;
    if(quadFocus==='paralelos'){title=`${p.paralelos.length} ${p.paralelos.length===1?'par de lados paralelos':'pares de lados paralelos'}`;copy=pairs.length?`${pairs.join(' y ')}. Aunque prolongues cada par, sus rectas no se cruzan.`:'No hay pares de lados paralelos. Al prolongar cualquier par de lados opuestos, sus rectas se encuentran.';}
    else if(quadFocus==='lados'){title=p.iguales?'Cuatro longitudes iguales':'Compara las marcas de longitud';const groups=[];p.lados.forEach((l,i)=>{const g=groups.find(g=>cerca(g.l,l));if(g)g.sides.push(LADOS[i]);else groups.push({l,sides:[LADOS[i]]});});copy=groups.filter(g=>g.sides.length>1).map(g=>g.sides.join(' = ')).join('; ')||'No hay lados de la misma longitud en este ejemplo.';}
    else if(quadFocus==='angulos'){title=`${p.rectos.length} ángulos rectos`;copy=`${p.rectos.length?'Los cuadrados pequeños marcan 90°. ':'No hay marcas de 90° en esta figura. '}Los cuatro ángulos interiores juntos suman 360°.`;}
    else{title='Una diagonal crea dos triángulos';copy='La diagonal AC une vértices opuestos. Cada triángulo aporta 180° a los ángulos interiores del cuadrilátero.';}
    $('#quad-result').innerHTML=`<strong>${title}</strong><p>${copy}</p>${quadFocus==='suma'?'<p class="equation">180° + 180° = 360°</p>':''}`;
    $('#quad-caption').textContent=quadFocus==='suma'?'AC divide la figura en dos triángulos sin superponerlos.':'A, B, C y D son sus vértices. Girar no cambia sus propiedades.';
  }
  $$('[data-quad]').forEach(b=>b.addEventListener('click',()=>{quad=crearFigura(b.dataset.quad);quad.giro=0;renderQuad();}));
  $$('[data-quad-focus]').forEach(b=>b.addEventListener('click',()=>{quadFocus=b.dataset.quadFocus;renderQuad();}));
  $('#quad-example').addEventListener('click',()=>{quad=crearFigura(quad.tipo,TRAPECIOS[Math.floor(Math.random()*3)]);renderQuad();});
  $('#quad-rotate').addEventListener('click',()=>{quad.giro=(quad.giro+30)%360;renderQuad();});
  function renderTrap(){
    const p=propiedades(trap.puntos),info=INFO_TRAP[trap.subtipo];$('#trap-diagram').innerHTML=draw(trap,{focus:trapFocus});$('#trap-name').textContent=`Trapecio ${trap.subtipo}`;$('#trap-description').textContent=info.resumen;
    $$('[data-trap]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trap===trap.subtipo)));
    $$('[data-trap-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trapFocus===trapFocus)));
    $$('[data-element]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.element===trapFocus)));
    let title,copy;
    if(trapFocus==='bases'||['AB','CD'].includes(trapFocus)){title='AB ∥ CD · Las bases';copy='AB es la base mayor y CD la menor. Su nombre depende de su longitud, no de si están arriba, abajo o inclinadas.';}
    else if(trapFocus==='laterales'||['BC','DA'].includes(trapFocus)){title='BC y DA · Los laterales';copy=trap.subtipo==='isósceles'?'Tienen la misma longitud. Las rayitas iguales te permiten reconocer un trapecio isósceles.':trap.subtipo==='rectángulo'?'Tienen distinta longitud. Uno es perpendicular a las bases y puede representar la altura.':'Tienen distinta longitud y ninguno es perpendicular a las bases. Es un trapecio escaleno.';}
    else if(trapFocus==='altura'){title='DH · Una distancia perpendicular';copy='H está sobre la recta de la base AB y DH forma 90° con ella. La longitud de DH es la altura: la distancia más corta entre las rectas de las bases.';if(cerca(trap.puntos[3].x,0))copy+=' En este ejemplo H coincide con A: el lateral DA también representa una altura.';}
    else if(trapFocus==='diagonales'){title='AC y BD · Vértices opuestos';copy=trap.subtipo==='isósceles'?'Las dos diagonales tienen la misma longitud. Se cruzan dentro del trapecio, pero no se dividen necesariamente por la mitad.':'Las diagonales unen A con C y B con D. En este trapecio sus longitudes son distintas.';}
    else if(trapFocus.length===1){
      const i='ABCD'.indexOf(trapFocus),partner=[3,2,1,0][i],basePartner=[1,0,3,2][i];title=`Ángulo ${trapFocus}: ${value(p.angulos[i])}`;
      copy=`${trapFocus} + ${'ABCD'[partner]} = 180°: están junto al mismo lateral. ${trap.subtipo==='isósceles'?`Además, ${trapFocus} = ${'ABCD'[basePartner]} por estar en la misma base de un isósceles.`:p.rectos.includes(i)?'Este ángulo es recto: mide 90°.':'Este ángulo no es recto.'}`;
    }else{title='Cuatro interiores, dos sumas de 180°';copy=trap.subtipo==='isósceles'?'A = B y C = D. Además A + D = 180° y B + C = 180°.':trap.subtipo==='rectángulo'?`${p.rectos.map(i=>'ABCD'[i]).join(' y ')} son rectos. Los otros dos ángulos también suman 180°.`:'A + D = 180° y B + C = 180°. Los ángulos de una misma base no son iguales.';}
    $('#trap-result').innerHTML=`<strong>${title}</strong><p>${copy}</p>`;
    $('#trap-caption').textContent=trapFocus==='altura'?'El pequeño cuadrado en H señala que DH es perpendicular a AB.':trapFocus==='diagonales'?'Las diagonales están dentro de la figura; no forman parte del contorno.':'AB y CD siguen siendo las bases aunque gires la figura.';
  }
  $$('[data-trap]').forEach(b=>b.addEventListener('click',()=>{trap=crearFigura('trapecio',b.dataset.trap);trap.giro=0;renderTrap();}));
  $$('[data-trap-focus]').forEach(b=>b.addEventListener('click',()=>{trapFocus=b.dataset.trapFocus;renderTrap();}));
  $$('[data-element]').forEach(b=>b.addEventListener('click',()=>{trapFocus=b.dataset.element;renderTrap();}));
  $('#trap-example').addEventListener('click',()=>{trap=crearFigura('trapecio',trap.subtipo);renderTrap();});
  $('#trap-rotate').addEventListener('click',()=>{trap.giro=(trap.giro+30)%360;renderTrap();});
  function progress(){states.forEach((s,i)=>$(`[data-progress="${i+1}"]`).textContent=`${s.resueltos===16?'✓ ':''}${s.resueltos} / 16`);$('#total-progress').textContent=`${states.reduce((n,s)=>n+s.resueltos,0)} de 32 retos resueltos`;$('#game-progress').value=state().resueltos;$('#round-label').textContent=`Ronda ${Math.floor(state().indice/4)+1} de 4 · Reto ${state().indice%4+1} de 4`;$('#score-label').textContent=`${state().resueltos}/16 resueltos · ${state().primerIntento} al primer intento`;}
  function renderStage(moveFocus=false){clearTimeout(errorTimer);hashes.forEach((id,i)=>$('#'+id).hidden=stage!==i+1);$$('[data-stage]').forEach(b=>{if(Number(b.dataset.stage)===stage)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});$('#practice-title').textContent=stage===1?'Detective de cuadriláteros':'Misiones de trapecios';$('#practice-description').textContent=rounds[stage-1].join(' → ');renderGame();if(moveFocus)focusTitle(stage===1?'#quad-title':'#trap-title');}
  function route(){const i=hashes.indexOf(location.hash.slice(1));if(i>=0){stage=i+1;renderStage(true);}}
  window.addEventListener('hashchange',route);
  $$('[data-stage]').forEach(b=>b.addEventListener('click',()=>{if(location.hash===b.hash)focusTitle(stage===1?'#quad-title':'#trap-title');}));
  function gameDrawing(){
    const q=question(),mystery=q.formato==='pistas'&&!state().completo;
    $('#game-diagram').hidden=mystery;$('#clue-board').hidden=!mystery;
    if(mystery){$('#clue-board').innerHTML=`<strong>¿Quién soy?</strong>${q.pistas.map((p,i)=>`<p><b>${i+1}</b><span>${p}</span></p>`).join('')}`;}
    else $('#game-diagram').innerHTML=draw(q.figura,{focus:q.enfoque||'todo',medidas:q.medidas||null});
    $('#game-caption').textContent=mystery?'Deduce la figura por sus propiedades. Al acertar verás un ejemplo.':q.formato==='parte'?'Sigue los segmentos resaltados. Las letras identifican sus extremos.':q.formato==='numero'?'Las medidas dadas corresponden a esta figura.':'Las flechas señalan paralelismo; las rayitas, lados iguales; los cuadrados pequeños, 90°.';
  }
  function renderGame(){
    const s=state();progress();$('#practice-start').hidden=s.fase!=='inicio';$('#practice-active').hidden=s.fase!=='reto';$('#round-summary').hidden=s.fase!=='resumen';$('#new-series').hidden=s.fase==='inicio';
    if(s.fase==='resumen'){summary();return;}if(s.fase==='inicio')return;
    const q=question();$('#challenge-label').textContent=rounds[stage-1][Math.floor(s.indice/4)];$('#question-title').textContent=q.enunciado;gameDrawing();
    $('#given-chips').innerHTML=(q.datos||[]).map(v=>`<span>${v}</span>`).join('');$('#answer-controls').replaceChildren();
    if(q.formato==='numero'){
      const form=document.createElement('form');form.className='answer-form';form.noValidate=true;
      const label=document.createElement('label');label.htmlFor='numeric-answer';label.textContent=q.unidad==='°'?'Medida del ángulo':'Longitud de BD';
      const input=document.createElement('input');input.type='text';input.id='numeric-answer';input.inputMode='decimal';input.autocomplete='off';input.value=s.borrador;input.readOnly=s.completo;input.setAttribute('aria-describedby','answer-feedback');input.addEventListener('input',()=>s.borrador=input.value);
      const unit=document.createElement('span');unit.textContent=q.unidad;
      const button=document.createElement('button');button.type='submit';button.className='geo-button primary';button.textContent='Comprobar';button.disabled=s.completo;
      form.append(label,input,unit,button);form.addEventListener('submit',event=>{event.preventDefault();check(input.value);});$('#answer-controls').append(form);
    }else{
      const box=document.createElement('div');box.className='answer-options';q.opciones.forEach(o=>{const b=document.createElement('button');b.className='geo-button';b.type='button';b.textContent=o.texto;b.dataset.answer=String(o.id);b.disabled=s.completo;b.addEventListener('click',()=>check(o.id));box.append(b);});$('#answer-controls').append(box);
    }
    $('#question-hint').open=false;$('#hint-copy').textContent=q.pista;$('#next-question').disabled=!s.completo;$('#next-question').textContent=s.indice%4===3?'Ver mi avance →':'Siguiente reto →';paintFeedback();
  }
  function paintFeedback(flash=false){
    const s=state(),el=$('#answer-feedback');el.replaceChildren();el.removeAttribute('data-kind');
    if(!s.retro){el.textContent='Observa y razona. Puedes consultar la pista antes de responder.';return;}
    el.dataset.kind=s.retro.tipo;
    if(flash&&s.retro.tipo==='incorrecto'){const mark=document.createElement('span');mark.className='error-flash';mark.textContent='×';mark.setAttribute('aria-hidden','true');el.append(mark);clearTimeout(errorTimer);errorTimer=setTimeout(()=>mark.remove(),1100);}
    el.append(document.createTextNode(s.retro.text));const input=$('#numeric-answer');
    if(input){input.classList.toggle('is-correct',s.retro.tipo==='correcto');input.classList.toggle('is-wrong',s.retro.tipo==='incorrecto');input.setAttribute('aria-invalid',String(s.retro.tipo==='incorrecto'));}
    $$('[data-answer]').forEach(b=>{b.classList.remove('is-correct','is-wrong');if(b.dataset.answer===String(s.respuesta))b.classList.add(s.completo?'is-correct':'is-wrong');});
  }
  function check(raw){
    const s=state(),q=question(),result=responder(s,raw);if(result==='bloqueado')return;
    s.retro={tipo:result,text:result==='correcto'?`✓ ¡Correcto! ${q.explicacion}`:result==='incorrecto'?`Todavía no. ${q.pista} Puedes intentarlo otra vez.`:'Escribe un número para comprobar tu respuesta.'};
    paintFeedback(true);progress();if(s.completo){$$('#answer-controls button').forEach(b=>b.disabled=true);if($('#numeric-answer'))$('#numeric-answer').readOnly=true;gameDrawing();$('#next-question').disabled=false;$('#next-question').focus({preventScroll:true});}
  }
  $('#start-game').addEventListener('click',()=>{state().fase='reto';renderGame();focusTitle('#question-title');});
  $('#next-question').addEventListener('click',()=>{const s=state();if(!s.completo)return;if(s.indice%4===3){s.fase='resumen';renderGame();focusTitle('#summary-title');}else if(avanzar(s)){renderGame();focusTitle('#question-title');}});
  function summary(){const s=state(),final=s.indice===15;$('#summary-label').textContent=`${stage===1?'Cuadriláteros':'Trapecios'} · ${final?'Recorrido completo':`Ronda ${Math.floor(s.indice/4)+1} completada`}`;$('#summary-title').textContent=final?'¡Dieciséis retos resueltos!':'¡Cuatro descubrimientos más!';$('#summary-copy').textContent=`Resueltos: ${s.resueltos} de 16. Al primer intento: ${s.primerIntento}. ${final?(stage===1?'Ahora puedes explorar más a fondo los trapecios.':'Puedes crear otra serie o volver a cualquier laboratorio para reforzar lo aprendido.'):`Siguiente misión: ${rounds[stage-1][Math.floor(s.indice/4)+1].toLowerCase()}.`}`;$('#continue-round').hidden=final;$('#next-stage').hidden=!final||stage===2;$('#repeat-series').hidden=!final;$('#finish-link').hidden=!final||stage!==2;}
  $('#continue-round').addEventListener('click',()=>{if(avanzar(state())){renderGame();focusTitle('#question-title');}});
  $('#next-stage').addEventListener('click',()=>location.hash='trapecios');
  function restart(){clearTimeout(errorTimer);states[stage-1]=crearEstado(stage);state().fase='reto';renderGame();focusTitle('#question-title');}
  $('#new-series').addEventListener('click',restart);$('#repeat-series').addEventListener('click',restart);
  renderQuad();renderTrap();const initial=hashes.indexOf(location.hash.slice(1));if(initial>=0)stage=initial+1;renderStage();
}
