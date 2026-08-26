# Plantilla de maestro

## Uso

1. Copia esta carpeta a `/asesores/[id-estable-del-asesor]/`.
2. Cambia `id`, `titulo`, `nombreVisible` y `ruta` en `maestro.json`.
3. Coloca la fotografía dentro de `recursos/` o reutiliza un recurso existente; actualiza `imagen`, `imagenAlt` e `imagenAjuste`. Usa `contain` si la fotografía debe verse completa y `cover` si puede recortarse para llenar el marco.
4. Completa ubicación, banner, modalidad, disponibilidad, precios, presentación y metodología. Para grupos, añade `modalidad.maximoAlumnos`.
5. Cambia `data-maestro-id` y los metadatos de `index.html`.
6. Cambia `estado` de `plantilla` a `activo` solo cuando el perfil sea publicable.
7. Ejecuta `npm run catalogo` y `npm run validar`.

`index.html`, `estilos.css` y `script.js` forman una unidad: la plantilla usa el script para cargar los datos académicos. Conserva los recursos particulares dentro de esta carpeta al crear el asesor.

Los alumnos no se agregan en este JSON. Cada alumno declara el ID del maestro en su propio `usuario.json`, evitando mantener listas duplicadas.

No incluyas teléfono, correo privado ni otra información directa del maestro. El primer contacto se gestiona desde Matemáticas a Domicilio.
