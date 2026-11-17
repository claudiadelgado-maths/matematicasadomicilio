// Racionales exactos para conservar π y fracciones en las coordenadas escolares.
const abs = n => n < 0n ? -n : n;
const gcd = (a, b) => { a=abs(a); b=abs(b); while(b) [a,b]=[b,a%b]; return a; };
export function q(n, d=1n) {
  if (!d) throw new Error('El denominador no puede ser cero.');
  const g=gcd(n,d), sign=d<0n?-1n:1n;
  return {n:sign*n/g,d:sign*d/g};
}
const zero=()=>q(0n);
const add=(a,b)=>q(a.n*b.d+b.n*a.d,a.d*b.d);
const mul=(a,b)=>q(a.n*b.n,a.d*b.d);
const divide=(a,b)=>q(a.n*b.d,a.d*b.n);
const negative=a=>q(-a.n,a.d);
export const numberOf=a=>Number(a.n)/Number(a.d);
export const texQ=a=>a.d===1n?String(a.n):`${a.n<0n?'-':''}\\frac{${abs(a.n)}}{${a.d}}`;
function decimal(s) {
  const [whole,part='']=s.split('.');
  const sign=s.startsWith('-')?-1n:1n;
  return q(sign*BigInt(whole.replace(/[+-]/g,'')+part),10n**BigInt(part.length));
}
export function parseValue(text, allowPi=false) {
  const s=String(text).trim().toLowerCase().replace(/π/g,'pi').replace(/−/g,'-').replace(/,/g,'.').replace(/\s/g,'');
  if (!s || s.length>40) throw new Error('Completa el valor con un número o una fracción.');
  const pi=s.includes('pi');
  if (pi && !allowPi) throw new Error('Usa un número o una fracción; π se admite en C.');
  let clean=s;
  if (pi) {
    if (!/^[+-]?(?:(?:\d+(?:\.\d*)?|\.\d+)\*?)?pi(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s)) throw new Error('Para C puedes escribir pi, -pi/2 o 3pi/4.');
    clean=s.replace('*','').replace('pi','');
    if (/^[+-]?(?:\/|$)/.test(clean)) clean=clean.replace(/^([+-]?)/,(_,sign)=>`${sign}1`);
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(clean)) throw new Error('Usa un número o una fracción, por ejemplo -2 o 1/2.');
  const pieces=clean.split('/');
  const coefficient=pieces.length===2?divide(decimal(pieces[0]),decimal(pieces[1])):decimal(clean);
  const value=numberOf(coefficient)*(pi?Math.PI:1);
  if (!Number.isFinite(value) || Math.abs(value)>1e6 || (value!==0 && Math.abs(value)<1e-6)) throw new Error('Usa valores entre −1 000 000 y 1 000 000; el menor valor no nulo admitido es 0.000001.');
  return {coefficient,pi,value};
}
export function texPi(a) {
  if (!a.n) return '0';
  const numerator=`${abs(a.n)===1n?'':abs(a.n)}\\pi`;
  return `${a.n<0n?'-':''}${a.d===1n?numerator:`\\frac{${numerator}}{${a.d}}`}`;
}
export function texX(x) {
  if (!x.base.n) return texPi(x.pi);
  if (!x.pi.n) return texQ(x.base);
  return `${texQ(x.base)}${x.pi.n>0n?'+':''}${texPi(x.pi)}`;
}
const cardinal=(coefficient,kind)=>{
  const twice=mul(coefficient,q(2n));
  if(twice.d!==1n) return null;
  const i=Number((twice.n%4n+4n)%4n);
  return kind==='sin'?[0,1,0,-1][i]:[1,0,-1,0][i];
};
export function buildModel(kind, values) {
  if(!['sin','cos'].includes(kind)) throw new Error('Elige seno o coseno.');
  const a=values.A.coefficient,b=values.B.coefficient,k=values.K.coefficient,c=values.C;
  const A=numberOf(a),B=numberOf(b),K=numberOf(k);
  const phaseTex=c.pi?texPi(c.coefficient):texQ(c.coefficient);
  const coefficientTex=value=>value.n===value.d?'':value.n===-value.d?'-':texQ(value);
  const argument=b.n?`${coefficientTex(b)}x${c.coefficient.n?`${c.coefficient.n>0n?'+':''}${phaseTex}`:''}`:phaseTex;
  const formula=`f(x)=${coefficientTex(a)}\\${kind}\\left(${argument}\\right)${k.n?`${k.n>0n?'+':''}${texQ(k)}`:''}`;
  if (!a.n || !b.n) {
    const exactTrig=c.pi?cardinal(c.coefficient,kind):(c.value===0?(kind==='sin'?0:1):null);
    const exact=!a.n?k:(exactTrig===null?null:add(k,mul(a,q(BigInt(exactTrig)))));
    const height=exact?numberOf(exact):K+A*Math[kind](c.value);
    const heightTex=exact?texQ(exact):`${texQ(k)}+\\left(${texQ(a)}\\right)\\${kind}\\left(${phaseTex}\\right)`;
    return {kind,constant:true,formula,height,heightTex,exact:!!exact,points:[],A,B,K};
  }
  const amplitude=q(abs(a.n),a.d),absB=q(abs(b.n),b.d);
  const startCoefficient=negative(divide(c.coefficient,b));
  const start={base:c.pi?zero():startCoefficient,pi:c.pi?startCoefficient:zero()};
  const period=divide(q(2n),absB),step=divide(q(1n),mul(q(2n),absB));
  const minimum=add(k,negative(amplitude)),maximum=add(k,amplitude);
  // Al avanzar hacia la derecha, B negativo invierte la fase del seno.
  const direction=kind==='sin'?Math.sign(A)*Math.sign(B):Math.sign(A);
  const units=kind==='sin'?[0,direction,0,-direction,0]:[direction,0,-direction,0,direction];
  const points=units.map((unit,z)=>{
    const x={base:start.base,pi:add(start.pi,mul(q(BigInt(z)),step))};
    return {z,x,xTex:texX(x),y:add(k,mul(amplitude,q(BigInt(unit)))),unit,role:unit===0?'Medio':unit===1?'Máximo':'Mínimo'};
  });
  return {kind,constant:false,formula,A,B,K,midline:k,start,amplitude,minimum,maximum,period,step,points,direction,
    // Se evalúa en coordenadas de ciclo para evitar cancelar B*x0+C.
    valueAtCycle:u=>K+A*Math[kind](Math.sign(B)*2*Math.PI*u)};
}
