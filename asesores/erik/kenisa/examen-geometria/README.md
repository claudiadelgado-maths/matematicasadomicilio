# EXAMEN GEOMETRÍA

Sesión de KENISA / Erik, publicada con fecha editorial 2026-10-10. Ruta: /asesores/erik/kenisa/examen-geometria/. Contiene portada, material de estudio del autor y cuatro exámenes fijos, más una quinta actividad de práctica intensiva. No añade ni modifica preguntas de Extra mate.

## Contenido y fidelidad

- Examen A: 16 preguntas. Examen B: 16 preguntas. Examen C: 16 preguntas. Examen D: 32 preguntas. En total, 80 reactivos con cuatro opciones cada uno.
- Los enunciados, orden de opciones y claves proceden del LaTeX proporcionado por el usuario, conservado en recursos/fuente-original.tex. En A–D no hay generación aleatoria ni mezcla de opciones.
- Se eliminaron únicamente las copias exactas de A8 y A9 repetidas en el documento. Se conserva la numeración 1–16 de su tabla de respuestas.
- La notación simple de LaTeX se transpone a texto Unicode: grados °, pi π y unidades al cuadrado ². No necesita biblioteca matemática.
- El 2026-10-10 se informó al autor de incompatibilidades entre los datos de polígonos regulares en A15, B15, C15 y D24. Respondió expresamente **Conservar exactamente mi texto**. Se mantienen esos enunciados y sus claves, sin reinterpretarlos ni corregirlos silenciosamente. La evaluación utiliza su tabla de respuestas; las pruebas de fidelidad no certifican la consistencia geométrica de esos cuatro reactivos.

## Quinto examen: planteamiento de ecuaciones y despejes

Entrada: examenes/planteamiento-de-ecuaciones-y-despejes/index.html. Banco finito de 768 preguntas, 64 familias y 8 temas, con variantes numéricas y planteamientos diferentes. Una pregunta a la vez, cuatro opciones, feedback inmediato, procedimiento posterior y ninguna calificación final. Se intercalan familias y no se repite una pregunta respondida dentro de la ronda, incluso al cambiar de tema. Al agotarla se habilita otra ronda. Solo texto y fórmulas en las preguntas, sin dibujos.

El modelo y la interacción de esta quinta actividad son propios; no usan recursos/modelo.mjs ni recursos/examen.mjs de A–D. Comparte el CSS de la sesión. Leer su README y ANALISIS-SERIE-A.md: identifica las preguntas 3, 9, 10, 12, 14 y 15 y documenta el alcance. Las preguntas nuevas respetan geometría válida; las áreas regulares aproximadas se declaran explícitamente.

## Material de estudio

Archivo existente del usuario: ../MaterialEamenGeometria.pdf, de 252 627 bytes. Se conserva su nombre físico original (con la errata Eamen), su ubicación en el casillero y todos sus bytes. Los enlaces de descarga de portada y exámenes utilizan download=MaterialExamenGeometria.pdf para ofrecer el nombre solicitado. No se crea, recompila ni sustituye el PDF del autor. Si se renombra el archivo físico, actualizar todos los enlaces y materialEstudio en sesion.json.

## Funcionamiento

La portada enlaza a las versiones A–D y a la práctica de ecuaciones y despejes. Cada versión tiene todas sus preguntas en una página y cuatro radios agrupados por pregunta. Puede cambiarse cualquier respuesta hasta entregar. El mapa de preguntas y la barra muestran únicamente progreso; no hay corrección anticipada ni reloj.

Entregar examen califica una sola vez, fija las respuestas y muestra una nota entera de 0–100: redondear(100 × aciertos / total). Todas las preguntas pesan lo mismo. Las omitidas cuentan como incorrectas en la nota y se desglosan como Sin responder. Esto se avisa junto al botón, sin añadir una confirmación intermedia.

El resultado muestra aciertos, errores, omisiones y enlaces a las preguntas que deben revisarse. Los estados incluyen texto y símbolos: verde/✓ para aciertos y rosa/× para errores, sin rojo. Las opciones correctas no elegidas no se revelan hasta pulsar Ver respuestas. Ese botón muestra la clave de cada pregunta y enfoca la primera que hay que revisar; permite ocultarlas de nuevo. Intentarlo de nuevo reinicia la misma versión, limpia selecciones, nota y soluciones, reactiva los radios y enfoca la primera pregunta.

No hay registro de identidad ni envío de respuestas. Estado solo en memoria; recargar o salir reinicia el intento. Cada página explica este alcance. El código y las claves son archivos estáticos públicos, como el resto del sitio; la interfaz no es un sistema de supervisión de exámenes.

## Archivos y consumidores

- index.html y estilos.css: portada y estilos de toda esta familia local.
- sesion.json: sesión examen-geometria-kenisa-erik, usuario kenisa-erik y componente examenes disponible.
- examenes/examen-a/, examen-b/, examen-c/, examen-d/: entradas propias, estilos.css que importa el de la sesión, README y examen.json. Los reactivos también están presentes en el HTML para lectura sin JavaScript; en ese caso se informa que es necesario activarlo para responder.
- recursos/examenes.mjs: banco de preguntas y claves del autor.
- recursos/modelo.mjs: selección, entrega, calificación y consulta de claves, sin DOM.
- recursos/examen.mjs: interfaz común a las cuatro versiones, progreso, revisión, foco y reintento.
- recursos/modelo.test.mjs: integridad del banco y pruebas de estado/calificación.
- recursos/contenido.test.mjs: comprobación independiente de las 48 respuestas de cálculo del autor.
- recursos/REVISION.md: revisión matemática y funcional de los cinco exámenes.

No hay dependencias nuevas. Solo se usan los recursos globales de identidad, base.css y navegacion.js. No se importan archivos de Extra mate u otras sesiones. Al modificar el CSS local revisar portada, las cuatro versiones y la práctica intensiva; al modificar la interacción o el banco revisar los cuatro exámenes. Sin componentes opcionales vacíos.

## Verificación

Desde la raíz: node --test asesores/erik/kenisa/examen-geometria/recursos/*.test.mjs, npm run catalogo y npm run validar.

Ejecutar también examenes/planteamiento-de-ecuaciones-y-despejes/banco.test.mjs con node --test.

Comprobar 360, 768, 1024 y 1440 px, las cuatro versiones, radios con teclado/tacto, cambio de respuesta sin corrección previa, entrega completa y con omisiones, bloqueo posterior, nota 0/100 y 100/100, respuestas ocultas hasta pedirlas, reintento sin restos y mapa de preguntas. Revisar foco, menú/Escape, consola, enlaces, PDF descargado y entrada desde el casillero. Mantener rutas relativas con directorio e index.html.
