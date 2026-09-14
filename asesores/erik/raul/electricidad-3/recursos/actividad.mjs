import {pages} from './contenido.mjs';
import {mountLabs} from './laboratorios.mjs';
function renderMath(){if(!globalThis.katex)return;document.querySelectorAll('[data-tex]').forEach(el=>{try{globalThis.katex.render(el.dataset.tex,el,{throwOnError:true,trust:false});}catch{ /* El HTML matemático sigue disponible sin CDN. */ }});}
renderMath();
document.querySelectorAll('[data-lab]').forEach(mountLabs);
const page=pages.find(p=>p.key===document.body.dataset.topic),root=document.querySelector('.quiz');
let index=0,score=0,answered=false;
function show(focus=false){
 answered=false;const q=page.questions[index];root.querySelector('.quiz-progress').textContent=`Pregunta ${index+1} de ${page.questions.length}`;
 root.querySelector('.quiz-question').textContent=q.prompt;
 const options=root.querySelector('.quiz-options');options.replaceChildren();
 q.options.forEach((option,i)=>{const b=document.createElement('button');b.type='button';b.textContent=option;b.addEventListener('click',()=>answer(i));options.append(b);});
 root.querySelector('.quiz-feedback').textContent='';root.querySelector('.quiz-next').hidden=true;
 if(focus)root.querySelector('.quiz-question').focus({preventScroll:true});
}
function answer(i){if(answered)return;answered=true;const q=page.questions[index],ok=i===q.answer;if(ok)score++;
 root.querySelectorAll('.quiz-options button').forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add('right');else if(j===i)b.classList.add('wrong');});
 root.querySelector('.quiz-feedback').textContent=(ok?'✓ Correcto. ':`La respuesta correcta es: ${q.options[q.answer]} `)+q.why;
 const next=root.querySelector('.quiz-next');next.hidden=false;next.textContent=index===page.questions.length-1?'Terminar este reto':'Siguiente pregunta →';
}
root.querySelector('.quiz-next').addEventListener('click',()=>{index++;if(index<page.questions.length)show(true);else{
 root.querySelector('.quiz-progress').textContent='Reto terminado';root.querySelector('.quiz-question').textContent=`${score} de ${page.questions.length} respuestas correctas`;
 root.querySelector('.quiz-options').replaceChildren();root.querySelector('.quiz-feedback').textContent='Puedes repetir para afianzar las ideas o continuar el recorrido. Lo importante es poder explicar el porqué.';
 root.querySelector('.quiz-next').hidden=true;root.querySelector('.quiz-restart').hidden=false;if(focus)root.querySelector('.quiz-question').focus({preventScroll:true});
}});
root.querySelector('.quiz-restart').addEventListener('click',()=>{index=score=0;root.querySelector('.quiz-restart').hidden=true;show(true);});
show();
