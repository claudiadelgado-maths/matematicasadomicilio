// Expresiones inmutables; las vistas y las operaciones usan el mismo árbol.
export const actions=['sumar','restar','multiplicar','dividir','combinar','reordenar'];
export const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
export function normalize(a,d=1){if(!Number.isInteger(a)||!Number.isInteger(d)||!a||!d)throw Error('Coeficiente inválido');const g=gcd(a,d);return {a:a/g*Math.sign(d),d:Math.abs(d)/g};}
const N=(id,n,d=1)=>{if(!d)throw Error('División entre cero');if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d))throw Error('Fuera del rango exacto');const g=gcd(n,d)||1;return {type:'num',id,n:(n/g*Math.sign(d))||0,d:Math.abs(d)/g};};
const one=()=>N('unit',1),zero=()=>N('zero',0);
const R=(top,bottom=[])=>{if(top.length>1)top=top.filter(t=>!(t.type==='num'&&t.n===t.d));bottom=bottom.filter(t=>!(t.type==='num'&&t.n===t.d));return !bottom.length&&top.length===1?top[0]:{type:'ratio',top,bottom};};
const S=items=>{const terms=items.length>1?items.filter(t=>!(t.type==='num'&&t.n===0)):items;return terms.length===0?zero():terms.length===1?terms[0]:{type:'sum',terms};};
const terms=e=>e.type==='sum'?e.terms:[e];
const ratio=e=>e.type==='ratio'?e:{type:'ratio',top:[e],bottom:[]};
const negative=e=>{if(e.type==='num')return N(e.id,-e.n,e.d);if(e.type==='x')return {...e,sign:-(e.sign??1)};if(e.type==='ratio'){const i=e.top.findIndex(t=>t.type==='num'||t.type==='x');if(i>=0)return R(e.top.map((t,j)=>i===j?negative(t):t),e.bottom);}return R([N('sign',-1),e]);};
const leaves=e=>e.type==='num'||e.type==='x'?[e]:e.type==='sum'?e.terms.flatMap(leaves):[...e.top,...e.bottom].flatMap(leaves);
const contains=(e,id)=>leaves(e).some(n=>n.id===id);
export function create(a,b,solution,d=1){const k=normalize(a,d),c=k.a*solution/k.d+b;if(!Number.isInteger(b)||!Number.isInteger(solution)||!Number.isInteger(c))throw Error('Datos no enteros');return {...k,b,c,solution,serial:0,left:S([R([...(k.a!==1?[N('a',k.a)]:[]),{type:'x',id:'x'}],k.d!==1?[N('den',k.d)]:[]),...(b?[N('b',b)]:[])]),right:N('c',c)};}
export function generate(rng=Math.random){const int=(a,b)=>a+Math.floor(rng()*(b-a+1)),x=int(-20,20),i=int(0,59),a=i<30?i-30:i-29,b=int(-30,30),ds=Array.from({length:20},(_,i)=>i+1).filter(d=>x%d===0);return create(a,b,x,ds[int(0,ds.length-1)]);}
export const initial=s=>create(s.a,s.b,s.solution,s.d);
export const layout=s=>({left:s.left,right:s.right});
export const number=n=>String(n).replace('-','−');
export function solved(s){return s.left.type==='x'&&(s.left.sign??1)===1&&s.right.type==='num'||s.right.type==='x'&&(s.right.sign??1)===1&&s.left.type==='num';}
export function blocks(s){return ['left','right'].flatMap(side=>leaves(s[side]).filter(n=>!['zero','unit','sign'].includes(n.id)).map(n=>({...n,side,value:n.type==='x'?null:n.n/n.d,role:n.type==='x'?'variable':'constant'})));}
export function tex(e){
 if(e.type==='x')return (e.sign===-1?'-':'')+'x';if(e.type==='num')return e.d===1?String(e.n):`${e.n<0?'-':''}\\frac{${Math.abs(e.n)}}{${e.d}}`;
 if(e.type==='sum')return e.terms.map((t,i)=>{const v=tex(t);return i&& !v.startsWith('-')?'+'+v:v;}).join('');
 const negativeDen=e.bottom.filter(t=>t.n<0).length%2;
 const product=(xs,den=false)=>xs.map((t,i)=>{let v=tex(den&&t.type==='num'?{...t,n:Math.abs(t.n)}:t);if(t.type==='sum')v=`\\left(${v}\\right)`;if(t.type==='num'&&t.n===-1&&t.d===1&&xs[i+1]?.type==='x')return '-';if(t.type==='num'&&t.n===1&&t.d===1&&xs[i+1]?.type==='x')return '';if(i&&v.startsWith('-'))v=`\\left(${v}\\right)`;return (i&&t.type!=='x'?'\\cdot ':'')+v;}).join('')||'1';
 let top=product(e.top);if(negativeDen&&top.startsWith('-'))top=`\\left(${top}\\right)`;return (negativeDen?'-':'')+(e.bottom.length?`\\frac{${top}}{${product(e.bottom,true)}}`:top);
}
export const equationTex=s=>`${tex(s.left)}=${tex(s.right)}`;
export const equation=equationTex;
export function evaluate(e,x){if(e.type==='x')return (e.sign??1)*x;if(e.type==='num')return e.n/e.d;if(e.type==='sum')return e.terms.reduce((a,t)=>a+evaluate(t,x),0);return e.top.reduce((a,t)=>a*evaluate(t,x),1)/e.bottom.reduce((a,t)=>a*evaluate(t,x),1);}
function combine(e,ids,id){
 if(e.type==='sum'){const z=e.terms.find(t=>t.type==='num'&&t.n===0&&ids.includes(t.id));if(z&&e.terms.some(t=>t!==z&&t.type!=='num'&&contains(t,ids.find(i=>i!==z.id))))return S(e.terms.filter(t=>t!==z));const found=e.terms.filter(t=>t.type==='num'&&ids.includes(t.id));if(found.length===2){const [a,b]=found;return S(e.terms.flatMap(t=>t.id===a.id?[N(id,a.n*b.d+b.n*a.d,a.d*b.d)]:t.id===b.id?[]:[t]));}return {...e,terms:e.terms.map(t=>combine(t,ids,id))};}
 if(e.type!=='ratio')return e;
 const found=[...e.top.map(t=>({t,den:false})),...e.bottom.map(t=>({t,den:true}))].filter(({t})=>t.type==='num'&&ids.includes(t.id));
 if(found.length===2){const [a,b]=found;let n,d;if(a.den===b.den){n=a.t.n*b.t.n;d=a.t.d*b.t.d;}else{const num=a.den?b.t:a.t,den=a.den?a.t:b.t;if(!den.n)return e;n=num.n*den.d;d=num.d*den.n;}
 const bothDen=a.den&&b.den,top=e.top.filter(t=>!ids.includes(t.id)),bottom=e.bottom.filter(t=>!ids.includes(t.id));(bothDen?bottom:top).push(N(id,n,d));return R(top.length?top:[one()],bottom);}
 return R(e.top.map(t=>combine(t,ids,id)),e.bottom.map(t=>combine(t,ids,id)));
}
function tidy(e){if(e.type==='sum')return S(e.terms.map(tidy));if(e.type!=='ratio')return e;let top=e.top.map(tidy),bottom=e.bottom.map(tidy).filter(t=>!(t.type==='num'&&t.n===t.d));if(top.length>1)top=top.filter(t=>!(t.type==='num'&&t.n===t.d));return R(top.length?top:[one()],bottom);}
export function transition(s,selection,action){const ids=[...new Set(selection)],reject=message=>({state:s,ok:false,message});if(!ids.length)return reject('Selecciona un bloque.');if(!actions.includes(action)||ids.some(id=>!blocks(s).some(b=>b.id===id)))return reject('Esta selección no permite esa operación.');let next={...s,serial:s.serial+1};
 if(action==='combinar'){if(ids.length!==2)return reject('Selecciona dos cantidades compatibles.');const id=`n${next.serial}`;try{next.left=combine(s.left,ids,id);next.right=combine(s.right,ids,id);}catch{return reject('Estas cantidades son demasiado grandes para combinarlas con exactitud.');}if(JSON.stringify([next.left,next.right])===JSON.stringify([s.left,s.right]))return reject('Estas cantidades no se pueden combinar directamente.');next.left=tidy(next.left);next.right=tidy(next.right);if(blocks(next).some(n=>n.type==='num'&&(!Number.isSafeInteger(n.n)||!Number.isSafeInteger(n.d))))return reject('Estas cantidades son demasiado grandes para combinarlas con exactitud.');return {state:next,ok:true,merge:ids,target:id,message:'Combinaste las cantidades seleccionadas.'};}
 if(action==='reordenar'){if(ids.length!==2)return reject('Selecciona dos términos del mismo miembro para intercambiarlos.');for(const side of ['left','right']){const ts=terms(s[side]),a=ts.findIndex(t=>contains(t,ids[0])),b=ts.findIndex(t=>contains(t,ids[1]));if(a>=0&&b>=0&&a!==b){const out=[...ts];[out[a],out[b]]=[out[b],out[a]];next[side]=S(out);return {state:next,ok:true,message:'Cambiaste el orden sin cambiar la igualdad.'};}}return reject('Elige bloques de dos términos distintos del mismo miembro.');}
 if(ids.length!==1)return reject('Para pasar un bloque, selecciona solo uno.');const id=ids[0],side=contains(s.left,id)?'left':'right',other=side==='left'?'right':'left',source=s[side];
 if(action==='sumar'||action==='restar'){const ts=terms(source),t=ts.find(t=>(t.type==='num'||t.type==='x')&&t.id===id||id==='x'&&contains(t,'x'));const polarity=t&&(t.type==='num'?t.n:t.type==='x'?(t.sign??1):evaluate(t,1));if(!t||!polarity||action!==(polarity>0?'restar':'sumar'))return reject('Solo puedes trasladar un término de la suma con su operación inversa.');next[side]=S(ts.filter(v=>v!==t));const dest=s[other].id==='zero'?[]:terms(s[other]);next[other]=S([...dest,negative(t)]);}
 else {const r=ratio(source),top=r.top.find(t=>(t.type==='num'||t.type==='x')&&t.id===id),bottom=r.bottom.find(t=>(t.type==='num'||t.type==='x')&&t.id===id),t=action==='dividir'?top:bottom;if(!t||t.type==='num'&&!t.n)return reject('Ese bloque no es un factor de todo el miembro. No se puede trasladar así.');if(t.type==='x'){if(s.solution===0)return reject('No se puede dividir por x: no está garantizado que sea distinta de cero.');next.nonzeroX=true;}next[side]=R(r.top.filter(v=>v!==t).length?r.top.filter(v=>v!==t):[one()],r.bottom.filter(v=>v!==t));const dest=ratio(s[other]);next[other]=action==='dividir'?R(dest.top,[...dest.bottom,t]):R([...dest.top,t],dest.bottom);}
 return {state:next,ok:true,message:'Aplicaste la operación inversa a ambos miembros. Puedes seguir o regresar.'};
}
export function check(s,text){const clean=String(text).trim().replace('−','-');return solved(s)&&/^[+-]?\d+$/.test(clean)&&Number(clean)===s.solution;}


