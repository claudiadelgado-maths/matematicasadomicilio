# Plantilla de maestro

## Uso

1. Copia esta carpeta a `/[id-estable-del-asesor]/`.
2. Cambia `id`, `titulo`, `nombreVisible` y `ruta` en `maestro.json`.
3. Coloca la fotografía dentro de `recursos/` o reutiliza un recurso existente; actualiza `imagen` e `imagenAlt`.
4. Completa ubicación, banner, disponibilidad, precios, presentación y metodología.
5. Cambia `data-maestro-id` y los metadatos de `index.html`.
6. Cambia `estado` de `plantilla` a `activo` solo cuando el perfil sea publicable.
7. Ejecuta `npm run catalogo` y `npm run validar`.

Los alumnos no se agregan en este JSON. Cada alumno declara el ID del maestro en su propio `usuario.json`, evitando mantener listas duplicadas.

No incluyas teléfono, correo privado ni otra información directa del maestro. El primer contacto se gestiona desde Matemáticas a Domicilio.
