import { cycleCards } from './datos.mjs';
export { createAttempt } from '../../recursos/modelo-repaso.mjs';
export { shuffled } from '../mitosis/modelo.mjs';

export function createCycle() {
  const placed=[];
  return {
    get count() { return placed.length; },
    get complete() { return placed.length===cycleCards.length; },
    choose(id) {
      if(this.complete||id!==cycleCards[placed.length].id) return false;
      placed.push(id); return true;
    },
    undo() { return placed.pop(); }
  };
}
