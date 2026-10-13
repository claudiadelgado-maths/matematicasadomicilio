const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;};
export function R(n,d=1){n=BigInt(n);d=BigInt(d);if(!d)throw new RangeError('Denominador cero');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
export const add=(a,b)=>R(a.n*b.d+b.n*a.d,a.d*b.d);
export const neg=a=>R(-a.n,a.d);
export const sub=(a,b)=>add(a,neg(b));
export const mul=(a,b)=>R(a.n*b.n,a.d*b.d);
export const div=(a,b)=>R(a.n*b.d,a.d*b.n);
export const pow=(a,n)=>n<0?pow(div(R(1),a),-n):R(a.n**BigInt(n),a.d**BigInt(n));
export const eq=(a,b)=>a.n===b.n&&a.d===b.d;
export const num=a=>Number(a.n)/Number(a.d);
export const str=a=>a.d===1n?String(a.n):`${a.n}/${a.d}`;
export const tex=a=>a.d===1n?String(a.n):`${a.n<0n?'-':''}\\frac{${a.n<0n?-a.n:a.n}}{${a.d}}`;
export function parse(raw){
  if(typeof raw!=='string'||raw.length>60)return null;
  const s=raw.trim().replace(/−/g,'-');
  try{
    if(/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(s)){const [a,b]=s.split('/');return R(a.trim(),b.trim());}
    if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(s))return null;
    const t=s.replace(',','.'),places=t.includes('.')?t.split('.')[1].length:0;
    return R(t.replace('.',''),10n**BigInt(places));
  }catch{return null;}
}
export function acepta(expected,raw){const actual=parse(raw);return actual!==null&&eq(expected,actual);}
