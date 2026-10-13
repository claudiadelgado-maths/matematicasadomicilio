import {shuffle} from '../../recursos/modelo-repaso.mjs';
import {NIVELES} from './datos.mjs';
export function crearEscalera(random=Math.random){return {order:shuffle(NIVELES.map(n=>n.id),random),placed:[],errors:0,firstTry:0,currentErrors:0};}
export function colocar(s,id){
 if(s.placed.length===NIVELES.length||s.placed.includes(id)||!NIVELES.some(n=>n.id===id))return null;
 if(id!==NIVELES[s.placed.length].id){s.errors++;s.currentErrors++;return false;}
 s.placed.push(id);if(!s.currentErrors)s.firstTry++;s.currentErrors=0;return true;
}
