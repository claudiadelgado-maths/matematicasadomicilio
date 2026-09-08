import {$,math,showFeedback,spoken} from '../../recursos/actividad.mjs';
import {treeExercise,monomialExercise,cardsExercise,reviewExercise,sequenceExercise,procedure,expression,term} from './motor.mjs';
document.querySelectorAll('[data-tex]').forEach(el=>{if(window.katex)math(el,el.dataset.tex);});
function formula(latex){const el=document.createElement('div');el.className='formula';math(el,latex);return el;}
function solution(id,original,steps){const el=$(id);el.replaceChildren(formula(original));steps.forEach(step=>{const label=document.createElement('p');label.textContent=step.label;el.append(label,formula(step.latex));});el.hidden=false;}
function clear(id){showFeedback($(id+'-feedback'));$(id+'-solution').hidden=true;}
function option(latex,onClick){const button=document.createElement('button');button.type='button';button.className='math-option';button.setAttribute('aria-pressed','false');button.setAttribute('aria-label',spoken(latex));button.append(formula(latex));button.addEventListener('click',()=>onClick(button));return button;}
function select(container,selected){container.querySelectorAll(':scope > button').forEach(b=>{b.setAttribute('aria-pressed',String(b===selected));delete b.dataset.result;});}
function verdict(el,correct){el.dataset.result=correct?'correct':'incorrect';}
function feedback(id,correct,error){showFeedback($(id+'-feedback'),correct?'✓ ¡Correcto!':`✕ ${error}`,correct?'correct':'incorrect');}

let tree,branch=null,leaf=null;
function newTree(){
  tree=treeExercise();delete $('tree').dataset.branch;branch=null;leaf=null;clear('tree');$('submit-tree').disabled=true;math($('tree-original'),tree.original);$('tree-branches').replaceChildren();
  tree.branches.forEach((item,i)=>{
    const column=document.createElement('div');column.className='tree-branch';
    const children=document.createElement('div');children.className='tree-leaves';children.hidden=true;
    const button=option(item.latex,()=>{
      branch=i;$('tree').dataset.branch=String(i);leaf=null;clear('tree');$('submit-tree').disabled=true;
      [...$('tree-branches').children].forEach((col,j)=>{col.dataset.selected=String(j===i);const b=col.querySelector('button');b.setAttribute('aria-pressed',String(j===i));delete b.dataset.result;col.querySelector('.tree-leaves').hidden=j!==i;col.querySelectorAll('.tree-leaves button').forEach(b=>{b.setAttribute('aria-pressed','false');delete b.dataset.result;});});
    });
    item.options.forEach((answer,j)=>children.append(option(answer.latex,b=>{leaf=j;select(children,b);clear('tree');$('submit-tree').disabled=false;})));
    column.append(button,children);$('tree-branches').append(column);
  });
}
$('submit-tree').addEventListener('click',()=>{
  if(branch===null||leaf===null)return;
  const first=tree.branches[branch].correct,last=tree.branches[branch].options[leaf].correct;
  const col=$('tree-branches').children[branch];verdict(col.querySelector('button'),first);verdict(col.querySelectorAll('.tree-leaves button')[leaf],last);
  feedback('tree',first&&last,!first?'Revisa la distribución: el factor debe multiplicar todos los términos originales.':'La distribución está bien. Revisa las multiplicaciones y la simplificación.');
  if(first&&last)solution('tree-solution',tree.original,tree.steps);
});
$('new-tree').addEventListener('click',newTree);newTree();

let mono;
const integerValue=input=>/^[+-]?\d{1,5}$/.test(input.value.trim())?Number(input.value):null;
function monoPreview(){
  const inputs=[...$('mono-fields').querySelectorAll('input')],c=integerValue(inputs[0]);
  const base=Object.fromEntries(inputs.slice(1).map(input=>[input.dataset.letter,integerValue(input)]));
  const complete=c!==null && Object.values(base).every(e=>e!==null&&e>=0&&e<=40);
  const coefficient=c===null?'\\square{}':String(c);
  const powers=Object.entries(base).map(([l,e])=>`${l}^{${e===null||e<0||e>40?'\\square':e}}`).join('');
  math($('mono-preview'),complete?term(c,base):coefficient+powers);
}
function newMono(){
  mono=monomialExercise();clear('mono');math($('mono-original'),mono.original);$('mono-fields').replaceChildren();
  [{name:'Coeficiente',expected:mono.result.c},...Object.entries(mono.result.base).sort(([a],[b])=>a.localeCompare(b)).map(([letter,expected])=>({name:`Exponente de ${letter}`,letter,expected}))].forEach((field,i)=>{
    const label=document.createElement('label');label.textContent=field.name;
    const input=document.createElement('input');input.type='text';input.inputMode=field.letter?'numeric':'text';input.maxLength=6;input.autocomplete='off';input.id=`mono-input-${i}`;if(field.letter)input.dataset.letter=field.letter;
    const message=document.createElement('span');message.className='field-feedback';message.id=`mono-message-${i}`;input.setAttribute('aria-describedby',message.id);
    input.addEventListener('input',()=>{clear('mono');delete input.dataset.result;input.removeAttribute('aria-invalid');message.textContent='';monoPreview();});
    label.append(input,message);$('mono-fields').append(label);
  });monoPreview();
}
$('mono-form').addEventListener('submit',event=>{
  event.preventDefault();let all=true,first;
  $('mono-fields').querySelectorAll('input').forEach(input=>{
    const expected=input.dataset.letter?mono.result.base[input.dataset.letter]:mono.result.c,ok=integerValue(input)===expected;
    verdict(input,ok);input.setAttribute('aria-invalid',String(!ok));input.nextElementSibling.textContent=ok?'✓ Correcto':input.dataset.letter?'✕ Suma los exponentes de esta letra.':'✕ Multiplica los coeficientes con sus signos.';
    if(!ok){all=false;first??=input;}
  });feedback('mono',all,'Revisa los campos indicados.');
  if(all)solution('mono-solution',mono.original,[{label:'Producto',latex:term(mono.result.c,mono.result.base)}]);else first.focus();
});
$('new-mono').addEventListener('click',newMono);newMono();

let cards,assigned={distribution:null,result:null};
function renderAssignments(){
  $('cards-selected').replaceChildren();
  for(const [kind,label] of [['distribution','Distribuir'],['result','Multiplicar']]){
    const line=document.createElement('div'),title=document.createElement('strong');title.textContent=label;line.append(title);
    line.append(assigned[kind]===null?document.createTextNode(' — Sin tarjeta'):formula(cards.cards[assigned[kind]].latex));$('cards-selected').append(line);
  }
  [...$('step-cards').children].forEach((card,i)=>card.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(assigned[button.dataset.kind]===i))));
}
function newCards(){
  cards=cardsExercise();assigned={distribution:null,result:null};clear('cards');math($('cards-original'),cards.original);$('step-cards').replaceChildren();
  cards.cards.forEach((item,i)=>{
    const card=document.createElement('div');card.className='step-card';card.append(formula(item.latex));const actions=document.createElement('div');actions.className='assign-actions';
    for(const [kind,label] of [['distribution','Distribuir'],['result','Multiplicar']]){
      const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.kind=kind;button.setAttribute('aria-label',`${label}: ${spoken(item.latex)}`);
      button.addEventListener('click',()=>{clear('cards');const previous=assigned[kind];for(const k of Object.keys(assigned))if(assigned[k]===i)assigned[k]=null;assigned[kind]=previous===i?null:i;renderAssignments();});actions.append(button);
    }card.append(actions);$('step-cards').append(card);
  });renderAssignments();
}
$('submit-cards').addEventListener('click',()=>{
  const first=assigned.distribution!==null&&cards.cards[assigned.distribution].kind==='distribution';
  const second=assigned.result!==null&&cards.cards[assigned.result].kind==='result';
  feedback('cards',first&&second,[!first?'Revisa la tarjeta de Distribuir.':'',!second?'Revisa la tarjeta de Multiplicar.':''].filter(Boolean).join(' '));
  if(first&&second)solution('cards-solution',cards.original,cards.steps);
});
$('new-cards').addEventListener('click',newCards);newCards();

let review,judgments=[];
function newReview(){
  review=reviewExercise();judgments=review.rows.map(()=>null);clear('review');math($('review-original'),review.original);$('review-rows').replaceChildren();
  review.rows.forEach((row,i)=>{
    const line=document.createElement('div');line.className='review-row';const content=document.createElement('div'),label=document.createElement('p');label.textContent=row.label;content.append(label,formula(row.latex));
    const controls=document.createElement('div');controls.className='judgments';controls.setAttribute('role','group');controls.setAttribute('aria-label',row.label);
    const status=document.createElement('p');status.className='row-verdict';
    [true,false].forEach(value=>{const button=document.createElement('button');button.type='button';button.textContent=value?'✓':'✕';button.setAttribute('aria-label',value?'Esta fila está bien':'Esta fila está mal');button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{
      judgments[i]=value;select(controls,button);clear('review');$('review-rows').querySelectorAll('.row-verdict').forEach(el=>el.textContent='');$('review-rows').querySelectorAll('.review-row').forEach(el=>delete el.dataset.result);
    });controls.append(button);});line.append(content,controls,status);$('review-rows').append(line);
  });
}
$('submit-review').addEventListener('click',()=>{
  if(judgments.includes(null)){feedback('review',false,'Revisa todas las filas antes de entregar.');$('review-rows').children[judgments.indexOf(null)].querySelector('button').focus();return;}
  const all=judgments.every((value,i)=>value===review.rows[i].correct);
  [...$('review-rows').children].forEach((row,i)=>{const ok=judgments[i]===review.rows[i].correct;verdict(row,ok);row.querySelector('.row-verdict').textContent=ok?'✓ Bien revisado':'✕ Revisa tu marca';});
  feedback('review',all,'Hay filas que necesitas revisar. Compara con el procedimiento correcto.');solution('review-solution',review.original,review.steps);
});
$('new-review').addEventListener('click',newReview);newReview();

let sequence,answers=[];
function newSequence(){
  sequence=sequenceExercise();answers=sequence.questions.map(()=>null);clear('sequence');$('submit-sequence').disabled=true;math($('sequence-original'),sequence.original);$('sequence-questions').replaceChildren();
  sequence.questions.forEach((question,i)=>{
    const row=document.createElement('div');row.className='sequence-question';row.hidden=i!==0;
    const title=document.createElement('h4');title.textContent=question.label;const status=document.createElement('p');status.className='row-verdict';
    const options=document.createElement('div');options.className='two-options';
    question.options.forEach((answer,j)=>options.append(option(answer.latex,button=>{
      answers[i]=j;select(options,button);clear('sequence');$('sequence-questions').querySelectorAll('.row-verdict').forEach(el=>el.textContent='');
      if(i+1<sequence.questions.length)$('sequence-questions').children[i+1].hidden=false;
      $('submit-sequence').disabled=answers.includes(null);
    })));row.append(title,options,status);$('sequence-questions').append(row);
  });
}
$('submit-sequence').addEventListener('click',()=>{
  if(answers.includes(null))return;
  const all=answers.every((a,i)=>sequence.questions[i].options[a].correct);
  [...$('sequence-questions').children].forEach((row,i)=>{const ok=sequence.questions[i].options[answers[i]].correct;row.querySelector('.row-verdict').textContent=ok?'✓ Correcto':'✕ Revisa esta elección';});
  feedback('sequence',all,'Revisa las elecciones marcadas. Cada parte debe resolver el problema original.');if(all)solution('sequence-solution',sequence.original,sequence.steps);
});
$('new-sequence').addEventListener('click',newSequence);newSequence();
const exampleLeft=[{c:1,base:{x:2}},{c:2,base:{x:1}},{c:1,base:{}}],exampleRight=[{c:1,base:{x:2}},{c:-1,base:{x:1}},{c:3,base:{}}];
solution('general-example',expression(exampleLeft,exampleRight),procedure(exampleLeft,exampleRight));
