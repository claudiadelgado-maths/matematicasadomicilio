import {loadProgress} from './modelo.mjs';
let storage;try{storage=window.localStorage;}catch{}
const completed=loadProgress(storage);
const root=document.getElementById('saved-progress');
if(root){root.textContent=`${completed.length} de 10 caminos completados`;const list=document.getElementById('level-dots');for(let i=1;i<=10;i++){const span=document.createElement('span');span.textContent=String(i);if(completed.includes(i)){span.className='done';span.setAttribute('aria-label',`Tabla del ${i} completada`);}else span.setAttribute('aria-label',`Tabla del ${i} pendiente`);list.append(span);}}
