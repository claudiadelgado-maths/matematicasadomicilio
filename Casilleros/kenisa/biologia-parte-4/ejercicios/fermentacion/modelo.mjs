export const routes={
 lactica:{name:'Fermentación láctica',product:'Lactato',formula:'2 piruvatos → 2 lactatos',note:'Ruta homoláctica típica: no se libera CO₂ en la conversión de piruvato a lactato.'},
 alcoholica:{name:'Fermentación alcohólica',product:'Etanol',formula:'2 piruvatos → 2 etanoles + 2 CO₂',note:'El piruvato primero pierde CO₂ y forma acetaldehído; después se transforma en etanol y se regenera NAD⁺.'}
};
export function createCycle(route='lactica'){
 if(!routes[route])throw new RangeError('Ruta no válida');
 return {route,glucose:3,pyruvate:0,nad:2,nadh:0,atp:0,product:0,co2:0,cycles:0};
}
export function stepCycle(previous,action){
 const state={...previous};
 if(action==='glycolysis'){
  if(state.glucose===0)return {state,ok:false,message:'Ya utilizaste las tres glucosas de este modelo. Reinicia para repetir el recorrido.'};
  if(state.nad<2)return {state,ok:false,message:'Falta NAD⁺ disponible: los dos transportadores están como NADH. Regénéralos mediante fermentación antes de repetir la glucólisis.'};
  state.glucose--;state.pyruvate+=2;state.nad-=2;state.nadh+=2;state.atp+=2;
  return {state,ok:true,message:'Glucólisis: una glucosa dio dos piruvatos y 2 ATP netos. Dos NAD⁺ recibieron electrones y se transformaron en NADH. Ahora regenera NAD⁺.'};
 }
 if(action==='ferment'){
  if(state.pyruvate<2||state.nadh<2)return {state,ok:false,message:'Primero realiza glucólisis para obtener piruvato y NADH. Fermentar no genera ATP extra en estas dos rutas.'};
  state.pyruvate-=2;state.nadh-=2;state.nad+=2;state.product+=2;state.cycles++;if(state.route==='alcoholica')state.co2+=2;
  return {state,ok:true,message:`Se formaron ${state.route==='lactica'?'dos lactatos, sin liberar CO₂':'dos etanoles y dos CO₂'} y se regeneraron dos NAD⁺. El ATP sigue en ${state.atp}: esta etapa no añadió ATP. Puedes volver a realizar glucólisis.`};
 }
 throw new RangeError('Acción no válida');
}
export function yields(glucose){
 if(!Number.isInteger(glucose)||glucose<1||glucose>5)throw new RangeError('Usa de una a cinco glucosas');
 return {fermentation:2*glucose,aerobicMin:30*glucose,aerobicMax:32*glucose};
}
export const agents=[['bacterias','Bacterias lácticas'],['levaduras','Levaduras'],['musculo','Células musculares humanas']];
export const products=[['lactato','Lactato'],['etanol','Etanol y CO₂'],['oxigeno','Oxígeno y glucosa']];
export const foodCases=[
 {id:'pan',title:'Una masa que crece',icon:'pan',prompt:'Se añade levadura de panadería a una masa con azúcares disponibles. Su fermentación forma gas que queda atrapado. Relaciona quién actúa y qué produce.',agent:'levaduras',product:'etanol',why:'Saccharomyces cerevisiae es una levadura, un hongo unicelular. Produce etanol y CO₂; el gas atrapado en la masa ayuda a que aumente de volumen. El horneado modifica después la masa y elimina gran parte del etanol.'},
 {id:'yogur',title:'De leche a yogur',icon:'yogur',prompt:'Un cultivo de Lactobacillus delbrueckii subsp. bulgaricus y Streptococcus thermophilus transforma azúcares de la leche. Relaciona el grupo y el producto principal de su fermentación láctica.',agent:'bacterias',product:'lactato',why:'Son bacterias lácticas. La acidificación asociada a su actividad cambia sabor y textura de la leche. No son levaduras y el producto típico estudiado no es etanol.'},
 {id:'musculo',title:'Un esfuerzo intenso',icon:'musculo',prompt:'Durante una carrera intensa aumenta la transformación de piruvato en lactato dentro de las fibras musculares. ¿Quién realiza esa reacción y qué producto forma?',agent:'musculo',product:'lactato',why:'Las propias células musculares regeneran NAD⁺ al producir lactato. Pueden hacerlo aunque haya oxígeno: importa también la rapidez con que funciona la glucólisis. No se debe a levaduras en el músculo.'},
 {id:'queso',title:'El inicio de un queso',icon:'queso',prompt:'En la etapa descrita de elaboración de un queso, un cultivo de bacterias lácticas como Lactococcus lactis acidifica la leche. ¿Qué grupo interviene y cuál es el producto principal de esa ruta?',agent:'bacterias',product:'lactato',why:'Aquí se describe una fermentación láctica. La elaboración y maduración de quesos puede incluir otros microorganismos y procesos: no todos los quesos se explican por una sola fermentación.'},
 {id:'industria',title:'Etanol para la industria',icon:'industria',prompt:'En un proceso industrial controlado, Saccharomyces cerevisiae transforma azúcares mediante fermentación alcohólica. Relaciona el microorganismo y los productos.',agent:'levaduras',product:'etanol',why:'La levadura puede producir etanol y CO₂. La fermentación se aprovecha en biotecnología, por ejemplo para obtener bioetanol, además de sus usos alimentarios.'}
];
export function gradeFood(item,answers){
 const fields=['agent','product'];return {missing:fields.filter(k=>!answers[k]),correct:fields.filter(k=>answers[k]===item[k]),wrong:fields.filter(k=>answers[k]&&answers[k]!==item[k])};
}
export const caseOptions=[['lactica','Fermentación láctica'],['alcoholica','Fermentación alcohólica'],['aerobia','Respiración aerobia'],['anaerobia','Respiración anaerobia'],['falta','Falta información']];
export const cases=[
 ['Piruvato a lactato','Una célula reduce piruvato a lactato y regenera NAD⁺, sin cadena respiratoria en ese proceso.','lactica','El producto y la regeneración de NAD⁺ identifican la vía láctica. No se añade ATP directamente en esta conversión.'],
 ['Burbujas con etanol','Una levadura transforma piruvato y se detectan etanol y CO₂.','alcoholica','La combinación de etanol y CO₂ es característica de la ruta alcohólica típica.'],
 ['Oxígeno al final','Una cadena respiratoria entrega electrones al O₂ y produce agua.','aerobia','El oxígeno es el aceptor final en respiración aerobia. No es una reacción fermentativa.'],
 ['Nitrato al final','Una bacteria utiliza nitrato como aceptor final en su cadena respiratoria.','anaerobia','Hay cadena respiratoria y un aceptor distinto del O₂: respiración anaerobia.'],
 ['Un dato no basta','Un microorganismo obtiene ATP sin usar oxígeno, pero no sabes qué productos forma ni si utiliza una cadena.','falta','Ausencia de O₂ no distingue por sí sola fermentación y respiración anaerobia. Necesitas conocer el mecanismo.'],
 ['La ruta muscular','Una célula muscular transforma piruvato en lactato durante un esfuerzo intenso.','lactica','La célula regenera NAD⁺ por la ruta láctica. El lactato no es la causa directa del dolor muscular tardío.'],
 ['Leche que se acidifica','Un cultivo homoláctico de bacterias de yogur transforma azúcares y produce principalmente lactato.','lactica','La pista es el producto principal de esta ruta. En la conversión homoláctica no se libera CO₂.'],
 ['Masa con levadura','En una masa, levaduras de panadería producen etanol y el gas que la hace crecer.','alcoholica','El CO₂ forma burbujas atrapadas en la masa. La levadura es un hongo unicelular.'],
 ['Una célula de raíz','Una célula vegetal obtiene ATP mediante una cadena cuyo aceptor final es oxígeno.','aerobia','Las plantas también realizan respiración aerobia; no necesitan tener pulmones.'],
 ['Sulfato y cadena','Un microorganismo usa una cadena respiratoria que termina reduciendo sulfato en lugar de oxígeno.','anaerobia','La presencia de cadena y de un aceptor alternativo distingue la respiración anaerobia de la fermentación.'],
 ['Solo observas gas','Aparecen burbujas en un cultivo y no hay información sobre los productos ni los microorganismos.','falta','Las burbujas solas no prueban fermentación alcohólica: otros procesos también liberan gases.'],
 ['Fabricar bioetanol','Un cultivo de levaduras obtiene etanol y CO₂ a partir de azúcares mediante una ruta sin cadena respiratoria.','alcoholica','Se aprovecha la fermentación alcohólica en un proceso industrial controlado. La glucólisis aporta los 2 ATP netos por glucosa en el modelo estudiado.']
].map(([title,prompt,answer,why],i)=>({id:`caso-${i+1}`,title,prompt,answer,why}));
