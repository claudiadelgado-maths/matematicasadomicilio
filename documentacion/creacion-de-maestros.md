# Crear un asesor

Ruta: `/[slug-del-asesor]/`.

Parte de `/plantillas/maestro/`. Completa `maestro.json` con un ID técnico estable, un `slug` para la ruta pública, identidad, rol público (`Asesor` o `Asesora`), imagen, ubicación, disponibilidad, precios, presentación y metodología. Cambia también `data-maestro-id`, título y descripción del `index.html`. El ID conserva las relaciones internas aunque cambie el nombre; el `slug` y la ruta determinan la dirección visible del salón.

No enumeres alumnos dentro del maestro. Cada alumno declara el ID de su maestro en `usuario.json` y el generador construye la relación.

Usa `estado: "plantilla"` mientras el perfil no deba aparecer y `estado: "activo"` cuando esté listo. No publiques información de contacto directa o privada.

Después ejecuta `npm run catalogo` y `npm run validar`. El nuevo asesor aparecerá automáticamente en `/usuarios/` y cada opción de sesión aparecerá en el catálogo de precios de la portada.
