# Crear un usuario

Ruta: `/Casilleros/[slug-del-estudiante]/`.

Incluye `index.html`, `estilos.css`, `README.md` y `usuario.json`. Las sesiones viven directamente dentro del casillero. Usa solo el nombre o identificador autorizado y el contenido educativo necesario.

Parte de `/plantillas/alumno/`. Completa un ID globalmente único, un slug único para la URL, nombre, ruta, estado y personalización. El ID permanece estable aunque cambie el nombre visible. No se admiten dos carpetas con el mismo slug.

El índice obtiene automáticamente sus sesiones publicadas desde `recursos/datos/academia.json`. La portada muestra el banner cuando el casillero tiene `estado: activo` y se regenera el catálogo. No agregues tarjetas ni listas de sesiones manualmente. Documenta cualquier almacenamiento local y conserva sus claves al trasladar contenido.

Cada sesión es independiente: conserva sus recursos, diseño y comportamiento propios. Ejecuta `npm run catalogo` y `npm run validar` tras actualizar los metadatos.
