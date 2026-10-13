import {pick,numeric} from './motor.mjs';
import {questions} from './preguntas.mjs';
import {render,conceptual,numericActivity} from './ui.mjs';
import {laboratory} from './laboratorios.mjs';
const topic=document.body.dataset.topic,topics=['coulomb','corriente','voltaje','resistencia','ohm','potencia','joule'];
const previous=new Map();
function nextQuestion(t){const pool=questions.filter(q=>t?q.topic===t:q.topic!=='repaso'),q=pick(pool.filter(q=>q.id!==previous.get('concept')));previous.set('concept',q.id);return q;}
function nextNumeric(t){let r,key;do{r=numeric(t);key=JSON.stringify([r.topic,r.target,r.data]);}while(key===previous.get('numeric'));previous.set('numeric',key);return r;}
if(document.querySelector('#lab'))laboratory(document.querySelector('#lab'),topic);
if(document.querySelector('#concept-game')){const next=()=>conceptual(document.querySelector('#concept-game'),nextQuestion(topic==='inicio'?'repaso':topic));document.querySelector('#new-concept').onclick=next;next();}
if(document.querySelector('#numeric-game')){const next=()=>numericActivity(document.querySelector('#numeric-game'),nextNumeric(topic));document.querySelector('#new-numeric').onclick=next;next();}
if(document.querySelector('#challenge-game')){let type=pick(['concept','numeric']);const next=()=>{const root=document.querySelector('#challenge-game');if(type==='concept')conceptual(root,nextQuestion());else numericActivity(root,nextNumeric(pick(topics)));type=type==='concept'?'numeric':'concept';};document.querySelector('#new-challenge').onclick=next;next();}
render();window.addEventListener('load',()=>render());
