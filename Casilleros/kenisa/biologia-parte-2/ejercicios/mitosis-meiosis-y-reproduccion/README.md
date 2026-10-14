# 04 — Mitosis vs. meiosis y reproducción

Cierre de las cuatro actividades de Biología parte 2, KENISA (`kenisa-erik`). Entrada: `/Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis-meiosis-y-reproduccion/index.html`. Acceso desde el menú y el cierre de Meiosis. Fecha editorial: 2026-10-14.

## Contenido real

- Comparación visual en tres momentos: inicio con ADN copiado, primera división y resultado final. Modelo animal 2n = 4; tras mitosis, dos células 2n = 4; tras Meiosis I, dos n = 2 con cromosomas duplicados; tras Meiosis II, cuatro n = 2. No se repite una segunda mitosis en la tercera vista.
- Tabla de función, células humanas, divisiones, productos, número cromosómico, ploidía, información genética y ejemplo. Tres dibujos comparan anafase mitótica, Anafase I y Anafase II.
- Recordatorio de ADN/genes/cromosomas, replicación y diferencia entre número de cromosomas y cromátidas.
- Explorador manual de tres estados: gametos humanos n = 23, fecundación/cigoto 2n = 46 y primera mitosis tras replicación, con 46 por hija. Botones directos y avance/reinicio, texto y anuncio accesible. Los 23 trazos simbólicos de cada aporte se reúnen y se representan en ambas hijas; no se anima la secuencia de fases.
- Ciclo adulto/línea germinal → meiosis → gametos → fecundación → cigoto → mitosis → desarrollo y crecimiento; se aclara que en la fecundación participa un gameto de cada progenitor.
- Tres fuentes de combinaciones: entrecruzamiento entre no hermanas, distribución de homólogos y unión de gametos.
- Práctica 1: ocho situaciones mezcladas para identificar mitosis, meiosis o fecundación, con explicación, reintentos y reinicio. La separación de homólogos se identifica como Anafase I.
- Práctica 2: construir una secuencia de seis piezas mezcladas mediante botones. No avanza con errores; ofrece pistas, deshacer y reiniciar. Funciona sin arrastrar.
- Test integrador de 22 preguntas, cuatro con dibujos. Tres opciones mezcladas por pregunta, primera confirmación puntuable, explicación, aciertos sobre 22, revisión de errores con enlaces al concepto y repetición. Accesos a las otras tres actividades y al menú.
- Cierre de sesión con reto oral de explicación. Sin actividad futura ni progreso de aprendizaje ficticio.

## Criterios científicos

La mitosis conserva la ploidía; no siempre parte de una célula diploide. En humanos se destaca reparación, crecimiento y reemplazo somático sin excluir mitosis de la línea germinal. Las hijas son genéticamente muy similares salvo mutaciones. Cuatro células por sí solas no prueban meiosis: dos rondas mitóticas también pueden producir cuatro.

La meiosis tiene una replicación anterior y dos divisiones; ninguna replicación entre ellas. Meiosis I separa homólogos y ya produce células haploides, aunque los cromosomas estén duplicados. Meiosis II separa hermanas. Cuatro productos haploides no equivalen a cuatro óvulos funcionales: hay reparto desigual y cuerpos polares.

La fecundación reúne gametos y restaura dos juegos. El cigoto es la primera célula del nuevo organismo. Las mitosis tempranas aumentan el número celular; no se afirma que cada división aumente inmediatamente el volumen embrionario. Los esquemas de gametos y cigoto no están a escala ni representan cromosomas condensados en una fase concreta. Los números humanos se distinguen del modelo 2n = 4. Los gemelos monocigóticos se mencionan como caso especial al hablar de diferencias entre hermanos.

Fuentes: [NHGRI, gametos](https://www.genome.gov/genetics-glossary/Gamete), [OpenStax, meiosis](https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis) y [OpenStax, fecundación y desarrollo temprano](https://openstax.org/books/biology-2e/pages/43-6-fertilization-and-early-embryonic-development). Texto, preguntas e ilustraciones propios.

## Archivos y dependencias

`index.html` y `estilos.css` contienen la presentación. `datos.mjs` contiene comparaciones, pasos, situaciones, piezas y preguntas. `modelo.mjs` gestiona la secuencia, reutiliza la mezcla de Mitosis y reexporta el modelo de puntuación común. `escena.mjs` genera SVG de reproducción y diversidad; `script.mjs` conecta los controles y el motor de repaso compartido, sin modificarlo.

Se reutilizan `../mitosis/escena.mjs` y `../meiosis/escena.mjs` para comparar estados, separaciones y resultados en preguntas. Si cambian estos dibujos, revisar aquí y regenerar los bloques estáticos con `generar-ilustraciones.mjs`. Este script de autoría también exporta `../../recursos/reproduccion.svg` para el menú y la portada. No es un paso de compilación para publicar: las ilustraciones están guardadas.

Identidad `../../recursos/biologia.css`; cuestionario `repaso.css`, `repaso.mjs`, `modelo-repaso.mjs`, compartidos por las cuatro actividades. Base, navegación, logotipo, pie, fuente y flotantes existentes sin cambios. Enlaces relativos a páginas con `index.html`. Sin dependencias nuevas, almacenamiento ni envío de respuestas.

Con JavaScript desactivado siguen visibles las ilustraciones, tabla, explicaciones y ciclo. Se ocultan controles y prácticas interactivas. Botones nativos, radios con leyenda, estados `aria-pressed`, avisos `role=status`, foco visible y preferencia de movimiento reducido. No hay reproducción automática.

## Verificación

Desde la raíz:

```
node Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis-meiosis-y-reproduccion/generar-ilustraciones.mjs
node --test Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis-meiosis-y-reproduccion/modelo.test.mjs
npm run catalogo
npm run validar
```

Las seis pruebas cubren secuencia/errores/deshacer/reinicio, banco y enlaces de repaso, puntuaciones 0/22 y 22/22, las vistas comparadas y conservación de los aportes en el esquema humano. Revisar navegador en 360/768/1024/1440 px, teclado/Escape, consola, imágenes y enlaces. Probar los tres estados de ambos exploradores, ambas prácticas y test con error/acierto/repetición. Comprobar el menú de cuatro entradas y Meiosis → actividad 04 → menú.

Comprobación del 14 de octubre de 2026: 25 pruebas aprobadas entre las cuatro actividades (seis propias); 197 enlaces y recursos locales verificados y todos los SVG válidos. Menú y actividad 04 sin desbordamiento ni imágenes rotas en 360, 768, 1024 y 1440 px. Exploradores, ocho situaciones, secuencia con error/deshacer/reinicio, teclado, menú/Escape y cuestionarios 0/22 y 22/22 comprobados en navegador; revisión de 22 errores o revisión oculta con todo correcto. Consola sin errores. Navegación menú → Meiosis → actividad 04 → menú correcta. Catálogo actualizado a 280 módulos públicos y 21 casilleros. La validación global mantiene los 10 errores previos de carpetas ausentes en Andrés (interés simple y compuesto) y Renata (determinantes 2×2), sin errores de Biología parte 2.
