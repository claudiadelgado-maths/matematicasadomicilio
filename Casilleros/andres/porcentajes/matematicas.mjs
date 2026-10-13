const DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "\\[", right: "\\]", display: true },
  { left: "\\(", right: "\\)", display: false }
];

export function renderMath(root = document.body) {
  if (!root) return;
  if (typeof globalThis.renderMathInElement !== "function") {
    if (document.readyState !== "complete") {
      window.addEventListener("load", () => renderMath(root), { once: true });
    }
    return;
  }

  globalThis.renderMathInElement(root, {
    delimiters: DELIMITERS,
    throwOnError: false,
    strict: "ignore"
  });
}

export function renderLatex(element, latex, { display = true, label = "" } = {}) {
  if (!element) return;
  element.dataset.latex = latex;
  element.setAttribute("aria-label", label || latex);
  if (globalThis.katex?.render) {
    globalThis.katex.render(latex, element, {
      displayMode: display,
      throwOnError: false,
      strict: "ignore"
    });
    return;
  }

  element.textContent = latex;
  if (document.readyState !== "complete") {
    window.addEventListener("load", () => renderLatex(element, latex, { display, label }), { once: true });
  }
}
