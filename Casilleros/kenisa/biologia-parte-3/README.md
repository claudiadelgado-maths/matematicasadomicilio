# Biología Parte 3 · KENISA

Sesión independiente del casillero `kenisa-erik`, fecha editorial 2026-10-16. Ruta pública: `/Casilleros/kenisa/biologia-parte-3/index.html`.

## Alcance

Están disponibles la actividad 01, **Células procariotas y eucariotas**, y la actividad 02 completa, **Célula vegetal**: ilustración de 11 elementos, identificación, 18 tarjetas de clasificación, laboratorios de fotosíntesis y día/noche y repaso de 48 preguntas. También está disponible la actividad 03, Clasificación de los seres vivos: siete criterios, siete pasaportes, seis ideas verdadero/falso y examen de 60 preguntas. Está disponible la actividad 04, Reino Fungi, que completa la sesión con estructuras, nutrición, reproducción, ocho casos y banco de 60 preguntas. No hay actividades pendientes ni enlaces vacíos. `sesion.json` declara únicamente ejercicios.

La portada enlaza a las cuatro actividades, al casillero y a Biología Partes 1 y 2. Conserva encabezado, pie, marca, menú y controles flotantes del sitio. Paleta crema, verde, lila y lima; tipografía Fredoka local del casillero. Diseño adaptable, SVG propios, sin nuevas dependencias.

## Recursos y consumidores

- `recursos/sesion.css`: identidad local consumida por el menú y las actividades 01, 02, 03 y 04, mediante sus respectivos `estilos.css`. Revisar las cinco páginas al modificarla.
- `recursos/bacteria.svg`: ilustración de portada y cabecera de actividad. La copia SVG interna en el laboratorio permite resaltar ocho estructuras; mantener geometría y coordenadas sincronizadas con `structures` en `contenido.mjs`.
- `recursos/animal.svg`: esquema original breve en portada, recordatorio eucariota y clasificación animal/vegetal de la actividad 02.
- `recursos/organismos.svg`: once símbolos originales para las tarjetas de clasificación de la actividad 01; el símbolo planta también se utiliza en la simulación día/noche de la actividad vegetal. Los símbolos ameba y levadura también son consumidos por los pasaportes de la actividad 03; levadura aparece además en la portada. Revisar estos consumidores si se modifica.
- `recursos/contenido.mjs`: ocho estructuras, 14 tarjetas, diez categorías y banco de 20 preguntas suministradas por el docente, con explicaciones. No contiene preguntas de las actividades futuras.
- Fuente `../recursos/fredoka.ttf`, licencia en `../recursos/fredoka-OFL.txt`.
- Las cuatro actividades reutilizan sin modificar `../biologia-parte-1/recursos/cuestionarios.mjs`, `cuestionarios.css` y `modelo-repaso.mjs`. Estos recursos de la familia Biología también tienen consumidores en Parte 1. No duplica ni crea otro motor para el banco de examen.
- Base CSS, navegación y SVG de marca globales, por rutas relativas. No cambia recursos globales.

## Verificación

Desde la raíz: `node --test Casilleros/kenisa/biologia-parte-3/recursos/contenido.test.mjs Casilleros/kenisa/biologia-parte-1/recursos/modelo-repaso.test.mjs`, `npm run catalogo` y `npm run validar`.

Revisar menú → actividad → menú → casillero, las dos páginas a 360/768/1024/1440 px, consola, imágenes, enlaces y teclado. Probar ocho estructuras y reto, comparación, clasificación con aciertos y errores, repaso de errores, rondas 10/20, resultados y reinicios. No hay persistencia ni red de respuestas: el progreso dura la visita.

Verificación de la actividad 01 el 2026-10-16: ocho pruebas automáticas aprobadas; recorridos 8/14/20 y ronda breve de 10 completados en navegador, con errores deliberados, reintentos y conservación del resultado inicial. Menú y actividad sin desbordamiento en los cuatro anchos, imágenes cargadas, consola sin errores, menú con Enter/Escape y 22 destinos locales comprobados por HTTP. La sesión aparece en el casillero.

Verificación de la actividad 02 el 2026-10-16: nueve pruebas automáticas aprobadas; exploración de once elementos, retos 11/18 y exámenes 8/16 completados en navegador. Se verificaron errores deliberados, correcciones, conservación de notas iniciales, reinicios, ocho combinaciones de insumos y día/noche. Actividad sin desbordamiento a 360/768/1024/1440 px; navegación desde el menú, teclado, imágenes y consola correctos. Auditoría de las tres páginas: 96 referencias locales y anclajes válidos. Catálogo actualizado: 289 módulos y 21 casilleros. El validador conserva diez errores preexistentes de carpetas declaradas y ausentes en `andres/interes-simple-y-compuesto` y `renata/determinantes-2x2`; ninguno pertenece a esta sesión.

## Actividad 02 · Completa

La guía preparada se conserva y ahora se acompaña de la célula explorable, reto de once elementos, dieciocho tarjetas, control de insumos fotosintéticos, día/noche y repaso del banco de 48 preguntas en rondas de 8/16. Se reutiliza el motor de Parte 1. La ilustración local ejercicios/celula-vegetal/recursos/celula-vegetal.svg se utiliza también en esta portada y se inserta en la actividad para señalar sus partes. Mantener la copia interna y los puntos de modelo.mjs sincronizados al editarla. La imagen animal compartida también se usa en la clasificación vegetal. No quedan interacciones pendientes en la actividad 02. Las actividades 03 y 04 también están disponibles.

## Actividad 03 · Clasificación de los seres vivos

Contenido completo en ejercicios/clasificacion-de-los-seres-vivos/: siete criterios, pasaportes con tres etiquetas simultáneas para siete organismos, seis ideas verdadero/falso y banco de 60 preguntas en diez temas (rondas de 10/20 y repaso de errores). El cierre enlaza a la actividad 04, Reino Fungi. No cambia código compartido. Ver README local para fuentes, datos, pruebas y estado.

Verificación de la actividad 03 el 2026-10-16: cuatro pruebas aprobadas; pasaportes, verdadero/falso y examen con corrección de errores comprobados en navegador. Móvil/escritorio, teclado y consola correctos; 134 referencias locales válidas en las cuatro páginas. Catálogo vigente: 290 módulos y 21 casilleros. Se mantienen los diez errores previos del validador en Andrés y Renata.

## Actividad 04 · Reino Fungi

Disponible en `ejercicios/reino-fungi/index.html`. Cinco estructuras explorables, relación estructura/función, orden de digestión externa y absorción, nueve etapas ilustradas de tres mecanismos reproductivos, ocho casos con tres clasificaciones y 60 preguntas (rondas 10/20). Incluye guía, comparación de reinos, hábitat e importancia. La ilustración `ejercicios/reino-fungi/recursos/hongo.svg` se usa en la portada y cabecera; su copia interna permite resaltar estructuras. No cambia recursos compartidos de interacción. Todas las actividades enlazan a la portada; la 03 enlaza a la 04 y esta cierra con enlaces a las tres anteriores. Ver README local para criterios, pruebas y estado.

Verificación de la actividad 04 el 2026-10-16: cinco pruebas aprobadas; todos los laboratorios y ocho casos, errores/correcciones y examen comprobados. Menú con 4/4 actividades y continuidad 03/04; cuatro anchos sin desbordamiento, teclado y consola correctos. Auditoría final: 179 referencias locales válidas en cinco páginas. Catálogo vigente: 291 módulos y 21 casilleros. El validador conserva los diez errores ajenos de Andrés y Renata.
