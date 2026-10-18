export const stages = [
 {id:'glucolisis',name:'Glucólisis',place:'Citosol',short:'Una glucosa → dos piruvatos',detail:'Comienza fuera de la mitocondria, en la parte líquida del citoplasma. Una glucosa de seis carbonos se transforma en dos piruvatos de tres carbonos.',energy:'Se invierten 2 ATP y se forman 4: la ganancia neta es 2 ATP. También se forman 2 NADH.',key:'No utiliza oxígeno directamente. Tampoco libera CO₂ en esta ruta.'},
 {id:'piruvato',name:'Oxidación del piruvato',place:'Matriz mitocondrial',short:'El paso de enlace hacia Krebs',detail:'En una célula eucariota, el piruvato entra a la mitocondria. Cada piruvato se transforma en acetil-CoA, que aporta el grupo acetilo al ciclo de Krebs.',energy:'Por glucosa se forman 2 acetil-CoA y 2 NADH, y se liberan 2 CO₂. Este paso no produce ATP directamente.',key:'El piruvato no entra sin cambios al ciclo: primero se transforma en acetil-CoA.'},
 {id:'krebs',name:'Ciclo de Krebs',place:'Matriz mitocondrial',short:'Extraer electrones y liberar CO₂',detail:'El grupo acetilo se incorpora a una ruta cíclica. En el conjunto de sus reacciones se libera CO₂ y se cargan transportadores de electrones.',energy:'Por glucosa, dos vueltas producen 6 NADH, 2 FADH₂ y 2 ATP o GTP equivalentes; se liberan 4 CO₂.',key:'Krebs produce poco ATP directamente. Su gran aporte son los electrones que transportan NADH y FADH₂.'},
 {id:'cadena',name:'Cadena y fosforilación oxidativa',place:'Membrana interna mitocondrial',short:'Aquí se forma la mayor parte del ATP',detail:'NADH y FADH₂ entregan electrones a la cadena. Su transferencia permite acumular H⁺ a un lado de la membrana. Al regresar por la ATP sintasa, los H⁺ impulsan la formación de ATP a partir de ADP y fosfato.',energy:'El oxígeno recibe los electrones al final y, junto con H⁺, forma agua. Esta etapa suele aportar alrededor de 26–28 ATP por glucosa.',key:'Los electrones circulan por la cadena; los H⁺ atraviesan la ATP sintasa. No son la misma partícula.'}
];
export const expectedOrder = stages.map(s=>s.id);
export const initialOrder = ['krebs','glucolisis','cadena','piruvato'];
export function gradeOrder(values){
 const missing=expectedOrder.map((_,i)=>i).filter(i=>!values[i]);
 const duplicate=values.filter(Boolean).length!==new Set(values.filter(Boolean)).size;
 const correct=expectedOrder.map((id,i)=>values[i]===id);
 return {missing,duplicate,correct,complete:missing.length===0&&!duplicate&&correct.every(Boolean)};
}
const options = {
 lugar:[['citosol','Citosol'],['matriz','Matriz mitocondrial'],['membrana','Membrana interna mitocondrial']],
 balance:[['reactivo','Reactivo'],['producto','Producto']],
 tipo:[['aerobia','Respiración aerobia'],['anaerobia','Respiración anaerobia'],['fermentacion','Fermentación']],
 proceso:[['foto','Fotosíntesis'],['respira','Respiración celular'],['ambas','Ambos procesos']]
};
const cases = [
 ['Glucosa que se divide','En una célula eucariota, una glucosa se transforma en dos piruvatos. ¿Dónde ocurre?','lugar','citosol','Es glucólisis: ocurre en el citosol, fuera de la mitocondria.'],
 ['Preparar acetil-CoA','El piruvato se transforma en acetil-CoA antes del ciclo de Krebs. ¿En qué zona de una célula eucariota?','lugar','matriz','La oxidación del piruvato ocurre en la matriz mitocondrial y libera CO₂ y NADH.'],
 ['Una ruta circular','Se libera CO₂ en Krebs y se producen NADH y FADH₂. ¿Dónde se ubica principalmente este ciclo en eucariotas?','lugar','matriz','El ciclo se sitúa en la matriz. La mayoría de sus enzimas está allí; una está asociada a la membrana interna.'],
 ['La estación con más ATP','Una cadena transfiere electrones y se forma ATP gracias a un gradiente de H⁺. ¿Dónde están estos sistemas en una mitocondria?','lugar','membrana','La cadena y la ATP sintasa se encuentran en la membrana interna, incluidos sus pliegues o crestas.'],
 ['Glucosa en la ecuación','En el balance global de la respiración aerobia de glucosa, ¿cómo clasificas la glucosa?','balance','reactivo','La glucosa es un combustible inicial. Su energía química puede aprovecharse para formar ATP.'],
 ['El papel del oxígeno','En el balance global de la respiración aerobia, ¿el O₂ es reactivo o producto?','balance','reactivo','El oxígeno se utiliza como aceptor final de electrones; no es el combustible que aporta el carbono.'],
 ['Dióxido de carbono','En el balance global de respiración aerobia de glucosa, ¿el CO₂ es reactivo o producto?','balance','producto','El CO₂ se libera durante la oxidación del piruvato y el ciclo de Krebs. Contiene carbono del nutriente.'],
 ['Agua al final','El oxígeno recibe electrones y se combina con H⁺. El agua resultante es…','balance','producto','El agua aparece como producto en el balance global simplificado de la respiración aerobia.'],
 ['Una célula de raíz','Una célula de raíz utiliza una cadena cuyo aceptor final es oxígeno. ¿Qué proceso realiza?','tipo','aerobia','Aunque esa célula no haga fotosíntesis, puede realizar respiración aerobia y aprovechar azúcares.'],
 ['Una bacteria sin oxígeno','Una bacteria usa una cadena respiratoria con nitrato como aceptor final en vez de O₂. ¿Cómo se clasifica?','tipo','anaerobia','Hay cadena de transporte y un aceptor distinto del oxígeno: es respiración anaerobia.'],
 ['Reciclar NAD⁺','Una célula regenera NAD⁺ usando una molécula orgánica, sin utilizar una cadena respiratoria en ese proceso. ¿Qué mecanismo describe?','tipo','fermentacion','Es fermentación. Regenerar NAD⁺ permite sostener la glucólisis; no es sinónimo de respiración anaerobia.'],
 ['Captar luz','Un tejido verde aprovecha luz para producir materia orgánica a partir de CO₂. ¿Qué proceso se describe?','proceso','foto','La fotosíntesis incorpora carbono a materia orgánica utilizando energía luminosa.'],
 ['Obtener ATP del nutriente','Una célula aprovecha energía química de nutrientes mediante una cadena respiratoria. ¿Qué proceso se describe?','proceso','respira','La respiración aprovecha energía de nutrientes para producir ATP; no necesita luz directamente.'],
 ['Una hoja de día','Una célula verde iluminada produce materia orgánica y también aprovecha nutrientes para obtener ATP. ¿Qué procesos puede realizar?','proceso','ambas','Fotosíntesis y respiración pueden ocurrir en la misma célula vegetal. De día no se apaga la respiración.'],
 ['La planta por la noche','En oscuridad, una célula vegetal utiliza azúcares y O₂ para obtener ATP. ¿Qué proceso se observa?','proceso','respira','La respiración celular continúa de noche. Utiliza energía química, no luz como requisito directo.'],
 ['CO₂ para construir','En una célula fotosintética, se incorpora CO₂ para fabricar sustancias orgánicas. ¿Cuál proceso corresponde?','proceso','foto','En fotosíntesis se utiliza CO₂ para formar materia orgánica; en el balance de respiración aerobia se libera CO₂.']
];
export const missions=cases.map(([title,prompt,group,answer,why],i)=>({id:`caso-${i+1}`,title,prompt,options:options[group],answer,why}));
export const statements=[
 ['Respirar con los pulmones y producir ATP en una célula son exactamente lo mismo.',false,'Los pulmones permiten intercambio de gases con el ambiente. La respiración celular es un conjunto de reacciones que aprovecha energía de nutrientes.'],
 ['La glucólisis produce 4 ATP en total, pero la ganancia neta es 2.',true,'Primero se gastan 2 ATP. El balance neto es lo producido menos lo invertido: 4 − 2 = 2.'],
 ['Todo el ATP de la respiración se forma en Krebs.',false,'Krebs produce una pequeña cantidad directa. La mayor parte procede de la fosforilación oxidativa.'],
 ['Las plantas realizan respiración celular tanto de día como de noche.',true,'La respiración aprovecha nutrientes y no requiere luz directamente. Las plantas también necesitan ATP cuando están a oscuras.'],
 ['NADH y FADH₂ son transportadores de electrones.',true,'Entregan electrones que pueden alimentar la cadena. No son nombres alternativos del ATP.'],
 ['Sin mitocondrias, ninguna célula puede realizar respiración.',false,'Muchos procariotas respiran. Sus cadenas respiratorias están en la membrana plasmática y no necesitan mitocondrias.'],
 ['Cualquier proceso que ocurra sin oxígeno es respiración anaerobia.',false,'También existen procesos como la fermentación. Para distinguirlos pregunta si hay cadena respiratoria y qué aceptor final se utiliza.'],
 ['30–32 ATP por glucosa es una estimación frecuente, no un valor universal.',true,'El rendimiento depende del tipo de célula, del transporte de electrones y sustancias, y de las condiciones. No toda la energía se conserva como ATP.']
].map(([prompt,answer,why],i)=>({id:`idea-${i+1}`,title:`Idea ${i+1}`,prompt,answer:answer?'verdadero':'falso',why,options:[['verdadero','Verdadero'],['falso','Falso']]}));
