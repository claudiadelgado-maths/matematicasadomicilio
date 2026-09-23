# Actividad 3 · Operaciones con notación científica

Actividad para simplificar expresiones como las de la hoja de práctica: multiplicaciones, divisiones y expresiones combinadas con potencias de diez.

## Dinámica

- Hay 9 ejercicios fijos, de menor a mayor combinación de operaciones.
- El alumno escribe por separado el coeficiente y el exponente de la respuesta final $a \times 10^n$.
- La respuesta debe quedar normalizada: $1 \le |a| < 10$.
- Si el valor escrito es matemáticamente equivalente pero no está normalizado, se avisa y se permite corregirlo sin pasar de ejercicio.
- Una respuesta correcta avanza automáticamente después de 1 segundo.
- Una respuesta incorrecta muestra el resultado correcto y espera el botón «Siguiente».
- El avance, el borrador actual y el historial se guardan en `localStorage` con la clave `repaso-fisica-actividad-3-operaciones-v1`.

## Reglas repasadas

- En multiplicación: se multiplican coeficientes y se suman exponentes.
- En división: se dividen coeficientes y se restan exponentes.
- Al final se normaliza el coeficiente para dejarlo entre 1 y 10.

## Archivos

- `index.html`: interfaz.
- `estilos.css`: diseño local.
- `actividad.js`: ejercicios, validación, persistencia y navegación.

## Casillas de respuesta

Los campos nuevos se muestran vacíos, sin ejemplos de respuesta ni notas de formato debajo. Se conservan etiquetas, unidades, validación y borradores guardados por el alumno.

## Repaso personalizado

Carga ../recursos/repaso.js antes de actividad.js. Los errores válidos se guardan en una cola local independiente, sin modificar la puntuación original; al terminar aparece el enlace a la práctica de errores si hay pendientes. Las actividades 3 a 7 incorporan los errores recuperables de sus historiales al abrirlas. Guardar progreso no interrumpe la actividad si el almacenamiento está bloqueado.
