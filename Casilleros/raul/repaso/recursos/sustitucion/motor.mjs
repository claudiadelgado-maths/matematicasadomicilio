import {simple,calc,rnd,shuffle} from '../motor.mjs';
export {rnd,shuffle};
export const num=(n,d=1,paren=false)=>({kind:'num',value:simple([n,d]),paren});
export const variable=name=>({kind:'var',name});
export const operation=(kind,left,right)=>({kind,left,right});
const x=()=>variable('x'),y=()=>variable('y'),z=()=>variable('z');
const add=(a,b)=>operation('+',a,b),sub=(a,b)=>operation('−',a,b),mul=(a,b)=>operation('×',a,b),div=(a,b)=>operation('÷',a,b),pow=(a,p)=>operation('^',a,num(p));
export function evaluate(t,values={}){if(t.kind==='num')return t.value;if(t.kind==='var'){if(!values[t.name])throw Error('Falta variable');return values[t.name];}const a=evaluate(t.left,values),b=evaluate(t.right,values);if(t.kind==='^')return simple([a[0]**b[0],a[1]**b[0]]);return calc(a,b,t.kind);}
export function substitute(t,values){if(t.kind==='var')return num(...values[t.name],true);if(t.kind==='num')return {...t};return {...t,left:substitute(t.left,values),right:substitute(t.right,values)};}
export function decimal([n,d]){let rem=Math.abs(n)%d,out=String(Math.floor(Math.abs(n)/d));if(rem){out+='.';for(let i=0;rem&&i<8;i++){rem*=10;out+=Math.floor(rem/d);rem%=d;}}return (n<0?'-':'')+out;}
export function numberTex(a,family='integer'){if(family==='decimal')return decimal(a);if(a[1]===1)return String(a[0]);return (a[0]<0?'-':'')+`\\frac{${Math.abs(a[0])}}{${a[1]}}`;}
export function tex(t,family='integer',slot){if(t.kind==='var')return slot?slot(t.name):t.name;if(t.kind==='num'){const s=numberTex(t.value,family);return t.paren?`\\left(${s}\\right)`:s;}let a=tex(t.left,family,slot),b=tex(t.right,family,slot);if(t.kind==='÷')return `\\frac{${a}}{${b}}`;if(t.kind==='^'){if(t.left.kind!=='var'&&!(t.left.kind==='num'&&t.left.paren))a=`\\left(${a}\\right)`;return `${a}^{${b}}`;}if(t.kind==='×'){if(['+','−'].includes(t.left.kind))a=`\\left(${a}\\right)`;if(['+','−'].includes(t.right.kind)||(t.right.kind==='num'&&t.right.value[0]<0&&!t.right.paren))b=`\\left(${b}\\right)`;const adjacent=t.right.kind==='var'||t.right.kind==='^'||(t.right.kind==='num'&&t.right.paren);return a+(adjacent?'':'\\cdot ')+b;}if(t.right.kind==='num'&&t.right.value[0]<0&&!t.right.paren)b=`\\left(${b}\\right)`;return `${a} ${t.kind==='−'?'-':'+'} ${b}`;}
// Reduce one ready operation. Powers precede products, then sums; the tree preserves parentheses.
export function nextStep(tree){const ready=[];function walk(t,path=[]){if(t.left){if(t.left.kind==='num'&&t.right.kind==='num')ready.push({node:t,path});walk(t.left,[...path,'left']);walk(t.right,[...path,'right']);}}walk(tree);if(!ready.length)return null;ready.sort((a,b)=>({'^':0,'×':1,'÷':1,'+':2,'−':2}[a.node.kind])-({'^':0,'×':1,'÷':1,'+':2,'−':2}[b.node.kind]));const step=ready[0],value=evaluate(step.node);function replace(t,path){if(!path.length)return num(...value);return {...t,[path[0]]:replace(t[path[0]],path.slice(1))};}return {...step,value,tree:replace(tree,step.path)};}
export function steps(tree,values){const list=[substitute(tree,values)];for(let i=0;i<20;i++){const s=nextStep(list.at(-1));if(!s)break;list.push(s.tree);}return list;}
export function readNumber(s){s=s.trim().replace(',','.');if(!/^-?\d+(?:\.\d{1,6})?$/.test(s))return null;const places=(s.split('.')[1]||'').length,n=Number(s.replace('.',''));if(!Number.isSafeInteger(n)||Math.abs(n)>1000000)return null;return simple([n,10**places]);}
export function generate(lesson,round=1){let a=rnd(2,5),b=rnd(1,8),v=rnd(2,7),family='integer',values={x:[v,1]},tree=add(mul(num(a),x()),num(b)),label='';
 switch(lesson){
 case 'sustitucion': {const k=(round-1)%4;tree=k===0?add(x(),num(b)):k===1?mul(num(a),x()):k===2?sub(mul(num(a),x()),num(b)):add(num(b),mul(num(a),x()));break;}
 case 'construir-sustitucion':break;
 case 'negativos':values.x=[-rnd(2,6),1];tree=add(mul(num(a),pow(x(),2)),num(b));break;
 case 'variable-repetida':values.x=[rnd(2,5),1];tree=add(sub(mul(num(a),pow(x(),2)),mul(num(rnd(2,5)),x())),num(b));break;
 case 'varias-variables':values={x:[rnd(2,6),1],y:[rnd(2,6),1],z:[rnd(1,5),1]};tree=round%2?add(mul(num(a),x()),mul(y(),z())):add(sub(mul(num(a),x()),mul(num(2),y())),z());break;
 case 'sustitucion-fracciones':{family='fraction';const d=[2,3,4,6][rnd(0,3)];values.x=simple([rnd(1,d-1),d]);tree=add(mul(num(a),x()),num(1,[2,3,4][rnd(0,2)]));break;}
 case 'decimales':family='decimal';values.x=[rnd(11,29),10];break;
 case 'exponentes':values={x:[rnd(2,4)*(round%3===0?-1:1),1],y:[rnd(2,3)*(round%2===0?-1:1),1]};tree=add(mul(num(a),pow(x(),2)),pow(y(),3));break;
 case 'formulas':{const k=(round-1)%4;values=k===0?{b:[rnd(2,8),1],h:[rnd(2,6),1]}:k===1?{q:[rnd(2,8)*4,1],t:[4,1]}:{a:[rnd(2,5),1],b:[rnd(2,5),1],c:[rnd(1,6),1]};label=k===0?'A':k===1?'I':'P';tree=k===0?mul(variable('b'),variable('h')):k===1?div(variable('q'),variable('t')):k===2?add(mul(variable('a'),variable('b')),variable('c')):sub(pow(variable('a'),2),div(mul(variable('b'),variable('c')),variable('b')));break;}
 case 'orden':tree=add(mul(num(a),pow(x(),2)),num(b));break;
 case 'errores':values.x=[-rnd(2,5),1];tree=add(mul(num(a),pow(x(),2)),num(b));break;
 case 'reto-sustitucion':{const source=['varias-variables','sustitucion-fracciones','decimales','exponentes','formulas','variable-repetida','negativos'][rnd(0,6)];return {...generate(source,round),source};}
 }
return {tree,values,family,label};}
