# La fábrica de trinomios

Juego narrativo de opción múltiple en el que el alumno ayuda a Mara, una trabajadora de la fábrica, a completar una orden sencilla.

Cada orden utiliza únicamente coeficientes enteros pequeños y se divide en cuatro etapas:

1. Distribuir cada término del primer binomio.
2. Calcular los cuatro productos.
3. Reunir los dos términos con `x`.
4. Simplificar el trinomio final.

Cada respuesta correcta se conserva en el tablero **Así se crea el procedimiento**, de modo que el alumno puede observar cómo se construye la solución sin escribir. Los errores no quitan puntos: muestran una pista corta y permiten volver a intentar. Al terminar se puede generar otra orden fácil.

`index.html` contiene la escena y los controles, `estilos.css` aporta la identidad colorida y adaptable, y `script.mjs` genera las órdenes, opciones, mensajes y procedimiento acumulado con KaTeX.
