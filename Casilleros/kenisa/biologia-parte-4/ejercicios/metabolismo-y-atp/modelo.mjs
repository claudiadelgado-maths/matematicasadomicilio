export const routeCases=[
 ['proteina','Una proteína nueva','La célula une aminoácidos para formar una proteína.','anabolismo','Construye una molécula más compleja y requiere energía.'],
 ['glucogeno','Guardar unidades de glucosa','Se unen muchas moléculas de glucosa para formar glucógeno.','anabolismo','Formar el polímero de reserva es una construcción y requiere energía.'],
 ['glucosa','Aprovechar un combustible','Una ruta degrada glucosa y permite captar parte de su energía en ATP.','catabolismo','Es una degradación que permite obtener energía aprovechable; algunas etapas pueden requerir inversión.'],
 ['grasas','Movilizar una reserva','La célula degrada ácidos grasos para aprovechar su energía.','catabolismo','Los ácidos grasos se degradan mediante rutas catabólicas.'],
 ['adn','Prepararse para dividirse','Se incorporan nucleótidos para sintetizar una nueva molécula de ADN.','anabolismo','Sintetizar una macromolécula a partir de unidades pequeñas es anabolismo.'],
 ['membrana','Renovar la membrana','La célula sintetiza nuevos fosfolípidos a partir de componentes más pequeños.','anabolismo','Se construyen moléculas que serán parte de una membrana.'],
 ['reserva','Recuperar piezas de una reserva','La célula degrada glucógeno para movilizar sus unidades.','catabolismo','Se descompone una reserva. No significa que cada enlace roto produzca ATP directamente.'],
 ['reciclar','Reciclar una proteína','Una proteína celular deteriorada se degrada en fragmentos y aminoácidos.','catabolismo','Degradar es el criterio. Este proceso puede requerir energía en algunas etapas; no todas las degradaciones producen ATP directamente.'],
 ['almidon','Construir una reserva vegetal','Una célula vegetal incorpora unidades de glucosa a una molécula de almidón.','anabolismo','Se forma una reserva mediante síntesis, con gasto de energía.'],
 ['azucares','Construir materia orgánica','Una célula fotosintética utiliza energía para fabricar azúcares a partir de sustancias más sencillas.','anabolismo','La síntesis de materia orgánica es anabólica. La energía luminosa permite sostener el proceso.']
].map(([id,title,clue,answer,why])=>({id,title,clue,answer,why}));

export const energyOptions=[['reserva','Energía almacenada'],['liberacion','Aprovechar energía del nutriente'],['uso','Utilizar ATP para trabajo'],['pasivo','Paso sin ATP directo']].map(([id,name])=>({id,name}));
export const energyCases=[
 ['grasa','Una reserva que espera','Una gota de grasa ya formada almacena recursos para un uso posterior. ¿Qué aspecto se describe?','reserva','Se describe el almacenamiento, no el proceso de construir o degradar esa grasa.'],
 ['glucogeno','Combustible guardado','Un gránulo de glucógeno ya formado conserva unidades que podrán movilizarse después.','reserva','Es una reserva. Formarlo antes sí requirió energía; la pregunta se centra en su función actual.'],
 ['glucosa','Del combustible al ATP','Una ruta degrada glucosa y acopla parte de la energía disponible a la regeneración de ATP.','liberacion','Se aprovecha energía química de un nutriente. No se está describiendo el trabajo que utilizará ese ATP después.'],
 ['lipido','Usar energía de las grasas','La degradación de ácidos grasos contribuye a obtener energía para formar ATP.','liberacion','Se transforma la energía de una reserva; no se crea energía de la nada.'],
 ['bomba','Mantener un gradiente','La bomba sodio-potasio transforma ATP en ADP y fosfato para transportar iones.','uso','El ATP se utiliza para impulsar transporte activo, como en la actividad 1.'],
 ['musculo','Contraer un músculo','Proteínas motoras acoplan el uso de ATP a movimientos que producen contracción.','uso','Se está usando ATP para realizar trabajo mecánico. Su energía se transfiere al movimiento de proteínas motoras.'],
 ['oxigeno','Oxígeno a favor','El O₂ cruza directamente la bicapa a favor de su gradiente.','pasivo','La difusión simple no gasta ATP directamente en ese paso. La célula sí necesita energía para su mantenimiento.'],
 ['agua','Agua por una acuaporina','El agua se mueve por ósmosis a través de canales adecuados.','pasivo','Una acuaporina facilita el paso pasivo de agua. Usar una proteína no significa usar ATP directamente.']
].map(([id,title,clue,answer,why])=>({id,title,clue,answer,why}));

export const enzymes=[
 {id:'amilasa',name:'Amilasa',substrate:'almidon',product:'fragmentos',clue:'Ayuda a descomponer un polisacárido de reserva vegetal.',why:'La amilasa actúa sobre almidón y produce carbohidratos más pequeños. El almidón es el sustrato; la amilasa es el catalizador.'},
 {id:'lactasa',name:'Lactasa',substrate:'lactosa',product:'monosacaridos',clue:'Actúa sobre un azúcar presente en la leche.',why:'La lactasa descompone lactosa en glucosa y galactosa. La enzima puede volver a actuar después de liberar los productos.'},
 {id:'catalasa',name:'Catalasa',substrate:'peroxido',product:'agua-oxigeno',clue:'Ayuda a eliminar peróxido de hidrógeno que puede dañar la célula.',why:'La catalasa facilita la descomposición del peróxido de hidrógeno en agua y oxígeno. No aporta por sí misma energía ni se convierte en esos productos.'}
];
export const substrates=[['almidon','Almidón'],['lactosa','Lactosa'],['peroxido','Peróxido de hidrógeno']];
export const products=[['fragmentos','Carbohidratos más pequeños'],['monosacaridos','Glucosa y galactosa'],['agua-oxigeno','Agua y oxígeno']];
export function gradeEnzyme(enzyme,answers){
 const fields=['substrate','product'];return {missing:fields.filter(f=>!answers[f]),wrong:fields.filter(f=>answers[f]&&answers[f]!==enzyme[f]),correct:fields.filter(f=>answers[f]===enzyme[f]).length};
}

export function createATP(){return {form:'ATP',energy:false,cycles:0,uses:0};}
export function actATP(state,action){
 if(!['use','supply','regenerate'].includes(action))throw new RangeError('Acción de ATP inválida.');
 const next={...state};let ok=false,message='';
 if(action==='use'){
  if(state.form==='ADP')message='Ahora tienes ADP. Aporta energía y regenera ATP antes de impulsar otro ciclo de la bomba.';
  else{next.form='ADP';next.energy=false;next.uses++;ok=true;message='ATP + agua → ADP + fosfato. La hidrólisis se acopla a un ciclo de la bomba: salen 3 Na⁺ y entran 2 K⁺. El fosfato no desaparece.';}
 }
 if(action==='supply'){
  if(state.form==='ATP')message='Este ATP ya está formado. Primero úsalo; después necesitarás energía para regenerarlo.';
  else if(state.energy)message='Ya aportaste energía para este paso. Ahora regenera ATP con ADP y fosfato.';
  else{next.energy=true;ok=true;message='Aportaste energía de la transformación de nutrientes. Ahora puede acoplarse a la formación de ATP a partir de ADP y fosfato.';}
 }
 if(action==='regenerate'){
  if(state.form==='ATP')message='Ya tienes ATP. Regenerar significa volver a formarlo a partir de ADP y fosfato.';
  else if(!state.energy)message='Falta un aporte de energía. ADP y fosfato no se convierten en ATP simplemente por juntarlos.';
  else{next.form='ATP';next.energy=false;next.cycles++;ok=true;message='ATP regenerado: vuelve a tener tres fosfatos. El aporte energético se utilizó en la síntesis; no se creó energía de la nada.';}
 }
 return {state:next,ok,message};
}

// Enzimas hipotéticas: resultados cualitativos, sin porcentajes o temperaturas fisiológicas.
export const conditionEnzymes={A:{name:'Enzima A',preferredPH:'neutro'},B:{name:'Enzima B',preferredPH:'acido'}};
export function enzymeActivity({enzyme,temperature,ph,damaged=false}){
 if(!conditionEnzymes[enzyme]||!['fria','moderada','extrema'].includes(temperature)||!['acido','neutro','basico'].includes(ph))throw new RangeError('Condición enzimática no válida.');
 if(damaged)return {level:'inactiva',damaged:true,title:'La muestra sigue inactiva.',why:'Esta muestra se desnaturalizó durante un ensayo anterior. En este modelo, enfriarla o cambiar el pH no recupera su estructura: necesitas una muestra nueva.'};
 if(temperature==='extrema')return {level:'inactiva',damaged:true,title:'Calor extremo: pierde su función.',why:'En este modelo, el calor extremo desnaturaliza la enzima de forma irreversible. El sitio activo deja de funcionar. Las condiciones reales dependen de cada enzima.'};
 const favorable=ph===conditionEnzymes[enzyme].preferredPH;
 if(temperature==='fria'||!favorable)return {level:'lenta',damaged:false,title:'Actividad baja.',why:[temperature==='fria'?'El frío ralentiza la reacción sin destruir necesariamente la enzima.':'',!favorable?'Este pH no es el favorable para la enzima elegida y reduce su actividad.':'','La muestra permanece funcional en esta condición del modelo.'].filter(Boolean).join(' ')};
 return {level:'alta',damaged:false,title:'Actividad alta en este modelo.',why:'La temperatura moderada y el pH favorable permiten una actividad alta. Otra enzima puede preferir otras condiciones: no existe un pH óptimo universal.'};
}
export const experiments=[
 {id:'frio',name:'Frío',enzyme:'A',temperature:'fria',ph:'neutro',question:'La enzima A está en su pH favorable, pero la muestra está fría. ¿Qué actividad predices?'},
 {id:'favorable',name:'Condición favorable',enzyme:'A',temperature:'moderada',ph:'neutro',question:'La enzima A está a temperatura moderada y pH neutro. ¿Qué actividad predices?'},
 {id:'calor',name:'Calor extremo',enzyme:'A',temperature:'extrema',ph:'neutro',question:'¿Tener el pH favorable protege a la enzima A de un calentamiento extremo?'},
 {id:'ph',name:'Cambiar el pH',enzyme:'A',temperature:'moderada',ph:'acido',question:'Solo cambia el pH respecto a la condición favorable de A. ¿Qué actividad predices?'},
 {id:'otra',name:'Otra enzima',enzyme:'B',temperature:'moderada',ph:'acido',question:'La enzima B prefiere pH ácido. ¿Qué actividad predices en estas condiciones?'}
];
