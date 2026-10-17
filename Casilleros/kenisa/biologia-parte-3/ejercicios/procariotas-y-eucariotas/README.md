# 01 · Células procariotas y eucariotas

Actividad de Biología Parte 3 para KENISA (`kenisa-erik`). Ruta: `/Casilleros/kenisa/biologia-parte-3/ejercicios/procariotas-y-eucariotas/index.html`.

## Recorrido

1. **Explora:** definición y bacteria SVG con ocho estructuras: membrana, citoplasma, nucleoide, ribosomas, pared, flagelo, cápsula y plásmidos. Los botones de nombre, indicadores numéricos de escritorio y anterior/siguiente actualizan nombre, función, explicación, pista visual y resaltado. Cuenta las estructuras visitadas. En móvil se usan los botones de nombre y el anillo indicador, evitando blancos táctiles solapados en el dibujo.
2. **Ponme a prueba:** ocho retos aleatorios, uno por estructura, que combinan función y posición señalada. Ocho opciones mezcladas; primera respuesta definitiva, corrección explicada, puntaje y reinicio. Cambiar a exploración conserva las partes visitadas; regresar al reto comienza otro intento.
3. **Recuerda:** recordatorio breve de eucariotas y dibujo animal, enlace a la guía de Parte 1 y funciones ya estudiadas en un desplegable opcional. No repite la lección animal.
4. **Compara:** nueve filas, filtro de tres coincidencias o seis diferencias; tres afirmaciones desplegables para aclarar confusiones.
5. **Clasifica:** 14 tarjetas únicas (diez ejemplos y cuatro descripciones), con SVG propio, opciones procariota/eucariota, explicación, resultado y revisión. Se puede repetir solo lo fallado sin cambiar el resultado inicial o empezar otra ronda de 14.
6. **Repasa:** las 20 preguntas de la guía del docente, agrupadas en diez pares. Reutiliza el sistema de Parte 1: diez o veinte preguntas, orden y opciones mezclados, cobertura de todas las categorías, bloqueo de segunda respuesta, porcentaje, explicación de errores y repaso dirigido separado del resultado inicial. Los dos repasos breves agotan el banco antes de reciclarlo. El completo cubre las veinte preguntas; otra ronda cambia el orden, no inventa preguntas nuevas.

## Criterios científicos

El nucleoide es una región sin membrana que contiene la mayor parte del ADN procariota. Las procariotas sí tienen ADN, membrana, citoplasma y ribosomas; no tienen organelos membranosos como mitocondrias o Golgi. Cápsula, flagelo y plásmidos son opcionales, y la pared está en la mayoría. Las arqueas también son procariotas. El tamaño y la fisión binaria se presentan con «generalmente». Los organismos procariotas pueden formar colonias y filamentos.

La eucariota tiene núcleo delimitado y organelos membranosos; «mayor parte del ADN» evita sugerir que todo está en el núcleo. Levadura y ameba muestran que hay eucariotas unicelulares. Pared celular no equivale a procariota. Se describe una célula viva de la capa basal de la piel para evitar confundir células queratinizadas; la pregunta 17 explicita ADN en nucleoide y organismo unicelular. No adelanta el desarrollo de vegetal, clasificación general ni Fungi.

Referencias de verificación: [OpenStax, células procariotas](https://openstax.org/books/biology-2e/pages/4-2-prokaryotic-cells) y [células eucariotas](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells). Dibujos y redacción propios a partir del contenido solicitado; no se copian sus ilustraciones ni ejercicios.

## Dependencias y accesibilidad

`script.mjs` controla los tres recorridos independientes. Datos en `../../recursos/contenido.mjs`; identidad y SVG en `../../recursos/`. El SVG bacteriano está insertado en HTML para resaltar sus grupos `data-part`; las coordenadas están en `structures`. Mantener esa copia sincronizada con `../../recursos/bacteria.svg` (la copia externa no tiene anillo dinámico).

Se reutilizan `../../../biologia-parte-1/recursos/cuestionarios.mjs`, `cuestionarios.css` y `modelo-repaso.mjs`; no se modifican. Fuente del casillero, base CSS, marca y navegación globales documentadas en el README de sesión. Se enlaza a Parte 1, no se altera su contenido.

Botones nativos, teclado Tab/Enter/Espacio, foco al avanzar y al mostrar resultados, `aria-pressed`, retroalimentación `aria-live`, texto junto al color, sin reloj ni arrastre obligatorio. El dibujo incluye alternativa textual; las tarjetas decorativas tienen sus nombres visibles. Respeta movimiento reducido. Filtros y repasos ocultan componentes no aplicables. No usa almacenamiento ni envía respuestas. Al recargar se reinicia.

## Pruebas

`node --test Casilleros/kenisa/biologia-parte-3/recursos/contenido.test.mjs Casilleros/kenisa/biologia-parte-1/recursos/modelo-repaso.test.mjs`. Ejecutar `npm run catalogo` y `npm run validar` desde la raíz.

En navegador: seleccionar las ocho partes, verificar función y marcador, acertar/fallar en reto, completar 8, reiniciar y alternar modo. Clasificar 14, comprobar que no puntúa dos veces, revisar y corregir errores, repetir. Filtrar comparación y abrir recordatorio. Completar 10 y 20 preguntas, corregir subconjunto de errores conservando nota inicial y cambiar de ronda. Revisar teclado, Escape del menú móvil, 360/768/1024/1440 px, consola, enlaces e imágenes.
