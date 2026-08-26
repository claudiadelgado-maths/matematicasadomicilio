# Crear un usuario

Ruta: `/asesores/[asesor]/[slug-del-alumno]/`.

Incluye `index.html`, `README.md` y `usuario.json`. Las sesiones viven directamente dentro del casillero. Evita datos sensibles: usa solo el nombre o identificador autorizado y contenido educativo necesario.

Parte de `/plantillas/alumno/`. En `usuario.json` completa un ID globalmente único, un `slug` corto para la URL, nombre, ruta, estado, el ID del asesor y la personalización básica del casillero. Dos salones pueden reutilizar el mismo `slug` de alumno porque el asesor forma parte de la ruta; sus IDs internos continúan siendo únicos.

El índice del usuario carga automáticamente sus sesiones publicadas desde `recursos/datos/academia.json`. No agregues tarjetas manuales ni una lista duplicada de sesiones. Si se necesita almacenamiento local, documenta claves y comportamiento de borrado.

Un alumno aparece dentro del salón de su asesor cuando tiene `estado: "activo"`, referencia a un asesor activo y se ejecuta `npm run catalogo`. Incluir al asesor en la ruta permite que distintos salones tengan alumnos con el mismo slug.
