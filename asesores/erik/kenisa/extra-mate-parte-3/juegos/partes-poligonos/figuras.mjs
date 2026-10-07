import {parte,nombreFigura,disponible} from './modelo.mjs';
export const TINTAS=['#7353b1','#138b94','#3476bb','#aa4b9b','#287e61'];
export const CENTRO={x:180,y:170},RADIO=120;
const vec=(a,b)=>({x:b.x-a.x,y:b.y-a.y});
const add=(a,b,k=1)=>({x:a.x+b.x*k,y:a.y+b.y*k});
const unit=v=>{const d=Math.hypot(v.x,v.y);return {x:v.x/d,y:v.y/d};};
export function geometria({n,parte:id,giro=-Math.PI/2,vertice=0,salto=2}){
 if(!Number.isInteger(n)||n<3||n>9||!parte(id))throw new RangeError('Figura o parte fuera del catálogo');
 const c={...CENTRO},puntos=Array.from({length:n},(_,i)=>({x:c.x+RADIO*Math.cos(giro+2*Math.PI*i/n),y:c.y+RADIO*Math.sin(giro+2*Math.PI*i/n)}));
 const k=((vertice%n)+n)%n,v=puntos[k],prev=puntos[(k+n-1)%n],next=puntos[(k+1)%n],medio={x:(v.x+next.x)/2,y:(v.y+next.y)/2};
 const g={id,n,c,puntos,v,prev,next,medio,existe:disponible(id,n),k};
 if(id==='lado')Object.assign(g,{tipo:'segmento',a:v,b:next});
 if(id==='vertice')Object.assign(g,{tipo:'punto',p:v});
 if(id==='centro')Object.assign(g,{tipo:'punto',p:c});
 if(id==='radio')Object.assign(g,{tipo:'segmento',a:c,b:v});
 if(id==='apotema'){
  const u=unit(vec(medio,c)),t=unit(vec(medio,next)),a=add(medio,u,18),b=add(a,t,18),d=add(medio,t,18);
  Object.assign(g,{tipo:'segmento',a:c,b:medio,escuadra:[a,b,d],mitades:[v,next]});
 }
 if(id==='diagonal'&&g.existe){g.destino=(k+Math.max(2,Math.min(n-2,salto)))%n;Object.assign(g,{tipo:'segmento',a:v,b:puntos[g.destino]});}
 if(['interior','exterior','central'].includes(id)){
  let origen=v,a=prev,b=next;
  if(id==='central'){origen=c;a=v;b=next;}
  if(id==='exterior'){g.extension=add(v,unit(vec(prev,v)),48);a=g.extension;}
  const inicio=Math.atan2(a.y-origen.y,a.x-origen.x),fin=Math.atan2(b.y-origen.y,b.x-origen.x),barrido=Math.atan2(Math.sin(fin-inicio),Math.cos(fin-inicio));
  Object.assign(g,{tipo:'angulo',origen,a,b,inicio,barrido});
 }
 return g;
}
const pt=p=>`${p.x.toFixed(3)},${p.y.toFixed(3)}`;
const line=(a,b,attrs='')=>`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" ${attrs}/>`;
function sector(g,r){const a={x:g.origen.x+r*Math.cos(g.inicio),y:g.origen.y+r*Math.sin(g.inicio)},b={x:g.origen.x+r*Math.cos(g.inicio+g.barrido),y:g.origen.y+r*Math.sin(g.inicio+g.barrido)};return `M${pt(g.origen)}L${pt(a)}A${r},${r} 0 0 ${g.barrido>0?1:0} ${pt(b)}Z`;}
export function ilustracion(config,{color=0,decorativa=false,explorar=false}={}){
 const g=geometria(config),t=TINTAS[((color%TINTAS.length)+TINTAS.length)%TINTAS.length];
 const descripcion=g.existe?parte(g.id).descripcion:'No hay segmentos entre esquinas no vecinas: todas las esquinas del triángulo son consecutivas.';
 let base=`<polygon points="${g.puntos.map(pt).join(' ')}" fill="#f0f2fc" stroke="#8695ae" stroke-width="2.5" stroke-linejoin="round"/>`;
 if(g.id==='central')base+=line(g.c,g.v,'stroke="#8695ae" stroke-width="2" stroke-dasharray="5 5"')+line(g.c,g.next,'stroke="#8695ae" stroke-width="2" stroke-dasharray="5 5"');
 if(g.extension)base+=line(g.v,g.extension,'class="extension" stroke="#667892" stroke-width="3" stroke-dasharray="6 5"');
 base+=g.puntos.map(v=>`<circle cx="${v.x}" cy="${v.y}" r="3.5" fill="#667892"/>`).join('');
 base+=`<circle cx="${g.c.x}" cy="${g.c.y}" r="3.5" fill="#667892"/><text x="${g.c.x-17}" y="${g.c.y-12}" fill="#566780" font-size="14" font-family="sans-serif">C</text>`;
 let marca='';
 if(g.existe&&g.tipo==='segmento'){
  marca+=line(g.a,g.b,`class="highlight-segment" stroke="${t}" stroke-width="7" stroke-linecap="round"`);
  marca+=[g.a,g.b].map(v=>`<circle cx="${v.x}" cy="${v.y}" r="5" fill="${t}" stroke="white" stroke-width="1.5"/>`).join('');
  if(g.escuadra)marca+=`<polyline class="right-mark" points="${g.escuadra.map(pt).join(' ')}" fill="none" stroke="#465674" stroke-width="2.5" stroke-linejoin="round"/>`;
 }
 if(g.existe&&g.tipo==='punto')marca+=`<circle class="highlight-point" cx="${g.p.x}" cy="${g.p.y}" r="12" fill="${t}" fill-opacity=".17"/><circle cx="${g.p.x}" cy="${g.p.y}" r="7" fill="${t}" stroke="white" stroke-width="2"/>`;
 if(g.tipo==='angulo')marca+=`<path class="highlight-angle" d="${sector(g,g.id==='central'?43:34)}" fill="${t}" fill-opacity=".24" stroke="${t}" stroke-width="3.5" stroke-linejoin="round"/>`;
 if(!g.existe)marca+=`<text x="180" y="317" text-anchor="middle" fill="#7353b1" font-size="17" font-weight="700" font-family="sans-serif">Sin diagonales</text>`;
 const annotation=explorar&&g.id==='apotema'?'<text x="180" y="317" text-anchor="middle" fill="#566780" font-size="14" font-family="sans-serif">La escuadra marca la perpendicular.</text>':'';
 return `<svg viewBox="0 0 360 340" ${decorativa?'aria-hidden="true"':`role="img" aria-label="${nombreFigura(g.n)}. ${descripcion}"`}><g>${base}</g><g class="element-highlight">${marca}</g>${annotation}</svg>`;
}
export function miniatura(n){return `<svg viewBox="0 0 48 48" aria-hidden="true"><polygon points="${Array.from({length:n},(_,i)=>`${24+17*Math.cos(-Math.PI/2+i*Math.PI*2/n)},${24+17*Math.sin(-Math.PI/2+i*Math.PI*2/n)}`).join(' ')}" fill="#e4dcf8" stroke="#7353b1" stroke-width="2"/></svg>`;}
