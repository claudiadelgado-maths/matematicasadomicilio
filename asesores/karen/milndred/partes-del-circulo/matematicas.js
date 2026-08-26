document.querySelectorAll("[data-math]").forEach((element) => {
  const latex = element.textContent.trim();
  element.setAttribute("aria-label", element.dataset.label || latex.replaceAll("\\", ""));
  if (globalThis.katex) {
    globalThis.katex.render(latex, element, {
      displayMode: element.dataset.display === "true",
      throwOnError: false,
      strict: "ignore"
    });
  }
});
