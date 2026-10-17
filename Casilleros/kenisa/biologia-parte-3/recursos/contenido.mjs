export const structures = [
  { id: 'membrana', name: 'Membrana plasmática', x: 440, y: 210, cue: 'El límite verde más interno', function: 'Regula la entrada y salida de sustancias.', detail: 'Separa el interior celular del entorno. Está presente tanto en procariotas como en eucariotas.', question: 'La célula necesita controlar qué entra y qué sale. ¿Qué estructura realiza esa función?' },
  { id: 'citoplasma', name: 'Citoplasma', x: 155, y: 242, cue: 'El medio claro del interior', function: 'Es el medio donde se encuentran los componentes y ocurren muchas reacciones.', detail: 'No es un espacio vacío: aquí se desarrollan procesos necesarios para la vida.', question: '¿Cómo se llama el medio interno donde se encuentran los componentes y ocurren muchas reacciones?' },
  { id: 'nucleoide', name: 'Nucleoide', x: 295, y: 205, cue: 'La región con el hilo violeta de ADN', function: 'Contiene la mayor parte del ADN de la procariota.', detail: 'Es una región del citoplasma, NO un núcleo. No hay una membrana que la encierre.', question: '¿Qué región contiene la mayor parte del ADN sin estar rodeada por una membrana?' },
  { id: 'ribosomas', name: 'Ribosomas', x: 203, y: 153, cue: 'Los pequeños puntos azules', function: 'Fabrican proteínas.', detail: 'Las procariotas sí tienen ribosomas. No son organelos rodeados por una membrana.', question: 'La bacteria necesita fabricar proteínas. ¿Qué estructuras se encargan de hacerlo?' },
  { id: 'pared', name: 'Pared celular', x: 150, y: 132, cue: 'La capa menta, fuera de la membrana', function: 'Aporta forma, soporte y protección.', detail: 'Está en la mayoría de las procariotas. Tener pared no basta para clasificar: plantas y hongos también la tienen.', question: '¿Qué capa aporta forma, soporte y protección por fuera de la membrana plasmática?' },
  { id: 'flagelo', name: 'Flagelo', x: 567, y: 211, cue: 'La prolongación larga y ondulada', function: 'Permite el movimiento en algunas bacterias.', detail: 'No todas las bacterias tienen flagelo. Su forma y número pueden variar.', question: '¿Qué prolongación ayuda a algunas bacterias a desplazarse?' },
  { id: 'capsula', name: 'Cápsula', x: 275, y: 95, cue: 'La cubierta lila más externa', function: 'Ayuda a proteger y a adherirse a superficies.', detail: 'Es una cubierta adicional presente en algunas bacterias; no es lo mismo que la pared celular.', question: '¿Qué cubierta adicional puede ayudar a algunas bacterias a protegerse y adherirse a superficies?' },
  { id: 'plasmidos', name: 'Plásmidos', x: 379, y: 248, cue: 'Los pequeños anillos naranjas de ADN', function: 'Son moléculas pequeñas de ADN adicional.', detail: 'Algunas bacterias los tienen. Sus genes pueden aportar ventajas, como resistencia a ciertos antibióticos. No son núcleos.', question: '¿Cómo se llaman las pequeñas moléculas de ADN adicional que pueden aportar ventajas a algunas bacterias?' }
];

export const categories = [
  { id: 'nucleo', name: 'La diferencia clave', summary: 'Procariota: sin núcleo delimitado por membrana. Eucariota: con núcleo.' },
  { id: 'adn', name: 'Dónde está el ADN', summary: 'Nucleoide y núcleo no son lo mismo.' },
  { id: 'ejemplos', name: 'Reconocer organismos', summary: 'Bacterias y arqueas son procariotas; los hongos son eucariotas.' },
  { id: 'comun', name: 'Lo que comparten', summary: 'Ambos tipos tienen ADN y ribosomas.' },
  { id: 'intercambio', name: 'Membrana e intercambio', summary: 'La membrana plasmática regula entradas y salidas en ambos tipos.' },
  { id: 'bacteria', name: 'Estructuras bacterianas', summary: 'Pared: soporte. Plásmidos: ADN adicional en algunas bacterias.' },
  { id: 'funciones', name: 'Cada estructura, una función', summary: 'Flagelo: movimiento. Mitocondria: producción de ATP.' },
  { id: 'organelos', name: 'Organelos membranosos', summary: 'Las procariotas no tienen mitocondrias ni aparato de Golgi.' },
  { id: 'diversidad', name: 'Diversidad eucariota', summary: 'Hay eucariotas unicelulares, como las levaduras, y pluricelulares.' },
  { id: 'pistas', name: 'Evitar confusiones', summary: 'Ser unicelular no implica ser procariota. Busca cómo está organizado el ADN.' }
];

// Banco de 20 preguntas de la guía del docente. Índices de respuesta desde cero.
const rawQuestions = [
  ['nucleo', '¿Cuál es una característica de las células procariotas?', ['Tienen un núcleo definido.', 'No tienen un núcleo rodeado por membrana.', 'Tienen mitocondrias.'], 1, 'La clave es la ausencia de un núcleo delimitado por membrana. Eso no significa que carezcan de ADN.'],
  ['adn', '¿Dónde se encuentra principalmente el ADN de una célula procariota?', ['En el nucléolo.', 'En las mitocondrias.', 'En el nucleoide.'], 2, 'El nucleoide es la región del citoplasma que contiene la mayor parte del ADN procariota; no tiene una membrana alrededor.'],
  ['ejemplos', '¿Cuál de los siguientes organismos es procariota?', ['Una bacteria.', 'Un hongo.', 'Una planta.'], 0, 'Las bacterias son procariotas. Los hongos y las plantas tienen células eucariotas.'],
  ['comun', '¿Qué estructuras fabrican proteínas en ambos tipos celulares?', ['Los ribosomas.', 'El núcleo.', 'Las mitocondrias.'], 0, 'Los ribosomas ensamblan proteínas y se encuentran tanto en procariotas como en eucariotas.'],
  ['intercambio', '¿Qué estructura está presente en una célula procariota?', ['Aparato de Golgi.', 'Membrana plasmática.', 'Núcleo.'], 1, 'Las procariotas poseen membrana plasmática, aunque no tienen núcleo ni aparato de Golgi.'],
  ['bacteria', '¿Cuál es una función de la pared celular?', ['Almacenar el ADN principal.', 'Fabricar proteínas.', 'Dar forma y protección.'], 2, 'La pared aporta soporte, forma y protección. No debe confundirse con la membrana que regula el intercambio.'],
  ['funciones', '¿Qué estructura permite el movimiento de algunas bacterias?', ['El flagelo.', 'El núcleo.', 'El aparato de Golgi.'], 0, 'Algunas bacterias usan flagelos para desplazarse. No todas las bacterias los poseen.'],
  ['ejemplos', '¿Cuál de los siguientes organismos es eucariota?', ['Una arquea.', 'Un champiñón.', 'Una cianobacteria.'], 1, 'El champiñón es un hongo y sus células son eucariotas. Arqueas y cianobacterias son procariotas.'],
  ['nucleo', '¿Cuál es una característica fundamental de las células eucariotas?', ['Poseen un núcleo rodeado por membrana.', 'Tienen su ADN principal en un nucleoide.', 'No tienen ADN.'], 0, 'El núcleo rodeado por membrana caracteriza la organización eucariota y contiene la mayor parte de su ADN.'],
  ['comun', '¿Cuál de estas afirmaciones es correcta?', ['Solo las eucariotas tienen ADN.', 'Solo las procariotas tienen ribosomas.', 'Ambos tipos celulares tienen ADN y ribosomas.'], 2, 'ADN y ribosomas forman parte de ambos tipos de organización celular, junto con membrana y citoplasma.'],
  ['intercambio', '¿Qué estructura regula la entrada y salida de sustancias en ambos tipos celulares?', ['El núcleo.', 'La membrana plasmática.', 'El centriolo.'], 1, 'La membrana plasmática es la barrera selectiva que regula el intercambio con el entorno.'],
  ['organelos', '¿Qué estructura NO está presente en una célula procariota?', ['Citoplasma.', 'Ribosomas.', 'Mitocondrias.'], 2, 'Las procariotas no poseen mitocondrias. Aun así obtienen energía mediante otros procesos, asociados al citoplasma y a su membrana.'],
  ['adn', '¿Qué contiene principalmente el nucleoide?', ['El ADN principal de la célula procariota.', 'La energía para la fotosíntesis.', 'Las proteínas que se van a fabricar.'], 0, 'El nucleoide contiene la mayor parte de la información genética procariota. Los ribosomas fabrican proteínas.'],
  ['diversidad', '¿Cuál es un organismo unicelular eucariota?', ['Escherichia coli.', 'Una levadura.', 'Una arquea.'], 1, 'Una levadura es un hongo unicelular eucariota. Ser unicelular no basta para identificar una procariota.'],
  ['pistas', '¿Qué afirmación es INCORRECTA?', ['Las bacterias son procariotas.', 'Las células animales son eucariotas.', 'Todos los organismos unicelulares son procariotas.'], 2, 'Levaduras y amebas son ejemplos de eucariotas unicelulares. El número de células y el tipo celular son características distintas.'],
  ['funciones', '¿Cuál es una función principal de las mitocondrias?', ['Producir ATP para la célula.', 'Almacenar todo el ADN celular.', 'Formar la pared celular.'], 0, 'Las mitocondrias transforman energía de los nutrientes en ATP utilizable. El núcleo conserva la mayor parte del ADN eucariota.'],
  ['pistas', 'Un organismo unicelular tiene ADN en un nucleoide, citoplasma y ribosomas, pero no núcleo. ¿Qué organización celular presenta?', ['Eucariota.', 'Procariota.', 'Animal.'], 1, 'La combinación de ADN en un nucleoide y ausencia de núcleo indica organización procariota. Tener ADN y ribosomas no la convierte en eucariota.'],
  ['diversidad', '¿Qué grupo reúne únicamente organismos eucariotas?', ['Bacterias y arqueas.', 'Bacterias y hongos.', 'Animales, plantas y hongos.'], 2, 'Animales, plantas y hongos son eucariotas. También lo son los protistas, como las amebas.'],
  ['bacteria', '¿Qué son los plásmidos?', ['Organelos que producen proteínas.', 'Pequeñas moléculas de ADN adicional presentes en algunas bacterias.', 'Estructuras del núcleo.'], 1, 'Los plásmidos son ADN adicional; pueden llevar genes que aporten ventajas. No están presentes en todas las bacterias.'],
  ['organelos', '¿Cuál es una diferencia entre ambos tipos celulares?', ['Las eucariotas tienen organelos membranosos; las procariotas no.', 'Las procariotas no tienen membrana plasmática.', 'Las eucariotas no tienen ribosomas.'], 0, 'Mitocondrias y Golgi son ejemplos de organelos membranosos eucariotas. Ambos tipos tienen membrana plasmática y ribosomas.']
];
export const bank = rawQuestions.map(([categoryId, prompt, options, answer, explanation], index) => ({
  id: `p${index + 1}`, categoryId, prompt, explanation, kind: 'Piensa y responde',
  correctId: `p${index + 1}-${answer}`,
  choices: options.map((text, i) => ({ id: `p${index + 1}-${i}`, text }))
}));

const examples = [
  ['Escherichia coli', 'Una bacteria que puede vivir en el intestino.', 'bacteria', 'pro', 'Es una bacteria: su ADN principal se organiza en un nucleoide.'],
  ['Célula de la piel', 'Una célula viva de la capa basal de tu piel.', 'piel', 'eu', 'Es una célula animal, con núcleo y organelos membranosos.'],
  ['Cianobacteria', 'Una bacteria que realiza fotosíntesis.', 'ciano', 'pro', 'Hacer fotosíntesis no la convierte en planta: las cianobacterias son bacterias procariotas.'],
  ['Levadura', 'Un hongo formado por una sola célula.', 'levadura', 'eu', 'Es un hongo unicelular con núcleo. Unicelular no equivale a procariota.'],
  ['Célula vegetal', 'Una célula de una hoja.', 'planta', 'eu', 'Las plantas son eucariotas. Su pared celular no las convierte en procariotas.'],
  ['Arquea', 'Un microorganismo del dominio Archaea.', 'arquea', 'pro', 'Las arqueas tienen organización procariota, aunque pertenecen a un dominio distinto al de las bacterias.'],
  ['Ameba', 'Un organismo de una sola célula que cambia de forma.', 'ameba', 'eu', 'Es un protista unicelular eucariota: posee núcleo y organelos membranosos.'],
  ['Célula muscular', 'Una célula que forma parte de un músculo.', 'musculo', 'eu', 'Es una célula animal eucariota. Sus mitocondrias ayudan a suministrar ATP.'],
  ['Bacteria del yogur', 'Una bacteria que participa en la fermentación de la leche.', 'yogur', 'pro', 'Las bacterias que se usan para elaborar yogur son procariotas. Ser bacteria no implica causar enfermedades.'],
  ['Hongo', 'Un champiñón: un hongo con muchas células.', 'hongo', 'eu', 'Los hongos tienen células eucariotas, aunque poseen pared celular.'],
  ['Una pista microscópica', 'Organismo unicelular sin núcleo, pero con ADN y ribosomas.', 'pista', 'pro', 'La organización descrita es procariota. La ausencia de núcleo no implica ausencia de ADN.'],
  ['Mira por dentro', 'Una célula con núcleo y mitocondrias.', 'pista', 'eu', 'El núcleo y las mitocondrias indican organización eucariota.'],
  ['Sigue el ADN', 'Su ADN principal está en una región llamada nucleoide.', 'pista', 'pro', 'El nucleoide es una región sin membrana propia, característica de las procariotas.'],
  ['Compartimentos internos', 'Una célula con organelos membranosos, como el aparato de Golgi.', 'pista', 'eu', 'Los organelos rodeados por membranas son característicos de la organización eucariota.']
];
export const cards = examples.map(([name, clue, icon, correctId, explanation], index) => ({
  id: `c${index + 1}`, categoryId: 'clasificacion', name, clue, icon, correctId, explanation,
  choices: [{id:'pro',text:'Procariota'}, {id:'eu',text:'Eucariota'}]
}));
