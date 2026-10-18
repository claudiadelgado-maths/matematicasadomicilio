export const parts = [
 {id:'cabezas',name:'Cabezas de los fosfolípidos',short:'Cabezas',x:20,y:33,role:'Están en contacto con el agua.',detail:'Son hidrofílicas: tienen afinidad por el agua. Una fila mira al exterior y otra al citoplasma. Cada cabeza está unida a dos colas.',match:'Orientarse hacia los medios acuosos interior y exterior.'},
 {id:'colas',name:'Colas de los fosfolípidos',short:'Colas',x:30,y:50,role:'Forman el interior hidrofóbico de la bicapa.',detail:'Tienen poca afinidad por el agua. Las colas de ambas capas se enfrentan. Esta zona dificulta el paso de iones y de muchas moléculas polares.',match:'Formar una barrera interna que dificulta el paso de sustancias con carga.'},
 {id:'canal',name:'Proteína de canal',short:'Canal',x:48,y:50,role:'Ofrece un paso selectivo a través de la membrana.',detail:'Un canal abierto permite el paso de ciertas sustancias a favor de su gradiente. Las acuaporinas son canales para agua. Un canal no es una bomba.',match:'Crear un paso selectivo, como una acuaporina para el agua.'},
 {id:'transportadora',name:'Proteína transportadora',short:'Transportadora',x:75,y:48,role:'Se une a una sustancia y cambia de forma para trasladarla.',detail:'Algunas permiten difusión facilitada; otras participan en transporte activo. La presencia de una proteína no basta para decir que se gasta ATP.',match:'Unirse a una sustancia y cambiar de forma para trasladarla.'},
 {id:'colesterol',name:'Colesterol',short:'Colesterol',x:61,y:46,role:'Ayuda a regular la fluidez y la estabilidad.',detail:'En la membrana animal se intercala entre los fosfolípidos. Modera cambios de fluidez con la temperatura. No es un canal ni fabrica ATP; otras células pueden tener otros esteroles.',match:'Moderar cambios de fluidez en la membrana animal.'}
];

export function grade(expected, answers) {
 const keys=Object.keys(expected), missing=keys.filter(k=>!answers[k]);
 const wrong=keys.filter(k=>answers[k] && answers[k]!==expected[k]);
 return {missing,wrong,correct:keys.length-missing.length-wrong.length,total:keys.length,complete:!missing.length&&!wrong.length};
}

// Modelo cualitativo inicial: mismo soluto no penetrante, interior fijo en 5 unidades.
export function osmosis(outside, cell='animal') {
 if(!Number.isFinite(outside)||outside<0||outside>10||!['animal','vegetal'].includes(cell)) throw new RangeError('Condición osmótica no válida.');
 const medium=outside<5?'hipotonico':outside>5?'hipertonico':'isotonico';
 const direction=outside<5?'entra':outside>5?'sale':'equilibrio';
 const media={hipotonico:'Hipotónico',hipertonico:'Hipertónico',isotonico:'Isotónico'};
 const results={
  animal:{hipotonico:['Se hincha; puede romperse.','En un medio suficientemente hipotónico, un glóbulo rojo puede romperse: eso es hemólisis. No toda entrada de agua causa una ruptura inmediata.'],hipertonico:['Se encoge.','La pérdida neta de agua reduce su volumen. En los glóbulos rojos se llama crenación; no es plasmólisis.'],isotonico:['Mantiene aproximadamente su volumen.','El agua sigue cruzando en ambos sentidos, pero sin movimiento neto. Isotónico no significa que las moléculas se detengan.']},
  vegetal:{hipotonico:['Se vuelve turgente.','La vacuola gana agua y el contenido celular presiona la pared. La pared resiste la expansión y ayuda a evitar la ruptura: turgencia.'],hipertonico:['Puede presentar plasmólisis.','Al perder agua, el contenido celular se contrae y la membrana se separa de la pared. La pared permanece; no se encoge igual que el contenido.'],isotonico:['Queda flácida, sin turgencia marcada.','No hay entrada neta de agua que mantenga una presión elevada contra la pared. El agua sigue moviéndose en ambos sentidos.']}
 };
 const [title,detail]=results[cell][medium];
 return {medium,name:media[medium],direction,title,detail,scale:medium==='hipotonico'?1.16:medium==='hipertonico'?.68:1};
}

export const transportTypes=[['simple','Difusión simple'],['facilitada','Difusión facilitada'],['osmosis','Ósmosis'],['activo','Transporte activo'],['fagocitosis','Fagocitosis'],['pinocitosis','Pinocitosis'],['exocitosis','Exocitosis']].map(([id,name])=>({id,name}));
export const cases=[
 {id:'oxigeno',title:'Oxígeno hacia una célula',clue:'Hay más O₂ fuera que dentro. El O₂ atraviesa directamente la bicapa.',mechanism:'simple',energy:'no',why:'Es una molécula pequeña y no polar. El flujo neto sigue su gradiente y no requiere ATP directo.'},
 {id:'glucosa',title:'Una puerta para la glucosa',clue:'La glucosa pasa de mayor a menor concentración mediante una proteína GLUT que cambia de forma, sin acoplarse a otro transporte.',mechanism:'facilitada',energy:'no',why:'El uso de una proteína no convierte el proceso en activo. Aquí la glucosa va a favor de su gradiente.'},
 {id:'agua',title:'La célula pierde agua',clue:'Una célula está en un medio con mayor concentración de solutos no penetrantes. Sale agua a través de la membrana.',mechanism:'osmosis',energy:'no',why:'Se mueve agua por una diferencia osmótica. Es transporte pasivo, incluso si usa acuaporinas.'},
 {id:'sodio',title:'Sodio cuesta arriba',clue:'Una bomba lleva Na⁺ desde el interior, donde hay menos, hacia el exterior, donde hay más, utilizando ATP.',mechanism:'activo',energy:'si',why:'El Na⁺ se bombea contra su gradiente; la energía del ATP permite sostener esa diferencia.'},
 {id:'defensa',title:'Una célula de defensa',clue:'La célula rodea una bacteria con su membrana y la encierra en una vesícula.',mechanism:'fagocitosis',energy:'si',why:'La fagocitosis incorpora partículas grandes. Es una forma de endocitosis y requiere energía celular.'},
 {id:'liquido',title:'Pequeñas gotas del exterior',clue:'La membrana se invagina y forma vesículas con líquido extracelular y sustancias disueltas.',mechanism:'pinocitosis',energy:'si',why:'La pinocitosis incorpora líquido mediante vesículas. No es ósmosis: no solo cruza agua por la membrana.'},
 {id:'secrecion',title:'Un paquete sale de la célula',clue:'Una vesícula con proteínas se fusiona con la membrana y libera su contenido al exterior.',mechanism:'exocitosis',energy:'si',why:'La exocitosis permite secretar materiales. También añade la membrana de la vesícula a la membrana plasmática.'},
 {id:'dioxido',title:'Sale dióxido de carbono',clue:'El CO₂ está más concentrado dentro. Cruza la bicapa hacia el exterior sin una proteína transportadora.',mechanism:'simple',energy:'no',why:'La dirección entrada/salida no define si es activo. El CO₂ sale a favor de su propio gradiente.'},
 {id:'canal',title:'Un ion cruza por un canal',clue:'Un ion pasa por un canal abierto a favor de su gradiente electroquímico; no se usa una bomba.',mechanism:'facilitada',energy:'no',why:'Los iones necesitan una vía proteica para cruzar la bicapa. Por un canal y a favor del gradiente, el transporte es pasivo.'},
 {id:'lechuga',title:'Una hoja recupera firmeza',clue:'Células de una hoja reciben agua desde un medio hipotónico y recuperan turgencia.',mechanism:'osmosis',energy:'no',why:'El agua entra por ósmosis. La presión sobre la pared ayuda a que la hoja se mantenga firme.'},
 {id:'potasio',title:'Potasio hacia el interior',clue:'La bomba sodio-potasio introduce K⁺ en la célula, donde su concentración ya es mayor, con energía de ATP.',mechanism:'activo',energy:'si',why:'La bomba lleva K⁺ contra su gradiente, al mismo tiempo que transporta Na⁺ en la dirección opuesta.'},
 {id:'residuos',title:'Después de procesar un material',clue:'Una vesícula interna se une a la superficie celular y descarga material residual fuera.',mechanism:'exocitosis',energy:'si',why:'La exocitosis puede expulsar residuos o secretar sustancias útiles. No siempre es eliminación de desechos.'}
];

export const passive={
 simple:{name:'Difusión simple',cargo:'O₂ / CO₂',route:'Directamente por la bicapa',detail:'Moléculas pequeñas y no polares cruzan con facilidad. El movimiento neto va de mayor a menor concentración de esa sustancia.',color:'#de7856'},
 facilitada:{name:'Difusión facilitada',cargo:'Un ion por un canal',route:'A través de una proteína',detail:'Un canal o una transportadora facilita el paso. Se sigue el gradiente; no hay gasto directo de ATP. Para iones también importa la diferencia de cargas eléctricas.',color:'#8870b2'},
 osmosis:{name:'Ósmosis',cargo:'Agua',route:'Membrana permeable al agua',detail:'El agua puede cruzar la bicapa y, con mucha mayor rapidez, acuaporinas. En los ejemplos de esta actividad, tiende a ir hacia el lado con más solutos que no pueden cruzar.',color:'#348a9b'}
};
export const pumpSteps=[
 ['Se unen 3 Na⁺ dentro','La bomba reconoce tres iones sodio en el lado interno. El sodio suele estar más concentrado fuera.'],
 ['ATP y cambio de forma','La energía de un ATP permite el ciclo: la bomba cambia de forma y libera 3 Na⁺ al exterior.'],
 ['Se unen 2 K⁺ fuera','Dos iones potasio se unen desde el exterior. El potasio suele estar más concentrado dentro.'],
 ['Regresa y libera K⁺ dentro','La bomba recupera su forma inicial y libera 2 K⁺ al citoplasma. Balance del ciclo: 3 Na⁺ salen, 2 K⁺ entran, 1 ATP utilizado.']
];
export const vesicles={
 fagocitosis:{name:'Fagocitosis',subtitle:'Partículas grandes · Entrada',steps:[['Reconoce y rodea','La membrana se extiende alrededor de una partícula grande, como una bacteria.'],['Encierra en una vesícula','La membrana envuelve la partícula y forma una vesícula dentro de la célula.'],['Procesa el material','La vesícula puede fusionarse con lisosomas para digerir lo incorporado. Es útil en defensa y alimentación de ciertas células.']]},
 pinocitosis:{name:'Pinocitosis',subtitle:'Líquido y solutos · Entrada',steps:[['Se invagina la membrana','Una pequeña zona de membrana se hunde y recoge líquido del exterior.'],['Se forma una vesícula','El líquido y sus sustancias disueltas quedan en una vesícula interna.'],['Distribuye lo incorporado','La célula procesa o dirige ese material. Se incorporó una porción de líquido; no es el movimiento osmótico del agua.']]},
 exocitosis:{name:'Exocitosis',subtitle:'Secreción o expulsión · Salida',steps:[['Transporta un paquete','Una vesícula interna lleva proteínas, otras sustancias o residuos hacia la membrana.'],['Fusiona las membranas','La membrana vesicular se une a la membrana plasmática.'],['Libera al exterior','El contenido sale. Sirve para secretar hormonas o enzimas y para expulsar materiales; requiere energía celular.']]}
};
