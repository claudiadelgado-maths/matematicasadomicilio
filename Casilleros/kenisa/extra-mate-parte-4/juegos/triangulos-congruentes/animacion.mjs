const BASE=[{x:-80,y:-60},{x:-80,y:60},{x:80,y:60}],COLORES=['#5472b6','#9660ad','#19847d'];
export function puntosCopia(estado,movil=false){
 const origen=movil?{x:200,y:165}:{x:215,y:180},r=estado.giro*Math.PI/180;
 return BASE.map(p=>({x:origen.x+(movil?0:370)*estado.separacion+(p.x*Math.cos(r)-p.y*Math.sin(r))*estado.espejo,y:origen.y+(movil?310:0)*estado.separacion+p.x*Math.sin(r)+p.y*Math.cos(r)}));
}
function figura(p,nombres,copia=false,etiquetas=true){
 const centro={x:p.reduce((s,v)=>s+v.x,0)/3,y:p.reduce((s,v)=>s+v.y,0)/3},tinta=copia?'#19847d':'#7860a6';
 let dibujo=`<polygon points="${p.map(v=>`${v.x},${v.y}`).join(' ')}" fill="${copia?'#76d4b7':'#bfa9e6'}" fill-opacity="${copia?'.28':'.3'}" stroke="${tinta}" stroke-width="4" stroke-linejoin="round" ${copia?'stroke-dasharray="9 5"':''}/>`;
 if(!etiquetas)return dibujo;
 p.forEach((v,i)=>{const n=Math.hypot(v.x-centro.x,v.y-centro.y)||1,x=v.x+(v.x-centro.x)/n*24,y=v.y+(v.y-centro.y)/n*24;dibujo+=`<circle cx="${v.x}" cy="${v.y}" r="5" fill="${COLORES[i]}"/><text x="${x}" y="${y+6}" fill="${COLORES[i]}" class="clone-vertex">${nombres[i]}</text>`;});
 [[0,1,6],[1,2,8],[0,2,10]].forEach(([i,j,medida])=>{const x=(p[i].x+p[j].x)/2,y=(p[i].y+p[j].y)/2;let nx=p[j].y-p[i].y,ny=p[i].x-p[j].x,n=Math.hypot(nx,ny)||1;if(nx*(x-centro.x)+ny*(y-centro.y)<0){nx=-nx;ny=-ny;}dibujo+=`<text class="clone-length" x="${x+nx/n*22}" y="${y+ny/n*22+5}" fill="${tinta}">${medida}</text>`;});
 return dibujo;
}
export function svgClon(estado,movil=false){
 const inicial={separacion:0,giro:0,espejo:1},original=puntosCopia(inicial,movil),copia=puntosCopia(estado,movil),segundo=movil?{x:200,y:475}:{x:585,y:180};
 const encima=estado.visible>.99&&estado.separacion<.001&&Math.abs(estado.giro%360)<.001&&estado.espejo>.999;
 return `<svg viewBox="0 0 ${movil?'400 650':'800 360'}" role="img" aria-label="Triángulo ABC y copia XYZ. AB y XY miden 6; BC y YZ miden 8; AC y XZ miden 10 centímetros. Al superponerlos, todos los vértices coinciden.">
 <circle cx="${movil?200:215}" cy="${movil?165:180}" r="133" fill="#f3eefc"/>
 <circle cx="${segundo.x}" cy="${segundo.y}" r="133" fill="#eef9f5" stroke="#c9e7dc" stroke-dasharray="4 7"/>
 <text x="${movil?200:215}" y="${movil?24:26}" class="clone-caption">${encima?'ABC ≅ XYZ':'Original · ABC'}</text>
 <text x="${segundo.x}" y="${movil?334:26}" class="clone-caption">${encima?'Todo encaja ✦':'Copia · XYZ'}</text>
 ${figura(original,encima?['A / X','B / Y','C / Z']:['A','B','C'])}
 ${estado.visible<.01?`<text x="${segundo.x}" y="${segundo.y}" class="clone-placeholder">Clona y descubre</text>`:''}
 ${encima?`<text x="${segundo.x}" y="${segundo.y-10}" class="clone-match">¡Coinciden!</text><text x="${segundo.x}" y="${segundo.y+22}" class="clone-placeholder">Forma y tamaño</text>`:''}
 ${estado.espejo<.99?`<path d="M${segundo.x},${segundo.y-118}v236" stroke="#66aabe" stroke-width="2" stroke-dasharray="5 5"/>`:''}
 <g opacity="${estado.visible}">${figura(copia,['X','Y','Z'],true,!encima&&Math.abs(estado.espejo)>.2&&(estado.separacion>.15||Math.abs(estado.giro%360)>.1||estado.espejo<.99))}</g></svg>`;
}
export function iniciarClon(){
 const art=document.getElementById('clone-art'),status=document.getElementById('clone-status');if(!art||!status)return;
 const movil=matchMedia('(max-width:600px)'),reducido=matchMedia('(prefers-reduced-motion:reduce)');let frame=0,finalizarMovimiento=null,estado={separacion:0,giro:0,espejo:1,visible:0},accion='';
 const dibujar=()=>{art.innerHTML=svgClon(estado,movil.matches);};
 function animar(destino,terminar){
  cancelAnimationFrame(frame);const desde={...estado},t0=performance.now(),duracion=reducido.matches?0:700;
  finalizarMovimiento=()=>{cancelAnimationFrame(frame);estado={...estado,...destino};finalizarMovimiento=null;dibujar();terminar?.();};
  function paso(t){const u=duracion?Math.min(1,(t-t0)/duracion):1,e=u*u*(3-2*u);for(const k of Object.keys(destino))estado[k]=desde[k]+(destino[k]-desde[k])*e;dibujar();if(u<1)frame=requestAnimationFrame(paso);else{finalizarMovimiento=null;terminar?.();}}
  frame=requestAnimationFrame(paso);
 }
 const textos={clonar:'Copiamos ABC y movemos XYZ. Los lados siguen midiendo 6, 8 y 10 cm.',girar:'La copia gira. Sus letras viajan con sus vértices; las medidas no cambian.',reflejar:'Volteamos la copia como una hoja frente al espejo. La forma y el tamaño se conservan.',superponer:'¡Encajan exactamente! A coincide con X, B con Y y C con Z: son congruentes.'};
 document.querySelectorAll('[data-transform]').forEach(b=>b.addEventListener('click',()=>{
  accion=b.dataset.transform;document.querySelectorAll('[data-transform]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));
  status.textContent=accion==='superponer'?'Deshacemos el giro y el reflejo, y llevamos la copia al original…':textos[accion];
  const fin=()=>{status.textContent=textos[accion];};
  if(accion==='clonar')animar({separacion:1,giro:0,espejo:1,visible:1},fin);
  else if(accion==='girar')animar({separacion:1,giro:estado.giro+120,espejo:estado.espejo<0?-1:1,visible:1},fin);
  else if(accion==='reflejar')animar({separacion:1,giro:Math.round(estado.giro/120)*120,espejo:estado.espejo<0?1:-1,visible:1},fin);
  else animar({separacion:estado.separacion,giro:0,espejo:1,visible:1},()=>animar({separacion:0,giro:0,espejo:1,visible:1},fin));
 }));
 movil.addEventListener('change',dibujar);reducido.addEventListener('change',()=>{if(reducido.matches)finalizarMovimiento?.();});dibujar();
}
