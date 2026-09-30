// Preguntas originales para comprender las once estructuras del dibujo.
export const STRUCTURES = [
  { id: 'membrana', name: 'Membrana plasmática', summary: 'Delimita la célula y regula el intercambio con el exterior.', memory: 'Frontera selectiva', distinction: 'No es una pared cerrada: algunas sustancias pasan y otras necesitan transportadores.' },
  { id: 'citoplasma', name: 'Citoplasma', summary: 'Es la región entre la membrana y el núcleo; contiene citosol y estructuras.', memory: 'El interior fuera del núcleo', distinction: 'Citosol es el medio acuoso. Citoplasma incluye ese medio y las estructuras que contiene.' },
  { id: 'nucleo', name: 'Núcleo', summary: 'Contiene la mayor parte del ADN y permite regular la actividad celular.', memory: 'Archivo de instrucciones', distinction: 'El nucléolo está dentro del núcleo. Las mitocondrias también poseen algo de ADN.' },
  { id: 'nucleolo', name: 'Nucléolo', summary: 'Participa en la formación de las subunidades de los ribosomas.', memory: 'Prepara la maquinaria', distinction: 'Preparar ribosomas no es fabricar proteínas: esa segunda tarea la hacen los ribosomas.' },
  { id: 'reticulo', name: 'Retículo endoplasmático', summary: 'El rugoso procesa proteínas; el liso participa en fabricar lípidos.', memory: 'Red de fabricación y procesamiento', distinction: 'Rugoso = con ribosomas adheridos. Liso = sin ellos. El Golgi recibe y clasifica muchos de sus productos.' },
  { id: 'ribosomas', name: 'Ribosomas', summary: 'Leen ARN mensajero y unen aminoácidos para construir proteínas.', memory: 'Ensamblan proteínas', distinction: 'Pueden estar libres o sobre el retículo. No son el lugar donde se guarda la mayor parte del ADN.' },
  { id: 'golgi', name: 'Aparato de Golgi', summary: 'Modifica, clasifica y empaqueta productos celulares para enviarlos a su destino.', memory: 'Centro de distribución', distinction: 'Trabaja con productos ya fabricados. No une aminoácidos como los ribosomas.' },
  { id: 'mitocondria', name: 'Mitocondria', summary: 'Produce gran parte del ATP mediante la respiración celular con oxígeno.', memory: 'Energía utilizable en ATP', distinction: 'Transforma energía de los nutrientes; no crea energía de la nada. Sus pliegues internos se llaman crestas.' },
  { id: 'citoesqueleto', name: 'Citoesqueleto', summary: 'Sus filamentos sostienen, organizan y permiten movimientos y transporte internos.', memory: 'Soporte y caminos', distinction: 'Es una red dinámica de proteínas, no huesos. Los microtúbulos son un tipo de sus filamentos.' },
  { id: 'centriolo', name: 'Centriolo', summary: 'Es un cilindro de microtúbulos que forma parte del centrosoma.', memory: 'Un cilindro, no toda la red', distinction: 'El centrosoma incluye centriolos y material que organiza microtúbulos, como los del huso de división.' },
  { id: 'peroxisoma', name: 'Peroxisoma', summary: 'Procesa ciertas grasas y descompone el peróxido de hidrógeno.', memory: 'Manejo del peróxido', distinction: 'No confundir con la mitocondria, asociada al ATP, ni con el lisosoma, que digiere y recicla materiales.' }
];

const names = new Map(STRUCTURES.map(({ id, name }) => [id, name]));
// Cada grupo tiene cinco pistas con contextos diferentes y tres distractores próximos.
const clues = [
  ['membrana', ['citoplasma', 'citoesqueleto', 'reticulo'], [
    ['Hace de límite entre el interior de la célula y el ambiente, pero permite intercambios de manera selectiva.', 'La membrana rodea la célula y regula el paso de sustancias; no es una pared completamente cerrada.'],
    ['Un nutriente del exterior debe atravesar esta frontera para llegar al interior celular.', 'El intercambio con el exterior ocurre a través de la membrana plasmática, con ayuda de sus proteínas cuando es necesario.'],
    ['Ayuda a mantener condiciones internas diferentes de las del medio que rodea a la célula.', 'La permeabilidad selectiva de la membrana ayuda a conservar el equilibrio interno.'],
    ['Contiene proteínas que pueden recibir señales del exterior y comunicar cambios a la célula.', 'Algunas proteínas de la membrana funcionan como receptores; también existen canales y transportadores.'],
    ['Si su barrera se daña, ciertas sustancias podrían entrar o salir sin el control habitual.', 'Una membrana intacta separa el interior del exterior y controla los intercambios.']
  ]],
  ['citoplasma', ['nucleo', 'membrana', 'citoesqueleto'], [
    ['Es la región interior, fuera del núcleo, que contiene un medio acuoso y muchas de las estructuras celulares.', 'El citoplasma incluye el citosol, los organelos y el citoesqueleto situados fuera del núcleo.'],
    ['En esta región suceden muchas reacciones y se encuentran sustancias que la célula utiliza.', 'Muchas reacciones ocurren en el citosol, el medio acuoso que forma parte del citoplasma.'],
    ['Si recorrieras el interior celular entre la membrana y la envoltura del núcleo, estarías en esta región.', 'El citoplasma ocupa la región entre la membrana plasmática y la envoltura nuclear.'],
    ['No es un saco aislado: abarca el entorno interno donde se encuentran numerosos organelos.', 'El citoplasma es una región de la célula, no un organelo encerrado en su propia membrana.'],
    ['Incluye un medio donde se disuelven moléculas y donde están inmersas las mitocondrias y otras estructuras.', 'Ese medio es el citosol; junto con las estructuras que contiene, forma el citoplasma.']
  ]],
  ['nucleo', ['nucleolo', 'ribosomas', 'golgi'], [
    ['En una célula animal típica, guarda la mayor parte de las instrucciones hereditarias.', 'El núcleo contiene la mayor parte del ADN. Las mitocondrias también tienen una pequeña cantidad de ADN propio.'],
    ['Sus instrucciones permiten regular qué proteínas se producen y muchas actividades de la célula.', 'La información del ADN nuclear se utiliza para regular la producción de proteínas y el funcionamiento celular.'],
    ['Alberga los cromosomas y está rodeado por una envoltura con poros.', 'Los cromosomas se encuentran en el núcleo; los poros de su envoltura permiten intercambios regulados.'],
    ['Para estudiar la información hereditaria principal, buscarías dentro de este compartimento.', 'El núcleo conserva el ADN que contiene la mayor parte de la información hereditaria de la célula.'],
    ['Es el compartimento que contiene al nucléolo y protege la mayor parte del ADN.', 'El nucléolo es una región dentro del núcleo; ambos nombres corresponden a estructuras distintas.']
  ]],
  ['nucleolo', ['nucleo', 'ribosomas', 'reticulo'], [
    ['Dentro del núcleo, reúne materiales para formar las subunidades de los ribosomas.', 'En el nucléolo se produce ARN ribosómico y se ensamblan subunidades con proteínas.'],
    ['No fabrica proteínas directamente: ayuda a preparar parte de la maquinaria que después las fabricará.', 'El nucléolo prepara subunidades ribosómicas; los ribosomas son quienes ensamblan proteínas.'],
    ['Es una región del núcleo relacionada con el ARN ribosómico y el armado de subunidades.', 'El ARN ribosómico se combina con proteínas en el nucléolo para formar subunidades de ribosomas.'],
    ['Si su trabajo disminuye, puede resultar más difícil formar nuevos ribosomas.', 'La producción de subunidades ribosómicas depende del nucléolo; no deben confundirse con proteínas terminadas.'],
    ['Está dentro del compartimento que guarda el ADN, pero su tarea destacada es preparar subunidades ribosómicas.', 'El núcleo alberga el ADN; el nucléolo es una región especializada en la formación de subunidades de ribosomas.']
  ]],
  ['reticulo', ['ribosomas', 'golgi', 'citoesqueleto'], [
    ['Forma una red de membranas: una parte tiene ribosomas adheridos y otra no.', 'El retículo endoplasmático tiene regiones rugosas, con ribosomas, y lisas, sin ellos.'],
    ['Su región lisa participa en producir lípidos que la célula necesita.', 'El retículo liso sintetiza lípidos; el rugoso trabaja con proteínas fabricadas por ribosomas adheridos.'],
    ['Su región rugosa recibe proteínas recién fabricadas que seguirán la ruta hacia otros compartimentos.', 'En el retículo rugoso entran muchas proteínas destinadas a la secreción o a las membranas.'],
    ['Es una red interna donde muchas proteínas empiezan a plegarse antes de viajar al aparato de Golgi.', 'El retículo rugoso participa en el plegamiento y procesamiento inicial de esas proteínas.'],
    ['Tiene regiones que ayudan con lípidos y otras asociadas al procesamiento de proteínas.', 'Las regiones lisa y rugosa del retículo tienen funciones diferentes y complementarias.']
  ]],
  ['ribosomas', ['nucleolo', 'reticulo', 'golgi'], [
    ['Unen aminoácidos en el orden indicado por un mensaje para construir una proteína.', 'Los ribosomas leen el ARN mensajero y ensamblan una cadena de aminoácidos.'],
    ['Pueden trabajar libres en el citoplasma o adheridos al retículo endoplasmático.', 'Tanto los ribosomas libres como los adheridos fabrican proteínas; cambia el destino de muchas de ellas.'],
    ['Son la maquinaria que transforma un mensaje de ARN en una cadena de proteína.', 'Los ribosomas realizan la traducción: usan la información del ARN mensajero para unir aminoácidos.'],
    ['Si faltaran, los mensajes podrían existir, pero no se ensamblarían las proteínas que indican.', 'El ARN mensajero aporta instrucciones; el ribosoma ejecuta el ensamblaje de la proteína.'],
    ['Son pequeñas estructuras sin membrana propia que construyen proteínas.', 'Los ribosomas no son sacos membranosos. Su función es unir aminoácidos para formar proteínas.']
  ]],
  ['golgi', ['reticulo', 'ribosomas', 'peroxisoma'], [
    ['Recibe productos celulares, los modifica y los clasifica según el destino al que deben ir.', 'El aparato de Golgi procesa y clasifica proteínas y lípidos que llegan, entre otros sitios, del retículo.'],
    ['Se parece a una estación de distribución: organiza proteínas antes de enviarlas en vesículas.', 'El Golgi ayuda a empaquetar y dirigir proteínas; no es la maquinaria que une sus aminoácidos.'],
    ['Después del retículo, muchas proteínas pasan por sus sacos apilados para continuar su procesamiento.', 'Los sacos del Golgi reciben, modifican y distribuyen muchas proteínas procedentes del retículo.'],
    ['Ayuda a que un producto ya fabricado llegue al compartimento correcto o al exterior.', 'El Golgi clasifica los productos y los prepara para su transporte en vesículas.'],
    ['Si falla su clasificación, una proteína podría estar fabricada y aun así ser enviada al lugar equivocado.', 'Fabricar y dirigir son tareas diferentes: el Golgi participa en el procesamiento y la distribución.']
  ]],
  ['mitocondria', ['peroxisoma', 'ribosomas', 'golgi'], [
    ['Aprovecha la energía química de los nutrientes para producir gran parte del ATP en una célula con oxígeno.', 'Las mitocondrias realizan etapas de la respiración celular que producen gran parte del ATP.'],
    ['Es especialmente importante para una célula muscular que necesita energía utilizable para contraerse.', 'El ATP suministra energía para muchas tareas; las células musculares suelen tener numerosas mitocondrias.'],
    ['Tiene una membrana interna con pliegues donde ocurren procesos relacionados con la producción de ATP.', 'Los pliegues, llamados crestas, aumentan la superficie de la membrana interna mitocondrial.'],
    ['Si su actividad baja, puede disminuir el ATP disponible para procesos que requieren energía.', 'Las mitocondrias convierten energía de los nutrientes en ATP; no crean energía de la nada.'],
    ['En la respiración celular, participa en obtener energía utilizable a partir de los nutrientes.', 'La mitocondria produce ATP durante la respiración celular; no es la encargada principal de empaquetar proteínas.']
  ]],
  ['citoesqueleto', ['centriolo', 'membrana', 'citoplasma'], [
    ['Es una red de filamentos que ayuda a mantener la forma y la organización interna de la célula.', 'El citoesqueleto aporta soporte y organiza estructuras; no es un esqueleto hecho de huesos.'],
    ['Algunos de sus filamentos sirven de caminos para mover materiales dentro de la célula.', 'Proteínas motoras pueden transportar cargas a lo largo de filamentos del citoesqueleto.'],
    ['Puede reorganizarse cuando una célula cambia de forma o se desplaza.', 'El citoesqueleto es dinámico: sus filamentos contribuyen a cambios de forma y movimientos celulares.'],
    ['Sus componentes ayudan a sostener organelos y a distribuirlos dentro de la célula.', 'La red del citoesqueleto contribuye a mantener la organización y el transporte internos.'],
    ['Es una red extensa que incluye microtúbulos, no solo uno de los cilindros del centrosoma.', 'El citoesqueleto abarca diferentes filamentos; el centriolo es una estructura cilíndrica específica.']
  ]],
  ['centriolo', ['citoesqueleto', 'ribosomas', 'nucleolo'], [
    ['Es uno de los pequeños cilindros de microtúbulos que forman parte del centrosoma de muchas células animales.', 'El centrosoma suele contener dos centriolos, junto con material que organiza microtúbulos.'],
    ['Suele encontrarse junto a otro cilindro, cerca del núcleo, dentro del centrosoma.', 'Los centriolos forman una pareja característica en el centrosoma; no son sacos de proteínas.'],
    ['Pertenece al centrosoma, una región que ayuda a organizar los microtúbulos del huso durante la división celular.', 'El centriolo es parte del centrosoma. El conjunto organiza microtúbulos del huso mitótico, que contribuye a separar los cromosomas.'],
    ['Está formado por microtúbulos dispuestos en un cilindro y puede dar origen a un cuerpo basal.', 'Los cuerpos basales, relacionados con los centriolos, organizan los microtúbulos de cilios y flagelos.'],
    ['Es una estructura cilíndrica concreta asociada al centrosoma, en lugar de toda la red de filamentos celulares.', 'El centriolo es una estructura particular; el citoesqueleto es la red extensa de filamentos.']
  ]],
  ['peroxisoma', ['mitocondria', 'golgi', 'reticulo'], [
    ['Encierra enzimas que ayudan a descomponer peróxido de hidrógeno, una sustancia que puede dañar la célula.', 'La catalasa del peroxisoma transforma peróxido de hidrógeno en agua y oxígeno.'],
    ['En su interior se procesan ciertos ácidos grasos mediante reacciones de oxidación.', 'Los peroxisomas participan en la degradación de ciertos ácidos grasos y en el manejo del peróxido de hidrógeno.'],
    ['Puede generar peróxido de hidrógeno en algunas reacciones y también dispone de enzimas para neutralizarlo.', 'El peroxisoma reúne reacciones de oxidación y enzimas que descomponen su peróxido de hidrógeno.'],
    ['Es un compartimento pequeño relacionado con el procesamiento de ciertas sustancias potencialmente dañinas.', 'Los peroxisomas intervienen en procesos de detoxificación y degradación de ácidos grasos.'],
    ['Su función destacada es manejar reacciones de oxidación y peróxido, no producir la mayor parte del ATP.', 'Peroxisoma y mitocondria tienen tareas diferentes: el manejo del peróxido distingue al peroxisoma.']
  ]]
];

export const DESCRIPTION_BANK = clues.flatMap(([structureId, distractors, entries]) =>
  entries.map(([prompt, explanation], index) => ({
    id: `pista-${structureId}-${index + 1}`, structureId, kind: 'Interpreta la pista', prompt, explanation,
    choices: [structureId, ...distractors].map((id) => ({ id, text: names.get(id) })), correctId: structureId
  }))
);

// Formato: tipo, pregunta, correcta, tres alternativas, explicación.
// Las alternativas de cada pregunta son explícitas para evitar respuestas ambiguas.
const reasoning = [
  ['membrana', [
    ['Situación', 'Una célula recibe glucosa del medio mediante una proteína transportadora. ¿En qué estructura debe estar esa proteína para cruzar la frontera celular?', 'Membrana plasmática', 'Aparato de Golgi', 'Nucléolo', 'Citoesqueleto', 'El transportador debe atravesar la membrana plasmática, que separa el medio externo del interior.'],
    ['Si algo falla', 'Una célula empieza a perder sustancias internas porque su barrera exterior se ha dañado. ¿Qué estructura conviene revisar primero?', 'Membrana plasmática', 'Núcleo', 'Ribosomas', 'Centriolo', 'La pérdida a través del límite celular apunta a la membrana. Las otras estructuras realizan tareas internas.'],
    ['Busca la excepción', '¿Cuál de estas tareas NO corresponde a la membrana plasmática?', 'Unir aminoácidos para construir proteínas', 'Separar el interior celular del exterior', 'Regular el paso de ciertas sustancias', 'Recibir algunas señales mediante receptores', 'Unir aminoácidos es trabajo de los ribosomas. La membrana delimita, regula intercambios y participa en la comunicación.'],
    ['Compara', '¿Qué diferencia explica mejor el papel de la membrana y del citoesqueleto?', 'La membrana regula intercambios con el exterior; el citoesqueleto organiza y sostiene el interior.', 'La membrana forma las rutas internas de filamentos; el citoesqueleto regula la entrada de nutrientes.', 'La membrana clasifica proteínas en vesículas; el citoesqueleto fabrica sus cadenas de aminoácidos.', 'Ambos forman barreras selectivas alrededor de la célula y cumplen la misma tarea de intercambio.', 'La membrana es el límite selectivo; el citoesqueleto es una red interna de soporte y transporte.']
  ]],
  ['citoplasma', [
    ['Ubica y razona', 'Una molécula está dentro de la membrana celular, pero fuera del núcleo y de los organelos membranosos. ¿En qué medio se encuentra?', 'En el citosol, que forma parte del citoplasma', 'Dentro del nucléolo', 'En el espacio exterior a la célula', 'Dentro de las crestas mitocondriales', 'El citosol es el medio acuoso del citoplasma que queda fuera de los organelos membranosos.'],
    ['Compara', '¿Cuál afirmación distingue correctamente al citoplasma del núcleo?', 'El citoplasma está fuera de la envoltura nuclear y contiene numerosos organelos.', 'El citoplasma abarca solo los organelos y excluye el medio acuoso que los rodea.', 'El núcleo incluye el medio que rodea a las mitocondrias, mientras el citoplasma guarda los cromosomas.', 'El citoplasma y el núcleo son dos nombres de la misma región acuosa dentro de la envoltura nuclear.', 'El núcleo es un compartimento delimitado; el citoplasma es la región celular exterior a su envoltura.'],
    ['Busca la excepción', '¿Qué afirmación NO describe correctamente al citoplasma de una célula animal?', 'Es un único organelo rodeado por su propia membrana interna.', 'Incluye el medio acuoso llamado citosol.', 'Contiene organelos y componentes del citoesqueleto.', 'En él ocurren numerosas reacciones celulares.', 'El citoplasma es una región que incluye el citosol y estructuras, no un solo organelo.'],
    ['Situación', 'Una reacción ocurre en el medio acuoso entre los organelos, fuera del núcleo. ¿Qué región amplia de la célula está participando?', 'Citoplasma', 'Nucléolo', 'Aparato de Golgi', 'Centriolo', 'Ese medio es el citosol, una parte del citoplasma. No toda reacción celular necesita ocurrir dentro de un organelo.']
  ]],
  ['nucleo', [
    ['Relaciona funciones', 'Una célula cambia qué genes utiliza para producir una proteína. ¿Dónde se encuentra la mayor parte del ADN que contiene esas instrucciones?', 'Núcleo', 'Aparato de Golgi', 'Peroxisoma', 'Membrana plasmática', 'El núcleo conserva la mayor parte del ADN. La regulación de sus genes influye en las proteínas que produce la célula.'],
    ['Si algo falla', 'El ADN nuclear se daña. ¿Qué proceso podría verse afectado directamente?', 'La lectura de instrucciones para producir ciertos ARN', 'La selección de paquetes ya formados dentro del Golgi', 'El paso de agua únicamente por canales de la membrana', 'La neutralización del peróxido únicamente dentro del peroxisoma', 'El ADN nuclear sirve como molde para producir ARN. Las otras tareas ocurren directamente en otras estructuras.'],
    ['Compara', '¿Qué relación entre núcleo y nucléolo es correcta?', 'El nucléolo es una región dentro del núcleo que participa en formar subunidades ribosómicas.', 'El nucléolo es la envoltura que rodea al núcleo y regula el paso por sus poros.', 'El núcleo almacena la mayor parte del ADN y el nucléolo empaqueta proteínas para su secreción.', 'El nucléolo es una región del citoplasma y recibe del núcleo proteínas para unirlas en cadenas.', 'El núcleo contiene la mayor parte del ADN y alberga al nucléolo, con una tarea especializada.'],
    ['Busca la excepción', '¿Cuál afirmación sobre el núcleo de una célula animal típica es INCORRECTA?', 'Es el único lugar de la célula donde puede existir ADN.', 'Contiene la mayor parte del ADN celular.', 'Su envoltura tiene poros para intercambios regulados.', 'Alberga una región llamada nucléolo.', 'Las mitocondrias poseen ADN propio. Por eso decir que todo el ADN está exclusivamente en el núcleo sería incorrecto.']
  ]],
  ['nucleolo', [
    ['Si algo falla', 'Una célula conserva sus ribosomas actuales, pero deja de ensamblar subunidades para formar otros nuevos. ¿Qué región podría estar afectada?', 'Nucléolo', 'Membrana plasmática', 'Mitocondria', 'Aparato de Golgi', 'El nucléolo participa en ensamblar subunidades ribosómicas. Los ribosomas existentes pueden seguir trabajando durante un tiempo.'],
    ['Compara', '¿Qué pareja de funciones diferencia al nucléolo de los ribosomas?', 'Nucléolo: prepara subunidades; ribosomas: ensamblan proteínas.', 'Nucléolo: ensambla proteínas; ribosomas: preparan subunidades nucleares.', 'Nucléolo: clasifica proteínas; ribosomas: las empaquetan para enviarlas.', 'Nucléolo: almacena todo el ADN; ribosomas: copian ese ADN para la división.', 'Preparar la maquinaria y usarla son tareas distintas: las subunidades se forman con participación del nucléolo.'],
    ['Situación', 'Se observa ARN ribosómico combinándose con proteínas dentro del núcleo. ¿Qué región se está estudiando?', 'Nucléolo', 'Retículo endoplasmático liso', 'Citoplasma', 'Peroxisoma', 'La combinación de ARN ribosómico y proteínas para armar subunidades sucede en el nucléolo.'],
    ['Busca la excepción', '¿Cuál acción NO es una tarea del nucléolo?', 'Empaquetar proteínas en vesículas para enviarlas a otros destinos', 'Participar en la producción de ARN ribosómico', 'Ensamblar subunidades de ribosomas', 'Contribuir a formar nueva maquinaria para fabricar proteínas', 'El empaquetamiento y la clasificación de proteínas corresponden al Golgi; el nucléolo se relaciona con subunidades ribosómicas.']
  ]],
  ['reticulo', [
    ['Situación', 'Una célula necesita producir más lípidos para sus membranas. ¿Qué región está especialmente relacionada con esa síntesis?', 'Retículo endoplasmático liso', 'Nucléolo', 'Ribosomas libres', 'Centriolo', 'El retículo liso participa en la síntesis de lípidos. El rugoso tiene ribosomas adheridos y se relaciona con proteínas.'],
    ['Sigue la ruta', 'Una proteína destinada a salir de la célula empieza a plegarse mientras entra en una red de membranas con ribosomas adheridos. ¿Qué estructura la recibe?', 'Retículo endoplasmático rugoso', 'Peroxisoma', 'Centriolo', 'Mitocondria', 'Muchas proteínas de secreción entran en el retículo rugoso al fabricarse; después pueden viajar al Golgi.'],
    ['Compara', '¿Qué diferencia entre retículo liso y rugoso es correcta?', 'El rugoso tiene ribosomas adheridos; el liso participa en producir lípidos.', 'El liso tiene ribosomas adheridos; el rugoso participa principalmente en producir lípidos.', 'Ambos tienen ribosomas adheridos; solo cambia el lugar de la célula en el que están.', 'El rugoso fabrica subunidades ribosómicas; el liso clasifica proteínas para su destino final.', 'Son regiones de una red de membranas. La presencia de ribosomas y sus funciones permiten distinguirlas.'],
    ['Si algo falla', 'Se fabrican cadenas de proteína, pero muchas de las destinadas a secreción no se pliegan bien dentro de su primer compartimento membranoso. ¿Qué estructura revisarías?', 'Retículo endoplasmático rugoso', 'Nucléolo', 'Centriolo', 'Peroxisoma', 'El retículo rugoso ayuda al plegamiento inicial de muchas proteínas de secreción, antes de que lleguen al Golgi.']
  ]],
  ['ribosomas', [
    ['Si algo falla', 'Hay ARN mensajero y aminoácidos disponibles, pero no se unen para formar proteínas. ¿Qué maquinaria puede estar fallando directamente?', 'Ribosomas', 'Aparato de Golgi', 'Membrana plasmática', 'Centriolo', 'Los ribosomas leen el ARN mensajero y unen aminoácidos. El Golgi trabaja con productos que ya han sido fabricados.'],
    ['Situación', 'Una célula debe fabricar muchas enzimas, que son proteínas. ¿Qué estructuras necesita para ensamblar sus cadenas de aminoácidos?', 'Ribosomas', 'Peroxisomas', 'Centriolos', 'Membranas plasmáticas', 'La producción de cualquier cadena de proteína requiere ribosomas, aunque otras estructuras ayuden con energía y procesamiento.'],
    ['Compara', 'Una proteína ya tiene su cadena completa, pero aún debe clasificarse y enviarse. ¿Qué reparto de tareas es correcto?', 'Los ribosomas ensamblan la cadena; el Golgi participa en procesarla y dirigirla.', 'El Golgi une los aminoácidos; los ribosomas eligen la vesícula de envío.', 'Los ribosomas clasifican el producto; el Golgi lee el ARN para ensamblar su cadena.', 'Los ribosomas y el Golgi cumplen la misma tarea: ensamblar la cadena de aminoácidos.', 'Ensamblar una proteína y dirigir su destino son procesos diferentes, con participación de ribosomas y Golgi.'],
    ['Busca la excepción', '¿Qué afirmación sobre los ribosomas es INCORRECTA?', 'Cada ribosoma es un saco rodeado por una membrana propia.', 'Unen aminoácidos para formar proteínas.', 'Pueden estar libres o adheridos al retículo.', 'Usan información del ARN mensajero.', 'Los ribosomas son complejos de ARN y proteínas sin membrana propia; no son vesículas.']
  ]],
  ['golgi', [
    ['Si algo falla', 'Una proteína se fabricó y pasó por el retículo, pero no recibió bien su clasificación para el destino final. ¿Qué organelo revisarías primero?', 'Aparato de Golgi', 'Nucléolo', 'Centriolo', 'Ribosomas libres', 'El Golgi modifica y clasifica muchos productos que recibe del retículo antes de su distribución.'],
    ['Sigue la ruta', '¿Qué recorrido representa mejor la ruta de muchas proteínas que serán secretadas?', 'Ribosomas del retículo → retículo → Golgi → vesículas hacia la membrana', 'Golgi → ribosomas del retículo → retículo → vesículas hacia la membrana', 'Ribosomas del retículo → Golgi → retículo → vesículas hacia la membrana', 'Retículo → vesículas hacia la membrana → Golgi → ribosomas del retículo', 'La proteína entra al retículo mientras se fabrica, pasa al Golgi y luego viaja en vesículas hacia la membrana.'],
    ['Situación', 'Dos proteínas ya fabricadas deben enviarse a lugares distintos. ¿Qué organelo contribuye a procesarlas y separarlas según su destino?', 'Aparato de Golgi', 'Centriolo', 'Nucléolo', 'Mitocondria', 'El Golgi ayuda a clasificar los productos para dirigirlos en vesículas a destinos diferentes.'],
    ['Busca la excepción', '¿Cuál tarea NO corresponde al aparato de Golgi?', 'Leer ARN mensajero para unir aminoácidos en una cadena', 'Modificar muchas proteínas que recibe', 'Clasificar productos según su destino', 'Participar en el empaquetamiento para transporte', 'La lectura del ARN mensajero y la unión de aminoácidos las realizan los ribosomas, antes del procesamiento en el Golgi.']
  ]],
  ['mitocondria', [
    ['Situación', 'Una célula muscular trabaja intensamente y requiere mucho ATP. ¿Qué organelo necesita especialmente para obtenerlo mediante respiración con oxígeno?', 'Mitocondria', 'Aparato de Golgi', 'Nucléolo', 'Centriolo', 'Las mitocondrias producen gran parte del ATP durante la respiración con oxígeno; el ATP permite realizar trabajo celular.'],
    ['Si algo falla', 'Se altera gravemente la membrana interna mitocondrial. ¿Qué consecuencia está más directamente relacionada?', 'Puede disminuir la producción de ATP por respiración celular.', 'Se interrumpe directamente el ensamblaje de subunidades ribosómicas en el nucléolo.', 'Se pierde directamente la clasificación de proteínas dentro del Golgi.', 'Se detiene directamente la descomposición del peróxido por la catalasa del peroxisoma.', 'La membrana interna contiene sistemas fundamentales para producir ATP; sus daños pueden reducir esa producción.'],
    ['Compara', '¿Qué diferencia entre mitocondria y peroxisoma está bien planteada?', 'La mitocondria produce gran parte del ATP; el peroxisoma procesa ciertos ácidos grasos y maneja peróxido.', 'La mitocondria neutraliza el peróxido mediante catalasa; el peroxisoma produce la mayor parte del ATP.', 'Ambos producen la mayor parte del ATP y solo se distinguen por el tamaño de sus membranas.', 'La mitocondria recibe y clasifica proteínas; el peroxisoma forma sus cadenas de aminoácidos.', 'Ambos intervienen en el metabolismo, pero sus tareas destacadas son diferentes.'],
    ['Relaciona forma y función', '¿Por qué los pliegues de la membrana interna de una mitocondria resultan útiles?', 'Aumentan la superficie disponible para procesos que producen ATP.', 'Permiten clasificar proteínas en vesículas según su destino final.', 'Proporcionan las rutas de filamentos para transportar vesículas por el citoplasma.', 'Forman los sitios donde se ensamblan subunidades ribosómicas para el núcleo.', 'Las crestas aumentan la superficie de una membrana que contiene sistemas de producción de ATP.']
  ]],
  ['citoesqueleto', [
    ['Situación', 'Una vesícula viaja por una ruta de filamentos dentro de la célula. ¿Qué estructura proporciona esos caminos?', 'Citoesqueleto', 'Nucléolo', 'Membrana plasmática', 'Peroxisoma', 'Las proteínas motoras pueden mover vesículas a lo largo de microtúbulos u otros filamentos del citoesqueleto.'],
    ['Si algo falla', 'Una célula pierde parte de su organización interna y le cuesta mantener su forma. ¿Qué red conviene revisar?', 'Citoesqueleto', 'Aparato de Golgi', 'Ribosomas', 'Nucléolo', 'El citoesqueleto contribuye al soporte, la forma y la organización interna, además del transporte.'],
    ['Compara', '¿Qué relación entre citoesqueleto y centriolo es correcta?', 'El citoesqueleto es una red de filamentos; el centriolo es un cilindro de microtúbulos asociado al centrosoma.', 'El citoesqueleto es un solo cilindro; el centriolo es toda la red de filamentos que cruza el citoplasma.', 'El citoesqueleto aparece solo al dividirse la célula; el centriolo es la red que sostiene la célula el resto del tiempo.', 'El citoesqueleto organiza subunidades ribosómicas; el centriolo las transporta hacia el retículo rugoso.', 'Un cilindro particular no equivale a toda la red de soporte y transporte celular.'],
    ['Busca la excepción', '¿Cuál función NO corresponde al citoesqueleto?', 'Ensamblar subunidades ribosómicas dentro del núcleo', 'Ayudar a mantener la forma celular', 'Servir de rutas para transporte interno', 'Participar en movimientos y cambios de forma', 'La formación de subunidades ribosómicas corresponde al nucléolo; el citoesqueleto aporta filamentos de soporte y movimiento.']
  ]],
  ['centriolo', [
    ['Ubica y razona', 'En el centrosoma se observan dos cilindros colocados aproximadamente en ángulo recto. ¿Cómo se llama cada cilindro?', 'Centriolo', 'Ribosoma', 'Peroxisoma', 'Nucléolo', 'Cada cilindro es un centriolo. El centrosoma incluye la pareja y el material que los rodea.'],
    ['Compara', '¿Cuál afirmación distingue correctamente al centriolo del centrosoma?', 'El centriolo es una parte cilíndrica; el centrosoma incluye centriolos y material organizador de microtúbulos.', 'Cada centriolo contiene un centrosoma completo; por eso el centrosoma es la parte más pequeña.', 'Son sinónimos: ambos nombres designan exactamente uno de los cilindros de microtúbulos.', 'El centriolo es un filamento disperso; el centrosoma es el conjunto de todos los filamentos del citoplasma.', 'No son sinónimos: el centriolo forma parte de una estructura más amplia, el centrosoma.'],
    ['Si algo falla', 'Se altera la estructura de los centriolos y su relación con el centrosoma. ¿Qué proceso podría verse afectado?', 'La organización del huso mitótico durante la división celular', 'La lectura directa del ARN mensajero por los ribosomas', 'La clasificación de proteínas dentro del Golgi', 'La descomposición del peróxido dentro del peroxisoma', 'Los centriolos forman parte del centrosoma, que organiza microtúbulos del huso para separar cromosomas. No toda célula sin centriolos es incapaz de dividirse.'],
    ['Relaciona funciones', 'Una estructura cilíndrica pasa a funcionar como cuerpo basal en la base de un cilio. ¿Con qué estructura está relacionada?', 'Centriolo', 'Mitocondria', 'Aparato de Golgi', 'Nucléolo', 'Los cuerpos basales se relacionan con los centriolos y organizan los microtúbulos de cilios y flagelos.']
  ]],
  ['peroxisoma', [
    ['Si algo falla', 'Se acumula peróxido de hidrógeno porque una enzima que lo descompone no funciona bien en su compartimento habitual. ¿Qué organelo revisarías?', 'Peroxisoma', 'Aparato de Golgi', 'Centriolo', 'Nucléolo', 'La catalasa del peroxisoma descompone el peróxido de hidrógeno, que en exceso puede causar daño.'],
    ['Situación', 'Un compartimento realiza oxidaciones de ciertos ácidos grasos y descompone el peróxido que algunas reacciones producen. ¿Cuál es?', 'Peroxisoma', 'Ribosoma', 'Centriolo', 'Nucléolo', 'Los peroxisomas combinan reacciones de oxidación con enzimas que manejan el peróxido de hidrógeno.'],
    ['Busca la excepción', '¿Cuál tarea NO corresponde al peroxisoma?', 'Clasificar proteínas para enviarlas en vesículas a diferentes destinos', 'Procesar ciertos ácidos grasos', 'Contener enzimas que descomponen peróxido de hidrógeno', 'Participar en el manejo de determinadas sustancias dañinas', 'La clasificación y el envío de proteínas corresponden al Golgi. El peroxisoma destaca por sus reacciones de oxidación.'],
    ['Razona', '¿Por qué resulta útil que reacciones que producen peróxido estén en un compartimento con enzimas que lo descomponen?', 'Facilita manejar ese producto y limitar el daño que podría causar.', 'Permite usar el peróxido como sustituto directo del ATP para todos los trabajos celulares.', 'Hace que el compartimento pueda clasificar proteínas para enviarlas al exterior.', 'Mantiene el peróxido acumulado sin transformarlo para que nunca salga del compartimento.', 'El peroxisoma reúne reacciones y enzimas que transforman el peróxido; así contribuye a proteger la célula.']
  ]]
];

export const REASONING_BANK = reasoning.flatMap(([structureId, entries]) =>
  entries.map(([kind, prompt, correct, ...rest], index) => {
    const explanation = rest.pop();
    const id = `razona-${structureId}-${index + 1}`;
    return {
      id, structureId, kind, prompt, explanation, correctId: `${id}-0`,
      choices: [correct, ...rest].map((text, option) => ({ id: `${id}-${option}`, text }))
    };
  })
);
