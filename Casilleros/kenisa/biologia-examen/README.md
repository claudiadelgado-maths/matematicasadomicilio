# Biología examen · KENISA

Sesión `biologia-examen-kenisa-erik`, usuario `kenisa-erik`, fecha 2026-10-18. Entrada pública: `/Casilleros/kenisa/biologia-examen/index.html`.

## Contenido disponible

Tres exámenes completos, con avances independientes:

- **Examen general de opción múltiple:** reúne las quince actividades de Biología partes 1–4. Total: 690 preguntas (228 + 70 + 188 + 204). Incluye las 56 tarjetas de clasificación de biomoléculas como preguntas con opciones.
- **Examen del temario de la maestra:** 300 preguntas originales (246 de opción múltiple y 54 de verdadero o falso), once temas, 147 descriptores de cobertura y doce preguntas con esquemas. La cantidad por tema depende del contenido; Hooke y el corcho tienen un solo reactivo. `examenes/temario-maestra/README.md` documenta distribución y alcance.

- **Examen de práctica · 20 preguntas:** dos versiones de veinte preguntas cada una (10 de opciones y 10 V/F). La versión 1 conserva el material recibido y la 2 añade veinte preguntas basadas en el temario de la actividad 2, sin depender de dibujos. Se responde todo antes de entregar, con nota de 0–100, revisión final, explicaciones y guardado por versión. Conserva la clave esperada y explica sus ambigüedades; véase `examenes/practica-20/VERIFICACION.md`.

Modos en los dos primeros: todo aleatorio, por tema y una pregunta de cada tema (actividad en el primero). Dentro de cada examen, un historial común impide repetir preguntas contestadas entre modos y rondas hasta completar su banco. Hay calificación, explicaciones, consulta de errores y avance local persistente. El contrato original está en `examenes/opcion-multiple/README.md`.

El 19-10-2026 se incorporaron 100 preguntas al temario, con ideas «Para recordarlo» para aprender de la explicación tras confirmar y durante la revisión. Ambos exámenes muestran la respuesta correcta junto a la explicación. Las preguntas añadidas se suman al historial anterior sin reiniciarlo ni volver a ofrecer las ya respondidas.

## Recursos y dependencias

- `index.html`, `estilos.css`: menú con tres exámenes y enlaces a las cuatro guías previas.
- `sesion.json`: declara solamente `examenes`.
- `recursos/examen.css`: estilos exclusivos bajo `.bio-exam`, compartidos por la portada y los tres exámenes. Fuente local `../../recursos/fredoka.ttf` de KENISA.
- `recursos/examen.svg`: ilustración original usada en las cuatro cabeceras.
- `recursos/modelo.mjs` y `recursos/controlador.mjs`: motor y presentación compartidos; cada examen configura banco, agrupación, dibujos y clave de almacenamiento propia. El adaptador del primer examen conserva sus imports públicos y su clave anterior.
- `examenes/practica-20/`: motor independiente de entrega completa, preguntas fijas, selector extensible de versiones y almacenamiento propio. Sus estilos no cambian los otros exámenes.
- El examen general importa los bancos existentes y nueve dibujos sin modificar su contenido fuente ni sus motores. El segundo tiene reactivos y dibujos propios.
- Marca, navegación, pie, base y flotantes globales se conservan por rutas relativas. Sin dependencias nuevas ni servidor especial.

Al modificar recursos compartidos, revisar las cuatro páginas y los tres exámenes. Al cambiar un banco original, revisar el importador, cantidades de JSON/portada/documentación y pruebas del examen general. Al cambiar el temario, sincronizar cobertura, HTML, README, JSON y pruebas. El catálogo genera automáticamente la entrada del casillero.

## Verificación

`node --test Casilleros/kenisa/biologia-examen/examenes/opcion-multiple/modelo.test.mjs Casilleros/kenisa/biologia-examen/examenes/temario-maestra/banco.test.mjs`, `node --check Casilleros/kenisa/biologia-examen/recursos/controlador.mjs`, `npm run catalogo`, `npm run validar`.

Revisar menú → cada examen → menú → casillero, los tres modos, historial cruzado dentro de cada examen, independencia entre exámenes, recarga, resultados y teclado. Las tres páginas a 360/768/1024/1440 px, consola e imágenes sin errores, sin desbordamiento. Cada README detalla sus casos.

Verificado el 18-10-2026: 16 pruebas automáticas aprobadas entre ambos exámenes. En navegador se comprobaron tres modos, exclusión de un tema agotado, historial cruzado, guardado antes y después de responder, cierre parcial, resultados y revisión; formato V/F, ilustraciones y enlaces a cobertura. Tras corregir el guardado del controlador compartido, se verificó de nuevo el primer examen y la independencia entre ambos historiales. Menú y exámenes sin desbordamiento a 360/768/1024/1440 px; teclado, menú/Escape, imágenes y consola correctos. Acceso desde KENISA verificado. Catálogo: 299 módulos; validación: 336 HTML, 301 metadatos, cero avisos.

Verificado el 19-10-2026: 18 pruebas aprobadas entre ambos exámenes, incluida compatibilidad de rondas e historial del banco de 200 al de 300. En navegador se conservó el avance previo (27/300 al abrir), y el tema antes agotado ofreció solo sus cuatro preguntas añadidas. Se probaron error, acierto, VF, respuesta explícita, idea para recordar, revisión, recarga y los tres modos. Las tarjetas opcionales se ocultan al avanzar y cuando no hay contenido. Se corrigió la prioridad visual de los colores correcto/incorrecto sobre la selección. Menú y ambos exámenes sin desbordamiento a 360/768/1024/1440 px; imágenes y consola correctas, respuesta con teclado y guardado verificados. Catálogo y validación global correctos: 299 módulos, 336 HTML, 301 metadatos, cero avisos.

La actividad 03 conserva enunciados y opciones del material original (19 preguntas) y añade V/F 10. Las preguntas se pueden modificar hasta entregar; la revisión no altera el intento. Se explica que la calificación mide coincidencias con la clave del material, cuya ambigüedad se documentó. El selector ofrece las versiones 1 y 2 y recuerda la elegida. La segunda cubre los once temas del temario con reactivos nuevos y mantiene su avance independiente; nuevas versiones requieren contenido real. Su README contiene las pruebas específicas.

Verificado en navegador el 19-10-2026: versión 1 con 19/20 impide entregar; entrega completa con tres diferencias obtiene 85/100 y desglose 8/10 + 9/10. Versión 2 con dos errores obtiene 90/100 (9/10 + 9/10); un nuevo intento completo correcto obtiene 100/100 y mensaje sin errores. Revisar las veinte no modifica la nota. Borradores, elección de versión y resultados sobreviven a recargas; cambiar/reintentar una versión conserva la otra. Se comprobó actualización desde otra pestaña incluso cuando esa versión no estaba visible. No hay explicaciones en el DOM del borrador. Teclado, foco visible, menú móvil/Escape, mapa de pendientes y enlaces del menú correctos. Formulario, resultados y menú sin desbordamientos en 360/768/1024/1440 px; imágenes completas y consola sin errores. Las otras dos actividades cargan correctamente desde el menú. Se corrigió el desplazamiento a resultados y la referencia externa de usos de hongos.
