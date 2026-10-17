import {shuffle} from '../../../biologia-parte-1/recursos/modelo-repaso.mjs';

export const structures=[
 {id:'pared',name:'Pared celular',x:65,y:265,cue:'La capa gruesa exterior, de color verde oliva.',fn:'Da soporte, forma y protección; contiene celulosa.',detail:'Está por fuera de la membrana. Las células animales no tienen pared celular.',prompt:'¿Qué capa externa aporta soporte y contiene celulosa?',distractors:['membrana','citoplasma']},
 {id:'membrana',name:'Membrana plasmática',x:580,y:235,cue:'La línea verde oscura por dentro de la pared.',fn:'Regula la entrada y salida de sustancias.',detail:'Pared y membrana coexisten. La pared no reemplaza la barrera selectiva de la célula.',prompt:'¿Qué límite regula selectivamente la entrada y salida de sustancias?',distractors:['pared','vacuola']},
 {id:'citoplasma',name:'Citoplasma',x:418,y:120,cue:'El medio verde muy claro alrededor de los organelos.',fn:'Contiene componentes y numerosas reacciones fuera del núcleo.',detail:'La gran vacuola desplaza parte del citoplasma hacia la periferia; no es un espacio vacío.',prompt:'¿Cómo se llama el medio celular fuera del núcleo, donde están los componentes y ocurren reacciones?',distractors:['vacuola','pared']},
 {id:'nucleo',name:'Núcleo',x:173,y:295,cue:'El cuerpo violeta con una envoltura propia.',fn:'Conserva la mayor parte del ADN.',detail:'Su envoltura ayuda a reconocer que la célula es eucariota. Mitocondrias y cloroplastos también tienen ADN propio.',prompt:'¿Qué organelo contiene la mayor parte del ADN y está rodeado por una envoltura?',distractors:['vacuola','golgi']},
 {id:'vacuola',name:'Vacuola central',x:357,y:276,cue:'El gran compartimento azul del centro.',fn:'Almacena agua y sustancias; contribuye a la turgencia.',detail:'Al entrar agua, la presión del contenido contra la pared ayuda a dar firmeza. Muchas células maduras tienen una gran vacuola.',prompt:'¿Qué compartimento almacena agua y contribuye a la turgencia?',distractors:['cloroplastos','nucleo']},
 {id:'cloroplastos',name:'Cloroplastos',x:163,y:155,cue:'Los óvalos verdes con pequeñas membranas apiladas.',fn:'Realizan la fotosíntesis en las células que los poseen.',detail:'No todas las células vegetales tienen cloroplastos. Muchas células de raíz carecen de ellos.',prompt:'¿En qué organelos ocurre la fotosíntesis de esta célula?',distractors:['mitocondrias','ribosomas']},
 {id:'clorofila',name:'Clorofila',x:679,y:174,cue:'Observa las membranas verdes en la ampliación del cloroplasto.',fn:'Es un pigmento que absorbe energía luminosa.',detail:'La clorofila está asociada a las membranas internas del cloroplasto. No es otro organelo: el anillo señala dónde se encuentra el pigmento, no una molécula a escala.',prompt:'¿Qué pigmento presente en esas membranas absorbe luz para la fotosíntesis?',distractors:['cloroplastos','pared']},
 {id:'mitocondrias',name:'Mitocondrias',x:352,y:140,cue:'Los óvalos amarillos con pliegues internos.',fn:'Participan en la respiración aerobia y la obtención de ATP.',detail:'Las células vegetales también tienen mitocondrias y respiran de día y de noche.',prompt:'¿Qué organelos participan en la respiración aerobia y en la producción de ATP?',distractors:['cloroplastos','golgi']},
 {id:'ribosomas',name:'Ribosomas',x:259,y:131,cue:'Los pequeños puntos azules dispersos por la célula.',fn:'Ensamblan proteínas.',detail:'Están presentes tanto en células animales como vegetales. No son organelos rodeados por membrana.',prompt:'¿Qué estructuras pequeñas fabrican proteínas?',distractors:['golgi','clorofila']},
 {id:'reticulo',name:'Retículo endoplasmático',x:160,y:367,cue:'Las membranas verdes plegadas, cerca del núcleo.',fn:'Participa en síntesis y procesamiento de sustancias.',detail:'El rugoso procesa muchas proteínas; el liso participa en la síntesis de lípidos y otras funciones. El esquema muestra una parte de esa red.',prompt:'¿Qué red de membranas participa en síntesis y procesamiento de proteínas y lípidos?',distractors:['pared','golgi']},
 {id:'golgi',name:'Aparato de Golgi',x:307,y:407,cue:'Los sacos rosados apilados con pequeñas vesículas.',fn:'Modifica, clasifica y distribuye productos celulares.',detail:'Se encuentra tanto en vegetales como en animales. Trabaja en relación con el retículo, pero no son lo mismo.',prompt:'¿Qué organelo modifica, clasifica y distribuye productos celulares?',distractors:['reticulo','ribosomas']}
];

export function identificationRound(random=Math.random){
 return shuffle(structures,random).map(s=>({id:`estructura-${s.id}`,structureId:s.id,categoryId:'estructuras',prompt:s.prompt,correctId:s.id,explanation:`${s.fn} ${s.detail}`,choices:shuffle([s.id,...s.distractors],random).map(id=>({id,text:structures.find(p=>p.id===id).name}))}));
}
const sortingData=[
 ['Posee una pared que contiene celulosa.','vegetal','La pared de celulosa es característica vegetal dentro de esta comparación. No sustituye a la membrana.'],
 ['Tiene cloroplastos capaces de realizar fotosíntesis.','vegetal','Los cloroplastos corresponden a células vegetales fotosintéticas. Recuerda que no todas las vegetales los tienen.'],
 ['Presenta una gran vacuola central que contribuye a la turgencia.','vegetal','Es una característica de muchas células vegetales maduras, no de todas las células en cualquier etapa.'],
 ['Es una célula viva de una raíz, con pared y sin cloroplastos.','vegetal','Una célula de raíz sigue siendo vegetal aunque no posea cloroplastos. Puede recibir azúcares de otras partes.'],
 ['Tiene clorofila en las membranas internas de sus cloroplastos.','vegetal','La clorofila es el pigmento; el cloroplasto es el organelo que la contiene.'],
 ['Su contenido presiona contra una pared celular cuando entra agua.','vegetal','La pared resiste la presión interna; esa turgencia contribuye a la firmeza del tejido.'],
 ['Forma parte de un músculo de un perro.','animal','Los perros son animales. Sus células musculares son eucariotas y tienen mitocondrias.'],
 ['Es una célula viva de la capa basal de la piel humana.','animal','Es una célula animal con núcleo y membrana, sin pared de celulosa.'],
 ['Carece de pared celular; su límite externo es la membrana plasmática.','animal','Al comparar células animales y vegetales típicas, la ausencia de pared corresponde a las animales.'],
 ['Es una neurona humana.','animal','Una neurona es una célula animal especializada; también necesita ATP.'],
 ['Tiene mitocondrias para participar en la respiración aerobia.','ambas','Los cloroplastos no sustituyen a las mitocondrias. Animales y vegetales realizan respiración celular.'],
 ['Tiene ribosomas que fabrican proteínas.','ambas','Ambos tipos celulares necesitan fabricar proteínas y poseen ribosomas.'],
 ['La membrana plasmática regula qué entra y sale.','ambas','Las vegetales conservan su membrana por debajo de la pared. Las animales también tienen membrana.'],
 ['Su núcleo contiene la mayor parte del ADN.','ambas','Ambas presentan organización eucariota y un núcleo delimitado por membrana.'],
 ['Tiene aparato de Golgi para modificar y distribuir productos.','ambas','El Golgi es un organelo compartido por células animales y vegetales.'],
 ['Su retículo participa en la producción y procesamiento de sustancias.','ambas','El retículo está presente en ambos tipos celulares.'],
 ['Puede realizar respiración celular de día y de noche.','ambas','La respiración no requiere luz directamente. Las plantas también respiran durante el día.'],
 ['Puede carecer de cloroplastos: esa pista por sí sola no distingue su origen.','ambas','Las animales no tienen cloroplastos, pero muchas vegetales, como las de raíces, tampoco. Se necesitan más pistas.']
];
export const classification=sortingData.map(([prompt,correctId,explanation],i)=>({id:`clasifica-${i+1}`,categoryId:'comparacion',prompt,correctId,explanation,choices:[{id:'animal',text:'Animal'},{id:'vegetal',text:'Vegetal'},{id:'ambas',text:'Ambas'}]}));

export function photosynthesisState({light,water,co2}){
 const missing=[!light&&'luz',!water&&'agua',!co2&&'CO₂'].filter(Boolean);
 return {active:missing.length===0,missing};
}
export function dayNightState(time){
 if(!['day','night'].includes(time))throw new Error('Momento no válido');
 return {photosynthesis:time==='day',respiration:true};
}
