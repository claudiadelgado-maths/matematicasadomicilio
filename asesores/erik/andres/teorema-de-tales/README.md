# Teorema de Tales

Sesión independiente de Andrés, del asesor Erik.
Estado actual: sesión desarrollada de ejemplo con explicación visual, laboratorio de paralelas, ejemplo guiado paso a paso y juego interactivo. La fecha editorial inicial es 2026-09-22.
Lee este README y sesion.json antes de trabajar, también si eres una IA.

## Trabaja solamente en esta carpeta

- index.html es la entrada pública y contiene la estructura de la explicación, ejemplo y juego. Puede editarse el contenido dentro de main conservando el contrato estructural indicado abajo.
- estilos.css contiene todo el diseño local de esta sesión y puede ampliarse libremente.
- sesion.js contiene únicamente la interacción del juego y puede editarse o ampliarse sin tocar código global.
- Añade JavaScript, imágenes y recursos propios aquí cuando hagan falta; usa recursos/ para archivos exclusivos. No crees archivos ni secciones opcionales vacías.
- Puedes crear componentes en subcarpetas con index.html, estilos.css, README.md y sus metadatos según las convenciones del proyecto. Enlázalos desde esta sesión.
- Actualiza descripcion, objetivo y conocimientosPrevios en sesion.json para describir la sesión. El bloque componentes debe marcar true únicamente cuando exista la subcarpeta correspondiente (explicacion/, demostraciones/, ejercicios/, juegos/ o calculadoras/). En esta versión la explicación, el ejemplo y el juego están integrados directamente en index.html, por eso esos indicadores permanecen en false.

## Contrato que debes conservar

- No renombres la carpeta teorema-de-tales, index.html, estilos.css, sesion.js, sesion.json ni README.md.
- No cambies estos campos de sesion.json: id = teorema-de-tales-andres; slug = teorema-de-tales; tipo = sesion; usuario = andres; ruta = /asesores/erik/andres/teorema-de-tales/.
- Conserva estado = publicado para que siga apareciendo en el alumno. Aquí publicado significa visible, aunque el contenido esté en preparación. No vuelvas a registrar la sesión.
- La fecha editorial la administra quien incorpora la versión; conserva 2026-09-22 hasta que esa persona decida actualizarla en este JSON.
- Conserva encabezado, logotipo, menú, pie, enlace de salto y main con id contenido; las migas enlazan al alumno (../) y al asesor (../../).
- Conserva las referencias relativas a ../../../../recursos/css/base.css, ../../../../recursos/js/navegacion.js y ../../../../recursos/svg/. El script global genera los controles flotantes: no los dupliques.
- No hay exports, props ni componentes de framework obligatorios. El JavaScript propio está aislado en sesion.js y no importa código de otros alumnos.
- No edites archivos fuera de esta carpeta. La carpeta utiliza recursos de la plataforma: por sí sola no es una copia autónoma del sitio.

## Entrega y sustitución

Devuelve la carpeta completa teorema-de-tales, sin una carpeta adicional anidada. El responsable sustituye la carpeta en /asesores/erik/andres/teorema-de-tales/ conservando nombre y ubicación.
Los cambios de HTML, CSS y recursos se sirven directamente al recargar por HTTP. Si hay caché, recarga sin caché; al publicar, sube los archivos actualizados.
Para reflejar también cambios de metadatos en las listas, el responsable ejecuta desde la raíz npm run catalogo y npm run validar. Estos comandos actualizan derivados automáticamente; no se edita ningún registro externo manualmente.

## Verificación de entrega

Abre la URL /asesores/erik/andres/teorema-de-tales/ desde el servidor de la plataforma. Revisa móvil, escritorio, teclado, menú con Escape, consola, enlaces al alumno y al asesor y ausencia de desbordamiento horizontal. Comprueba que los componentes declarados existen y que no se anuncian componentes vacíos.
