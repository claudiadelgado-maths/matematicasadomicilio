import { renderAllMath } from "../formulas.mjs";

const render = () => renderAllMath(document);
if (document.readyState === "complete") render();
else window.addEventListener("load", render, { once: true });
