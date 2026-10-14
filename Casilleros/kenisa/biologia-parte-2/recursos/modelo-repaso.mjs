// El resultado registra solo la primera respuesta confirmada por pregunta.
export function createAttempt(bank) {
  const answers = new Map();
  return {
    submit(index, choice) {
      const item = bank[index];
      if (!item || !Number.isInteger(choice) || choice < 0 || choice >= item.options.length || answers.has(index)) return false;
      answers.set(index, choice);
      return true;
    },
    get count() { return answers.size; },
    get complete() { return answers.size === bank.length; },
    get score() { return [...answers].filter(([index, choice]) => bank[index].answer === choice).length; },
    get mistakes() { return [...answers].filter(([index, choice]) => bank[index].answer !== choice).map(([index, choice]) => ({ item: bank[index], choice })); }
  };
}

export function shuffleOptions(item, random = Math.random) {
  const result = item.options.map((text, index) => ({ text, index }));
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
