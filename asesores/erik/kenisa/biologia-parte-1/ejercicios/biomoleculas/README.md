# Principales biomoléculas de la célula

Recorrido exclusivo de Biología parte 1, KENISA → Erik. Entrada pública: `/asesores/erik/kenisa/biologia-parte-1/ejercicios/biomoleculas/`. Se integra desde el menú y al final del repaso de organelos, sin duplicar esos cuestionarios.

## Contenido real

- Guía #resumen-biomoleculas: orgánicas/inorgánicas, tabla de función y ejemplo adaptable a tarjetas en móvil, y cuatro comparaciones frecuentes.
- Laboratorio: siete botones sobre una célula SVG representan agua, carbohidratos, lípidos, proteínas, ácidos nucleicos, vitaminas y sales minerales. Cada uno abre una asociación visual, una idea principal, tres funciones breves y una demostración de tres estados. La ubicación de los iconos es un mapa de asociaciones, no la localización exclusiva de las sustancias. El progreso registra las siete exploradas; no exige completarlas para practicar.
- Actividad 1, #practica-funciones: banco de 49 preguntas reformuladas (siete por grupo), tres opciones mezcladas y una respuesta correcta. Al empezar se eligen 7 preguntas (una por grupo) o 14 (dos distintas por grupo). Corrección verde/✅ o rojo/❌, explicación, Siguiente, puntaje y nueva ronda. La primera respuesta es la puntuable. El resultado permite leer las respuestas falladas y sus explicaciones, y practicar solo esos errores conservando la calificación inicial.
- Actividad 2, #juego-clasificacion: 56 ejemplos o características (ocho por grupo) para clasificar en siete recipientes. Cada ronda trae 14 tarjetas, dos por grupo. Permite arrastre de ratón, arrastre táctil, toque directo en un grupo o teclado. Un error da una pista y permite corregir la misma tarjeta. Se distingue el número de tarjetas clasificadas del número de aciertos al primer intento. Al finalizar muestra ambos, los grupos para reforzar, otra ronda y la opción de repasar únicamente las tarjetas que necesitaron pistas. Ese repaso tiene puntaje propio, conserva el resultado inicial y ajusta el máximo del progreso a su longitud.
- Las rondas agotan variantes por grupo antes de reciclarlas, no repiten una pregunta dentro de la ronda y mezclan el orden. Los estados de exploración, preguntas y clasificación son independientes.

## Archivos y recursos

- index.html y estilos.css: entrada y composición propia, con identidad, logotipo, menú, pie y controles globales coherentes.
- script.mjs: exploración, demostraciones, clasificación y arrastre. iconos.mjs: dibujos SVG nativos de las siete asociaciones, sin imágenes remotas.
- datos.mjs: teoría breve, 49 preguntas y 56 tarjetas. modelo.mjs: estados y puntuación de clasificación. modelo.test.mjs: banco, cobertura, variedad, puntuación y reintentos.
- ../../recursos/biologia.css: identidad local común a la sesión y utilidad prioritaria [hidden]. ../../recursos/estudio.css comparte las guías y comparaciones con el inicio y organelos. Revisar las tres páginas si cambian.
- ../../recursos/cuestionarios.css, cuestionarios.mjs y modelo-repaso.mjs: presentación y motor idénticos compartidos con los cuestionarios de organelos. Cualquier cambio exige revisar ambas páginas consumidoras; los bancos y controladores particulares permanecen separados.
- Las referencias globales son relativas a seis niveles. Conservar el slug, la identidad del JSON y la ruta física de este módulo.

## Interacción y accesibilidad

Botones nativos con áreas táctiles amplias, foco visible y textos junto al color. Enter y Espacio seleccionan, responden y clasifican. Escape cancela un arrastre y el menú. La selección táctil del laboratorio acerca la explicación a la vista; Explorar otra permite seguir desde el panel. Las respuestas y pistas se anuncian con aria-live. Avanzar enfoca la pregunta o tarjeta nueva; finalizar enfoca el resultado. El medio de la tarjeta permite arrastrar; el resto de la página conserva el desplazamiento. Los recipientes tienen una alternativa completa por toque o teclado. Movimiento reducido desactiva las animaciones de demostración. Sin almacenamiento, red, servicios externos ni dependencias de producción.

## Criterios pedagógicos

Se distinguen biomoléculas orgánicas y sustancias inorgánicas esenciales. El agua se presenta como aproximadamente 70–80% de la masa de muchas células, con variación por tipo. Se separan energía química y ATP: la glucosa se transforma mediante reacciones, no se convierte mágicamente en electricidad. Los ejemplos no son alimentos mezclados. Las preguntas precisan la parte que se clasifica: hierro frente a hemoglobina, cadena de azúcares frente a proteína de membrana, insulina frente a hormona esteroidea y fosfato inorgánico frente a ADN. Huesos y dientes son funciones en el organismo, no estructuras de toda célula. No se dan recomendaciones de suplementos ni cantidades de consumo.

Referencias de verificación: [composición molecular de las células](https://www.ncbi.nlm.nih.gov/books/NBK9879/), [componentes químicos celulares](https://www.ncbi.nlm.nih.gov/books/NBK26883/) y [fichas de vitaminas y minerales del NIH](https://ods.od.nih.gov/factsheets/list-VitaminsMinerals/). Preguntas, tarjetas e ilustraciones propias.

## Comprobaciones

Desde la raíz, ejecutar npm run catalogo, npm run validar y node --test asesores/erik/kenisa/biologia-parte-1/ejercicios/biomoleculas/modelo.test.mjs. Revisar también las pruebas y la interfaz de los organelos porque comparten el motor de preguntas.

Probar los siete descubrimientos y sus demostraciones, teclado y movimiento reducido; rondas de 14 con errores y aciertos, puntaje 0/14 y 14/14, nuevas variantes e independencia entre actividades; clasificación por arrastre real de ratón y táctil, toque, teclado, errores/reintentos, ausencia de doble conteo, reinicio durante arrastre y resultados. Revisar 360, 768, 1024 y 1440 px, anclajes, menú/Escape, consola, recursos, enlaces y ausencia de desbordamiento horizontal.

## Mejoras de estudio y verificación

Cada demostración muestra pasos 1/2/3 seleccionables, etiquetas de la secuencia y explicación. Se puede regresar a un paso sin reiniciar la exploración. `demoLabels` en datos.mjs nombra las asociaciones. El esquema de carbohidratos representa glucosa, ATP y trabajo celular; el texto explica el intercambio de energía mediante reacciones.

El recorrido conserva 49 preguntas y 56 tarjetas. Los reintentos dirigidos no añaden duplicados al banco, no inflan el puntaje inicial y no se guardan al recargar. Los contadores de recipientes sin tarjetas en un repaso se omiten; esos recipientes permanecen como opciones de clasificación.

Ejecutar también `node --test asesores/erik/kenisa/biologia-parte-1/recursos/modelo-repaso.test.mjs`. Probar guía abierta a 360 px, las 21 combinaciones grupo/paso, rondas de 7 y 14, repaso de errores, repaso de clasificación con errores y regreso a una ronda completa de 14, sin paneles opcionales vacíos.

## Organización del menú (2026-10-03)

Este recorrido es la actividad principal 02. Sus prácticas internas se identifican como P1/P2, sin tarjetas independientes en el menú. El enlace final continúa a ../niveles-de-organizacion/index.html, actividad 03. Se conservan los bancos, ilustraciones y funcionamiento. biologia.css tiene cuatro páginas consumidoras; modelo-repaso.mjs lo utilizan los tres módulos de ejercicios.
