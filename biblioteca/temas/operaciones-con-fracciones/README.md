# Operaciones con fracciones

## Objetivo

Comprender las fracciones desde su interpretación visual hasta la resolución completa de operaciones con signos, simplificación y conversión decimal. Está dirigido principalmente a secundaria y puede utilizarse desde cero o como material de repaso.

## Componentes

- `definiciones/`: conceptos formales con interpretación sencilla.
- `explicacion/`: teoría progresiva, ejemplos completos y conexión decimal.
- `ejercicios/operaciones-basicas/`: tres niveles de práctica dinámica.
- `calculadoras/operaciones-con-fracciones/`: una operación con procedimiento completo.
- `juegos/cuanto-pastel-queda/`: interpretación de una región coloreada.
- `juegos/dame-pastel/`: construcción táctil de una fracción.

No existe demostración independiente; no debe aparecer como opción.

## Sistema y comportamiento

El acento azul identifica este tema sin sustituir la identidad general. KaTeX 0.18.1 renderiza la notación matemática en las páginas del tema. `matematicas.mjs` concentra la aritmética racional exacta, normalización, simplificación y renderizado dinámico. `pastel.mjs` concentra la construcción SVG de sectores iguales.

Los denominadores nunca pueden ser cero. Los ejercicios indican expresamente cuándo se solicita el resultado previo a la simplificación y cuándo se exige una fracción irreducible con denominador positivo.

## Para una IA

Trabaja únicamente dentro de esta carpeta salvo por los índices y el catálogo que la integran con Biblioteca. Lee `tema.json`, conserva la ruta pública y las migas de pan, y no edites otros temas. Comprueba las cuatro operaciones, equivalencia exacta, signos, cero, enteros, división entre cero, SVG, entradas inválidas, teclado, tacto, móvil, escritorio, enlaces y consola. Si añades o retiras componentes, actualiza `tema.json`, `index.html`, el índice de Temas y el catálogo generado.
