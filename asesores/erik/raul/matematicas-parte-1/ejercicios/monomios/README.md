# Monomios

Segunda página de Matemáticas, parte 1 de Raúl. Ruta: `/asesores/erik/raul/matematicas-parte-1/ejercicios/monomios/index.html`. ID: `raul-erik-partes-de-monomios`. Estado: publicado.

## Contenido

Apoyo visual de −7x⁴ renderizado como una sola expresión LaTeX: el 4 es un superíndice unido a la x, también en el respaldo MathML. Una leyenda por colores identifica signo, coeficiente sin signo, literal y exponente. La página comienza con «Monomios», una definición directa y el ejemplo, sin rótulos decorativos ni numeración de ejercicios. Incluye variantes enteras, decimales y fraccionarias, y una aclaración de signo y valores implícitos. El coeficiente se responde como magnitud positiva, aunque en álgebra el coeficiente de −7x⁴ con su signo es −7.

La práctica genera signo ±, coeficiente entero (75 %) o fraccionario (25 %), valores del numerador y denominador entre 1 y 100, una de nueve literales y exponentes enteros de 1 a 9. Una fracción puede equivaler a un entero. Se omiten el signo positivo, el coeficiente entero 1 y el exponente 1 en la notación habitual. Las pistas explican esos casos.

Cada ejercicio pide entre una y cuatro categorías distintas; las quince combinaciones pueden aparecer. No repite exactamente el monomio anterior, aunque algunas de sus partes pueden coincidir por azar. Los decimales se explican visualmente, pero el generador sigue el alcance de enteros y fracciones solicitado.

## Respuestas

Comprobar valida solo los campos solicitados, conserva las entradas, señala cada resultado y ofrece pistas para reintentar. Acepta fracciones equivalentes y decimales finitos equivalentes, con punto o coma, mediante comparación racional exacta con BigInt. Rechaza denominadores cero, signos en el coeficiente, texto y expresiones ejecutables. La literal distingue mayúsculas de minúsculas. Nuevo ejercicio limpia los campos y mensajes anteriores y coloca el foco en la primera respuesta.

## Implementación

- `monomios.mjs`: generador, LaTeX, lectura accesible y validación pura.
- `script.mjs`: DOM, renderizado y retroalimentación.
- `estilos.css`: importa `../../recursos/sesion.css`, compartido con la página inicial.
- KaTeX 0.18.1 por CDN con integridad SRI, igual que la familia de asesores. Las expresiones proceden de datos internos, no de entradas del alumno. Sin KaTeX, se usan HTML/MathML como respaldo y la práctica sigue funcionando.
- Recursos globales: CSS base, navegación y SVG mediante rutas relativas. Sin almacenamiento local ni servicios de evaluación externos.

## Pruebas

`node --test asesores/erik/raul/matematicas-parte-1/ejercicios/monomios/monomios.test.mjs` desde la raíz verifica 10 000 ejercicios con semilla, rangos, distribución, quince combinaciones, no repetición, equivalencia racional, entradas inválidas y valores implícitos.

En navegador: respuestas vacías, incorrectas, correctas y fracciones equivalentes; Nuevo ejercicio; renderizado KaTeX sin errores; teclado; móvil/escritorio a 360, 768, 1024 y 1440 px; menú y Escape; enlaces y consola. Ejecutar también `npm run catalogo` y `npm run validar`.

El enlace Siguiente conduce a `../polinomios/index.html`. La confirmación usa `../../recursos/feedback.mjs`, compartida con Polinomios: mensaje «¡Correcto!», check, resaltado verde en resultado y campos correctos, animación breve con respeto a movimiento reducido. Errores en rojo con cruz y pistas; editar o generar otro ejercicio limpia el estado.
