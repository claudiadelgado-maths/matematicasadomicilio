export { createAttempt } from '../../recursos/modelo-repaso.mjs';
export { shuffled } from '../mitosis/modelo.mjs';

export function createTrail(steps) {
  let index = 0, solved = false;
  return {
    get index() { return index; },
    get solved() { return solved; },
    get complete() { return solved && index === steps.length - 1; },
    choose(phase) {
      if (solved || phase !== steps[index]?.target) return false;
      solved = true; return true;
    },
    next() {
      if (!solved || index >= steps.length - 1) return false;
      index++; solved = false; return true;
    }
  };
}
