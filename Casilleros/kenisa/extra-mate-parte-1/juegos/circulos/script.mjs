import {iniciarJuegos} from './juego-ui.mjs?v=20261002-circulos5';
import {PARTES,fraccion,radianes,punto,limitar,deltaGiro,formato,elemento,seriePartes,serieMedidas,serieConversiones,crearEstado} from './modelo.mjs?v=20261002-circulos5';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fraction=(n,d)=>`<span class="fraction" role="math" aria-label="${esc(n)} dividido entre ${esc(d)}"><span aria-hidden="true">${n}</span><span aria-hidden="true">${d}</span></span>`;
const piText=f=>f.n===0?'0':`${f.n===1?'':f.n}π${f.d===1?'':`/${f.d}`}`;
const piHTML=f=>f.n===0?'0':f.d===1?`${f.n===1?'':f.n}π`:fraction(`${f.n===1?'':f.n}π`,f.d);
const names={r:'radio',d:'diámetro',P:'perímetro',A:'área'};
const svg=(body,label,height=440)=>`<svg viewBox="0 0 480 ${height}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const line=(a,b,extra='')=>`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" ${extra}/>`;

function partsDiagram(target='all',rotation=0,r=110,uid='guide'){
  const all=target==='all',parts=all?PARTES:PARTES.filter(p=>p.id===target);
  let body=`<circle cx="240" cy="230" r="${r}" fill="#eff7f8" stroke="${target==='circunferencia'?'#426ba1':'#adb9ca'}" stroke-width="${target==='circunferencia'?6:2}"/>`;
  for(const p of parts){
    if(p.id==='circunferencia'){body+=`<circle cx="240" cy="230" r="${r}" fill="none" stroke="${p.color}" stroke-width="4"/>`;continue;}
    const g=elemento(p.id,rotation,r),isLine=p.id==='secante'||p.id==='tangente';
    if(isLine)body+=`<defs><marker id="${uid}-${p.id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="${p.color}"/></marker></defs>`;
    if(p.id==='arco')body+=`<path d="M ${g.cortes[0].x} ${g.cortes[0].y} A ${r} ${r} 0 0 0 ${g.cortes[1].x} ${g.cortes[1].y}" fill="none" stroke="${p.color}" stroke-width="7"/>`;
    else body+=line(...g.segmento,`stroke="${p.color}" stroke-width="5" stroke-linecap="round" ${isLine?`marker-start="url(#${uid}-${p.id})" marker-end="url(#${uid}-${p.id})"`:''}`);
    body+=g.cortes.map(v=>`<circle cx="${v.x}" cy="${v.y}" r="5" fill="white" stroke="${p.color}" stroke-width="2.5"/>`).join('');
    if(p.id==='tangente'&&!all)body+=line(g.centro,g.cortes[0],'stroke="#6c8598" stroke-width="2" stroke-dasharray="5 5"');
  }
  body+='<circle cx="240" cy="230" r="5" fill="#293548"/><text x="223" y="253" font-size="16">O</text>';
  if(all)body+='<g font-size="17" font-weight="700"><path d="M 140 60 L 164 149" fill="none" stroke="#426ba1"/><text x="15" y="48">Circunferencia</text><path d="M 297 110 L 278 163" fill="none" stroke="#18766e"/><text x="274" y="94">Radio</text><path d="M 92 204 L 157 230" fill="none" stroke="#7052a2"/><text x="15" y="192">Diámetro</text><path d="M 92 347 L 111 285" fill="none" stroke="#a35f16"/><text x="28" y="370">Secante</text><path d="M 384 148 L 350 177" fill="none" stroke="#ae416b"/><text x="370" y="134">Tangente</text><path d="M 100 108 L 183 175" fill="none" stroke="#825499"/><text x="20" y="100">Cuerda</text><path d="M 100 400 L 175 319" fill="none" stroke="#bc4b26"/><text x="50" y="423">Arco</text></g>';
  return svg(body,all?'Circunferencia, radio, diámetro, cuerda, arco, secante y tangente.':`Elemento resaltado: ${PARTES.find(p=>p.id===target).texto}`,all?440:480);
}
function measureDiagram(q){
  const diameter=q.from==='d'||q.to==='d',area=q.from==='A'||q.to==='A',a={x:diameter?130:240,y:230},b={x:350,y:230};
  const measure=q.from==='r'||q.from==='d'?`${q.from} = ${formato(q.given)} ${q.givenUnit||'cm'}`:`${diameter?'d':'r'} = ?`;
  return svg(`<circle cx="240" cy="230" r="110" fill="${area?'#d9efeb':'#f8fafc'}" stroke="#18766e" stroke-width="${area?3:6}"/>${line(a,b,'stroke="#7052a2" stroke-width="4"')}<circle cx="240" cy="230" r="5" fill="#293548"/><text x="240" y="70" text-anchor="middle" font-size="24" font-weight="700">${q.to} = ?</text><text x="${diameter?240:293}" y="210" text-anchor="middle" font-size="19">${measure}</text><text x="240" y="400" text-anchor="middle" font-size="16">${area?'Área: superficie interior':'Perímetro: longitud del borde'}</text>`,`${area?'Superficie del círculo':'Borde del círculo'} resaltado; ${measure}`);
}

const states={partes:crearEstado(seriePartes()),medidas1:crearEstado(serieMedidas(1)),medidas2:crearEstado(serieMedidas(2)),conversiones:crearEstado(serieConversiones())};
let angle=90,example='P',exampleStep=1,rule='rad',ruleStep=1,frame=0,drag=null,stampsKey='';
const visited=new Set([90]);
const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateProgress(){
  const total=Object.values(states).reduce((n,s)=>n+s.resueltos,0);$('#total-progress').textContent=`${total} retos resueltos · ¡Siempre hay otro por descubrir!`;
  $('#level1-progress').textContent=`${states.medidas1.resueltos} resueltos`;$('#level2-progress').textContent=`${states.medidas2.resueltos} resueltos`;
  const achievements={partes:states.partes.resueltos>=14,medidas:states.medidas1.resueltos>=8&&states.medidas2.resueltos>=8,vuelta:visited.size===4,conversiones:states.conversiones.resueltos>=12};
  $$('[data-badge]').forEach(el=>{const done=achievements[el.dataset.badge];el.classList.toggle('earned',done);el.textContent=(done?'✓':'○')+el.textContent.slice(1);});
}
$('#part-buttons').innerHTML=PARTES.map(p=>`<button class="geo-button" type="button" data-part="${p.id}" aria-pressed="false"><i style="--part-color:${p.color}" aria-hidden="true"></i>${p.nombre}</button>`).join('');
function selectPart(id){
  $('#parts-diagram').innerHTML=partsDiagram(id);$$('[data-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.part===id)));
  const p=PARTES.find(p=>p.id===id);$('#part-info').innerHTML=p?`<h3>${p.nombre}</h3><p>${p.texto}</p>`:'<h3>Siete pistas en un círculo</h3><p>Compara cuántas veces toca el borde cada trazo y si pasa por el centro.</p>';
}
$$('[data-part]').forEach(b=>b.addEventListener('click',()=>selectPart(b.dataset.part)));$('#show-all').addEventListener('click',()=>selectPart('all'));selectPart('all');

const examples={
  P:{q:{from:'r',to:'P',given:4},title:'Un círculo tiene radio de 4 cm. ¿Cuál es su perímetro?',steps:['Identifica el dato: <strong>r = 4 cm</strong>.','Elige la fórmula: <strong>P = 2πr</strong>.','Sustituye: <strong>P = 2 × π × 4 = 8π cm</strong>.','Resultado exacto: <strong>8π cm</strong>. Conserva π; el perímetro es una longitud.']},
  A:{q:{from:'r',to:'A',given:4},title:'El mismo radio, 4 cm. ¿Cuánta superficie ocupa?',steps:['Identifica el dato: <strong>r = 4 cm</strong>.','Elige la fórmula: <strong>A = πr²</strong>.','Eleva primero el radio al cuadrado: <strong>A = π × 4² = 16π cm²</strong>.','Resultado exacto: <strong>16π cm²</strong>. Conserva π; el área usa unidades cuadradas.']},
  r:{q:{from:'d',to:'P',given:12},title:'El diámetro mide 12 cm. Encuentra el perímetro.',steps:['Identifica <strong>d = 12 cm</strong>.','Usa <strong>P = πd</strong>.','Sustituye: <strong>P = π × 12 = 12π cm</strong>.']},
  d:{q:{from:'d',to:'A',given:10},title:'El diámetro mide 10 cm. Encuentra el área.',steps:['Identifica <strong>d = 10 cm</strong>.','Obtén el radio: <strong>r = 10 ÷ 2 = 5 cm</strong>.','Usa <strong>A = πr² = π × 5² = 25π cm²</strong>.']}
};
function renderExample(){const e=examples[example];$('#example-diagram').innerHTML=measureDiagram(e.q);$('#example-question').textContent=e.title;$('#example-steps').innerHTML=e.steps.slice(0,exampleStep).map(s=>`<li>${s}</li>`).join('');$('#example-next').disabled=exampleStep===e.steps.length;$('#example-next').textContent=exampleStep===e.steps.length?'Ejemplo completo ✓':'Ver siguiente paso →';}
$$('[data-example]').forEach(b=>b.addEventListener('click',()=>{example=b.dataset.example;exampleStep=1;$$('[data-example]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderExample();}));$('#example-next').addEventListener('click',()=>{exampleStep++;renderExample();});renderExample();

function stopAnimation(){cancelAnimationFrame(frame);frame=0;$('#full-turn').textContent='Ver una vuelta ↻';}
function updateAngle(value){
  angle=limitar(value);const g=Math.round(angle),p=punto(g),ratio=radianes(g),f=fraccion(g,360);
  let sector='',arc='';
  if(g===360){sector='<circle cx="240" cy="240" r="150" fill="#dcefeb"/>';arc='<circle cx="240" cy="240" r="150" fill="none" stroke="#18766e" stroke-width="6"/>';}
  else if(g>0){sector=`<path d="M240 240 L390 240 A150 150 0 ${g>180?1:0} 0 ${p.x} ${p.y} Z" fill="#dcefeb"/>`;arc=`<path d="M390 240 A150 150 0 ${g>180?1:0} 0 ${p.x} ${p.y}" fill="none" stroke="#18766e" stroke-width="6"/>`;}
  $('#unit-svg').innerHTML=`<path d="M45 240 H435 M240 45 V435" stroke="#c9d1df" stroke-width="1.5"/>${sector}<circle cx="240" cy="240" r="150" fill="none" stroke="#a4b2c5" stroke-width="2"/>${arc}<path d="M240 240 H390" stroke="#3f4f65" stroke-width="3"/>${line({x:240,y:240},p,'stroke="#18766e" stroke-width="4"')}<circle cx="240" cy="240" r="5" fill="#293548"/><g font-size="16" text-anchor="middle"><text x="240" y="50">90°</text><text x="60" y="225">180°</text><text x="240" y="433">270°</text><text x="414" y="217">0° / 360°</text><text x="306" y="264">r = 1</text><text x="225" y="264">O</text></g>`;
  const handle=$('#unit-handle');handle.style.left=`${p.x/4.8}%`;handle.style.top=`${p.y/4.8}%`;handle.setAttribute('aria-valuenow',g);handle.setAttribute('aria-valuetext',`${g} grados, ${piText(ratio)} radianes`);
  $('#angle-range').value=g;$('#angle-range').setAttribute('aria-valuetext',`${g} grados, ${piText(ratio)} radianes`);$('#unit-equivalence').innerHTML=`<span>${g}°</span><span>=</span><span>${piHTML(ratio)} rad</span>`;$('#turn-description').textContent=g===0?'Todavía no has girado.':g===360?'¡Una vuelta completa! El punto vuelve al inicio, pero has recorrido 360°.':`${f.n}/${f.d} de una vuelta. Cambia la unidad; el ángulo es el mismo.`;
  $$('[data-angle]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.angle)===g)));
  if([90,180,270,360].includes(g))visited.add(g);
  const stampState=[...visited].sort((a,b)=>a-b).join(',');
  if(stampState!==stampsKey){stampsKey=stampState;$('#orbit-stamps').innerHTML=[90,180,270,360].map(v=>`<span class="${visited.has(v)?'visited':''}">${visited.has(v)?'✓':'○'} ${v}°</span>`).join('');updateProgress();}
}
$('#angle-range').addEventListener('input',e=>{stopAnimation();updateAngle(Number(e.target.value));});$$('[data-angle]').forEach(b=>b.addEventListener('click',()=>{stopAnimation();updateAngle(Number(b.dataset.angle));}));
function pointerAngle(e){const p=$('#unit-svg').createSVGPoint();p.x=e.clientX;p.y=e.clientY;const local=p.matrixTransform($('#unit-svg').getScreenCTM().inverse());return (Math.atan2(240-local.y,local.x-240)*180/Math.PI+360)%360;}
$('#unit-handle').addEventListener('pointerdown',e=>{if(e.button!==0)return;stopAnimation();drag={id:e.pointerId,last:pointerAngle(e)};e.currentTarget.setPointerCapture(e.pointerId);e.preventDefault();});
$('#unit-handle').addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const raw=pointerAngle(e);updateAngle(angle+deltaGiro(drag.last,raw));drag.last=raw;});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('#unit-handle').addEventListener(event,()=>{drag=null;});
$('#unit-handle').addEventListener('keydown',e=>{const step=e.shiftKey?10:1;if(['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();stopAnimation();updateAngle(e.key==='Home'?0:e.key==='End'?360:angle+(['ArrowUp','ArrowRight'].includes(e.key)?step:-step));}});
$('#full-turn').addEventListener('click',()=>{if(frame){stopAnimation();return;}if(motion()){updateAngle(360);return;}updateAngle(0);const start=performance.now();$('#full-turn').textContent='Detener la vuelta';const tick=now=>{updateAngle(Math.min(360,(now-start)/2400*360));if(angle<360)frame=requestAnimationFrame(tick);else stopAnimation();};frame=requestAnimationFrame(tick);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopAnimation();});
const rules={rad:['Escribe la equivalencia: <strong>360° ↔ 2π rad</strong>.','Coloca lo que buscas: <strong>150° ↔ x rad</strong>.','Multiplica en cruz y divide: <strong>x = '+fraction('150 × 2π','360')+' = '+fraction('300π','360')+'</strong>.','Simplifica entre 60: <strong>150° = '+piHTML({n:5,d:6})+' rad</strong>.'],deg:['Escribe la equivalencia: <strong>2π rad ↔ 360°</strong>.','Coloca lo que buscas: <strong>'+piHTML({n:7,d:6})+' rad ↔ x°</strong>.','Multiplica en cruz y divide: <strong>x = ('+piHTML({n:7,d:6})+' × 360°) ÷ 2π</strong>.','Se cancela π: <strong>x = '+fraction('7 × 360°','6 × 2')+' = 210°</strong>.']};
function renderRule(){$('#rule-steps').innerHTML=rules[rule].slice(0,ruleStep).map(s=>`<li>${s}</li>`).join('');$('#rule-next').disabled=ruleStep===4;$('#rule-next').textContent=ruleStep===4?'Conversión completa ✓':'Ver siguiente paso →';}
$$('[data-rule]').forEach(b=>b.addEventListener('click',()=>{rule=b.dataset.rule;ruleStep=1;$$('[data-rule]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderRule();}));$('#rule-next').addEventListener('click',()=>{ruleStep++;renderRule();});renderRule();updateAngle(90);

iniciarJuegos({states,partsDiagram,measureDiagram,piHTML,piText,esc,updateProgress});
function activateStation(focus=false){const id=['partes','medidas','radianes','conversiones'].includes(location.hash.slice(1))?location.hash.slice(1):'partes';stopAnimation();const station=id==='conversiones'?'radianes':id;$$('.station').forEach(s=>s.hidden=s.id!==station);$$('[data-station]').forEach(a=>{if(a.dataset.station===station)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});if(focus){$(`#${id}-title`).focus({preventScroll:true});$(`#${id}`).scrollIntoView({block:'start'});}}
window.addEventListener('hashchange',()=>activateStation(true));$('.circle-site').addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.hash===location.hash){e.preventDefault();activateStation(true);}});activateStation();
