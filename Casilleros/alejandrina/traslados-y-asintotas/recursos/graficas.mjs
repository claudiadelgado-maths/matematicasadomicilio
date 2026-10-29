const NS = 'http://www.w3.org/2000/svg';
const svgNode = (tag, attrs, text) => {
  const node = document.createElementNS(NS,tag);
  for(const [key,value] of Object.entries(attrs||{})) node.setAttribute(key,String(value));
  if(text!==undefined) node.textContent=text; return node;
};
// Break at every excluded x, including removable holes: never join two branches.
export function sampleSegments(f, xMin, xMax, breaks = [], samples = 800) {
  const segments=[]; let current=[], previous=null;
  for(let i=0;i<=samples;i++) {
    const x=xMin+(xMax-xMin)*i/samples, y=f(x);
    const crosses=previous!==null && breaks.some(b=>b>=previous&&b<=x);
    if(crosses||!Number.isFinite(y)) { if(current.length>1) segments.push(current);current=[]; }
    if(Number.isFinite(y)) current.push([x,y]); previous=x;
  }
  if(current.length>1) segments.push(current);return segments;
}
export function drawGraph(container, config) {
  const width=Math.max(300,Math.min(760,container.clientWidth||620)), height=360, pad=32;
  const {xMin=-8,xMax=8,yMin=-6,yMax=6,curves=[],verticals=[],horizontals=[],holes=[],points=[],title='Gráfica de funciones'}=config;
  const X=x=>pad+(x-xMin)/(xMax-xMin)*(width-2*pad), Y=y=>height-pad-(y-yMin)/(yMax-yMin)*(height-2*pad);
  const svg=svgNode('svg',{viewBox:`0 0 ${width} ${height}`,width,height,role:'img','aria-label':title});
  svg.append(svgNode('title',{},title));
  const id=`clip-${container.id}`,defs=svgNode('defs'),clip=svgNode('clipPath',{id});
  clip.append(svgNode('rect',{x:pad,y:pad,width:width-pad*2,height:height-pad*2}));defs.append(clip);svg.append(defs);
  svg.append(svgNode('rect',{x:0,y:0,width,height,fill:'#fffdfa',rx:18}));
  const xStep=(xMax-xMin)>40?20:(xMax-xMin)>20?5:2;
  for(let x=Math.ceil(xMin/xStep)*xStep;x<=xMax;x+=xStep) {
    svg.append(svgNode('line',{x1:X(x),y1:pad,x2:X(x),y2:height-pad,stroke:'#e3e2e9'}));
    if(x!==0) svg.append(svgNode('text',{x:X(x),y:height-10,'text-anchor':'middle',fill:'#61586b','font-size':12},String(x)));
  }
  for(let y=Math.ceil(yMin/2)*2;y<=yMax;y+=2) {
    svg.append(svgNode('line',{x1:pad,y1:Y(y),x2:width-pad,y2:Y(y),stroke:'#e3e2e9'}));
    if(y!==0)svg.append(svgNode('text',{x:pad-7,y:Y(y)+4,'text-anchor':'end',fill:'#61586b','font-size':12},String(y)));
  }
  if(yMin<=0&&yMax>=0)svg.append(svgNode('line',{x1:pad,y1:Y(0),x2:width-pad,y2:Y(0),stroke:'#a59aaa','stroke-width':1.5}));
  if(xMin<=0&&xMax>=0)svg.append(svgNode('line',{x1:X(0),y1:pad,x2:X(0),y2:height-pad,stroke:'#a59aaa','stroke-width':1.5}));
  svg.append(svgNode('text',{x:width-16,y:height-10,'font-size':14,fill:'#544361'},'x'),svgNode('text',{x:12,y:20,'font-size':14,fill:'#544361'},'y'));
  const plot=svgNode('g',{'clip-path':`url(#${id})`});
  for(const x of verticals)plot.append(svgNode('line',{x1:X(x),y1:pad,x2:X(x),y2:height-pad,stroke:'#a2581c','stroke-width':2,'stroke-dasharray':'7 5'}));
  for(const y of horizontals)plot.append(svgNode('line',{x1:pad,y1:Y(y),x2:width-pad,y2:Y(y),stroke:'#087d78','stroke-width':2,'stroke-dasharray':'7 5'}));
  for(const curve of curves) for(const segment of sampleSegments(curve.f,xMin,xMax,curve.breaks)) {
    const d=segment.map(([x,y],i)=>`${i?'L':'M'}${X(x).toFixed(2)},${Math.max(-10000,Math.min(10000,Y(y))).toFixed(2)}`).join(' ');
    plot.append(svgNode('path',{d,fill:'none',stroke:curve.color||'#704a9b','stroke-width':curve.width||3,'stroke-dasharray':curve.dashed?'4 5':'none'}));
  }
  for(const point of points) if(Number.isFinite(point.y))plot.append(svgNode('circle',{cx:X(point.x),cy:Y(point.y),r:5,fill:point.color||'#704a9b',stroke:'white','stroke-width':2}));
  for(const point of holes)plot.append(svgNode('circle',{cx:X(point.x),cy:Y(point.y),r:6,fill:'#fffdfa',stroke:'#704a9b','stroke-width':2.5}));
  svg.append(plot);container.replaceChildren(svg);
}
