import {equal} from '../motor.mjs';
import {read} from './motor.mjs';
export const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function fallback(s){let i=0;function group(){if(s[i]==='{'){i++;return parse('}');}return esc(s[i++]||'');}function parse(end=''){let out='';while(i<s.length){if(end&&s[i]===end){i++;break;}if(s.startsWith('\\frac',i)){i+=5;out+='<span class="fraction"><span>'+group()+'</span><span>'+group()+'</span></span>';}else if(s.startsWith('\\mathrm',i)){i+=7;out+=group();}else if(s.startsWith('\\cdot',i)){i+=5;out+=' × ';}else if(s.startsWith('\\div',i)){i+=4;out+=' ÷ ';}else if(s[i]==='^'){i++;out+='<sup>'+group()+'</sup>';}else if(s[i]==='{'){i++;out+=parse('}');}else out+=esc(s[i++]);}return out;}return parse();}
export const m=s=>`<span data-math="${esc(s)}">${fallback(s)}</span>`;
export function render(){document.querySelectorAll('[data-math]').forEach(el=>{if(el.dataset.rendered)return;if(window.katex){window.katex.render('\\displaystyle '+el.dataset.math,el,{throwOnError:false});el.dataset.rendered='yes';}else el.innerHTML=fallback(el.dataset.math);});}
export const value=a=>String(Number((a[0]/a[1]).toFixed(4)));
export function feedback(id,text,good=false){const el=document.getElementById(id);el.className='feedback'+(good?' good':'');el.innerHTML=text;render();}
export function check(input,answer,id){const a=read(input.value);if(!a){feedback(id,'Escribe un número. Puedes usar punto o coma para los decimales.');return false;}if(!equal(a,answer)){feedback(id,'Revisa qué cantidad se conserva y vuelve a intentarlo.');return false;}feedback(id,'✓ ¡Correcto! '+m(value(answer))+'.',true);return true;}
export const answerField=(id,unit)=>`<div class="answer-row"><label for="${id}">Respuesta (${unit})</label><input id="${id}" class="numeric" inputmode="decimal" autocomplete="off"><button id="${id}-check">Comprobar</button></div>`;
export function enter(input,button){input.addEventListener('keydown',e=>{if(e.key==='Enter')button.click();});}
window.addEventListener('load',render);
