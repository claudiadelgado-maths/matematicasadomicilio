# Actividad 1 · Prefijos del SI

Actividad de nivel 1 para repasar asociaciones entre prefijo, símbolo y potencia de diez.

## Comportamiento

- En cada intento se recorren los 21 renglones de la tabla proporcionada para esta actividad, incluido «sin prefijo».
- Las preguntas se mezclan y alternan tres asociaciones: identificar símbolo, identificar potencia de diez e identificar prefijo.
- Cada pregunta ofrece exactamente dos opciones.
- Si la respuesta es correcta, muestra «¡Bien!» y avanza automáticamente después de 1 segundo.
- Si es incorrecta, marca la opción elegida, muestra la respuesta correcta y exige pulsar «Siguiente».
- «Ver tabla» abre una consulta completa de prefijo, símbolo y factor. No incluye equivalencia decimal; esa parte se trabajará después.
- «Menú» regresa a la portada de la sesión sin depender de archivos externos a esta carpeta de sesión.

## Archivos

- index.html: estructura de la actividad.
- estilos.css: diseño local.
- actividad.js: datos, mezcla de preguntas, validación, progreso y tabla.

No cambies las rutas relativas hacia los recursos globales de la plataforma sin comprobarlas desde la ubicación final de la sesión.

## Repaso personalizado

Carga ../recursos/repaso.js antes de actividad.js. Los errores válidos se guardan en una cola local independiente, sin modificar la puntuación original; al terminar aparece el enlace a la práctica de errores si hay pendientes. Las actividades 3 a 7 incorporan los errores recuperables de sus historiales al abrirlas. Guardar progreso no interrumpe la actividad si el almacenamiento está bloqueado.
