import {nombre,numero} from './modelo.mjs';
export const COLORES=['#6e54a1','#168e91','#3d7cba','#b566a2','#27866c','#9a8126','#8664b6'];
export function geometria(n){
 if(!Number.isInteger(n)||n<3||n>9)throw new RangeError('Polígono fuera del catálogo');
 const c={x:210,y:185},r=128,p=Array.from({length:n},(_,i)=>({x:c.x+r*Math.cos(-Math.PI/2-Math.PI/n+i*2*Math.PI/n),y:c.y+r*Math.sin(-Math.PI/2-Math.PI/n+i*2*Math.PI/n)}));
 const m={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2},diagonales=[];
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(j!==i+1&&!(i===0&&j===n-1))diagonales.push([i,j]);
 return {n,c,p,m,diagonales,desde:diagonales.filter(([i])=>i===0)};
}
const pt=p=>`${p.x.toFixed(3)},${p.y.toFixed(3)}`;
const linea=(p,q,color,extra='')=>`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${color}" stroke-width="4" stroke-linecap="round" ${extra}/>`;
const texto=(p,s,color='#526477',extra='')=>`<text x="${p.x}" y="${p.y}" fill="${color}" font-family="sans-serif" ${extra.includes('font-size=')?'':'font-size="16"'} text-anchor="middle" class="svg-label" ${extra}>${s}</text>`;
const medio=(p,q)=>({x:(p.x+q.x)/2,y:(p.y+q.y)/2});
export function angulo(o,a,b,r=32){
 const inicio=Math.atan2(a.y-o.y,a.x-o.x),fin=Math.atan2(b.y-o.y,b.x-o.x),barrido=Math.atan2(Math.sin(fin-inicio),Math.cos(fin-inicio));
 const p={x:o.x+r*Math.cos(inicio),y:o.y+r*Math.sin(inicio)},q={x:o.x+r*Math.cos(inicio+barrido),y:o.y+r*Math.sin(inicio+barrido)};
 return {barrido,d:`M${pt(o)}L${pt(p)}A${r},${r} 0 0 ${barrido>0?1:0} ${pt(q)}Z`};
}
export function ilustracion(n,tipo,{animada=false,etiquetas=true,resumen=true}={}){
 const {c,p,m,diagonales,desde}=geometria(n);
 const gradual=(i,total=7)=>animada?`class="reveal" style="--delay:${i*Math.min(170,1300/total)}ms"`:'';
 const forma=`<polygon points="${p.map(pt).join(' ')}" fill="#f1f0fa" stroke="#8996ac" stroke-width="2.5" stroke-linejoin="round"/>`;
 let contenido=forma,anotacion='';
 const segment=(a,b,color,extra='')=>linea(a,b,color,extra);
 if(['perimetro','lado'].includes(tipo)){
  for(let i=0;i<(tipo==='lado'?1:n);i++)contenido+=segment(p[i],p[(i+1)%n],COLORES[i%COLORES.length],`data-edge="${i}" ${gradual(i,n)}`);
  if(etiquetas)contenido+=texto({x:m.x,y:m.y-14},'L','#6e54a1');
  anotacion=tipo==='lado'?'Cada lado tiene la misma longitud.':'El perímetro recorre todos los lados.';
 }
 if(['area','apotema','radio'].includes(tipo)){
  if(tipo==='area')for(let i=0;i<n;i++)contenido+=`<path data-area-piece="${i}" d="M${pt(c)}L${pt(p[i])}L${pt(p[(i+1)%n])}Z" fill="${COLORES[i%COLORES.length]}" fill-opacity=".23" stroke="white" stroke-width="1.5" ${gradual(i,n)}/>`;
  if(tipo==='radio')contenido+=`<path d="M${pt(c)}L${pt(m)}L${pt(p[1])}Z" fill="#dad1f2" fill-opacity=".6"/>`;
  contenido+=segment(c,m,'#168e91','data-segment="apotema"');
  contenido+=`<path data-right-angle="true" d="M${m.x} ${m.y+13}h13v-13" fill="none" stroke="#496080" stroke-width="2.5"/>`;
  contenido+=`<circle cx="${c.x}" cy="${c.y}" r="4" fill="#526477"/>`;
  if(etiquetas)contenido+=texto({x:c.x-15,y:(c.y+m.y)/2},'a','#168e91');
  if(tipo==='radio'){
   contenido+=segment(c,p[1],'#6e54a1','data-segment="radio"')+segment(m,p[1],'#3d7cba','data-segment="medio-lado"');
   if(etiquetas){const r=medio(c,p[1]),l=medio(m,p[1]);contenido+=texto({x:r.x+15,y:r.y+10},'R','#6e54a1')+texto({x:l.x,y:l.y-14},'L/2','#3d7cba');}
   anotacion='La apotema y el medio lado forman 90°.';
  }else anotacion=tipo==='area'?'N triángulos llenan toda la figura.':'La apotema es perpendicular al lado.';
 }
 if(['desde','todas','suma'].includes(tipo)){
  const lineas=tipo==='todas'?diagonales:desde;
  lineas.forEach(([i,j],k)=>contenido+=segment(p[i],p[j],tipo==='suma'?'#b9bfd2':COLORES[k%COLORES.length],`data-diagonal="${i}-${j}" ${tipo==='suma'?'stroke-dasharray="5 5"':gradual(k,lineas.length)}`));
  if(tipo==='desde')contenido+=`<circle cx="${p[0].x}" cy="${p[0].y}" r="7" fill="#6e54a1" stroke="white" stroke-width="2"/>`;
  if(tipo==='suma')p.forEach((v,i)=>{const ang=angulo(v,p[(i+n-1)%n],p[(i+1)%n],29);contenido+=`<path data-angle="interior" d="${ang.d}" fill="${COLORES[i%COLORES.length]}" fill-opacity=".3" stroke="${COLORES[i%COLORES.length]}" stroke-width="2" ${gradual(i,n)}/>`;});
  anotacion=tipo==='desde'?`${desde.length} diagonales desde este vértice.`:tipo==='todas'?`${diagonales.length} diagonales en todo el polígono.`:`${n-2} triángulos · todos los interiores suman ${(n-2)*180}°.`;
  if(n===3&&tipo!=='suma')anotacion='0 diagonales: todas sus esquinas son vecinas.';
 }
 if(['angulos','central','interior','exterior'].includes(tipo)){
  const v=p[1],extension={x:v.x+67,y:v.y};
  const mostrar=tipo==='angulos'?['central','interior','exterior']:[tipo];
  if(mostrar.includes('central'))contenido+=segment(c,p[0],'#b5a9cc','stroke-dasharray="5 5"')+segment(c,p[1],'#b5a9cc','stroke-dasharray="5 5"');
  if(mostrar.includes('exterior'))contenido+=segment(v,extension,'#b566a2','class="extension" stroke-dasharray="5 5"');
  const defs={central:{o:c,a:p[0],b:p[1],color:'#6e54a1',pos:{x:c.x,y:c.y+25}},interior:{o:v,a:p[0],b:p[2],color:'#168e91',pos:{x:v.x-23,y:v.y+59}},exterior:{o:v,a:extension,b:p[2],color:'#b566a2',pos:{x:v.x+45,y:v.y+35}}};
  mostrar.forEach((id,i)=>{const d=defs[id],s=angulo(d.o,d.a,d.b,id==='central'?38:27);contenido+=`<path data-angle="${id}" d="${s.d}" fill="${d.color}" fill-opacity=".25" stroke="${d.color}" stroke-width="3" ${gradual(i,3)}/>`;if(etiquetas)contenido+=texto(d.pos,id,d.color,'font-weight="700"');});
  contenido+=`<circle cx="${c.x}" cy="${c.y}" r="3.5" fill="#6e54a1"/>`;
  anotacion=tipo==='angulos'?'Central: en el centro · interior: dentro · exterior: fuera.':`Observa el ángulo ${tipo} señalado.`;
 }
 if(!resumen&&['desde','todas','suma'].includes(tipo))anotacion=tipo==='desde'?'Diagonales desde un solo vértice.':tipo==='todas'?'Cada diagonal se cuenta una sola vez.':'Suma todos los ángulos interiores.';
 return `<svg viewBox="0 0 440 380" role="img" aria-label="${nombre(n)} regular. ${anotacion}">${contenido}${texto({x:220,y:354},anotacion,'#526477','font-size="12"')}</svg>`;
}
export function miniatura(n){const {p}=geometria(n);return `<svg viewBox="55 30 310 300" aria-hidden="true"><polygon points="${p.map(pt).join(' ')}" fill="#e7e0f8" stroke="#7353b1" stroke-width="6" stroke-linejoin="round"/></svg>`;}
export function datosExplorador(n,id){
 if(id==='desde')return `${n} − 3 = ${n-3} diagonales`;
 if(id==='todas')return `${n} × (${n} − 3) ÷ 2 = ${n*(n-3)/2} diagonales`;
 if(id==='suma')return `(${n} − 2) × 180° = ${(n-2)*180}°`;
 if(id==='angulos')return `Central y exterior: ${numero(360/n)}° · Interior: ${numero(180-360/n)}°${n===7?' (aprox.)':''}`;
 return `${nombre(n)} regular · N = ${n}`;
}
