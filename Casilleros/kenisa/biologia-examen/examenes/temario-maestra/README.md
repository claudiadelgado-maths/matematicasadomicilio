# Examen 02 · Temario de la maestra

Sesión `biologia-examen-kenisa-erik`, usuario `kenisa-erik`, examen `biologia-examen-temario-maestra-kenisa-erik`. URL física: `/Casilleros/kenisa/biologia-examen/examenes/temario-maestra/index.html`.

## Alcance y contenido

300 preguntas originales de práctica de Biología 1, basadas en todos los contenidos de la transcripción proporcionada. No se presentan como reactivos oficiales ni como predicciones del examen real. Se mantiene el primer examen y sus 690 preguntas en su ruta original.

| Tema | Preguntas |
|---|---:|
| Seres vivos | 14 |
| Crecimiento y desarrollo | 12 |
| Adaptaciones | 28 |
| Reproducción de los organismos | 12 |
| Irritabilidad y estímulos | 10 |
| La célula y sus tipos | 26 |
| Organelos: estructura y función | 40 |
| Biomoléculas | 54 |
| Metabolismo y energía | 28 |
| Mitosis y meiosis | 34 |
| Hongos y su reproducción | 42 |

246 preguntas con cuatro opciones y 54 de verdadero/falso, todas con clave única y explicación. Doce preguntas incluyen esquemas propios de células animales y vegetales, división celular y hongos, para identificar estructuras, relacionar funciones y razonar sobre situaciones. Dibujos SVG accesibles sin IDs internos duplicables.

Ampliación del 19-10-2026: 100 preguntas nuevas (80 con cuatro opciones y 20 VF), centradas en casos, comparaciones, errores habituales y aplicación. Cada una añade una idea breve «Para recordarlo» (`takeaway`) que se muestra solo después de confirmar y también en la revisión. La respuesta correcta queda explícita junto a la explicación, incluso si se falla. Se conservan las 200 preguntas previas, sus IDs, claves de respuesta y la misma clave de almacenamiento.

Se evalúan definiciones, ejemplos, funciones, comparaciones y aplicación. Los bloques amplios reciben más reactivos. Hooke, observación del corcho y origen del término célula se evalúan en una sola pregunta. No se incorpora el temario adicional de transporte, fermentación o taxonomía del examen general como bloques ajenos al temario recibido.

Matices: adaptación evolutiva no intencional; hibernación y estivación según condición ambiental; plantas también tienen mitocondrias; no todas sus células tienen cloroplastos; Golgi no sintetiza las cadenas proteicas; catabolismo se describe por su balance global; mitosis y citocinesis se distinguen; cuatro productos meióticos no implican cuatro óvulos funcionales; hay esporas sexuales y asexuales; la bipartición no es típica del conjunto de los hongos, aunque algunas levaduras la realizan.

## Cobertura y mantenimiento

- `TEMARIO.md`: transcripción del temario proporcionado, conservada como referencia principal.
- `cobertura.mjs`: once temas y 147 descriptores explícitos, con cantidad prevista por tema. Las líneas genéricas de la transcripción se asignan al bloque contiguo correspondiente.
- `COBERTURA.md`: matriz de descriptores y IDs que los evalúan, para revisión editorial.
- `vida.mjs`, `celulas.mjs`, `moleculas.mjs`, `division-hongos.mjs`: enunciados y explicaciones originales. `reactivos.mjs` define formatos MC/VF, sin lógica de examen.
- `ampliacion-vida.mjs`, `ampliacion-celulas.mjs`, `ampliacion-moleculas.mjs`, `ampliacion-division-hongos.mjs`: 100 preguntas adicionales con idea para recordar. Se incorporan a los once temas existentes, sin crear un modo ni filtros nuevos.
- `banco.mjs`: normalización, prefijos de ID, agrupación y clave de almacenamiento. Los IDs son semánticos; no dependen del orden.
- `figuras.mjs`: SVG de cinco tipos, sin librerías, imágenes externas ni Canvas.
- `index.html`: interfaz y temario consultable aun sin JavaScript. Mantener sincronizados las cantidades, listas de cobertura, JSON y documentación.

Las fuentes de consulta para matices se enlazan en la página: [OpenStax, hongos](https://openstax.org/books/biology-2e/pages/24-1-characteristics-of-fungi), [OpenStax, células eucariotas](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells) y [NPS, hibernación](https://www.nps.gov/articles/the-science-of-hibernation.htm). Las preguntas se redactaron para el temario proporcionado, sin copiar reactivos de esas fuentes.

## Los mismos tres modos

1. **Todo aleatorio:** mezcla todas las preguntas pendientes. No se igualan artificialmente los tamaños de los temas; los bancos mayores aportan más preguntas al recorrido completo.
2. **Por tema:** elegir uno de los once temas y recorrer sus preguntas pendientes.
3. **1 de cada tema:** una pregunta nueva por tema no agotado. Primera ronda de once. Los temas pequeños descansan al agotarse; se continúa con los restantes hasta completar las 300 (54 rondas si solo se usa este modo).

Los dos primeros conservan 10, 20, 40 o todas las disponibles por ronda. El tercero fija la cantidad según los temas que quedan. Los tres usan el mismo banco completo, sin filtros que oculten preguntas de verdadero/falso. No se pretende que cada ronda de una por tema tenga proporciones desiguales: se conserva exactamente la dinámica solicitada y se cubre la distribución completa al finalizar la vuelta.

Confirmar una respuesta la consume, sea correcta o incorrecta. No se puede saltar sin responder ni comenzar una nueva vuelta hasta contestar las 300. Se permite cerrar una ronda tras confirmar; las aún no mostradas quedan disponibles. La revisión muestra respuestas y explicaciones como consulta, no como nuevos intentos. Calificación de ronda 0–100, aciertos/total y desglose por los temas contestados. Se conservan pregunta, orden de opciones, respuesta confirmada y resultados al recargar.

## Dependencias y privacidad

Se usa `../../recursos/modelo.mjs`, `../../recursos/controlador.mjs`, `../../recursos/examen.css` y `../../recursos/examen.svg`. `script.mjs` configura etiquetas, dibujos y banco. La hoja local añade únicamente el tono de este examen y la cuadrícula de cobertura. Base, marca, navegación y flotantes globales conservan rutas relativas.

Clave local: `kenisa-biologia-examen-temario-v1`, independiente de `kenisa-biologia-examen-v1` del primero. Historial común entre modos de este examen; nunca consume preguntas del otro. Sin datos personales, red de respuestas, cuentas ni dependencias nuevas. Persistencia por navegador y origen; se avisa si está bloqueada. Limpiar los datos del navegador elimina el avance. Cambios entre pestañas del mismo examen se reciben mediante `storage`.

## Verificación

`node --test Casilleros/kenisa/biologia-examen/examenes/temario-maestra/banco.test.mjs` comprueba diez casos: integridad/formato/distribución; cobertura completa; dibujos; agotamiento aleatorio, por tema y una por tema; historial cruzado/cierre/persistencia/VF; independencia con el primer examen; 100 ideas para recordar; compatibilidad del avance guardado con el banco anterior de 200. Si ya se habían respondido esas 200, quedan exactamente las 100 nuevas pendientes antes de otra vuelta. Ejecutar también las ocho pruebas del examen general después de modificar recursos compartidos.

Revisar los tres modos en navegador, validación sin selección, opción múltiple y VF, explicación, revisión, cierre parcial, recarga, tema agotado, enlaces de cobertura, menú, teclado, móvil/escritorio y consola. Terminar con `npm run catalogo` y `npm run validar`.

Verificado el 18-10-2026: 16 pruebas automáticas aprobadas entre ambos exámenes. En navegador se comprobaron tres modos, exclusión de un tema agotado, historial cruzado, guardado antes y después de responder, cierre parcial, resultados y revisión; formato V/F, ilustraciones y enlaces a cobertura. Tras corregir el guardado del controlador compartido, se verificó de nuevo el primer examen y la independencia entre ambos historiales. Menú y exámenes sin desbordamiento a 360/768/1024/1440 px; teclado, menú/Escape, imágenes y consola correctos. Acceso desde KENISA verificado. Catálogo: 299 módulos; validación: 336 HTML, 301 metadatos, cero avisos.

Verificado el 19-10-2026: 18 pruebas aprobadas entre ambos exámenes, incluida compatibilidad de rondas e historial del banco de 200 al de 300. En navegador se conservó el avance previo (27/300 al abrir), y el tema antes agotado ofreció solo sus cuatro preguntas añadidas. Se probaron error, acierto, VF, respuesta explícita, idea para recordar, revisión, recarga y los tres modos. Las tarjetas opcionales se ocultan al avanzar y cuando no hay contenido. Se corrigió la prioridad visual de los colores correcto/incorrecto sobre la selección. Menú y ambos exámenes sin desbordamiento a 360/768/1024/1440 px; imágenes y consola correctas, respuesta con teclado y guardado verificados. Catálogo y validación global correctos: 299 módulos, 336 HTML, 301 metadatos, cero avisos.
