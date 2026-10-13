export const COLORES=['#7454ad','#247da2','#21917c','#b05797','#a17b15','#5264b5'];
const svgNS='http://www.w3.org/2000/svg';
const elem=(tag,attrs)=>{const n=document.createElementNS(svgNS,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
export function dibujarFigura(q){
  const puntos=q.puntos.map(([x,y])=>[x*Math.cos(q.giro)-y*Math.sin(q.giro),x*Math.sin(q.giro)+y*Math.cos(q.giro)]);
  const xs=puntos.map(p=>p[0]),ys=puntos.map(p=>p[1]),cx=(Math.max(...xs)+Math.min(...xs))/2,cy=(Math.max(...ys)+Math.min(...ys))/2;
  const escala=Math.min(310/(Math.max(...xs)-Math.min(...xs)),250/(Math.max(...ys)-Math.min(...ys)));
  const coords=puntos.map(([x,y])=>[280+(x-cx)*escala,215+(y-cy)*escala]);
  const centro=coords.reduce((a,p)=>[a[0]+p[0]/coords.length,a[1]+p[1]/coords.length],[0,0]);
  const svg=elem('svg',{viewBox:'0 0 560 440',role:'img','aria-label':`${q.nombre}. ${q.lados.map(l=>`Lado ${l.letra}: ${l.expr} centímetros`).join('. ')}. x vale ${q.x}.`});
  svg.append(elem('polygon',{points:coords.map(p=>p.join(',')).join(' '),fill:'#f1edf8'}));
  coords.forEach((p,i)=>{const b=coords[(i+1)%coords.length],l=q.lados[i],color=COLORES[i];svg.append(elem('line',{x1:p[0],y1:p[1],x2:b[0],y2:b[1],stroke:color,'stroke-width':6,'stroke-linecap':'round'}));
    const m=[(p[0]+b[0])/2,(p[1]+b[1])/2],vec=[m[0]-centro[0],m[1]-centro[1]],len=Math.hypot(...vec)||1;
    const tx=m[0]+vec[0]/len*42,ty=m[1]+vec[1]/len*42;
    const group=elem('g',{});group.append(elem('rect',{x:tx-57,y:ty-23,width:114,height:46,rx:10,fill:'#fff',stroke:color,'stroke-width':1.5}));
    const name=elem('text',{x:tx,y:ty-4,'text-anchor':'middle',fill:color,'font-size':12,'font-weight':800});name.textContent=`LADO ${l.letra}`;
    const text=elem('text',{x:tx,y:ty+14,'text-anchor':'middle',fill:'#293f52','font-size':16,'font-weight':700});text.textContent=l.expr;group.append(name,text);svg.append(group);
  });
  return svg;
}
