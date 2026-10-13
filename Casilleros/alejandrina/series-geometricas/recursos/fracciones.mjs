const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;};
export function fraction(p,q=1n){p=BigInt(p);q=BigInt(q);if(q===0n)throw Error('El denominador no puede ser cero.');if(q<0n){p=-p;q=-q;}const d=gcd(p,q);return {p:p/d,q:q/d};}
export const multiply=(a,b)=>fraction(a.p*b.p,a.q*b.q);
export const fractionTex=({p,q})=>q===1n?String(p):`${p<0n?'-':''}\\frac{${p<0n?-p:p}}{${q}}`;
export function numberFraction(n){
  if(!Number.isFinite(n))throw Error('Número no finito');
  if(Number.isSafeInteger(n))return fraction(BigInt(n));
  const sign=n<0?-1n:1n,target=Math.abs(n);let x=target,h0=0,h1=1,k0=1,k1=0;
  for(let i=0;i<60;i++){
    const a=Math.floor(x),h=a*h1+h0,k=a*k1+k0;
    if(!Number.isSafeInteger(h)||!Number.isSafeInteger(k)||k>1e12)break;
    if(Math.abs(h/k-target)<=target*1e-13)return fraction(sign*BigInt(h),BigInt(k));
    [h0,h1,k0,k1]=[h1,h,k1,k];x=1/(x-a);if(!Number.isFinite(x))break;
  }
  const [mantissa,exponent='0']=String(n).split('e');const decimals=(mantissa.split('.')[1]||'').length;
  const digits=BigInt(mantissa.replace('.','')),scale=decimals-Number(exponent);
  return scale>=0?fraction(digits,10n**BigInt(scale)):fraction(digits*10n**BigInt(-scale));
}
export function fractionSequence(a,r,n){const list=[a];for(let i=1;i<n;i++)list.push(multiply(list.at(-1),r));return list;}
