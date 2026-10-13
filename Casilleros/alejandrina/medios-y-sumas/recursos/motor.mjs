export const pick=a=>a[Math.floor(Math.random()*a.length)];
export const integer=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
export function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=integer(0,i);[b[i],b[j]]=[b[j],b[i]];}return b;}
export const term=(a,d,n)=>a+(n-1)*d;
export const sum=(a,d,n)=>n*(a+term(a,d,n))/2;
export const segment=(a,d,p,q)=>(q-p+1)*(term(a,d,p)+term(a,d,q))/2;
export const sequence=(a,d,n)=>Array.from({length:n},(_,i)=>a+i*d);
export function parse(value){
 const s=value.trim().replace(',','.');
 if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return Number(s);
 const f=s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);return f&&Number(f[2])!==0?Number(f[1])/Number(f[2]):NaN;
}
export const close=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<1e-8;
export const fmt=n=>String(n).replace('-', '−');
const signed=n=>n<0?`(${n})`:String(n);
const field=(label,answer)=>({label,answer});
const step=(title,fields,hint,tex,explanation='')=>({title,fields,hint,tex,explanation});
const totalStep=(a,d,n)=>step('Calcula el total',[field(`S_{${n}}`,sum(a,d,n))],'Multiplica la cantidad de términos por el promedio de los extremos.',`S_{${n}}=\\frac{${n}[${signed(a)}+${signed(term(a,d,n))}]}{2}=${sum(a,d,n)}`,'Este resultado reúne todos los términos indicados.');
const lastStep=(a,d,n)=>step('Encuentra el último término',[field(`a_{${n}}`,term(a,d,n))],`Hasta la posición ${n} hay ${n-1} saltos.`,`a_{${n}}=${a}+(${n}-1)(${d})=${term(a,d,n)}`,'Este valor corresponde a una sola posición. Todavía no es el total.');

export function middle(mode='centro'){
 const d=mode==='decimal'?pick([.5,1.5,2.5]):mode==='baja'?-integer(2,6):integer(2,8),a=mode==='decimal'?integer(1,8):integer(2,18),values=sequence(a,d,3),index=mode==='extremo'?pick([0,2]):1;
 return {kind:'medio',prompt:'Completa la progresión. Los dos saltos deben ser iguales.',values,hidden:[index],steps:[step(index===1?'Encuentra el medio':'Encuentra el extremo',[field(index===1?'M':index===0?'a':'b',values[index])],index===1?'Suma los extremos y divide entre dos.':'Calcula la diferencia entre los términos conocidos y da un salto en el sentido que falta.',index===1?`M=\\frac{${signed(values[0])}+${signed(values[2])}}{2}=${values[1]}`:`${index===0?'a':'b'}=2(${signed(values[1])})-${signed(values[index===0?2:0])}=${values[index]}`,`La progresión queda ${values.map(fmt).join(', ')}. Cada salto es ${fmt(d)}.`)]};
}
export function means(mode='sube'){
 const k=mode==='estudio'?3:integer(2,4),a=mode==='estudio'?pick([20,30,40]):integer(1,12),d=mode==='baja'?-integer(1,4):mode==='decimal'?pick([.5,1.5,2.5]):mode==='estudio'?pick([5,10]):integer(2,6),b=a+(k+1)*d,values=sequence(a,d,k+2);
 if(mode==='cuantos')return {kind:'cuantos',a,d,b,k,prompt:`Entre ${a} y ${b} avanzas de ${d} en ${d}. ¿Cuántos medios quedan entre los extremos?`,steps:[step('Cuenta los medios',[field('k',k)],'El cambio total dividido entre d cuenta saltos. Los medios son uno menos.',`k=\\frac{${b}-${a}}{${d}}-1=${k}`,`Hay ${k+1} saltos y ${k} valores intermedios.`)]};
 return {kind:'varios',k,a,d,b,values,hidden:sequence(1,1,k),prompt:mode==='estudio'?`El lunes estudias ${a} minutos y el viernes quieres estudiar ${b}. Aumentas lo mismo cada día. Completa martes, miércoles y jueves.`:`Inserta ${k} medios aritméticos entre ${a} y ${fmt(b)}.`,steps:[step('Cuenta los saltos',[field('\\text{saltos}',k+1)],'Un salto une cada par de términos vecinos. Incluye los saltos desde y hacia los extremos.',`${k}+1=${k+1}`,`Hay ${k} medios, ${k+2} términos en total y ${k+1} saltos.`),step('Encuentra la diferencia',[field('d',d)],'Divide el cambio total entre la cantidad de saltos.',`d=\\frac{${signed(b)}-${signed(a)}}{${k+1}}=${d}`),step('Completa los medios',values.slice(1,-1).map((v,i)=>field(`M_{${i+1}}`,v)),'Empieza en el primer extremo y suma d en cada salto.',values.join(',\\quad '),'Comprueba también el último salto hacia el extremo derecho.') ]};
}
export function direct(){const a=integer(1,12),d=integer(1,5),n=pick([4,5,6,8,10,12]);return {kind:'directa',a,d,n,prompt:`Una progresión tiene ${n} términos. El primero es ${a} y el último es ${term(a,d,n)}. ¿Cuánto suman?`,steps:[totalStep(a,d,n)]};}
export function missing(mode='ultimo'){
 const a=integer(2,12),d=integer(2,6),n=pick([6,8,10,12,15,20]),b=term(a,d,n);
 if(mode==='cantidad')return {kind:'cantidad',a,d,n,prompt:`${a}, ${a+d}, ${a+2*d}, …, ${b}. Encuentra cuántos términos hay y luego súmalos.`,steps:[step('Cuenta los términos',[field('n',n)],'El cambio total dividido entre d cuenta saltos. Suma uno para contar términos.',`n=\\frac{${b}-${a}}{${d}}+1=${n}`),totalStep(a,d,n)]};
 if(mode==='inverso')return {kind:'inverso',a,d,n,prompt:`La suma de ${n} términos es ${sum(a,d,n)} y el primero es ${a}. Encuentra el último.`,steps:[step('Encuentra el extremo que falta',[field(`a_{${n}}`,b)],'Multiplica S por dos, divide entre n y resta el primer término.',`a_{${n}}=\\frac{2(${sum(a,d,n)})}{${n}}-${a}=${b}`)]};
 return {kind:'ultimo',a,d,n,prompt:`Suma los primeros ${n} términos de ${a}, ${a+d}, ${a+2*d}, …`,steps:[lastStep(a,d,n),totalStep(a,d,n)]};
}
export function tramo(){const a=integer(1,8),d=integer(1,4),p=integer(3,8),q=p+integer(4,12);return {kind:'tramo',a,d,p,q,prompt:`En la progresión ${a}, ${a+d}, ${a+2*d}, … suma desde la posición ${p} hasta la ${q}, incluidas ambas.`,positions:q,selected:[p,q],steps:[step('Cuenta las posiciones incluidas',[field('\\text{cantidad}',q-p+1)],'Incluye tanto la primera posición como la última.',`${q}-${p}+1=${q-p+1}`),step('Calcula los dos extremos',[field(`a_{${p}}`,term(a,d,p)),field(`a_{${q}}`,term(a,d,q))],'Usa aₙ = a₁ + (n − 1)d para cada posición.',`a_{${p}}=${a}+(${p}-1)(${d})=${term(a,d,p)}\\qquad a_{${q}}=${term(a,d,q)}`),step('Suma solo este tramo',[field('S',segment(a,d,p,q))],'Multiplica la cantidad de posiciones por el promedio de sus extremos.',`S=\\frac{${q-p+1}(${term(a,d,p)}+${term(a,d,q)})}{2}=${segment(a,d,p,q)}`,`Otra manera: S${q} − S${p-1} = ${sum(a,d,q)} − ${sum(a,d,p-1)} = ${segment(a,d,p,q)}. Quitamos las primeras ${p-1} posiciones.`)]};}
export function application(mode='total'){
 if(mode==='tramo'){const r=tramo();r.prompt=`Un taller produce ${r.a*10} piezas en el primer mes y aumenta su producción en ${r.d*10} piezas cada mes. ¿Cuántas produce en total del mes ${r.p} al ${r.q}?`;r.a*=10;r.d*=10;r.steps=[step('Encuentra los datos del tramo',[field('\\text{cantidad}',r.q-r.p+1),field(`a_{${r.p}}`,term(r.a,r.d,r.p)),field(`a_{${r.q}}`,term(r.a,r.d,r.q))],'Cuenta ambos meses extremos y calcula la producción de cada uno.',`N=${r.q}-${r.p}+1=${r.q-r.p+1}\\quad a_{${r.p}}=${term(r.a,r.d,r.p)}\\quad a_{${r.q}}=${term(r.a,r.d,r.q)}`),step('Calcula el total de piezas',[field('S',segment(r.a,r.d,r.p,r.q))],'Usa solo los extremos y la cantidad de meses de este tramo.',`S=\\frac{${r.q-r.p+1}(${term(r.a,r.d,r.p)}+${term(r.a,r.d,r.q)})}{2}=${segment(r.a,r.d,r.p,r.q)}`)];r.plan='Sumar un tramo';return r;}
 const a=pick([20,30,50]),d=pick([5,10,15]),n=pick([5,6,8,10]);
 return {kind:mode==='termino'?'termino':'aplicacion',a,d,n,plan:mode==='termino'?'Encontrar un término':'Sumar todos los términos',prompt:`Lucía deposita $${a} la primera semana y cada semana deposita $${d} más que la anterior. ${mode==='termino'?`¿Cuánto deposita solo en la semana ${n}?`:`¿Cuánto deposita en total durante las primeras ${n} semanas?`}`,steps:mode==='termino'?[lastStep(a,d,n)]:[lastStep(a,d,n),totalStep(a,d,n)]};
}
export function meansGame(round){
 if(round===0)return middle();
 if(round===1){const k=integer(2,5);return {prompt:`Insertas ${k} medios entre dos extremos. ¿Cuántos saltos hay?`,steps:[step('Cuenta los saltos',[field('\\text{saltos}',k+1)],'Dibuja los extremos y los huecos. Cuenta los espacios entre ellos.',`${k}+1=${k+1}`)]};}
 if(round===2){const a=integer(2,12),d=integer(2,6);return {prompt:`Alguien completó ${a}, ${a+d}, ${a+2*d+1}. ¿Qué observas?`,choice:{options:['Los saltos son distintos.','Es una progresión aritmética.','Solo importa que los números aumenten.'],answer:'Los saltos son distintos.',explanation:`El primer salto es ${d} y el segundo ${d+1}. El último término debería ser ${a+2*d}.`},steps:[]};}
 if(round===3)return means(pick(['baja','decimal']));
 if(round===4)return middle('extremo');
 return means('estudio');
}
export function sumsGame(round){
 if(round===0)return application('termino');
 if(round===1){const r=direct();r.plan='Sumar todos los términos';return r;}
 if(round===2){const r=missing();r.plan='Sumar todos los términos';return r;}
 if(round===3)return missing('cantidad');
 if(round===4)return tramo();
 if(round===5)return {prompt:'Para sumar desde a₆ hasta a₁₅, alguien propone S₁₅ − S₆. ¿Qué debe corregir?',choice:{options:['Debe restar S₅ para incluir a₆.','Debe sumar S₆.','El procedimiento ya incluye a₆.'],answer:'Debe restar S₅ para incluir a₆.',explanation:'S₆ incluye el término de la posición 6. Si lo restas, también lo quitas; por eso se restan únicamente los cinco anteriores.'},steps:[]};
 return application('total');
}
