# Nosotros

Página institucional en `/nosotros/`, con cuatro contenidos alternables mediante botones:

- **Historia:** conserva la conversación original sobre el proyecto; se muestra inicialmente.
- **Nuestra filosofía:** introducción y tres ideas con sus ilustraciones, trasladadas de la portada.
- **Explora:** accesos a Biblioteca y Casilleros, trasladados de la portada.
- **Preguntas frecuentes:** las ocho preguntas originales, con respuestas desplegables mediante `details`.

`index.html` contiene toda la información. `estilos.css` conserva los estilos de la conversación y las secciones trasladadas. `script.js` muestra un contenido a la vez y actualiza `aria-pressed` en sus botones, relacionados con las secciones mediante `aria-controls`. Se usan con Tab, Enter y Espacio. Sin JavaScript, todos los contenidos permanecen visibles y los botones se ocultan.

`nosotros.json` describe las secciones reales; es documentación local y no se incorpora al catálogo educativo. No hay dependencias de producción ni almacenamiento local.

## Recursos compartidos y límites

Reutiliza `../recursos/css/base.css`, `../recursos/js/navegacion.js` y los SVG de identidad en `../recursos/svg/`. El encabezado, pie y controles flotantes siguen siendo los comunes del sitio. Las secciones no dependen de los estilos de la portada.

## Comprobaciones

Ejecutar `npm run catalogo` y `npm run validar` desde la raíz. Revisar los cuatro contenidos a 360, 768, 1024 y 1440 px, sin desplazamiento horizontal; alternar mediante ratón y teclado, comprobar el foco visible, las preguntas desplegables, los enlaces a Biblioteca y Casilleros, el menú móvil y su cierre con Escape. Comprobar la consola y que la información siga disponible sin JavaScript.
