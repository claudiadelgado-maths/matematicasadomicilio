const literal=t=>t.op==='v'||['power','square'].includes(t.op)&&t.a.op==='v'||t.op==='*'&&literal(t.a)&&literal(t.b);
const positiveMonomial=t=>literal(t)||t.op==='n'&&t.n>=0||t.op==='*'&&positiveMonomial(t.a)&&positiveMonomial(t.b);
const par=(s,tex)=>tex?`\\left(${s}\\right)`:`(${s})`;
const fraction=(a,b)=>`<span class="fraction"><span>${a}</span><span>${b}</span></span>`;
export function render(t,tex=false){
 if(t.op==='wordAnswer'){const values=t.values.map((v,i)=>(t.labels[i]?t.labels[i]+' = ':'')+v+(t.unit?' '+t.unit:''));if(!t.labels.length&&values.length>1)return tex?'\\left('+values.join(', ')+ '\\right)':'<span class="word-answer">('+values.join(', ')+')</span>';return tex?'\\text{'+values.join('; ')+'}':'<span class="word-answer">'+values.map(v=>'<span>'+v+'</span>').join('')+'</span>';}
 if(t.op==='n')return String(t.n).replace('-',tex?'-':'−');if(t.op==='v')return tex?t.v:`<i>${t.v}</i>`;
 const a=render(t.a,tex),b=t.b?render(t.b,tex):'';
 if(t.op==='pair')return tex?(t.roots?'x_{1}':'x')+' = '+a+'\\,,\\quad '+(t.roots?'x_{2}':'y')+' = '+b:`<span class="pair-values"><span>${t.roots?'x<sub>1</sub>':'x'} = ${a}</span><span>${t.roots?'x<sub>2</sub>':'y'} = ${b}</span></span>`;
 if(t.op==='system')return tex?'\\left\\{\\begin{aligned}'+a+'\\\\[.5em]'+b+'\\end{aligned}\\right.':`<span class="system-values"><span>${a}</span><span>${b}</span></span>`;
 if(t.op==='polyGroup')return tex?'\\left['+a+'\\right]':'['+a+']';
 if(t.op==='polyDivision')return tex?'\\left['+a+'\\right]\\;\\text{entre}\\;\\left['+b+'\\right]':'['+a+'] entre ['+b+']';
 if(t.op==='power')return (t.a.op==='v'?a:par(a,tex))+(tex?'^{'+t.exponent+'}':'<sup>'+t.exponent+'</sup>');
 if(t.op==='divide')return par(a,tex)+(tex?'\\div ':' ÷ ')+par(b,tex);
 if(t.op==='=')return a+' = '+b;
 if(t.op==='/')return tex?`\\frac{${a}}{${b}}`:fraction(a,b);
 if(t.op==='neg')return '−'+(t.a.op==='/'||t.a.op==='v'||t.a.op==='square'||positiveMonomial(t.a)?a:par(a,tex));
 if(t.op==='square')return (t.a.op==='v'||(t.a.op==='n'&&t.a.n>=0)?a:par(a,tex))+(tex?'^{2}':'<sup>2</sup>');
 if(t.op==='*'){
  if(t.brackets)return par(a,tex)+par(b,tex);
  if(literal(t.b))return a+b;
  if(['+','-'].includes(t.a.op)||['+','-'].includes(t.b.op))return par(a,tex)+(tex?'\\cdot ':' · ')+par(b,tex);
  return a+(tex?'\\cdot ':' · ')+b;
 }
 if(t.b.op==='n'&&t.b.n<0)return a+(t.op==='+'?' − ':' + ')+String(-t.b.n);
 // Los signos de las fracciones se dejan visibles para el paso de reacomodo.
 return a+(t.op==='+'?' + ':' − ')+b;
}
export function math(t){if(t.op==='polyDivision')return `<span class="polynomial-division"><span>${math({op:'polyGroup',a:t.a})}</span><strong>entre</strong><span>${math({op:'polyGroup',a:t.b})}</span></span>`;if(t.op==='wordAnswer')return render(t);const tex=render(t,true);if(globalThis.katex)return `<span class="math">${globalThis.katex.renderToString('\\displaystyle '+tex,{throwOnError:true,trust:false})}</span>`;return `<span class="math native">${render(t)}</span>`;}
