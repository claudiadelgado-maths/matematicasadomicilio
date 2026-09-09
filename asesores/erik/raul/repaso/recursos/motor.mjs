export const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
export const lcm=(a,b)=>a*b/gcd(a,b);
export const simple=([n,d])=>{if(!d)throw Error('Denominador cero');const g=gcd(n,d);return [n/g*Math.sign(d),Math.abs(d/g)];};
export const equal=(a,b)=>a[0]*b[1]===b[0]*a[1];
export const calc=(a,b,op)=>simple(op==='+'?[a[0]*b[1]+b[0]*a[1],a[1]*b[1]]:op==='−'?[a[0]*b[1]-b[0]*a[1],a[1]*b[1]]:op==='×'?[a[0]*b[0],a[1]*b[1]]:[a[0]*b[1],a[1]*b[0]]);
export const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
export const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
export const fraction=()=>{const d=rnd(2,9);return [rnd(1,d-1),d];};
