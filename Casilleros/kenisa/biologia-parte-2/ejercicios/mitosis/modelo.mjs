import { mitosisOrder } from './datos.mjs';
export function createOrder() {
  const placed = [];
  return {
    get count() { return placed.length; },
    get complete() { return placed.length === mitosisOrder.length; },
    choose(id) {
      if (this.complete || id !== mitosisOrder[placed.length]) return false;
      placed.push(id);
      return true;
    }
  };
}
export function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
