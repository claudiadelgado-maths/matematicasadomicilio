import {rat,parse,mul,div,same,integer} from '../motor.mjs';
export {rat};
export const letters=['x','y','z'];
export const empty=()=>({top:[],bottom:[],next:1,domain:['x','y','z']});
export function term(raw='1',vars={}){
  const parts=String(raw).split('/');
  if(parts.length>2)throw Error('Escribe un número o una fracción como 3/4.');
  const a=parts.length===2?div(parse(parts[0]),parse(parts[1])):parse(parts[0]);
  return {a,vars:Object.fromEntries(letters.map(v=>[v,integer(String(vars[v]??0),-99,99)]))};
}
const unit=()=>({a:rat(1n),vars:{x:0,y:0,z:0}});
function product(a,b,sign=1){
  const result={a:sign===1?mul(a.a,b.a):div(a.a,b.a),vars:{}};
  for(const v of letters){result.vars[v]=a.vars[v]+sign*b.vars[v];if(Math.abs(result.vars[v])>999)throw Error('Mantén los exponentes entre −999 y 999.');}
  return result;
}
function pow(t,p){
  if(t.a.n===0n&&p<=0)throw Error('No se permite cero elevado a cero ni a un exponente negativo.');
  let a=rat(t.a.n**BigInt(Math.abs(p)),t.a.d**BigInt(Math.abs(p)));
  if(p<0)a=div(rat(1n),a);
  const vars=Object.fromEntries(letters.map(v=>[v,t.vars[v]*p]));
  if(Object.values(vars).some(n=>Math.abs(n)>999))throw Error('Esta potencia produce exponentes demasiado grandes.');
  return {a,vars};
}
export function flat(t){return t.type?pow(t.children.reduce((a,c)=>product(a,flat(c)),unit()),t.p):{a:t.a,vars:{...t.vars}};}
export function value(s){const a=s.top.reduce((a,t)=>product(a,flat(t)),unit());return s.bottom.reduce((a,t)=>product(a,flat(t),-1),a);}
export function equivalent(a,b){const x=value(a),y=value(b);return same(x.a,y.a)&&(x.a.n===0n||letters.every(v=>x.vars[v]===y.vars[v]))&&a.domain.join()===b.domain.join();}
export function find(s,key){
  function walk(list,side,ancestors=[]){for(let index=0;index<list.length;index++){const t=list[index];if(String(t.id)===String(key))return {t,index,parent:list,side,ancestors};if(t.type){const f=walk(t.children,side,[...ancestors,t.id]);if(f)return f;}}}
  return walk(s.top,'top')||walk(s.bottom,'bottom');
}
export function availability(s,keys,mode){
  const f=keys.map(k=>find(s,k)).filter(Boolean),one=f.length===1,all=f.length===keys.length&&!!f.length;
  const sameRow=all&&f.every(g=>g.parent===f[0].parent),roots=all&&f.every(g=>!g.ancestors.length),atoms=all&&f.every(g=>!g.t.type);
  return {add:mode==='creator',power:mode==='creator'&&sameRow,evaluate:one&&f[0].t.type==='power',combine:atoms&&f.length>1&&(sameRow||roots),cancel:atoms&&f.length===2&&roots&&f[0].side!==f[1].side,positive:one&&!f[0].t.type&&!f[0].ancestors.length&&letters.some(v=>f[0].t.vars[v]<0),up:one&&!f[0].t.type&&!f[0].ancestors.length&&f[0].side==='bottom',down:one&&!f[0].t.type&&!f[0].ancestors.length&&f[0].side==='top'&&flat(f[0].t).a.n!==0n,left:one&&f[0].index>0,right:one&&f[0].index<f[0].parent.length-1,delete:mode==='creator'&&all,reset:true};
}
export function apply(original,action,keys=[],arg,mode='creator'){
  if(!availability(original,keys,mode)[action])throw Error('Selecciona los factores adecuados para esta operación.');
  const state=structuredClone(original),f=keys.map(k=>find(state,k)),steps=[];
  let selected=[],explanation='',relation='=';
  const put=(t,list,index=list.length)=>{t.id=state.next++;list.splice(index,0,t);selected.push(String(t.id));return t;};
  if(action==='reset')return {state:empty(),selected,steps,explanation:'Pizarra reiniciada.',relation:'→'};
  if(action==='add'){
    if(!['top','bottom'].includes(arg.side))throw Error('Elige numerador o denominador.');
    if(state.top.length+state.bottom.length>=18)throw Error('Combina algunos factores antes de agregar más.');
    if(arg.side==='bottom'&&arg.term.a.n===0n)throw Error('El denominador no puede ser cero.');
    put(structuredClone(arg.term),state[arg.side]);explanation='Añadiste un factor. Esta acción construye una expresión nueva.';relation='→';
  }else if(action==='delete'){
    for(const g of f)g.parent.splice(g.parent.indexOf(g.t),1);explanation='Eliminaste la selección; cambió la construcción.';relation='→';
  }else if(action==='power'){
    const p=integer(String(arg),-9,9),children=f.sort((a,b)=>a.index-b.index).map(g=>g.t);
    const depth=t=>t.type?1+Math.max(0,...t.children.map(depth)):0;
    if(f[0].ancestors.length+Math.max(...children.map(depth))>=6)throw Error('Usa como máximo seis niveles de potencias. Evalúa un grupo antes de continuar.');
    const group={type:'power',p,children};flat(group);
    const list=f[0].parent,index=f[0].index;for(const g of f)list.splice(list.indexOf(g.t),1);
    put(group,list,index);explanation='Potencia creada sin evaluar. Elevar cambia la expresión.';relation='→';
  }else if(action==='evaluate'){
    const g=f[0],result=flat(g.t);steps.push({type:'power',before:structuredClone(g.t),result});g.parent.splice(g.index,1);put(result,g.parent,g.index);explanation='Eleva el coeficiente y multiplica cada exponente por el exponente exterior.';
  }else if(action==='left'||action==='right'){
    const g=f[0],index=g.index+(action==='left'?-1:1);g.parent.splice(g.index,1);g.parent.splice(index,0,g.t);selected=[String(g.t.id)];explanation='El orden de los factores no cambia el producto.';
  }else if(action==='up'||action==='down'){
    const g=f[0];if(g.t.type)throw Error('Evalúa primero la potencia para trasladar su resultado.');
    const result=pow(flat(g.t),-1);g.parent.splice(g.index,1);put(result,state[action==='up'?'top':'bottom']);explanation='Al cruzar la barra se invierte el coeficiente y cambia el signo de cada exponente. El valor se conserva.';
  }else if(action==='positive'){
    const g=f[0],result=structuredClone(g.t),other=unit();for(const v of letters)if(result.vars[v]<0){other.vars[v]=-result.vars[v];result.vars[v]=0;}
    g.parent.splice(g.index,1);put(result,g.parent,g.index);put(other,state[g.side==='top'?'bottom':'top']);explanation='Las variables con exponente negativo cruzan la barra con exponente positivo. El coeficiente permanece en su fila.';
  }else if(action==='cancel'){
    const a=flat(f[0].t),b=flat(f[1].t);if(a.a.n===0n||!same(a.a,b.a)||!letters.every(v=>a.vars[v]===b.vars[v]))throw Error('Para cancelar, selecciona el mismo factor no nulo arriba y abajo. Para dividir factores distintos usa Combinar.');
    steps.push({type:'cancel',before:f[0].t});for(const g of f)g.parent.splice(g.parent.indexOf(g.t),1);explanation='Un factor no nulo dividido entre sí mismo es 1. Se conservan las restricciones de las variables.';
  }else if(action==='combine'){
    const sameRow=f.every(g=>g.parent===f[0].parent),numer=f.filter(g=>sameRow||g.side==='top').map(g=>flat(g.t)),denom=sameRow?[]:f.filter(g=>g.side==='bottom').map(g=>flat(g.t));
    let result=numer.reduce((a,b)=>product(a,b),unit());result=denom.reduce((a,b)=>product(a,b,-1),result);
    if(result.a.n===0n)result.vars={x:0,y:0,z:0};
    steps.push({type:'combine',numer,denom,result});const list=sameRow?f[0].parent:state.top,index=sameRow?Math.min(...f.map(g=>g.index)):0;
    for(const g of f)g.parent.splice(g.parent.indexOf(g.t),1);put(result,list,index);explanation=denom.length?'Divide los coeficientes y resta los exponentes de cada letra.':'Multiplica los coeficientes y suma los exponentes de cada letra por separado.';
  }
  value(state);
  if(relation==='='&&!equivalent(original,state))throw Error('La operación no conserva la expresión. No se aplicó ningún cambio.');
  return {state,selected,steps,explanation,relation};
}
export function checkResult(state,original){
  if(!equivalent(state,original))return {ok:false,message:'El resultado no es equivalente a la expresión inicial.'};
  const nodes=[...state.top,...state.bottom];
  if(nodes.some(t=>t.type)||state.top.length>1||state.bottom.length>1)return {ok:false,message:'El valor es correcto. Evalúa las potencias y combina los factores que quedan.'};
  if(state.top.length&&state.bottom.length){const a=state.top[0],b=state.bottom[0];if(b.a.n!==1n||b.a.d!==1n||letters.some(v=>a.vars[v]&&b.vars[v]))return {ok:false,message:'Conservas el valor. Todavía puedes simplificar el cociente con Combinar.'};}
  return {ok:true,message:'✓ Correcto: simplificaste la expresión conservando su valor. Las variables siguen siendo distintas de cero.'};
}
export function generate(level='basic',seed=0){
  const s=empty(),n=Math.abs(seed),a=2+n%4,b=2+(n*3)%5;
  const add=(side,c,v)=>{const t=term(c,v);t.id=s.next++;s[side].push(t);return t;};
  if(level==='basic'){
    add('top',a,{x:1+n%3});add(n%2?'bottom':'top',b,{x:1+n%2});
  }else if(level==='intermediate'){
    add('top',a*b,{x:3+n%3,y:2+n%2});add('bottom',a,{x:1+n%2,y:1});add('top',n%2?-2:2,{z:1});
  }else{
    const t=add('top',n%2?-2:2,{x:2,y:1});s.top[0]={id:s.next++,type:'power',p:2+n%2,children:[t]};add('top',3,{x:1,y:2,z:1});add('bottom',6,{x:3+n%3,y:1,z:n%2});
  }
  return {state:s,label:'Simplifica la expresión'};
}
