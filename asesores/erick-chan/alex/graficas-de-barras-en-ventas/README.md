# Gráficas de barras en ventas

Sesión interactiva de Alex con Erick Chan. El contenido se presenta en nueve pantallas navegables para estudiar cómo leer, construir y evaluar gráficas de barras con datos de ventas.

La experiencia incluye:

1. portada y objetivos;
2. exploración de título, escala, categorías y barras;
3. lectura de valores mediante barras accionables;
4. reto de interpretación con respuesta inmediata;
5. constructor de datos con controles deslizantes;
6. comparación entre unidades vendidas e ingresos;
7. análisis de una escala truncada;
8. cuestionario de tres decisiones rápidas;
9. resumen y opción para repetir la sesión.

`script.js` administra la navegación anterior/siguiente, el progreso, las acciones de las gráficas, los retos y el restablecimiento. La experiencia también permite avanzar con las flechas del teclado. Sin JavaScript, las pantallas permanecen visibles como contenido secuencial.

No utiliza bibliotecas de gráficas ni KaTeX. Los datos y elementos visuales se construyen con HTML, CSS y JavaScript locales. Los valores de `componentes` en `sesion.json` permanecen en `false` porque no existen módulos externos separados.

## Verificación

- Revisa las nueve pantallas en escritorio y móvil.
- Comprueba navegación con botones, puntos, flechas del teclado y controles de formulario.
- Confirma que las barras nunca provoquen desplazamiento horizontal de la página.
- Verifica el cuestionario, la puntuación final y la opción de repetir.
