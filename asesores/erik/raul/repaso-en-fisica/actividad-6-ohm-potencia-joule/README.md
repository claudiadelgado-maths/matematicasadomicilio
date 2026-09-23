# Actividad 6 · Ley de Ohm, potencia eléctrica y efecto Joule

Ruta: actividad-6-ohm-potencia-joule/

Esta actividad pertenece a la sesión `repaso-en-fisica` de Raúl. No cambies la ruta de la sesión ni los metadatos estructurales de `../sesion.json`.

## Estructura didáctica

La actividad tiene tres bloques internos:

1. Ley de Ohm: significado, $V=IR$, $I=\dfrac{V}{R}$, $R=\dfrac{V}{I}$ y tres ejercicios numéricos sencillos ($12\,\mathrm{V}$, $3\,\mathrm{A}$ y $6\,\Omega$).
2. Potencia eléctrica: significado, unidad watt y fórmulas $P=IV$, $P=\dfrac{V^2}{R}$ y $P=I^2R$, con un ejercicio numérico por fórmula ($24\,\mathrm{W}$, $20\,\mathrm{W}$ y $36\,\mathrm{W}$).
3. Efecto Joule: definición y dos ejercicios de comparación entre situaciones para reconocer calentamiento por el paso de corriente a través de una resistencia.

El progreso, respuestas y borradores numéricos se guardan en `localStorage`. Un acierto avanza tras aproximadamente 1 segundo. Si hay un error se muestra la respuesta o procedimiento correcto y el alumno continúa con el botón Siguiente.

## Archivos

- `index.html`: estructura pública de la actividad.
- `estilos.css`: estilos locales.
- `actividad.js`: contenido, lógica, corrección y persistencia.
- `README.md`: este contrato.

No añadas dependencias externas ni imágenes rasterizadas si no son necesarias. Los recursos globales se referencian con la profundidad relativa existente.

## Casillas de respuesta

Los campos nuevos se muestran vacíos, sin ejemplos de respuesta ni notas de formato debajo. Se conservan etiquetas, unidades, validación y borradores guardados por el alumno.

## Repaso personalizado

Carga ../recursos/repaso.js antes de actividad.js. Los errores válidos se guardan en una cola local independiente, sin modificar la puntuación original; al terminar aparece el enlace a la práctica de errores si hay pendientes. Las actividades 3 a 7 incorporan los errores recuperables de sus historiales al abrirlas. Guardar progreso no interrumpe la actividad si el almacenamiento está bloqueado.
