import {equivalent} from './fracciones-algebraicas.mjs';
const N=n=>({op:'n',n}),X={op:'v',v:'x'},op=(op,a,b)=>({op,a,b}),add=(a,b)=>op('+',a,b),sub=(a,b)=>op('-',a,b),mul=(a,b)=>op('*',a,b),frac=(a,b)=>op('/',a,b);
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),pick=(r,a)=>a[int(r,0,a.length-1)];
const shuffle=(r,a)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=int(r,0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const times=(r,k)=>pick(r,[`${k} veces un número`,`un número multiplicado por ${k}`,k===2?'el doble de un número':k===3?'el triple de un número':`${k} veces una cantidad`]);
const part=(r,k)=>pick(r,[`un número dividido entre ${k}`,k===2?'la mitad de un número':`la ${['','','','tercera','cuarta','quinta','sexta'][k]||k+'ª'} parte de un número`]);
const cap=s=>s[0].toUpperCase()+s.slice(1);
function translation(level,r){
 const a=int(r,2,20),b=int(r,1,20),d=int(r,2,6),family=int(r,0,level===36?4:5);let text,correct,wrong;
 if(level===36){
  const variants=[[[times(r,a)],mul(N(a),X),[add(X,N(a)),frac(X,N(a)),sub(X,N(a))]],[[part(r,a)],frac(X,N(a)),[mul(N(a),X),sub(X,N(a)),frac(N(a),X)]],[[pick(r,[`un número aumentado en ${a}`,`la suma de un número y ${a}`,`${a} unidades más que un número`])],add(X,N(a)),[sub(X,N(a)),mul(N(a),X),frac(X,N(a))]],[[pick(r,[`un número disminuido en ${a}`,`${a} unidades menos que un número`,`la diferencia entre un número y ${a}`])],sub(X,N(a)),[sub(N(a),X),add(X,N(a)),mul(N(a),X)]],[[pick(r,[`la diferencia entre ${a} y un número`,`el resultado de restar un número a ${a}`])],sub(N(a),X),[sub(X,N(a)),add(X,N(a)),mul(N(a),X)]]];
  const row=variants[family];text=cap(row[0][0])+'.';correct=row[1];wrong=row[2];
 }else{
  if(family===0){text=cap(times(r,a))+`, y al resultado se le suman ${b}.`;correct=add(mul(N(a),X),N(b));wrong=[mul(N(a),add(X,N(b))),sub(mul(N(a),X),N(b)),mul(N(a+b),X)];}
  if(family===1){text=pick(r,[`A ${times(r,a)} se le restan ${b}.`,`${b} menos que ${times(r,a)}.`]);correct=sub(mul(N(a),X),N(b));wrong=[mul(N(a),sub(X,N(b))),sub(N(b),mul(N(a),X)),add(mul(N(a),X),N(b))];}
  if(family===2){text=pick(r,[`Multiplica por ${a} la suma de un número y ${b}.`,`La suma de un número y ${b}, multiplicada por ${a}.`]);correct=mul(N(a),add(X,N(b)));wrong=[add(mul(N(a),X),N(b)),mul(N(a),sub(X,N(b))),add(X,N(a*b))];}
  if(family===3){text=cap(part(r,d))+`, y después se añaden ${b}.`;correct=add(frac(X,N(d)),N(b));wrong=[frac(add(X,N(b)),N(d)),sub(frac(X,N(d)),N(b)),add(mul(N(d),X),N(b))];}
  if(family===4){text=pick(r,[`Resta ${b} a un número y divide todo el resultado entre ${d}.`,`La diferencia entre un número y ${b}, dividida entre ${d}.`]);correct=frac(sub(X,N(b)),N(d));wrong=[sub(X,frac(N(b),N(d))),sub(frac(X,N(d)),N(b)),frac(sub(N(b),X),N(d))];}
  if(family===5){text=`A un número se le suman ${b}; después, el resultado se multiplica por ${a} y se divide entre ${d}.`;correct=frac(mul(N(a),add(X,N(b))),N(d));wrong=[add(frac(mul(N(a),X),N(d)),N(b)),frac(add(mul(N(a),X),N(b)),N(d)),frac(mul(N(a),sub(X,N(b))),N(d))];}
 }
 const options=[{expression:correct,correct:true}];for(const candidate of [...wrong,add(correct,N(1)),sub(correct,N(1))]){if(!options.some(o=>equivalent(o.expression,candidate)))options.push({expression:candidate,correct:false});if(options.length===4)break;}
 return {text,correct,options:shuffle(r,options),family,validate:c=>equivalent(c,correct),explanation:'Lee el orden de las operaciones. Los paréntesis indican qué cantidad completa se multiplica o divide. Aquí x representa el número desconocido.'};
}
function numeric(level,r){
 if(level===40||level===41)return linearContexts(level,r);
 let family=0,text,answer,validate,labels=[],unit='',explanation;
 if(level===38){family=int(r,0,3);const a=int(r,2,6),b=int(r,1,12),x=int(r,1,15)*(family===2?a:1);let c;
  if(family===0||family===1){c=a*x+(family===0?b:-b);text=cap(times(r,a))+`, ${family===0?'más':'menos'} ${b}, es ${c}.`;validate=([v])=>a*v+(family===0?b:-b)===c;}
  if(family===2){c=x/a+b;text=cap(part(r,a))+`, más ${b}, es ${c}.`;validate=([v])=>v/a+b===c;}
  if(family===3){c=a*(x+b);text=`La suma de un número y ${b}, multiplicada por ${a}, da ${c}.`;validate=([v])=>a*(v+b)===c;}
  text+=' ¿Cuánto vale el número?';answer=[x];explanation='Llama x al número, traduce la frase a una ecuación y deshaz las operaciones en orden inverso.';
 }
 if(level===39){family=int(r,0,4);const x=int(r,2,30),gap=int(r,2,12),ratio=int(r,2,5);
  if(family===0){const y=x+gap,total=x+y;answer=[x,y];text=pick(r,[`Dos números suman ${total}; el mayor supera al menor en ${gap}. Indica ambos de menor a mayor.`,`Un número es ${gap} unidades menor que otro y su suma es ${total}. Escribe los dos en orden creciente.`]);validate=([a,b])=>a<b&&a+b===total&&b-a===gap;}
  if(family>=1&&family<=3){const first=family===1?x:family===2?2*x:2*x+1,step=family===1?1:2,total=3*first+3*step;answer=[first,first+step,first+2*step];const kind=family===1?'enteros':family===2?'pares':'impares';text=pick(r,[`Tres números ${kind} consecutivos suman ${total}. ¿Cuáles son, de menor a mayor?`,`La suma de tres ${kind} consecutivos es ${total}. Encuentra los tres en orden creciente.`]);validate=vals=>vals.length===3&&vals.every(Number.isInteger)&&vals[1]-vals[0]===step&&vals[2]-vals[1]===step&&vals.reduce((a,b)=>a+b,0)===total&&(family===1||Math.abs(vals[0]%2)===(family===2?0:1));}
  if(family===4){const y=ratio*x,total=x+y;answer=[x,y];text=`El mayor de dos números es ${ratio} veces el menor. Entre los dos suman ${total}. ¿Cuáles son, de menor a mayor?`;validate=([a,b])=>a<b&&b===ratio*a&&a+b===total;}
  explanation='Representa los números a partir del menor. Los enteros consecutivos se separan por 1; los pares o impares consecutivos, por 2. Comprueba la relación y la suma.';
 }
 if(level===42){family=int(r,0,5);
  if(family===0){const young=int(r,8,25),years=int(r,2,10),ratio=int(r,2,3),older=ratio*(young+years)-years,total=young+older;answer=[young,older];labels=['Menor','Mayor'];unit='años';text=`Dos personas suman hoy ${total} años. Dentro de ${years} años, la mayor tendrá ${ratio} veces la edad de la menor. ¿Qué edad tiene cada una hoy?`;validate=([a,b])=>a>0&&b>a&&a+b===total&&b+years===ratio*(a+years);}
  if(family===1){const v=int(r,3,9),w=int(r,3,9),t=int(r,2,6),distance=(v+w)*t;answer=[t];unit='h';text=`Dos caminantes salen al mismo tiempo desde lugares separados por ${distance} km y avanzan uno hacia el otro a ${v} km/h y ${w} km/h, sin parar. ¿Cuántas horas pasan hasta que se encuentran?`;validate=([a])=>a>0&&(v+w)*a===distance;}
  if(family===2){const a=int(r,10,60),extra=int(r,5,25),total=3*a+extra;answer=[a,a+extra,a];labels=['Ana','Beto','Celia'];unit='pesos';text=`Se reparten ${total} pesos entre Ana, Beto y Celia. Ana y Celia reciben lo mismo; Beto recibe ${extra} pesos más que Ana. ¿Cuánto recibe cada persona?`;validate=([x,y,z])=>x>0&&x===z&&y-x===extra&&x+y+z===total;}
  if(family===3){const portions=int(r,2,8),per=int(r,20,80),mult=int(r,2,5),amount=portions*per;answer=[amount*mult];unit='g';text=`Una receta para ${portions} porciones lleva ${amount} g de harina. Se quieren preparar ${portions*mult} porciones del mismo tamaño, conservando la proporción. ¿Cuántos gramos de harina se necesitan?`;validate=([a])=>a>0&&a*portions===amount*portions*mult;}
  if(family===4){const left=int(r,1,6),right=int(r,1,6),scale=int(r,2,5),length=left+right,loadLeft=right*scale,loadRight=left*scale;answer=[left];unit='m';text=`Una barra ideal de ${length} m, de peso despreciable, sostiene ${loadLeft} kg en su extremo izquierdo y ${loadRight} kg en el derecho. ¿A cuántos metros del extremo izquierdo debe colocarse el apoyo para que se equilibre? Usa carga × distancia al apoyo en cada lado.`;validate=([x])=>x>0&&x<length&&loadLeft*x===loadRight*(length-x);}
  if(family===5){const full=int(r,3,15),reduced=int(r,3,15),cheap=int(r,2,5)*10,price=cheap+int(r,1,4)*10,total=full+reduced,money=price*full+cheap*reduced;answer=[full,reduced];labels=['General','Reducida'];text=`Se vendieron ${total} entradas: la general cuesta ${price} pesos y la reducida ${cheap} pesos. Se recaudaron ${money} pesos. ¿Cuántas entradas de cada tipo se vendieron?`;validate=([a,b])=>Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a+b===total&&a*price+b*cheap===money;}
  explanation='Define la incógnita, identifica qué cantidad se conserva y escribe la relación indicada. Verifica el resultado en todos los datos y conserva las unidades.';
 }
 if(r()<.5)text=text.replace('¿Cuántas horas','¿Qué cantidad de horas').replace('Encuentra','Determina').replace('Se reparten','Se distribuyen').replace('Una receta para','Para preparar').replace('lleva','se utilizan').replace('Dos personas suman hoy','Las edades actuales de dos personas suman').replace('Se vendieron','Una taquilla vendió').replace('Una barra ideal de','Una barra rígida ideal de');
 return {family,text,answer,validate,labels,unit,explanation};
}
export function verbalProblem(level,r=Math.random){
 const data=level<=37?translation(level,r):numeric(level,r);
 let options=data.options;
 if(!options){const candidates=[data.answer];for(const delta of shuffle(r,[-3,-2,-1,1,2,3,4]))for(let i=0;i<data.answer.length;i++){const copy=[...data.answer];copy[i]+=delta;if(copy.every(v=>v>=0))candidates.push(copy);}const seen=new Set();options=[];for(const values of candidates){const key=values.join(',');if(seen.has(key))continue;seen.add(key);options.push({expression:{op:'wordAnswer',values,labels:data.labels||[],unit:data.unit||''},values,correct:data.validate(values)});if(options.length===4)break;}options=shuffle(r,options);}
 if(options.length!==4||options.filter(o=>o.correct).length!==1||!options.every(o=>o.correct===(level<=37?data.validate(o.expression):data.validate(o.values))))throw Error('Problema verbal inconsistente');
 return {id:level+':'+data.text,level,story:data.text,expression:N(0),meta:{family:data.family},verify:data.validate,steps:[{prompt:level<=37?'¿Qué expresión representa la frase?':'Elige la respuesta correcta.',options}],explanation:data.explanation};
}

// Contextos variados al servicio de un mismo objetivo: ecuaciones lineales.
function linearContexts(level,r){
 const family=int(r,0,4),x=int(r,3,20),y=int(r,2,18),a=int(r,2,6),b=int(r,2,9);
 let text,answer,validate,labels=[],unit='',model;
 if(level===40){
  answer=[x];
  if(family===0){const total=a*x+b;text=pick(r,[`Un servicio cobra ${b} pesos de cuota fija y ${a} pesos por cada kilómetro. La cuenta fue de ${total} pesos. ¿Cuántos kilómetros se recorrieron?`,`Un viaje cuesta ${b} pesos al inicio, más ${a} pesos por kilómetro. Si se pagaron ${total} pesos, ¿qué distancia se recorrió?`]);validate=([v])=>a*v+b===total;unit='km';model=`${a}x + ${b} = ${total}`;}
  if(family===1){const perimeter=4*x+2*b;text=`El largo de un rectángulo supera su ancho en ${b} cm. Su perímetro es ${perimeter} cm. ¿Cuánto mide el ancho?`;validate=([v])=>v>0&&2*v+2*(v+b)===perimeter;unit='cm';model=`2x + 2(x + ${b}) = ${perimeter}`;}
  if(family===2){const total=x+a*x+b;text=`Una persona tiene ${b} años más que ${a} veces la edad de otra. Sus edades suman ${total} años. ¿Qué edad tiene la persona menor?`;validate=([v])=>v>0&&v+a*v+b===total;unit='años';model=`x + ${a}x + ${b} = ${total}`;}
  if(family===3){const total=a*x+b;text=`Se guardan ${total} piezas en ${a} cajas con la misma cantidad en cada una y quedan ${b} piezas fuera. ¿Cuántas piezas hay en cada caja?`;validate=([v])=>v>=0&&a*v+b===total;unit='piezas';model=`${a}x + ${b} = ${total}`;}
  if(family===4){const distance=(a+b)*x;text=`Dos personas parten simultáneamente desde puntos separados por ${distance} km y avanzan una hacia la otra a ${a} km/h y ${b} km/h. ¿En cuántas horas se encuentran si mantienen esas velocidades?`;validate=([v])=>v>0&&(a+b)*v===distance;unit='h';model=`${a}x + ${b}x = ${distance}`;}
 }else{
  answer=[x,y];const total=x+y;
  if(family===0){const first=a+2,second=a,money=first*x+second*y;text=`Una tienda vendió ${total} artículos: cuadernos a ${first} pesos y lápices a ${second} pesos. Recaudó ${money} pesos. ¿Cuántos vendió de cada tipo?`;labels=['Cuadernos','Lápices'];validate=([u,v])=>u>=0&&v>=0&&u+v===total&&first*u+second*v===money;model=`x + y = ${total}; ${first}x + ${second}y = ${money}`;}
  if(family===1){const weighted=a*x+(a+1)*y;text=`Dos números suman ${total}. Al multiplicar el primero por ${a} y el segundo por ${a+1}, los resultados suman ${weighted}. ¿Cuáles son, en ese orden?`;labels=['Primero','Segundo'];validate=([u,v])=>u+v===total&&a*u+(a+1)*v===weighted;model=`x + y = ${total}; ${a}x + ${a+1}y = ${weighted}`;}
  if(family===2){const shifted=2*x+y+b;text=`Ana y Beto suman hoy ${total} años. El doble de la edad actual de Ana más la edad que tendrá Beto dentro de ${b} años es ${shifted}. ¿Qué edad tiene cada uno hoy?`;labels=['Ana','Beto'];unit='años';validate=([u,v])=>u>0&&v>0&&u+v===total&&2*u+v+b===shifted;model=`x + y = ${total}; 2x + y + ${b} = ${shifted}`;}
  if(family===3){let hoursB=b;if(hoursB===a)hoursB++;const count=a*x+hoursB*y;text=`Dos máquinas producen juntas ${total} piezas por hora. Si A trabaja ${a} horas y B trabaja ${hoursB} horas, producen ${count} piezas en total. Sus ritmos son constantes. ¿Cuántas piezas por hora produce cada una?`;labels=['A','B'];unit='piezas/h';validate=([u,v])=>u>0&&v>0&&u+v===total&&a*u+hoursB*v===count;model=`x + y = ${total}; ${a}x + ${hoursB}y = ${count}`;}
  if(family===4){const r1=a*x+y,r2=x+(a+1)*y;text=`En un reparto, ${a} paquetes rojos y un paquete azul contienen ${r1} fichas. Un paquete rojo y ${a+1} azules contienen ${r2} fichas. Todos los paquetes del mismo color contienen lo mismo. ¿Cuántas fichas hay en cada color?`;labels=['Rojo','Azul'];unit='fichas';validate=([u,v])=>u>0&&v>0&&a*u+v===r1&&u+(a+1)*v===r2;model=`${a}x + y = ${r1}; x + ${a+1}y = ${r2}`;}
 }
 return {family,text,answer,validate,labels,unit,explanation:(level===40?'Llama x a la cantidad solicitada. Planteamiento: ':'Llama x e y a las cantidades en el orden indicado. Planteamiento: ')+model+'. Resuelve y sustituye tu resultado en las condiciones originales.'};
}
