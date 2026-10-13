import {fr,mul,valor,texto,LADOS,BASES,ANGULOS,puntosLados,puntosAngulos,triangulo,ladoNombre,marcarLado,marcarAngulo,copiaEscalada,elegir,entero,expresion,crearMotor} from '../../recursos/matematicas-triangulos.mjs?v=20261009-2';
export {texto};
export const CASOS={
 decide:[['lll','LLL · tres lados iguales'],['lal','LAL · ángulo comprendido'],['ala','ALA · lado comprendido'],['no-tamano','Misma forma, distinto tamaño'],['no-angulos','No congruentes · ángulos'],['no-lados','No congruentes · lados']],
 encuentra:[['lado-entero','Un lado · resultado entero'],['lado-fraccion','Un lado · medida fraccionaria'],['varios-lados','Completar tres lados'],['angulo','Un ángulo correspondiente'],['tres-angulos','Completar tres ángulos']],
 ecuacion:[['x-suma','Un lado: x + un número'],['x-multiplo','Un lado: un múltiplo de x'],['x-lineal','Un lado: ax + b'],['x-ambos','x en dos lados correspondientes'],['x-angulo','x en un ángulo']]
};
export const OPCIONES=[['LLL','Sí, por LLL'],['LAL','Sí, por LAL'],['ALA','Sí, por ALA'],['NO','No son congruentes']];
function nuevaBase(modo,tipo,orientacion,r){
 const unidad=entero(2,4,r),lados=elegir(BASES,r).map(v=>fr(v*unidad)),p=puntosLados(lados);
 return {modo,tipo,orientacion,unidad,lados,triangulos:[triangulo(['A','B','C'],p,'alineados',r),triangulo(['X','Y','Z'],copiaEscalada(p,fr(1)),orientacion,r)],pregunta:'',contexto:'',pista:'',pasos:[],campos:[],respuesta:null,resuelta:false,intentos:0,descartadas:[],datos:[]};
}
export function crearPregunta(modo,tipo,orientacion='alineados',r=Math.random){
 if(!CASOS[modo]?.some(([id])=>id===tipo)||!['alineados','girados','reflejados','variados'].includes(orientacion))throw new RangeError('Caso desconocido');
 const q=nuevaBase(modo,tipo,orientacion,r),[a,b]=q.triangulos;
 const campo=(id,etiqueta,respuesta,unidad)=>q.campos.push({id,etiqueta,respuesta,unidad});
 const usarAngulos=(ang,ab=10)=>{a.puntos=copiaEscalada(puntosAngulos(ang),fr(ab,10));b.puntos=copiaEscalada(a.puntos,fr(1));q.angulos=ang;};
 if(modo==='decide'){
  q.pregunta='¿Son congruentes? ¿Qué datos lo demuestran?';q.contexto='Elige el criterio que puedes justificar con los datos marcados. Misma forma y mismo tamaño, aunque estén girados.';
  q.respuesta=tipo.startsWith('no-')?'NO':tipo.toUpperCase();
  if(tipo==='lll'||tipo==='no-lados'){
   let otros=q.lados;
   if(tipo==='no-lados'){
    const mayor=valor(q.lados[2]);otros=[q.lados[0],q.lados[1],fr(mayor+1)];b.puntos=puntosLados(otros);
   }
   for(let i=0;i<3;i++){marcarLado(a,i,q.lados[i]);marcarLado(b,i,otros[i]);}
   q.pista='Compara los tres lados: corto con corto, mediano con mediano y largo con largo. Para congruencia tienen que medir exactamente lo mismo.';
   q.pasos=LADOS.map((_,i)=>`${ladoNombre(a,i)} = ${texto(q.lados[i])} cm; ${ladoNombre(b,i)} = ${texto(otros[i])} cm.`);
   q.pasos.push(tipo==='lll'?'Los tres pares son iguales. Son congruentes por LLL.':'Los lados más largos son distintos. Ni cambiando la correspondencia coinciden los tres lados: no son congruentes.');
  }
  if(tipo==='lal'){
   const ab=entero(4,10,r),ac=ab+entero(1,4,r),deg=elegir([40,50,60,70,80,90],r),rad=deg*Math.PI/180;
   // La geometría interna dibuja el ángulo; el ejercicio solo compara datos.
   a.puntos=[{x:0,y:0},{x:ab,y:0},{x:ac*Math.cos(rad),y:ac*Math.sin(rad)}];b.puntos=copiaEscalada(a.puntos,fr(1));
   for(const t of [a,b]){marcarLado(t,0,fr(ab));marcarLado(t,2,fr(ac));marcarAngulo(t,0,deg);}
   q.pista='Localiza el ángulo ENTRE los dos lados dados. Coinciden dos lados y el ángulo que forman.';
   q.pasos=[`AB = XY = ${ab} cm y AC = XZ = ${ac} cm.`,`∠A = ∠X = ${deg}°. Es el ángulo comprendido entre esos lados.`,`Dos lados y el ángulo comprendido iguales: son congruentes por LAL.`];
  }
  if(tipo==='ala'||tipo==='no-tamano'||tipo==='no-angulos'){
   const ang=elegir(ANGULOS,r),ab=entero(4,12,r);usarAngulos(ang,ab);
   let otra=ang,otroAB=ab;
   if(tipo==='no-tamano'){otroAB=ab*elegir([2,3],r);b.puntos=copiaEscalada(a.puntos,fr(otroAB,ab));}
   if(tipo==='no-angulos'){
    otra=elegir(ANGULOS.filter(v=>[...v].sort((a,b)=>a-b).join()!==[...ang].sort((a,b)=>a-b).join()),r);
    b.puntos=copiaEscalada(puntosAngulos(otra),fr(ab,10));
   }
   for(const i of [0,1]){marcarAngulo(a,i,ang[i]);marcarAngulo(b,i,otra[i]);}
   if(tipo!=='no-angulos'){marcarLado(a,0,fr(ab));marcarLado(b,0,fr(otroAB));}
   if(tipo==='ala'){
    q.pista='El lado dado une los dos vértices cuyos ángulos conocemos. Deben coincidir los dos ángulos y ese lado.';
    q.pasos=[`∠A = ∠X = ${ang[0]}° y ∠B = ∠Y = ${ang[1]}°.`,`El lado comprendido también coincide: AB = XY = ${ab} cm.`,`Son congruentes por ALA. Conocer solo los ángulos no bastaría.`];
   }else if(tipo==='no-tamano'){
    q.pista='Sus ángulos coinciden, pero mira cuánto mide el lado entre ellos. La congruencia también exige el mismo tamaño.';
    q.pasos=[`Los ángulos correspondientes son iguales: tienen la misma forma.`,`AB = ${ab} cm y XY = ${otroAB} cm. El tamaño cambió.`,`Son semejantes, pero no congruentes: el lado entre esos ángulos distintos no mide lo mismo.`];
   }else{
    q.pista='Completa el tercer ángulo con 180°. Si los conjuntos de ángulos son distintos, ninguna superposición puede hacerlos coincidir.';
    q.pasos=[`ABC tiene ángulos ${ang.join('°, ')}°.`,`XYZ tiene ángulos ${otra.join('°, ')}°.`,`Los conjuntos de ángulos son distintos. No son congruentes.`];
   }
  }
  return q;
 }
 q.contexto='Sabemos que △ABC ≅ △XYZ. El orden indica A ↔ X, B ↔ Y y C ↔ Z. Sus medidas correspondientes son iguales.';
 if(tipo==='angulo'||tipo==='tres-angulos'||tipo==='x-angulo'){
  const ang=elegir(ANGULOS,r),target=entero(0,2,r);usarAngulos(ang);
  if(tipo==='angulo'){
   q.pregunta='Encuentra el ángulo señalado.';marcarAngulo(a,target,ang[target]);marcarAngulo(b,target,'?',{objetivo:true});
   campo('angulo',`∠${b.nombres[target]}`,fr(ang[target]),'°');q.pista=`Busca la pareja de ∠${b.nombres[target]} en el orden ABC ≅ XYZ.`;
   q.pasos=[`∠${a.nombres[target]} corresponde a ∠${b.nombres[target]}.`,`Los ángulos correspondientes de triángulos congruentes son iguales: ${ang[target]}°.`];
  }else if(tipo==='tres-angulos'){
   q.pregunta='Completa los tres ángulos de XYZ.';marcarAngulo(a,0,ang[0]);marcarAngulo(a,1,ang[1]);
   for(let i=0;i<3;i++){marcarAngulo(b,i,'?',{objetivo:true});campo('ang'+i,`∠${b.nombres[i]}`,fr(ang[i]),'°');}
   q.pista='Los tres ángulos interiores suman 180°. Completa ABC y pasa cada medida a su pareja.';
   q.pasos=[`∠C = 180° − ${ang[0]}° − ${ang[1]}° = ${ang[2]}°.`,`Por congruencia: ∠X = ${ang[0]}°, ∠Y = ${ang[1]}°, ∠Z = ${ang[2]}°.`];
  }else{
   const coef=elegir([2,3,4],r),sol=entero(2,Math.min(10,Math.floor((ang[target]-1)/coef)),r),cte=ang[target]-coef*sol;
   q.pregunta='Encuentra x en el ángulo.';marcarAngulo(a,target,ang[target]);marcarAngulo(b,target,expresion(coef,cte),{objetivo:true});campo('x','x',fr(sol),'');
   q.ecuacion={izq:[coef,cte],der:[0,ang[target]]};q.pista='Son ángulos correspondientes, así que mide lo mismo la expresión que el número dado.';
   q.pasos=[`${expresion(coef,cte)} = ${ang[target]}`,`${coef}x = ${ang[target]} − ${cte} = ${coef*sol}`,`x = ${coef*sol} ÷ ${coef} = ${sol}`];
  }
  return q;
 }
 if(tipo==='lado-fraccion'){
  q.lados=elegir([[3,5,7],[5,7,9],[5,9,11]],r).map(v=>fr(v,2));a.puntos=puntosLados(q.lados);b.puntos=copiaEscalada(a.puntos,fr(1));
 }
 if(modo==='encuentra'){
  const target=entero(0,2,r),indices=tipo==='varios-lados'?[0,1,2]:[target];
  q.pregunta=tipo==='varios-lados'?'Completa los tres lados de XYZ.':`¿Cuánto mide ${ladoNombre(b,target)}?`;
  for(const i of indices){marcarLado(a,i,q.lados[i]);marcarLado(b,i,'?',{objetivo:true});campo(tipo==='varios-lados'?'lado'+i:'lado',ladoNombre(b,i),q.lados[i],'cm');}
  q.pista='Busca cada pareja por las letras. Como son congruentes, conserva la medida: no necesitas multiplicarla por una razón.';
  q.pasos=indices.map(i=>`${ladoNombre(b,i)} = ${ladoNombre(a,i)} = ${texto(q.lados[i])} cm.`);
  return q;
 }
 const objetivo=entero(0,2,r),largo=valor(q.lados[objetivo]);let sol;
 if(tipo==='x-ambos'){
  sol=entero(1,Math.floor((largo-1)/2),r);const b1=largo-sol,b2=largo-2*sol;
  marcarLado(a,objetivo,expresion(1,b1),{objetivo:true});marcarLado(b,objetivo,expresion(2,b2),{objetivo:true});
  q.ecuacion={izq:[1,b1],der:[2,b2]};q.pasos=[`Los lados correspondientes son iguales: ${expresion(1,b1)} = ${expresion(2,b2)}.`,`Resta x y después ${b2} a ambos lados.`,`x = ${b1} − ${b2} = ${sol}`];
 }else{
  const coef=tipo==='x-suma'?1:tipo==='x-multiplo'?q.unidad:elegir([2,3],r);
  sol=tipo==='x-multiplo'?largo/coef:entero(1,Math.floor((largo-1)/coef),r);const cte=largo-coef*sol;
  marcarLado(a,objetivo,fr(largo));marcarLado(b,objetivo,expresion(coef,cte),{objetivo:true});
  q.ecuacion={izq:[coef,cte],der:[0,largo]};q.pasos=[`Por congruencia: ${ladoNombre(b,objetivo)} = ${ladoNombre(a,objetivo)}.`,`${expresion(coef,cte)} = ${largo}`];
  if(cte)q.pasos.push(`${coef===1?'':coef}x = ${largo} − ${cte} = ${coef*sol}`);
  q.pasos.push(`x = ${coef===1?sol:`${coef*sol} ÷ ${coef} = ${sol}`}`);
 }
 q.pregunta='Encuentra el valor de x.';campo('x','x',fr(sol),'');q.pista='Iguala las medidas de los lados correspondientes. Una sola ecuación permite encontrar x.';return q;
}
export const {crearPractica,siguiente,responder}=crearMotor({CASOS,OPCIONES,crearPregunta});
export function ejemploCriterio(id,conclusiones=false){
 if(!['LLL','LAL','ALA'].includes(id))throw new RangeError('Criterio desconocido');
 const lados=[fr(6),fr(8),fr(10)],p=puntosLados(lados),ts=[triangulo(['A','B','C'],p,'alineados',Math.random),triangulo(['X','Y','Z'],copiaEscalada(p,fr(1)),'alineados',Math.random)],ang=[53.13,90,36.87];
 for(const t of ts)for(let i=0;i<3;i++){
  const ladoDado=id==='LLL'||id==='LAL'&&i<2||id==='ALA'&&i===0,anguloDado=id==='LAL'&&i===1||id==='ALA'&&i<2;
  if(ladoDado)marcarLado(t,i,lados[i]);else if(conclusiones)marcarLado(t,i,['a','b','c'][i],{deducido:true});
  if(anguloDado)marcarAngulo(t,i,ang[i]);else if(conclusiones){if(id==='ALA')marcarAngulo(t,i,ang[i],{deducido:true});else t.angulos[i]={texto:['α','β','γ'][i],deducido:true};}
 }
 return ts;
}
