import { structures, bank, categories, cards } from '../../recursos/contenido.mjs';
import { mountQuiz } from '../../../biologia-parte-1/recursos/cuestionarios.mjs';
import { shuffle, createQuizState, answerQuestion, nextQuestion, scoreQuiz, createErrorRound } from '../../../biologia-parte-1/recursos/modelo-repaso.mjs?v=20260929-3';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const focus = (element) => { element.focus({preventScroll:true}); element.scrollIntoView({block:'nearest',behavior:'instant'}); };
const makeButton = (label, action) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.addEventListener('click', action); return button; };
let selected = 0;
let mode = 'explore';
let identification = null;
const visited = new Set();
const choices = structures.map(({id,name}) => ({id,text:name}));
const structureCategories = structures.map(({id,name}) => ({id,name}));
// Keep numbered controls outside the cell so they do not cover the structures.
const pinPositions = [[506,298],[122,350],[280,354],[195,61],[70,80],[613,271],[332,60],[432,354]];
const leader = document.createElementNS('http://www.w3.org/2000/svg','path');
leader.setAttribute('class','pin-leader');
leader.setAttribute('fill','none');
leader.setAttribute('stroke','#75867b');
leader.setAttribute('stroke-width','2');
leader.setAttribute('stroke-dasharray','5 4');
$('.diagram-wrap svg').insertBefore(leader,$('.diagram-wrap .target'));
const pins = structures.map((part, index) => {
  const button = makeButton(String(index+1), () => selectPart(index));
  button.className = 'part-pin';
  button.style.left = `${pinPositions[index][0] / 720 * 100}%`;
  button.style.top = `${pinPositions[index][1] / 430 * 100}%`;
  button.setAttribute('aria-label', `${index+1}. ${part.name}`);
  $('#part-pins').append(button);
  return button;
});

function markPart(part) {
  $$('.diagram-wrap [data-part]').forEach(group => group.classList.toggle('active-part', group.dataset.part === part.id));
  const target = $('.diagram-wrap .target');
  target.removeAttribute('hidden');
  target.setAttribute('transform', `translate(${part.x} ${part.y})`);
  const [pinX,pinY]=pinPositions[structures.findIndex(item=>item.id===part.id)];
  leader.setAttribute('d',`M${pinX} ${pinY}L${part.x} ${part.y}`);
  if(mode==='explore') leader.removeAttribute('hidden'); else leader.setAttribute('hidden','');
}

function selectPart(index) {
  selected = (index + structures.length) % structures.length;
  const part = structures[selected];
  visited.add(part.id);
  markPart(part);
  $('#part-number').textContent = `Estructura ${String(selected+1).padStart(2,'0')} / 08`;
  $('#part-name').textContent = part.name;
  $('#part-function').textContent = part.function;
  $('#part-detail').textContent = part.detail;
  $('#part-cue').textContent = part.cue;
  $('#explored-count').textContent = `${visited.size} de 8 exploradas`;
  pins.forEach((button,i) => button.setAttribute('aria-pressed', String(i===selected)));
  $$('#part-buttons button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.partChoice===part.id)));
}

function explore() {
  $('#explore-info').hidden = false;
  $('#identify-info').hidden = true;
  $('#identify-result').hidden = true;
  $('#part-pins').hidden = false;
  $('#explored-count').hidden = false;
  $('#part-buttons').hidden = false;
  $('#parts-instruction').hidden = false;
  $('#parts-instruction').textContent = 'Selecciona una estructura para descubrir su función:';
  $('#part-buttons').replaceChildren(...structures.map((part,index) => {
    const button = makeButton('', () => selectPart(index));
    button.dataset.partChoice = part.id;
    const number = document.createElement('span'); number.textContent = index+1;
    button.append(number,document.createTextNode(part.name));
    return button;
  }));
  selectPart(selected);
}

function startIdentification() {
  identification = createQuizState(shuffle(structures).map(part => ({...part,categoryId:part.id,correctId:part.id,choices:shuffle(choices)})),structureCategories);
  $('#explore-info').hidden = true;
  $('#identify-result').hidden = true;
  $('#part-pins').hidden = true;
  $('#explored-count').hidden = true;
  $('#parts-instruction').hidden = false;
  $('#parts-instruction').textContent = 'Elige la estructura que corresponde al dibujo y a la función:';
  showIdentification();
}

function showIdentification() {
  const part = identification.round[identification.index];
  $('#identify-info').hidden = false;
  $('#part-buttons').hidden = false;
  markPart(part);
  $('#identify-count').textContent = `Reto ${identification.index+1} de 8 · ${scoreQuiz(identification).correct} aciertos`;
  $('#identify-prompt').textContent = part.question;
  $('#identify-cue').textContent = `Pista visual: ${part.cue.toLowerCase()}. El anillo señala esa parte.`;
  $('#identify-feedback').textContent = '';
  $('#identify-feedback').className = 'feedback';
  $('#identify-next').disabled = true;
  $('#identify-next').textContent = identification.index===7 ? 'Ver mi resultado →' : 'Siguiente reto →';
  $('#part-buttons').replaceChildren(...part.choices.map(choice => {
    const button = makeButton(choice.text,event => {
      const answer = answerQuestion(identification,choice.id);
      if (!answer) return;
      $$('#part-buttons button').forEach(option => {
        const correct = option.dataset.partChoice===part.id;
        option.disabled = true;
        option.classList.toggle('correct',correct);
        option.classList.toggle('incorrect',option===button&&!answer.correct);
        if (correct) option.textContent = `✓ ${part.name}`;
        else if (option===button) option.textContent = `× ${choice.text}`;
      });
      $('#identify-feedback').textContent = `${answer.correct ? '✓ ¡Conexión correcta!' : `La respuesta es ${part.name}.`} ${part.function} ${part.detail}`;
      $('#identify-feedback').classList.toggle('wrong',!answer.correct);
      $('#identify-next').disabled = false;
      $('#identify-count').textContent = `Reto ${identification.index+1} de 8 · ${scoreQuiz(identification).correct} aciertos`;
      if(event.detail===0) $('#identify-next').focus({preventScroll:true});
      else $('#identify-feedback').scrollIntoView({block:'nearest',behavior:'instant'});
    });
    button.dataset.partChoice=choice.id;
    return button;
  }));
}

$('#identify-next').addEventListener('click',() => {
  if(!nextQuestion(identification)) return;
  if(identification.finished){
    $('#identify-info').hidden=true;
    $('#part-buttons').hidden=true;
    $('#parts-instruction').hidden=true;
    $('#identify-result').hidden=false;
    $('#identify-score').textContent=`${scoreQuiz(identification).correct} de 8 conexiones correctas`;
    focus($('#identify-score'));
  } else {showIdentification();focus($('#identify-prompt'));}
});
$('#identify-restart').addEventListener('click',() => {startIdentification();focus($('#identify-prompt'));});
$$('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
  if(mode===button.dataset.mode) return;
  mode=button.dataset.mode;
  $$('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  if(mode==='explore') explore(); else {startIdentification();focus($('#identify-prompt'));}
}));
$('#prev-part').addEventListener('click',()=>selectPart(selected-1));
$('#next-part').addEventListener('click',()=>selectPart(selected+1));
$('#explore-info').setAttribute('aria-live','polite');
$('#explore-info').setAttribute('aria-atomic','true');
explore();

$$('[data-compare]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.compare;
  $$('[data-compare]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  $$('[data-comparison]').forEach(row=>{row.hidden=filter!=='all'&&row.dataset.comparison!==filter;});
  $('#comparison-status').textContent=filter==='same'?'Tres filas compartidas: membrana, citoplasma, ribosomas y ADN.':filter==='different'?'Seis diferencias. La presencia de un núcleo con membrana es la clave.':'Compara ambas columnas: el núcleo es la pista principal.';
}));

const classificationCategories=[{id:'clasificacion',name:'Organización celular'}];
let classification;
let initialClassificationScore=null;
function startClassification(round=shuffle(cards),reviewing=false){
  if(!reviewing) initialClassificationScore=null;
  classification=createQuizState(round,classificationCategories);
  $('#class-result').hidden=true;
  $('#class-playing').hidden=false;
  showCard();
}
function updateCardProgress(){
  const score=scoreQuiz(classification);
  $('#class-count').textContent=`${initialClassificationScore?'Repaso · ':''}Tarjeta ${classification.index+1} de ${score.total}`;
  $('#class-score').textContent=`${score.correct} ${score.correct===1?'acierto':'aciertos'}`;
  $('#class-meter').max=score.total;
  $('#class-meter').value=score.answered;
  $('#class-meter').textContent=`${score.answered} de ${score.total}`;
}
function showCard(){
  const card=classification.round[classification.index];
  $('#class-name').textContent=card.name;
  $('#class-clue').textContent=card.clue;
  $('#class-type').textContent=card.icon==='pista'?'Interpreta la pista':'Observa el ejemplo';
  $('#organism-icon').setAttribute('href',`../../recursos/organismos.svg#${card.icon}`);
  $('#class-feedback').textContent='';
  $('#class-feedback').className='feedback';
  $('#class-next').disabled=true;
  $('#class-next').textContent=classification.index===classification.round.length-1?'Ver mi resultado →':'Siguiente tarjeta →';
  $$('[data-class]').forEach(button=>{button.disabled=false;button.className='';button.removeAttribute('aria-label');});
  updateCardProgress();
}
$$('[data-class]').forEach(button=>button.addEventListener('click',event=>{
  const answer=answerQuestion(classification,button.dataset.class);
  if(!answer)return;
  const card=classification.round[classification.index];
  const correctLabel=card.correctId==='pro'?'procariota':'eucariota';
  $$('[data-class]').forEach(option=>{
    const correct=option.dataset.class===card.correctId;
    option.disabled=true;
    option.classList.toggle('correct',correct);
    option.classList.toggle('incorrect',!answer.correct&&option===button);
    option.setAttribute('aria-label',`${option.dataset.class==='pro'?'Procariota':'Eucariota'}.${correct?' Respuesta correcta.':option===button?' Tu respuesta: incorrecta.':''}`);
  });
  $('#class-feedback').textContent=`${answer.correct?'✓ ¡Correcto!':'Vamos a aclararlo:'} ${card.name}: ${correctLabel}. ${card.explanation}`;
  $('#class-feedback').classList.toggle('wrong',!answer.correct);
  $('#class-next').disabled=false;
  updateCardProgress();
  if(event.detail===0) $('#class-next').focus({preventScroll:true});
  else $('#class-feedback').scrollIntoView({block:'nearest',behavior:'instant'});
}));
$('#class-next').addEventListener('click',()=>{
  if(!nextQuestion(classification))return;
  if(!classification.finished){showCard();focus($('#class-name'));return;}
  const score=scoreQuiz(classification);
  const missed=createErrorRound(classification);
  $('#class-playing').hidden=true;
  $('#class-result').hidden=false;
  $('#class-result-title').textContent=`${score.correct} de ${score.total} clasificaciones correctas`;
  $('#class-result-copy').textContent=`${missed.length?'Ya sabes qué ejemplos necesitan otra mirada.':'¡Conectaste todos los ejemplos de esta ronda!'}${initialClassificationScore?` Resultado inicial: ${initialClassificationScore.correct} de ${initialClassificationScore.total}. Este repaso tiene su propio puntaje.`:''}`;
  $('#class-errors').hidden=!missed.length;
  $('#class-errors').textContent=`Practicar mis errores (${missed.length})`;
  $('#class-mistakes').replaceChildren();
  if(missed.length){
    const details=document.createElement('details');
    const summary=document.createElement('summary');summary.textContent=`Revisar ${missed.length} ${missed.length===1?'ejemplo':'ejemplos'}`;
    const list=document.createElement('ul');
    missed.forEach(card=>{const li=document.createElement('li');const name=document.createElement('strong');name.textContent=`${card.name} → ${card.correctId==='pro'?'Procariota':'Eucariota'}`;const text=document.createElement('p');text.textContent=card.explanation;li.append(name,text);list.append(li);});
    details.append(summary,list);$('#class-mistakes').append(details);
  }
  focus($('#class-result-title'));
});
$('#class-errors').addEventListener('click',()=>{
  const round=createErrorRound(classification);
  if(!round.length)return;
  initialClassificationScore ||= scoreQuiz(classification);
  startClassification(round,true);focus($('#class-name'));
});
$('#class-restart').addEventListener('click',()=>{startClassification();focus($('#class-name'));});
startClassification();
mountQuiz($('#repaso'),{bank,categories,categoryLabel:'ideas sobre procariotas y eucariotas',studyLink:'#compara'});
