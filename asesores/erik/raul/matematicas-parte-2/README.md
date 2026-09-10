# Matemáticas Parte 2

Sesión de factorización algebraica para Raúl, salón de Erik. Nueve páginas independientes de otras sesiones. Lienzo lila sin paneles anidados, escritorio primero, KaTeX y navegación compacta.

## Recorrido

Inicio: `index.html`.

- Agrupación y factor común: `ejercicios/agrupacion/index.html`
- Trinomio cuadrado perfecto: `ejercicios/tcp/index.html`
- Diferencia de cuadrados: `ejercicios/diferencia/index.html`
- Completar un cuadrado: `ejercicios/completar/index.html`
- Trinomio x² + bx + c: `ejercicios/monico/index.html`
- Trinomio ax² + bx + c: `ejercicios/general/index.html`
- Suma y diferencia de cubos: `ejercicios/cubos/index.html`
- Reto de factorización: `ejercicios/reto/index.html`

## Motor e interacción

`recursos/algebra.mjs` representa monomios con coeficiente entero y mapa de exponentes. Genera primero factores válidos y desarrolla el ejercicio. Compara polinomios normalizados, sin evaluar texto. Los distractores se comprueban por expansión para garantizar una sola respuesta equivalente. La práctica conserva signos y acepta arreglos alternativos en las cuatro casillas.

`recursos/actividad.mjs` conserva el procedimiento vertical. Factor común exige el máximo en una única extracción terminal y muestra divisiones como fracciones. Agrupación permite elegir ambos grupos sobre la expresión completa y conserva colores, cocientes y factorizaciones. Raíces, doble producto y estructura de cubos se acumulan. Completar cuadrados consiste en ordenar cuatro pasos y muestra siempre la solución al entregar. Los trinomios tienen factores en columnas verticales y cálculos automáticos; el general dibuja diagonales. El reto conserva su mecánica. No guarda progreso al cerrar.

## Comprobaciones

Ejecutar `node asesores/erik/raul/matematicas-parte-2/recursos/algebra.test.mjs`, `npm run catalogo` y `npm run validar`. Revisar los ocho métodos en ambos niveles, barrido y alternativa por teclado, menú y enlaces, consolas y escritorio. Por indicación explícita no se optimizan estas actividades para móvil. Ejecutar también `node asesores/erik/raul/matematicas-parte-2/recursos/procedimientos.test.mjs`.
