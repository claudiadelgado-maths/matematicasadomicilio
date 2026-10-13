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
 'El cable del árbol':2,'La altura del acceso':2,'El ancho del terreno':2,'Escalera a la azotea':2
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
 const windows=v===0?'<path d="M56 79V60H78V79" fill="#deeff0" stroke="#809a92" stroke-width="3"/>':v===1?'<rect x="54" y="77" width="37" height="46" rx="5" fill="#dceff6" stroke="#9b83b4" stroke-width="4"/><path d="M72 79v42M56 99h33" stroke="#9b83b4" stroke-width="3"/>':'<path d="M52 81V64H62V81M77 81V64H87V81" fill="none" stroke="#6e97b3" stroke-width="6"/>';
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
export function illustratedDiagram(q){
 const v=variants[q.title]??0,[sky,ground,accent,sun]=palettes[v];
 const val=k=>`${q.missing===k?'?':q[k]} m`;
 const label=(k,x,y,rotate=0)=>`<g transform="translate(${x} ${y}) rotate(${rotate})"><rect x="-34" y="-15" width="68" height="30" rx="12" fill="${q.missing===k?'#725098':'#ffffff'}" stroke="${q.missing===k?'#725098':'#e0e4e4'}"/><text y="6" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="700" fill="${q.missing===k?'white':'#304c60'}">${val(k)}</text></g>`;
 const scene={tree:()=>tree(v),ladder:()=>building(v,accent),park:()=>park(v,accent),tent:()=>camp(v,accent),ramp:()=>ramp(v,accent)}[q.scene]();
 return `<svg class="mission-art" viewBox="0 0 410 330" role="img" aria-label="${q.title}. ${q.scene==='park'?'Vista desde arriba. ':''}Triángulo rectángulo: lado horizontal ${val('a')}, lado vertical ${val('b')}, diagonal ${val('c')}. Dibujo no a escala."><rect x="7" y="7" width="396" height="316" rx="28" fill="${sky}"/>${q.scene==='park'?'':`<circle cx="348" cy="48" r="18" fill="${sun}" opacity=".7"/>${cloud(197,49)}${cloud(282,105)}<path d="M8 253q95-20 190 2t204-6v46q0 28-28 28H35q-28 0-28-28Z" fill="${ground}" opacity=".45"/><path d="M30 262H377" stroke="${accent}" opacity=".3" stroke-width="2"/>`}${scene}<g fill="none" stroke="#3b6074" stroke-width="2.5" stroke-linejoin="round"><path d="M100 80V260H330" stroke-dasharray="5 5"/><path d="M100 80L330 260"/><path d="M100 244H116V260" fill="#fff"/></g><g fill="#3b6074"><circle cx="100" cy="80" r="4"/><circle cx="330" cy="260" r="4"/></g>${label('a',215,298)}${label('b',49,170,-90)}${label('c',240,155,38)}</svg>`;
}


