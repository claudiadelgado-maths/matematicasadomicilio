import {puntos,nombre} from './modelo.mjs?v=20261007-niveles1';

// Paleta compartida por la galería, las defensas y las partículas. Sin rojos.
export const PALETA=['#77e7ed','#c2a2ff','#a2edb7','#ffe990','#ffa9e5','#8abbff'];
const BORDES=['#168c9b','#7752bb','#268a60','#8c7516','#ab438c','#3d71bd'];
export const colorFigura=n=>PALETA[(n-3)%PALETA.length];
export const coords=(n,cx,cy,r,giro)=>puntos(n,cx,cy,r,giro).map(p=>`${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
export function poligono(n,{size=220,contados=0,label='',decorative=false}={}){
 const c=size/2,r=size*.34,ps=puntos(n,c,c,r,n===4?-Math.PI/4:-Math.PI/2);
 let marks='';
 for(let i=0;i<contados&&i<n;i++){
  const a=ps[i],b=ps[(i+1)%n],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},dx=mid.x-c,dy=mid.y-c,len=Math.hypot(dx,dy),x=mid.x+dx/len*18,y=mid.y+dy/len*18;
  marks+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${PALETA[i%PALETA.length]}" stroke-width="7" stroke-linecap="round"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="700" fill="${BORDES[i%BORDES.length]}">${i+1}</text>`;
 }
 return `<svg viewBox="0 0 ${size} ${size}" ${decorative?'aria-hidden="true"':`role="img" aria-label="${label}"`}><polygon points="${ps.map(p=>`${p.x},${p.y}`).join(' ')}" fill="${colorFigura(n)}" fill-opacity=".3" stroke="${BORDES[(n-3)%BORDES.length]}" stroke-width="3" stroke-linejoin="round"/>${marks}</svg>`;
}

export const ALTO=760,Y_BLOQUES=153,PASO=78,Y_JUGADOR=669;
export function escenario(width=600,compacto=false){
 const ancho=Math.max(500,Math.min(1700,width));
 return {ancho,centros:Array.from({length:5},(_,i)=>ancho*(i+.5)/5),alto:compacto?460:ALTO,yBloques:compacto?100:Y_BLOQUES,paso:compacto?49:PASO,yJugador:compacto?380:Y_JUGADOR,escala:compacto?.7:1};
}
export function tablero(s,geo=escenario()){
 const {ancho,centros,alto:ALTO,yBloques:Y_BLOQUES,paso:PASO,yJugador:Y_JUGADOR,escala}=geo,x=centros[s.columna],front=s.columnas[s.columna].length-1,end=front<0?90:Y_BLOQUES+front*PASO+38;
 let body=`<defs><pattern id="reticula" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#3e376c" stroke-width="1"/></pattern><linearGradient id="lane-light" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#b296ff" stop-opacity="0"/><stop offset="1" stop-color="#b296ff" stop-opacity=".15"/></linearGradient></defs><rect width="${ancho}" height="${ALTO}" fill="#151932"/><rect y="100" width="${ancho}" height="${ALTO-100}" fill="url(#reticula)" opacity=".5"/>`;
 for(let i=0;i<32;i++)body+=`<circle cx="${(i*173+31)%ancho}" cy="${(i*127+19)%ALTO}" r="${i%3===0?2:1}" fill="${PALETA[i%6]}" opacity=".55"/>`;
 body+=`<rect x="${x-ancho/10+6}" y="98" width="${ancho/5-12}" height="${ALTO-142}" fill="url(#lane-light)"/><path d="M${x} ${Y_JUGADOR-28}V${end+6}" stroke="#b399ed" stroke-width="2" stroke-dasharray="4 12" opacity=".5"/>`;
 const e=ancho/2;
 body+=`<g transform="translate(${e*(1-escala)} 0) scale(${escala})"><g class="enemy ${s.fase==='ganado'?'defeated':''}"><path d="M${e-130} 23h260l20 20v28l-20 20H${e-130}l-20-20V43Z" fill="#4b397b" stroke="#baa2ff" stroke-width="3"/><path d="M${e-111} 34v14h-14m250-14v14h14" fill="none" stroke="#77e7ed" stroke-width="4"/><text x="${e-70}" y="69" text-anchor="middle" fill="#ffe990" font-size="35" font-family="monospace" font-weight="900">${s.fase==='ganado'?'x_x':'&gt;:v'}</text><text x="${e+41}" y="47" text-anchor="middle" fill="#d8caf2" font-size="15" font-family="monospace" font-weight="900">ENEMIGO</text><text class="boss-name" x="${e+41}" y="76" text-anchor="middle" fill="#f4eeff" font-size="24" font-family="monospace" font-weight="900">${s.nivel}-ÁGONO</text></g></g>`;
 s.columnas.forEach((col,c)=>{
  if(!col.length)body+=`<g class="open-lane"><path d="M${centros[c]} ${Y_JUGADOR-107}V${Y_BLOQUES-23}m-14 20 14-20 14 20" fill="none" stroke="#a2edb7" stroke-width="4" stroke-dasharray="12 8"/><text x="${centros[c]}" y="${Y_JUGADOR-74}" text-anchor="middle" fill="#a2edb7" font-size="19" font-family="monospace" font-weight="700">LIBRE</text></g>`;
  col.forEach((b,i)=>{
   const px=centros[c],y=Y_BLOQUES+i*PASO,exposed=i===col.length-1,r=(b.lados===3?44:34)*escala;
   body+=`<g data-block="${b.id}" data-column="${c}" data-sides="${b.lados}" class="defense ${exposed?'front':''} ${b.tipo==='figura'?'added':''}"><polygon points="${coords(b.lados,px,y,r,b.lados===4?-Math.PI/4:-Math.PI/2)}" fill="${colorFigura(b.lados)}" fill-opacity="${exposed?1:.72}" stroke="${b.tipo==='figura'?'#ffa9e5':exposed?'#faf5ff':'#736798'}" stroke-width="${exposed?3.5:1.5}" stroke-linejoin="round"/><text x="${px}" y="${y+9}" text-anchor="middle" fill="#19203e" font-size="27" font-weight="900" font-family="monospace">${b.lados}</text>${b.tipo==='figura'?`<path d="M${px-11} ${y+38*escala}h22" stroke="#ffa9e5" stroke-width="3" stroke-linecap="round"/>`:''}</g>`;
  });
 });
 const labelX=Math.max(145,Math.min(ancho-145,x));
 const label=nombre(s.figura).toLocaleUpperCase('es');
 body+=`<g class="launcher" transform="translate(${x} ${Y_JUGADOR})"><g transform="scale(${escala})"><path class="thruster" d="M-10 17L0 43 10 17" fill="#77e7ed"/><path d="M0-40 14-12 37 10V22L12 14 0 23-12 14-37 22V10L-14-12Z" fill="#ae92f4" stroke="#eee6ff" stroke-width="3" stroke-linejoin="round"/><path d="M0-22 8-5 0 1-8-5Z" fill="#77e7ed"/><path d="M-25 11H-15m30 0h10" stroke="#ffe990" stroke-width="4"/></g></g><text class="ship-name" x="${labelX}" y="${ALTO-28}" text-anchor="middle" fill="#f7eeff" font-size="${s.figura>12&&s.figura<20?20:25}" font-family="monospace" font-weight="800">${label}</text>`;
 return `<svg id="arena-svg" viewBox="0 0 ${ancho} ${ALTO}" role="img" aria-label="Enemigo ${s.nivel}-ágono arriba; solo lo vence una figura de ${s.nivel} lados. Cinco columnas de polígonos. ${nombre(s.figura)} en la nave, columna ${s.columna+1}.">${body}<g id="projectile-layer" aria-hidden="true"></g></svg>`;
}
