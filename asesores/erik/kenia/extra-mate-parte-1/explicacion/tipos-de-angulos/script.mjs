import { createAngleExplorer, createTypeCards } from '../../recursos/angulos.mjs';

createTypeCards(document.querySelector('[data-type-cards]'));
createAngleExplorer(document.querySelector('[data-angle-explorer]'), { initial: 45, axes: true });
