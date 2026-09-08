import {$,math} from './ui.mjs';
const svg=$('number-line');
const values={start:0,end:4};
for(let n=-10;n<=10;n++) {
  const x=40+(n+10)*40;
  const tick=document.createElementNS(svg.namespaceURI,'line');
  for(const [k,v] of Object.entries({x1:x,x2:x,y1:80,y2:90,stroke:'#686276'})) tick.setAttribute(k,v);
  const text=document.createElementNS(svg.namespaceURI,'text');text.setAttribute('x',x);text.setAttribute('y',105);text.setAttribute('text-anchor','middle');text.textContent=n;
  $('ticks').append(tick,text);
}
function update() {
  for(const which of ['start','end']) {
    $(`point-${which}`).setAttribute('transform',`translate(${40+(values[which]+10)*40},0)`);
    $(`point-${which}`).setAttribute('aria-valuenow',values[which]);
    $(`${which}-range`).value=values[which];$(`${which}-value`).textContent=values[which];
  }
  const d=values.end-values.start;
  math($('line-equation'),`${values.start} ${d<0?'-':'+'} ${Math.abs(d)} = ${values.end}`);
  $('line-direction').textContent=d===0?'Sin desplazamiento.':`${d>0?'Avanza':'Retrocede'} ${Math.abs(d)} ${Math.abs(d)===1?'posición':'posiciones'} hacia la ${d>0?'derecha':'izquierda'}.`;
  $('travel').setAttribute('x1',40+(values.start+10)*40);$('travel').setAttribute('x2',40+(values.end+10)*40);
}
for(const which of ['start','end']) {
  const point=$(`point-${which}`);let pointer;
  $(`${which}-range`).addEventListener('input',event=>{values[which]=Number(event.target.value);update();});
  const move=event=>{
    const rect=svg.getBoundingClientRect();
    const coordinate=(event.clientX-rect.left)/rect.width*880;
    values[which]=Math.max(-10,Math.min(10,Math.round((coordinate-40)/40)-10));update();
  };
  point.addEventListener('pointerdown',event=>{if(event.button!==0 || !event.isPrimary)return;pointer=event.pointerId;point.setPointerCapture(pointer);move(event);});
  point.addEventListener('pointermove',event=>{if(pointer===event.pointerId)move(event);});
  point.addEventListener('pointerup',event=>{if(pointer===event.pointerId){move(event);point.releasePointerCapture(pointer);pointer=undefined;}});
  point.addEventListener('lostpointercapture',()=>pointer=undefined);
  point.addEventListener('pointercancel',()=>pointer=undefined);
  point.addEventListener('keydown',event=>{
    const deltas={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1};
    if(event.key in deltas || ['Home','End'].includes(event.key)) {
      event.preventDefault();values[which]=event.key==='Home'?-10:event.key==='End'?10:Math.max(-10,Math.min(10,values[which]+deltas[event.key]));update();
    }
  });
}
update();
