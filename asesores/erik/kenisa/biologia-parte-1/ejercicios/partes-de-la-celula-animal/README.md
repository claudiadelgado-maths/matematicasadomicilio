# 01 — Partes de la célula animal · Tres ejercicios internos

Ejercicio exclusivo de Biología parte 1, KENISA → Erik. Entrada pública: `/asesores/erik/kenisa/biologia-parte-1/ejercicios/partes-de-la-celula-animal/`.

Los tres ejercicios internos y la guía de funciones #guia-celula conviven en este index.html. La actividad visual original está arriba; las nuevas actividades de funciones y razonamiento se encuentran debajo, en #actividad-2 y #actividad-3. No crear páginas duplicadas para esos accesos.

## Archivos y recursos

- `index.html`, `estilos.css`, `script.js` y `ejercicio.json` forman este módulo.
- `cuestionarios.css` conserva el recorrido local; `cuestionarios.mjs` configura los dos bancos de organelos. `banco-preguntas.mjs` contiene 55 pistas y 44 preguntas de razonamiento originales. `modelo-cuestionarios.mjs` genera rondas y calcula el puntaje; `modelo-cuestionarios.test.mjs` verifica su contrato.
- `../../recursos/celula-animal.svg` es el dibujo vectorial compartido con el inicio de esta sesión. Revisar ambos consumidores al cambiarlo.
- `../../recursos/biologia.css` contiene la identidad de esta familia. `../../recursos/cuestionarios.css`, `cuestionarios.mjs` y `modelo-repaso.mjs` comparten estilos, controlador y generación con biomoléculas; revisar ambas páginas si cambian. `modelo-cuestionarios.mjs` adapta ese modelo a las once estructuras para sus pruebas.
- Se conservan la base, navegación, marca, pie y controles flotantes globales con rutas relativas a seis niveles.

## Correspondencias y dibujo

La tabla `structures` de `script.js` vincula cada nombre con su casilla, indicador, descripción y punto exacto. El tablero mide 960 × 850; incluye el SVG de 680 × 820 desplazado a (270, 15). La tabla siguiente usa coordenadas del tablero. No cambiar el dibujo sin revisar estos puntos.

| Número | Respuesta | Punto x, y del tablero |
| --- | --- | --- |
| 1 | Membrana plasmática | 560, 50: borde turquesa |
| 2 | Citoplasma | 415, 165: medio azul claro |
| 3 | Núcleo | 590, 248: cuerpo rosado |
| 4 | Nucléolo | 690, 303: círculo amarillo dentro del núcleo |
| 5 | Retículo endoplasmático | 469, 365: membranas verdes plegadas |
| 6 | Ribosomas | 412, 438: grupo de puntos violetas |
| 7 | Aparato de Golgi | 700, 488: sacos anaranjados apilados |
| 8 | Mitocondria | 508, 563: cuerpo coral con crestas |
| 9 | Citoesqueleto | 401, 636: filamento dorado |
| 10 | Centriolo | 720, 697: cilindro azul estriado |
| 11 | Peroxisoma | 538, 751: esfera verde granular |

Las casillas siguen el orden vertical de las estructuras. Sus líneas no se cruzan; al señalar, enfocar o arrastrar sobre una casilla se resalta su recorrido y se muestra una descripción de la forma, sin revelar el nombre. Los puntos extremos son anillos para no tapar la estructura.

## Composición adaptable

- Más de 950 px: banco de palabras en una columna vertical a la izquierda, casillas en otra columna y célula a la derecha, unida mediante líneas.
- Hasta 950 px: ilustración ampliada arriba; debajo, banco vertical izquierdo y casillas numeradas a la derecha. Se conservan los indicadores y líneas cortas sobre las estructuras. El enlace «Ver célula» permite regresar al dibujo.
- Los nombres largos se ajustan dentro de las tarjetas. Se respeta la preferencia de movimiento reducido.

## Interacción

- El banco empieza mezclado y nunca en orden 1–11. Todas las tarjetas siguen disponibles; un pequeño número indica dónde se colocó cada una.
- Ratón: arrastrar del banco a una casilla o mover una respuesta ya colocada con HTML Drag and Drop nativo.
- Pantallas táctiles y lápiz: seleccionar y tocar una casilla, o arrastrar tarjetas y respuestas colocadas mediante Pointer Events. Se puede desplazar la página desde el resto de la superficie.
- Teclado: Tab, Enter/Espacio y Escape. Elegir una tarjeta por teclado lleva el foco a la primera casilla vacía; Tab recorre las siguientes. Escape cancela la selección y el resaltado.
- Cada tarjeta ocupa una sola casilla. Reemplazar una respuesta libera la anterior; tocar una respuesta sin selección la retira y selecciona su tarjeta.
- Cada colocación se evalúa inmediatamente: verde con ✓ si es correcta; rojo con × si es incorrecta. La tachita desaparece a los 1200 ms, mientras el rojo permanece hasta corregir o retirar la respuesta. El estado también aparece en el nombre accesible y en mensajes en vivo.
- Cada error tiene su propio temporizador, cancelado al mover, reemplazar, retirar o reiniciar la respuesta. Los aciertos de otras casillas no se borran.
- Puntaje y barra de progreso se actualizan en cada cambio. Comprobar resume el avance, avisa de las casillas vacías y vuelve a mostrar la tachita en los errores; las casillas vacías permanecen neutrales.
- Reiniciar limpia respuestas, selección, arrastres, temporizadores y puntaje; vuelve a mezclar el banco. No utiliza almacenamiento, red ni servicios externos.

## Navegación y ampliación

«Volver al inicio» apunta a `../../`. La actividad 1 continúa a #actividad-2; la 2 continúa a #actividad-3. El recorrido superior enlaza a los tres ejercicios internos. El menú de Biología tiene una sola tarjeta para esta actividad principal. Al finalizar la actividad 3, Continuar enlaza a `../biomoleculas/`. Los anclajes son accesibles por teclado y ninguna actividad exige terminar otra primero.

## Ejercicio interno 2 · ¿Qué estructura es?

55 descripciones originales (cinco por estructura) expresan funciones, situaciones y relaciones con palabras diferentes. Cada banco tiene el nombre correcto y tres distractores candidatos; la interfaz elige dos distractores para mostrar tres opciones. Se utilizan membrana plasmática, citoplasma, núcleo, nucléolo, retículo endoplasmático, ribosomas, aparato de Golgi, mitocondria, citoesqueleto, centriolo y peroxisoma.

## Ejercicio interno 3 · Piensa y responde

44 preguntas originales (cuatro por estructura) con un banco de alternativas explícitas, del que cada pregunta muestra tres opciones y una respuesta válida. Evalúan funciones, situaciones, consecuencias de fallas, comparación, razonamiento, excepciones, rutas y relación entre forma y función. La negación NO o INCORRECTA se destaca visualmente. Los distractores distinguen especialmente núcleo/nucléolo/ribosomas, retículo/Golgi, mitocondria/peroxisoma y centriolo/citoesqueleto/centrosoma.

## Rondas, retroalimentación y accesibilidad

- Cada cuestionario tiene su estado y banco independientes. Antes de empezar se eligen 11 preguntas (una por estructura) o 22 (dos distintas por estructura), sin repeticiones dentro de la ronda. Cada bloque de once incluye todas las estructuras, con orden mezclado y sin la misma estructura en dos preguntas consecutivas.
- Se agotan las variantes de cada estructura antes de reciclarlas. Las primeras rondas usan variantes nuevas mientras quede banco disponible para cada estructura. El banco y el orden de sus respuestas no se modifican al generar.
- Una pregunta visible a la vez. Las tres opciones se mezclan con Fisher–Yates y ninguna posición fija indica la correcta.
- Se registra una sola respuesta por pregunta. Tras contestar, las opciones quedan deshabilitadas; la correcta se marca verde/✅ y la selección errónea rojo/❌. La explicación y la respuesta correcta quedan disponibles hasta pulsar Siguiente, sin desaparición automática ni límite de tiempo.
- Siguiente permanece deshabilitado mientras no se haya respondido. La pregunta final lleva al puntaje de la ronda elegida, porcentaje y lista de estructuras que requieren repaso con una frase recordatoria. Esa lista se oculta cuando no hay errores.
- Otra ronda crea nuevas variantes de la longitud elegida y enfoca la primera pregunta. Cambiar de ronda vuelve al selector de longitud. No altera la otra actividad ni el tablero visual.
- Botones nativos permiten Tab, Enter y Espacio. La retroalimentación tiene aria-live; responder por teclado enfoca Siguiente, avanzar enfoca la nueva pregunta y terminar enfoca el resultado. El texto acompaña los colores y los símbolos.
- Tres opciones en una columna, con texto completo y áreas táctiles amplias. No se fijan alturas al texto. Se respeta movimiento reducido.
- Sin almacenamiento, envíos, servicios externos, temporizadores de examen ni dependencias de producción.

## Criterios científicos

El citoplasma incluye citosol y estructuras fuera del núcleo. El núcleo conserva la mayor parte del ADN, no absolutamente todo. El nucléolo prepara subunidades ribosómicas; los ribosomas ensamblan proteínas. El retículo rugoso procesa inicialmente muchas proteínas y el liso participa en síntesis de lípidos; el Golgi modifica y clasifica productos. La mitocondria convierte energía química en ATP. El centriolo es parte del centrosoma, no toda la red del citoesqueleto ni un requisito absoluto para dividirse. El peroxisoma maneja oxidaciones y peróxido.

Referencias consultadas para verificar estas distinciones: [células eucariotas](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells), [sistema de endomembranas](https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins) y [citoesqueleto](https://openstax.org/books/biology-2e/pages/4-5-the-cytoskeleton), OpenStax Biology 2e. No se copian sus ejercicios ni ilustraciones.

## Comprobaciones

Ejecutar desde la raíz `npm run catalogo` y `npm run validar`. Revisar Inicio → Actividad 1 → Inicio, once correspondencias y 11 / 11, arrastre real de ratón y táctil, selección por toque, movimiento y reemplazo, reintentos, comprobación vacía y reinicio con nueva mezcla. Verificar error inmediato, desaparición de la tachita sin borrar el rojo, corrección antes del vencimiento y reinicio durante una animación. Probar 360, 768, 1024 y 1440 px, nombres largos, teclado, menú móvil con Escape, consola, enlaces y ausencia de desplazamiento horizontal.

Ejecutar `node --test asesores/erik/kenisa/biologia-parte-1/ejercicios/partes-de-la-celula-animal/modelo-cuestionarios.test.mjs`. Verificar integridad de las 99 preguntas, 200 rondas por banco, cobertura, posiciones aleatorias, nuevas variantes, puntajes 0/22 y 22/22, bloqueo de respuesta repetida y estados independientes. En navegador, completar ambas rondas con errores y aciertos, ver y reiniciar resultados, probar teclado, toque, tamaño móvil, anclajes y movimiento reducido, y confirmar que la actividad visual conserva sus once correspondencias.

## Revisión del repaso de examen

Las 99 preguntas existentes ya cubrían todos los conceptos solicitados: membrana e intercambio selectivo, ADN nuclear, subunidades del nucléolo, ATP mitocondrial, citoplasma, síntesis de proteínas, procesamiento y distribución en Golgi y retículo, soporte/transporte del citoesqueleto y oxidación/detoxificación peroxisomal. No se añadieron preguntas duplicadas. Dos variantes de centriolo aclaran ahora el papel del centrosoma en la organización del huso mitótico. Cada pregunta muestra la correcta y dos distractores mezclados; el banco conserva distractores adicionales para variar los intentos.

## Apoyos para preparar el examen

- `STRUCTURES` conserva nombres, función breve, pista de memoria y distinción para las once estructuras. `cuestionarios.mjs` utiliza esos datos para una guía seleccionable, con Anterior/Siguiente y acceso desde la portada y el recorrido.
- `#guia-celula` incluye la ruta de una proteína de secreción y un glosario (ADN, ARN, ATP, enzima, vesícula, huso mitótico). El texto diferencia lisosoma/peroxisoma y aclara que el dibujo no incluye todos los componentes.
- `../../recursos/estudio.css` comparte la presentación de ayudas con biomoléculas y el inicio; revisar los tres consumidores.
- El resultado incluye «Entiende tus errores»: enunciado, respuesta elegida, correcta y explicación. «Practicar mis errores» crea un estado nuevo solo con preguntas falladas y mezcla sus opciones. El resultado inicial se mantiene visible y no se sustituye por el porcentaje del repaso. Si quedan errores, se puede repetir ese subconjunto.
- Los resultados perfectos ocultan las listas y acciones opcionales. El tablero original y el otro cuestionario permanecen independientes.
- La utilidad `[hidden]` de biologia.css prevalece sobre los estilos de botones, para evitar acciones vacías.
- Ejecutar también `node --test asesores/erik/kenisa/biologia-parte-1/recursos/modelo-repaso.test.mjs` y revisar la guía, las rondas de 11/22 y el repaso dirigido en navegador.

## Organización del menú (2026-10-03)

Esta página es la actividad principal 01. Los cuestionarios se presentan como ejercicios internos E2/E3; sus anclajes, bancos y comportamiento se conservan. La sesión tiene tres tarjetas: Célula animal, Biomoléculas y Niveles de organización biológica. La identidad biologia.css tiene ahora cuatro páginas consumidoras y el motor modelo-repaso.mjs tres módulos consumidores.
