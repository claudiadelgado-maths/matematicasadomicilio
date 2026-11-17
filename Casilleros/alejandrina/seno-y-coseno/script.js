(async () => {
  'use strict';
  const byId = id => document.getElementById(id);
  const root = document.querySelector('.trig-session');
  if (!root || !byId('parameters')) return;
  const tex = (element, source) => {
    if (window.katex) window.katex.render(`\\displaystyle ${source}`, element, {throwOnError:false, strict:'ignore', trust:false, output:'htmlAndMathml'});
    else element.textContent = `\\(${source}\\)`;
  };
  const renderStatic = element => {
    if (window.renderMathInElement) window.renderMathInElement(element, {delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false,strict:'ignore',trust:false});
  };
  renderStatic(root);
  byId('math-notice').hidden = !!window.katex;
  let modelTools;
  try { modelTools = await import('./modelo.mjs'); }
  catch { byId('input-error').textContent = 'No se pudo cargar el laboratorio. Recarga la página para intentarlo de nuevo.'; byId('input-error').hidden = false; return; }
  const {parseValue, buildModel, texQ, texPi, texX} = modelTools;
  const form = byId('parameters');
  const fields = Object.fromEntries(['A','B','C','K'].map(key => [key, form.elements.namedItem(key)]));
  const kindInput = byId('function-kind');
  const ns = 'http://www.w3.org/2000/svg';
  const svgNode = (tag, attributes) => {
    const node = document.createElementNS(ns, tag);
    for (const [key,value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  };
  const approximate = value => new Intl.NumberFormat('es-MX',{maximumFractionDigits:5}).format(value);
  let announcement;
  function graph(model) {
    const drawing = byId('graph-drawing');
    drawing.replaceChildren(); byId('height-labels').replaceChildren(); byId('x-labels').replaceChildren();
    // La ventana se centra en el ciclo elegido, aunque su inicio esté lejos del origen.
    const xAt = u => 160 + (u + .15) / 1.3 * 770;
    const middle = 164, radius = 100;
    const yAt = u => middle - radius * Math.sign(model.A) * Math[model.kind](Math.sign(model.B) * 2 * Math.PI * u);
    const append = (tag, attrs) => drawing.append(svgNode(tag, attrs));
    function heightLabel(y, name, source) {
      const label = document.createElement('div'); label.className = 'height-label'; label.style.top = `${y/360*100}%`;
      const title = document.createElement('small'); title.textContent = name;
      const value = document.createElement('span'); tex(value,source); label.append(title,value); byId('height-labels').append(label);
    }
    if (model.constant) {
      append('path',{d:`M160 ${middle}H930`,stroke:'#694780','stroke-width':3,fill:'none'});
      heightLabel(middle,'Altura constante',model.exact?model.heightTex:`\\approx ${approximate(model.height)}`);
      byId('graph-description').textContent = `Recta horizontal de altura ${approximate(model.height)}. Dominio: todos los números reales. No hay cinco puntos de un ciclo.`;
      return;
    }
    append('rect',{x:xAt(0),y:35,width:xAt(1)-xAt(0),height:250,rx:10,fill:'#f2ecf6'});
    [[middle-radius,'Máximo',texQ(model.maximum)],[middle,'Línea media',texQ(model.midline)],[middle+radius,'Mínimo',texQ(model.minimum)]].forEach(([y,name,value],i)=>{
      append('path',{d:`M160 ${y}H930`,stroke:i===1?'#a69baf':'#ddd5e3','stroke-width':1,'stroke-dasharray':i===1?'6 5':'3 5'});
      heightLabel(y,name,value);
    });
    function path(from,to,steps) {
      return Array.from({length:steps+1},(_,i)=>{const u=from+(to-from)*i/steps;return `${i?'L':'M'}${xAt(u).toFixed(3)} ${yAt(u).toFixed(3)}`;}).join(' ');
    }
    append('path',{d:path(-.15,1.15,240),stroke:'#b5a4c3','stroke-width':2,'stroke-dasharray':'5 5',fill:'none'});
    append('path',{d:path(0,1,200),stroke:'#694780','stroke-width':3.5,'stroke-linecap':'round',fill:'none'});
    append('path',{d:'M160 299H930',stroke:'#b9afc0','stroke-width':1,fill:'none'});
    model.points.forEach(point=>{
      const x=xAt(point.z/4),y=middle-radius*point.unit;
      append('path',{d:`M${x} ${y}V299`,stroke:'#c9bbd4','stroke-dasharray':'3 5',fill:'none'});
      append('path',{d:`M${x} 295V303`,stroke:'#8b7998',fill:'none'});
      append('circle',{cx:x,cy:y,r:6.5,fill:point.unit===0?'#694780':'#226749',stroke:'white','stroke-width':2.5});
      const label=document.createElement('div');label.className='x-label';label.style.left=`${x/960*100}%`;tex(label,point.xTex);byId('x-labels').append(label);
    });
    byId('graph-description').textContent = `Un ciclo de ${model.kind==='sin'?'seno':'coseno'}, con cinco puntos de izquierda a derecha: ${model.points.map(p=>p.role.toLowerCase()).join(', ')}. Las coordenadas exactas están en la tabla siguiente. La curva continúa a ambos lados.`;
  }
  function update() {
    const values={}, errors=[];
    for(const [key,input] of Object.entries(fields)) {
      try { values[key]=parseValue(input.value,key==='C'); input.removeAttribute('aria-invalid'); }
      catch(error) { input.setAttribute('aria-invalid','true'); errors.push(`${key}: ${error.message}`); }
    }
    byId('input-error').hidden=!errors.length;
    byId('input-error').textContent=errors.join(' ');
    byId('lab-results').hidden=!!errors.length;
    clearTimeout(announcement);
    if(errors.length) { byId('lab-status').textContent=''; return; }
    const model=buildModel(kindInput.value,values);
    tex(byId('current-formula'),model.formula);
    tex(byId('domain'),'\\mathbb R=(-\\infty,\\infty)');
    byId('cycle-method').hidden=model.constant; byId('five-points').hidden=model.constant; byId('cycle-legend').hidden=model.constant;
    byId('constant-notice').hidden=!model.constant;
    byId('point-rows').replaceChildren();
    if(model.constant) {
      tex(byId('range'),`\\{${model.heightTex}\\}`);
      tex(byId('amplitude'),'0');
      byId('period').textContent='Sin período fundamental';
      byId('midline-label').textContent='Recta horizontal';
      tex(byId('midline'),`y=${model.heightTex}`);
      byId('constant-notice').textContent=`Como \\(${model.A===0?'A=0':'B=0'}\\), la función es constante: \\(f(x)=${model.heightTex}\\)${model.exact?'':` (aproximadamente ${approximate(model.height)})`}. Su rango contiene una sola altura y su amplitud es cero. Cualquier desplazamiento horizontal conserva la recta, pero no existe un menor período positivo: no tiene período fundamental ni cinco puntos de un ciclo.`;
      renderStatic(byId('constant-notice'));
      byId('graph-heading').textContent='Una altura para todas las entradas';
      byId('graph-caption').textContent='El mínimo y el máximo coinciden. La recta se extiende indefinidamente hacia ambos lados.';
    } else {
      tex(byId('range'),`[${texQ(model.minimum)},\\ ${texQ(model.maximum)}]`);
      tex(byId('amplitude'),texQ(model.amplitude));tex(byId('period'),`T=${texPi(model.period)}`);
      byId('midline-label').textContent='Línea media';tex(byId('midline'),`y=${texQ(values.K.coefficient)}`);
      const cTex=values.C.pi?texPi(values.C.coefficient):texQ(values.C.coefficient);
      tex(byId('start-equation'),`\\left(${texQ(values.B.coefficient)}\\right)x+\\left(${cTex}\\right)=0`);
      tex(byId('start'),`x_0=-\\frac{C}{B}=${texX(model.start)}`);
      tex(byId('jump-equation'),'s=\\frac{T}{4}');tex(byId('jump'),`s=${texPi(model.step)}`);
      tex(byId('positions'),`x=\\left(${texX(model.start)}\\right)+z\\left(${texPi(model.step)}\\right)`);
      byId('graph-heading').textContent='Un ciclo, paso a paso';
      byId('graph-caption').textContent=`El ciclo empieza en \\(x_0=${texX(model.start)}\\) y termina en \\(x_0+T=${model.points[4].xTex}\\). Cada separación horizontal mide \\(s=${texPi(model.step)}\\).`;
      renderStatic(byId('graph-caption'));
      const condition=model.kind==='sin'?`AB${model.direction>0?'>':'<'}0`:`A${model.A>0?'>':'<'}0`;
      byId('pattern-description').textContent=`${model.kind==='sin'?'Seno':'Coseno'}, con \\(${condition}\\): ${model.points.map(p=>p.role.toLowerCase()).join(' → ')}.`;
      renderStatic(byId('pattern-description'));
      model.points.forEach(point=>{
        const row=document.createElement('tr');
        const z=document.createElement('td');tex(z,String(point.z));
        const x=document.createElement('td');tex(x,`x_0+${point.z}s=${point.xTex}`);
        const coordinates=document.createElement('td');tex(coordinates,`\\left(${point.xTex},\\ ${texQ(point.y)}\\right)`);
        const role=document.createElement('td');const chip=document.createElement('span');chip.className=`role-chip${point.unit?' extreme':''}`;chip.textContent=point.role;role.append(chip);
        row.append(z,x,coordinates,role);byId('point-rows').append(row);
      });
    }
    graph(model);
    announcement=setTimeout(()=>{byId('lab-status').textContent=model.constant?'Resultados actualizados. Función constante, sin período fundamental.':'Resultados actualizados: fórmula, propiedades, cinco puntos y gráfica.';},350);
  }
  const presets={basic:['sin','1','1','0','0'],example:['sin','2','2','-pi','1'],negative:['sin','2','-1','pi/2','1'],cosine:['cos','-3','2','0','2']};
  document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{
    const [kind,...parameters]=presets[button.dataset.preset];kindInput.value=kind;
    ['A','B','C','K'].forEach((key,i)=>{fields[key].value=parameters[i];});update();
    if(!form.contains(button)) { byId('laboratorio').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); kindInput.focus({preventScroll:true}); }
  }));
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',update);kindInput.addEventListener('change',update);
  update();
})();
