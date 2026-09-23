# Actividad 2 · Conversiones

Actividad de repaso para transformar cantidades entre forma decimal y notación científica.

## Alcance actual

- Las conversiones numéricas directas usan exponentes de $-6$ a $6$, excluyendo 0 porque no aporta desplazamiento.
- Hay preguntas en ambos sentidos: notación científica → decimal y decimal → notación científica.
- También hay preguntas con los nombres mega, kilo, hecto, deca, deci, centi, mili, micro y nano.
- Nano se conserva aunque corresponda a $10^{-9}$ porque el objetivo de esas preguntas es conectar los prefijos repasados en la Actividad 1 con las conversiones.
- Cada pregunta tiene exactamente dos opciones.
- Si acierta, la actividad avanza automáticamente después de 1 segundo.
- Si falla, se marca la respuesta correcta y se espera el botón Siguiente.

## Archivos

- index.html: interfaz de la actividad.
- estilos.css: estilos locales.
- actividad.js: generación de preguntas, conversiones, validación y progreso.

Mantén estos tres archivos y las rutas relativas a los recursos globales de la plataforma.

## Repaso personalizado

Carga ../recursos/repaso.js antes de actividad.js. Los errores válidos se guardan en una cola local independiente, sin modificar la puntuación original; al terminar aparece el enlace a la práctica de errores si hay pendientes. Las actividades 3 a 7 incorporan los errores recuperables de sus historiales al abrirlas. Guardar progreso no interrumpe la actividad si el almacenamiento está bloqueado.
