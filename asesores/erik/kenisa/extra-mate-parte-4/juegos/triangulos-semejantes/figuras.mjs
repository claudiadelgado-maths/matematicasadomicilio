export {escapar,transformar,ajustarPareja,dibujarTriangulo,pareja} from '../../recursos/figuras-triangulos.mjs?v=20261009-2';
export function introSVG(movil=false){
 const x=movil?60:74,y=movil?55:65;
 const etiqueta=(x,y,texto,clase='')=>`<text x="${x}" y="${y}" class="${clase}">${texto}</text>`;
 return `<svg viewBox="0 0 ${movil?'440 620':'800 380'}" role="img" aria-label="ABC y AXY son semejantes. AB mide 12, BC 16 y AC 20 centímetros; AX mide 6, XY 8 y AY 10. A es 53,13 grados; B y X son 90 grados; C e Y son 36,87 grados, aproximadamente. XY es paralelo a BC.">
 <g class="large-triangle"><path d="M${x},${y}V${y+240}H${x+320}Z" fill="#e9e3fb" stroke="#7860a6" stroke-width="4" stroke-linejoin="round"/>
 <path d="M${x},${y+220}h20v20" fill="none" stroke="#9660ad" stroke-width="2"/>
 <g class="vertex-names">${etiqueta(x-15,y-16,'A')}${etiqueta(x-18,y+267,'B')}${etiqueta(x+328,y+257,'C')}</g>
 <g class="side-values">${etiqueta(x-22,y+127,'12','apart-only')}${etiqueta(x+160,y+269,'16')}${etiqueta(x+195,y+103,'20','apart-only')}</g>
 <g class="angle-values">${etiqueta(x+28,y+62,'53,13°','apart-only')}${etiqueta(x+46,y+219,'90°')}${etiqueta(x+230,y+223,'36,87°')}</g></g>
 <g class="small-triangle"><path d="M${x},${y}V${y+120}H${x+160}Z" fill="#d0f3e7" fill-opacity=".88" stroke="#19847d" stroke-width="4" stroke-linejoin="round"/>
 <path d="M${x},${y+105}h15v15" fill="none" stroke="#9660ad" stroke-width="2"/>
 <g class="vertex-names">${etiqueta(x-13,y-14,'A','apart-only')}${etiqueta(x-16,y+147,'X')}${etiqueta(x+169,y+137,'Y')}</g>
 <g class="side-values">${etiqueta(x-22,y+69,'6')}${etiqueta(x+85,y+147,'8')}${etiqueta(x+109,y+42,'10')}</g>
 <g class="angle-values">${etiqueta(x+31,y+61,'53,13°','apart-only')}${etiqueta(x+36,y+106,'90°','apart-only')}${etiqueta(x+112,y+108,'36,87°','apart-only')}</g></g>
 <text x="${movil?290:640}" y="${movil?365:80}" class="intro-invitation">Misma forma</text><text x="${movil?290:640}" y="${movil?391:108}" class="intro-invitation">otra escala ✦</text></svg>`;
}
