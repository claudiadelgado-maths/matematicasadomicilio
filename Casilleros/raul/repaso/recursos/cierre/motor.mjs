import {rnd,shuffle,simple,calc} from '../motor.mjs';
export {rnd,shuffle};
export const directContexts=[
 {name:'Cuadernos',quantity:'cuadernos',unit:'pesos',verb:'cuestan',icon:'▤',condition:'Todos cuestan lo mismo; no hay descuentos ni cargos fijos.',rate:[30,1]},
 {name:'Cinta',quantity:'metros de cinta',unit:'pesos',verb:'cuestan',icon:'〰',condition:'El precio por metro es constante.',rate:[20,1]},
 {name:'Paquetes',quantity:'paquetes',unit:'kg',verb:'pesan',icon:'▣',condition:'Todos los paquetes pesan lo mismo.',rate:[4,1]},
 {name:'Recorrido',quantity:'horas de viaje',unit:'km',verb:'permiten recorrer',icon:'↗',condition:'La velocidad es constante y no hay paradas.',rate:[60,1]},
 {name:'Receta',quantity:'porciones',unit:'g de harina',verb:'requieren',icon:'◒',condition:'Se mantiene la misma cantidad de harina por porción.',rate:[50,1]},
 {name:'Bebida',quantity:'litros',unit:'pesos',verb:'cuestan',icon:'◡',condition:'El precio por litro es constante y no se cobra el recipiente.',rate:[12,1]},
 {name:'Cajas',quantity:'cajas',unit:'piezas',verb:'contienen',icon:'▦',condition:'Todas las cajas contienen el mismo número de piezas.',rate:[8,1]},
 {name:'Rollos',quantity:'rollos',unit:'kg',verb:'pesan',icon:'◎',condition:'Todos los rollos son iguales.',rate:[9,2]}
];
export const inverseContexts=[
 {name:'Mangueras',quantity:'mangueras',work:'llenar el mismo depósito',icon:'≈',condition:'Mangueras de igual caudal, simultáneas y sin pérdida de presión.'},
 {name:'Máquinas',quantity:'máquinas',work:'fabricar el mismo lote',icon:'⚙',condition:'Máquinas idénticas, simultáneas y con ritmo constante.'},
 {name:'Personas',quantity:'personas',work:'completar el mismo trabajo divisible',icon:'♟',condition:'Cada persona mantiene el mismo ritmo; no hay interferencias ni tareas que deban esperar.'},
 {name:'Bombas',quantity:'bombas',work:'vaciar el mismo depósito',icon:'⇣',condition:'Bombas idénticas y simultáneas, sin cambios de caudal.'},
 {name:'Impresoras',quantity:'impresoras',work:'imprimir el mismo lote de hojas',icon:'▤',condition:'Impresoras idénticas, sin pausas y trabajando simultáneamente.'}
];
export function direct(round=1,word=false){const context=directContexts[(round-1)%directContexts.length];let a,b,mode;
 if(word||round%3===0){a=rnd(2,5);b=a+rnd(1,5);mode='unit';}
 else if(round%3===2){b=rnd(2,4);a=b*[2,3][rnd(0,1)];mode='divide';}
 else {a=rnd(2,4);b=a*rnd(2,4);mode='multiply';}
 const rate=word&&context.unit==='kg'?[rnd(3,11),2]:context.rate;
 return {...context,a,b,mode,rate,y:calc([a,1],rate,'×'),answer:calc([b,1],rate,'×')};
}
export function inverse(round=1,word=false){const context=inverseContexts[(round-1)%inverseContexts.length];const choices=word?[[3,10,5],[4,6,2],[2,9,6],[5,6,3],[6,4,8]]:[[1,12,3],[2,6,4],[4,3,2],[1,8,4],[3,4,2],[2,8,4]];const [baseA,baseTime,baseB]=choices[(round-1)%choices.length];const scale=rnd(1,2),timeFactor=[1,1.5,2][rnd(0,2)];const a=baseA*scale,b=baseB*scale,time=baseTime*timeFactor;return {...context,a,b,time,total:a*time,answer:simple([a*time,b])};}
export function factors(n){if(!Number.isInteger(n)||n<2)throw Error('Usa un entero mayor que uno');const list=[];for(let p=2;p*p<=n;p++)while(n%p===0){list.push(p);n/=p;}if(n>1)list.push(n);return list;}
export const prime=n=>Number.isInteger(n)&&n>1&&factors(n).length===1;
export function split(n,path='balanced'){if(prime(n))return null;let d=2;if(path==='balanced'){for(let i=2;i*i<=n;i++)if(n%i===0)d=i;}else while(n%d)d++;return [d,n/d];}
export const powers=n=>Object.entries(factors(n).reduce((counts,p)=>(counts[p]=(counts[p]||0)+1,counts),{})).map(([p,count])=>count===1?p:`${p}^{${count}}`).join('\\cdot ');
export function read(text){text=text.trim().replace(',','.');if(!/^-?\d+(?:\.\d{1,4})?$/.test(text))return null;const places=(text.split('.')[1]||'').length,n=Number(text.replace('.',''));return Number.isSafeInteger(n)&&Math.abs(n)<=10000000?simple([n,10**places]):null;}
