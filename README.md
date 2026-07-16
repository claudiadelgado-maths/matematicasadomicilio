# Ayuda en Matemáticas a Domicilio

Sitio web estático de Erik Estrella para presentar asesorías particulares de matemáticas a domicilio en Mérida, Yucatán. Está construido únicamente con HTML, CSS, JavaScript y archivos locales; no necesita instalar dependencias ni utilizar una base de datos.

## Cómo abrirlo localmente

La opción más sencilla es abrir `index.html` con un navegador. Para probar la navegación de una forma más parecida a GitHub Pages, conviene usar un servidor local.

Si tienes Python instalado:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000` en el navegador. Para detener el servidor, regresa a la terminal y presiona `Ctrl + C`.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube todos los archivos conservando esta estructura.
2. En el repositorio, abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona la rama principal y la carpeta raíz (`/ root`).
5. Guarda los cambios. GitHub mostrará la dirección pública cuando finalice la publicación.

Todas las rutas son relativas, por lo que el sitio funciona aunque cambie el nombre del repositorio.

## Estructura

```text
.
├── index.html
├── servicios.html
├── metodologia.html
├── recursos.html
├── sobre-erik.html
├── contacto.html
├── 404.html
├── .nojekyll
├── README.md
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── img/
        ├── logo-estrella.svg
        ├── favicon.svg
        ├── hero-erik-clase.svg
        ├── erik-explicando.svg
        ├── sesion-tecnologia.svg
        └── materiales-personalizados.svg
```

Una ampliación futura de recursos puede utilizar:

```text
resources/
├── diagnostico/
├── ejercicios/
└── calculadoras/
```

## Cambiar datos del servicio

### Teléfono y WhatsApp

Busca `999 129 3497` en los archivos HTML para cambiar el número visible. Busca `529991293497` para cambiar el número dentro de los enlaces de WhatsApp. El texto después de `?text=` es el mensaje inicial codificado para una URL.

Revisa todas las páginas después de cambiarlo para evitar que quede algún enlace anterior.

### Tarifa y duración

Busca `$250 MXN` para actualizar la tarifa. Busca `2 horas y media` y `dos horas y media` para actualizar la duración en todos los lugares donde se presenta. No cambies solamente una página: estos datos también aparecen en la portada, servicios, contacto y preguntas frecuentes.

### Colores

Los colores se encuentran al principio de `assets/css/styles.css`, dentro de `:root`. Modifica variables como `--color-background`, `--color-text`, `--color-muted`, `--color-surface` y `--color-border` para mantener el diseño consistente.

## Sustituir las imágenes provisionales

Los siguientes SVG son marcadores y deben reemplazarse posteriormente:

- `hero-erik-clase.svg`: fotografía horizontal o vertical de Erik impartiendo una asesoría.
- `erik-explicando.svg`: fotografía de Erik explicando en una libreta, pizarrón o mesa de trabajo.
- `sesion-tecnologia.svg`: fotografía utilizando GeoGebra, computadora o una herramienta visual.
- `materiales-personalizados.svg`: fotografía de ejercicios, materiales impresos o computadora.

Se recomienda preparar las fotografías en formato WebP optimizado. Si cambia el nombre o la extensión del archivo, actualiza también cada atributo `src` que lo utiliza en los HTML. Conserva dimensiones razonables —aproximadamente 1200 a 1600 píxeles en el lado más largo— y comprime cada archivo antes de publicarlo. Actualiza `width` y `height` para que coincidan con la proporción final y revisa que el texto alternativo siga describiendo la imagen real.

No presentes amigos como clientes ni agregues testimonios, certificaciones o resultados que no puedan comprobarse.

## Agregar Facebook e Instagram

En `contacto.html` hay un comentario que señala el lugar preparado para enlaces sociales. Agrega solamente perfiles oficiales ya disponibles. Un enlace externo debe incluir `target="_blank"` y `rel="noopener noreferrer"`. También puede añadirse al pie de cada página si se desea que aparezca en todo el sitio.

## Incorporar el diagnóstico

`recursos.html` contiene un comentario que marca el lugar previsto para un diagnóstico interactivo. La futura versión puede vivir en `resources/diagnostico/` y enlazarse desde la tarjeta correspondiente cuando esté terminada. Antes de publicarlo, conviene comprobar que sea usable con teclado, explique claramente los resultados y no recopile información personal innecesaria.

GitHub Pages no ejecuta Python ni código de servidor. Un diagnóstico publicado allí debe funcionar completamente en HTML, CSS y JavaScript, o utilizar un servicio externo evaluado expresamente.

## Incorporar calculadoras

Cada calculadora puede guardarse en una subcarpeta de `resources/calculadoras/` con sus propios archivos HTML, CSS y JavaScript. Activa su enlace en `recursos.html` solamente cuando funcione, tenga instrucciones, valide entradas y pueda utilizarse con teclado y en móvil.

## Revisión antes de publicar

1. Abre todas las páginas desde el menú y el pie de página.
2. Comprueba cada botón de WhatsApp y confirma el número y el mensaje.
3. Revisa que no exista ninguna imagen rota.
4. Prueba el menú móvil y la tecla `Escape`.
5. Navega con la tecla `Tab` y confirma que el foco siempre sea visible.
6. Prueba anchos cercanos a 360, 390, 768, 1024 y 1440 píxeles.
7. Confirma que la página no tenga desplazamiento horizontal.
8. Abre las herramientas del navegador y revisa que no haya errores en la consola.
9. Verifica que tarifa, duración, ubicación y teléfono sean correctos en todas las páginas.
10. Prueba una dirección inexistente después de publicar para comprobar `404.html`.

## Futuras versiones

La estructura ya permite añadir fotografías reales, redes sociales oficiales, diagnóstico, ejercicios y calculadoras sin cambiar el sistema visual ni las páginas principales. El JavaScript actual solo controla el menú móvil y el año automático del pie de página.
