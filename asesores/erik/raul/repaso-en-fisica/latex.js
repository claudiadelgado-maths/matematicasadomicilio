(() => {
  const loaderUrl = document.currentScript?.src || document.baseURI;
  const sessionBase = new URL(".", loaderUrl);
  const mathJaxUrl = new URL("mathjax/tex-chtml.js", sessionBase).href;
  const fontUrl = new URL("mathjax/output/chtml/fonts/woff-v2", sessionBase).href.replace(/\/$/, "");

  const style = document.createElement("style");
  style.textContent = `
    mjx-container { max-width: 100%; }
    mjx-container[display="true"] { overflow-x: auto; overflow-y: hidden; padding: 0.15rem 0; }
  `;
  document.head.appendChild(style);

  const ready = new Promise((resolve, reject) => {
    window.MathJax = {
      tex: {
        inlineMath: [["\\(", "\\)"], ["$", "$"]],
        displayMath: [["\\[", "\\]"]],
        processEscapes: true
      },
      options: {
        skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
      },
      chtml: {
        matchFontHeight: false,
        fontURL: fontUrl
      }
    };

    const script = document.createElement("script");
    script.src = mathJaxUrl;
    script.async = true;
    script.onload = () => {
      const startup = window.MathJax?.startup?.promise;
      if (startup && typeof startup.then === "function") {
        startup.then(resolve).catch(reject);
      } else {
        resolve();
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  window.typesetMath = (...targets) => ready.then(() => {
    if (!window.MathJax?.typesetPromise) return;
    const nodes = targets.flat().filter(Boolean);
    return nodes.length ? window.MathJax.typesetPromise(nodes) : window.MathJax.typesetPromise();
  }).catch(() => {
    // La actividad sigue siendo usable incluso si el render matemático falla.
  });
})();
