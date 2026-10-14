# 01 — ADN y cromosomas

Primera actividad de Biología parte 2, KENISA. Entrada: `/Casilleros/kenisa/biologia-parte-2/ejercicios/adn-y-cromosomas/index.html`. Identidades y ruta en `ejercicio.json`; conservarlas al ampliar la sesión.

## Contenido real

1. División celular: crecimiento, reparación, reemplazo y reproducción, sin fases de mitosis o meiosis.
2. Explorador con cuatro vistas: ADN, gen resaltado, cromatina con proteínas y cromosoma compacto sin duplicar. Relaciones y teoría consultable sin JavaScript.
3. Replicación reversible visualmente: 1 cromosoma con 1 molécula de ADN → 1 cromosoma con 2 moléculas y 2 cromátidas hermanas. Botón para volver a la vista anterior, no representa una reversión biológica.
4. Cromátidas hermanas y centrómero. **Práctica 1:** tres etiquetas A/B/C; errores con explicación y reintentos sin puntuación.
5. Homólogos y hermanas lado a lado. Homólogos materno/paterno sin duplicar con versiones A/a de un gen; hermanas en tonos violetas.
6. Selector diploide/haploide: modelo 2n = 6 / n = 3 con tres tamaños; cifras humanas 46 / 23 siempre visibles. Es una comparación de estados, no una animación de meiosis.
7. **Práctica 2:** seis escenas de identificación (cromatina, gen, homólogos, hermanas, diploide, haploide), con pistas, reintentos y reinicio independiente.
8. **Repaso final:** 14 preguntas, tres opciones mezcladas, elección modificable hasta confirmar, explicación inmediata, resultado en aciertos, revisión de cada error con enlace al concepto, repetir y volver al menú/teoría. Incluye división, ADN, gen, cromatina, compactación, hermanas, centrómero, homólogos, contraste, diploidía, haploidía, replicación, conteo y forma de X.

## Criterios pedagógicos

- El manual es una analogía explícita; un gen es parte del ADN, no un paso físico entre ADN y cromatina.
- Cromatina es ADN más proteínas, incluso al condensarse. Los cromosomas existen también cuando son menos compactos. No son materiales distintos.
- Compactación y replicación se muestran por separado. Los dibujos compactos de antes/después de copiar son esquemas de conteo; la replicación precede a la condensación intensa.
- La X representa un cromosoma duplicado y condensado. Cada mitad longitudinal completa es una cromátida; mientras permanecen unidas son un cromosoma.
- Homólogos: genes correspondientes, posibles versiones distintas y origen parental diferente. Hermanas: copias de un mismo cromosoma.
- Diploidía/haploidía cuentan juegos de cromosomas, no cromátidas ni origen de un color. Tras replicar ADN una célula diploide sigue siendo diploide.
- Se precisa replicación antes de mitosis o primera división meiótica, para no sugerir una segunda replicación antes de meiosis II. No se desarrollan las fases.
- Esquemas sin escala, tres tipos en el modelo, números humanos indicados por separado. A/a son versiones simbólicas de un gen, sin asignar rasgos humanos simplistas.

Fuentes de verificación: NHGRI [cromatina](https://www.genome.gov/genetics-glossary/Chromatin), [cromátida](https://www.genome.gov/genetics-glossary/Chromatid), [diploide](https://www.genome.gov/genetics-glossary/Diploid) y [haploide](https://www.genome.gov/genetics-glossary/Haploid). Texto, dibujos y preguntas propios.

## Archivos y accesibilidad

`index.html` conserva el contenido principal; `estilos.css` compone la actividad; `datos.mjs` guarda las cuatro vistas y los tres bancos; `script.mjs` conecta el explorador y las prácticas. `../../recursos/repaso.mjs`, `repaso.css` y `modelo-repaso.mjs` comparten el cuestionario y la puntuación con las actividades 02 (Mitosis) 03 (Meiosis) y 04 (Mitosis vs. meiosis y reproducción). `modelo.mjs` reexporta las funciones del modelo compartido para conservar su entrada existente. `modelo.test.mjs` verifica bancos, puntuaciones extremas, reintentos, entradas inválidas e independencia de intentos. El cierre enlaza a `../mitosis/index.html` y mantiene el regreso al menú.

Dependencias locales: `../../recursos/biologia.css`, `../../recursos/diagramas.svg`, los tres recursos compartidos de repaso, fuente Fredoka del casillero y recursos globales a cinco niveles. Revisar los cuatro cuestionarios al cambiar el motor, modelo o estilos compartidos; no modificar consumidores ajenos.

Botones nativos, estados `aria-pressed`, feedback `role=status`, grupos de radios con `fieldset` y `legend`, progreso accesible y foco en pregunta/resultado al avanzar. No se exige arrastrar. Estado solo en memoria, sin persistencia. Movimiento reducido desactiva transiciones y animaciones. El contenido estático permanece disponible sin JS; se informa de qué interacciones lo requieren.

## Pruebas

Ejecutar desde la raíz `node --test Casilleros/kenisa/biologia-parte-2/ejercicios/adn-y-cromosomas/modelo.test.mjs`, `npm run catalogo` y `npm run validar`.

En navegador: las cuatro vistas, replicar/regresar, ambos juegos, prácticas con error/acierto/reinicio; test sin selección, respuesta bloqueada tras confirmar, rondas 0/14 y 14/14, revisión y repetición sin puntaje anterior. Revisar móvil y escritorio (360/768/1024/1440), teclado (Tab, Enter, Espacio, radios con flechas), menú/Escape, foco, SVG, consola y enlaces. Las prácticas no alteran el test ni se bloquean entre sí.
