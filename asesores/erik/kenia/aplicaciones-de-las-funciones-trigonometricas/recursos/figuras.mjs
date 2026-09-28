// Ilustraciones vectoriales locales: el triángulo de medida conserva sus vértices
// (100,80), (100,260), (330,260), independientemente del decorado.
const palettes = [
 ['#eaf6ee','#afd6ad','#447f66','#efb45f'],
 ['#f3edfa','#d2bfea','#8365a3','#edb989'],
 ['#eaf4fc','#b8d5e9','#4d83a2','#efbd61']
];
const variants = {
 'La cuerda del árbol':0,'Un atajo por el jardín':0,'La escalera del mirador':0,'Sujeta la tienda':0,
 'Alcanza la ventana':1,'Cruza la plaza':1,'Ancla el mástil':1,'Prepara la rampa':1,
 'La estaca del árbol':2,'Inclinación del acceso':2,'Los ángulos del terreno':2,'Escalera a la azotea':2
};
const flower=(x,y,color='#ed9fb0')=>`<g transform="translate(${x} ${y})"><path d="M0 0V12M0 8L5 5" stroke="#6a9976" stroke-width="2"/><path d="M-5 0a5 5 0 1 1 10 0a5 5 0 1 1-10 0" fill="${color}"/><circle r="2" fill="#fff1b4"/></g>`;
const cloud=(x,y)=>`<path d="M${x} ${y}h38a9 9 0 0 0-4-17a12 12 0 0 0-23-3a10 10 0 0 0-11 20" fill="white" opacity=".85"/>`;
const grass=(x,y)=>`<path d="M${x-5} ${y}l-3-9m8 9v-13m3 13l5-8" stroke="#81af81" stroke-width="2" stroke-linecap="round"/>`;
function tree(v){
 return `<path d="M89 261L95 88H105L112 261Z" fill="#b68059"/><path d="M101 226V101M100 161L78 140M101 137L123 119" fill="none" stroke="#8e6249" stroke-width="3"/>
 <g transform="translate(0 34)"><g fill="${v===2?'#eab77d':'#a0cca2'}"><circle cx="74" cy="102" r="31"/><circle cx="124" cy="98" r="29"/><circle cx="100" cy="80" r="34"/></g><g fill="${v===2?'#d29364':'#6eaa83'}"><circle cx="78" cy="88" r="17"/><circle cx="112" cy="111" r="18"/></g><path d="M83 69q10-8 17-6" fill="none" stroke="#e6f3bf" stroke-width="5" stroke-linecap="round"/></g>
 <path d="M330 253v18" stroke="#9b7254" stroke-width="7" stroke-linecap="round"/><ellipse cx="331" cy="278" rx="21" ry="4" fill="#699477" opacity=".15"/>${grass(150,263)}${flower(281,264)}${flower(294,266,'#f2c665')}${grass(61,265)}
 <path d="M273 84q7-9 14 0q7-9 14 0" fill="none" stroke="#7e9d9c" stroke-width="2"/>`;
}
function building(v,accent){
 const windows=v===0?'<path d="M40 80V48H98V80M43 49H96M56 50V78M82 50V78" fill="none" stroke="#809a92" stroke-width="3"/><path d="M32 46L70 26L106 46Z" fill="#83a28c"/>':v===1?'<rect x="38" y="35" width="62" height="49" fill="#ddd2e8"/><path d="M33 35H104" stroke="#8365a3" stroke-width="6"/><rect x="63" y="43" width="35" height="37" rx="3" fill="#deeff8" stroke="#9b83b4" stroke-width="3"/><path d="M80 44V78M64 62H97" stroke="#9b83b4" stroke-width="2"/><path d="M60 81H102" stroke="#8365a3" stroke-width="5"/><path d="M66 47L73 57M85 47L91 55" stroke="white" stroke-width="3"/>':'<path d="M52 81V64H62V81M77 81V64H87V81" fill="none" stroke="#6e97b3" stroke-width="6"/>';
 const rungs=Array.from({length:12},(_,i)=>{const t=(i+1)/13,x=100+230*t,y=80+180*t;return `<path d="M${x-5} ${y+6}l10-12"/>`;}).join('');
 return `<rect x="38" y="80" width="62" height="180" rx="3" fill="${v===0?'#d3dfc8':v===1?'#ddd2e8':'#c4dbea'}"/><path d="M33 80H105" stroke="${accent}" stroke-width="9" stroke-linecap="round"/>${windows}<g stroke="white" opacity=".6" stroke-width="2"><path d="M40 146H98M40 181H98M40 219H98M62 146v35M79 181v38M61 219v40"/></g><rect x="58" y="230" width="20" height="30" rx="10" fill="${accent}" opacity=".5"/>
 <g stroke="#c3944c" stroke-width="4" stroke-linecap="round"><path d="M95 86L325 266M105 74L335 254"/>${rungs}</g><path d="M321 269l10-12" stroke="#736b66" stroke-width="5" stroke-linecap="round"/>${flower(359,264)}${grass(288,267)}`;
}
function park(v,accent){
 const beds=v===0?`<rect x="116" y="99" width="67" height="42" rx="13" fill="#a6cdb0"/><rect x="242" y="204" width="70" height="39" rx="13" fill="#a6cdb0"/>${[128,149,171].map(x=>flower(x,112)).join('')}${[252,275,299].map(x=>flower(x,218,'#e9bb5d')).join('')}`:v===1?'<circle cx="274" cy="128" r="25" fill="#fff5eb"/><circle cx="274" cy="128" r="18" fill="#b4dbe7"/><path d="M274 142v-27m0 5q-14-15-17 0m17 0q14-15 17 0" fill="none" stroke="#70b5cf" stroke-width="3"/><rect x="125" y="203" width="45" height="12" rx="4" fill="#bf9674"/><path d="M132 215v8m30-8v8" stroke="#967758" stroke-width="3"/>':Array.from({length:4},(_,i)=>`<path d="M${127+i*22} 185v51" stroke="#bbce98" stroke-width="12" stroke-linecap="round"/>`).join('');
 return `<rect x="89" y="69" width="252" height="202" rx="17" fill="${v===1?'#e7d9e9':'#d5e6ba'}"/><rect x="100" y="80" width="230" height="180" rx="2" fill="${v===1?'#f3eaf1':'#e4efcd'}" stroke="${accent}" stroke-width="2"/>${beds}<path d="M100 80L330 260" stroke="#fff9e9" stroke-width="18"/><g fill="${accent}" opacity=".6">${[[100,80],[330,80],[100,260],[330,260]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>${flower(355,113)}${flower(56,230,'#f0c665')}<text x="215" y="37" text-anchor="middle" fill="#64766f" font-size="11" font-family="system-ui" letter-spacing="2">VISTA DESDE ARRIBA</text>`;
}
function camp(v,accent){
 return `<path d="M100 80V260" stroke="#9c866d" stroke-width="7" stroke-linecap="round"/>${v===0?'<path d="M100 142L42 259H204Z" fill="#eab77e"/><path d="M100 142L90 260H42Z" fill="#cf9970"/><path d="M100 180L81 259H128Z" fill="#72625e"/><path d="M100 142L204 259" stroke="#fbe7bb" stroke-width="3"/>':'<path d="M103 81H160L147 100L160 118H103Z" fill="#b798cf"/><path d="M110 89h32" stroke="#eae0f3" stroke-width="3"/>'}<path d="M330 253v18" stroke="#9b7254" stroke-width="7" stroke-linecap="round"/>${grass(244,265)}${flower(271,267)}<g transform="translate(352 236)"><rect width="24" height="27" rx="7" fill="${accent}"/><path d="M6 0v-6h12v6M5 15h14" fill="none" stroke="#f2e6cc" stroke-width="3"/></g>`;
}
function ramp(v,accent){
 return `<rect x="49" y="80" width="51" height="180" rx="5" fill="${v===2?'#c7dfeb':'#dccded'}"/><path d="M100 80L330 260H100Z" fill="${v===2?'#b7d2e1':'#c9b4dd'}"/><path d="M115 117V247H283Z" fill="white" opacity=".45"/><path d="M100 80L330 260" stroke="#b39a78" stroke-width="12"/><path d="M99 62L329 242M102 62V80M178 122v20M254 181v20M327 239v20" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/><path d="M48 80h53" stroke="#9986a6" stroke-width="7"/><g fill="#faf4e8"><circle cx="115" cy="104" r="3"/><circle cx="183" cy="157" r="3"/><circle cx="253" cy="212" r="3"/></g>${flower(355,262)}${grass(62,264)}`;
}

function sceneDetails(q,accent){
 if(q.scene==='tree')return `<path d="M104 85L325 257" stroke="#f3e1b8" stroke-width="5"/><path d="M99 77q-8 3 0 8q8 3 8-3" fill="none" stroke="#96734a" stroke-width="2"/><path d="M329 254l8 5-8 4" fill="none" stroke="#96734a" stroke-width="2"/><g fill="#e6dfcf"><ellipse cx="169" cy="275" rx="9" ry="4"/><ellipse cx="188" cy="272" rx="5" ry="3"/></g>`;
 if(q.scene==='tent')return `<path d="M104 84L327 257" stroke="#e7d8bd" stroke-width="5"/><path d="M331 270l-7 5m7-5 8 4" stroke="#ad9676" stroke-width="2"/><circle cx="100" cy="80" r="6" fill="#c2a577"/>`;
 if(q.scene==='ramp')return `<path d="M52 80H99" stroke="#f6ead9" stroke-width="3"/><path d="M106 263H324" stroke="${accent}" stroke-width="4" opacity=".2"/><rect x="350" y="242" width="14" height="20" rx="3" fill="#ddb17b"/><path d="M357 245v-13m0 8-6-6m6 3 5-7" stroke="#72a087" stroke-width="3"/>`;
 if(q.scene==='park')return `<g fill="${accent}" opacity=".6"><circle cx="322" cy="89" r="4"/><circle cx="312" cy="89" r="4"/></g><path d="M332 283h24" stroke="${accent}" stroke-width="3" stroke-linecap="round"/><path d="M337 279v9m12-9v9" stroke="${accent}" stroke-width="2"/>`;
 return `<path d="M322 266h17" stroke="#6e777d" stroke-width="4" stroke-linecap="round"/><g fill="#f5dfab"><circle cx="140" cy="111" r="2"/><circle cx="210" cy="166" r="2"/><circle cx="281" cy="221" r="2"/></g>`;
}
export function illustratedDiagram(q){
 const v=variants[q.title]??0,[sky,ground,accent,sun]=palettes[v];
 const names={a:'C.A.',b:'C.O.',c:'H.'};
 const val=k=>q.target===k?'? m':q[k]===undefined?'—':`${q[k]} m`;
 const label=(k,x,y,rotate=0)=>{
  const missing=q.target===k,known=q[k]!==undefined;
  return `<g transform="translate(${x} ${y}) rotate(${rotate})" class="side-label" data-side="${k}"><rect x="-38" y="-24" width="76" height="48" rx="13" fill="${missing?'#725098':'#fff'}" stroke="${missing?'#725098':'#d9e4df'}"/><text y="-7" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="650" fill="${missing?'#eee5fa':'#657b82'}">${names[k]}</text><text class="side-value" y="14" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="750" fill="${missing?'#fff':known?'#304c60':'#849097'}">${val(k)}</text></g>`;
 };
 const scene={tree:()=>tree(v),ladder:()=>building(v,accent),park:()=>park(v,accent),tent:()=>camp(v,accent),ramp:()=>ramp(v,accent)}[q.scene]();
 const edges={a:'M100 260H330',b:'M100 80V260',c:'M100 80L330 260'};
 const target=edges[q.target];
 const angleUnknown=q.theta===undefined;
 const alpha=q.target==='all';
 return `<svg class="mission-art" viewBox="0 0 410 346" role="img" aria-label="${q.title}. ${q.scene==='park'?'Vista desde arriba. ':''}Cateto adyacente ${val('a')}, cateto opuesto ${val('b')}, hipotenusa ${val('c')}. Ángulo θ ${angleUnknown?'desconocido':q.theta+' grados'}, en el extremo inferior derecho.${alpha?' Ángulo α en el extremo superior izquierdo; ángulo recto de 90 grados.':''} Dibujo no a escala.">
 <rect x="7" y="7" width="396" height="332" rx="28" fill="${sky}"/>
 ${q.scene==='park'?'':`<circle cx="348" cy="48" r="18" fill="${sun}" opacity=".7"/>${cloud(197,49)}${cloud(282,105)}<path d="M8 253q95-20 190 2t204-6v58q0 28-28 28H35q-28 0-28-28Z" fill="${ground}" opacity=".45"/><path d="M30 262H377" stroke="${accent}" opacity=".3" stroke-width="2"/>`}
 ${scene}${sceneDetails(q,accent)}
 <g fill="none" stroke="#436477" stroke-width="2" stroke-linejoin="round"><path d="M100 80V260H330" stroke-dasharray="5 5"/><path d="M100 80L330 260"/></g>
 ${target?`<path d="${target}" fill="none" stroke="white" stroke-width="6" opacity=".75"/><path d="${target}" fill="none" stroke="#725098" stroke-width="3" stroke-dasharray="${q.target==='c'?'none':'6 4'}"/>`:''}
 <path d="M330 260L285 260A45 45 0 0 1 294.57 232.27Z" fill="#b879a6" opacity=".22"/><path d="M285 260A45 45 0 0 1 294.57 232.27" fill="none" stroke="#873f6a" stroke-width="3"/>
 <path d="M100 244H116V260H100Z" fill="white" stroke="#436477" stroke-width="2"/>
 ${alpha?'<path d="M100 80V115A35 35 0 0 0 127.56 101.58Z" fill="#b879a6" opacity=".22"/><path d="M100 115A35 35 0 0 0 127.56 101.58" fill="none" stroke="#873f6a" stroke-width="2.5"/><rect x="116" y="129" width="56" height="27" rx="11" fill="#725098"/><text x="144" y="148" text-anchor="middle" fill="white" font-family="system-ui" font-size="17" font-weight="700">α = ?</text><text x="129" y="246" fill="#436477" font-family="system-ui" font-size="14" font-weight="650">90°</text>':''}
 <g fill="#436477"><circle cx="100" cy="80" r="4"/><circle cx="330" cy="260" r="4"/></g>
 ${label('a',215,307)}${label('b',46,174,-90)}${label('c',242,150,38)}
 <path d="M313 227L306 240" stroke="#873f6a" stroke-width="1.5"/>
 <rect x="278" y="197" width="112" height="30" rx="12" fill="${angleUnknown?'#725098':'#fff'}" stroke="${angleUnknown?'#725098':'#e2bfd1'}"/><text x="334" y="218" text-anchor="middle" fill="${angleUnknown?'white':'#873f6a'}" font-family="system-ui" font-size="17" font-weight="700">θ = ${angleUnknown?'?':q.theta}°</text></svg>`;
}
