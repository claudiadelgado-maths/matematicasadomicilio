import {buildBank,shuffled,parseNumber,checkAnswer,FAMILIES,translation,directionText,rationalSteps,rationalValue,fraction,polynomialText} from './modelo.mjs';
import {translationMath,rationalMath,horizontalText,verticalText} from './formulas.mjs';
import {drawGraph} from './graficas.mjs';
const $=id=>document.getElementById(id);
const textNode=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};

export function initPractice(type){
  const bank=buildBank(type);let deck=shuffled(bank),round=[],index=0,record=null,history=[];
  const q=()=>round[index];
  function drawSolution(){
    if($('solution-panel').hidden)return;
    const problem=q();
    if(type==='traslados'){
      const t=translation(problem.family,problem.h,problem.k);
      drawGraph($('solution-graph'),{title:`Solución: ${t.text}. ${directionText(t.h,t.k)}`,curves:[{f:FAMILIES[t.family].f,color:'#aaa0b2',dashed:true,breaks:FAMILIES[t.family].kind==='log'?[0]:[]},{f:t.f,breaks:t.vertical===null?[]:[t.vertical]}],horizontals:t.horizontal===null?[]:[t.horizontal],verticals:t.vertical===null?[]:[t.vertical],points:[{x:t.point[0],y:t.point[1]}]});
    }else{
      drawGraph($('solution-graph'),{xMin:-10,xMax:10,title:`Solución. ${horizontalText(problem)}. ${verticalText(problem)}.`,curves:[{f:x=>rationalValue(problem,x),breaks:problem.roots.map(r=>r.x)}],horizontals:type!=='verticales'&&problem.horizontal!==null?[problem.horizontal]:[],verticals:type!=='horizontales'?problem.verticals:[],holes:problem.holes});
    }
  }
  function fields(){
    if($('no-horizontal')){$('horizontal-field').hidden=$('no-horizontal').checked;$('answer-horizontal').disabled=$('no-horizontal').checked;}
    if($('vertical-count')){
      const count=Number($('vertical-count').value);
      $('vertical-fields').hidden=count<1;$('vertical-second').hidden=count!==2;
      $('answer-v1').disabled=count<1;$('answer-v2').disabled=count!==2;
    }
  }
  function render(){
    record={question:q(),errors:0,hint:false,revealed:false,solved:false};
    $('question-panel').hidden=false;$('round-result').hidden=true;
    $('practice-count').textContent=`Ejercicio ${index+1} de 8`;$('practice-meter').value=index;
    $('practice-form').reset();
    for(const control of $('practice-form').elements)control.disabled=false;
    for(const id of ['answer-message','hint','solution-panel','next-question'])$(id).hidden=true;
    $('solution-steps').replaceChildren();$('solution-graph').replaceChildren();fields();
    const problem=q();
    if(type==='traslados'){
      $('question-instruction').textContent=problem.mode==='formula'?'Lee g(x). ¿Cuáles son h y k en g(x) = f(x − h) + k?':`Usa la función de partida f(x) y construye el traslado: ${directionText(problem.h,problem.k)}`;
      $('question-formula').innerHTML=translationMath(problem.mode==='formula'?problem:translation(problem.family,0,0),problem.mode==='formula'?'g':'f');
    }else{
      $('question-instruction').textContent=type==='horizontales'?'Encuentra la asíntota horizontal o indica que no existe.':type==='verticales'?'Encuentra todas las asíntotas verticales. Revisa si se cancelan factores.':'Encuentra la horizontal y todas las verticales. El denominador es cuadrático.';
      $('question-formula').innerHTML=rationalMath(problem);
    }
  }
  function nextRound(){
    round=[];
    while(round.length<8){
      if(!deck.length)deck=shuffled(bank.filter(p=>!round.some(r=>r.id===p.id)));
      round.push(deck.pop());
    }
    index=0;history=[];render();
  }
  function invalid(message){$('answer-message').hidden=false;$('answer-message').dataset.correct='false';$('answer-message').textContent=message;}
  function readAnswer(){
    if(type==='traslados'){
      const h=parseNumber($('answer-h').value),k=parseNumber($('answer-k').value);
      if(h===null||k===null){invalid('Escribe un número válido en h y en k. Si no hay traslado, escribe 0.');return null;}return {h,k};
    }
    const answer={noHorizontal:false,horizontal:null,verticals:[]};
    if(type!=='verticales'){
      answer.noHorizontal=$('no-horizontal').checked;answer.horizontal=parseNumber($('answer-horizontal').value);
      if(!answer.noHorizontal&&answer.horizontal===null){invalid('Escribe el valor de y o marca que no hay horizontal. Puedes usar una fracción como −3/2.');return null;}
    }
    if(type!=='horizontales'){
      if($('vertical-count').value===''){invalid('Elige cuántas asíntotas verticales hay, incluso si tu respuesta es ninguna.');return null;}
      const count=Number($('vertical-count').value);
      for(let i=1;i<=count;i++){
        const value=parseNumber($(`answer-v${i}`).value);
        if(value===null){invalid('Escribe un valor válido de x para cada vertical que elegiste.');return null;}answer.verticals.push(value);
      }
      if(count===2&&Math.abs(answer.verticals[0]-answer.verticals[1])<1e-8){invalid('Una misma recta no cuenta dos veces. Si solo hay un valor de x, elige «Una».');return null;}
    }return answer;
  }
  function explain(revealed=false){
    record.revealed=revealed;record.solved=!revealed;
    for(const control of $('practice-form').elements)control.disabled=true;
    $('solution-panel').hidden=false;$('solution-title').textContent=revealed?'Vamos paso a paso.':'¡Bien! Este es el recorrido.';
    let steps;
    if(type==='traslados'){
      const t=translation(q().family,q().h,q().k);
      steps=[`Compara con g(x) = f(x − h) + k: h = ${t.h} y k = ${t.k}.`,directionText(t.h,t.k),`Resultado: ${t.text}. Cada punto pasa de (x, y) a (x + h, y + k).`,`Dominio: ${t.domain}. Recorrido: ${t.range}. ${t.horizontal!==null?`Horizontal: y = ${t.horizontal}.`:t.vertical!==null?`Vertical: x = ${t.vertical}.`:'La parábola no tiene asíntotas.'}`];
      $('question-formula').innerHTML=translationMath(t);
    }else{
      const all=rationalSteps(q());steps=type==='horizontales'?all.slice(0,1):type==='verticales'?all.slice(1):all;
    }
    $('solution-steps').replaceChildren(...steps.map(s=>textNode('li',s)));drawSolution();
    $('next-question').hidden=false;$('next-question').textContent=index===7?'Ver mi ronda →':'Siguiente ejercicio →';
  }
  $('practice-form').addEventListener('submit',event=>{
    event.preventDefault();if(record.solved||record.revealed)return;
    const answer=readAnswer();if(!answer)return;
    const correct=checkAnswer(type,q(),answer);
    $('answer-message').hidden=false;$('answer-message').dataset.correct=String(correct);
    if(correct){$('answer-message').textContent='Respuesta correcta. Revisa por qué funciona y continúa cuando estés lista.';explain();$('solution-title').focus({preventScroll:true});$('solution-panel').scrollIntoView({block:'start',behavior:'instant'});}
    else{record.errors++;$('answer-message').textContent=type==='traslados'?'Aún no coincide. Revisa el signo dentro del argumento y el número que queda fuera. Puedes volver a intentar.':type==='horizontales'?'Revisa los grados y los signos de los coeficientes principales. El número que acompaña a x no es el grado.':type==='verticales'?'Revisa las raíces y los factores comunes. Un factor totalmente cancelado deja un hueco; uno que permanece abajo deja una vertical.':'Alguna parte no coincide. Comprueba la horizontal con grados y las verticales con factores; escribe x e y en sus campos correspondientes.';}
  });
  $('no-horizontal')?.addEventListener('change',fields);$('vertical-count')?.addEventListener('change',fields);
  $('hint-button').addEventListener('click',()=>{
    record.hint=true;$('hint').hidden=false;
    $('hint').textContent=type==='traslados'?'Piensa en x − h. Si ves x + a, entonces h = −a. El término que se suma fuera de la función es k.':type==='horizontales'?`El grado del denominador es 2. El del numerador es ${q().nDegree}. Usa una de las tres reglas; si empatan, divide los coeficientes principales.`:`Empieza factorizando el denominador. Compara sus factores con los del numerador antes de contar verticales.${type==='ambas'?' Para la horizontal, compara grados.':''}`;
  });
  $('solution-button').addEventListener('click',()=>{
    $('answer-message').hidden=false;$('answer-message').dataset.correct='false';$('answer-message').textContent='Solución consultada. Este ejercicio contará como trabajado con solución, no como acierto independiente.';explain(true);$('solution-title').focus({preventScroll:true});$('solution-panel').scrollIntoView({block:'start',behavior:'instant'});
  });
  $('next-question').addEventListener('click',()=>{
    if(!record.solved&&!record.revealed)return;history.push(record);
    if(index<7){index++;render();$('question-instruction').focus({preventScroll:true});$('practice').scrollIntoView({block:'start',behavior:'instant'});}
    else{
      $('question-panel').hidden=true;$('round-result').hidden=false;$('practice-meter').value=8;$('practice-count').textContent='8 de 8 trabajados';
      const independent=history.filter(r=>r.solved&&!r.errors&&!r.hint).length,solved=history.filter(r=>r.solved).length;
      $('round-summary').textContent=`Trabajaste 8 ejercicios: ${solved} ${solved===1?'resuelto':'resueltos'} por ti (${independent} al primer intento y sin pista) y ${8-solved} con la solución consultada. Puedes continuar con otra ronda.`;
      $('round-review').replaceChildren(...history.map((r,i)=>{
        const li=document.createElement('li'),p=r.question;
        li.append(textNode('strong',`${i+1}. ${type==='traslados'?p.text:`(${polynomialText(p.numerator)}) / (${polynomialText(p.denominator)})`}`));
        const result=type==='traslados'?`h = ${p.h}; k = ${p.k}`:type==='horizontales'?horizontalText(p):type==='verticales'?verticalText(p):`${horizontalText(p)}; ${verticalText(p)}`;
        li.append(textNode('span',`${result}. ${r.revealed?'Solución consultada':r.errors||r.hint?'Resuelto después de practicar':'Resuelto al primer intento'}.`));return li;
      }));$('round-title').focus({preventScroll:true});$('practice').scrollIntoView({block:'start',behavior:'instant'});
    }
  });
  $('new-round').addEventListener('click',()=>{nextRound();$('question-instruction').focus({preventScroll:true});$('practice').scrollIntoView({block:'start',behavior:'instant'});});
  nextRound();$('loading-note').hidden=true;$('practice-app').hidden=false;
  return drawSolution;
}
