# Series geométricas

Sesión independiente de Alejandrina, del asesor Erik.
Estado actual: vanilla visible, sin contenido educativo ni componentes. La fecha editorial inicial es 2026-09-22.
Lee este README y sesion.json antes de trabajar, también si eres una IA.

## Trabaja solamente en esta carpeta

- index.html es la entrada pública: desarrolla el contenido dentro de main, sustituyendo el aviso «Sesión en preparación».
- estilos.css contiene el diseño local y puede ampliarse libremente.
- Añade JavaScript, imágenes y recursos propios aquí cuando hagan falta; usa recursos/ para archivos exclusivos. No crees archivos ni secciones opcionales vacías.
- Puedes crear componentes en subcarpetas con index.html, estilos.css, README.md y sus metadatos según las convenciones del proyecto. Enlázalos desde esta sesión.
- Actualiza descripcion, objetivo, conocimientosPrevios y componentes en sesion.json para describir lo que realmente existe; sincroniza este README. Conserva titulo coherente con la página.

## Contrato que debes conservar

- No renombres la carpeta series-geometricas, index.html, estilos.css, sesion.json ni README.md.
- No cambies estos campos de sesion.json: id = series-geometricas-alejandrina; slug = series-geometricas; tipo = sesion; usuario = alejandrina; ruta = /asesores/erik/alejandrina/series-geometricas/.
- Conserva estado = publicado para que siga apareciendo en el alumno. Aquí publicado significa visible, aunque el contenido esté en preparación. No vuelvas a registrar la sesión.
- La fecha editorial la administra quien incorpora la versión; conserva 2026-09-22 hasta que esa persona decida actualizarla en este JSON.
- Conserva encabezado, logotipo, menú, pie, enlace de salto y main con id contenido; las migas enlazan al alumno (../) y al asesor (../../).
- Conserva las referencias relativas a ../../../../recursos/css/base.css, ../../../../recursos/js/navegacion.js y ../../../../recursos/svg/. El script global genera los controles flotantes: no los dupliques.
- No hay exports, props ni componentes de framework obligatorios. No requiere JavaScript propio ni imports de otros alumnos.
- No edites archivos fuera de esta carpeta. La carpeta utiliza recursos de la plataforma: por sí sola no es una copia autónoma del sitio.

## Entrega y sustitución

Devuelve la carpeta completa series-geometricas, sin una carpeta adicional anidada. El responsable sustituye la carpeta en /asesores/erik/alejandrina/series-geometricas/ conservando nombre y ubicación.
Los cambios de HTML, CSS y recursos se sirven directamente al recargar por HTTP. Si hay caché, recarga sin caché; al publicar, sube los archivos actualizados.
Para reflejar también cambios de metadatos en las listas, el responsable ejecuta desde la raíz npm run catalogo y npm run validar. Estos comandos actualizan derivados automáticamente; no se edita ningún registro externo manualmente.

## Verificación de entrega

Abre la URL /asesores/erik/alejandrina/series-geometricas/ desde el servidor de la plataforma. Revisa móvil, escritorio, teclado, menú con Escape, consola, enlaces al alumno y al asesor y ausencia de desbordamiento horizontal. Comprueba que los componentes declarados existen y que no se anuncian componentes vacíos.
