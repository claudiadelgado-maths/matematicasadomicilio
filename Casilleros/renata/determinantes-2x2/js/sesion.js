/* Sesión autónoma de Renata. Sin bibliotecas externas ni efectos fuera de .det-app. */
(() => {
  'use strict';
  const app = document.querySelector('.det-app');
  if (!app) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const epsilon = 1e-8;
  const det = ([a,b,c,d]) => a*d-b*c;
  const clean = n => Math.abs(n) < epsilon ? 0 : Math.round(n * 1e7) / 1e7;
  const fmt = n => new Intl.NumberFormat('es-MX', {maximumFractionDigits: 6}).format(clean(n));
  const storageKey = 'renata-determinantes-2x2-visitas-v2';
  const stage = app.dataset.chapter;
  let visits = [];
  try {
    const loaded = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(loaded)) visits = loaded.filter(v => typeof v === 'string');
    if (!visits.includes(stage)) visits.push(stage);
    localStorage.setItem(storageKey, JSON.stringify(visits));
  } catch (_) { visits = [stage]; }
  $$('[data-stage]').forEach(link => {
    if (visits.includes(link.dataset.stage)) link.classList.add('is-visited');
  });
  function getMatrix(form, bound, integer = false) {
    const values = ['a','b','c','d'].map(k => Number(form.elements.namedItem(k).value));
    const valid = ['a','b','c','d'].every((key, idx) => {
      const input = form.elements.namedItem(key);
      return input.value.trim() !== '' && input.validity.valid && Number.isFinite(values[idx]) &&
        Math.abs(values[idx]) <= bound && (!integer || Number.isInteger(values[idx]));
    });
    return valid ? values : null;
  }
  function put(id,value){ const el=document.getElementById(id);if(el)el.textContent=value; }
  function setError(id,invalid){ const el=document.getElementById(id);if(el)el.hidden=!invalid; }

  // Revelador de soluciones: solo oculta los pasos cuando JS está activo.
  const stepList = $('[data-step-list]');
  if (stepList) {
    let revealed = 0;
    const li = $$('li',stepList);
    stepList.classList.add('det-js-stepper');
    const render = () => {
      li.forEach((item,i) => item.classList.toggle('det-step-visible', i < revealed));
      const next=$('[data-reveal-next]');
      next.disabled = revealed >= li.length;
      const msg=$('[data-step-message]');
      if(msg) msg.textContent = revealed===li.length ? '¡Muy bien! Ya tienes el procedimiento completo.' : revealed===0 ? 'Revela el primer paso cuando lo necesites.' : `Has revelado ${revealed} de ${li.length} pasos.`;
    };
    $('[data-reveal-next]').addEventListener('click',()=>{ revealed=Math.min(revealed+1,li.length);render(); });
    $('[data-reveal-reset]').addEventListener('click',()=>{ revealed=0;render(); });
    render();
  }

  const lab = $('#det-lab-form');
  if (lab) {
    const presets={positive:[3,2,1,4],negative:[-1,2,3,4],zero:[2,4,1,2],decimals:[1.5,.5,-2,3]};
    const render=()=>{
      const m=getMatrix(lab,99); const invalid = !m;
      setError('det-lab-error',invalid);
      if(invalid){ ['det-lab-result','det-lab-first','det-lab-second','det-lab-final'].forEach(id=>put(id,'—'));put('det-lab-sign','Revisa las entradas');put('det-lab-invertible','Introduce cuatro números válidos.');return; }
      const [a,b,c,d]=m, p=a*d,q=b*c,answer=clean(det(m));
      put('det-lab-result',fmt(answer));
      put('det-lab-first',`${fmt(a)} × ${fmt(d)} = ${fmt(p)}`);
      put('det-lab-second',`${fmt(b)} × ${fmt(c)} = ${fmt(q)}`);
      put('det-lab-final',`${fmt(p)} − (${fmt(q)}) = ${fmt(answer)}`);
      put('det-lab-sign', answer>0?'Positivo · Conserva la orientación':answer<0?'Negativo · Invierte la orientación':'Cero · La transformación aplasta el área');
      put('det-lab-invertible',answer===0?'El determinante vale cero: la matriz NO tiene inversa.':'El determinante es distinto de cero: la matriz SÍ tiene inversa.');
    };
    lab.addEventListener('input',render);
    lab.addEventListener('submit',ev=>ev.preventDefault());
    lab.addEventListener('reset',()=>queueMicrotask(render));
    $$('[data-lab-preset]').forEach(btn=>btn.addEventListener('click',()=>{
      ['a','b','c','d'].forEach((name,i)=>lab.elements.namedItem(name).value=presets[btn.dataset.labPreset][i]);render();
    }));render();
  }

  const geo=$('#det-geo-form');
  if(geo){
    const presets={stretch:[2,1,0,1],flip:[-2,0,0,1],flatten:[2,2,1,1],rotate:[0,-1,1,0]};
    const polygon=$('#det-geometry-shape'), vectors=$('#det-geometry-vectors');
    const point=([x,y]) => `${180+25*x},${180-25*y}`;
    const render=()=>{
      const m=getMatrix(geo,3,true),invalid=!m;setError('det-geo-error',invalid);
      if(invalid){put('det-geo-area','—');put('det-geo-sign','Corrige la matriz');put('det-geo-explain','Usa cuatro números enteros de −3 a 3.');polygon.setAttribute('visibility','hidden');vectors.setAttribute('visibility','hidden');return;}
      polygon.removeAttribute('visibility');vectors.removeAttribute('visibility');
      const [a,b,c,d]=m; const p=[a,c],q=[b,d],r=[a+b,c+d];
      polygon.setAttribute('points',[[0,0],p,r,q].map(point).join(' '));
      vectors.setAttribute('d',`M${point([0,0])} L${point(p)} M${point([0,0])} L${point(q)}`);
      const answer=det(m), area=Math.abs(answer);
      put('det-geo-area',`${fmt(area)} u²`);
      put('det-geo-sign',`det(A) = ${fmt(answer)} · ${answer>0?'orientación conservada':answer<0?'orientación invertida':'sin área'}`);
      put('det-geo-explain',answer===0?'Los vectores transformados son dependientes y el cuadrado se aplasta. Área cero.':`El cuadrado original tiene área 1; ahora el paralelogramo tiene área ${fmt(area)}. ${answer<0?'Su orientación también se invirtió.':'La orientación se conserva.'}`);
    };
    geo.addEventListener('input',render);geo.addEventListener('submit',e=>e.preventDefault());
    $$('[data-geo-preset]').forEach(btn=>btn.addEventListener('click',()=>{
      ['a','b','c','d'].forEach((name,i)=>geo.elements.namedItem(name).value=presets[btn.dataset.geoPreset][i]);render();
    }));render();
  }

  function updateMatrix(container, values){
    const cells=$$('span',container);values.forEach((value,i)=>{cells[i].textContent=fmt(value)});
    container.setAttribute('aria-label',`Matriz: primera fila ${fmt(values[0])}, ${fmt(values[1])}; segunda fila ${fmt(values[2])}, ${fmt(values[3])}`);
  }
  const practice=$('#det-practice-form');
  if(practice){
    const names={easy:'Inicial',medium:'Intermedio',hard:'Experto'};
    let level='easy',matrix=[2,1,3,4],total=0,correct=0,hints=0,answered=false;
    const answer=$('#det-practice-answer'),feedback=$('#det-practice-feedback'),solution=$('#det-practice-explanation');
    const rand=(min,max)=>min+Math.floor(Math.random()*(max-min+1));
    const randomMatrix=()=>{
      if(level==='easy')return Array.from({length:4},()=>rand(0,5));
      if(level==='medium')return Array.from({length:4},()=>rand(-6,6));
      return Array.from({length:4},()=>rand(-12,12));
    };
    const say=(msg,state)=>{feedback.textContent=msg;feedback.className='det-feedback'+(state?' det-'+state:'');};
    const showSolution=()=>{
      const [a,b,c,d]=matrix;
      solution.textContent=`Diagonal principal: ${fmt(a)} × ${fmt(d)} = ${fmt(a*d)}. Diagonal secundaria: ${fmt(b)} × ${fmt(c)} = ${fmt(b*c)}. Resta: ${fmt(a*d)} − (${fmt(b*c)}) = ${fmt(det(matrix))}.`;
      solution.hidden=false;
    };
    const next=()=>{
      matrix=randomMatrix();updateMatrix($('#det-practice-matrix'),matrix);answered=false;hints=0;answer.value='';solution.hidden=true;
      say('Primero calcula la diagonal principal y luego la secundaria.');answer.focus();
    };
    practice.addEventListener('submit',event=>{
      event.preventDefault();
      const typed=Number(answer.value);
      if(answer.value.trim()===''||!Number.isFinite(typed)){say('Introduce primero un número válido.','wrong');return;}
      if(answered){say('Este ejercicio ya fue revisado. Pulsa «Otra matriz» para continuar.');return;}
      total+=1;answered=true;
      if(Math.abs(typed-det(matrix))<epsilon){correct+=1;say(`¡Correcto! El determinante es ${fmt(det(matrix))}.`,'correct');}
      else {say(`Todavía no: el determinante correcto es ${fmt(det(matrix))}. Revisa los productos y la resta.`,'wrong');showSolution();}
      put('det-practice-correct',correct);put('det-practice-total',total);
    });
    $('#det-practice-hint').addEventListener('click',()=>{
      hints+=1;const [a,b,c,d]=matrix;
      say(hints===1?`Pista 1: multiplica ${fmt(a)} por ${fmt(d)} para la diagonal principal.`:hints===2?`Pista 2: multiplica ${fmt(b)} por ${fmt(c)} para la otra diagonal.`:'Pista 3: resta el segundo producto al primero. Oprime «Ver procedimiento» si lo necesitas.');
    });
    $('#det-practice-solution').addEventListener('click',showSolution);
    $('#det-practice-next').addEventListener('click',next);
    $$('input[name="det-level"]').forEach(r=>r.addEventListener('change',()=>{
      if(r.checked){level=r.value;put('det-practice-level',names[level]);next();}
    }));
    next();
  }
  const challenge=$('#det-challenge-form');
  if(challenge){
    const questions=[
      {matrix:[3,2,1,4],prompt:'Calcula este determinante',desc:'Aplica la regla ad − bc.',type:'det'},
      {matrix:[-1,2,3,4],prompt:'¿Cuánto vale el determinante?',desc:'Presta especial atención al signo negativo.',type:'det'},
      {matrix:[2,4,1,2],prompt:'¿Qué determinante obtienes?',desc:'Comprueba si las filas son proporcionales.',type:'det'},
      {matrix:[2,0,0,3],prompt:'¿Cuál es la nueva área?',desc:'Un cuadrado de área 1 se transforma mediante A. Escribe el área resultante.',type:'area'},
      {matrix:[1,2,2,4],prompt:'¿Esta matriz tiene inversa?',desc:'Escribe 1 si tiene inversa o 0 si NO tiene inversa.',type:'inverse'}
    ];
    let index=0,score=0,submitted=false;
    const input=$('#det-challenge-answer'),feedback=$('#det-challenge-feedback'),next=$('#det-challenge-next');
    const solutionFor=q=>{const [a,b,c,d]=q.matrix;const val=det(q.matrix);return `Cálculo: ${fmt(a)} × ${fmt(d)} − (${fmt(b)} × ${fmt(c)}) = ${fmt(val)}. `+(q.type==='area'?`El área es |${fmt(val)}| = ${fmt(Math.abs(val))}.`:q.type==='inverse'?(val===0?'Como vale 0, no hay inversa (respuesta 0).':'Como no vale 0, sí hay inversa (respuesta 1).'):'');};
    const expected=q=>q.type==='area'?Math.abs(det(q.matrix)):q.type==='inverse'?(det(q.matrix)===0?0:1):det(q.matrix);
    const setProgress=()=>{const progress=$('#det-challenge-progress');const num=index+(submitted?1:0);progress.setAttribute('aria-valuenow',String(num));$('#det-challenge-progress-bar').style.width=`${num/5*100}%`;};
    const render=()=>{
      submitted=false;const q=questions[index];put('det-challenge-count',`Pregunta ${index+1} de ${questions.length}`);put('det-challenge-question',q.prompt);put('det-challenge-description',q.desc);
      updateMatrix($('#det-challenge-matrix'),q.matrix);input.value='';input.disabled=false;$('#det-challenge-form button').disabled=false;
      feedback.className='det-feedback';feedback.textContent='Escribe tu respuesta cuando estés lista.';next.hidden=true;
      setProgress();input.focus();
    };
    challenge.addEventListener('submit',event=>{
      event.preventDefault();if(submitted)return;
      const user=Number(input.value);if(input.value.trim()===''||!Number.isFinite(user)){feedback.className='det-feedback det-wrong';feedback.textContent='Escribe primero un número válido.';return;}
      submitted=true;const q=questions[index],value=expected(q),success=Math.abs(user-value)<epsilon;if(success)score++;
      feedback.className='det-feedback det-'+(success?'correct':'wrong');
      feedback.textContent=(success?'¡Excelente! ':'Respuesta distinta a la esperada. ')+solutionFor(q);
      input.disabled=true;$('#det-challenge-form button').disabled=true;
      next.textContent=index===questions.length-1?'Ver mi resultado ★':'Siguiente pregunta →';next.hidden=false;setProgress();
    });
    const finish=()=>{
      $('#det-challenge-play').hidden=true;$('#det-challenge-finish').hidden=false;
      put('det-challenge-count','Completado');put('det-challenge-final-score',`Acertaste ${score} de ${questions.length} preguntas.`);
      put('det-challenge-final-tip',score===5?'¡Dominio excelente! Puedes explorar nuevos números en el laboratorio.':score>=3?'Muy bien. Revisa los casos que fallaste y sigue experimentando.':'Repite las etapas de la regla y el laboratorio; luego intenta esta misión de nuevo.');
      try{localStorage.setItem('renata-determinantes-2x2-mejor-puntuacion-v2',String(Math.max(score,Number(localStorage.getItem('renata-determinantes-2x2-mejor-puntuacion-v2'))||0)));}catch(_){}
    };
    next.addEventListener('click',()=>{if(index===questions.length-1)finish();else{index++;render();}});
    $('#det-challenge-restart').addEventListener('click',()=>{index=0;score=0;$('#det-challenge-play').hidden=false;$('#det-challenge-finish').hidden=true;render();});
    render();
  }
})();
