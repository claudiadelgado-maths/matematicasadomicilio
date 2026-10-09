import {regular,numero} from './modelo.mjs?v=20261009-mini1';
import {escapar,pareja,ajustarPareja,dibujarTriangulo} from '../../recursos/figuras-triangulos.mjs?v=20261009-2';
export {escapar};
const TINTA='#7860a6',VERDE='#19847d',AZUL='#5472b6';
const p=(x,y)=>({x,y});
const suma=(a,b)=>p(a.x+b.x,a.y+b.y),resta=(a,b)=>p(a.x-b.x,a.y-b.y),esc=(a,k)=>p(a.x*k,a.y*k);
const media=(a,b)=>esc(suma(a,b),.5),unit=a=>esc(a,1/(Math.hypot(a.x,a.y)||1));
const pathPts=pts=>pts.map(v=>`${v.x},${v.y}`).join(' ');
const svg=(contenido,label)=>`<svg viewBox="0 0 400 340" role="img" aria-label="${escapar(label)}">${contenido}</svg>`;
const line=(a,b,color=TINTA,width=5,extra='')=>`<path d="M${a.x},${a.y}L${b.x},${b.y}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
const dot=(v,color=TINTA,r=4)=>`<circle cx="${v.x}" cy="${v.y}" r="${r}" fill="${color}"/>`;
const txt=(v,label,color='#34475e',size=18)=>`<text x="${v.x}" y="${v.y}" text-anchor="middle" fill="${color}" font-size="${size}" class="diagram-text">${escapar(label)}</text>`;
function flecha(a,b,color=TINTA){const u=unit(resta(b,a)),w=p(-u.y,u.x),punta1=suma(resta(b,esc(u,10)),esc(w,5)),punta2=resta(resta(b,esc(u,10)),esc(w,5));return line(a,b,color,3)+`<path d="M${punta1.x},${punta1.y}L${b.x},${b.y}L${punta2.x},${punta2.y}" fill="none" stroke="${color}" stroke-width="3"/>`;}
function arco(v,r,a,b,color=TINTA,relleno=true){
 const u=p(v.x+r*Math.cos(a),v.y+r*Math.sin(a)),w=p(v.x+r*Math.cos(b),v.y+r*Math.sin(b)),delta=b-a;
 return `<path d="${relleno?`M${v.x},${v.y}L`:'M'}${u.x},${u.y}A${r},${r} 0 ${Math.abs(delta)>Math.PI?1:0} ${delta>0?1:0} ${w.x},${w.y}${relleno?'Z':''}" fill="${relleno?color:'none'}" fill-opacity=".2" stroke="${color}" stroke-width="${relleno?2:6}" stroke-linecap="round"/>`;
}
function sector(v,a,b,color=TINTA){let ini=Math.atan2(a.y-v.y,a.x-v.x),fin=Math.atan2(b.y-v.y,b.x-v.x);while(fin-ini>Math.PI)fin-=2*Math.PI;while(fin-ini< -Math.PI)fin+=2*Math.PI;return arco(v,24,ini,fin,color);}
export function ajustarForma(d){
 const rad=(d.giro||0)*Math.PI/180,pts=d.puntos.map(v=>p(v.x*Math.cos(rad)+v.y*Math.sin(rad),v.x*Math.sin(rad)-v.y*Math.cos(rad)));
 const xs=pts.map(v=>v.x),ys=pts.map(v=>v.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),factor=Math.min(218/(maxX-minX),155/(maxY-minY)),centro=p((minX+maxX)/2,(minY+maxY)/2);
 return {puntos:pts.map(v=>suma(p(200,171),esc(resta(v,centro),factor))),factor};
}
function forma(d){
 const {puntos:vs}=ajustarForma(d),c=esc(vs.reduce(suma,p(0,0)),1/vs.length);let h=`<polygon points="${pathPts(vs)}" fill="#eee9fb" stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"/>`;
 const labels=d.mostrarLados?Object.fromEntries(d.lados.map((v,i)=>[i,v])):d.labels||{};
 for(const [i,val] of Object.entries(labels)){const a=vs[+i],b=vs[(+i+1)%vs.length],m=media(a,b),u=unit(resta(b,a));let normal=p(u.y,-u.x);if(normal.x*(m.x-c.x)+normal.y*(m.y-c.y)<0)normal=esc(normal,-1);h+=txt(suma(m,suma(esc(normal,25),p(0,6))),numero(val)+' cm',TINTA,17);}
 for(const i of d.rectos||[]){const v=vs[i],u=esc(unit(resta(vs[(i+1)%4],v)),13),w=esc(unit(resta(vs[(i+3)%4],v)),13);h+=`<path d="M${pathPts([suma(v,u)])}L${pathPts([suma(suma(v,u),w)])}L${pathPts([suma(v,w)])}" fill="none" stroke="${AZUL}" stroke-width="2"/>`;}
 if(d.paralelas)for(const i of [0,2]){const m=media(vs[i],vs[(i+1)%4]);h+=`<path d="M${m.x-5},${m.y-5}l7,5-7,5" fill="none" stroke="${AZUL}" stroke-width="2"/>`;}
 if(d.altura){const top=vs[3],foot=p(top.x,vs[0].y);h+=line(top,foot,VERDE,3,'stroke-dasharray="6 5"');h+=txt(suma(media(top,foot),p(31,5)),'h = '+d.h+' cm',VERDE,17);h+=`<path d="M${foot.x},${foot.y-11}h11v11" fill="none" stroke="${VERDE}" stroke-width="2"/>`;}
 const descripcion=d.mostrarLados?`Cuadrilátero con lados ${d.lados.join(', ')} centímetros${d.rectos?.length?', con dos ángulos rectos':''}.`:'Cuadrilátero con las medidas o marcas indicadas.';
 return svg(h,descripcion);
}
function circulo(d){
 const c=p(200,164),R=84,rad=(d.giro||0)*Math.PI/180,turn=v=>p(c.x+(v.x-c.x)*Math.cos(rad)-(v.y-c.y)*Math.sin(rad),c.y+(v.x-c.x)*Math.sin(rad)+(v.y-c.y)*Math.cos(rad));
 let h=`<circle cx="200" cy="164" r="84" fill="#f1f6fb" stroke="#b7c6d9" stroke-width="2"/>`;
 const lado=(a,b,recta=false)=>{a=turn(a);b=turn(b);return recta?flecha(a,b,TINTA)+flecha(b,a,TINTA):line(a,b)+dot(a)+dot(b);};
 if(d.parte==='cuerda'){const off=-40,x=Math.sqrt(R*R-off*off);h+=lado(p(c.x-x,c.y+off),p(c.x+x,c.y+off));}
 if(d.parte==='diametro')h+=lado(p(c.x-R,c.y),p(c.x+R,c.y));
 if(d.parte==='radio')h+=lado(c,p(c.x+R,c.y));
 if(d.parte==='secante')h+=lado(p(c.x-137,c.y-34),p(c.x+137,c.y-34),true);
 if(d.parte==='tangente')h+=lado(p(c.x+R,c.y-118),p(c.x+R,c.y+118),true);
 if(d.parte==='circunferencia')h+=`<circle cx="200" cy="164" r="84" fill="none" stroke="${TINTA}" stroke-width="6"/>`;
 if(d.parte==='arco')h+=arco(c,R,(-70+(d.giro||0))*Math.PI/180,(60+(d.giro||0))*Math.PI/180,TINTA,false);
 h+=dot(c,'#66788f',3)+txt(suma(c,p(-10,21)),'O','#66788f',14);
 if(d.medida)h+=txt(p(243,143),'r = '+d.medida+' cm',VERDE,17);
 const descripciones={cuerda:'Segmento que une dos puntos del borde sin pasar por O.',diametro:'Segmento con extremos en el borde que pasa por O.',radio:'Segmento desde el centro O hasta el borde.',secante:'Recta que cruza el borde dos veces y continúa fuera del círculo.',tangente:'Recta que toca el borde en un solo punto.',circunferencia:'Todo el borde curvo aparece resaltado.',arco:'Solo un tramo del borde curvo aparece resaltado.'};
 return svg(h,'Círculo con centro O. '+descripciones[d.parte]+(d.medida?' Radio de '+d.medida+' cm.':''));
}
function poligono(d){
 const c=p(200,170),vs=regular(d.n,d.giro??-90).map(v=>suma(c,esc(v,88))),v=vs[0],next=vs[1],prev=vs.at(-1),mid=media(v,next);let h=`<polygon points="${pathPts(vs)}" fill="#f0eef9" stroke="#9caec6" stroke-width="2.5" stroke-linejoin="round"/>`;
 const part=d.parte;
 if(part==='lado')h+=line(v,next)+dot(v)+dot(next);
 if(part==='vertice')h+=`<circle cx="${v.x}" cy="${v.y}" r="10" fill="${TINTA}" stroke="white" stroke-width="3"/>`;
 if(part==='diagonal')h+=line(v,vs[2])+dot(v)+dot(vs[2]);
 if(part==='interior')h+=sector(v,prev,next);
 if(part==='exterior'){const extension=suma(v,esc(unit(resta(v,prev)),63));h+=line(v,extension,'#8298ae',2,'stroke-dasharray="6 5"')+sector(v,extension,next);}
 if(part==='central')h+=line(c,v,'#9caec6',2,'stroke-dasharray="5 4"')+line(c,next,'#9caec6',2,'stroke-dasharray="5 4"')+sector(c,v,next);
 if(part==='radio')h+=line(c,v)+dot(v);
 if(part==='apotema'){
  h+=line(c,mid)+dot(mid);const u=esc(unit(resta(v,mid)),10),w=esc(unit(resta(c,mid)),10);h+=`<path d="M${pathPts([suma(mid,u)])}L${pathPts([suma(suma(mid,u),w)])}L${pathPts([suma(mid,w)])}" fill="none" stroke="#536e80" stroke-width="2"/>`;
  if(d.apotema)h+=txt(suma(media(c,mid),p(-34,0)),`a ${d.aproximado?'≈':'='} ${numero(d.apotema)}`,VERDE,16);
 }
 if(['centro','central','radio','apotema'].includes(part))h+=dot(c,part==='centro'?TINTA:'#6c8096',part==='centro'?8:4)+txt(suma(c,p(14,20)),'O','#526477',14);
 if(d.lado){const normal=unit(resta(mid,c));h+=line(v,next,VERDE,4)+txt(suma(mid,suma(esc(normal,25),p(0,5))),d.lado+' cm',VERDE,16);}
 const descripcion={lado:'Un segmento del borde resaltado.',vertice:'Una esquina resaltada.',diagonal:'Un segmento completo entre dos esquinas no vecinas.',interior:'Sector dentro del polígono entre dos lados vecinos.',exterior:'Sector fuera del polígono entre un lado y la prolongación del vecino.',centro:'El punto central O resaltado.',radio:'Segmento del centro O hasta una esquina.',apotema:'Segmento de O al punto medio de un lado, con marca de perpendicularidad.',central:'Sector en O entre dos segmentos hacia esquinas vecinas.'};
 return svg(h,`Polígono regular de ${d.n} lados. ${descripcion[part]||''}`);
}
function angulo(d){
 const c=p(172,174),r=112,deg=d.grados,rad=-deg*Math.PI/180,to=p(c.x+r*Math.cos(rad),c.y+r*Math.sin(rad));let h='';
 if(deg===360){h+=`<circle cx="${c.x}" cy="${c.y}" r="45" fill="#e5dcf8" stroke="${TINTA}" stroke-width="3"/>`;h+=flecha(p(c.x+44,c.y-7),p(c.x+45,c.y+8),TINTA);}
 else if(deg>0)h+=arco(c,45,0,rad);
 h+=flecha(c,p(c.x+r,c.y),AZUL);if(deg!==0&&deg!==360)h+=flecha(c,to,TINTA);h+=dot(c,VERDE)+txt(p(200,291),deg+'°',TINTA,28);
 if(deg===0)h+=txt(p(200,321),'Las dos semirrectas coinciden','#526477',14);
 return svg(h,`Ángulo de ${deg} grados.`);
}
function paralelas(d){
 const a=d.inclination*Math.PI/180,centros=[95,240].map(y=>p(200+(167.5-y)/Math.tan(a),y));let h='';
 for(const [i,c] of centros.entries())h+=line(p(35,c.y),p(365,c.y),'#60758b',3)+txt(p(24,c.y-8),i?'s':'r','#526477',17)+`<path d="M55,${c.y-5}l7,5-7,5" fill="none" stroke="#60758b" stroke-width="2"/>`;
 h+=line(p(200+(167.5-30)/Math.tan(a),30),p(200+(167.5-304)/Math.tan(a),304),VERDE,3);
 const limites=[[-a,0],[-Math.PI,-a],[-Math.PI-a,-Math.PI],[-2*Math.PI,-Math.PI-a]];
 d.par.forEach((n,i)=>{const c=centros[Math.floor(n/4)],[inicio,fin]=limites[n%4],m=(inicio+fin)/2,tinta=i?AZUL:TINTA;h+=arco(c,32,inicio,fin,tinta)+txt(p(c.x+47*Math.cos(m),c.y+47*Math.sin(m)+6),i?'B':'A',tinta,20);});
 h+=txt(p(344,326),'r ∥ s','#526477',17);
 return svg(h,'Dos rectas paralelas r y s cortadas por una transversal. Los sectores A y B son los que se comparan.');
}
function trianguloSVG(d){
 const ps=ajustarPareja([d.t])[0];let dibujo=dibujarTriangulo(d.t,ps);
 if(d.exterior!==undefined){const b=ps[1],c=ps[2],fin=p(b.x+73,b.y),ang=Math.atan2(c.y-b.y,c.x-b.x),extra=line(b,fin,VERDE,2,'stroke-dasharray="6 5"')+arco(b,25,ang,0,VERDE)+txt(p(b.x+49,b.y-60),'Exterior',VERDE,13)+txt(p(b.x+49,b.y-38),d.exterior+'°',VERDE,20);dibujo=dibujo.replace('</svg>',extra+'</svg>').replace('aria-label="','aria-label="Exterior en B: '+d.exterior+' grados. ');}
 return dibujo;
}
export function dibujar(d){
 if(!d)return '';
 if(d.kind==='shape')return forma(d);
 if(d.kind==='circle')return circulo(d);
 if(d.kind==='polygon')return poligono(d);
 if(d.kind==='angle')return angulo(d);
 if(d.kind==='parallels')return paralelas(d);
 if(d.kind==='triangle')return trianguloSVG(d);
 if(d.kind==='pair')return `<div class="triangle-pair">${pareja(d.ts,true)}</div>`;
 if(d.kind==='equation')return `<div class="equation-art" role="math" aria-label="${d.a} por x ${d.b<0?'menos '+(-d.b):d.b?'más '+d.b:''} igual a ${d.c}"><span>${d.a}x ${d.b<0?'− '+(-d.b):d.b?'+ '+d.b:''}</span><b>=</b><span>${d.c}</span></div>`;
 throw new RangeError('Dibujo desconocido');
}
