import {DESCRIPTION_BANK,REASONING_BANK} from '../../../biologia-parte-1/ejercicios/partes-de-la-celula-animal/banco-preguntas.mjs';
import {FUNCTION_BANK,SORTING_BANK} from '../../../biologia-parte-1/ejercicios/biomoleculas/datos.mjs';
import {PREGUNTAS} from '../../../biologia-parte-1/ejercicios/niveles-de-organizacion/datos.mjs';
import {questions as adn} from '../../../biologia-parte-2/ejercicios/adn-y-cromosomas/datos.mjs';
import {questions as mitosis} from '../../../biologia-parte-2/ejercicios/mitosis/datos.mjs';
import {questions as meiosis} from '../../../biologia-parte-2/ejercicios/meiosis/datos.mjs';
import {questions as reproduccion} from '../../../biologia-parte-2/ejercicios/mitosis-meiosis-y-reproduccion/datos.mjs';
import {bank as procariotas} from '../../../biologia-parte-3/recursos/contenido.mjs';
import {bank as vegetal} from '../../../biologia-parte-3/ejercicios/celula-vegetal/banco-preguntas.mjs';
import {bank as clasificacion} from '../../../biologia-parte-3/ejercicios/clasificacion-de-los-seres-vivos/banco-preguntas.mjs';
import {bank as fungi} from '../../../biologia-parte-3/ejercicios/reino-fungi/banco-preguntas.mjs';
import {bank as transporte} from '../../../biologia-parte-4/ejercicios/membrana-y-transporte/banco-preguntas.mjs';
import {bank as metabolismo} from '../../../biologia-parte-4/ejercicios/metabolismo-y-atp/banco-preguntas.mjs';
import {bank as respiracion} from '../../../biologia-parte-4/ejercicios/respiracion-celular/banco-preguntas.mjs';
import {bank as fermentacion} from '../../../biologia-parte-4/ejercicios/fermentacion/banco-preguntas.mjs';

const sources=[
 [1,'celula-animal','Célula animal','partes-de-la-celula-animal',[...DESCRIPTION_BANK,...REASONING_BANK]],
 [1,'biomoleculas','Biomoléculas','biomoleculas',[...FUNCTION_BANK,...SORTING_BANK.map(q=>({...q,kind:'Clasifica este ejemplo'}))]],
 [1,'niveles','Niveles de organización','niveles-de-organizacion',PREGUNTAS],
 [2,'adn','ADN y cromosomas','adn-y-cromosomas',adn],
 [2,'mitosis','Mitosis','mitosis',mitosis],
 [2,'meiosis','Meiosis','meiosis',meiosis],
 [2,'reproduccion','Mitosis, meiosis y reproducción','mitosis-meiosis-y-reproduccion',reproduccion],
 [3,'procariotas','Procariotas y eucariotas','procariotas-y-eucariotas',procariotas],
 [3,'vegetal','Célula vegetal','celula-vegetal',vegetal],
 [3,'clasificacion','Clasificación de los seres vivos','clasificacion-de-los-seres-vivos',clasificacion],
 [3,'fungi','Reino Fungi','reino-fungi',fungi],
 [4,'transporte','Membrana y transporte celular','membrana-y-transporte',transporte],
 [4,'metabolismo','Metabolismo y ATP','metabolismo-y-atp',metabolismo],
 [4,'respiracion','Respiración celular','respiracion-celular',respiracion],
 [4,'fermentacion','Fermentación','fermentacion',fermentacion]
];
export const topics=sources.map(([part,id,title,slug,questions])=>({id,part,title,count:questions.length,guide:`../../../biologia-parte-${part}/ejercicios/${slug}/index.html`}));
export const bank=sources.flatMap(([part,topicId,title,slug,questions])=>questions.map((q,i)=>{
 const id=`${topicId}/${q.id??`pregunta-${i+1}`}`;
 const choices=q.choices?q.choices.map(c=>({...c})):q.options.map((text,n)=>({id:`opcion-${n}`,text}));
 const prompt=id==='respiracion/respiracion-13'?'Una célula procariota no tiene mitocondrias. ¿Dónde realiza la glucólisis?':q.prompt;
 return {id,topicId,part,prompt,kind:q.kind||'Elige la respuesta correcta',choices,correctId:q.correctId??`opcion-${q.answer}`,explanation:q.explanation,
  guide:`../../../biologia-parte-${part}/ejercicios/${slug}/index.html${q.section?'#'+q.section:''}`,
  figure:q.phase!==undefined?{type:topicId,phase:q.phase}:q.visual?{type:q.visual}:null};
}));
