// Aritmética racional exacta: no usa coma flotante para operar coeficientes.
const abs=n=>n<0n?-n:n;
function gcd(a,b){a=abs(a);b=abs(b);while(b){[a,b]=[b,a%b]}return a||1n;}
export function rat(n,d=1n){if(d===0n)throw Error('No se puede dividir entre cero.');if(d<0n){n=-n;d=-d}const g=gcd(n,d);n/=g;d/=g;if(n.toString().length>1200||d.toString().length>1200)throw Error('Este resultado es demasiado largo. Usa números más pequeños.');return {n,d};}
export const mul=(a,b)=>rat(a.n*b.n,a.d*b.d);
export const div=(a,b)=>rat(a.n*b.d,a.d*b.n);
export const same=(a,b)=>a.n*b.d===b.n*a.d;
export const one=()=>rat(1n);
export function parse(raw){const s=String(raw).trim().replace(',','.').replace('−','-');if(s.length>65||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))throw Error('Escribe un número decimal válido, sin separadores de miles (máximo 60 cifras).');const [whole,decimal='']=s.split('.');return rat(BigInt((whole+decimal).replace('+','')),10n**BigInt(decimal.length));}
export function integer(raw,min=-999,max=999){if(!/^[+-]?\d+$/.test(String(raw).trim()))throw Error('El exponente debe ser un número entero.');const n=Number(raw);if(!Number.isSafeInteger(n)||n<min||n>max)throw Error(`Usa un entero entre ${min} y ${max}.`);return n||0;}
export function shift(a,b){return b>=0?mul(a,rat(10n**BigInt(b))):div(a,rat(10n**BigInt(-b)));}
export function decimal(a,max=350){
  const sign=a.n<0n?'−':'',n=abs(a.n),whole=(n/a.d).toString();let rem=n%a.d,digits='',seen=new Map();
  if(whole.length>max)throw Error('La forma decimal es muy larga para la pizarra. Conserva la notación científica.');
  while(rem){if(seen.has(rem)){const pos=seen.get(rem);return {sign,whole,fraction:digits.slice(0,pos),repeat:digits.slice(pos)}}if(digits.length+whole.length>=max)throw Error('La expansión decimal es muy larga. El coeficiente se conserva como fracción exacta.');seen.set(rem,digits.length);rem*=10n;digits+=(rem/a.d).toString();rem%=a.d;}
  return {sign,whole,fraction:digits,repeat:''};
}
export function text(a){try{const d=decimal(a,45);return `${d.sign}${d.whole}${d.fraction||d.repeat?'.':''}${d.fraction}${d.repeat?`(${d.repeat}) periódico`:''}`;}catch{return `${a.n}/${a.d}`}}
export function normalized(t){let {a,b}=t;if(a.n===0n)return {...t,a:rat(0n),b:0,kind:'sci',places:null,literal:null};let n=abs(a.n),d=a.d,k=0;while(n>=10n*d){d*=10n;k++}while(n<d){n*=10n;k--}a=shift(a,-k);b=integer(b+k);return {...t,a,b,kind:'sci',places:null,literal:null};}
export function term(raw,exponent,kind='sci'){return {a:parse(raw),b:kind==='decimal'?0:integer(exponent),kind,places:null,literal:kind==='decimal'?String(raw).trim().replace(',','.'):null};}
export function empty(){return {top:[],bottom:[],next:1,approx:false};}
export function clone(s){return structuredClone(s);}
export const isAtom=t=>!t.type;
export function find(s,key){
  const [id,part]=String(key).split(':');
  function walk(list,side,ancestors=[]){for(let index=0;index<list.length;index++){const t=list[index];if(t.id===Number(id))return {t,index,parent:list,side,ancestors,part:part||'whole'};if(t.children){const f=walk(t.children,side,[...ancestors,t.id]);if(f)return f;}}}
  const f=walk(s.top,'top')||walk(s.bottom,'bottom');if(!f)throw Error('Selecciona un factor de la pizarra.');
  if(f.part==='ten'&&(!isAtom(f.t)||f.t.kind!=='sci'))throw Error('Selecciona una potencia de diez.');return f;
}
export function flat(t){
  if(isAtom(t))return {...t};
  let a=one(),b=0;for(const child of t.children){const n=flat(child);a=mul(a,n.a);b+=n.b;}
  let kind=t.children.every(c=>flat(c).kind==='decimal')?'decimal':'sci';
  if(t.type==='power'){
    const k=integer(t.p,-12,12);if(a.n===0n&&k<=0)throw Error('No se admite 0⁰ ni una potencia negativa de cero.');
    const p=BigInt(Math.abs(k));a=rat(a.n**p,a.d**p);if(k<0)a=div(one(),a);b*=k;
  }else if(t.type==='absolute')a=rat(abs(a.n),a.d);else throw Error('Grupo desconocido.');
  return {a,b:integer(b),kind,places:null};
}
export const nodeValue=t=>{const n=flat(t);return shift(n.a,n.b)};
export function value(s){let v=one();for(const t of s.top)v=mul(v,nodeValue(t));for(const t of s.bottom)v=div(v,nodeValue(t));return v;}
function refs(s,keys){const fs=[...new Set(keys.map(String))].map(k=>find(s,k));for(const f of fs)for(const g of fs)if(f!==g&&(f.t.id===g.t.id||g.ancestors.includes(f.t.id)))throw Error('Elige el grupo completo o sus componentes, no ambos a la vez.');return fs;}
function siblings(fs){return fs.length&&fs.every(f=>f.parent===fs[0].parent&&f.part==='whole');}
function roots(fs){return fs.every(f=>!f.ancestors.length&&f.part==='whole');}
function register(s,t){const result={...clone(t),id:s.next++};if(result.children)result.children=result.children.map(c=>register(s,c));return result;}
function put(s,list,t,index=list.length){const n={...t,id:s.next++};list.splice(index,0,n);return String(n.id);}
function remove(fs){const lists=new Set(fs.map(f=>f.parent));for(const list of lists){const ids=new Set(fs.filter(f=>f.parent===list).map(f=>f.t.id));for(let i=list.length-1;i>=0;i--)if(ids.has(list[i].id))list.splice(i,1);}}
function valid(s){
  let count=0;const ids=new Set();function walk(list,depth){if(depth>6)throw Error('Usa como máximo seis niveles de agrupación.');for(const t of list){count++;if(ids.has(t.id))throw Error('Identificador de factor repetido.');ids.add(t.id);if(t.children){if(!t.children.length)throw Error('Un grupo necesita al menos un factor.');walk(t.children,depth+1);}else integer(t.b);nodeValue(t);}}
  walk(s.top,0);walk(s.bottom,0);if(count>60||s.top.length+s.bottom.length>24)throw Error('Combina algunos factores: la pizarra admite 24 factores principales y 60 componentes.');for(const t of s.bottom)if(nodeValue(t).n===0n)throw Error('El denominador no puede contener cero.');value(s);return s;
}
const constructive=new Set(['add','power','absolute','round','delete','reset']);
export function availability(s,keys,mode='creator'){
  let fs=[];try{fs=refs(s,keys)}catch{return {}}const single=fs.length===1,f=fs[0],atom=single&&isAtom(f.t)&&f.part==='whole',whole=single&&f.part==='whole',compatible=fs.length>=2&&(siblings(fs)||roots(fs))&&fs.every(f=>isAtom(f.t)&&f.part==='whole');
  let cancel=false;if(fs.length===2&&roots(fs)&&fs[0].side!==fs[1].side){try{cancel=nodeValue(fs[0].t).n!==0n&&same(nodeValue(fs[0].t),nodeValue(fs[1].t))}catch{}}
  return {add:mode==='creator',power:mode==='creator'&&!!siblings(fs),absolute:mode==='creator'&&!!siblings(fs),evaluate:whole&&f.t.type==='power',evaluateAbs:whole&&f.t.type==='absolute',combine:compatible,cancel,normalize:atom,scientific:atom,decimal:atom,round:mode==='creator'&&atom,delete:mode==='creator'&&fs.length>0&&fs.every(f=>f.part==='whole')&&fs.every(f=>!f.ancestors.length||f.parent.some(t=>!fs.some(g=>g.t.id===t.id))),left:whole&&f.index>0,right:whole&&f.index<f.parent.length-1,up:single&&!f.ancestors.length&&f.side==='bottom'&&nodeValue(f.t).n!==0n,down:single&&!f.ancestors.length&&f.side==='top'&&(f.part==='ten'||nodeValue(f.t).n!==0n)};
}
export function apply(state,action,keys=[],arg,mode='creator'){
  if(mode==='solve'&&constructive.has(action))throw Error('En Resolver esta acción cambiaría el problema. Usa solo transformaciones equivalentes.');
  const s=clone(state);let fs=refs(s,keys),selected=keys.map(String),explanation='',steps=[],relation='=';
  if(action==='add'){const n=register(s,arg.term);s[arg.side].push(n);selected=[String(n.id)];explanation=`Factor añadido al ${arg.side==='top'?'numerador':'denominador'}.`;relation='→';}
  else if(action==='reset')return {state:empty(),selected:[],explanation:'La pizarra vuelve a 1.',steps:[],relation:'→'};
  else{
    if(!availability(s,keys,mode)[action])throw Error(action==='combine'?'Selecciona factores simples del mismo grupo o de las filas principales. Evalúa primero las potencias o valores absolutos seleccionados.':action==='cancel'?'Selecciona dos factores no nulos de igual valor, uno en cada fila principal.':action==='up'||action==='down'?'Selecciona un factor principal o su potencia de diez. Dentro de un grupo, evalúa el grupo antes de cruzar la barra.':'Esta herramienta no se aplica a la selección actual.');
    const f=fs[0],t=f.t;
    if(action==='power'||action==='absolute'){
      const children=fs.slice().sort((a,b)=>a.index-b.index).map(f=>f.t),index=Math.min(...fs.map(f=>f.index)),list=f.parent;remove(fs);
      const group={type:action==='power'?'power':'absolute',children};if(action==='power')group.p=integer(arg,-12,12);flat(group);
      selected=[put(s,list,group,index)];explanation=action==='power'?'Se creó una potencia pendiente sobre todo el grupo. Todavía no se ha evaluado.':'Se añadió valor absoluto a todo el grupo.';relation='→';
    }else if(action==='evaluate'||action==='evaluateAbs'){
      const result=flat(t);steps=[{type:action==='evaluate'?'power':'absolute',before:clone(t),result}];f.parent[f.index]={...result,id:t.id};explanation=action==='evaluate'?'Se elevó el coeficiente y se multiplicó el exponente de diez por la potencia del grupo.':'El valor absoluto convierte el valor del grupo en su magnitud no negativa.';
    }else if(action==='combine'){
      const mixed=!siblings(fs);let a=one(),b=0;const numer=[],denom=[];
      for(const entry of fs){if(mixed&&entry.side==='bottom'){a=div(a,entry.t.a);b-=entry.t.b;denom.push(entry.t);}else{a=mul(a,entry.t.a);b+=entry.t.b;numer.push(entry.t)}}
      const result={a,b:integer(b),kind:fs.every(f=>f.t.kind==='decimal')?'decimal':'sci',places:null};
      const list=mixed?s.top:f.parent,index=mixed?s.top.length:Math.min(...fs.map(f=>f.index));remove(fs);selected=[put(s,list,result,Math.min(index,list.length))];
      steps=[{type:'combine',numer:clone(numer),denom:clone(denom),result}];explanation=mixed?'Divide los coeficientes y resta los exponentes del denominador. El resultado permanece arriba, aunque su exponente sea negativo.':'Multiplica los coeficientes y suma los exponentes. El producto permanece en su grupo o fila.';
    }else if(action==='cancel'){remove(fs);selected=[];explanation='Los dos factores tienen el mismo valor no nulo. Su cociente es exactamente 1.';steps=[{type:'cancel',before:clone(fs[0].t)}];}
    else if(action==='left'||action==='right'){const j=f.index+(action==='left'?-1:1);[f.parent[f.index],f.parent[j]]=[f.parent[j],f.parent[f.index]];explanation='Se reordenaron los factores del mismo producto.';}
    else if(action==='up'||action==='down'){
      const target=action==='up'?s.top:s.bottom;
      if(f.part==='ten'){
        if(same(t.a,one()))f.parent.splice(f.index,1);else f.parent[f.index]={...t,b:0,kind:'decimal',places:null,literal:null};
        const n={a:one(),b:(-t.b)||0,kind:'sci',places:null,literal:null};selected=[put(s,target,n)];explanation='Solo cruzó la potencia de diez: su exponente cambia de signo. El coeficiente permanece en su fila.';steps=[{type:'ten',b:t.b}];
      }else if(isAtom(t)&&same(t.a,one())){f.parent.splice(f.index,1);selected=[put(s,target,{...t,b:(-t.b)||0})];explanation='El recíproco de una potencia de diez tiene el exponente opuesto.';steps=[{type:'ten',b:t.b}];}
      else{f.parent.splice(f.index,1);selected=[put(s,target,{type:'power',p:-1,children:[t]})];explanation='El factor completo cruzó como su recíproco, con potencia −1 pendiente. Así se conserva exactamente el valor.';steps=[{type:'reciprocal',before:clone(t)}];}
    }else if(action==='normalize'||action==='scientific'){f.parent[f.index]=normalized(t);explanation='Se compensó el desplazamiento del coeficiente con el exponente: 1 ≤ |a| < 10, salvo cero.';}
    else if(action==='decimal'){const a=shift(t.a,t.b);decimal(a);f.parent[f.index]={...t,a,b:0,kind:'decimal',places:null,literal:null};explanation='Forma decimal exacta. Las cifras con barra se repiten periódicamente.';}
    else if(action==='round'){const sign=t.a.n<0n?-1n:1n,n=abs(t.a.n)*100n,d=t.a.d;let q=n/d;if((n%d)*2n>=d)q++;const a=rat(sign*q,100n);s.approx||=!same(a,t.a);f.parent[f.index]={...t,a,places:2,literal:null};explanation='Se redondeó el coeficiente a dos decimales. Es una aproximación, no una igualdad.';relation='≈';}
    else if(action==='delete'){remove(fs);selected=[];explanation='Se eliminaron los factores seleccionados.';relation='→';}
  }
  valid(s);
  if(relation==='='&&!same(value(state),value(s)))throw Error('La transformación no conserva el valor. No se aplicó ningún cambio.');
  return {state:s,selected,explanation,steps,relation};
}
export function checkResult(s,original,requireScientific=false){
  if(!same(value(s),value(original)))return {ok:false,message:'El valor no coincide con la expresión inicial. Deshaz y revisa el último paso.'};
  const simple=s.bottom.length===0&&(s.top.length===0||(s.top.length===1&&isAtom(s.top[0])));
  if(!simple)return {ok:false,message:'El valor sigue siendo correcto, pero aún quedan productos, cocientes, potencias o grupos pendientes.'};
  const t=s.top[0]||term('1',0,'decimal'),n=abs(t.a.n);
  if(requireScientific&&(t.kind!=='sci'||(n!==0n&&(n<t.a.d||n>=10n*t.a.d))))return {ok:false,message:'El valor es correcto. Usa Normalizar para terminar en notación científica normalizada.'};
  return {ok:true,message:'Correcto: queda un único valor, equivalente a la expresión inicial.'};
}
export function generate(level='basic',seed=0){
  let s=empty();const a=2+seed%7,b=1+seed%4;
  function add(t,side='top'){const n=register(s,t);s[side].push(n)}
  let label='Simplifica la expresión',requireScientific=false;
  if(level==='coulomb'){
    add(term('9',9));add({type:'absolute',children:[term('-16',-6),term('18',-6)]});add({type:'power',p:2,children:[term('0.060',0,'decimal')]},'bottom');label='Simplifica la expresión · resultado en N';
  }else if(level==='basic'){
    switch(seed%4){case 0:add(term(String(a),b));add(term('2',b+1));break;case 1:add(term(String(2*a),-b));add(term('2',b),'bottom');break;case 2:add(term('0.04',0,'decimal'));add(term(String(a),6));break;case 3:add({type:'power',p:2,children:[term(String(a),-b)]});break;}
    requireScientific=seed%3===1;
  }else if(level==='intermediate'){
    add(term(String(3*a),b+3));add(term('4',-b));add(term('3',b),'bottom');requireScientific=seed%2===1;
  }else{
    if(seed%2){add({type:'power',p:2,children:[term('2',3),term('5',-2)]});add(term('0.04',0,'decimal'),'bottom');}
    else{add(term('9',9));add({type:'absolute',children:[term(String(-2*a),-6),term('18',-6)]});add({type:'power',p:2,children:[term('0.060',0,'decimal')]},'bottom');}
    requireScientific=seed%3===1;
  }
  if(requireScientific)label='Da el resultado en notación científica normalizada';valid(s);return {state:s,label,requireScientific,unit:level==='coulomb'?'N':''};
}
