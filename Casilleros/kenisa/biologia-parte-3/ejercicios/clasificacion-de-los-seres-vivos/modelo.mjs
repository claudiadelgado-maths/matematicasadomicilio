export const fields=[
 {id:'cell',label:'Tipo celular',options:['Procariota','Eucariota']},
 {id:'organization',label:'Número de células',options:['Unicelular','Pluricelular']},
 {id:'nutrition',label:'Nutrición',options:['Autótrofa','Heterótrofa']}
];
const atlas='recursos/atlas.svg#', shared='../../recursos/organismos.svg#';
export const organisms=[
 {id:'humano',name:'Ser humano',icon:atlas+'humano',cell:'Eucariota',organization:'Pluricelular',nutrition:'Heterótrofa',clue:'Su cuerpo tiene muchas células organizadas en tejidos. Sus células típicas poseen núcleo y obtiene materia orgánica de los alimentos.',extra:'Dominio Eukarya · Reino Animalia. Reproducción sexual; necesita oxígeno para sostener su metabolismo y su vida.'},
 {id:'pino',name:'Árbol: un pino',icon:atlas+'pino',cell:'Eucariota',organization:'Pluricelular',nutrition:'Autótrofa',clue:'Raíces, tronco y hojas contienen muchas células con núcleo. Sus partes verdes fijan carbono mediante fotosíntesis.',extra:'Dominio Eukarya · Reino Plantae. Es fotoautótrofo y también realiza respiración celular. Sus células de raíz no necesitan tener cloroplastos.'},
 {id:'ameba',name:'Ameba',icon:shared+'ameba',cell:'Eucariota',organization:'Unicelular',nutrition:'Heterótrofa',clue:'Una sola célula con núcleo constituye este organismo. Captura partículas de materia orgánica para nutrirse.',extra:'Dominio Eukarya · Protista en el modelo tradicional. Una célula con núcleo demuestra que unicelular no significa procariota.'},
 {id:'alga',name:'Alga verde unicelular',icon:atlas+'alga',cell:'Eucariota',organization:'Unicelular',nutrition:'Autótrofa',clue:'En este ejemplo fotosintético, una célula con núcleo y cloroplasto forma materia orgánica a partir de CO₂ usando luz.',extra:'Dominio Eukarya. En el esquema tradicional estudiado se ubica entre las algas de Protista; la ubicación de las algas verdes varía entre sistemas. Clasifica el modo fotosintético descrito: algunas algas también pueden usar otros modos de nutrición.'},
 {id:'ciano',name:'Cianobacteria unicelular',icon:atlas+'ciano',cell:'Procariota',organization:'Unicelular',nutrition:'Autótrofa',clue:'Elegimos una forma unicelular fotosintética, como Synechococcus. Tiene ADN sin envoltura nuclear y fija CO₂ mediante energía luminosa.',extra:'Dominio Bacteria · Monera en el modelo tradicional. Hace fotosíntesis sin cloroplastos. Otras cianobacterias forman colonias o filamentos.'},
 {id:'levadura',name:'Levadura',icon:shared+'levadura',cell:'Eucariota',organization:'Unicelular',nutrition:'Heterótrofa',clue:'Saccharomyces cerevisiae tiene una célula con núcleo. Usa azúcares del medio y, con nutrientes adecuados, puede desarrollarse con o sin oxígeno.',extra:'Dominio Eukarya · Reino Fungi · Anaerobia facultativa. También puede presentar reproducción sexual y asexual. Estudiaremos los hongos con más detalle en la actividad 4.'},
 {id:'champinon',name:'Champiñón',icon:atlas+'champinon',cell:'Eucariota',organization:'Pluricelular',nutrition:'Heterótrofa',clue:'El hongo que forma el champiñón tiene muchas células con núcleo. Obtiene materia orgánica de su entorno; no fabrica azúcares por fotosíntesis.',extra:'Dominio Eukarya · Reino Fungi. Comparte tipo celular y organización con el pino, pero difiere en nutrición. El champiñón visible es una parte del hongo.'}
];
export function gradePassport(organism,answers){
 const missing=fields.filter(f=>!answers[f.id]).map(f=>f.id);
 const results=fields.map(f=>({id:f.id,label:f.label,correct:answers[f.id]===organism[f.id],expected:organism[f.id]}));
 return {missing,results,correct:results.filter(r=>r.correct).length,complete:!missing.length&&results.every(r=>r.correct)};
}
export const statements=[
 {text:'Todo organismo unicelular es procariota.',answer:false,explanation:'La ameba y la levadura son unicelulares eucariotas. Número de células y tipo celular son ejes distintos.'},
 {text:'Un organismo puede ser eucariota, unicelular y heterótrofo.',answer:true,explanation:'Una levadura reúne las tres características. Las etiquetas son compatibles porque responden preguntas distintas.'},
 {text:'Si es autótrofo, necesariamente es una planta.',answer:false,explanation:'Las cianobacterias fotosintéticas y diversas algas unicelulares son contraejemplos.'},
 {text:'En la organización típica de una misma célula, ser procariota y poseer un núcleo delimitado son características compatibles.',answer:false,explanation:'Son incompatibles según las definiciones: la organización procariota carece de núcleo delimitado por membrana.'},
 {text:'Hay heterótrofos unicelulares y heterótrofos pluricelulares.',answer:true,explanation:'Una levadura es unicelular; un ser humano y el hongo del champiñón son pluricelulares. Todos son heterótrofos.'},
 {text:'Existen autótrofos unicelulares y pluricelulares, y algunas especies presentan reproducción sexual y asexual.',answer:true,explanation:'Un alga unicelular fotosintética y un pino ilustran ambas organizaciones autótrofas. La fresa ejemplifica una especie con reproducción sexual y asexual.'}
];
