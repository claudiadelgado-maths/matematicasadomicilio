# Maestros

Cada subcarpeta contiene el perfil y los metadatos de un maestro. `maestro.json` es la fuente de verdad de su identidad, ubicación, disponibilidad, precios y contenido profesional.

Los alumnos no se enumeran manualmente aquí: cada `usuarios/[alumno]/usuario.json` indica a qué maestro pertenece y `npm run catalogo` genera la relación pública en `recursos/datos/academia.json`.

Solo los maestros con `estado: "activo"` aparecen en el sitio. La plantilla de partida está en `/plantillas/maestro/`.
