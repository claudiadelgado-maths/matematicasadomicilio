(() => {
  const root = document.querySelector('.functions-site');
  if (!root) return;
  // KaTeX usa las mismas versiones fijadas que otras sesiones del sitio.
  const renderMath = element => {
    if (typeof window.renderMathInElement !== 'function') return;
    window.renderMathInElement(element, {
      delimiters: [{left: String.raw`\(`, right: String.raw`\)`, display: false}],
      throwOnError: false, strict: 'ignore'
    });
  };
  const setMath = (element, content) => { element.textContent = content; renderMath(element); };
  renderMath(root);
  const banks = {
  "types": [
    [
      "\\(-2x^3+5x-1\\)",
      [
        "Polinómica",
        "Racional no polinómica",
        "Radical",
        "A trozos"
      ],
      0,
      "Los exponentes son enteros no negativos. Grado \\(3\\) y coeficiente principal \\(-2\\)."
    ],
    [
      "\\(\\frac{x+4}{x-1}\\)",
      [
        "Polinómica",
        "Racional no polinómica",
        "Radical",
        "A trozos"
      ],
      1,
      "Es un cociente de polinomios con denominador variable. \\(x=1\\) queda excluido."
    ],
    [
      "\\(\\sqrt{3x-2}\\)",
      [
        "Polinómica",
        "Racional no polinómica",
        "Radical",
        "A trozos"
      ],
      2,
      "La variable está dentro de una raíz cuadrada."
    ],
    [
      "\\(f(x)=\\begin{cases}x+1,&x<0\\\\x^2,&x\\ge0\\end{cases}\\)",
      [
        "Polinómica",
        "Racional no polinómica",
        "Radical",
        "A trozos"
      ],
      3,
      "La condición sobre \\(x\\) determina qué expresión utilizar."
    ],
    [
      "\\(f(x)=7\\)",
      [
        "Polinómica constante",
        "Radical",
        "A trozos"
      ],
      0,
      "Una constante no nula es un polinomio de grado \\(0\\); su coeficiente principal es \\(7\\)."
    ],
    [
      "\\(f(x)=\\frac{x}{5}\\)",
      [
        "Polinómica de grado 1",
        "Radical",
        "A trozos"
      ],
      0,
      "\\(\\frac{x}{5}=\\frac15x\\). Un denominador constante no impide que sea polinómica."
    ],
    [
      "\\(f(x)=\\sqrt2\\,x^2\\)",
      [
        "Polinómica de grado 2",
        "Radical",
        "A trozos"
      ],
      0,
      "\\(\\sqrt2\\) es un coeficiente constante. La variable no está dentro de la raíz."
    ],
    [
      "\\(f(x)=\\sqrt[3]{x+1}\\)",
      [
        "Polinómica",
        "Racional no polinómica",
        "Radical"
      ],
      2,
      "La variable está bajo una raíz de índice impar."
    ]
  ],
  "domains": [
    [
      "\\(f(x)=4-x^2\\)",
      [
        "\\(\\mathbb R\\)",
        "\\([0,\\infty)\\)",
        "\\(\\mathbb R\\setminus\\{0\\}\\)"
      ],
      0,
      "Un polinomio está definido para cualquier número real."
    ],
    [
      "\\(f(x)=\\frac1{x-4}\\)",
      [
        "\\([4,\\infty)\\)",
        "\\(\\mathbb R\\setminus\\{4\\}\\)",
        "\\(\\mathbb R\\)"
      ],
      1,
      "\\(x-4\\ne0\\implies x\\ne4\\)."
    ],
    [
      "\\(f(x)=\\sqrt{x+3}\\)",
      [
        "\\((-3,\\infty)\\)",
        "\\([-3,\\infty)\\)",
        "\\(\\mathbb R\\setminus\\{-3\\}\\)"
      ],
      1,
      "\\(x+3\\ge0\\implies x\\ge-3\\). La raíz sí puede valer cero."
    ],
    [
      "\\(f(x)=\\frac1{\\sqrt{5-x}}\\)",
      [
        "\\((-\\infty,5]\\)",
        "\\((5,\\infty)\\)",
        "\\((-\\infty,5)\\)"
      ],
      2,
      "\\(5-x>0\\implies x<5\\). El extremo \\(5\\) daría un denominador cero."
    ],
    [
      "\\(f(x)=\\frac{\\sqrt{x-1}}{x-3}\\)",
      [
        "\\([1,3)\\cup(3,\\infty)\\)",
        "\\([1,\\infty)\\)",
        "\\(\\mathbb R\\setminus\\{3\\}\\)"
      ],
      0,
      "La raíz exige \\(x\\ge1\\) y el denominador exige \\(x\\ne3\\)."
    ],
    [
      "\\(f(x)=\\begin{cases}\\sqrt{x},&x<2\\\\\\frac1{x-3},&x\\ge2\\end{cases}\\)",
      [
        "\\(\\mathbb R\\setminus\\{3\\}\\)",
        "\\([0,3)\\cup(3,\\infty)\\)",
        "\\([0,2)\\)"
      ],
      1,
      "Los tramos válidos son \\([0,2)\\) y \\([2,3)\\cup(3,\\infty)\\). Su unión es \\([0,3)\\cup(3,\\infty)\\)."
    ],
    [
      "\\(f(x)=\\sqrt[3]{x-2}\\)",
      [
        "\\([2,\\infty)\\)",
        "\\(\\mathbb R\\)",
        "\\(\\mathbb R\\setminus\\{2\\}\\)"
      ],
      1,
      "Una raíz cúbica admite radicandos negativos, cero y positivos."
    ],
    [
      "\\(f(x)=8\\)",
      [
        "\\(\\{8\\}\\)",
        "\\([0,\\infty)\\)",
        "\\(\\mathbb R\\)"
      ],
      2,
      "La salida es siempre \\(8\\), pero la entrada puede ser cualquier número real."
    ]
  ],
  "evaluation": [
    [
      "\\(f(x)=x^2-2x+1\\). ¿Cuánto vale \\(f(3)\\)?",
      [
        "\\(4\\)",
        "\\(10\\)",
        "\\(2\\)"
      ],
      0,
      "\\(f(3)=3^2-2\\cdot3+1=9-6+1=4\\). El punto es \\((3,4)\\)."
    ],
    [
      "\\(g(x)=2x+3\\). ¿Cuál es \\(g(t+1)\\)?",
      [
        "\\(2t+4\\)",
        "\\(2t+5\\)",
        "\\(2t+3\\)"
      ],
      1,
      "\\(g(t+1)=2(t+1)+3=2t+5\\)."
    ],
    [
      "\\(g(x)=x^2\\). ¿Cuál es \\(g(x+h)\\)?",
      [
        "\\(x^2+h^2\\)",
        "\\(x^2+2xh+h^2\\)",
        "\\(x^2+h\\)"
      ],
      1,
      "\\((x+h)^2=(x+h)(x+h)=x^2+2xh+h^2\\)."
    ],
    [
      "\\(v(x)=\\begin{cases}x+2,&x<0\\\\x^2,&x\\ge0\\end{cases}\\). Evalúa \\(v(0)\\).",
      [
        "\\(2\\)",
        "No existe",
        "\\(0\\)"
      ],
      2,
      "El cero pertenece al segundo tramo: \\(v(0)=0^2=0\\)."
    ],
    [
      "\\(r(x)=\\frac1{x-2}\\). Evalúa \\(r(2)\\).",
      [
        "\\(0\\)",
        "No está definida",
        "\\(1\\)"
      ],
      1,
      "\\(2\\) no pertenece al dominio: el denominador sería cero."
    ],
    [
      "\\(T(h)=24-0.006h\\), para \\(0\\le h\\le2000\\). Calcula \\(T(500)\\).",
      [
        "\\(21\\,{}^\\circ\\mathrm C\\)",
        "\\(27\\,{}^\\circ\\mathrm C\\)",
        "\\(18\\,{}^\\circ\\mathrm C\\)"
      ],
      0,
      "\\(T(500)=24-0.006\\cdot500=24-3=21\\,{}^\\circ\\mathrm C\\). Es un modelo ilustrativo."
    ]
  ]
};
  root.querySelectorAll('[data-quiz]').forEach(panel => {
    const bank = banks[panel.dataset.quiz]; let index = 0;
    const feedback = panel.querySelector('[data-feedback]');
    const next = panel.querySelector('[data-next]');
    function render() {
      const [question, choices, correct, explanation] = bank[index];
      panel.querySelector('[data-counter]').textContent = `Ejemplo ${index+1} de ${bank.length}`;
      setMath(panel.querySelector('[data-question]'), question);
      feedback.textContent = ''; next.disabled = true;
      const buttons = choices.map((choice, i) => {
        const button = document.createElement('button'); button.type = 'button'; setMath(button, choice); button.setAttribute('aria-pressed','false');
        button.addEventListener('click', () => {
          buttons.forEach(b => b.setAttribute('aria-pressed',String(b === button)));
          setMath(feedback, `${i === correct ? 'Correcto.' : 'Esta opción no corresponde.'} ${explanation}`);
          next.disabled = false;
        }); return button;
      });
      panel.querySelector('[data-choices]').replaceChildren(...buttons);
      next.textContent = index === bank.length-1 ? 'Volver a practicar ↻' : 'Siguiente ejemplo →';
    }
    next.addEventListener('click', () => {index=(index+1)%bank.length;render();panel.querySelector('[data-choices] button').focus();}); render();
  });
  const form = root.querySelector('#degree-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const degree = Number(form.elements.degree.value), coefficient = Number(form.elements.coefficient.value);
    setMath(form.querySelector('.feedback'), degree===3 && coefficient===-4
      ? String.raw`Correcto: grado \(3\) y coeficiente principal \(-4\).`
      : String.raw`El mayor exponente es \(3\). Su término es \(-4x^3\): grado \(3\) y coeficiente principal \(-4\).`);
  });
  form.addEventListener('input',()=>{form.querySelector('.feedback').textContent='';});
  const slider = root.querySelector('#input-x');
  const px = x => 50+(x+3)*45, py = y => 260-y*14.5;
  root.querySelector('#curve').setAttribute('d',Array.from({length:161},(_,i)=>{const x=-3+i*.05;return `${i?'L':'M'}${px(x)},${py((x-1)**2)}`;}).join(' '));
  function updatePoint(){
    const x=Number(slider.value), y=x*x-2*x+1;
    root.querySelector('#plot-point').setAttribute('cx',px(x)); root.querySelector('#plot-point').setAttribute('cy',py(y));
    root.querySelector('#guides').setAttribute('d',`M${px(x)} 260V${py(y)}H185`);
    setMath(root.querySelector('#point-output'), String.raw`\(x=${x}\) → \(f(x)=${y}\) · Punto \((${x},${y})\)`);
    setMath(root.querySelector('#substitution'), String.raw`\(f(${x})=(${x})^2-2(${x})+1=${y}\)`);
  }
  slider.addEventListener('input',updatePoint);updatePoint();
})();
