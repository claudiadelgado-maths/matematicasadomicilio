import {escape, math} from './modelo.mjs';
export {escape, math};
export function renderMath(root=document) {
  if(!window.katex)return;
  root.querySelectorAll('[data-math]').forEach(el=>window.katex.render(el.dataset.math,el,{throwOnError:false,strict:'error'}));
}
export const formula=tex=>`<div class="formula">${math(tex)}</div>`;
export const seed=()=>Math.floor(Math.random()*4294967296);
export function read(key) {try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
export function write(key,value) {try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function focus(selector) {document.querySelector(selector)?.focus();}
export function storageNote(ok) {
  const el=document.querySelector('[data-storage]');
  if(el){el.hidden=ok;el.textContent=ok?'':'El navegador no permite guardar el avance. Puedes continuar mientras mantengas esta página abierta.';}
}
export const validSeed=s=>Number.isInteger(s)&&s>=0&&s<=4294967295;
