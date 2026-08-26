import { renderLatex } from "../sucesiones.mjs";

const meanings = {
  an: {
    title: "aₙ · El valor que buscamos",
    description: "Representa el valor del término situado en la posición n. No es la posición: es el número que encontramos en esa posición.",
    example: "En 7, 12, 17, 22, …, si n = 4, entonces a₄ = 22.",
    latex: "a_n=\\text{valor en la posición }n",
  },
  a1: {
    title: "a₁ · El punto de partida",
    description: "Es el primer término de la sucesión. Desde él contamos todos los saltos de tamaño d.",
    example: "En 7, 12, 17, 22, …, el primer término es a₁ = 7.",
    latex: "a_1=7",
  },
  n: {
    title: "n · La posición",
    description: "Indica el lugar que ocupa el término: primero, segundo, tercero… Siempre es un entero positivo.",
    example: "Para encontrar el octavo término usamos n = 8; todavía no sabemos cuánto vale a₈.",
    latex: "n=8\\quad\\Longrightarrow\\quad a_8\\text{ es el valor buscado}",
  },
  jumps: {
    title: "n − 1 · La cantidad de saltos",
    description: "Ya estamos parados en a₁. Para llegar a a₂ damos un salto; para llegar a a₃, dos. Por eso hasta aₙ damos n − 1 saltos.",
    example: "Para llegar a a₈ desde a₁ hacen falta 8 − 1 = 7 saltos.",
    latex: "a_1\\xrightarrow{1}a_2\\xrightarrow{2}a_3\\;\\cdots\\;\\xrightarrow{n-1}a_n",
  },
  d: {
    title: "d · El tamaño de cada salto",
    description: "Es la diferencia común entre dos términos consecutivos. Puede ser positiva si la sucesión aumenta o negativa si disminuye.",
    example: "En 30, 26, 22, 18, …, cada salto resta 4; por eso d = −4.",
    latex: "d=a_{n+1}-a_n",
  },
};

const buttons = [...document.querySelectorAll("[data-formula-part]")];
const title = document.querySelector("[data-meaning-title]");
const description = document.querySelector("[data-meaning-description]");
const example = document.querySelector("[data-meaning-example]");
const math = document.querySelector("[data-meaning-math]");

const selectMeaning = (key) => {
  const meaning = meanings[key];
  if (!meaning || !title || !description || !example || !math) return;
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.formulaPart === key)));
  title.textContent = meaning.title;
  description.textContent = meaning.description;
  example.textContent = meaning.example;
  renderLatex(math, meaning.latex);
};

buttons.forEach((button) => button.addEventListener("click", () => selectMeaning(button.dataset.formulaPart)));
window.addEventListener("load", () => selectMeaning("an"), { once: true });
