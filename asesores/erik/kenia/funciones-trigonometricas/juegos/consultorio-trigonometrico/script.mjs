import {FUNCIONES,mezclar,caso,validarSeleccion,validarDecimal,crearProgreso,registrar,avanzar} from './modelo.mjs';
import {geometria} from '../../recursos/modelo.mjs';
const $=id=>document.getElementById(id);
const characters=[['🦊','Luna, la exploradora'],['🤖','Pixel, el robot'],['🐸','Bruno, el saltarín'],['🧙‍♀️','Mora, la maga'],['🐼','Tao, el jardinero'],['👩‍🚀','Vega, la astronauta'],['🐱','Michi, el músico'],['🦉','Olivia, la inventora'],['🐧','Pipo, el patinador'],['🦁','Leo, el pintor'],['🐰','Nube, la repostera'],['🐻','Miel, el bibliotecario'],['🦄','Iris, la soñadora'],['🐨','Koa, el viajero'],['🐯','Tigre, el entrenador'],['🐶','Coco, el detective'],['🧑‍🎨','Sol, la artista'],['🐲','Chispa, el dragón']];
let progress=crearProgreso(),deck=mezclar(FUNCIONES),current,selection=[null,null],active=0;
const labels=()=>progress.nivel===1?current.emojis:[current.a,current.b,current.h];
function svgNode(name,attrs,text){const node=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));if(text!==undefined)node.textContent=text;return node;}
function draw(){
 const {vertices:v,etiquetas}=geometria(current.a,current.b,current.rotacion),lab=labels();
 const description=`Triángulo rectángulo ABC. Ángulo recto en C. θ en ${current.referencia===1?'A':'B'}. Lado CA: ${lab[0]}; CB: ${lab[1]}; AB: ${lab[2]}.`;
 const bounds=[...v,...etiquetas];
 const minX=Math.min(...bounds.map(p=>p[0]))-32,minY=Math.min(...bounds.map(p=>p[1]))-32;
 const width=Math.max(...bounds.map(p=>p[0]))-minX+32,height=Math.max(...bounds.map(p=>p[1]))-minY+32;
 const svg=svgNode('svg',{viewBox:`${minX} ${minY} ${width} ${height}`,role:'img','aria-label':description});
 svg.append(svgNode('polygon',{points:v.map(x=>x.join(',')).join(' '),fill:'#e5f5f0',stroke:'#235e68','stroke-width':4,'stroke-linejoin':'round'}));
 const unit=(a,b)=>{let d=Math.hypot(b[0]-a[0],b[1]-a[1]);return [(b[0]-a[0])/d,(b[1]-a[1])/d];};
 const u=unit(v[0],v[1]),w=unit(v[0],v[2]);
 const square=[[v[0][0]+u[0]*15,v[0][1]+u[1]*15],[v[0][0]+(u[0]+w[0])*15,v[0][1]+(u[1]+w[1])*15],[v[0][0]+w[0]*15,v[0][1]+w[1]*15]];
 svg.append(svgNode('polyline',{points:square.map(x=>x.join(',')).join(' '),fill:'none',stroke:'#235e68','stroke-width':2}));
 const origin=v[current.referencia],p=unit(origin,v[0]),q=unit(origin,v[3-current.referencia]),bis=[p[0]+q[0],p[1]+q[1]],len=Math.hypot(...bis);
 // Purple vertex and arc identify θ even for narrow angles or rotated triangles.
 svg.append(svgNode('circle',{cx:origin[0],cy:origin[1],r:6,fill:'#833bb1'}));
 const cross=p[0]*q[1]-p[1]*q[0];
 svg.append(svgNode('path',{d:`M ${origin[0]+p[0]*32} ${origin[1]+p[1]*32} A 32 32 0 0 ${cross>0?1:0} ${origin[0]+q[0]*32} ${origin[1]+q[1]*32}`,fill:'none',stroke:'#833bb1','stroke-width':3}));
 svg.append(svgNode('text',{x:origin[0]+bis[0]/len*53,y:origin[1]+bis[1]/len*53+7,'text-anchor':'middle','font-size':25,'font-weight':800,fill:'#833bb1'},'θ'));
 etiquetas.forEach(([x,y],i)=>{svg.append(svgNode('rect',{x:x-25,y:y-24,width:50,height:48,rx:16,fill:'#fff',stroke:'#d5e4e0'}));svg.append(svgNode('text',{x,y:y+9,'text-anchor':'middle','font-size':progress.nivel===1?30:23,'font-weight':800,fill:'#174753'},lab[i]));});
 $('triangle').replaceChildren(svg);
}
function slots(){document.querySelectorAll('[data-slot]').forEach((b,i)=>{b.textContent=selection[i]===null?'?':labels()[selection[i]];b.setAttribute('aria-pressed',String(active===i));b.setAttribute('aria-label',`${i===0?'Numerador':'Denominador'}: ${b.textContent}`);});}
function render(){
 selection=[null,null];active=0;current=caso(deck[progress.aciertos],(progress.nivel-1)*6+progress.aciertos);
 const [emoji,name]=characters[(progress.nivel-1)*6+progress.aciertos];$('portrait').textContent=emoji;$('patient-name').textContent=name;
 $('request').textContent=`¿Me ayudas a encontrar ${current.funcion.nombre.toLowerCase()} de θ?`;
 $('level-title').textContent=['Nivel 1 · Emojis y estructura','Nivel 2 · Fracciones con números','Nivel 3 · Resultado decimal'][progress.nivel-1];
 $('count').textContent=`Caso ${progress.aciertos+1} de 6`;$('progress').value=progress.aciertos;
 document.querySelectorAll('[data-level]').forEach(li=>{const n=Number(li.dataset.level);li.classList.toggle('current',n===progress.nivel);li.querySelector('span').textContent=n<progress.nivel?'✓ Completado':n===progress.nivel?'En curso':'🔒 Bloqueado';});
 const tex=`${current.funcion.simbolo}(\\theta)=`;
 if(globalThis.katex)globalThis.katex.render(tex,$('formula'),{throwOnError:false});else $('formula').textContent=current.funcion.nombre+' θ =';
 $('fraction').hidden=progress.nivel===3;$('decimal-wrap').hidden=progress.nivel!==3;
 $('decimal').value='';$('decimal').disabled=false;$('choices').replaceChildren();
 if(progress.nivel<3)mezclar([0,1,2]).forEach(i=>{const b=document.createElement('button');b.type='button';b.textContent=labels()[i];b.dataset.choice=i;b.setAttribute('aria-label',`Elegir ${labels()[i]}`);b.addEventListener('click',()=>{selection[active]=i;slots();$('feedback').textContent='';});$('choices').append(b);});
 $('feedback').textContent='';$('feedback').removeAttribute('data-result');$('next').hidden=true;$('check').hidden=false;
 document.querySelectorAll('[data-slot]').forEach(b=>b.disabled=false);slots();draw();
}
for(const b of document.querySelectorAll('[data-slot]'))b.addEventListener('click',()=>{active=Number(b.dataset.slot);slots();});
$('answer').addEventListener('submit',event=>{event.preventDefault();if(progress.resuelto)return;
 const f=current.funcion,ok=progress.nivel===3?validarDecimal($('decimal').value,current.valores[f.arriba],current.valores[f.abajo]):validarSeleccion(current,selection);
 progress=registrar(progress,ok);$('feedback').dataset.result=ok?'ok':'error';
 $('feedback').textContent=ok?'¡Gracias! Ahora sí lo entiendo. 🌟':(progress.nivel===3?'Todavía no. Revisa la división; puedes usar punto o coma decimal.':'Revisa los dos lados respecto a θ. Puedes cambiar las casillas y volver a intentar.');
 if(!ok)return;
 $('portrait').classList.remove('celebrate');void $('portrait').offsetWidth;$('portrait').classList.add('celebrate');$('request').textContent='¡Caso resuelto! Gracias por ayudarme.';$('progress').value=progress.aciertos;
 $('check').hidden=true;$('next').hidden=false;$('next').textContent=progress.aciertos===6?(progress.nivel===3?'Ver mi logro →':`¡Nivel completado! Abrir nivel ${progress.nivel+1} →`):'Siguiente paciente →';
 document.querySelectorAll('[data-slot],[data-choice],#decimal').forEach(b=>b.disabled=true);
});
$('next').addEventListener('click',()=>{const before=progress.nivel;progress=avanzar(progress);if(progress.terminado){$('play').hidden=true;$('finish').hidden=false;document.querySelector('[data-level="3"] span').textContent='✓ Completado';$('finish').focus();return;}if(before!==progress.nivel)deck=mezclar(FUNCIONES);render();$('level-title').tabIndex=-1;$('level-title').focus();});
$('restart').addEventListener('click',()=>{progress=crearProgreso();deck=mezclar(FUNCIONES);$('finish').hidden=true;$('play').hidden=false;render();$('level-title').focus();});
render();
