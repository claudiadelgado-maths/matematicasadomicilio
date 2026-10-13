let serial=0;
const campo=(valor='')=>({tipo:'campo',id:`campo-${++serial}`,valor});
const fila=(valor='')=>({tipo:'fila',items:[campo(valor)]});
export function expresion(n){if(n.tipo==='campo')return n.valor;if(n.tipo==='fila')return n.items.map(expresion).join('');if(n.tipo==='fraccion')return `((${expresion(n.arriba)})/(${expresion(n.abajo)}))`;return `((${expresion(n.arriba)})^(${expresion(n.abajo)}))`;}
export function crearEditor(host,{letras=[],onChange=()=>{},etiqueta='Tu respuesta',prefijo=''}={}){
  let arbol=fila(),activo=arbol.items[0].id,pos=0,fin=0,historia=[];
  host.classList.add('math-editor');host.replaceChildren();
  const area=document.createElement('div');area.className='editor-area';
  const titulo=document.createElement('span');titulo.className='editor-prefix';titulo.textContent=prefijo;
  const vista=document.createElement('div');vista.className='editor-tree';
  const teclado=document.createElement('div');teclado.className='math-keypad';teclado.setAttribute('aria-label','Teclado matemático');
  const ayuda=document.createElement('p');ayuda.className='editor-help';ayuda.textContent='Haz clic en cualquier casilla para editarla. Fracción coloca lo escrito arriba; también puedes crearla vacía. Tab cambia de campo. Teclado: / fracción, ^ exponente, p para π.';
  area.append(titulo,vista);host.append(area,teclado,ayuda);
  const buscar=(id,n=arbol)=>{if(n.tipo==='campo')return n.id===id?n:null;if(n.tipo==='fila'){for(const item of n.items){const found=buscar(id,item);if(found)return found;}}else return buscar(id,n.arriba)||buscar(id,n.abajo);return null;};
  function snapshot(){historia.push(JSON.stringify(arbol));if(historia.length>80)historia.shift();}
  function focus(id=activo,p=pos){const input=vista.querySelector(`[data-campo="${id}"]`);if(input){input.focus({preventScroll:true});input.setSelectionRange(p,p);activo=id;pos=fin=p;}}
  function render(n,label,espaciador=false){
    if(n.tipo==='campo'){
      const input=document.createElement('input');input.type='text';input.value=n.valor;input.autocomplete='off';input.spellcheck=false;input.dataset.campo=n.id;input.setAttribute('aria-label',label);input.size=Math.max(2,n.valor.length+1);input.style.width=`${Math.max(2,n.valor.length+1)}ch`;input.placeholder=espaciador?' ':'□';if(espaciador)input.classList.add('editor-spacer');
      const sync=()=>{activo=n.id;pos=input.selectionStart;fin=input.selectionEnd;};
      input.addEventListener('focus',sync);input.addEventListener('click',sync);input.addEventListener('select',sync);input.addEventListener('keyup',sync);
      input.addEventListener('beforeinput',()=>snapshot());
      input.addEventListener('input',()=>{n.valor=input.value;input.style.width=`${Math.max(2,n.valor.length+1)}ch`;sync();onChange();});
      input.addEventListener('keydown',e=>{sync();if(e.key==='/'||e.key==='^'){e.preventDefault();estructura(e.key==='/'?'fraccion':'potencia');}else if(e.key==='p'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();insertar('π');}else if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();deshacer();}});
      return input;
    }
    const span=document.createElement('span');span.className=`editor-${n.tipo}`;
    if(n.tipo==='fila')n.items.forEach(item=>span.append(render(item,label,n.items.length>1)));
    else{const top=render(n.arriba,label+(n.tipo==='fraccion'?' · numerador':' · base')),bottom=render(n.abajo,label+(n.tipo==='fraccion'?' · denominador':' · exponente'));span.append(top,bottom);}
    return span;
  }
  function pintar(){vista.replaceChildren(render(arbol,etiqueta));onChange();}
  function insertar(text){const n=buscar(activo);if(!n)return;snapshot();n.valor=n.valor.slice(0,pos)+text+n.valor.slice(fin);pos+=text.length;fin=pos;pintar();focus();}
  function reemplazar(id,nuevos,n=arbol){if(n.tipo==='fila'){const i=n.items.findIndex(x=>x.id===id);if(i>=0){n.items.splice(i,1,...nuevos);return true;}return n.items.some(item=>reemplazar(id,nuevos,item));}if(n.tipo!=='campo')return reemplazar(id,nuevos,n.arriba)||reemplazar(id,nuevos,n.abajo);return false;}
  function estructura(tipo,exp=''){
    const n=buscar(activo);if(!n)return;snapshot();const selected=fin>pos;
    // Una potencia se aplica al último número o letra, salvo selección explícita.
    const ultimo=tipo==='potencia'&&!selected?n.valor.slice(0,pos).match(/(?:\d+(?:\.\d+)?|pi|L[12n₁₂ₙ]|[A-Za-zπ])$/):null;
    const start=selected?pos:ultimo?pos-ultimo[0].length:0,top=n.valor.slice(start,fin),before=campo(n.valor.slice(0,start)),after=campo(n.valor.slice(fin));
    const bloque={tipo,arriba:fila(top),abajo:fila(exp)};reemplazar(n.id,[before,bloque,after]);
    const dest=exp?after:top?bloque.abajo.items[0]:bloque.arriba.items[0];activo=dest.id;pos=fin=dest.valor.length;pintar();focus();
  }
  function borrar(){const n=buscar(activo);if(!n)return;snapshot();if(fin>pos)n.valor=n.valor.slice(0,pos)+n.valor.slice(fin);else if(pos>0){n.valor=n.valor.slice(0,pos-1)+n.valor.slice(pos);pos--;}fin=pos;pintar();focus();}
  function limpiar(){snapshot();arbol=fila();activo=arbol.items[0].id;pos=fin=0;pintar();focus();}
  function deshacer(){if(!historia.length)return;arbol=JSON.parse(historia.pop());activo=arbol.items[0].id;pos=fin=arbol.items[0].valor.length;pintar();focus();}
  const key=(texto,accion,label=texto)=>{const b=document.createElement('button');b.type='button';b.textContent=texto;b.setAttribute('aria-label',label);b.addEventListener('click',accion);teclado.append(b);};
  [...new Set(letras)].forEach(t=>key(t,()=>insertar(t)));
  ['7','8','9','4','5','6','1','2','3','0','π','+','−','×','(',')'].forEach(t=>key(t,()=>insertar(t)));
  key('Fracción',()=>estructura('fraccion'),'Insertar fracción');key('x²',()=>estructura('potencia','2'),'Elevar al cuadrado');key('xⁿ',()=>estructura('potencia'),'Insertar exponente');key('⌫',borrar,'Borrar carácter');key('Deshacer',deshacer);key('Limpiar',limpiar);
  pintar();
  return {leer:()=>expresion(arbol),limpiar,focus:()=>focus(),set:valor=>{arbol=fila(valor);activo=arbol.items[0].id;pos=fin=valor.length;pintar();},get arbol(){return arbol;}};
}
