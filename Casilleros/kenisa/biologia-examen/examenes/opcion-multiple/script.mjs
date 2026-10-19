import {bank,topics} from './banco.mjs';
import {STORAGE_KEY} from './modelo.mjs';
import {drawFigure} from './figuras.mjs';
import {initExam} from '../../recursos/controlador.mjs';
initExam({bank,topics,storageKey:STORAGE_KEY,drawFigure});
