export const BIOMOLECULES = [
  { id: 'agua', demoLabels: 'Medio acuoso · Transporte · Temperatura', name: 'Agua', short: 'Agua', color: '#236e91', tint: '#e7f4fb', memory: 'El medio donde sucede la vida', lead: 'La más abundante: aprox. 70–80% de la masa en muchas células.', facts: ['Es medio para reacciones y transporte de sustancias.', 'Ayuda a regular la temperatura.', 'Contribuye al volumen y la forma celular.'], note: 'El porcentaje varía según el tipo de célula. El agua es una sustancia inorgánica.', action: 'Mover las moléculas', demo: ['El agua es el medio en el que muchas sustancias pueden disolverse.', 'Ese medio facilita el transporte y muchas reacciones.', 'El agua también ayuda a amortiguar cambios de temperatura.'] },
  { id: 'carbohidratos', demoLabels: 'Glucosa → ATP → Trabajo celular', name: 'Carbohidratos (glúcidos)', short: 'Carbohidratos', color: '#93600d', tint: '#fff4d9', memory: 'Combustible rápido y etiquetas', lead: 'Una fuente principal de energía inmediata, como la glucosa.', facts: ['Se usan para obtener energía utilizable.', 'Algunos forman estructuras, como la celulosa vegetal.', 'En la superficie celular también ayudan al reconocimiento.'], note: 'No son solo combustible: sus cadenas pueden actuar como etiquetas celulares.', action: 'Usar la glucosa', demo: ['La glucosa aporta energía química.', 'La célula la transforma mediante reacciones para obtener ATP.', 'La energía del ATP permite trabajos celulares, como mover materiales. Los carbohidratos también tienen otras funciones.'] },
  { id: 'lipidos', demoLabels: 'Fosfolípidos → Dos capas → Membrana', name: 'Lípidos', short: 'Lípidos', color: '#9b5145', tint: '#fff0e8', memory: 'Reserva y barrera flexible', lead: 'Guardan energía a largo plazo y forman parte de las membranas.', facts: ['Las grasas son reservas de energía.', 'Los fosfolípidos forman la base de la membrana.', 'Contribuyen a protección, aislamiento y algunas hormonas.'], note: 'Hay diferentes lípidos: grasas, fosfolípidos y colesterol, entre otros.', action: 'Armar la membrana', demo: ['Los fosfolípidos tienen una cabeza y dos colas.', 'En agua pueden organizarse en dos capas.', 'Esa bicapa es la base de una membrana flexible.'] },
  { id: 'proteinas', demoLabels: 'Aminoácidos → Cadena → Plegamiento', name: 'Proteínas', short: 'Proteínas', color: '#994777', tint: '#fff0f7', memory: 'Las herramientas de la célula', lead: 'Son cadenas de aminoácidos que se pliegan para trabajar.', facts: ['Construyen y reparan estructuras.', 'Actúan como enzimas y transportadores.', 'Permiten movimiento y defensa, como los anticuerpos.'], note: 'No todas hacen lo mismo: su forma se relaciona con su función.', action: 'Unir aminoácidos', demo: ['Los aminoácidos son las piezas de una proteína.', 'Los ribosomas los unen en una cadena.', 'La cadena se pliega y puede realizar un trabajo específico.'] },
  { id: 'acidos', demoLabels: 'ADN → ARN → Proteína', name: 'Ácidos nucleicos (ADN y ARN)', short: 'Ácidos nucleicos', color: '#6252a0', tint: '#f1edff', memory: 'Instrucciones y mensajes', lead: 'Almacenan, transmiten y permiten usar la información genética.', facts: ['El ADN contiene las instrucciones.', 'El ARN participa en utilizar esas instrucciones.', 'Ambos están hechos de unidades llamadas nucleótidos.'], note: 'ADN → ARN → proteína es una ruta para expresar información, no una transformación literal del ADN en proteína.', action: 'Leer las instrucciones', demo: ['El ADN conserva la información genética.', 'Se produce ARN usando información del ADN.', 'El ARN mensajero guía a los ribosomas al fabricar proteínas.'] },
  { id: 'vitaminas', demoLabels: 'Vitamina + enzima → Apoyo a una reacción', name: 'Vitaminas', short: 'Vitaminas', color: '#3f773c', tint: '#edf7e8', memory: 'Pequeñas ayudas, grandes tareas', lead: 'Se necesitan en pequeñas cantidades para el funcionamiento normal.', facts: ['Algunas ayudan a enzimas en reacciones.', 'Contribuyen al crecimiento y la reparación.', 'Participan en el mantenimiento del organismo.'], note: 'No aportan energía como la glucosa. Vitaminas y sales minerales son grupos diferentes.', action: 'Ayudar a una reacción', demo: ['Una reacción necesita herramientas que funcionen bien.', 'Algunas vitaminas permiten formar ayudantes de las enzimas.', 'Así contribuyen a procesos de crecimiento, reparación y mantenimiento.'] },
  { id: 'sales', demoLabels: 'Iones → Membrana → Señal', name: 'Sales minerales', short: 'Sales minerales', color: '#436784', tint: '#eef3f9', memory: 'Iones que equilibran y comunican', lead: 'Incluyen calcio, sodio, potasio, hierro y fósforo, entre otros.', facts: ['Ayudan al equilibrio de agua y a enzimas.', 'Participan en impulsos nerviosos y contracción muscular.', 'En el organismo contribuyen a huesos y dientes.'], note: 'Son sustancias inorgánicas. Muchas funcionan como iones, por ejemplo Na⁺, K⁺ y Ca²⁺.', action: 'Enviar una señal', demo: ['Sodio y potasio pueden estar disueltos como iones.', 'Su movimiento a través de la membrana participa en señales eléctricas.', 'Otros minerales colaboran con músculos, enzimas y tejidos.'] }
];

const categories = BIOMOLECULES.map(({ id, short }) => ({ id, text: short }));
const functions = [
  ['agua', [
    ['Es la sustancia más abundante en muchas células y forma el medio en el que ocurren reacciones.', 'El agua constituye gran parte de la masa celular y proporciona un medio acuoso para muchas reacciones.'],
    ['Ayuda a disolver y mover numerosas sustancias dentro de la célula.', 'El agua actúa como disolvente de muchas sustancias y facilita su transporte.'],
    ['Contribuye a amortiguar cambios de temperatura en los seres vivos.', 'El agua puede absorber bastante calor con un cambio relativamente pequeño de temperatura.'],
    ['Su cantidad influye en el volumen de la célula: perder demasiada puede hacer que se reduzca.', 'El agua contribuye al volumen y a las condiciones internas. Su movimiento modifica cuánto ocupa la célula.'],
    ['En muchas células representa aproximadamente 70–80% de la masa, aunque la proporción varía.', 'Esa proporción aproximada corresponde al agua; no es un valor idéntico para toda célula.'],
    ['No es una reserva de combustible: sirve como entorno acuoso para la actividad celular.', 'El agua es el medio de muchas reacciones y transportes, pero no cumple el papel energético de la glucosa.'],
    ['Es una sustancia inorgánica que ayuda tanto al transporte como al mantenimiento del volumen celular.', 'El agua es inorgánica; su presencia favorece el transporte y contribuye al volumen de la célula.']
  ]],
  ['carbohidratos', [
    ['La glucosa de este grupo puede utilizarse como combustible de disponibilidad rápida.', 'La glucosa es un carbohidrato. Sus reacciones de degradación permiten obtener energía utilizable.'],
    ['Además de aportar energía, sus cadenas pueden ayudar a reconocer células en su superficie.', 'Cadenas de carbohidratos unidas a proteínas o lípidos funcionan como parte de las señales de reconocimiento.'],
    ['Incluyen azúcares y algunas cadenas largas como almidón o glucógeno.', 'Azúcares, almidón y glucógeno pertenecen al grupo de los carbohidratos o glúcidos.'],
    ['La celulosa pertenece a este grupo y contribuye a la estructura de la pared de las células vegetales.', 'La celulosa es un carbohidrato estructural. La célula animal no tiene pared de celulosa.'],
    ['Su papel energético inmediato se asocia con azúcares, en lugar de con una reserva de grasa a largo plazo.', 'Los azúcares son carbohidratos; las grasas de reserva a largo plazo pertenecen a los lípidos.'],
    ['También se llaman glúcidos y pueden servir como combustible, materiales o señales de reconocimiento.', 'Los carbohidratos tienen funciones diversas: energética, estructural y de reconocimiento.'],
    ['Una cadena de azúcares en la superficie celular puede actuar como etiqueta de identidad. ¿Qué grupo forma esa cadena?', 'La cadena de azúcares es un carbohidrato, aunque pueda estar unida a una proteína o un lípido.']
  ]],
  ['lipidos', [
    ['Forman la base de la membrana y también pueden guardar energía para usarla más adelante.', 'Los fosfolípidos forman la bicapa; otros lípidos, como las grasas, sirven de reserva.'],
    ['Las grasas de este grupo permiten almacenar energía a largo plazo.', 'Las grasas son lípidos de reserva. Esa función se diferencia del uso inmediato de glucosa.'],
    ['Incluyen moléculas con una cabeza y dos colas que se organizan en la membrana.', 'Los fosfolípidos son lípidos que se organizan en una bicapa en medios acuosos.'],
    ['El colesterol y algunas hormonas esteroideas pertenecen a este grupo.', 'El colesterol es un lípido y sirve de precursor de hormonas esteroideas. No todas las hormonas son lípidos.'],
    ['La grasa corporal puede ayudar con protección y aislamiento, además de guardar energía.', 'Las grasas son lípidos y cumplen funciones de reserva, protección y aislamiento en el organismo.'],
    ['Para recordar este grupo, piensa en una reserva de grasa y en la bicapa que delimita a la célula.', 'La reserva de grasa y los fosfolípidos de la membrana son ejemplos de funciones de los lípidos.'],
    ['No todos son grasas de reserva: algunos construyen membranas y otros participan en señales hormonales.', 'Los lípidos incluyen distintas clases, como grasas, fosfolípidos y esteroides.']
  ]],
  ['proteinas', [
    ['Sus unidades son aminoácidos, que se unen en cadenas y luego se pliegan.', 'Las proteínas están formadas por aminoácidos; el plegamiento permite muchos de sus trabajos.'],
    ['Los anticuerpos pertenecen a este grupo y contribuyen a la defensa del organismo.', 'Los anticuerpos son proteínas que reconocen componentes específicos de agentes extraños.'],
    ['Incluyen enzimas formadas por aminoácidos que aceleran reacciones.', 'Muchas enzimas son proteínas. La pregunta especifica una enzima formada por aminoácidos.'],
    ['Pueden funcionar como canales o transportadores en la membrana.', 'Muchas proteínas de membrana regulan el transporte de sustancias a través de ella.'],
    ['El colágeno de este grupo contribuye a la construcción y reparación de tejidos.', 'El colágeno es una proteína estructural; la reparación de tejidos requiere fabricar nuevas proteínas.'],
    ['La actina y la miosina pertenecen a este grupo y colaboran en el movimiento.', 'Actina y miosina son proteínas relacionadas con la contracción muscular y otros movimientos.'],
    ['Son herramientas diversas: unas construyen, otras transportan y otras ayudan a defender.', 'Las proteínas desempeñan muchas funciones distintas; sus formas y composición permiten esa diversidad.']
  ]],
  ['acidos', [
    ['Guardan y permiten transmitir las instrucciones hereditarias mediante ADN y ARN.', 'ADN y ARN son ácidos nucleicos y participan en el almacenamiento, transmisión y uso de la información genética.'],
    ['El ADN de este grupo conserva las instrucciones para el funcionamiento celular.', 'El ADN es un ácido nucleico que almacena información genética.'],
    ['El ARN mensajero de este grupo lleva información que los ribosomas usan para fabricar proteínas.', 'El ARN es un ácido nucleico; el ARN mensajero guía la fabricación de proteínas.'],
    ['Sus unidades se llaman nucleótidos, en lugar de aminoácidos.', 'Los ácidos nucleicos son cadenas de nucleótidos; las proteínas se construyen con aminoácidos.'],
    ['Se relacionan con la herencia y con el uso de mensajes genéticos, más que con almacenar grasa.', 'La información genética corresponde a los ácidos nucleicos, como ADN y ARN.'],
    ['En la ruta ADN → ARN → proteína, ¿a qué grupo pertenecen las primeras dos moléculas?', 'ADN y ARN son ácidos nucleicos. La proteína final pertenece a otro grupo de biomoléculas.'],
    ['Una copia de información genética pasa a las células hijas al dividirse. ¿Qué grupo incluye el ADN copiado?', 'El ADN es un ácido nucleico; su copia permite transmitir información genética a las células hijas.']
  ]],
  ['vitaminas', [
    ['Se requieren en pequeñas cantidades y algunas ayudan a las enzimas a realizar reacciones.', 'Algunas vitaminas permiten formar coenzimas, ayudantes en reacciones. Son necesarias en cantidades pequeñas.'],
    ['No son un combustible como la glucosa, pero ayudan al mantenimiento y crecimiento normales.', 'Las vitaminas contribuyen al funcionamiento del organismo sin aportar energía como los carbohidratos.'],
    ['Las moléculas identificadas como A, C o varias del grupo B pertenecen a este grupo.', 'A, C y las vitaminas B son ejemplos de vitaminas, no nombres de sales minerales.'],
    ['Su participación en reacciones favorece procesos de crecimiento y reparación.', 'Las vitaminas apoyan procesos necesarios para el crecimiento, la reparación y el mantenimiento.'],
    ['Algunas permiten formar pequeñas ayudas que colaboran con enzimas. No son las enzimas mismas.', 'Muchas vitaminas participan en formar coenzimas; se distinguen de las proteínas que forman las enzimas.'],
    ['Este grupo incluye la vitamina D, que ayuda a utilizar adecuadamente el calcio en el organismo.', 'La vitamina D es una vitamina; el calcio con el que se relaciona pertenece a los minerales.'],
    ['Son nutrientes orgánicos necesarios en pequeñas cantidades; sus funciones dependen de cuál se trate.', 'Las vitaminas son diversas y no todas realizan exactamente el mismo trabajo.']
  ]],
  ['sales', [
    ['Incluyen sodio y potasio, importantes para el equilibrio de agua y las señales nerviosas.', 'Sodio y potasio son minerales que funcionan como iones y participan en el equilibrio y las señales eléctricas.'],
    ['El calcio de este grupo participa en contracción muscular y en huesos y dientes.', 'El calcio es un mineral con funciones en señales y contracción; también forma parte de tejidos mineralizados.'],
    ['Aportan iones que pueden ayudar al funcionamiento de determinadas enzimas.', 'Algunas enzimas requieren iones minerales para funcionar, como magnesio o zinc.'],
    ['Incluyen hierro y fósforo, en lugar de vitaminas identificadas con letras.', 'Hierro y fósforo son elementos minerales que participan en moléculas y procesos del organismo.'],
    ['Son sustancias inorgánicas; muchas están disueltas como iones dentro y fuera de las células.', 'Las sales minerales pueden aportar iones, como Na⁺, K⁺ y Ca²⁺, importantes para la actividad celular.'],
    ['Cambios de sodio y potasio a través de la membrana participan en un impulso nervioso.', 'Esos iones minerales contribuyen a las diferencias eléctricas que permiten señales nerviosas.'],
    ['Ayudan al equilibrio hídrico y pueden contribuir a estructuras como huesos y dientes.', 'Las sales minerales cumplen funciones reguladoras y estructurales; no son reservas de energía como las grasas.']
  ]]
];

export const FUNCTION_BANK = functions.flatMap(([categoryId, entries]) => entries.map(([prompt, explanation], index) => ({
  id: `funcion-${categoryId}-${index + 1}`, categoryId, kind: 'Conecta función y biomolécula', prompt, explanation,
  correctId: categoryId, choices: categories
})));

// Ejemplos definidos con precisión; no se clasifican alimentos que contienen mezclas.
const examples = [
  ['agua', [
    ['H₂O', 'Es el medio acuoso de muchas reacciones.', 'H₂O es la fórmula del agua.'],
    ['Medio acuoso del citosol', 'Piensa en el disolvente más abundante.', 'El agua es el principal disolvente del citosol. El citoplasma completo también contiene otras sustancias.'],
    ['Disolver y transportar sustancias', 'Busca el medio acuoso que permite desplazarlas.', 'El agua disuelve muchas sustancias y facilita su transporte.'],
    ['Amortiguar cambios de temperatura', 'Esta sustancia puede absorber bastante calor.', 'El agua ayuda a amortiguar cambios de temperatura.'],
    ['Aportar gran parte del volumen celular', 'Piensa en cuánto ocupa el medio acuoso.', 'El agua contribuye al volumen y a las condiciones internas celulares.'],
    ['Aprox. 70–80% de la masa en muchas células', 'Es la sustancia más abundante de este recorrido.', 'Ese porcentaje aproximado corresponde al agua y varía según el tipo celular.'],
    ['Disolvente inorgánico de la célula', 'No es un ion como sodio o potasio.', 'El agua es una sustancia inorgánica que disuelve muchas moléculas e iones.'],
    ['Perderla puede reducir el volumen celular', 'Busca la sustancia que entra o sale por ósmosis.', 'El movimiento de agua puede cambiar el volumen de la célula.']
  ]],
  ['carbohidratos', [
    ['Glucosa', 'Es un azúcar usado como combustible.', 'La glucosa es un carbohidrato o glúcido.'],
    ['Fructosa', 'Pertenece al grupo de los azúcares.', 'La fructosa es un azúcar simple y pertenece a los carbohidratos.'],
    ['Glucógeno: cadena de azúcares', 'Sus piezas son moléculas de glucosa.', 'El glucógeno es un carbohidrato que almacena glucosa en animales; no es una grasa.'],
    ['Celulosa de la pared vegetal', 'Es un material estructural hecho de azúcares.', 'La celulosa es un carbohidrato estructural de las plantas. Las células animales no tienen esa pared.'],
    ['Cadena de azúcares para reconocimiento', 'Clasifica la cadena, no la molécula a la que se une.', 'Las cadenas de carbohidratos de superficie participan en el reconocimiento celular.'],
    ['Combustible inmediato en forma de azúcar', 'Piensa en glucosa, en vez de grasa de reserva.', 'Los azúcares son carbohidratos que la célula puede usar para obtener energía.'],
    ['Almidón: reserva vegetal de azúcares', 'Es una cadena larga construida con glucosa.', 'El almidón es un carbohidrato de reserva en plantas.'],
    ['Glúcidos', 'Es otro nombre del grupo al que pertenece la glucosa.', 'Glúcidos y carbohidratos son nombres del mismo grupo.']
  ]],
  ['lipidos', [
    ['Fosfolípidos de la membrana', 'Tienen cabeza y colas y forman una bicapa.', 'Los fosfolípidos son lípidos que forman la base de las membranas.'],
    ['Grasa de reserva a largo plazo', 'No es el combustible rápido de un azúcar.', 'Las grasas de reserva son lípidos.'],
    ['Colesterol', 'Forma parte de membranas y es precursor de esteroides.', 'El colesterol pertenece a los lípidos y tiene funciones diferentes de una grasa de reserva.'],
    ['Hormona esteroidea', 'Piensa en moléculas derivadas del colesterol.', 'Las hormonas esteroideas pertenecen a los lípidos. Otras hormonas, como la insulina, son proteínas.'],
    ['Triglicéridos almacenados', 'Son una forma de grasa de reserva.', 'Los triglicéridos son lípidos que permiten almacenar energía.'],
    ['Aislamiento mediante grasa corporal', 'La pista indica qué material brinda el aislamiento.', 'La grasa es un lípido y puede contribuir al aislamiento del organismo.'],
    ['Bicapa de fosfolípidos', 'Es la base flexible de una membrana.', 'La bicapa está construida con lípidos, aunque la membrana también contiene proteínas y otros componentes.'],
    ['Protección mediante depósitos de grasa', 'Clasifica la grasa que aporta protección.', 'Los depósitos de grasa son lípidos y pueden amortiguar y proteger.']
  ]],
  ['proteinas', [
    ['Anticuerpo', 'Es una herramienta de defensa hecha de aminoácidos.', 'Los anticuerpos son proteínas que participan en la defensa.'],
    ['Colágeno', 'Es una cadena de aminoácidos con función estructural.', 'El colágeno es una proteína de tejidos como piel y tendones.'],
    ['Enzima formada por aminoácidos', 'Clasifica su composición, no solo la palabra enzima.', 'Una enzima formada por aminoácidos pertenece a las proteínas.'],
    ['Actina y miosina', 'Colaboran en el movimiento y la contracción.', 'Actina y miosina son proteínas relacionadas con el movimiento.'],
    ['Canal de membrana hecho de aminoácidos', 'La membrana contiene más de un grupo de biomoléculas.', 'Ese canal es una proteína de membrana, no un fosfolípido.'],
    ['Hemoglobina', 'Es una molécula transportadora formada por cadenas de aminoácidos.', 'La hemoglobina es una proteína que transporta oxígeno y contiene hierro.'],
    ['Cadena de aminoácidos que se pliega', 'Los aminoácidos son sus piezas básicas.', 'Una cadena de aminoácidos puede formar una proteína.'],
    ['Insulina: hormona de aminoácidos', 'No todas las hormonas pertenecen a los lípidos.', 'La insulina es una hormona proteica; las hormonas esteroideas son de otro grupo.']
  ]],
  ['acidos', [
    ['ADN', 'Guarda información genética.', 'El ADN es un ácido nucleico.'],
    ['ARN mensajero', 'Lleva instrucciones para fabricar una proteína.', 'El ARN mensajero es un ácido nucleico utilizado por los ribosomas.'],
    ['ARN ribosómico', 'Su nombre indica que es un tipo de ARN.', 'El ARN ribosómico es un ácido nucleico que forma parte de los ribosomas, junto con proteínas.'],
    ['Cadena de nucleótidos', 'No son aminoácidos ni una reserva de grasa.', 'ADN y ARN son cadenas de nucleótidos.'],
    ['Información hereditaria en ADN', 'Clasifica la molécula que guarda la información.', 'El ADN pertenece a los ácidos nucleicos y conserva información hereditaria.'],
    ['ARN de transferencia', 'Participa en usar el mensaje genético para fabricar proteínas.', 'El ARN de transferencia es un ácido nucleico que lleva aminoácidos durante la fabricación de proteínas.'],
    ['ADN copiado para las células hijas', 'La copia permite transmitir instrucciones genéticas.', 'El ADN es un ácido nucleico y su copia transmite información a las células hijas.'],
    ['Mensaje de ARN leído por un ribosoma', 'Clasifica el mensaje, no el ribosoma que lo lee.', 'El ARN mensajero pertenece a los ácidos nucleicos.']
  ]],
  ['vitaminas', [
    ['Vitamina C', 'Su nombre la identifica como un micronutriente orgánico.', 'La vitamina C es una vitamina; participa, entre otras funciones, en la formación normal de colágeno.'],
    ['Vitamina D', 'Colabora con el uso del calcio, pero no es calcio.', 'La vitamina D es una vitamina que ayuda a regular el uso del calcio.'],
    ['Vitamina A', 'Es necesaria en pequeñas cantidades para funciones normales.', 'La vitamina A pertenece a las vitaminas y participa en procesos como la visión y el mantenimiento de tejidos.'],
    ['Vitamina B₁', 'Algunas vitaminas B ayudan en reacciones metabólicas.', 'La vitamina B₁ es una vitamina que contribuye a reacciones del metabolismo.'],
    ['Vitamina B₁₂', 'No es una proteína, aunque ayude a procesos celulares.', 'La vitamina B₁₂ pertenece a las vitaminas y participa en funciones como la síntesis de ADN.'],
    ['Vitamina E', 'Es un micronutriente orgánico, no una sal mineral.', 'La vitamina E pertenece a las vitaminas y tiene actividad antioxidante.'],
    ['Vitamina K', 'Se necesita en pequeñas cantidades para procesos normales.', 'La vitamina K es una vitamina y participa en procesos de coagulación.'],
    ['Vitamina B₂', 'Permite formar ayudantes de algunas enzimas.', 'La vitamina B₂ permite formar coenzimas que participan en reacciones metabólicas.']
  ]],
  ['sales', [
    ['Calcio · Ca²⁺', 'Es un ion relacionado con señales y contracción.', 'El calcio es un mineral. Su ion participa en señales, contracción y otros procesos.'],
    ['Sodio · Na⁺', 'Es un ion que participa en equilibrio hídrico y señales.', 'El sodio pertenece a los minerales y contribuye al equilibrio de agua y a señales eléctricas.'],
    ['Potasio · K⁺', 'Piensa en iones de las señales nerviosas.', 'El potasio es un mineral que participa en señales eléctricas y otras funciones celulares.'],
    ['Hierro · Fe', 'Clasifica el elemento, no la proteína que puede contenerlo.', 'El hierro es un mineral que puede formar parte de proteínas como la hemoglobina.'],
    ['Fosfato inorgánico', 'Es una forma mineral; no es una cadena completa de ADN.', 'El fosfato inorgánico pertenece a las sustancias minerales. También puede incorporarse a otras moléculas.'],
    ['Magnesio · Mg²⁺', 'Su ion ayuda a determinadas enzimas.', 'El magnesio es un mineral necesario para muchas reacciones.'],
    ['Zinc · Zn²⁺', 'Es un elemento mineral que participa en proteínas y enzimas.', 'El zinc es un mineral con funciones en numerosas proteínas.'],
    ['Minerales de huesos y dientes', 'Piensa en calcio y fosfato.', 'Las sales de calcio y fosfato contribuyen a la estructura mineralizada de huesos y dientes.']
  ]]
];

export const SORTING_BANK = examples.flatMap(([categoryId, entries]) => entries.map(([prompt, hint, explanation], index) => ({
  id: `clasifica-${categoryId}-${index + 1}`, categoryId, prompt, hint, explanation,
  correctId: categoryId, choices: categories
})));
