# 02 — Mitosis: cómo se divide una célula

Actividad introductoria de preparatoria para KENISA (`kenisa-erik`), parte de `biologia-parte-2-kenisa-erik`. Entrada: `/Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis/index.html`. Disponible desde el menú y desde el cierre de ADN y cromosomas. El cierre continúa a la actividad 03, Meiosis, ya disponible.

## Contenido real

- Recordatorio de replicación en interfase: crecimiento, funciones y preparación previa; no se cuenta como fase mitótica.
- Laboratorio con una célula animal y seis etapas seleccionables: final de interfase, profase, metafase, anafase, telofase y citocinesis. Anterior/Siguiente, reproducción cada seis segundos, pausa y repetición al finalizar. Nunca reproduce automáticamente al cargar. Los diagramas también tienen descripciones accesibles.
- Ocho trazos de ADN representan las dos copias de cuatro cromosomas (modelo diploide 2n = 4, dos largos y dos cortos). La identidad de cada trazo permanece al condensarse, alinearse, separarse y descondensarse. Cuatro colores siguen los cuatro cromosomas originales, con una copia de cada color por hija.
- El huso conecta las hermanas a polos opuestos; aparecen la placa ecuatorial, flechas de separación, dos envolturas nucleares y un surco que conduce a dos células. Contadores distinguen cromosomas duplicados, independientes y por núcleo/hija.
- Citocinesis animal mediante surco y vegetal mediante placa, con esquemas separados.
- Conteo humano: 46 sin duplicar → 46 duplicados/92 cromátidas → 46 por hija. Una explicación desplegable precisa el conteo transitorio de anafase.
- Resultado: una división nuclear, dos células tras citocinesis, conservación del número cromosómico y de la información genética esencial, salvo mutaciones. Ejemplo diploide 2n → 2n + 2n; no se afirma que la mitosis solo ocurra en células diploides.
- Crecimiento, reparación y reemplazo, con ejemplos de piel y cicatrización.
- Práctica 1: ordenar las cuatro fases eligiendo el siguiente paso. Pistas inmediatas, reintentos, dibujos que completan la secuencia y reinicio con opciones mezcladas. No requiere arrastrar.
- Práctica 2: cuatro imágenes en orden aleatorio para identificar profase, metafase, anafase y telofase; explicación, reintentos y nuevas rondas sin puntuación.
- Test: 16 preguntas, dos con imágenes, tres opciones mezcladas, primera respuesta confirmada puntuable, explicaciones, resultado, revisión de errores con enlaces, repetición y regreso a la teoría/menú.

## Criterios científicos

La mitosis divide el núcleo y reparte ADN previamente duplicado; la citocinesis divide el citoplasma. Aunque se presentan en tarjetas sucesivas, la citocinesis puede comenzar durante las últimas fases mitóticas. En el esquema introductorio de cuatro fases, el desarme de la envoltura nuclear se agrupa dentro de profase sin desarrollar prometafase. Las hermanas, no los pares de homólogos, se separan en anafase.

La duplicación del ADN no duplica el conteo de cromosomas mientras las hermanas están unidas. Una vez separadas, cada cromátida se considera un cromosoma independiente: temporalmente 8 en la célula del modelo, 4 hacia cada polo; en humanos, 92 en la célula sin separar, 46 hacia cada polo. El resultado conserva el número por hija. En telofase y citocinesis el ADN se descondensa; las X no permanecen en las hijas.

La animación es una representación esquemática sin escala espacial o temporal. Los colores, posiciones de los dos pares y movimientos simplifican la lectura; no son un mapa de colores reales. Navegar hacia atrás sirve para repasar y no representa reversión biológica. No se enseñan meiosis, crossing-over ni mecanismos moleculares avanzados.

Referencias: [mitosis, NHGRI](https://www.genome.gov/genetics-glossary/Mitosis), [ciclo celular, NHGRI](https://www.genome.gov/genetics-glossary/Cell-Cycle), [Mitosis, Molecular Biology of the Cell](https://www.ncbi.nlm.nih.gov/books/NBK26934/), [Citocinesis, Molecular Biology of the Cell](https://www.ncbi.nlm.nih.gov/books/NBK26831/). Texto, banco y vectores propios.

## Archivos y dependencias

- `index.html`, `estilos.css`: estructura y estilo local con navegación, marca, pie y flotantes globales.
- `datos.mjs`: seis etapas, orden, cuatro reconocimientos y 16 preguntas.
- Meiosis reutiliza `sceneMarkup(3)` de esta actividad para identificar la anafase mitótica y `shuffled` de `modelo.mjs`; revisar su primera práctica si cambian estos recursos.
- `escena.mjs`: geometría pura (`frameFor`, `sceneMarkup`) y controlador SVG. Interpola atributos durante 950 ms con requestAnimationFrame, sin dependencias. La escena conserva los ocho nodos de ADN.
- `modelo.mjs`: secuencia validada y mezcla de listas. `modelo.test.mjs`: bancos, orden, claves, conservación visual y puntuación.
- `script.mjs`: reproducción, navegación, movimiento reducido y prácticas. La reproducción se detiene al ocultar/salir de la página, elegir otra fase, seguir un enlace, empezar el test o cambiar la preferencia de movimiento.
- `../../recursos/biologia.css`: identidad compartida por menú, ADN y Mitosis, sin cambios de comportamiento.
- `../../recursos/repaso.css`, `repaso.mjs` y `modelo-repaso.mjs`: estilos/motor/modelo compartidos con ADN y cromosomas, Meiosis y la actividad 04. Revisar los cuatro repasos al modificarlos.
- `../../recursos/diagramas.svg`: dos dibujos de replicación reutilizados sin modificar; consumidores: menú y actividades 01/02.
- `../../recursos/mitosis.svg`: ilustración compartida con el menú, generada mediante `sceneMarkup(5)`. Al cambiar la geometría, regenerar esta ilustración y el SVG inicial de `#main-cell` con `sceneMarkup(0)`.
- Recursos globales mediante rutas relativas a cinco niveles y fuente Fredoka del casillero.

No hay almacenamiento, cuentas, envío de resultados, paquetes nuevos ni llamadas externas para aprender. Con JavaScript desactivado permanecen las explicaciones, ilustraciones y resumen de las seis etapas; las prácticas y controles se ocultan y se muestra una indicación.

## Accesibilidad y comprobaciones

Botones nativos, opciones por teclado/tacto, radios con leyenda, aria-pressed, aria-live/role=status, foco visible y manejo del foco al responder/avanzar. La preferencia del sistema y la casilla Reducir movimiento anulan la interpolación. La reproducción solo se inicia por petición y tiene pausa.

Desde la raíz:

```
node --test Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis/modelo.test.mjs Casilleros/kenisa/biologia-parte-2/ejercicios/adn-y-cromosomas/modelo.test.mjs
npm run catalogo
npm run validar
```

Revisar 360/768/1024/1440 px; las seis vistas, Anterior/Siguiente, reproducción/pausa/final/repetición, saltos entre vistas, movimiento reducido, menú y Escape; prácticas con errores y reinicios; test sin respuesta y resultados 0/16 y 16/16, preguntas con dibujo, revisión y repetición. Revisar regresión del test de ADN al compartir motor, enlace de continuidad desde ADN, menú/casillero, consola, recursos y ausencia de desbordamiento.

Comprobación realizada el 14 de octubre de 2026: 11 pruebas automáticas aprobadas; menú y actividades 01/02 sin desbordamiento en los cuatro anchos; recorrido, pausa, reinicio, prácticas, teclado, imágenes, repaso 0/16 y 16/16, y regresión de ADN 14/14 revisados en navegador, sin errores de consola. Los 112 enlaces y recursos locales de las tres páginas resuelven correctamente. `npm run catalogo` genera 278 módulos públicos; `npm run validar` conserva 10 errores previos por carpetas declaradas y ausentes en las sesiones de Andrés (interés simple y compuesto) y Renata (determinantes 2×2), sin errores en Biología parte 2.

La actividad 04 reutiliza las escenas SVG de este módulo para la comparación, separación y preguntas visuales. Tras modificar `escena.mjs`, revisar también la actividad 04 y regenerar sus ilustraciones estáticas.
