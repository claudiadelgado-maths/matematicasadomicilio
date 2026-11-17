(() => {
  'use strict';
  const root=document.querySelector('.operations-session');
  if(!root)return;
  const $=id=>document.getElementById(id);
  const math=(node,source)=>{
    if(window.katex)window.katex.render(`\\displaystyle ${source}`,node,{throwOnError:false,trust:false,strict:'ignore'});
    else node.textContent=`\\(${source}\\)`;
  };
  if(window.renderMathInElement)window.renderMathInElement(root,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false,trust:false,strict:'ignore',ignoredTags:['script','noscript','style','textarea','pre','code','option']});
  $('math-notice').hidden=!!window.katex;
  const fraction=(n,d)=>n%d===0?String(n/d):`${n<0?'-':''}\\frac{${Math.abs(n)}}{${d}}`;
  let order='fg';
  function update() {
    const [numerator,denominator='1']=$('entry').value.split('/');
    const n=Number(numerator),d=Number(denominator),input=fraction(n,d);
    const inner=order==='fg'?2*n:n+d;
    const outer=order==='fg'?inner+d:2*inner;
    const inside=order==='fg'?'g':'f',outside=order==='fg'?'f':'g';
    $('inner-label').textContent=`DENTRO · PRIMERO ${inside}`;
    $('outer-label').textContent=`FUERA · DESPUÉS ${outside}`;
    math($('flow-entry'),input);
    math($('flow-inner'),`${inside}\\left(${input}\\right)=${fraction(inner,d)}`);
    math($('flow-outer'),`${outside}\\left(${fraction(inner,d)}\\right)=${fraction(outer,d)}`);
    math($('composition-result'),`${outside}\\left(${inside}\\left(${input}\\right)\\right)=${fraction(outer,d)}`);
    $('composition-status').textContent=order==='fg'?'Primero multiplicas por dos; después sumas uno.':'Primero sumas uno; después multiplicas por dos.';
    root.querySelectorAll('[data-order]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.order===order)));
  }
  root.querySelectorAll('[data-order]').forEach(button=>button.addEventListener('click',()=>{order=button.dataset.order;update();}));
  $('entry').addEventListener('change',update);
  $('composition-lab').hidden=false;update();
  $('copy-code').addEventListener('click',async()=>{
    const source=$('python-source');
    try {
      await navigator.clipboard.writeText(source.textContent);
      $('copy-status').textContent='Código completo copiado, incluidas las dos llamadas de ejemplo.';
    } catch {
      const range=document.createRange();range.selectNodeContents(source);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      $('copy-status').textContent='No se pudo copiar automáticamente. El código está seleccionado: usa Ctrl+C o la opción Copiar de tu dispositivo.';
    }
    $('copy-status').hidden=false;
  });
})();
