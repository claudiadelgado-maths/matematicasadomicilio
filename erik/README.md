# Erik

Salón del primer asesor registrado en la arquitectura académica.

## Fuente de verdad

- `maestro.json`: identidad, ubicación, imagen, modalidad individual, disponibilidad, precios y presentación.
- `index.html`: contenedor reutilizable que carga el perfil desde `recursos/datos/academia.json`.
- La fotografía reutiliza `/recursos/imagenes/admin.jpg`, también utilizada en Contacto.

Los alumnos de Erik viven en subcarpetas de este salón y se relacionan mediante el campo técnico `maestro` de cada `usuario.json`; no se mantiene una lista duplicada.

Para actualizar contenido, modifica `maestro.json`, ejecuta `npm run catalogo` y después `npm run validar`.
