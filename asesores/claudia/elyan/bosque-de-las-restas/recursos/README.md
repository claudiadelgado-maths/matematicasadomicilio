# Recursos del bosque

Recursos exclusivos de esta sesión: modelo matemático, sus pruebas, interfaz, tablero interactivo, persistencia, estilos e ilustración. Solo los consumen el menú y sus tres actividades. Sin dependencias ni solicitudes a servicios externos en ejecución.

`pantalla.mjs` solicita y cierra la pantalla completa, con compatibilidad WebKit y recuperación cuando el navegador no la permite. `reproductor.mjs` abre la aventura desde el menú en una ventana con iframe del mismo origen, conserva la misión al cerrar/reabrir y restaura el foco. Sus mensajes comprueban origen y emisor; sincronizan el progreso en memoria cuando localStorage está bloqueado. `interfaz.mjs` admite un contenedor opcional en `celebrar()` para que el confeti de la aventura se vea dentro del diálogo de premio y de la pantalla completa; en la práctica conserva el comportamiento habitual.

## Retratos de rangos

`rangos/` contiene 11 iconos SVG propios, editables como código, con `viewBox="0 0 128 128"`. Comparten trazos y proporciones, pero cada uno tiene accesorios y colores distintos. No usan imágenes remotas, fuentes ni emojis. `RANGOS[].icono` identifica el nombre del archivo sin extensión y `pintarIconoRango()` resuelve su ruta relativa a `interfaz.mjs`. Las imágenes se marcan como decorativas porque el nombre del rango se muestra junto a ellas.

| Archivo en `rangos/` | Distinción visual |
| --- | --- |
| `pollito-aprendiz.svg` | Pollito en su cascarón |
| `pollito-valiente.svg` | Cinta y pañuelo rojos |
| `pollito-explorador.svg` | Sombrero y chaleco verdes |
| `pollito-maestro.svg` | Birrete violeta, gafas y pajarita |
| `gallo-guerrero.svg` | Casco con cresta y escudo de estrella |
| `raptor-chispeante.svg` | Raptor naranja con gafas de inventor |
| `raptor-del-trueno.svg` | Raptor azul con cresta y emblema de rayo |
| `dino-guardian.svg` | Cuello largo, corona de hojas y escudo |
| `trex-legendario.svg` | T-Rex violeta con corona y medalla |
| `super-dinosaurio-rex.svg` | T-Rex verde con antifaz y capa roja |
| `rex-mega-pro.svg` | T-Rex coral con corona, gafas oscuras, capa violeta y armadura dorada |

## Ilustración

`bosque.png`: PNG de 1536 × 1024, generado con la herramienta integrada `image_gen`, modo de generación nueva, sin imágenes de referencia ni fondo transparente. Se conserva tal como se generó; CSS se encarga del recorte adaptable. No contiene instrucciones matemáticas incrustadas.

Original de generación: `C:/Users/inmac/.codex/generated_images/01a0f657-d222-7ad2-8452-e879c7ed7564/exec-49fc7576-d578-4621-871f-6dd6b30898e4.png`. Copia de producción: `asesores/claudia/elyan/bosque-de-las-restas/recursos/bosque.png`.

Prompt final:

> Use case: illustration-story. Asset type: wide background illustration for an interactive children's maths forest adventure website. Create a polished, delightful 2D illustrated game world, landscape 1536x1024. A sunlit magical forest with rounded mint and emerald trees, warm cream paths, a charming little wooden produce market with red apples, yellow bananas and green leaves, an adorable fluffy yellow apprentice chick wearing a tiny explorer scarf in the foreground and a friendly smiling teal T-Rex with a golden star badge watching over the forest in the distance. Whimsical islands of flowers, firefly sparkles and a distant waterfall. Rich handcrafted storybook game art, soft painted shading and clean expressive silhouettes, joyful and adventurous, sophisticated visual craft for children aged eight. Wide open soft light clearing on the left half for overlaying HTML title and buttons; character and market concentrated on the right half. Pastel green, honey yellow, sky blue and soft coral. No writing, no digits, no UI buttons, no logos, no watermark, no borders. The image is scenery only; all mathematical controls and text will be drawn in HTML.
