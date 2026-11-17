// Cálculo puro: la interfaz redondea solo al presentar los resultados.
export function parseDecimal(raw) {
  const text=String(raw).trim().replace(/−/g,'-').replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) throw new Error('Escribe un número con punto o coma decimal, sin separadores de miles.');
  const value=Number(text);
  if(!Number.isFinite(value)) throw new Error('Escribe un número finito.');
  return value;
}

export function createModel(initial,rate,periods) {
  if(!Number.isFinite(initial)||initial<.01||initial>1e6) throw new Error('La cantidad inicial debe estar entre 0.01 y 1 000 000.');
  if(!Number.isFinite(rate)||rate < -90||rate>100) throw new Error('La tasa debe estar entre −90 % y 100 %.');
  if(!Number.isInteger(periods)||periods<1||periods>12) throw new Error('Elige entre 1 y 12 períodos completos.');
  const factor=1+rate/100;
  const rows=Array.from({length:periods+1},(_,n)=>{
    const quantity=initial*factor**n;
    return {n,quantity,change:n===0?null:quantity-initial*factor**(n-1)};
  });
  return {initial,rate,periods,factor,rows,final:rows[periods].quantity,totalPercent:100*(factor**periods-1),kind:rate>0?'Crecimiento':rate<0?'Decrecimiento':'Cantidad constante'};
}

export function recoverInitial(final,factor,periods) {
  if(!Number.isFinite(final)||final<=0||!Number.isFinite(factor)||factor<=0||!Number.isInteger(periods)||periods<0) throw new Error('Usa cantidades y factores positivos, y períodos enteros no negativos.');
  const initial=final/factor**periods;
  if(!Number.isFinite(initial)) throw new Error('El resultado excede el rango numérico.');
  return initial;
}

export function isCorrect(raw,expected) {
  const value=parseDecimal(raw);
  // Acepta el valor exacto o correctamente redondeado a dos decimales.
  return Math.abs(value-expected)<=0.005000001;
}

export const challenges=[
  {title:'Convierte un aumento en factor',category:'01 · Factor de crecimiento',question:'Una cantidad aumenta \\(12\\%\\) en cada período. ¿Por qué factor se multiplica?',label:'Factor multiplicativo',answer:1.12,hint:'Conservas el \\(100\\%\\) y añades el \\(12\\%\\).',steps:['Convierte la tasa: \\(12\\%=0.12\\).','Suma a la unidad: \\(b=1+0.12=1.12\\).'],wrong:'El factor debe ser mayor que 1. La tasa decimal por sí sola representa solo el aumento.'},
  {title:'¿Qué parte permanece?',category:'02 · Factor de decrecimiento',question:'Una cantidad disminuye \\(20\\%\\) por período. ¿Cuál es su factor multiplicativo?',label:'Factor multiplicativo',answer:.8,hint:'Después de perder \\(20\\%\\), conserva el \\(80\\%\\).',steps:['Resta la tasa a la unidad: \\(b=1-0.20=0.80\\).','El factor está entre \\(0\\) y \\(1\\), por eso la cantidad disminuye.'],wrong:'Piensa en lo que queda, no en lo que se pierde: el factor representa la parte conservada.'},
  {title:'Antes del primer cambio',category:'03 · El período cero',question:'Si \\(Q_n=400(1.10)^n\\), ¿cuánto vale \\(Q_0\\)?',label:'Cantidad inicial',answer:400,hint:'Cuando \\(n=0\\), todavía no ha ocurrido ningún cambio.',steps:['Toda base positiva elevada a cero vale uno: \\(1.10^0=1\\).','Entonces \\(Q_0=400(1)=400\\).'],wrong:'En el período cero no se ha aplicado el aumento. Recuerda que una base positiva elevada a cero vale 1.'},
  {title:'Dos aumentos consecutivos',category:'04 · Aplicar el modelo',question:'Empiezas con \\(500\\) unidades. Aumentan \\(20\\%\\) por período. ¿Cuántas hay después de \\(2\\) períodos?',label:'Cantidad final',answer:500*1.2**2,hint:'Usa \\(Q_2=500(1.20)^2\\).',steps:['Primer período: \\(500(1.20)=600\\).','Segundo período: \\(600(1.20)=720\\).'],wrong:'El segundo 20 % se calcula sobre la cantidad que ya creció. Multiplica dos veces por 1.20.'},
  {title:'Dos disminuciones consecutivas',category:'05 · Aplicar el modelo',question:'Una cantidad de \\(1000\\) disminuye \\(20\\%\\) por período. ¿Cuánto queda después de \\(2\\) períodos?',label:'Cantidad final',answer:1000*.8**2,hint:'En cada paso queda el \\(80\\%\\) de la cantidad anterior.',steps:['Usa \\(b=1-0.20=0.80\\).','Calcula \\(Q_2=1000(0.80)^2=640\\).'],wrong:'No restes 200 dos veces: la segunda disminución usa la cantidad que quedó tras la primera.'},
  {title:'El cambio de todo el recorrido',category:'06 · Porcentaje acumulado',question:'Una cantidad pasa de \\(500\\) a \\(864\\). ¿Qué porcentaje aumentó en total?',label:'Aumento total, en %',answer:(864/500-1)*100,hint:'Compara el aumento total con la cantidad inicial: \\(\\frac{864-500}{500}\\cdot100\\).',steps:['El aumento es \\(864-500=364\\).','Respecto al inicio: \\(\\frac{364}{500}\\cdot100=72.8\\%\\).'],wrong:'El porcentaje total se calcula respecto al valor inicial. No sumes directamente las tasas de los períodos.'},
  {title:'Reconstruye el inicio',category:'07 · Deshacer el crecimiento',question:'Una cantidad creció \\(10\\%\\) por período durante \\(2\\) períodos y terminó en \\(968\\). ¿Con cuánto empezó?',label:'Cantidad inicial',answer:recoverInitial(968,1.1,2),hint:'Despeja \\(Q_0\\) dividiendo entre \\(1.10^2\\).',steps:['De \\(968=Q_0(1.10)^2\\) se obtiene \\(Q_0=\\frac{968}{1.21}=800\\).','Comprobación: \\(800(1.10)^2=968\\).'],wrong:'Para deshacer el crecimiento, divide entre el factor completo. Restar un porcentaje al resultado no es la operación inversa.'},
  {title:'Lee la tasa en el factor',category:'08 · Interpretar la fórmula',question:'El modelo es \\(Q_n=600(0.92)^n\\). ¿Cuál es la tasa por período, con su signo?',label:'Tasa con signo, en %',answer:-8,hint:'El factor conserva el \\(92\\%\\). ¿Qué porcentaje se perdió?',steps:['Resta 1 al factor: \\(0.92-1=-0.08\\).','Convierte a porcentaje: \\(-0.08\\cdot100=-8\\%\\).'],wrong:'0.92 representa la parte que queda. La tasa mide el cambio respecto al 100 % y aquí debe ser negativa.'},
  {title:'Un aumento y una disminución',category:'09 · Factores diferentes',question:'Partes de \\(100\\). Primero aumenta \\(10\\%\\) y después disminuye \\(10\\%\\). ¿Cuál es la cantidad final?',label:'Cantidad final',answer:100*1.1*.9,hint:'Multiplica por \\(1.10\\) y después por \\(0.90\\).',steps:['Después del aumento: \\(100(1.10)=110\\).','Después de la disminución: \\(110(0.90)=99\\).','La disminución se calcula sobre 110, por eso no regresas a 100.'],wrong:'Las dos tasas usan bases distintas. Calcula primero el aumento y aplica la disminución al nuevo valor.'},
  {title:'Deshaz una disminución',category:'10 · Cierre del recorrido',question:'Después de disminuir \\(10\\%\\) por período durante \\(2\\) períodos, quedan \\(405\\) unidades. ¿Cuál era la cantidad inicial?',label:'Cantidad inicial',answer:recoverInitial(405,.9,2),hint:'El factor es \\(0.90\\). Divide \\(405\\) entre \\(0.90^2\\).',steps:['Plantea \\(405=Q_0(0.90)^2\\).','Despeja: \\(Q_0=\\frac{405}{0.81}=500\\).','Comprueba: \\(500\\to450\\to405\\).'],wrong:'El inicio debe ser mayor que 405. Para recuperar lo anterior, divide entre el factor; no añadas un 20 % al final.'}
];
