import {mono,mt,tex,product,powM,ordered} from './algebra.mjs';

// Secuencia didáctica: el término añadido se compensa antes de reconocer el cuadrado.
export function completionSteps(r){
 const {PP,QQ,PQ,missing,P,Q}=r.data;
 return [
  {text:'Completa el doble producto y resta lo que añadiste.',tex:`${tex([powM(P,4),mono(2*missing.c,missing.p),powM(Q,4)])}-${mt(missing)}`},
  {text:'Reconoce el cuadrado perfecto y el cuadrado que se resta.',tex:`(${mt(PP)}+${mt(QQ)})^{2}-(${mt(PQ)})^{2}`},
  {text:'Forma los dos factores conjugados.',tex:`(${mt(PP)}+${mt(QQ)}-${mt(PQ)})(${mt(PP)}+${mt(QQ)}+${mt(PQ)})`},
  {text:'Ordena los términos de cada factor.',tex:product(r.factors.map(ordered))}
 ];
}

export function coefficientResult(d,values,general){
 const {m=1,p=1,n,q}=values;
 if([m,p,n,q].some(v=>!Number.isInteger(v)||Math.abs(v)>99))return null;
 return {first:m*p,last:n*q,crossA:m*q,crossB:p*n,sum:m*q+p*n,
  valid:(!general||m*p===d.a)&&n*q===d.c&&m*q+p*n===d.b,
  factors:[[mono(m,d.X.p),mono(n,d.Z.p)],[mono(p,d.X.p),mono(q,d.Z.p)]]};
}
