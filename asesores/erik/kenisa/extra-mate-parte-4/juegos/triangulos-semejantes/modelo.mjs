import {fr,mul,div,valor,texto,iguales,leerRespuesta,LADOS,BASES,ANGULOS,mezclar,puntosLados,puntosAngulos,angulosDe,triangulo,ladoNombre,marcarLado,marcarAngulo,copiaEscalada,elegir,entero,expresion,crearMotor} from '../../recursos/matematicas-triangulos.mjs?v=20261009-2';
export {fr,mul,div,valor,texto,iguales,leerRespuesta,LADOS,BASES,ANGULOS,mezclar,puntosLados,puntosAngulos,angulosDe,triangulo,ladoNombre,marcarLado,marcarAngulo,copiaEscalada,elegir,entero,expresion,crearMotor};
const RAZONES=[fr(2),fr(3),fr(1,2),fr(3,2),fr(2,3)];
export const CASOS={
 decide:[['aa','AA · dos ángulos'],['lal','LAL · ángulo comprendido'],['lll','LLL · tres lados'],['no-angulos','No semejantes · ángulos'],['no-lados','No semejantes · lados']],
 encuentra:[['lado-entero','Un lado · resultado entero'],['lado-fraccion','Un lado · resultado fracción'],['varios-lados','Completar tres lados'],['angulo','Un ángulo correspondiente'],['tres-angulos','Completar tres ángulos']],
 ecuacion:[['x-suma','Un lado: x + un número'],['x-multiplo','Un lado: un múltiplo de x'],['x-lineal','Un lado: ax + b'],['x-ambos','x en dos lados correspondientes'],['x-angulo','x en un ángulo']]
};
export const OPCIONES=[['AA','Sí, por AA'],['LAL','Sí, por LAL'],['LLL','Sí, por LLL'],['NO','No son semejantes']];
function nuevaBase(modo,tipo,orientacion,r){
 // La escala es común a los tres lados para conservar una base válida.
 const unidad=entero(1,3,r),lados=elegir(BASES,r).map(v=>fr(v*unidad));
 const p=puntosLados(lados),k=elegir(RAZONES,r);
 return {modo,tipo,orientacion,triangulos:[triangulo(['A','B','C'],p,'alineados',r),triangulo(['X','Y','Z'],copiaEscalada(p,k),orientacion,r)],lados,k,pregunta:'',contexto:'',pista:'',pasos:[],campos:[],respuesta:null,resuelta:false,intentos:0,descartadas:[],nota:'',datos:[]};
}
export function crearPregunta(modo,tipo,orientacion='alineados',r=Math.random){
 if(!CASOS[modo]?.some(([id])=>id===tipo)||!['alineados','girados','reflejados','variados'].includes(orientacion))throw new RangeError('Caso desconocido');
 const q=nuevaBase(modo,tipo,orientacion,r),[a,b]=q.triangulos;
 const sustituirAngulos=(ang,k=q.k)=>{a.puntos=puntosAngulos(ang);b.puntos=copiaEscalada(a.puntos,k);q.angulos=ang;};
 const campo=(id,etiqueta,respuesta,unidad)=>q.campos.push({id,etiqueta,respuesta,unidad});
 const par=(i)=>`${ladoNombre(a,i)} ↔ ${ladoNombre(b,i)}`;
 if(modo==='decide'){
  q.pregunta='¿Son semejantes? ¿Qué datos lo demuestran?';q.contexto='Elige el criterio que puedes justificar con los datos marcados. La apariencia no es una prueba.';
  q.respuesta=tipo.startsWith('no-')?'NO':tipo.toUpperCase();
  if(tipo==='aa'||tipo==='no-angulos'){
   const ang=elegir(ANGULOS,r);sustituirAngulos(ang);
   const otra=tipo==='aa'?ang:elegir(ANGULOS.filter(v=>[...v].sort((a,b)=>a-b).join()!==[...ang].sort((a,b)=>a-b).join()),r);
   b.puntos=copiaEscalada(puntosAngulos(otra),q.k);q.angulosOtra=otra;
   for(const i of [0,1]){marcarAngulo(a,i,ang[i]);marcarAngulo(b,i,otra[i]);}
   q.pista='Dos ángulos determinan el tercero porque los tres suman 180°. Compara los ángulos, incluso si la figura está girada.';
   q.pasos=tipo==='aa'?[`∠A = ∠X = ${ang[0]}° y ∠B = ∠Y = ${ang[1]}°.`,`Dos pares de ángulos iguales permiten usar AA. El tercer par mide ${ang[2]}°.`]:[`ABC tiene ángulos ${ang.join('°, ')}°.`,`XYZ tiene ángulos ${otra.join('°, ')}°.`,`Los conjuntos de ángulos son distintos; no existe una correspondencia que los iguale. No son semejantes.`];
  }
  if(tipo==='lal'){
   const ab=entero(3,7,r),ac=ab+entero(1,4,r),deg=elegir([40,50,60,70,80,90],r),rad=deg*Math.PI/180;
   a.puntos=[{x:0,y:0},{x:ab,y:0},{x:ac*Math.cos(rad),y:ac*Math.sin(rad)}];b.puntos=copiaEscalada(a.puntos,q.k);
   q.ladosSAS=[fr(ab),fr(ac)];q.anguloSAS=deg;
   marcarLado(a,0,fr(ab));marcarLado(a,2,fr(ac));marcarLado(b,0,mul(fr(ab),q.k));marcarLado(b,2,mul(fr(ac),q.k));marcarAngulo(a,0,deg);marcarAngulo(b,0,deg);
   q.pista='El ángulo dado está entre los dos lados conocidos. Comprueba que ambos pares se multiplican por el mismo número.';
   q.pasos=[`XY / AB = ${texto(mul(fr(ab),q.k))} / ${ab} = ${texto(q.k)}.`,`XZ / AC = ${texto(mul(fr(ac),q.k))} / ${ac} = ${texto(q.k)}.`,`El ángulo comprendido coincide: ${deg}°. Por tanto, son semejantes por LAL.`];
  }
  if(tipo==='lll'||tipo==='no-lados'){
   let otros=q.lados.map(l=>mul(l,q.k));
   if(tipo==='no-lados'){
    const normal=q.lados.map(valor).sort((a,b)=>a-b),opciones=BASES.filter(v=>{v=[...v].sort((a,b)=>a-b);return Math.abs(v[0]/normal[0]-v[2]/normal[2])>1e-8||Math.abs(v[1]/normal[1]-v[2]/normal[2])>1e-8;});
    otros=elegir(opciones,r).map(v=>fr(v*2));b.puntos=puntosLados(otros);
   }
   q.otrosLados=otros;
   for(let i=0;i<3;i++){marcarLado(a,i,q.lados[i]);marcarLado(b,i,otros[i]);}
   q.pista='Compara los tres pares: corto con corto, mediano con mediano y largo con largo. La razón debe coincidir en los tres.';
   q.pasos=tipo==='lll'?['Los tres pares de lados guardan la misma proporción.',...LADOS.map((_,i)=>`${ladoNombre(b,i)} / ${ladoNombre(a,i)} = ${texto(otros[i])} / ${texto(q.lados[i])} = ${texto(q.k)}.`),'Son semejantes por LLL.']:['Compara corto con corto, mediano con mediano y largo con largo.',...LADOS.map((_,i)=>`${ladoNombre(b,i)} / ${ladoNombre(a,i)} = ${texto(otros[i])} / ${texto(q.lados[i])} = ${texto(div(otros[i],q.lados[i]))}.`),'Las tres razones no coinciden. Estos triángulos no son semejantes.'];
  }
  return q;
 }
 q.contexto='Sabemos que △ABC ∼ △XYZ. El orden indica A ↔ X, B ↔ Y y C ↔ Z.';
 if(tipo==='angulo'||tipo==='tres-angulos'||tipo==='x-angulo'){
  const ang=elegir(ANGULOS,r);sustituirAngulos(ang);const target=entero(0,2,r);
  if(tipo==='angulo'){
   q.pregunta='Encuentra el ángulo señalado.';marcarAngulo(a,target,ang[target]);marcarAngulo(b,target,'?',{objetivo:true});
   campo('angulo',`∠${b.nombres[target]}`,fr(ang[target]),'°');q.pista=`∠${a.nombres[target]} y ∠${b.nombres[target]} ocupan el mismo lugar en la correspondencia.`;
   q.pasos=[`En triángulos semejantes, los ángulos correspondientes son iguales.`,`∠${b.nombres[target]} = ∠${a.nombres[target]} = ${ang[target]}°.`];
  }else if(tipo==='tres-angulos'){
   q.pregunta='Completa los tres ángulos de XYZ.';marcarAngulo(a,0,ang[0]);marcarAngulo(a,1,ang[1]);
   for(let i=0;i<3;i++){marcarAngulo(b,i,'?',{objetivo:true});campo('ang'+i,`∠${b.nombres[i]}`,fr(ang[i]),'°');}
   q.pista='Primero completa el tercer ángulo de ABC usando 180°. Después usa la correspondencia.';
   q.pasos=[`∠C = 180° − ${ang[0]}° − ${ang[1]}° = ${ang[2]}°.`,`∠X = ${ang[0]}°, ∠Y = ${ang[1]}°, ∠Z = ${ang[2]}°.`];
  }else{
   const sol=entero(3,12,r),coef=elegir([2,3,4],r),cte=ang[target]-coef*sol,expr=expresion(coef,cte);
   q.pregunta='Encuentra x en el ángulo.';marcarAngulo(a,target,ang[target]);marcarAngulo(b,target,expr,{objetivo:true});
   campo('x','x',fr(sol),'');q.ecuacion={izq:[coef,cte],der:[0,ang[target]]};
   q.pista='Los ángulos correspondientes miden lo mismo. Iguala la expresión al ángulo conocido.';
   q.pasos=[`${expr} = ${ang[target]}`,`${coef}x = ${ang[target]-cte}`,`x = ${sol}`];
  }
  return q;
 }
 if(tipo==='lado-entero'||tipo==='varios-lados')q.k=fr(elegir([2,3],r));
 if(tipo==='lado-fraccion'){
  q.lados=elegir([[3,5,7],[5,7,9],[5,9,11]],r).map(v=>fr(v));a.puntos=puntosLados(q.lados);q.k=fr(1,2);
 }
 b.puntos=copiaEscalada(a.puntos,q.k);const otros=q.lados.map(l=>mul(l,q.k));
 if(modo==='encuentra'){
  const referencia=entero(0,2,r),target=(referencia+1+entero(0,1,r))%3;
  if(tipo==='varios-lados'){
   q.pregunta='Completa los tres lados de XYZ.';q.datos=[`De ABC a XYZ, cada lado se multiplica por ${texto(q.k)}.`];
   for(let i=0;i<3;i++){marcarLado(a,i,q.lados[i]);marcarLado(b,i,'?',{objetivo:true});campo('lado'+i,ladoNombre(b,i),otros[i],'cm');}
   q.pista='Aplica la razón indicada a cada lado correspondiente. No uses las medidas de los ángulos.';
   q.pasos=LADOS.map((_,i)=>`${ladoNombre(b,i)} = ${ladoNombre(a,i)} × ${texto(q.k)} = ${texto(otros[i])} cm.`);
  }else{
   q.pregunta=`¿Cuánto mide ${ladoNombre(b,target)}?`;
   marcarLado(a,referencia,q.lados[referencia]);marcarLado(b,referencia,otros[referencia]);marcarLado(a,target,q.lados[target]);marcarLado(b,target,'?',{objetivo:true});
   campo('lado',ladoNombre(b,target),otros[target],'cm');
   q.pista=`Usa ${par(referencia)} para hallar la razón. Después aplícala a ${par(target)}.`;
   q.pasos=[`Razón de ABC a XYZ = ${texto(otros[referencia])} ÷ ${texto(q.lados[referencia])} = ${texto(q.k)}.`,`${ladoNombre(b,target)} = ${texto(q.lados[target])} × ${texto(q.k)} = ${texto(otros[target])} cm.`];
  }
  return q;
 }
 // Una sola incógnita, un único resultado; jamás sistemas ni ecuaciones cuadráticas.
 q.k=fr(elegir([2,3],r));b.puntos=copiaEscalada(a.puntos,q.k);const objetivo=entero(0,2,r),referencia=(objetivo+1)%3;
 const largo=q.lados[objetivo].n,qTarget=largo*q.k.n;
 marcarLado(a,referencia,q.lados[referencia]);marcarLado(b,referencia,mul(q.lados[referencia],q.k));
 let sol,coef,cte;
 if(tipo==='x-ambos'){
  sol=entero(2,Math.max(2,largo-1),r);const b1=largo-sol,a2=q.k.n+1,b2=qTarget-a2*sol;
  marcarLado(a,objetivo,expresion(1,b1),{objetivo:true});marcarLado(b,objetivo,expresion(a2,b2),{objetivo:true});
  q.ecuacion={izq:[q.k.n,q.k.n*b1],der:[a2,b2]};
  q.pasos=[`Razón de ABC a XYZ = ${texto(q.k)}.`,`${q.k.n}(${expresion(1,b1)}) = ${expresion(a2,b2)}`,`${q.k.n}x + ${q.k.n*b1} = ${expresion(a2,b2)}`,`x = ${sol}`];
 }else{
  coef=tipo==='x-suma'?1:tipo==='x-multiplo'?q.k.n:elegir([2,3],r);
  sol=tipo==='x-multiplo'?largo:entero(2,Math.max(2,Math.floor((qTarget-1)/coef)),r);cte=qTarget-coef*sol;
  marcarLado(a,objetivo,q.lados[objetivo]);marcarLado(b,objetivo,expresion(coef,cte),{objetivo:true});
  q.ecuacion={izq:[coef,cte],der:[0,qTarget]};
  q.pasos=[`Razón de ABC a XYZ = ${texto(q.k)}.`,`${ladoNombre(b,objetivo)} = ${texto(q.lados[objetivo])} × ${texto(q.k)} = ${qTarget} cm.`,`${expresion(coef,cte)} = ${qTarget}`,`x = ${sol}`];
 }
 q.pregunta='Encuentra el valor de x.';campo('x','x',fr(sol),'');q.pista='Obtén la razón con los dos lados numéricos correspondientes. Úsala para escribir una sola ecuación.';return q;
}
export const {crearPractica,siguiente,responder}=crearMotor({CASOS,OPCIONES,crearPregunta});
export function ejemploCriterio(id,conclusiones=false){
 if(!['AA','LAL','LLL'].includes(id))throw new RangeError('Criterio desconocido');
 const lados=[fr(12),fr(16),fr(20)],p=puntosLados(lados),a=triangulo(['A','B','C'],p,'alineados',Math.random),b=triangulo(['A','X','Y'],copiaEscalada(p,fr(1,2)),'alineados',Math.random),ang=[53.13,90,36.87];
 for(let i=0;i<3;i++){
  const ladoDado=id==='LLL'||id==='LAL'&&i<2,anguloDado=id==='AA'&&i<2||id==='LAL'&&i===1;
  for(const [t,k] of [[a,fr(1)],[b,fr(1,2)]]){
   if(ladoDado)marcarLado(t,i,mul(lados[i],k));
   else if(conclusiones)marcarLado(t,i,id==='AA'?(t===a?['a','b','c'][i]:['ka','kb','kc'][i]):(t===a?'c':'c/2'),{deducido:true});
   if(anguloDado)marcarAngulo(t,i,ang[i]);
   else if(conclusiones){
    if(id==='AA')marcarAngulo(t,i,ang[i],{deducido:true});
    else t.angulos[i]={texto:['α','β','γ'][i],deducido:true};
   }
  }
 }
 return [a,b];
}
