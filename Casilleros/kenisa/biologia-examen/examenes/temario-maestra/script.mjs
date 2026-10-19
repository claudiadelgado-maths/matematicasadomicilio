import {bank,topics,STORAGE_KEY} from './banco.mjs';
import {groups} from './cobertura.mjs';
import {drawFigure} from './figuras.mjs';
import {initExam} from '../../recursos/controlador.mjs';
initExam({bank,topics,storageKey:STORAGE_KEY,drawFigure,groupLabel:'Bloque',groupTitle:p=>groups[p],unit:'tema',guideLabel:'Ver contenidos de este tema ↗',reviewLabel:'Ver contenidos del tema ↗'});
function revealTopic(){
 const id=location.hash.slice(1),detail=document.getElementById(id);
 if(detail?.classList.contains('syllabus-topic'))detail.open=true;
}
window.addEventListener('hashchange',revealTopic);
revealTopic();
