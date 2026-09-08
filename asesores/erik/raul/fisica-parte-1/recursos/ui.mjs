export const $=id=>document.getElementById(id);
export function math(el,tex){if(window.katex)window.katex.render(tex,el,{throwOnError:false,strict:'ignore'});else{el.textContent=tex.replace(/\\mathrm\{([^}]*)\}/g,'$1').replaceAll('\\mu','μ').replaceAll('\\Omega','Ω').replaceAll('\\times','×').replaceAll('\\,',' ');}}
export const unit=s=>`\\mathrm{${s.replaceAll('μ','\\mu ').replaceAll('Ω','\\Omega ')}}`;
export const quantity=(n,u)=>`${n}\\,${unit(u)}`;
export function feedback(text='',correct=null){const el=$('feedback');el.textContent=text;el.dataset.result=correct===null?'':correct?'correct':'incorrect';if(correct&&!matchMedia('(prefers-reduced-motion: reduce)').matches)el.animate([{opacity:.4,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220});}
export function result(ok,error='Revisa tu respuesta e inténtalo de nuevo.'){feedback(ok?'✓ ¡Correcto!':'✕ '+error,ok);}
export function renderStatic(){document.querySelectorAll('[data-tex]').forEach(el=>math(el,el.dataset.tex));}
export function formula(tex){const el=document.createElement('div');el.className='formula';math(el,tex);return el;}
export function selected(container,button){container.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));feedback();}
