export const enteroAleatorio = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export const signoDeNumero = (value) => {
  if (value === 0) return "zero";
  return value > 0 ? "positive" : "negative";
};

export const signoDeOperacion = (first, second) => {
  if (first === 0 || second === 0) return "zero";
  return signoDeNumero(first) === signoDeNumero(second) ? "positive" : "negative";
};

export const valorAbsoluto = (value) => Math.abs(value);

export const opuesto = (value) => (value === 0 ? 0 : -value);

export const simboloOperacion = (operation) =>
  operation === "divide" ? "\\div" : "\\cdot";

export const operar = (first, second, operation) => {
  if (operation === "divide") {
    if (second === 0) throw new RangeError("No se puede dividir entre cero.");
    return first / second;
  }
  return first * second;
};

export const leerEntero = (input) => {
  const value = input.value.trim();
  if (!/^-?\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

export const numeroLatex = (value, { parentheses = true, explicitPositive = true } = {}) => {
  const presented = value > 0 && explicitPositive ? `+${value}` : String(value);
  return parentheses ? `\\left(${presented}\\right)` : presented;
};

export const signoLatex = (sign) =>
  ({ positive: "+", negative: "-", zero: "0" })[sign];

export const descripcionRegla = (first, second) => {
  if (first === 0 || second === 0) {
    return "Un factor o dividendo igual a cero produce un resultado igual a cero.";
  }
  const equal = signoDeNumero(first) === signoDeNumero(second);
  return `Los signos son ${equal ? "iguales" : "diferentes"}, por eso el resultado es ${equal ? "positivo" : "negativo"}.`;
};

export const renderizarMatematica = (element, latex, { display = false } = {}) => {
  if (!element) return;
  element.dataset.latex = latex;
  if (window.katex?.render) {
    window.katex.render(latex, element, {
      displayMode: display,
      throwOnError: false,
      strict: "ignore",
    });
  } else {
    element.textContent = latex;
  }
};
