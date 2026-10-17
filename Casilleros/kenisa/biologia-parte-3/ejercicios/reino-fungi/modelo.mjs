export const structures=[
 {id:'hifa',name:'Hifa',x:389,y:427,fn:'Filamento que crece y participa en la absorción de nutrientes.',detail:'Muchas hifas se ramifican. Algunas tienen tabiques internos y otras son continuas, con varios núcleos. La línea resaltada es una hifa dentro de una red.',cue:'Sigue el filamento anaranjado que se ramifica en el sustrato.'},
 {id:'micelio',name:'Micelio',x:239,y:407,fn:'Red de hifas que forma gran parte del cuerpo de un hongo filamentoso.',detail:'Puede extenderse dentro del suelo, madera o alimento. No son raíces: el hongo no es una planta.',cue:'Observa toda la red de filamentos bajo la superficie.'},
 {id:'fructifero',name:'Cuerpo fructífero',x:286,y:193,fn:'Estructura reproductora donde se forman esporas en ciertos hongos.',detail:'La seta visible es una parte del hongo, no todo su cuerpo. Está formada por hifas organizadas. No todos los hongos producen setas.',cue:'Mira el conjunto de sombrero y pie que sobresale del sustrato.'},
 {id:'esporas',name:'Esporas',x:436,y:226,fn:'Células que participan en reproducción y dispersión.',detail:'Según el ciclo, las esporas pueden tener origen sexual o asexual. Si son viables y encuentran condiciones adecuadas, pueden germinar. No son semillas.',cue:'Busca los puntos morados dispersos cerca del sombrero.'},
 {id:'pared',name:'Pared celular',x:649,y:361,fn:'Cubierta que aporta protección y soporte a la célula.',detail:'La pared fúngica contiene quitina y otros componentes, como glucanos. Está por fuera de la membrana plasmática. La ampliación muestra una porción de hifa.',cue:'En la ampliación de la derecha, observa el borde grueso anaranjado.'}
];

export const nutritionSteps=[
 {id:'enzimas',title:'Liberar enzimas',text:'El hongo libera enzimas al exterior sobre el material orgánico.'},
 {id:'digerir',title:'Descomponer fuera',text:'Las enzimas transforman moléculas grandes en otras más pequeñas.'},
 {id:'absorber',title:'Absorber moléculas',text:'Los nutrientes pequeños atraviesan la membrana y entran a la célula.'},
 {id:'utilizar',title:'Utilizar nutrientes',text:'El hongo usa esa materia para crecer y obtener energía.'}
];
export function checkOrder(ids){
 const complete=ids.length===nutritionSteps.length&&new Set(ids).size===ids.length;
 const firstWrong=ids.findIndex((id,i)=>id!==nutritionSteps[i]?.id);
 return {complete,correct:complete&&firstWrong===-1,firstWrong};
}
export function gradeSelections(expected,answers){
 const keys=Object.keys(expected),missing=keys.filter(key=>!answers[key]);
 const wrong=keys.filter(key=>answers[key]!==expected[key]);
 return {missing,wrong,correct:keys.length-wrong.length,total:keys.length,complete:!wrong.length};
}
export const caseFields=[
 {id:'form',label:'Forma del ejemplo',options:['Levadura','Moho','Hongo con seta','Hongo con trufa']},
 {id:'organization',label:'Organización',options:['Unicelular','Pluricelular']},
 {id:'nutrition',label:'Relación nutricional descrita',options:['Saprótrofa','Parásita','Mutualista']}
];
export const cases=[
 {id:'pan',name:'Una masa que crece',icon:'levadura',clue:'En la masa del pan hay células individuales de levadura que usan azúcares del material alimenticio, sin un huésped vivo. El CO₂ de la fermentación ayuda a que la masa aumente de volumen.',expected:{form:'Levadura',organization:'Unicelular',nutrition:'Saprótrofa'},explanation:'La levadura utiliza materia orgánica no viva. Es un hongo unicelular heterótrofo; en este contexto resulta útil para producir pan.'},
 {id:'moho-pan',name:'Una colonia sobre el pan',icon:'moho',clue:'Sobre pan almacenado aparece una colonia algodonosa. Se observan muchas hifas y estructuras que producen esporas; el hongo aprovecha la materia orgánica del pan.',expected:{form:'Moho',organization:'Pluricelular',nutrition:'Saprótrofa'},explanation:'Es un moho filamentoso sobre materia no viva. Aunque descomponer es útil en un ecosistema, aquí deteriora un alimento. La utilidad depende del contexto.'},
 {id:'champinon',name:'Champiñones de cultivo',icon:'seta',clue:'Un micelio formado por muchas células crece en compost. Produce setas con sombrero y pie; obtiene nutrientes de restos orgánicos en descomposición.',expected:{form:'Hongo con seta',organization:'Pluricelular',nutrition:'Saprótrofa'},explanation:'La seta es el cuerpo fructífero de un hongo pluricelular. El micelio aprovecha materia muerta; los champiñones cultivados tienen uso alimentario.'},
 {id:'planta',name:'Moho en una planta viva',icon:'moho',clue:'En este caso, un moho filamentoso invade tejido vivo de una planta. Obtiene nutrientes del huésped y lo daña. Observamos hifas que forman su micelio.',expected:{form:'Moho',organization:'Pluricelular',nutrition:'Parásita'},explanation:'La clave es obtener nutrientes de un huésped vivo al que perjudica. No todos los mohos tienen exactamente la misma relación nutricional.'},
 {id:'raiz',name:'Intercambio bajo un árbol',icon:'micorriza',clue:'Un hongo de muchas células que produce setas conecta sus hifas con las raíces de un árbol. La planta le aporta compuestos orgánicos; el hongo facilita agua y minerales a la planta.',expected:{form:'Hongo con seta',organization:'Pluricelular',nutrition:'Mutualista'},explanation:'La micorriza beneficia a ambos participantes. El hongo sigue siendo heterótrofo: recibe materia orgánica de su socio, no hace fotosíntesis.'},
 {id:'trufa',name:'Un cuerpo fructífero bajo tierra',icon:'trufa',clue:'Este hongo pluricelular forma trufas subterráneas. Su micelio se asocia con raíces e intercambia recursos: compuestos orgánicos por acceso a agua y minerales.',expected:{form:'Hongo con trufa',organization:'Pluricelular',nutrition:'Mutualista'},explanation:'Una trufa es un cuerpo fructífero subterráneo. El caso muestra una asociación micorrícica; vivir bajo tierra no define por sí solo la nutrición.'},
 {id:'huesped',name:'Levaduras en un huésped',icon:'levadura',clue:'En la forma observada hay células individuales con gemación. En este caso obtienen recursos de un huésped vivo y contribuyen a una enfermedad.',expected:{form:'Levadura',organization:'Unicelular',nutrition:'Parásita'},explanation:'Clasificamos la forma y relación descritas. Algunas especies pueden cambiar de forma según las condiciones; no todas las levaduras son útiles ni todas son perjudiciales.'},
 {id:'queso',name:'Un queso elaborado con moho',icon:'moho',clue:'En una elaboración controlada se usa un moho seleccionado, con hifas y micelio, que transforma componentes orgánicos no vivos del queso y contribuye a su sabor.',expected:{form:'Moho',organization:'Pluricelular',nutrition:'Saprótrofa'},explanation:'Algunos Penicillium se emplean en quesos. El uso de especies seleccionadas en un proceso controlado no significa que cualquier moho de un alimento sea apto para consumo.'}
];
export const reproduction=[
 {id:'espora',name:'Una espora germina',kind:'Esporas de origen sexual o asexual',steps:[
  ['Dispersión','Una espora viable se separa del organismo que la produjo y llega a otro lugar.','espora-0'],
  ['Germinación','Con humedad, nutrientes y temperatura adecuados para su especie, inicia el crecimiento de una hifa.','espora-1'],
  ['Nuevo micelio','En este ejemplo filamentoso, la hifa crece y se ramifica hasta formar una red. No todas las esporas logran germinar.','espora-2']
 ]},
 {id:'gemacion',name:'Gemación de una levadura',kind:'Ejemplo de reproducción asexual',steps:[
  ['Aparece una yema','La célula madre desarrolla una pequeña protuberancia.','gema-0'],
  ['Crecimiento y reparto','El ADN se duplica, el núcleo se divide por mitosis y un núcleo pasa a la yema mientras esta crece.','gema-1'],
  ['Célula hija','La nueva célula puede separarse de la madre. Algunas quedan unidas durante un tiempo.','gema-2']
 ]},
 {id:'fragmentacion',name:'Fragmentación del micelio',kind:'Ejemplo de reproducción asexual',steps:[
  ['Una red de hifas','El micelio forma el cuerpo de un hongo filamentoso.','frag-0'],
  ['Se separa una parte','Un fragmento viable de micelio se desprende. No es una semilla.','frag-1'],
  ['Crece otra red','En condiciones adecuadas, el fragmento puede crecer y formar otro micelio.','frag-2']
 ]}
];
