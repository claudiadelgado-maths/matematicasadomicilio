import { comparisons, fertilization, situations, cycleCards, questions } from './datos.mjs';
import { createCycle, shuffled } from './modelo.mjs';
import { sceneMarkup as mitosisScene } from '../mitosis/escena.mjs';
import { sceneMarkup as meiosisScene } from '../meiosis/escena.mjs';
import { fertilizationMarkup } from './escena.mjs';
import { initQuiz } from '../../recursos/repaso.mjs';

const root = document.querySelector('.reproduction');
const el = id => document.getElementById(id);
const text = (id, value) => { el(id).textContent = value; };
const feedback = (id, value, success = true) => { text(id,value); el(id).dataset.state = success ? 'success' : 'retry'; };
if(root) {
  function compare(index) {
    const item = comparisons[index];
    text('compare-prompt',item.prompt);
    root.querySelectorAll('[data-compare]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.compare)===index)));
    ['mitosis','meiosis'].forEach(key=>{
      const data=item[key];
      el(`${key}-scene`).innerHTML=(key==='mitosis'?mitosisScene:meiosisScene)(data.phase);
      ['title','count','note'].forEach(part=>text(`${key}-${part}`,data[part]));
    });
  }
  root.querySelectorAll('[data-compare]').forEach(button=>button.addEventListener('click',()=>compare(Number(button.dataset.compare))));
  compare(2);

  let fusionStep=0;
  function showFusion(index, announce=false) {
    fusionStep=index; const item=fertilization[index];
    root.querySelectorAll('[data-fusion]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.fusion)===index)));
    ['title','equation','text','note'].forEach(part=>text(`fusion-${part}`,item[part]));
    el('fusion-tags').replaceChildren(...item.tags.map(tag=>{const span=document.createElement('span');span.className='pill';span.textContent=tag;return span;}));
    el('fusion-scene').innerHTML=fertilizationMarkup(index);
    text('fusion-next',['Unir los gametos →','Ver la primera mitosis →','Volver a los gametos ↻'][index]);
    if(announce) text('fusion-status',`${item.name}. ${item.equation}. ${item.text}`);
  }
  root.querySelectorAll('[data-fusion]').forEach(button=>button.addEventListener('click',()=>showFusion(Number(button.dataset.fusion),true)));
  el('fusion-next').addEventListener('click',()=>showFusion((fusionStep+1)%3,true));
  showFusion(0);

  let round=shuffled(situations), current=0, solved=false;
  function showSituation(focus=false) {
    solved=false; const item=round[current];
    text('situation-progress',`Situación ${current+1} de ${round.length}`);
    text('situation-prompt',item.prompt); text('situation-feedback','');
    root.querySelectorAll('[data-process]').forEach(button=>{button.disabled=false;button.classList.remove('correct','retry');});
    el('situation-next').hidden=true; el('situation-reset').hidden=true;
    if(focus) el('situation-prompt').focus({preventScroll:true});
  }
  root.querySelectorAll('[data-process]').forEach(button=>button.addEventListener('click',()=>{
    if(solved) return;
    const item=round[current];
    root.querySelectorAll('[data-process]').forEach(b=>b.classList.remove('retry'));
    if(button.dataset.process!==item.answer) {button.classList.add('retry');feedback('situation-feedback',`Busca otra conexión. ${item.why} Vuelve a elegir.`,false);return;}
    solved=true;button.classList.add('correct');
    root.querySelectorAll('[data-process]').forEach(b=>{b.disabled=true;});
    const last=current===round.length-1;
    feedback('situation-feedback',`¡Conexión correcta! ${item.why}${last?' Completaste las ocho situaciones.':''}`);
    el('situation-next').hidden=last;el('situation-reset').hidden=!last;
    el(last?'situation-reset':'situation-next').focus({preventScroll:true});
  }));
  el('situation-next').addEventListener('click',()=>{if(solved&&current<round.length-1){current++;showSituation(true);}});
  el('situation-reset').addEventListener('click',()=>{round=shuffled(situations);current=0;showSituation(true);});
  showSituation();

  let cycle=createCycle(), cards=shuffled(cycleCards);
  function renderCycle(focus=false) {
    el('cycle-placed').replaceChildren(...cycleCards.map((item,i)=>{
      const li=document.createElement('li'), number=document.createElement('b'), label=document.createElement('span');
      const filled=i<cycle.count; li.className=filled?'filled':'';
      number.textContent=`PASO ${i+1}${filled?` · ${item.badge}`:''}`;
      label.textContent=filled?item.label:(i===cycle.count?'Tu siguiente pieza…':'Por conectar');li.append(number,label);return li;
    }));
    text('cycle-prompt',cycle.complete?'Secuencia completa: del primer juego a un nuevo comienzo.':`Paso ${cycle.count+1} de 6 · ${cycle.count===0?'¿Con qué célula comienza este recorrido?':'¿Qué pieza sigue ahora?'}`);
    el('cycle-options').replaceChildren(...cards.map(item=>{
      const button=document.createElement('button'); button.type='button';button.className='option';button.dataset.card=item.id;
      const label=document.createElement('span'),badge=document.createElement('small');label.textContent=item.label;badge.textContent=item.badge;button.append(label,badge);
      button.disabled=cycleCards.findIndex(card=>card.id===item.id)<cycle.count;
      button.addEventListener('click',()=>{
        const expected=cycleCards[cycle.count];
        el('cycle-options').querySelectorAll('button').forEach(b=>b.classList.remove('retry'));
        if(!cycle.choose(item.id)){button.classList.add('retry');feedback('cycle-feedback',`Prueba otra pieza. ${expected.clue}`,false);return;}
        renderCycle(true);
        feedback('cycle-feedback',cycle.complete?'¡Historia conectada! La meiosis reduce; la fecundación reúne; la mitosis conserva. Las divisiones, el crecimiento y la diferenciación continúan el desarrollo.':`¡Bien! ${item.clue}`);
      });
      return button;
    }));
    el('cycle-undo').disabled=cycle.count===0;
    if(focus) el('cycle-prompt').focus({preventScroll:true});
  }
  el('cycle-undo').addEventListener('click',()=>{cycle.undo();renderCycle(true);feedback('cycle-feedback','Quitaste la última pieza. Puedes elegirla de nuevo.');});
  el('cycle-reset').addEventListener('click',()=>{cycle=createCycle();cards=shuffled(cycleCards);renderCycle(true);text('cycle-feedback','');});
  renderCycle();

  initQuiz(questions,item=>{
    const drawings={mitosis:()=>mitosisScene(5),meiosis:()=>meiosisScene(8),gametos:()=>fertilizationMarkup(0),cigoto:()=>fertilizationMarkup(1)};
    el('quiz-image').hidden=!item.visual;
    el('quiz-image').innerHTML=item.visual?drawings[item.visual]():'';
  });
  root.querySelectorAll('[data-interactive]').forEach(element=>{element.hidden=false;});
}
