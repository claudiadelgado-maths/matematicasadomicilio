(async () => {
  'use strict';
  const root=document.querySelector('.exponential-session');
  if(!root) return;
  const $=id=>document.getElementById(id);
  const math=(element,source)=>{
    if(window.katex) window.katex.render(`\\displaystyle ${source}`,element,{throwOnError:false,trust:false,strict:'ignore'});
    else element.textContent=`\\(${source}\\)`;
  };
  const render=element=>{
    if(window.renderMathInElement) window.renderMathInElement(element,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false,trust:false,strict:'ignore'});
  };
  const textMath=(element,text)=>{element.textContent=text;render(element);};
  render(root);$('latex-notice').hidden=!!window.katex;
  let tools;
  try {tools=await import('./modelo.mjs');}
  catch {$('load-error').hidden=false;return;}
  const {parseDecimal,createModel,isCorrect,challenges}=tools;
  const decimal=value=>new Intl.NumberFormat('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  const texNumber=value=>{
    if(value!==0 && (Math.abs(value)<.0001||Math.abs(value)>=1e9)) {
      const [mantissa,exponent]=value.toExponential(3).split('e');
      return `${Number(mantissa)}\\times10^{${Number(exponent)}}`;
    }
    return new Intl.NumberFormat('en-US',{maximumFractionDigits:6,useGrouping:false}).format(value);
  };
  const labelNumber=value=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:Math.abs(value)<1?5:2,notation:Math.abs(value)>=100000?'compact':'standard'}).format(value);
  let model,announcement;
  const ns='http://www.w3.org/2000/svg';
  function node(tag,attributes,text) {
    const element=document.createElementNS(ns,tag);
    for(const [key,value] of Object.entries(attributes)) element.setAttribute(key,String(value));
    if(text!==undefined) element.textContent=text;
    return element;
  }
  function drawGraph() {
    const group=$('graph-drawing');group.replaceChildren();
    const left=90,right=730,top=25,bottom=285;
    const largest=Math.max(model.initial,model.final),roughStep=largest/4;
    const magnitude=10**Math.floor(Math.log10(roughStep));
    const step=([1,2,2.5,5,10].find(value=>value>=roughStep/magnitude)||10)*magnitude;
    const ticks=Math.ceil(largest*1.05/step),maximum=ticks*step;
    const x=n=>left+(right-left)*n/model.periods;
    const y=quantity=>bottom-(bottom-top)*quantity/maximum;
    const add=(tag,attributes,text)=>group.append(node(tag,attributes,text));
    for(let j=0;j<=ticks;j++) {
      const value=step*j,yy=y(value);
      add('path',{d:`M${left} ${yy}H${right}`,stroke:'#dde5de','stroke-width':1});
      add('text',{x:left-12,y:yy+4,'text-anchor':'end',fill:'#65766c','font-size':13},labelNumber(value));
    }
    add('text',{x:left,y:16,fill:'#65766c','font-size':12},'Cantidad');
    add('text',{x:right,y:330,'text-anchor':'end',fill:'#65766c','font-size':12},'Período');
    const points=model.rows.map(row=>`${x(row.n)},${y(row.quantity)}`).join(' ');
    add('polygon',{points:`${left},${bottom} ${points} ${right},${bottom}`,fill:'#ecf3e6'});
    // Se conectan los valores discretos. La leyenda evita sugerir períodos fraccionarios.
    add('polyline',{points,fill:'none',stroke:'#287052','stroke-width':3,'stroke-linejoin':'round'});
    model.rows.forEach(row=>{
      add('text',{x:x(row.n),y:309,'text-anchor':'middle',fill:'#65766c','font-size':13},row.n);
      add('circle',{cx:x(row.n),cy:y(row.quantity),r:4,fill:'#287052',stroke:'#fff','stroke-width':1.5});
    });
    const selected=Number($('inspect').value),row=model.rows[selected];
    add('path',{d:`M${x(selected)} ${y(row.quantity)}V${bottom}`,stroke:'#a77523','stroke-dasharray':'4 5'});
    add('circle',{cx:x(selected),cy:y(row.quantity),r:7,fill:'#d89b3d',stroke:'#fff','stroke-width':2});
    $('graph-description').textContent=`${model.kind}. La cantidad inicial es ${decimal(model.initial)} y la final, ${decimal(model.final)}, tras ${model.periods} períodos. Está seleccionado el período ${selected}. Consulta debajo los valores de cada punto.`;
    $('graph-caption').textContent='La escala vertical se adapta a los datos. Compara los valores del eje, además de la forma de la línea.';
  }
  function inspect() {
    if(!model) return;
    const n=Number($('inspect').value),row=model.rows[n];
    $('inspect-output').value=n;
    math($('inspect-calculation'),`Q_{${n}}=${texNumber(model.initial)}\\left(${texNumber(model.factor)}\\right)^{${n}}${n===0?'=':'\\approx'}${texNumber(row.quantity)}`);
    if(n===0) textMath($('inspect-note'),'Este es el punto de partida. Todavía no hay cambios: \\(b^0=1\\).');
    else if(model.rate===0) textMath($('inspect-note'),'El factor es \\(1\\): multiplicar por uno conserva la cantidad. El cambio en este período es cero.');
    else textMath($('inspect-note'),`En este paso ${model.rate>0?'se añaden':'se pierden'} aproximadamente \\(${texNumber(Math.abs(row.change))}\\) unidades. El \\(${texNumber(Math.abs(model.rate))}\\%\\) se calcula sobre el valor del período anterior.`);
    [...$('model-rows').rows].forEach((tr,index)=>{tr.classList.toggle('selected-row',index===n);if(index===n) tr.setAttribute('aria-current','true');else tr.removeAttribute('aria-current');});
    drawGraph();
  }
  function updateModel() {
    const errors=[];let initial,rate;
    for(const [id,label] of [['initial','Cantidad inicial'],['rate','Tasa']]) {
      try {
        const value=parseDecimal($(id).value);
        if(Math.abs(value*100-Math.round(value*100))>1e-6) throw new Error('Usa hasta dos decimales.');
        if(id==='initial'&&(value<.01||value>1e6)) throw new Error('Usa un valor entre 0.01 y 1 000 000.');
        if(id==='rate'&&(value < -90||value>100)) throw new Error('Usa una tasa entre −90 % y 100 %.');
        if(id==='initial')initial=value;else rate=value;
        $(id).removeAttribute('aria-invalid');
      } catch(error) {$(id).setAttribute('aria-invalid','true');errors.push(`${label}: ${error.message}`);}
    }
    clearTimeout(announcement);$('model-error').hidden=!errors.length;$('model-error').textContent=errors.join(' ');
    $('model-results').hidden=!!errors.length;$('model-detail').hidden=!!errors.length;
    if(errors.length) {model=null;$('model-status').textContent='';return;}
    model=createModel(initial,rate,Number($('periods').value));
    $('period-output').value=model.periods;
    $('model-kind').textContent=model.kind;
    math($('model-formula'),`Q_n=${texNumber(model.initial)}\\left(${texNumber(model.factor)}\\right)^n`);
    math($('factor-output'),`b=${texNumber(model.factor)}`);
    math($('final-output'),`Q_{${model.periods}}\\approx ${texNumber(model.final)}`);
    textMath($('change-output'),`Cambio total respecto al inicio: \\(${model.totalPercent>0?'+':''}${texNumber(model.totalPercent)}\\%\\), aproximadamente.`);
    textMath($('model-explanation'),model.rate===0?'Una tasa de \\(0\\%\\) deja el factor en \\(1\\). La cantidad permanece constante.':`En cada período ${model.rate>0?'conservas la cantidad anterior y añades':'conservas solo'} el \\(${texNumber(model.rate>0?model.rate:100+model.rate)}\\%\\) ${model.rate>0?'de esa misma cantidad.':'de la cantidad anterior.'}`);
    $('inspect').max=model.periods;if(Number($('inspect').value)>model.periods)$('inspect').value=model.periods;
    $('model-rows').replaceChildren();
    model.rows.forEach(row=>{
      const tr=document.createElement('tr');
      [String(row.n),decimal(row.quantity),row.n===0?'—':`${row.change>0?'+':''}${decimal(row.change)}`].forEach((text,index)=>{const cell=document.createElement(index===0?'th':'td');if(index===0)cell.scope='row';cell.textContent=text;tr.append(cell);});
      $('model-rows').append(tr);
    });
    inspect();
    announcement=setTimeout(()=>{$('model-status').textContent=`Modelo actualizado: ${model.kind.toLowerCase()}, ${model.periods} períodos.`;},250);
  }
  $('model-form').addEventListener('submit',event=>event.preventDefault());
  $('model-form').addEventListener('input',updateModel);
  $('inspect').addEventListener('input',inspect);
  const presets={growth:[500,20,3],decay:[1000,-20,2],constant:[500,0,5]};
  root.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{
    const [initial,rate,periods]=presets[button.dataset.example];
    $('initial').value=initial;$('rate').value=rate;$('periods').value=periods;$('inspect').value=0;updateModel();
    if(!$('model-form').contains(button)){$('initial').focus({preventScroll:true});$('laboratorio').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  }));

  // Un reto cuenta una sola vez; consultar la solución se distingue de resolverlo.
  let index=0;const states=challenges.map(()=>({done:false,revealed:false,correct:false}));
  const score=()=>{
    const done=states.filter(state=>state.done).length,correct=states.filter(state=>state.correct).length;
    $('practice-score').textContent=`${done} de ${challenges.length} completados`;
    $('practice-progress').value=done;
    return {done,correct,reviewed:states.filter(state=>state.revealed).length};
  };
  function solution() {
    $('solution').replaceChildren();
    const heading=document.createElement('strong');heading.textContent='Paso a paso';$('solution').append(heading);
    const list=document.createElement('ol');challenges[index].steps.forEach(step=>{const li=document.createElement('li');textMath(li,step);list.append(li);});$('solution').append(list);$('solution').hidden=false;
  }
  function loadQuestion(focus=false) {
    const challenge=challenges[index];
    $('question-counter').textContent=`RETO ${String(index+1).padStart(2,'0')} / ${challenges.length}`;
    $('question-category').textContent=challenge.category;
    $('question-title').textContent=challenge.title;textMath($('question-text'),challenge.question);
    $('answer-label').textContent=challenge.label;$('answer').value='';$('answer').disabled=false;$('answer').removeAttribute('aria-invalid');
    $('answer').inputMode=challenge.answer<0?'text':'decimal';
    $('check-answer').disabled=false;$('show-solution').disabled=false;$('show-hint').disabled=false;
    for(const id of ['answer-feedback','hint','solution','next-question']){$(id).hidden=true;}
    $('next-question').textContent=index===challenges.length-1?'Ver mi recorrido →':'Siguiente reto →';
    score();if(focus)$('question-title').focus();
  }
  function finishQuestion() {
    $('answer').disabled=true;$('check-answer').disabled=true;$('show-solution').disabled=true;$('show-hint').disabled=true;$('next-question').hidden=false;score();
  }
  $('answer-form').addEventListener('submit',event=>{
    event.preventDefault();if(states[index].done)return;
    const challenge=challenges[index],feedback=$('answer-feedback');feedback.hidden=false;
    try {
      const correct=isCorrect($('answer').value,challenge.answer);$('answer').removeAttribute('aria-invalid');
      if(correct){states[index].done=true;states[index].correct=true;feedback.dataset.state='correct';feedback.textContent='Correcto. Revisa el procedimiento y continúa cuando estés listo.';solution();finishQuestion();}
      else{feedback.dataset.state='retry';feedback.textContent=`Todavía no. ${challenge.wrong} Puedes intentarlo de nuevo.`;}
    } catch(error) {feedback.dataset.state='retry';feedback.textContent=error.message;$('answer').setAttribute('aria-invalid','true');}
  });
  $('show-hint').addEventListener('click',()=>{textMath($('hint'),challenges[index].hint);$('hint').hidden=false;});
  $('show-solution').addEventListener('click',()=>{
    if(states[index].done)return;states[index].done=true;states[index].revealed=true;solution();
    $('answer-feedback').hidden=false;$('answer-feedback').dataset.state='review';$('answer-feedback').textContent='Procedimiento consultado. Este reto cuenta como repasado; al reiniciar podrás resolverlo por tu cuenta.';finishQuestion();
  });
  $('next-question').addEventListener('click',()=>{
    if(!states[index].done)return;
    if(index<challenges.length-1){index++;loadQuestion(true);return;}
    for(const id of ['answer-form','answer-feedback','hint','solution','next-question'])$(id).hidden=true;
    $('practice-finish').hidden=false;const totals=score();
    $('finish-summary').textContent=`Completaste ${totals.done} retos: ${totals.correct} resueltos por ti y ${totals.reviewed} con el procedimiento consultado. Las pistas y los reintentos son parte de la práctica.`;
    $('restart-practice').focus();
  });
  $('restart-practice').addEventListener('click',()=>{
    index=0;states.forEach(state=>{state.done=false;state.correct=false;state.revealed=false;});$('practice-finish').hidden=true;$('answer-form').hidden=false;loadQuestion(true);
  });
  $('practice-panel').hidden=false;loadQuestion();updateModel();
})();
