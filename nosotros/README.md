# Nosotros

Página institucional en `/nosotros/index.html`. La vista inicial es una lista de tres conversaciones, con avatar y vista previa:

- **Historia:** conserva íntegros los 54 mensajes y los estilos de la conversación original sobre el proyecto.
- **Filosofía:** presenta la plataforma y las tres ideas de nuestra filosofía como preguntas y respuestas con emojis.
- **Preguntas frecuentes:** conserva los ocho temas originales en una conversación, con enlaces a Contacto y Biblioteca.

Al seleccionar un chat, su conversación ocupa el contenido de la página. La barra superior muestra su nombre y una flecha para volver a la lista. No hay marco de teléfono, ventanas emergentes, formulario de envío ni mensajes en tiempo real. Se retiraron los botones anteriores, el encabezado «Nosotros» y la sección Explora.

## Archivos y navegación

`index.html` contiene todos los mensajes. `estilos.css` define la lista y su barra superior, y reutiliza el diseño original de Historia en los tres chats. `script.js` muestra una sola vista mediante los fragmentos `#chats`, `#historia`, `#filosofia` y `#preguntas`. Los enlaces directos, la recarga y Atrás/Adelante del navegador mantienen la vista correspondiente. Los enlaces de salto al contenido no cambian el chat abierto.

Los enlaces funcionan con Tab y Enter. Al abrir un chat, el foco pasa a su título; al volver a la lista, regresa al enlace de la conversación. Sin JavaScript, los tres chats permanecen visibles y la lista enlaza a cada sección del documento.

`nosotros.json` describe las secciones reales; es documentación local y no se incorpora al catálogo educativo. No hay dependencias de producción ni almacenamiento local.

## Recursos compartidos y límites

Reutiliza `../recursos/css/base.css`, `../recursos/js/navegacion.js` y los SVG de identidad en `../recursos/svg/`. El encabezado, pie y controles flotantes siguen siendo los comunes del sitio. Los estilos particulares permanecen en esta carpeta.

## Comprobaciones

Ejecutar `npm run catalogo` y `npm run validar` desde la raíz. Revisar la lista y los tres chats a 360, 768, 1024 y 1440 px, sin desplazamiento horizontal; navegar con ratón y teclado, comprobar el foco visible, la vuelta a la lista, los enlaces directos y Atrás/Adelante. Revisar los enlaces a Contacto y Biblioteca, el menú móvil y su cierre con Escape, la consola y la lectura sin JavaScript. Comprobar que Historia conserva sus 54 mensajes y su diseño.
