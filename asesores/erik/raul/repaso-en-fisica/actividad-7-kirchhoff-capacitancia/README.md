# Actividad 7 · Kirchhoff, fuerza electromotriz y capacitancia

Ruta: actividad-7-kirchhoff-capacitancia/

Esta actividad pertenece a la sesión `repaso-en-fisica` de Raúl. No cambies la ruta de la sesión ni los metadatos estructurales de `../sesion.json`.

## Estructura didáctica

La actividad tiene cuatro bloques internos:

1. **Leyes de Kirchhoff y resistencias equivalentes**: primera ley (corrientes en un nodo), segunda ley (suma algebraica de voltajes en una malla), fórmulas de resistencias en serie y paralelo, y dos ejercicios numéricos. Resultados: $22\,\Omega$ en serie y aproximadamente $1.43\,\Omega$ en paralelo.
2. **Fuerza electromotriz (FEM)**: una pregunta conceptual. Se define como energía suministrada por unidad de carga y se expresa en volts.
3. **Resistencia interna**: dos preguntas conceptuales. En el modelo sencillo de esta actividad, la resistencia interna de la batería se suma a la resistencia externa.
4. **Capacitancia**: concepto, $C=\dfrac{Q}{V}$, unidad farad, placas paralelas $C=\dfrac{\varepsilon A}{d}$, significado de $\varepsilon$, reglas de capacitores en paralelo y serie, y dos ejercicios numéricos. Resultados: $7\,\mu\mathrm{F}$ en paralelo y $2\,\mu\mathrm{F}$ en serie.

La guía incluye las tablas de constante dieléctrica $K$ y permitividad relativa $\varepsilon_r$ proporcionadas para el repaso.

## Corrección conceptual importante

Las asociaciones de capacitores son inversas a las de resistencias:

- Capacitores en **paralelo**: $C_T=C_1+C_2+\cdots$
- Capacitores en **serie**: $\dfrac{1}{C_T}=\dfrac{1}{C_1}+\dfrac{1}{C_2}+\cdots$

El progreso, respuestas y borradores numéricos se guardan en `localStorage`. Un acierto avanza tras aproximadamente 1 segundo. Si hay un error se muestra la respuesta o procedimiento correcto y el alumno continúa con el botón Siguiente.

## Archivos

- `index.html`: estructura pública de la actividad y guía.
- `estilos.css`: estilos locales.
- `actividad.js`: contenido, lógica, corrección y persistencia.
- `README.md`: este contrato.

No añadas dependencias externas ni imágenes rasterizadas si no son necesarias. Los recursos globales se referencian con la profundidad relativa existente.

## Casillas de respuesta

Los campos nuevos se muestran vacíos, sin ejemplos de respuesta ni notas de formato debajo. Se conservan etiquetas, unidades, validación y borradores guardados por el alumno.

## Repaso personalizado

Carga ../recursos/repaso.js antes de actividad.js. Los errores válidos se guardan en una cola local independiente, sin modificar la puntuación original; al terminar aparece el enlace a la práctica de errores si hay pendientes. Las actividades 3 a 7 incorporan los errores recuperables de sus historiales al abrirlas. Guardar progreso no interrumpe la actividad si el almacenamiento está bloqueado.
