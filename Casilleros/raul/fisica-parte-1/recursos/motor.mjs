export const prefixes=[['yotta','Y',24],['zetta','Z',21],['exa','E',18],['peta','P',15],['tera','T',12],['giga','G',9],['mega','M',6],['kilo','k',3],['hecto','h',2],['deca','da',1],['sin prefijo','',0],['deci','d',-1],['centi','c',-2],['mili','m',-3],['micro','μ',-6],['nano','n',-9],['pico','p',-12],['femto','f',-15],['atto','a',-18],['zepto','z',-21],['yocto','y',-24]].map(([name,symbol,exponent])=>({name,symbol,exponent,id:String(exponent)}));
export const magnitudes=[['voltaje','Voltaje','V','volt','V'],['corriente','Corriente eléctrica','I','ampere','A'],['carga','Carga eléctrica','q','coulomb','C'],['tiempo','Tiempo','t','segundo','s'],['resistencia','Resistencia','R','ohm','Ω'],['potencia','Potencia','P','watt','W'],['frecuencia','Frecuencia','f','hertz','Hz'],['capacitancia','Capacitancia','C','farad','F'],['inductancia','Inductancia','L','henry','H']].map(([id,name,symbol,unit,unitSymbol])=>({id,name,symbol,unit,unitSymbol}));
export const integer=(min,max)=>min+Math.floor(Math.random()*(max-min+1));
export function shuffle(array){const a=[...array];for(let i=a.length-1;i>0;i--){const j=integer(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function prefixPair(){const common=prefixes.filter(p=>[6,3,0,-3,-6,-9,-12].includes(p.exponent));const pool=Math.random()<.75?common:prefixes;return shuffle(pool).slice(0,2);}
export function decimalPower(e){return e>=0?'1'+'0'.repeat(e):'0.'+'0'.repeat(-e-1)+'1';}
export function compactPower(e){return e===0?'1':e===-1?'0.1':e>0?`1 [${e} ceros]`:`0. [${-e-1} ceros] 1`;}
export function spacedDecimal(text){const [a,b]=text.split('.');return a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b?'.'+b.match(/.{1,3}/g).join(' '):'');}
const pow=n=>10n**BigInt(n);
const gcd=(a,b)=>{a=a<0n?-a:a;while(b){[a,b]=[b,a%b];}return a||1n;};
export function rational(n,d=1n){if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
export function parseDecimal(text){
  const value=String(text).trim().replace(',','.');
  const match=/^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d{1,2}))?$/.exec(value);
  if(!match||value.length>60||Math.abs(Number(match[3]||0))>60)throw new Error('Escribe un número válido; puedes usar punto o coma decimal y notación como 1.5e-3.');
  const [whole,fraction='']=match[2].split('.');let n=BigInt((whole||'0')+fraction)*(match[1]==='-'?-1n:1n),d=pow(fraction.length);
  const exp=Number(match[3]||0);if(exp>=0)n*=pow(exp);else d*=pow(-exp);return rational(n,d);
}
function factor(id){if(id==='min')return {n:60n,d:1n};const p=prefixes.find(p=>p.id===String(id));if(!p)throw new Error('Prefijo desconocido.');return p.exponent>=0?{n:pow(p.exponent),d:1n}:{n:1n,d:pow(-p.exponent)};}
export function convert(value,from,to,magnitude){
  if(!magnitudes.some(m=>m.id===magnitude))throw new Error('Selecciona una magnitud.');
  if((from==='min'||to==='min')&&magnitude!=='tiempo')throw new Error('Los minutos solo se usan para tiempo.');
  const a=typeof value==='string'?parseDecimal(value):value,f=factor(from),t=factor(to);
  return rational(a.n*f.n*t.d,a.d*f.d*t.n);
}
export function decimal({n,d}){
  const negative=n<0n;n=negative?-n:n;const whole=n/d;let rem=n%d,out=String(whole),digits='',significant=whole?String(whole).length:0;
  let denominator=d;while(denominator%2n===0n)denominator/=2n;while(denominator%5n===0n)denominator/=5n;
  const finite=denominator===1n;
  while(rem && digits.length<220 && (finite||significant<24)){rem*=10n;const digit=rem/d;digits+=digit;rem%=d;if(digit!==0n||significant)significant++;}
  if(digits)out+='.'+digits;return {text:(negative&&n!==0n?'-':'')+out,approx:rem!==0n};
}
export function scientific(value){
  if(value.n===0n)return {tex:'0',approx:false};
  let n=value.n<0n?-value.n:value.n,d=value.d,e=String(n).length-String(d).length;
  if(e>=0){if(n<d*pow(e))e--;}else if(n*pow(-e)<d)e--;
  const shift=15-e;const numerator=shift>=0?n*pow(shift):n,denominator=shift>=0?d:d*pow(-shift);
  let scaled=numerator/denominator,rem=numerator%denominator;if(rem*2n>=denominator)scaled++;
  if(String(scaled).length>16){scaled/=10n;e++;}
  let digits=String(scaled).padStart(16,'0');const tail=digits.slice(1).replace(/0+$/,'');
  return {tex:`${value.n<0n?'-':''}${digits[0]}${tail?'.'+tail:''}\\times10^{${e}}`,approx:rem!==0n};
}
export function equal(a,b){return a.n*b.d===b.n*a.d;}
export function unitLabel(magnitude,id){const m=magnitudes.find(m=>m.id===magnitude);return id==='min'?'min':prefixes.find(p=>p.id===String(id)).symbol+m.unitSymbol;}
export function voltageRound(){const target=integer(1,200)/2,from=shuffle(['0','3','-3'])[0];return {target,from,amount:decimal(convert(String(target),'0',from,'voltaje')).text};}
export function timeRound(){const types=[['min','0'],['0','min'],['-3','0'],['-6','0']], [from,to]=types[integer(0,3)];const amount=from==='0'?String(integer(1,15)*60):from==='-6'?String(integer(1,999)/10):String(integer(1,120));return {from,to,amount,answer:convert(amount,from,to,'tiempo')};}
export function capacitorRound(){const values=shuffle([2,5,10,22,47,100,220,470,1000,2200]).slice(0,4).map(n=>({nano:n,from:shuffle(['-6','-9','-12'])[0]}));return {ascending:Math.random()<.5,values:values.map((v,id)=>({...v,id,amount:decimal(convert(String(v.nano),'-9',v.from,'capacitancia')).text}))};}
export function wordGrid(){
  const words=['HENRY','BOBINA','INDUCTOR'],size=8,grid=Array.from({length:size},()=>Array(size).fill('')),placements=[];
  // Separate rows/columns ensure bounded generation and unambiguous target paths.
  const rows=shuffle(Array.from({length:size},(_,i)=>i)),vertical=Math.random()<.5;
  words.forEach((word,i)=>{const start=integer(0,size-word.length),reverse=Math.random()<.5;const cells=[];
    [...word].forEach((letter,j)=>{const pos=start+(reverse?word.length-1-j:j),r=vertical?pos:rows[i],c=vertical?rows[i]:pos;grid[r][c]=letter;cells.push(r*size+c);});placements.push({word,cells});});
  return {grid:grid.flat().map(c=>c||'ABCDEFGHILMNOPRSTUV'[integer(0,17)]),placements,size};
}
