import {sceneMarkup as mitosis} from '../../../biologia-parte-2/ejercicios/mitosis/escena.mjs';
import {sceneMarkup as meiosis} from '../../../biologia-parte-2/ejercicios/meiosis/escena.mjs';
import {fertilizationMarkup} from '../../../biologia-parte-2/ejercicios/mitosis-meiosis-y-reproduccion/escena.mjs';
export function drawFigure(figure){
 if(!figure)return '';
 if(figure.type==='mitosis')return mitosis(figure.phase??5);
 if(figure.type==='meiosis')return meiosis(figure.phase??8);
 if(figure.type==='gametos')return fertilizationMarkup(0);
 if(figure.type==='cigoto')return fertilizationMarkup(1);
 return '';
}
