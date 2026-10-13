# Despejes, paso a paso

Nueve páginas con una idea central, una actividad breve y navegación inferior: anterior, inicio y continuar. La última enlaza a la práctica existente.

- 1. `index.html`: La igualdad es un equilibrio.
- 2. `deshacer-suma/`: Deshaz una suma.
- 3. `deshacer-resta/`: Deshaz una resta.
- 4. `deshacer-multiplicacion/`: Reparte en partes iguales.
- 5. `dos-operaciones/`: Deshaz la última operación primero.
- 6. `coeficiente-negativo/`: El signo también cuenta.
- 7. `fracciones/`: Deshaz una multiplicación por una fracción.
- 8. `comprobar/`: Comprueba en la ecuación original.
- 9. `casos-especiales/`: ¿Y si desaparece la incógnita?.

Cada entrada conserva su estilos.css. recorrido.css y recorrido.js se comparten dentro de esta explicación; la portada también los usa. KaTeX 0.18.1 se conserva desde el CDN existente; si no carga, queda el texto LaTeX legible. No hay almacenamiento, registro de notas ni bloqueo del botón continuar.

Los ejemplos son HTML estático: sin JavaScript se ven todos los pasos. Con JavaScript se revelan uno a uno, con reinicio y avisos accesibles. Las preguntas permiten reintentar y explican el error. La balanza usa x + 3 = 7 y la comprobación usa 2x + 3 = 11.

Conservar la misma operación en ambos lados, los signos y la condición de divisor distinto de cero. Pruebas: explorar x=0,4,8; revelar y reiniciar cada ejemplo; contestar bien y mal; comprobar 3 y 4; abrir todos los enlaces; revisar teclado, consola y 360–1440 px.
