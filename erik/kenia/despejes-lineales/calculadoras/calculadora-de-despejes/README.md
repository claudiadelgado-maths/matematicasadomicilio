# Calculadora exacta de despejes

Calculadora interactiva de la sesión **Despejes lineales** de Kenia.

- Ofrece dos calculadoras seleccionables dentro de la misma página.
- **Modo enteros:** solicita valores enteros para `A`, `B` y `C`; la solución puede ser entera o fraccionaria.
- **Modo fracciones:** solicita numerador y denominador apilados para cada coeficiente.
- Renderiza ecuaciones, resultados, fracciones y procedimientos con KaTeX.
- Normaliza signos y simplifica todos los resultados de manera exacta.
- Explica cuatro momentos: ecuación original, eliminación de `B`, división entre `A` y comprobación.
- Si `A = 0`, distingue entre una igualdad con infinitas soluciones y una ecuación sin solución.
- Valida campos vacíos, rechaza decimales en las entradas y evita denominadores iguales a cero.

La hoja `estilos.css` pertenece únicamente a esta calculadora y mantiene las entradas fraccionarias y el procedimiento estables en móvil.

Ruta pública: `/erik/kenia/despejes-lineales/calculadoras/calculadora-de-despejes/`.
