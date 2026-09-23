import {FUNCIONES,TRIPLES,lados} from '../../recursos/modelo.mjs';
export {FUNCIONES};
export function mezclar(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function caso(funcion,turno,random=Math.random){
  const [a,b,h]=TRIPLES[Math.floor(random()*TRIPLES.length)];
  const referencia=random()<.5?1:2;
  const grupos=[['⭐','🍓','🌙'],['🍋','🎈','🐚'],['🌻','🧁','🪁'],['🍀','🪐','🍒'],['💎','🍄','🦋'],['🌈','🥝','🐙']];
  const emojis=mezclar(grupos[turno%grupos.length],random);
  const roles=referencia===1?['CA','CO','H']:['CO','CA','H'];
  return {funcion,a,b,h,referencia,rotacion:[0,65,140,215,285,330][turno%6],emojis,roles,valores:lados(a,b,h,referencia)};
}
export function validarSeleccion(c,seleccion){return seleccion.length===2&&c.roles[seleccion[0]]===c.funcion.arriba&&c.roles[seleccion[1]]===c.funcion.abajo;}
export function validarDecimal(texto,n,d){
  const s=String(texto).trim().replace(',','.');
  if(!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return false;
  const value=Number(s);
  return Number.isFinite(value)&&Math.round((value+Number.EPSILON)*100)===Math.round((n/d+Number.EPSILON)*100);
}
export function crearProgreso(){return {nivel:1,aciertos:0,resuelto:false,terminado:false};}
export function registrar(p,correcto){if(p.resuelto||p.terminado||!correcto)return p;return {...p,aciertos:p.aciertos+1,resuelto:true};}
export function avanzar(p){if(!p.resuelto||p.terminado)return p;if(p.aciertos===6)return p.nivel===3?{...p,terminado:true}:{nivel:p.nivel+1,aciertos:0,resuelto:false,terminado:false};return {...p,resuelto:false};}
