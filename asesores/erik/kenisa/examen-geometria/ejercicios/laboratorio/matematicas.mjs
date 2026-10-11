// Analizador limitado a expresiones matemáticas. Nunca evalúa código JavaScript.
const SIMBOLOS = { pi:'π', L1:'L₁', L2:'L₂', Ln:'Lₙ', resto:'…' };
const TEXTOS = { sumaLados:'La suma de todos sus lados', E:'ángulo exterior' };
const VARIABLES = new Set(['A','P','B','b','h','L','r','a','N','d','D','C','E','I','S','x','pi','L1','L2','Ln','resto','sumaLados']);
export function analizar(texto) {
  const s=String(texto).replace(/la\s+suma\s+de\s+todos\s+sus\s+lados/gi,'sumaLados').replace(/[áa]ngulo\s+exterior/gi,'E').replaceAll('π','pi').replace(/[×·]/g,'*').replace(/[÷]/g,'/').replace(/[−–]/g,'-').replaceAll('²','^2').replaceAll('³','^3').replaceAll('L₁','L1').replaceAll('L₂','L2').replaceAll('Lₙ','Ln').replaceAll('…','resto').replaceAll(',','.').replace(/\s/g,'');
  if(!s||s.length>240)throw Error('Completa la expresión antes de comprobar.');
  const tokens=s.match(/sumaLados|resto|pi|[Ll][12n]|\d+(?:\.\d+)?|[A-Za-z]|[()+\-*/^]/g)||[];
  if(tokens.join('')!==s||tokens.length>100)throw Error('Usa solo números, letras de la fórmula y operaciones.');
  let i=0,depth=0;
  const take=()=>tokens[i++];
  function atom(){
    if(++depth>20)throw Error('La expresión tiene demasiados niveles.');
    let t=take(),v;
    if(t==='('){v=sum();if(take()!==')')throw Error('Falta cerrar un paréntesis.');}
    else if(/^\d/.test(t||'')){if(Number(t)>1000000||t.length>24)throw Error('Usa números de hasta un millón y fracciones para valores exactos.');v={t:'num',v:Number(t),raw:t};}
    else {t=t==='n'?'N':t==='l'?'L':t?.replace(/^l/,'L');if(!VARIABLES.has(t))throw Error('Falta un número o una letra válida.');v={t:'var',v:t};}
    depth--;return v;
  }
  function power(){let a=atom();if(tokens[i]==='^'){take();a={t:'op',op:'^',a,b:unary()};}return a;}
  function unary(){if(tokens[i]==='+'){take();return unary();}if(tokens[i]==='-'){take();return {t:'op',op:'*',a:{t:'num',v:-1},b:unary()};}return power();}
  function product(){let a=unary();while(i<tokens.length){const t=tokens[i];if(t==='*'||t==='/'){take();a={t:'op',op:t,a,b:unary()};}else if(t==='('||/^[A-Za-z\d]/.test(t)){a={t:'op',op:'*',a,b:unary()};}else break;}return a;}
  function sum(){let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=take();a={t:'op',op,a,b:product()};}return a;}
  const ast=sum();if(i!==tokens.length)throw Error('Revisa los paréntesis y las operaciones.');return ast;
}
const poly=(v,k='')=>{v=BigInt(v);return new Map(v===0n?[]:[[k,v]]);};
function add(a,b,sign=1){const r=new Map(a);for(const [k,v]of b){const n=(r.get(k)||0n)+BigInt(sign)*v;if(n===0n)r.delete(k);else r.set(k,n);}return r;}
function mul(a,b){const r=new Map();for(const [ka,va]of a)for(const [kb,vb]of b){const key=[...ka.split('*'),...kb.split('*')].filter(Boolean).sort().join('*');if(key.split('*').length>16)throw Error('Ese exponente es demasiado grande.');const n=(r.get(key)||0n)+va*vb;if(n>10n**100n||n<-(10n**100n))throw Error('La expresión es demasiado grande.');if(n===0n)r.delete(key);else r.set(key,n);}if(r.size>128)throw Error('Simplifica la expresión.');return r;}
function racional(ast){
  if(ast.t==='num'){const raw=ast.raw??String(ast.v),decimales=raw.split('.')[1]?.length||0;return {n:poly(raw.replace('.','')),d:poly(10n**BigInt(decimales))};}
  if(ast.t==='var')return {n:poly(1,ast.v),d:poly(1)};
  const a=racional(ast.a),b=racional(ast.b);
  if(ast.op==='+')return {n:add(mul(a.n,b.d),mul(b.n,a.d)),d:mul(a.d,b.d)};
  if(ast.op==='-')return {n:add(mul(a.n,b.d),mul(b.n,a.d),-1),d:mul(a.d,b.d)};
  if(ast.op==='*')return {n:mul(a.n,b.n),d:mul(a.d,b.d)};
  if(ast.op==='/'){if(!b.n.size)throw Error('El denominador no puede ser cero.');return {n:mul(a.n,b.d),d:mul(a.d,b.n)};}
  if([...b.n.keys(),...b.d.keys()].some(k=>k))throw Error('El exponente debe ser un número entero de 0 a 4.');
  const en=b.n.get('')||0n,ed=b.d.get('')||0n;
  if(ed===0n||en%ed!==0n||en/ed<0n||en/ed>4n)throw Error('El exponente debe ser un número entero de 0 a 4.');
  const exp=Number(en/ed);
  let r={n:poly(1),d:poly(1)};for(let j=0;j<exp;j++)r={n:mul(r.n,a.n),d:mul(r.d,a.d)};return r;
}
export function variables(ast){return ast.t==='var'?[ast.v]:ast.t==='num'?[]:[...new Set([...variables(ast.a),...variables(ast.b)])];}
export function comprobar(texto,esperado,{numerico=false}={}){
  try{const ast=analizar(texto),ref=analizar(esperado),vars=variables(ast);if(numerico&&vars.some(v=>v!=='pi'))return {valida:false,correcta:false,mensaje:'Sustituye las letras por sus valores. Solo π puede quedarse como símbolo.'};
    const a=racional(ast),b=racional(ref);const diff=add(mul(a.n,b.d),mul(b.n,a.d),-1);
    return {valida:true,correcta:diff.size===0,mensaje:diff.size?'Revisa las operaciones y vuelve a intentarlo.':'¡Correcto!'};
  }catch(e){return {valida:false,correcta:false,mensaje:e.message};}
}
export function calcular(texto,datos={}){const visit=n=>{if(n.t==='num')return n.v;if(n.t==='var'){const v=n.v==='pi'?Math.PI:datos[n.v];if(!Number.isFinite(v))throw Error('Dato ausente: '+n.v);return v;}const a=visit(n.a),b=visit(n.b);return n.op==='+'?a+b:n.op==='-'?a-b:n.op==='*'?a*b:n.op==='/'?a/b:a**b;};return visit(analizar(texto));}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function mml(n){
  if(n.t==='num')return `<mn>${n.v}</mn>`;
  if(n.t==='var'){if(TEXTOS[n.v])return `<mtext>${esc(TEXTOS[n.v])}</mtext>`;if(/^L[12n]$/.test(n.v))return `<msub><mi>L</mi><mi>${n.v.slice(1)}</mi></msub>`;return `<mi>${esc(SIMBOLOS[n.v]||n.v)}</mi>`;}
  if(n.op==='/')return `<mfrac><mrow>${mml(n.a)}</mrow><mrow>${mml(n.b)}</mrow></mfrac>`;
  const grouped=a=>a.t==='op'&&['+','-'].includes(a.op)?`<mrow><mo>(</mo>${mml(a)}<mo>)</mo></mrow>`:mml(a);
  if(n.op==='^')return `<msup><mrow>${n.a.t==='op'?`<mo>(</mo>${mml(n.a)}<mo>)</mo>`:mml(n.a)}</mrow>${mml(n.b)}</msup>`;
  return `<mrow>${grouped(n.a)}<mo>${n.op==='*'?'·':n.op==='-'?'−':'+'}</mo>${grouped(n.b)}</mrow>`;
}
export function formulaHTML(expr,lhs=''){
  return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="${esc((lhs?lhs+' = ':'')+expr.replaceAll('pi','π'))}"><mrow>${lhs?`<mi>${esc(lhs)}</mi><mo>=</mo>`:''}${mml(analizar(expr))}</mrow></math>`;
}
