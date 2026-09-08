import {integer} from './motor.mjs';
import {$,feedback,renderStatic} from './ui.mjs';
renderStatic();
const questions=[
  [
    "💡",
    "¿Qué dejaría de funcionar en tu casa si se fuera la luz?",
    "Las lámparas y los aparatos que dependen directamente del enchufe dejarían de funcionar: por ejemplo, el refrigerador, el ventilador o un router sin respaldo de batería. Un teléfono cargado o una linterna con pilas podrían seguir funcionando porque llevan una fuente de energía almacenada. Por eso, un corte no afecta de la misma manera a todos los aparatos."
  ],
  [
    "📱",
    "¿Por qué puedes usar el teléfono después de desconectarlo del cargador?",
    "Porque su batería almacena energía mediante procesos químicos y puede entregarla al teléfono mientras se usa. El cargador permite reponer esa energía. Al desconectarlo, el teléfono no se queda sin energía de inmediato: sigue usando la batería hasta que su nivel baja y necesita recargarse."
  ],
  [
    "🔋",
    "¿Por qué un control remoto deja de responder cuando sus pilas se agotan?",
    "El control necesita energía para reconocer los botones y enviar una señal al televisor. Cuando las pilas están agotadas, ya no pueden alimentar correctamente el circuito y el control puede fallar o dejar de responder. Los botones pueden estar bien: el problema está en la fuente que le proporciona energía."
  ],
  [
    "🔌",
    "¿Qué haces al encender y apagar una lámpara con su interruptor?",
    "En una lámpara sencilla, el interruptor cierra o abre el camino por el que puede circular la corriente. Al cerrarlo, la lámpara recibe energía y enciende; al abrirlo, ese camino se interrumpe y se apaga. El interruptor no fabrica la energía: permite o impide que llegue a la lámpara."
  ],
  [
    "🍞",
    "¿En qué se parecen una tostadora, un ventilador y una bocina?",
    "Los tres utilizan energía eléctrica, pero producen efectos distintos. La tostadora la transforma principalmente en calor; el ventilador mueve sus aspas con un motor; la bocina hace vibrar el aire para producir sonido. La electricidad no sirve únicamente para iluminar: puede producir calor, movimiento y sonido."
  ],
  [
    "🌐",
    "¿Por qué el Wi-Fi de casa puede desaparecer cuando se va la luz, aunque el teléfono tenga batería?",
    "El teléfono puede seguir encendido con su batería, pero el router y otros equipos de la conexión también necesitan alimentación. Si se apagan, dejan de proporcionar esa conexión Wi-Fi. La batería del teléfono no alimenta al router; por eso el teléfono puede funcionar y, aun así, perder el acceso a esa red."
  ],
  [
    "🧶",
    "¿Te ha pasado que un globo atraiga el cabello o que la ropa se pegue después de secarse?",
    "Al rozarse, ciertos materiales pueden quedar cargados eléctricamente. Esa carga produce fuerzas de atracción que hacen que el cabello se levante o que algunas prendas se adhieran. Es un ejemplo de electricidad estática: los objetos pueden mostrar estos efectos sin estar conectados a un enchufe, y la atracción suele desaparecer cuando pierden la carga acumulada."
  ],
  [
    "🔦",
    "¿Por qué una linterna puede iluminar sin estar conectada a la pared?",
    "La linterna lleva su propia fuente de energía: pilas o una batería recargable. Al encenderla, esa fuente alimenta la lámpara o el LED. Puede funcionar lejos de un enchufe, aunque no de forma ilimitada: cuando la energía disponible se agota, hace falta recargar la batería o cambiar las pilas."
  ]
];
let used=new Set(),angle=0,animation=null,generation=0,busy=false;
const ns='http://www.w3.org/2000/svg';
function svgElement(name,attributes){const el=document.createElementNS(ns,name);Object.entries(attributes).forEach(([k,v])=>el.setAttribute(k,v));return el;}
function draw(){
  $('roulette').replaceChildren();const colors=['#a5d6fc','#d0c2f2','#9cddd7','#fae5a1','#b8def1','#c0d0fb','#b7e7e1','#cdddfa'];
  questions.forEach((q,i)=>{const a=(-90+i*45)*Math.PI/180,b=a+Math.PI/4;const path=svgElement('path',{d:`M160 160 L${160+150*Math.cos(a)} ${160+150*Math.sin(a)} A150 150 0 0 1 ${160+150*Math.cos(b)} ${160+150*Math.sin(b)} Z`,fill:used.has(i)?'#d4dce4':colors[i],stroke:'white','stroke-width':3});const mid=(a+b)/2;const label=svgElement('text',{x:160+110*Math.cos(mid),y:168+110*Math.sin(mid),'text-anchor':'middle','font-size':25});label.textContent=used.has(i)?'✓':q[0];$('roulette').append(path,label);});
}
function finish(index,token){if(token!==generation)return;busy=false;used.add(index);draw();const article=document.createElement('article'),title=document.createElement('h3'),details=document.createElement('details'),summary=document.createElement('summary'),answer=document.createElement('p');title.textContent=questions[index][1];summary.textContent='Ver respuesta';answer.textContent=questions[index][2];details.append(summary,answer);article.append(title,details);$('history').prepend(article);$('spin').disabled=used.size===questions.length;feedback(used.size===questions.length?'✓ Introducción completada':'Pregunta lista para conversar.',used.size===questions.length?true:null);}
$('spin').addEventListener('click',()=>{
  if(busy||used.size===questions.length)return;busy=true;$('spin').disabled=true;const available=questions.map((_,i)=>i).filter(i=>!used.has(i)),index=available[integer(0,available.length-1)],from=angle,token=generation;
  angle+=1080+(360-((angle+index*45+22.5)%360))%360;feedback('Girando…');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){$('roulette').style.transform=`rotate(${angle}deg)`;finish(index,token);return;}
  animation=$('roulette').animate([{transform:`rotate(${from}deg)`},{transform:`rotate(${angle}deg)`}],{duration:1500,easing:'cubic-bezier(.15,.7,.15,1)',fill:'forwards'});
  animation.onfinish=()=>{$('roulette').style.transform=`rotate(${angle}deg)`;animation.cancel();animation=null;finish(index,token);};
});
$('reset-wheel').addEventListener('click',()=>{generation++;animation?.cancel();animation=null;busy=false;used=new Set();angle=0;$('roulette').style.transform='rotate(0deg)';$('history').replaceChildren();$('spin').disabled=false;feedback();draw();});
window.addEventListener('pagehide',()=>{generation++;animation?.cancel();animation=null;busy=false;$('spin').disabled=used.size===questions.length;});draw();
