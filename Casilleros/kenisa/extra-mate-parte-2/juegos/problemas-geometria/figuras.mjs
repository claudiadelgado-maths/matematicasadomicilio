const text=(x,y,value,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${value}</text>`;
const line=(d,color='#17786c',dash=false)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="3"${dash?' stroke-dasharray="7 6"':''}/>`;
const title={rectangulo:'Rectángulo',cuadrado:'Cuadrado',triangulo:'Triángulo',trapecio:'Trapecio'};
export function dibujo(q,solved=false,highlight=false){
 const labels=solved?q.solvedLabels:q.labels,g=q.geom,bot=270;let body='',left,right,top,u,v;
 if(q.shape==='rectangulo'||q.shape==='cuadrado'){
  const scale=Math.min(320/g.b,185/g.h),w=g.b*scale,h=g.h*scale;left=(600-w)/2;right=left+w;top=bot-h;
  body=`<rect x="${left}" y="${top}" width="${w}" height="${h}" fill="#dcefe8" stroke="#17786c" stroke-width="4"/>`;
  body+=line(`M${right-12} ${bot} v-12 h12`,'#7551a0');
  if(q.shape==='cuadrado')body+=line(`M300 ${top-6} v12 M300 ${bot-6} v12 M${left-6} ${(top+bot)/2} h12 M${right-6} ${(top+bot)/2} h12`,'#7551a0');
  body+=text(300,bot+38,labels.b);
  if(labels.h)body+=text(right+20,(top+bot)/2+8,labels.h,'start');
 }else if(q.shape==='triangulo'){
  const foot=(g.L1*g.L1+g.b*g.b-g.L2*g.L2)/(2*g.b),height=Math.sqrt(g.L1*g.L1-foot*foot),scale=Math.min(340/g.b,195/height);left=(600-g.b*scale)/2;right=left+g.b*scale;top=bot-height*scale;u=left+foot*scale;
  body=`<polygon points="${left},${bot} ${u},${top} ${right},${bot}" fill="#ece6f7" stroke="#17786c" stroke-width="4"/>`;
  body+=text(300,bot+38,labels.b);
  if(labels.L1)body+=text((left+u)/2-22,(top+bot)/2,labels.L1,'end');
  if(labels.L2)body+=text((right+u)/2+22,(top+bot)/2,labels.L2,'start');
  if(labels.h){body+=line(`M${u} ${top} V${bot}`,'#7551a0',true)+line(`M${u} ${bot-12} h12 v12`,'#7551a0')+text(u+17,(top+bot)/2+8,labels.h,'start');}
  if(g.L1===g.L2){for(const [a,b] of [[[left,bot],[u,top]],[[right,bot],[u,top]]]){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);body+=line(`M${mx-dy/l*7} ${my+dx/l*7} L${mx+dy/l*7} ${my-dx/l*7}`,'#7551a0');}}
 }else{
  const scale=Math.min(340/g.B,185/g.h);left=(600-g.B*scale)/2;right=left+g.B*scale;top=bot-g.h*scale;u=left+(g.B-g.b)/2*scale;v=u+g.b*scale;
  body=`<polygon points="${left},${bot} ${u},${top} ${v},${top} ${right},${bot}" fill="#fff0dc" stroke="#17786c" stroke-width="4"/>`;
  body+=text(300,top-25,labels.b)+text(300,bot+38,labels.B);
  body+=line(`M295 ${top-5} l7 5 -7 5 M295 ${bot-5} l7 5 -7 5`);
  if(labels.h)body+=line(`M300 ${top} V${bot}`,'#7551a0',true)+line(`M300 ${bot-12} h12 v12`,'#7551a0')+text(318,(top+bot)/2+8,labels.h,'start');
  if(labels.L1)body+=text((left+u)/2-22,(top+bot)/2,labels.L1,'end');
  if(labels.L2)body+=text((right+v)/2+22,(top+bot)/2,labels.L2,'start');
  if(g.L1===g.L2&&g.L1){body+=line(`M${(left+u)/2-7} ${(top+bot)/2} h14 M${(right+v)/2-7} ${(top+bot)/2} h14`,'#7551a0');}
 }
 const accessible=Object.entries(labels).map(([k,v])=>`${k}: ${v}`).join(', ');
 return `<svg class="${highlight?'relation-highlight':''}" viewBox="0 0 600 405" role="img" aria-label="${title[q.shape]}. ${accessible}${q.badge?'. '+q.badge:''}">${body}${q.badge?text(300,375,q.badge):''}</svg>`;
}
