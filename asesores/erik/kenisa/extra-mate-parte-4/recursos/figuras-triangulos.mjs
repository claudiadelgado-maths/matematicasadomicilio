import {LADOS} from './matematicas-triangulos.mjs?v=20261009-2';
export const escapar=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const color=['#5472b6','#9660ad','#19847d'];
const promedio=p=>({x:p.reduce((s,v)=>s+v.x,0)/p.length,y:p.reduce((s,v)=>s+v.y,0)/p.length});
const unit=(x,y)=>{const n=Math.hypot(x,y)||1;return {x:x/n,y:y/n};};
export function transformar(t){
 const c=promedio(t.puntos),r=t.giro*Math.PI/180;
 return t.puntos.map(p=>{const x=(p.x-c.x)*(t.reflejo?-1:1),y=-(p.y-c.y);return {x:x*Math.cos(r)-y*Math.sin(r),y:x*Math.sin(r)+y*Math.cos(r)};});
}
export function ajustarPareja(triangulos,mismaEscala=false){
 const ps=triangulos.map(transformar),cajas=ps.map(p=>({w:Math.max(...p.map(v=>v.x))-Math.min(...p.map(v=>v.x)),h:Math.max(...p.map(v=>v.y))-Math.min(...p.map(v=>v.y))}));
 const escala=Math.min(218/Math.max(...cajas.map(c=>c.w)),166/Math.max(...cajas.map(c=>c.h)));
 return ps.map((p,i)=>{const factor=mismaEscala?escala:Math.min(218/cajas[i].w,166/cajas[i].h),c={x:(Math.max(...p.map(v=>v.x))+Math.min(...p.map(v=>v.x)))/2,y:(Math.max(...p.map(v=>v.y))+Math.min(...p.map(v=>v.y)))/2};return p.map(v=>({x:200+(v.x-c.x)*factor,y:166+(v.y-c.y)*factor}));});
}
const linea=(a,b,attrs='')=>`<path d="M${a.x},${a.y}L${b.x},${b.y}" ${attrs}/>`;
function arco(p,i){
 const v=p[i],u=unit(p[(i+1)%3].x-v.x,p[(i+1)%3].y-v.y),w=unit(p[(i+2)%3].x-v.x,p[(i+2)%3].y-v.y),r=Math.min(24,...p.filter((_,j)=>j!==i).map(q=>Math.hypot(q.x-v.x,q.y-v.y)*.23));
 const a={x:v.x+u.x*r,y:v.y+u.y*r},b={x:v.x+w.x*r,y:v.y+w.y*r};
 return `M${v.x},${v.y}L${a.x},${a.y}A${r},${r} 0 0 ${u.x*w.y-u.y*w.x>0?1:0} ${b.x},${b.y}Z`;
}
function ponerEtiqueta(ancla,direccion,lineas,tinta,clase,ocupados){
 const w=Math.max(34,...lineas.map(s=>s.length*8.2+18)),h=lineas.length===1?30:49;
 let mejor=null;
 for(const distancia of [28,44,62,82,105])for(const lateral of [0,-22,22,-45,45]){
  const x=Math.max(w/2+7,Math.min(393-w/2,ancla.x+direccion.x*distancia-direccion.y*lateral)),y=Math.max(h/2+12,Math.min(325-h/2,ancla.y+direccion.y*distancia+direccion.x*lateral));
  const caja={x:x-w/2,y:y-h/2,w,h};
  const solape=ocupados.reduce((s,b)=>s+Math.max(0,Math.min(caja.x+w,b.x+b.w+7)-Math.max(caja.x,b.x-7))*Math.max(0,Math.min(caja.y+h,b.y+b.h+7)-Math.max(caja.y,b.y-7)),0);
  const coste=solape*100+distancia+Math.abs(lateral)*.4;
  if(!mejor||coste<mejor.coste)mejor={x,y,caja,coste};
 }
 ocupados.push(mejor.caja);const {x,y}=mejor;
 return `<g class="svg-label ${clase}">${linea(ancla,{x,y},`stroke="${tinta}" stroke-opacity=".45" stroke-width="1.3"`)}<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="10" fill="white" stroke="${tinta}"/><text x="${x}" y="${y+(lineas.length===1?5:-5)}" text-anchor="middle" fill="${tinta}">${lineas.map((s,i)=>`<tspan x="${x}" dy="${i?20:0}">${escapar(s)}</tspan>`).join('')}</text></g>`;
}
export function dibujarTriangulo(t,p,indice=0){
 const c=promedio(p),ocupados=[],tinta=indice?'#19847d':'#7860a6';let contenido='';
 contenido+=`<polygon points="${p.map(v=>`${v.x},${v.y}`).join(' ')}" fill="${indice?'#e1f6f0':'#efebfb'}" stroke="#b9c4d5" stroke-width="2.5" stroke-linejoin="round"/>`;
 for(const [id,dato] of Object.entries(t.lados)){const [i,j]=LADOS[id];contenido+=linea(p[i],p[j],`class="${dato.deducido?'deduced':''}" stroke="${tinta}" stroke-width="5" stroke-linecap="round" ${dato.objetivo?'stroke-dasharray="5 6"':''}`);}
 for(const [id,dato] of Object.entries(t.angulos))contenido+=`<path d="${arco(p,+id)}" class="${dato.deducido?'deduced':''}" fill="${color[id]}" fill-opacity=".23" stroke="${color[id]}" stroke-width="2"/>`;
 for(let i=0;i<3;i++){
  contenido+=`<circle cx="${p[i].x}" cy="${p[i].y}" r="4" fill="${color[i]}"/>`;
  const dato=t.angulos[i];contenido+=ponerEtiqueta(p[i],unit(p[i].x-c.x,p[i].y-c.y),[t.nombres[i],...(dato?[dato.texto]:[])],color[i],dato?.deducido?'deduced':dato?.objetivo?'target':'',ocupados);
 }
 for(const [id,dato] of Object.entries(t.lados)){
  const [i,j]=LADOS[id],m={x:(p[i].x+p[j].x)/2,y:(p[i].y+p[j].y)/2};let d=unit(p[j].y-p[i].y,p[i].x-p[j].x);if(d.x*(m.x-c.x)+d.y*(m.y-c.y)<0)d={x:-d.x,y:-d.y};
  contenido+=ponerEtiqueta(m,d,[dato.texto],tinta,dato.deducido?'deduced':dato.objetivo?'target':'',ocupados);
 }
 const descripcion=`Triángulo ${t.nombres.join('')}. ${Object.entries(t.lados).map(([id,d])=>`${LADOS[id].map(i=>t.nombres[i]).join('')}: ${d.texto}`).join('. ')}. ${Object.entries(t.angulos).map(([id,d])=>`Ángulo ${t.nombres[id]}: ${d.texto}`).join('. ')}`;
 return `<svg viewBox="0 0 400 340" role="img" aria-label="${escapar(descripcion)}">${contenido}</svg>`;
}
export function pareja(triangulos,mismaEscala=false){const ps=ajustarPareja(triangulos,mismaEscala);return triangulos.map((t,i)=>`<figure class="triangle-card"><figcaption><span class="figure-dot ${i?'mint':''}"></span>△${t.nombres.join('')}</figcaption>${dibujarTriangulo(t,ps[i],i)}</figure>`).join('');}
