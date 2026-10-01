import {parse} from './fracciones.mjs?v=20260930-series2';
// Banco editorial fijo: no utilizar generadores ni cambiar sus datos al repetir.
export function fija(id,tipo,enunciado,datos,respuestas,secuencia){
  const q={id,tipo,enunciado,datos,formulas:[],pasos:respuestas.map(([label,value],i)=>Object.freeze({id:`respuesta${i}`,label,respuesta:Object.freeze(parse(value))}))};
  if(secuencia)q.secuencia=secuencia.map(v=>Object.freeze(parse(v)));
  for(const v of Object.values(q))if(Array.isArray(v))Object.freeze(v);
  return Object.freeze(q);
}
const A='aritmetica',G='geometrica';
export const EJERCICIOS=Object.freeze([
 fija('a01',A,'Halla d.',[],[['d','5']],['4','9','14','19']),
 fija('a02',A,'Halla d.',['a_5=12','a_6=17'],[['d','5']]),
 fija('a03',A,'Halla d.',['a_1=-3','a_9=29'],[['d','4']]),
 fija('a04',A,'Halla d.',['a_3=7','a_8=-8'],[['d','-3']]),
 fija('a05',A,'Halla el primer término.',[],[['a_1','-7']],['-7','-4','-1','2']),
 fija('a06',A,'Halla el primer término.',['a_8=25','d=4'],[['a_1','-3']]),
 fija('a07',A,'Halla d y el primer término.',['a_4=11','a_9=31'],[['d','4'],['a_1','-1']]),
 fija('a08',A,'Halla el término en la posición 9.',['a_1=\\frac{3}{2}','d=\\frac{1}{2}'],[['a_9','11/2']]),
 fija('a09',A,'¿En qué posición está el término −17?',['a_1=7','d=-3','a_n=-17'],[['n','9']]),
 fija('a10',A,'Halla la suma de los primeros 12 términos.',['a_1=4','a_{12}=37'],[['S_{12}','246']]),
 fija('a11',A,'Halla el décimo término y la suma de los primeros 10 términos.',[],[['a_{10}','29'],['S_{10}','155']],['2','5','8','11']),
 fija('a12',A,'Halla el primer término y la suma de los primeros 12.',['a_3=-2','a_8=13'],[['a_1','-8'],['S_{12}','102']]),
 fija('a13',A,'¿Cuántos términos se sumaron?',['S_n=198','a_1=3','a_n=33'],[['n','11']]),
 fija('a14',A,'Suma los términos desde la posición 4 hasta la 9, incluyendo ambas.',['a_1=5','d=3'],[['\\text{Suma}','129']]),
 fija('a15',A,'Halla el primer término.',['S_6=90','a_6=25'],[['a_1','5']]),
 fija('a16',A,'Halla el séptimo término.',['S_7=84','a_1=-3'],[['a_7','27']]),
 fija('g01',G,'Halla r.',[],[['r','2']],['3','6','12','24']),
 fija('g02',G,'Halla r.',['a_4=24','a_5=-48'],[['r','-2']]),
 fija('g03',G,'Halla r positiva.',['a_1=2','a_5=162'],[['r','3']]),
 fija('g04',G,'Halla r.',['a_2=-6','a_5=162'],[['r','-3']]),
 fija('g05',G,'Halla el primer término.',[],[['a_1','1/2']],['1/2','-1','2','-4']),
 fija('g06',G,'Halla el primer término.',['a_5=48','r=2'],[['a_1','3']]),
 fija('g07',G,'Halla r y el primer término.',['a_3=12','a_6=96'],[['r','2'],['a_1','3']]),
 fija('g08',G,'Halla el quinto término.',['a_1=16','r=\\frac{1}{2}'],[['a_5','1']]),
 fija('g09',G,'¿En qué posición está el término 96?',['a_1=3','r=2','a_n=96'],[['n','6']]),
 fija('g10',G,'Halla r positiva y la suma de los primeros 5 términos.',['a_1=2','a_5=162'],[['r','3'],['S_5','242']]),
 fija('g11',G,'Halla el sexto término y la suma de los primeros 6 términos.',[],[['a_6','-96'],['S_6','-63']],['3','-6','12','-24']),
 fija('g12',G,'Halla el primer término y la suma de los primeros 6.',['a_2=8','a_5=64'],[['a_1','4'],['S_6','252']]),
 fija('g13',G,'Halla el primer término.',['S_5=93','r=2'],[['a_1','3']]),
 fija('g14',G,'Suma los términos desde la posición 3 hasta la 5, incluyendo ambas.',['a_1=2','r=3'],[['\\text{Suma}','234']]),
 fija('g15',G,'¿Cuántos términos se sumaron?',['S_n=189','a_1=3','r=2'],[['n','6']])
]);
