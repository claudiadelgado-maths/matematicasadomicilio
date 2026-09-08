# Polinomios

Página publicada después de Monomios en la sesión Matemáticas, parte 1 de Raúl. Ruta: `/asesores/erik/raul/matematicas-parte-1/ejercicios/polinomios/index.html`.

Explicación de términos, coeficientes con signo, variable, grado y término independiente mediante un ejemplo coloreado en LaTeX. El grado se explica para una sola variable. En las comparaciones se incluye explícitamente el término independiente como coeficiente de grado cero.

La práctica genera polinomios de una variable con 3–5 términos, exponentes distintos entre 0 y 8 y coeficientes enteros distintos y no nulos entre −20 y 20. Siempre hay término independiente. Usa siete variables; muestra las potencias en orden descendente y omite factores y exponentes 1. No hay términos semejantes que requieran simplificación.

Cada pregunta tiene tres opciones numéricas únicas, una correcta. Alterna aleatoriamente grado, cantidad de términos, independiente y coeficiente mayor/menor. Evita repetir consecutivamente tipo, expresión y respuesta con regeneración acotada. El alumno puede reintentar; al acertar se conserva la opción verde y se bloquean nuevos intentos hasta Nuevo ejercicio. Se limpian opciones, estados y mensajes al generar otra pregunta; el foco va a la primera opción.

`polinomios.mjs` contiene generación, formato y respuestas puras; `script.mjs` controla la interfaz. KaTeX 0.18.1 con SRI y respaldo MathML. `estilos.css` importa el CSS común de la sesión. La confirmación comparte `../../recursos/feedback.mjs` con Monomios: check verde, error con cruz y animación de 240 ms que respeta movimiento reducido. Sin almacenamiento ni servicios de evaluación externos.

Siguiente enlaza a `../suma/index.html`. Conserva el regreso a Monomios.

Pruebas: `node --test asesores/erik/raul/matematicas-parte-1/ejercicios/polinomios/polinomios.test.mjs` verifica 10 000 preguntas, coherencia, tres opciones, unicidad, signos, grado e independiente. Ejecutar `npm run catalogo` y `npm run validar`; revisar las tres páginas consumidoras del CSS a 360, 768, 1024 y 1440 px, teclado, enlaces, feedback y consola.
