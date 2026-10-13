import {POLIGONOS,nombre,crearJuego,avanzarNivel,apuntar,iniciarDisparo,cancelarDisparo,resolverDisparo,rescatar,frente,pasillos,NIVEL_INICIAL,NIVEL_FINAL,TOTAL_DEFENSAS} from './modelo.mjs?v=20261007-niveles1';
import {poligono,tablero,coords,escenario,colorFigura,PALETA,ALTO} from './figuras.mjs?v=20261007-niveles1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let inspected=3,counted=0,countTimer;
for(const [selector,items] of [['#common-gallery',POLIGONOS.filter(p=>p.lados<=12)],['#extra-gallery',POLIGONOS.filter(p=>p.lados>12)]])$(selector).innerHTML=items.map(p=>`<button type="button" class="figure-card" data-polygon="${p.lados}" aria-pressed="false">${poligono(p.lados,{size:80,decorative:true})}<span>${p.nombre}</span><small>${p.lados} lados</small></button>`).join('');
function inspect(n){
 clearInterval(countTimer);inspected=n;counted=0;const p=POLIGONOS.find(p=>p.lados===n);
 $('#inspect-art').innerHTML=poligono(n,{label:`${p.nombre}, ${n} lados.`});$('#inspect-name').textContent=p.nombre;$('#inspect-number').textContent=`${n} lados`;
 $('#inspect-note').textContent=p.nota;$('#inspect-note').hidden=!p.nota;$('#count-feedback').textContent='';$('#count-sides').disabled=false;
 $$('[data-polygon]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.polygon)===n)));
}
$$('[data-polygon]').forEach(b=>b.onclick=()=>inspect(Number(b.dataset.polygon)));
$('#count-sides').onclick=()=>{
 clearInterval(countTimer);counted=0;$('#count-sides').disabled=true;$('#count-feedback').textContent='Recorre los lados de colores.';
 const step=()=>{counted=reduced()?inspected:counted+1;$('#inspect-art').innerHTML=poligono(inspected,{contados:counted,label:`${nombre(inspected)}: ${counted} de ${inspected} lados señalados.`});if(counted===inspected){clearInterval(countTimer);$('#count-sides').disabled=false;$('#count-feedback').textContent=`${nombre(inspected)}: ${inspected} lados. ¡Contorno completo!`;}};
 step();if(counted<inspected)countTimer=setInterval(step,220);
};

const dialog=$('#battle-dialog'),arena=$('#arena'),stage=$('#battle-stage');
let game=crearJuego(),geo=escenario(),missions=0,learned=new Set(),errorTimer,animations=new Set(),epoch=0,opener,savedScroll=0,bodyStyle=null,dragging=false;
function controls(){
 const ready=game.fase==='listo';
 $('#fire').disabled=!ready;$('#move-left').disabled=!ready||game.columna===0;$('#move-right').disabled=!ready||game.columna===4;
 $('#fire').setAttribute('aria-label',`Lanzar ${nombre(game.figura)}${game.columnas[game.columna].length?'':' al enemigo'} (flecha arriba o espacio)`);
 arena.setAttribute('aria-busy',String(game.fase==='vuelo'));
 $('#board-description').textContent=`Nivel ${game.nivel}. El jefe ${game.nivel}-ágono se vence con ${nombre(game.nivel)}. `+frente(game).map((b,i)=>`Columna ${i+1}: ${b?`${b.lados} al frente, ${game.columnas[i].length} defensas`:'camino libre al enemigo'}`).join('. ')+`. Apuntas a la columna ${game.columna+1}.`;
}
function render(){
 arena.innerHTML=tablero(game,geo);
 if($('#turn-name').textContent!==nombre(game.figura))$('#turn-name').textContent=nombre(game.figura);
 const remaining=game.columnas.flat().filter(b=>b.tipo==='bloque').length;$('#removed').textContent=`${TOTAL_DEFENSAS-remaining}/${TOTAL_DEFENSAS}`;$('#missions').textContent=missions;
 $('#level').textContent=`NV. ${game.nivel}/${NIVEL_FINAL}`;
 $('#level').setAttribute('aria-label',`Nivel ${game.nivel} de ${NIVEL_FINAL}. Recorrido del 3 al 20.`);
 $('#next-level').hidden=game.nivel===NIVEL_FINAL;
 $('#continue-activity').hidden=game.nivel!==NIVEL_FINAL;
 $('#rescue-panel').hidden=game.fase!=='ayuda';$('#victory').hidden=game.fase!=='ganado';controls();
}
function collection(){
 $('#collection').hidden=learned.size===0;$('#collection-items').innerHTML=[...learned].sort((a,b)=>a-b).map(n=>`<span class="collection-badge">${poligono(n,{size:50,decorative:true})}${nombre(n)} · ${n}</span>`).join('');
}
function cancelVisuals(){epoch++;for(const a of animations)a.cancel();animations.clear();cancelarDisparo(game);dragging=false;}
function resizeBattle(){
 if(!dialog.open)return;
 const bounds=stage.getBoundingClientRect(),compacto=bounds.height<340&&bounds.width>bounds.height*1.5,next=escenario((compacto?460:ALTO)*bounds.width/Math.max(1,bounds.height),compacto);
 if(Math.abs(geo.ancho-next.ancho)<.5&&geo.alto===next.alto)return;
 cancelVisuals();geo=next;render();
}
new ResizeObserver(resizeBattle).observe(stage);
function focusField(){arena.focus({preventScroll:true});}
function victoryFocus(){return $(game.nivel<NIVEL_FINAL?'#next-level':'#continue-activity');}
function openGame(button){
 if(dialog.open)return;opener=button;savedScroll=window.scrollY;bodyStyle=document.body.getAttribute('style');
 Object.assign(document.body.style,{position:'fixed',top:`-${savedScroll}px`,left:'0',right:'0',width:'100%'});
 dialog.showModal();resizeBattle();render();
 (game.fase==='ganado'?victoryFocus():game.fase==='ayuda'?$('#rescue'):arena).focus({preventScroll:true});
}
function closeGame(){
 if(!dialog.open)return;cancelVisuals();dialog.close();
 if(bodyStyle===null)document.body.removeAttribute('style');else document.body.setAttribute('style',bodyStyle);
 window.scrollTo({top:savedScroll,behavior:'instant'});opener?.focus({preventScroll:true});collection();
}
$$('[data-open-game]').forEach(b=>b.onclick=()=>openGame(b));$('#close-game').onclick=closeGame;
dialog.addEventListener('cancel',e=>{e.preventDefault();closeGame();});
function aim(c){
 const prev=game.columna;if(c===prev||!apuntar(game,c))return;render();
 animate($('.launcher'),[{transform:`translate(${geo.centros[prev]}px,${geo.yJugador}px)`},{transform:`translate(${geo.centros[c]}px,${geo.yJugador}px)`}],{duration:100,easing:'ease-out'});
}
$('#move-left').onclick=()=>{aim(game.columna-1);focusField();};$('#move-right').onclick=()=>{aim(game.columna+1);focusField();};
function pointerAim(e){const svg=$('#arena-svg'),matrix=svg?.getScreenCTM();if(!matrix)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());aim(Math.max(0,Math.min(4,Math.floor(p.x/geo.ancho*5))));}
arena.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;dragging=true;arena.setPointerCapture(e.pointerId);pointerAim(e);focusField();});
arena.addEventListener('pointermove',e=>{if(dragging)pointerAim(e);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])arena.addEventListener(name,()=>dragging=false);
dialog.addEventListener('keydown',e=>{
 if(e.key==='Tab'){
  const stops=[...dialog.querySelectorAll('button:not(:disabled),a[href],select,[tabindex="0"]')].filter(el=>el.getClientRects().length),first=stops[0],last=stops.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus({preventScroll:true});}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus({preventScroll:true});}
  return;
 }
 if(e.target.closest('a[href],select,#close-game,#new-mission,#play-again,#next-level,#rescue'))return;
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();aim(game.columna+(e.key==='ArrowLeft'?-1:1));}
 else if(/^[1-5]$/.test(e.key)){e.preventDefault();aim(Number(e.key)-1);}
 else if(e.key==='ArrowUp'||((e.key===' '||e.key==='Enter')&&!e.target.closest('button'))){e.preventDefault();if(!e.repeat)fire();}
});
function message(text,kind){
 clearTimeout(errorTimer);const el=$('#feedback');el.textContent=text;el.dataset.kind=kind;
 if(kind==='error'){const cross=document.createElement('span');cross.className='error-mark';cross.textContent='×';cross.setAttribute('aria-hidden','true');el.prepend(cross);errorTimer=setTimeout(()=>cross.remove(),1100);}
}
async function animate(el,keyframes,options){
 if(!el)return false;const a=el.animate(keyframes,{...options,duration:reduced()?0:options.duration,fill:'forwards'});animations.add(a);
 try{await a.finished;return true;}catch{return false;}finally{animations.delete(a);}
}
async function burst(layer,x,y){
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('transform',`translate(${x} ${y})`);
 g.innerHTML=PALETA.map((color,i)=>`<path class="spark" d="M0-5 5 0 0 5-5 0Z" fill="${color}" data-spark="${i}"/>`).join('');layer.append(g);
 await Promise.all([...g.children].map((p,i)=>{const angle=i*Math.PI/3;return animate(p,[{transform:'translate(0px,0px)',opacity:1},{transform:`translate(${Math.cos(angle)*64}px,${Math.sin(angle)*64}px)`,opacity:0}],{duration:240,easing:'ease-out'});}));
}
async function fire(){
 if(!dialog.open)return;const state=game,token=epoch,shot=iniciarDisparo(state);if(!shot)return;controls();
 const layer=$('#projectile-layer'),x=geo.centros[shot.columna],hitY=shot.objetivo?geo.yBloques+shot.indice*geo.paso:70*geo.escala;
 layer.innerHTML=`<g transform="translate(${x} 0)"><g class="shot"><polygon points="${coords(shot.figura,0,0,26*geo.escala,shot.figura===4?-Math.PI/4:-Math.PI/2)}" fill="${colorFigura(shot.figura)}" stroke="#f9edff" stroke-width="3" stroke-linejoin="round"/></g></g>`;
 const bullet=layer.querySelector('.shot');
 if(!await animate(bullet,[{transform:`translateY(${geo.yJugador-42*geo.escala}px)`},{transform:`translateY(${hitY}px)`}],{duration:400,easing:'ease-in'}))return;
 if(game!==state||epoch!==token||!dialog.open)return;
 if(!shot.objetivo){
  // Tras cruzar el pasillo, el proyectil se dirige al centro del escudo del jefe.
  if(!await animate(bullet,[{transform:`translate(0px,${hitY}px)`},{transform:`translate(${geo.ancho/2-x}px,${60*geo.escala}px)`}],{duration:180,easing:'ease-out'}))return;
  if(game!==state||epoch!==token||!dialog.open)return;
 }
 if(shot.objetivo&&shot.figura!==shot.objetivo.lados){
  if(!await animate(bullet,[{transform:`translateY(${hitY}px)`},{transform:`translateY(${geo.yBloques+(shot.indice+1)*geo.paso}px)`}],{duration:230,easing:'ease-out'}))return;
 }else if(!shot.objetivo&&shot.figura!==state.nivel){
  const shield=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
  shield.setAttribute('cx',geo.ancho/2);shield.setAttribute('cy',60*geo.escala);shield.setAttribute('rx',157*geo.escala);shield.setAttribute('ry',45*geo.escala);shield.setAttribute('fill','none');shield.setAttribute('stroke','#ffa9e5');shield.setAttribute('stroke-width','5');layer.append(shield);
  await Promise.all([animate(shield,[{opacity:1},{opacity:0}],{duration:320}),animate(bullet,[{transform:`translate(${geo.ancho/2-x}px,${60*geo.escala}px)`,opacity:1},{transform:`translate(${geo.ancho/2-x}px,${100*geo.escala}px)`,opacity:0}],{duration:320,easing:'ease-out'})]);
 }else{
  const target=shot.objetivo?$(`[data-block="${shot.objetivo.id}"]`):$('.enemy');
  await Promise.all([animate(target,[{opacity:1},{opacity:0}],{duration:180}),burst(layer,shot.objetivo?x:geo.ancho/2,shot.objetivo?hitY:60*geo.escala)]);
 }
 if(game!==state||epoch!==token||!dialog.open)return;
 const outcome=resolverDisparo(state,shot.id);if(!outcome)return;
 if(outcome.tipo==='victoria'){
  missions++;learned.add(shot.figura);$('#victory-text').textContent=game.nivel===NIVEL_FINAL?'¡Del 3 al 20! Has vencido a todos los jefes. La galaxia es tuya.':`¡${game.nivel}-ágono vencido con ${nombre(shot.figura)}! Te espera el jefe ${game.nivel+1}-ágono.`;message(`✦ ¡Jefe ${game.nivel}-ágono superado!`,'victoria');
 }else if(outcome.tipo==='acierto'){
  learned.add(shot.figura);const open=pasillos(game);message(open.length?`↑ Columna ${open[0]+1} libre. ¡Ataca al jefe con ${nombre(game.nivel)}!`:`✓ ${nombre(shot.figura)} · ${shot.figura} lados · ¡Impacto!`,'acierto');
 }else if(outcome.tipo==='escudo')message(`¡Escudo! El ${game.nivel}-ágono necesita ${nombre(game.nivel)}. ¡Vuelve a lanzar!`,'error');
 else message(`${nombre(shot.figura)} = ${shot.figura} lados, no ${shot.objetivo.lados}. ¡Figura acumulada!`,'error');
 render();
 if(game.fase==='ayuda')$('#rescue').focus({preventScroll:true});
 if(game.fase==='ganado')victoryFocus().focus({preventScroll:true});
}
$('#fire').onclick=()=>{fire();focusField();};
function newMission(nivel=game.nivel){
 cancelVisuals();game=crearJuego(Number($('#game-mode').value),Math.random,nivel);render();message(`Nivel ${game.nivel}. Abre camino y vence al ${game.nivel}-ágono con ${nombre(game.nivel)}.`,'nuevo');
}
$('#new-mission').onclick=()=>{newMission();focusField();};$('#play-again').onclick=()=>{newMission(game.nivel===NIVEL_FINAL?NIVEL_INICIAL:game.nivel);focusField();};$('#game-mode').onchange=()=>newMission();
$('#next-level').onclick=()=>{
 const next=avanzarNivel(game);if(!next)return;cancelVisuals();game=next;render();message(`Nivel ${game.nivel}. ¡El ${game.nivel}-ágono te espera!`,'nuevo');focusField();
};
$('#rescue').onclick=()=>{if(rescatar(game)){render();message('✧ Energía recuperada. ¡Sigue jugando!','ayuda');focusField();}};
inspect(3);render();
